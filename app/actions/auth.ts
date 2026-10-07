"use server";

import { redirect } from "next/navigation";
import { deleteToken, setToken } from "@/app/lib/session";

export type LoginState = { error?: string; email?: string } | undefined;

export async function login(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Informe e-mail e senha.", email };
  }

  let token: unknown;
  try {
    const res = await fetch(`${process.env.API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        error:
          res.status === 401 || res.status === 400
            ? "E-mail ou senha incorretos."
            : "Não foi possível entrar. Tente novamente.",
        email,
      };
    }

    ({ token } = await res.json());
  } catch {
    return { error: "Não foi possível conectar ao servidor. Tente novamente.", email };
  }

  if (typeof token !== "string" || !token) {
    return { error: "Resposta inesperada do servidor.", email };
  }

  await setToken(token);
  redirect("/clientes");
}

export async function logout() {
  await deleteToken();
  redirect("/login");
}
