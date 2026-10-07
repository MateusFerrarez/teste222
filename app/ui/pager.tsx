import Link from "next/link";

function PagerButton({ href, label }: { href: string | null; label: string }) {
  if (href === null) {
    return (
      <button type="button" className="btn btn-ghost sm" disabled>
        {label}
      </button>
    );
  }
  return (
    <Link href={href} replace scroll={false} className="btn btn-ghost sm">
      {label}
    </Link>
  );
}

type Props = {
  /** Current page, 0-based. */
  page: number;
  totalPages: number;
  /** URL of a 0-based page, keeping any filters. */
  href: (page: number) => string;
};

/** "Anterior · Página X de Y · Próxima" bar below a table. */
export function Pager({ page, totalPages, href }: Props) {
  const pages = Math.max(totalPages, 1);
  return (
    <div className="pager">
      <PagerButton href={page > 0 ? href(Math.min(page, pages) - 1) : null} label="Anterior" />
      <span className="pager-label">
        Página {page + 1} de {pages}
      </span>
      <PagerButton href={page + 1 < pages ? href(page + 1) : null} label="Próxima" />
    </div>
  );
}
