export const PRODUCTION_JOURNAL_TITLE = 'Журнал производства';

export const NEW_PRODUCTION_ENTRY_TITLE = 'Новая запись';

export function parseProductionPlanQuery(params: { month?: string }): {
  month: string;
} {
  return {
    month: params.month ?? '',
  };
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
