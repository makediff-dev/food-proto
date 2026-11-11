import type { PropertyTaxRejection } from '@/domain/property-tax';
import { fromRublesUpTo, parseDecimal } from '@/domain/units';

/** Потолок сумм налога на имущество, как `MAX_MONEY` в domain. */
const MAX_PROPERTY_TAX_KOPECKS = 100_000_000_000;

export const PROPERTY_TAX_ERROR: Record<PropertyTaxRejection, string> = {
  month: 'Укажите месяц.',
  amount: 'Укажите сумму.',
};

export function parsePropertyTaxMoney(raw: string): number | null {
  const value = parseDecimal(raw);
  if (value === null) {
    return null;
  }
  return fromRublesUpTo(value, MAX_PROPERTY_TAX_KOPECKS);
}
