import type { Metadata } from "next";

import { StockScreen } from "@/features/stock/stock-screen";
import { STOCK_SECTION_TITLE, type StockTab } from "@/features/stock/paths";

export const metadata: Metadata = {
  title: STOCK_SECTION_TITLE,
};

export default async function StockPage({
  searchParams,
}: {
  searchParams: Promise<{
    tab?: string;
    deleted?: string;
    warehouse?: string;
    month?: string;
  }>;
}) {
  const params = await searchParams;
  const tab: StockTab =
    params.tab === "write-offs" || params.tab === "flow" || params.tab === "balances"
      ? params.tab
      : "deliveries";
  const showDeleted = params.deleted === "1";

  return (
    <StockScreen
      tab={tab}
      showDeleted={showDeleted}
      warehouseId={params.warehouse ?? ""}
      month={params.month ?? ""}
    />
  );
}
