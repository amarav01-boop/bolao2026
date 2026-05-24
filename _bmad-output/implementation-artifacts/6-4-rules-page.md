# Story 6.4: Rules Page

Status: review

## Story

As a participant,
I want to read the bolao rules,
so that I understand scoring, deadlines, defaults, reveal behavior, and ranking before joining.

## Acceptance Criteria

1. Given a participant or visitor opens Regras, when the page loads, then the rules for match scoring, extras scoring, deadlines, 0x0 default, reveal behavior, and dense tie ranking are visible.
2. Given the rules page is accessible publicly, when the user is not logged in, then the content still loads without requiring authentication.
3. Given the page is viewed on mobile, when rules content renders, then it remains readable without horizontal overflow.
4. Given the rules content may need launch-time edits, when the implementation is updated, then the source remains easy to change without rebuilding the whole application architecture.

## Tasks / Subtasks

- [x] Create a public rules route/page.
- [x] Populate the page with the launch rules from the bolao brief and prior editions.
- [x] Link to the rules page from login/register and from the logged-in home screen.
- [x] Keep the page lightweight and mobile-friendly.
- [x] Verify the page works before and after authentication.

## Implementation Notes

- Fixed route bootstrapping so `/regras` is preserved for visitors and logged-in participants.
- The participant navigation now links to Regras after login.
- The same static rules view is used publicly and inside the authenticated app shell.

## Dev Notes

- The rules page should stay simple and static for launch speed.
- The most important rules to show are scoring, missing-prediction default, reveal behavior, and deadlines.
- Keep the content easy to update as the bolao evolves.
- Reuse the existing app shell and styling rather than inventing a separate visual system.
