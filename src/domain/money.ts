/**
 * Частное, половина от нуля. Ноль знаменателя — `null`.
 * Для неотрицательных это то же «половина вверх», что в книге.
 * `bigint` только здесь: целое деление без float.
 */
export function ratioRound(numerator: number, denominator: number): number | null {
  let n = BigInt(numerator);
  let d = BigInt(denominator);
  if (d < BigInt(0)) {
    n = -n;
    d = -d;
  }
  if (d === BigInt(0)) {
    return null;
  }

  const negative = n < BigInt(0);
  const magnitude = negative ? -n : n;
  const rounded = (magnitude + d / BigInt(2)) / d;
  return Number(negative ? -rounded : rounded);
}

export function averageAmount(amount: number | null, volume: number | null): number | null {
  if (amount === null || volume === null || volume <= 0) {
    return null;
  }

  return ratioRound(amount, volume);
}

/** Сумма без НДС, копейки, половина вверх. */
export function amountExVat(amountWithVat: number, vatPercent: number): number | null {
  return ratioRound(amountWithVat * 100, 100 + vatPercent);
}

/** Сумма с НДС, копейки, половина вверх. Обратно к `amountExVat`. */
export function amountWithVat(amountExVatValue: number, vatPercent: number): number | null {
  return ratioRound(amountExVatValue * (100 + vatPercent), 100);
}

/** Сотые доли процента: часть / целое × 100. Нет числа — пусто. Ноль целого — 0. */
export function percentHundredths(part: number | null, whole: number | null): number | null {
  if (part === null || whole === null) {
    return null;
  }
  if (whole === 0) {
    return 0;
  }

  return ratioRound(part * 10_000, whole);
}

/**
 * НДС итога: выручка с НДС / выручка без НДС × 100 − 100.
 * Считать из сумм, не из средних цен: иначе ставка уезжает на сотые доли.
 */
export function vatPercentHundredths(revenueWithVat: number | null, revenueExVat: number | null): number | null {
  if (revenueWithVat === null || revenueExVat === null) {
    return null;
  }

  return percentHundredths(revenueWithVat - revenueExVat, revenueExVat);
}
