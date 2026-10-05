import { ratioKopecks, type UnitCost, unitCost } from '@/domain/cost';
import {
  isMonthKey,
  MAX_ID_LENGTH,
  MAX_VOLUME_PIECES,
  type Product,
  type PrototypeDocument,
  type SalesPlan,
  type SalesPlanLine,
} from '@/domain/document';
import { MAX_PRICE_PER_KILOGRAM_KOPECKS } from '@/domain/units';

const HUNDRED = BigInt(100);
const TEN_THOUSAND = BigInt(10_000);
const TWO = BigInt(2);
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
  revenueWithVatKopecks: number | null;
  /** Копейки, половина вверх. `Svod!J31`. */
  revenueExVatKopecks: number | null;
  unitCost: UnitCost | null;
  /** Копейки. `Svod!L31 = D31 * H31`, с НДС. */
  volumeCostWithVatKopecks: number | null;
  /** Копейки. `Svod!L31`, без НДС. */
  volumeCostExVatKopecks: number | null;
  /** Копейки. `Svod!K31 = J31 - L31`. Одно число, без пары «с НДС». */
  contributionKopecks: number | null;
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
  revenueWithVatKopecks: number | null;
  revenueExVatKopecks: number | null;
  volumeCostWithVatKopecks: number | null;
  volumeCostExVatKopecks: number | null;
  contributionKopecks: number | null;
  /** Есть строка с объёмом, у которой себестоимость не считается. */
  costComplete: boolean;
  /** Есть строка с объёмом, у которой нет ставки НДС. */
  revenueComplete: boolean;
  /** `Svod!F141`: выручка с НДС / объём, копейки. */
  averagePriceWithVatKopecks: number | null;
  /** Выручка без НДС / объём, копейки. */
  averagePriceExVatKopecks: number | null;
  /** `Svod!D141`: себестоимость объёма / объём, копейки. Только если себестоимость полная. */
  averageCostWithVatKopecks: number | null;
  averageCostExVatKopecks: number | null;
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
  return (
    Number.isInteger(value) &&
    value >= 0 &&
    value <= MAX_PRICE_PER_KILOGRAM_KOPECKS
  );
}

function isVolume(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= MAX_VOLUME_PIECES;
}

function fitsSafeKopeckProduct(priceKopecks: number, volume: number): boolean {
  return (
    BigInt(priceKopecks) * BigInt(volume) <= BigInt(Number.MAX_SAFE_INTEGER)
  );
}

function roundHalfAwayFromZero(
  numerator: bigint,
  denominator: bigint,
): number | null {
  if (denominator < ZERO) {
    return roundHalfAwayFromZero(-numerator, -denominator);
  }
  if (denominator === ZERO) {
    return null;
  }

  const negative = numerator < ZERO;
  const magnitude = negative ? -numerator : numerator;
  const rounded = (magnitude + denominator / TWO) / denominator;
  if (rounded > BigInt(Number.MAX_SAFE_INTEGER)) {
    return null;
  }

  const value = Number(rounded);
  return negative ? -value : value;
}

function toSafeNumber(value: bigint): number | null {
  if (
    value > BigInt(Number.MAX_SAFE_INTEGER) ||
    value < BigInt(Number.MIN_SAFE_INTEGER)
  ) {
    return null;
  }

  return Number(value);
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

export function horizonMonths(today: Date): string[] {
  const start = monthKeyFromDate(today);
  return Array.from({ length: PLAN_HORIZON_MONTHS }, (_, index) =>
    shiftMonth(start, index),
  );
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

/** Строки нулевого плана: все рабочие конечные товары, цена из прошлого или 0. */
export function defaultSalesPlanLines(
  document: PrototypeDocument,
  month: string,
): SalesPlanLine[] {
  return activeFinalProducts(document).map((product) => ({
    id: `sales-plan-line:${month}:${product.id}`,
    productId: product.id,
    priceWithVatKopecks: suggestedPriceWithVatKopecks(
      document,
      product.id,
      month,
    ),
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

/** Пишет нулевой план, если рабочего ещё нет и месяц в горизонте. */
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

// Не вызывается: отдельного списка планов больше нет, план появляется с сводки.
// export function deletedSalesPlans(document: PrototypeDocument): SalesPlan[] {
//   return document.salesPlans.filter((item) => item.deletedAt !== null);
// }

export function activeFinalProducts(document: PrototypeDocument): Product[] {
  return document.products.filter((item) => item.deletedAt === null);
}

// Не вызывается: месяцы плана больше не выбирают отдельным экраном.
// export function availablePlanMonths(
//   document: PrototypeDocument,
//   today: Date,
// ): string[] {
//   const taken = new Set(activeSalesPlans(document).map((item) => item.month));
//   return horizonMonths(today).filter((month) => !taken.has(month));
// }

/** Цена с НДС из последнего более раннего рабочего плана, где товар уже был. Иначе 0. */
export function suggestedPriceWithVatKopecks(
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
      return line.priceWithVatKopecks;
    }
  }

  return 0;
}

// Не вызывается: отдельного создания плана с подсказкой цены больше нет.
// export function hasEarlierPlanPrice(
//   document: PrototypeDocument,
//   month: string,
// ): boolean {
//   return activeSalesPlans(document).some(
//     (plan) => plan.month < month && plan.lines.length > 0,
//   );
// }

export function missingPlanProducts(
  document: PrototypeDocument,
  plan: SalesPlan,
): Product[] {
  const present = new Set(plan.lines.map((line) => line.productId));
  return activeFinalProducts(document).filter((item) => !present.has(item.id));
}

function multiplyKopecks(unitKopecks: number, volume: number): number | null {
  return toSafeNumber(BigInt(unitKopecks) * BigInt(volume));
}

/**
 * Цена без НДС: десятитысячные доли рубля (внутри расчёта).
 * На экране — до копеек. `Svod!G31 = F31 / (100 + N31) * 100`.
 * 99,14 ₽ и НДС 10% → 90,1273 ₽ внутри, на экране 90,13 ₽.
 */
export function priceExVatTenThousandths(
  priceWithVatKopecks: number,
  vatPercent: number,
): number | null {
  return ratioKopecks(
    BigInt(priceWithVatKopecks) * TEN_THOUSAND,
    BigInt(100 + vatPercent),
  );
}

/** Выручка с НДС, копейки. `Svod!I31 = F31 * H31`. */
export function revenueWithVatKopecks(
  priceWithVatKopecks: number,
  volumePieces: number,
): number | null {
  return multiplyKopecks(priceWithVatKopecks, volumePieces);
}

/**
 * Выручка без НДС, копейки, половина вверх на результате.
 * `Svod!J31`. 99,14 ₽, НДС 10%, 6000 шт → 54 076 364 коп. = 540 763,64 ₽.
 */
export function revenueExVatKopecks(
  priceWithVatKopecks: number,
  vatPercent: number,
  volumePieces: number,
): number | null {
  if (volumePieces === 0) {
    return 0;
  }

  return ratioKopecks(
    BigInt(priceWithVatKopecks) * HUNDRED * BigInt(volumePieces),
    BigInt(100 + vatPercent),
  );
}

/**
 * Рентабельность, сотые доли процента.
 * `Svod!E31 = (G31 - D31) / D31 * 100`. Себестоимость 0 → 0.
 */
export function profitabilityHundredths(
  priceWithVatKopecks: number,
  vatPercent: number,
  unitCostExVatKopecks: number,
): number | null {
  if (unitCostExVatKopecks === 0) {
    return 0;
  }

  const vat = BigInt(100 + vatPercent);
  const numerator =
    (BigInt(priceWithVatKopecks) * HUNDRED -
      BigInt(unitCostExVatKopecks) * vat) *
    TEN_THOUSAND;
  const denominator = vat * BigInt(unitCostExVatKopecks);
  return roundHalfAwayFromZero(numerator, denominator);
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
  const revenueWith = revenueWithVatKopecks(
    line.priceWithVatKopecks,
    line.volumePieces,
  );
  const revenueEx =
    vat === null
      ? line.volumePieces === 0
        ? 0
        : null
      : revenueExVatKopecks(line.priceWithVatKopecks, vat, line.volumePieces);
  const volumeCostWith =
    cost === null
      ? null
      : multiplyKopecks(cost.withVatKopecks, line.volumePieces);
  const volumeCostEx =
    cost === null
      ? null
      : multiplyKopecks(cost.exVatKopecks, line.volumePieces);
  const contribution =
    revenueEx === null || volumeCostEx === null
      ? null
      : revenueEx - volumeCostEx;

  return {
    priceExVatTenThousandths:
      vat === null
        ? null
        : priceExVatTenThousandths(line.priceWithVatKopecks, vat),
    revenueWithVatKopecks: revenueWith,
    revenueExVatKopecks: revenueEx,
    unitCost: cost,
    volumeCostWithVatKopecks: volumeCostWith,
    volumeCostExVatKopecks: volumeCostEx,
    contributionKopecks: contribution,
    profitabilityHundredths:
      cost === null
        ? null
        : vat === null
          ? null
          : profitabilityHundredths(
              line.priceWithVatKopecks,
              vat,
              cost.exVatKopecks,
            ),
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

  for (const line of plan.lines) {
    const metrics = salesPlanLineMetrics(document, plan, line);
    volume += BigInt(line.volumePieces);
    if (line.volumePieces > 0) {
      productsWithVolume += 1;
    }

    if (metrics.revenueWithVatKopecks === null) {
      revenueWithComplete = false;
    } else {
      revenueWith += BigInt(metrics.revenueWithVatKopecks);
    }

    if (metrics.revenueExVatKopecks === null) {
      revenueExComplete = false;
    } else {
      revenueEx += BigInt(metrics.revenueExVatKopecks);
    }

    if (line.volumePieces > 0 && metrics.volumeCostExVatKopecks === null) {
      costComplete = false;
    }

    if (metrics.volumeCostWithVatKopecks !== null) {
      costWith += BigInt(metrics.volumeCostWithVatKopecks);
    }
    if (metrics.volumeCostExVatKopecks !== null) {
      costEx += BigInt(metrics.volumeCostExVatKopecks);
    }
  }

  const volumePieces = toSafeNumber(volume);
  const revenueComplete = revenueWithComplete && revenueExComplete;
  const revenueWithVatKopecks = revenueWithComplete
    ? toSafeNumber(revenueWith)
    : null;
  const revenueExVatKopecks = revenueExComplete
    ? toSafeNumber(revenueEx)
    : null;
  const volumeCostWithVatKopecks = toSafeNumber(costWith);
  const volumeCostExVatKopecks = toSafeNumber(costEx);
  const contributionKopecks =
    costComplete &&
    revenueComplete &&
    revenueExVatKopecks !== null &&
    volumeCostExVatKopecks !== null
      ? revenueExVatKopecks - volumeCostExVatKopecks
      : null;

  const averagePriceWithVatKopecks =
    volumePieces !== null && volumePieces > 0 && revenueWithVatKopecks !== null
      ? ratioKopecks(BigInt(revenueWithVatKopecks), BigInt(volumePieces))
      : null;
  const averagePriceExVatKopecks =
    volumePieces !== null && volumePieces > 0 && revenueExVatKopecks !== null
      ? ratioKopecks(BigInt(revenueExVatKopecks), BigInt(volumePieces))
      : null;
  const averageCostWithVatKopecks =
    costComplete &&
    volumePieces !== null &&
    volumePieces > 0 &&
    volumeCostWithVatKopecks !== null
      ? ratioKopecks(BigInt(volumeCostWithVatKopecks), BigInt(volumePieces))
      : null;
  const averageCostExVatKopecks =
    costComplete &&
    volumePieces !== null &&
    volumePieces > 0 &&
    volumeCostExVatKopecks !== null
      ? ratioKopecks(BigInt(volumeCostExVatKopecks), BigInt(volumePieces))
      : null;

  let profitability: number | null = null;
  if (contributionKopecks !== null && volumeCostExVatKopecks !== null) {
    profitability =
      volumeCostExVatKopecks === 0
        ? 0
        : roundHalfAwayFromZero(
            BigInt(contributionKopecks) * TEN_THOUSAND,
            BigInt(volumeCostExVatKopecks),
          );
  }

  return {
    volumePieces,
    perDay: volumePieces === null || days === 0 ? null : volumePieces / days,
    revenueWithVatKopecks,
    revenueExVatKopecks,
    volumeCostWithVatKopecks,
    volumeCostExVatKopecks,
    contributionKopecks,
    costComplete,
    revenueComplete,
    averagePriceWithVatKopecks,
    averagePriceExVatKopecks,
    averageCostWithVatKopecks,
    averageCostExVatKopecks,
    profitabilityHundredths: profitability,
    productsWithVolume,
    lineCount: plan.lines.length,
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
  return plan.deletedAt === null && planPhase(plan.month, today) !== 'past';
}

function lineNumbersRejection(
  priceWithVatKopecks: number,
  volumePieces: number,
): SalesPlanRejection | null {
  if (!isPrice(priceWithVatKopecks)) {
    return 'price';
  }
  if (!isVolume(volumePieces)) {
    return 'volume';
  }
  if (!fitsSafeKopeckProduct(priceWithVatKopecks, volumePieces)) {
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
  if (!isMonthKey(month) || !horizonMonths(today).includes(month)) {
    return 'month';
  }
  if (monthIsTaken(document, month)) {
    return 'taken';
  }

  const expected = new Set(
    activeFinalProducts(document).map((item) => item.id),
  );
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

    const numbers = lineNumbersRejection(
      line.priceWithVatKopecks,
      line.volumePieces,
    );
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

// Не вызывается: план создаёт ensureSalesPlan, отдельного сообщения об отказе нет.
// export function addSalesPlanRejection(
//   document: PrototypeDocument,
//   id: string,
//   month: string,
//   lines: readonly SalesPlanLine[],
//   today: Date,
// ): SalesPlanRejection | null {
//   return createRejection(document, id, month, lines, today);
// }

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
  priceWithVatKopecks: number,
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

  return lineNumbersRejection(priceWithVatKopecks, volumePieces);
}

export function updateSalesPlanLine(
  document: PrototypeDocument,
  planId: string,
  lineId: string,
  priceWithVatKopecks: number,
  volumePieces: number,
  today: Date,
): PrototypeDocument {
  if (
    updateSalesPlanLineRejection(
      document,
      planId,
      lineId,
      priceWithVatKopecks,
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
    line.priceWithVatKopecks === priceWithVatKopecks &&
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
                ? { ...entry, priceWithVatKopecks, volumePieces }
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
    priceWithVatKopecks: suggestedPriceWithVatKopecks(
      document,
      line.productId,
      plan.month,
    ),
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

// Не вызывается: отдельного списка планов больше нет.
// export function deleteSalesPlan(
//   document: PrototypeDocument,
//   id: string,
//   deletedAt: string,
// ): PrototypeDocument {
//   if (!isDeletionMark(deletedAt)) {
//     return document;
//   }
//
//   const current = document.salesPlans.find(
//     (item) => item.id === id && item.deletedAt === null,
//   );
//   if (!current) {
//     return document;
//   }
//
//   return {
//     ...document,
//     salesPlans: document.salesPlans.map((item) =>
//       item.id === id ? { ...item, deletedAt } : item,
//     ),
//   };
// }
//
// export function restoreSalesPlanRejection(
//   document: PrototypeDocument,
//   id: string,
// ): SalesPlanRejection | null {
//   const current = document.salesPlans.find(
//     (item) => item.id === id && item.deletedAt !== null,
//   );
//   if (!current) {
//     return 'missing';
//   }
//   if (monthIsTaken(document, current.month)) {
//     return 'taken';
//   }
//
//   return null;
// }
//
// export function restoreSalesPlan(
//   document: PrototypeDocument,
//   id: string,
// ): PrototypeDocument {
//   if (restoreSalesPlanRejection(document, id)) {
//     return document;
//   }
//
//   return {
//     ...document,
//     salesPlans: document.salesPlans.map((item) =>
//       item.id === id ? { ...item, deletedAt: null } : item,
//     ),
//   };
// }
//
// export function compareSalesPlans(
//   left: SalesPlan,
//   right: SalesPlan,
//   today: Date,
// ): number {
//   const rank: Record<PlanPhase, number> = { current: 0, future: 1, past: 2 };
//   const leftPhase = planPhase(left.month, today);
//   const rightPhase = planPhase(right.month, today);
//   if (rank[leftPhase] !== rank[rightPhase]) {
//     return rank[leftPhase] - rank[rightPhase];
//   }
//   if (leftPhase === 'past' && left.month !== right.month) {
//     return right.month < left.month ? -1 : 1;
//   }
//   if (left.month !== right.month) {
//     return left.month < right.month ? -1 : 1;
//   }
//
//   return left.id < right.id ? -1 : 1;
// }
