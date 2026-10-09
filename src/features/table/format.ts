import { fromRubles, parseDecimal } from '@/domain/units';

/** Черновик суммы в рублях для поля ввода (копейки → «1 234,56»). */
export function formatMoneyDraft(kopecks: number): string {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(kopecks / 100);
}

/** Рубли из поля → копейки; потолок как у цены/себестоимости. */
export function parseMoneyInput(raw: string): number | null {
  const rubles = parseDecimal(raw);
  if (rubles === null) {
    return null;
  }

  return fromRubles(rubles);
}

/** Рентабельность в сотых процента: 1234 → «12,34 %». */
export function formatPercentHundredths(hundredths: number): string {
  return `${new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(hundredths / 100)} %`;
}

export function parsePercentWhole(raw: string): number | null {
  const value = parseDecimal(raw);
  if (value === null || !Number.isInteger(value)) {
    return null;
  }

  return value;
}

export function parseNonNegativeInteger(raw: string): number | null {
  const value = parseDecimal(raw);
  if (value === null || !Number.isInteger(value) || value < 0) {
    return null;
  }

  return value;
}

/** Целое со знаком: остаток на производстве может быть отрицательным. */
export function parseSignedInteger(raw: string): number | null {
  const normalized = raw.trim().replace(/\s/g, '');
  if (!/^-?\d+$/.test(normalized)) {
    return null;
  }

  const value = Number(normalized);
  if (!Number.isSafeInteger(value)) {
    return null;
  }

  return value;
}

/** Число с двумя знаками после запятой в сотых: 1,25 → 125. Знак допускается. */
export function parseSignedHundredths(raw: string): number | null {
  const normalized = raw.trim().replace(/\s/g, '').replace(',', '.');
  if (!/^-?\d+(\.\d+)?$/.test(normalized)) {
    return null;
  }

  const value = Number(normalized);
  if (!Number.isFinite(value)) {
    return null;
  }

  const hundredths = Math.round(value * 100);
  if (!Number.isSafeInteger(hundredths)) {
    return null;
  }

  return hundredths;
}

export function sanitizeDraft(raw: string, mode: 'decimal' | 'numeric' = 'decimal'): string {
  let result = '';
  let hasComma = false;
  let hasSign = false;

  for (const char of raw) {
    if (char >= '0' && char <= '9') {
      result += char;
      continue;
    }

    if (char === '-' && !hasSign && result === '') {
      result += '-';
      hasSign = true;
      continue;
    }

    if (mode === 'decimal' && (char === ',' || char === '.') && !hasComma) {
      result += ',';
      hasComma = true;
    }
  }

  return result;
}
