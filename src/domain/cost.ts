import type { PrototypeDocument } from '@/domain/document';

const ZERO = BigInt(0);
const ONE = BigInt(1);
const TWO = BigInt(2);
const HUNDRED = BigInt(100);

interface Ratio {
  num: bigint;
  den: bigint;
}

export interface UnitCost {
  /** Копейки за 1 шт с НДС, половина вверх. */
  withVatKopecks: number;
  /** Копейки за 1 шт без НДС, половина вверх. */
  exVatKopecks: number;
  per: 'piece';
}

function gcd(left: bigint, right: bigint): bigint {
  let a = left < ZERO ? -left : left;
  let b = right < ZERO ? -right : right;
  while (b !== ZERO) {
    const next = a % b;
    a = b;
    b = next;
  }

  return a === ZERO ? ONE : a;
}

function ratio(num: bigint, den: bigint): Ratio {
  if (den < ZERO) {
    return ratio(-num, -den);
  }
  if (num === ZERO) {
    return { num: ZERO, den: ONE };
  }

  const divisor = gcd(num, den);
  return { num: num / divisor, den: den / divisor };
}

function roundHalfUpKopecks(value: Ratio): number | null {
  if (value.den <= ZERO || value.num < ZERO) {
    return null;
  }

  const rounded = (value.num + value.den / TWO) / value.den;
  if (rounded > BigInt(Number.MAX_SAFE_INTEGER)) {
    return null;
  }

  return Number(rounded);
}

/** Копейки из числителя и знаменателя, половина вверх. */
export function ratioKopecks(
  numerator: bigint,
  denominator: bigint,
): number | null {
  return roundHalfUpKopecks(ratio(numerator, denominator));
}

/**
 * Себестоимость без НДС, копейки.
 * Как цена без НДС: `H / (100 + F) * 100`. `DSM Meat!J8`.
 */
export function costExVatKopecks(
  withVatKopecks: number,
  vatPercent: number,
): number | null {
  return ratioKopecks(
    BigInt(withVatKopecks) * HUNDRED,
    BigInt(100 + vatPercent),
  );
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

  const exVatKopecks = costExVatKopecks(
    product.unitCostWithVatKopecks,
    product.vatPercent,
  );
  if (exVatKopecks === null) {
    return null;
  }

  return {
    withVatKopecks: product.unitCostWithVatKopecks,
    exVatKopecks,
    per: 'piece',
  };
}
