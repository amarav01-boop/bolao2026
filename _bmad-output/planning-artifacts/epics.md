---
stepsCompleted: [1, 2, 3, 4]
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

- No formal Architecture document was found in `_bmad-output/planning-artifacts`; the following architecture recommendations were provided by the user during epic planning.
- Frontend stack recommendation: HTML, CSS, and JavaScript.
- Backend stack recommendation: Node.js.
- Database recommendation: MariaDB/MySQL relational database.
- Implementation should preserve a clear separation between frontend screens, backend business rules, and MariaDB/MySQL persistence.
- Backend services must expose or support participant authentication, admin authorization, prediction windows, predictions, results, ranking calculation, reveal state, and rules content.
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

FR1: Epic 1 - Participant self-registration

FR2: Epic 1 - Participant login/logout

FR3: Epic 2 - Admin login/protected route

FR4: Epic 1 - Avatar selection

FR5: Epic 2 - Prediction windows

FR6: Epic 3 - Phase-based prediction input

FR7: Epic 3 - Group-level save state

FR8: Epic 3 - Deadline locking and grace window

FR9: Epic 3 - Missing prediction default

FR10: Epic 3 - Extra predictions

FR11: Epic 5 - Phase status card

FR12: Epic 5 - Competition-aware attention message

FR13: Epic 5 - Ranking snapshot

FR14: Epic 5 - Daily prediction distribution

FR15: Epic 5 - Acertou na Mosca highlights

FR16: Epic 5 - Full ranking

FR17: Epic 5 - Ranking status chips

FR18: Epic 6 - Manual reveal switch

FR19: Epic 6 - Participant-selected prediction view

FR20: Epic 2 - Registration toggle

FR21: Epic 2 - Match setup

FR22: Epic 4 - Result entry

FR23: Epic 4 - Ranking recalculation

FR24: Epic 4 - Rules/dispute notes

FR25: Epic 6 - Rules display

## Epic List

### Epic 1: Participant Access and Identity

Participants can register, login, choose nickname/avatar, and enter the participant site.

**FRs covered:** FR1, FR2, FR4

### Epic 2: Admin Control Center and Competition Setup

Admin can login, control registration, create/manage phases, prediction windows, deadlines, and match setup.

**FRs covered:** FR3, FR5, FR20, FR21

### Epic 3: Participant Prediction Entry and Deadline Locking

Participants can enter phase predictions, extras, see save state, and rely on deadline/default behavior.

**FRs covered:** FR6, FR7, FR8, FR9, FR10

### Epic 4: Admin Results, Scoring, Corrections, and Disputes

Admin can enter/correct results, trigger scoring/ranking recalculation, and preserve correction/dispute notes.

**FRs covered:** FR22, FR23, FR24

### Epic 5: Ranking, Home, and Match-Day Engagement

Participants can see ranking, movement, status chips, homepage phase state, prediction distributions, and Acertou na Mosca highlights.

**FRs covered:** FR11, FR12, FR13, FR14, FR15, FR16, FR17

### Epic 6: Prediction Reveal and Rules Transparency

Admin can reveal locked predictions, participants can inspect others' picks, and everyone can read rules.

**FRs covered:** FR18, FR19, FR25

## Epic 1: Participant Access and Identity

Participants can register, login, choose nickname/avatar, and enter the participant site.

### Story 1.0: Project Foundation and Design Baseline

**Requirements:** Architecture setup, NFR1, NFR2, NFR3, NFR7

As the implementation team,
I want the project scaffold, backend foundation, MariaDB/MySQL configuration, and visual baseline established,
So that feature stories can be implemented consistently and safely.

**Acceptance Criteria:**

**Given** this is a greenfield implementation
**When** the project foundation is created
**Then** the Vite vanilla client and Express server are initialized
**And** the repository follows the architecture-defined `client/`, `server/`, `tests/`, and `docs/` structure

**Given** the backend requires MariaDB/MySQL
**When** server configuration is created
**Then** `.env.example`, environment loading, MariaDB/MySQL pool setup, migration folder, and seed folder exist
**And** database access is prepared for parameterized SQL through repositories

**Given** the app will use server-side sessions
**When** baseline middleware is configured
**Then** session, security-header, validation, auth, admin-auth, and error-handler placeholders or modules exist
**And** no plaintext password or frontend-only authorization pattern is introduced

**Given** the website needs a consistent visual direction
**When** baseline frontend styles are created
**Then** local CSS tokens and starter component styles are derived from `kb_copa_mundo/codebase-copa-anterior/exemplo_design.html`
**And** the implementation treats it as local CSS guidance, not as a separate UI framework

**Given** future stories will create database tables as needed
**When** the foundation is complete
**Then** no unrelated full-schema implementation is forced upfront
**And** the migration structure is ready for incremental story-owned migrations

### Story 1.1: Participant Registration

**Requirements:** FR1

As a visitor,
I want to create a participant account with username, password, nickname, and avatar,
So that I can join the bolao with a public identity.

**Acceptance Criteria:**

**Given** registration is open
**When** a visitor submits username, password, nickname, and avatar
**Then** a Participant account is created
**And** the password is stored securely, not as plaintext
**And** username uniqueness is enforced
**And** nickname uniqueness or clear disambiguation is enforced
**And** the selected avatar is saved to the participant profile

**Given** registration is closed
**When** a visitor opens the registration page
**Then** the sign-up form is not available
**And** a clear closed-registration message is shown

### Story 1.2: Participant Login and Logout

**Requirements:** FR2

As a participant,
I want to login and logout with my username and password,
So that my predictions and ranking identity are protected.

**Acceptance Criteria:**

**Given** a participant has an account
**When** they submit valid credentials
**Then** they are authenticated
**And** they can access participant navigation

**Given** a participant submits invalid credentials
**When** login fails
**Then** a clear error message is shown
**And** protected pages remain unavailable

**Given** a participant is logged in
**When** they choose logout
**Then** their session ends
**And** protected participant pages require login again

### Story 1.3: Participant Identity Display

**Requirements:** FR4

As a participant,
I want my nickname and avatar to appear in public participant references,
So that rankings and shared views feel personal and recognizable.

**Acceptance Criteria:**

**Given** a participant has selected a nickname and avatar
**When** participant identity is displayed in ranking or public references
**Then** the nickname and avatar are shown consistently

**Given** the participant is viewed on a mobile screen
**When** nickname/avatar appear in lists
**Then** the layout remains readable and does not overflow

**Given** custom avatar upload is out of MVP scope
**When** the participant edits/selects avatar
**Then** only curated avatar options are available

## Epic 2: Admin Control Center and Competition Setup

Admin can login, control registration, create/manage phases, prediction windows, deadlines, and match setup.

### Story 2.1: Admin Login and Protected Admin Area

**Requirements:** FR3

As the admin,
I want to login through a protected admin route,
So that only I can access competition management features.

**Acceptance Criteria:**

**Given** the admin has valid admin credentials
**When** the admin logs in through the admin route
**Then** the admin area is accessible
**And** admin-only navigation/actions are available

**Given** a non-admin participant is authenticated
**When** they attempt to access an admin route
**Then** access is denied
**And** no admin operations are exposed

**Given** an unauthenticated user opens an admin route
**When** the page loads
**Then** they are redirected to admin login or shown an unauthorized state

### Story 2.2: Registration Open/Closed Control

**Requirements:** FR20

As the admin,
I want to open or close participant registration,
So that I can control who can still join the bolao.

**Acceptance Criteria:**

**Given** the admin is authenticated
**When** they set registration to open
**Then** visitors can access the registration form

**Given** the admin is authenticated
**When** they set registration to closed
**Then** new visitors cannot register
**And** existing participants can still login

**Given** registration is closed
**When** a visitor opens registration
**Then** a clear closed-registration message is shown

### Story 2.3: Phase and Prediction Window Management

**Requirements:** FR5, FR8

As the admin,
I want to create/manage prediction windows with deadlines for each phase,
So that participants know when each phase is open and when it locks.

**Acceptance Criteria:**

**Given** the admin is authenticated
**When** they create or edit a prediction window
**Then** they can select the phase, open/closed state, and deadline

**Given** a prediction window deadline is reached
**When** the system evaluates editability
**Then** participant prediction editing is locked according to server time and grace-window rules

**Given** a phase window is closed or locked
**When** a participant opens Palpites
**Then** the UI shows locked/unavailable state rather than editable inputs

### Story 2.4: Match Setup for Group and Knockout Phases

**Requirements:** FR21

As the admin,
I want to create and edit matches for each phase,
So that prediction windows are based on the correct games.

**Acceptance Criteria:**

**Given** the admin is authenticated
**When** they create or edit a match
**Then** they can set phase, group when applicable, teams, date/time, and match status

**Given** a Group Phase match is configured
**When** participants open Palpites
**Then** the match appears under the correct group/section

**Given** a knockout matchup becomes known
**When** the admin updates or creates the match
**Then** the corresponding phase can be opened for predictions

**Given** a phase has no matches
**When** the admin attempts to open its prediction window
**Then** the system prevents opening or clearly warns the admin

### Story 2.5: Admin Competition Setup Overview

**Requirements:** FR5, FR20, FR21

As the admin,
I want a simple setup overview of registration, phases, windows, and match readiness,
So that I can see what is ready before launch.

**Acceptance Criteria:**

**Given** the admin is authenticated
**When** they open the admin dashboard
**Then** they see registration status, active prediction window, upcoming deadlines, and phase/match readiness

**Given** a phase is missing matches or deadline data
**When** the admin views setup overview
**Then** the missing setup item is clearly indicated

**Given** launch is urgent
**When** the admin reviews setup
**Then** the dashboard prioritizes actionable setup gaps over decorative analytics

## Epic 3: Participant Prediction Entry and Deadline Locking

Participants can enter phase predictions, extras, see save state, and rely on deadline/default behavior.

### Story 3.1: Active Phase Prediction Page

**Requirements:** FR6

As a participant,
I want to open the active phase prediction page,
So that I can see what games require predictions before the deadline.

**Acceptance Criteria:**

**Given** a participant is authenticated
**When** they open Palpites
**Then** the active prediction window is shown
**And** the phase name, deadline, and editable/locked state are visible

**Given** no prediction window is active
**When** the participant opens Palpites
**Then** a clear unavailable or next-phase-pending state is shown

**Given** the active phase is Group Phase
**When** matches are displayed
**Then** they are segmented by group tabs or group sections

### Story 3.2: Match Score Prediction Entry

**Requirements:** FR6

As a participant,
I want to enter score predictions for matches in the active phase,
So that my picks count in the bolao.

**Acceptance Criteria:**

**Given** the prediction window is open
**When** the participant enters or changes a match score
**Then** the prediction value is accepted for that match
**And** invalid score values are rejected or clearly indicated

**Given** the participant returns to a previously edited phase
**When** the prediction page loads
**Then** previously saved predictions are displayed

**Given** the participant is on mobile
**When** entering scores
**Then** the input layout remains usable without horizontal overflow

### Story 3.3: Group-Level Autosave and Resume

**Requirements:** FR7

As a participant,
I want predictions to save at the group/section level,
So that I can leave and return without losing work.

**Acceptance Criteria:**

**Given** a participant edits predictions in a group/section
**When** changes are saved
**Then** the UI shows a saved state for that group/section

**Given** changes are still pending
**When** the participant remains on the page
**Then** the UI shows Unsaved changes or Saving state

**Given** saving fails
**When** the system cannot persist changes
**Then** the participant sees a clear failure state before deadline

**Given** the participant returns later
**When** they open Palpites
**Then** the page resumes at or clearly indicates the last edited group/section

### Story 3.4: Deadline Lock and Grace Window

**Requirements:** FR8

As a participant,
I want prediction editing to lock fairly at deadline,
So that the competition remains trusted.

**Acceptance Criteria:**

**Given** the server deadline has not passed
**When** the participant edits predictions
**Then** changes can be saved

**Given** the server deadline has passed outside the grace window
**When** the participant attempts to edit predictions
**Then** editing is blocked
**And** the locked state is shown

**Given** a save was initiated near deadline
**When** it arrives within the configured grace window
**Then** the system may accept it according to the server-side grace rule

**Given** a prediction window is locked
**When** the participant opens Palpites
**Then** the page displays locked predictions or locked-state messaging, not editable inputs

### Story 3.5: Missing Predictions Default to 0x0

**Requirements:** FR9

As a participant,
I want missing predictions to be handled predictably,
So that I understand the consequence of not filling every game.

**Acceptance Criteria:**

**Given** a match prediction is empty before deadline
**When** the participant views the prediction form
**Then** the UI indicates it will default to 0x0 at deadline

**Given** the deadline locks the prediction window
**When** a match prediction is still empty
**Then** the system creates or marks it as Defaulted 0x0

**Given** a participant intentionally enters 0x0
**When** the prediction locks
**Then** it is preserved as Explicit 0x0, not Defaulted 0x0

### Story 3.6: Extra Predictions Entry

**Requirements:** FR10

As a participant,
I want to submit champion, top scorer, and top scorer goals predictions,
So that the bolao includes the extra tournament picks from previous editions.

**Acceptance Criteria:**

**Given** extras are open for prediction
**When** the participant enters champion, top scorer, and top scorer goals
**Then** the values are saved to their Extra Predictions

**Given** extras have already been saved
**When** the participant returns before deadline
**Then** the saved extras are displayed and editable

**Given** the extras deadline has passed
**When** the participant opens extras
**Then** values are locked from editing

**Given** extras scoring rules are not finalized in the PRD
**When** implementing this story
**Then** scoring behavior is not hardcoded into the entry UI

## Epic 4: Admin Results, Scoring, Corrections, and Disputes

Admin can enter/correct results, trigger scoring/ranking recalculation, and preserve correction/dispute notes.

### Story 4.1: Admin Match Result Entry

**Requirements:** FR22

As the admin,
I want to enter match results,
So that participant predictions can be scored.

**Acceptance Criteria:**

**Given** the admin is authenticated
**When** they open result entry for a configured match
**Then** they can enter Team A score and Team B score

**Given** the admin submits a valid match result
**When** the result is saved
**Then** the match stores the official result
**And** the match becomes available for scoring

**Given** invalid score values are submitted
**When** the admin saves
**Then** the result is rejected or clearly marked invalid

### Story 4.2: Match Prediction Point Calculation

**Requirements:** FR23

As the admin,
I want the system to calculate points after a result is entered,
So that scoring is consistent and not manual.

**Acceptance Criteria:**

**Given** a match result is saved
**When** scoring runs for that match
**Then** each participant's prediction receives match points according to configured scoring rules

**Given** the scoring rule is exact score = 3, correct outcome = 1, otherwise 0
**When** predictions are scored
**Then** exact scores receive 3 points
**And** correct outcomes receive 1 point
**And** incorrect outcomes receive 0 points

**Given** scoring rules change before final launch
**When** the rule is updated
**Then** scoring behavior can be updated without rewriting unrelated result-entry UI

### Story 4.3: Ranking Recalculation

**Requirements:** FR23

As the admin,
I want rankings to recalculate after scoring,
So that participants see updated standings.

**Acceptance Criteria:**

**Given** match points have been calculated
**When** ranking recalculation runs
**Then** accumulated points are updated for each participant
**And** dense tie ranking is applied

**Given** two or more participants have equal accumulated points
**When** ranking is displayed
**Then** tied participants share the same rank
**And** the next rank does not skip numbers

**Given** a previous ranking state exists
**When** recalculation completes
**Then** rank movement can be derived for ranking arrows/status

### Story 4.4: Result Correction and Ranking Notice

**Requirements:** FR22, FR23

As the admin,
I want to correct an entered result,
So that mistakes can be fixed transparently.

**Acceptance Criteria:**

**Given** a match result has already been entered
**When** the admin edits and saves a corrected result
**Then** match points are recalculated
**And** accumulated rankings are recalculated

**Given** a correction changes scoring or ranking
**When** participants view the site
**Then** a visible ranking correction notice is available

**Given** the corrected result is saved
**When** admin reviews the match
**Then** the latest result is clearly shown

### Story 4.5: Admin Rule and Dispute Notes

**Requirements:** FR24

As the admin,
I want to record simple notes for rule changes, corrections, and disputes,
So that decisions have context if participants question them.

**Acceptance Criteria:**

**Given** the admin is authenticated
**When** they create a note for a rule change, result correction, or dispute
**Then** the note is saved with text and timestamp

**Given** notes exist
**When** the admin views relevant admin history
**Then** notes are visible for admin reference

**Given** MVP scope is lightweight
**When** notes are implemented
**Then** they do not require a full public audit log

## Epic 5: Ranking, Home, and Match-Day Engagement

Participants can see ranking, movement, status chips, homepage phase state, prediction distributions, and Acertou na Mosca highlights.

### Story 5.1: Full Ranking View

**Requirements:** FR16

As a participant,
I want to view the full ranking,
So that I can see my position and everyone's points.

**Acceptance Criteria:**

**Given** ranking data exists
**When** a participant opens Ranking
**Then** all participants are listed with rank, nickname/avatar, and accumulated points

**Given** participants are tied
**When** ranking is displayed
**Then** dense tie ranking is used

**Given** the page is viewed on mobile
**When** ranking rows render
**Then** the layout remains readable without horizontal overflow

### Story 5.2: Ranking Movement and Status Chips

**Requirements:** FR17

As a participant,
I want to see ranking movement and simple status labels,
So that I can understand who is rising, falling, or holding steady.

**Acceptance Criteria:**

**Given** a previous ranking state exists
**When** ranking is displayed
**Then** each participant can show movement up, down, or steady

**Given** movement or scoring context is available
**When** ranking rows render
**Then** objective status chips such as On fire, Rising, Falling, Watch your back, or Holding steady may be shown

**Given** insufficient movement data exists
**When** ranking rows render
**Then** status chips can be omitted without breaking layout

### Story 5.3: Home Phase Status and Attention Message

**Requirements:** FR11, FR12

As a participant,
I want Home to show the current phase status and the most important action,
So that I know what to do next.

**Acceptance Criteria:**

**Given** a prediction window is open
**When** a participant opens Home
**Then** the phase status card shows phase, deadline, and next action

**Given** the participant has missing predictions before deadline
**When** Home renders
**Then** the attention message prioritizes the missing prediction warning

**Given** no immediate action exists
**When** Home renders
**Then** the attention message shows a useful neutral state such as waiting for next match/result

### Story 5.4: Home Ranking Snapshot

**Requirements:** FR13

As a participant,
I want Home to show my ranking snapshot,
So that I can understand how I'm doing immediately.

**Acceptance Criteria:**

**Given** ranking data exists
**When** a participant opens Home
**Then** their rank, points, and movement are shown

**Given** nearby ranking context is available
**When** Home renders
**Then** the participant can see nearby competitors or a link to full Ranking

**Given** no ranking exists yet
**When** Home renders
**Then** a pre-competition empty state is shown

### Story 5.5: Daily Prediction Distribution

**Requirements:** FR14

As a participant,
I want to see today's match prediction distribution,
So that I understand the group sentiment for upcoming games.

**Acceptance Criteria:**

**Given** predictions for today's matches are locked and revealed
**When** Home renders
**Then** each relevant match can show Team A win %, draw %, and Team B win %

**Given** predictions are not revealed
**When** Home renders
**Then** prediction distribution is hidden or unavailable

**Given** defaulted 0x0 predictions exist
**When** distribution is calculated
**Then** they are counted normally while preserving their default metadata elsewhere

### Story 5.6: Acertou na Mosca Highlights

**Requirements:** FR15

As a participant,
I want to see who predicted exact results,
So that perfect predictions become celebrated moments.

**Acceptance Criteria:**

**Given** a completed match has exact prediction hits
**When** Home renders highlights
**Then** participants with exact score predictions are shown under Acertou na Mosca

**Given** no exact hits exist for recent completed matches
**When** Home renders
**Then** the highlights section is hidden or shows a light empty state

**Given** exact-hit highlights are shown on mobile
**When** multiple participants appear
**Then** the layout remains readable and compact

## Epic 6: Prediction Reveal and Rules Transparency

Admin can reveal locked predictions, participants can inspect others' picks, and everyone can read rules.

### Story 6.1: Admin Manual Prediction Reveal

**Requirements:** FR18

As the admin,
I want to manually reveal locked predictions for a phase,
So that participants can compare picks only when I decide it is fair.

**Acceptance Criteria:**

**Given** a phase prediction window is locked
**When** the admin enables reveal for that phase
**Then** locked predictions for that phase become visible in Todos os Palpites

**Given** a phase is not revealed
**When** a participant requests another participant's predictions
**Then** the backend does not return those predictions

**Given** the admin views phase reveal status
**When** a phase is locked or unrevealed
**Then** the current reveal state is clear

### Story 6.2: Todos os Palpites Participant Selector

**Requirements:** FR19

As a participant,
I want to select another participant and view their revealed predictions,
So that I can compare picks after the deadline.

**Acceptance Criteria:**

**Given** a phase has been revealed
**When** a participant opens Todos os Palpites
**Then** they can select a participant from a selector

**Given** a participant is selected
**When** revealed predictions are displayed
**Then** predictions are grouped by phase/group where applicable

**Given** selected predictions include Explicit 0x0 and Defaulted 0x0
**When** the predictions are shown
**Then** the distinction is visible

**Given** extras are revealed
**When** selected participant predictions are shown
**Then** champion, top scorer, and top scorer goals are included

### Story 6.3: Locked/Unrevealed Empty State

**Requirements:** FR18, FR19

As a participant,
I want to understand why other predictions are unavailable,
So that I trust the reveal rules.

**Acceptance Criteria:**

**Given** predictions are not yet revealed
**When** a participant opens Todos os Palpites
**Then** they see a clear message that predictions will be visible after admin reveal

**Given** no phase is locked yet
**When** a participant opens Todos os Palpites
**Then** they see a clear no-locked-predictions state

**Given** the page is viewed on mobile
**When** empty-state messaging is shown
**Then** it remains readable and concise

### Story 6.4: Rules Page

**Requirements:** FR25

As a participant,
I want to read the bolao rules,
So that I understand scoring, deadlines, defaults, reveal behavior, and ranking.

**Acceptance Criteria:**

**Given** a participant opens Regras
**When** the page loads
**Then** rules for match scoring, extras scoring, deadlines, 0x0 default, reveal behavior, and dense tie ranking are visible

**Given** exact scoring rules are still being confirmed
**When** rules content is implemented
**Then** the rules source is easy to update before launch

**Given** the page is viewed on mobile
**When** rules content renders
**Then** it remains readable without horizontal overflow

## Epic 7: Community Chat

Participants can exchange public messages on Home, use emojis and safe image references, and direct attention to another participant with mentions.

### Story 7.1: Home Community Chat

**Requirements:** New community engagement requirement

As a participant,
I want to exchange public messages with the other participants from Home,
So that the bolao has a shared place for conversation, reactions, and playful rivalry.

**Acceptance Criteria:**

**Given** an authenticated participant opens Home
**When** chat messages exist
**Then** the chat shows public messages from newest to oldest
**And** each message identifies the sender and creation time

**Given** a participant writes a message
**When** the message contains text or Unicode emojis and has at most 240 characters
**Then** it can be published and persisted
**And** the new message appears at the top of the chat

**Given** a participant types `@` in the composer
**When** they select another participant
**Then** the selected participant is stored as the message mention
**And** the visible message identifies the mentioned nickname

**Given** a public message mentions the currently authenticated participant
**When** that participant reads the chat
**Then** the message is visually highlighted as directed to them
**And** the message remains visible to every other participant

**Given** a message contains one supported image reference
**When** the reference is a strictly valid HTTPS image tag
**Then** the image is rendered as a forced small thumbnail
**And** it cannot resize or disrupt the chat layout

**Given** a message contains scripts, event handlers, unsafe URL protocols, or unsupported HTML
**When** the server processes or the client renders the message
**Then** executable content is never executed
**And** the backend rejects unsupported markup without creating a message

**Given** the message is empty or exceeds 240 characters
**When** the participant attempts to publish it
**Then** the backend rejects it with a clear validation response
**And** no chat row is created

**Given** the participant uses a mobile screen
**When** the chat, mentions, emojis, or image thumbnails render
**Then** the composer and message list remain compact and readable without horizontal overflow

