import { type UnitCost, unitCost } from '@/domain/cost';
import {
  isMonthKey,
  PROFIT_TAX_PERCENT,
  type Product,
  type ProductCategory,
  type PrototypeDocument,
  type SalesPlan,
} from '@/domain/document';
import { averageAmount, percentHundredths, ratioRound, vatPercentHundredths } from '@/domain/money';
import { periodGridCategories, periodGridProducts } from '@/domain/period-grid';
import { type SalesFactRow, salesFactMonth } from '@/domain/sales-fact';
import {
  daysInMonth,
  monthKeyFromDate,
  PLAN_HORIZON_MONTHS,
  planPhase,
  revenueExVat,
  revenueWithVat,
  type SalesPlanTotals,
  salesPlanForMonth,
  salesPlanLineMetrics,
  salesPlanTotals,
  shiftMonth,
} from '@/domain/sales-plan';

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

/** Фактическая сводка урезает план; прогноз растягивает факт. */
export type SummaryLens = 'current' | 'forecast';

type VolumeScale = { kind: 'identity' } | { kind: 'zero' } | { kind: 'ratio'; numerator: number; denominator: number };

export type OperatingExpenseRejection = 'month' | 'amount';

function minus(left: number | null, right: number | null): number | null {
  if (left === null || right === null) {
    return null;
  }

  return left - right;
}

function varianceOf(
  fact: Pick<SummarySide, 'revenueWithVat' | 'revenueExVat' | 'contribution'>,
  plan: Pick<SummarySide, 'revenueWithVat' | 'revenueExVat' | 'contribution'> | null,
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

/** Меняет местами концы, если `from` позже `to`. */
export function normalizeMonthRange(from: string, to: string): { from: string; to: string } {
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

/**
 * Расширяет интервал так, чтобы в него входил `month`.
 * Фактическая сводка смотрит только такой период.
 */
export function ensureRangeIncludesMonth(from: string, to: string, month: string): { from: string; to: string } {
  const range = normalizeMonthRange(from, to);
  return {
    from: range.from > month ? month : range.from,
    to: range.to < month ? month : range.to,
  };
}

/** Один месяц в периоде — на сводке можно править операционные расходы. */
export function isSingleMonthSummary(view: SummaryView): boolean {
  return view.from === view.to;
}

/**
 * Товары сетки месяца: рабочие и архивные с планом или продажей в этом месяце.
 */
export function summaryGridProducts(document: PrototypeDocument, month: string): Product[] {
  return periodGridProducts(document, month);
}

function summaryCategories(document: PrototypeDocument, products: readonly Product[]): ProductCategory[] {
  return periodGridCategories(document, products);
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
  const revenueMissing = metrics.revenueWithVat === null || metrics.revenueExVat === null;

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
  let volume = 0;
  let revenueWith = 0;
  let revenueEx = 0;
  let costWith = 0;
  let costEx = 0;
  let contributionSum = 0;
  let costComplete = true;
  let revenueComplete = true;
  const cost = unitCost(document, product.id);

  for (const row of rows) {
    volume += row.salesPieces;

    if (row.revenueWithVat === null || row.revenueExVat === null) {
      if (row.salesPieces > 0) {
        revenueComplete = false;
      }
    } else {
      revenueWith += row.revenueWithVat;
      revenueEx += row.revenueExVat;
    }

    if (
      row.salesPieces > 0 &&
      (row.salesVolumeCostWithVat === null || row.salesVolumeCostExVat === null || row.contribution === null)
    ) {
      costComplete = false;
    } else if (row.salesVolumeCostWithVat !== null && row.salesVolumeCostExVat !== null && row.contribution !== null) {
      costWith += row.salesVolumeCostWithVat;
      costEx += row.salesVolumeCostExVat;
      contributionSum += row.contribution;
    }
  }

  const volumePieces = volume;
  const revenueWithVat = revenueComplete ? revenueWith : null;
  const revenueExVat = revenueComplete ? revenueEx : null;
  const volumeCostWithVat = costComplete ? costWith : null;
  const volumeCostExVat = costComplete ? costEx : null;
  const contribution = costComplete && revenueComplete ? contributionSum : null;
  const priceWithVat = averageAmount(revenueWithVat, volumePieces);
  const priceExVat = averageAmount(revenueExVat, volumePieces);
  const volumeAndEmptyCost = volumePieces > 0 && (cost === null || !costComplete);

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
    profitabilityHundredths: volumeAndEmptyCost ? null : percentHundredths(contribution, volumeCostExVat),
    vatPercent: product.vatPercent,
    vatPercentHundredths: null,
    costComplete: !volumeAndEmptyCost,
    revenueComplete,
  };
}

function emptyFactSide(document: PrototypeDocument, product: Product, days: number): SummarySide {
  return factFromRows(document, product, [], days);
}

function totalsFromSides(sides: readonly SummarySide[], days: number): SummarySide {
  let volume = 0;
  let revenueWith = 0;
  let revenueEx = 0;
  let costWith = 0;
  let costEx = 0;
  let contributionSum = 0;
  let costComplete = true;
  let revenueComplete = true;

  for (const fact of sides) {
    volume += fact.volumePieces ?? 0;

    if (fact.revenueWithVat === null || fact.revenueExVat === null) {
      if ((fact.volumePieces ?? 0) > 0) {
        revenueComplete = false;
      }
    } else {
      revenueWith += fact.revenueWithVat;
      revenueEx += fact.revenueExVat;
    }

    if ((fact.volumePieces ?? 0) > 0 && !fact.costComplete) {
      costComplete = false;
    } else if (fact.volumeCostWithVat !== null && fact.volumeCostExVat !== null && fact.contribution !== null) {
      costWith += fact.volumeCostWithVat;
      costEx += fact.volumeCostExVat;
      contributionSum += fact.contribution;
    }
  }

  const volumePieces = volume;
  const revenueWithVat = revenueComplete ? revenueWith : null;
  const revenueExVat = revenueComplete ? revenueEx : null;
  const volumeCostWithVat = costComplete ? costWith : null;
  const volumeCostExVat = costComplete ? costEx : null;
  const contribution = costComplete && revenueComplete ? contributionSum : null;
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
    profitabilityHundredths: costComplete && revenueComplete ? percentHundredths(contribution, volumeCostExVat) : null,
    vatPercent: null,
    vatPercentHundredths: vatPercentHundredths(revenueWithVat, revenueExVat),
    costComplete,
    revenueComplete,
  };
}

function factTotalsFromRows(rows: readonly SummaryRow[], days: number): SummarySide {
  return totalsFromSides(
    rows.map((row) => row.fact),
    days,
  );
}

function planTotalsFromRows(rows: readonly SummaryRow[], days: number): SummarySide | null {
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
    vatPercentHundredths: vatPercentHundredths(totals.revenueWithVat, totals.revenueExVat),
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

function headlineSide(totals: SummarySide | null, operatingExpenseExVat: number): SummaryHeadlineSide {
  const revenueWithVat = totals?.revenueWithVat ?? null;
  const revenueExVat = totals?.revenueExVat ?? null;
  const contribution = totals?.contribution ?? null;
  const profit = contribution === null ? null : contribution - operatingExpenseExVat;
  const profitTax = profit === null ? null : ratioRound(profit * PROFIT_TAX_PERCENT, 100);
  const netProfit = profit === null || profitTax === null ? null : profit - profitTax;
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
 * Операционные расходы — план во «Вводе плана», факт в отчете общем; без листа Operation Expense.
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
      operatingExpenseExVat: fact.operatingExpenseExVat - plan.operatingExpenseExVat,
      profit: minus(fact.profit, plan.profit),
      profitTax: minus(fact.profitTax, plan.profitTax),
      netProfit: minus(fact.netProfit, plan.netProfit),
      netProfitabilityHundredths: minus(fact.netProfitabilityHundredths, plan.netProfitabilityHundredths),
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

  if (!Number.isInteger(amountExVat) || amountExVat < 0) {
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
  const products = summaryGridProducts(document, month);
  const factDays = salesFactMonth(document, month);
  const rowByProduct = new Map<string, SummaryRow>();

  for (const product of products) {
    const planned = plan ? planSide(document, plan, product) : null;
    const dayRows = factDays.flatMap((day) => day.rows.filter((row) => row.productId === product.id));
    const factSide =
      dayRows.length > 0 ? factFromRows(document, product, dayRows, days) : emptyFactSide(document, product, days);
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

  const groups: SummaryGroup[] = summaryCategories(document, products).map((category) => {
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
    headline: summaryHeadline(planTotalsSide, factTotals, opex.planExVat, opex.factExVat),
  };
}

/**
 * Сводка за интервал месяцев: сумма полных месяцев без линзы.
 * Один месяц — то же, что `monthSummary`.
 */
export function rangeSummary(document: PrototypeDocument, from: string, to: string): SummaryView {
  const range = normalizeMonthRange(from, to);
  if (range.from === range.to) {
    return monthSummary(document, range.from);
  }

  const views = monthsInRange(range.from, range.to).map((month) => monthSummary(document, month));
  const days = calendarDays(views);
  return mergeMonthSummaries(views, days, days);
}

/**
 * Фактическая сводка периода. Период расширяется, пока в нём нет текущего месяца.
 * По каждому месяцу план урезается на долю прошедших дней, затем месяцы складываются.
 * Прошедший месяц полный, будущий план нулевой. Факт не растягивается.
 */
export function actualRangeSummary(document: PrototypeDocument, from: string, to: string, today: Date): SummaryView {
  const current = monthKeyFromDate(today);
  const range = ensureRangeIncludesMonth(from, to, current);
  const months = monthsInRange(range.from, range.to);
  const views = months.map((month) => applySummaryLens(monthSummary(document, month), 'current', today));
  const first = views[0];
  if (!first || views.length === 1) {
    return first ?? monthSummary(document, range.from);
  }

  const planDays = months.reduce((sum, month) => sum + elapsedDaysInMonth(month, today), 0);
  return mergeMonthSummaries(views, planDays, calendarDays(views));
}

/**
 * Прогноз: один месяц с линзой, интервал — сумма полных месяцев.
 * Фактическая — `actualRangeSummary`.
 */
export function summaryForLens(
  document: PrototypeDocument,
  from: string,
  to: string,
  lens: SummaryLens,
  today: Date,
): SummaryView {
  if (lens === 'current') {
    return actualRangeSummary(document, from, to, today);
  }

  const range = normalizeMonthRange(from, to);
  if (range.from === range.to) {
    return applySummaryLens(monthSummary(document, range.from), 'forecast', today);
  }

  return rangeSummary(document, range.from, range.to);
}

function calendarDays(views: readonly SummaryView[]): number {
  return views.reduce((sum, view) => sum + view.days, 0);
}

function mergeMonthSummaries(views: readonly SummaryView[], planDays: number, factDays: number): SummaryView {
  const first = views[0];
  const last = views[views.length - 1];
  if (!first || !last) {
    throw new Error('mergeMonthSummaries: пустой период');
  }

  const categoryById = new Map<string, SummaryGroup>();
  const productIdsByCategory = new Map<string, Set<string>>();
  const sampleRowByProduct = new Map<string, SummaryRow>();

  for (const view of views) {
    for (const group of view.groups) {
      if (!categoryById.has(group.categoryId)) {
        categoryById.set(group.categoryId, group);
        productIdsByCategory.set(group.categoryId, new Set());
      }
      const productIds = productIdsByCategory.get(group.categoryId);
      if (!productIds) {
        continue;
      }
      for (const row of group.rows) {
        productIds.add(row.productId);
        if (!sampleRowByProduct.has(row.productId)) {
          sampleRowByProduct.set(row.productId, row);
        }
      }
    }
  }

  const categoryOrder = [...new Set(views.flatMap((view) => view.groups.map((g) => g.categoryId)))];

  const groups: SummaryGroup[] = categoryOrder.flatMap((categoryId) => {
    const sample = categoryById.get(categoryId);
    const productIds = productIdsByCategory.get(categoryId);
    if (!sample || !productIds) {
      return [];
    }

    const monthGroups = views.flatMap((view) => {
      const match = view.groups.find((item) => item.categoryId === categoryId);
      return match ? [match] : [];
    });

    const sortedProductIds = [...productIds].sort((left, right) => {
      const leftName = sampleRowByProduct.get(left)?.name ?? left;
      const rightName = sampleRowByProduct.get(right)?.name ?? right;
      return leftName.localeCompare(rightName, 'ru');
    });

    const rows = sortedProductIds.flatMap((productId) => {
      const monthRows = monthGroups.flatMap((monthGroup) => {
        const monthRow = monthGroup.rows.find((item) => item.productId === productId);
        return monthRow ? [monthRow] : [];
      });
      return monthRows.length > 0 ? [mergeSummaryRows(monthRows, planDays, factDays)] : [];
    });
    const fact = factTotalsFromRows(rows, factDays);
    const planMetrics = planTotalsFromRows(rows, planDays);

    return [
      {
        categoryId: sample.categoryId,
        name: sample.name,
        deleted: sample.deleted,
        rows,
        plan: planMetrics,
        fact,
        variance: varianceOf(fact, planMetrics),
      },
    ];
  });
  const rows = groups.flatMap((group) => group.rows);
  const planTotalsSide = planTotalsFromRows(rows, planDays);
  const factTotals = factTotalsFromRows(rows, factDays);
  let planOpex = 0;
  let factOpex = 0;
  for (const view of views) {
    planOpex += view.headline.plan.operatingExpenseExVat;
    factOpex += view.headline.fact.operatingExpenseExVat;
  }

  return {
    from: first.from,
    to: last.to,
    month: first.from,
    days: factDays,
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

function mergeSummaryRows(rows: readonly SummaryRow[], planDays: number, factDays: number): SummaryRow {
  const sample = rows[0];
  if (!sample) {
    throw new Error('mergeSummaryRows: пустой список строк');
  }
  if (rows.length === 1) {
    return sample;
  }

  const planSides = rows.flatMap((row) => (row.plan ? [row.plan] : []));
  const factSides = rows.map((row) => row.fact);
  const plan = planSides.length === 0 ? null : mergeProductSides(planSides, planDays);
  const fact = mergeProductSides(factSides, factDays);

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
function mergeProductSides(sides: readonly SummarySide[], days: number): SummarySide {
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
    averageCostWithVat: unitCostValue !== null ? unitCostValue.withVat : merged.averageCostWithVat,
    averageCostExVat: unitCostValue !== null ? unitCostValue.exVat : merged.averageCostExVat,
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

function planVolumeScale(month: string, today: Date, lens: SummaryLens): VolumeScale {
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

function factVolumeScale(month: string, today: Date, lens: SummaryLens): VolumeScale {
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

function scaleInteger(value: number, numerator: number, denominator: number): number | null {
  return ratioRound(value * numerator, denominator);
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

function planSideAtVolume(side: SummarySide, volumePieces: number, perDayDays: number): SummarySide {
  const vat = side.vatPercent;
  const price = side.priceWithVat;
  const revenueWith = price === null ? null : revenueWithVat(price, volumePieces);
  const revenueEx =
    vat === null ? (volumePieces === 0 ? 0 : null) : price === null ? null : revenueExVat(price, vat, volumePieces);
  const cost = side.unitCost;
  const volumeCostWith = cost === null ? null : cost.withVat * volumePieces;
  const volumeCostEx = cost === null ? null : cost.exVat * volumePieces;
  const contribution = revenueEx === null || volumeCostEx === null ? null : revenueEx - volumeCostEx;
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

function applyPlanScale(side: SummarySide | null, scale: VolumeScale, perDayDays: number): SummarySide | null {
  if (!side) {
    return null;
  }
  if (scale.kind === 'identity') {
    return side;
  }
  if (scale.kind === 'zero') {
    return planSideAtVolume(side, 0, perDayDays);
  }

  const volume = scaleInteger(side.volumePieces ?? 0, scale.numerator, scale.denominator);
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

function applyFactScale(side: SummarySide, scale: VolumeScale, monthDays: number): SummarySide {
  if (scale.kind === 'identity') {
    return side;
  }

  const volumePieces = scaleAmount(side.volumePieces, scale);
  const nextRevenueWithVat = scaleAmount(side.revenueWithVat, scale);
  const nextRevenueExVat = scaleAmount(side.revenueExVat, scale);
  const volumeCostWithVat = scaleAmount(side.volumeCostWithVat, scale);
  const volumeCostExVat = scaleAmount(side.volumeCostExVat, scale);
  const contribution = scaleAmount(side.contribution, scale);
  const volumeAndEmptyCost = (volumePieces ?? 0) > 0 && (side.unitCost === null || !side.costComplete);

  return {
    ...side,
    volumePieces,
    perDay: volumePieces === null || monthDays === 0 ? null : volumePieces / monthDays,
    priceWithVat: averageAmount(nextRevenueWithVat, volumePieces),
    priceExVat: averageAmount(nextRevenueExVat, volumePieces),
    averageCostWithVat: volumeAndEmptyCost ? null : averageAmount(volumeCostWithVat, volumePieces),
    averageCostExVat: volumeAndEmptyCost ? null : averageAmount(volumeCostExVat, volumePieces),
    volumeCostWithVat: volumeAndEmptyCost ? null : volumeCostWithVat,
    volumeCostExVat: volumeAndEmptyCost ? null : volumeCostExVat,
    revenueWithVat: nextRevenueWithVat,
    revenueExVat: nextRevenueExVat,
    contribution: volumeAndEmptyCost ? null : contribution,
    profitabilityHundredths: volumeAndEmptyCost ? null : percentHundredths(contribution, volumeCostExVat),
    costComplete: !volumeAndEmptyCost,
    revenueComplete: side.revenueComplete,
  };
}

/**
 * Текущая сводка: план × прошедшие дни / дни месяца.
 * Прогнозируемая: факт × дни месяца / прошедшие дни.
 * Операционные расходы не трогает. В документ не пишет.
 */
export function applySummaryLens(view: SummaryView, lens: SummaryLens, today: Date): SummaryView {
  const planScale = planVolumeScale(view.month, today, lens);
  const factScale = factVolumeScale(view.month, today, lens);
  if (planScale.kind === 'identity' && factScale.kind === 'identity') {
    return view;
  }

  const elapsed = elapsedDaysInMonth(view.month, today);
  const monthDays = view.days;
  const planPerDayDays = lens === 'current' && elapsed > 0 ? elapsed : monthDays;

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
