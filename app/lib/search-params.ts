/** A single string value from page `searchParams`, or "" when missing or repeated. */
export function param(v: string | string[] | undefined) {
  return typeof v === "string" ? v : "";
}

/** 1-based `?page=` from the URL → 0-based API page. Invalid values become 0. */
export function pageFromParam(v: string | string[] | undefined) {
  const n = Number.parseInt(param(v), 10);
  return Number.isFinite(n) && n > 1 ? n - 1 : 0;
}
