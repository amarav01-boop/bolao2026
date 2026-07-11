---
title: 'Revealed Extra Scoring Breakdown'
type: 'feature'
created: '2026-07-11'
status: 'done'
route: 'plan-code-review'
baseline_commit: '6a786f88e4caa7189bf53a763cdf9dd875e463f3'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/spec-extra-answer-key-scoring.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-split-extra-answer-key-cards.md'
---

<frozen-after-approval reason="human-owned intent - do not modify unless human renegotiates">

## Intent

**Problem:** Revealed predictions show the participant's extra choices and only one aggregate score, so participants cannot see the official answer key, which categories were evaluated, or how the total was formed. In the admin answer-key cards, saved semifinalist/final values must also come back selected after reload so the admin sees the database state instead of blank controls.

**Approach:** For revealed phases, expose the currently saved official extra answer key and a server-calculated breakdown for semifinalists, champion, scorer, and scorer goals. Render each category with participant prediction, official answer, earned points, and either "Calculado" or "Aguardando gabarito". In admin, hydrate both split cards from the saved key and keep selected values visible in comboboxes/inputs.

## Boundaries & Constraints

**Always:** Show official answers only inside the already protected/revealed prediction flow; calculate the breakdown server-side using the same scoring functions as persistence; keep semifinalists worth 5 each, champion 10, scorer 10, and goals 5; mark a category calculated only when its official answer exists; state clearly when only semifinalists have been calculated; preserve the persisted aggregate total as the ranking source of truth; render the admin saved semifinalists, champion, scorer, and scorer goals as selected/filled after load.

**Ask First:** Showing the answer key before predictions are revealed, changing fuzzy scorer matching, replacing persisted totals with client-calculated values, or changing the saved answer-key schema.

**Never:** Calculate points in the browser; show missing official fields as zero-point mistakes; expose admin save endpoints or unpublished categories; mutate predictions while building reveal data; blank a saved admin field merely because the form was split into multiple cards.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Only semifinals saved | Four official semifinalists; final fields null | Semifinal answer and points shown; summary says only semifinalists calculated; other categories await key | N/A |
| Complete key | All official fields saved | Four categories show answer, status, and points summing to persisted total | N/A |
| Partial participant prediction | Official category exists but participant left it blank | Category is calculated with zero points and displays "Nao informado" as prediction | N/A |
| No official key | Extras are revealed but key absent | All categories show "Aguardando gabarito"; no official values leak | N/A |
| Admin reload with saved key | DB has semifinalists, champion, scorer, and goals | Semifinalist and champion comboboxes are selected; scorer fields are filled | N/A |

</frozen-after-approval>

## Code Map

- `server/services/semifinal-answer-key-service.js` -- produce reusable per-category scoring breakdown.
- `server/services/reveal-service.js` -- load the official key only for revealed payloads and combine it with participant extras.
- `client/src/pages/reveal-page.js` -- render prediction-versus-answer rows, statuses, and calculated-category summary.
- `client/src/main.js` and `client/src/pages/admin-page.js` -- keep split admin answer-key cards hydrated from the saved key on load and after saves.
- `client/src/styles/ranking.css` -- style readable comparison rows on desktop and mobile.
- `server/tests/semifinal-answer-key-service.test.js`, `server/tests/reveal-service.test.js`, `server/tests/reveal-page-render.test.js`, `server/tests/admin-extra-answer-key-render.test.js` -- cover partial/complete keys and admin selected values.

## Tasks & Acceptance

**Execution:**
- [x] `server/services/semifinal-answer-key-service.js` -- return deterministic category points and calculated flags from the existing scoring rules.
- [x] `server/services/reveal-service.js` -- include official values and breakdown only in revealed phase payloads.
- [x] `client/src/pages/reveal-page.js` and `client/src/styles/ranking.css` -- show participant value, gabarito, points, status, and summary.
- [x] `client/src/main.js` and `client/src/pages/admin-page.js` -- preserve saved key values as selected/filled controls in both admin cards.
- [x] `server/tests/semifinal-answer-key-service.test.js`, `server/tests/reveal-service.test.js`, `server/tests/reveal-page-render.test.js`, `server/tests/admin-extra-answer-key-render.test.js` -- verify all matrix states, total consistency, and admin reload rendering.

**Acceptance Criteria:**
- Given only semifinalists have an official key, when revealed extras render, then the page says only semifinalists are calculated and final categories await their key.
- Given the complete key exists, when revealed extras render, then each category displays participant prediction, official answer, earned points, and calculated status.
- Given category breakdown points are summed, when compared with persisted `points_awarded`, then both totals are equal.
- Given predictions are not revealed, when reveal state is requested, then no official extra answer key is returned.
- Given the admin opens the gabarito page after saving, when the dashboard renders, then saved semifinalist/champion combobox options are selected and scorer fields are filled.
- Given a mobile viewport, when the breakdown renders, then comparison rows remain readable without horizontal overflow.

## Spec Change Log

- Human approval expanded scope before implementation: admin answer-key cards must render the saved database values selected/filled after reload. This prevents blank controls after the earlier card split while keeping the same persistence model.
- Review findings fixed in patch: answer-key display now falls back from `teams` to `teamCodes`, whitespace-only scorer goal keys are treated as missing, semifinalist rows preserve four visible slots including blanks, saved admin forms derive `teamCodes` from `teams` when needed, and reveal summary calls out any mismatch between displayed category sum and persisted official total.

## Design Notes

The breakdown should use a structure such as `{ calculated, points, maxPoints, prediction, answer }` per category. Semifinalists may additionally expose per-team matches, but their category total remains at most 20. A summary list of calculated category labels drives messages like "Pontuacao calculada: semifinalistas".

## Verification

**Commands:**
- `npm.cmd test --workspace server` -- breakdown, reveal, admin render, and regression tests pass.
- `npm.cmd run build:client` -- reveal/admin UI compiles.
- `git diff --check` -- no whitespace errors.

**Manual checks (if no browser automation):**
- Inspect partial-key and complete-key reveal markup for readable statuses and no unpublished values.
- Inspect admin gabarito markup for selected saved semifinalist/champion options and filled scorer fields.

## Suggested Review Order

**Scoring Breakdown**

- Centralizes official calculated flags and category points.
  [`semifinal-answer-key-service.js:103`](../../server/services/semifinal-answer-key-service.js#L103)

- Keeps blank scorer-goal keys from becoming zero-goal answers.
  [`semifinal-answer-key-service.js:89`](../../server/services/semifinal-answer-key-service.js#L89)

**Reveal Payload**

- Builds official answers with safe fallback from teams to teamCodes.
  [`reveal-service.js:71`](../../server/services/reveal-service.js#L71)

- Combines participant extras, official key, and server-side breakdown.
  [`reveal-service.js:104`](../../server/services/reveal-service.js#L104)

**Reveal UI**

- Defines visible category labels and formatting for comparison rows.
  [`reveal-page.js:276`](../../client/src/pages/reveal-page.js#L276)

- States calculated categories, pending gabarito, and total mismatches.
  [`reveal-page.js:312`](../../client/src/pages/reveal-page.js#L312)

- Keeps category comparison rows readable on desktop and mobile.
  [`ranking.css:187`](../../client/src/styles/ranking.css#L187)

**Admin Hydration**

- Normalizes saved key data for form values and saved team options.
  [`main.js:118`](../../client/src/main.js#L118)

- Merges saved teams into select options so persisted choices stay selected.
  [`admin-page.js:87`](../../client/src/pages/admin-page.js#L87)

- Renders split answer-key cards from saved and draft state.
  [`admin-page.js:524`](../../client/src/pages/admin-page.js#L524)

**Verification**

- Verifies breakdown totals and missing official categories.
  [`semifinal-answer-key-service.test.js:66`](../../server/tests/semifinal-answer-key-service.test.js#L66)

- Verifies reveal fallback when only teamCodes are available.
  [`reveal-service.test.js:87`](../../server/tests/reveal-service.test.js#L87)

- Verifies visible pending categories and persisted-total mismatch messaging.
  [`reveal-page-render.test.js:68`](../../server/tests/reveal-page-render.test.js#L68)

- Verifies admin saved values render selected and filled.
  [`admin-extra-answer-key-render.test.js:6`](../../server/tests/admin-extra-answer-key-render.test.js#L6)
