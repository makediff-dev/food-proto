import type { PrototypeDocument } from '@/domain/document';
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
 * Себестоимость с НДС, копейки.
 * Обратно к `costExVat`: ввод без НДС на сводке пересчитывает хранимую сумму.
 */
export function costWithVat(exVat: number, vatPercent: number): number | null {
  return amountWithVat(exVat, vatPercent);
}

/**
 * Себестоимость 1 шт. С НДС хранится у товара, без НДС считается.
 * Нулевая себестоимость допустима. Нет товара или переполнение — `null`.
 */
export function unitCost(
  document: PrototypeDocument,
  productId: string,
): UnitCost | null {
  const product = document.products.find((item) => item.id === productId);
  if (!product) {
    return null;
  }

  const exVat = costExVat(product.unitCostWithVat, product.vatPercent);
  if (exVat === null) {
    return null;
  }

  return {
    withVat: product.unitCostWithVat,
    exVat,
  };
}
