export type StockTab = "deliveries" | "write-offs" | "flow" | "balances";

export const STOCK_SECTION_TITLE = "Складской учет";

/** Остатки сразу по всем складам. */
export const ALL_WAREHOUSES = "all";

export function stockHref(
  tab: StockTab,
  showDeleted = false,
  warehouseId = "",
  month = "",
): string {
  const params = new URLSearchParams();
  if (tab !== "deliveries") {
    params.set("tab", tab);
  }
  if (showDeleted && (tab === "deliveries" || tab === "write-offs")) {
    params.set("deleted", "1");
  }
  if (tab === "balances" && warehouseId) {
    params.set("warehouse", warehouseId);
  }
  if (tab === "balances" && month) {
    params.set("month", month);
  }

  const query = params.toString();
  return query ? `/stock?${query}` : "/stock";
}

export function deliveryHref(id: string): string {
  return `/stock/deliveries/${encodeURIComponent(id)}`;
}

export function writeOffHref(id: string): string {
  return `/stock/write-offs/${encodeURIComponent(id)}`;
}
