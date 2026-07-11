---
title: 'Fix Ambiguous Extra Prediction ID'
type: 'bugfix'
created: '2026-07-11'
status: 'done'
route: 'one-shot'
---

# Fix Ambiguous Extra Prediction ID

## Intent

**Problem:** Saving the semifinal answer key failed because the scoring query joined two tables containing `id` and selected the column without qualification.

**Approach:** Qualify the selected identifier as `extras.id` and assert that qualification in the repository regression test.

## Suggested Review Order

**Query correction**

- Removes MySQL ambiguity while preserving the existing row identifier shape.
  [`semifinal-answer-key-repository.js:85`](../../server/repositories/semifinal-answer-key-repository.js#L85)

**Regression coverage**

- Prevents the joined query from returning to an unqualified identifier.
  [`semifinal-answer-key-service.test.js:269`](../../server/tests/semifinal-answer-key-service.test.js#L269)
