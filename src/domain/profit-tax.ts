import { isMonthKey, PROFIT_TAX_PERCENT, type ProfitTaxRateChange, type PrototypeDocument } from '@/domain/document';
import { shiftMonth } from '@/domain/sales-plan';

/** Ставка налога: сотые доли процента. 20 % → 2000, 20,5 % → 2050. */
export const PROFIT_TAX_RATE_SCALE = 100;

/** `Svod!C6`, пока месяц не попал под более раннюю точку смены. */
export const DEFAULT_PROFIT_TAX_HUNDREDTHS = PROFIT_TAX_PERCENT * PROFIT_TAX_RATE_SCALE;

const MAX_PROFIT_TAX_HUNDREDTHS = 100 * PROFIT_TAX_RATE_SCALE;

export type ProfitTaxRejection = 'month' | 'rate';

export function profitTaxRateChanges(document: PrototypeDocument): ProfitTaxRateChange[] {
  return document.profitTaxRateChanges ?? [];
}

function byMonth(left: ProfitTaxRateChange, right: ProfitTaxRateChange): number {
  return left.month.localeCompare(right.month);
}

/** Ставка месяца: последняя точка не позже месяца, иначе 20 %. */
export function profitTaxRateHundredths(document: PrototypeDocument, month: string): number {
  return rateFromChanges(profitTaxRateChanges(document), month);
}

function rateFromChanges(changes: readonly ProfitTaxRateChange[], month: string): number {
  let rate = DEFAULT_PROFIT_TAX_HUNDREDTHS;
  for (const change of [...changes].sort(byMonth)) {
    if (change.month <= month) {
      rate = change.rateHundredths;
    }
  }
  return rate;
}

function isRateHundredths(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= MAX_PROFIT_TAX_HUNDREDTHS;
}

export function setProfitTaxRateRejection(
  _document: PrototypeDocument,
  month: string,
  rateHundredths: number,
): ProfitTaxRejection | null {
  if (!isMonthKey(month)) {
    return 'month';
  }
  if (!isRateHundredths(rateHundredths)) {
    return 'rate';
  }
  return null;
}

/**
 * Ставка с этого месяца и на все следующие.
 * То же значение, что уже действует в месяце, документ не меняет: более поздние точки остаются.
 * Новое значение стирает точки этого месяца и позже. Если оно совпало со ставкой предыдущего месяца,
 * свою точку не пишем — месяц продолжает предыдущую ставку.
 */
export function setProfitTaxRate(
  document: PrototypeDocument,
  month: string,
  rateHundredths: number,
): PrototypeDocument {
  if (setProfitTaxRateRejection(document, month, rateHundredths)) {
    return document;
  }
  if (rateHundredths === profitTaxRateHundredths(document, month)) {
    return document;
  }

  const kept = profitTaxRateChanges(document)
    .filter((item) => item.month < month)
    .sort(byMonth);
  const inherited = rateFromChanges(kept, shiftMonth(month, -1));
  const nextChanges =
    rateHundredths === inherited ? kept : [...kept, { id: `profit-tax-rate:${month}`, month, rateHundredths }];

  return { ...document, profitTaxRateChanges: nextChanges };
}
