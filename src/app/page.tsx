import type { Metadata } from "next";

import { parseSummaryQuery } from "@/features/sales/paths";
import { SummaryScreen } from "@/features/sales/summary-screen";

export const metadata: Metadata = {
  title: "Сводка",
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; deleted?: string; plan?: string }>;
}) {
  const params = await searchParams;
  const query = parseSummaryQuery(params);
  return (
    <SummaryScreen
      month={query.month}
      showDeleted={query.showDeleted}
      planId={query.planId}
    />
  );
}
