import type { MaterialUnit, PrototypeDocument } from "@/domain/document";
import type { KopeckPair, StockRejection } from "@/domain/stock";
import { formatKilogramsFromGrams, formatRublesFromKopecks } from "@/domain/units";
import { formatMoney, formatStockAmount } from "@/features/materials/money";

export const STOCK_ERROR: Record<StockRejection, string> = {
  warehouse: "Выберите склад.",
  date: "Укажите дату.",
  note: "Слишком длинная пометка.",
  missing: "Запись не найдена.",
  "locked-warehouse": "Склад не меняется, пока в документе есть строки.",
  quantity: "Укажите количество.",
  price: "Укажите реальную себестоимость с НДС.",
  component: "Выберите позицию этого склада.",
  "duplicate-line": "Эта позиция уже есть в документе.",
};

export function formatOccurredOn(iso: string): string {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) {
    return iso;
  }

  return `${day}.${month}.${year}`;
}

export function unitWord(unit: MaterialUnit): string {
  return unit === "piece" ? "шт" : "кг";
}

export function pricePerLabel(unit: MaterialUnit): string {
  return unit === "piece" ? "₽/шт" : "₽/кг";
}

export function formatQuantity(quantity: number, unit: MaterialUnit): string {
  return `${formatQuantityNumber(quantity, unit)} ${unitWord(unit)}`;
}

export function formatQuantityNumber(quantity: number, unit: MaterialUnit): string {
  return formatStockAmount(quantity, unit);
}

export function formatMoneyPair(pair: KopeckPair): string {
  return `${formatMoney(pair.withVatKopecks)} с НДС · ${formatMoney(pair.exVatKopecks)} без НДС`;
}

export function quantityDraft(quantity: number, unit: MaterialUnit): string {
  if (unit === "piece") {
    return String(quantity);
  }

  return formatKilogramsFromGrams(quantity);
}

export function priceDraft(kopecks: number): string {
  return formatRublesFromKopecks(kopecks);
}

export function lineCountLabel(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return `${count} строка`;
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} строки`;
  }

  return `${count} строк`;
}

export function warehouseName(document: PrototypeDocument, id: string): string {
  return document.warehouses.find((item) => item.id === id)?.name ?? "Склад";
}

export function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}
