import type { MaterialWeightPair } from '@/domain/document';
import type {
  MaterialDocumentRejection,
  MaterialNameRejection,
  MaterialNormRejection,
  MaterialOpeningRejection,
  MaterialPlanRejection,
} from '@/domain/materials';
import { QUANTITY_SCALE } from '@/domain/quantity';

export function formatQuantity(thousandths: number, unit?: string): string {
  const sign = thousandths < 0 ? '−' : '';
  const abs = Math.abs(thousandths);
  const whole = Math.trunc(abs / QUANTITY_SCALE);
  const frac = abs % QUANTITY_SCALE;
  const wholeText = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(whole);
  const text = frac === 0 ? wholeText : `${wholeText},${String(frac).padStart(3, '0').replace(/0+$/, '')}`;
  const shown = `${sign}${text}`;
  return unit ? `${shown} ${unit}` : shown;
}

/** Пара без деления: `10 кг/30 шт`, `1 кг/50 м`. */
export function formatMaterialWeightPair(weight: MaterialWeightPair, unit: string): string {
  return `${formatQuantity(weight.kilogramThousandths, 'кг')}/${formatQuantity(weight.unitThousandths, unit)}`;
}

export function formatQuantityDraft(thousandths: number): string {
  const sign = thousandths < 0 ? '-' : '';
  const abs = Math.abs(thousandths);
  const whole = Math.trunc(abs / QUANTITY_SCALE);
  const frac = abs % QUANTITY_SCALE;
  if (frac === 0) {
    return `${sign}${whole}`;
  }
  return `${sign}${whole}.${String(frac).padStart(3, '0').replace(/0+$/, '')}`;
}

/** Пустая строка — пусто. До трёх знаков после запятой. */
export function parseQuantityInput(raw: string, allowNegative: boolean): number | null {
  const normalized = raw.trim().replace(/\s/g, '').replace(',', '.');
  if (normalized === '') {
    return null;
  }
  const pattern = allowNegative ? /^-?\d+(\.\d{1,3})?$/ : /^\d+(\.\d{1,3})?$/;
  if (!pattern.test(normalized)) {
    return null;
  }
  const negative = normalized.startsWith('-');
  const unsigned = negative ? normalized.slice(1) : normalized;
  const [whole, frac = ''] = unsigned.split('.');
  const thousandths = Number(whole) * QUANTITY_SCALE + Number(frac.padEnd(3, '0'));
  if (!Number.isSafeInteger(thousandths)) {
    return null;
  }
  return negative ? -thousandths : thousandths;
}

export const MATERIAL_NAME_ERROR: Record<MaterialNameRejection, string> = {
  empty: 'Укажите название.',
  'too-long': 'Слишком длинное название.',
  duplicate: 'Такое название уже есть.',
  missing: 'Позиция не найдена.',
  locked: 'Удалённую позицию не переименовывают.',
};

export const MATERIAL_PLAN_ERROR: Record<MaterialPlanRejection, string> = {
  month: 'Этот месяц выбрать нельзя.',
  closed: 'Этот месяц сейчас нельзя править.',
  material: 'Позиция не найдена.',
  locked: 'Удалённую позицию не меняют.',
  quantity: 'Укажите количество.',
  price: 'Укажите цену.',
  normed: 'Расход этой позиции считается по норме на выпуск.',
};

export const MATERIAL_OPENING_ERROR: Record<MaterialOpeningRejection, string> = {
  month: 'Этот месяц выбрать нельзя.',
  closed: 'Этот месяц сейчас нельзя править.',
  material: 'Позиция не найдена.',
  locked: 'Удалённую позицию не меняют.',
  quantity: 'Укажите остаток на конец.',
  warehouse: 'Выберите склад.',
};

export const MATERIAL_NORM_ERROR: Record<MaterialNormRejection, string> = {
  material: 'Позиция не найдена.',
  locked: 'Удалённую позицию не меняют.',
  group: 'Норму ставят на упаковку и вспомогательные материалы.',
  product: 'Товар не найден.',
  warehouse: 'Выберите склад.',
  quantity: 'Укажите норму на одну штуку.',
};

export const MATERIAL_DOCUMENT_ERROR: Record<MaterialDocumentRejection, string> = {
  warehouse: 'Выберите склад.',
  date: 'Укажите дату.',
  closed: 'Этот месяц сейчас нельзя править.',
  supplier: 'Укажите поставщика.',
  empty: 'Добавьте хотя бы одну позицию.',
  material: 'Позиция не найдена.',
  locked: 'Удалённую позицию в документ не ставят.',
  quantity: 'Укажите количество.',
  price: 'Укажите цену.',
  normed: 'Расход этой позиции считается по норме на выпуск.',
  missing: 'Запись не найдена.',
};
