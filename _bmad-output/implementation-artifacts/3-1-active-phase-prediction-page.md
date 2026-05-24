# Story 3.1: Active Phase Prediction Page

Status: review

## Story

As a participant,
I want to open the active phase prediction page, navigate the Group Phase by group tabs, and save my score predictions with autosave,
so that I can complete the current World Cup phase without losing my work.

## Acceptance Criteria

1. Given a participant is logged in and a phase is open, when the participant opens the home page, then the active phase, deadline, progress, and group tabs are shown.
2. Given the participant edits a prediction, when the user enters a score for a match, then the prediction is persisted to MariaDB/MySQL through a participant-authenticated API.
3. Given the participant returns later, when the active phase loads again, then previously saved predictions are prefilled.
4. Given a match is left blank before the deadline, when the phase eventually closes, then the system can default that prediction to `0x0` later without losing the distinction between explicit and defaulted rows.
5. Given the participant is editing on mobile, when the group tabs and score rows render, then the layout remains functional and readable without horizontal overflow.
6. Given the participant has unsaved changes, when autosave runs or the user submits manually, then the save state updates clearly.

## Tasks / Subtasks

- [x] Add the prediction persistence table and save-state fields needed for launch.
- [x] Add backend endpoints for reading the active phase and saving predictions.
- [x] Build the participant prediction page with group tabs and score rows.
- [x] Wire autosave and reload-from-server behavior for the current active phase.
- [x] Smoke test participant login, active-phase loading, and prediction persistence.

## Dev Notes

- The active phase is the current `window_state = 'open'` competition phase.
- Group Phase uses tabs by group code; other phases can use the same row model later.
- Prediction rows store `points_awarded` for later scoring and `is_defaulted` for the `0x0` fallback rule.
- Backend scoring for match results will be layered on top of this table in later stories.

## Completion Notes

- Implemented the active phase page as the participant home surface.
- Added the prediction master table, the active-phase API, and autosave persistence.
- Verified the flow end to end with a real login and a saved prediction row.
