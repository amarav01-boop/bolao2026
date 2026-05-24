# Story 1.0: Project Foundation and Design Baseline

Status: done

## Story

As the implementation team,
I want the project scaffold, backend foundation, PostgreSQL configuration, and visual baseline established,
so that feature stories can be implemented consistently and safely.

## Acceptance Criteria

1. Given this is a greenfield implementation, when the project foundation is created, then the Vite vanilla client and Express server are initialized, and the repository follows the architecture-defined `client/`, `server/`, `tests/`, and `docs/` structure.
2. Given the backend requires PostgreSQL, when server configuration is created, then `.env.example`, environment loading, PostgreSQL pool setup, migration folder, and seed folder exist, and database access is prepared for parameterized SQL through repositories.
3. Given the app will use server-side sessions, when baseline middleware is configured, then session, security-header, validation, auth, admin-auth, and error-handler placeholders or modules exist, and no plaintext password or frontend-only authorization pattern is introduced.
4. Given the website needs a consistent visual direction, when baseline frontend styles are created, then local CSS tokens and starter component styles are derived from `kb_copa_mundo/codebase-copa-anterior/exemplo_design.html`, and the implementation treats it as local CSS guidance, not as a separate UI framework.
5. Given future stories will create database tables as needed, when the foundation is complete, then no unrelated full-schema implementation is forced upfront, and the migration structure is ready for incremental story-owned migrations.

## Tasks / Subtasks

- [x] Scaffold project runtime structure (AC: 1)
  - [x] Create Vite vanilla JavaScript app under `client/`.
  - [x] Create Express app under `server/` with no view engine.
  - [x] Add root `package.json` scripts that can run client/server commands without introducing a frontend framework.
  - [x] Ensure top-level folders exist: `client/`, `server/`, `tests/`, `docs/`.

- [x] Add environment and PostgreSQL foundation (AC: 2, 5)
  - [x] Add root `.env.example` with `DATABASE_URL`, `SESSION_SECRET`, `NODE_ENV`, `PORT`, and client API base URL guidance if needed.
  - [x] Add `server/config/env.js` to load and validate required environment values.
  - [x] Add `server/db/pool.js` using `pg.Pool` and `DATABASE_URL`.
  - [x] Add `server/db/migrate.js`, `server/db/seed.js`, `server/db/migrations/`, and `server/db/seeds/`.
  - [x] Add only infrastructure migrations required by the foundation, such as a session table if needed for `connect-pg-simple`; do not create full domain schema yet.

- [x] Add backend baseline middleware and utilities (AC: 3)
  - [x] Install backend dependencies: `pg`, `bcrypt`, `express-session`, `connect-pg-simple`, `dotenv`, `zod`, `helmet`.
  - [x] Configure Express to use JSON parsing, `helmet`, session middleware, and centralized error handling.
  - [x] Add `server/config/session.js` using `express-session` with `connect-pg-simple`.
  - [x] Add middleware modules: `require-auth.js`, `require-admin.js`, `validate.js`, `error-handler.js`.
  - [x] Add utility modules: `api-response.js` and `async-route.js`.
  - [x] Ensure placeholder auth/admin middleware fails closed: unauthenticated returns `401`, non-admin returns `403`.

- [x] Add frontend baseline structure and design tokens (AC: 1, 4)
  - [x] Create `client/src/api/`, `client/src/pages/`, `client/src/components/`, `client/src/state/`, `client/src/styles/`, and `client/src/utils/`.
  - [x] Add starter CSS files: `base.css`, `layout.css`, `forms.css`, `ranking.css`, `admin.css`.
  - [x] Convert the design reference colors, spacing, radius, shadows, typography, buttons, cards, ranking table, and chips into local CSS tokens/classes.
  - [x] Keep the CSS mobile-first and semantic; no Tailwind, Bootstrap, React, Vue, or external design-system package.
  - [x] Verify text encoding before reusing Portuguese copy from `exemplo_design.html`; the terminal view showed encoding artifacts.

- [x] Add initial health/demo surface for verification (AC: 1, 2, 3, 4)
  - [x] Add a simple API health endpoint such as `GET /api/health` returning the standard success wrapper.
  - [x] Add a lightweight client screen that loads without auth and demonstrates baseline design tokens/components.
  - [x] Ensure the client can be run by Vite and the server can be run by Express independently.

- [x] Add minimal verification and documentation (AC: 1-5)
  - [x] Update or create `README.md` with local setup commands.
  - [x] Add `docs/architecture-decisions.md` or a placeholder that points to `_bmad-output/planning-artifacts/architecture.md`.
  - [x] Run install/build/start checks that are reasonable for the local environment.
  - [x] Document any command that could not be run because of sandbox/network restrictions.

## Dev Notes

### Source Context

- This story exists because implementation readiness found a missing initial setup story. The sprint must start here before participant registration. [Source: `_bmad-output/planning-artifacts/implementation-readiness-report-2026-05-23.md#Major Issues To Address Before Or During Sprint Planning`]
- The architecture explicitly says the first implementation priority is to initialize the Vite client and Express server, then add PostgreSQL connection, migrations, environment config, and session auth. [Source: `_bmad-output/planning-artifacts/architecture.md#Implementation Handoff`]
- The selected stack is HTML/CSS/JavaScript frontend, Node.js/Express backend, and PostgreSQL. PHP is a reference only and must not be added to the new runtime. [Source: `_bmad-output/planning-artifacts/architecture.md#Legacy Codebase Assessment`]

### Required Initialization Commands

Use these architecture-approved commands as the starting point. They may require network access.

```bash
npm create vite@latest client -- --template vanilla
npx express-generator@latest server --no-view
cd server
npm install
npm install pg bcrypt express-session connect-pg-simple dotenv zod helmet
```

Official references confirm the selected setup path:

- Vite supports `npm create vite@latest ... -- --template vanilla` and lists `vanilla` as a supported template. [Source: https://vite.dev/guide/]
- Express generator supports `npx express-generator` and the `--no-view` option. [Source: https://expressjs.com/en/starter/generator]
- Vite currently requires modern Node versions; architecture selected Node.js 24 LTS. [Source: https://vite.dev/guide/, `_bmad-output/planning-artifacts/architecture.md#Core Architectural Decisions`]

### Architecture Compliance

The dev agent must follow these rules from the architecture:

- Use plain JavaScript for both frontend and backend.
- Use Vite Vanilla for the browser app; do not add React, Vue, Redux, Zustand, Tailwind, Bootstrap, or a design-system framework.
- Use Express for backend API/static serving.
- Use PostgreSQL through `pg` with parameterized SQL.
- Use services for domain rules, repositories for SQL, middleware for auth/validation/error handling.
- Use database `snake_case`, API/domain `camelCase`, and kebab-case filenames.
- Use server-side sessions with `express-session` and `connect-pg-simple`.
- Use `helmet` for baseline security headers and `zod` for request validation.
- Use `.env` locally and `.env.example` for documented variables.
- Do not add PHP files or PHP runtime dependencies.
- Do not create the full future domain schema in this story. Create only foundation/migration plumbing and session-table infrastructure if required.

### Project Structure Requirements

Create or preserve this foundation shape:

```text
client/
  src/
    api/
    components/
    pages/
    state/
    styles/
    utils/
server/
  config/
  db/
    migrations/
    seeds/
  middleware/
  routes/
  services/
  repositories/
  schemas/
  utils/
tests/
  server/
  fixtures/
docs/
```

For this story, most files are new. There is no existing app code to preserve, but there are planning artifacts and old PHP reference files that must not be overwritten.

### Backend File Guidance

Recommended foundation files:

- `server/app.js`
- `server/bin/www`
- `server/config/env.js`
- `server/config/session.js`
- `server/db/pool.js`
- `server/db/migrate.js`
- `server/db/seed.js`
- `server/db/migrations/001_create_session_table.sql` if using explicit session table migration
- `server/db/seeds/.gitkeep`
- `server/middleware/require-auth.js`
- `server/middleware/require-admin.js`
- `server/middleware/validate.js`
- `server/middleware/error-handler.js`
- `server/routes/health-routes.js`
- `server/utils/api-response.js`
- `server/utils/async-route.js`

Session-store guidance:

- `connect-pg-simple` can use a PostgreSQL pool and requires a session table unless configured to create one automatically. Prefer an explicit SQL migration over silent runtime table creation. [Source: https://www.npmjs.com/package/connect-pg-simple]
- `express-session` default memory store is not suitable beyond development; use the PostgreSQL-backed store from the start. [Source: https://www.npmjs.com/package/express-session]
- Cookie settings should be environment-aware. Secure cookies require HTTPS; local HTTP development should not silently break login. [Source: https://www.npmjs.com/package/express-session]

### API Response and Error Pattern

Use the architecture response wrappers from the start:

```json
{
  "data": {},
  "meta": {}
}
```

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Friendly message",
    "details": {}
  }
}
```

Recommended initial health response:

```json
{
  "data": {
    "status": "ok"
  }
}
```

### Frontend File Guidance

Recommended foundation files:

- `client/src/main.js`
- `client/src/api/api-client.js`
- `client/src/components/app-shell.js`
- `client/src/components/status-message.js`
- `client/src/components/empty-state.js`
- `client/src/styles/base.css`
- `client/src/styles/layout.css`
- `client/src/styles/forms.css`
- `client/src/styles/ranking.css`
- `client/src/styles/admin.css`
- `client/src/utils/dom.js`

The initial client does not need real product flows yet. It should prove:

- Vite serves the app.
- CSS imports work.
- The visual baseline is usable.
- A health call can be made or the API base URL pattern is ready.

### Design Baseline Requirements

Use `kb_copa_mundo/codebase-copa-anterior/exemplo_design.html` as a reference for local CSS, not as code to copy blindly. Extract:

- Colors: `#0A0A0A`, `#151515`, `#1E1E1E`, `#2A2A2A`, `#00E676`, `#00B0FF`, `#FF3D57`, `#FFC400`, `#FFFFFF`, `#BDBDBD`, `#7A7A7A`, `#333333`.
- Spacing: `4px`, `8px`, `16px`, `24px`, `32px`, `48px`.
- Radius: use architecture/frontend guidance where possible. The sample uses larger radii; keep repeated cards/components at or below 8px unless there is a specific reason and document the choice.
- Typography: Inter body and Space Grotesk headings may be referenced through Google Fonts, but the app must remain usable with system font fallbacks.
- Component ideas: buttons, status/chips, card surfaces, ranking rows/table, match card styling.

Important: The terminal-rendered HTML shows encoding artifacts for Portuguese text and symbols. Do not reuse broken text. Verify in browser/editor or rewrite copy cleanly.

### Security and Data Rules

- Never store plaintext passwords in future auth code.
- Do not string-concatenate SQL. `node-postgres` supports parameterized queries and warns that string-built SQL can lead to SQL injection. [Source: https://node-postgres.com/features/queries]
- Do not implement frontend-only auth or admin checks.
- Placeholder middleware must be conservative: fail closed until real session identity is available.
- Express security best practices include using Helmet and not trusting user input. [Source: https://expressjs.com/en/advanced/best-practice-security.html]

### Testing Requirements

Because this is a foundation story, verification should focus on startup and structure:

- `npm install` for generated client/server projects, if network access is available.
- `npm --prefix client run build` or equivalent Vite build check.
- `npm --prefix server start` or an equivalent smoke start if the generated server supports it.
- `GET /api/health` returns the standard wrapper.
- If a migration runner is implemented, run it against a configured local database only when `DATABASE_URL` is available.

If network or database access is unavailable, the dev agent must state exactly which checks were skipped and why.

### Previous Story Intelligence

No previous implementation story exists. This story creates the baseline that later stories must reuse.

### Git Intelligence

Current repository has one existing commit: `f9cf2f1 first commit`. Current working tree already contains planning artifacts and the design reference. Do not revert or overwrite unrelated planning files.

### Non-Goals For This Story

- Do not implement participant registration, login forms, admin login, phase setup, match setup, predictions, scoring, ranking, reveal, or rules content.
- Do not import or migrate the old PHP app.
- Do not build the full PostgreSQL domain schema.
- Do not add automation for FIFA results, WhatsApp, pinned rivals, or advanced audit features.
- Do not choose a different stack.

## Project Structure Notes

This is a greenfield implementation story. Existing code files to update are limited to root-level project metadata such as `README.md` and possibly `.gitignore`/`package.json` if present. All `client/` and `server/` implementation files should be new unless a generator creates them first.

The old codebase under `kb_copa_mundo/codebase-copa-anterior/` is reference material only. Do not modify it.

## References

- `_bmad-output/planning-artifacts/epics.md#Story 1.0: Project Foundation and Design Baseline`
- `_bmad-output/planning-artifacts/architecture.md#Starter Template Evaluation`
- `_bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules`
- `_bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries`
- `_bmad-output/planning-artifacts/implementation-readiness-report-2026-05-23.md#Major Issues To Address Before Or During Sprint Planning`
- `kb_copa_mundo/codebase-copa-anterior/exemplo_design.html`
- Vite guide: https://vite.dev/guide/
- Express generator: https://expressjs.com/en/starter/generator
- Express security best practices: https://expressjs.com/en/advanced/best-practice-security.html
- node-postgres queries: https://node-postgres.com/features/queries
- express-session: https://www.npmjs.com/package/express-session
- connect-pg-simple: https://www.npmjs.com/package/connect-pg-simple

## Dev Agent Record

### Agent Model Used

GPT-5 via Codex.

### Debug Log References

Install:
- `npm.cmd install`

Verification:
- `npm.cmd run build:client`
- `npm.cmd run start:server`
- `curl.exe -s http://127.0.0.1:3000/api/health`
- `npm.cmd run dev:client`

### Completion Notes List

1. Built the greenfield foundation: root workspace scripts, client Vite app, Express server, PostgreSQL pool, session middleware, auth/validation placeholders, and shared utility modules.
2. Added the requested foundation docs and environment scaffolding: `.env.example`, `docs/architecture-decisions.md`, migration and seed folders, and the explicit session-table migration.
3. Created the design baseline from the provided `exemplo_design.html` reference and wired a lightweight client shell that renders the new tokens and components.
4. Verified the client build succeeds and the server boots cleanly with the health endpoint responding as expected.
5. Verified the Vite dev server starts successfully and can reach the Express API in development through the narrow CORS bridge.
6. The story stays scoped to foundation work only; no participant, admin, scoring, ranking, or rules feature logic was added.
7. Applied a review pass fix-up: aligned the default dev API host with session cookies, moved the root JSON endpoint ahead of the SPA fallback, documented the migration step for fresh databases, and cleaned the visible demo copy and radius tokens.

### File List

- `.env.example`
- `.gitignore`
- `README.md`
- `package.json`
- `package-lock.json`
- `docs/architecture-decisions.md`
- `client/package.json`
- `client/index.html`
- `client/src/main.js`
- `client/src/api/api-client.js`
- `client/src/components/*`
- `client/src/pages/home-page.js`
- `client/src/state/*`
- `client/src/styles/*`
- `client/src/utils/dom.js`
- `client/public/avatars/.gitkeep`
- `server/app.js`
- `server/bin/www`
- `server/config/env.js`
- `server/config/session.js`
- `server/db/pool.js`
- `server/db/migrate.js`
- `server/db/seed.js`
- `server/db/migrations/001_create_session_table.sql`
- `server/middleware/*`
- `server/routes/health-routes.js`
- `server/utils/*`
- `tests/.gitkeep`
- `tests/fixtures/.gitkeep`
- `tests/server/.gitkeep`

## Completion Status

Done. Foundation scaffold is in place, review fixes were applied, and the required smoke checks passed.
