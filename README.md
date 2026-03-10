This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Database

The project uses PostgreSQL with Prisma. The database runs in Docker.

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
