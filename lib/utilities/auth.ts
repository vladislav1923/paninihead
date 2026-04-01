import { cookies } from "next/headers";
import { authCookieName, verifyUserToken } from "@/lib/utilities/jwt";

export type AuthUser = {
  id: string;
  username: string;
};

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(authCookieName)?.value;
  if (!token) return null;

  const payload = await verifyUserToken(token);
  if (!payload?.sub || !payload.username) return null;

  return {
    id: payload.sub,
    username: payload.username,
  };
}
