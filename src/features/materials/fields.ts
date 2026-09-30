import type { FieldRejection } from "@/domain/materials";
import {
  MAX_WEIGHT_GRAMS,
  kilogramsToGrams,
  parseDecimal,
  rublesToKopecks,
} from "@/domain/units";

export const fieldClassName =
  "h-11 w-full border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-ink focus-visible:bg-sheet focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60";

export const primaryButtonClassName =
  "inline-flex h-11 shrink-0 items-center justify-center gap-2 bg-ink px-4 text-sm text-white outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:bg-line disabled:text-muted";

export const FIELD_ERROR: Record<FieldRejection, string> = {
  empty: "Укажите название.",
  "too-long": "Слишком длинное название.",
  duplicate: "Такое название уже есть.",
  brand: "Слишком длинное название бренда.",
  warehouse: "Выберите склад.",
  workshop: "Выберите цех.",
  price: "Укажите цену закупки.",
  vat: "Укажите НДС целым числом от 0 до 100.",
  yield: "Укажите выход от 1 до 100 %.",
  quantity: "Укажите количество.",
  component: "Выберите сырьё или производную.",
  cycle: "Так получится круговая рецептура.",
  "final-in-recipe": "Конечный товар нельзя добавить в состав.",
  self: "Нельзя добавить производную в её собственный состав.",
  "duplicate-line": "Этот компонент уже есть в составе.",
  "recipe-exists": "Рабочая рецептурная карта уже есть.",
  "used-as-component": "Сначала уберите эту производную из других рецептурных карт.",
  batch: "На партию готового продукта столько сырья не помещается.",
  "batch-size": "Укажите базу закладки больше нуля.",
  piece: "Штучное сырьё можно положить только в конечный товар.",
  "piece-weight": "Укажите вес одной штуки целыми граммами.",
  unit: "Единицу нельзя сменить: сырьё уже есть в составе или в складском учёте.",
  stock: "Укажите нормативный остаток.",
  "stock-range": "Минимальный остаток не может быть больше максимального.",
  missing: "Запись не найдена.",
};

export const panelPad = "px-4 py-3";

export function parseKopecks(raw: string): number | null {
  const rubles = parseDecimal(raw);
  if (rubles === null) {
    return null;
  }

  return rublesToKopecks(rubles);
}

export function parseWholePercent(raw: string): number | null {
  const value = parseDecimal(raw);
  if (value === null || !Number.isInteger(value)) {
    return null;
  }

  return value;
}

export function parsePieceCount(raw: string): number | null {
  const value = parseDecimal(raw);
  if (value === null || !Number.isInteger(value) || value < 1) {
    return null;
  }

  return value;
}

/** Вес одной штуки производной: целые граммы от 1. */
export function parsePieceWeightGrams(raw: string): number | null {
  const value = parseDecimal(raw);
  if (
    value === null ||
    !Number.isInteger(value) ||
    value < 1 ||
    value > MAX_WEIGHT_GRAMS
  ) {
    return null;
  }

  return value;
}

/** Нормативный остаток: килограммы в граммах, штуки целым числом. Ноль допустим. */
export function parseStockQuantity(raw: string, unit: "kg" | "piece"): number | null {
  if (unit === "piece") {
    const value = parseDecimal(raw);
    if (
      value === null ||
      !Number.isInteger(value) ||
      value < 0 ||
      value > MAX_WEIGHT_GRAMS
    ) {
      return null;
    }

    return value;
  }

  const kilograms = parseDecimal(raw);
  if (kilograms === null || kilograms < 0) {
    return null;
  }

  return kilogramsToGrams(kilograms);
}

export function parseGrams(raw: string): number | null {
  const kilograms = parseDecimal(raw);
  if (kilograms === null) {
    return null;
  }

  const grams = kilogramsToGrams(kilograms);
  if (grams === null || grams < 1) {
    return null;
  }

  return grams;
}

export function componentOptionValue(
  kind: "material" | "derivative",
  id: string,
): string {
  return `${kind}/${encodeURIComponent(id)}`;
}

export function parseComponentOption(
  value: string,
): { kind: "material" | "derivative"; id: string } | null {
  const slash = value.indexOf("/");
  if (slash <= 0) {
    return null;
  }

  const kind = value.slice(0, slash);
  if (kind !== "material" && kind !== "derivative") {
    return null;
  }

  const id = decodeURIComponent(value.slice(slash + 1));
  if (!id) {
    return null;
  }

  return { kind, id };
}
