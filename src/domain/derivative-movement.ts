import { derivativeByIdOrNull, derivativeSections, derivativesList } from '@/domain/derivatives';
import type {
  DerivativeNorm,
  DerivativeNormLine,
  DerivativeOpening,
  DerivativeOpeningLine,
  DerivativeUnit,
  DerivativeWorkshopId,
  PrototypeDocument,
} from '@/domain/document';
import { isMonthKey } from '@/domain/document';
import { plannedProductionVolumePieces } from '@/domain/finished-goods';
import { type MaterialMoney, materialConsumptionPrice, materialPlanPrice } from '@/domain/materials';
import { ratioRound } from '@/domain/money';
import { isQuantityThousandths, QUANTITY_SCALE } from '@/domain/quantity';
import { consumptionQuantityForComponent, derivativeBatchThousandths } from '@/domain/recipe-consumption';
import { planMonthOpen, shiftMonth } from '@/domain/sales-plan';

export type DerivativeOpeningRejection = 'month' | 'closed' | 'derivative' | 'locked' | 'quantity';

export type DerivativeNormField = 'minQuantity' | 'maxQuantity';

export type DerivativeNormRejection = 'month' | 'closed' | 'derivative' | 'locked' | 'quantity';

export type DerivativeMovementRow = {
  derivativeId: string;
  name: string;
  unit: DerivativeUnit;
  deleted: boolean;
  /** Остаток на начало: инвентаризация конца прошлого месяца, тысячные доли. */
  openingQuantity: number;
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
  /** Отклонение количества расхода: факт − план. */
  consumptionDeviationQuantity: number;
  /** Отклонение цены расхода: факт − план. */
  consumptionDeviationPrice: MaterialMoney;
  /** Отклонение стоимости расхода: факт − план. */
  consumptionDeviationCost: MaterialMoney;
  /**
   * План остатка на конец: начало + рекомендуемый объём − план расхода
   * (целевой норматив (мин + макс) / 2, если рекомендуемый объём не упирается в ноль).
   */
  bookClosingQuantity: number;
  /** Расчётный факт конца: начало + рекомендуемый объём − факт расхода. */
  currentClosingQuantity: number;
  /** Отклонение расчётного конца: расчётный факт − план. */
  currentClosingDeviationQuantity: number;
  /** Стоимость отклонения расчётного конца: отклонение × фактическая цена расхода. */
  currentClosingDeviationCost: MaterialMoney;
  /** Факт инвентаризации на конец, тысячные доли. Нет строки — 0. */
  inventoryClosingQuantity: number;
  /** Была ли правка инвентаризации по этой производной. */
  hasInventoryLine: boolean;
  /** Отклонение инвентаризации: факт − план. Нет строки инвентаризации — 0. */
  closingDeviationQuantity: number;
  /** Стоимость отклонения инвентаризации. Нет строки — 0. */
  closingInventoryDeviationCost: MaterialMoney;
  /** Нормативный минимум, тысячные доли. Нет записи — 0. */
  minQuantity: number;
  /** Нормативный максимум, тысячные доли. Нет записи — 0. */
  maxQuantity: number;
  /**
   * Отклонение ниже минимума (отрицательное) или 0.
   * Запас — факт инвентаризации, если вводили, иначе план конца.
   */
  belowMinQuantity: number;
  /**
   * Отклонение выше максимума (положительное) или 0.
   * Запас — факт инвентаризации, если вводили, иначе план конца.
   */
  aboveMaxQuantity: number;
  /**
   * Рекомендуемый объём выпуска производной на месяц:
   * план расхода + (мин + макс) / 2 − остаток на начало (не меньше 0).
   */
  recommendedQuantity: number;
  /** Стоимость остатка на конец: (инвентаризация или план) × фактическая цена расхода. */
  closingCost: MaterialMoney;
};

export type DerivativeMovementSection = {
  workshopId: DerivativeWorkshopId;
  name: string;
  rows: DerivativeMovementRow[];
  /** Сумма плановой стоимости расхода по цеху. */
  planConsumptionCost: MaterialMoney;
  /** Сумма фактической стоимости расхода по цеху. */
  factConsumptionCost: MaterialMoney;
  /** Сумма отклонения стоимости расхода по цеху. */
  consumptionDeviationCost: MaterialMoney;
  /** Сумма стоимости отклонения расчётного конца по цеху. */
  currentClosingDeviationCost: MaterialMoney;
  /** Сумма стоимости отклонения инвентаризации по цеху. */
  closingInventoryDeviationCost: MaterialMoney;
  /** Сумма стоимости остатка на конец по цеху. */
  closingCost: MaterialMoney;
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

function subtractMoney(left: MaterialMoney, right: MaterialMoney): MaterialMoney {
  return {
    withVat: left.withVat - right.withVat,
    exVat: left.exVat - right.exVat,
  };
}

/** Старый документ без поля читается как пустой список. */
export function derivativeOpeningsList(document: PrototypeDocument): DerivativeOpening[] {
  return document.derivativeOpenings ?? [];
}

function openingForMonth(document: PrototypeDocument, month: string): DerivativeOpening | null {
  return derivativeOpeningsList(document).find((item) => item.month === month) ?? null;
}

/** Факт инвентаризации на конец месяца. Нет строки — 0. */
export function inventoryQuantityForDerivative(
  document: PrototypeDocument,
  month: string,
  derivativeId: string,
): number {
  return openingForMonth(document, month)?.lines.find((line) => line.derivativeId === derivativeId)?.quantity ?? 0;
}

export function hasStoredDerivativeInventoryLine(
  document: PrototypeDocument,
  month: string,
  derivativeId: string,
): boolean {
  return openingForMonth(document, month)?.lines.some((line) => line.derivativeId === derivativeId) ?? false;
}

/**
 * Остаток на начало: инвентаризация конца прошлого месяца.
 * Нет прошлого месяца или записи — 0.
 */
export function openingQuantityForDerivative(document: PrototypeDocument, month: string, derivativeId: string): number {
  if (!isMonthKey(month) || month <= '2000-01') {
    return 0;
  }
  const previous = shiftMonth(month, -1);
  if (!isMonthKey(previous) || previous < '2000-01') {
    return 0;
  }
  return inventoryQuantityForDerivative(document, previous, derivativeId);
}

export function setDerivativeOpeningRejection(
  document: PrototypeDocument,
  month: string,
  derivativeId: string,
  quantity: number,
  today: Date,
): DerivativeOpeningRejection | null {
  if (!isMonthKey(month) || !planMonthOpen(month, today)) {
    return month < '2000-01' || !isMonthKey(month) ? 'month' : 'closed';
  }
  const derivative = derivativeByIdOrNull(document, derivativeId);
  if (!derivative) {
    return 'derivative';
  }
  if (derivative.deletedAt !== null) {
    return 'locked';
  }
  return isQuantityThousandths(quantity, true) ? null : 'quantity';
}

/**
 * Пишет инвентаризацию на конец месяца. Нет записи месяца — создаёт.
 * Первая правка материализует месяц.
 */
export function setDerivativeOpening(
  document: PrototypeDocument,
  month: string,
  derivativeId: string,
  quantity: number,
  today: Date,
): PrototypeDocument {
  if (setDerivativeOpeningRejection(document, month, derivativeId, quantity, today)) {
    return document;
  }

  const openings = derivativeOpeningsList(document);
  const existing = openingForMonth(document, month);

  if (!existing) {
    const created: DerivativeOpening = {
      id: `derivative-opening:${month}`,
      month,
      lines: [
        {
          id: `derivative-opening-line:${month}:${derivativeId}`,
          derivativeId,
          quantity,
        },
      ],
    };
    return {
      ...document,
      derivativeOpenings: [...openings, created],
    };
  }

  const line = existing.lines.find((item) => item.derivativeId === derivativeId);
  if (line) {
    if (line.quantity === quantity) {
      return document;
    }
    return {
      ...document,
      derivativeOpenings: openings.map((item) =>
        item.month !== month
          ? item
          : {
              ...item,
              lines: item.lines.map((entry) => (entry.derivativeId === derivativeId ? { ...entry, quantity } : entry)),
            },
      ),
    };
  }

  const nextLine: DerivativeOpeningLine = {
    id: `derivative-opening-line:${month}:${derivativeId}`,
    derivativeId,
    quantity,
  };
  return {
    ...document,
    derivativeOpenings: openings.map((item) =>
      item.month !== month ? item : { ...item, lines: [...item.lines, nextLine] },
    ),
  };
}

/** Старый документ без поля читается как пустой список. */
export function derivativeNormsList(document: PrototypeDocument): DerivativeNorm[] {
  return document.derivativeNorms ?? [];
}

function normForMonth(document: PrototypeDocument, month: string): DerivativeNorm | null {
  return derivativeNormsList(document).find((item) => item.month === month) ?? null;
}

/** Норматив производной на месяц. Нет записи — нули. */
export function normForDerivative(
  document: PrototypeDocument,
  month: string,
  derivativeId: string,
): Pick<DerivativeNormLine, 'minQuantity' | 'maxQuantity'> {
  const line = normForMonth(document, month)?.lines.find((item) => item.derivativeId === derivativeId);
  if (!line) {
    return { minQuantity: 0, maxQuantity: 0 };
  }
  return {
    minQuantity: line.minQuantity,
    maxQuantity: line.maxQuantity,
  };
}

/** Целевой остаток производной на конец месяца: середина норматива мин/макс. */
export function targetClosingQuantityFromDerivativeNorm(minQuantity: number, maxQuantity: number): number {
  return Math.round((minQuantity + maxQuantity) / 2);
}

/**
 * Рекомендуемый объём производной на месяц:
 * план расхода + целевой остаток на конец ((мин + макс) / 2) − остаток на начало.
 * Отрицательный результат — 0.
 */
export function recommendedDerivativeVolumeQuantity(
  openingQuantity: number,
  planConsumptionQuantity: number,
  minQuantity: number,
  maxQuantity: number,
): number {
  const targetClosing = targetClosingQuantityFromDerivativeNorm(minQuantity, maxQuantity);
  const volume = planConsumptionQuantity + targetClosing - openingQuantity;
  return volume < 0 ? 0 : volume;
}

function derivativeNormMetrics(
  openingQuantity: number,
  planConsumptionQuantity: number,
  stockQuantity: number,
  minQuantity: number,
  maxQuantity: number,
) {
  const belowMinQuantity = stockQuantity < minQuantity ? stockQuantity - minQuantity : 0;
  const aboveMaxQuantity = stockQuantity > maxQuantity ? stockQuantity - maxQuantity : 0;
  const recommendedQuantity = recommendedDerivativeVolumeQuantity(
    openingQuantity,
    planConsumptionQuantity,
    minQuantity,
    maxQuantity,
  );
  return { belowMinQuantity, aboveMaxQuantity, recommendedQuantity };
}

export function setDerivativeNormRejection(
  document: PrototypeDocument,
  month: string,
  derivativeId: string,
  _field: DerivativeNormField,
  value: number,
  today: Date,
): DerivativeNormRejection | null {
  if (!isMonthKey(month) || !planMonthOpen(month, today)) {
    return month < '2000-01' || !isMonthKey(month) ? 'month' : 'closed';
  }
  const derivative = derivativeByIdOrNull(document, derivativeId);
  if (!derivative) {
    return 'derivative';
  }
  if (derivative.deletedAt !== null) {
    return 'locked';
  }
  return isQuantityThousandths(value, true) ? null : 'quantity';
}

/**
 * Пишет поле норматива (мин/макс) производной на месяц. Нет записи месяца — создаёт.
 */
export function setDerivativeNorm(
  document: PrototypeDocument,
  month: string,
  derivativeId: string,
  field: DerivativeNormField,
  value: number,
  today: Date,
): PrototypeDocument {
  if (setDerivativeNormRejection(document, month, derivativeId, field, value, today)) {
    return document;
  }

  const norms = derivativeNormsList(document);
  const existing = normForMonth(document, month);

  if (!existing) {
    const created: DerivativeNorm = {
      id: `derivative-norm:${month}`,
      month,
      lines: [
        {
          id: `derivative-norm-line:${month}:${derivativeId}`,
          derivativeId,
          minQuantity: 0,
          maxQuantity: 0,
          [field]: value,
        },
      ],
    };
    return {
      ...document,
      derivativeNorms: [...norms, created],
    };
  }

  const line = existing.lines.find((item) => item.derivativeId === derivativeId);
  if (line) {
    if (line[field] === value) {
      return document;
    }
    return {
      ...document,
      derivativeNorms: norms.map((item) =>
        item.month !== month
          ? item
          : {
              ...item,
              lines: item.lines.map((entry) =>
                entry.derivativeId === derivativeId ? { ...entry, [field]: value } : entry,
              ),
            },
      ),
    };
  }

  const nextLine: DerivativeNormLine = {
    id: `derivative-norm-line:${month}:${derivativeId}`,
    derivativeId,
    minQuantity: 0,
    maxQuantity: 0,
    [field]: value,
  };
  return {
    ...document,
    derivativeNorms: norms.map((item) => (item.month !== month ? item : { ...item, lines: [...item.lines, nextLine] })),
  };
}

function buildRow(
  document: PrototypeDocument,
  month: string,
  item: {
    id: string;
    name: string;
    unit: DerivativeUnit;
    deletedAt: string | null;
  },
): DerivativeMovementRow {
  const openingQuantity = openingQuantityForDerivative(document, month, item.id);
  const planConsumptionQuantity = planConsumptionQuantityForDerivative(document, item.id, month);
  const planConsumptionPrice = derivativeConsumptionPrice(document, item.id, month, 'plan');
  const planConsumptionCost = costForQuantity(planConsumptionPrice, planConsumptionQuantity);
  const factConsumptionQuantity = factConsumptionQuantityForDerivative(document, item.id, month);
  const factConsumptionPrice = derivativeConsumptionPrice(document, item.id, month, 'fact');
  const factConsumptionCost = costForQuantity(factConsumptionPrice, factConsumptionQuantity);
  const inventoryClosingQuantity = inventoryQuantityForDerivative(document, month, item.id);
  const hasInventoryLine = hasStoredDerivativeInventoryLine(document, month, item.id);
  const norm = normForDerivative(document, month, item.id);
  const recommendedQuantity = recommendedDerivativeVolumeQuantity(
    openingQuantity,
    planConsumptionQuantity,
    norm.minQuantity,
    norm.maxQuantity,
  );
  const bookClosingQuantity = openingQuantity + recommendedQuantity - planConsumptionQuantity;
  const currentClosingQuantity = openingQuantity + recommendedQuantity - factConsumptionQuantity;
  const currentClosingDeviationQuantity = currentClosingQuantity - bookClosingQuantity;
  const currentClosingDeviationCost = costForQuantity(factConsumptionPrice, currentClosingDeviationQuantity);
  const closingDeviationQuantity = hasInventoryLine ? inventoryClosingQuantity - bookClosingQuantity : 0;
  const closingInventoryDeviationCost = hasInventoryLine
    ? costForQuantity(factConsumptionPrice, closingDeviationQuantity)
    : ZERO_MONEY;
  const stockForNorm = hasInventoryLine ? inventoryClosingQuantity : bookClosingQuantity;
  const stockForClosingCost = hasInventoryLine ? inventoryClosingQuantity : bookClosingQuantity;
  const metrics = derivativeNormMetrics(
    openingQuantity,
    planConsumptionQuantity,
    stockForNorm,
    norm.minQuantity,
    norm.maxQuantity,
  );

  return {
    derivativeId: item.id,
    name: item.name,
    unit: item.unit,
    deleted: item.deletedAt !== null,
    openingQuantity,
    planConsumptionQuantity,
    planConsumptionPrice,
    planConsumptionCost,
    factConsumptionQuantity,
    factConsumptionPrice,
    factConsumptionCost,
    consumptionDeviationQuantity: factConsumptionQuantity - planConsumptionQuantity,
    consumptionDeviationPrice: subtractMoney(factConsumptionPrice, planConsumptionPrice),
    consumptionDeviationCost: subtractMoney(factConsumptionCost, planConsumptionCost),
    bookClosingQuantity,
    currentClosingQuantity,
    currentClosingDeviationQuantity,
    currentClosingDeviationCost,
    inventoryClosingQuantity,
    hasInventoryLine,
    closingDeviationQuantity,
    closingInventoryDeviationCost,
    minQuantity: norm.minQuantity,
    maxQuantity: norm.maxQuantity,
    belowMinQuantity: metrics.belowMinQuantity,
    aboveMaxQuantity: metrics.aboveMaxQuantity,
    recommendedQuantity: metrics.recommendedQuantity,
    closingCost: costForQuantity(factConsumptionPrice, stockForClosingCost),
  };
}

/** Свод месяца: рабочие производные по цехам, расход, остатки и норматив. */
export function derivativeMovementMonth(document: PrototypeDocument, month: string): DerivativeMovementMonthView {
  const sections = derivativeSections(document)
    .map((section) => {
      const rows = section.items.map((item) => buildRow(document, month, item));
      return {
        workshopId: section.workshopId,
        name: section.name,
        rows,
        planConsumptionCost: rows.reduce((sum, row) => sumMoney(sum, row.planConsumptionCost), ZERO_MONEY),
        factConsumptionCost: rows.reduce((sum, row) => sumMoney(sum, row.factConsumptionCost), ZERO_MONEY),
        consumptionDeviationCost: rows.reduce((sum, row) => sumMoney(sum, row.consumptionDeviationCost), ZERO_MONEY),
        currentClosingDeviationCost: rows.reduce(
          (sum, row) => sumMoney(sum, row.currentClosingDeviationCost),
          ZERO_MONEY,
        ),
        closingInventoryDeviationCost: rows.reduce(
          (sum, row) => sumMoney(sum, row.closingInventoryDeviationCost),
          ZERO_MONEY,
        ),
        closingCost: rows.reduce((sum, row) => sumMoney(sum, row.closingCost), ZERO_MONEY),
      };
    })
    .filter((section) => section.rows.length > 0);

  return { month, sections };
}
