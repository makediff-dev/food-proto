import {
  isOccurredOn,
  type ProductionEntry,
  type ProductionEntryLine,
  type PrototypeDocument,
} from '@/domain/document';
import { amountExVat } from '@/domain/money';
import { productAllowedInPeriodSale } from '@/domain/period-grid';
import { daysInMonth, monthKeyFromDate, PLAN_HORIZON_MONTHS, planMonthOpen, shiftMonth } from '@/domain/sales-plan';
import { MAX_PRICE_KOPECKS } from '@/domain/units';

export type ProductionEntryRejection =
  | 'missing'
  | 'month'
  | 'date'
  | 'lines'
  | 'product'
  | 'duplicate-line'
  | 'pieces'
  | 'price'
  | 'locked';

/** Цена штуки строки. Нет поля или мусор — 0. */
export function productionEntryLinePriceWithVat(line: ProductionEntryLine): number {
  const value = line.priceWithVat;
  if (!Number.isInteger(value) || value < 0 || value > MAX_PRICE_KOPECKS) {
    return 0;
  }

  return value;
}

function isLinePrice(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= MAX_PRICE_KOPECKS;
}

/** Сумма строки с НДС, копейки. Цена × штуки. */
export function productionLineAmountWithVat(priceWithVat: number, pieces: number): number {
  return priceWithVat * pieces;
}

/** Сумма строки без НДС, копейки. Округлённая цена без НДС × штуки. */
export function productionLineAmountExVat(priceWithVat: number, pieces: number, vatPercent: number): number | null {
  const exVat = amountExVat(priceWithVat, vatPercent);
  if (exVat === null) {
    return null;
  }

  return exVat * pieces;
}

/** Факт выпуска товара: штуки и стоимость строк журнала. */
export interface ProductionProductSpend {
  pieces: number;
  /** Копейки с НДС. Сумма строк (цена × штуки). */
  costWithVat: number;
  /** Копейки без НДС. Сумма строк. */
  costExVat: number;
  /** Нет товара или ставка НДС не считается. */
  complete: boolean;
}

export function productionSpendByProduct(
  document: PrototypeDocument,
  entries: readonly ProductionEntry[],
): Map<string, ProductionProductSpend> {
  const vatByProduct = new Map(document.products.map((product) => [product.id, product.vatPercent]));
  const map = new Map<string, ProductionProductSpend>();

  for (const entry of entries) {
    for (const line of entry.lines) {
      const current = map.get(line.productId) ?? {
        pieces: 0,
        costWithVat: 0,
        costExVat: 0,
        complete: true,
      };
      const vatPercent = vatByProduct.get(line.productId);
      const priceWithVat = productionEntryLinePriceWithVat(line);
      const amountEx =
        vatPercent === undefined ? null : productionLineAmountExVat(priceWithVat, line.pieces, vatPercent);
      map.set(line.productId, {
        pieces: current.pieces + line.pieces,
        costWithVat:
          current.costWithVat + (amountEx === null ? 0 : productionLineAmountWithVat(priceWithVat, line.pieces)),
        costExVat: current.costExVat + (amountEx ?? 0),
        complete: current.complete && amountEx !== null,
      });
    }
  }

  return map;
}

/** Последний день горизонта плана — верхняя граница даты выпуска. */
export function maxProductionEntryOccurredOn(today: Date): string {
  const month = shiftMonth(monthKeyFromDate(today), PLAN_HORIZON_MONTHS - 1);
  return `${month}-${String(daysInMonth(month)).padStart(2, '0')}`;
}

function entryById(document: PrototypeDocument, id: string): ProductionEntry | null {
  return document.productionEntries.find((item) => item.id === id) ?? null;
}

/** Все записи выпуска в документе. Удалённых в массиве нет. */
export function workingProductionEntries(document: PrototypeDocument): ProductionEntry[] {
  return document.productionEntries;
}

export function workingProductionEntriesInMonth(document: PrototypeDocument, month: string): ProductionEntry[] {
  return workingProductionEntries(document)
    .filter((item) => item.occurredOn.startsWith(`${month}-`))
    .sort((left, right) => left.occurredOn.localeCompare(right.occurredOn));
}

/** Сумма штук по строкам записи. */
export function productionEntryPieces(entry: ProductionEntry): number {
  return entry.lines.reduce((sum, line) => sum + line.pieces, 0);
}

function lineRejection(
  document: PrototypeDocument,
  lines: readonly ProductionEntryLine[],
  previous: ProductionEntry | null,
  month: string,
): ProductionEntryRejection | null {
  if (lines.length === 0) {
    return 'lines';
  }

  const seenProducts = new Set<string>();
  const previousProducts = new Set(previous?.lines.map((line) => line.productId) ?? []);

  for (const line of lines) {
    if (seenProducts.has(line.productId)) {
      return 'duplicate-line';
    }

    const product = document.products.find((item) => item.id === line.productId);
    if (!product) {
      return 'product';
    }
    if (
      product.deletedAt !== null &&
      !previousProducts.has(line.productId) &&
      !productAllowedInPeriodSale(document, line.productId, month)
    ) {
      return 'locked';
    }
    if (!Number.isInteger(line.pieces) || line.pieces < 1) {
      return 'pieces';
    }
    if (!isLinePrice(line.priceWithVat)) {
      return 'price';
    }

    seenProducts.add(line.productId);
  }

  return null;
}

function writeRejection(
  document: PrototypeDocument,
  occurredOn: string,
  lines: readonly ProductionEntryLine[],
  today: Date,
  previous: ProductionEntry | null,
): ProductionEntryRejection | null {
  if (!isOccurredOn(occurredOn)) {
    return 'date';
  }

  const month = occurredOn.slice(0, 7);
  if (!planMonthOpen(month, today)) {
    return 'month';
  }

  return lineRejection(document, lines, previous, month);
}

function replaceEntries(document: PrototypeDocument, productionEntries: ProductionEntry[]): PrototypeDocument {
  return { ...document, productionEntries };
}

export function addProductionEntryRejection(
  document: PrototypeDocument,
  occurredOn: string,
  lines: readonly ProductionEntryLine[],
  today: Date,
): ProductionEntryRejection | null {
  return writeRejection(document, occurredOn, lines, today, null);
}

export function addProductionEntry(
  document: PrototypeDocument,
  id: string,
  occurredOn: string,
  lines: readonly ProductionEntryLine[],
  today: Date,
): PrototypeDocument {
  if (addProductionEntryRejection(document, occurredOn, lines, today)) {
    return document;
  }

  const entry: ProductionEntry = {
    id,
    occurredOn,
    lines: lines.map((line) => ({ ...line })),
  };

  return replaceEntries(document, [...document.productionEntries, entry]);
}

export function updateProductionEntryRejection(
  document: PrototypeDocument,
  id: string,
  occurredOn: string,
  lines: readonly ProductionEntryLine[],
  today: Date,
): ProductionEntryRejection | null {
  const current = entryById(document, id);
  if (!current) {
    return 'missing';
  }

  return writeRejection(document, occurredOn, lines, today, current);
}

export function updateProductionEntry(
  document: PrototypeDocument,
  id: string,
  occurredOn: string,
  lines: readonly ProductionEntryLine[],
  today: Date,
): PrototypeDocument {
  if (updateProductionEntryRejection(document, id, occurredOn, lines, today)) {
    return document;
  }

  return replaceEntries(
    document,
    document.productionEntries.map((item) =>
      item.id === id
        ? {
            ...item,
            occurredOn,
            lines: lines.map((line) => ({ ...line })),
          }
        : item,
    ),
  );
}

/** Стирает запись выпуска из документа. Вернуть нельзя. */
export function deleteProductionEntry(document: PrototypeDocument, id: string): PrototypeDocument {
  const current = entryById(document, id);
  if (!current) {
    return document;
  }

  return replaceEntries(
    document,
    document.productionEntries.filter((item) => item.id !== id),
  );
}

export function productionEntryByIdOrNull(document: PrototypeDocument, id: string): ProductionEntry | null {
  return entryById(document, id);
}

export function defaultProductionEntryDay(month: string, today: Date): string {
  const todayKey = `${monthKeyFromDate(today)}-${String(today.getDate()).padStart(2, '0')}`;
  if (todayKey.startsWith(`${month}-`) && isOccurredOn(todayKey)) {
    return todayKey;
  }

  return `${month}-01`;
}
