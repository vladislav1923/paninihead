# PaniniHead

## A pet project to track your collections and make deals with other collectors

[![Code Quality](https://github.com/vladislav1923/paninihead/actions/workflows/code-quality.yml/badge.svg)](https://github.com/vladislav1923/paninihead/actions/workflows/code-quality.yml)

[![Tests](https://github.com/vladislav1923/paninihead/actions/workflows/tests.yml/badge.svg)](https://github.com/vladislav1923/paninihead/actions/workflows/tests.yml)

### Start the database

`yarn db:start:dev`

**User / password:** `user` / `password` on both.

### Stop the database

`yarn db:stop`

### Environment

Create a `.env` file in the project root (copy `env.example`).
Create a `.env.e2e` file in the project root (copy `env.e2e.example`) for running E2E tests.

### End-to-end tests

1. Create `.env.e2e` by example
2. `yarn db:start:e2e`
3. `yarn test:e2e` or `yarn test:e2e:watch` in watch mode

### Migrations


| Task                                                                        | Command                     |
| --------------------------------------------------------------------------- | --------------------------- |
| Create a new migration (after changing `prisma/schema.prisma`) and apply it | `npx prisma migrate dev`    |
| Apply existing migrations only (e.g. in CI or after pulling new migrations) | `npx prisma migrate deploy` |
| Check migration status                                                      | `npx prisma migrate status` |


Run `npx prisma migrate dev` when you change the schema; run `npx prisma migrate deploy` when you only need to run migrations that are already in the repo.

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.