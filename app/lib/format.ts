const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** 18420 → "R$ 18.420,00" */
export function formatBRL(value: number) {
  return brl.format(value);
}

/** "12345678000190" → "12.345.678/0001-90"; 11 digits are formatted as CPF. Anything else is returned as-is. */
export function formatCNPJ(doc: string) {
  const d = doc.replace(/\D/g, "");
  if (d.length === 14) return d.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  if (d.length === 11) return d.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  return doc;
}

/** "2026-09-30" → "30/09/2026" */
export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

/** Page 0 (0-based), size 60, 60 rows, 80 total → "Exibindo 1–60 de 80" */
export function formatResultCount(page: number, size: number, rows: number, total: number) {
  if (rows === 0) return "Nenhum resultado";
  const first = page * size + 1;
  return `Exibindo ${first}–${first + rows - 1} de ${total}`;
}

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

/** → "Outubro de 2026" */
export function formatMonthYear(date: Date) {
  return `${MONTHS[date.getMonth()]} de ${date.getFullYear()}`;
}
