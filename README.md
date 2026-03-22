# PaniniHead
## A pet project to track your collections and make deals with exchangers

[![Code Quality](https://github.com/vladislav1923/paninihead/actions/workflows/code-quality.yml/badge.svg)](https://github.com/vladislav1923/paninihead/actions/workflows/code-quality.yml)

### Start the database

- **Dev + e2e (recommended locally):** `yarn db:start` — uses [`docker-compose.yml`](docker-compose.yml) and [`docker-compose.e2e.yml`](docker-compose.e2e.yml).
- **Dev only:** `yarn db:start:dev` or `docker compose up -d`.

Both stacks use PostgreSQL 16 (same image, isolated data):

| Service | Host port | Database   | Use        |
|---------|-----------|------------|------------|
| `db`    | **6000**  | `paninihead` | `yarn dev` (`POSTGRES_URL`) |
| `db-e2e`| **6001**  | `paninihead_e2e` | Playwright (`POSTGRES_URL_E2E`) |

**User / password:** `user` / `password` on both.

Prisma has **one** [`prisma/schema.prisma`](prisma/schema.prisma) and **one** migration history under [`prisma/migrations`](prisma/migrations). `prisma migrate deploy` (and `migrate dev` against your dev URL) applies that same history to whichever database the connection string points at—so the e2e container does not need a duplicate schema; Playwright’s global setup runs `migrate deploy` against `POSTGRES_URL_E2E` before tests.

### Stop the database

`yarn db:stop` stops both compose files. For dev only: `docker compose down`.

### Environment

Create a `.env` file in the project root (copy `env.example`).

For **Playwright** (`yarn test:e2e`), set **`POSTGRES_URL_E2E`** to the e2e database (see `env.example`). That URL is passed to the dev server started on port **3001** only for tests, so e2e does not use your dev `POSTGRES_URL`. If `POSTGRES_URL_E2E` is unset, Playwright falls back to `POSTGRES_URL` (as on CI with a single ephemeral database).

Start e2e Postgres before running tests (local): **`yarn db:start:e2e`**, or **`yarn db:start`** for dev + e2e.

Playwright **`globalSetup`** ([`e2e/global-setup.ts`](e2e/global-setup.ts)) runs **`assertE2EDatabaseReady()`**, **`prisma migrate deploy`**, then **`clearE2EDatabase()`** once per `yarn test:e2e` run so Postgres is up, the schema is current, and app tables start empty. **`clearE2EDatabase()`** and **`seedE2ECollection()`** live in [`e2e/postgres.ts`](e2e/postgres.ts) (raw `pg` SQL) so Playwright never loads the Prisma client. UI helpers are in [`e2e/playwright-utils.ts`](e2e/playwright-utils.ts). **`collection-exchangers.spec.ts`** and **`collection-deals.spec.ts`** each seed a collection in **`beforeAll`** (deals need duplicate collected stickers).

### End-to-end tests

1. `POSTGRES_URL` → dev app (`yarn dev`)
2. `POSTGRES_URL_E2E` → `yarn test:e2e` (global setup runs migrations against this URL; Next on `:3001`)

Run **`yarn db:start:e2e`** (or **`yarn db:start`**) before **`yarn test:e2e`** locally.

### Migrations

| Task | Command |
|------|--------|
| Create a new migration (after changing `prisma/schema.prisma`) and apply it | `npx prisma migrate dev` |
| Apply existing migrations only (e.g. in CI or after pulling new migrations) | `npx prisma migrate deploy` |
| Check migration status | `npx prisma migrate status` |

Run `npx prisma migrate dev` when you change the schema; run `npx prisma migrate deploy` when you only need to run migrations that are already in the repo.

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
