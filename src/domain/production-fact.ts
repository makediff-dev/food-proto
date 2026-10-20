import { type Product, type PrototypeDocument } from '@/domain/document';
import { plannedProductionVolumePieces } from '@/domain/finished-goods';
import { amountExVat, averageAmount, ratioRound } from '@/domain/money';
import { periodGridCategories, periodReferencedProductIds } from '@/domain/period-grid';
import { type ProductionProductSpend, productionSpendByProduct } from '@/domain/production-journal';
import { activeProducts } from '@/domain/products';
import {
  daysInMonth,
  monthKeyFromDate,
  planPriceWithVatForProduct,
  revenueExVat,
  revenueWithVat,
} from '@/domain/sales-plan';
import {
  elapsedDaysInMonth,
  ensureRangeIncludesMonth,
  monthsInRange,
  normalizeMonthRange,
  type SummaryLens,
} from '@/domain/summary';

/** План или факт выпуска: штуки и стоимость по расчётной цене. */
export interface ProductionFactSide {
  volumePieces: number;
  /** Копейки. `null`, если стоимость не по всем товарам со штуками. */
  volumeCostWithVat: number | null;
  volumeCostExVat: number | null;
  /** Есть строка со штуками, у которой цена без НДС не считается. */
  costComplete: boolean;
  /** Стоимость / объём, копейки. Только если цена полная; нулевой объём — 0. */
  averageCostWithVat: number | null;
  averageCostExVat: number | null;
}

/** Отклонение = факт − план. Деньги — стоимость (цена × объём). */
export interface ProductionFactVariance {
  volumePieces: number;
  volumeCostWithVat: number | null;
  volumeCostExVat: number | null;
  /**
   * На строке товара: средняя цена факта минус расчётная цена плана.
   * Нет факта выпуска — пусто. У группы — разница средних.
   */
  averageCostWithVat: number | null;
  averageCostExVat: number | null;
}

export interface ProductionFactRow {
  productId: string;
  name: string;
  deleted: boolean;
  vatPercent: number;
  /** Расчётная цена плана продаж. Факт на строке — среднее из журнала выпуска. */
  unitPrice: { withVat: number; exVat: number | null };
  plan: ProductionFactSide;
  fact: ProductionFactSide;
  variance: ProductionFactVariance;
}

export interface ProductionFactGroup {
  categoryId: string;
  name: string;
  deleted: boolean;
  rows: ProductionFactRow[];
  plan: ProductionFactSide;
  fact: ProductionFactSide;
  variance: ProductionFactVariance;
}

export interface ProductionFactView {
  from: string;
  to: string;
  month: string;
  days: number;
  groups: ProductionFactGroup[];
  plan: ProductionFactSide;
  fact: ProductionFactSide;
  variance: ProductionFactVariance;
}

type VolumeScale = { kind: 'identity' } | { kind: 'zero' } | { kind: 'ratio'; numerator: number; denominator: number };

function productSide(priceWithVat: number, vatPercent: number, volumePieces: number): ProductionFactSide {
  const valueExVat = revenueExVat(priceWithVat, vatPercent, volumePieces);
  const missing = volumePieces > 0 && valueExVat === null;
  const priceExVat = amountExVat(priceWithVat, vatPercent);
  return {
    volumePieces,
    volumeCostWithVat: missing ? null : revenueWithVat(priceWithVat, volumePieces),
    volumeCostExVat: valueExVat,
    costComplete: !missing,
    averageCostWithVat: missing || volumePieces <= 0 ? null : priceWithVat,
    averageCostExVat: missing || volumePieces <= 0 ? null : priceExVat,
  };
}

function sideFromRows(rows: readonly ProductionFactRow[], kind: 'plan' | 'fact'): ProductionFactSide {
  let volume = 0;
  let costWith = 0;
  let costEx = 0;
  let costComplete = true;

  for (const row of rows) {
    const side = row[kind];
    volume += side.volumePieces;
    if (!side.costComplete) {
      costComplete = false;
    }
    if (side.volumeCostWithVat !== null) {
      costWith += side.volumeCostWithVat;
    }
    if (side.volumeCostExVat !== null) {
      costEx += side.volumeCostExVat;
    }
  }

  return {
    volumePieces: volume,
    volumeCostWithVat: costComplete ? costWith : null,
    volumeCostExVat: costComplete ? costEx : null,
    costComplete,
    averageCostWithVat: costComplete ? averageAmount(costWith, volume) : null,
    averageCostExVat: costComplete ? averageAmount(costEx, volume) : null,
  };
}

function moneyDelta(fact: number | null, plan: number | null, complete: boolean): number | null {
  if (!complete || fact === null || plan === null) {
    return null;
  }

  return fact - plan;
}

function varianceOf(fact: ProductionFactSide, plan: ProductionFactSide): ProductionFactVariance {
  const complete = fact.costComplete && plan.costComplete;
  const factUnitKnown = fact.volumePieces > 0;
  const planPriceKnown = plan.averageCostWithVat !== null && plan.averageCostExVat !== null;
  return {
    volumePieces: fact.volumePieces - plan.volumePieces,
    volumeCostWithVat: moneyDelta(fact.volumeCostWithVat, plan.volumeCostWithVat, complete),
    volumeCostExVat: moneyDelta(fact.volumeCostExVat, plan.volumeCostExVat, complete),
    averageCostWithVat: moneyDelta(
      factUnitKnown ? fact.averageCostWithVat : null,
      planPriceKnown ? plan.averageCostWithVat : null,
      complete && planPriceKnown,
    ),
    averageCostExVat: moneyDelta(
      factUnitKnown ? fact.averageCostExVat : null,
      planPriceKnown ? plan.averageCostExVat : null,
      complete && planPriceKnown,
    ),
  };
}

function spendSide(pieces: number, withVat: number, exVat: number, complete: boolean): ProductionFactSide {
  if (!complete) {
    return {
      volumePieces: pieces,
      volumeCostWithVat: null,
      volumeCostExVat: null,
      costComplete: false,
      averageCostWithVat: null,
      averageCostExVat: null,
    };
  }

  return {
    volumePieces: pieces,
    volumeCostWithVat: withVat,
    volumeCostExVat: exVat,
    costComplete: true,
    averageCostWithVat: averageAmount(withVat, pieces),
    averageCostExVat: averageAmount(exVat, pieces),
  };
}

function totalsFromRows(rows: readonly ProductionFactRow[]): {
  plan: ProductionFactSide;
  fact: ProductionFactSide;
  variance: ProductionFactVariance;
} {
  const plan = sideFromRows(rows, 'plan');
  const fact = sideFromRows(rows, 'fact');
  return {
    plan,
    fact,
    variance: varianceOf(fact, plan),
  };
}

function factRow(
  identity: { productId: string; name: string; deleted: boolean; vatPercent: number },
  month: string,
  document: PrototypeDocument,
  planVolumePieces: number,
  spend: ProductionProductSpend | undefined,
): ProductionFactRow {
  const priceWithVat = planPriceWithVatForProduct(document, identity.productId, month);
  const plan = productSide(priceWithVat, identity.vatPercent, planVolumePieces);
  const fact = spend
    ? spendSide(spend.pieces, spend.costWithVat, spend.costExVat, spend.complete)
    : spendSide(0, 0, 0, true);
  return {
    productId: identity.productId,
    name: identity.name,
    deleted: identity.deleted,
    vatPercent: identity.vatPercent,
    unitPrice: { withVat: priceWithVat, exVat: amountExVat(priceWithVat, identity.vatPercent) },
    plan,
    fact,
    variance: varianceOf(fact, plan),
  };
}

/** Товары сетки: рабочие и архивные с планом, продажей или записью выпуска в месяце. */
export function productionFactGridProducts(document: PrototypeDocument, month: string): Product[] {
  const active = activeProducts(document);
  const referenced = new Set(periodReferencedProductIds(document, month));
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

/** Штуки и фактическая стоимость журнала выпуска за дни месяца. */
function factSpendByProduct(document: PrototypeDocument, month: string): Map<string, ProductionProductSpend> {
  const prefix = `${month}-`;
  return productionSpendByProduct(
    document,
    document.productionEntries.filter((entry) => entry.occurredOn.startsWith(prefix)),
  );
}

/**
 * Месяц без линзы: план из плана выпуска, факт из журнала.
 * В документ ничего не пишется.
 */
export function monthProductionFact(document: PrototypeDocument, month: string): ProductionFactView {
  const products = productionFactGridProducts(document, month);
  const factByProduct = factSpendByProduct(document, month);
  const rowByProduct = new Map<string, ProductionFactRow>();

  for (const product of products) {
    const planVolumePieces = plannedProductionVolumePieces(document, month, product.id);
    rowByProduct.set(
      product.id,
      factRow(
        {
          productId: product.id,
          name: product.name,
          deleted: product.deletedAt !== null,
          vatPercent: product.vatPercent,
        },
        month,
        document,
        planVolumePieces,
        factByProduct.get(product.id),
      ),
    );
  }

  const groups: ProductionFactGroup[] = periodGridCategories(document, products).map((category) => {
    const rows = products
      .filter((item) => item.categoryId === category.id)
      .sort((left, right) => left.name.localeCompare(right.name, 'ru'))
      .flatMap((item) => {
        const row = rowByProduct.get(item.id);
        return row ? [row] : [];
      });
    const totals = totalsFromRows(rows);

    return {
      categoryId: category.id,
      name: category.name,
      deleted: category.deletedAt !== null,
      rows,
      ...totals,
    };
  });

  const rows = groups.flatMap((group) => group.rows);
  const totals = totalsFromRows(rows);

  return {
    from: month,
    to: month,
    month,
    days: daysInMonth(month),
    groups,
    ...totals,
  };
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

function scalePieces(value: number, scale: VolumeScale): number {
  if (scale.kind === 'identity') {
    return value;
  }
  if (scale.kind === 'zero') {
    return 0;
  }

  return ratioRound(value * scale.numerator, scale.denominator) ?? 0;
}

function scaleMoney(value: number, scale: VolumeScale): number {
  if (scale.kind === 'identity') {
    return value;
  }
  if (scale.kind === 'zero') {
    return 0;
  }

  return ratioRound(value * scale.numerator, scale.denominator) ?? 0;
}

function scaledFactSide(side: ProductionFactSide, scale: VolumeScale, pieces: number): ProductionFactSide {
  if (!side.costComplete || side.volumeCostWithVat === null || side.volumeCostExVat === null) {
    return spendSide(pieces, 0, 0, false);
  }

  return spendSide(pieces, scaleMoney(side.volumeCostWithVat, scale), scaleMoney(side.volumeCostExVat, scale), true);
}

function applyRowLens(row: ProductionFactRow, planScale: VolumeScale, factScale: VolumeScale): ProductionFactRow {
  const plan = productSide(row.unitPrice.withVat, row.vatPercent, scalePieces(row.plan.volumePieces, planScale));
  const fact = scaledFactSide(row.fact, factScale, scalePieces(row.fact.volumePieces, factScale));
  return {
    ...row,
    plan,
    fact,
    variance: varianceOf(fact, plan),
  };
}

/** Линза месяца: фактическая урезает план, прогноз растягивает факт. */
export function applyProductionFactLens(view: ProductionFactView, lens: SummaryLens, today: Date): ProductionFactView {
  const planScale = planVolumeScale(view.month, today, lens);
  const factScale = factVolumeScale(view.month, today, lens);
  if (planScale.kind === 'identity' && factScale.kind === 'identity') {
    return view;
  }

  const groups = view.groups.map((group) => {
    const rows = group.rows.map((row) => applyRowLens(row, planScale, factScale));
    const totals = totalsFromRows(rows);
    return {
      ...group,
      rows,
      ...totals,
    };
  });
  const rows = groups.flatMap((group) => group.rows);
  const totals = totalsFromRows(rows);

  return {
    ...view,
    groups,
    ...totals,
  };
}

function mergeFactRows(rows: readonly ProductionFactRow[]): ProductionFactRow {
  const sample = rows[0];
  if (!sample) {
    throw new Error('mergeFactRows: пустой список строк');
  }
  if (rows.length === 1) {
    return sample;
  }

  let planPieces = 0;
  let planWith = 0;
  let planEx = 0;
  let planComplete = true;
  let factPieces = 0;
  let factWith = 0;
  let factEx = 0;
  let factComplete = true;
  for (const row of rows) {
    planPieces += row.plan.volumePieces;
    if (!row.plan.costComplete || row.plan.volumeCostWithVat === null || row.plan.volumeCostExVat === null) {
      if (row.plan.volumePieces > 0) {
        planComplete = false;
      }
    } else {
      planWith += row.plan.volumeCostWithVat;
      planEx += row.plan.volumeCostExVat;
    }
    factPieces += row.fact.volumePieces;
    if (!row.fact.costComplete || row.fact.volumeCostWithVat === null || row.fact.volumeCostExVat === null) {
      if (row.fact.volumePieces > 0) {
        factComplete = false;
      }
      continue;
    }
    factWith += row.fact.volumeCostWithVat;
    factEx += row.fact.volumeCostExVat;
  }

  const plan = spendSide(planPieces, planWith, planEx, planComplete);
  const fact = spendSide(factPieces, factWith, factEx, factComplete);
  return {
    ...sample,
    plan,
    fact,
    variance: varianceOf(fact, plan),
  };
}

function mergeMonthProductionFacts(views: readonly ProductionFactView[]): ProductionFactView {
  const first = views[0];
  const last = views[views.length - 1];
  if (!first || !last) {
    throw new Error('mergeMonthProductionFacts: пустой период');
  }

  const categoryById = new Map<string, ProductionFactGroup>();
  const productIdsByCategory = new Map<string, Set<string>>();
  const sampleRowByProduct = new Map<string, ProductionFactRow>();

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

  const categoryOrder = [...new Set(views.flatMap((view) => view.groups.map((group) => group.categoryId)))];

  const groups: ProductionFactGroup[] = categoryOrder.flatMap((categoryId) => {
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
      return monthRows.length > 0 ? [mergeFactRows(monthRows)] : [];
    });
    const totals = totalsFromRows(rows);

    return [
      {
        categoryId: sample.categoryId,
        name: sample.name,
        deleted: sample.deleted,
        rows,
        ...totals,
      },
    ];
  });

  const rows = groups.flatMap((group) => group.rows);
  const totals = totalsFromRows(rows);
  const days = views.reduce((sum, view) => sum + view.days, 0);

  return {
    from: first.from,
    to: last.to,
    month: first.from,
    days,
    groups,
    ...totals,
  };
}

/** Интервал месяцев: сумма полных месяцев без линзы. */
export function rangeProductionFact(document: PrototypeDocument, from: string, to: string): ProductionFactView {
  const range = normalizeMonthRange(from, to);
  if (range.from === range.to) {
    return monthProductionFact(document, range.from);
  }

  const views = monthsInRange(range.from, range.to).map((month) => monthProductionFact(document, month));
  return mergeMonthProductionFacts(views);
}

/**
 * Фактический период: расширяется до текущего месяца.
 * По каждому месяцу план урезается, затем месяцы складываются.
 */
export function actualRangeProductionFact(
  document: PrototypeDocument,
  from: string,
  to: string,
  today: Date,
): ProductionFactView {
  const range = ensureRangeIncludesMonth(from, to, monthKeyFromDate(today));
  const months = monthsInRange(range.from, range.to);
  const views = months.map((month) => applyProductionFactLens(monthProductionFact(document, month), 'current', today));
  const first = views[0];
  if (!first || views.length === 1) {
    return first ?? monthProductionFact(document, range.from);
  }

  const merged = mergeMonthProductionFacts(views);
  const planDays = months.reduce((sum, month) => sum + elapsedDaysInMonth(month, today), 0);
  return { ...merged, days: planDays };
}

/**
 * Прогноз: один месяц с линзой, интервал — сумма полных месяцев.
 * Фактическая — `actualRangeProductionFact`.
 */
export function productionFactForLens(
  document: PrototypeDocument,
  from: string,
  to: string,
  lens: SummaryLens,
  today: Date,
): ProductionFactView {
  if (lens === 'current') {
    return actualRangeProductionFact(document, from, to, today);
  }

  const range = normalizeMonthRange(from, to);
  if (range.from === range.to) {
    return applyProductionFactLens(monthProductionFact(document, range.from), 'forecast', today);
  }

  return rangeProductionFact(document, range.from, range.to);
}
