# Story 3.6: Extra Predictions Entry

Status: review

## Story

As a participant,
I want to enter and save the extra predictions for champion, top scorer, and top scorer goals,
so that the bolao includes the classic extras from previous editions.

## Acceptance Criteria

1. Given extras are open, when the participant fills champion, top scorer, and top scorer goals, then the values are saved for that participant.
2. Given saved extras already exist, when the participant returns before the deadline, then the values are prefixed back into the form and remain editable.
3. Given the extras deadline has passed, when the participant opens the extras entry surface, then the fields are locked from editing.
4. Given extras are being implemented, when the UI and API are built, then the scoring logic is not hardcoded into the entry form.
5. Given the participant uses mobile, when the extras form renders, then the layout remains readable and touch-friendly.

## Tasks / Subtasks

- [x] Add extras persistence for the participant record or a dedicated extras table.
- [x] Add backend endpoints for reading and saving extra predictions.
- [x] Build the participant extras form for champion, top scorer, and top scorer goals.
- [x] Enforce extras deadline lock on the backend.
- [x] Smoke test save, reload, and locked-state behavior.

## Implementation Notes

- Added `competition_extra_predictions` for champion, top scorer, and top scorer goals.
- Extras are saved through the active phase prediction endpoint so they share the group-stage deadline and lock behavior.
- Champion is a combo box populated from the phase team list; artilheiro is free text; goals is numeric.

## Dev Notes

- This story should follow the same auth/session contract already used by the participant prediction flow.
- Keep extras separated from normal match predictions so the two flows can evolve independently.
- Any future scoring logic should live in services, not in the UI.
- Use MariaDB/MySQL and parameterized SQL only.
