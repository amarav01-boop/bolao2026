# Story 4.3: Ranking Recalculation

Status: review

## Story

As the admin,
I want to recalculate ranking points from official match results,
so that standings reflect the scoring rules after results are entered or corrected.

## Acceptance Criteria

1. Given a match is marked as played with an official score, when ranking recalculation runs, then saved predictions receive points.
2. Given a participant has no prediction for that match, when recalculation runs, then the missing prediction is treated as defaulted 0x0.
3. Given the official score changes, when recalculation runs again, then prediction points are overwritten with the corrected value.
4. Given the admin uses the admin panel, when they click the recalculation action, then the backend recalculates all played matches.

## Tasks / Subtasks

- [x] Align match scoring rule to 5 points for exact score and 3 points for correct result.
- [x] Create default 0x0 prediction rows during scoring for missing played-match predictions.
- [x] Add backend service to recalculate all played matches.
- [x] Add admin API action and button to trigger recalculation.
- [x] Add unit tests for scoring rules.

## Implementation Notes

- Added `POST /api/admin/ranking/recalculate`.
- Existing admin match save still refreshes points for the changed match.
- Ranking remains calculated from persisted `points_awarded` values.
