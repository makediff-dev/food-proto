import type { Metadata } from 'next';
import { ProductionPlanScreen } from '@/features/production/ProductionPlanScreen';
import { PRODUCTION_PLAN_TITLE, parseProductionPlanQuery } from '@/features/production/paths';

export const metadata: Metadata = {
  title: PRODUCTION_PLAN_TITLE,
};

export default async function ProductionPlanPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const params = await searchParams;
  const query = parseProductionPlanQuery(params);
  return <ProductionPlanScreen month={query.month} />;
}
