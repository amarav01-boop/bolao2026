---
title: 'Complete Extra Answer Key Scoring'
type: 'feature'
created: '2026-07-11'
status: 'done'
baseline_commit: 'c364ee20e26437d131ad43ab5b8fc14e9fb882cf'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/4-6-semifinal-answer-key-scoring.md'
---

<frozen-after-approval reason="human-owned intent - do not modify unless human renegotiates">

## Intent

**Problem:** The admin answer-key card currently stores only semifinalists and awards one point per hit, while the published rules require scoring champion, semifinalists, top scorer, and the top scorer's goal count. Participant-entered scorer names may contain accents, abbreviations, simplifications, or small typos.

**Approach:** Extend the existing answer key and card with the champion, canonical scorer name, and goal total, then atomically recalculate every participant's complete extra score using the published 10/5/10/5 weights and conservative fuzzy name matching. Show the resulting total alongside extras in the revealed-predictions view without exposing the official key.

## Boundaries & Constraints

**Always:** Keep the answer key admin-only; validate champion and semifinalists against match-setup teams; require four unique semifinalists; score champion at 10, each semifinalist at 5, scorer at 10, and exact goal count at 5; overwrite the complete `points_awarded` total atomically; ignore case, accents, punctuation, and repeated spaces in scorer names; support clear abbreviations and minor typos without rewarding weak matches; show the persisted extra total in revealed predictions.

**Ask First:** Changing the published point values, supporting multiple official top scorers, or exposing the official answer key to participant-facing screens.

**Never:** Modify participant predictions while scoring; perform fuzzy matching in the browser; award partial scorer points; let an invalid answer key partially update scores; use an external fuzzy-search dependency.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Full hit | Champion, four semifinalists, scorer, and goals all match | 45 points | N/A |
| Scorer abbreviation | `Vini Jr` versus `Vinicius Junior` | Scorer receives 10 points | N/A |
| Scorer typo | Small edit difference in an otherwise specific name | Scorer receives 10 points | N/A |
| Weak scorer match | Short or materially different name | No scorer points | N/A |
| Goals only | Scorer name misses but goal count matches | Goal count still receives 5 points | N/A |
| Invalid teams | Unknown champion, duplicate/unknown semifinalist | No answer key or participant score is changed | Return validation error |

</frozen-after-approval>

## Code Map

- `server/db/migrations/017_expand_semifinal_answer_key.sql` -- add champion, scorer, and goals to the existing singleton answer key.
- `server/repositories/semifinal-answer-key-repository.js` -- map and atomically persist the complete key and complete extra totals.
- `server/services/semifinal-answer-key-service.js` -- normalize names, perform conservative fuzzy matching, and calculate weighted totals.
- `server/schemas/admin-schemas.js` -- validate the complete admin payload.
- `server/routes/admin-routes.js` and `server/services/admin-service.js` -- accept the expanded key and trigger ranking recalculation.
- `client/src/pages/admin-page.js`, `client/src/main.js`, `client/src/api/admin-api.js` -- render, hydrate, and submit the expanded card.
- `server/services/reveal-service.js`, `client/src/pages/reveal-page.js` -- expose and render the persisted extra-prediction score.
- `server/tests/semifinal-answer-key-service.test.js` and `server/tests/ranking-service.test.js` -- cover weights, fuzzy matching, correction, and ranking totals.

## Tasks & Acceptance

**Execution:**
- [x] `server/db/migrations/017_expand_semifinal_answer_key.sql` -- extend answer-key persistence without rewriting the already-applied migration.
- [x] `server/services/semifinal-answer-key-service.js` -- replace semifinal-only scoring with complete weighted extra scoring and name proximity logic.
- [x] `server/repositories/semifinal-answer-key-repository.js` -- read/write all official fields and pass complete participant extras into scoring inside one transaction.
- [x] `server/schemas/admin-schemas.js`, `server/routes/admin-routes.js`, `server/services/admin-service.js` -- validate and save the expanded payload through the protected endpoint.
- [x] `client/src/pages/admin-page.js`, `client/src/main.js` -- add champion, scorer, and goal fields to the same responsive card with reload and inline status.
- [x] `server/services/reveal-service.js`, `client/src/pages/reveal-page.js` -- display the persisted total earned from revealed extras without exposing the answer key.
- [x] `server/tests/semifinal-answer-key-service.test.js`, `server/tests/ranking-service.test.js` -- verify all matrix cases, correction overwrite, and ranking integration.

**Acceptance Criteria:**
- Given a valid complete key, when the admin saves it, then it reloads with all fields and all participant extra totals are overwritten before ranking recalculation.
- Given a participant hits every extra, when scoring runs, then 45 points are persisted.
- Given scorer spelling differs only by supported normalization, abbreviation, or a small typo, when scoring runs, then 10 scorer points are awarded.
- Given any official team is invalid or semifinalists repeat, when saving, then the request fails without partial writes.
- Given a mobile viewport, when the expanded card renders, then fields stack without horizontal overflow.
- Given extras are revealed and scored, when a participant's revealed predictions are viewed, then the persisted extra total is displayed with the extra predictions.

## Design Notes

Name matching normalizes Unicode diacritics, case, punctuation, and whitespace. It accepts exact normalized equality, ordered token-prefix abbreviations with meaningful tokens, a single specific token matching an official token, or normalized Levenshtein similarity at a conservative threshold. The matcher returns only true/false, so scorer scoring remains all-or-nothing.

## Verification

**Commands:**
- `npm.cmd test --workspace server` -- all scoring and regression tests pass.
- `npm.cmd run build:client` -- production client compiles.
- `npm.cmd run migrate:server` -- migration applies successfully.
- `git diff --check` -- no whitespace errors.

**Manual checks (if no CLI):**
- Inspect the admin card at desktop and mobile widths; all seven official-result fields remain readable and submit as one answer key.

## Suggested Review Order

**Scoring rules**

- Centralizes weighted scoring and independent bonus categories.
  [`semifinal-answer-key-service.js:89`](../../server/services/semifinal-answer-key-service.js#L89)

- Applies conservative normalization, abbreviation, and typo matching.
  [`semifinal-answer-key-service.js:43`](../../server/services/semifinal-answer-key-service.js#L43)

- Validates complete keys and tournament-consistent champion selection.
  [`admin-schemas.js:12`](../../server/schemas/admin-schemas.js#L12)

**Persistence and ranking**

- Saves the key and overwrites canonical extra scores atomically.
  [`semifinal-answer-key-repository.js:36`](../../server/repositories/semifinal-answer-key-repository.js#L36)

- Extends the singleton schema without changing the applied base migration.
  [`017_expand_semifinal_answer_key.sql:1`](../../server/db/migrations/017_expand_semifinal_answer_key.sql#L1)

**Admin workflow**

- Presents all seven official-result fields in one responsive card.
  [`admin-page.js:506`](../../client/src/pages/admin-page.js#L506)

- Submits the complete key and rehydrates persisted values.
  [`main.js:1601`](../../client/src/main.js#L1601)

**Revealed predictions**

- Exposes only the persisted total, preserving answer-key privacy.
  [`reveal-service.js:70`](../../server/services/reveal-service.js#L70)

- Displays earned extra points beside read-only predictions.
  [`reveal-page.js:226`](../../client/src/pages/reveal-page.js#L226)

**Verification**

- Covers all weights, fuzzy matching, validation, and corrections.
  [`semifinal-answer-key-service.test.js:35`](../../server/tests/semifinal-answer-key-service.test.js#L35)

- Verifies complete card markup and responsive CSS rules.
  [`admin-extra-answer-key-render.test.js:6`](../../server/tests/admin-extra-answer-key-render.test.js#L6)
