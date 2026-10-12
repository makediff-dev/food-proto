import {
  type FinishedGoodsOpening,
  type FinishedGoodsOpeningLine,
  isMonthKey,
  type Product,
  type PrototypeDocument,
} from '@/domain/document';
import { amountExVat, averageAmount } from '@/domain/money';
import { dayGridProducts, periodGridCategories, periodReferencedProductIds } from '@/domain/period-grid';
import {
  type ProductionProductSpend,
  productionSpendByProduct,
  workingProductionEntries,
} from '@/domain/production-journal';
import { productionEntryDayPieces } from '@/domain/production-journal-fact';
import { activeProducts } from '@/domain/products';
import { monthDates, saleDayProduct } from '@/domain/sales-fact';
import {
  planMonthOpen,
  priceExVatTenThousandths,
  salesPlanForMonth,
  shiftMonth,
  suggestedPriceWithVat,
} from '@/domain/sales-plan';

export type FinishedGoodsOpeningRejection = 'month' | 'closed' | 'product' | 'locked' | 'pieces';

/** Показатели строки / итога движения готовой продукции. */
export interface FinishedGoodsTotals {
  /** Расчётный перенос с конца прошлого месяца. */
  bookOpeningPieces: number;
  /** Инвентаризация (рабочее число для стоимости, конца и дней). Нет записи — 0. */
  openingPieces: number;
  /** Инвентаризация − расчётный перенос. */
  openingDeviationPieces: number;
  /**
   * Цена блока «Остаток на начало».
   * На своде — продажи прошлого месяца, иначе его план. На дне — план этого месяца.
   */
  openingPriceWithVat: number | null;
  openingPriceExVat: number | null;
  openingPriceExVatTenThousandths: number | null;
  /** Отклонение штук × цена остатка на начало. */
  openingDeviationValueWithVat: number | null;
  openingDeviationValueExVat: number | null;
  openingValueWithVat: number | null;
  openingValueExVat: number | null;
  salesPieces: number;
  salesRevenueWithVat: number | null;
  salesRevenueExVat: number | null;
  productionPieces: number;
  /**
   * Себестоимость 1 шт выпуска: сумма строк журнала / штуки.
   * Не цена продаж и не цена остатка. Выпуска не было — 0. Себестоимость не считается — пусто.
   */
  productionPriceWithVat: number | null;
  productionPriceExVat: number | null;
  /** Сумма себестоимостей строк журнала выпуска. Выпуска не было — 0. */
  productionValueWithVat: number | null;
  productionValueExVat: number | null;
  closingPieces: number;
  factPriceWithVat: number | null;
  factPriceExVat: number | null;
  closingValueWithVat: number | null;
  closingValueExVat: number | null;
  /** Норматив мин/макс и отклонения остатка на конец (как во «Вводе плана»). */
  minPieces: number;
  maxPieces: number;
  belowMinPieces: number;
  aboveMaxPieces: number;
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

/** Инвентаризация на начало месяца. Нет записи — 0. */
export function openingPiecesForProduct(document: PrototypeDocument, month: string, productId: string): number {
  const opening = workingFinishedGoodsOpening(document, month);
  if (!opening) {
    return 0;
  }
  return opening.lines.find((line) => line.productId === productId)?.pieces ?? 0;
}

/**
 * Расчётный остаток на начало: конец прошлого месяца
 * (инвентаризация прошлого месяца + выпуск − продажи). Нет прошлого месяца — 0.
 */
export function bookOpeningPiecesForProduct(document: PrototypeDocument, month: string, productId: string): number {
  if (!isMonthKey(month) || month <= '2000-01') {
    return 0;
  }
  const previousMonth = shiftMonth(month, -1);
  if (!isMonthKey(previousMonth) || previousMonth < '2000-01') {
    return 0;
  }
  const inventory = openingPiecesForProduct(document, previousMonth, productId);
  const fact = monthSalesAndProduction(document, previousMonth, productId);
  return closingStockPieces(inventory, fact.productionPieces, fact.salesPieces);
}

export function openingDeviationPieces(inventoryPieces: number, bookOpeningPieces: number): number {
  return inventoryPieces - bookOpeningPieces;
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

function bookOpeningReferencedProductIds(document: PrototypeDocument, month: string): Set<string> {
  const ids = new Set<string>();
  if (!isMonthKey(month) || month <= '2000-01') {
    return ids;
  }
  const previousMonth = shiftMonth(month, -1);
  if (!isMonthKey(previousMonth) || previousMonth < '2000-01') {
    return ids;
  }
  for (const product of document.products) {
    if (bookOpeningPiecesForProduct(document, month, product.id) !== 0) {
      ids.add(product.id);
    }
  }
  return ids;
}

/**
 * Товары сетки: рабочие и архивные с планом, продажей, выпуском,
 * инвентаризацией или ненулевым расчётным остатком в месяце.
 */
export function finishedGoodsGridProducts(document: PrototypeDocument, month: string): Product[] {
  const active = activeProducts(document);
  const referenced = new Set(periodReferencedProductIds(document, month));
  for (const id of openingReferencedProductIds(document, month)) {
    referenced.add(id);
  }
  for (const id of bookOpeningReferencedProductIds(document, month)) {
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

function planOpeningPrice(
  document: PrototypeDocument,
  month: string,
  product: Product,
): { withVat: number; exVat: number | null } {
  const withVat = planPriceWithVatForProduct(document, month, product.id);
  return { withVat, exVat: amountExVat(withVat, product.vatPercent) };
}

/**
 * Цена остатка на начало месяца.
 * Для начала ноября — продажи октября; штук не было — плановая цена октября.
 * Нет прошлого месяца — пусто.
 */
function monthOpeningPrice(
  document: PrototypeDocument,
  month: string,
  product: Product,
): { withVat: number | null; exVat: number | null } {
  if (!isMonthKey(month) || month <= '2000-01') {
    return { withVat: null, exVat: null };
  }
  const previousMonth = shiftMonth(month, -1);
  if (!isMonthKey(previousMonth) || previousMonth < '2000-01') {
    return { withVat: null, exVat: null };
  }

  const sold = monthSalesAndProduction(document, previousMonth, product.id);
  if (sold.salesPieces > 0) {
    return {
      withVat: averageAmount(sold.salesRevenueWithVat, sold.salesPieces),
      exVat: averageAmount(sold.salesRevenueExVat, sold.salesPieces),
    };
  }

  return planOpeningPrice(document, previousMonth, product);
}

function emptyTotals(): FinishedGoodsTotals {
  return {
    bookOpeningPieces: 0,
    openingPieces: 0,
    openingDeviationPieces: 0,
    openingPriceWithVat: null,
    openingPriceExVat: null,
    openingPriceExVatTenThousandths: null,
    openingDeviationValueWithVat: null,
    openingDeviationValueExVat: null,
    openingValueWithVat: null,
    openingValueExVat: null,
    salesPieces: 0,
    salesRevenueWithVat: 0,
    salesRevenueExVat: 0,
    productionPieces: 0,
    productionPriceWithVat: null,
    productionPriceExVat: null,
    productionValueWithVat: null,
    productionValueExVat: null,
    closingPieces: 0,
    factPriceWithVat: null,
    factPriceExVat: null,
    closingValueWithVat: null,
    closingValueExVat: null,
    minPieces: 0,
    maxPieces: 0,
    belowMinPieces: 0,
    aboveMaxPieces: 0,
    revenueComplete: true,
  };
}

function normForProduct(
  document: PrototypeDocument,
  month: string,
  productId: string,
): Pick<FinishedGoodsTotals, 'minPieces' | 'maxPieces'> {
  const norm = document.finishedGoodsNorms?.find((item) => item.month === month);
  const line = norm?.lines.find((item) => item.productId === productId);
  if (!line) {
    return { minPieces: 0, maxPieces: 0 };
  }
  return { minPieces: line.minPieces, maxPieces: line.maxPieces };
}

function closingNormMetrics(
  closingPieces: number,
  minPieces: number,
  maxPieces: number,
): Pick<FinishedGoodsTotals, 'belowMinPieces' | 'aboveMaxPieces'> {
  const belowMinPieces = closingPieces < minPieces ? closingPieces - minPieces : 0;
  const aboveMaxPieces = closingPieces > maxPieces ? closingPieces - maxPieces : 0;
  return { belowMinPieces, aboveMaxPieces };
}

/** Остаток на конец, шт: рабочее начало (инвентаризация) + выпуск − продажи. */
export function closingStockPieces(openingPieces: number, productionPieces: number, salesPieces: number): number {
  return openingPieces + productionPieces - salesPieces;
}

function priceAverage(amount: number | null, pieces: number): number | null {
  return averageAmount(amount, pieces);
}

function productionSpendOn(
  document: PrototypeDocument,
  dates: ReadonlySet<string>,
): Map<string, ProductionProductSpend> {
  return productionSpendByProduct(
    document,
    workingProductionEntries(document).filter((entry) => dates.has(entry.occurredOn)),
  );
}

/** Штуки и себестоимость выпуска. Нет выпуска — нули. */
function productionAmounts(spend: ProductionProductSpend | undefined): {
  pieces: number;
  costWithVat: number | null;
  costExVat: number | null;
} {
  if (!spend || spend.pieces === 0) {
    return { pieces: 0, costWithVat: 0, costExVat: 0 };
  }
  if (!spend.complete) {
    return { pieces: spend.pieces, costWithVat: null, costExVat: null };
  }

  return { pieces: spend.pieces, costWithVat: spend.costWithVat, costExVat: spend.costExVat };
}

function rowFromParts(
  product: Product,
  bookOpeningPieces: number,
  openingPieces: number,
  openingPriceWithVat: number | null,
  openingPriceExVat: number | null,
  salesPieces: number,
  salesRevenueWithVat: number | null,
  salesRevenueExVat: number | null,
  revenueComplete: boolean,
  productionPieces: number,
  productionCostWithVat: number | null,
  productionCostExVat: number | null,
  norm: Pick<FinishedGoodsTotals, 'minPieces' | 'maxPieces'>,
): FinishedGoodsRow {
  const vat = product.vatPercent;
  const openingPriceExTen = openingPriceWithVat === null ? null : priceExVatTenThousandths(openingPriceWithVat, vat);
  const openingDeviation = openingDeviationPieces(openingPieces, bookOpeningPieces);
  const openingValueWith = openingPriceWithVat === null ? null : openingPieces * openingPriceWithVat;
  const openingValueEx = openingPriceExVat === null ? null : openingPieces * openingPriceExVat;
  const openingDeviationValueWith = openingPriceWithVat === null ? null : openingDeviation * openingPriceWithVat;
  const openingDeviationValueEx = openingPriceExVat === null ? null : openingDeviation * openingPriceExVat;

  const factPriceWith = averageAmount(salesRevenueWithVat, salesPieces);
  const factPriceEx = averageAmount(salesRevenueExVat, salesPieces);

  const closingPieces = closingStockPieces(openingPieces, productionPieces, salesPieces);
  const normMetrics = closingNormMetrics(closingPieces, norm.minPieces, norm.maxPieces);
  const productionPriceWith = priceAverage(productionCostWithVat, productionPieces);
  const productionPriceEx = priceAverage(productionCostExVat, productionPieces);
  const closingValueWith = factPriceWith === null ? null : closingPieces * factPriceWith;
  const closingValueEx = factPriceEx === null ? null : closingPieces * factPriceEx;

  return {
    productId: product.id,
    name: product.name,
    deleted: product.deletedAt !== null,
    vatPercent: vat,
    bookOpeningPieces,
    openingPieces,
    openingDeviationPieces: openingDeviation,
    openingPriceWithVat,
    openingPriceExVat,
    openingPriceExVatTenThousandths: openingPriceExTen,
    openingDeviationValueWithVat: openingDeviationValueWith,
    openingDeviationValueExVat: openingDeviationValueEx,
    openingValueWithVat: openingValueWith,
    openingValueExVat: openingValueEx,
    salesPieces,
    salesRevenueWithVat: revenueComplete ? salesRevenueWithVat : null,
    salesRevenueExVat: revenueComplete ? salesRevenueExVat : null,
    productionPieces,
    productionPriceWithVat: productionPriceWith,
    productionPriceExVat: productionPriceEx,
    productionValueWithVat: productionCostWithVat,
    productionValueExVat: productionCostExVat,
    closingPieces,
    factPriceWithVat: factPriceWith,
    factPriceExVat: factPriceEx,
    closingValueWithVat: closingValueWith,
    closingValueExVat: closingValueEx,
    minPieces: norm.minPieces,
    maxPieces: norm.maxPieces,
    belowMinPieces: normMetrics.belowMinPieces,
    aboveMaxPieces: normMetrics.aboveMaxPieces,
    revenueComplete,
  };
}

function sumRows(rows: readonly FinishedGoodsRow[]): FinishedGoodsTotals {
  let bookOpeningPieces = 0;
  let openingPieces = 0;
  let openingDeviationPiecesSum = 0;
  let openingValueWith = 0;
  let openingValueEx = 0;
  let openingValueWithComplete = true;
  let openingValueExComplete = true;
  let openingDeviationValueWith = 0;
  let openingDeviationValueEx = 0;
  let openingDeviationValueWithComplete = true;
  let openingDeviationValueExComplete = true;
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
  let minPieces = 0;
  let maxPieces = 0;
  let belowMinPieces = 0;
  let aboveMaxPieces = 0;

  for (const row of rows) {
    bookOpeningPieces += row.bookOpeningPieces;
    openingPieces += row.openingPieces;
    openingDeviationPiecesSum += row.openingDeviationPieces;
    if (row.openingValueWithVat === null) {
      if (row.openingPieces !== 0) {
        openingValueWithComplete = false;
      }
    } else {
      openingValueWith += row.openingValueWithVat;
    }
    if (row.openingValueExVat === null) {
      if (row.openingPieces !== 0) {
        openingValueExComplete = false;
      }
    } else {
      openingValueEx += row.openingValueExVat;
    }
    if (row.openingDeviationValueWithVat === null) {
      if (row.openingDeviationPieces !== 0) {
        openingDeviationValueWithComplete = false;
      }
    } else {
      openingDeviationValueWith += row.openingDeviationValueWithVat;
    }
    if (row.openingDeviationValueExVat === null) {
      if (row.openingDeviationPieces !== 0) {
        openingDeviationValueExComplete = false;
      }
    } else {
      openingDeviationValueEx += row.openingDeviationValueExVat;
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
    minPieces += row.minPieces;
    maxPieces += row.maxPieces;
    belowMinPieces += row.belowMinPieces;
    aboveMaxPieces += row.aboveMaxPieces;
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
  const openingValueWithVat = openingValueWithComplete ? openingValueWith : null;
  const openingValueExVat = openingValueExComplete ? openingValueEx : null;
  const openingPriceWithVat = openingValueWithComplete ? priceAverage(openingValueWith, openingPieces) : null;
  const openingPriceExVat = openingValueExComplete ? priceAverage(openingValueEx, openingPieces) : null;
  const factPriceWithVat = averageAmount(salesRevenueWithVat, salesPieces);
  const factPriceExVat = averageAmount(salesRevenueExVat, salesPieces);
  const productionValueWithVat = productionValueComplete ? productionValueWith : null;
  const productionValueExVat = productionValueComplete ? productionValueEx : null;
  const productionPriceWithVat = priceAverage(productionValueWithVat, productionPieces);
  const productionPriceExVat = priceAverage(productionValueExVat, productionPieces);

  return {
    bookOpeningPieces,
    openingPieces,
    openingDeviationPieces: openingDeviationPiecesSum,
    openingPriceWithVat,
    openingPriceExVat,
    openingPriceExVatTenThousandths: null,
    openingDeviationValueWithVat: openingDeviationValueWithComplete ? openingDeviationValueWith : null,
    openingDeviationValueExVat: openingDeviationValueExComplete ? openingDeviationValueEx : null,
    openingValueWithVat,
    openingValueExVat,
    salesPieces,
    salesRevenueWithVat,
    salesRevenueExVat,
    productionPieces,
    productionPriceWithVat,
    productionPriceExVat,
    productionValueWithVat,
    productionValueExVat,
    closingPieces,
    factPriceWithVat,
    factPriceExVat,
    closingValueWithVat: closingValueComplete ? closingValueWith : null,
    closingValueExVat: closingValueComplete ? closingValueEx : null,
    minPieces,
    maxPieces,
    belowMinPieces,
    aboveMaxPieces,
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

/** Свод месяца: перенос и отклонение считают, инвентаризацию читают из документа. */
export function finishedGoodsMonthView(document: PrototypeDocument, month: string): FinishedGoodsMonthView {
  const products = finishedGoodsGridProducts(document, month);
  const producedByProduct = productionSpendOn(document, new Set(monthDates(month)));
  const rows = products.map((product) => {
    const bookOpeningPieces = bookOpeningPiecesForProduct(document, month, product.id);
    const openingPieces = openingPiecesForProduct(document, month, product.id);
    const openingPrice = monthOpeningPrice(document, month, product);
    const fact = monthSalesAndProduction(document, month, product.id);
    const produced = productionAmounts(producedByProduct.get(product.id));
    return rowFromParts(
      product,
      bookOpeningPieces,
      openingPieces,
      openingPrice.withVat,
      openingPrice.exVat,
      fact.salesPieces,
      fact.salesRevenueWithVat,
      fact.salesRevenueExVat,
      fact.revenueComplete,
      produced.pieces,
      produced.costWithVat,
      produced.costExVat,
      normForProduct(document, month, product.id),
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
 * Дни месяца сверху вниз. Начало 1-го = инвентаризация месяца;
 * следующий день — с конца предыдущего.
 * Конец последнего дня = конец на своде месяца.
 */
export function finishedGoodsMonthDays(document: PrototypeDocument, month: string): FinishedGoodsDayView[] {
  const products = finishedGoodsGridProducts(document, month);
  const openingByProduct = new Map(
    products.map((product) => [product.id, openingPiecesForProduct(document, month, product.id)]),
  );

  return monthDates(month).map((occurredOn) => {
    const producedByProduct = productionSpendOn(document, new Set([occurredOn]));
    const rowByProduct = new Map(
      products.map((product) => {
        const openingPieces = openingByProduct.get(product.id) ?? 0;
        const openingPrice = planOpeningPrice(document, month, product);
        const sold = saleDayProduct(document, occurredOn, product.id);
        const produced = productionAmounts(producedByProduct.get(product.id));
        const row = rowFromParts(
          product,
          openingPieces,
          openingPieces,
          openingPrice.withVat,
          openingPrice.exVat,
          sold.pieces,
          sold.revenueWithVat,
          sold.revenueExVat,
          sold.revenueExVat !== null,
          produced.pieces,
          produced.costWithVat,
          produced.costExVat,
          normForProduct(document, month, product.id),
        );
        openingByProduct.set(product.id, row.closingPieces);
        return [product.id, row] as const;
      }),
    );
    const dayProducts = dayGridProducts(products, (product) => {
      const row = rowByProduct.get(product.id);
      return row !== undefined && (row.salesPieces > 0 || row.productionPieces > 0);
    });
    const rows = dayProducts.flatMap((product) => {
      const row = rowByProduct.get(product.id);
      return row ? [row] : [];
    });
    const groups = buildGroups(document, dayProducts, rows);
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
 * Пишет инвентаризацию на начало месяца. Нет записи месяца — создаёт.
 * Первая правка материализует месяц; перенос и отклонение не пишет.
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
