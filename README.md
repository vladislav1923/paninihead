# PaniniHead
## A pet project to track your collections and make deals with exchangers

[![Code Quality](https://github.com/vladislav1923/paninihead/actions/workflows/code-quality.yml/badge.svg)](https://github.com/vladislav1923/paninihead/actions/workflows/code-quality.yml)

### Start the database

```bash
docker compose up -d
```

This starts PostgreSQL 16 on port **6000** with:

- **User:** `user`
- **Password:** `password`
- **Database:** `paninihead`

### Stop the database

```bash
docker compose down
```

### Environment

Create a `.env` file in the project root (copy `env.example`)

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
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
