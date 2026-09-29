import type { Metadata } from "next";

import { ProductionScreen } from "@/features/production/production-screen";
import {
  parseProductionQuery,
  PRODUCTION_SECTION_TITLE,
} from "@/features/production/paths";

export const metadata: Metadata = {
  title: PRODUCTION_SECTION_TITLE,
};

export default async function ProductionPage({
  searchParams,
}: {
  searchParams: Promise<{
    view?: string;
    part?: string;
    month?: string;
    sheet?: string;
    deleted?: string;
  }>;
}) {
  const params = await searchParams;
  const query = parseProductionQuery(params);

  return (
    <ProductionScreen
      view={query.view}
      part={query.part}
      month={query.month}
      sheet={query.sheet}
      showDeleted={query.showDeleted}
    />
  );
}
