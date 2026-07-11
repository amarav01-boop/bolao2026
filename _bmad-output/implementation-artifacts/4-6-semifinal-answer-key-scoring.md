# Story 4.6: Semifinal Answer Key Scoring

Status: review

## Story

As the admin,
I want to enter the official semifinal answer key in the admin panel,
so that the system can score each participant's semifinal selections and update their points automatically.

## Acceptance Criteria

1. Given the admin is authenticated, when they open the admin gabarito section, then they can enter the four official semifinalist teams and save them as the semifinal answer key.
2. Given the admin saves a valid answer key, when the page reloads, then the stored semifinal answer key is displayed back in the form.
3. Given participants have saved semifinal selections, when the admin saves or updates the answer key, then the system recalculates each participant's semifinal points server-side and persists the total on the extra prediction row.
4. Given a participant's four semifinal selections match the answer key, when scoring runs, then the participant receives 1 point per correctly matched team, up to 4 points total.
5. Given the same four teams are selected in a different order, when scoring runs, then the result is unchanged because the comparison is order-insensitive.
6. Given the admin submits missing, duplicate, or invalid team codes, when the form is saved, then validation rejects the request and no partial answer key is written.
7. Given the answer key changes after participants have already been scored, when the recalculation completes, then stale semifinal points are overwritten and ranking is recalculated from the updated bonus totals.
8. Given the admin uses mobile, when the gabarito form renders, then it remains readable and usable without horizontal overflow.

## Tasks / Subtasks

- [x] Add backend storage and validation for the semifinal answer key (AC: 1, 2, 6)
  - [x] Add a small admin-owned persistence model for the semifinal answer key; do not overload participant prediction rows.
  - [x] Add Zod validation for four unique team codes/names and preserve the existing team-option source from match setup.
  - [x] Expose read/write admin endpoints for the gabarito.
- [x] Add scoring and recalculation flow (AC: 3, 4, 5, 7)
  - [x] Implement a service that compares the participant semifinal selections as an unordered set against the stored answer key.
  - [x] Persist the semifinal points on `competition_extra_predictions.points_awarded`.
  - [x] Reuse the existing ranking recalculation path so bonus points flow into ranking without duplicating ranking logic.
- [x] Extend the admin UI (AC: 1, 2, 6, 8)
  - [x] Add the semifinal gabarito form to the existing admin gabarito section in `client/src/pages/admin-page.js`.
  - [x] Use team comboboxes sourced from the same team list used by prediction entry and show inline save/error state.
  - [x] Keep the layout mobile-friendly and avoid a second admin page for the same operation.
- [x] Add verification coverage (AC: 1-8)
  - [x] Test valid save, duplicate/invalid selection rejection, answer-key reload, and point overwrite on correction.
  - [x] Verify ranking recalculation reflects the new semifinal bonus totals.
  - [x] Smoke test the admin form on the existing mobile layout.

## Dev Notes

### Source Context

- Epic 4 already covers admin results, scoring, ranking recalculation, and correction handling. This story extends that scoring path to semifinal extras instead of creating a separate admin flow. [Source: `_bmad-output/planning-artifacts/epics.md#Epic 4: Admin Results, Scoring, Corrections, and Disputes`]
- The PRD confirms extras are part of the MVP and explicitly says extras scoring rules must be configurable or documented before launch. [Source: `_bmad-output/planning-artifacts/prds/prd-bolao2026-2026-05-23/prd.md#FR-10: Extra predictions`]
- The PRD addendum and the existing extras story show that semifinalist selections already exist in the model and are saved with the participant extras. [Source: `_bmad-output/planning-artifacts/prds/prd-bolao2026-2026-05-23/addendum.md`, `_bmad-output/implementation-artifacts/3-6-extra-predictions-entry.md`]
- The current admin dashboard already has a `#admin-gabarito` section and team-select helpers in `client/src/pages/admin-page.js`, so the new form should extend that surface rather than introduce a second admin page. [Source: `client/src/pages/admin-page.js`]

### Previous Story Intelligence

- `competition_extra_predictions` already stores `semi_finalist_1..4` plus `points_awarded`, so the implementation should persist and score the official answer key against existing extra-prediction rows instead of adding a parallel participant model. [Source: `server/repositories/prediction-repository.js`, `server/db/migrations/012_add_match_count_and_semifinalists.sql`]
- `server/services/ranking-service.js` already sums `bonus.pointsAwarded` into participant totals, so once semifinal bonus points are written, ranking should pick them up through the existing recalculation path.
- `server/services/prediction-service.js` already normalizes and saves semifinal selections for participants; do not duplicate that participant-entry flow in the admin story.
- `server/services/reveal-service.js` already reveals semifinal extras correctly. Keep that read path intact.

### Architecture Compliance

- Use plain JavaScript on both sides.
- Keep all answer-key validation and scoring in backend services, not in the UI.
- Use parameterized SQL only.
- Keep the admin answer key server-owned and protected by admin auth.
- Reuse the existing team list source from match setup so semifinal codes stay consistent with the rest of the competition data.
- Do not change participant extra-entry behavior in this story.

### Backend File Guidance

Likely files to create or extend for this story:

- `server/routes/admin-routes.js`
- `server/schemas/admin-schemas.js`
- `server/services/admin-service.js`
- `server/services/prediction-service.js`
- `server/repositories/prediction-repository.js`
- `server/db/migrations/*` for the answer-key persistence model if a dedicated table is needed
- `server/tests/*` for scoring and admin validation coverage

### Frontend File Guidance

Likely files to create or extend for this story:

- `client/src/pages/admin-page.js`
- `client/src/api/admin-api.js`
- `client/src/styles/admin.css`
- `client/src/components/*` only if the existing form helpers are not enough

### Data Rules

- The answer key should be stored separately from participant prediction rows.
- Keep the official semifinal answer key as a small admin-owned record, ideally one row per competition scope or phase.
- The scoring rule for this story is deterministic: 1 point per correctly matched semifinalist team, order-insensitive, maximum 4 points.
- Invalid or duplicate teams in the answer key must fail validation before any partial write.
- Do not alter the participant's saved semifinal selections when the admin saves the answer key.

### UX Rules

- Keep the gabarito UI inside the existing admin dashboard.
- Use the same team combobox pattern already used for match setup and participant prediction entry.
- Show inline validation and save state so the admin can correct bad input without guessing.
- Keep the form readable on mobile and avoid horizontal scrolling.

### Security Rules

- Admin-only access must be enforced server-side.
- The frontend must not be the only guard around the gabarito form.
- Do not expose the answer key to participant-facing screens unless a future story explicitly requires it.

### Testing Requirements

- Test saving a valid semifinal answer key.
- Test rejection of missing, duplicate, or invalid team selections.
- Test that editing the answer key overwrites stale bonus points.
- Test that ranking recalculation includes the updated semifinal bonus totals.
- Smoke test the admin form on mobile layout assumptions already used by the dashboard.

### References

- `_bmad-output/planning-artifacts/epics.md#Epic 4: Admin Results, Scoring, Corrections, and Disputes`
- `_bmad-output/planning-artifacts/epics.md#Story 4.2: Match Prediction Point Calculation`
- `_bmad-output/planning-artifacts/prds/prd-bolao2026-2026-05-23/prd.md#FR-10: Extra predictions`
- `_bmad-output/planning-artifacts/prds/prd-bolao2026-2026-05-23/addendum.md`
- `_bmad-output/implementation-artifacts/3-6-extra-predictions-entry.md`
- `client/src/pages/admin-page.js`
- `server/services/prediction-service.js`
- `server/services/ranking-service.js`
- `server/services/reveal-service.js`
- `server/repositories/prediction-repository.js`
- `server/db/migrations/012_add_match_count_and_semifinalists.sql`

## Dev Agent Record

### Agent Model Used

GPT-5 (Codex)

### Debug Log References

- RED: new semifinal scoring and ranking bonus tests failed before implementation.
- GREEN: focused tests passed after service, schema, repository, and ranking changes.
- Regression: `npm.cmd test --workspace server` passed 50 tests.
- Client validation: `npm.cmd run build:client` passed.
- Database validation: migration 016 applied successfully on the local database.
- Mobile smoke validation: generated markup and responsive CSS inspected; browser integration was unavailable in this session.

### Implementation Plan

- Store the official answer key as a singleton admin-owned record.
- Validate shape and uniqueness with Zod, then validate codes against match setup teams in the service.
- Save the key and overwrite all participant semifinal points in one transaction.
- Feed persisted extra points into the existing dense ranking calculation and snapshot path.
- Extend the existing admin gabarito section with a responsive four-team form.

### Completion Notes List

- Added admin-only GET and PUT endpoints for the semifinal answer key.
- Added atomic answer-key persistence and participant point recalculation at one point per matching team.
- Added extra prediction points to ranking totals and forced a ranking snapshot after answer-key changes.
- Added reloadable admin form with inline success/error state and mobile single-column layout.
- Added tests for unordered scoring, validation, reload mapping, invalid teams, correction overwrite, and ranking totals.

### File List

- `_bmad-output/implementation-artifacts/4-6-semifinal-answer-key-scoring.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `client/src/api/admin-api.js`
- `client/src/main.js`
- `client/src/pages/admin-page.js`
- `client/src/styles/admin.css`
- `server/db/migrations/016_create_semifinal_answer_key.sql`
- `server/repositories/semifinal-answer-key-repository.js`
- `server/routes/admin-routes.js`
- `server/schemas/admin-schemas.js`
- `server/services/admin-service.js`
- `server/services/ranking-service.js`
- `server/services/semifinal-answer-key-service.js`
- `server/tests/ranking-service.test.js`
- `server/tests/semifinal-answer-key-service.test.js`

## Change Log

- 2026-07-11: Implemented semifinal answer-key storage, scoring, ranking integration, admin UI, migration, and automated tests.
