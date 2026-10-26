/** Block header in the sidebar; not a page link. */
export const DERIVATIVE_MOVEMENT_SECTION_TITLE = 'Движение производных';

export const DERIVATIVE_MOVEMENT_SUMMARY_TITLE = 'Отчет общий';

export const DERIVATIVE_MOVEMENT_PLAN_TITLE = 'Ввод плана';

export const DERIVATIVE_MOVEMENT_INVENTORY_TITLE = 'Инвентаризация';

export const DERIVATIVE_MOVEMENT_SUMMARY_HREF = '/derivative-movement';

export const DERIVATIVE_MOVEMENT_PLAN_HREF = '/derivative-movement/plan';

export const DERIVATIVE_MOVEMENT_INVENTORY_HREF = '/derivative-movement/inventory';

export function parseDerivativeMovementMonthQuery(params: { month?: string }): { month: string } {
  return { month: params.month ?? '' };
}

export function derivativeMovementSummaryHref(options: { month: string; currentMonth: string }): string {
  if (!options.month || options.month === options.currentMonth) {
    return DERIVATIVE_MOVEMENT_SUMMARY_HREF;
  }
  return `${DERIVATIVE_MOVEMENT_SUMMARY_HREF}?month=${options.month}`;
}

export function parseDerivativeMovementPlanQuery(params: { month?: string }): { month: string } {
  return { month: params.month ?? '' };
}

export function derivativeMovementPlanHref(options: { month: string; currentMonth: string }): string {
  if (!options.month || options.month === options.currentMonth) {
    return DERIVATIVE_MOVEMENT_PLAN_HREF;
  }
  return `${DERIVATIVE_MOVEMENT_PLAN_HREF}?month=${options.month}`;
}

export function parseDerivativeMovementInventoryQuery(params: { month?: string }): { month: string } {
  return { month: params.month ?? '' };
}

export function derivativeMovementInventoryHref(options: { month: string; currentMonth: string }): string {
  if (!options.month || options.month === options.currentMonth) {
    return DERIVATIVE_MOVEMENT_INVENTORY_HREF;
  }
  return `${DERIVATIVE_MOVEMENT_INVENTORY_HREF}?month=${options.month}`;
}
