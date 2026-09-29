import type { Metadata } from "next";

import { PlaceDetailScreen } from "@/features/directory/place-detail";

export const metadata: Metadata = {
  title: "Склад",
};

export default async function WarehousePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PlaceDetailScreen kind="warehouses" id={decodeURIComponent(id)} />;
}
