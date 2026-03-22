/**
 * E2E Postgres helpers using `pg` only (no Prisma). Used from Playwright global setup and specs
 * so the test runner never loads the generated Prisma client (ESM/CJS mismatch with Playwright).
 */

import { join } from "node:path";
import { config } from "dotenv";
import pg from "pg";

const root = join(__dirname, "..");

function loadEnv() {
  config({ path: join(root, ".env") });
}

/** Connection string Playwright and the e2e Next server use for Postgres. */
export function resolveE2EDatabaseUrl(): string {
  loadEnv();
  const url = process.env.POSTGRES_URL_E2E?.trim() || process.env.POSTGRES_URL?.trim();
  if (!url) {
    throw new Error("Missing POSTGRES_URL or POSTGRES_URL_E2E (see env.example).");
  }
  return url;
}

function redactConnectionString(urlStr: string): string {
  try {
    const u = new URL(urlStr);
    if (u.password) u.password = "***";
    return u.toString();
  } catch {
    return urlStr;
  }
}

function e2eDbRunHint(): string {
  if (process.env.CI) {
    return "On CI, ensure the workflow defines POSTGRES_URL and the Postgres service is up.";
  }
  return ["Start the e2e Postgres container, then re-run tests:", "  yarn db:start:e2e"].join("\n");
}

/** Connects once; throws immediately if Postgres is not reachable. */
export async function assertE2EDatabaseReady(): Promise<void> {
  const url = resolveE2EDatabaseUrl();
  const client = new pg.Client({ connectionString: url });
  try {
    await client.connect();
    await client.query("SELECT 1");
  } catch (cause) {
    const msg = cause instanceof Error ? cause.message : String(cause);
    throw new Error(
      `Cannot connect to the e2e database (${redactConnectionString(url)}).\n${e2eDbRunHint()}\nUnderlying error: ${msg}`,
    );
  } finally {
    try {
      await client.end();
    } catch {
      /* ignore */
    }
  }
}

/** Removes all app rows from the e2e database (also invoked from Playwright global setup after migrate). */
export async function clearE2EDatabase(): Promise<void> {
  const client = new pg.Client({ connectionString: resolveE2EDatabaseUrl() });
  await client.connect();
  try {
    await client.query('TRUNCATE TABLE "Collections" CASCADE');
  } finally {
    await client.end();
  }
}

function randomCollectionId(): string {
  return `cle2e${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
}

/** Inserts a collection row via SQL (avoids loading Prisma in the Playwright process). */
export async function seedE2ECollection(collected: number[], total = 5): Promise<string> {
  const id = randomCollectionId();
  const name = `D${Date.now()}`;
  const client = new pg.Client({ connectionString: resolveE2EDatabaseUrl() });
  await client.connect();
  try {
    await client.query(
      `INSERT INTO "Collections" (id, name, status, total, collected, "createdAt")
       VALUES ($1, $2, 'InProgress'::"CollectionStatus", $3, $4, NOW())`,
      [id, name, total, collected],
    );
    return id;
  } finally {
    await client.end();
  }
}
