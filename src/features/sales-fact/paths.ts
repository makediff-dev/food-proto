export const SALES_SECTION_TITLE = 'Продажи';

export type SalesFactView = 'day' | 'all';

export function parseSalesFactQuery(params: {
  month?: string;
  day?: string;
  view?: string;
}): {
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

export function saleNewHref(day?: string): string {
  if (!day) {
    return '/sales/new';
  }

  return `/sales/new?day=${encodeURIComponent(day)}`;
}

export function saleHref(id: string): string {
  return `/sales/${id}`;
}

export function deletedSalesHref(): string {
  return '/sales/deleted';
}
