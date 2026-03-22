import { execSync } from "node:child_process";
import { assertE2EDatabaseReady, clearE2EDatabase, loadEnv } from "./postgres";

const root = process.cwd();

export default async function globalSetup() {
  loadEnv();
  await assertE2EDatabaseReady();
  execSync("yarn exec prisma migrate deploy", {
    cwd: root,
    stdio: "inherit",
  });
  await clearE2EDatabase();
}
