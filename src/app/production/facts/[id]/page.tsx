import type { Metadata } from "next";

import { FactDetailScreen } from "@/features/production/fact-detail";

export const metadata: Metadata = {
  title: "Факт производства",
};

export default async function ProductionFactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <FactDetailScreen id={decodeURIComponent(id)} />;
}
