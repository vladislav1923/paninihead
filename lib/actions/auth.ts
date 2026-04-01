"use server";

import { compare, hash } from "bcryptjs";
import { cookies } from "next/headers";
import { authSchema } from "@/lib/schemas/auth";
import { db } from "@/lib/utilities/db";
import { authCookieMaxAge, authCookieName, createUserToken } from "@/lib/utilities/jwt";
import { logger } from "@/lib/utilities/logger";
import { validateFormSchema } from "@/lib/utilities/validation";

type AuthResult =
  | { ok: true; userId: string; username: string }
  | { ok: false; errors: Record<string, string> };

const PASSWORD_SALT_ROUNDS = 12;
const INVALID_CREDENTIALS_ERROR = "Invalid username or password";

export async function signup(raw: unknown): Promise<AuthResult> {
  try {
    logger.info("Signup user");

    const validated = validateFormSchema(authSchema, raw);
    if (!validated.ok) return { ok: false, errors: validated.errors };

    const username = validated.data.username.trim().toLowerCase();
    const password = validated.data.password;

    const existingUser = await db.users.findUnique({
      where: { username },
      select: { id: true },
    });
    if (existingUser) {
      return { ok: false, errors: { username: "Username already exists." } };
    }

    const passwordHash = await hash(password, PASSWORD_SALT_ROUNDS);
    const user = await db.users.create({
      data: {
        username,
        passwordHash,
      },
      select: {
        id: true,
        username: true,
      },
    });

    logger.info("Signup success", { userId: user.id, username: user.username });
    return { ok: true, userId: user.id, username: user.username };
  } catch (cause) {
    const errorMessage = cause instanceof Error ? cause.message : String(cause);
    logger.error("Signup failed", { error: errorMessage });
    return { ok: false, errors: { _: "Failed to sign up" } };
  }
}

export async function login(raw: unknown): Promise<AuthResult> {
  try {
    logger.info("Login user");

    const validated = validateFormSchema(authSchema, raw);
    if (!validated.ok) return { ok: false, errors: validated.errors };

    const username = validated.data.username.trim().toLowerCase();
    const password = validated.data.password;

    const user = await db.users.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return { ok: false, errors: { _: INVALID_CREDENTIALS_ERROR } };
    }

    const isValidPassword = await compare(password, user.passwordHash);
    if (!isValidPassword) {
      return { ok: false, errors: { _: INVALID_CREDENTIALS_ERROR } };
    }

    const token = await createUserToken(user.id, user.username);
    const cookieStore = await cookies();
    cookieStore.set(authCookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: authCookieMaxAge,
      path: "/",
    });

    logger.info("Login success", { userId: user.id, username: user.username });
    return { ok: true, userId: user.id, username: user.username };
  } catch (cause) {
    const errorMessage = cause instanceof Error ? cause.message : String(cause);
    logger.error("Login failed", { error: errorMessage });
    return { ok: false, errors: { _: "Failed to log in" } };
  }
}
