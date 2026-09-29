import type { Metadata } from "next";

import { DeliveryDetailScreen } from "@/features/stock/delivery-detail";

export const metadata: Metadata = {
  title: "Поставка",
};

export default async function DeliveryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DeliveryDetailScreen id={decodeURIComponent(id)} />;
}
