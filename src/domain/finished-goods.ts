import {
  type FinishedGoodsOpening,
  type FinishedGoodsOpeningLine,
  isMonthKey,
  type Product,
  type PrototypeDocument,
} from '@/domain/document';
import { amountExVat, averageAmount, ratioRound } from '@/domain/money';
import { periodGridCategories, periodReferencedProductIds } from '@/domain/period-grid';
import { productionEntryDayPieces } from '@/domain/production-journal-fact';
import { activeProducts } from '@/domain/products';
import { monthDates, saleDayProduct } from '@/domain/sales-fact';
import { planMonthOpen, priceExVatTenThousandths, salesPlanForMonth, suggestedPriceWithVat } from '@/domain/sales-plan';

export type FinishedGoodsOpeningRejection = 'month' | 'closed' | 'product' | 'locked' | 'pieces';

/** Показатели строки / итога движения готовой продукции. */
export interface FinishedGoodsTotals {
  openingPieces: number;
  planPriceWithVat: number | null;
  planPriceExVat: number | null;
  planPriceExVatTenThousandths: number | null;
  openingValueWithVat: number | null;
  openingValueExVat: number | null;
  salesPieces: number;
  salesRevenueWithVat: number | null;
  salesRevenueExVat: number | null;
  productionPieces: number;
  productionValueWithVat: number | null;
  productionValueExVat: number | null;
  closingPieces: number;
  factPriceWithVat: number | null;
  factPriceExVat: number | null;
  closingValueWithVat: number | null;
  closingValueExVat: number | null;
  revenueComplete: boolean;
}

export interface FinishedGoodsRow extends FinishedGoodsTotals {
  productId: string;
  name: string;
  deleted: boolean;
  vatPercent: number | null;
}

export interface FinishedGoodsGroup {
  categoryId: string;
  name: string;
  deleted: boolean;
  rows: FinishedGoodsRow[];
  totals: FinishedGoodsTotals;
}

export interface FinishedGoodsMonthView {
  month: string;
  groups: FinishedGoodsGroup[];
  rows: FinishedGoodsRow[];
  totals: FinishedGoodsTotals;
}

export interface FinishedGoodsDayView {
  occurredOn: string;
  groups: FinishedGoodsGroup[];
  rows: FinishedGoodsRow[];
  totals: FinishedGoodsTotals;
}

/** Старый документ без поля читается как пустой список. */
export function finishedGoodsOpeningsList(document: PrototypeDocument): FinishedGoodsOpening[] {
  return document.finishedGoodsOpenings ?? [];
}

export function workingFinishedGoodsOpening(document: PrototypeDocument, month: string): FinishedGoodsOpening | null {
  return finishedGoodsOpeningsList(document).find((item) => item.month === month) ?? null;
}

/** Остаток на начало месяца на произв-ве. Нет записи — 0. */
export function openingPiecesForProduct(document: PrototypeDocument, month: string, productId: string): number {
  const opening = workingFinishedGoodsOpening(document, month);
  if (!opening) {
    return 0;
  }
  return opening.lines.find((line) => line.productId === productId)?.pieces ?? 0;
}

function openingReferencedProductIds(document: PrototypeDocument, month: string): Set<string> {
  const ids = new Set<string>();
  const opening = workingFinishedGoodsOpening(document, month);
  if (!opening) {
    return ids;
  }
  for (const line of opening.lines) {
    ids.add(line.productId);
  }
  return ids;
}

/**
 * Товары сетки: рабочие и архивные с планом, продажей, выпуском или остатком в месяце.
 */
export function finishedGoodsGridProducts(document: PrototypeDocument, month: string): Product[] {
  const active = activeProducts(document);
  const referenced = new Set(periodReferencedProductIds(document, month));
  for (const id of openingReferencedProductIds(document, month)) {
    referenced.add(id);
  }
  const prefix = `${month}-`;
  for (const entry of document.productionEntries) {
    if (!entry.occurredOn.startsWith(prefix)) {
      continue;
    }
    for (const line of entry.lines) {
      referenced.add(line.productId);
    }
  }

  const activeIds = new Set(active.map((item) => item.id));
  const archived = document.products.filter(
    (item) => item.deletedAt !== null && referenced.has(item.id) && !activeIds.has(item.id),
  );

  return [...active, ...archived];
}

function planPriceWithVatForProduct(document: PrototypeDocument, month: string, productId: string): number {
  const plan = salesPlanForMonth(document, month);
  const line = plan.lines.find((item) => item.productId === productId);
  if (line) {
    return line.priceWithVat;
  }
  return suggestedPriceWithVat(document, productId, month);
}

function emptyTotals(): FinishedGoodsTotals {
  return {
    openingPieces: 0,
    planPriceWithVat: null,
    planPriceExVat: null,
    planPriceExVatTenThousandths: null,
    openingValueWithVat: null,
    openingValueExVat: null,
    salesPieces: 0,
    salesRevenueWithVat: 0,
    salesRevenueExVat: 0,
    productionPieces: 0,
    productionValueWithVat: null,
    productionValueExVat: null,
    closingPieces: 0,
    factPriceWithVat: null,
    factPriceExVat: null,
    closingValueWithVat: null,
    closingValueExVat: null,
    revenueComplete: true,
  };
}

/** Остаток на конец, шт: начало + выпуск − продажи. */
export function closingStockPieces(openingPieces: number, productionPieces: number, salesPieces: number): number {
  return openingPieces + productionPieces - salesPieces;
}

function priceAverage(amount: number | null, pieces: number): number | null {
  if (amount === null || pieces === 0) {
    return null;
  }
  return ratioRound(amount, pieces);
}

function rowFromParts(
  product: Product,
  openingPieces: number,
  planPriceWithVat: number,
  salesPieces: number,
  salesRevenueWithVat: number | null,
  salesRevenueExVat: number | null,
  revenueComplete: boolean,
  productionPieces: number,
): FinishedGoodsRow {
  const vat = product.vatPercent;
  const planPriceEx = amountExVat(planPriceWithVat, vat);
  const planPriceExTen = priceExVatTenThousandths(planPriceWithVat, vat);
  const openingValueWith = openingPieces * planPriceWithVat;
  const openingValueEx = planPriceEx === null ? null : openingPieces * planPriceEx;

  const factPriceWith = averageAmount(salesRevenueWithVat, salesPieces);
  const factPriceEx = averageAmount(salesRevenueExVat, salesPieces);

  const closingPieces = closingStockPieces(openingPieces, productionPieces, salesPieces);
  const productionValueWith = factPriceWith === null ? null : productionPieces * factPriceWith;
  const productionValueEx = factPriceEx === null ? null : productionPieces * factPriceEx;
  const closingValueWith = factPriceWith === null ? null : closingPieces * factPriceWith;
  const closingValueEx = factPriceEx === null ? null : closingPieces * factPriceEx;

  return {
    productId: product.id,
    name: product.name,
    deleted: product.deletedAt !== null,
    vatPercent: vat,
    openingPieces,
    planPriceWithVat,
    planPriceExVat: planPriceEx,
    planPriceExVatTenThousandths: planPriceExTen,
    openingValueWithVat: openingValueWith,
    openingValueExVat: openingValueEx,
    salesPieces,
    salesRevenueWithVat: revenueComplete ? salesRevenueWithVat : null,
    salesRevenueExVat: revenueComplete ? salesRevenueExVat : null,
    productionPieces,
    productionValueWithVat: productionValueWith,
    productionValueExVat: productionValueEx,
    closingPieces,
    factPriceWithVat: factPriceWith,
    factPriceExVat: factPriceEx,
    closingValueWithVat: closingValueWith,
    closingValueExVat: closingValueEx,
    revenueComplete,
  };
}

function sumRows(rows: readonly FinishedGoodsRow[]): FinishedGoodsTotals {
  let openingPieces = 0;
  let openingValueWith = 0;
  let openingValueEx = 0;
  let openingValueExComplete = true;
  let salesPieces = 0;
  let salesRevenueWith = 0;
  let salesRevenueEx = 0;
  let revenueComplete = true;
  let productionPieces = 0;
  let productionValueWith = 0;
  let productionValueEx = 0;
  let productionValueComplete = true;
  let closingPieces = 0;
  let closingValueWith = 0;
  let closingValueEx = 0;
  let closingValueComplete = true;

  for (const row of rows) {
    openingPieces += row.openingPieces;
    if (row.openingValueWithVat !== null) {
      openingValueWith += row.openingValueWithVat;
    }
    if (row.openingValueExVat === null) {
      if (row.openingPieces !== 0) {
        openingValueExComplete = false;
      }
    } else {
      openingValueEx += row.openingValueExVat;
    }

    salesPieces += row.salesPieces;
    if (!row.revenueComplete || row.salesRevenueWithVat === null || row.salesRevenueExVat === null) {
      if (row.salesPieces > 0) {
        revenueComplete = false;
      }
    } else {
      salesRevenueWith += row.salesRevenueWithVat;
      salesRevenueEx += row.salesRevenueExVat;
    }

    productionPieces += row.productionPieces;
    if (row.productionValueWithVat === null || row.productionValueExVat === null) {
      if (row.productionPieces !== 0) {
        productionValueComplete = false;
      }
    } else {
      productionValueWith += row.productionValueWithVat;
      productionValueEx += row.productionValueExVat;
    }

    closingPieces += row.closingPieces;
    if (row.closingValueWithVat === null || row.closingValueExVat === null) {
      if (row.closingPieces !== 0) {
        closingValueComplete = false;
      }
    } else {
      closingValueWith += row.closingValueWithVat;
      closingValueEx += row.closingValueExVat;
    }
  }

  const salesRevenueWithVat = revenueComplete ? salesRevenueWith : null;
  const salesRevenueExVat = revenueComplete ? salesRevenueEx : null;
  const planPriceWithVat = priceAverage(openingValueWith, openingPieces);
  const planPriceExVat = openingValueExComplete ? priceAverage(openingValueEx, openingPieces) : null;
  const factPriceWithVat = averageAmount(salesRevenueWithVat, salesPieces);
  const factPriceExVat = averageAmount(salesRevenueExVat, salesPieces);

  return {
    openingPieces,
    planPriceWithVat,
    planPriceExVat,
    planPriceExVatTenThousandths: null,
    openingValueWithVat: openingValueWith,
    openingValueExVat: openingValueExComplete ? openingValueEx : null,
    salesPieces,
    salesRevenueWithVat,
    salesRevenueExVat,
    productionPieces,
    productionValueWithVat: productionValueComplete ? productionValueWith : null,
    productionValueExVat: productionValueComplete ? productionValueEx : null,
    closingPieces,
    factPriceWithVat,
    factPriceExVat,
    closingValueWithVat: closingValueComplete ? closingValueWith : null,
    closingValueExVat: closingValueComplete ? closingValueEx : null,
    revenueComplete,
  };
}

function buildGroups(
  document: PrototypeDocument,
  products: readonly Product[],
  rows: readonly FinishedGoodsRow[],
): FinishedGoodsGroup[] {
  const byId = new Map(rows.map((row) => [row.productId, row]));

  return periodGridCategories(document, products).map((category) => {
    const groupRows = products
      .filter((item) => item.categoryId === category.id)
      .sort((left, right) => left.name.localeCompare(right.name, 'ru'))
      .flatMap((item) => {
        const row = byId.get(item.id);
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
}

function monthSalesAndProduction(
  document: PrototypeDocument,
  month: string,
  productId: string,
): {
  salesPieces: number;
  salesRevenueWithVat: number | null;
  salesRevenueExVat: number | null;
  revenueComplete: boolean;
  productionPieces: number;
} {
  let salesPieces = 0;
  let salesRevenueWith = 0;
  let salesRevenueEx = 0;
  let revenueComplete = true;
  let productionPieces = 0;

  for (const day of monthDates(month)) {
    const sold = saleDayProduct(document, day, productId);
    salesPieces += sold.pieces;
    if (sold.revenueWithVat === null || sold.revenueExVat === null) {
      if (sold.pieces > 0) {
        revenueComplete = false;
      }
    } else {
      salesRevenueWith += sold.revenueWithVat;
      salesRevenueEx += sold.revenueExVat;
    }
    productionPieces += productionEntryDayPieces(document, day, productId);
  }

  return {
    salesPieces,
    salesRevenueWithVat: revenueComplete ? salesRevenueWith : null,
    salesRevenueExVat: revenueComplete ? salesRevenueEx : null,
    revenueComplete,
    productionPieces,
  };
}

/** Свод месяца: остаток вводят, остальное считают. В документ ничего производного не пишется. */
export function finishedGoodsMonthView(document: PrototypeDocument, month: string): FinishedGoodsMonthView {
  const products = finishedGoodsGridProducts(document, month);
  const rows = products.map((product) => {
    const openingPieces = openingPiecesForProduct(document, month, product.id);
    const planPrice = planPriceWithVatForProduct(document, month, product.id);
    const fact = monthSalesAndProduction(document, month, product.id);
    return rowFromParts(
      product,
      openingPieces,
      planPrice,
      fact.salesPieces,
      fact.salesRevenueWithVat,
      fact.salesRevenueExVat,
      fact.revenueComplete,
      fact.productionPieces,
    );
  });
  const groups = buildGroups(document, products, rows);
  const groupedRows = groups.flatMap((group) => group.rows);

  return {
    month,
    groups,
    rows: groupedRows,
    totals: groupedRows.length === 0 ? emptyTotals() : sumRows(groupedRows),
  };
}

/**
 * Дни месяца сверху вниз. Начало дня = конец предыдущего
 * (остаток месяца + выпуск − продажи с 1-го по вчера).
 * Конец последнего дня = конец на своде месяца.
 */
export function finishedGoodsMonthDays(document: PrototypeDocument, month: string): FinishedGoodsDayView[] {
  const products = finishedGoodsGridProducts(document, month);
  const openingByProduct = new Map(
    products.map((product) => [product.id, openingPiecesForProduct(document, month, product.id)]),
  );

  return monthDates(month).map((occurredOn) => {
    const rows = products.map((product) => {
      const openingPieces = openingByProduct.get(product.id) ?? 0;
      const planPrice = planPriceWithVatForProduct(document, month, product.id);
      const sold = saleDayProduct(document, occurredOn, product.id);
      const productionPieces = productionEntryDayPieces(document, occurredOn, product.id);
      const row = rowFromParts(
        product,
        openingPieces,
        planPrice,
        sold.pieces,
        sold.revenueWithVat,
        sold.revenueExVat,
        sold.revenueExVat !== null,
        productionPieces,
      );
      openingByProduct.set(product.id, row.closingPieces);
      return row;
    });
    const groups = buildGroups(document, products, rows);
    const groupedRows = groups.flatMap((group) => group.rows);

    return {
      occurredOn,
      groups,
      rows: groupedRows,
      totals: groupedRows.length === 0 ? emptyTotals() : sumRows(groupedRows),
    };
  });
}

function isOpeningPieces(value: number): boolean {
  return Number.isSafeInteger(value);
}

export function setFinishedGoodsOpeningRejection(
  document: PrototypeDocument,
  month: string,
  productId: string,
  pieces: number,
  today: Date,
): FinishedGoodsOpeningRejection | null {
  if (!isMonthKey(month) || !planMonthOpen(month, today)) {
    return month < '2000-01' || !isMonthKey(month) ? 'month' : 'closed';
  }
  if (!isOpeningPieces(pieces)) {
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
 * Пишет остаток на начало. Нет записи месяца — создаёт.
 * Первая правка материализует месяц; производные суммы не пишет.
 */
export function setFinishedGoodsOpening(
  document: PrototypeDocument,
  month: string,
  productId: string,
  pieces: number,
  today: Date,
): PrototypeDocument {
  if (setFinishedGoodsOpeningRejection(document, month, productId, pieces, today)) {
    return document;
  }

  const openings = finishedGoodsOpeningsList(document);
  const existing = openings.find((item) => item.month === month);

  if (!existing) {
    const created: FinishedGoodsOpening = {
      id: `finished-goods-opening:${month}`,
      month,
      lines: [
        {
          id: `finished-goods-opening-line:${month}:${productId}`,
          productId,
          pieces,
        },
      ],
    };
    return {
      ...document,
      finishedGoodsOpenings: [...openings, created],
    };
  }

  const line = existing.lines.find((item) => item.productId === productId);
  if (line) {
    if (line.pieces === pieces) {
      return document;
    }
    return {
      ...document,
      finishedGoodsOpenings: openings.map((item) =>
        item.month !== month
          ? item
          : {
              ...item,
              lines: item.lines.map((entry) => (entry.productId === productId ? { ...entry, pieces } : entry)),
            },
      ),
    };
  }

  const nextLine: FinishedGoodsOpeningLine = {
    id: `finished-goods-opening-line:${month}:${productId}`,
    productId,
    pieces,
  };
  return {
    ...document,
    finishedGoodsOpenings: openings.map((item) =>
      item.month !== month ? item : { ...item, lines: [...item.lines, nextLine] },
    ),
  };
}
