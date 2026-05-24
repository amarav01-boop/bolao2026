# Story 5.3: Home Phase Status and Attention Message

Status: review

## Story

As a participant,
I want Home to show the current phase status and the most important action,
so that I know what to do next.

## Acceptance Criteria

1. Given a prediction window is open, when a participant opens Home, then the phase status card shows phase, deadline, and next action.
2. Given the participant has missing predictions before the deadline, when Home renders, then the attention message prioritizes the missing prediction warning.
3. Given no immediate action exists, when Home renders, then the attention message shows a neutral waiting state.
4. Given the home view is rendered on mobile, when the phase card and attention content appear, then the layout remains readable and stacked correctly.

## Tasks / Subtasks

- [x] Ensure the home page receives the active phase and window status from the backend.
- [x] Show a strong attention message that changes based on current participant state.
- [x] Surface deadline and completion progress in the phase card.
- [x] Keep the home layout mobile-first and fast to load.
- [x] Smoke test open-phase, missing-prediction, and neutral states.

## Implementation Notes

- Added `/api/home` to centralize phase status, completion summary, attention message, and ranking snapshot.
- Home now loads prediction data and home status together, keeping the participant dashboard consistent.
- Added tests for missing-prediction warning and locked-phase neutral state.

## Dev Notes

- The home screen is the participant command center.
- Priority ordering matters: missing predictions should beat generic ranking or result messages.
- Keep the message tone clear and friendly, not noisy.
- This story should build on the existing active-phase and ranking data contracts.
