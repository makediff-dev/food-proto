import type { CreditFieldRejection } from '@/domain/credit-resources';
import { fromRubles, parseDecimal } from '@/domain/units';

export const CREDIT_ERROR: Record<CreditFieldRejection, string> = {
  missing: 'Кредитор не найден.',
  month: 'Укажите месяц.',
  name: 'Укажите название.',
  empty: 'Укажите название.',
  'too-long': 'Слишком длинное название.',
  duplicate: 'Такое название уже есть.',
  amount: 'Укажите сумму.',
  rate: 'Укажите процентную ставку.',
  archived: 'Сначала верните кредитора из архива.',
};

export function parseCreditMoney(raw: string): number | null {
  const value = parseDecimal(raw);
  if (value === null) {
    return null;
  }
  return fromRubles(value);
}

/** Ставка: проценты → сотые доли. «18» → 1800, «18,5» → 1850. */
export function parseInterestRate(raw: string): number | null {
  const value = parseDecimal(raw);
  if (value === null || value < 0) {
    return null;
  }
  return Math.round(value * 100);
}

export function formatInterestRate(hundredths: number): string {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(hundredths / 100);
}
