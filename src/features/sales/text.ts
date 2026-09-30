import type { PrototypeDocument } from "@/domain/document";
import type { PlanPhase, SalesPlanRejection } from "@/domain/sales-plan";
import { MAX_OPERATING_EXPENSE_KOPECKS, MAX_VOLUME_PIECES } from "@/domain/document";
import { parseDecimal } from "@/domain/units";
import { formatMoney } from "@/features/materials/money";
import { parseKopecks } from "@/features/materials/fields";
import type { OperatingExpenseRejection } from "@/domain/summary";

export const SALES_PLAN_ERROR: Record<SalesPlanRejection, string> = {
  missing: "Запись не найдена.",
  month: "Этот месяц выбрать нельзя.",
  taken: "На этот месяц уже есть рабочий план.",
  products: "В плане должны быть все рабочие товары.",
  price: "Укажите цену с НДС.",
  volume: "Укажите объём целым числом штук.",
  overflow: "Такие цена и объём не помещаются в расчёт.",
  "duplicate-line": "Этот товар уже есть в плане.",
  locked: "Удалённый товар в плане не меняется.",
  closed: "Месяц прошёл, план только для просмотра.",
};

export const OPERATING_EXPENSE_ERROR: Record<OperatingExpenseRejection, string> = {
  month: "Этот месяц выбрать нельзя.",
  amount: "Укажите сумму операционных расходов без НДС.",
};

const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
] as const;

export function formatMonth(month: string): string {
  const year = Number(month.slice(0, 4));
  const mon = Number(month.slice(5, 7));
  const name = MONTHS[mon - 1];
  return name ? `${name} ${year}` : month;
}

export function monthYear(month: string): string {
  return month.slice(0, 4);
}

export function phaseLabel(phase: PlanPhase): string {
  if (phase === "current") {
    return "текущий";
  }
  if (phase === "future") {
    return "будущий";
  }

  return "прошедший";
}

export function daysPhrase(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  const word =
    mod10 === 1 && mod100 !== 11
      ? "день"
      : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
        ? "дня"
        : "дней";
  return `${count} ${word}`;
}

export function formatPieces(value: number): string {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(value);
}

export function formatPerDay(value: number): string {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 2,
  }).format(value);
}

/** Десятитысячные доли рубля на экране — до копеек. */
export function formatPriceExVat(tenThousandths: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(tenThousandths / 10_000);
}

export function formatPercentHundredths(hundredths: number): string {
  return `${new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(hundredths / 100)} %`;
}

export function formatMoneyPair(withVatKopecks: number, exVatKopecks: number): string {
  return `${formatMoney(withVatKopecks)} с НДС · ${formatMoney(exVatKopecks)} без НДС`;
}

export function formatContribution(kopecks: number): string {
  return formatMoney(kopecks);
}

export function parseVolumePieces(raw: string): number | null {
  const value = parseDecimal(raw);
  if (
    value === null ||
    !Number.isInteger(value) ||
    value < 0 ||
    value > MAX_VOLUME_PIECES
  ) {
    return null;
  }

  return value;
}

export function parsePlanPrice(raw: string): number | null {
  return parseKopecks(raw);
}

/** Операционные расходы свода: рубли → копейки, ноль допустим. */
export function parseOperatingExpense(raw: string): number | null {
  const rubles = parseDecimal(raw);
  if (rubles === null) {
    return null;
  }

  const kopecks = Math.round(rubles * 100);
  if (
    !Number.isInteger(kopecks) ||
    kopecks < 0 ||
    kopecks > MAX_OPERATING_EXPENSE_KOPECKS
  ) {
    return null;
  }

  return kopecks;
}

export function priceDraft(kopecks: number): string {
  return new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(kopecks / 100);
}

export function volumeDraft(pieces: number): string {
  return String(pieces);
}

export function placeName(
  places: PrototypeDocument["workshops"],
  id: string | null,
): string {
  if (!id) {
    return "—";
  }

  const place = places.find((item) => item.id === id);
  if (!place) {
    return "Не найдено";
  }

  return place.deletedAt ? `${place.name} (удалён)` : place.name;
}

export function productCountPhrase(withVolume: number, total: number): string {
  return `${formatPieces(withVolume)} из ${formatPieces(total)} с объёмом`;
}
