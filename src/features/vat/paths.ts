/** Подпись блока в домене; в меню живёт под «Движение денежных средств». */
export const VAT_REPORT_SECTION_TITLE = 'Налоги';

export const VAT_REPORT_SUMMARY_TITLE = 'Отчет по налогам';

export const VAT_REPORT_SUMMARY_HREF = '/vat';

export function parseVatMonthQuery(params: { month?: string }): { month: string } {
  return { month: params.month ?? '' };
}

function monthHref(path: string, month: string, currentMonth: string): string {
  if (!month || month === currentMonth) {
    return path;
  }
  return `${path}?month=${month}`;
}

export function vatReportSummaryHref(options: { month: string; currentMonth: string }): string {
  return monthHref(VAT_REPORT_SUMMARY_HREF, options.month, options.currentMonth);
}
