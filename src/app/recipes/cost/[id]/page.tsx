import { redirect } from 'next/navigation';

import { parseRecipesCostMonthQuery, RECIPES_COST_HREF } from '@/features/recipes/paths';

/** Старый URL карточки — состав раскрывается в своде. */
export default async function RecipesCostDetailPage({
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ month?: string }>;
}) {
  const query = parseRecipesCostMonthQuery(await searchParams);
  redirect(query.month ? `${RECIPES_COST_HREF}?month=${encodeURIComponent(query.month)}` : RECIPES_COST_HREF);
}
