import path from "node:path";
import { defineConfig, devices } from "@playwright/test";
import { config as loadEnv } from "dotenv";

const root = path.resolve(__dirname);
loadEnv({ path: path.join(root, ".env") });
loadEnv({ path: path.join(root, ".env.local"), override: true });

function playwrightDatabaseUrl(): string {
  const url = process.env.POSTGRES_URL_E2E?.trim() || process.env.POSTGRES_URL?.trim();
  if (!url) {
    throw new Error("Missing POSTGRES_URL or POSTGRES_URL_E2E for Playwright (see env.example).");
  }
  return url;
}

const postgresUrl = playwrightDatabaseUrl();

export default defineConfig({
  testDir: "./e2e",
  globalSetup: path.join(__dirname, "e2e/global-setup.ts"),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: "http://127.0.0.1:3001",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "yarn dev --port 3001",
    url: "http://127.0.0.1:3001",
    // When POSTGRES_URL_E2E is set, never reuse a server on :3001 — it may still be using the dev DB.
    reuseExistingServer: process.env.CI ? false : !process.env.POSTGRES_URL_E2E?.trim(),
    timeout: 120_000,
    env: {
      ...process.env,
      POSTGRES_URL: postgresUrl,
    },
  },
});
