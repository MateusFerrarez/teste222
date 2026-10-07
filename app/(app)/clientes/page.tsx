import type { Metadata } from "next";
import { Suspense } from "react";
import { settle } from "@/app/lib/api";
import {
  CUSTOMER_STATUS_OPTIONS,
  getCustomers,
  isCustomerStatus,
  type Customer,
  type CustomersPage,
  type CustomerStatus,
} from "@/app/lib/customers";
import { formatCNPJ, formatResultCount } from "@/app/lib/format";
import { SEARCH_MAX_LENGTH } from "@/app/lib/search";
import { pageFromParam, param } from "@/app/lib/search-params";
import { LoadError } from "@/app/ui/load-error";
import { Loading } from "@/app/ui/loading";
import { Pager } from "@/app/ui/pager";
import { SearchControls } from "@/app/ui/search-controls";

export const metadata: Metadata = {
  title: "Clientes - PSZ Manager",
};

type SearchParams = PageProps<"/clientes">["searchParams"];

type Filters = { q: string; status: CustomerStatus | "" };

/** → "Rua, numero · cidade/SP" */
function formatAddress(address: Customer["address"]) {
  if (!address) return "—";
  return `${address.street}, ${address.number} · ${address.city}/${address.state}`;
}

/** Keeps the current search and status filter when changing pages. */
function pageHref(page: number, { q, status }: Filters) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (status) params.set("status", status);
  if (page > 0) params.set("page", String(page + 1));
  const qs = params.toString();
  return qs ? `/clientes?${qs}` : "/clientes";
}

async function Subtitle() {
  const { data } = await settle(getCustomers(0));
  if (!data) return <div className="subtitle" />;
  return <div className="subtitle">{data.totalElements} clientes cadastrados</div>;
}

function CustomersTable({ data, filters }: { data: CustomersPage; filters: Filters }) {
  const { customers, page, totalPages } = data;

  return (
    <>
      <div className="table-area">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 110 }}>ID externo</th>
              <th>Razão social</th>
              <th>Nome fantasia</th>
              <th style={{ width: 180 }}>CNPJ</th>
              <th style={{ width: 130 }}>IE</th>
              <th>Endereço</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => {
              const off = c.status === "OFF";
              return (
                <tr key={c.id} className={off ? "off" : undefined}>
                  <td className="mono">{c.externalId}</td>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td>{c.fantasy}</td>
                  <td className="mono">{formatCNPJ(c.document)}</td>
                  <td className="mono">{c.secondDocument || "—"}</td>
                  <td style={{ fontSize: 13, color: off ? undefined : "#374151" }}>
                    {formatAddress(c.address)}
                  </td>
                </tr>
              );
            })}
            {customers.length === 0 && (
              <tr className="empty-row">
                <td colSpan={6}>Nenhum cliente encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pager page={page} totalPages={totalPages} href={(p) => pageHref(p, filters)} />
    </>
  );
}

async function ClientsView({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const status = param(sp.status);
  const filters: Filters = {
    q: param(sp.q).trim().slice(0, SEARCH_MAX_LENGTH),
    status: isCustomerStatus(status) ? status : "",
  };
  const { data, error } = await settle(
    getCustomers(pageFromParam(sp.page), filters.q, filters.status),
  );
  const count = data
    ? formatResultCount(data.page, data.size, data.customers.length, data.totalElements)
    : "";

  // The toolbar renders in the same position in both branches, so the search
  // input keeps focus and its typed value when the results below change.
  return (
    <>
      <div className="clients-search">
        <SearchControls
          placeholder="Buscando por código externo, razão, fantasia ou CNPJ/CPF..."
          width={420}
          filter={{
            param: "status",
            label: "Status",
            allLabel: "Todos os status",
            options: CUSTOMER_STATUS_OPTIONS,
          }}
        />
        <div style={{ flex: 1 }} />
        <span className="result-count">{count}</span>
      </div>

      {data ? <CustomersTable data={data} filters={filters} /> : (
        <LoadError title="Não foi possível carregar os clientes" message={error} />
      )}
    </>
  );
}

export default function ClientesPage({ searchParams }: PageProps<"/clientes">) {
  return (
    <>
      <div className="screen-header">
        <div>
          <h1 className="title">Clientes</h1>
          <Suspense fallback={<div className="subtitle" />}>
            <Subtitle />
          </Suspense>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="table-area">
            <Loading label="Carregando clientes…" />
          </div>
        }
      >
        <ClientsView searchParams={searchParams} />
      </Suspense>
    </>
  );
}
