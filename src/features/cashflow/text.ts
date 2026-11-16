import type { PropertyTaxRejection } from '@/domain/property-tax';
import type { TaxPaymentRejection } from '@/domain/tax-payment';
import { fromRublesUpTo, parseDecimal } from '@/domain/units';

/** Потолок сумм налога на имущество и дневных налоговых оплат, как `MAX_MONEY` в domain. */
const MAX_PROPERTY_TAX_KOPECKS = 100_000_000_000;

export const PROPERTY_TAX_ERROR: Record<PropertyTaxRejection, string> = {
  month: 'Укажите месяц.',
  amount: 'Укажите сумму.',
};

export const TAX_PAYMENT_ERROR: Record<TaxPaymentRejection, string> = {
  day: 'Укажите день.',
  amount: 'Укажите сумму.',
  kind: 'Укажите статью.',
};

export function parsePropertyTaxMoney(raw: string): number | null {
  const value = parseDecimal(raw);
  if (value === null) {
    return null;
  }
  return fromRublesUpTo(value, MAX_PROPERTY_TAX_KOPECKS);
}

/** Дневная оплата налога: плюс — платёж, минус — возврат. */
export function parseTaxPaymentMoney(raw: string): number | null {
  const normalized = raw.trim().replace(/\s/g, '').replace(',', '.');
  if (!/^-?\d+(\.\d+)?$/.test(normalized)) {
    return null;
  }
  const rubles = Number(normalized);
  if (!Number.isFinite(rubles)) {
    return null;
  }
  const amount = Math.round(rubles * 100);
  if (!Number.isInteger(amount) || Math.abs(amount) > MAX_PROPERTY_TAX_KOPECKS) {
    return null;
  }
  return amount;
}
