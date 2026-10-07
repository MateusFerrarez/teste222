"use client";

import { useEffect } from "react";

export default function AppError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <div className="screen-header">
        <div>
          <h1 className="title">Algo deu errado</h1>
        </div>
      </div>

      <div className="table-area">
        <div className="load-error" role="alert">
          <div className="load-error-title">Ocorreu um erro inesperado.</div>
          <div className="load-error-msg">Tente novamente. Se o problema continuar, contate o suporte.</div>
          {error.digest && <div className="load-error-code">Código: {error.digest}</div>}
          <button type="button" className="btn btn-ghost sm" onClick={() => retry()}>
            Tentar novamente
          </button>
        </div>
      </div>
    </>
  );
}
