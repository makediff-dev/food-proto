import type { SummaryLens } from '@/domain/summary';

export function parseSummaryQuery(params: {
  from?: string;
  to?: string;
  month?: string;
  view?: string;
}): {
  from: string;
  to: string;
  view: SummaryLens;
} {
  const legacyMonth = params.month ?? '';
  const from = params.from ?? legacyMonth;
  const to = params.to ?? params.from ?? legacyMonth;
  return {
    from,
    to,
    view: params.view === 'current' ? 'current' : 'forecast',
  };
}

export function summaryHref(
  options: {
    from?: string;
    to?: string;
    month?: string;
    currentMonth?: string;
    view?: SummaryLens;
  } = {},
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

  if (options.view === 'current') {
    params.set('view', 'current');
  }

  const query = params.toString();
  return query ? `/?${query}` : '/';
}
