export const SALES_SECTION_TITLE = 'Продажи';

export const SALES_JOURNAL_TITLE = 'Журнал продаж';

export const NEW_SALE_TITLE = 'Новая продажа';

export type SalesFactView = 'day' | 'all';

export function parseSalesFactQuery(params: { month?: string; day?: string; view?: string }): {
  month: string;
  day: string;
  view: SalesFactView;
} {
  return {
    month: params.month ?? '',
    day: params.day ?? '',
    view: params.view === 'day' ? 'day' : 'all',
  };
}

export function salesFactHref(options: {
  month: string;
  currentMonth: string;
  day?: string;
  defaultDay?: string;
  view?: SalesFactView;
}): string {
  const params = new URLSearchParams();
  if (options.month && options.month !== options.currentMonth) {
    params.set('month', options.month);
  }
  if (options.day && options.day !== options.defaultDay) {
    params.set('day', options.day);
  }
  if (options.view === 'day') {
    params.set('view', 'day');
  }

  const query = params.toString();
  return query ? `/sales?${query}` : '/sales';
}

export function parseSalesJournalQuery(params: { month?: string }): {
  month: string;
} {
  return {
    month: params.month ?? '',
  };
}

export function salesJournalHref(options: { month: string; currentMonth: string }): string {
  if (options.month && options.month !== options.currentMonth) {
    return `/sales/journal?month=${encodeURIComponent(options.month)}`;
  }

  return '/sales/journal';
}

export function saleNewHref(day?: string): string {
  if (!day) {
    return '/sales/new';
  }

  return `/sales/new?day=${encodeURIComponent(day)}`;
}

export function saleHref(id: string): string {
  return `/sales/${id}`;
}
