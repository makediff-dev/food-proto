import { derivativeConsumptionPrice } from '@/domain/derivative-cost';
import { derivativeByIdOrNull, derivativeSections } from '@/domain/derivatives';
import type {
  DerivativeConsumptionDay,
  DerivativeConsumptionDayLine,
  DerivativeNorm,
  DerivativeNormLine,
  DerivativeOpening,
  DerivativeOpeningLine,
  DerivativeUnit,
  DerivativeWorkshopId,
  PrototypeDocument,
} from '@/domain/document';
import { isMonthKey, isOccurredOn } from '@/domain/document';
import { plannedProductionVolumePieces } from '@/domain/finished-goods';
import type { MaterialMoney } from '@/domain/materials';
import { ratioRound } from '@/domain/money';
import { maxProductionEntryOccurredOn } from '@/domain/production-journal';
import { isQuantityThousandths, QUANTITY_SCALE } from '@/domain/quantity';
import {
  consumptionQuantityForComponent,
  derivativeConsumptionDaysList,
  factConsumptionQuantityForDerivative,
  realConsumptionQuantityForDerivative,
  realReceiptQuantityForDerivative,
} from '@/domain/recipe-consumption';
import { planMonthOpen, shiftMonth } from '@/domain/sales-plan';

export { derivativeConsumptionPrice } from '@/domain/derivative-cost';
export {
  calculatedConsumptionQuantityForDerivativeDay,
  derivativeConsumptionDaysList,
  factConsumptionQuantityForDerivative,
  factProductionVolumePiecesForProduct,
  realConsumptionQuantityForDerivative,
  realConsumptionQuantityForDerivativeDay,
  realReceiptQuantityForDerivative,
  realReceiptQuantityForDerivativeDay,
} from '@/domain/recipe-consumption';

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
  /**
   * План прихода (выпуска) на месяц: рекомендуемый объём.
   */
  planReceiptQuantity: number;
  /** Плановая цена 1 единицы прихода — как плановая цена расхода. */
  planReceiptPrice: MaterialMoney;
  /** Плановая стоимость прихода: плановая цена × план прихода. */
  planReceiptCost: MaterialMoney;
  /**
   * Реальный приход (выпуск) на месяц: сумма дневного ввода за месяц.
   */
  factReceiptQuantity: number;
  /** Фактическая цена 1 единицы прихода — как фактическая цена расхода. */
  factReceiptPrice: MaterialMoney;
  /** Реальная стоимость прихода: фактическая цена × реальный приход. */
  factReceiptCost: MaterialMoney;
  /** Отклонение количества прихода: реальный − план. */
  receiptDeviationQuantity: number;
  /** Отклонение цены прихода: факт − план. */
  receiptDeviationPrice: MaterialMoney;
  /** Отклонение стоимости прихода: реальный − план. */
  receiptDeviationCost: MaterialMoney;
  /** План расхода на выпуск месяца, тысячные доли единицы производной. */
  planConsumptionQuantity: number;
  /** Плановая цена 1 единицы производной (шт или кг) по плановым ценам сырья. */
  planConsumptionPrice: MaterialMoney;
  /** Плановая стоимость расхода: плановая цена × план расхода. */
  planConsumptionCost: MaterialMoney;
  /** Расчётный факт: расход на фактический выпуск по рецептам. */
  factConsumptionQuantity: number;
  /** Фактическая цена 1 единицы производной по фактическим ценам расхода сырья. */
  factConsumptionPrice: MaterialMoney;
  /** Расчётная стоимость расхода: фактическая цена × расчётный расход. */
  factConsumptionCost: MaterialMoney;
  /** Реальный факт: сумма дневного ввода за месяц. */
  realConsumptionQuantity: number;
  /** Реальная стоимость расхода: фактическая цена × реальный расход. */
  realConsumptionCost: MaterialMoney;
  /** Отклонение к расчёту: реальный − расчётный. */
  consumptionDeviationQuantity: number;
  /** Отклонение цены к расчёту: 0. */
  consumptionDeviationPrice: MaterialMoney;
  /** Отклонение стоимости к расчёту: реальный − расчётный. */
  consumptionDeviationCost: MaterialMoney;
  /** Отклонение к плану: реальный − план. */
  consumptionToPlanDeviationQuantity: number;
  /** Отклонение цены к плану: фактическая − плановая. */
  consumptionToPlanDeviationPrice: MaterialMoney;
  /** Отклонение стоимости к плану: реальный − план. */
  consumptionToPlanDeviationCost: MaterialMoney;
  /**
   * План остатка на конец: начало + план прихода − план расхода
   * (приход = рекомендуемый объём; целевой норматив (мин + макс) / 2, если объём не упирается в ноль).
   */
  bookClosingQuantity: number;
  /** Расчётный факт конца: начало + факт прихода − реальный расход. */
  currentClosingQuantity: number;
  /** Отклонение расчётного конца: расчётный факт − план. */
  currentClosingDeviationQuantity: number;
  /** Стоимость отклонения расчётного конца: отклонение × фактическая цена расхода. */
  currentClosingDeviationCost: MaterialMoney;
  /** Факт инвентаризации на конец, тысячные доли. Нет строки — пусто. */
  inventoryClosingQuantity: number | null;
  /** Была ли правка инвентаризации по этой производной. */
  hasInventoryLine: boolean;
  /** Отклонение инвентаризации: факт − план. Нет строки инвентаризации — пусто. */
  closingDeviationQuantity: number | null;
  /** Стоимость отклонения инвентаризации. Нет строки — пусто. */
  closingInventoryDeviationCost: MaterialMoney | null;
  /** Нормативный минимум, тысячные доли. Нет записи — пусто. */
  minQuantity: number | null;
  /** Нормативный максимум, тысячные доли. Нет записи — пусто. */
  maxQuantity: number | null;
  /**
   * Отклонение ниже минимума (отрицательное) или 0.
   * Запас — факт инвентаризации, если вводили, иначе план конца.
   * Нет норматива — пусто.
   */
  belowMinQuantity: number | null;
  /**
   * Отклонение выше максимума (положительное) или 0.
   * Запас — факт инвентаризации, если вводили, иначе план конца.
   * Нет норматива — пусто.
   */
  aboveMaxQuantity: number | null;
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
  /** Сумма плановой стоимости прихода по цеху. */
  planReceiptCost: MaterialMoney;
  /** Сумма фактической стоимости прихода по цеху. */
  factReceiptCost: MaterialMoney;
  /** Сумма отклонения стоимости прихода по цеху. */
  receiptDeviationCost: MaterialMoney;
  /** Сумма плановой стоимости расхода по цеху. */
  planConsumptionCost: MaterialMoney;
  /** Сумма расчётной стоимости расхода по цеху. */
  factConsumptionCost: MaterialMoney;
  /** Сумма реальной стоимости расхода по цеху. */
  realConsumptionCost: MaterialMoney;
  /** Сумма отклонения стоимости к расчёту по цеху. */
  consumptionDeviationCost: MaterialMoney;
  /** Сумма отклонения стоимости к плану по цеху. */
  consumptionToPlanDeviationCost: MaterialMoney;
  /** Сумма стоимости отклонения расчётного конца по цеху. */
  currentClosingDeviationCost: MaterialMoney;
  /** Сумма стоимости отклонения инвентаризации по цеху. Нет ни одной строки — пусто. */
  closingInventoryDeviationCost: MaterialMoney | null;
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

function sumMoney(left: MaterialMoney, right: MaterialMoney): MaterialMoney {
  return {
    withVat: left.withVat + right.withVat,
    exVat: left.exVat + right.exVat,
  };
}

function sumMoneyNullable(left: MaterialMoney | null, right: MaterialMoney | null): MaterialMoney | null {
  if (right === null) {
    return left;
  }
  if (left === null) {
    return right;
  }
  return sumMoney(left, right);
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

export function hasStoredDerivativeNormLine(document: PrototypeDocument, month: string, derivativeId: string): boolean {
  return normForMonth(document, month)?.lines.some((item) => item.derivativeId === derivativeId) ?? false;
}

/** Норматив производной на месяц. Нет записи — нули (для формул прихода и рекомендации). */
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
  const realConsumptionQuantity = realConsumptionQuantityForDerivative(document, item.id, month);
  const realConsumptionCost = costForQuantity(factConsumptionPrice, realConsumptionQuantity);
  const inventoryClosingQuantity = inventoryQuantityForDerivative(document, month, item.id);
  const hasInventoryLine = hasStoredDerivativeInventoryLine(document, month, item.id);
  const hasNormLine = hasStoredDerivativeNormLine(document, month, item.id);
  const norm = normForDerivative(document, month, item.id);
  const recommendedQuantity = recommendedDerivativeVolumeQuantity(
    openingQuantity,
    planConsumptionQuantity,
    norm.minQuantity,
    norm.maxQuantity,
  );
  const planReceiptQuantity = recommendedQuantity;
  const planReceiptPrice = planConsumptionPrice;
  const planReceiptCost = costForQuantity(planReceiptPrice, planReceiptQuantity);
  const factReceiptQuantity = realReceiptQuantityForDerivative(document, item.id, month);
  const factReceiptPrice = factConsumptionPrice;
  const factReceiptCost = costForQuantity(factReceiptPrice, factReceiptQuantity);
  const bookClosingQuantity = openingQuantity + planReceiptQuantity - planConsumptionQuantity;
  const currentClosingQuantity = openingQuantity + factReceiptQuantity - realConsumptionQuantity;
  const currentClosingDeviationQuantity = currentClosingQuantity - bookClosingQuantity;
  const currentClosingDeviationCost = costForQuantity(factConsumptionPrice, currentClosingDeviationQuantity);
  const closingDeviationQuantity = hasInventoryLine ? inventoryClosingQuantity - bookClosingQuantity : null;
  const closingInventoryDeviationCost =
    hasInventoryLine && closingDeviationQuantity !== null
      ? costForQuantity(factConsumptionPrice, closingDeviationQuantity)
      : null;
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
    planReceiptQuantity,
    planReceiptPrice,
    planReceiptCost,
    factReceiptQuantity,
    factReceiptPrice,
    factReceiptCost,
    receiptDeviationQuantity: factReceiptQuantity - planReceiptQuantity,
    receiptDeviationPrice: subtractMoney(factReceiptPrice, planReceiptPrice),
    receiptDeviationCost: subtractMoney(factReceiptCost, planReceiptCost),
    planConsumptionQuantity,
    planConsumptionPrice,
    planConsumptionCost,
    factConsumptionQuantity,
    factConsumptionPrice,
    factConsumptionCost,
    realConsumptionQuantity,
    realConsumptionCost,
    consumptionDeviationQuantity: realConsumptionQuantity - factConsumptionQuantity,
    consumptionDeviationPrice: ZERO_MONEY,
    consumptionDeviationCost: subtractMoney(realConsumptionCost, factConsumptionCost),
    consumptionToPlanDeviationQuantity: realConsumptionQuantity - planConsumptionQuantity,
    consumptionToPlanDeviationPrice: subtractMoney(factConsumptionPrice, planConsumptionPrice),
    consumptionToPlanDeviationCost: subtractMoney(realConsumptionCost, planConsumptionCost),
    bookClosingQuantity,
    currentClosingQuantity,
    currentClosingDeviationQuantity,
    currentClosingDeviationCost,
    inventoryClosingQuantity: hasInventoryLine ? inventoryClosingQuantity : null,
    hasInventoryLine,
    closingDeviationQuantity,
    closingInventoryDeviationCost,
    minQuantity: hasNormLine ? norm.minQuantity : null,
    maxQuantity: hasNormLine ? norm.maxQuantity : null,
    belowMinQuantity: hasNormLine ? metrics.belowMinQuantity : null,
    aboveMaxQuantity: hasNormLine ? metrics.aboveMaxQuantity : null,
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
        planReceiptCost: rows.reduce((sum, row) => sumMoney(sum, row.planReceiptCost), ZERO_MONEY),
        factReceiptCost: rows.reduce((sum, row) => sumMoney(sum, row.factReceiptCost), ZERO_MONEY),
        receiptDeviationCost: rows.reduce((sum, row) => sumMoney(sum, row.receiptDeviationCost), ZERO_MONEY),
        planConsumptionCost: rows.reduce((sum, row) => sumMoney(sum, row.planConsumptionCost), ZERO_MONEY),
        factConsumptionCost: rows.reduce((sum, row) => sumMoney(sum, row.factConsumptionCost), ZERO_MONEY),
        realConsumptionCost: rows.reduce((sum, row) => sumMoney(sum, row.realConsumptionCost), ZERO_MONEY),
        consumptionDeviationCost: rows.reduce((sum, row) => sumMoney(sum, row.consumptionDeviationCost), ZERO_MONEY),
        consumptionToPlanDeviationCost: rows.reduce(
          (sum, row) => sumMoney(sum, row.consumptionToPlanDeviationCost),
          ZERO_MONEY,
        ),
        currentClosingDeviationCost: rows.reduce(
          (sum, row) => sumMoney(sum, row.currentClosingDeviationCost),
          ZERO_MONEY,
        ),
        closingInventoryDeviationCost: rows.reduce(
          (sum: MaterialMoney | null, row) => sumMoneyNullable(sum, row.closingInventoryDeviationCost),
          null,
        ),
        closingCost: rows.reduce((sum, row) => sumMoney(sum, row.closingCost), ZERO_MONEY),
      };
    })
    .filter((section) => section.rows.length > 0);

  return { month, sections };
}

export type DerivativeConsumptionRejection = 'date' | 'closed' | 'derivative' | 'locked' | 'quantity';

function derivativeConsumptionDayRecord(
  document: PrototypeDocument,
  occurredOn: string,
): DerivativeConsumptionDay | null {
  return derivativeConsumptionDaysList(document).find((item) => item.occurredOn === occurredOn) ?? null;
}

function emptyDerivativeConsumptionLine(derivativeId: string, occurredOn: string): DerivativeConsumptionDayLine {
  return {
    id: `derivative-consumption-line:${occurredOn}:${derivativeId}`,
    derivativeId,
    receiptQuantity: 0,
    quantity: 0,
  };
}

function occurredOnOpen(occurredOn: string, today: Date): boolean {
  return isOccurredOn(occurredOn) && occurredOn >= '2000-01-01' && occurredOn <= maxProductionEntryOccurredOn(today);
}

export function setDerivativeConsumptionDayRejection(
  document: PrototypeDocument,
  occurredOn: string,
  derivativeId: string,
  quantity: number,
  today: Date,
): DerivativeConsumptionRejection | null {
  if (!occurredOnOpen(occurredOn, today)) {
    return isOccurredOn(occurredOn) ? 'closed' : 'date';
  }
  const derivative = derivativeByIdOrNull(document, derivativeId);
  if (!derivative) {
    return 'derivative';
  }
  if (derivative.deletedAt !== null) {
    return 'locked';
  }
  if (!isQuantityThousandths(quantity, false) || quantity < 0) {
    return 'quantity';
  }
  return null;
}

function setDerivativeDayField(
  document: PrototypeDocument,
  occurredOn: string,
  derivativeId: string,
  field: 'receiptQuantity' | 'quantity',
  value: number,
  today: Date,
): PrototypeDocument {
  if (setDerivativeConsumptionDayRejection(document, occurredOn, derivativeId, value, today)) {
    return document;
  }

  const existing = derivativeConsumptionDayRecord(document, occurredOn);
  const baseLine =
    existing?.lines.find((line) => line.derivativeId === derivativeId) ??
    emptyDerivativeConsumptionLine(derivativeId, occurredOn);
  const nextLine: DerivativeConsumptionDayLine = {
    ...baseLine,
    receiptQuantity: baseLine.receiptQuantity ?? 0,
    [field]: value,
  };
  const keep = (nextLine.receiptQuantity ?? 0) > 0 || nextLine.quantity > 0;

  if (!existing) {
    if (!keep) {
      return document;
    }
    return {
      ...document,
      derivativeConsumptionDays: [
        ...derivativeConsumptionDaysList(document),
        { id: `derivative-consumption:${occurredOn}`, occurredOn, lines: [nextLine] },
      ],
    };
  }

  const without = existing.lines.filter((line) => line.derivativeId !== derivativeId);
  const lines = keep ? [...without, nextLine] : without;
  if (lines.length === 0) {
    return {
      ...document,
      derivativeConsumptionDays: derivativeConsumptionDaysList(document).filter((item) => item.id !== existing.id),
    };
  }
  return {
    ...document,
    derivativeConsumptionDays: derivativeConsumptionDaysList(document).map((item) =>
      item.id === existing.id ? { ...item, lines } : item,
    ),
  };
}

/**
 * Пишет реальный выпуск (приход) производной за день.
 * Пустая строка (и выпуск, и расход равны 0) снимается; пустой день вырезается из документа.
 */
export function setDerivativeReceiptDayQuantity(
  document: PrototypeDocument,
  occurredOn: string,
  derivativeId: string,
  quantity: number,
  today: Date,
): PrototypeDocument {
  return setDerivativeDayField(document, occurredOn, derivativeId, 'receiptQuantity', quantity, today);
}

/**
 * Пишет реальный расход производной за день.
 * Пустая строка (и выпуск, и расход равны 0) снимается; пустой день вырезается из документа.
 */
export function setDerivativeConsumptionDayQuantity(
  document: PrototypeDocument,
  occurredOn: string,
  derivativeId: string,
  quantity: number,
  today: Date,
): PrototypeDocument {
  return setDerivativeDayField(document, occurredOn, derivativeId, 'quantity', quantity, today);
}
