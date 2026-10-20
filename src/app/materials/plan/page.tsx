import type { Metadata } from 'next';

import { MaterialsPlanScreen } from '@/features/materials/MaterialsPlanScreen';
import { MATERIALS_PLAN_TITLE, parseMaterialMonthQuery } from '@/features/materials/paths';

export const metadata: Metadata = {
  title: MATERIALS_PLAN_TITLE,
};

export default async function MaterialsPlanPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const query = parseMaterialMonthQuery(await searchParams);
  return <MaterialsPlanScreen month={query.month} />;
}
