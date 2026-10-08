import type { Metadata } from 'next';
import { ProductionPlanScreen } from '@/features/production/ProductionPlanScreen';
import { parseProductionPlanQuery } from '@/features/production/paths';

export const metadata: Metadata = {
  title: 'Планируемое производство',
};

export default async function ProductionPlanPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const params = await searchParams;
  const query = parseProductionPlanQuery(params);
  return <ProductionPlanScreen month={query.month} />;
}
