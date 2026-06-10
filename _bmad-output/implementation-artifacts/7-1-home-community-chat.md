# Story 7.1: Home Community Chat

Status: ready-for-dev

## Story

As a participant,
I want to exchange public messages with the other participants from Home,
so that the bolao has a shared place for conversation, reactions, and playful rivalry.

## Acceptance Criteria

1. Given an authenticated participant opens Home, when chat messages exist, then the chat shows public messages from newest to oldest, and each message shows sender nickname/avatar and creation time.
2. Given a participant submits text or Unicode emojis with a maximum input length of 240 Unicode characters, when the payload is valid, then the backend persists the message and the new item appears at the top.
3. Given the participant types `@`, when they select a participant from the suggestion list, then the composer records one `mentionedParticipantId`, inserts the public nickname visibly, and sends both the content and participant ID.
4. Given a public message mentions the authenticated participant, when Home renders it, then that message has a clear but restrained directed-to-you highlight; all other participants still see the same message without the personal highlight.
5. Given the content contains one supported image reference in the exact subset `<img src="https://...">`, when the backend validates it, then the client renders the URL as a small lazy-loaded thumbnail with enforced dimensions.
6. Given content contains `<script>`, event handlers, `javascript:`, `data:`, `file:`, malformed image markup, additional HTML tags, or more than one image reference, when it is submitted, then the backend rejects the request, no row is created, and no executable markup reaches the DOM.
7. Given content is empty after normalization or exceeds 240 Unicode characters before image parsing, when it is submitted, then the API returns a validation error and creates no row.
8. Given the chat is open on mobile, when messages, mentions, emojis, or image thumbnails render, then the layout remains readable without horizontal scrolling.
9. Given Home remains open, when another participant publishes a message, then polling refreshes the latest messages without a full-page reload and without duplicating existing rows.
10. Given older messages exist beyond the initial result limit, when the participant requests more, then the API returns the next older page while preserving newest-to-oldest order.

## Tasks / Subtasks

- [ ] Create chat persistence and indexes (AC: 1, 2, 3, 10)
  - [ ] Add `server/db/migrations/014_create_chat_messages.sql`.
  - [ ] Create `chat_messages` with `id BIGINT UNSIGNED`, `participant_id`, nullable `mentioned_participant_id`, `content VARCHAR(240)`, nullable `image_url VARCHAR(1024)`, and `created_at`.
  - [ ] Add foreign keys to `participants`; use `ON DELETE SET NULL` for the mentioned participant and preserve sender integrity.
  - [ ] Add indexes supporting `ORDER BY id DESC` and mentioned-participant lookup.

- [ ] Implement secure chat backend boundaries (AC: 1-7, 9, 10)
  - [ ] Add `server/schemas/chat-schemas.js` with Zod validation for content, mention ID, `limit`, and `beforeId`.
  - [ ] Add `server/repositories/chat-repository.js` with parameterized queries only.
  - [ ] Add `server/services/chat-service.js` for participant authorization, normalization, mention validation, image extraction, and response mapping.
  - [ ] Add `server/routes/chat-routes.js` with authenticated `GET /api/chat/messages`, `GET /api/chat/participants`, and `POST /api/chat/messages`.
  - [ ] Mount chat routes in `server/app.js`.
  - [ ] Return the established `{ data }` / `{ error: { code, message, details } }` API shape.

- [ ] Implement message and image safety (AC: 5-7)
  - [ ] Count the original normalized input against the 240-character limit before extracting image markup.
  - [ ] Support zero or one exact `<img src="HTTPS_URL">` reference; do not support arbitrary HTML.
  - [ ] Validate URLs with the standard `URL` API and allow `https:` only.
  - [ ] Store plain message content and validated `image_url` separately.
  - [ ] Never render user content with unsanitized `innerHTML`; use `escapeHtml` for text and set image attributes from the validated API field.
  - [ ] Render images with `loading="lazy"`, `referrerpolicy="no-referrer"`, fixed max dimensions, and `object-fit`.

- [ ] Add Home chat API and client state (AC: 1-4, 9, 10)
  - [ ] Add `client/src/api/chat-api.js`.
  - [ ] Extend `client/src/main.js` with chat messages, draft, mention selection, loading/error/sending state, pagination cursor, and polling timer.
  - [ ] Load chat independently from `/api/home` so polling does not recalculate ranking and Home analytics.
  - [ ] Poll the latest page every 10 seconds only while an authenticated participant is on Home.
  - [ ] Clear the timer on logout, route change, offline/error state, and before starting a replacement timer.
  - [ ] Merge refreshed messages by numeric ID to prevent duplicates.

- [ ] Build the responsive Home chat experience (AC: 1-5, 8-10)
  - [ ] Add a dedicated chat card to `client/src/pages/home-page.js`; keep it visible whether prediction entry is open or closed.
  - [ ] Place the composer above the message list and show a live `0/240` character counter.
  - [ ] Render newest messages first with participant identity, timestamp, content, optional thumbnail, and mention styling.
  - [ ] Add an `@` suggestion popover using the public participant list, excluding admin accounts.
  - [ ] Use keyboard-accessible suggestion selection and preserve the native emoji keyboard/input behavior without adding a heavy emoji dependency.
  - [ ] Add a compact empty state and a "Carregar mensagens anteriores" action.
  - [ ] Add chat styling in a focused stylesheet such as `client/src/styles/chat.css`, imported by the existing stylesheet entry point.

- [ ] Add focused tests and regression validation (AC: 1-10)
  - [ ] Unit-test message normalization, Unicode length, safe image extraction, forbidden protocols/markup, and mention validation.
  - [ ] Test repository/service pagination order and no-row-on-validation-error behavior.
  - [ ] Add a frontend render smoke test covering directed-message highlighting, escaped markup, fixed thumbnail class, and newest-first order.
  - [ ] Run the complete server test suite and production client build.

## Dev Notes

### Product Decisions

- Chat is public to every authenticated participant. A mention directs attention; it is not a private message.
- A message supports at most one mentioned participant and one image.
- Message order is always newest to oldest. Use numeric `id DESC` as the stable order and pagination cursor.
- Initial page size should be 30 messages; cap API `limit` at 50.
- Use 10-second polling for MVP. WebSockets remain deferred by architecture.
- Native Unicode emoji entry satisfies emoji support. Do not add an emoji-picker package unless separately approved.
- Chat remains visible after prediction windows close; it is independent from `activePrediction.canEdit`.

### Security Guardrails

- Do not implement general HTML support and do not install a browser HTML sanitizer merely to render arbitrary markup.
- Treat all content as text. Recognize only the strict image subset and split it server-side into `content` plus `imageUrl`.
- Never pass participant content directly to `innerHTML`, `insertAdjacentHTML`, or inline event attributes.
- Reject any HTML-like tag other than the single supported image reference. Error messages must be in Portuguese-BR.
- Validate `mentionedParticipantId` against a real non-admin participant. Do not trust a nickname sent by the browser.
- All chat routes require `requireAuth`; an admin session must not be treated as a participant sender.
- Add a lightweight database-backed anti-flood rule: query the sender's latest message and reject a new one when it was created less than 2 seconds earlier. Do not use process memory, because production restarts or multiple Node processes must not bypass the rule.

### API Contract

`GET /api/chat/messages?limit=30&beforeId=123`

```json
{
  "data": {
    "messages": [
      {
        "id": 125,
        "content": "@Nego Veio olha isso",
        "imageUrl": "https://example.com/image.jpg",
        "createdAt": "2026-06-09T15:00:00.000Z",
        "sender": {
          "id": 9,
          "nickname": "Danny Boy",
          "city": "Vinhedo",
          "avatarKey": "maestro"
        },
        "mentionedParticipant": {
          "id": 4,
          "nickname": "Nego Veio"
        },
        "isDirectedToCurrentParticipant": false
      }
    ],
    "nextBeforeId": 96,
    "hasMore": true
  }
}
```

`GET /api/chat/participants`

```json
{
  "data": {
    "participants": [
      {
        "id": 4,
        "nickname": "Nego Veio",
        "avatarKey": "artilheiro"
      }
    ]
  }
}
```

- Load mention options once when the participant workspace opens; do not repeat this list in each polling response.

`POST /api/chat/messages`

```json
{
  "content": "@Nego Veio olha isso <img src=\"https://example.com/image.jpg\">",
  "mentionedParticipantId": 4
}
```

- Successful POST returns the created mapped message.
- Validation uses HTTP 400; unauthenticated access uses 401; anti-flood uses 429.
- The service derives sender identity from the session and derives mentioned nickname from the database.

### Database Guidance

```sql
CREATE TABLE chat_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  participant_id BIGINT UNSIGNED NOT NULL,
  mentioned_participant_id BIGINT UNSIGNED NULL,
  content VARCHAR(240) NOT NULL,
  image_url VARCHAR(1024) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_chat_messages_created (id),
  KEY idx_chat_messages_mentioned (mentioned_participant_id, id),
  CONSTRAINT chat_messages_participant_fk
    FOREIGN KEY (participant_id) REFERENCES participants(id),
  CONSTRAINT chat_messages_mentioned_participant_fk
    FOREIGN KEY (mentioned_participant_id) REFERENCES participants(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

- Keep `VARCHAR(240)` index-free to remain compatible with the production MariaDB key-length limitation previously encountered.
- `utf8mb4` is mandatory so emojis persist correctly.

### Existing Code to Extend

- `server/app.js`: mount a new route module; preserve existing session/static asset order.
- `server/middleware/require-auth.js`: reuse for both chat endpoints.
- `server/services/participant-service.js`: reuse `getSessionParticipant` and `listPublicParticipants`.
- `server/utils/api-response.js`: preserve response envelopes.
- `client/src/api/api-client.js`: reuse `fetchJson` with session credentials.
- `client/src/pages/home-page.js`: add the chat card without coupling it to prediction form visibility.
- `client/src/main.js`: follow existing plain state/load/bind/render patterns and prevent timer leaks.
- `client/src/utils/escape-html.js`: use for all message and nickname text.

### Files Expected

**New**

- `server/db/migrations/014_create_chat_messages.sql`
- `server/schemas/chat-schemas.js`
- `server/repositories/chat-repository.js`
- `server/services/chat-service.js`
- `server/routes/chat-routes.js`
- `server/tests/chat-service.test.js`
- `client/src/api/chat-api.js`
- `client/src/styles/chat.css`

**Update**

- `server/app.js`
- `client/src/main.js`
- `client/src/pages/home-page.js`
- Existing client stylesheet entry point

### Testing Requirements

- Use Node's built-in `node:test` and `node:assert/strict`.
- Cover emoji strings using Unicode code-point counting (`Array.from(value).length`), not UTF-16 `.length`.
- Test `https:` image acceptance and rejection of `http:`, `javascript:`, `data:`, malformed tags, multiple images, and attributes such as `onerror`.
- Test message order and cursor pagination with equal/near timestamps by relying on `id`.
- Verify current-participant mention highlighting is computed server-side or from trusted IDs, not nickname text matching.
- Verify the chat still renders when the prediction phase is locked/closed.
- Run:
  - `npm.cmd run test --workspace server`
  - `npm.cmd run build:client`

### Project Structure Notes

- Follow route -> service -> repository separation.
- Use camelCase in API/code and snake_case in MariaDB.
- Use parameterized `mysql2/promise` SQL exclusively.
- Do not add WebSocket, Socket.IO, React, Vue, or a frontend state library.
- Do not integrate chat messages into `/api/home`; keep refresh cost isolated.

### References

- [Architecture: API & Communication Patterns](../planning-artifacts/architecture.md)
- [Architecture: Authentication & Security](../planning-artifacts/architecture.md)
- [Architecture: Frontend Architecture](../planning-artifacts/architecture.md)
- [Home implementation](../../client/src/pages/home-page.js)
- [Frontend state and binding](../../client/src/main.js)
- [Authentication middleware](../../server/middleware/require-auth.js)
- [API response shape](../../server/utils/api-response.js)
- [Participant public identity](../../server/services/participant-service.js)
- [HTML escaping helper](../../client/src/utils/escape-html.js)

## Dev Agent Record

### Agent Model Used

Codex

### Debug Log References

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.

### File List
