import { derivativesList, outputPieceThousandthsOf } from '@/domain/derivatives';
import type { Derivative, DerivativeConsumptionDay, PrototypeDocument } from '@/domain/document';
import { ratioRound } from '@/domain/money';
import { QUANTITY_SCALE } from '@/domain/quantity';

export type RecipeComponentTarget = {
  kind: 'material' | 'derivative';
  id: string;
};

/** Размер партии рецепта производной в тысячных долях её единицы. */
export function derivativeBatchThousandths(derivative: Derivative): number {
  if (derivative.unit === 'шт') {
    return outputPieceThousandthsOf(derivative) ?? QUANTITY_SCALE;
  }
  return derivative.outputKilogramThousandths;
}

export function derivativeConsumptionDaysList(document: PrototypeDocument): DerivativeConsumptionDay[] {
  return document.derivativeConsumptionDays ?? [];
}

/** Реальный выпуск (приход) производной за месяц: сумма дневного ввода. */
export function realReceiptQuantityForDerivative(
  document: PrototypeDocument,
  derivativeId: string,
  month: string,
): number {
  let total = 0;
  for (const day of derivativeConsumptionDaysList(document)) {
    if (!day.occurredOn.startsWith(`${month}-`)) {
      continue;
    }
    for (const line of day.lines) {
      if (line.derivativeId === derivativeId) {
        total += line.receiptQuantity ?? 0;
      }
    }
  }
  return total;
}

/** Реальный выпуск (приход) производной за один день. Нет строки — 0. */
export function realReceiptQuantityForDerivativeDay(
  document: PrototypeDocument,
  occurredOn: string,
  derivativeId: string,
): number {
  const day = derivativeConsumptionDaysList(document).find((item) => item.occurredOn === occurredOn);
  return day?.lines.find((line) => line.derivativeId === derivativeId)?.receiptQuantity ?? 0;
}

/** Реальный расход производной за месяц: сумма дневного ввода. */
export function realConsumptionQuantityForDerivative(
  document: PrototypeDocument,
  derivativeId: string,
  month: string,
): number {
  let total = 0;
  for (const day of derivativeConsumptionDaysList(document)) {
    if (!day.occurredOn.startsWith(`${month}-`)) {
      continue;
    }
    for (const line of day.lines) {
      if (line.derivativeId === derivativeId) {
        total += line.quantity;
      }
    }
  }
  return total;
}

/** Реальный расход производной за один день. Нет строки — 0. */
export function realConsumptionQuantityForDerivativeDay(
  document: PrototypeDocument,
  occurredOn: string,
  derivativeId: string,
): number {
  const day = derivativeConsumptionDaysList(document).find((item) => item.occurredOn === occurredOn);
  return day?.lines.find((line) => line.derivativeId === derivativeId)?.quantity ?? 0;
}

/** Фактический объём выпуска товара за месяц из журнала выпуска, шт. Нет выпуска — 0. */
export function factProductionVolumePiecesForProduct(
  document: PrototypeDocument,
  productId: string,
  month: string,
): number {
  let pieces = 0;
  const prefix = `${month}-`;
  for (const entry of document.productionEntries ?? []) {
    if (!entry.occurredOn.startsWith(prefix)) {
      continue;
    }
    for (const line of entry.lines) {
      if (line.productId === productId) {
        pieces += line.pieces;
      }
    }
  }
  return pieces;
}

/** Фактический объём выпуска товара за один день из журнала выпуска, шт. Нет выпуска — 0. */
export function factProductionVolumePiecesForProductDay(
  document: PrototypeDocument,
  productId: string,
  occurredOn: string,
): number {
  let pieces = 0;
  for (const entry of document.productionEntries ?? []) {
    if (entry.occurredOn !== occurredOn) {
      continue;
    }
    for (const line of entry.lines) {
      if (line.productId === productId) {
        pieces += line.pieces;
      }
    }
  }
  return pieces;
}

/**
 * Сколько целевого компонента (сырья или производной) нужно, чтобы получить
 * `neededParentThousandths` единиц родительской производной (по её рецепту и вложенным производным).
 * Единицы — тысячные доли единицы каждого компонента.
 */
function requirementFromDerivative(
  document: PrototypeDocument,
  parentId: string,
  target: RecipeComponentTarget,
  neededParentThousandths: number,
  visiting: Set<string>,
): number {
  if (neededParentThousandths === 0) {
    return 0;
  }
  if (target.kind === 'derivative' && parentId === target.id) {
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
    const neededOfComponent = ratioRound(line.quantity * neededParentThousandths, batch) ?? 0;
    if (neededOfComponent === 0) {
      continue;
    }
    if (line.componentKind === target.kind && line.componentId === target.id) {
      total += neededOfComponent;
      continue;
    }
    if (line.componentKind === 'derivative') {
      total += requirementFromDerivative(document, line.componentId, target, neededOfComponent, visiting);
    }
  }
  visiting.delete(parentId);
  return total;
}

/**
 * Расход компонента (производной или сырья) по объёмам выпуска готовой продукции
 * и рецептам (готовая → производные по цепочке).
 * Тысячные доли единицы целевого компонента.
 */
export function consumptionQuantityForComponent(
  document: PrototypeDocument,
  target: RecipeComponentTarget,
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
      // line.quantity — на партию outputPieceThousandths; volumePieces — целые штуки выпуска.
      const neededOfComponent = ratioRound(line.quantity * volumePieces * QUANTITY_SCALE, batchPieces) ?? 0;
      if (neededOfComponent === 0) {
        continue;
      }
      if (line.componentKind === target.kind && line.componentId === target.id) {
        total += neededOfComponent;
        continue;
      }
      if (line.componentKind === 'derivative') {
        total += requirementFromDerivative(document, line.componentId, target, neededOfComponent, new Set());
      }
    }
  }

  return total;
}

/**
 * Эффективный объём выпуска производной для расчёта потребности в её собственных ингредиентах:
 * 1) если введён реальный выпуск (`realReceipt > 0`) — берём его;
 * 2) иначе если введён реальный расход (`realConsumption > 0`) — берём его;
 * 3) иначе — расчётная потребность в этой производной от её родителей (ГП и родительских производных).
 */
function effectiveDerivativeVolumeInternal(
  document: PrototypeDocument,
  derivativeId: string,
  volumePiecesForProduct: (productId: string) => number,
  realReceiptForDerivative: (derivativeId: string) => number,
  realConsumptionForDerivative: (derivativeId: string) => number,
  visiting: Set<string>,
): number {
  if (visiting.has(derivativeId)) {
    return 0;
  }
  const realReceipt = realReceiptForDerivative(derivativeId);
  if (realReceipt > 0) {
    return realReceipt;
  }
  const realConsumption = realConsumptionForDerivative(derivativeId);
  if (realConsumption > 0) {
    return realConsumption;
  }
  visiting.add(derivativeId);
  const calculated = directConsumptionQuantityInternal(
    document,
    { kind: 'derivative', id: derivativeId },
    volumePiecesForProduct,
    realReceiptForDerivative,
    realConsumptionForDerivative,
    visiting,
  );
  visiting.delete(derivativeId);
  return calculated;
}

function directConsumptionQuantityInternal(
  document: PrototypeDocument,
  target: RecipeComponentTarget,
  volumePiecesForProduct: (productId: string) => number,
  realReceiptForDerivative: (derivativeId: string) => number,
  realConsumptionForDerivative: (derivativeId: string) => number,
  visiting: Set<string>,
): number {
  let total = 0;

  for (const product of document.products) {
    const volumePieces = volumePiecesForProduct(product.id);
    if (volumePieces <= 0) {
      continue;
    }
    const batchPieces = product.outputPieceThousandths;
    if (!batchPieces || batchPieces <= 0) {
      continue;
    }
    for (const line of product.lines ?? []) {
      if (line.componentKind !== target.kind || line.componentId !== target.id) {
        continue;
      }
      const neededOfComponent = ratioRound(line.quantity * volumePieces * QUANTITY_SCALE, batchPieces) ?? 0;
      total += neededOfComponent;
    }
  }

  for (const derivative of derivativesList(document)) {
    if (target.kind === 'derivative' && derivative.id === target.id) {
      continue;
    }
    const touchesTarget = derivative.lines.some(
      (line) => line.componentKind === target.kind && line.componentId === target.id,
    );
    if (!touchesTarget) {
      continue;
    }
    const producedThousandths = effectiveDerivativeVolumeInternal(
      document,
      derivative.id,
      volumePiecesForProduct,
      realReceiptForDerivative,
      realConsumptionForDerivative,
      visiting,
    );
    if (producedThousandths <= 0) {
      continue;
    }
    const batch = derivativeBatchThousandths(derivative);
    if (batch <= 0) {
      continue;
    }
    for (const line of derivative.lines) {
      if (line.componentKind !== target.kind || line.componentId !== target.id) {
        continue;
      }
      const neededOfComponent = ratioRound(line.quantity * producedThousandths, batch) ?? 0;
      total += neededOfComponent;
    }
  }

  return total;
}

/**
 * Расчётный расход компонента (производной или сырья) от фактического выпуска:
 * 1) прямые строки рецепта готовой продукции × фактический выпуск готовой продукции,
 * 2) прямые строки рецепта производных × эффективный выпуск производных (реальный выпуск,
 *    а если он равен 0 — реальный или расчётный расход этой производной).
 * Тысячные доли единицы целевого компонента.
 */
export function directConsumptionQuantityForComponent(
  document: PrototypeDocument,
  target: RecipeComponentTarget,
  volumePiecesForProduct: (productId: string) => number,
  realReceiptForDerivative: (derivativeId: string) => number,
  realConsumptionForDerivative: (derivativeId: string) => number = () => 0,
): number {
  return directConsumptionQuantityInternal(
    document,
    target,
    volumePiecesForProduct,
    realReceiptForDerivative,
    realConsumptionForDerivative,
    new Set(),
  );
}

/**
 * Расчётный факт расхода производной за месяц: прямые рецепты готовой продукции (на фактический выпуск ГП)
 * и прямые рецепты других производных (на реальный выпуск этих производных, с подстраховкой по расходу при 0).
 * Тысячные доли единицы производной (шт или кг).
 */
export function factConsumptionQuantityForDerivative(
  document: PrototypeDocument,
  derivativeId: string,
  month: string,
): number {
  return directConsumptionQuantityForComponent(
    document,
    { kind: 'derivative', id: derivativeId },
    (productId) => factProductionVolumePiecesForProduct(document, productId, month),
    (parentDerivativeId) => realReceiptQuantityForDerivative(document, parentDerivativeId, month),
    (parentDerivativeId) => realConsumptionQuantityForDerivative(document, parentDerivativeId, month),
  );
}

/** Расчётный расход производной за день: рецепт × выпуск готовой продукции и производных этого дня. */
export function calculatedConsumptionQuantityForDerivativeDay(
  document: PrototypeDocument,
  occurredOn: string,
  derivativeId: string,
): number {
  return directConsumptionQuantityForComponent(
    document,
    { kind: 'derivative', id: derivativeId },
    (productId) => factProductionVolumePiecesForProductDay(document, productId, occurredOn),
    (parentDerivativeId) => realReceiptQuantityForDerivativeDay(document, occurredOn, parentDerivativeId),
    (parentDerivativeId) => realConsumptionQuantityForDerivativeDay(document, occurredOn, parentDerivativeId),
  );
}

/**
 * Расчётный факт расхода сырья за месяц: прямые рецепты готовой продукции (на фактический выпуск ГП)
 * и прямые рецепты производных (на реальный выпуск производных, с подстраховкой по расходу при 0).
 * Тысячные доли единицы сырья.
 */
export function factConsumptionQuantityForMaterial(
  document: PrototypeDocument,
  materialId: string,
  month: string,
): number {
  return directConsumptionQuantityForComponent(
    document,
    { kind: 'material', id: materialId },
    (productId) => factProductionVolumePiecesForProduct(document, productId, month),
    (derivativeId) => realReceiptQuantityForDerivative(document, derivativeId, month),
    (derivativeId) => realConsumptionQuantityForDerivative(document, derivativeId, month),
  );
}

/** Расчётный расход позиции сырья за день: рецепт × выпуск готовой продукции и производных этого дня. */
export function calculatedConsumptionQuantityForMaterialDay(
  document: PrototypeDocument,
  occurredOn: string,
  materialId: string,
): number {
  return directConsumptionQuantityForComponent(
    document,
    { kind: 'material', id: materialId },
    (productId) => factProductionVolumePiecesForProductDay(document, productId, occurredOn),
    (derivativeId) => realReceiptQuantityForDerivativeDay(document, occurredOn, derivativeId),
    (derivativeId) => realConsumptionQuantityForDerivativeDay(document, occurredOn, derivativeId),
  );
}

/** Реальный расход позиции сырья за месяц по её `id`: сумма дневного ввода. */
export function realConsumptionQuantityForMaterialById(
  document: PrototypeDocument,
  month: string,
  materialId: string,
): number {
  let total = 0;
  for (const day of document.materialConsumptionDays ?? []) {
    if (!day.occurredOn.startsWith(`${month}-`)) {
      continue;
    }
    for (const line of day.lines) {
      if (line.materialId === materialId) {
        total += line.quantity;
      }
    }
  }
  return total;
}

/**
 * Эффективное фактическое количество компонента на партию рецепта с учётом перерасхода/экономии за месяц:
 * `recipeQuantity × реальный расход месяца / расчётный расход месяца`.
 * Если расчётного или реального расхода за месяц нет, возвращает норму по рецепту (`recipeQuantity`).
 */
export function effectiveFactLineQuantity(
  document: PrototypeDocument,
  month: string,
  componentKind: 'material' | 'derivative',
  componentId: string,
  recipeQuantity: number,
): number {
  if (recipeQuantity <= 0) {
    return 0;
  }
  const calculated =
    componentKind === 'material'
      ? factConsumptionQuantityForMaterial(document, componentId, month)
      : factConsumptionQuantityForDerivative(document, componentId, month);
  const real =
    componentKind === 'material'
      ? realConsumptionQuantityForMaterialById(document, month, componentId)
      : realConsumptionQuantityForDerivative(document, componentId, month);
  if (calculated <= 0 || real <= 0) {
    return recipeQuantity;
  }
  return ratioRound(recipeQuantity * real, calculated) ?? recipeQuantity;
}
