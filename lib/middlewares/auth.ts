import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authCookieName, verifyUserToken } from "@/lib/utilities/jwt";

const publicPaths = new Set(["/", "/login", "/signup"]);

export async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (publicPaths.has(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(authCookieName)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = await verifyUserToken(token);
  if (!payload?.sub) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete(authCookieName);
    return response;
  }

  return NextResponse.next();
}
