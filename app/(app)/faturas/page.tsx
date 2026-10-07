import type { Metadata } from "next";
import { Suspense } from "react";
import { settle } from "@/app/lib/api";
import { BILL_STATUS, getBills, type BillStatus } from "@/app/lib/bills";
import { formatBRL, formatDate, formatMonthYear, formatResultCount } from "@/app/lib/format";
import { pageFromParam } from "@/app/lib/search-params";
import { LoadError } from "@/app/ui/load-error";
import { Loading } from "@/app/ui/loading";
import { Pager } from "@/app/ui/pager";

export const metadata: Metadata = {
  title: "Faturas - PSZ Manager",
};

type SearchParams = PageProps<"/faturas">["searchParams"];

function pageHref(page: number) {
  return page > 0 ? `/faturas?page=${page + 1}` : "/faturas";
}

function StatusBadge({ status }: { status: BillStatus }) {
  const { label, bg, fg } = BILL_STATUS[status];
  return (
    <span className="badge" style={{ background: bg, color: fg }}>
      {label}
    </span>
  );
}

async function Subtitle() {
  const { data } = await settle(getBills(0));
  if (!data) return <div className="subtitle" />;
  // Read after getBills() so the request data has been accessed first.
  const month = formatMonthYear(new Date());
  return (
    <div className="subtitle">
      {month} · {data.totalElements} faturas
    </div>
  );
}

async function BillsView({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const { data, error } = await settle(getBills(pageFromParam(sp.page)));
  if (!data) return <LoadError title="Não foi possível carregar as faturas" message={error} />;

  const { bills, page, size, totalElements, totalPages } = data;

  return (
    <>
      <div className="clients-search">
        <div style={{ flex: 1 }} />
        <span className="result-count">
          {formatResultCount(page, size, bills.length, totalElements)}
        </span>
      </div>

      <div className="table-area">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 140 }}>Nº</th>
              <th>Cliente</th>
              <th style={{ width: 110 }}>Vencimento</th>
              <th className="num" style={{ width: 140 }}>
                Valor S/ Juros
              </th>
              <th style={{ width: 120 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((b) => (
              <tr key={b.externalId}>
                <td className="mono" style={{ whiteSpace: "nowrap" }}>
                  {b.externalId}
                </td>
                <td>
                  <div style={{ fontWeight: 600, lineHeight: 1.3 }}>{b.customerName}</div>
                  <div style={{ font: "400 12px var(--font-mono)", color: "#6B7280" }}>
                    {b.customerExternalId}
                  </div>
                </td>
                <td>{formatDate(b.dueDate)}</td>
                <td className="num" style={{ fontWeight: 600 }}>
                  {formatBRL(b.value)}
                </td>
                <td>
                  <StatusBadge status={b.status} />
                </td>
              </tr>
            ))}
            {bills.length === 0 && (
              <tr className="empty-row">
                <td colSpan={5}>Nenhuma fatura encontrada</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pager page={page} totalPages={totalPages} href={pageHref} />
    </>
  );
}

export default function FaturasPage({ searchParams }: PageProps<"/faturas">) {
  return (
    <>
      <div className="screen-header">
        <div>
          <h1 className="title">Faturas</h1>
          <Suspense fallback={<div className="subtitle" />}>
            <Subtitle />
          </Suspense>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="table-area">
            <Loading label="Carregando faturas…" />
          </div>
        }
      >
        <BillsView searchParams={searchParams} />
      </Suspense>
    </>
  );
}
