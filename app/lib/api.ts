import "server-only";
import { redirect } from "next/navigation";
import { verifySession } from "@/app/lib/dal";

/** An expected API failure. `message` is user-facing (pt-BR) and safe to render. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Calls the backend API with the logged-in user's bearer token.
 * Use this for every authenticated request, e.g. `await apiFetch("/me")`.
 * Throws `ApiError` when the server can't be reached.
 */
export async function apiFetch(path: string, init?: RequestInit) {
  const { token } = await verifySession();

  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let res: Response;
  try {
    res = await fetch(`${process.env.API_URL}${path}`, { ...init, headers });
  } catch {
    throw new ApiError("Não foi possível conectar ao servidor.");
  }

  if (res.status === 401) {
    redirect("/login");
  }

  return res;
}

/** `what` includes its article, e.g. "os clientes", "as faturas". */
function httpErrorMessage(status: number, what: string) {
  if (status === 403) return `Você não tem permissão para ver ${what}.`;
  if (status >= 500) {
    return `O servidor encontrou um erro ao carregar ${what}. Tente novamente em instantes.`;
  }
  return `Não foi possível carregar ${what} (erro ${status}).`;
}

/**
 * GETs `path` and parses the JSON body. Throws `ApiError` with a user-facing
 * message about `what` (e.g. "os clientes") on any failure.
 */
export async function apiGet<T>(path: string, what: string): Promise<T> {
  const res = await apiFetch(path);
  if (!res.ok) {
    throw new ApiError(httpErrorMessage(res.status, what), res.status);
  }
  try {
    return (await res.json()) as T;
  } catch {
    throw new ApiError("Resposta inesperada do servidor.");
  }
}

export type Settled<T> = { data: T; error?: never } | { data?: never; error: string };

/**
 * Turns an `ApiError` into `{ error }` so pages can render it; anything else
 * is rethrown for the nearest error.tsx.
 */
export async function settle<T>(promise: Promise<T>): Promise<Settled<T>> {
  try {
    return { data: await promise };
  } catch (e) {
    if (e instanceof ApiError) return { error: e.message };
    throw e;
  }
}
