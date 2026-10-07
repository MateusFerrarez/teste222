import { RetryButton } from "@/app/ui/retry-button";

/** Failed-load state shown in place of a table, with a retry button. */
export function LoadError({ title, message }: { title: string; message: string }) {
  return (
    <div className="table-area">
      <div className="load-error" role="alert">
        <div className="load-error-title">{title}</div>
        <div className="load-error-msg">{message}</div>
        <RetryButton />
      </div>
    </div>
  );
}
