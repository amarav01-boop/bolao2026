# Story 1.2: Participant Login and Logout

Status: done

## Story

As a participant,
I want to login and logout with my username and password,
so that my bolao session is protected and I can safely return to it later.

## Acceptance Criteria

1. Given a participant has an account, when they submit valid username and password, then the backend authenticates the participant, creates a session, and returns the signed-in participant profile.
2. Given a participant submits invalid credentials, when login fails, then the API returns a clear generic error and the form shows a friendly failure message without exposing which field was wrong.
3. Given a participant is authenticated, when they view the app, then the signed-in shell or participant navigation is visible instead of the anonymous auth entry point.
4. Given a participant is authenticated, when they choose logout, then the session is destroyed and protected participant views require login again.
5. Given the page is viewed on mobile, when login/logout UI renders, then the layout remains readable and touch-friendly without horizontal overflow.
6. Given account/session boundaries, when implementation is complete, then login/logout stays server-driven and no frontend-only access check is treated as security.

## Tasks / Subtasks

- [ ] Add participant login/logout backend flow (AC: 1, 2, 4, 6)
  - [ ] Add login validation for username and password.
  - [ ] Compare credentials asynchronously with bcrypt.
  - [ ] Set the participant session on successful login.
  - [ ] Add logout handling that clears the current session cleanly.

- [ ] Add signed-in app shell behavior (AC: 3, 4, 5)
  - [ ] Show a participant-aware shell when a session exists.
  - [ ] Add a visible logout action in the signed-in state.
  - [ ] Keep the anonymous auth entry point available when no session exists.

- [ ] Add minimal verification for auth flow (AC: 1-6)
  - [ ] Smoke test login success, invalid credential rejection, and logout.
  - [ ] Verify session state changes across refresh.
  - [ ] Verify client build still passes after auth shell changes.

## Dev Notes

### Source Context

- Story 1.1 already created participant records, stored bcrypt hashes, and established session-backed auth on registration success.
- Login should reuse the same participant session contract and `session.user` shape already used by registration.
- The old bolao flow stayed simple: username/password in, session out. Preserve that simplicity, but do it safely.

### Architecture Compliance

- Use plain JavaScript on both sides.
- Reuse the existing Express + Vite + MariaDB/MySQL stack.
- Use `bcrypt` asynchronously for password comparison.
- Keep session handling server-side with the existing session store.
- Use parameterized SQL only.
- Keep all authorization decisions on the backend.

### Backend File Guidance

Likely files to create or extend for this story:

- `server/routes/auth-routes.js`
- `server/services/auth-service.js`
- `server/services/participant-service.js`
- `server/repositories/participant-repository.js`
- `server/schemas/auth-schemas.js`
- `server/middleware/require-auth.js`
- `server/utils/api-response.js`

### Frontend File Guidance

Likely files to create or extend for this story:

- `client/src/pages/register-page.js` or a shared auth shell page
- `client/src/api/auth-api.js`
- `client/src/components/app-shell.js`
- `client/src/components/status-message.js`
- `client/src/styles/forms.css`
- `client/src/styles/layout.css`
- `client/src/main.js`

### Testing Requirements

- Verify valid login succeeds.
- Verify invalid credentials return a friendly generic error.
- Verify logout clears session state.
- Verify protected participant state is only shown when a real session exists.

## Dev Agent Record

### Completion Notes List

- Implemented participant login with bcrypt verification, session creation, and a reusable `/api/auth/session` contract.
- Added logout support that clears the participant session and returns the anonymous auth shell.
- Updated the client to render a login form for anonymous users and a signed-in participant shell after successful auth.
- Verified login success, session persistence, logout, and post-logout anonymous state against the local MySQL-backed app.

### File List

- `server/routes/auth-routes.js`
- `server/schemas/auth-schemas.js`
- `server/services/auth-service.js`
- `server/services/participant-service.js`
- `client/src/api/auth-api.js`
- `client/src/main.js`
- `client/src/pages/register-page.js`
- `client/src/pages/home-page.js`
- `client/src/styles/forms.css`
- `client/src/styles/ranking.css`
