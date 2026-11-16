/** Подпись блока в домене; в меню кредиты живут под «Движение денежных средств». */
export const CREDIT_RESOURCES_SECTION_TITLE = 'Движение кредитных ресурсов';

export const CREDIT_RESOURCES_SUMMARY_TITLE = 'Отчет по кредитам';

export const CREDIT_RESOURCES_PLAN_TITLE = 'Кредиты · Ввод плана';

export const CREDIT_RESOURCES_FACT_TITLE = 'Кредиты · Ввод факта';

export const CREDIT_RESOURCES_SUMMARY_HREF = '/credit-resources';

export const CREDIT_RESOURCES_PLAN_HREF = '/credit-resources/plan';

export const CREDIT_RESOURCES_FACT_HREF = '/credit-resources/fact';

export function parseCreditMonthQuery(params: { month?: string }): { month: string } {
  return { month: params.month ?? '' };
}

export function parseCreditDayQuery(params: { month?: string; day?: string }): { month: string; day: string } {
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

export function creditResourcesSummaryHref(options: { month: string; currentMonth: string }): string {
  return monthHref(CREDIT_RESOURCES_SUMMARY_HREF, options.month, options.currentMonth);
}

export function creditResourcesPlanHref(options: { month: string; currentMonth: string }): string {
  return monthHref(CREDIT_RESOURCES_PLAN_HREF, options.month, options.currentMonth);
}

export function creditResourcesFactHref(options: {
  month: string;
  day: string;
  currentMonth: string;
  todayDay: string;
}): string {
  return dayHref(CREDIT_RESOURCES_FACT_HREF, options.month, options.day, options.currentMonth, options.todayDay);
}
