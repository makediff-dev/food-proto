import type { Metadata } from "next";

import { PlanDetailScreen } from "@/features/sales/plan-detail";

export const metadata: Metadata = {
  title: "План продаж",
};

export default async function PlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PlanDetailScreen id={decodeURIComponent(id)} />;
}
