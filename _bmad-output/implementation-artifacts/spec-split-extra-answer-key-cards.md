---
title: 'Split Extra Answer Key Cards'
type: 'feature'
created: '2026-07-11'
status: 'done'
baseline_commit: '0d1d5dda87e20f574bb23ca10cebdf918ae5b64f'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/spec-extra-answer-key-scoring.md'
---

<frozen-after-approval reason="human-owned intent - do not modify unless human renegotiates">

## Intent

**Problem:** The admin currently must enter the champion and top scorer together with the semifinalists, although semifinalists become known earlier. This prevents scoring semifinal predictions at the correct tournament moment.

**Approach:** Split the existing UI into independent semifinalist and final-result cards with independent save actions. Each partial save merges into the same official answer key and recalculates every participant from all official categories available at that moment.

## Boundaries & Constraints

**Always:** Allow four valid unique semifinalists to be saved without champion, scorer, or goals; award up to 20 semifinal points immediately; preserve any already-saved final-result fields when semifinalists are corrected; require semifinalists before saving final results; require the champion to be one of the saved semifinalists; preserve the published 10/5/10/5 weights and fuzzy scorer matching; keep both cards in the existing admin gabarito section.

**Ask First:** Allowing final results before semifinalists, clearing an already-saved result, changing point weights, or splitting the cards across different admin pages.

**Never:** Treat absent official fields as participant hits; erase one card's data when saving the other; expose the official answer key to participants; partially write an invalid card submission.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Early semifinal save | Four valid unique teams, final fields absent | Key stores teams and participants receive 5 points per semifinal hit | N/A |
| Final save later | Existing semifinal key plus champion, scorer, goals | Final fields merge and complete totals recalculate up to 45 | N/A |
| Semifinal correction after final | Complete key exists and semifinal teams change | Final fields remain; all totals are recomputed | Reject if saved champion is no longer a semifinalist |
| Final save before semifinals | No semifinal key exists | No write or score change | Return conflict/validation error |
| Missing official category | Champion/scorer/goals not saved yet | That category contributes zero, never a false hit | N/A |

</frozen-after-approval>

## Code Map

- `server/schemas/admin-schemas.js` -- separate validation contracts for semifinal and final cards.
- `server/routes/admin-routes.js`, `server/services/admin-service.js` -- expose independent protected save operations.
- `server/services/semifinal-answer-key-service.js` -- merge partial official results and score only available categories.
- `server/repositories/semifinal-answer-key-repository.js` -- persist nullable final fields while retaining atomic rescoring.
- `client/src/api/admin-api.js`, `client/src/main.js` -- bind independent submissions and statuses.
- `client/src/pages/admin-page.js`, `client/src/styles/admin.css` -- render two responsive cards in the same section.
- `server/tests/semifinal-answer-key-service.test.js`, `server/tests/admin-service.test.js`, `server/tests/admin-extra-answer-key-render.test.js` -- verify sequencing, preservation, scoring, and UI separation.

## Tasks & Acceptance

**Execution:**
- [x] `server/schemas/admin-schemas.js`, `server/routes/admin-routes.js` -- split the complete request into semifinal and final-result endpoints.
- [x] `server/services/semifinal-answer-key-service.js`, `server/repositories/semifinal-answer-key-repository.js` -- merge partial keys, preserve prior categories, and avoid absent-field points.
- [x] `server/services/admin-service.js` -- recalculate ranking after either independent save.
- [x] `client/src/api/admin-api.js`, `client/src/main.js` -- submit and report each card independently.
- [x] `client/src/pages/admin-page.js`, `client/src/styles/admin.css` -- render separate semifinal and champion/scorer cards.
- [x] `server/tests/*answer-key*`, `server/tests/admin-service.test.js` -- cover early save, later merge, correction protection, false-hit prevention, and two-card rendering.

**Acceptance Criteria:**
- Given semifinalists are known but final results are not, when the admin saves the semifinal card, then it succeeds and recalculates only semifinal points.
- Given semifinalists were saved earlier, when the admin later saves champion and scorer results, then the key merges and complete totals recalculate.
- Given either card reloads, when data was previously saved, then only its own persisted fields are displayed.
- Given final official fields are absent, when scoring runs, then no participant receives champion, scorer, or goals points.
- Given mobile layout, when both cards render, then each stacks without horizontal overflow.

## Design Notes

The singleton answer key remains the source of truth. Separate endpoints prevent one form's required fields from blocking the other, while service-level merge logic builds a complete in-memory key before the existing atomic answer-key and participant-score transaction.

## Verification

**Commands:**
- `npm.cmd test --workspace server` -- all new sequencing and regression tests pass.
- `npm.cmd run build:client` -- both forms compile in the production bundle.
- `git diff --check` -- no whitespace errors.

**Manual checks (if no browser automation):**
- Inspect both cards in the admin gabarito section and confirm each has its own button and inline status.

## Suggested Review Order

**Independent admin flow**

- Renders separate semifinal and final-result cards with independent actions.
  [`admin-page.js:506`](../../client/src/pages/admin-page.js#L506)

- Preserves unsaved final edits when semifinalists are submitted.
  [`main.js:1607`](../../client/src/main.js#L1607)

- Preserves semifinal drafts when final results are submitted.
  [`main.js:1647`](../../client/src/main.js#L1647)

**Partial key merge**

- Merges semifinal corrections while retaining compatible final fields.
  [`semifinal-answer-key-service.js:148`](../../server/services/semifinal-answer-key-service.js#L148)

- Requires persisted semifinalists before accepting final results.
  [`semifinal-answer-key-service.js:181`](../../server/services/semifinal-answer-key-service.js#L181)

- Serializes independent saves to prevent stale aggregate overwrites.
  [`semifinal-answer-key-repository.js:38`](../../server/repositories/semifinal-answer-key-repository.js#L38)

**API boundaries**

- Exposes distinct protected endpoints for each card.
  [`admin-routes.js:169`](../../server/routes/admin-routes.js#L169)

**Verification**

- Confirms two forms, two buttons, persisted zero, and mobile rules.
  [`admin-extra-answer-key-render.test.js:6`](../../server/tests/admin-extra-answer-key-render.test.js#L6)
