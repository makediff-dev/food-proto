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

  // шт: вес штуки = рассчитанный выход / число штук партии; нет штук — как на 1 шт.
  const pieces =
    derivative.outputPieceThousandths != null &&
    isQuantityThousandths(derivative.outputPieceThousandths, false) &&
    derivative.outputPieceThousandths > 0
      ? derivative.outputPieceThousandths
      : QUANTITY_SCALE;
  return ratioRound(line.quantity * derivative.outputKilogramThousandths, pieces) ?? 0;
}

/**
 * Граммы на штуку (тысячные доли г) из рассчитанного выхода и числа штук.
 * 1 тысячная кг = 1 г.
 */
export function gramsPerPieceThousandths(outputKilogramThousandths: number, pieceThousandths: number): number | null {
  if (!isQuantityThousandths(pieceThousandths, false) || pieceThousandths <= 0) {
    return null;
  }
  return ratioRound(outputKilogramThousandths * QUANTITY_SCALE * QUANTITY_SCALE, pieceThousandths);
}

/** Рассчитанный выход (тысячные кг) из штук и г/шт. */
export function outputKilogramThousandthsFromPiecesAndGrams(
  pieceThousandths: number,
  gramThousandths: number,
): number | null {
  if (!isQuantityThousandths(pieceThousandths, false) || pieceThousandths <= 0) {
    return null;
  }
  if (!isQuantityThousandths(gramThousandths, false) || gramThousandths < 0) {
    return null;
  }
  return ratioRound(pieceThousandths * gramThousandths, QUANTITY_SCALE * QUANTITY_SCALE);
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

/**
 * «По компонентам» у производной: сумма кг × выход после термообработки / 100.
 * Целый процент; 100 — без потерь. Половина от нуля.
 */
export function applyHeatTreatmentYield(
  componentsKilogramThousandths: number,
  heatTreatmentYieldPercent: number,
): number {
  return ratioRound(componentsKilogramThousandths * heatTreatmentYieldPercent, 100) ?? 0;
}

/** Целый процент выхода после термообработки: больше нуля. */
export function isHeatTreatmentYieldPercent(value: number): boolean {
  return Number.isSafeInteger(value) && value > 0;
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
  heatTreatmentYieldPercent: number = 100,
): 'output' | 'yield' | null {
  const components = applyHeatTreatmentYield(
    recipeComponentsKilogramThousandths(document, lines),
    heatTreatmentYieldPercent,
  );
  return recipeYieldRejection(outputKilogramThousandths, components, lines.length);
}
