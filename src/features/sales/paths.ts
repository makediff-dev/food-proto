import type { SalesComparison } from '@/domain/summary';

export const SUMMARY_SECTION_TITLE = 'Отчет общий';

export function parseSummaryQuery(params: { from?: string; to?: string; month?: string; view?: string }): {
  from: string;
  to: string;
  view: SalesComparison;
} {
  const legacyMonth = params.month ?? '';
  const from = params.from ?? legacyMonth;
  const to = params.to ?? params.from ?? legacyMonth;
  return {
    from,
    to,
    view: parseSalesComparison(params.view),
  };
}

export function summaryHref(
  options: { from?: string; to?: string; month?: string; currentMonth?: string; view?: SalesComparison } = {},
): string {
  const from = options.from ?? options.month ?? '';
  const to = options.to ?? options.from ?? options.month ?? '';
  const params = new URLSearchParams();
  const current = options.currentMonth ?? '';

  if (from && to && current) {
    if (from === to) {
      if (from !== current) {
        params.set('from', from);
      }
    } else {
      params.set('from', from);
      params.set('to', to);
    }
  }

  if (options.view === 'current' || options.view === 'none') {
    params.set('view', options.view);
  }

  const query = params.toString();
  return query ? `/?${query}` : '/';
}

function parseSalesComparison(view: string | undefined): SalesComparison {
  if (view === 'current' || view === 'none') {
    return view;
  }
  return 'forecast';
}
