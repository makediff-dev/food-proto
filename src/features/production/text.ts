import type { ProductionEntryRejection } from '@/domain/production-journal';

export const PRODUCTION_ENTRY_ERROR: Record<ProductionEntryRejection, string> = {
  missing: 'Запись не найдена.',
  month: 'Этот месяц выбрать нельзя.',
  date: 'Укажите дату выпуска.',
  lines: 'Добавьте хотя бы один товар.',
  product: 'Выберите конечный товар.',
  'duplicate-line': 'Этот товар уже есть в записи.',
  pieces: 'Укажите целое число штук от 1.',
  locked: 'Удалённый товар в новую строку не ставится.',
};

export function formatProductionEntryDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) {
    return iso;
  }

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/** Штуки выпуска: целое от 1 или пусто (товар не в записи). Ноль на форме — тоже пусто. */
export function parseProductionEntryPieces(raw: string): number | null {
  const normalized = raw.trim().replace(/\s/g, '').replace(',', '.');
  if (normalized === '' || normalized === '0') {
    return null;
  }
  if (!/^\d+$/.test(normalized)) {
    return null;
  }

  const value = Number(normalized);
  if (!Number.isInteger(value) || value < 1) {
    return null;
  }

  return value;
}
