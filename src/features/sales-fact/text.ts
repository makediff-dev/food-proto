import { MAX_VOLUME_PIECES } from "@/domain/document";
import type { SalesFactRejection } from "@/domain/sales-fact";
import { parseKopecks } from "@/features/materials/fields";
import { formatPieces, parseVolumePieces, priceDraft } from "@/features/sales/text";

export const SALES_FACT_ERROR: Record<SalesFactRejection, string> = {
  missing: "Запись не найдена.",
  month: "Будущий месяц не создаётся.",
  date: "Эта дата не входит в месяц.",
  product: "Выберите конечный товар.",
  locked: "Удалённый товар в факте не меняется.",
  price: "Укажите цену с НДС.",
  pieces: "Укажите целое число штук от нуля.",
  opening: "Укажите остаток целым числом штук.",
  overflow: "Такие цена и объём не помещаются в расчёт.",
  taken: "На этот месяц уже есть рабочая запись.",
};

export function formatSalesFactDay(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) {
    return iso;
  }

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(date);
}

export function formatSignedPieces(value: number): string {
  return formatPieces(value);
}

export function parseSignedPieces(raw: string): number | null {
  const normalized = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (!/^-?\d+$/.test(normalized)) {
    return null;
  }

  const value = Number(normalized);
  if (
    !Number.isInteger(value) ||
    value < -MAX_VOLUME_PIECES ||
    value > MAX_VOLUME_PIECES
  ) {
    return null;
  }

  return value;
}

export function parseFactPrice(raw: string): number | null {
  return parseKopecks(raw);
}

export function parseFactPieces(raw: string): number | null {
  return parseVolumePieces(raw);
}

export function factPriceDraft(kopecks: number): string {
  return priceDraft(kopecks);
}

export function factPiecesDraft(pieces: number): string {
  return String(pieces);
}
