import { type Product, type PrototypeDocument } from '@/domain/document';
import { ratioRound } from '@/domain/money';
import { periodGridCategories, periodReferencedProductIds } from '@/domain/period-grid';
import { productionPlanForMonth } from '@/domain/production-plan';
import { activeProducts } from '@/domain/products';
import { daysInMonth, monthKeyFromDate } from '@/domain/sales-plan';
import {
  elapsedDaysInMonth,
  ensureRangeIncludesMonth,
  monthsInRange,
  normalizeMonthRange,
  type SummaryLens,
} from '@/domain/summary';

export interface ProductionFactRow {
  productId: string;
  name: string;
  deleted: boolean;
  planVolumePieces: number;
  factVolumePieces: number;
  varianceVolumePieces: number;
}

export interface ProductionFactGroup {
  categoryId: string;
  name: string;
  deleted: boolean;
  rows: ProductionFactRow[];
  planVolumePieces: number;
  factVolumePieces: number;
  varianceVolumePieces: number;
}

export interface ProductionFactView {
  from: string;
  to: string;
  month: string;
  days: number;
  groups: ProductionFactGroup[];
  planVolumePieces: number;
  factVolumePieces: number;
  varianceVolumePieces: number;
}

type VolumeScale = { kind: 'identity' } | { kind: 'zero' } | { kind: 'ratio'; numerator: number; denominator: number };

function variancePieces(fact: number, plan: number): number {
  return fact - plan;
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

/** Сумма штук журнала выпуска по товару за дни месяца. */
function factPiecesByProduct(document: PrototypeDocument, month: string): Map<string, number> {
  const map = new Map<string, number>();
  const prefix = `${month}-`;
  for (const entry of document.productionEntries) {
    if (!entry.occurredOn.startsWith(prefix)) {
      continue;
    }
    for (const line of entry.lines) {
      map.set(line.productId, (map.get(line.productId) ?? 0) + line.pieces);
    }
  }
  return map;
}

function totalsFromRows(rows: readonly ProductionFactRow[]): {
  planVolumePieces: number;
  factVolumePieces: number;
  varianceVolumePieces: number;
} {
  let plan = 0;
  let fact = 0;
  for (const row of rows) {
    plan += row.planVolumePieces;
    fact += row.factVolumePieces;
  }
  return {
    planVolumePieces: plan,
    factVolumePieces: fact,
    varianceVolumePieces: variancePieces(fact, plan),
  };
}

/**
 * Месяц без линзы: план из плана выпуска, факт из журнала.
 * В документ ничего не пишется.
 */
export function monthProductionFact(document: PrototypeDocument, month: string): ProductionFactView {
  const plan = productionPlanForMonth(document, month);
  const products = productionFactGridProducts(document, month);
  const factByProduct = factPiecesByProduct(document, month);
  const lineByProduct = new Map(plan.lines.map((line) => [line.productId, line]));
  const rowByProduct = new Map<string, ProductionFactRow>();

  for (const product of products) {
    const planVolumePieces = lineByProduct.get(product.id)?.volumePieces ?? 0;
    const factVolumePieces = factByProduct.get(product.id) ?? 0;
    rowByProduct.set(product.id, {
      productId: product.id,
      name: product.name,
      deleted: product.deletedAt !== null,
      planVolumePieces,
      factVolumePieces,
      varianceVolumePieces: variancePieces(factVolumePieces, planVolumePieces),
    });
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

function applyRowLens(row: ProductionFactRow, planScale: VolumeScale, factScale: VolumeScale): ProductionFactRow {
  const planVolumePieces = scalePieces(row.planVolumePieces, planScale);
  const factVolumePieces = scalePieces(row.factVolumePieces, factScale);
  return {
    ...row,
    planVolumePieces,
    factVolumePieces,
    varianceVolumePieces: variancePieces(factVolumePieces, planVolumePieces),
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

  let plan = 0;
  let fact = 0;
  for (const row of rows) {
    plan += row.planVolumePieces;
    fact += row.factVolumePieces;
  }

  return {
    productId: sample.productId,
    name: sample.name,
    deleted: sample.deleted,
    planVolumePieces: plan,
    factVolumePieces: fact,
    varianceVolumePieces: variancePieces(fact, plan),
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
