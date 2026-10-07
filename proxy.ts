import { NextRequest, NextResponse } from "next/server";

// Optimistic redirects only; the real check is verifySession() in app/lib/dal.ts.
// Keep in sync with TOKEN_COOKIE in app/lib/session.ts.
const TOKEN_COOKIE = "token";

export function proxy(req: NextRequest) {
  const isLogin = req.nextUrl.pathname === "/login";
  const hasToken = req.cookies.has(TOKEN_COOKIE);

  if (!hasToken && !isLogin) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (hasToken && isLogin) {
    return NextResponse.redirect(new URL("/clientes", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
