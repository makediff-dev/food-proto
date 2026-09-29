import type { Metadata } from "next";

import { DerivativeDetailScreen } from "@/features/materials/derivative-detail";

export const metadata: Metadata = {
  title: "Производная",
};

export default async function DerivativePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DerivativeDetailScreen id={decodeURIComponent(id)} />;
}
