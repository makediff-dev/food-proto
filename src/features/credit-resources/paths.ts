/** Подпись блока в домене; в меню кредиты живут под «Движение денежных средств». */
export const CREDIT_RESOURCES_SECTION_TITLE = 'Движение кредитных ресурсов';

export const CREDIT_RESOURCES_SUMMARY_TITLE = 'Отчет по кредитам';

export const CREDIT_RESOURCES_PLAN_TITLE = 'Ввод плана кредитов';

export const CREDIT_RESOURCES_FACT_TITLE = 'Ввод факта кредитов';

export const CREDIT_RESOURCES_SUMMARY_HREF = '/credit-resources';

export const CREDIT_RESOURCES_PLAN_HREF = '/credit-resources/plan';

export const CREDIT_RESOURCES_FACT_HREF = '/credit-resources/fact';

export function parseCreditMonthQuery(params: { month?: string }): { month: string } {
  return { month: params.month ?? '' };
}

function monthHref(path: string, month: string, currentMonth: string): string {
  if (!month || month === currentMonth) {
    return path;
  }
  return `${path}?month=${month}`;
}

export function creditResourcesSummaryHref(options: { month: string; currentMonth: string }): string {
  return monthHref(CREDIT_RESOURCES_SUMMARY_HREF, options.month, options.currentMonth);
}

export function creditResourcesPlanHref(options: { month: string; currentMonth: string }): string {
  return monthHref(CREDIT_RESOURCES_PLAN_HREF, options.month, options.currentMonth);
}

export function creditResourcesFactHref(options: { month: string; currentMonth: string }): string {
  return monthHref(CREDIT_RESOURCES_FACT_HREF, options.month, options.currentMonth);
}
