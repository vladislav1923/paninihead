import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

const url = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
if (!url) throw new Error("Missing POSTGRES_URL or DATABASE_URL");

const adapter = new PrismaPg({ connectionString: url });
export const db = new PrismaClient({ adapter });
