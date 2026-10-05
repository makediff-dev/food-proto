export const SALES_FACT_SECTION_TITLE = 'Факт. продажи и производство';

export type SalesFactView = 'day' | 'all';

export function parseSalesFactQuery(params: {
  month?: string;
  day?: string;
  view?: string;
  deleted?: string;
  fact?: string;
}): {
  month: string;
  day: string;
  view: SalesFactView;
  showDeleted: boolean;
  factId: string;
} {
  return {
    month: params.month ?? '',
    day: params.day ?? '',
    view: params.view === 'day' ? 'day' : 'all',
    showDeleted: params.deleted === '1',
    factId: params.fact ?? '',
  };
}

export function salesFactHref(options: {
  month: string;
  currentMonth: string;
  day?: string;
  defaultDay?: string;
  view?: SalesFactView;
  showDeleted?: boolean;
  factId?: string;
}): string {
  if (options.showDeleted && !options.factId) {
    return '/sales-fact?deleted=1';
  }

  const params = new URLSearchParams();
  if (options.showDeleted && options.factId) {
    params.set('deleted', '1');
    params.set('fact', options.factId);
  }
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
  return query ? `/sales-fact?${query}` : '/sales-fact';
}
