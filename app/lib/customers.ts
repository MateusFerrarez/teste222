import "server-only";
import { cache } from "react";
import { apiGet } from "@/app/lib/api";

export type Address = {
  id: number;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
};

export type CustomerStatus = "ON" | "OFF";

export const CUSTOMER_STATUS_OPTIONS = [
  { value: "ON", label: "Ativo" },
  { value: "OFF", label: "Excluído" },
] as const satisfies readonly { value: CustomerStatus; label: string }[];

export function isCustomerStatus(v: string): v is CustomerStatus {
  return v === "ON" || v === "OFF";
}

export type Customer = {
  id: number;
  name: string;
  fantasy: string;
  document: string;
  secondDocument: string | null;
  externalId: string;
  firebaseUid: string | null;
  status: CustomerStatus;
  /** Epoch milliseconds */
  lastSync: number;
  address: Address | null;
};

export type CustomersPage = {
  customers: Customer[];
  /** 0-based */
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

/**
 * Fetches one page (0-based) of customers, optionally filtered by a search
 * term and status. Throws `ApiError` on failure.
 */
export const getCustomers = cache(
  async (page: number = 0, search: string = "", status: CustomerStatus | "" = "") => {
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("search", search);
    if (status) params.set("status", status);

    return apiGet<CustomersPage>(`/customers/getCustomers?${params}`, "os clientes");
  },
);
