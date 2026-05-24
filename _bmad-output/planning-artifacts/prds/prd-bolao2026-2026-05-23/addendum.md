# PRD Addendum: Bolao 2026

## Source Inputs

- Product brief: `_bmad-output/planning-artifacts/briefs/brief-bolao2026-2026-05-23/brief.md`
- Product brief addendum: `_bmad-output/planning-artifacts/briefs/brief-bolao2026-2026-05-23/addendum.md`
- Brainstorming artifact: `_bmad-output/brainstorming/brainstorming-session-2026-05-23-104034.md`
- Previous database export: `kb_copa_mundo/codebase-copa-anterior/db-bolao-final-2022-export.sql`
- Previous rules PDFs: `kb_copa_mundo/regras-dos-boloes-anteriores/`

## Evidence Notes

- The old DB includes `users`, `bets`, `master`, `rounds`, `ranking`, `messages`, `admin`, and `twitter` tables.
- Old `bets.BET_POINTS` values observed include 0, 1, and 3, supporting but not proving a likely match scoring model.
- Old `ranking` stores round points, accumulated points, ranking, and last ranking, supporting movement indicators.
- Old `messages` had dated phase reminders, supporting Home attention messages.
- Old `users` included nickname and extras-like fields: champion, semifinalists, striker, and striker goals.

## Implementation Notes For Architecture

- Recommended frontend stack: HTML, CSS, and JavaScript.
- Recommended backend stack: Node.js.
- Recommended relational database: MariaDB/MySQL.
- Backend must enforce prediction reveal and deadline lock. Frontend hiding is not sufficient.
- Store prediction intent state: explicit prediction vs defaulted prediction.
- Store ranking snapshots or previous rank values to compute movement arrows.
- Treat Admin as a separate role/account in authorization checks.
- Keep scoring rules configurable or isolated so 2026 rule confirmation does not require rewriting ranking logic.
- A static Rules page may be fastest for launch, but source text should be easy to update.

## Deferred Ideas

- FIFA result scout with admin approval.
- WhatsApp-ready recap generator.
- Public pinned rival.
- Full social feed.
- Automated knockout bracket generation.
- Advanced audit log UI.

