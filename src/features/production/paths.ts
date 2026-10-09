import type { SummaryLens } from '@/domain/summary';

/** Block header in the sidebar; not a page link. */
export const PRODUCTION_SECTION_TITLE = 'Производство';

export const PRODUCTION_SUMMARY_TITLE = 'Отчет общий';

export const PRODUCTION_FACT_TITLE = 'Отчет подневный';

export const PRODUCTION_PLAN_TITLE = 'Ввод плана';

export const PRODUCTION_JOURNAL_TITLE = 'Ввод производства';

export const NEW_PRODUCTION_ENTRY_TITLE = 'Новая запись';

export type ProductionJournalFactView = 'day' | 'all';

export function parseProductionJournalFactQuery(params: { month?: string; day?: string; view?: string }): {
  month: string;
  day: string;
  view: ProductionJournalFactView;
} {
  return {
    month: params.month ?? '',
    day: params.day ?? '',
    view: params.view === 'day' ? 'day' : 'all',
  };
}

export function productionJournalFactHref(options: {
  month: string;
  currentMonth: string;
  day?: string;
  defaultDay?: string;
  view?: ProductionJournalFactView;
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
  return query ? `/production/fact?${query}` : '/production/fact';
}

export function parseProductionPlanQuery(params: { month?: string }): {
  month: string;
} {
  return {
    month: params.month ?? '',
  };
}

export function parseProductionFactQuery(params: { from?: string; to?: string; month?: string; view?: string }): {
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

export function productionFactHref(
  options: { from?: string; to?: string; month?: string; currentMonth?: string; view?: SummaryLens } = {},
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
  return query ? `/production?${query}` : '/production';
}

export function productionPlanHref(options: { month?: string; currentMonth?: string } = {}): string {
  const params = new URLSearchParams();
  if (options.month && options.currentMonth && options.month !== options.currentMonth) {
    params.set('month', options.month);
  }

  const query = params.toString();
  return query ? `/production/plan?${query}` : '/production/plan';
}

export function parseProductionJournalQuery(params: { month?: string }): {
  month: string;
} {
  return {
    month: params.month ?? '',
  };
}

export function productionJournalHref(options: { month: string; currentMonth: string }): string {
  if (options.month && options.month !== options.currentMonth) {
    return `/production/journal?month=${encodeURIComponent(options.month)}`;
  }

  return '/production/journal';
}

export function productionEntryNewHref(day?: string): string {
  if (!day) {
    return '/production/journal/new';
  }

  return `/production/journal/new?day=${encodeURIComponent(day)}`;
}

export function productionEntryHref(id: string): string {
  return `/production/journal/${encodeURIComponent(id)}`;
}
