import type { Metadata } from 'next';

import { FinishedProductCostScreen } from '@/features/recipes/FinishedProductCostScreen';
import { parseRecipesFinishedCostMonthQuery, RECIPES_FINISHED_COST_TITLE } from '@/features/recipes/paths';

export const metadata: Metadata = {
  title: RECIPES_FINISHED_COST_TITLE,
};

export default async function RecipesFinishedCostPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const query = parseRecipesFinishedCostMonthQuery(await searchParams);
  return <FinishedProductCostScreen month={query.month} />;
}
