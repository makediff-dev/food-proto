export const OPEX_SECTION_TITLE = 'Операционные расходы';

export const OPEX_SUMMARY_TITLE = 'Отчет общий';

export const OPEX_HR_TITLE = 'HR';

export const OPEX_HR_PLAN_TITLE = 'Ввод плана';

export const OPEX_HR_FACT_TITLE = 'Ввод факта';

export const OPEX_TRANSPORT_TITLE = 'Транспорт';

export const OPEX_TRANSPORT_PLAN_TITLE = 'Ввод плана';

export const OPEX_TRANSPORT_FACT_TITLE = 'Ввод факта';

export const OPEX_OTHER_TITLE = 'Прочее';

export const OPEX_OTHER_PLAN_TITLE = 'Ввод плана';

export const OPEX_OTHER_FACT_TITLE = 'Ввод факта';

export const OPEX_SUMMARY_HREF = '/opex';
export const OPEX_HR_HREF = '/opex/hr';
export const OPEX_HR_PLAN_HREF = '/opex/hr/plan';
export const OPEX_HR_FACT_HREF = '/opex/hr/fact';
export const OPEX_TRANSPORT_HREF = '/opex/transport';
export const OPEX_TRANSPORT_PLAN_HREF = '/opex/transport/plan';
export const OPEX_TRANSPORT_FACT_HREF = '/opex/transport/fact';
export const OPEX_OTHER_PLAN_HREF = '/opex/other/plan';
export const OPEX_OTHER_FACT_HREF = '/opex/other/fact';

export const OPEX_GROUP_BASE_HREF = '/opex/group';

export function opexGroupHrefPath(code: string): string {
  return `${OPEX_GROUP_BASE_HREF}/${code}`;
}

export function opexGroupPlanHrefPath(code: string): string {
  return `${opexGroupHrefPath(code)}/plan`;
}

export function opexGroupFactHrefPath(code: string): string {
  return `${opexGroupHrefPath(code)}/fact`;
}

export function parseOpexMonthQuery(params: { month?: string }): { month: string } {
  return { month: params.month ?? '' };
}

export function parseOpexDayQuery(params: { month?: string; day?: string }): { month: string; day: string } {
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

export function opexSummaryHref(options: { month: string; currentMonth: string }): string {
  return monthHref(OPEX_SUMMARY_HREF, options.month, options.currentMonth);
}

export function opexHrHref(options: { month: string; currentMonth: string }): string {
  return monthHref(OPEX_HR_HREF, options.month, options.currentMonth);
}

export function opexHrPlanHref(options: { month: string; currentMonth: string }): string {
  return monthHref(OPEX_HR_PLAN_HREF, options.month, options.currentMonth);
}

export function opexHrFactHref(options: {
  month: string;
  day: string;
  currentMonth: string;
  todayDay: string;
}): string {
  return dayHref(OPEX_HR_FACT_HREF, options.month, options.day, options.currentMonth, options.todayDay);
}

export function opexTransportHref(options: { month: string; currentMonth: string }): string {
  return monthHref(OPEX_TRANSPORT_HREF, options.month, options.currentMonth);
}

export function opexTransportPlanHref(options: { month: string; currentMonth: string }): string {
  return monthHref(OPEX_TRANSPORT_PLAN_HREF, options.month, options.currentMonth);
}

export function opexTransportFactHref(options: {
  month: string;
  day: string;
  currentMonth: string;
  todayDay: string;
}): string {
  return dayHref(OPEX_TRANSPORT_FACT_HREF, options.month, options.day, options.currentMonth, options.todayDay);
}

export function opexOtherPlanHref(options: { month: string; currentMonth: string }): string {
  return monthHref(OPEX_OTHER_PLAN_HREF, options.month, options.currentMonth);
}

export function opexOtherFactHref(options: { month: string; currentMonth: string }): string {
  return monthHref(OPEX_OTHER_FACT_HREF, options.month, options.currentMonth);
}

export function opexGroupHref(options: { code: string; month: string; currentMonth: string }): string {
  return monthHref(opexGroupHrefPath(options.code), options.month, options.currentMonth);
}

export function opexGroupPlanHref(options: { code: string; month: string; currentMonth: string }): string {
  return monthHref(opexGroupPlanHrefPath(options.code), options.month, options.currentMonth);
}

export function opexGroupFactHref(options: { code: string; month: string; currentMonth: string }): string {
  return monthHref(opexGroupFactHrefPath(options.code), options.month, options.currentMonth);
}
