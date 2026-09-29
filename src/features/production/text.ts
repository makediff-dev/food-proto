import type { MaterialUnit } from "@/domain/document";
import type { FactRejection } from "@/domain/production-fact";
import type { ProductionKind, ProductionRecipeGap } from "@/domain/production-plan";
import { daysInMonth, monthKeyFromDate } from "@/domain/sales-plan";
import type { KopeckPair } from "@/domain/stock";
import { formatMoney } from "@/features/materials/money";
import { formatPieces } from "@/features/sales/text";
import { formatQuantity, todayIso } from "@/features/stock/text";

export const FACT_ERROR: Record<FactRejection, string> = {
  date: "Укажите дату.",
  "date-taken": "На этот день запись уже есть.",
  note: "Слишком длинная пометка.",
  missing: "Запись не найдена.",
  position: "Выберите товар или производную.",
  quantity: "Укажите количество.",
  duplicate: "Эта позиция уже есть в дне.",
  recipe: "Укажите фактическое количество по каждому ингредиенту рецептуры.",
  use: "Этот ингредиент нельзя записать.",
};

export function formatFactDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) {
    return iso;
  }

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function defaultFactDate(month: string, today: Date): string {
  if (month === monthKeyFromDate(today)) {
    return todayIso();
  }

  return `${month}-01`;
}

export function monthDateBounds(month: string): { min: string; max: string } {
  const last = String(daysInMonth(month)).padStart(2, "0");
  return { min: `${month}-01`, max: `${month}-${last}` };
}

export function formatShareTenths(tenths: number | null): string {
  if (tenths === null) {
    return "—";
  }

  const abs = Math.abs(tenths);
  const whole = Math.floor(abs / 10);
  const frac = abs % 10;
  const body =
    frac === 0
      ? new Intl.NumberFormat("ru-RU").format(whole)
      : `${new Intl.NumberFormat("ru-RU").format(whole)},${frac}`;
  return `${tenths < 0 ? "-" : ""}${body} %`;
}

export function deviationWord(deviation: number | null): string | null {
  if (deviation === null) {
    return null;
  }
  if (deviation > 0) {
    return "больше плана";
  }
  if (deviation < 0) {
    return "меньше плана";
  }

  return "как в плане";
}

export function normWord(fact: number, norm: number): string | null {
  if (fact === norm) {
    return null;
  }

  return fact > norm ? "больше нормы" : "меньше нормы";
}

export function recipeGapLabel(gap: ProductionRecipeGap): string {
  if (gap === "missing-recipe") {
    return "Нет рецепта";
  }
  if (gap === "unbalanced") {
    return "Рецепт не сходится";
  }
  if (gap === "cycle") {
    return "Круговая рецептура";
  }

  return "Состав не читается";
}

export function kindLabel(kind: ProductionKind, deleted: boolean): string {
  if (kind === "product") {
    return deleted ? "Товар · удалён" : "Товар";
  }
  if (kind === "derivative") {
    return deleted ? "Производная · удалена" : "Производная";
  }

  return deleted ? "Сырьё · удалено" : "Сырьё";
}

export function countPhrase(
  count: number,
  one: string,
  few: string,
  many: string,
): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  const word =
    mod10 === 1 && mod100 !== 11
      ? one
      : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
        ? few
        : many;

  return `${formatPieces(count)} ${word}`;
}

export function formatPlanQuantity(quantity: number | null, unit: MaterialUnit): string {
  if (quantity === null) {
    return "—";
  }

  return formatQuantity(quantity, unit);
}

export function materialQuantityPhrase(
  grams: number | null,
  pieces: number | null,
): string {
  if (grams === null || pieces === null) {
    return "—";
  }

  const parts = [
    grams > 0 ? formatQuantity(grams, "kg") : "",
    pieces > 0 ? formatQuantity(pieces, "piece") : "",
  ].filter((item) => item.length > 0);

  return parts.length > 0 ? parts.join(" и ") : formatQuantity(0, "kg");
}

export function moneyLines(
  cost: KopeckPair | null,
): { withVat: string; exVat: string } | null {
  if (!cost) {
    return null;
  }

  return {
    withVat: `${formatMoney(cost.withVatKopecks)} с НДС`,
    exVat: `${formatMoney(cost.exVatKopecks)} без НДС`,
  };
}
