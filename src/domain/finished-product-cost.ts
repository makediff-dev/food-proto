import { derivativeConsumptionPrice } from '@/domain/derivative-cost';
import { derivativeByIdOrNull } from '@/domain/derivatives';
import type { MaterialWarehouseId, Product, PrototypeDocument } from '@/domain/document';
import { type MaterialMoney, materialById, materialConsumptionPrice, materialPlanPrice } from '@/domain/materials';
import { ratioRound } from '@/domain/money';
import { activeProducts, productByIdOrNull, productRecipeSections } from '@/domain/products';
import { QUANTITY_SCALE } from '@/domain/quantity';

export type FinishedProductCostMode = 'plan' | 'fact';

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

function componentUnitPrice(
  document: PrototypeDocument,
  kind: 'material' | 'derivative',
  id: string,
  month: string,
  mode: FinishedProductCostMode,
): MaterialMoney {
  if (kind === 'material') {
    return mode === 'plan' ? materialPlanPrice(document, month, id) : materialConsumptionPrice(document, month, id);
  }
  return derivativeConsumptionPrice(document, id, month, mode);
}

/**
 * Стоимость партии готовой продукции из рецепта и цен компонентов.
 * Rec&Calc Final Products: сумма вкладов строк (план — DSM!$J$, факт — DSM!$T$).
 * Плановая потребность в объёмы DSM не входит.
 */
export function productBatchCost(
  document: PrototypeDocument,
  productId: string,
  month: string,
  mode: FinishedProductCostMode,
): MaterialMoney {
  const product = activeProducts(document).find((item) => item.id === productId);
  if (!product) {
    return ZERO_MONEY;
  }

  let batchWithVat = 0;
  let batchExVat = 0;

  for (const line of product.lines) {
    if (line.quantity <= 0) {
      continue;
    }
    const componentPrice = componentUnitPrice(document, line.componentKind, line.componentId, month, mode);
    const lineCost = costForQuantity(componentPrice, line.quantity);
    batchWithVat += lineCost.withVat;
    batchExVat += lineCost.exVat;
  }

  return { withVat: batchWithVat, exVat: batchExVat };
}

/** Расчётная себестоимость 1 шт из рецепта. Rec&Calc Final Products!D192 / D326. */
export function productCostPerPiece(
  document: PrototypeDocument,
  productId: string,
  month: string,
  mode: FinishedProductCostMode,
): MaterialMoney {
  const product = activeProducts(document).find((item) => item.id === productId);
  if (!product || product.outputPieceThousandths <= 0) {
    return ZERO_MONEY;
  }
  return unitPriceFromBatch(productBatchCost(document, productId, month, mode), product.outputPieceThousandths);
}

export type FinishedProductCostRow = {
  productId: string;
  name: string;
  warehouseId: MaterialWarehouseId;
  /** Есть ₽/кг: задан ненулевой выход кг партии. */
  hasKilogramCost: boolean;
  planCostPerPiece: MaterialMoney;
  factCostPerPiece: MaterialMoney;
  /** Факт − план, ₽/шт. */
  costPerPieceDeviation: MaterialMoney;
  planCostPerKg: MaterialMoney | null;
  factCostPerKg: MaterialMoney | null;
  costPerKgDeviation: MaterialMoney | null;
};

export type FinishedProductCostSection = {
  warehouseId: MaterialWarehouseId;
  name: string;
  rows: FinishedProductCostRow[];
};

export type FinishedProductCostMonthView = {
  month: string;
  sections: FinishedProductCostSection[];
};

function buildCostRow(document: PrototypeDocument, month: string, product: Product): FinishedProductCostRow {
  const planBatch = productBatchCost(document, product.id, month, 'plan');
  const factBatch = productBatchCost(document, product.id, month, 'fact');
  const planCostPerPiece = unitPriceFromBatch(planBatch, product.outputPieceThousandths);
  const factCostPerPiece = unitPriceFromBatch(factBatch, product.outputPieceThousandths);
  const hasKilogramCost = product.outputKilogramThousandths > 0;
  const planCostPerKg = hasKilogramCost ? unitPriceFromBatch(planBatch, product.outputKilogramThousandths) : null;
  const factCostPerKg = hasKilogramCost ? unitPriceFromBatch(factBatch, product.outputKilogramThousandths) : null;
  return {
    productId: product.id,
    name: product.name,
    warehouseId: product.warehouseId,
    hasKilogramCost,
    planCostPerPiece,
    factCostPerPiece,
    costPerPieceDeviation: subtractMoney(factCostPerPiece, planCostPerPiece),
    planCostPerKg,
    factCostPerKg,
    costPerKgDeviation:
      hasKilogramCost && planCostPerKg && factCostPerKg ? subtractMoney(factCostPerKg, planCostPerKg) : null,
  };
}

/** Свод себестоимости готовой продукции за месяц по заводам. Rec&Calc Final Products. */
export function finishedProductCostMonth(document: PrototypeDocument, month: string): FinishedProductCostMonthView {
  return {
    month,
    sections: productRecipeSections(document).map((section) => ({
      warehouseId: section.warehouseId,
      name: section.name,
      rows: section.items.map((item) => buildCostRow(document, month, item)),
    })),
  };
}

export type FinishedProductCostLineContribution = {
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

export type FinishedProductCostDetail = FinishedProductCostRow & {
  month: string;
  lines: FinishedProductCostLineContribution[];
};

/**
 * Карточка себестоимости: прямые ингредиенты рецепта с вкладом в стоимость партии.
 * Нулевые количества и отсутствующие компоненты не показывают.
 */
export function finishedProductCostDetail(
  document: PrototypeDocument,
  productId: string,
  month: string,
): FinishedProductCostDetail | null {
  const product = productByIdOrNull(document, productId);
  if (!product || product.deletedAt !== null) {
    return null;
  }
  const row = buildCostRow(document, month, product);

  const lines: FinishedProductCostLineContribution[] = [];
  for (const line of product.lines) {
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

    const planUnitPrice = componentUnitPrice(document, line.componentKind, line.componentId, month, 'plan');
    const factUnitPrice = componentUnitPrice(document, line.componentKind, line.componentId, month, 'fact');
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
