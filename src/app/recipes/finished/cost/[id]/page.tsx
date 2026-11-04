import { redirect } from 'next/navigation';

import { parseRecipesFinishedCostMonthQuery, RECIPES_FINISHED_COST_HREF } from '@/features/recipes/paths';

/** Старый URL карточки — состав раскрывается в своде. */
export default async function RecipesFinishedCostDetailPage({
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ month?: string }>;
}) {
  const query = parseRecipesFinishedCostMonthQuery(await searchParams);
  redirect(
    query.month ? `${RECIPES_FINISHED_COST_HREF}?month=${encodeURIComponent(query.month)}` : RECIPES_FINISHED_COST_HREF,
  );
}
