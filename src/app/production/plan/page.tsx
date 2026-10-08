import type { Metadata } from 'next';

import { parseProductionPlanQuery } from '@/features/production/paths';
import { ProductionPlanScreen } from '@/features/production/production-plan-screen';

export const metadata: Metadata = {
  title: 'Планируемое производство',
};

export default async function ProductionPlanPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const params = await searchParams;
  const query = parseProductionPlanQuery(params);
  return <ProductionPlanScreen month={query.month} />;
}
