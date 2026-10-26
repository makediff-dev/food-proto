import { derivativeSections, derivativesList } from '@/domain/derivatives';
import type { DerivativeUnit, DerivativeWorkshopId, PrototypeDocument } from '@/domain/document';
import { plannedProductionVolumePieces } from '@/domain/finished-goods';
import { type MaterialMoney, materialConsumptionPrice, materialPlanPrice } from '@/domain/materials';
import { ratioRound } from '@/domain/money';
import { QUANTITY_SCALE } from '@/domain/quantity';
import { consumptionQuantityForComponent, derivativeBatchThousandths } from '@/domain/recipe-consumption';

export type DerivativeMovementRow = {
  derivativeId: string;
  name: string;
  unit: DerivativeUnit;
  /** План расхода на выпуск месяца, тысячные доли единицы производной. */
  planConsumptionQuantity: number;
  /** Плановая цена 1 единицы производной (шт или кг) по плановым ценам сырья. */
  planConsumptionPrice: MaterialMoney;
  /** Плановая стоимость расхода: плановая цена × план расхода. */
  planConsumptionCost: MaterialMoney;
  /** Факт расхода по фактическому выпуску месяца, тысячные доли единицы. */
  factConsumptionQuantity: number;
  /** Фактическая цена 1 единицы производной по фактическим ценам расхода сырья. */
  factConsumptionPrice: MaterialMoney;
  /** Фактическая стоимость расхода: фактическая цена × факт расхода. */
  factConsumptionCost: MaterialMoney;
};

export type DerivativeMovementSection = {
  workshopId: DerivativeWorkshopId;
  name: string;
  rows: DerivativeMovementRow[];
  /** Сумма плановой стоимости расхода по цеху. */
  planConsumptionCost: MaterialMoney;
  /** Сумма фактической стоимости расхода по цеху. */
  factConsumptionCost: MaterialMoney;
};

export type DerivativeMovementMonthView = {
  month: string;
  sections: DerivativeMovementSection[];
};

const ZERO_MONEY: MaterialMoney = { withVat: 0, exVat: 0 };

function costForQuantity(price: MaterialMoney, quantityThousandths: number): MaterialMoney {
  return {
    withVat: ratioRound(price.withVat * quantityThousandths, QUANTITY_SCALE) ?? 0,
    exVat: ratioRound(price.exVat * quantityThousandths, QUANTITY_SCALE) ?? 0,
  };
}

function derivativePriceInternal(
  document: PrototypeDocument,
  derivativeId: string,
  month: string,
  mode: 'plan' | 'fact',
  visiting: Set<string>,
): MaterialMoney {
  if (visiting.has(derivativeId)) {
    return ZERO_MONEY;
  }
  const derivative = derivativesList(document).find((item) => item.id === derivativeId);
  if (!derivative) {
    return ZERO_MONEY;
  }
  const batch = derivativeBatchThousandths(derivative);
  if (batch <= 0) {
    return ZERO_MONEY;
  }

  visiting.add(derivativeId);
  let batchWithVat = 0;
  let batchExVat = 0;

  for (const line of derivative.lines) {
    if (line.quantity <= 0) {
      continue;
    }
    const componentPrice =
      line.componentKind === 'material'
        ? mode === 'plan'
          ? materialPlanPrice(document, month, line.componentId)
          : materialConsumptionPrice(document, month, line.componentId)
        : derivativePriceInternal(document, line.componentId, month, mode, visiting);
    const lineCost = costForQuantity(componentPrice, line.quantity);
    batchWithVat += lineCost.withVat;
    batchExVat += lineCost.exVat;
  }

  visiting.delete(derivativeId);
  return {
    withVat: ratioRound(batchWithVat * QUANTITY_SCALE, batch) ?? 0,
    exVat: ratioRound(batchExVat * QUANTITY_SCALE, batch) ?? 0,
  };
}

/** Расчётная цена 1 единицы производной (шт или кг) из цен компонентов рецепта. */
export function derivativeConsumptionPrice(
  document: PrototypeDocument,
  derivativeId: string,
  month: string,
  mode: 'plan' | 'fact',
): MaterialMoney {
  return derivativePriceInternal(document, derivativeId, month, mode, new Set());
}

/**
 * План расхода производной за месяц: из плана выпуска готовой продукции
 * и рецептов (готовая → производные по цепочке).
 * Тысячные доли единицы производной (шт или кг).
 */
export function planConsumptionQuantityForDerivative(
  document: PrototypeDocument,
  derivativeId: string,
  month: string,
): number {
  return consumptionQuantityForComponent(document, { kind: 'derivative', id: derivativeId }, (productId) =>
    plannedProductionVolumePieces(document, month, productId),
  );
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

/**
 * Факт расхода производной за месяц: те же рецепты, что у плана,
 * объём — фактический выпуск месяца из журнала.
 * Тысячные доли единицы производной (шт или кг).
 */
export function factConsumptionQuantityForDerivative(
  document: PrototypeDocument,
  derivativeId: string,
  month: string,
): number {
  return consumptionQuantityForComponent(document, { kind: 'derivative', id: derivativeId }, (productId) =>
    factProductionVolumePiecesForProduct(document, productId, month),
  );
}

function sumMoney(left: MaterialMoney, right: MaterialMoney): MaterialMoney {
  return {
    withVat: left.withVat + right.withVat,
    exVat: left.exVat + right.exVat,
  };
}

/** Свод месяца: рабочие производные по цехам, план и факт расхода (количество, цена, стоимость) на выпуск. */
export function derivativeMovementMonth(document: PrototypeDocument, month: string): DerivativeMovementMonthView {
  const sections = derivativeSections(document)
    .map((section) => {
      const rows = section.items.map((item) => {
        const planConsumptionQuantity = planConsumptionQuantityForDerivative(document, item.id, month);
        const planConsumptionPrice = derivativeConsumptionPrice(document, item.id, month, 'plan');
        const factConsumptionQuantity = factConsumptionQuantityForDerivative(document, item.id, month);
        const factConsumptionPrice = derivativeConsumptionPrice(document, item.id, month, 'fact');
        return {
          derivativeId: item.id,
          name: item.name,
          unit: item.unit,
          planConsumptionQuantity,
          planConsumptionPrice,
          planConsumptionCost: costForQuantity(planConsumptionPrice, planConsumptionQuantity),
          factConsumptionQuantity,
          factConsumptionPrice,
          factConsumptionCost: costForQuantity(factConsumptionPrice, factConsumptionQuantity),
        };
      });
      return {
        workshopId: section.workshopId,
        name: section.name,
        rows,
        planConsumptionCost: rows.reduce((sum, row) => sumMoney(sum, row.planConsumptionCost), ZERO_MONEY),
        factConsumptionCost: rows.reduce((sum, row) => sumMoney(sum, row.factConsumptionCost), ZERO_MONEY),
      };
    })
    .filter((section) => section.rows.length > 0);

  return { month, sections };
}
