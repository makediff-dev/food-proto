import { ratioKopecks, unitCost, type UnitCost } from "@/domain/cost";
import {
  isMonthKey,
  MAX_OPERATING_EXPENSE_KOPECKS,
  PROFIT_TAX_PERCENT,
  type Derivative,
  type PrototypeDocument,
  type SalesFact,
  type SalesPlan,
} from "@/domain/document";
import {
  salesFactGridProducts,
  salesFactMonth,
  workingSalesFact,
  type SalesFactRow,
} from "@/domain/sales-fact";
import {
  daysInMonth,
  monthKeyFromDate,
  PLAN_HORIZON_MONTHS,
  profitabilityHundredths,
  salesPlanForMonth,
  salesPlanLineMetrics,
  salesPlanTotals,
  shiftMonth,
  type SalesPlanTotals,
} from "@/domain/sales-plan";

const TEN_THOUSAND = BigInt(10_000);
const HUNDRED = BigInt(100);
const TWO = BigInt(2);
const ZERO = BigInt(0);

export interface SummarySide {
  volumePieces: number | null;
  perDay: number | null;
  priceWithVatKopecks: number | null;
  /** Десятитысячные доли рубля. Только у строки плана с введённой ценой. */
  priceExVatTenThousandths: number | null;
  priceExVatKopecks: number | null;
  unitCost: UnitCost | null;
  averageCostWithVatKopecks: number | null;
  averageCostExVatKopecks: number | null;
  volumeCostWithVatKopecks: number | null;
  volumeCostExVatKopecks: number | null;
  revenueWithVatKopecks: number | null;
  revenueExVatKopecks: number | null;
  contributionKopecks: number | null;
  profitabilityHundredths: number | null;
  vatPercent: number | null;
  vatPercentHundredths: number | null;
  costComplete: boolean;
  revenueComplete: boolean;
}

export interface SummaryVariance {
  revenueWithVatKopecks: number | null;
  revenueExVatKopecks: number | null;
  contributionKopecks: number | null;
}

export interface SummaryRow {
  productId: string;
  name: string;
  deleted: boolean;
  planLineId: string | null;
  planPriceWithVatKopecks: number | null;
  planVolumePieces: number | null;
  plan: SummarySide | null;
  fact: SummarySide;
  variance: SummaryVariance;
}

export interface SummaryView {
  month: string;
  days: number;
  plan: SalesPlan | null;
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
  revenueWithVatKopecks: number | null;
  /** `Svod!G3` / `I3` без Factoring: сумма Т-протока. */
  contributionKopecks: number | null;
  /** `Svod!G4` / `I4`: операционные расходы без НДС. */
  operatingExpenseExVatKopecks: number;
  /** `Svod!G5` / `I5` = Т-проток − операционные расходы. */
  profitKopecks: number | null;
  /** `Svod!G6` / `I6` = прибыль × `Svod!C6` / 100. */
  profitTaxKopecks: number | null;
  /** `Svod!G7` / `I7` = прибыль − налог. */
  netProfitKopecks: number | null;
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
    revenueWithVatKopecks: number | null;
    contributionKopecks: number | null;
    operatingExpenseExVatKopecks: number;
    profitKopecks: number | null;
    profitTaxKopecks: number | null;
    netProfitKopecks: number | null;
    netProfitabilityHundredths: number | null;
  };
  taxPercent: number;
}

export type OperatingExpenseSide = "plan" | "fact";

export type OperatingExpenseRejection = "month" | "amount";

function toSafeNumber(value: bigint): number | null {
  if (
    value > BigInt(Number.MAX_SAFE_INTEGER) ||
    value < BigInt(Number.MIN_SAFE_INTEGER)
  ) {
    return null;
  }

  return Number(value);
}

function roundHalfAwayFromZero(numerator: bigint, denominator: bigint): number | null {
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

function averageKopecks(amount: number | null, volume: number | null): number | null {
  if (amount === null || volume === null || volume <= 0) {
    return null;
  }

  return ratioKopecks(BigInt(amount), BigInt(volume));
}

function totalVatHundredths(
  revenueWithVatKopecks: number | null,
  revenueExVatKopecks: number | null,
): number | null {
  if (revenueWithVatKopecks === null || revenueExVatKopecks === null) {
    return null;
  }
  if (revenueExVatKopecks === 0) {
    return 0;
  }

  return roundHalfAwayFromZero(
    (BigInt(revenueWithVatKopecks) - BigInt(revenueExVatKopecks)) * TEN_THOUSAND,
    BigInt(revenueExVatKopecks),
  );
}

function totalProfitabilityHundredths(
  contributionKopecks: number | null,
  volumeCostExVatKopecks: number | null,
): number | null {
  if (contributionKopecks === null || volumeCostExVatKopecks === null) {
    return null;
  }
  if (volumeCostExVatKopecks === 0) {
    return 0;
  }

  return roundHalfAwayFromZero(
    BigInt(contributionKopecks) * TEN_THOUSAND,
    BigInt(volumeCostExVatKopecks),
  );
}

function minus(left: number | null, right: number | null): number | null {
  if (left === null || right === null) {
    return null;
  }

  return left - right;
}

function varianceOf(
  fact: Pick<
    SummarySide,
    "revenueWithVatKopecks" | "revenueExVatKopecks" | "contributionKopecks"
  >,
  plan: Pick<
    SummarySide,
    "revenueWithVatKopecks" | "revenueExVatKopecks" | "contributionKopecks"
  > | null,
): SummaryVariance {
  if (!plan) {
    return {
      revenueWithVatKopecks: null,
      revenueExVatKopecks: null,
      contributionKopecks: null,
    };
  }

  return {
    revenueWithVatKopecks: minus(fact.revenueWithVatKopecks, plan.revenueWithVatKopecks),
    revenueExVatKopecks: minus(fact.revenueExVatKopecks, plan.revenueExVatKopecks),
    contributionKopecks: minus(fact.contributionKopecks, plan.contributionKopecks),
  };
}

/** Последний месяц горизонта плана: текущий и 23 следующих. */
export function lastHorizonMonth(today: Date): string {
  return shiftMonth(monthKeyFromDate(today), PLAN_HORIZON_MONTHS - 1);
}

/** Сводка: с 2000-01 до горизонта плана. Будущий месяц открыт. */
export function summaryMonthOpen(month: string, today: Date): boolean {
  return isMonthKey(month) && month >= "2000-01" && month <= lastHorizonMonth(today);
}

export function summaryGridProducts(
  document: PrototypeDocument,
  plan: SalesPlan | null,
  fact: SalesFact | null,
): Derivative[] {
  const referenced = new Set(plan?.lines.map((line) => line.productId) ?? []);
  const fromFact = salesFactGridProducts(document, fact);
  const seen = new Set(fromFact.map((item) => item.id));

  const extra = document.derivatives.filter(
    (item) => item.isFinalProduct && referenced.has(item.id) && !seen.has(item.id),
  );

  return [...fromFact, ...extra].sort((left, right) =>
    left.name.localeCompare(right.name, "ru"),
  );
}

function planSide(
  document: PrototypeDocument,
  plan: SalesPlan,
  product: Derivative,
): {
  lineId: string;
  priceWithVatKopecks: number;
  volumePieces: number;
  side: SummarySide;
} | null {
  const line = plan.lines.find((item) => item.productId === product.id);
  if (!line) {
    return null;
  }

  const metrics = salesPlanLineMetrics(document, plan, line);
  const costMissing = line.volumePieces > 0 && metrics.volumeCostExVatKopecks === null;
  const revenueMissing =
    metrics.revenueWithVatKopecks === null || metrics.revenueExVatKopecks === null;

  return {
    lineId: line.id,
    priceWithVatKopecks: line.priceWithVatKopecks,
    volumePieces: line.volumePieces,
    side: {
      volumePieces: line.volumePieces,
      perDay: metrics.perDay,
      priceWithVatKopecks: line.priceWithVatKopecks,
      priceExVatTenThousandths: metrics.priceExVatTenThousandths,
      priceExVatKopecks: null,
      unitCost: metrics.unitCost,
      averageCostWithVatKopecks: metrics.unitCost?.withVatKopecks ?? null,
      averageCostExVatKopecks: metrics.unitCost?.exVatKopecks ?? null,
      volumeCostWithVatKopecks: metrics.volumeCostWithVatKopecks,
      volumeCostExVatKopecks: metrics.volumeCostExVatKopecks,
      revenueWithVatKopecks: metrics.revenueWithVatKopecks,
      revenueExVatKopecks: metrics.revenueExVatKopecks,
      contributionKopecks: metrics.contributionKopecks,
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
  product: Derivative,
  rows: readonly SalesFactRow[],
  days: number,
): SummarySide {
  let volume = ZERO;
  let revenueWith = ZERO;
  let revenueEx = ZERO;
  let costWith = ZERO;
  let costEx = ZERO;
  let contribution = ZERO;
  let costComplete = true;
  let revenueComplete = true;
  const cost = unitCost(document, product.id);

  for (const row of rows) {
    volume += BigInt(row.inputs.salesPieces);

    if (row.revenueWithVatKopecks === null || row.revenueExVatKopecks === null) {
      if (row.inputs.salesPieces > 0) {
        revenueComplete = false;
      }
    } else {
      revenueWith += BigInt(row.revenueWithVatKopecks);
      revenueEx += BigInt(row.revenueExVatKopecks);
    }

    if (
      row.inputs.salesPieces > 0 &&
      (row.salesVolumeCostWithVatKopecks === null ||
        row.salesVolumeCostExVatKopecks === null ||
        row.contributionKopecks === null)
    ) {
      costComplete = false;
    } else if (
      row.salesVolumeCostWithVatKopecks !== null &&
      row.salesVolumeCostExVatKopecks !== null &&
      row.contributionKopecks !== null
    ) {
      costWith += BigInt(row.salesVolumeCostWithVatKopecks);
      costEx += BigInt(row.salesVolumeCostExVatKopecks);
      contribution += BigInt(row.contributionKopecks);
    }
  }

  const volumePieces = toSafeNumber(volume) ?? 0;
  const revenueWithVatKopecks = revenueComplete ? toSafeNumber(revenueWith) : null;
  const revenueExVatKopecks = revenueComplete ? toSafeNumber(revenueEx) : null;
  const volumeCostWithVatKopecks = costComplete ? toSafeNumber(costWith) : null;
  const volumeCostExVatKopecks = costComplete ? toSafeNumber(costEx) : null;
  const contributionKopecks =
    costComplete && revenueComplete ? toSafeNumber(contribution) : null;
  const priceWithVatKopecks = averageKopecks(revenueWithVatKopecks, volumePieces);
  const priceExVatKopecks = averageKopecks(revenueExVatKopecks, volumePieces);
  const volumeAndEmptyCost = volumePieces > 0 && (cost === null || !costComplete);

  return {
    volumePieces,
    perDay: days > 0 ? volumePieces / days : 0,
    priceWithVatKopecks,
    priceExVatTenThousandths: null,
    priceExVatKopecks,
    unitCost: volumeAndEmptyCost ? null : cost,
    averageCostWithVatKopecks: volumeAndEmptyCost ? null : (cost?.withVatKopecks ?? null),
    averageCostExVatKopecks: volumeAndEmptyCost ? null : (cost?.exVatKopecks ?? null),
    volumeCostWithVatKopecks: volumeAndEmptyCost ? null : volumeCostWithVatKopecks,
    volumeCostExVatKopecks: volumeAndEmptyCost ? null : volumeCostExVatKopecks,
    revenueWithVatKopecks,
    revenueExVatKopecks,
    contributionKopecks: volumeAndEmptyCost ? null : contributionKopecks,
    profitabilityHundredths: volumeAndEmptyCost
      ? null
      : priceWithVatKopecks === null || cost === null || product.vatPercent === null
        ? null
        : profitabilityHundredths(
            priceWithVatKopecks,
            product.vatPercent,
            cost.exVatKopecks,
          ),
    vatPercent: product.vatPercent,
    vatPercentHundredths: null,
    costComplete: !volumeAndEmptyCost,
    revenueComplete,
  };
}

function emptyFactSide(
  document: PrototypeDocument,
  product: Derivative,
  days: number,
): SummarySide {
  return factFromRows(document, product, [], days);
}

function factTotalsFromRows(rows: readonly SummaryRow[], days: number): SummarySide {
  let volume = ZERO;
  let revenueWith = ZERO;
  let revenueEx = ZERO;
  let costWith = ZERO;
  let costEx = ZERO;
  let contribution = ZERO;
  let costComplete = true;
  let revenueComplete = true;

  for (const row of rows) {
    const fact = row.fact;
    volume += BigInt(fact.volumePieces ?? 0);

    if (fact.revenueWithVatKopecks === null || fact.revenueExVatKopecks === null) {
      if ((fact.volumePieces ?? 0) > 0) {
        revenueComplete = false;
      }
    } else {
      revenueWith += BigInt(fact.revenueWithVatKopecks);
      revenueEx += BigInt(fact.revenueExVatKopecks);
    }

    if ((fact.volumePieces ?? 0) > 0 && !fact.costComplete) {
      costComplete = false;
    } else if (
      fact.volumeCostWithVatKopecks !== null &&
      fact.volumeCostExVatKopecks !== null &&
      fact.contributionKopecks !== null
    ) {
      costWith += BigInt(fact.volumeCostWithVatKopecks);
      costEx += BigInt(fact.volumeCostExVatKopecks);
      contribution += BigInt(fact.contributionKopecks);
    }
  }

  const volumePieces = toSafeNumber(volume);
  const revenueWithVatKopecks = revenueComplete ? toSafeNumber(revenueWith) : null;
  const revenueExVatKopecks = revenueComplete ? toSafeNumber(revenueEx) : null;
  const volumeCostWithVatKopecks = costComplete ? toSafeNumber(costWith) : null;
  const volumeCostExVatKopecks = costComplete ? toSafeNumber(costEx) : null;
  const contributionKopecks =
    costComplete && revenueComplete ? toSafeNumber(contribution) : null;
  const priceWithVatKopecks = averageKopecks(revenueWithVatKopecks, volumePieces);
  const priceExVatKopecks = averageKopecks(revenueExVatKopecks, volumePieces);

  return {
    volumePieces,
    perDay: volumePieces === null || days === 0 ? null : volumePieces / days,
    priceWithVatKopecks,
    priceExVatTenThousandths: null,
    priceExVatKopecks,
    unitCost: null,
    averageCostWithVatKopecks: averageKopecks(volumeCostWithVatKopecks, volumePieces),
    averageCostExVatKopecks: averageKopecks(volumeCostExVatKopecks, volumePieces),
    volumeCostWithVatKopecks: costComplete ? volumeCostWithVatKopecks : null,
    volumeCostExVatKopecks: costComplete ? volumeCostExVatKopecks : null,
    revenueWithVatKopecks,
    revenueExVatKopecks,
    contributionKopecks,
    profitabilityHundredths:
      costComplete && revenueComplete
        ? totalProfitabilityHundredths(contributionKopecks, volumeCostExVatKopecks)
        : null,
    vatPercent: null,
    vatPercentHundredths: totalVatHundredths(revenueWithVatKopecks, revenueExVatKopecks),
    costComplete,
    revenueComplete,
  };
}

function planTotalsAsSide(totals: SalesPlanTotals): SummarySide {
  return {
    volumePieces: totals.volumePieces,
    perDay: totals.perDay,
    priceWithVatKopecks: totals.averagePriceWithVatKopecks,
    priceExVatTenThousandths: null,
    priceExVatKopecks: totals.averagePriceExVatKopecks,
    unitCost: null,
    averageCostWithVatKopecks: totals.averageCostWithVatKopecks,
    averageCostExVatKopecks: totals.averageCostExVatKopecks,
    volumeCostWithVatKopecks: totals.volumeCostWithVatKopecks,
    volumeCostExVatKopecks: totals.volumeCostExVatKopecks,
    revenueWithVatKopecks: totals.revenueWithVatKopecks,
    revenueExVatKopecks: totals.revenueExVatKopecks,
    contributionKopecks: totals.contributionKopecks,
    profitabilityHundredths: totals.profitabilityHundredths,
    vatPercent: null,
    vatPercentHundredths: totalVatHundredths(
      totals.revenueWithVatKopecks,
      totals.revenueExVatKopecks,
    ),
    costComplete: totals.costComplete,
    revenueComplete: totals.revenueComplete,
  };
}

/** Операционные расходы месяца. Нет записи — ноль. */
export function monthOperatingExpenseAmounts(
  document: PrototypeDocument,
  month: string,
): { planExVatKopecks: number; factExVatKopecks: number } {
  const row = document.operatingExpenses.find((item) => item.month === month);
  return {
    planExVatKopecks: row?.planExVatKopecks ?? 0,
    factExVatKopecks: row?.factExVatKopecks ?? 0,
  };
}

function headlineSide(
  totals: SummarySide | null,
  operatingExpenseExVatKopecks: number,
): SummaryHeadlineSide {
  const revenueWithVatKopecks = totals?.revenueWithVatKopecks ?? null;
  const revenueExVatKopecks = totals?.revenueExVatKopecks ?? null;
  const contributionKopecks = totals?.contributionKopecks ?? null;
  const profitKopecks =
    contributionKopecks === null
      ? null
      : contributionKopecks - operatingExpenseExVatKopecks;
  const profitTaxKopecks =
    profitKopecks === null
      ? null
      : roundHalfAwayFromZero(
          BigInt(profitKopecks) * BigInt(PROFIT_TAX_PERCENT),
          HUNDRED,
        );
  const netProfitKopecks =
    profitKopecks === null || profitTaxKopecks === null
      ? null
      : profitKopecks - profitTaxKopecks;
  const netProfitabilityHundredths =
    netProfitKopecks === null || revenueExVatKopecks === null
      ? null
      : revenueExVatKopecks === 0
        ? 0
        : roundHalfAwayFromZero(
            BigInt(netProfitKopecks) * TEN_THOUSAND,
            BigInt(revenueExVatKopecks),
          );

  return {
    revenueWithVatKopecks,
    contributionKopecks,
    operatingExpenseExVatKopecks,
    profitKopecks,
    profitTaxKopecks,
    netProfitKopecks,
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
  operatingExpensePlanExVatKopecks: number,
  operatingExpenseFactExVatKopecks: number,
): SummaryHeadline {
  const plan = headlineSide(planTotals, operatingExpensePlanExVatKopecks);
  const fact = headlineSide(factTotals, operatingExpenseFactExVatKopecks);

  return {
    plan,
    fact,
    variance: {
      revenueWithVatKopecks: minus(
        fact.revenueWithVatKopecks,
        plan.revenueWithVatKopecks,
      ),
      contributionKopecks: minus(fact.contributionKopecks, plan.contributionKopecks),
      operatingExpenseExVatKopecks:
        fact.operatingExpenseExVatKopecks - plan.operatingExpenseExVatKopecks,
      profitKopecks: minus(fact.profitKopecks, plan.profitKopecks),
      profitTaxKopecks: minus(fact.profitTaxKopecks, plan.profitTaxKopecks),
      netProfitKopecks: minus(fact.netProfitKopecks, plan.netProfitKopecks),
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
  amountExVatKopecks: number,
): OperatingExpenseRejection | null {
  void document;
  void side;

  if (!isMonthKey(month) || month < "2000-01" || month > "2100-12") {
    return "month";
  }

  if (
    !Number.isInteger(amountExVatKopecks) ||
    amountExVatKopecks < 0 ||
    amountExVatKopecks > MAX_OPERATING_EXPENSE_KOPECKS
  ) {
    return "amount";
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
  amountExVatKopecks: number,
): PrototypeDocument {
  if (setOperatingExpenseRejection(document, month, side, amountExVatKopecks)) {
    return document;
  }

  const current = monthOperatingExpenseAmounts(document, month);
  const nextPlan = side === "plan" ? amountExVatKopecks : current.planExVatKopecks;
  const nextFact = side === "fact" ? amountExVatKopecks : current.factExVatKopecks;
  const withoutMonth = document.operatingExpenses.filter((item) => item.month !== month);

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
        planExVatKopecks: nextPlan,
        factExVatKopecks: nextFact,
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
  const products = summaryGridProducts(document, plan, fact);
  const factDays = salesFactMonth(document, fact, month);
  const rows: SummaryRow[] = products.map((product) => {
    const planned = plan ? planSide(document, plan, product) : null;
    const dayRows = factDays.flatMap((day) =>
      day.rows.filter((row) => row.productId === product.id),
    );
    const factSide =
      dayRows.length > 0
        ? factFromRows(document, product, dayRows, days)
        : emptyFactSide(document, product, days);
    const planMetrics = planned?.side ?? null;

    return {
      productId: product.id,
      name: product.name,
      deleted: product.deletedAt !== null,
      planLineId: planned?.lineId ?? null,
      planPriceWithVatKopecks: planned?.priceWithVatKopecks ?? null,
      planVolumePieces: planned?.volumePieces ?? null,
      plan: planMetrics,
      fact: factSide,
      variance: varianceOf(factSide, planMetrics),
    };
  });

  const planTotals = plan ? salesPlanTotals(document, plan) : null;
  const planTotalsSide = planTotals ? planTotalsAsSide(planTotals) : null;
  const factTotals = factTotalsFromRows(rows, days);
  const opex = monthOperatingExpenseAmounts(document, month);

  return {
    month,
    days,
    plan,
    rows,
    planTotals,
    planTotalsSide,
    factTotals,
    variance: varianceOf(factTotals, planTotalsSide),
    headline: summaryHeadline(
      planTotalsSide,
      factTotals,
      opex.planExVatKopecks,
      opex.factExVatKopecks,
    ),
  };
}
