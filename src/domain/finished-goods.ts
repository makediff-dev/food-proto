import {
  type FinishedGoodsOpening,
  type FinishedGoodsOpeningLine,
  isMonthKey,
  isOccurredOn,
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
  daysInMonth,
  monthKeyFromDate,
  planMonthOpen,
  planPriceWithVatForProduct,
  planSalesVolumePiecesForProduct,
  priceExVatTenThousandths,
  revenueExVat,
  revenueWithVat,
  shiftMonth,
} from '@/domain/sales-plan';
import { monthsInRange, normalizeMonthRange } from '@/domain/summary';

export type FinishedGoodsOpeningRejection = 'month' | 'closed' | 'product' | 'locked' | 'pieces';

/** Показатели строки / итога движения готовой продукции. */
export interface FinishedGoodsTotals {
  /** @deprecated На своде не показывают; оставлено для совместимости типов. */
  bookOpeningPieces: number;
  /** Остаток на начало месяца: факт инвентаризации конца прошлого месяца. */
  openingPieces: number;
  /** @deprecated Сравнение план–факт на начало месяца снято. */
  openingDeviationPieces: number;
  /**
   * Цена блока «Остаток на начало».
   * На своде — продажи прошлого месяца, иначе его план. На дне — план этого месяца.
   */
  openingPriceWithVat: number | null;
  openingPriceExVat: number | null;
  openingPriceExVatTenThousandths: number | null;
  /** @deprecated Стоимость отклонения на начало месяца снята. */
  openingDeviationValueWithVat: number | null;
  openingDeviationValueExVat: number | null;
  openingValueWithVat: number | null;
  openingValueExVat: number | null;
  /** Расчётный остаток на конец месяца: начало + выпуск − продажи. */
  bookClosingPieces: number;
  /** Факт инвентаризации на конец месяца. Нет строки — 0. */
  inventoryClosingPieces: number;
  /** Факт − расчётный остаток на конец (только если введена инвентаризация). */
  closingInventoryDeviationPieces: number;
  closingInventoryDeviationValueWithVat: number | null;
  closingInventoryDeviationValueExVat: number | null;
  /** Расчётный остаток на дату свода: журнал с начала интервала по сегодня или конец последнего месяца. */
  currentClosingPieces: number;
  /** Текущий остаток − план на конец последнего месяца интервала. */
  currentClosingDeviationPieces: number;
  currentClosingDeviationValueWithVat: number | null;
  currentClosingDeviationValueExVat: number | null;
  /** План продаж за период: сумма плановых штук месяцев. */
  planSalesPieces: number;
  planSalesPriceWithVat: number | null;
  planSalesPriceExVat: number | null;
  planSalesRevenueWithVat: number | null;
  planSalesRevenueExVat: number | null;
  planRevenueComplete: boolean;
  salesPieces: number;
  salesRevenueWithVat: number | null;
  salesRevenueExVat: number | null;
  /** Отклонение продаж: факт − план. */
  salesDeviationPieces: number;
  salesDeviationPriceWithVat: number | null;
  salesDeviationPriceExVat: number | null;
  salesDeviationRevenueWithVat: number | null;
  salesDeviationRevenueExVat: number | null;
  /** План выпуска за период: сумма плановых штук месяцев. */
  planProductionPieces: number;
  planProductionPriceWithVat: number | null;
  planProductionPriceExVat: number | null;
  planProductionValueWithVat: number | null;
  planProductionValueExVat: number | null;
  planProductionComplete: boolean;
  productionPieces: number;
  /**
   * Цена выпуска: стоимость / штуки.
   * Стоимость = расчётная цена × объём, как у продаж. Выпуска не было — 0. Цены нет — пусто.
   */
  productionPriceWithVat: number | null;
  productionPriceExVat: number | null;
  /** Стоимость выпуска: сумма строк журнала (цена × штуки). Выпуска не было — 0. */
  productionValueWithVat: number | null;
  productionValueExVat: number | null;
  /** Отклонение выпуска: факт − план. */
  productionDeviationPieces: number;
  productionDeviationPriceWithVat: number | null;
  productionDeviationPriceExVat: number | null;
  productionDeviationValueWithVat: number | null;
  productionDeviationValueExVat: number | null;
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

/** Свод «с — по» по текущий месяц включительно. Один месяц — тот же расчёт, что у свода месяца. */
export interface FinishedGoodsRangeView {
  from: string;
  to: string;
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

/** Факт инвентаризации на конец месяца. Нет строки — 0. */
export function storedInventoryPiecesForProduct(document: PrototypeDocument, month: string, productId: string): number {
  const opening = workingFinishedGoodsOpening(document, month);
  if (!opening) {
    return 0;
  }
  return opening.lines.find((line) => line.productId === productId)?.pieces ?? 0;
}

export function hasStoredInventoryLine(document: PrototypeDocument, month: string, productId: string): boolean {
  const opening = workingFinishedGoodsOpening(document, month);
  return opening?.lines.some((line) => line.productId === productId) ?? false;
}

/**
 * Остаток на начало месяца: факт инвентаризации на конец прошлого месяца.
 * Нет прошлого месяца — 0.
 */
export function openingPiecesForProduct(document: PrototypeDocument, month: string, productId: string): number {
  if (!isMonthKey(month) || month <= '2000-01') {
    return 0;
  }
  const previousMonth = shiftMonth(month, -1);
  if (!isMonthKey(previousMonth) || previousMonth < '2000-01') {
    return 0;
  }
  return storedInventoryPiecesForProduct(document, previousMonth, productId);
}

/** Целевой остаток на конец месяца: середина норматива мин/макс. */
export function targetClosingPiecesFromNorm(minPieces: number, maxPieces: number): number {
  return Math.round((minPieces + maxPieces) / 2);
}

/**
 * Плановый объём выпуска: план продаж + целевой остаток на конец − остаток на начало.
 * Отрицательный результат — 0 шт.
 */
export function plannedProductionVolumePieces(document: PrototypeDocument, month: string, productId: string): number {
  const opening = openingPiecesForProduct(document, month, productId);
  const salesPlan = planSalesVolumePiecesForProduct(document, productId, month);
  const norm = normForProduct(document, month, productId);
  const targetClosing = targetClosingPiecesFromNorm(norm.minPieces, norm.maxPieces);
  const volume = salesPlan + targetClosing - opening;
  return volume < 0 ? 0 : volume;
}

/** Расчётный остаток на конец месяца (план): начало + план выпуска − план продаж. */
export function bookClosingPiecesForProduct(document: PrototypeDocument, month: string, productId: string): number {
  const opening = openingPiecesForProduct(document, month, productId);
  const salesPlan = planSalesVolumePiecesForProduct(document, productId, month);
  const productionPlan = plannedProductionVolumePieces(document, month, productId);
  return closingStockPieces(opening, productionPlan, salesPlan);
}

/** @deprecated Используйте bookClosingPiecesForProduct. */
export function bookOpeningPiecesForProduct(document: PrototypeDocument, month: string, productId: string): number {
  return bookClosingPiecesForProduct(document, month, productId);
}

export function closingInventoryDeviationPieces(inventoryPieces: number, bookClosingPieces: number): number {
  return inventoryPieces - bookClosingPieces;
}

/** Дата «текущего» остатка на своде: сегодня в последнем месяце интервала, иначе последний день месяца. */
export function finishedGoodsSummaryAsOfDate(lastMonth: string, today: Date): string {
  if (!isMonthKey(lastMonth)) {
    return '2000-01-01';
  }
  const lastDay = String(daysInMonth(lastMonth)).padStart(2, '0');
  const monthEnd = `${lastMonth}-${lastDay}`;
  const currentMonth = lastSummaryMonth(today);
  if (!currentMonth || lastMonth < currentMonth) {
    return monthEnd;
  }
  if (lastMonth > currentMonth) {
    return monthEnd;
  }
  const todayKey = `${lastMonth}-${String(today.getDate()).padStart(2, '0')}`;
  return isOccurredOn(todayKey) ? todayKey : monthEnd;
}

/**
 * Расчётный остаток по журналу на дату: начало первого месяца интервала + выпуск − продажи по дням до asOf включительно.
 */
export function factualClosingPiecesThrough(
  document: PrototypeDocument,
  fromMonth: string,
  asOf: string,
  productId: string,
): number {
  if (!isMonthKey(fromMonth) || !isOccurredOn(asOf)) {
    return 0;
  }
  const asOfMonth = asOf.slice(0, 7);
  if (!isMonthKey(asOfMonth) || asOfMonth < fromMonth) {
    return openingPiecesForProduct(document, fromMonth, productId);
  }

  let pieces = openingPiecesForProduct(document, fromMonth, productId);
  let month = fromMonth;
  while (true) {
    for (const day of monthDates(month)) {
      if (day > asOf) {
        return pieces;
      }
      pieces = closingStockPieces(
        pieces,
        productionEntryDayPieces(document, day, productId),
        saleDayProduct(document, day, productId).pieces,
      );
    }
    if (month >= asOfMonth) {
      return pieces;
    }
    const nextMonth = shiftMonth(month, 1);
    if (!isMonthKey(nextMonth)) {
      return pieces;
    }
    month = nextMonth;
  }
}

export function openingDeviationPieces(inventoryPieces: number, bookOpeningPieces: number): number {
  return closingInventoryDeviationPieces(inventoryPieces, bookOpeningPieces);
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

function bookClosingReferencedProductIds(document: PrototypeDocument, month: string): Set<string> {
  const ids = new Set<string>();
  if (!isMonthKey(month)) {
    return ids;
  }
  for (const product of document.products) {
    if (bookClosingPiecesForProduct(document, month, product.id) !== 0) {
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
  for (const id of bookClosingReferencedProductIds(document, month)) {
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

function planOpeningPrice(
  document: PrototypeDocument,
  month: string,
  product: Product,
): { withVat: number; exVat: number | null } {
  const withVat = planPriceWithVatForProduct(document, product.id, month);
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
    bookClosingPieces: 0,
    inventoryClosingPieces: 0,
    closingInventoryDeviationPieces: 0,
    closingInventoryDeviationValueWithVat: null,
    closingInventoryDeviationValueExVat: null,
    currentClosingPieces: 0,
    currentClosingDeviationPieces: 0,
    currentClosingDeviationValueWithVat: null,
    currentClosingDeviationValueExVat: null,
    planSalesPieces: 0,
    planSalesPriceWithVat: null,
    planSalesPriceExVat: null,
    planSalesRevenueWithVat: 0,
    planSalesRevenueExVat: 0,
    planRevenueComplete: true,
    salesPieces: 0,
    salesRevenueWithVat: 0,
    salesRevenueExVat: 0,
    salesDeviationPieces: 0,
    salesDeviationPriceWithVat: null,
    salesDeviationPriceExVat: null,
    salesDeviationRevenueWithVat: 0,
    salesDeviationRevenueExVat: 0,
    planProductionPieces: 0,
    planProductionPriceWithVat: null,
    planProductionPriceExVat: null,
    planProductionValueWithVat: 0,
    planProductionValueExVat: 0,
    planProductionComplete: true,
    productionPieces: 0,
    productionPriceWithVat: null,
    productionPriceExVat: null,
    productionValueWithVat: null,
    productionValueExVat: null,
    productionDeviationPieces: 0,
    productionDeviationPriceWithVat: null,
    productionDeviationPriceExVat: null,
    productionDeviationValueWithVat: null,
    productionDeviationValueExVat: null,
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

function moneyDelta(fact: number | null, plan: number | null, complete: boolean): number | null {
  if (!complete || fact === null || plan === null) {
    return null;
  }
  return fact - plan;
}

type PlanSideAmounts = {
  pieces: number;
  priceWithVat: number | null;
  priceExVat: number | null;
  valueWithVat: number | null;
  valueExVat: number | null;
  complete: boolean;
};

function emptyPlanSide(): PlanSideAmounts {
  return {
    pieces: 0,
    priceWithVat: null,
    priceExVat: null,
    valueWithVat: 0,
    valueExVat: 0,
    complete: true,
  };
}

/** План продаж за месяцы периода: штуки, цена и стоимость из плана продаж. */
function rangePlanSales(document: PrototypeDocument, months: readonly string[], product: Product): PlanSideAmounts {
  let pieces = 0;
  let revenueWith = 0;
  let revenueEx = 0;
  let complete = true;
  const lastMonth = months[months.length - 1] ?? '';

  for (const month of months) {
    const volume = planSalesVolumePiecesForProduct(document, product.id, month);
    const priceWithVat = planPriceWithVatForProduct(document, product.id, month);
    pieces += volume;
    const withVat = revenueWithVat(priceWithVat, volume);
    const exVat = revenueExVat(priceWithVat, product.vatPercent, volume);
    if (exVat === null) {
      if (volume > 0) {
        complete = false;
      }
    } else {
      revenueWith += withVat;
      revenueEx += exVat;
    }
  }

  const fallbackPriceWithVat = lastMonth ? planPriceWithVatForProduct(document, product.id, lastMonth) : 0;
  const fallbackPriceExVat = amountExVat(fallbackPriceWithVat, product.vatPercent);
  const valueWithVat = complete ? revenueWith : null;
  const valueExVat = complete ? revenueEx : null;
  const averageWith = priceAverage(valueWithVat, pieces);
  const averageEx = priceAverage(valueExVat, pieces);

  return {
    pieces,
    priceWithVat: pieces > 0 ? averageWith : fallbackPriceWithVat,
    priceExVat: pieces > 0 ? averageEx : fallbackPriceExVat,
    valueWithVat,
    valueExVat,
    complete,
  };
}

/** План выпуска за месяцы периода: штуки из плана выпуска, цена — расчётная цена продаж. */
function rangePlanProduction(
  document: PrototypeDocument,
  months: readonly string[],
  product: Product,
): PlanSideAmounts {
  let pieces = 0;
  let valueWith = 0;
  let valueEx = 0;
  let complete = true;
  const lastMonth = months[months.length - 1] ?? '';

  for (const month of months) {
    const volume = plannedProductionVolumePieces(document, month, product.id);
    const priceWithVat = planPriceWithVatForProduct(document, product.id, month);
    pieces += volume;
    const withVat = revenueWithVat(priceWithVat, volume);
    const exVat = revenueExVat(priceWithVat, product.vatPercent, volume);
    if (exVat === null) {
      if (volume > 0) {
        complete = false;
      }
    } else {
      valueWith += withVat;
      valueEx += exVat;
    }
  }

  const fallbackPriceWithVat = lastMonth ? planPriceWithVatForProduct(document, product.id, lastMonth) : 0;
  const fallbackPriceExVat = amountExVat(fallbackPriceWithVat, product.vatPercent);
  const valueWithVat = complete ? valueWith : null;
  const valueExVat = complete ? valueEx : null;
  const averageWith = priceAverage(valueWithVat, pieces);
  const averageEx = priceAverage(valueExVat, pieces);

  return {
    pieces,
    priceWithVat: pieces > 0 ? averageWith : fallbackPriceWithVat,
    priceExVat: pieces > 0 ? averageEx : fallbackPriceExVat,
    valueWithVat,
    valueExVat,
    complete,
  };
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

/** Штуки и стоимость выпуска по расчётной цене. Нет выпуска — нули. */
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
  options: {
    bookClosingPieces?: number;
    inventoryClosingPieces?: number;
    hasInventoryLine?: boolean;
    closingPieces?: number;
    currentClosingPieces?: number;
    planSales?: PlanSideAmounts;
    planProduction?: PlanSideAmounts;
  } = {},
): FinishedGoodsRow {
  const vat = product.vatPercent;
  const openingPriceExTen = openingPriceWithVat === null ? null : priceExVatTenThousandths(openingPriceWithVat, vat);
  const openingValueWith = openingPriceWithVat === null ? null : openingPieces * openingPriceWithVat;
  const openingValueEx = openingPriceExVat === null ? null : openingPieces * openingPriceExVat;

  const factPriceWith = averageAmount(salesRevenueWithVat, salesPieces);
  const factPriceEx = averageAmount(salesRevenueExVat, salesPieces);

  const bookClosingPieces =
    options.bookClosingPieces ?? closingStockPieces(openingPieces, productionPieces, salesPieces);
  const inventoryClosingPieces = options.inventoryClosingPieces ?? 0;
  const hasInventoryLine = options.hasInventoryLine ?? false;
  const closingInventoryDeviation = hasInventoryLine
    ? closingInventoryDeviationPieces(inventoryClosingPieces, bookClosingPieces)
    : 0;
  const closingInventoryDeviationValueWith =
    hasInventoryLine && factPriceWith !== null ? closingInventoryDeviation * factPriceWith : null;
  const closingInventoryDeviationValueEx =
    hasInventoryLine && factPriceEx !== null ? closingInventoryDeviation * factPriceEx : null;

  const currentClosingPieces = options.currentClosingPieces ?? bookClosingPieces;
  const currentClosingDeviation = currentClosingPieces - bookClosingPieces;
  const currentClosingDeviationValueWith = factPriceWith !== null ? currentClosingDeviation * factPriceWith : null;
  const currentClosingDeviationValueEx = factPriceEx !== null ? currentClosingDeviation * factPriceEx : null;

  const closingPieces = options.closingPieces ?? (hasInventoryLine ? inventoryClosingPieces : bookClosingPieces);

  const normMetrics = closingNormMetrics(closingPieces, norm.minPieces, norm.maxPieces);
  const productionPriceWith = priceAverage(productionCostWithVat, productionPieces);
  const productionPriceEx = priceAverage(productionCostExVat, productionPieces);
  const closingValueWith = factPriceWith === null ? null : closingPieces * factPriceWith;
  const closingValueEx = factPriceEx === null ? null : closingPieces * factPriceEx;

  const planSales = options.planSales ?? emptyPlanSide();
  const planProduction = options.planProduction ?? emptyPlanSide();
  const salesRevenueWith = revenueComplete ? salesRevenueWithVat : null;
  const salesRevenueEx = revenueComplete ? salesRevenueExVat : null;
  const salesDeviationComplete = revenueComplete && planSales.complete;
  const productionComplete = productionCostWithVat !== null && productionCostExVat !== null;
  const productionDeviationComplete = productionComplete && planProduction.complete;

  return {
    productId: product.id,
    name: product.name,
    deleted: product.deletedAt !== null,
    vatPercent: vat,
    bookOpeningPieces: 0,
    openingPieces,
    openingDeviationPieces: 0,
    openingPriceWithVat,
    openingPriceExVat,
    openingPriceExVatTenThousandths: openingPriceExTen,
    openingDeviationValueWithVat: null,
    openingDeviationValueExVat: null,
    openingValueWithVat: openingValueWith,
    openingValueExVat: openingValueEx,
    bookClosingPieces,
    inventoryClosingPieces,
    closingInventoryDeviationPieces: closingInventoryDeviation,
    closingInventoryDeviationValueWithVat: closingInventoryDeviationValueWith,
    closingInventoryDeviationValueExVat: closingInventoryDeviationValueEx,
    currentClosingPieces,
    currentClosingDeviationPieces: currentClosingDeviation,
    currentClosingDeviationValueWithVat: currentClosingDeviationValueWith,
    currentClosingDeviationValueExVat: currentClosingDeviationValueEx,
    planSalesPieces: planSales.pieces,
    planSalesPriceWithVat: planSales.priceWithVat,
    planSalesPriceExVat: planSales.priceExVat,
    planSalesRevenueWithVat: planSales.complete ? planSales.valueWithVat : null,
    planSalesRevenueExVat: planSales.complete ? planSales.valueExVat : null,
    planRevenueComplete: planSales.complete,
    salesPieces,
    salesRevenueWithVat: salesRevenueWith,
    salesRevenueExVat: salesRevenueEx,
    salesDeviationPieces: salesPieces - planSales.pieces,
    salesDeviationPriceWithVat: moneyDelta(
      salesPieces > 0 ? factPriceWith : null,
      planSales.priceWithVat,
      salesDeviationComplete && salesPieces > 0,
    ),
    salesDeviationPriceExVat: moneyDelta(
      salesPieces > 0 ? factPriceEx : null,
      planSales.priceExVat,
      salesDeviationComplete && salesPieces > 0,
    ),
    salesDeviationRevenueWithVat: moneyDelta(salesRevenueWith, planSales.valueWithVat, salesDeviationComplete),
    salesDeviationRevenueExVat: moneyDelta(salesRevenueEx, planSales.valueExVat, salesDeviationComplete),
    planProductionPieces: planProduction.pieces,
    planProductionPriceWithVat: planProduction.priceWithVat,
    planProductionPriceExVat: planProduction.priceExVat,
    planProductionValueWithVat: planProduction.complete ? planProduction.valueWithVat : null,
    planProductionValueExVat: planProduction.complete ? planProduction.valueExVat : null,
    planProductionComplete: planProduction.complete,
    productionPieces,
    productionPriceWithVat: productionPriceWith,
    productionPriceExVat: productionPriceEx,
    productionValueWithVat: productionCostWithVat,
    productionValueExVat: productionCostExVat,
    productionDeviationPieces: productionPieces - planProduction.pieces,
    productionDeviationPriceWithVat: moneyDelta(
      productionPieces > 0 ? productionPriceWith : null,
      planProduction.priceWithVat,
      productionDeviationComplete && productionPieces > 0,
    ),
    productionDeviationPriceExVat: moneyDelta(
      productionPieces > 0 ? productionPriceEx : null,
      planProduction.priceExVat,
      productionDeviationComplete && productionPieces > 0,
    ),
    productionDeviationValueWithVat: moneyDelta(
      productionCostWithVat,
      planProduction.valueWithVat,
      productionDeviationComplete,
    ),
    productionDeviationValueExVat: moneyDelta(
      productionCostExVat,
      planProduction.valueExVat,
      productionDeviationComplete,
    ),
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
  let planSalesPieces = 0;
  let planSalesRevenueWith = 0;
  let planSalesRevenueEx = 0;
  let planRevenueComplete = true;
  let salesPieces = 0;
  let salesRevenueWith = 0;
  let salesRevenueEx = 0;
  let revenueComplete = true;
  let salesDeviationPiecesSum = 0;
  let salesDeviationRevenueWith = 0;
  let salesDeviationRevenueEx = 0;
  let salesDeviationRevenueComplete = true;
  let planProductionPieces = 0;
  let planProductionValueWith = 0;
  let planProductionValueEx = 0;
  let planProductionComplete = true;
  let productionPieces = 0;
  let productionValueWith = 0;
  let productionValueEx = 0;
  let productionValueComplete = true;
  let productionDeviationPiecesSum = 0;
  let productionDeviationValueWith = 0;
  let productionDeviationValueEx = 0;
  let productionDeviationValueComplete = true;
  let bookClosingPieces = 0;
  let inventoryClosingPieces = 0;
  let closingInventoryDeviationPiecesSum = 0;
  let closingInventoryDeviationValueWith = 0;
  let closingInventoryDeviationValueEx = 0;
  let closingInventoryDeviationValueWithComplete = true;
  let closingInventoryDeviationValueExComplete = true;
  let currentClosingPieces = 0;
  let currentClosingDeviationPiecesSum = 0;
  let currentClosingDeviationValueWith = 0;
  let currentClosingDeviationValueEx = 0;
  let currentClosingDeviationValueWithComplete = true;
  let currentClosingDeviationValueExComplete = true;
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

    planSalesPieces += row.planSalesPieces;
    if (!row.planRevenueComplete || row.planSalesRevenueWithVat === null || row.planSalesRevenueExVat === null) {
      if (row.planSalesPieces > 0) {
        planRevenueComplete = false;
      }
    } else {
      planSalesRevenueWith += row.planSalesRevenueWithVat;
      planSalesRevenueEx += row.planSalesRevenueExVat;
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

    salesDeviationPiecesSum += row.salesDeviationPieces;
    if (row.salesDeviationRevenueWithVat === null || row.salesDeviationRevenueExVat === null) {
      if (row.salesPieces > 0 || row.planSalesPieces > 0) {
        salesDeviationRevenueComplete = false;
      }
    } else {
      salesDeviationRevenueWith += row.salesDeviationRevenueWithVat;
      salesDeviationRevenueEx += row.salesDeviationRevenueExVat;
    }

    planProductionPieces += row.planProductionPieces;
    if (
      !row.planProductionComplete ||
      row.planProductionValueWithVat === null ||
      row.planProductionValueExVat === null
    ) {
      if (row.planProductionPieces > 0) {
        planProductionComplete = false;
      }
    } else {
      planProductionValueWith += row.planProductionValueWithVat;
      planProductionValueEx += row.planProductionValueExVat;
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

    productionDeviationPiecesSum += row.productionDeviationPieces;
    if (row.productionDeviationValueWithVat === null || row.productionDeviationValueExVat === null) {
      if (row.productionPieces !== 0 || row.planProductionPieces !== 0) {
        productionDeviationValueComplete = false;
      }
    } else {
      productionDeviationValueWith += row.productionDeviationValueWithVat;
      productionDeviationValueEx += row.productionDeviationValueExVat;
    }

    bookClosingPieces += row.bookClosingPieces;
    inventoryClosingPieces += row.inventoryClosingPieces;
    closingInventoryDeviationPiecesSum += row.closingInventoryDeviationPieces;
    if (row.closingInventoryDeviationValueWithVat === null) {
      if (row.closingInventoryDeviationPieces !== 0) {
        closingInventoryDeviationValueWithComplete = false;
      }
    } else {
      closingInventoryDeviationValueWith += row.closingInventoryDeviationValueWithVat;
    }
    if (row.closingInventoryDeviationValueExVat === null) {
      if (row.closingInventoryDeviationPieces !== 0) {
        closingInventoryDeviationValueExComplete = false;
      }
    } else {
      closingInventoryDeviationValueEx += row.closingInventoryDeviationValueExVat;
    }

    currentClosingPieces += row.currentClosingPieces;
    currentClosingDeviationPiecesSum += row.currentClosingDeviationPieces;
    if (row.currentClosingDeviationValueWithVat === null) {
      if (row.currentClosingDeviationPieces !== 0) {
        currentClosingDeviationValueWithComplete = false;
      }
    } else {
      currentClosingDeviationValueWith += row.currentClosingDeviationValueWithVat;
    }
    if (row.currentClosingDeviationValueExVat === null) {
      if (row.currentClosingDeviationPieces !== 0) {
        currentClosingDeviationValueExComplete = false;
      }
    } else {
      currentClosingDeviationValueEx += row.currentClosingDeviationValueExVat;
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
  const planSalesRevenueWithVat = planRevenueComplete ? planSalesRevenueWith : null;
  const planSalesRevenueExVat = planRevenueComplete ? planSalesRevenueEx : null;
  const planSalesPriceWithVat = planRevenueComplete ? priceAverage(planSalesRevenueWithVat, planSalesPieces) : null;
  const planSalesPriceExVat = planRevenueComplete ? priceAverage(planSalesRevenueExVat, planSalesPieces) : null;
  const openingValueWithVat = openingValueWithComplete ? openingValueWith : null;
  const openingValueExVat = openingValueExComplete ? openingValueEx : null;
  const openingPriceWithVat = openingValueWithComplete ? priceAverage(openingValueWith, openingPieces) : null;
  const openingPriceExVat = openingValueExComplete ? priceAverage(openingValueEx, openingPieces) : null;
  const factPriceWithVat = averageAmount(salesRevenueWithVat, salesPieces);
  const factPriceExVat = averageAmount(salesRevenueExVat, salesPieces);
  const salesDeviationComplete = revenueComplete && planRevenueComplete;
  const productionValueWithVat = productionValueComplete ? productionValueWith : null;
  const productionValueExVat = productionValueComplete ? productionValueEx : null;
  const productionPriceWithVat = priceAverage(productionValueWithVat, productionPieces);
  const productionPriceExVat = priceAverage(productionValueExVat, productionPieces);
  const planProductionValueWithVat = planProductionComplete ? planProductionValueWith : null;
  const planProductionValueExVat = planProductionComplete ? planProductionValueEx : null;
  const planProductionPriceWithVat = planProductionComplete
    ? priceAverage(planProductionValueWithVat, planProductionPieces)
    : null;
  const planProductionPriceExVat = planProductionComplete
    ? priceAverage(planProductionValueExVat, planProductionPieces)
    : null;
  const productionDeviationComplete = productionValueComplete && planProductionComplete;

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
    bookClosingPieces,
    inventoryClosingPieces,
    closingInventoryDeviationPieces: closingInventoryDeviationPiecesSum,
    closingInventoryDeviationValueWithVat: closingInventoryDeviationValueWithComplete
      ? closingInventoryDeviationValueWith
      : null,
    closingInventoryDeviationValueExVat: closingInventoryDeviationValueExComplete
      ? closingInventoryDeviationValueEx
      : null,
    currentClosingPieces,
    currentClosingDeviationPieces: currentClosingDeviationPiecesSum,
    currentClosingDeviationValueWithVat: currentClosingDeviationValueWithComplete
      ? currentClosingDeviationValueWith
      : null,
    currentClosingDeviationValueExVat: currentClosingDeviationValueExComplete ? currentClosingDeviationValueEx : null,
    planSalesPieces,
    planSalesPriceWithVat,
    planSalesPriceExVat,
    planSalesRevenueWithVat,
    planSalesRevenueExVat,
    planRevenueComplete,
    salesPieces,
    salesRevenueWithVat,
    salesRevenueExVat,
    salesDeviationPieces: salesDeviationPiecesSum,
    salesDeviationPriceWithVat: moneyDelta(
      salesPieces > 0 ? factPriceWithVat : null,
      planSalesPriceWithVat,
      salesDeviationComplete && salesPieces > 0,
    ),
    salesDeviationPriceExVat: moneyDelta(
      salesPieces > 0 ? factPriceExVat : null,
      planSalesPriceExVat,
      salesDeviationComplete && salesPieces > 0,
    ),
    salesDeviationRevenueWithVat: salesDeviationRevenueComplete ? salesDeviationRevenueWith : null,
    salesDeviationRevenueExVat: salesDeviationRevenueComplete ? salesDeviationRevenueEx : null,
    planProductionPieces,
    planProductionPriceWithVat,
    planProductionPriceExVat,
    planProductionValueWithVat,
    planProductionValueExVat,
    planProductionComplete,
    productionPieces,
    productionPriceWithVat,
    productionPriceExVat,
    productionValueWithVat,
    productionValueExVat,
    productionDeviationPieces: productionDeviationPiecesSum,
    productionDeviationPriceWithVat: moneyDelta(
      productionPieces > 0 ? productionPriceWithVat : null,
      planProductionPriceWithVat,
      productionDeviationComplete && productionPieces > 0,
    ),
    productionDeviationPriceExVat: moneyDelta(
      productionPieces > 0 ? productionPriceExVat : null,
      planProductionPriceExVat,
      productionDeviationComplete && productionPieces > 0,
    ),
    productionDeviationValueWithVat: productionDeviationValueComplete ? productionDeviationValueWith : null,
    productionDeviationValueExVat: productionDeviationValueComplete ? productionDeviationValueEx : null,
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

/** Текущий месяц, если он не раньше `2000-01`. Будущие в свод не входят. */
export function lastSummaryMonth(today: Date): string | null {
  const current = monthKeyFromDate(today);
  if (!isMonthKey(current) || current < '2000-01') {
    return null;
  }
  return current;
}

/**
 * Месяц свода: с `2000-01` по текущий включительно.
 * Позже текущего — текущий. Иначе `null`.
 */
export function clampSummaryMonth(month: string, today: Date): string | null {
  const last = lastSummaryMonth(today);
  if (!last || !isMonthKey(month) || month < '2000-01') {
    return null;
  }
  return month > last ? last : month;
}

/** «С — по» по текущий месяц включительно. Пустые концы — текущий. */
export function resolveSummaryMonthRange(from: string, to: string, today: Date): { from: string; to: string } | null {
  const last = lastSummaryMonth(today);
  if (!last) {
    return null;
  }
  const start = clampSummaryMonth(from, today) ?? last;
  const end = clampSummaryMonth(to, today) ?? start;
  return normalizeMonthRange(start, end);
}

function finishedGoodsRangeProducts(document: PrototypeDocument, months: readonly string[]): Product[] {
  const active = activeProducts(document);
  const activeIds = new Set(active.map((item) => item.id));
  const archived = new Map<string, Product>();
  for (const month of months) {
    for (const product of finishedGoodsGridProducts(document, month)) {
      if (!activeIds.has(product.id)) {
        archived.set(product.id, product);
      }
    }
  }
  return [...active, ...archived.values()];
}

function rangeSales(
  document: PrototypeDocument,
  months: readonly string[],
  productId: string,
): {
  salesPieces: number;
  salesRevenueWithVat: number | null;
  salesRevenueExVat: number | null;
  revenueComplete: boolean;
  lastSalesPieces: number;
} {
  const lastMonth = months[months.length - 1] ?? '';
  let salesPieces = 0;
  let salesRevenueWith = 0;
  let salesRevenueEx = 0;
  let revenueComplete = true;
  let lastSalesPieces = 0;

  for (const month of months) {
    const fact = monthSalesAndProduction(document, month, productId);
    salesPieces += fact.salesPieces;
    if (!fact.revenueComplete) {
      revenueComplete = false;
    } else if (fact.salesRevenueWithVat !== null && fact.salesRevenueExVat !== null) {
      salesRevenueWith += fact.salesRevenueWithVat;
      salesRevenueEx += fact.salesRevenueExVat;
    }
    if (month === lastMonth) {
      lastSalesPieces = fact.salesPieces;
    }
  }

  return {
    salesPieces,
    salesRevenueWithVat: revenueComplete ? salesRevenueWith : null,
    salesRevenueExVat: revenueComplete ? salesRevenueEx : null,
    revenueComplete,
    lastSalesPieces,
  };
}

function emptyRangeView(from: string, to: string): FinishedGoodsRangeView {
  return {
    from,
    to,
    groups: [],
    rows: [],
    totals: emptyTotals(),
  };
}

/**
 * Свод интервала по текущий месяц включительно.
 * Начало — первый месяц. Продажи и выпуск — сумма. Конец и норматив — последний месяц.
 */
export function finishedGoodsRangeView(
  document: PrototypeDocument,
  from: string,
  to: string,
  today: Date,
): FinishedGoodsRangeView {
  if (!isMonthKey(from) || !isMonthKey(to)) {
    return emptyRangeView(from, to);
  }

  const months = monthsInRange(from, to);
  const firstMonth = months[0];
  const lastMonth = months[months.length - 1];
  if (!firstMonth || !lastMonth) {
    return emptyRangeView(from, to);
  }

  const products = finishedGoodsRangeProducts(document, months);
  const dates = new Set<string>();
  for (const month of months) {
    for (const day of monthDates(month)) {
      dates.add(day);
    }
  }
  const producedByProduct = productionSpendOn(document, dates);
  const asOf = finishedGoodsSummaryAsOfDate(lastMonth, today);
  const rows = products.map((product) => {
    const openingPrice = monthOpeningPrice(document, firstMonth, product);
    const sales = rangeSales(document, months, product.id);
    const produced = productionAmounts(producedByProduct.get(product.id));
    const planSales = rangePlanSales(document, months, product);
    const planProduction = rangePlanProduction(document, months, product);
    const bookClosingPieces = bookClosingPiecesForProduct(document, lastMonth, product.id);
    const inventoryClosingPieces = storedInventoryPiecesForProduct(document, lastMonth, product.id);
    const hasInventoryLine = hasStoredInventoryLine(document, lastMonth, product.id);
    const currentClosingPieces = factualClosingPiecesThrough(document, firstMonth, asOf, product.id);
    return rowFromParts(
      product,
      openingPiecesForProduct(document, firstMonth, product.id),
      openingPrice.withVat,
      openingPrice.exVat,
      sales.salesPieces,
      sales.salesRevenueWithVat,
      sales.salesRevenueExVat,
      sales.revenueComplete,
      produced.pieces,
      produced.costWithVat,
      produced.costExVat,
      normForProduct(document, lastMonth, product.id),
      {
        bookClosingPieces,
        inventoryClosingPieces,
        hasInventoryLine,
        currentClosingPieces,
        planSales,
        planProduction,
      },
    );
  });
  const groups = buildGroups(document, products, rows);
  const groupedRows = groups.flatMap((group) => group.rows);

  return {
    from: firstMonth,
    to: lastMonth,
    groups,
    rows: groupedRows,
    totals: groupedRows.length === 0 ? emptyTotals() : sumRows(groupedRows),
  };
}

/** Свод одного месяца. Тот же расчёт, что интервал из этого месяца. */
export function finishedGoodsMonthView(
  document: PrototypeDocument,
  month: string,
  today: Date,
): FinishedGoodsMonthView {
  const range = finishedGoodsRangeView(document, month, month, today);
  return {
    month,
    groups: range.groups,
    rows: range.rows,
    totals: range.totals,
  };
}

/**
 * Дни месяца сверху вниз. Начало 1-го = перенос с конца прошлого месяца;
 * следующий день — с конца предыдущего дня.
 * Конец последнего дня = расчётный конец на своде месяца (до инвентаризации).
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
        const closingPieces = closingStockPieces(openingPieces, produced.pieces, sold.pieces);
        const row = rowFromParts(
          product,
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
          { closingPieces },
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
 * Пишет инвентаризацию на конец месяца. Нет записи месяца — создаёт.
 * Первая правка материализует месяц; расчётный остаток и отклонение не пишет.
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
