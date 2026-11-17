/** Block header in the sidebar; not a page link. */
export const DERIVATIVE_MOVEMENT_SECTION_TITLE = 'Движение производных';

export const DERIVATIVE_MOVEMENT_SUMMARY_TITLE = 'Отчет общий';

export const DERIVATIVE_MOVEMENT_PLAN_TITLE = 'Ввод плана';

export const DERIVATIVE_MOVEMENT_INVENTORY_TITLE = 'Инвентаризация';

export const DERIVATIVE_MOVEMENT_CONSUMPTION_TITLE = 'Расход в производстве';

export const DERIVATIVE_MOVEMENT_SUMMARY_HREF = '/derivative-movement';

export const DERIVATIVE_MOVEMENT_PLAN_HREF = '/derivative-movement/plan';

export const DERIVATIVE_MOVEMENT_INVENTORY_HREF = '/derivative-movement/inventory';

export const DERIVATIVE_MOVEMENT_CONSUMPTION_HREF = '/derivative-movement/fact';

export function parseDerivativeMovementMonthQuery(params: { month?: string }): { month: string } {
  return { month: params.month ?? '' };
}

export function parseDerivativeMovementDayQuery(params: { month?: string; day?: string }): {
  month: string;
  day: string;
} {
  return { month: params.month ?? '', day: params.day ?? '' };
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

function dayHref(path: string, month: string, day: string, currentMonth: string, todayDay: string): string {
  const params = new URLSearchParams();
  if (month && month !== currentMonth) {
    params.set('month', month);
  }
  if (day && day !== todayDay) {
    params.set('day', day);
  }
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

export function derivativeMovementConsumptionHref(options: {
  month: string;
  day: string;
  currentMonth: string;
  todayDay: string;
}): string {
  return dayHref(
    DERIVATIVE_MOVEMENT_CONSUMPTION_HREF,
    options.month,
    options.day,
    options.currentMonth,
    options.todayDay,
  );
}
