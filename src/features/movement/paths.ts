/** Block header in the sidebar; not a page link. */
export const MOVEMENT_SECTION_TITLE = 'Движение готовой продукции';

export const MOVEMENT_SUMMARY_TITLE = 'Отчет общий';

export const MOVEMENT_FACT_TITLE = 'Отчет подневный';

export const MOVEMENT_PLAN_TITLE = 'Ввод плана';

export const MOVEMENT_INVENTORY_TITLE = 'Инвентаризация';

export type FinishedGoodsFactView = 'day' | 'all';

export function parseFinishedGoodsSummaryQuery(params: { from?: string; to?: string; month?: string }): {
  from: string;
  to: string;
} {
  const legacyMonth = params.month ?? '';
  const from = params.from ?? legacyMonth;
  const to = params.to ?? params.from ?? legacyMonth;
  return { from, to };
}

/** Адрес свода. Текущий месяц без параметров. Старый `month` читается как один месяц. */
export function finishedGoodsSummaryHref(options: { from: string; to: string; currentMonth: string }): string {
  const params = new URLSearchParams();
  if (options.from && options.to && options.currentMonth) {
    if (options.from === options.to) {
      if (options.from !== options.currentMonth) {
        params.set('from', options.from);
      }
    } else {
      params.set('from', options.from);
      params.set('to', options.to);
    }
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

export function parseMovementInventoryQuery(params: { month?: string }): {
  month: string;
} {
  return {
    month: params.month ?? '',
  };
}

export function movementInventoryHref(options: { month: string; currentMonth: string }): string {
  const params = new URLSearchParams();
  if (options.month && options.month !== options.currentMonth) {
    params.set('month', options.month);
  }
  const query = params.toString();
  return query ? `/movement/inventory?${query}` : '/movement/inventory';
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
