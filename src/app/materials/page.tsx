import type { Metadata } from 'next';

import { MaterialsSummaryScreen } from '@/features/materials/MaterialsSummaryScreen';
import { MATERIALS_SUMMARY_TITLE, parseMaterialMonthQuery } from '@/features/materials/paths';

export const metadata: Metadata = {
  title: MATERIALS_SUMMARY_TITLE,
};

export default async function MaterialsPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const query = parseMaterialMonthQuery(await searchParams);
  return <MaterialsSummaryScreen month={query.month} />;
}
