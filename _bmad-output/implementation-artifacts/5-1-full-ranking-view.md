# Story 5.1: Full Ranking View

Status: review

## Story

As a participant,
I want to view the full ranking,
so that I can see my position and everyone's points.

## Acceptance Criteria

1. Given ranking data exists, when the participant opens Ranking, then all participants are listed with rank, nickname/avatar, and accumulated points.
2. Given participants are tied, when ranking is displayed, then dense tie ranking is used.
3. Given the page is viewed on mobile, when ranking rows render, then the layout remains readable without horizontal overflow.
4. Given the participant is looking at the ranking, when the list renders, then the current participant can be clearly located in the list.

## Tasks / Subtasks

- [x] Add the ranking page and ranking API if it does not already exist in the current shell.
- [x] Render nickname, avatar, rank, and accumulated points in a compact table or list.
- [x] Apply dense-tie rank behavior from the ranking service.
- [x] Highlight the current participant row.
- [x] Smoke test the ranking view on desktop and mobile.

## Implementation Notes

- Added `/api/ranking` with backend dense ranking and participant-safe public identity data.
- Added `/ranking` participant route with current participant highlight and responsive ranking table.
- Added service tests for all-zero and tied ranking behavior.

## Dev Notes

- Reuse the participant identity components already in the app.
- The initial launch can show all participants with 0 points until scoring begins.
- Ranking data should come from the backend as the source of truth, not from local client calculations.
- Keep the view light and fast for the friends-group MVP.
