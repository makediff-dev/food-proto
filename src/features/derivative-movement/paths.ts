/** Block header in the sidebar; not a page link. */
export const DERIVATIVE_MOVEMENT_SECTION_TITLE = 'Движение производных';

export const DERIVATIVE_MOVEMENT_SUMMARY_TITLE = 'Отчет общий';

export const DERIVATIVE_MOVEMENT_SUMMARY_HREF = '/derivative-movement';

export function parseDerivativeMovementMonthQuery(params: { month?: string }): { month: string } {
  return { month: params.month ?? '' };
}

export function derivativeMovementSummaryHref(options: { month: string; currentMonth: string }): string {
  if (!options.month || options.month === options.currentMonth) {
    return DERIVATIVE_MOVEMENT_SUMMARY_HREF;
  }
  return `${DERIVATIVE_MOVEMENT_SUMMARY_HREF}?month=${options.month}`;
}
