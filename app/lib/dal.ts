import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getToken } from "@/app/lib/session";

export const verifySession = cache(async () => {
  const token = await getToken();
  if (!token) {
    redirect("/login");
  }
  return { token };
});
