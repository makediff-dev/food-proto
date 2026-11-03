import type { Metadata } from 'next';

import { DerivativeCostScreen } from '@/features/recipes/DerivativeCostScreen';
import { parseRecipesCostMonthQuery, RECIPES_COST_TITLE } from '@/features/recipes/paths';

export const metadata: Metadata = {
  title: RECIPES_COST_TITLE,
};

export default async function RecipesCostPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const query = parseRecipesCostMonthQuery(await searchParams);
  return <DerivativeCostScreen month={query.month} />;
}
