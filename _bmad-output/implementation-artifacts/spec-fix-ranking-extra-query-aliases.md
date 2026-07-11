---
title: 'Fix Ranking Extra Query Aliases'
type: 'bugfix'
created: '2026-07-11'
status: 'done'
route: 'one-shot'
---

# Fix Ranking Extra Query Aliases

## Intent

**Problem:** Ranking recalculation failed because the joined extra-prediction query selected shared column names without table qualification.

**Approach:** Qualify every projected and ordered extra-prediction column with `extras.`, then validate both repository and ranking queries against the real MySQL database.

## Suggested Review Order

**SQL correction**

- Fully qualifies joined columns to prevent sequential MySQL ambiguity failures.
  [`prediction-repository.js:185`](../../server/repositories/prediction-repository.js#L185)

**Regression coverage**

- Verifies identifier, timestamp, and ordering aliases remain explicit.
  [`prediction-repository.test.js:6`](../../server/tests/prediction-repository.test.js#L6)
