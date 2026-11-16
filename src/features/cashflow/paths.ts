export const CASHFLOW_SECTION_TITLE = 'Движение денежных средств';

export const CASHFLOW_SUMMARY_TITLE = 'Отчет общий';

export const CASHFLOW_PLAN_TITLE = 'Ввод плана';

export const CASHFLOW_FACT_TITLE = 'Ввод факта';

export const CASHFLOW_SUMMARY_HREF = '/cashflow';

export const CASHFLOW_PLAN_HREF = '/cashflow/plan';

export const CASHFLOW_FACT_HREF = '/cashflow/fact';

export function parseCashflowMonthQuery(params: { month?: string }): { month: string } {
  return { month: params.month ?? '' };
}

export function parseCashflowDayQuery(params: { month?: string; day?: string }): { month: string; day: string } {
  return { month: params.month ?? '', day: params.day ?? '' };
}

function monthHref(path: string, month: string, currentMonth: string): string {
  if (!month || month === currentMonth) {
    return path;
  }
  return `${path}?month=${month}`;
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

export function cashflowSummaryHref(options: { month: string; currentMonth: string }): string {
  return monthHref(CASHFLOW_SUMMARY_HREF, options.month, options.currentMonth);
}

export function cashflowPlanHref(options: { month: string; currentMonth: string }): string {
  return monthHref(CASHFLOW_PLAN_HREF, options.month, options.currentMonth);
}

export function cashflowFactHref(options: {
  month: string;
  day: string;
  currentMonth: string;
  todayDay: string;
}): string {
  return dayHref(CASHFLOW_FACT_HREF, options.month, options.day, options.currentMonth, options.todayDay);
}
