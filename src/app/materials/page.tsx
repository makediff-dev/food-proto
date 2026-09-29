import type { Metadata } from "next";

import { MaterialsScreen } from "@/features/materials/materials-screen";
import { MATERIALS_SECTION_TITLE, type MaterialKind } from "@/features/materials/paths";

export const metadata: Metadata = {
  title: MATERIALS_SECTION_TITLE,
};

export default async function MaterialsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; deleted?: string }>;
}) {
  const params = await searchParams;
  const kind: MaterialKind =
    params.tab === "products"
      ? "products"
      : params.tab === "derivatives"
        ? "derivatives"
        : "materials";
  const showDeleted = params.deleted === "1";

  return <MaterialsScreen kind={kind} showDeleted={showDeleted} />;
}
