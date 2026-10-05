/** Потолок цены и себестоимости, копейки. Произведение с объёмом остаётся безопасным целым. */
export const MAX_PRICE_KOPECKS = 100_000_000;

const DECIMAL_PATTERN = /^\d+(\.\d+)?$/;

/**
 * Разбирает ввод пользователя. Допускает пробелы и запятую.
 * Пустая строка и отрицательные значения не принимаются.
 */
export function parseDecimal(raw: string): number | null {
  const normalized = raw.trim().replace(/\s/g, '').replace(',', '.');
  if (!DECIMAL_PATTERN.test(normalized)) {
    return null;
  }

  const value = Number(normalized);
  if (!Number.isFinite(value)) {
    return null;
  }

  return value;
}

export function fromRubles(rubles: number): number | null {
  const amount = Math.round(rubles * 100);
  if (!Number.isInteger(amount) || amount < 0 || amount > MAX_PRICE_KOPECKS) {
    return null;
  }

  return amount;
}

export function formatRubles(amount: number, withCurrency = false): string {
  return new Intl.NumberFormat('ru-RU', {
    style: withCurrency ? 'currency' : 'decimal',
    currency: 'RUB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100);
}
