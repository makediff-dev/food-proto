import type { Metadata } from "next";

import { MaterialDetailScreen } from "@/features/materials/material-detail";

export const metadata: Metadata = {
  title: "Сырьё",
};

export default async function MaterialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MaterialDetailScreen id={decodeURIComponent(id)} />;
}
