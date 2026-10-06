import type { SummaryLens } from '@/domain/summary';

export function parseSummaryQuery(params: { month?: string; view?: string }): {
  month: string;
  view: SummaryLens;
} {
  return {
    month: params.month ?? '',
    view: params.view === 'current' ? 'current' : 'forecast',
  };
}

export function summaryHref(
  options: { month?: string; currentMonth?: string; view?: SummaryLens } = {},
): string {
  const params = new URLSearchParams();
  if (
    options.month &&
    options.currentMonth &&
    options.month !== options.currentMonth
  ) {
    params.set('month', options.month);
  }
  if (options.view === 'current') {
    params.set('view', 'current');
  }

  const query = params.toString();
  return query ? `/?${query}` : '/';
}

// Не вызывается: отдельной страницы плана больше нет, /plans/[id] только редирект.
// export function planHref(id: string): string {
//   return `/plans/${encodeURIComponent(id)}`;
// }
