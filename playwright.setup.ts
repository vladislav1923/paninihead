import { execSync } from "node:child_process";
import { join } from "node:path";
import { config } from "dotenv";
import pg from "pg";

const root = process.cwd();

export default async function globalSetup() {
  config({ path: join(root, ".env.e2e") });
  const url = process.env.POSTGRES_URL as string;
  const client = new pg.Client({ connectionString: url });
  // try e2e database connection
  try {
    await client.connect();
    await client.query("SELECT 1");
  } catch (cause) {
    const msg = cause instanceof Error ? cause.message : String(cause);
    throw new Error(`Cannot connect to the e2e database: ${msg}`);
  }
  // run migrations
  execSync("yarn exec prisma migrate deploy", {
    cwd: root,
    stdio: "inherit",
  });

  // clear e2e database for pure e2e testing
  try {
    await client.query('TRUNCATE TABLE "Collections" CASCADE');
  } finally {
    await client.end();
  }
}
