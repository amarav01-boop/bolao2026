# Story 6.2: Todos os Palpites Participant Selector

Status: review

## Story

As a participant,
I want to select another participant and see their revealed predictions,
so that I can compare guesses after the prediction window closes.

## Acceptance Criteria

1. Given a phase has reveal enabled, when the participant opens Todos os Palpites, then a participant selector is available.
2. Given a participant is selected, when the page loads, then that participant's predictions are shown grouped by phase/group.
3. Given a match has no saved prediction, when predictions are revealed, then the page shows the default 0 x 0 prediction.
4. Given the participant uses mobile, when the selector and prediction list render, then the layout remains readable.

## Tasks / Subtasks

- [x] Add backend reveal endpoint with participant selector data.
- [x] Merge match master data with saved predictions.
- [x] Apply the 0 x 0 default display for missing prediction rows.
- [x] Add `/todos-palpites` participant route and selector interaction.
- [x] Smoke test participant switching after reveal is enabled.

## Implementation Notes

- Added `/api/reveal` and client route `/todos-palpites`.
- Reveal data is server-side, grouped from competition phases and match master records.
- The selected participant is maintained in client state and reloaded when the combo box changes.
