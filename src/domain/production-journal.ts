import {
  isOccurredOn,
  type ProductionEntry,
  type ProductionEntryLine,
  type PrototypeDocument,
} from '@/domain/document';
import { productAllowedInPeriodSale } from '@/domain/period-grid';
import { daysInMonth, monthKeyFromDate, PLAN_HORIZON_MONTHS, planMonthOpen, shiftMonth } from '@/domain/sales-plan';

export type ProductionEntryRejection =
  | 'missing'
  | 'month'
  | 'date'
  | 'lines'
  | 'product'
  | 'duplicate-line'
  | 'pieces'
  | 'locked';

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
