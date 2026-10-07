import { activeCategories } from '@/domain/categories';
import { type UnitCost, unitCost } from '@/domain/cost';
import {
  isMonthKey,
  MAX_OPERATING_EXPENSE,
  PROFIT_TAX_PERCENT,
  type Product,
  type ProductCategory,
  type PrototypeDocument,
  type SalesPlan,
} from '@/domain/document';
import {
  averageAmount,
  multiplyAmount,
  percentHundredths,
  ratioRound,
  toSafeNumber,
  vatPercentHundredths,
} from '@/domain/money';
import { activeProducts } from '@/domain/products';
import { type SalesFactRow, salesFactMonth } from '@/domain/sales-fact';
import {
  daysInMonth,
  monthKeyFromDate,
  PLAN_HORIZON_MONTHS,
  planMonthOpen,
  planPhase,
  revenueExVat,
  revenueWithVat,
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
  /** Первый месяц периода. Для одного месяца совпадает с `to`. */
  from: string;
  /** Последний месяц периода. */
  to: string;
  /** То же, что `from` — для одномесячных экранов и линзы. */
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

/** Текущая сводка урезает план; сводка за месяц растягивает факт. */
export type SummaryLens = 'current' | 'forecast';

type VolumeScale =
  | { kind: 'identity' }
  | { kind: 'zero' }
  | { kind: 'ratio'; numerator: number; denominator: number };

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

/** Сводка: с 2000-01 до горизонта плана. Прошедший и будущий открыты. */
export function summaryMonthOpen(month: string, today: Date): boolean {
  return planMonthOpen(month, today);
}

/** Меняет местами концы, если `from` позже `to`. */
export function normalizeMonthRange(
  from: string,
  to: string,
): { from: string; to: string } {
  return from <= to ? { from, to } : { from: to, to: from };
}

/** Ключи месяцев от `from` до `to` включительно. Концы нормализуются. */
export function monthsInRange(from: string, to: string): string[] {
  const range = normalizeMonthRange(from, to);
  const months: string[] = [];
  let cursor = range.from;
  while (cursor <= range.to) {
    months.push(cursor);
    cursor = shiftMonth(cursor, 1);
  }
  return months;
}

/** Один месяц в периоде — линза и правка оперрасходов доступны. */
export function isSingleMonthSummary(view: SummaryView): boolean {
  return view.from === view.to;
}

/** Рабочие товары. Удалённые в сетку и в суммы сводки не входят. */
export function summaryGridProducts(document: PrototypeDocument): Product[] {
  return activeProducts(document);
}

function summaryCategories(document: PrototypeDocument): ProductCategory[] {
  return activeCategories(document);
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
 * Факт — сумма дней журнала продаж; в документ ничего не пишется.
 */
export function monthSummary(
  document: PrototypeDocument,
  month: string,
  plan: SalesPlan | null = salesPlanForMonth(document, month),
): SummaryView {
  const days = daysInMonth(month);
  const products = summaryGridProducts(document);
  const factDays = salesFactMonth(document, month);
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

  const groups: SummaryGroup[] = summaryCategories(document).map((category) => {
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
  });
  const rows = groups.flatMap((group) => group.rows);

  const planTotals = plan ? salesPlanTotals(document, plan) : null;
  const planTotalsSide = planTotals ? planTotalsAsSide(planTotals) : null;
  const factTotals = factTotalsFromRows(rows, days);
  const opex = monthOperatingExpenseAmounts(document, month);

  return {
    from: month,
    to: month,
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

/**
 * Сводка за интервал месяцев: сумма полных месяцев без линзы.
 * Один месяц — то же, что `monthSummary`.
 */
export function rangeSummary(
  document: PrototypeDocument,
  from: string,
  to: string,
): SummaryView {
  const range = normalizeMonthRange(from, to);
  if (range.from === range.to) {
    return monthSummary(document, range.from);
  }

  const months = monthsInRange(range.from, range.to);
  const views = months.map((month) => monthSummary(document, month));
  const days = views.reduce((sum, view) => sum + view.days, 0);
  const first = views[0];
  if (!first) {
    return monthSummary(document, range.from);
  }

  const groups: SummaryGroup[] = first.groups.map((group) => {
    const monthGroups = views.flatMap((view) => {
      const match = view.groups.find(
        (item) => item.categoryId === group.categoryId,
      );
      return match ? [match] : [];
    });
    const rows = group.rows.map((row) => {
      const monthRows = monthGroups.flatMap((monthGroup) => {
        const monthRow = monthGroup.rows.find(
          (item) => item.productId === row.productId,
        );
        return monthRow ? [monthRow] : [];
      });
      return mergeSummaryRows(monthRows, days);
    });
    const fact = factTotalsFromRows(rows, days);
    const planMetrics = planTotalsFromRows(rows, days);

    return {
      categoryId: group.categoryId,
      name: group.name,
      deleted: group.deleted,
      rows,
      plan: planMetrics,
      fact,
      variance: varianceOf(fact, planMetrics),
    };
  });
  const rows = groups.flatMap((group) => group.rows);
  const planTotalsSide = planTotalsFromRows(rows, days);
  const factTotals = factTotalsFromRows(rows, days);
  let planOpex = 0;
  let factOpex = 0;
  for (const view of views) {
    planOpex += view.headline.plan.operatingExpenseExVat;
    factOpex += view.headline.fact.operatingExpenseExVat;
  }

  return {
    from: range.from,
    to: range.to,
    month: range.from,
    days,
    plan: null,
    groups,
    rows,
    planTotals: null,
    planTotalsSide,
    factTotals,
    variance: varianceOf(factTotals, planTotalsSide),
    headline: summaryHeadline(planTotalsSide, factTotals, planOpex, factOpex),
  };
}

function mergeSummaryRows(
  rows: readonly SummaryRow[],
  days: number,
): SummaryRow {
  const sample = rows[0];
  if (!sample) {
    throw new Error('mergeSummaryRows: пустой список строк');
  }
  if (rows.length === 1) {
    return sample;
  }

  const planSides = rows.flatMap((row) => (row.plan ? [row.plan] : []));
  const factSides = rows.map((row) => row.fact);
  const plan =
    planSides.length === 0 ? null : mergeProductSides(planSides, days);
  const fact = mergeProductSides(factSides, days);

  return {
    productId: sample.productId,
    name: sample.name,
    deleted: sample.deleted,
    planLineId: null,
    planPriceWithVat: plan?.priceWithVat ?? null,
    planVolumePieces: plan?.volumePieces ?? null,
    plan,
    fact,
    variance: varianceOf(fact, plan),
  };
}

/** Сумма сторон товара: аддитивные поля складываются, цена — из сумм. */
function mergeProductSides(
  sides: readonly SummarySide[],
  days: number,
): SummarySide {
  const merged = totalsFromSides(sides, days);
  const sample = sides[0];
  if (!sample) {
    return merged;
  }

  const unitCostValue = sides.every(
    (side) =>
      side.unitCost !== null &&
      sample.unitCost !== null &&
      side.unitCost.withVat === sample.unitCost.withVat &&
      side.unitCost.exVat === sample.unitCost.exVat,
  )
    ? sample.unitCost
    : null;

  return {
    ...merged,
    unitCost: unitCostValue,
    averageCostWithVat:
      unitCostValue !== null
        ? unitCostValue.withVat
        : merged.averageCostWithVat,
    averageCostExVat:
      unitCostValue !== null ? unitCostValue.exVat : merged.averageCostExVat,
    vatPercent: sample.vatPercent,
    vatPercentHundredths: null,
    priceExVatTenThousandths: null,
  };
}

/** Прошедшие дни месяца к сегодня. Будущий месяц — 0. */
export function elapsedDaysInMonth(month: string, today: Date): number {
  const phase = planPhase(month, today);
  if (phase === 'past') {
    return daysInMonth(month);
  }
  if (phase === 'future') {
    return 0;
  }

  return today.getDate();
}

function planVolumeScale(
  month: string,
  today: Date,
  lens: SummaryLens,
): VolumeScale {
  const days = daysInMonth(month);
  const elapsed = elapsedDaysInMonth(month, today);
  if (lens !== 'current') {
    return { kind: 'identity' };
  }
  if (elapsed === 0) {
    return { kind: 'zero' };
  }
  if (elapsed === days) {
    return { kind: 'identity' };
  }

  return { kind: 'ratio', numerator: elapsed, denominator: days };
}

function factVolumeScale(
  month: string,
  today: Date,
  lens: SummaryLens,
): VolumeScale {
  const days = daysInMonth(month);
  const elapsed = elapsedDaysInMonth(month, today);
  if (lens !== 'forecast') {
    return { kind: 'identity' };
  }
  if (elapsed === 0) {
    return { kind: 'zero' };
  }
  if (elapsed === days) {
    return { kind: 'identity' };
  }

  return { kind: 'ratio', numerator: days, denominator: elapsed };
}

function scaleInteger(
  value: number,
  numerator: number,
  denominator: number,
): number | null {
  return ratioRound(BigInt(value) * BigInt(numerator), BigInt(denominator));
}

function scaleAmount(value: number | null, scale: VolumeScale): number | null {
  if (value === null) {
    return null;
  }
  if (scale.kind === 'identity') {
    return value;
  }
  if (scale.kind === 'zero') {
    return 0;
  }

  return scaleInteger(value, scale.numerator, scale.denominator);
}

function planSideAtVolume(
  side: SummarySide,
  volumePieces: number,
  perDayDays: number,
): SummarySide {
  const vat = side.vatPercent;
  const price = side.priceWithVat;
  const revenueWith =
    price === null ? null : revenueWithVat(price, volumePieces);
  const revenueEx =
    vat === null
      ? volumePieces === 0
        ? 0
        : null
      : price === null
        ? null
        : revenueExVat(price, vat, volumePieces);
  const cost = side.unitCost;
  const volumeCostWith =
    cost === null ? null : multiplyAmount(cost.withVat, volumePieces);
  const volumeCostEx =
    cost === null ? null : multiplyAmount(cost.exVat, volumePieces);
  const contribution =
    revenueEx === null || volumeCostEx === null
      ? null
      : revenueEx - volumeCostEx;
  const costMissing = volumePieces > 0 && volumeCostEx === null;
  const revenueMissing = revenueWith === null || revenueEx === null;

  return {
    ...side,
    volumePieces,
    perDay: perDayDays > 0 ? volumePieces / perDayDays : 0,
    volumeCostWithVat: volumeCostWith,
    volumeCostExVat: volumeCostEx,
    revenueWithVat: revenueWith,
    revenueExVat: revenueEx,
    contribution,
    costComplete: !costMissing,
    revenueComplete: !revenueMissing,
  };
}

function applyPlanScale(
  side: SummarySide | null,
  scale: VolumeScale,
  perDayDays: number,
): SummarySide | null {
  if (!side) {
    return null;
  }
  if (scale.kind === 'identity') {
    return side;
  }
  if (scale.kind === 'zero') {
    return planSideAtVolume(side, 0, perDayDays);
  }

  const volume = scaleInteger(
    side.volumePieces ?? 0,
    scale.numerator,
    scale.denominator,
  );
  if (volume === null) {
    return {
      ...side,
      volumePieces: null,
      perDay: null,
      volumeCostWithVat: null,
      volumeCostExVat: null,
      revenueWithVat: null,
      revenueExVat: null,
      contribution: null,
      costComplete: false,
      revenueComplete: false,
    };
  }

  return planSideAtVolume(side, volume, perDayDays);
}

function applyFactScale(
  side: SummarySide,
  scale: VolumeScale,
  monthDays: number,
): SummarySide {
  if (scale.kind === 'identity') {
    return side;
  }

  const volumePieces = scaleAmount(side.volumePieces, scale);
  const nextRevenueWithVat = scaleAmount(side.revenueWithVat, scale);
  const nextRevenueExVat = scaleAmount(side.revenueExVat, scale);
  const volumeCostWithVat = scaleAmount(side.volumeCostWithVat, scale);
  const volumeCostExVat = scaleAmount(side.volumeCostExVat, scale);
  const contribution = scaleAmount(side.contribution, scale);
  const volumeAndEmptyCost =
    (volumePieces ?? 0) > 0 && (side.unitCost === null || !side.costComplete);

  return {
    ...side,
    volumePieces,
    perDay:
      volumePieces === null || monthDays === 0
        ? null
        : volumePieces / monthDays,
    priceWithVat: averageAmount(nextRevenueWithVat, volumePieces),
    priceExVat: averageAmount(nextRevenueExVat, volumePieces),
    averageCostWithVat: volumeAndEmptyCost
      ? null
      : averageAmount(volumeCostWithVat, volumePieces),
    averageCostExVat: volumeAndEmptyCost
      ? null
      : averageAmount(volumeCostExVat, volumePieces),
    volumeCostWithVat: volumeAndEmptyCost ? null : volumeCostWithVat,
    volumeCostExVat: volumeAndEmptyCost ? null : volumeCostExVat,
    revenueWithVat: nextRevenueWithVat,
    revenueExVat: nextRevenueExVat,
    contribution: volumeAndEmptyCost ? null : contribution,
    profitabilityHundredths: volumeAndEmptyCost
      ? null
      : percentHundredths(contribution, volumeCostExVat),
    costComplete: !volumeAndEmptyCost,
    revenueComplete: side.revenueComplete,
  };
}

/**
 * Текущая сводка: план × прошедшие дни / дни месяца.
 * Прогнозируемая: факт × дни месяца / прошедшие дни.
 * Операционные расходы не трогает. В документ не пишет.
 */
export function applySummaryLens(
  view: SummaryView,
  lens: SummaryLens,
  today: Date,
): SummaryView {
  const planScale = planVolumeScale(view.month, today, lens);
  const factScale = factVolumeScale(view.month, today, lens);
  if (planScale.kind === 'identity' && factScale.kind === 'identity') {
    return view;
  }

  const elapsed = elapsedDaysInMonth(view.month, today);
  const monthDays = view.days;
  const planPerDayDays =
    lens === 'current' && elapsed > 0 ? elapsed : monthDays;

  const groups: SummaryGroup[] = view.groups.map((group) => {
    const rows = group.rows.map((row) => {
      const plan = applyPlanScale(row.plan, planScale, planPerDayDays);
      const fact = applyFactScale(row.fact, factScale, monthDays);
      return {
        ...row,
        plan,
        fact,
        variance: varianceOf(fact, plan),
      };
    });
    const fact = factTotalsFromRows(rows, monthDays);
    const plan = planTotalsFromRows(rows, planPerDayDays);

    return {
      ...group,
      rows,
      plan,
      fact,
      variance: varianceOf(fact, plan),
    };
  });
  const rows = groups.flatMap((group) => group.rows);
  const planTotalsSide = planTotalsFromRows(rows, planPerDayDays);
  const factTotals = factTotalsFromRows(rows, monthDays);

  return {
    ...view,
    groups,
    rows,
    planTotalsSide,
    factTotals,
    variance: varianceOf(factTotals, planTotalsSide),
    headline: summaryHeadline(
      planTotalsSide,
      factTotals,
      view.headline.plan.operatingExpenseExVat,
      view.headline.fact.operatingExpenseExVat,
    ),
  };
}
