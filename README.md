# PaniniHead

## A pet project to track cards/stickers collections and make deals with other collectors

[![Code Quality](https://github.com/vladislav1923/paninihead/actions/workflows/code-quality.yml/badge.svg)](https://github.com/vladislav1923/paninihead/actions/workflows/code-quality.yml)

[![Tests](https://github.com/vladislav1923/paninihead/actions/workflows/tests.yml/badge.svg)](https://github.com/vladislav1923/paninihead/actions/workflows/tests.yml)

### Development

1. Create a `.env` file in the project root (copy `env.example`).  
2. `yarn db:start:dev` to start a db in a docker container
3. `npx prisma migrate deploy` to apply migrations for a fresh db
4. `yarn dev` to run UI on port 3000

### End-to-end tests

1. Create a `.env.e2e` file in the project root (copy `env.e2e.example`) 
2. `yarn db:start:e2e` to start a db in a docker container
3. `npx prisma migrate deploy` to apply migrations for a fresh db
4. `yarn test:e2e` or `yarn test:e2e:watch` in watch mode

### More on migrations

| Task                                                                        | Command                     |
| --------------------------------------------------------------------------- | --------------------------- |
| Create a new migration and apply it                                         | `npx prisma migrate dev`    |
| Apply existing migrations only                                              | `npx prisma migrate deploy` |
| Check migration status                                                      | `npx prisma migrate status` |
