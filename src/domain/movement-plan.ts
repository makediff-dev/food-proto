import {
  type FinishedGoodsNorm,
  type FinishedGoodsNormLine,
  isMonthKey,
  type Product,
  type PrototypeDocument,
} from '@/domain/document';
import { closingStockPieces, finishedGoodsGridProducts, openingPiecesForProduct } from '@/domain/finished-goods';
import { periodGridCategories } from '@/domain/period-grid';
import { productionEntryDayPieces } from '@/domain/production-journal-fact';
import { monthDates, saleDayProduct } from '@/domain/sales-fact';
import { planMonthOpen } from '@/domain/sales-plan';

export type FinishedGoodsNormField = 'minPieces' | 'maxPieces';

export type FinishedGoodsNormRejection = 'month' | 'closed' | 'product' | 'locked' | 'pieces';

/** Показатели строки / итога планирования движения. */
export interface MovementPlanTotals {
  /** Остаток на конец на своде месяца — с ним сравнивают мин/макс. */
  stockPieces: number;
  minPieces: number;
  maxPieces: number;
  belowMinPieces: number;
  aboveMaxPieces: number;
  recommendedPieces: number;
}

export interface MovementPlanRow extends MovementPlanTotals {
  productId: string;
  name: string;
  deleted: boolean;
}

export interface MovementPlanGroup {
  categoryId: string;
  name: string;
  deleted: boolean;
  rows: MovementPlanRow[];
  totals: MovementPlanTotals;
}

export interface MovementPlanMonthView {
  month: string;
  groups: MovementPlanGroup[];
  rows: MovementPlanRow[];
  totals: MovementPlanTotals;
}

/** Старый документ без поля читается как пустой список. */
export function finishedGoodsNormsList(document: PrototypeDocument): FinishedGoodsNorm[] {
  return document.finishedGoodsNorms ?? [];
}

export function workingFinishedGoodsNorm(document: PrototypeDocument, month: string): FinishedGoodsNorm | null {
  return finishedGoodsNormsList(document).find((item) => item.month === month) ?? null;
}

function emptyNormLine(): Pick<FinishedGoodsNormLine, 'minPieces' | 'maxPieces'> {
  return {
    minPieces: 0,
    maxPieces: 0,
  };
}

/** Норматив товара. Нет записи — нули. */
export function normForProduct(
  document: PrototypeDocument,
  month: string,
  productId: string,
): Pick<FinishedGoodsNormLine, 'minPieces' | 'maxPieces'> {
  const norm = workingFinishedGoodsNorm(document, month);
  const line = norm?.lines.find((item) => item.productId === productId);
  if (!line) {
    return emptyNormLine();
  }
  return {
    minPieces: line.minPieces,
    maxPieces: line.maxPieces,
  };
}

function normReferencedProductIds(document: PrototypeDocument, month: string): Set<string> {
  const ids = new Set<string>();
  const norm = workingFinishedGoodsNorm(document, month);
  if (!norm) {
    return ids;
  }
  for (const line of norm.lines) {
    ids.add(line.productId);
  }
  return ids;
}

/**
 * Товары сетки: как у движения, плюс архивные с введённой нормой.
 */
export function movementPlanGridProducts(document: PrototypeDocument, month: string): Product[] {
  const base = finishedGoodsGridProducts(document, month);
  const baseIds = new Set(base.map((item) => item.id));
  const extras = document.products.filter(
    (item) =>
      item.deletedAt !== null && !baseIds.has(item.id) && normReferencedProductIds(document, month).has(item.id),
  );
  return extras.length === 0 ? base : [...base, ...extras];
}

/**
 * Запас для сравнения с нормативом: тот же остаток на конец, что на своде месяца.
 * Начало на произв-ве + выпуск факта − продажи факта (итог книги без РЦ).
 */
export function stockPiecesForProduct(document: PrototypeDocument, month: string, productId: string): number {
  const opening = openingPiecesForProduct(document, month, productId);
  let salesPieces = 0;
  let productionPieces = 0;
  for (const day of monthDates(month)) {
    salesPieces += saleDayProduct(document, day, productId).pieces;
    productionPieces += productionEntryDayPieces(document, day, productId);
  }
  return closingStockPieces(opening, productionPieces, salesPieces);
}

/**
 * Отклонения и рекомендуемый объём.
 * Рекомендация = 0, если ниже минимума нет; иначе максимум − запас.
 */
export function movementPlanMetrics(
  stockPieces: number,
  minPieces: number,
  maxPieces: number,
): Pick<MovementPlanTotals, 'belowMinPieces' | 'aboveMaxPieces' | 'recommendedPieces'> {
  const belowMinPieces = stockPieces < minPieces ? stockPieces - minPieces : 0;
  const aboveMaxPieces = stockPieces > maxPieces ? stockPieces - maxPieces : 0;
  const recommendedPieces = belowMinPieces === 0 ? 0 : maxPieces - stockPieces;
  return { belowMinPieces, aboveMaxPieces, recommendedPieces };
}

/** Рекомендуемый объём выпуска товара за месяц. */
export function recommendedVolumePieces(document: PrototypeDocument, month: string, productId: string): number {
  const norm = normForProduct(document, month, productId);
  const stock = stockPiecesForProduct(document, month, productId);
  return movementPlanMetrics(stock, norm.minPieces, norm.maxPieces).recommendedPieces;
}

function emptyTotals(): MovementPlanTotals {
  return {
    stockPieces: 0,
    minPieces: 0,
    maxPieces: 0,
    belowMinPieces: 0,
    aboveMaxPieces: 0,
    recommendedPieces: 0,
  };
}

function sumRows(rows: readonly MovementPlanRow[]): MovementPlanTotals {
  let stockPieces = 0;
  let minPieces = 0;
  let maxPieces = 0;
  let belowMinPieces = 0;
  let aboveMaxPieces = 0;
  let recommendedPieces = 0;

  for (const row of rows) {
    stockPieces += row.stockPieces;
    minPieces += row.minPieces;
    maxPieces += row.maxPieces;
    belowMinPieces += row.belowMinPieces;
    aboveMaxPieces += row.aboveMaxPieces;
    recommendedPieces += row.recommendedPieces;
  }

  return {
    stockPieces,
    minPieces,
    maxPieces,
    belowMinPieces,
    aboveMaxPieces,
    recommendedPieces,
  };
}

function buildRow(document: PrototypeDocument, month: string, product: Product): MovementPlanRow {
  const norm = normForProduct(document, month, product.id);
  const stockPieces = stockPiecesForProduct(document, month, product.id);
  const metrics = movementPlanMetrics(stockPieces, norm.minPieces, norm.maxPieces);
  return {
    productId: product.id,
    name: product.name,
    deleted: product.deletedAt !== null,
    stockPieces,
    minPieces: norm.minPieces,
    maxPieces: norm.maxPieces,
    belowMinPieces: metrics.belowMinPieces,
    aboveMaxPieces: metrics.aboveMaxPieces,
    recommendedPieces: metrics.recommendedPieces,
  };
}

/** Свод месяца: норматив вводят, отклонения и рекомендацию считают. */
export function movementPlanMonthView(document: PrototypeDocument, month: string): MovementPlanMonthView {
  const products = movementPlanGridProducts(document, month);
  const rows = products.map((product) => buildRow(document, month, product));
  const groups = periodGridCategories(document, products).map((category) => {
    const groupRows = products
      .filter((item) => item.categoryId === category.id)
      .sort((left, right) => left.name.localeCompare(right.name, 'ru'))
      .flatMap((item) => {
        const row = rows.find((entry) => entry.productId === item.id);
        return row ? [row] : [];
      });

    return {
      categoryId: category.id,
      name: category.name,
      deleted: category.deletedAt !== null,
      rows: groupRows,
      totals: groupRows.length === 0 ? emptyTotals() : sumRows(groupRows),
    };
  });
  const groupedRows = groups.flatMap((group) => group.rows);

  return {
    month,
    groups,
    rows: groupedRows,
    totals: groupedRows.length === 0 ? emptyTotals() : sumRows(groupedRows),
  };
}

function isNormPieces(value: number): boolean {
  return Number.isSafeInteger(value);
}

export function setFinishedGoodsNormRejection(
  document: PrototypeDocument,
  month: string,
  productId: string,
  _field: FinishedGoodsNormField,
  value: number,
  today: Date,
): FinishedGoodsNormRejection | null {
  if (!isMonthKey(month) || !planMonthOpen(month, today)) {
    return month < '2000-01' || !isMonthKey(month) ? 'month' : 'closed';
  }
  if (!isNormPieces(value)) {
    return 'pieces';
  }
  const product = document.products.find((item) => item.id === productId);
  if (!product) {
    return 'product';
  }
  if (product.deletedAt !== null) {
    return 'locked';
  }
  return null;
}

/**
 * Пишет поле норматива. Нет записи месяца — создаёт.
 * Первая правка материализует строку с нулями в остальных полях.
 */
export function setFinishedGoodsNorm(
  document: PrototypeDocument,
  month: string,
  productId: string,
  field: FinishedGoodsNormField,
  value: number,
  today: Date,
): PrototypeDocument {
  if (setFinishedGoodsNormRejection(document, month, productId, field, value, today)) {
    return document;
  }

  const norms = finishedGoodsNormsList(document);
  const existing = norms.find((item) => item.month === month);
  const defaults = emptyNormLine();

  if (!existing) {
    const created: FinishedGoodsNorm = {
      id: `finished-goods-norm:${month}`,
      month,
      lines: [
        {
          id: `finished-goods-norm-line:${month}:${productId}`,
          productId,
          ...defaults,
          [field]: value,
        },
      ],
    };
    return {
      ...document,
      finishedGoodsNorms: [...norms, created],
    };
  }

  const line = existing.lines.find((item) => item.productId === productId);
  if (line) {
    if (line[field] === value) {
      return document;
    }
    return {
      ...document,
      finishedGoodsNorms: norms.map((item) =>
        item.month !== month
          ? item
          : {
              ...item,
              lines: item.lines.map((entry) => (entry.productId === productId ? { ...entry, [field]: value } : entry)),
            },
      ),
    };
  }

  const nextLine: FinishedGoodsNormLine = {
    id: `finished-goods-norm-line:${month}:${productId}`,
    productId,
    ...defaults,
    [field]: value,
  };
  return {
    ...document,
    finishedGoodsNorms: norms.map((item) =>
      item.month !== month ? item : { ...item, lines: [...item.lines, nextLine] },
    ),
  };
}
