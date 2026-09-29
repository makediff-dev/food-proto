import type { Metadata } from "next";

import { PlaceDetailScreen } from "@/features/directory/place-detail";

export const metadata: Metadata = {
  title: "Цех",
};

export default async function WorkshopPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PlaceDetailScreen kind="workshops" id={decodeURIComponent(id)} />;
}
