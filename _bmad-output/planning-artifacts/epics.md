---
stepsCompleted: [1]
inputDocuments:
  - "_bmad-output/planning-artifacts/prds/prd-bolao2026-2026-05-23/prd.md"
  - "_bmad-output/planning-artifacts/prds/prd-bolao2026-2026-05-23/addendum.md"
  - "_bmad-output/planning-artifacts/briefs/brief-bolao2026-2026-05-23/brief.md"
  - "_bmad-output/brainstorming/brainstorming-session-2026-05-23-104034.md"
---

# bolao2026 - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for bolao2026, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Visitors can create a Participant account when registration is open, providing username, password, nickname, and avatar; username must be unique, nickname must be unique or clearly disambiguated, and closed registration must show a clear message.

FR2: Participants can login and logout with username/password; authenticated Participants can access participant navigation, and unauthenticated users attempting protected pages are sent to login.

FR3: Admin can login through a protected route using a specific admin username/password; admin screens are hidden from regular participant navigation and inaccessible to non-admin Participants.

FR4: Participants choose from a curated avatar set during registration; avatars appear in Ranking and relevant public references, while custom uploads are out of MVP scope.

FR5: Admin can create, open, close, and set a deadline for a Prediction Window for a Phase; locked windows cannot be edited and knockout windows are opened after matchups are known.

FR6: Participants can enter Match score Predictions for the active Phase; Group Phase is segmented by Group tabs/sections, knockout phases use admin-configured matches, and Predictions remain editable until lock.

FR7: Prediction input saves at Group/form-section level and shows visible save state such as Unsaved changes, Saving, and Saved; Participants can return to the last edited group/section and save failures are visible.

FR8: At deadline, the Prediction Window locks using server time and a short grace window for in-flight saves; Participants cannot edit locked predictions.

FR9: Missing Match Predictions become Defaulted 0x0 when the Prediction Window locks; missing rows warn before lock, and Defaulted 0x0 remains distinguishable from Explicit 0x0 in admin/reveal views.

FR10: Participants can submit Extra Predictions for champion, top scorer, and top scorer goals; extras have a configured deadline, reveal behavior, and scoring rules.

FR11: Home shows the current Phase and Prediction Window state, including deadline, completion/missing status when open, and a link to the next relevant action.

FR12: Home shows a prominent competition-aware attention message tied to the Participant's state, prioritizing missing predictions, ranking changes, and result updates while staying clear.

FR13: Home shows the Participant's current rank, points, movement, and nearby context; it links to full Ranking and handles pre-ranking empty state.

FR14: Home shows prediction distribution for today's matches after predictions are locked/revealed, including Team A win %, draw %, and Team B win %.

FR15: Home highlights Participants who predicted completed Match scores exactly using the "Acertou na Mosca" label, with an empty/hidden state when no exact hits exist.

FR16: Participants can view full Ranking with nickname/avatar, rank, points, movement, and status chip; Ranking uses Dense Tie Ranking and movement compares to previous state.

FR17: System assigns simple objective Ranking status chips such as On fire, Rising, Falling, Watch your back, and Holding steady based on points/rank movement rules.

FR18: Admin can enable prediction visibility for a locked Phase through a manual Reveal Switch; backend must not expose other Participants' Predictions before reveal is enabled.

FR19: Participants can select a Participant and view that Participant's revealed locked Predictions grouped by Phase/Group, including Explicit 0x0 versus Defaulted 0x0 distinction and revealed extras.

FR20: Admin can open or close new participant registration; existing Participants can still login when registration is closed.

FR21: Admin can create or edit Matches for a Phase; Group Phase uses configured data, Knockout Matches can be manually created/updated, and a window should not open for a Phase with no matches.

FR22: Admin can enter, edit, or correct a Match Result; result entry triggers or enables point calculation, and corrections trigger Ranking recalculation.

FR23: System calculates Match points, accumulated points, rank, and movement after result updates; Ranking correction notice appears when recalculation follows a corrected result.

FR24: Admin can preserve simple notes for rule changes, corrections, or disputes; MVP notes are lightweight, and result corrections should produce a visible Participant notice.

FR25: Participants can view Regras with match scoring, extras scoring, deadlines, 0x0 default, reveal behavior, and tie ranking; rules should be editable by Admin or easy to update before launch.

### NonFunctional Requirements

NFR1: Participant flows must work on mobile width as first-class responsive layouts.

NFR2: Passwords must not be stored in plaintext, and Admin routes must be access-controlled.

NFR3: Backend must enforce deadline lock and reveal state; frontend hiding alone is insufficient.

NFR4: Prediction save failures must be visible before lock.

NFR5: Result corrections must recalculate dependent ranking data consistently.

NFR6: Core forms and navigation should be keyboard operable and readable with adequate contrast.

NFR7: Core pages should load quickly for a small friends group and avoid heavy assets in prediction entry.

### Additional Requirements

- No Architecture document was found in `_bmad-output/planning-artifacts`; no starter template, infrastructure, deployment, API, or data model decisions have been extracted yet.
- PRD addendum notes that backend must enforce prediction reveal and deadline lock.
- PRD addendum notes that prediction intent state must distinguish explicit prediction from defaulted prediction.
- PRD addendum notes that ranking snapshots or previous rank values are needed for movement arrows.
- PRD addendum notes that Admin must be treated as a separate role/account in authorization checks.
- PRD addendum notes that scoring rules should be configurable or isolated so rule confirmation does not require rewriting ranking logic.
- PRD addendum notes that a static Rules page may be fastest for launch, but source text should be easy to update.

### UX Design Requirements

- No UX Design document was found in `_bmad-output/planning-artifacts`.
- UX requirements currently come from PRD-level requirements only: responsive participant navigation, Group Phase tabs/sections, group-level save state, Home phase status card, Ranking display, Todos os Palpites participant selector, and Regras content.

### FR Coverage Map

{{requirements_coverage_map}}

## Epic List

{{epics_list}}

<!-- Repeat for each epic in epics_list (N = 1, 2, 3...) -->

## Epic {{N}}: {{epic_title_N}}

{{epic_goal_N}}

<!-- Repeat for each story (M = 1, 2, 3...) within epic N -->

### Story {{N}}.{{M}}: {{story_title_N_M}}

As a {{user_type}},
I want {{capability}},
So that {{value_benefit}}.

**Acceptance Criteria:**

<!-- for each AC on this story -->

**Given** {{precondition}}
**When** {{action}}
**Then** {{expected_outcome}}
**And** {{additional_criteria}}

<!-- End story repeat -->
