import { amountExVat, amountWithVat } from '@/domain/money';

export interface UnitCost {
  /** Копейки за 1 шт с НДС, половина вверх. */
  withVat: number;
  /** Копейки за 1 шт без НДС, половина вверх. */
  exVat: number;
}

/**
 * Себестоимость без НДС, копейки.
 * Как цена без НДС: `H / (100 + F) * 100`. `DSM Meat!J8`.
 */
export function costExVat(withVat: number, vatPercent: number): number | null {
  return amountExVat(withVat, vatPercent);
}

/**
 * Сумма с НДС, копейки.
 * Обратно к `costExVat`.
 */
export function costWithVat(exVat: number, vatPercent: number): number | null {
  return amountWithVat(exVat, vatPercent);
}
