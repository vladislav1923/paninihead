import { execSync } from "node:child_process";
import { assertE2EDatabaseReady, clearE2EDatabase, resolveE2EDatabaseUrl } from "./postgres";

const root = process.cwd();

export default async function globalSetup() {
  await assertE2EDatabaseReady();
  const postgresUrl = resolveE2EDatabaseUrl();
  execSync("yarn exec prisma migrate deploy", {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, POSTGRES_URL: postgresUrl },
  });
  await clearE2EDatabase();
}
