import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

function getConnectionString(): string {
  const url = process.env.POSTGRES_URL;
  if (!url) throw new Error("Missing POSTGRES_URL");

  // In production, ensure sslmode is set to avoid pg v9 behavior change and SSL issues (see pg-connection-string v3 warning)
  const isProd = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
  if (isProd) {
    try {
      const parsed = new URL(url);
      if (!parsed.searchParams.has("sslmode")) {
        parsed.searchParams.set("sslmode", "require");
        return parsed.toString();
      }
    } catch {
      // Not a valid URL, use as-is
    }
  }
  return url;
}

const adapter = new PrismaPg({ connectionString: getConnectionString() });
export const db = new PrismaClient({ adapter });
