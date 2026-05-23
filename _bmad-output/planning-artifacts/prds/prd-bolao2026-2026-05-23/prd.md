---
title: "Bolao 2026 PRD"
status: draft
created: 2026-05-23
updated: 2026-05-23
---

# PRD: Bolao 2026

## 0. Document Purpose

This PRD defines the launch MVP for Bolao 2026, a responsive World Cup prediction pool website for a friends group. It is intended for immediate implementation planning, UX detailing, and story creation. It builds on the product brief at `_bmad-output/planning-artifacts/briefs/brief-bolao2026-2026-05-23/brief.md` and the brainstorming artifact at `_bmad-output/brainstorming/brainstorming-session-2026-05-23-104034.md`. Because launch target is 2026-05-25, requirements emphasize implementable launch scope over future social/agentic polish.

## 1. Vision

Bolao 2026 gives a long-running friends' World Cup prediction pool a trustworthy, mobile-first home. Participants should be able to register quickly, enter predictions by tournament phase, understand deadlines, see how rankings move, and enjoy the social drama of exact hits, group sentiment, and playful ranking status.

The product is not trying to become a generic sports platform. Its strength is the group's existing ritual: nicknames, rivalry, admin-controlled updates, exact-result celebrations, and phase-by-phase anticipation. The MVP should preserve that culture while removing friction from mobile prediction entry, ranking visibility, and admin operations.

## 2. Target Users

### 2.1 Primary Persona: Participant

A friend participating in the bolao from mobile or desktop. They want to enter predictions without confusion, return quickly during the World Cup, see their ranking position, compare with others after predictions lock, and enjoy the group's banter.

### 2.2 Admin Persona

The organizer, a single protected admin user. The admin needs simple control over registration, phase prediction windows, deadlines, match setup, results, ranking updates, prediction reveal, and dispute/correction handling.

### 2.3 Jobs To Be Done

- As a participant, I want to complete predictions before deadline so I remain competitive.
- As a participant, I want to know my ranking and movement so I can feel the competition.
- As a participant, I want to inspect others' locked predictions so comparison feels transparent.
- As a participant, I want to see exact-hit highlights and daily prediction sentiment so match days feel alive.
- As admin, I want to control deadlines, results, reveal timing, and corrections so the competition remains trusted.

### 2.4 Non-Users For v1

- Public visitors outside the invited friends group.
- Multiple admins or delegated moderators.
- Users expecting live official match data automation.

### 2.5 Key User Journeys

**UJ-1. Participant joins the bolao.**
Visitor opens the site while registration is open, creates an account with username/password, chooses a public nickname and avatar, then lands on Home. The value lands when the participant sees the current phase status and knows what action to take next.

**UJ-2. Participant fills Group Phase predictions on mobile.**
Authenticated participant opens Palpites, sees the active phase and deadline, navigates group-by-group, enters scores, sees group-level save state, and leaves/returns without losing progress. The value lands when the user sees predictions are saved and understands missing games will default to `0x0`.

**UJ-3. Deadline locks predictions.**
At deadline, the active prediction window locks. Saved predictions become official, empty predictions become defaulted `0x0`, and explicit `0x0` predictions remain distinguishable from defaults. The value lands when participants cannot edit locked picks and the rules are visible.

**UJ-4. Admin reveals locked predictions.**
After deadline, admin enables the reveal switch. Participants open Todos os Palpites, select another participant, and inspect that participant's locked predictions. The value lands when comparison is available without exposing pre-deadline choices.

**UJ-5. Admin enters result and ranking updates.**
Admin enters or corrects a match result. The system calculates prediction points, updates ranking, records movement, and updates homepage match-day highlights. The value lands when participants see rank, points, movement, and exact-hit highlights.

## 3. Glossary

- **Participant** - Registered non-admin user competing in the bolao.
- **Admin** - Single protected organizer account with competition control permissions.
- **Nickname** - Public display name used in ranking, prediction reveal, and highlights.
- **Avatar** - Curated image selected by a Participant for public identity.
- **Phase** - Tournament prediction stage, such as Group Phase, round of 32, round of 16, quarterfinal, semifinal, final.
- **Group** - World Cup group used to segment Group Phase prediction input.
- **Match** - A scheduled game between two teams.
- **Prediction Window** - Admin-controlled period during which Participants can edit predictions for a Phase.
- **Prediction** - Participant's score pick for a Match.
- **Explicit 0x0** - A Prediction intentionally entered as `0x0`.
- **Defaulted 0x0** - A missing Prediction converted to `0x0` at deadline.
- **Extra Prediction** - Tournament-level pick for champion, top scorer, or top scorer goals.
- **Match Result** - Official score entered by Admin for a Match.
- **Ranking** - Ordered standings based on accumulated points.
- **Dense Tie Ranking** - Ranking convention where tied users share rank and the next rank does not skip, e.g. `1, 1, 2`.
- **Reveal Switch** - Admin control that makes locked predictions visible to Participants.
- **Acertou na Mosca** - Highlight label for an exact score prediction.

## 4. Information Architecture

### 4.1 Participant Navigation

- **Home** - Phase status, action message, ranking snapshot, today's prediction distribution, Acertou na Mosca highlights.
- **Palpites** - Active phase prediction input and locked-state messaging.
- **Ranking** - Full standings with points, movement, status chips, nickname/avatar identity.
- **Todos os Palpites** - Participant selector and revealed locked predictions.
- **Regras** - Scoring, deadlines, reveal behavior, `0x0` default, and extras rules.

### 4.2 Admin Navigation

Admin is accessed through a protected route outside participant navigation. Admin pages cover registration toggle, prediction windows, deadlines, match setup, results, reveal switch, and corrections.

## 5. Features and Requirements

### 5.1 Access and Identity

**Description:** Participants self-register while registration is open. Each account has username/password, public nickname, and curated avatar. Admin uses a separate protected account. Realizes UJ-1.

#### FR-1: Participant self-registration

Visitors can create a Participant account when registration is open.

**Consequences:**
- Registration requires username, password, nickname, and avatar.
- Username must be unique.
- Nickname must be unique or clearly disambiguated. [ASSUMPTION: unique nickname is required for launch.]
- When registration is closed, the sign-up form is replaced by a clear closed-registration message.

#### FR-2: Participant login/logout

Participants can login and logout with username/password.

**Consequences:**
- Authenticated Participants can access participant navigation.
- Unauthenticated users attempting protected pages are sent to login.

#### FR-3: Admin login

Admin can login through a protected route using a specific admin username/password.

**Consequences:**
- Admin screens are not shown in regular participant navigation.
- Non-admin Participants cannot access admin routes.

#### FR-4: Avatar selection

Participants choose from a curated avatar set during registration.

**Consequences:**
- Avatar appears in Ranking and relevant public references.
- Uploading custom images is out of scope for MVP.

### 5.2 Prediction Windows and Prediction Entry

**Description:** Admin opens a Prediction Window for each Phase. Participants enter Match Predictions while the window is open. Group Phase input is segmented by Group. Realizes UJ-2 and UJ-3.

#### FR-5: Admin manages prediction windows

Admin can create/open/close a Prediction Window for a Phase and set its deadline.

**Consequences:**
- Only one active editable Prediction Window should be shown as primary on Home. [ASSUMPTION: at most one active editable phase at a time for MVP.]
- Closed/locked windows cannot be edited by Participants.
- Admin can manually open windows for knockout phases after matchups are known.

#### FR-6: Phase-based prediction input

Participants can enter Match score Predictions for the active Phase.

**Consequences:**
- Group Phase is segmented by Group tabs/sections.
- Knockout phases use the matches manually configured by Admin.
- Participants can edit Predictions until the deadline/lock.

#### FR-7: Group-level save state

Prediction input saves at the Group/form-section level and shows save state.

**Consequences:**
- UI shows states such as "Unsaved changes", "Saving...", and "Saved".
- Participants can leave and return to the last edited group/section.
- Save failure must be visible to the Participant.

#### FR-8: Deadline locking and grace window

At deadline, the Prediction Window locks, with a short server-side grace window for in-flight saves.

**Consequences:**
- Server time determines lock behavior.
- Saves initiated near deadline may be accepted within a short grace window. [ASSUMPTION: 30 seconds.]
- Participants cannot edit locked predictions.

#### FR-9: Missing prediction default

Missing Match Predictions become Defaulted 0x0 when the Prediction Window locks.

**Consequences:**
- Before lock, missing rows warn that they will become `0x0`.
- After lock, Defaulted 0x0 remains distinguishable from Explicit 0x0.
- The distinction is available at least in admin and reveal views. [ASSUMPTION: visible to Participants in Todos os Palpites.]

#### FR-10: Extra predictions

Participants can submit Extra Predictions for champion, top scorer, and top scorer goals.

**Consequences:**
- Extras are editable until their configured deadline. [ASSUMPTION: extras share the first phase deadline.]
- Extras are visible after Admin reveal. [ASSUMPTION: extras follow the same reveal switch as match predictions.]
- Extras scoring rules must be configurable or documented before launch.

### 5.3 Home

**Description:** Home is the participant command center. It reflects current phase state, next action, ranking snapshot, daily prediction sentiment, and exact-hit highlights.

#### FR-11: Phase status card

Home shows the current Phase and Prediction Window state.

**Consequences:**
- States include registration/prediction open, deadline near, locked, live/scoring, next phase pending.
- Card shows deadline, completion/missing status when predictions are open.
- Card links to the next relevant action.

#### FR-12: Competition-aware attention message

Home shows a prominent message tied to the Participant's current state.

**Consequences:**
- Missing predictions before deadline are prioritized.
- Ranking change and result updates are shown when relevant.
- Message copy can be playful but must remain clear.

#### FR-13: Ranking snapshot

Home shows the Participant's current rank, points, movement, and nearby context.

**Consequences:**
- Snapshot links to full Ranking.
- Movement is based on previous Ranking Snapshot.
- If no ranking exists yet, Home shows a pre-competition empty state.

#### FR-14: Daily prediction distribution

Home shows prediction distribution for today's matches after predictions are locked/revealed.

**Consequences:**
- Distribution uses locked Predictions to show Team A win %, draw %, Team B win %.
- Distribution is hidden or unavailable before reveal.
- Percentages handle Defaulted 0x0 as normal Predictions while preserving default metadata.

#### FR-15: Acertou na Mosca highlights

Home highlights Participants who predicted completed Match scores exactly.

**Consequences:**
- Highlights are shown after Match Result is entered.
- Highlight label uses "Acertou na Mosca".
- If no exact hits exist, the section can be hidden or show a light empty state.

### 5.4 Ranking

**Description:** Ranking is the emotional core: it shows standings, movement, points, and playful status.

#### FR-16: Full ranking

Participants can view full Ranking with nickname/avatar, rank, points, movement, and status chip.

**Consequences:**
- Ranking uses Dense Tie Ranking.
- Tied Participants share the same rank number.
- Movement compares current rank to previous ranking state.

#### FR-17: Ranking status chips

System assigns simple objective status chips.

**Consequences:**
- Examples: "On fire", "Rising", "Falling", "Watch your back", "Holding steady".
- Chips are generated from points/rank movement rules, not admin-authored insults.
- Chips can be omitted if data is insufficient.

### 5.5 Prediction Reveal

**Description:** After lock, Admin manually reveals predictions. Participants inspect others' locked predictions from a dedicated section. Realizes UJ-4.

#### FR-18: Manual reveal switch

Admin can enable prediction visibility for a locked Phase.

**Consequences:**
- Backend must not expose other Participants' Predictions before reveal is enabled.
- Reveal is per Phase. [ASSUMPTION: reveal state is phase-level.]
- Before reveal, Todos os Palpites shows a locked/unavailable state.

#### FR-19: Participant-selected prediction view

Participants can select a Participant and view that Participant's revealed locked Predictions.

**Consequences:**
- View is available only for revealed Phases.
- Predictions are grouped by Phase/Group where applicable.
- Explicit 0x0 and Defaulted 0x0 are distinguishable.
- Extras are included if revealed. [ASSUMPTION: extras appear in the same section.]

### 5.6 Admin Operations

**Description:** Admin controls the competition state and scoring workflow. Realizes UJ-5.

#### FR-20: Registration toggle

Admin can open or close new participant registration.

**Consequences:**
- Existing Participants can still login when registration is closed.
- Closed registration message is shown to new visitors.

#### FR-21: Match setup

Admin can create or edit Matches for a Phase.

**Consequences:**
- Group Phase uses configured Group/Match data.
- Knockout Matches can be manually created/updated when teams are known.
- Prediction Window should not open for a Phase with no matches.

#### FR-22: Result entry

Admin can enter Match Result for a Match.

**Consequences:**
- Result entry triggers or enables point calculation.
- Admin can edit/correct a previously entered result.
- Corrections trigger Ranking recalculation.

#### FR-23: Ranking recalculation

System calculates Match points, accumulated points, rank, and movement after result updates.

**Consequences:**
- [ASSUMPTION: exact score = 3 points, correct outcome = 1 point, otherwise 0 points, based on 2022 DB values.]
- Extra Prediction scoring is handled separately. [ASSUMPTION: scoring TBD from rules PDF.]
- Ranking correction notice appears when recalculation follows a corrected result.

#### FR-24: Rules and dispute notes

Admin can preserve simple notes for rule changes, corrections, or disputes.

**Consequences:**
- MVP can be lightweight text notes, not a full audit product.
- Result corrections should produce a visible Participant notice.

### 5.7 Rules Page

**Description:** Participants need one clear source of truth for scoring, deadlines, reveal behavior, and defaults.

#### FR-25: Rules display

Participants can view rules from Regras.

**Consequences:**
- Rules include match scoring, extras scoring, deadlines, `0x0` default, reveal behavior, and tie ranking.
- Rules should be editable by Admin or easy to update before launch. [ASSUMPTION: static content is acceptable for initial launch if faster.]

## 6. Non-Goals

- No automated FIFA result ingestion for MVP.
- No WhatsApp posting or push notification integration for MVP.
- No public pinned rival mechanic for MVP.
- No custom avatar uploads for MVP.
- No full participant profile pages for MVP.
- No full chat/social feed for MVP.
- No automated knockout bracket generation for MVP.
- No multi-admin permission model for MVP.

## 7. MVP Scope

### 7.1 Must Launch By 2026-05-25

- Participant registration/login/logout.
- Nickname/avatar selection.
- Admin login and protected admin area.
- Registration open/closed toggle.
- Phase/window/deadline management.
- Match prediction input with group segmentation.
- Autosave/save state.
- Deadline lock and missing-to-`0x0` behavior.
- Extras: champion, top scorer, top scorer goals.
- Manual result entry.
- Ranking calculation and display.
- Home with phase status, ranking snapshot, and key messages.
- Todos os Palpites with manual reveal and participant selector.
- Rules page.

### 7.2 Should Launch If Time Allows

- Ranking status chips.
- Acertou na Mosca highlights.
- Daily prediction distribution.
- Ranking correction notice polish.

### 7.3 Defer

- Agentic result scout.
- Recap/WhatsApp text generation.
- Public pinned rival.
- Advanced audit and analytics.
- Full social feed.

## 8. Cross-Cutting NFRs

- **Responsive UX:** Participant flows must work on mobile width as first-class layout.
- **Security:** Passwords must not be stored in plaintext. Admin route must be access-controlled.
- **Fairness:** Backend must enforce deadline lock and reveal state; frontend hiding alone is insufficient.
- **Reliability:** Prediction save failures must be visible before lock.
- **Data integrity:** Result corrections must recalculate dependent ranking data consistently.
- **Accessibility:** Core forms and navigation should be keyboard operable and readable with adequate contrast.
- **Performance:** Core pages should load quickly for a small friends group; avoid heavy assets in prediction entry.

## 9. Success Metrics

**Primary**

- **SM-1:** Launch readiness - Admin can complete setup and at least one Participant can register, enter predictions, lock/reveal, and see ranking by 2026-05-25. Validates FR-1 through FR-25.
- **SM-2:** Prediction completion - A Participant can complete Group Phase predictions on mobile without admin help. Validates FR-5 through FR-10.
- **SM-3:** Scoring trust - Admin can enter/correct results and Participants can understand updated Ranking. Validates FR-16, FR-22, FR-23.

**Secondary**

- **SM-4:** Engagement clarity - Home communicates current phase state and next action without requiring users to inspect multiple pages. Validates FR-11 through FR-15.
- **SM-5:** Transparency - Participants cannot see others' predictions before reveal and can inspect them after reveal. Validates FR-18, FR-19.

**Counter-metrics**

- **SM-C1:** Do not optimize for social features before core scoring reliability. Counterbalances SM-4.
- **SM-C2:** Do not add automation that changes competition state without admin approval. Counterbalances future agentic goals.

## 10. Open Questions

1. What are the exact match scoring rules from `regras-bolao-2022.pdf` and intended 2026 rules?
2. What are the exact scoring rules and deadlines for champion, top scorer, and top scorer goals?
3. Should explicit/defaulted `0x0` be visible to all Participants or only Admin?
4. Is static Rules content acceptable for the 2026-05-25 launch, or must Admin edit rules in UI?
5. Should registration remain open after the first prediction deadline, or should Admin close it manually?
6. What avatar set will be available at launch?

## 11. Assumptions Index

- FR-1: Nickname is unique for launch.
- FR-5: At most one active editable Phase at a time.
- FR-8: Deadline grace window is 30 seconds.
- FR-9: Defaulted `0x0` distinction is visible to Participants in Todos os Palpites.
- FR-10: Extras share the first phase deadline.
- FR-10/FR-19: Extras follow the same reveal switch as match predictions and appear in Todos os Palpites.
- FR-18: Reveal state is phase-level.
- FR-23: Match scoring is exact score = 3, correct outcome = 1, otherwise 0, based on old DB values.
- FR-23: Extra Prediction scoring is TBD from rules.
- FR-25: Static rules content is acceptable for initial launch if faster.
