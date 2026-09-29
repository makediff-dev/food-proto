import type { Metadata } from "next";

import { PlacesScreen } from "@/features/directory/places-screen";
import type { PlaceKind } from "@/features/directory/place-paths";

export const metadata: Metadata = {
  title: "Цеха и склады",
};

export default async function PlacesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; deleted?: string }>;
}) {
  const params = await searchParams;
  const kind: PlaceKind = params.tab === "warehouses" ? "warehouses" : "workshops";
  const showDeleted = params.deleted === "1";

  return <PlacesScreen kind={kind} showDeleted={showDeleted} />;
}
