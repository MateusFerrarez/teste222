import "server-only";
import { cookies } from "next/headers";

export const TOKEN_COOKIE = "token";

const MAX_AGE = 60 * 60 * 24 * 1; // 7 days

export async function setToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE)?.value;
}

export async function deleteToken() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE);
}
