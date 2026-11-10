export const CASHFLOW_SECTION_TITLE = 'Движение денежных средств';

export const CASHFLOW_SUMMARY_TITLE = 'Отчет общий';

export const CASHFLOW_SUMMARY_HREF = '/cashflow';

export function parseCashflowMonthQuery(params: { month?: string }): { month: string } {
  return { month: params.month ?? '' };
}

function monthHref(path: string, month: string, currentMonth: string): string {
  if (!month || month === currentMonth) {
    return path;
  }
  return `${path}?month=${month}`;
}

export function cashflowSummaryHref(options: { month: string; currentMonth: string }): string {
  return monthHref(CASHFLOW_SUMMARY_HREF, options.month, options.currentMonth);
}
