import { visibleCategories } from '@/domain/categories';
import { type UnitCost, unitCost } from '@/domain/cost';
import {
  isMonthKey,
  MAX_OPERATING_EXPENSE,
  PROFIT_TAX_PERCENT,
  type Product,
  type ProductCategory,
  type PrototypeDocument,
  type SalesFact,
  type SalesPlan,
} from '@/domain/document';
import {
  averageAmount,
  percentHundredths,
  ratioRound,
  toSafeNumber,
  vatPercentHundredths,
} from '@/domain/money';
import {
  type SalesFactRow,
  salesFactGridProducts,
  salesFactMonth,
  workingSalesFact,
} from '@/domain/sales-fact';
import {
  daysInMonth,
  monthKeyFromDate,
  PLAN_HORIZON_MONTHS,
  type SalesPlanTotals,
  salesPlanForMonth,
  salesPlanLineMetrics,
  salesPlanTotals,
  shiftMonth,
} from '@/domain/sales-plan';

const HUNDRED = BigInt(100);
const ZERO = BigInt(0);

export interface SummarySide {
  volumePieces: number | null;
  perDay: number | null;
  priceWithVat: number | null;
  /** Десятитысячные доли рубля. Только у строки плана с введённой ценой. */
  priceExVatTenThousandths: number | null;
  priceExVat: number | null;
  unitCost: UnitCost | null;
  averageCostWithVat: number | null;
  averageCostExVat: number | null;
  volumeCostWithVat: number | null;
  volumeCostExVat: number | null;
  revenueWithVat: number | null;
  revenueExVat: number | null;
  contribution: number | null;
  profitabilityHundredths: number | null;
  vatPercent: number | null;
  vatPercentHundredths: number | null;
  costComplete: boolean;
  revenueComplete: boolean;
}

export interface SummaryVariance {
  revenueWithVat: number | null;
  revenueExVat: number | null;
  contribution: number | null;
}

export interface SummaryRow {
  productId: string;
  name: string;
  deleted: boolean;
  planLineId: string | null;
  planPriceWithVat: number | null;
  planVolumePieces: number | null;
  plan: SummarySide | null;
  fact: SummarySide;
  variance: SummaryVariance;
}

/** Строка группы `Svod`. Пустая рабочая категория тоже входит. */
export interface SummaryGroup {
  categoryId: string;
  name: string;
  deleted: boolean;
  rows: SummaryRow[];
  plan: SummarySide | null;
  fact: SummarySide;
  variance: SummaryVariance;
}

export interface SummaryView {
  month: string;
  days: number;
  plan: SalesPlan | null;
  groups: SummaryGroup[];
  rows: SummaryRow[];
  planTotals: SalesPlanTotals | null;
  planTotalsSide: SummarySide | null;
  factTotals: SummarySide;
  variance: SummaryVariance;
  /** Верхний блок `Svod!D2:L8` без факторинга. */
  headline: SummaryHeadline;
}

/** Одна колонка верхнего блока: план или факт. */
export interface SummaryHeadlineSide {
  /** `Svod!G2` / `I2` без Factoring: сумма выручки с НДС по товарам. */
  revenueWithVat: number | null;
  /** `Svod!G3` / `I3` без Factoring: сумма Т-протока. */
  contribution: number | null;
  /** `Svod!G4` / `I4`: операционные расходы без НДС. */
  operatingExpenseExVat: number;
  /** `Svod!G5` / `I5` = Т-проток − операционные расходы. */
  profit: number | null;
  /** `Svod!G6` / `I6` = прибыль × `Svod!C6` / 100. */
  profitTax: number | null;
  /** `Svod!G7` / `I7` = прибыль − налог. */
  netProfit: number | null;
  /**
   * `Svod!G8` / `I8`: чистая прибыль / выручка без НДС × 100.
   * Хранится в сотых долях процента, как рентабельность строки.
   */
  netProfitabilityHundredths: number | null;
}

export interface SummaryHeadline {
  plan: SummaryHeadlineSide;
  fact: SummaryHeadlineSide;
  variance: {
    revenueWithVat: number | null;
    contribution: number | null;
    operatingExpenseExVat: number;
    profit: number | null;
    profitTax: number | null;
    netProfit: number | null;
    netProfitabilityHundredths: number | null;
  };
  taxPercent: number;
}

export type OperatingExpenseSide = 'plan' | 'fact';

export type OperatingExpenseRejection = 'month' | 'amount';

function minus(left: number | null, right: number | null): number | null {
  if (left === null || right === null) {
    return null;
  }

  return left - right;
}

function varianceOf(
  fact: Pick<SummarySide, 'revenueWithVat' | 'revenueExVat' | 'contribution'>,
  plan: Pick<
    SummarySide,
    'revenueWithVat' | 'revenueExVat' | 'contribution'
  > | null,
): SummaryVariance {
  if (!plan) {
    return {
      revenueWithVat: null,
      revenueExVat: null,
      contribution: null,
    };
  }

  return {
    revenueWithVat: minus(fact.revenueWithVat, plan.revenueWithVat),
    revenueExVat: minus(fact.revenueExVat, plan.revenueExVat),
    contribution: minus(fact.contribution, plan.contribution),
  };
}

/** Последний месяц горизонта плана: текущий и 23 следующих. */
export function lastHorizonMonth(today: Date): string {
  return shiftMonth(monthKeyFromDate(today), PLAN_HORIZON_MONTHS - 1);
}

/** Сводка: с 2000-01 до горизонта плана. Будущий месяц открыт. */
export function summaryMonthOpen(month: string, today: Date): boolean {
  return (
    isMonthKey(month) && month >= '2000-01' && month <= lastHorizonMonth(today)
  );
}

export function summaryGridProducts(
  document: PrototypeDocument,
  plan: SalesPlan | null,
  fact: SalesFact | null,
  month: string,
): Product[] {
  const referenced = new Set(plan?.lines.map((line) => line.productId) ?? []);
  const fromFact = salesFactGridProducts(document, fact, month);
  const seen = new Set(fromFact.map((item) => item.id));

  const extra = document.products.filter(
    (item) => referenced.has(item.id) && !seen.has(item.id),
  );

  return [...fromFact, ...extra];
}

function summaryCategories(
  document: PrototypeDocument,
  products: readonly Product[],
): ProductCategory[] {
  return visibleCategories(document, products);
}

function planSide(
  document: PrototypeDocument,
  plan: SalesPlan,
  product: Product,
): {
  lineId: string;
  priceWithVat: number;
  volumePieces: number;
  side: SummarySide;
} | null {
  const line = plan.lines.find((item) => item.productId === product.id);
  if (!line) {
    return null;
  }

  const metrics = salesPlanLineMetrics(document, plan, line);
  const costMissing = line.volumePieces > 0 && metrics.volumeCostExVat === null;
  const revenueMissing =
    metrics.revenueWithVat === null || metrics.revenueExVat === null;

  return {
    lineId: line.id,
    priceWithVat: line.priceWithVat,
    volumePieces: line.volumePieces,
    side: {
      volumePieces: line.volumePieces,
      perDay: metrics.perDay,
      priceWithVat: line.priceWithVat,
      priceExVatTenThousandths: metrics.priceExVatTenThousandths,
      priceExVat: null,
      unitCost: metrics.unitCost,
      averageCostWithVat: metrics.unitCost?.withVat ?? null,
      averageCostExVat: metrics.unitCost?.exVat ?? null,
      volumeCostWithVat: metrics.volumeCostWithVat,
      volumeCostExVat: metrics.volumeCostExVat,
      revenueWithVat: metrics.revenueWithVat,
      revenueExVat: metrics.revenueExVat,
      contribution: metrics.contribution,
      profitabilityHundredths: metrics.profitabilityHundredths,
      vatPercent: product.vatPercent,
      vatPercentHundredths: null,
      costComplete: !costMissing,
      revenueComplete: !revenueMissing,
    },
  };
}

function factFromRows(
  document: PrototypeDocument,
  product: Product,
  rows: readonly SalesFactRow[],
  days: number,
): SummarySide {
  let volume = ZERO;
  let revenueWith = ZERO;
  let revenueEx = ZERO;
  let costWith = ZERO;
  let costEx = ZERO;
  let contributionSum = ZERO;
  let costComplete = true;
  let revenueComplete = true;
  const cost = unitCost(document, product.id);

  for (const row of rows) {
    volume += BigInt(row.salesPieces);

    if (row.revenueWithVat === null || row.revenueExVat === null) {
      if (row.salesPieces > 0) {
        revenueComplete = false;
      }
    } else {
      revenueWith += BigInt(row.revenueWithVat);
      revenueEx += BigInt(row.revenueExVat);
    }

    if (
      row.salesPieces > 0 &&
      (row.salesVolumeCostWithVat === null ||
        row.salesVolumeCostExVat === null ||
        row.contribution === null)
    ) {
      costComplete = false;
    } else if (
      row.salesVolumeCostWithVat !== null &&
      row.salesVolumeCostExVat !== null &&
      row.contribution !== null
    ) {
      costWith += BigInt(row.salesVolumeCostWithVat);
      costEx += BigInt(row.salesVolumeCostExVat);
      contributionSum += BigInt(row.contribution);
    }
  }

  const volumePieces = toSafeNumber(volume) ?? 0;
  const revenueWithVat = revenueComplete ? toSafeNumber(revenueWith) : null;
  const revenueExVat = revenueComplete ? toSafeNumber(revenueEx) : null;
  const volumeCostWithVat = costComplete ? toSafeNumber(costWith) : null;
  const volumeCostExVat = costComplete ? toSafeNumber(costEx) : null;
  const contribution =
    costComplete && revenueComplete ? toSafeNumber(contributionSum) : null;
  const priceWithVat = averageAmount(revenueWithVat, volumePieces);
  const priceExVat = averageAmount(revenueExVat, volumePieces);
  const volumeAndEmptyCost =
    volumePieces > 0 && (cost === null || !costComplete);

  return {
    volumePieces,
    perDay: days > 0 ? volumePieces / days : 0,
    priceWithVat,
    priceExVatTenThousandths: null,
    priceExVat,
    unitCost: volumeAndEmptyCost ? null : cost,
    averageCostWithVat: volumeAndEmptyCost ? null : (cost?.withVat ?? null),
    averageCostExVat: volumeAndEmptyCost ? null : (cost?.exVat ?? null),
    volumeCostWithVat: volumeAndEmptyCost ? null : volumeCostWithVat,
    volumeCostExVat: volumeAndEmptyCost ? null : volumeCostExVat,
    revenueWithVat,
    revenueExVat,
    contribution: volumeAndEmptyCost ? null : contribution,
    profitabilityHundredths: volumeAndEmptyCost
      ? null
      : percentHundredths(contribution, volumeCostExVat),
    vatPercent: product.vatPercent,
    vatPercentHundredths: null,
    costComplete: !volumeAndEmptyCost,
    revenueComplete,
  };
}

function emptyFactSide(
  document: PrototypeDocument,
  product: Product,
  days: number,
): SummarySide {
  return factFromRows(document, product, [], days);
}

function totalsFromSides(
  sides: readonly SummarySide[],
  days: number,
): SummarySide {
  let volume = ZERO;
  let revenueWith = ZERO;
  let revenueEx = ZERO;
  let costWith = ZERO;
  let costEx = ZERO;
  let contributionSum = ZERO;
  let costComplete = true;
  let revenueComplete = true;

  for (const fact of sides) {
    volume += BigInt(fact.volumePieces ?? 0);

    if (fact.revenueWithVat === null || fact.revenueExVat === null) {
      if ((fact.volumePieces ?? 0) > 0) {
        revenueComplete = false;
      }
    } else {
      revenueWith += BigInt(fact.revenueWithVat);
      revenueEx += BigInt(fact.revenueExVat);
    }

    if ((fact.volumePieces ?? 0) > 0 && !fact.costComplete) {
      costComplete = false;
    } else if (
      fact.volumeCostWithVat !== null &&
      fact.volumeCostExVat !== null &&
      fact.contribution !== null
    ) {
      costWith += BigInt(fact.volumeCostWithVat);
      costEx += BigInt(fact.volumeCostExVat);
      contributionSum += BigInt(fact.contribution);
    }
  }

  const volumePieces = toSafeNumber(volume);
  const revenueWithVat = revenueComplete ? toSafeNumber(revenueWith) : null;
  const revenueExVat = revenueComplete ? toSafeNumber(revenueEx) : null;
  const volumeCostWithVat = costComplete ? toSafeNumber(costWith) : null;
  const volumeCostExVat = costComplete ? toSafeNumber(costEx) : null;
  const contribution =
    costComplete && revenueComplete ? toSafeNumber(contributionSum) : null;
  const priceWithVat = averageAmount(revenueWithVat, volumePieces);
  const priceExVat = averageAmount(revenueExVat, volumePieces);

  return {
    volumePieces,
    perDay: volumePieces === null || days === 0 ? null : volumePieces / days,
    priceWithVat,
    priceExVatTenThousandths: null,
    priceExVat,
    unitCost: null,
    averageCostWithVat: averageAmount(volumeCostWithVat, volumePieces),
    averageCostExVat: averageAmount(volumeCostExVat, volumePieces),
    volumeCostWithVat: costComplete ? volumeCostWithVat : null,
    volumeCostExVat: costComplete ? volumeCostExVat : null,
    revenueWithVat,
    revenueExVat,
    contribution,
    profitabilityHundredths:
      costComplete && revenueComplete
        ? percentHundredths(contribution, volumeCostExVat)
        : null,
    vatPercent: null,
    vatPercentHundredths: vatPercentHundredths(revenueWithVat, revenueExVat),
    costComplete,
    revenueComplete,
  };
}

function factTotalsFromRows(
  rows: readonly SummaryRow[],
  days: number,
): SummarySide {
  return totalsFromSides(
    rows.map((row) => row.fact),
    days,
  );
}

function planTotalsFromRows(
  rows: readonly SummaryRow[],
  days: number,
): SummarySide | null {
  const sides = rows.flatMap((row) => (row.plan ? [row.plan] : []));
  if (sides.length === 0) {
    return rows.length === 0 ? totalsFromSides([], days) : null;
  }

  return totalsFromSides(sides, days);
}

function planTotalsAsSide(totals: SalesPlanTotals): SummarySide {
  return {
    volumePieces: totals.volumePieces,
    perDay: totals.perDay,
    priceWithVat: totals.averagePriceWithVat,
    priceExVatTenThousandths: null,
    priceExVat: totals.averagePriceExVat,
    unitCost: null,
    averageCostWithVat: totals.averageCostWithVat,
    averageCostExVat: totals.averageCostExVat,
    volumeCostWithVat: totals.volumeCostWithVat,
    volumeCostExVat: totals.volumeCostExVat,
    revenueWithVat: totals.revenueWithVat,
    revenueExVat: totals.revenueExVat,
    contribution: totals.contribution,
    profitabilityHundredths: totals.profitabilityHundredths,
    vatPercent: null,
    vatPercentHundredths: vatPercentHundredths(
      totals.revenueWithVat,
      totals.revenueExVat,
    ),
    costComplete: totals.costComplete,
    revenueComplete: totals.revenueComplete,
  };
}

/** Операционные расходы месяца. Нет записи — ноль. */
export function monthOperatingExpenseAmounts(
  document: PrototypeDocument,
  month: string,
): { planExVat: number; factExVat: number } {
  const row = document.operatingExpenses.find((item) => item.month === month);
  return {
    planExVat: row?.planExVat ?? 0,
    factExVat: row?.factExVat ?? 0,
  };
}

function headlineSide(
  totals: SummarySide | null,
  operatingExpenseExVat: number,
): SummaryHeadlineSide {
  const revenueWithVat = totals?.revenueWithVat ?? null;
  const revenueExVat = totals?.revenueExVat ?? null;
  const contribution = totals?.contribution ?? null;
  const profit =
    contribution === null ? null : contribution - operatingExpenseExVat;
  const profitTax =
    profit === null
      ? null
      : ratioRound(BigInt(profit) * BigInt(PROFIT_TAX_PERCENT), HUNDRED);
  const netProfit =
    profit === null || profitTax === null ? null : profit - profitTax;
  const netProfitabilityHundredths = percentHundredths(netProfit, revenueExVat);

  return {
    revenueWithVat,
    contribution,
    operatingExpenseExVat,
    profit,
    profitTax,
    netProfit,
    netProfitabilityHundredths,
  };
}

/**
 * Верхний блок свода `Svod!D2:L8`.
 * Выручка и Т-проток — суммы по товарам, без вычета Factoring.
 * Операционные расходы — ввод на сводке, без листа Operation Expense.
 */
export function summaryHeadline(
  planTotals: SummarySide | null,
  factTotals: SummarySide,
  operatingExpensePlanExVat: number,
  operatingExpenseFactExVat: number,
): SummaryHeadline {
  const plan = headlineSide(planTotals, operatingExpensePlanExVat);
  const fact = headlineSide(factTotals, operatingExpenseFactExVat);

  return {
    plan,
    fact,
    variance: {
      revenueWithVat: minus(fact.revenueWithVat, plan.revenueWithVat),
      contribution: minus(fact.contribution, plan.contribution),
      operatingExpenseExVat:
        fact.operatingExpenseExVat - plan.operatingExpenseExVat,
      profit: minus(fact.profit, plan.profit),
      profitTax: minus(fact.profitTax, plan.profitTax),
      netProfit: minus(fact.netProfit, plan.netProfit),
      netProfitabilityHundredths: minus(
        fact.netProfitabilityHundredths,
        plan.netProfitabilityHundredths,
      ),
    },
    taxPercent: PROFIT_TAX_PERCENT,
  };
}

export function setOperatingExpenseRejection(
  document: PrototypeDocument,
  month: string,
  side: OperatingExpenseSide,
  amountExVat: number,
): OperatingExpenseRejection | null {
  void document;
  void side;

  if (!isMonthKey(month) || month < '2000-01' || month > '2100-12') {
    return 'month';
  }

  if (
    !Number.isInteger(amountExVat) ||
    amountExVat < 0 ||
    amountExVat > MAX_OPERATING_EXPENSE
  ) {
    return 'amount';
  }

  return null;
}

/**
 * Пишет план или факт операционных расходов месяца.
 * Обе суммы ноль — запись из документа убирается.
 */
export function setOperatingExpense(
  document: PrototypeDocument,
  month: string,
  side: OperatingExpenseSide,
  amountExVat: number,
): PrototypeDocument {
  if (setOperatingExpenseRejection(document, month, side, amountExVat)) {
    return document;
  }

  const current = monthOperatingExpenseAmounts(document, month);
  const nextPlan = side === 'plan' ? amountExVat : current.planExVat;
  const nextFact = side === 'fact' ? amountExVat : current.factExVat;
  const withoutMonth = document.operatingExpenses.filter(
    (item) => item.month !== month,
  );

  if (nextPlan === 0 && nextFact === 0) {
    if (withoutMonth.length === document.operatingExpenses.length) {
      return document;
    }

    return { ...document, operatingExpenses: withoutMonth };
  }

  return {
    ...document,
    operatingExpenses: [
      ...withoutMonth,
      {
        month,
        planExVat: nextPlan,
        factExVat: nextFact,
      },
    ],
  };
}

/**
 * Строки и итог сводки месяца. План — рабочая запись или виртуальный нулевой.
 * Факт — сумма дней рабочего факта продаж; в документ ничего не пишется.
 */
export function monthSummary(
  document: PrototypeDocument,
  month: string,
  plan: SalesPlan | null = salesPlanForMonth(document, month),
  fact: SalesFact | null = workingSalesFact(document, month),
): SummaryView {
  const days = daysInMonth(month);
  const products = summaryGridProducts(document, plan, fact, month);
  const factDays = salesFactMonth(document, fact, month);
  const rowByProduct = new Map<string, SummaryRow>();

  for (const product of products) {
    const planned = plan ? planSide(document, plan, product) : null;
    const dayRows = factDays.flatMap((day) =>
      day.rows.filter((row) => row.productId === product.id),
    );
    const factSide =
      dayRows.length > 0
        ? factFromRows(document, product, dayRows, days)
        : emptyFactSide(document, product, days);
    const planMetrics = planned?.side ?? null;

    rowByProduct.set(product.id, {
      productId: product.id,
      name: product.name,
      deleted: product.deletedAt !== null,
      planLineId: planned?.lineId ?? null,
      planPriceWithVat: planned?.priceWithVat ?? null,
      planVolumePieces: planned?.volumePieces ?? null,
      plan: planMetrics,
      fact: factSide,
      variance: varianceOf(factSide, planMetrics),
    });
  }

  const groups: SummaryGroup[] = summaryCategories(document, products).map(
    (category) => {
      const rows = products
        .filter((item) => item.categoryId === category.id)
        .sort((left, right) => left.name.localeCompare(right.name, 'ru'))
        .flatMap((item) => {
          const row = rowByProduct.get(item.id);
          return row ? [row] : [];
        });
      const factSide = factTotalsFromRows(rows, days);
      const planMetrics = planTotalsFromRows(rows, days);

      return {
        categoryId: category.id,
        name: category.name,
        deleted: category.deletedAt !== null,
        rows,
        plan: planMetrics,
        fact: factSide,
        variance: varianceOf(factSide, planMetrics),
      };
    },
  );
  const rows = groups.flatMap((group) => group.rows);

  const planTotals = plan ? salesPlanTotals(document, plan) : null;
  const planTotalsSide = planTotals ? planTotalsAsSide(planTotals) : null;
  const factTotals = factTotalsFromRows(rows, days);
  const opex = monthOperatingExpenseAmounts(document, month);

  return {
    month,
    days,
    plan,
    groups,
    rows,
    planTotals,
    planTotalsSide,
    factTotals,
    variance: varianceOf(factTotals, planTotalsSide),
    headline: summaryHeadline(
      planTotalsSide,
      factTotals,
      opex.planExVat,
      opex.factExVat,
    ),
  };
}
