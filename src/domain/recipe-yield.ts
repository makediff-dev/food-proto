import {
  type DerivativeLine,
  type MaterialUnit,
  type MaterialWeightPair,
  type ProductRecipeLine,
  type PrototypeDocument,
} from '@/domain/document';
import { ratioRound } from '@/domain/money';
import { isQuantityThousandths, QUANTITY_SCALE } from '@/domain/quantity';

/** Допуск |рассчитан − по компонентам|, тысячные доли кг (= 1 г). */
export const RECIPE_YIELD_TOLERANCE_THOUSANDTHS = 1;

export type RecipeLineRef = {
  componentKind: 'material' | 'derivative';
  componentId: string;
  quantity: number;
};

/**
 * Килограммы закладки материала: для кг — само количество;
 * иначе пропорционально паре веса (половина вверх). Нулевой вес — 0.
 */
export function materialQuantityToKilogramThousandths(
  quantityThousandths: number,
  unit: MaterialUnit,
  weight: MaterialWeightPair | null,
): number {
  if (unit === 'кг') {
    return quantityThousandths;
  }
  if (!weight || weight.unitThousandths <= 0 || weight.kilogramThousandths === 0) {
    return 0;
  }

  return ratioRound(quantityThousandths * weight.kilogramThousandths, weight.unitThousandths) ?? 0;
}

/** Килограммы одной строки состава. Нет компонента — 0. */
export function recipeLineKilogramThousandths(document: PrototypeDocument, line: RecipeLineRef): number {
  if (line.componentKind === 'material') {
    const material = (document.materials ?? []).find((item) => item.id === line.componentId);
    if (!material) {
      return 0;
    }
    return materialQuantityToKilogramThousandths(line.quantity, material.unit, material.weight);
  }

  const derivative = (document.derivatives ?? []).find((item) => item.id === line.componentId);
  if (!derivative) {
    return 0;
  }

  if (derivative.unit === 'кг') {
    return line.quantity;
  }

  // шт: рецепт производной — на одну штуку; вес штуки = рассчитанный выход.
  return ratioRound(line.quantity * derivative.outputKilogramThousandths, QUANTITY_SCALE) ?? 0;
}

/** Сумма кг по компонентам рецепта, тысячные доли. */
export function recipeComponentsKilogramThousandths(
  document: PrototypeDocument,
  lines: readonly RecipeLineRef[],
): number {
  let total = 0;
  for (const line of lines) {
    total += recipeLineKilogramThousandths(document, line);
  }
  return total;
}

export function isRecipeOutputKilogramThousandths(value: number): boolean {
  return isQuantityThousandths(value, false);
}

/**
 * Пустой состав — выход 0. Иначе |рассчитан − по компонентам| не больше 1 г.
 */
export function recipeYieldRejection(
  outputKilogramThousandths: number,
  componentsKilogramThousandths: number,
  linesCount: number,
): 'output' | 'yield' | null {
  if (!isRecipeOutputKilogramThousandths(outputKilogramThousandths)) {
    return 'output';
  }
  if (linesCount === 0) {
    return outputKilogramThousandths === 0 ? null : 'yield';
  }
  if (Math.abs(outputKilogramThousandths - componentsKilogramThousandths) > RECIPE_YIELD_TOLERANCE_THOUSANDTHS) {
    return 'yield';
  }
  return null;
}

export function validateRecipeYield(
  document: PrototypeDocument,
  outputKilogramThousandths: number,
  lines: readonly (DerivativeLine | ProductRecipeLine)[],
): 'output' | 'yield' | null {
  return recipeYieldRejection(
    outputKilogramThousandths,
    recipeComponentsKilogramThousandths(document, lines),
    lines.length,
  );
}
