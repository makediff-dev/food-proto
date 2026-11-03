import type { HrFieldRejection } from '@/domain/hr';
import type { OpexFieldRejection } from '@/domain/operating-expense';
import { QUANTITY_SCALE } from '@/domain/quantity';
import type { TransportFieldRejection } from '@/domain/transport';
import { fromRubles, parseDecimal } from '@/domain/units';

export const OPEX_LINE_ERROR: Record<OpexFieldRejection, string> = {
  missing: 'Строка не найдена.',
  month: 'Укажите месяц.',
  amount: 'Укажите сумму без НДС.',
  line: 'Эту строку здесь не правят.',
};

export const HR_ERROR: Record<HrFieldRejection, string> = {
  missing: 'Запись не найдена.',
  month: 'Укажите месяц.',
  day: 'Укажите день.',
  name: 'Укажите название должности.',
  department: 'Укажите подразделение.',
  headcount: 'Укажите число людей.',
  salary: 'Укажите зарплату.',
  hours: 'Укажите часы.',
  amount: 'Укажите сумму.',
  rate: 'Укажите ставку.',
  taxRate: 'Укажите ставку налога.',
  archived: 'Сначала верните должность из архива.',
  kind: 'Строку аутсорсинга так не меняют.',
};

export const TRANSPORT_ERROR: Record<TransportFieldRejection, string> = {
  missing: 'Запись не найдена.',
  month: 'Укажите месяц.',
  day: 'Укажите день.',
  name: 'Укажите название.',
  kind: 'Укажите вид перевозки.',
  quantity: 'Укажите количество.',
  price: 'Укажите цену.',
  amount: 'Укажите сумму.',
  odometer: 'Укажите показание спидометра.',
  archived: 'Сначала верните контрагента из архива.',
};

export function parseOpexMoney(raw: string): number | null {
  const value = parseDecimal(raw);
  if (value === null) {
    return null;
  }
  return fromRubles(value);
}

export function parseHours(raw: string): number | null {
  const value = parseDecimal(raw);
  if (value === null || value < 0) {
    return null;
  }
  const thousandths = Math.round(value * QUANTITY_SCALE);
  if (!Number.isInteger(thousandths) || thousandths < 0) {
    return null;
  }
  return thousandths;
}

export function parseQuantity(raw: string): number | null {
  return parseHours(raw);
}

export function formatHours(thousandths: number): string {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).format(thousandths / QUANTITY_SCALE);
}

export function formatQuantity(thousandths: number): string {
  return formatHours(thousandths);
}

/** Ставка налога: сотые доли процента → строка «13» / «0,2». */
export function formatTaxRate(hundredths: number): string {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(hundredths / 100);
}

export function parseTaxRate(raw: string): number | null {
  const value = parseDecimal(raw);
  if (value === null || value < 0) {
    return null;
  }
  return Math.round(value * 100);
}
