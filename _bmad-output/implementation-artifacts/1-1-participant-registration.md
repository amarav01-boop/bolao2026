# Story 1.1: Participant Registration

Status: done

## Story

As a visitor,
I want to create a participant account with username, password, nickname, and avatar,
so that I can join the bolao with a public identity.

## Acceptance Criteria

1. Given registration is open, when a visitor submits a valid username, password, nickname, and curated avatar choice, then a participant account is created in MariaDB/MySQL, the password is stored as a bcrypt hash, and the chosen avatar key is saved with the profile.
2. Given a registration succeeds, when the participant account is created, then the backend establishes a participant session and the UI transitions into the signed-in app shell or next-step state without requiring plaintext credentials to be shown again.
3. Given a username or nickname already exists, when a visitor submits the form, then the API returns a field-specific validation error and no partial account row is created.
4. Given the submitted values fail validation, when the visitor submits a weak password or invalid identity field, then the form shows clear inline errors and preserves the non-sensitive inputs.
5. Given registration is closed, when a visitor opens or submits the registration page, then a clear closed-registration message is shown and the backend rejects new account creation.
6. Given the page is viewed on mobile, when the registration form and avatar picker render, then the layout remains readable, touch-friendly, and free of horizontal overflow.
7. Given the account storage and API boundaries, when implementation is complete, then no plaintext password, SQL string concatenation, email/location field drift, or frontend-only authorization check is introduced.

## Tasks / Subtasks

- [x] Add participant registration backend flow (AC: 1, 2, 3, 4, 5, 7)
  - [x] Add the participant persistence schema needed for launch registration, with unique username and nickname, hashed password storage, avatar key, and timestamps.
  - [x] Add the smallest backend registration-state source needed to honor the closed-registration flow now, so Story 2.2 can wire the admin toggle into the same contract later.
  - [x] Add `POST /api/auth/register` with Zod validation, bcrypt hashing, parameterized SQL, and friendly duplicate/validation errors.
  - [x] Add the read path needed by the registration page to know whether registration is open or closed.
  - [x] Keep the API response shape consistent with the foundation story (`data` / `error` wrappers).

- [x] Build the participant registration UI (AC: 1, 2, 4, 5, 6)
  - [x] Replace the foundation demo-first experience with a real registration entry point for unauthenticated visitors.
  - [x] Add a registration page with username, password, nickname, and curated avatar selection.
  - [x] Show open/closed state, field-level errors, and save/loading feedback without exposing password text.
  - [x] Keep the layout mobile-first and accessible with proper labels, focus order, and visible selection state.

- [x] Wire avatar selection and auth state handling (AC: 1, 2, 6, 7)
  - [x] Read avatar options from the curated asset set under `client/public/avatars/` or a small manifest that points at those filenames.
  - [x] Store only the avatar key/filename in the participant record, not the image binary.
  - [x] Keep the session/auth state module ready for the later login/logout story.
  - [x] If curated images are not all available yet, keep the picker functional with placeholders rather than blocking registration.

- [x] Add minimal verification for the new flow (AC: 1-7)
  - [x] Run the migration step before smoke testing on a fresh database.
  - [x] Verify the client still builds after the registration page replaces the demo surface.
  - [x] Verify registration success, duplicate username/nickname rejection, and closed-registration rejection.
  - [x] Verify the success path establishes a participant session and does not expose plaintext passwords or raw SQL errors.

## Dev Notes

### Source Context

- This story is the first real participant-facing flow after the foundation story; it follows the launch-critical setup work already completed. [Source: `_bmad-output/implementation-artifacts/1-0-project-foundation-and-design-baseline.md`]
- The product requirement is FR-1: participant self-registration with username, password, nickname, and avatar. The launch choice is to keep nickname unique for simplicity and trust. [Source: `_bmad-output/planning-artifacts/epics.md#Story 1.1: Participant Registration`, `_bmad-output/planning-artifacts/prds/prd-bolao2026-2026-05-23/prd.md#5.1 Access and Identity`]
- The launch journey expects the participant to join quickly from mobile, so registration must feel like a first-class mobile form, not an admin-style data entry screen. [Source: `_bmad-output/planning-artifacts/prds/prd-bolao2026-2026-05-23/prd.md#2.5 Key User Journeys`]
- The PRD addendum and the legacy DB both support nickname, avatar-like identity, and extras as part of the group ritual, but this story only covers participant creation, not extras or scoring. [Source: `_bmad-output/planning-artifacts/prds/prd-bolao2026-2026-05-23/addendum.md`]

### Previous Story Intelligence

- The foundation story already established the stack, folder layout, Express session middleware, database pool, and Vite client shell. Reuse those patterns; do not recreate the scaffold.
- Dev verification from Story 1.0 showed the local dev client and server are healthiest when the API base stays on `localhost` and the server root `/` remains a JSON smoke endpoint.
- The migration runner now tracks applied migrations in `schema_migrations`; run the migration step before testing registration on a fresh database.
- The foundation review fix-up also established the current dev contract: no `127.0.0.1` session mismatch, no SPA fallback shadowing the API root, and no mojibake in demo text.

### Legacy Codebase Intelligence

- The old PHP `users` table used `USERNAME`, `USERNICKNAME`, and `USERPASSWORD`, plus extra fields like `USEREMAIL` and `USERLOCATION`. Those extra fields are not required for this MVP registration story.
- The legacy registration action stored passwords in plaintext and built SQL by string concatenation. Do not repeat either pattern.
- The legacy login/registration flow used a simple save-and-redirect model. Preserve the simplicity, but implement it with server-side hashing, parameterized SQL, and session-backed auth.
- Avatar images are not part of the legacy DB. Store only a curated avatar key or filename in the participant record so the asset set can evolve without schema churn.

### Architecture Compliance

- Use plain JavaScript on both sides.
- Reuse the existing Express + Vite + MariaDB/MySQL stack from Story 1.0.
- Use `bcrypt` asynchronously for hashing/comparison. Do not use sync hashing on the server.
- Use `express-session` with the existing MariaDB/MySQL-backed session store.
- Use `zod` to validate form payloads at the backend boundary.
- Use parameterized SQL only; never concatenate registration input into SQL.
- Keep authorization server-side. The registration form must not decide whether an account is valid on its own.
- Keep the registration setting backend-owned so Story 2.2 can wire the admin toggle into the same state without redesigning the form.

### Backend File Guidance

Likely files to create or extend for this story:

- `server/routes/auth-routes.js`
- `server/services/auth-service.js`
- `server/services/participant-service.js`
- `server/repositories/participant-repository.js`
- `server/schemas/auth-schemas.js`
- `server/db/migrations/002_create_participants.sql`
- `server/db/migrations/003_create_registration_settings.sql` if a one-row registration flag is used
- `server/utils/api-response.js` if any registration-specific response helper is needed
- `server/middleware/require-auth.js` only if the registration success path needs a session-aware branch

### Frontend File Guidance

Likely files to create or extend for this story:

- `client/src/pages/register-page.js`
- `client/src/api/auth-api.js`
- `client/src/components/avatar-picker.js`
- `client/src/components/form-field.js` or another small reusable field component if needed
- `client/src/state/session-state.js`
- `client/src/state/page-state.js` if the app shell needs a signed-in / signed-out switch
- `client/src/styles/forms.css`
- `client/src/styles/layout.css`

### Data Rules

- Required participant fields for MVP: `username`, `password_hash`, `nickname`, `avatar_key`.
- Keep nickname unique for launch rather than allowing ambiguous duplicates.
- Do not add email or location fields to the new MVP registration schema.
- If a registration-state row is used, keep it to the smallest possible boolean flag and make the closed-state message backend-driven.
- Store explicit user input only; do not auto-generate participant identity values that the user should choose.

### UX Rules

- The page should feel like the first real user entry point, not a generic CRUD form.
- Keep the avatar picker visually clear on mobile.
- Show inline validation near the field that failed.
- Never ask the user to retype the entire form because one field failed; preserve everything except the password if the UI intentionally clears it after submit.
- Closed registration should be unmistakable and polite.

### Security Rules

- Never store plaintext passwords.
- Use async bcrypt hashing and comparison.
- Use Helmet and the existing Express security posture from Story 1.0.
- Keep all account validation server-side.
- Do not expose whether a password is “close” or partially correct; use normal validation/login-style errors only.

### Testing Requirements

- Run the migration step against a configured local database before smoke testing registration.
- Run the client build after the registration page replaces the foundation demo.
- Smoke test:
  - valid registration succeeds,
  - duplicate username or nickname is rejected,
  - closed registration is rejected,
  - the success path establishes a session,
  - the API returns friendly JSON errors.
- If the curated avatar images are not all present yet, verify the picker still works with placeholder entries or a filename manifest.

### References

- `_bmad-output/planning-artifacts/epics.md#Story 1.1: Participant Registration`
- `_bmad-output/planning-artifacts/prds/prd-bolao2026-2026-05-23/prd.md#5.1 Access and Identity`
- `_bmad-output/planning-artifacts/prds/prd-bolao2026-2026-05-23/prd.md#2.5 Key User Journeys`
- `_bmad-output/planning-artifacts/prds/prd-bolao2026-2026-05-23/addendum.md`
- `_bmad-output/implementation-artifacts/1-0-project-foundation-and-design-baseline.md`
- `kb_copa_mundo/codebase-copa-anterior/db-bolao-final-2022-export.sql`
- bcrypt README: https://github.com/kelektiv/node.bcrypt.js
- express-session docs: https://www.npmjs.com/package/express-session
- express-mysql-session docs: https://www.npmjs.com/package/express-mysql-session
- Express security best practices: https://expressjs.com/en/advanced/best-practice-security.html

## Dev Agent Record

### Agent Model Used

GPT-5 (Codex)

### Debug Log References

- `npm.cmd run migrate:server`
- `npm.cmd run build:client`
- `node --check` on the new server-side auth, repository, schema, route, and error-handling files
- `npm.cmd run start:server`
- `GET /api/health`
- `GET /api/auth/registration-state`
- `GET /api/auth/session`
- `POST /api/auth/register`

### Completion Notes List

- Implemented participant registration with backend-owned open/closed state, session creation, duplicate-field validation, and bcrypt password hashing.
- Migrated the server data layer to MariaDB/MySQL and verified the registration flow against the local MySQL instance on port 3306.
- Registration success, duplicate rejection, session persistence, and registration-state reads were smoke-tested end to end.
- Replaced the foundation demo with a registration-first mobile UI and placeholder avatar manifest so the picker works before final art is present.
- Tightened client-side validation grouping so multiple field errors render safely, and improved duplicate-key fallback handling for MariaDB/MySQL duplicate errors.
- Client build passed successfully.


### File List

- `server/app.js`
- `server/constants/avatar-options.js`
- `server/db/migrations/002_create_participants.sql`
- `server/db/migrations/003_create_registration_settings.sql`
- `server/middleware/error-handler.js`
- `server/repositories/participant-repository.js`
- `server/routes/auth-routes.js`
- `server/schemas/auth-schemas.js`
- `server/services/auth-service.js`
- `server/services/participant-service.js`
- `client/src/api/auth-api.js`
- `client/src/components/app-shell.js`
- `client/src/components/avatar-picker.js`
- `client/src/components/empty-state.js`
- `client/src/components/form-field.js`
- `client/src/components/status-message.js`
- `client/src/data/avatar-options.js`
- `client/src/main.js`
- `client/src/pages/register-page.js`
- `client/src/state/session-state.js`
- `client/src/styles/admin.css`
- `client/src/styles/forms.css`
- `client/src/styles/layout.css`
- `client/src/utils/escape-html.js`

## Completion Status

Ultimate context engine analysis completed - comprehensive developer guide created.



