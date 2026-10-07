"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

/** Re-renders the current route's server components, e.g. after a failed API call. */
export function RetryButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="btn btn-ghost sm"
      disabled={pending}
      onClick={() => startTransition(() => router.refresh())}
    >
      {pending ? "Tentando…" : "Tentar novamente"}
    </button>
  );
}
