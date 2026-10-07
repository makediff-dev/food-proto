const ZERO = BigInt(0);
const TWO = BigInt(2);
const TEN_THOUSAND = BigInt(10_000);
const SAFE_MAX = BigInt(Number.MAX_SAFE_INTEGER);
const SAFE_MIN = BigInt(Number.MIN_SAFE_INTEGER);

export function toSafeNumber(value: bigint): number | null {
  if (value > SAFE_MAX || value < SAFE_MIN) {
    return null;
  }

  return Number(value);
}

/**
 * Частное, половина от нуля. Ноль знаменателя или переполнение — `null`.
 * Для неотрицательных это то же «половина вверх», что в книге.
 */
export function ratioRound(
  numerator: bigint,
  denominator: bigint,
): number | null {
  if (denominator < ZERO) {
    return ratioRound(-numerator, -denominator);
  }
  if (denominator === ZERO) {
    return null;
  }

  const negative = numerator < ZERO;
  const magnitude = negative ? -numerator : numerator;
  const rounded = (magnitude + denominator / TWO) / denominator;
  return toSafeNumber(negative ? -rounded : rounded);
}

export function multiplyAmount(
  unitAmount: number,
  volume: number,
): number | null {
  return toSafeNumber(BigInt(unitAmount) * BigInt(volume));
}

export function averageAmount(
  amount: number | null,
  volume: number | null,
): number | null {
  if (amount === null || volume === null || volume <= 0) {
    return null;
  }

  return ratioRound(BigInt(amount), BigInt(volume));
}

export function fitsSafeMoneyProduct(price: number, volume: number): boolean {
  return BigInt(price) * BigInt(volume) <= SAFE_MAX;
}

/** Сотые доли процента: часть / целое × 100. Нет числа — пусто. Ноль целого — 0. */
const HUNDRED = BigInt(100);

/** Сумма без НДС, копейки, половина вверх. */
export function amountExVat(
  amountWithVat: number,
  vatPercent: number,
): number | null {
  return ratioRound(BigInt(amountWithVat) * HUNDRED, BigInt(100 + vatPercent));
}

/** Сумма с НДС, копейки, половина вверх. Обратно к `amountExVat`. */
export function amountWithVat(
  amountExVatValue: number,
  vatPercent: number,
): number | null {
  return ratioRound(
    BigInt(amountExVatValue) * BigInt(100 + vatPercent),
    HUNDRED,
  );
}

export function percentHundredths(
  part: number | null,
  whole: number | null,
): number | null {
  if (part === null || whole === null) {
    return null;
  }
  if (whole === 0) {
    return 0;
  }

  return ratioRound(BigInt(part) * TEN_THOUSAND, BigInt(whole));
}

/**
 * НДС итога: выручка с НДС / выручка без НДС × 100 − 100.
 * Считать из сумм, не из средних цен: иначе ставка уезжает на сотые доли.
 */
export function vatPercentHundredths(
  revenueWithVat: number | null,
  revenueExVat: number | null,
): number | null {
  if (revenueWithVat === null || revenueExVat === null) {
    return null;
  }

  return percentHundredths(revenueWithVat - revenueExVat, revenueExVat);
}
