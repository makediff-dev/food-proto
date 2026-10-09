/** Block header in the sidebar; not a page link. */
export const MOVEMENT_SECTION_TITLE = 'Движение готовой продукции';

export const MOVEMENT_SUMMARY_TITLE = 'Отчет общий';

export const MOVEMENT_FACT_TITLE = 'Отчет подневный';

export const MOVEMENT_PLAN_TITLE = 'Ввод плана';

export type FinishedGoodsFactView = 'day' | 'all';

export function parseFinishedGoodsMonthQuery(params: { month?: string }): {
  month: string;
} {
  return {
    month: params.month ?? '',
  };
}

export function finishedGoodsMonthHref(options: { month: string; currentMonth: string }): string {
  const params = new URLSearchParams();
  if (options.month && options.month !== options.currentMonth) {
    params.set('month', options.month);
  }
  const query = params.toString();
  return query ? `/movement?${query}` : '/movement';
}

export function parseMovementPlanQuery(params: { month?: string }): {
  month: string;
} {
  return {
    month: params.month ?? '',
  };
}

export function movementPlanHref(options: { month: string; currentMonth: string }): string {
  const params = new URLSearchParams();
  if (options.month && options.month !== options.currentMonth) {
    params.set('month', options.month);
  }
  const query = params.toString();
  return query ? `/movement/plan?${query}` : '/movement/plan';
}

export function parseFinishedGoodsFactQuery(params: { month?: string; day?: string; view?: string }): {
  month: string;
  day: string;
  view: FinishedGoodsFactView;
} {
  return {
    month: params.month ?? '',
    day: params.day ?? '',
    view: params.view === 'day' ? 'day' : 'all',
  };
}

export function finishedGoodsFactHref(options: {
  month: string;
  currentMonth: string;
  day?: string;
  defaultDay?: string;
  view?: FinishedGoodsFactView;
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
  return query ? `/movement/fact?${query}` : '/movement/fact';
}
