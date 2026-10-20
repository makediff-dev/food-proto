/** Тысячные доли единицы сырья: 1 кг = 1000, 1,5 кг = 1500. */
export const QUANTITY_SCALE = 1000;

/** Потолок количества, тысячные доли единицы. */
export const MAX_QUANTITY_THOUSANDTHS = 1_000_000_000_000;

export function isQuantityThousandths(value: number, allowNegative: boolean): boolean {
  if (!Number.isSafeInteger(value) || Math.abs(value) > MAX_QUANTITY_THOUSANDTHS) {
    return false;
  }

  return allowNegative || value >= 0;
}
