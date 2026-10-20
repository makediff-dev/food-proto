import { type Product, type ProductionPlan, type ProductionPlanLine, type PrototypeDocument } from '@/domain/document';
import { plannedProductionVolumePieces } from '@/domain/finished-goods';
import { amountExVat, averageAmount } from '@/domain/money';
import { periodGridCategories, periodGridProducts } from '@/domain/period-grid';
import { activeProducts } from '@/domain/products';
import { planMonthOpen, planPriceWithVatForProduct, revenueExVat, revenueWithVat } from '@/domain/sales-plan';

export type ProductionPlanRejection = 'missing' | 'month' | 'taken' | 'products' | 'volume' | 'closed';

export interface ProductionPlanLineMetrics {
  /** Расчётная цена месяца (план продаж), копейки. */
  priceWithVat: number;
  priceExVat: number | null;
  /** Копейки. Цена с НДС × объём. */
  valueWithVat: number | null;
  /** Копейки. Выручка без НДС от этой цены и объёма. */
  valueExVat: number | null;
}

export interface ProductionPlanTotals {
  volumePieces: number;
  valueWithVat: number;
  valueExVat: number;
  /** Есть строка с объёмом, у которой цена без НДС не считается. */
  priceComplete: boolean;
  /** Стоимость / объём, копейки. Только если цена полная. */
  averagePriceWithVat: number | null;
  averagePriceExVat: number | null;
  lineCount: number;
}

export interface ProductionPlanRow {
  productId: string;
  name: string;
  deleted: boolean;
  planLineId: string | null;
  volumePieces: number | null;
  vatPercent: number;
  metrics: ProductionPlanLineMetrics;
}

export interface ProductionPlanGroup {
  categoryId: string;
  name: string;
  deleted: boolean;
  rows: ProductionPlanRow[];
  totals: ProductionPlanTotals;
}

export interface ProductionPlanView {
  month: string;
  plan: ProductionPlan;
  groups: ProductionPlanGroup[];
  totals: ProductionPlanTotals;
}

function isVolume(value: number): boolean {
  return Number.isInteger(value) && value >= 0;
}

export function activeProductionPlans(document: PrototypeDocument): ProductionPlan[] {
  return document.productionPlans.filter((item) => item.deletedAt === null);
}

export function workingProductionPlan(document: PrototypeDocument, month: string): ProductionPlan | null {
  return activeProductionPlans(document).find((item) => item.month === month) ?? null;
}

/** Строки нулевого плана: все рабочие товары, объём 0. */
export function defaultProductionPlanLines(document: PrototypeDocument, month: string): ProductionPlanLine[] {
  return activeProducts(document).map((product) => ({
    id: `production-plan-line:${month}:${product.id}`,
    productId: product.id,
    volumePieces: 0,
  }));
}

/**
 * Рабочий план месяца или виртуальный нулевой.
 * Виртуальный в документ не пишется, пока его не материализуют через `ensureProductionPlan`.
 */
export function productionPlanForMonth(document: PrototypeDocument, month: string): ProductionPlan {
  return (
    workingProductionPlan(document, month) ?? {
      id: `production-plan:${month}`,
      month,
      lines: defaultProductionPlanLines(document, month),
      deletedAt: null,
    }
  );
}

/** Пишет нулевой план, если рабочего ещё нет и месяц открыт для правки. */
export function ensureProductionPlan(
  document: PrototypeDocument,
  id: string,
  month: string,
  today: Date,
): PrototypeDocument {
  if (workingProductionPlan(document, month)) {
    return document;
  }

  const lines = defaultProductionPlanLines(document, month);
  if (lines.length === 0) {
    return document;
  }

  return addProductionPlan(document, id, month, lines, today);
}

export function missingProductionPlanProducts(document: PrototypeDocument, plan: ProductionPlan): Product[] {
  const present = new Set(plan.lines.map((line) => line.productId));
  return activeProducts(document).filter((item) => !present.has(item.id));
}

export function productionPlanLineMetrics(
  document: PrototypeDocument,
  month: string,
  line: ProductionPlanLine,
): ProductionPlanLineMetrics {
  const volumePieces = plannedProductionVolumePieces(document, month, line.productId);
  const product = document.products.find((item) => item.id === line.productId);
  const priceWithVat = planPriceWithVatForProduct(document, line.productId, month);
  const priceExVat = product ? amountExVat(priceWithVat, product.vatPercent) : null;
  const valueExVat = product ? revenueExVat(priceWithVat, product.vatPercent, volumePieces) : null;
  return {
    priceWithVat,
    priceExVat,
    valueWithVat: valueExVat === null ? null : revenueWithVat(priceWithVat, volumePieces),
    valueExVat,
  };
}

export function productionPlanTotals(
  document: PrototypeDocument,
  plan: ProductionPlan,
  productIds?: ReadonlySet<string>,
): ProductionPlanTotals {
  const allowed = productIds ?? new Set(document.products.map((item) => item.id));
  let volume = 0;
  let valueWith = 0;
  let valueEx = 0;
  let priceComplete = true;
  let lineCount = 0;

  for (const line of plan.lines) {
    if (!allowed.has(line.productId)) {
      continue;
    }
    lineCount += 1;
    const volumePieces = plannedProductionVolumePieces(document, plan.month, line.productId);
    const metrics = productionPlanLineMetrics(document, plan.month, line);
    volume += volumePieces;

    if (volumePieces > 0 && metrics.valueExVat === null) {
      priceComplete = false;
    }

    if (metrics.valueWithVat !== null) {
      valueWith += metrics.valueWithVat;
    }
    if (metrics.valueExVat !== null) {
      valueEx += metrics.valueExVat;
    }
  }

  return {
    volumePieces: volume,
    valueWithVat: valueWith,
    valueExVat: valueEx,
    priceComplete,
    averagePriceWithVat: priceComplete ? averageAmount(valueWith, volume) : null,
    averagePriceExVat: priceComplete ? averageAmount(valueEx, volume) : null,
    lineCount,
  };
}

function emptyTotals(): ProductionPlanTotals {
  return {
    volumePieces: 0,
    valueWithVat: 0,
    valueExVat: 0,
    priceComplete: true,
    averagePriceWithVat: null,
    averagePriceExVat: null,
    lineCount: 0,
  };
}

function totalsFromRows(rows: readonly ProductionPlanRow[]): ProductionPlanTotals {
  let volume = 0;
  let valueWith = 0;
  let valueEx = 0;
  let priceComplete = true;

  for (const row of rows) {
    const pieces = row.volumePieces ?? 0;
    volume += pieces;
    if (pieces > 0 && row.metrics.valueExVat === null) {
      priceComplete = false;
    }
    if (row.metrics.valueWithVat !== null) {
      valueWith += row.metrics.valueWithVat;
    }
    if (row.metrics.valueExVat !== null) {
      valueEx += row.metrics.valueExVat;
    }
  }

  return {
    volumePieces: volume,
    valueWithVat: valueWith,
    valueExVat: valueEx,
    priceComplete,
    averagePriceWithVat: priceComplete ? averageAmount(valueWith, volume) : null,
    averagePriceExVat: priceComplete ? averageAmount(valueEx, volume) : null,
    lineCount: rows.length,
  };
}

/** Сетка плана производства месяца: категории, товары, итоги. */
export function productionPlanMonthView(document: PrototypeDocument, month: string): ProductionPlanView {
  const plan = productionPlanForMonth(document, month);
  const products = periodGridProducts(document, month);
  const lineByProduct = new Map(plan.lines.map((line) => [line.productId, line]));
  const rowByProduct = new Map<string, ProductionPlanRow>();

  for (const product of products) {
    const line = lineByProduct.get(product.id) ?? null;
    const metrics = line
      ? productionPlanLineMetrics(document, month, line)
      : productionPlanLineMetrics(document, month, {
          id: `production-plan-line:${month}:${product.id}`,
          productId: product.id,
          volumePieces: plannedProductionVolumePieces(document, month, product.id),
        });

    const volumePieces = plannedProductionVolumePieces(document, month, product.id);
    rowByProduct.set(product.id, {
      productId: product.id,
      name: product.name,
      deleted: product.deletedAt !== null,
      planLineId: line?.id ?? null,
      volumePieces,
      vatPercent: product.vatPercent,
      metrics,
    });
  }

  const groups: ProductionPlanGroup[] = periodGridCategories(document, products).map((category) => {
    const rows = products
      .filter((item) => item.categoryId === category.id)
      .sort((left, right) => left.name.localeCompare(right.name, 'ru'))
      .flatMap((item) => {
        const row = rowByProduct.get(item.id);
        return row ? [row] : [];
      });

    return {
      categoryId: category.id,
      name: category.name,
      deleted: category.deletedAt !== null,
      rows,
      totals: rows.length > 0 ? totalsFromRows(rows) : emptyTotals(),
    };
  });

  return {
    month,
    plan,
    groups,
    totals: productionPlanTotals(document, plan, new Set(products.map((item) => item.id))),
  };
}

function monthIsTaken(document: PrototypeDocument, month: string, exceptId?: string): boolean {
  return activeProductionPlans(document).some((item) => item.month === month && item.id !== exceptId);
}

function planIsOpen(plan: ProductionPlan, today: Date): boolean {
  return plan.deletedAt === null && planMonthOpen(plan.month, today);
}

function createRejection(
  document: PrototypeDocument,
  month: string,
  lines: readonly ProductionPlanLine[],
  today: Date,
): ProductionPlanRejection | null {
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

  const seenProducts = new Set<string>();
  for (const line of lines) {
    if (!expected.has(line.productId) || seenProducts.has(line.productId)) {
      return 'products';
    }
    if (!isVolume(line.volumePieces)) {
      return 'volume';
    }
    seenProducts.add(line.productId);
  }

  return null;
}

export function addProductionPlan(
  document: PrototypeDocument,
  id: string,
  month: string,
  lines: readonly ProductionPlanLine[],
  today: Date,
): PrototypeDocument {
  if (createRejection(document, month, lines, today)) {
    return document;
  }

  const plan: ProductionPlan = {
    id,
    month,
    lines: lines.map((line) => ({ ...line })),
    deletedAt: null,
  };

  return { ...document, productionPlans: [...document.productionPlans, plan] };
}

function openPlan(document: PrototypeDocument, planId: string): ProductionPlan | null {
  return document.productionPlans.find((item) => item.id === planId && item.deletedAt === null) ?? null;
}

export function updateProductionPlanLineRejection(
  document: PrototypeDocument,
  planId: string,
  lineId: string,
  volumePieces: number,
  today: Date,
): ProductionPlanRejection | null {
  const plan = document.productionPlans.find((item) => item.id === planId);
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
  if (!product) {
    return 'missing';
  }

  if (!isVolume(volumePieces)) {
    return 'volume';
  }

  return null;
}

export function updateProductionPlanLine(
  document: PrototypeDocument,
  planId: string,
  lineId: string,
  volumePieces: number,
  today: Date,
): PrototypeDocument {
  if (updateProductionPlanLineRejection(document, planId, lineId, volumePieces, today)) {
    return document;
  }

  const plan = openPlan(document, planId);
  const line = plan?.lines.find((item) => item.id === lineId);
  if (!plan || !line) {
    return document;
  }
  if (line.volumePieces === volumePieces) {
    return document;
  }

  return {
    ...document,
    productionPlans: document.productionPlans.map((item) =>
      item.id === planId
        ? {
            ...item,
            lines: item.lines.map((entry) => (entry.id === lineId ? { ...entry, volumePieces } : entry)),
          }
        : item,
    ),
  };
}

export function addMissingProductionPlanLinesRejection(
  document: PrototypeDocument,
  planId: string,
  lines: readonly { id: string; productId: string }[],
  today: Date,
): ProductionPlanRejection | null {
  const plan = openPlan(document, planId);
  if (!plan) {
    return 'missing';
  }
  if (!planIsOpen(plan, today)) {
    return 'closed';
  }

  const missing = new Set(missingProductionPlanProducts(document, plan).map((item) => item.id));
  if (missing.size === 0) {
    return lines.length === 0 ? null : 'products';
  }
  if (lines.length !== missing.size) {
    return 'products';
  }

  const seenProducts = new Set<string>();
  for (const line of lines) {
    if (!missing.has(line.productId) || seenProducts.has(line.productId)) {
      return 'products';
    }
    seenProducts.add(line.productId);
  }

  return null;
}

export function addMissingProductionPlanLines(
  document: PrototypeDocument,
  planId: string,
  lines: readonly { id: string; productId: string }[],
  today: Date,
): PrototypeDocument {
  if (addMissingProductionPlanLinesRejection(document, planId, lines, today)) {
    return document;
  }
  if (lines.length === 0) {
    return document;
  }

  const plan = openPlan(document, planId);
  if (!plan) {
    return document;
  }

  const nextLines: ProductionPlanLine[] = lines.map((line) => ({
    id: line.id,
    productId: line.productId,
    volumePieces: 0,
  }));

  return {
    ...document,
    productionPlans: document.productionPlans.map((item) =>
      item.id === planId ? { ...item, lines: [...item.lines, ...nextLines] } : item,
    ),
  };
}
