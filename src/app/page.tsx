import type { Metadata } from "next";

import { SummaryScreen } from "@/features/sales/summary-screen";

export const metadata: Metadata = {
  title: "Сводка",
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  const params = await searchParams;
  return <SummaryScreen showDeleted={params.deleted === "1"} />;
}
