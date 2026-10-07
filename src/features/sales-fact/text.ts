import { MAX_SALE_LINE_AMOUNT, MAX_VOLUME_PIECES } from '@/domain/document';
import type { SaleRejection } from '@/domain/sales';
import { fromRublesUpTo, parseDecimal } from '@/domain/units';
import { parseMoney } from '@/features/sales/fields';
import { formatPieces } from '@/features/sales/text';

export function formatSalesFactDay(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) {
    return iso;
  }

  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
  );
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
  }).format(date);
}

export function formatSignedPieces(value: number): string {
  return formatPieces(value);
}

export const SALE_ERROR: Record<SaleRejection, string> = {
  missing: 'Запись не найдена.',
  month: 'Этот месяц выбрать нельзя.',
  date: 'Укажите дату продажи.',
  customer: 'Укажите заказчика.',
  lines: 'Добавьте хотя бы один товар.',
  product: 'Выберите конечный товар.',
  'duplicate-line': 'Этот товар уже есть в продаже.',
  pieces: 'Укажите целое число штук от 1.',
  amount: 'Укажите сумму с НДС.',
  locked: 'Удалённый товар в новую строку не ставится.',
};

export function formatSaleDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) {
    return iso;
  }

  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
  );
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function parseSalePieces(raw: string): number | null {
  const normalized = raw.trim().replace(/\s/g, '').replace(',', '.');
  if (!/^\d+$/.test(normalized)) {
    return null;
  }

  const value = Number(normalized);
  if (!Number.isInteger(value) || value < 1 || value > MAX_VOLUME_PIECES) {
    return null;
  }

  return value;
}

export function parseSaleAmount(raw: string): number | null {
  const rubles = parseDecimal(raw);
  if (rubles === null) {
    return null;
  }

  return fromRublesUpTo(rubles, MAX_SALE_LINE_AMOUNT);
}

/** Сумма введена, штук нет: в продажу такую строку нельзя. */
export function hasAmountWithoutPieces(
  pieces: string,
  amount: string,
): boolean {
  const parsedAmount = parseSaleAmount(amount);
  if (parsedAmount === null || parsedAmount <= 0) {
    return false;
  }

  return parseSalePieces(pieces) === null;
}

/** Цена штуки с НДС, копейки. Потолок как у плановой цены. */
export function parseSalePrice(raw: string): number | null {
  return parseMoney(raw);
}
