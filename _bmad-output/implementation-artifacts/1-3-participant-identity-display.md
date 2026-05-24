# Story 1.3: Participant Identity Display

Status: done

## Story

As a participant,
I want my nickname and avatar to appear in public participant references,
so that rankings and shared screens feel personal and recognizable.

## Acceptance Criteria

1. Given a participant has selected a nickname and avatar, when participant identity is shown in public references, then the nickname and avatar appear consistently.
2. Given a participant is shown in ranking or other public lists, when the row/card renders, then the identity display remains compact, readable, and mobile-safe.
3. Given curated avatar choices are part of the MVP, when the participant identity is displayed, then only curated avatar options are used and no custom upload path is introduced.
4. Given a participant is signed in, when their identity is shown in the app shell or home view, then the public-facing nickname/avatar treatment matches the rest of the UI.
5. Given identity surfaces render on mobile, when lists or cards stack, then the layout does not overflow horizontally.
6. Given future ranking and reveal stories will reuse identity visuals, when implementation is complete, then the identity display is reusable and not hardcoded in one screen only.

## Tasks / Subtasks

- [ ] Add reusable participant identity display (AC: 1, 3, 4, 6)
  - [ ] Create a shared participant identity component or helper.
  - [ ] Show avatar tone/initials and the public nickname.
  - [ ] Keep username secondary or hidden depending on the public context.

- [ ] Wire identity into public references (AC: 1, 2, 5, 6)
  - [ ] Update ranking/public row rendering to use the shared identity display.
  - [ ] Update signed-in shell or home preview to use the same identity treatment.
  - [ ] Keep the layout responsive and compact.

- [ ] Add minimal verification for identity surfaces (AC: 1-6)
  - [ ] Verify the nickname/avatar display appears in the signed-in app.
  - [ ] Verify the shared identity component works in list and card contexts.
  - [ ] Verify the build remains green after the refactor.

## Dev Notes

### Source Context

- Story 1.1 already stored avatar keys and nicknames on the participant profile.
- Story 1.2 will need a signed-in shell, so the identity display should be reusable there too.
- This story should prepare the visuals that ranking and reveal screens will reuse later.

### Architecture Compliance

- Use plain JavaScript on both sides.
- Reuse the existing Vite client and Express backend.
- Store and display only the curated avatar key/filename, not image uploads.
- Keep public identity logic reusable across ranking, home, and participant summary views.

### Frontend File Guidance

Likely files to create or extend for this story:

- `client/src/components/participant-badge.js`
- `client/src/components/ranking-row.js`
- `client/src/pages/home-page.js`
- `client/src/pages/register-page.js`
- `client/src/components/app-shell.js`
- `client/src/styles/layout.css`
- `client/src/styles/ranking.css`

### Testing Requirements

- Verify nickname and avatar are visible in the signed-in flow.
- Verify the display stays readable on mobile.
- Verify the component is reusable in list and card contexts.

## Dev Agent Record

### Completion Notes List

- Added a shared participant badge component so nickname/avatar rendering is reusable across public screens.
- Updated ranking row rendering to show the participant identity consistently in list contexts.
- Added a signed-in home view that shows the participant identity and a ranking-style preview using the same badge.
- Verified the badge and ranking preview compile cleanly in the client build.

### File List

- `client/src/components/participant-badge.js`
- `client/src/components/ranking-row.js`
- `client/src/pages/home-page.js`
- `client/src/pages/register-page.js`
- `client/src/main.js`
- `client/src/styles/forms.css`
- `client/src/styles/ranking.css`
