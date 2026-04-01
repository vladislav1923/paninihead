import { SignJWT } from "jose";

const JWT_ALG = "HS256";
const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

function getJwtSecret(): Uint8Array {
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret) {
    throw new Error("Missing AUTH_JWT_SECRET");
  }
  return new TextEncoder().encode(secret);
}

export async function createUserToken(userId: string, username: string): Promise<string> {
  const secret = getJwtSecret();
  return new SignJWT({ username })
    .setProtectedHeader({ alg: JWT_ALG })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${ONE_DAY_IN_SECONDS}s`)
    .sign(secret);
}

export const authCookieName = "auth_token";
export const authCookieMaxAge = ONE_DAY_IN_SECONDS;
