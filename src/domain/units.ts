/** Технический потолок, чтобы произведение веса и цены оставалось безопасным целым. */
export const MAX_WEIGHT_GRAMS = 100_000_000;
export const MAX_PRICE_PER_KILOGRAM_KOPECKS = 100_000_000;

const DECIMAL_PATTERN = /^\d+(\.\d+)?$/;

/**
 * Разбирает ввод пользователя. Допускает пробелы и запятую.
 * Пустая строка и отрицательные значения не принимаются.
 */
export function parseDecimal(raw: string): number | null {
  const normalized = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (!DECIMAL_PATTERN.test(normalized)) {
    return null;
  }

  const value = Number(normalized);
  if (!Number.isFinite(value)) {
    return null;
  }

  return value;
}

export function kilogramsToGrams(kilograms: number): number | null {
  const grams = Math.round(kilograms * 1000);
  if (!Number.isInteger(grams) || grams < 0 || grams > MAX_WEIGHT_GRAMS) {
    return null;
  }

  return grams;
}

export function rublesToKopecks(rubles: number): number | null {
  const kopecks = Math.round(rubles * 100);
  if (
    !Number.isInteger(kopecks) ||
    kopecks < 0 ||
    kopecks > MAX_PRICE_PER_KILOGRAM_KOPECKS
  ) {
    return null;
  }

  return kopecks;
}

export function formatKilogramsFromGrams(grams: number): string {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 3,
  }).format(grams / 1000);
}

export function formatRublesFromKopecks(kopecks: number, withCurrency = false): string {
  return new Intl.NumberFormat("ru-RU", {
    style: withCurrency ? "currency" : "decimal",
    currency: "RUB",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(kopecks / 100);
}
