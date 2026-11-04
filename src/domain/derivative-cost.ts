import {
  activeDerivatives,
  derivativeByIdOrNull,
  derivativeSections,
  derivativesList,
  outputPieceThousandthsOf,
} from '@/domain/derivatives';
import type { DerivativeUnit, DerivativeWorkshopId, PrototypeDocument } from '@/domain/document';
import { type MaterialMoney, materialById, materialConsumptionPrice, materialPlanPrice } from '@/domain/materials';
import { ratioRound } from '@/domain/money';
import { QUANTITY_SCALE } from '@/domain/quantity';
import { derivativeBatchThousandths } from '@/domain/recipe-consumption';

export type DerivativeCostMode = 'plan' | 'fact';

const ZERO_MONEY: MaterialMoney = { withVat: 0, exVat: 0 };

function costForQuantity(price: MaterialMoney, quantityThousandths: number): MaterialMoney {
  return {
    withVat: ratioRound(price.withVat * quantityThousandths, QUANTITY_SCALE) ?? 0,
    exVat: ratioRound(price.exVat * quantityThousandths, QUANTITY_SCALE) ?? 0,
  };
}

function subtractMoney(left: MaterialMoney, right: MaterialMoney): MaterialMoney {
  return { withVat: left.withVat - right.withVat, exVat: left.exVat - right.exVat };
}

function unitPriceFromBatch(batchCost: MaterialMoney, batchThousandths: number): MaterialMoney {
  if (batchThousandths <= 0) {
    return ZERO_MONEY;
  }
  return {
    withVat: ratioRound(batchCost.withVat * QUANTITY_SCALE, batchThousandths) ?? 0,
    exVat: ratioRound(batchCost.exVat * QUANTITY_SCALE, batchThousandths) ?? 0,
  };
}

/**
 * Стоимость партии производной из рецепта и цен компонентов.
 * Rec&Calc Meat/Bakery/Vegetables: сумма вкладов строк (план — DSM!$J$, факт — DSM!$T$).
 * Плановая потребность в объёмы DSM не входит.
 */
function derivativeBatchCostInternal(
  document: PrototypeDocument,
  derivativeId: string,
  month: string,
  mode: DerivativeCostMode,
  visiting: Set<string>,
): MaterialMoney {
  if (visiting.has(derivativeId)) {
    return ZERO_MONEY;
  }
  const derivative = derivativesList(document).find((item) => item.id === derivativeId);
  if (!derivative) {
    return ZERO_MONEY;
  }

  visiting.add(derivativeId);
  let batchWithVat = 0;
  let batchExVat = 0;

  for (const line of derivative.lines) {
    if (line.quantity <= 0) {
      continue;
    }
    const componentPrice = componentUnitPriceInternal(
      document,
      line.componentKind,
      line.componentId,
      month,
      mode,
      visiting,
    );
    const lineCost = costForQuantity(componentPrice, line.quantity);
    batchWithVat += lineCost.withVat;
    batchExVat += lineCost.exVat;
  }

  visiting.delete(derivativeId);
  return { withVat: batchWithVat, exVat: batchExVat };
}

function componentUnitPriceInternal(
  document: PrototypeDocument,
  kind: 'material' | 'derivative',
  id: string,
  month: string,
  mode: DerivativeCostMode,
  visiting: Set<string>,
): MaterialMoney {
  if (kind === 'material') {
    return mode === 'plan' ? materialPlanPrice(document, month, id) : materialConsumptionPrice(document, month, id);
  }
  const nested = derivativesList(document).find((item) => item.id === id);
  if (!nested) {
    return ZERO_MONEY;
  }
  const batch = derivativeBatchThousandths(nested);
  if (batch <= 0) {
    return ZERO_MONEY;
  }
  return unitPriceFromBatch(derivativeBatchCostInternal(document, id, month, mode, visiting), batch);
}

/** Стоимость одной партии производной (сумма вкладов строк рецепта). */
export function derivativeBatchCost(
  document: PrototypeDocument,
  derivativeId: string,
  month: string,
  mode: DerivativeCostMode,
): MaterialMoney {
  return derivativeBatchCostInternal(document, derivativeId, month, mode, new Set());
}

/**
 * Расчётная цена 1 единицы производной (шт или кг) из цен компонентов рецепта.
 * Та же цифра, что цена расхода/прихода на своде движения производных.
 */
export function derivativeConsumptionPrice(
  document: PrototypeDocument,
  derivativeId: string,
  month: string,
  mode: DerivativeCostMode,
): MaterialMoney {
  const derivative = derivativesList(document).find((item) => item.id === derivativeId);
  if (!derivative) {
    return ZERO_MONEY;
  }
  const batch = derivativeBatchThousandths(derivative);
  return unitPriceFromBatch(derivativeBatchCost(document, derivativeId, month, mode), batch);
}

function costPerKgFromBatch(batchCost: MaterialMoney, outputKilogramThousandths: number): MaterialMoney {
  return unitPriceFromBatch(batchCost, outputKilogramThousandths);
}

function costPerPieceFromBatch(
  batchCost: MaterialMoney,
  unit: DerivativeUnit,
  outputPieceThousandths: number | null,
): MaterialMoney | null {
  if (unit !== 'шт') {
    return null;
  }
  const pieces = outputPieceThousandthsOf({ outputPieceThousandths });
  if (pieces === null) {
    return null;
  }
  return unitPriceFromBatch(batchCost, pieces);
}

export type DerivativeCostRow = {
  derivativeId: string;
  name: string;
  unit: DerivativeUnit;
  /** Есть ₽/шт: единица «шт» и заданы штуки партии. */
  hasPieceCost: boolean;
  planCostPerKg: MaterialMoney;
  factCostPerKg: MaterialMoney;
  /** Факт − план, ₽/кг. */
  costPerKgDeviation: MaterialMoney;
  planCostPerPiece: MaterialMoney | null;
  factCostPerPiece: MaterialMoney | null;
  costPerPieceDeviation: MaterialMoney | null;
};

export type DerivativeCostSection = {
  workshopId: DerivativeWorkshopId;
  name: string;
  rows: DerivativeCostRow[];
};

export type DerivativeCostMonthView = {
  month: string;
  sections: DerivativeCostSection[];
};

function buildCostRow(document: PrototypeDocument, month: string, derivativeId: string): DerivativeCostRow | null {
  const derivative = activeDerivatives(document).find((item) => item.id === derivativeId);
  if (!derivative) {
    return null;
  }
  const planBatch = derivativeBatchCost(document, derivative.id, month, 'plan');
  const factBatch = derivativeBatchCost(document, derivative.id, month, 'fact');
  const planCostPerKg = costPerKgFromBatch(planBatch, derivative.outputKilogramThousandths);
  const factCostPerKg = costPerKgFromBatch(factBatch, derivative.outputKilogramThousandths);
  const planCostPerPiece = costPerPieceFromBatch(planBatch, derivative.unit, derivative.outputPieceThousandths);
  const factCostPerPiece = costPerPieceFromBatch(factBatch, derivative.unit, derivative.outputPieceThousandths);
  const hasPieceCost = planCostPerPiece !== null && factCostPerPiece !== null;
  return {
    derivativeId: derivative.id,
    name: derivative.name,
    unit: derivative.unit,
    hasPieceCost,
    planCostPerKg,
    factCostPerKg,
    costPerKgDeviation: subtractMoney(factCostPerKg, planCostPerKg),
    planCostPerPiece,
    factCostPerPiece,
    costPerPieceDeviation:
      hasPieceCost && planCostPerPiece && factCostPerPiece ? subtractMoney(factCostPerPiece, planCostPerPiece) : null,
  };
}

/** Свод себестоимости производственных за месяц по цехам. Rec&Calc блоки «себестоимость 1 кг». */
export function derivativeCostMonth(document: PrototypeDocument, month: string): DerivativeCostMonthView {
  return {
    month,
    sections: derivativeSections(document).map((section) => ({
      workshopId: section.workshopId,
      name: section.name,
      rows: section.items
        .map((item) => buildCostRow(document, month, item.id))
        .filter((row): row is DerivativeCostRow => row !== null),
    })),
  };
}

export type DerivativeCostLineContribution = {
  lineId: string;
  componentKind: 'material' | 'derivative';
  componentId: string;
  name: string;
  unit: string;
  /** Тысячные доли единицы компонента в партии. */
  quantity: number;
  planUnitPrice: MaterialMoney;
  factUnitPrice: MaterialMoney;
  planContribution: MaterialMoney;
  factContribution: MaterialMoney;
  contributionDeviation: MaterialMoney;
};

export type DerivativeCostDetail = DerivativeCostRow & {
  month: string;
  lines: DerivativeCostLineContribution[];
};

/**
 * Состав себестоимости строки: прямые ингредиенты рецепта с вкладом в стоимость партии.
 * Нулевые количества и отсутствующие компоненты не показывают.
 */
export function derivativeCostDetail(
  document: PrototypeDocument,
  derivativeId: string,
  month: string,
): DerivativeCostDetail | null {
  const row = buildCostRow(document, month, derivativeId);
  const derivative = derivativeByIdOrNull(document, derivativeId);
  if (!row || !derivative || derivative.deletedAt !== null) {
    return null;
  }

  const lines: DerivativeCostLineContribution[] = [];
  for (const line of derivative.lines) {
    if (line.quantity <= 0) {
      continue;
    }
    let name: string;
    let unit: string;
    if (line.componentKind === 'material') {
      const material = materialById(document, line.componentId);
      if (!material) {
        continue;
      }
      name = material.name;
      unit = material.unit;
    } else {
      const component = derivativeByIdOrNull(document, line.componentId);
      if (!component) {
        continue;
      }
      name = component.name;
      unit = component.unit;
    }

    const planUnitPrice = componentUnitPriceInternal(
      document,
      line.componentKind,
      line.componentId,
      month,
      'plan',
      new Set([derivativeId]),
    );
    const factUnitPrice = componentUnitPriceInternal(
      document,
      line.componentKind,
      line.componentId,
      month,
      'fact',
      new Set([derivativeId]),
    );
    const planContribution = costForQuantity(planUnitPrice, line.quantity);
    const factContribution = costForQuantity(factUnitPrice, line.quantity);
    if (
      planContribution.withVat === 0 &&
      planContribution.exVat === 0 &&
      factContribution.withVat === 0 &&
      factContribution.exVat === 0
    ) {
      continue;
    }

    lines.push({
      lineId: line.id,
      componentKind: line.componentKind,
      componentId: line.componentId,
      name,
      unit,
      quantity: line.quantity,
      planUnitPrice,
      factUnitPrice,
      planContribution,
      factContribution,
      contributionDeviation: subtractMoney(factContribution, planContribution),
    });
  }

  return { ...row, month, lines };
}
