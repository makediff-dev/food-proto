import type { Metadata } from 'next';

import { FinishedProductCostDetailScreen } from '@/features/recipes/FinishedProductCostDetailScreen';
import { parseRecipesFinishedCostMonthQuery, RECIPES_FINISHED_COST_TITLE } from '@/features/recipes/paths';

export const metadata: Metadata = {
  title: RECIPES_FINISHED_COST_TITLE,
};

export default async function RecipesFinishedCostDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ month?: string }>;
}) {
  const { id } = await params;
  const query = parseRecipesFinishedCostMonthQuery(await searchParams);
  return <FinishedProductCostDetailScreen productId={decodeURIComponent(id)} month={query.month} />;
}
