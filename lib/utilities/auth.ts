import { cookies } from "next/headers";
import { authCookieName, verifyUserToken } from "@/lib/utilities/jwt";

export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(authCookieName)?.value;
  if (!token) return null;

  const payload = await verifyUserToken(token);
  return payload?.sub ?? null;
}
