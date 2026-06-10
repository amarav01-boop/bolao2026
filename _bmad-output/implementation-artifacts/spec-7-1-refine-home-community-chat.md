---
title: 'Refine Home Community Chat'
type: 'feature'
created: '2026-06-09'
status: 'done'
baseline_commit: '94e752ca72b02fc630891643bbef362e2e3df198'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/7-1-home-community-chat.md'
---

<frozen-after-approval reason="human-owned intent - do not modify unless human renegotiates">

## Intent

**Problem:** The current Home chat presents every message as an individual card, uses oversized avatars, and places the composer before the history. This makes the experience feel like a social feed instead of a compact, continuous chat room.

**Approach:** Recompose the chat in the style of a classic public chat room: one continuous fixed-height history area at the top, compact text-only participant identity, an internal scrollbar, and the composer at the bottom with one-click emoji shortcuts.

## Boundaries & Constraints

**Always:** Preserve public messages, mentions, directed-message highlighting, image thumbnails, pagination, the 240-character limit, newest-first ordering, and responsive behavior. The history must stay inside one visual surface and the composer must remain visible below it.

**Ask First:** Changing message ordering, backend contracts, database schema, polling behavior, or image security rules.

**Never:** Reintroduce participant avatars inside chat messages, render each message as a floating card, add an emoji library, or allow emoji buttons to bypass the 240-character limit.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Message history | Multiple public messages | Messages share one continuous scrollable surface with subtle separators | Empty/loading states remain inside the same surface |
| Emoji shortcut | Participant clicks an emoji button | Emoji is inserted at the current textarea cursor and the counter updates | Do not insert when it would exceed 240 Unicode characters |
| Directed message | Message targets current participant | Row receives restrained highlight without becoming a separate card | Preserve safe escaped content and thumbnail behavior |
| Responsive viewport | Desktop or mobile Home | Chat has a viewport-relative fixed history height and no horizontal overflow | Stack Home columns on smaller screens |

</frozen-after-approval>

## Code Map

- `client/src/pages/home-page.js` -- message markup, continuous history, composer order, and emoji shortcut controls.
- `client/src/styles/chat.css` -- fixed-height room layout, compact rows, scrollbar, separators, and responsive styling.
- `client/src/main.js` -- emoji insertion at cursor and live character counter behavior.
- `server/tests/home-chat-render.test.js` -- rendering regression coverage for structure, identity, safety, and emoji controls.

## Tasks & Acceptance

**Execution:**
- [x] `server/tests/home-chat-render.test.js` -- add failing assertions for continuous history, no avatar markup, composer after history, and emoji buttons.
- [x] `client/src/pages/home-page.js` -- render compact text-only messages in one history surface and move the composer below it.
- [x] `client/src/styles/chat.css` -- make the chat a viewport-sized room with internal scrolling and subtle row separators.
- [x] `client/src/main.js` -- insert shortcut emojis at the textarea cursor while respecting Unicode length.

**Acceptance Criteria:**
- Given the Home chat contains messages, when it renders, then all messages appear within one continuous fixed-height history area with an internal vertical scrollbar.
- Given a message renders, when participant identity is shown, then only the nickname and timestamp appear, without an avatar.
- Given the chat card renders, when reading top to bottom, then the history appears before the composer.
- Given a participant clicks an emoji shortcut, when the draft is below the limit, then the emoji is inserted at the cursor, the textarea remains focused, and the Unicode counter updates.
- Given desktop Home, when chat and insights render, then the chat remains in the left column and the two insight cards remain stacked in the right column.

## Spec Change Log

- 2026-06-09: User testing found that the history area was still too short and a selected mention reopened the empty suggestion state. Increased viewport-relative chat heights and required the mention popover to remain closed while the selected nickname is present. KEEP the continuous room, text-only identity, history-before-composer structure, and emoji toolbar.

## Design Notes

Use one bordered `.chat-room` surface containing the message history. Individual rows may have a bottom separator and directed-message background, but no individual border radius or card background. Use a history height based on the visible viewport, with practical minimum and maximum constraints so it remains usable on laptops and phones.

## Verification

**Commands:**
- `npm.cmd run test --workspace server` -- expected: all tests pass.
- `npm.cmd run build:client` -- expected: Vite production build succeeds.
- `git diff --check` -- expected: no whitespace errors.
