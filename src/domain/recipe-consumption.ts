import { derivativesList, outputPieceThousandthsOf } from '@/domain/derivatives';
import type { Derivative, PrototypeDocument } from '@/domain/document';
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
