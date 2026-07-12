# bolao2026

Bolao 2026 is a responsive World Cup prediction pool for a friends group.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Make sure the `bolao2026` database exists in your MariaDB/MySQL instance.

3. If you are starting from a fresh database, run the migration once:

```bash
npm run migrate:server
```

4. Seed the competition schedule from the local World Cup PDF:

```bash
npm run seed:server
```

The admin panel stores the official match gabarito in `competition_match_master`, including the `jogo realizado` flag and the real score that will later drive ranking calculations. The legacy `competition_matches` table is dropped after the master table migration so the database has a single source of truth for match data.

5. Start the client:

```bash
npm run dev:client
```

6. Start the server:

```bash
npm run dev:server
```

7. Build the client for production:

```bash
npm run build:client
```

## Monitoring

This project exposes Prometheus-formatted metrics at `GET /api/metrics` and shows a live monitoring panel inside the admin dashboard.

1. Start the API as usual.
2. Log in to the admin panel.
3. Open the `Monitoramento` section inside the dashboard.

The monitoring panel updates automatically and does not require Docker, Grafana, or Prometheus to run locally.

## Environment

Copy `.env.example` to `.env` and set the values for your local database and session secret. The target database architecture is MariaDB/MySQL. The default client API base URL points to `http://localhost:3000` so the dev browser and server stay same-site for session cookies.

The admin panel uses the `ADMIN_USERNAME` and `ADMIN_PASSWORD` values from `.env`. In development the defaults are `admin@bolao.local` and `Brasil@2026`.

## Project layout

- `client/` - Vite vanilla frontend
- `server/` - Express API and MariaDB/MySQL foundation
- `tests/` - Shared test helpers and future automated coverage
- `docs/` - Implementation notes and architecture references



