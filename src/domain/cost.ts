import type { PrototypeDocument } from '@/domain/document';
import { ratioRound } from '@/domain/money';

const HUNDRED = BigInt(100);

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
  return ratioRound(BigInt(withVat) * HUNDRED, BigInt(100 + vatPercent));
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
