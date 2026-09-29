import type { Metadata } from "next";

import { WriteOffDetailScreen } from "@/features/stock/write-off-detail";

export const metadata: Metadata = {
  title: "Списание",
};

export default async function WriteOffPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WriteOffDetailScreen id={decodeURIComponent(id)} />;
}
