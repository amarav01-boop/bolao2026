---
stepsCompleted: [1, 2, 3, 4, 5, 6]
workflowType: 'implementation-readiness'
lastStep: 6
status: 'complete'
completedAt: '2026-05-23'
project_name: 'bolao2026'
user_name: 'Vitao'
date: '2026-05-23'
includedDocuments:
  prd: "_bmad-output/planning-artifacts/prds/prd-bolao2026-2026-05-23/prd.md"
  architecture: "_bmad-output/planning-artifacts/architecture.md"
  epics: "_bmad-output/planning-artifacts/epics.md"
  ux: null
  designReference: "kb_copa_mundo/codebase-copa-anterior/exemplo_design.html"
---

# Implementation Readiness Assessment Report

**Date:** 2026-05-23
**Project:** bolao2026

## Document Discovery

### Selected Documents

- PRD: `_bmad-output/planning-artifacts/prds/prd-bolao2026-2026-05-23/prd.md`
- Architecture: `_bmad-output/planning-artifacts/architecture.md`
- Epics and Stories: `_bmad-output/planning-artifacts/epics.md`
- UX Design: not available as a standalone document
- Supplemental Design Reference: `kb_copa_mundo/codebase-copa-anterior/exemplo_design.html`

### Discovery Findings

- No duplicate whole/sharded PRD, architecture, epics, or UX document conflicts were found.
- No standalone UX design document was found.
- The supplemental HTML design example will be considered as visual/design-system reference during readiness review.

## PRD Analysis

### Functional Requirements

FR-1: Participant self-registration. Visitors can create a Participant account when registration is open. Registration requires username, password, nickname, and avatar. Username must be unique. Nickname must be unique or clearly disambiguated; the PRD assumes unique nickname for launch. When registration is closed, the sign-up form is replaced by a clear closed-registration message.

FR-2: Participant login/logout. Participants can login and logout with username/password. Authenticated Participants can access participant navigation. Unauthenticated users attempting protected pages are sent to login.

FR-3: Admin login. Admin can login through a protected route using a specific admin username/password. Admin screens are not shown in regular participant navigation. Non-admin Participants cannot access admin routes.

FR-4: Avatar selection. Participants choose from a curated avatar set during registration. Avatar appears in Ranking and relevant public references. Uploading custom images is out of scope for MVP.

FR-5: Admin manages prediction windows. Admin can create/open/close a Prediction Window for a Phase and set its deadline. Only one active editable Prediction Window should be shown as primary on Home. Closed/locked windows cannot be edited by Participants. Admin can manually open windows for knockout phases after matchups are known.

FR-6: Phase-based prediction input. Participants can enter Match score Predictions for the active Phase. Group Phase is segmented by Group tabs/sections. Knockout phases use the matches manually configured by Admin. Participants can edit Predictions until the deadline/lock.

FR-7: Group-level save state. Prediction input saves at the Group/form-section level and shows save state. UI shows states such as "Unsaved changes", "Saving...", and "Saved". Participants can leave and return to the last edited group/section. Save failure must be visible to the Participant.

FR-8: Deadline locking and grace window. At deadline, the Prediction Window locks, with a short server-side grace window for in-flight saves. Server time determines lock behavior. Saves initiated near deadline may be accepted within a short grace window, assumed as 30 seconds. Participants cannot edit locked predictions.

FR-9: Missing prediction default. Missing Match Predictions become Defaulted 0x0 when the Prediction Window locks. Before lock, missing rows warn that they will become 0x0. After lock, Defaulted 0x0 remains distinguishable from Explicit 0x0. The distinction is available at least in admin and reveal views, with an assumption that it is visible to Participants in Todos os Palpites.

FR-10: Extra predictions. Participants can submit Extra Predictions for champion, top scorer, and top scorer goals. Extras are editable until their configured deadline, assumed to share the first phase deadline. Extras are visible after Admin reveal, assumed to follow the same reveal switch as match predictions. Extras scoring rules must be configurable or documented before launch.

FR-11: Phase status card. Home shows the current Phase and Prediction Window state. States include registration/prediction open, deadline near, locked, live/scoring, next phase pending. Card shows deadline, completion/missing status when predictions are open. Card links to the next relevant action.

FR-12: Competition-aware attention message. Home shows a prominent message tied to the Participant's current state. Missing predictions before deadline are prioritized. Ranking change and result updates are shown when relevant. Message copy can be playful but must remain clear.

FR-13: Ranking snapshot. Home shows the Participant's current rank, points, movement, and nearby context. Snapshot links to full Ranking. Movement is based on previous Ranking Snapshot. If no ranking exists yet, Home shows a pre-competition empty state.

FR-14: Daily prediction distribution. Home shows prediction distribution for today's matches after predictions are locked/revealed. Distribution uses locked Predictions to show Team A win %, draw %, Team B win %. Distribution is hidden or unavailable before reveal. Percentages handle Defaulted 0x0 as normal Predictions while preserving default metadata.

FR-15: Acertou na Mosca highlights. Home highlights Participants who predicted completed Match scores exactly. Highlights are shown after Match Result is entered. Highlight label uses "Acertou na Mosca". If no exact hits exist, the section can be hidden or show a light empty state.

FR-16: Full ranking. Participants can view full Ranking with nickname/avatar, rank, points, movement, and status chip. Ranking uses Dense Tie Ranking. Tied Participants share the same rank number. Movement compares current rank to previous ranking state.

FR-17: Ranking status chips. System assigns simple objective status chips. Examples include "On fire", "Rising", "Falling", "Watch your back", "Holding steady". Chips are generated from points/rank movement rules, not admin-authored insults. Chips can be omitted if data is insufficient.

FR-18: Manual reveal switch. Admin can enable prediction visibility for a locked Phase. Backend must not expose other Participants' Predictions before reveal is enabled. Reveal is per Phase. Before reveal, Todos os Palpites shows a locked/unavailable state.

FR-19: Participant-selected prediction view. Participants can select a Participant and view that Participant's revealed locked Predictions. View is available only for revealed Phases. Predictions are grouped by Phase/Group where applicable. Explicit 0x0 and Defaulted 0x0 are distinguishable. Extras are included if revealed.

FR-20: Registration toggle. Admin can open or close new participant registration. Existing Participants can still login when registration is closed. Closed registration message is shown to new visitors.

FR-21: Match setup. Admin can create or edit Matches for a Phase. Group Phase uses configured Group/Match data. Knockout Matches can be manually created/updated when teams are known. Prediction Window should not open for a Phase with no matches.

FR-22: Result entry. Admin can enter Match Result for a Match. Result entry triggers or enables point calculation. Admin can edit/correct a previously entered result. Corrections trigger Ranking recalculation.

FR-23: Ranking recalculation. System calculates Match points, accumulated points, rank, and movement after result updates. The PRD assumes exact score = 3 points, correct outcome = 1 point, otherwise 0 points, based on 2022 DB values. Extra Prediction scoring is handled separately and remains TBD from rules.

FR-24: Rules and dispute notes. Admin can preserve simple notes for rule changes, corrections, or disputes. MVP can be lightweight text notes, not a full audit product. Result corrections should produce a visible Participant notice.

FR-25: Rules display. Participants can view rules from Regras. Rules include match scoring, extras scoring, deadlines, 0x0 default, reveal behavior, and tie ranking. Rules should be editable by Admin or easy to update before launch. Static content is assumed acceptable for initial launch if faster.

Total FRs: 25

### Non-Functional Requirements

NFR-1: Responsive UX. Participant flows must work on mobile width as first-class layout.

NFR-2: Security. Passwords must not be stored in plaintext. Admin route must be access-controlled.

NFR-3: Fairness. Backend must enforce deadline lock and reveal state; frontend hiding alone is insufficient.

NFR-4: Reliability. Prediction save failures must be visible before lock.

NFR-5: Data integrity. Result corrections must recalculate dependent ranking data consistently.

NFR-6: Accessibility. Core forms and navigation should be keyboard operable and readable with adequate contrast.

NFR-7: Performance. Core pages should load quickly for a small friends group; avoid heavy assets in prediction entry.

Total NFRs: 7

### Additional Requirements

- Launch MVP target is 2026-05-25.
- Must support participant registration/login/logout, nickname/avatar selection, admin login/protection, registration toggle, phase/window/deadline management, match prediction input, group segmentation, autosave/save state, deadline lock, missing-to-0x0 behavior, extras, manual result entry, ranking calculation/display, Home, Todos os Palpites reveal, and Regras page.
- Should launch if time allows: ranking status chips, Acertou na Mosca highlights, daily prediction distribution, and ranking correction notice polish.
- Deferred: automated FIFA result ingestion, WhatsApp posting or push notification integration, pinned rival mechanic, custom avatar uploads, full participant profile pages, social feed, automated knockout bracket generation, and multi-admin permissions.
- Counter-metrics require prioritizing scoring reliability before social features and avoiding automation that changes competition state without admin approval.

### PRD Completeness Assessment

The PRD is broad and implementation-ready for MVP planning. Functional requirements are clearly numbered and connected to user journeys, success metrics, non-goals, assumptions, and launch scope. The largest readiness risks are not missing feature categories; they are unresolved rule details: exact 2026 scoring rules for extras, whether explicit/defaulted 0x0 is visible to all participants, rules editing versus static content, registration closure timing, and launch avatar set. These are manageable if captured as early implementation decisions or admin-configurable launch defaults.

## Epic Coverage Validation

### Coverage Matrix

| FR Number | PRD Requirement | Epic Coverage | Status |
| --------- | --------------- | ------------- | ------ |
| FR-1 | Participant self-registration | Epic 1, Story 1.1 | Covered |
| FR-2 | Participant login/logout | Epic 1, Story 1.2 | Covered |
| FR-3 | Admin login | Epic 2, Story 2.1 | Covered |
| FR-4 | Avatar selection | Epic 1, Story 1.3 | Covered |
| FR-5 | Admin manages prediction windows | Epic 2, Stories 2.3 and 2.5 | Covered |
| FR-6 | Phase-based prediction input | Epic 3, Stories 3.1 and 3.2 | Covered |
| FR-7 | Group-level save state | Epic 3, Story 3.3 | Covered |
| FR-8 | Deadline locking and grace window | Epic 2, Story 2.3; Epic 3, Story 3.4 | Covered |
| FR-9 | Missing prediction default | Epic 3, Story 3.5 | Covered |
| FR-10 | Extra predictions | Epic 3, Story 3.6 | Covered |
| FR-11 | Phase status card | Epic 5, Story 5.3 | Covered |
| FR-12 | Competition-aware attention message | Epic 5, Story 5.3 | Covered |
| FR-13 | Ranking snapshot | Epic 5, Story 5.4 | Covered |
| FR-14 | Daily prediction distribution | Epic 5, Story 5.5 | Covered |
| FR-15 | Acertou na Mosca highlights | Epic 5, Story 5.6 | Covered |
| FR-16 | Full ranking | Epic 5, Story 5.1 | Covered |
| FR-17 | Ranking status chips | Epic 5, Story 5.2 | Covered |
| FR-18 | Manual reveal switch | Epic 6, Stories 6.1 and 6.3 | Covered |
| FR-19 | Participant-selected prediction view | Epic 6, Stories 6.2 and 6.3 | Covered |
| FR-20 | Registration toggle | Epic 2, Stories 2.2 and 2.5 | Covered |
| FR-21 | Match setup | Epic 2, Stories 2.4 and 2.5 | Covered |
| FR-22 | Result entry | Epic 4, Stories 4.1 and 4.4 | Covered |
| FR-23 | Ranking recalculation | Epic 4, Stories 4.2, 4.3, and 4.4 | Covered |
| FR-24 | Rules and dispute notes | Epic 4, Story 4.5 | Covered |
| FR-25 | Rules display | Epic 6, Story 6.4 | Covered |

### Missing Requirements

No missing PRD functional requirements were found in the epic/story coverage.

### Coverage Statistics

- Total PRD FRs: 25
- FRs covered in epics: 25
- Coverage percentage: 100%

### Coverage Assessment

Epic coverage is complete at the functional-requirement level. The coverage is also structurally coherent: access requirements map to Epic 1, admin setup to Epic 2, prediction entry to Epic 3, scoring and corrections to Epic 4, ranking/home engagement to Epic 5, and reveal/rules transparency to Epic 6.

## UX Alignment Assessment

### UX Document Status

Formal UX design document: Not found.

Supplemental design reference found: `kb_copa_mundo/codebase-copa-anterior/exemplo_design.html`.

### UX Implied By Product Scope

UX is strongly implied because this is a user-facing responsive website with participant registration, mobile prediction entry, Home, Ranking, Todos os Palpites, Regras, and admin control pages. The PRD explicitly requires mobile-first participant flows, group tabs/sections, visible save state, status cards, attention messages, ranking movement/status chips, participant selector, clear locked/unrevealed states, and readable rules.

### PRD and Epic UX Coverage

The PRD and epics include UX-oriented acceptance criteria for:

- Mobile prediction entry without horizontal overflow.
- Group Phase segmentation by group tabs or sections.
- Group-level save states: unsaved, saving, saved, and failure.
- Home phase status card and participant-specific attention message.
- Ranking rows with nickname/avatar, rank, points, movement, and status chips.
- Todos os Palpites participant selector and locked/unrevealed empty states.
- Regras readability on mobile.

### Architecture Support For UX

The architecture supports the UX needs through:

- Vite Vanilla frontend with plain HTML/CSS/JavaScript.
- `client/src/pages/` for participant/admin screens.
- `client/src/components/` for app shell, bottom nav, status message, save state, phase status card, ranking row, prediction form, participant selector, and empty states.
- Mobile-first semantic HTML/CSS guidance.
- CSS split into base, layout, forms, ranking, and admin files.
- Lightweight frontend with no heavy UI framework.

### Supplemental Design Reference Assessment

`exemplo_design.html` provides useful visual direction: dark theme, vivid football-like accent colors, Inter and Space Grotesk typography, card/surface tokens, button styles, match card, ranking table, prediction chips, spacing tokens, and a social/competitive tone.

This helps reduce UX ambiguity, but it is not a complete UX specification because it does not define screen-by-screen layouts, interaction states for prediction saving/locking, admin flows, responsive breakpoints, accessibility behavior, or final component rules.

### Alignment Issues

- No blocking UX/architecture conflict was found.
- There is a mild documentation tension: architecture says not to introduce a design system unless approved, while the new HTML file is explicitly a design-system approach reference. This can be resolved by treating it as local CSS tokens and component styling guidance, not as a separate design-system framework.
- The HTML design sample appears to contain text encoding artifacts when read from the terminal. Implementation should verify the file in browser/editor and normalize text encoding if design text is reused.

### Warnings

- Warning: No standalone UX document exists, even though the project is UI-heavy and mobile-first.
- Warning: The design reference does not replace detailed responsive screen specs for the highest-risk flows: Group Phase prediction entry, admin result entry, deadline lock states, and Todos os Palpites reveal states.
- Recommendation: Before or during early implementation, convert the design reference into a lightweight UI guideline section or keep it linked from the first frontend story as the visual source of truth.

## Epic Quality Review

### Epic Structure Validation

All six epics are user-value oriented rather than purely technical milestones:

- Epic 1 enables participants to access the product with identity.
- Epic 2 enables admin control over competition setup.
- Epic 3 enables participants to enter predictions and trust deadline behavior.
- Epic 4 enables admin scoring, corrections, and dispute handling.
- Epic 5 enables ranking/home engagement.
- Epic 6 enables prediction reveal and rules transparency.

No epic is titled or scoped as a raw technical milestone such as "database setup", "API development", or "infrastructure". The epic flow is logical for product delivery: participant identity, admin setup, prediction entry, scoring, engagement, and reveal/rules.

### Story Quality Assessment

Most stories have clear user roles, user value, and testable Given/When/Then acceptance criteria. Acceptance criteria generally include happy paths, locked/empty states, invalid inputs, mobile readability, or authorization boundaries.

Story sizing is mostly appropriate. The largest stories are:

- Story 2.3: Phase and Prediction Window Management.
- Story 2.4: Match Setup for Group and Knockout Phases.
- Story 3.4: Deadline Lock and Grace Window.
- Story 4.3: Ranking Recalculation.

These are still plausible implementation stories, but should be handled carefully during story creation to avoid bundling too much database, backend, and UI work into one oversized task.

### Dependency Analysis

The epic order is broadly valid:

- Epic 1 can establish identity and session foundation.
- Epic 2 can build on identity/admin access.
- Epic 3 depends naturally on configured phases/windows/matches from Epic 2.
- Epic 4 depends on predictions and matches from earlier epics.
- Epic 5 depends on ranking/result data from Epic 4.
- Epic 6 depends on locked predictions and reveal controls.

No circular dependencies were found.

### Quality Findings

#### Critical Violations

None found. The epics are not technical-only, coverage is complete, and there are no obvious circular dependencies.

#### Major Issues

1. Missing initial project setup story.

Architecture explicitly selects Vite Vanilla frontend plus Express backend and says project initialization should be the first implementation story. The current epics begin with participant registration, but a greenfield project needs an initial setup story before feature stories can be implemented consistently.

Impact: Developers or AI agents may create project structure inconsistently before Story 1.1.

Recommendation: Add a preliminary implementation story before Story 1.1, such as "Story 0.1: Initialize Vite Client, Express Server, PostgreSQL Config, and Baseline Project Structure", or make it Story 1.0 in Epic 1.

2. Story 1.1 includes closed-registration behavior before admin registration toggle exists.

Story 1.1 requires the registration page to react when registration is closed, while the admin control for opening/closing registration is Story 2.2. This is a mild forward dependency unless Story 1.1 includes a seeded/configurable registration status.

Impact: Story 1.1 cannot fully satisfy all acceptance criteria without either a temporary configuration/default setting or a future admin toggle.

Recommendation: In Story 1.1, implement registration status read from a persisted/app setting with default `open`; Story 2.2 later adds the admin UI to update that setting. This preserves independence.

3. Environment and migration setup is implied, not explicitly storied.

The architecture requires PostgreSQL connection, migrations, seeds, `.env.example`, session storage, and app configuration. The epics mention product capabilities but do not explicitly place these enabling tasks in a story.

Impact: Early feature stories may duplicate setup or skip migration discipline.

Recommendation: Include environment, migration, and session-store setup in the new initial setup story.

#### Minor Concerns

1. No standalone UX story or design guideline story exists.

The design reference file helps, but the first frontend story should explicitly reference `exemplo_design.html` and establish local CSS tokens/components so later screens remain visually consistent.

2. Some "Should launch if time allows" items are embedded as normal stories.

Ranking status chips, daily prediction distribution, and Acertou na Mosca highlights are represented as stories even though the PRD labels them "Should Launch If Time Allows". This is acceptable, but sprint planning should sequence them after the must-launch path.

3. Extras scoring remains intentionally unresolved.

Story 3.6 wisely avoids hardcoding scoring into entry UI, but scoring/rules stories must preserve this as an open decision until the actual rule is confirmed or admin-configured.

### Best Practices Compliance Checklist

| Area | Status | Notes |
| ---- | ------ | ----- |
| Epics deliver user value | Pass | All six epics are user-facing or admin-user-facing outcomes. |
| Epic independence | Pass with caveat | Overall sequence is valid; Story 1.1 closed-registration state needs seeded/config setting to avoid depending on Story 2.2. |
| Stories appropriately sized | Pass with caveat | Several stories are medium-large and should be decomposed during detailed story creation if needed. |
| No forward dependencies | Pass with caveat | Registration closed-state behavior is the only meaningful forward-dependency risk. |
| Database tables created when needed | Needs attention | Epics do not explicitly say this, but architecture does. Story creation should enforce it. |
| Clear acceptance criteria | Pass | Most stories use Given/When/Then with testable outcomes. |
| Traceability to FRs maintained | Pass | 100% FR coverage. |

### Epic Quality Summary

The epic/story set is good enough to proceed, but implementation readiness improves materially if the sprint starts with an explicit project setup story and Story 1.1 is framed to read registration status from a setting before the admin toggle UI exists.

## Summary and Recommendations

### Overall Readiness Status

READY WITH TARGETED FIXES

The product planning package is strong enough to move toward implementation. PRD coverage is complete, architecture is coherent, and every functional requirement maps to epics/stories. However, sprint planning should not begin blindly from Story 1.1. The implementation sequence needs a small setup correction first.

### Critical Issues Requiring Immediate Action

No critical blocking issues were found.

### Major Issues To Address Before Or During Sprint Planning

1. Add an initial project setup story.

The architecture says the first implementation work should initialize the Vite client, Express server, PostgreSQL connection, migrations, environment config, and session foundation. The current epics start with participant registration, which assumes the project shell already exists.

Recommended story:

`Story 0.1: Initialize Vite Client, Express Server, PostgreSQL Config, and Baseline Project Structure`

This story should include:

- Vite vanilla client scaffold.
- Express server scaffold.
- Root/client/server package scripts.
- `.env.example`.
- PostgreSQL pool/config.
- Migration/seed structure.
- Session middleware foundation.
- Baseline CSS tokens using `exemplo_design.html` as visual reference.

2. Remove the forward-dependency risk in Story 1.1.

Story 1.1 includes closed-registration behavior, but the admin registration toggle is Story 2.2. Preserve story independence by having Story 1.1 read registration status from a persisted/app setting with default `open`. Story 2.2 can later add admin UI to update that same setting.

3. Make the design reference explicit in early frontend work.

There is no standalone UX design document, but `kb_copa_mundo/codebase-copa-anterior/exemplo_design.html` gives concrete visual direction. The initial setup or first frontend story should convert its colors, typography, spacing, buttons, cards, ranking table, and chips into local CSS tokens/components.

### Recommended Next Steps

1. Update epics or sprint plan to include the initial setup story before Story 1.1.

2. In sprint planning, sequence must-launch stories before should-launch stories:
   - Must-launch path: setup, auth/registration, admin setup, prediction entry, deadline/defaulting, results, ranking, Home basics, reveal, rules.
   - Later path: status chips, daily prediction distribution, Acertou na Mosca highlights, correction notice polish.

3. Carry unresolved rules as explicit implementation constraints:
   - Extras scoring is TBD.
   - Exact 2026 scoring rules still need confirmation.
   - Avatar set still needs selection.
   - Static rules page is acceptable only if rules content is easy to update.

4. Use `architecture.md` as the implementation authority for boundaries:
   - Services own business rules.
   - Repositories own SQL.
   - Backend enforces deadline/reveal/admin access.
   - PostgreSQL is the source of truth.

5. Run sprint planning next, with the setup story inserted first.

### Final Note

This assessment identified no critical blockers, three major readiness fixes, and three minor concerns. The plan is suitable to proceed into sprint planning once the initial setup story is added or explicitly handled as the first sprint item. The strongest product risk is not missing scope; it is sequencing: without a setup story, the first implementation task will force agents to invent structure while building registration.

**Assessor:** BMad Implementation Readiness workflow
**Completed:** 2026-05-23
