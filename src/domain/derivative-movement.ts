import { derivativeSections, derivativesList, outputPieceThousandthsOf } from '@/domain/derivatives';
import type { Derivative, DerivativeUnit, DerivativeWorkshopId, PrototypeDocument } from '@/domain/document';
import { ratioRound } from '@/domain/money';
import { QUANTITY_SCALE } from '@/domain/quantity';
import { workingSalesInMonth } from '@/domain/sales';
import { planSalesVolumePiecesForProduct } from '@/domain/sales-plan';

export type DerivativeMovementRow = {
  derivativeId: string;
  name: string;
  unit: DerivativeUnit;
  /** План расхода на продажи месяца, тысячные доли единицы производной. */
  planConsumptionQuantity: number;
  /** Факт расхода по фактическим продажам месяца, тысячные доли единицы. */
  factConsumptionQuantity: number;
};

export type DerivativeMovementSection = {
  workshopId: DerivativeWorkshopId;
  name: string;
  rows: DerivativeMovementRow[];
};

export type DerivativeMovementMonthView = {
  month: string;
  sections: DerivativeMovementSection[];
};

/** Размер партии рецепта производной в тысячных долях её единицы. */
function derivativeBatchThousandths(derivative: Derivative): number {
  if (derivative.unit === 'шт') {
    return outputPieceThousandthsOf(derivative) ?? QUANTITY_SCALE;
  }
  return derivative.outputKilogramThousandths;
}

/**
 * Сколько целевой производной нужно, чтобы получить `neededParentThousandths`
 * единиц родительской (по рецепту родителя и вложенным производным).
 * Единицы — тысячные доли единицы каждой производной.
 */
function requirementFromDerivative(
  document: PrototypeDocument,
  parentId: string,
  targetId: string,
  neededParentThousandths: number,
  visiting: Set<string>,
): number {
  if (neededParentThousandths === 0) {
    return 0;
  }
  if (parentId === targetId) {
    return neededParentThousandths;
  }
  if (visiting.has(parentId)) {
    return 0;
  }

  const parent = derivativesList(document).find((item) => item.id === parentId);
  if (!parent) {
    return 0;
  }

  const batch = derivativeBatchThousandths(parent);
  if (batch <= 0) {
    return 0;
  }

  visiting.add(parentId);
  let total = 0;
  for (const line of parent.lines) {
    if (line.componentKind !== 'derivative') {
      continue;
    }
    const neededOfComponent = ratioRound(line.quantity * neededParentThousandths, batch) ?? 0;
    if (neededOfComponent === 0) {
      continue;
    }
    if (line.componentId === targetId) {
      total += neededOfComponent;
      continue;
    }
    total += requirementFromDerivative(document, line.componentId, targetId, neededOfComponent, visiting);
  }
  visiting.delete(parentId);
  return total;
}

/**
 * Расход производной по объёмам продаж готовой продукции и рецептам
 * (готовая → производные по цепочке). Тысячные доли единицы производной.
 */
function consumptionQuantityForDerivative(
  document: PrototypeDocument,
  derivativeId: string,
  volumePiecesForProduct: (productId: string) => number,
): number {
  let total = 0;

  for (const product of document.products) {
    const volumePieces = volumePiecesForProduct(product.id);
    if (volumePieces === 0) {
      continue;
    }

    const batchPieces = product.outputPieceThousandths;
    if (!batchPieces || batchPieces <= 0) {
      continue;
    }

    for (const line of product.lines ?? []) {
      if (line.componentKind !== 'derivative') {
        continue;
      }
      // line.quantity — на партию outputPieceThousandths; volumePieces — целые штуки продаж.
      const neededOfComponent = ratioRound(line.quantity * volumePieces * QUANTITY_SCALE, batchPieces) ?? 0;
      if (neededOfComponent === 0) {
        continue;
      }
      if (line.componentId === derivativeId) {
        total += neededOfComponent;
        continue;
      }
      total += requirementFromDerivative(document, line.componentId, derivativeId, neededOfComponent, new Set());
    }
  }

  return total;
}

/**
 * План расхода производной за месяц: из плана продаж готовой продукции
 * и рецептов (готовая → производные по цепочке).
 * Тысячные доли единицы производной (шт или кг).
 */
export function planConsumptionQuantityForDerivative(
  document: PrototypeDocument,
  derivativeId: string,
  month: string,
): number {
  return consumptionQuantityForDerivative(document, derivativeId, (productId) =>
    planSalesVolumePiecesForProduct(document, productId, month),
  );
}

/** Фактический объём продаж товара за месяц, шт. Нет продаж — 0. */
export function factSalesVolumePiecesForProduct(document: PrototypeDocument, productId: string, month: string): number {
  let pieces = 0;
  for (const sale of workingSalesInMonth(document, month)) {
    for (const line of sale.lines) {
      if (line.productId === productId) {
        pieces += line.pieces;
      }
    }
  }
  return pieces;
}

/**
 * Факт расхода производной за месяц: те же рецепты, что у плана,
 * объём — фактические продажи месяца (уже введённые дни).
 * Тысячные доли единицы производной (шт или кг).
 */
export function factConsumptionQuantityForDerivative(
  document: PrototypeDocument,
  derivativeId: string,
  month: string,
): number {
  return consumptionQuantityForDerivative(document, derivativeId, (productId) =>
    factSalesVolumePiecesForProduct(document, productId, month),
  );
}

/** Свод месяца: рабочие производные по цехам, план и факт расхода на продажи. */
export function derivativeMovementMonth(document: PrototypeDocument, month: string): DerivativeMovementMonthView {
  const sections = derivativeSections(document)
    .map((section) => ({
      workshopId: section.workshopId,
      name: section.name,
      rows: section.items.map((item) => ({
        derivativeId: item.id,
        name: item.name,
        unit: item.unit,
        planConsumptionQuantity: planConsumptionQuantityForDerivative(document, item.id, month),
        factConsumptionQuantity: factConsumptionQuantityForDerivative(document, item.id, month),
      })),
    }))
    .filter((section) => section.rows.length > 0);

  return { month, sections };
}
