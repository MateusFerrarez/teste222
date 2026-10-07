type Props = {
  label?: string;
  /** Small, single-row variant for toolbars and buttons. Default is a centered block for table areas and panels. */
  inline?: boolean;
};

/** Spinner + label. Safe to render from server and client components. */
export function Loading({ label = "Carregando…", inline = false }: Props) {
  return (
    <div className={inline ? "loading inline" : "loading"} role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      {label}
    </div>
  );
}
