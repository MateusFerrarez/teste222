import "server-only";
import { cache } from "react";
import { apiGet } from "@/app/lib/api";

export type BillStatus = "OPEN" | "DEFEATED" | "OFF";

export type Bill = {
  externalId: string;
  customerExternalId: string;
  customerName: string;
  value: number;
  /** ISO date, yyyy-mm-dd */
  dueDate: string;
  status: BillStatus;
};

export type BillsPage = {
  bills: Bill[];
  /** 0-based */
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export const BILL_STATUS: Record<BillStatus, { label: string; bg: string; fg: string }> = {
  OPEN: { label: "EM ABERTO", bg: "#E8F1FB", fg: "#1A3A5C" },
  DEFEATED: { label: "VENCIDO", bg: "#FDECEA", fg: "#8E1F1F" },
  OFF: { label: "EXCLUÍDO", bg: "#E4E7EB", fg: "#374151" },
};

/** Fetches one page (0-based) of bills. Throws `ApiError` on failure. */
export const getBills = cache(async (page: number = 0) =>
  apiGet<BillsPage>(`/bills/getBills?page=${page}`, "as faturas"),
);
