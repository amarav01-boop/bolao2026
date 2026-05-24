---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - "_bmad-output/planning-artifacts/prds/prd-bolao2026-2026-05-23/prd.md"
  - "_bmad-output/planning-artifacts/epics.md"
  - "_bmad-output/planning-artifacts/briefs/brief-bolao2026-2026-05-23/brief.md"
  - "kb_copa_mundo/codebase-copa-anterior/codebase-antigo-thin/codebase-antigo/PROJECT_BRIEF.md"
  - "kb_copa_mundo/codebase-copa-anterior/db-bolao-final-2022-export.sql"
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-05-23'
project_name: 'bolao2026'
user_name: 'Vitao'
date: '2026-05-23'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Initialization Notes

### Confirmed Inputs

- PRD and addendum define the launch MVP, functional requirements, NFRs, and open questions.
- Epics and stories define the implementation backlog across six user-value epics.
- Product brief defines the personal-project launch posture and two-day launch pressure.
- Previous PHP codebase is included as a behavioral reference only.
- Previous 2022 database export is included as a data-model and scoring reference.

### Initial Stack Direction

- Frontend: HTML, CSS, JavaScript.
- Backend: Node.js.
- Database: MariaDB/MySQL-compatible relational database.

### Legacy Codebase Assessment

The previous implementation used vanilla PHP, MySQL, XAMPP/Apache, procedural page scripts, and action endpoints. It provides useful domain references for authentication, group prediction pages, result entry, ranking, selected participant prediction views, daily statistics, extras, and admin workflows.

PHP is not required for the new implementation. Node.js can replace the backend responsibilities while the frontend remains HTML/CSS/JavaScript and MariaDB/MySQL replaces the old database stack. The architecture should preserve proven domain behavior while avoiding legacy risks such as plaintext password storage and direct SQL string concatenation.

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

The product is a small but complete full-stack web application for a World Cup prediction pool. The functional scope breaks into these architectural domains:

- **Access and identity:** participant self-registration, login/logout, curated avatar selection, public nickname display, and a separate protected admin account.
- **Admin competition setup:** registration toggle, phase/window/deadline management, group and knockout match setup.
- **Prediction entry:** active phase prediction page, Group Phase segmentation, score inputs, group-level autosave, deadline locking, grace window handling, missing-to-0x0 defaults, and extras predictions.
- **Results and scoring:** admin result entry, scoring rules, ranking recalculation, dense tie ranking, movement tracking, correction handling, and dispute/rule notes.
- **Home and engagement:** phase status card, attention message, ranking snapshot, daily prediction distribution, and Acertou na Mosca highlights.
- **Prediction reveal and rules:** admin reveal switch, participant-selected revealed prediction view, locked/unrevealed empty states, and rules page.

Architecturally, the system needs clear separation between:

- browser-rendered screens,
- Node.js route/API handlers,
- business/domain services for deadline, reveal, scoring, ranking, and defaults,
- MariaDB/MySQL persistence.

**Non-Functional Requirements:**

The main NFRs shaping architecture are:

- **Security:** passwords must not be plaintext; admin routes must be access-controlled.
- **Fairness:** backend must enforce deadline lock and reveal state. Frontend hiding is not enough.
- **Reliability:** prediction save failures must be visible before lock.
- **Data integrity:** result corrections must recalculate dependent scoring/ranking consistently.
- **Responsive UX:** participant flows must be mobile-first.
- **Accessibility:** core forms/navigation should be keyboard operable and readable.
- **Performance:** small-group usage, but prediction entry should stay lightweight and avoid unnecessary assets.

**Scale & Complexity:**

- Primary domain: full-stack web application with admin workflows and relational scoring logic.
- Complexity level: medium. The UI is straightforward, but domain rules are stateful and fairness-sensitive.
- Estimated architectural components:
  - Static/public frontend assets
  - Participant auth/session module
  - Admin auth/authorization module
  - Competition setup module
  - Prediction module
  - Deadline/defaulting module
  - Reveal module
  - Result/scoring module
  - Ranking module
  - Home/dashboard query module
  - Rules/static content module
  - MariaDB/MySQL schema and migrations

### Technical Constraints & Dependencies

- Recommended stack: HTML, CSS, JavaScript frontend; Node.js backend; MariaDB/MySQL database.
- Legacy PHP codebase is a behavioral reference only, not a runtime dependency.
- PHP is not required for the new implementation.
- The previous MySQL schema and PHP flows provide useful reference for users, bets, master matches, rounds, ranking, messages, statistics, selected prediction views, and extras.
- The new implementation must avoid legacy risks found in the old codebase, especially plaintext passwords and direct SQL string concatenation.
- Scoring rules are partly assumed from old DB evidence: exact score = 3, correct outcome = 1, otherwise 0. Extras scoring still needs confirmation.
- No Architecture or UX Design document existed before this workflow; this architecture document becomes the first technical decision source.

### Admin-First Control Principle

When a workflow would be complex to implement autonomously, the architecture should prefer a simple admin-controlled input/save flow. The legacy PHP admin pages are the reference pattern: expose the minimum fields needed, let the admin enter or update the state, then persist it and let the system react.

This applies especially to:

- knockout match setup,
- prediction window opening/closing,
- deadlines,
- match results,
- reveal switches,
- rules text,
- correction/dispute notes,
- extras scoring inputs if rules are not fully automated at launch.

The architecture should not over-automate tournament logic for MVP. Admin control is a feature, not a weakness, because it preserves trust and reduces implementation risk.

### Cross-Cutting Concerns Identified

- **Authorization boundaries:** participant versus admin access must be enforced server-side.
- **Deadline enforcement:** server time controls editability; grace-window handling must be consistent.
- **Prediction state integrity:** explicit 0x0 and defaulted 0x0 must be stored distinctly.
- **Reveal state enforcement:** backend must never return other participants' predictions before admin reveal.
- **Scoring isolation:** scoring logic should be centralized so rules can be confirmed or changed without touching unrelated UI.
- **Ranking consistency:** result entry/correction must recalculate points, ranks, movement, and highlights predictably.
- **Mobile-first forms:** prediction entry, registration, ranking, and reveal views must remain usable on phone screens.
- **Launch pragmatism:** architecture should prefer simple, explicit modules over over-engineered abstractions.

## Starter Template Evaluation

### Primary Technology Domain

Full-stack web application with:

- Plain HTML/CSS/JavaScript frontend
- Node.js backend
- MariaDB/MySQL database

The old PHP app is a behavioral reference only. The new runtime should not include PHP.

### Starter Options Considered

**Option 1: Vite Vanilla + Express Generator**

Use Vite's official `vanilla` template for the browser app and Express's official generator for the Node.js backend.

Official Vite supports a `vanilla` JavaScript template and can be created with `npm create vite@latest ... -- --template vanilla`. Express's official docs support `npx express-generator` and include a `--no-view` option for API/static-server style projects.

**Pros:**

- Matches requested stack closely.
- Keeps frontend plain JavaScript, not React/Vue/etc.
- Avoids PHP.
- Gives fast dev workflow for frontend.
- Express is simple and familiar for Node.js backend routes.
- Easy to add MariaDB/MySQL via `mysql2`.

**Cons:**

- Requires project structure conventions to be defined in this architecture.
- Express generator is basic; security, validation, migrations, and session handling must be added deliberately.

**Option 2: Single Express App Without Vite**

Use Express only, serving static HTML/CSS/JS from `public/`.

**Pros:**

- Simplest possible runtime.
- Very close to old PHP page/action mental model.
- Fewer moving parts.

**Cons:**

- Loses Vite's modern frontend dev server/build workflow.
- Frontend organization may become messy as screens grow.

**Option 3: Heavier Full-Stack Framework**

Use Next.js, Remix, NestJS, or a full boilerplate with Prisma/MariaDB/MySQL.

**Pros:**

- More structure, stronger conventions, richer ecosystem.

**Cons:**

- Conflicts with the preference for plain HTML/CSS/JavaScript.
- Adds framework complexity under launch pressure.
- More decisions for AI agents to navigate.

### Selected Starter: Vite Vanilla Frontend + Express Backend

**Rationale for Selection:**

This gives Bolao 2026 the best balance:

- Plain HTML/CSS/JavaScript frontend, as requested.
- Node.js backend, as requested.
- MariaDB/MySQL integration through backend services.
- No PHP runtime dependency.
- Simple enough for a fast launch.
- Structured enough to avoid the old PHP pattern of mixed page rendering, SQL concatenation, and scattered action scripts.

**Initialization Commands:**

```bash
npm create vite@latest client -- --template vanilla
npx express-generator@latest server --no-view
cd server
npm install
npm install mysql2 bcrypt express-session express-mysql-session dotenv zod helmet
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**

- JavaScript for both frontend and backend.
- Node.js backend using Express.
- Browser frontend using Vite vanilla JavaScript.

**Styling Solution:**

- Plain CSS, organized under the frontend app.
- No Tailwind or component framework for MVP.

**Build Tooling:**

- Vite handles frontend dev/build.
- Express handles backend server and API/static serving.

**Testing Framework:**

- No starter-provided test framework selected for MVP.
- Tests can be added later with Node's built-in test runner or another lightweight option.

**Code Organization:**

- `client/` for frontend screens/assets.
- `server/` for Express app.
- Backend organized into routes, services, repositories, middleware, and database migrations/seeds.
- Domain logic lives in services, not inside route handlers.

**Development Experience:**

- Vite dev server for frontend iteration.
- Express dev server for backend/API.
- Environment variables via `.env`.
- MariaDB/MySQL accessed through `mysql2`.
- Password hashing with `bcrypt`.
- Server-side validation with `zod`.
- Basic security headers with `helmet`.

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**

- Runtime: Node.js 24 LTS.
- Backend framework: Express.
- Frontend: Vite Vanilla JavaScript.
- Database: MariaDB/MySQL-compatible relational database.
- Authentication: server-side sessions.
- Password security: bcrypt hashing.
- Data access: `mysql2/promise` with parameterized SQL.
- Backend enforcement for deadlines and reveal state.

**Important Decisions (Shape Architecture):**

- Domain logic lives in services, not route handlers.
- MariaDB/MySQL schema uses explicit entities for participants, phases, matches, prediction windows, predictions, results, ranking snapshots, reveal states, and admin notes.
- Admin-first control principle applies to complex workflows.
- API style is REST-like JSON endpoints plus static frontend assets.
- Validation uses Zod at backend boundaries.

**Deferred Decisions (Post-MVP):**

- Agentic FIFA result scout.
- WhatsApp/recap agent.
- Real-time websockets.
- Full audit UI.
- Advanced test framework selection.
- Automated bracket generation.

### Data Architecture

**Decision:** Use MariaDB/MySQL as the relational source of truth.

**Version Direction:** MariaDB 11.x or MySQL 8.x-compatible hosting, whichever is available and stable in the target environment.

**Rationale:** The product is relational by nature: participants, matches, phases, predictions, results, ranking snapshots, and reveal states. MariaDB/MySQL fits the scoring and reporting model while matching the local development environment available for launch.

**Data Modeling Approach:**

- Use normalized relational tables.
- Store predictions separately from match results.
- Store explicit/defaulted prediction intent.
- Store phase-level prediction windows.
- Store phase-level reveal state.
- Store ranking snapshots or prior rank fields to support movement arrows.
- Store admin notes for correction/dispute context.

**Migration Approach:**

- Use SQL migration files under `server/db/migrations`.
- Keep seed data under `server/db/seeds`.
- No all-in-one database setup story; create/alter only what each implementation story needs.

**Caching Strategy:**

- No external cache for MVP.
- Compute or query directly from MariaDB/MySQL.
- Add caching only if ranking/home queries become a proven bottleneck.

### Authentication & Security

**Decision:** Use server-side sessions with Express.

**Implementation Direction:**

- `express-session`
- `express-mysql-session` for MySQL-backed session storage
- `bcrypt` for password hashing
- `helmet` for baseline security headers
- `zod` for request validation

**Rationale:** Session auth is simple, works well for a small friends-group website, and avoids unnecessary JWT/client-token complexity.

**Authorization Pattern:**

- Participant routes require authenticated session.
- Admin routes require authenticated session plus admin role/account.
- Admin checks happen server-side, never only in frontend code.

**Security Rules:**

- No plaintext passwords.
- No SQL string concatenation.
- All SQL uses parameterized queries.
- Backend enforces deadline locks and prediction reveal states.

### API & Communication Patterns

**Decision:** Use REST-like JSON endpoints from the Vite frontend to Express.

**Rationale:** The workflows are simple resource/action flows: register, login, save predictions, manage windows, enter results, reveal predictions, view ranking.

**API Shape:**

- `/api/auth/*`
- `/api/admin/*`
- `/api/phases/*`
- `/api/matches/*`
- `/api/predictions/*`
- `/api/results/*`
- `/api/ranking/*`
- `/api/home/*`
- `/api/rules`

**Error Handling Standard:**

- JSON errors use a consistent shape:
  - `error.code`
  - `error.message`
  - optional `error.details`
- Frontend displays user-friendly messages for validation, auth, save failure, locked state, and unrevealed state.

**Rate Limiting:**

- Optional for launch.
- Add only basic login protection if convenient; otherwise defer.

### Frontend Architecture

**Decision:** Vite Vanilla JavaScript frontend.

**Rationale:** Matches preference for HTML/CSS/JavaScript without introducing React/Vue framework complexity.

**Frontend Organization:**

- `client/src/pages/`
- `client/src/components/`
- `client/src/api/`
- `client/src/state/`
- `client/src/styles/`
- `client/src/utils/`

**State Management:**

- Plain JavaScript modules and page-level state.
- No Redux, Zustand, or framework-level store.

**Routing Strategy:**

- Simple client-side route handling or page modules.
- Backend still protects data/API access.

**Performance Strategy:**

- Keep pages lightweight.
- Avoid heavy UI libraries.
- Use semantic HTML and CSS for mobile-first layouts.

### Infrastructure & Deployment

**Decision:** Keep deployment simple: Node.js server + MariaDB/MySQL + built Vite static assets.

**Rationale:** The architecture should be easy to run and reason about. No PHP runtime, no microservices, no serverless complexity.

**Environment Configuration:**

- `.env` for local configuration.
- Required variables:
  - `DATABASE_URL`
  - `SESSION_SECRET`
  - `NODE_ENV`
  - optional admin bootstrap credentials or seed configuration

**Build/Run Shape:**

- Build frontend with Vite.
- Serve built frontend assets from Express or deploy frontend/static assets separately if hosting demands it.
- Express serves API routes and protected backend logic.

**Monitoring/Logging:**

- Use simple server logs for MVP.
- Log admin result corrections and critical errors.
- Advanced observability deferred.

### Decision Impact Analysis

**Implementation Sequence:**

1. Initialize Vite client and Express server.
2. Add MariaDB/MySQL connection, migration structure, environment config.
3. Add session auth and participant/admin authorization.
4. Add admin setup flows: registration toggle, phases, matches, windows.
5. Add participant prediction flows and deadline/defaulting logic.
6. Add result entry, scoring, ranking recalculation.
7. Add Home, Ranking, Reveal, and Rules screens.

**Cross-Component Dependencies:**

- Auth/session affects every protected participant and admin route.
- Prediction windows affect prediction entry, deadline lock, reveal, and Home.
- Results affect scoring, ranking, Home highlights, and correction notices.
- Reveal state affects Todos os Palpites and Home prediction distribution.
- MariaDB/MySQL schema choices affect all backend modules.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 9 areas where AI agents could make different choices:

1. database naming,
2. API endpoint naming,
3. JSON field naming,
4. error formats,
5. route/service/repository boundaries,
6. authentication/authorization checks,
7. date/time handling,
8. frontend page/component organization,
9. admin-first control implementation.

### Naming Patterns

**Database Naming Conventions:**

- Tables use plural `snake_case`: `participants`, `prediction_windows`, `match_results`.
- Columns use `snake_case`: `participant_id`, `created_at`, `is_admin`.
- Primary keys use `id`.
- Foreign keys use `{entity_singular}_id`: `participant_id`, `phase_id`, `match_id`.
- Boolean columns use `is_`, `has_`, or `can_`: `is_admin`, `is_open`, `has_defaulted_score`.
- Timestamps use `*_at`: `created_at`, `updated_at`, `locked_at`, `revealed_at`.
- Indexes use `idx_{table}_{columns}`: `idx_predictions_participant_match`.

**API Naming Conventions:**

- REST endpoints use plural kebab-case nouns where needed:
  - `/api/participants`
  - `/api/prediction-windows`
  - `/api/match-results`
- Route parameters use Express `:id` syntax:
  - `/api/matches/:id`
- Query parameters use camelCase:
  - `?phaseId=1`
  - `?participantId=4`
- Admin routes are nested under `/api/admin/*`.

**Code Naming Conventions:**

- JavaScript variables/functions use camelCase: `participantId`, `calculateRanking`.
- Classes, if used, use PascalCase: `PredictionService`.
- Files use kebab-case: `prediction-service.js`, `match-results-routes.js`.
- Service modules end with `-service.js`.
- Repository modules end with `-repository.js`.
- Route modules end with `-routes.js`.

### Structure Patterns

**Backend Organization:**

- Routes handle HTTP only: parse request, call service, return response.
- Services contain domain/business logic.
- Repositories contain SQL queries and database mapping.
- Middleware contains auth, admin authorization, validation, and error handling.
- Migrations and seeds live under `server/db/`.

**Frontend Organization:**

- Pages live under `client/src/pages/`.
- Shared UI snippets live under `client/src/components/`.
- API client functions live under `client/src/api/`.
- Page-level state stays in page modules unless shared state is necessary.
- Shared helpers live under `client/src/utils/`.
- CSS lives under `client/src/styles/`.

**Admin-First Control Pattern:**

When logic is complex to automate, build a simple admin input/save flow:

- show current state,
- expose minimal fields,
- validate server-side,
- save to MariaDB/MySQL,
- trigger only necessary recalculation or state update.

### Format Patterns

**API Success Response Format:**

Use a consistent wrapper:

```json
{
  "data": {},
  "meta": {}
}
```

`meta` is optional and used for pagination, status, or contextual flags.

**API Error Response Format:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Friendly message",
    "details": {}
  }
}
```

**JSON Field Naming:**

- API JSON uses camelCase.
- Database uses snake_case.
- Repositories map between database rows and API/domain objects.

**Date/Time Format:**

- Store timestamps in MariaDB/MySQL as timestamp/timestamptz.
- API returns ISO 8601 strings.
- Deadline comparison uses server time only.
- Frontend formats dates for display.

### Communication Patterns

**No Event Bus For MVP:**

- No websocket/event-bus architecture.
- State changes happen through direct service calls.
- Example: result save calls scoring/ranking services synchronously or in an explicit backend sequence.

**State Update Pattern:**

- Frontend fetches fresh data after save/mutation.
- Do not invent a complex client-side cache.
- For prediction autosave, update local save state and refresh only the affected group/section when needed.

### Process Patterns

**Error Handling Patterns:**

- Backend route handlers pass errors to centralized Express error middleware.
- Validation errors return `400`.
- Unauthorized returns `401`.
- Forbidden admin/participant boundary violations return `403`.
- Not found returns `404`.
- Locked/revealed-state business rule conflicts return `409`.

**Loading State Patterns:**

- Forms use local loading/saving states.
- Prediction group save states are: `idle`, `dirty`, `saving`, `saved`, `error`.
- Page loads use simple loading/empty/error states.

**Validation Pattern:**

- Backend validates all write requests with Zod.
- Frontend may validate for convenience but cannot be trusted.
- Business rules such as deadline lock, reveal state, and admin authorization are always enforced on backend.

### Architecture Decision Record Pattern

For any implementation choice that affects multiple stories, agents must preserve the decision as an ADR-style rule in this document or a future `docs/architecture-decisions.md`.

**ADR Format:**

- **Decision:** The selected approach.
- **Alternatives Considered:** Other plausible approaches.
- **Rationale:** Why this approach fits Bolao 2026.
- **Implementation Rule:** What agents must do in code.

**Initial ADRs To Preserve:**

#### ADR-1: No PHP Runtime

- **Decision:** Use Node.js for backend runtime; old PHP codebase is behavioral reference only.
- **Alternatives Considered:** Reuse PHP pages/actions, hybrid PHP+Node, static-only frontend.
- **Rationale:** Node.js matches the chosen stack, avoids legacy risks, and can implement all required backend flows.
- **Implementation Rule:** Do not add PHP files or PHP runtime dependencies to the new app.

#### ADR-2: Backend-Enforced Fairness Rules

- **Decision:** Deadline lock and prediction reveal are enforced by backend services.
- **Alternatives Considered:** Frontend-only hiding, database-only flags without service checks.
- **Rationale:** Fairness and trust are core to the bolao; users must not access/edit hidden or locked state through API bypasses.
- **Implementation Rule:** Every prediction write and reveal/read endpoint must call deadline/reveal authorization logic.

#### ADR-3: Admin-First Control For Complex Tournament State

- **Decision:** Complex tournament state is controlled through simple admin input/save flows.
- **Alternatives Considered:** Automated bracket generation, autonomous result fetching, automatic reveal, inferred window state.
- **Rationale:** Admin authority preserves trust and reduces launch risk.
- **Implementation Rule:** When automation is non-trivial, expose admin fields and persist explicit state.

#### ADR-4: Services Own Domain Rules

- **Decision:** Route handlers delegate domain behavior to services.
- **Alternatives Considered:** Put scoring/deadline/ranking logic in route handlers or repositories.
- **Rationale:** Services keep domain rules testable and consistent across admin and participant flows.
- **Implementation Rule:** Route handlers may validate and call services; repositories may query data; services decide business behavior.

#### ADR-5: MariaDB/MySQL As Source Of Truth

- **Decision:** MariaDB/MySQL stores all competition state.
- **Alternatives Considered:** JSON files, browser storage, document database, PHP/MySQL reuse.
- **Rationale:** The domain is relational and depends on reliable scoring, ranking, and admin state.
- **Implementation Rule:** Do not store official predictions, results, ranking, reveal state, or admin control state only in frontend/local storage.

### Simplicity Rules For MVP

Agents must choose the simplest implementation that satisfies the story and preserves fairness.

**Use simple modules before frameworks:**

- Use plain JavaScript modules for frontend state.
- Do not introduce React, Vue, Redux, Zustand, or a design system unless a future architecture change approves it.

**Use direct MariaDB/MySQL queries before ORMs:**

- Use `mysql2` with parameterized SQL.
- Do not introduce Prisma, Sequelize, or Knex for MVP unless explicitly approved.
- Keep SQL readable and colocated in repositories.

**Use direct service calls before background jobs:**

- Result save may synchronously call scoring/ranking recalculation.
- Do not introduce queues, workers, Redis, or event buses for MVP.

**Use simple session auth before complex token architecture:**

- Use server-side sessions.
- Do not introduce JWT access/refresh token flows for MVP.

**Use static rules content before CMS/admin rich editing:**

- Rules can be stored as simple static content or a simple database row.
- Do not build a rich rules editor unless specifically requested.

**Use admin save forms before automation:**

- When unsure, give admin an input field and a save button.
- Do not infer or automate tournament state unless the rule is explicit and low-risk.

### Enforcement Guidelines

**All AI Agents MUST:**

- Use parameterized SQL; never string-concatenate user input.
- Put domain rules in services, not route handlers.
- Keep repositories responsible for database access only.
- Use database `snake_case` and API/domain `camelCase`.
- Enforce admin/participant authorization server-side.
- Enforce deadline and reveal state server-side.
- Preserve Explicit 0x0 versus Defaulted 0x0.
- Follow the admin-first control principle for complex tournament workflows.
- Avoid PHP runtime dependencies.

**Pattern Enforcement:**

- Story implementation should name which routes, services, repositories, and tables it touches.
- Any pattern deviation must be documented in the story implementation notes.
- Architecture changes should update this document before code diverges.

### Pattern Examples

**Good Examples:**

- `server/routes/prediction-routes.js`
- `server/services/deadline-service.js`
- `server/repositories/prediction-repository.js`
- `client/src/pages/palpites-page.js`
- `participants.display_name` maps to API field `displayName`.

**Anti-Patterns:**

- SQL like `"SELECT * FROM participants WHERE id=" + id`
- Route handlers that calculate ranking directly.
- Frontend-only checks for locked predictions.
- Returning other participants' predictions before backend reveal state is true.
- New PHP scripts in the new app.
- Mixing database snake_case directly into frontend rendering code.

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
bolao2026/
├── README.md
├── package.json
├── .gitignore
├── .env.example
├── client/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   ├── public/
│   │   └── avatars/
│   └── src/
│       ├── main.js
│       ├── api/
│       │   ├── api-client.js
│       │   ├── auth-api.js
│       │   ├── admin-api.js
│       │   ├── prediction-api.js
│       │   ├── ranking-api.js
│       │   ├── reveal-api.js
│       │   └── home-api.js
│       ├── pages/
│       │   ├── login-page.js
│       │   ├── register-page.js
│       │   ├── home-page.js
│       │   ├── palpites-page.js
│       │   ├── ranking-page.js
│       │   ├── todos-palpites-page.js
│       │   ├── regras-page.js
│       │   └── admin/
│       │       ├── admin-login-page.js
│       │       ├── admin-dashboard-page.js
│       │       ├── admin-registration-page.js
│       │       ├── admin-phases-page.js
│       │       ├── admin-matches-page.js
│       │       ├── admin-results-page.js
│       │       ├── admin-reveal-page.js
│       │       └── admin-notes-page.js
│       ├── components/
│       │   ├── app-shell.js
│       │   ├── bottom-nav.js
│       │   ├── status-message.js
│       │   ├── save-state.js
│       │   ├── phase-status-card.js
│       │   ├── ranking-row.js
│       │   ├── prediction-form.js
│       │   ├── participant-selector.js
│       │   └── empty-state.js
│       ├── state/
│       │   ├── session-state.js
│       │   └── page-state.js
│       ├── styles/
│       │   ├── base.css
│       │   ├── layout.css
│       │   ├── forms.css
│       │   ├── ranking.css
│       │   └── admin.css
│       └── utils/
│           ├── date-format.js
│           ├── score-format.js
│           └── dom.js
├── server/
│   ├── package.json
│   ├── app.js
│   ├── bin/
│   │   └── www
│   ├── config/
│   │   ├── env.js
│   │   └── session.js
│   ├── db/
│   │   ├── pool.js
│   │   ├── migrate.js
│   │   ├── seed.js
│   │   ├── migrations/
│   │   └── seeds/
│   ├── middleware/
│   │   ├── require-auth.js
│   │   ├── require-admin.js
│   │   ├── validate.js
│   │   └── error-handler.js
│   ├── routes/
│   │   ├── auth-routes.js
│   │   ├── participant-routes.js
│   │   ├── admin-routes.js
│   │   ├── phase-routes.js
│   │   ├── match-routes.js
│   │   ├── prediction-routes.js
│   │   ├── result-routes.js
│   │   ├── ranking-routes.js
│   │   ├── reveal-routes.js
│   │   ├── home-routes.js
│   │   └── rules-routes.js
│   ├── services/
│   │   ├── auth-service.js
│   │   ├── participant-service.js
│   │   ├── admin-service.js
│   │   ├── phase-service.js
│   │   ├── match-service.js
│   │   ├── prediction-service.js
│   │   ├── deadline-service.js
│   │   ├── defaulting-service.js
│   │   ├── reveal-service.js
│   │   ├── result-service.js
│   │   ├── scoring-service.js
│   │   ├── ranking-service.js
│   │   ├── home-service.js
│   │   └── rules-service.js
│   ├── repositories/
│   │   ├── participant-repository.js
│   │   ├── phase-repository.js
│   │   ├── match-repository.js
│   │   ├── prediction-window-repository.js
│   │   ├── prediction-repository.js
│   │   ├── extra-prediction-repository.js
│   │   ├── result-repository.js
│   │   ├── ranking-repository.js
│   │   ├── reveal-repository.js
│   │   ├── admin-note-repository.js
│   │   └── rules-repository.js
│   ├── schemas/
│   │   ├── auth-schemas.js
│   │   ├── admin-schemas.js
│   │   ├── prediction-schemas.js
│   │   ├── result-schemas.js
│   │   └── rules-schemas.js
│   └── utils/
│       ├── api-response.js
│       ├── async-route.js
│       ├── date-time.js
│       └── scores.js
├── tests/
│   ├── server/
│   │   ├── services/
│   │   └── repositories/
│   └── fixtures/
└── docs/
    └── architecture-decisions.md
```

### Architectural Boundaries

**API Boundaries:**

- Public auth endpoints live in `server/routes/auth-routes.js`.
- Participant endpoints require `require-auth`.
- Admin endpoints require both `require-auth` and `require-admin`.
- Prediction write endpoints must call `deadline-service`.
- Prediction reveal/read endpoints must call `reveal-service`.
- Result write endpoints must call scoring/ranking services.

**Component Boundaries:**

- Frontend pages orchestrate API calls and local state.
- Components render reusable UI only; they do not call APIs directly unless explicitly approved.
- API client modules hide fetch details and normalize response/error handling.

**Service Boundaries:**

- Services own domain rules.
- Repositories own SQL.
- Middleware owns request authentication, authorization, validation, and error response flow.
- Utilities must remain pure helpers and cannot reach into database or session state.

**Data Boundaries:**

- MariaDB/MySQL is the only source of truth for official competition state.
- Frontend local state is temporary UI state only.
- Predictions, results, ranking, reveal state, admin notes, and rules must be persisted in MariaDB/MySQL.

### Requirements to Structure Mapping

**Epic 1: Participant Access and Identity**
- Frontend: `login-page.js`, `register-page.js`, `session-state.js`
- Backend: `auth-routes.js`, `participant-routes.js`, `auth-service.js`, `participant-service.js`
- Data: `participant-repository.js`
- Middleware: `require-auth.js`

**Epic 2: Admin Control Center and Competition Setup**
- Frontend: `admin/*`
- Backend: `admin-routes.js`, `phase-routes.js`, `match-routes.js`
- Services: `admin-service.js`, `phase-service.js`, `match-service.js`
- Data: `phase-repository.js`, `match-repository.js`, `prediction-window-repository.js`
- Middleware: `require-admin.js`

**Epic 3: Participant Prediction Entry and Deadline Locking**
- Frontend: `palpites-page.js`, `prediction-form.js`, `save-state.js`
- Backend: `prediction-routes.js`
- Services: `prediction-service.js`, `deadline-service.js`, `defaulting-service.js`
- Data: `prediction-repository.js`, `extra-prediction-repository.js`

**Epic 4: Admin Results, Scoring, Corrections, and Disputes**
- Frontend: `admin-results-page.js`, `admin-notes-page.js`
- Backend: `result-routes.js`, `admin-routes.js`
- Services: `result-service.js`, `scoring-service.js`, `ranking-service.js`
- Data: `result-repository.js`, `ranking-repository.js`, `admin-note-repository.js`

**Epic 5: Ranking, Home, and Match-Day Engagement**
- Frontend: `home-page.js`, `ranking-page.js`, `phase-status-card.js`, `ranking-row.js`
- Backend: `home-routes.js`, `ranking-routes.js`
- Services: `home-service.js`, `ranking-service.js`, `reveal-service.js`
- Data: `ranking-repository.js`, `prediction-repository.js`, `result-repository.js`

**Epic 6: Prediction Reveal and Rules Transparency**
- Frontend: `todos-palpites-page.js`, `participant-selector.js`, `regras-page.js`
- Backend: `reveal-routes.js`, `rules-routes.js`
- Services: `reveal-service.js`, `rules-service.js`
- Data: `reveal-repository.js`, `rules-repository.js`, `prediction-repository.js`

### Integration Points

**Internal Communication:**

- Frontend pages call API client modules.
- API client modules call Express JSON endpoints.
- Routes call services.
- Services call repositories.
- Repositories call MariaDB/MySQL through `server/db/pool.js`.

**External Integrations:**

- None required for MVP.
- FIFA result scout and WhatsApp/recap integrations are deferred.

**Data Flow:**

- Registration: frontend form -> auth API -> auth service -> participant repository -> MariaDB/MySQL.
- Prediction save: Palpites page -> prediction API -> deadline service -> prediction service -> prediction repository -> MariaDB/MySQL.
- Result entry: admin result page -> result API -> result service -> scoring service -> ranking service -> repositories -> MariaDB/MySQL.
- Reveal: admin reveal page -> reveal API -> reveal service -> reveal repository -> MariaDB/MySQL.
- Home: home page -> home API -> home service -> ranking/reveal/result repositories -> aggregated response.

### File Organization Patterns

**Configuration Files:**

- Root `.env.example` documents expected environment variables.
- Server reads environment through `server/config/env.js`.
- Session setup lives in `server/config/session.js`.

**Source Organization:**

- Client and server are separate folders.
- Shared logic is not copied between client and server.
- Server domain rules live in `services`.
- SQL lives only in `repositories` and migrations/seeds.

**Test Organization:**

- Server service tests live under `tests/server/services/`.
- Repository tests live under `tests/server/repositories/`.
- Shared fixtures live under `tests/fixtures/`.
- Frontend tests are deferred unless the implementation adds a test framework.

**Asset Organization:**

- Curated avatar images live under `client/public/avatars/`.
- CSS is split by base/layout/forms/ranking/admin.
- No large image bundles in prediction entry flow.

### Development Workflow Integration

**Development Server Structure:**

- `client` runs Vite during frontend development.
- `server` runs Express during backend development.
- API base URL is configured in the client API module/environment.

**Build Process Structure:**

- Client build outputs static assets.
- Server serves API and can serve built client assets if deployment uses a single Node process.

**Deployment Structure:**

- Deploy Node.js server with MariaDB/MySQL connection.
- Run migrations before using the app.
- Set `DATABASE_URL`, `SESSION_SECRET`, and `NODE_ENV`.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
The selected stack is coherent: Vite Vanilla JavaScript for the frontend, Express/Node.js for the backend, MariaDB/MySQL for persistence, server-side sessions for auth, and `mysql2` repositories for database access. The decision to avoid PHP runtime is consistent with using the previous PHP app only as a behavioral reference.

**Pattern Consistency:**
The implementation patterns support the architecture: routes handle HTTP, services own business rules, repositories own SQL, backend enforces fairness rules, and MariaDB/MySQL remains the source of truth.

**Structure Alignment:**
The project structure maps cleanly to the six epics. Client pages, backend routes, services, repositories, schemas, middleware, and database folders are all defined with clear boundaries.

### Requirements Coverage Validation ✅

**Epic/Feature Coverage:**
All six epics are architecturally supported, including participant access, admin setup, prediction entry, scoring, ranking/home engagement, prediction reveal, and rules transparency.

**Functional Requirements Coverage:**
FR-1 through FR-25 have matching frontend, backend, service, repository, or data responsibilities.

**Non-Functional Requirements Coverage:**
Security, fairness, responsive UX, reliability, data integrity, and launch simplicity are addressed through backend authorization, deadline/reveal enforcement, server-side validation, explicit persistence rules, and lightweight frontend choices.

### Implementation Readiness Validation ✅

**Decision Completeness:**
Critical decisions are documented and specific enough for implementation agents.

**Structure Completeness:**
The structure is complete for MVP delivery and defines where each major file/module belongs.

**Pattern Completeness:**
Naming, API format, error handling, validation, service/repository boundaries, auth, and data rules are clear and enforceable.

### Gap Analysis Results

**Critical Gaps:** None.

**Important Gaps:** None blocking. Extras scoring is still an assumption, but the architecture isolates scoring in `scoring-service.js`, so it can be adjusted safely.

**Nice-to-Have Gaps:**
Hosting/deployment target and future FIFA result scout can be specified later.

### Validation Issues Addressed

No critical or important validation issues required architecture changes. The only notable assumption is extras scoring, already isolated behind the scoring service and captured in the PRD assumptions.

### Architecture Completeness Checklist

**Requirements Analysis**

- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**Architectural Decisions**

- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**Implementation Patterns**

- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**Project Structure**

- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**

- Strong admin-first model for launch speed.
- Clear fairness boundaries around deadline and reveal.
- Simple stack aligned with the preferred implementation approach.
- Service/repository split gives agents consistent implementation rules.
- Previous PHP app is used as domain reference without carrying old security risks.

**Areas for Future Enhancement:**

- FIFA result scout agent.
- WhatsApp/recap automation.
- More detailed deployment runbook.
- Expanded test framework once MVP stabilizes.

### Implementation Handoff

**AI Agent Guidelines:**

- Follow all architectural decisions exactly as documented.
- Use implementation patterns consistently across all components.
- Respect project structure and boundaries.
- Refer to this document for all architectural questions.

**First Implementation Priority:**
Initialize the Vite client and Express server, then add MariaDB/MySQL connection, migrations, environment config, and session auth.


