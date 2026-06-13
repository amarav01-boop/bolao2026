# Story 5.2: Ranking Movement and Status Chips

Status: review

## Story

As a participant,
I want to see ranking movement and playful status labels,
so that I can understand who moved up, fell, or made a strong run after the latest ranking update.

## Acceptance Criteria

1. Given the `participants` table does not yet store ranking positions, when the migration is executed, then nullable unsigned integer columns `current_position` and `last_position` are added without changing existing participant identities, authentication, points, or predictions.

2. Given ranking recalculation is executed for the first time for a participant, when no `current_position` exists, then both `current_position` and `last_position` are initialized with the newly calculated dense rank, so that no artificial rise or fall is shown.

3. Given the bolão already has points and an active ranking when this story is deployed, when the first post-deployment ranking recalculation runs, then the system preserves the ranking produced by the existing accumulated points as the initial baseline, initializes both position fields with that same rank, and does not report any participant as having risen or fallen.

4. Given a participant already has a stored current position, when ranking recalculation completes, then the previous `current_position` is copied to `last_position` before the newly calculated dense rank is saved to `current_position`.

5. Given all participant positions are being updated, when ranking recalculation persists the new ranking, then all position updates occur in one database transaction, and a failure rolls back the complete position update.

6. Given two or more participants have equal accumulated points, when their positions are persisted, then all tied participants receive the same dense rank and the next rank does not skip a number.

7. Given `current_position` and `last_position` exist, when ranking data is returned, then each participant includes `currentPosition`, `lastPosition`, `rankDelta`, `movement`, and `statusChip`.

8. Given `last_position - current_position` is positive, when the movement is classified, then movement is `up`; given the result is negative, movement is `down`; given it is zero, movement is `steady`; and given either position is unavailable, movement is `unknown`.

9. Given valid previous and current positions exist, when the status label is derived, then the following deterministic Portuguese-BR labels are used:
   - improved by 1 or 2 positions: `Em alta`;
   - improved by 3 or 4 positions: `Arrancada`;
   - improved by 5 or more positions: `Disparou`;
   - fell by 1 or 2 positions: `Em queda`;
   - fell by 3 or more positions: `Queda forte`;
   - unchanged position: `Estável`.

10. Given ranking has not meaningfully started and all participants have zero points, when ranking is displayed, then the status remains `Aguardando início da copa` rather than implying movement.

11. Given the migration was deployed but the initial production baseline has not yet been persisted, when Ranking or Home is requested, then the current ranking and points remain visible, movement is `unknown`, and the UI shows the neutral label `Histórico iniciando` instead of inventing movement.

12. Given a participant opens the full Ranking page, when ranking rows render, then position movement is shown with an accessible up, down, steady, or unavailable indicator alongside the Portuguese-BR status chip.

13. Given a participant opens Home, when the ranking snapshot renders, then their persisted movement and status use the same backend-derived values as the full Ranking page.

14. Given the admin executes ranking recalculation repeatedly without any points or position change, when the second recalculation finishes, then `current_position` and `last_position` are equal and all participants show `steady`/`Estável`.

## Tasks / Subtasks

- [x] Add participant ranking position persistence (AC: 1-6)
  - [x] Create migration `015_add_ranking_positions_to_participants.sql`.
  - [x] Add nullable `INT UNSIGNED` columns `current_position` and `last_position`.
  - [x] Extend participant row mapping and participant selects with `currentPosition` and `lastPosition`.
  - [x] Add a repository operation that persists the complete dense ranking in one transaction.
  - [x] On first initialization, save the calculated rank into both fields.
  - [x] On later recalculations, copy the old current position to last position before saving the new current position.

- [x] Integrate position persistence into ranking recalculation (AC: 2-6, 14)
  - [x] Keep match point recalculation in `prediction-service.js`.
  - [x] After points are recalculated, calculate the complete dense ranking once.
  - [x] Persist positions before returning success from `POST /api/admin/ranking/recalculate`.
  - [x] Return the number of recalculated matches and updated participant positions.
  - [x] Do not mutate ranking positions during ordinary `GET /api/ranking` or `GET /api/home` requests.

- [x] Derive movement and status in the backend (AC: 7-11)
  - [x] Replace the hardcoded `movement: 'steady'` and points-based `Em alta` label.
  - [x] Implement a pure helper for `rankDelta`, movement, and status classification.
  - [x] Keep the backend as the single source of truth for movement labels.
  - [x] Preserve `Aguardando início da copa` while every participant remains on zero points.

- [x] Render movement consistently (AC: 11-13)
  - [x] Add a movement column or compact movement indicator to the full Ranking table.
  - [x] Use existing project icon conventions for up/down/steady indicators and include readable text or an accessible label.
  - [x] Show the same movement/status in the Home ranking snapshot without recalculating it in the browser.
  - [x] Preserve the current-participant row highlight and mobile readability.

- [x] Add regression and domain tests (AC: 2-14)
  - [x] Test first recalculation initialization.
  - [x] Test bootstrap with an existing non-zero production ranking.
  - [x] Test the neutral state before the baseline recalculation is executed.
  - [x] Test upward movement thresholds: 1, 2, 3, 4, and 5 positions.
  - [x] Test downward movement thresholds: 1, 2, and 3 positions.
  - [x] Test steady and unknown states.
  - [x] Test dense-rank ties and movement into/out of ties.
  - [x] Test that a failed transactional update rolls back all participant positions.
  - [x] Test repeated recalculation without ranking changes.
  - [x] Test that Ranking and Home receive identical movement/status values.

## Dev Notes

### Required Update Sequence

The admin recalculation is the historical boundary. Use this order:

1. Recalculate `points_awarded` for every completed match using the existing prediction scoring flow.
2. Load all public participants, predictions, and group classification bonuses.
3. Calculate the complete dense ranking once.
4. Start a MariaDB transaction.
5. For each non-admin participant:
   - if `current_position IS NULL`, set both position fields to the calculated rank;
   - otherwise set `last_position = current_position` and `current_position = calculated rank`.
6. Commit only after every participant position is updated.
7. Return the recalculation result.

Ordinary Ranking and Home reads must never advance position history. Refreshing a page must not turn a participant from `up` or `down` into `steady`.

### Existing Production Ranking Bootstrap

This story is being introduced after the bolão and its ranking have already started. Deployment must therefore use the current accumulated ranking as a neutral baseline:

1. Back up the production database.
2. Deploy and execute the migration. Existing points and prediction rows remain unchanged; both new position fields initially remain `NULL`.
3. Until the bootstrap recalculation is run, Ranking and Home continue calculating and displaying the current rank from accumulated points, but movement is `unknown` and the status is `Histórico iniciando`.
4. Admin executes `Recalcular ranking` once after deployment.
5. That first recalculation initializes `last_position` and `current_position` with the same current dense rank.
6. Participants therefore keep exactly the rank and points they had before deployment and see no fabricated movement.
7. Starting with the next real ranking recalculation, the system can truthfully show who rose, fell, remained stable, or made a strong run.

The system cannot infer movement that occurred before these fields existed. It must never attempt to reconstruct that history from timestamps, nickname order, or current points.

### Movement Contract

Use this backend contract for both Ranking and Home:

```js
{
  rank: 3,
  currentPosition: 3,
  lastPosition: 6,
  rankDelta: 3,
  movement: 'up',
  statusChip: 'Arrancada'
}
```

`rankDelta` is `lastPosition - currentPosition`. A positive value means the participant moved toward position 1.

Do not derive labels from `points > 0`. The current implementation does this and therefore marks every participant with points as `Em alta`, even when they fell.

### Current State and Files to Update

- `server/services/ranking-service.js`
  - Currently calculates dense ranking from prediction and group-classification points.
  - Currently hardcodes `movement: 'steady'`.
  - Currently uses `points > 0` to assign `Em alta`.
  - Preserve point aggregation, group classification bonuses, nickname fallback ordering, and dense-tie behavior.

- `server/services/prediction-service.js`
  - `recalculateRankingPoints()` currently refreshes points for completed matches and returns only `recalculatedMatches`.
  - Preserve the existing scoring rules and default-prediction behavior.

- `server/services/admin-service.js`
  - `recalculateRanking()` currently delegates only to `predictionService.recalculateRankingPoints()`.
  - Extend this orchestration rather than putting SQL or ranking rules in the route.

- `server/repositories/participant-repository.js`
  - Add both position columns to row mapping and all participant SELECT projections.
  - Add transactional position persistence here; SQL must remain parameterized.
  - Do not expose password hashes in ranking API responses.

- `server/routes/admin-routes.js`
  - Keep `POST /api/admin/ranking/recalculate` admin-protected.
  - Route remains a thin HTTP adapter.

- `client/src/pages/ranking-page.js`
  - Currently renders position, participant, points, and status.
  - Add movement while preserving the highlighted current participant and responsive table wrapper.

- `client/src/pages/home-page.js`
  - Reuse movement/status returned in `rankingSnapshot.currentParticipant`.
  - Do not introduce client-side movement thresholds.

- `client/src/components/ranking-row.js`
  - Reuse or align this component with the page implementation; do not maintain conflicting ranking row formats.

- `server/tests/ranking-service.test.js`
  - Preserve existing dense-ranking and scoring tests.
  - Add focused pure-helper tests and recalculation persistence tests.

### Architecture Compliance

- MariaDB remains the ranking position source of truth.
- Database names use `snake_case`; JavaScript/API fields use `camelCase`.
- Routes handle HTTP, services own ranking rules, and repositories own SQL.
- Use `mysql2/promise` and parameterized statements.
- Do not add an ORM, ranking snapshot table, background worker, or browser storage.
- Do not update admin participant position fields.
- The two participant columns intentionally retain only the current and immediately previous ranking state; historical ranking analytics are out of scope.

### UX Requirements

- All visible copy and labels must be Portuguese-BR with correct UTF-8 accents.
- Use familiar directional icons rather than text-only decorative buttons.
- Do not depend on color alone: arrows/icons and accessible text must communicate movement.
- Keep table columns stable so status and movement do not shift the participant identity or points columns.
- On narrow mobile screens, use compact labels/icons or a responsive row layout without cutting nicknames or cities.

### Testing Requirements

- Use Node's built-in test runner, matching existing server tests.
- Pure movement classification must be deterministic and independently testable.
- Repository transaction behavior should be tested with a controlled/fake connection or the established database test pattern.
- Run the full server test suite and client production build.
- Verify `git diff --check`.

### Project Structure Notes

- New migration: `server/db/migrations/015_add_ranking_positions_to_participants.sql`.
- Expected updates:
  - `server/repositories/participant-repository.js`
  - `server/services/ranking-service.js`
  - `server/services/prediction-service.js`
  - `server/services/admin-service.js`
  - `client/src/pages/ranking-page.js`
  - `client/src/pages/home-page.js`
  - `client/src/components/ranking-row.js`
  - `client/src/styles/ranking.css`
  - `server/tests/ranking-service.test.js`
- Add a separate repository/service test file only if it keeps transactional tests clearer.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 5.2: Ranking Movement and Status Chips]
- [Source: _bmad-output/planning-artifacts/prds/prd-bolao2026-2026-05-23/prd.md#FR-16: Full ranking]
- [Source: _bmad-output/planning-artifacts/prds/prd-bolao2026-2026-05-23/prd.md#FR-17: Ranking status chips]
- [Source: _bmad-output/planning-artifacts/architecture.md#Data Architecture]
- [Source: _bmad-output/planning-artifacts/architecture.md#Epic 5: Ranking, Home, and Match-Day Engagement]
- [Source: server/services/ranking-service.js]
- [Source: server/repositories/participant-repository.js]
- [Source: server/services/prediction-service.js]
- [Source: client/src/pages/ranking-page.js]
- [Source: server/tests/ranking-service.test.js]

## Previous Story Intelligence

- Story 5.1 established `/api/ranking`, backend dense ranking, current-participant highlighting, and the responsive full-ranking table.
- Story 5.4 established that Home consumes the same ranking service through `rankingSnapshot`; this story must keep one backend movement contract for both screens.
- Existing participants can all start with rank 1 while everyone has zero points. This initial tie must not be reported as competitive movement.

## Git Intelligence Summary

- Recent work keeps feature logic separated across service, repository, API, page, and CSS modules.
- The current branch is `dev`.
- Existing unrelated untracked database backup files must not be included in this story.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Implementation Plan

- Add nullable current/last position fields and persist the complete ranking transactionally.
- Derive all movement metadata in the ranking service and reuse it in Ranking and Home.
- Bootstrap the existing local ranking as a neutral baseline after applying the migration.
- Validate with focused TDD tests, the complete server suite, client production build, and database verification.

### Debug Log References

- RED: movement and transactional repository tests failed before implementation because the required functions did not exist.
- GREEN: focused domain, repository, and rendering tests passed after implementation.
- Regression: `npm test --workspace server` passed 41 tests.
- Build: `npm run build:client` completed successfully.
- Migration: `015_add_ranking_positions_to_participants.sql` applied locally.
- Baseline: 9 local participants initialized with equal current/last positions without changing their displayed points.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Added persisted current and previous dense-rank positions to participants.
- Admin ranking recalculation now advances ranking history only after match points are refreshed.
- Ranking reads remain side-effect free and expose movement, delta, and Portuguese-BR status labels.
- Full Ranking and Home now share accessible movement indicators and status styling.
- Existing local ranking was preserved as the initial neutral baseline.
- Fixed result-entry integration so saving or correcting a completed match automatically advances the ranking snapshot.
- Manual no-op recalculation now preserves the latest movement instead of replacing it with `Estável`.

### File List

- _bmad-output/implementation-artifacts/5-2-ranking-movement-and-status-chips.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- client/src/components/ranking-row.js
- client/src/pages/home-page.js
- client/src/pages/ranking-page.js
- client/src/styles/ranking.css
- server/db/migrations/015_add_ranking_positions_to_participants.sql
- server/repositories/participant-repository.js
- server/services/admin-service.js
- server/services/participant-service.js
- server/services/ranking-service.js
- server/tests/participant-ranking-position-repository.test.js
- server/tests/ranking-movement-render.test.js
- server/tests/admin-service.test.js
- server/tests/ranking-service.test.js

## Change Log

- 2026-06-13: Implemented persisted ranking movement, neutral production bootstrap, Portuguese-BR status chips, shared Ranking/Home indicators, and regression coverage.
- 2026-06-13: Fixed automatic snapshot creation after result updates and preserved movement across no-op manual recalculations.
