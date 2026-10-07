import { type UnitCost, unitCost } from '@/domain/cost';
import {
  isMonthKey,
  MAX_ID_LENGTH,
  MAX_VOLUME_PIECES,
  type Product,
  type PrototypeDocument,
  type SalesPlan,
  type SalesPlanLine,
} from '@/domain/document';
import {
  amountWithVat,
  averageAmount,
  fitsSafeMoneyProduct,
  multiplyAmount,
  percentHundredths,
  ratioRound,
  toSafeNumber,
} from '@/domain/money';
import { activeProducts } from '@/domain/products';
import { MAX_PRICE_KOPECKS } from '@/domain/units';

const HUNDRED = BigInt(100);
const TEN_THOUSAND = BigInt(10_000);
const ZERO = BigInt(0);

/** Текущий месяц и 23 следующих. Вместе 24. */
export const PLAN_HORIZON_MONTHS = 24;

export type PlanPhase = 'current' | 'future' | 'past';

export type SalesPlanRejection =
  | 'missing'
  | 'month'
  | 'taken'
  | 'products'
  | 'price'
  | 'volume'
  | 'overflow'
  | 'duplicate-line'
  | 'locked'
  | 'closed';

export interface SalesPlanLineMetrics {
  /** Десятитысячные доли рубля: 901273 = 90,1273 ₽. `Svod!G31`, без округления до копейки. */
  priceExVatTenThousandths: number | null;
  /** Копейки. `Svod!I31 = F31 * H31`. */
  revenueWithVat: number | null;
  /** Копейки, половина вверх. `Svod!J31`. */
  revenueExVat: number | null;
  unitCost: UnitCost | null;
  /** Копейки. `Svod!L31 = D31 * H31`, с НДС. */
  volumeCostWithVat: number | null;
  /** Копейки. `Svod!L31`, без НДС. */
  volumeCostExVat: number | null;
  /** Копейки. `Svod!K31 = J31 - L31`. Одно число, без пары «с НДС». */
  contribution: number | null;
  /**
   * Сотые доли процента: 1234 = 12,34%.
   * `Svod!E31 = (G31 - D31) / D31 * 100`. Ноль себестоимости — 0.
   */
  profitabilityHundredths: number | null;
  /** `Svod!M31 = H31 / дни месяца`. Дни — длина календарного месяца, не `Svod!M12`. */
  perDay: number;
}

export interface SalesPlanTotals {
  volumePieces: number | null;
  perDay: number | null;
  revenueWithVat: number | null;
  revenueExVat: number | null;
  volumeCostWithVat: number | null;
  volumeCostExVat: number | null;
  contribution: number | null;
  /** Есть строка с объёмом, у которой себестоимость не считается. */
  costComplete: boolean;
  /** Есть строка с объёмом, у которой нет ставки НДС. */
  revenueComplete: boolean;
  /** `Svod!F141`: выручка с НДС / объём, копейки. */
  averagePriceWithVat: number | null;
  /** Выручка без НДС / объём, копейки. */
  averagePriceExVat: number | null;
  /** `Svod!D141`: себестоимость объёма / объём, копейки. Только если себестоимость полная. */
  averageCostWithVat: number | null;
  averageCostExVat: number | null;
  /** Рентабельность итога: Т-проток / себестоимость объёма без НДС. */
  profitabilityHundredths: number | null;
  productsWithVolume: number;
  lineCount: number;
}

function isEntityId(value: string): boolean {
  return (
    value.length > 0 && value.length <= MAX_ID_LENGTH && value === value.trim()
  );
}

function isPrice(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= MAX_PRICE_KOPECKS;
}

function isVolume(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= MAX_VOLUME_PIECES;
}

/** `ГГГГ-ММ` по локальному календарю. */
export function monthKeyFromDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${date.getFullYear()}-${month}`;
}

export function shiftMonth(month: string, offset: number): string {
  const year = Number(month.slice(0, 4));
  const mon = Number(month.slice(5, 7));
  return monthKeyFromDate(new Date(year, mon - 1 + offset, 1));
}

export function daysInMonth(month: string): number {
  const year = Number(month.slice(0, 4));
  const mon = Number(month.slice(5, 7));
  return new Date(year, mon, 0).getDate();
}

export function planPhase(month: string, today: Date): PlanPhase {
  const current = monthKeyFromDate(today);
  if (month === current) {
    return 'current';
  }

  return month < current ? 'past' : 'future';
}

/** Прошедший, текущий и будущий в горизонте — как на сводке с 2000-01. */
export function planMonthOpen(month: string, today: Date): boolean {
  if (!isMonthKey(month) || month < '2000-01') {
    return false;
  }

  const end = shiftMonth(monthKeyFromDate(today), PLAN_HORIZON_MONTHS - 1);
  return month <= end;
}

export function activeSalesPlans(document: PrototypeDocument): SalesPlan[] {
  return document.salesPlans.filter((item) => item.deletedAt === null);
}

export function workingSalesPlan(
  document: PrototypeDocument,
  month: string,
): SalesPlan | null {
  return (
    activeSalesPlans(document).find((item) => item.month === month) ?? null
  );
}

/** Строки нулевого плана: все рабочие товары, цена из прошлого или 0. */
export function defaultSalesPlanLines(
  document: PrototypeDocument,
  month: string,
): SalesPlanLine[] {
  return activeProducts(document).map((product) => ({
    id: `sales-plan-line:${month}:${product.id}`,
    productId: product.id,
    priceWithVat: suggestedPriceWithVat(document, product.id, month),
    volumePieces: 0,
  }));
}

/**
 * Рабочий план месяца или виртуальный нулевой.
 * Виртуальный в документ не пишется, пока его не материализуют через `ensureSalesPlan`.
 */
export function salesPlanForMonth(
  document: PrototypeDocument,
  month: string,
): SalesPlan {
  return (
    workingSalesPlan(document, month) ?? {
      id: `sales-plan:${month}`,
      month,
      lines: defaultSalesPlanLines(document, month),
      deletedAt: null,
    }
  );
}

/** Пишет нулевой план, если рабочего ещё нет и месяц открыт для правки. */
export function ensureSalesPlan(
  document: PrototypeDocument,
  id: string,
  month: string,
  today: Date,
): PrototypeDocument {
  if (workingSalesPlan(document, month)) {
    return document;
  }

  const lines = defaultSalesPlanLines(document, month);
  if (lines.length === 0) {
    return document;
  }

  return addSalesPlan(document, id, month, lines, today);
}

/** Цена с НДС из последнего более раннего рабочего плана, где товар уже был. Иначе 0. */
export function suggestedPriceWithVat(
  document: PrototypeDocument,
  productId: string,
  month: string,
): number {
  const earlier = activeSalesPlans(document)
    .filter((item) => item.month < month)
    .sort((left, right) => (left.month < right.month ? 1 : -1));

  for (const plan of earlier) {
    const line = plan.lines.find((item) => item.productId === productId);
    if (line) {
      return line.priceWithVat;
    }
  }

  return 0;
}

export function missingPlanProducts(
  document: PrototypeDocument,
  plan: SalesPlan,
): Product[] {
  const present = new Set(plan.lines.map((line) => line.productId));
  return activeProducts(document).filter((item) => !present.has(item.id));
}

/**
 * Цена без НДС: десятитысячные доли рубля (внутри расчёта).
 * На экране — до копеек. `Svod!G31 = F31 / (100 + N31) * 100`.
 * 99,14 ₽ и НДС 10% → 90,1273 ₽ внутри, на экране 90,13 ₽.
 */
export function priceExVatTenThousandths(
  priceWithVat: number,
  vatPercent: number,
): number | null {
  return ratioRound(
    BigInt(priceWithVat) * TEN_THOUSAND,
    BigInt(100 + vatPercent),
  );
}

/**
 * Цена с НДС, копейки, из цены без НДС (копейки).
 * Обратно к округлённой до копейки цене без НДС на сводке.
 */
export function priceWithVatFromExVat(
  priceExVat: number,
  vatPercent: number,
): number | null {
  return amountWithVat(priceExVat, vatPercent);
}

/** Выручка с НДС, копейки. `Svod!I31 = F31 * H31`. */
export function revenueWithVat(
  priceWithVat: number,
  volumePieces: number,
): number | null {
  return multiplyAmount(priceWithVat, volumePieces);
}

/**
 * Выручка без НДС, копейки, половина вверх на результате.
 * `Svod!J31`. 99,14 ₽, НДС 10%, 6000 шт → 54 076 364 коп. = 540 763,64 ₽.
 */
export function revenueExVat(
  priceWithVat: number,
  vatPercent: number,
  volumePieces: number,
): number | null {
  if (volumePieces === 0) {
    return 0;
  }

  return ratioRound(
    BigInt(priceWithVat) * HUNDRED * BigInt(volumePieces),
    BigInt(100 + vatPercent),
  );
}

/**
 * Рентабельность, сотые доли процента.
 * `Svod!E31 = (G31 - D31) / D31 * 100`. Себестоимость 0 → 0.
 */
export function profitabilityHundredths(
  priceWithVat: number,
  vatPercent: number,
  unitCostExVat: number,
): number | null {
  if (unitCostExVat === 0) {
    return 0;
  }

  const vat = BigInt(100 + vatPercent);
  const numerator =
    (BigInt(priceWithVat) * HUNDRED - BigInt(unitCostExVat) * vat) *
    TEN_THOUSAND;
  const denominator = vat * BigInt(unitCostExVat);
  return ratioRound(numerator, denominator);
}

export function salesPlanLineMetrics(
  document: PrototypeDocument,
  plan: SalesPlan,
  line: SalesPlanLine,
): SalesPlanLineMetrics {
  const days = daysInMonth(plan.month);
  const perDay = days > 0 ? line.volumePieces / days : 0;
  const product = document.products.find((item) => item.id === line.productId);
  const vat = product?.vatPercent ?? null;
  const cost = product ? unitCost(document, product.id) : null;
  const revenueWith = revenueWithVat(line.priceWithVat, line.volumePieces);
  const revenueEx =
    vat === null
      ? line.volumePieces === 0
        ? 0
        : null
      : revenueExVat(line.priceWithVat, vat, line.volumePieces);
  const volumeCostWith =
    cost === null ? null : multiplyAmount(cost.withVat, line.volumePieces);
  const volumeCostEx =
    cost === null ? null : multiplyAmount(cost.exVat, line.volumePieces);
  const contribution =
    revenueEx === null || volumeCostEx === null
      ? null
      : revenueEx - volumeCostEx;

  return {
    priceExVatTenThousandths:
      vat === null ? null : priceExVatTenThousandths(line.priceWithVat, vat),
    revenueWithVat: revenueWith,
    revenueExVat: revenueEx,
    unitCost: cost,
    volumeCostWithVat: volumeCostWith,
    volumeCostExVat: volumeCostEx,
    contribution: contribution,
    profitabilityHundredths:
      cost === null
        ? null
        : vat === null
          ? null
          : profitabilityHundredths(line.priceWithVat, vat, cost.exVat),
    perDay,
  };
}

export function salesPlanTotals(
  document: PrototypeDocument,
  plan: SalesPlan,
): SalesPlanTotals {
  const days = daysInMonth(plan.month);
  let volume = ZERO;
  let revenueWith = ZERO;
  let revenueEx = ZERO;
  let costWith = ZERO;
  let costEx = ZERO;
  let costComplete = true;
  let revenueWithComplete = true;
  let revenueExComplete = true;
  let productsWithVolume = 0;

  const workingIds = new Set(activeProducts(document).map((item) => item.id));
  let lineCount = 0;

  for (const line of plan.lines) {
    if (!workingIds.has(line.productId)) {
      continue;
    }
    lineCount += 1;
    const metrics = salesPlanLineMetrics(document, plan, line);
    volume += BigInt(line.volumePieces);
    if (line.volumePieces > 0) {
      productsWithVolume += 1;
    }

    if (metrics.revenueWithVat === null) {
      revenueWithComplete = false;
    } else {
      revenueWith += BigInt(metrics.revenueWithVat);
    }

    if (metrics.revenueExVat === null) {
      revenueExComplete = false;
    } else {
      revenueEx += BigInt(metrics.revenueExVat);
    }

    if (line.volumePieces > 0 && metrics.volumeCostExVat === null) {
      costComplete = false;
    }

    if (metrics.volumeCostWithVat !== null) {
      costWith += BigInt(metrics.volumeCostWithVat);
    }
    if (metrics.volumeCostExVat !== null) {
      costEx += BigInt(metrics.volumeCostExVat);
    }
  }

  const volumePieces = toSafeNumber(volume);
  const revenueComplete = revenueWithComplete && revenueExComplete;
  const revenueWithVat = revenueWithComplete ? toSafeNumber(revenueWith) : null;
  const revenueExVat = revenueExComplete ? toSafeNumber(revenueEx) : null;
  const volumeCostWithVat = toSafeNumber(costWith);
  const volumeCostExVat = toSafeNumber(costEx);
  const contribution =
    costComplete &&
    revenueComplete &&
    revenueExVat !== null &&
    volumeCostExVat !== null
      ? revenueExVat - volumeCostExVat
      : null;

  const averagePriceWithVat = averageAmount(revenueWithVat, volumePieces);
  const averagePriceExVat = averageAmount(revenueExVat, volumePieces);
  const averageCostWithVat = costComplete
    ? averageAmount(volumeCostWithVat, volumePieces)
    : null;
  const averageCostExVat = costComplete
    ? averageAmount(volumeCostExVat, volumePieces)
    : null;

  return {
    volumePieces,
    perDay: volumePieces === null || days === 0 ? null : volumePieces / days,
    revenueWithVat,
    revenueExVat,
    volumeCostWithVat,
    volumeCostExVat,
    contribution,
    costComplete,
    revenueComplete,
    averagePriceWithVat,
    averagePriceExVat,
    averageCostWithVat,
    averageCostExVat,
    profitabilityHundredths: percentHundredths(contribution, volumeCostExVat),
    productsWithVolume,
    lineCount,
  };
}

function monthIsTaken(
  document: PrototypeDocument,
  month: string,
  exceptId?: string,
): boolean {
  return activeSalesPlans(document).some(
    (item) => item.month === month && item.id !== exceptId,
  );
}

function planIsOpen(plan: SalesPlan, today: Date): boolean {
  return plan.deletedAt === null && planMonthOpen(plan.month, today);
}

function lineNumbersRejection(
  priceWithVat: number,
  volumePieces: number,
): SalesPlanRejection | null {
  if (!isPrice(priceWithVat)) {
    return 'price';
  }
  if (!isVolume(volumePieces)) {
    return 'volume';
  }
  if (!fitsSafeMoneyProduct(priceWithVat, volumePieces)) {
    return 'overflow';
  }

  return null;
}

function createRejection(
  document: PrototypeDocument,
  id: string,
  month: string,
  lines: readonly SalesPlanLine[],
  today: Date,
): SalesPlanRejection | null {
  if (!isEntityId(id) || document.salesPlans.some((item) => item.id === id)) {
    return 'missing';
  }
  if (!planMonthOpen(month, today)) {
    return 'month';
  }
  if (monthIsTaken(document, month)) {
    return 'taken';
  }

  const expected = new Set(activeProducts(document).map((item) => item.id));
  if (expected.size === 0 || lines.length !== expected.size) {
    return 'products';
  }

  const seenLines = new Set<string>();
  const seenProducts = new Set<string>();
  for (const line of lines) {
    if (!isEntityId(line.id)) {
      return 'missing';
    }
    if (seenLines.has(line.id)) {
      return 'duplicate-line';
    }
    if (!expected.has(line.productId) || seenProducts.has(line.productId)) {
      return 'products';
    }

    const numbers = lineNumbersRejection(line.priceWithVat, line.volumePieces);
    if (numbers) {
      return numbers;
    }

    seenLines.add(line.id);
    seenProducts.add(line.productId);
  }

  return null;
}

export function addSalesPlan(
  document: PrototypeDocument,
  id: string,
  month: string,
  lines: readonly SalesPlanLine[],
  today: Date,
): PrototypeDocument {
  if (createRejection(document, id, month, lines, today)) {
    return document;
  }

  const plan: SalesPlan = {
    id,
    month,
    lines: lines.map((line) => ({ ...line })),
    deletedAt: null,
  };

  return { ...document, salesPlans: [...document.salesPlans, plan] };
}

function openPlan(
  document: PrototypeDocument,
  planId: string,
): SalesPlan | null {
  return (
    document.salesPlans.find(
      (item) => item.id === planId && item.deletedAt === null,
    ) ?? null
  );
}

export function updateSalesPlanLineRejection(
  document: PrototypeDocument,
  planId: string,
  lineId: string,
  priceWithVat: number,
  volumePieces: number,
  today: Date,
): SalesPlanRejection | null {
  const plan = document.salesPlans.find((item) => item.id === planId);
  if (!plan || plan.deletedAt !== null) {
    return 'missing';
  }
  if (!planIsOpen(plan, today)) {
    return 'closed';
  }

  const line = plan.lines.find((item) => item.id === lineId);
  if (!line) {
    return 'missing';
  }

  const product = document.products.find((item) => item.id === line.productId);
  if (!product || product.deletedAt !== null) {
    return 'locked';
  }

  return lineNumbersRejection(priceWithVat, volumePieces);
}

export function updateSalesPlanLine(
  document: PrototypeDocument,
  planId: string,
  lineId: string,
  priceWithVat: number,
  volumePieces: number,
  today: Date,
): PrototypeDocument {
  if (
    updateSalesPlanLineRejection(
      document,
      planId,
      lineId,
      priceWithVat,
      volumePieces,
      today,
    )
  ) {
    return document;
  }

  const plan = openPlan(document, planId);
  const line = plan?.lines.find((item) => item.id === lineId);
  if (!plan || !line) {
    return document;
  }
  if (
    line.priceWithVat === priceWithVat &&
    line.volumePieces === volumePieces
  ) {
    return document;
  }

  return {
    ...document,
    salesPlans: document.salesPlans.map((item) =>
      item.id === planId
        ? {
            ...item,
            lines: item.lines.map((entry) =>
              entry.id === lineId
                ? { ...entry, priceWithVat, volumePieces }
                : entry,
            ),
          }
        : item,
    ),
  };
}

export function addMissingPlanLinesRejection(
  document: PrototypeDocument,
  planId: string,
  lines: readonly { id: string; productId: string }[],
  today: Date,
): SalesPlanRejection | null {
  const plan = openPlan(document, planId);
  if (!plan) {
    return 'missing';
  }
  if (!planIsOpen(plan, today)) {
    return 'closed';
  }

  const missing = new Set(
    missingPlanProducts(document, plan).map((item) => item.id),
  );
  if (missing.size === 0) {
    return lines.length === 0 ? null : 'products';
  }
  if (lines.length !== missing.size) {
    return 'products';
  }

  const seenLines = new Set(plan.lines.map((line) => line.id));
  const seenProducts = new Set<string>();
  for (const line of lines) {
    if (!isEntityId(line.id) || seenLines.has(line.id)) {
      return 'duplicate-line';
    }
    if (!missing.has(line.productId) || seenProducts.has(line.productId)) {
      return 'products';
    }
    seenLines.add(line.id);
    seenProducts.add(line.productId);
  }

  return null;
}

export function addMissingPlanLines(
  document: PrototypeDocument,
  planId: string,
  lines: readonly { id: string; productId: string }[],
  today: Date,
): PrototypeDocument {
  if (addMissingPlanLinesRejection(document, planId, lines, today)) {
    return document;
  }
  if (lines.length === 0) {
    return document;
  }

  const plan = openPlan(document, planId);
  if (!plan) {
    return document;
  }

  const nextLines: SalesPlanLine[] = lines.map((line) => ({
    id: line.id,
    productId: line.productId,
    priceWithVat: suggestedPriceWithVat(document, line.productId, plan.month),
    volumePieces: 0,
  }));

  return {
    ...document,
    salesPlans: document.salesPlans.map((item) =>
      item.id === planId
        ? { ...item, lines: [...item.lines, ...nextLines] }
        : item,
    ),
  };
}
