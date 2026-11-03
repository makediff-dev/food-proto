import type { Metadata } from 'next';

import { DerivativeCostDetailScreen } from '@/features/recipes/DerivativeCostDetailScreen';
import { parseRecipesCostMonthQuery, RECIPES_COST_TITLE } from '@/features/recipes/paths';

export const metadata: Metadata = {
  title: RECIPES_COST_TITLE,
};

export default async function RecipesCostDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ month?: string }>;
}) {
  const { id } = await params;
  const query = parseRecipesCostMonthQuery(await searchParams);
  return <DerivativeCostDetailScreen derivativeId={decodeURIComponent(id)} month={query.month} />;
}
