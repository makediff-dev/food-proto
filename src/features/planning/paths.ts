export const PLANNING_SECTION_TITLE = 'Планирование';

export const PLANNING_ARCHIVE_TITLE = 'Архив';

export function parsePlanningQuery(params: { month?: string }): {
  month: string;
} {
  return {
    month: params.month ?? '',
  };
}

export function planningHref(
  options: { month?: string; currentMonth?: string } = {},
): string {
  const params = new URLSearchParams();
  if (
    options.month &&
    options.currentMonth &&
    options.month !== options.currentMonth
  ) {
    params.set('month', options.month);
  }

  const query = params.toString();
  return query ? `/planning?${query}` : '/planning';
}

export function planningArchiveHref(): string {
  return '/planning/archive';
}
