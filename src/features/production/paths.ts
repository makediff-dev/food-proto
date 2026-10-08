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
