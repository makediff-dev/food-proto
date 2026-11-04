import { isDerivativeWorkshopId } from '@/domain/derivatives';
import type { DerivativeWorkshopId } from '@/domain/document';

/** Block header in the sidebar; not a page link. */
export const RECIPES_SECTION_TITLE = 'Рецептурные журналы';

export const RECIPES_COST_TITLE = 'Себестоимость производных';

export const RECIPES_COST_HREF = '/recipes/cost';

export const RECIPES_FINISHED_COST_TITLE = 'Себестоимость готовой';

export const RECIPES_FINISHED_COST_HREF = '/recipes/finished/cost';

export const RECIPES_DERIVATIVES_TITLE = 'Производные';

export const RECIPES_DERIVATIVES_HREF = '/recipes';

export const RECIPES_FINISHED_TITLE = 'Готовая продукция';

export const RECIPES_FINISHED_HREF = '/recipes/finished';

export const NEW_DERIVATIVE_TITLE = 'Новая производная';

export function derivativeNewHref(workshopId?: DerivativeWorkshopId): string {
  if (!workshopId) {
    return '/recipes/new';
  }
  return `/recipes/new?workshop=${encodeURIComponent(workshopId)}`;
}

export function derivativeHref(id: string): string {
  return `/recipes/${encodeURIComponent(id)}`;
}

export function finishedProductHref(id: string): string {
  return `/recipes/finished/${encodeURIComponent(id)}`;
}

export function parseDerivativeWorkshopQuery(value: string | undefined): DerivativeWorkshopId | null {
  if (!value || !isDerivativeWorkshopId(value)) {
    return null;
  }
  return value;
}

export function parseRecipesCostMonthQuery(params: { month?: string }): { month: string } {
  return { month: params.month ?? '' };
}

export function recipesCostHref(options: { month: string; currentMonth: string }): string {
  if (!options.month || options.month === options.currentMonth) {
    return RECIPES_COST_HREF;
  }
  return `${RECIPES_COST_HREF}?month=${options.month}`;
}

export function parseRecipesFinishedCostMonthQuery(params: { month?: string }): { month: string } {
  return { month: params.month ?? '' };
}

export function recipesFinishedCostHref(options: { month: string; currentMonth: string }): string {
  if (!options.month || options.month === options.currentMonth) {
    return RECIPES_FINISHED_COST_HREF;
  }
  return `${RECIPES_FINISHED_COST_HREF}?month=${options.month}`;
}
