import { visibleCategories } from '@/domain/categories';
import { type UnitCost, unitCost } from '@/domain/cost';
import {
  isDeletionMark,
  isMonthKey,
  isOccurredOn,
  MAX_ID_LENGTH,
  MAX_VOLUME_PIECES,
  type Product,
  type PrototypeDocument,
  type SalesFact,
  type SalesFactCell,
} from '@/domain/document';
import {
  amountExVat,
  averageAmount,
  multiplyAmount,
  percentHundredths,
  toSafeNumber,
  vatPercentHundredths,
} from '@/domain/money';
import { workingSales } from '@/domain/sales';
import { daysInMonth, monthKeyFromDate, shiftMonth } from '@/domain/sales-plan';

const ZERO = BigInt(0);

/**
 * Остатки живут с октября 2026.
 * Более ранний месяц начинает оба остатка с нуля и в октябрь не переходит.
 */
export const STOCK_SEED_MONTH = '2026-10';

/** На 1 октября 2026 у каждого товара, шт на РЦ. На производстве в этот день — 0. */
export const STOCK_SEED_DISTRIBUTION_PIECES = 100;

export type SalesFactRejection =
  | 'missing'
  | 'month'
  | 'date'
  | 'product'
  | 'locked'
  | 'pieces'
  | 'taken';

/** Серые вводы дня, кроме продаж. На экране пустой день — нули, в документ он не пишется. */
export interface SalesFactInputs {
  outputPieces: number;
  transferPieces: number;
  staffMealsPieces: number;
  samplesPieces: number;
  returnsPieces: number;
  writeOffPieces: number;
}

export interface SaleDayProduct {
  pieces: number;
  revenueWithVat: number | null;
  revenueExVat: number | null;
}

export interface SalesFactRow {
  productId: string;
  name: string;
  deleted: boolean;
  vatPercent: number | null;
  inputs: SalesFactInputs;
  salesPieces: number;
  productionStart: number;
  distributionStart: number;
  productionEnd: number;
  distributionEnd: number;
  /** Выручка / объём, копейки. Нет объёма — пусто. */
  priceWithVat: number | null;
  priceExVat: number | null;
  revenueWithVat: number | null;
  revenueExVat: number | null;
  /** Себестоимость 1 шт с товара. Обе колонки «Себест, р/ед» совпадают. */
  unitCost: UnitCost | null;
  salesVolumeCostWithVat: number | null;
  salesVolumeCostExVat: number | null;
  outputVolumeCostWithVat: number | null;
  outputVolumeCostExVat: number | null;
  /** Выручка без НДС − себестоимость объёма продаж без НДС. */
  contribution: number | null;
  profitabilityHundredths: number | null;
}

export interface SalesFactTotals {
  productionStart: number | null;
  distributionStart: number | null;
  salesPieces: number | null;
  outputPieces: number | null;
  transferPieces: number | null;
  staffMealsPieces: number | null;
  samplesPieces: number | null;
  returnsPieces: number | null;
  writeOffPieces: number | null;
  productionEnd: number | null;
  distributionEnd: number | null;
  revenueWithVat: number | null;
  revenueExVat: number | null;
  /** Есть строка с объёмом продаж, у которой себестоимость не считается. */
  salesCostComplete: boolean;
  /** Есть строка с объёмом выпуска, у которой себестоимость не считается. */
  outputCostComplete: boolean;
  revenueComplete: boolean;
  salesVolumeCostWithVat: number | null;
  salesVolumeCostExVat: number | null;
  outputVolumeCostWithVat: number | null;
  outputVolumeCostExVat: number | null;
  contribution: number | null;
  /** Выручка с НДС / объём продаж, копейки. Не формула цены строки. */
  priceWithVat: number | null;
  /** Выручка без НДС / объём продаж, копейки. */
  priceExVat: number | null;
  /**
   * Сотые доли процента. `O = IF(I=0,0,H/I*100-100)`.
   * Нет цены без НДС — пусто.
   */
  vatPercentHundredths: number | null;
  salesUnitCostWithVat: number | null;
  salesUnitCostExVat: number | null;
  outputUnitCostWithVat: number | null;
  outputUnitCostExVat: number | null;
  profitabilityHundredths: number | null;
}

/** Строка группы как на сводке. Пустая рабочая категория тоже входит. */
export interface SalesFactGroup {
  categoryId: string;
  name: string;
  deleted: boolean;
  rows: SalesFactRow[];
  totals: SalesFactTotals;
}

export interface SalesFactDayView {
  occurredOn: string;
  groups: SalesFactGroup[];
  rows: SalesFactRow[];
  totals: SalesFactTotals;
}

export interface SalesFactIds {
  factId: string;
  recordId: string;
}

function isEntityId(value: string): boolean {
  return (
    value.length > 0 && value.length <= MAX_ID_LENGTH && value === value.trim()
  );
}

function isPieces(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= MAX_VOLUME_PIECES;
}

export function blankInputs(): SalesFactInputs {
  return {
    outputPieces: 0,
    transferPieces: 0,
    staffMealsPieces: 0,
    samplesPieces: 0,
    returnsPieces: 0,
    writeOffPieces: 0,
  };
}

export function inputsAreBlank(inputs: SalesFactInputs): boolean {
  return (
    inputs.outputPieces === 0 &&
    inputs.transferPieces === 0 &&
    inputs.staffMealsPieces === 0 &&
    inputs.samplesPieces === 0 &&
    inputs.returnsPieces === 0 &&
    inputs.writeOffPieces === 0
  );
}

function inputsFromCell(cell: SalesFactCell): SalesFactInputs {
  return {
    outputPieces: cell.outputPieces,
    transferPieces: cell.transferPieces,
    staffMealsPieces: cell.staffMealsPieces,
    samplesPieces: cell.samplesPieces,
    returnsPieces: cell.returnsPieces,
    writeOffPieces: cell.writeOffPieces,
  };
}

function sameInputs(left: SalesFactInputs, right: SalesFactInputs): boolean {
  return (
    left.outputPieces === right.outputPieces &&
    left.transferPieces === right.transferPieces &&
    left.staffMealsPieces === right.staffMealsPieces &&
    left.samplesPieces === right.samplesPieces &&
    left.returnsPieces === right.returnsPieces &&
    left.writeOffPieces === right.writeOffPieces
  );
}

export function workingSalesFact(
  document: PrototypeDocument,
  month: string,
): SalesFact | null {
  return (
    document.salesFacts.find(
      (item) => item.deletedAt === null && item.month === month,
    ) ?? null
  );
}

export function deletedSalesFacts(document: PrototypeDocument): SalesFact[] {
  return document.salesFacts
    .filter((item) => item.deletedAt !== null)
    .sort((left, right) => right.month.localeCompare(left.month));
}

export function salesFactById(
  document: PrototypeDocument,
  id: string,
): SalesFact | null {
  return document.salesFacts.find((item) => item.id === id) ?? null;
}

/** Текущий и прошлые месяцы. Будущий не создаётся. */
export function salesFactMonthOpen(month: string, today: Date): boolean {
  return (
    isMonthKey(month) && month <= monthKeyFromDate(today) && month >= '2000-01'
  );
}

export function monthDates(month: string): string[] {
  return Array.from({ length: daysInMonth(month) }, (_, index) => {
    const day = String(index + 1).padStart(2, '0');
    return `${month}-${day}`;
  });
}

/** День, который таблица показывает, пока в адресе нет другой даты. */
export function defaultSalesFactDay(month: string): string {
  return `${month}-01`;
}

/** Соседний день того же месяца. За границей месяца — `null`. */
export function adjacentDay(date: string, offset: -1 | 1): string | null {
  if (!isOccurredOn(date)) {
    return null;
  }

  const year = Number(date.slice(0, 4));
  const month = Number(date.slice(5, 7));
  const day = Number(date.slice(8, 10));
  const next = new Date(year, month - 1, day + offset);
  const iso = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`;
  if (iso.slice(0, 7) !== date.slice(0, 7)) {
    return null;
  }

  return iso;
}

function productById(
  document: PrototypeDocument,
  productId: string,
): Product | null {
  return document.products.find((item) => item.id === productId) ?? null;
}

function salesInMonth(
  document: PrototypeDocument,
  month: string,
): ReturnType<typeof workingSales> {
  return workingSales(document).filter((item) =>
    item.occurredOn.startsWith(`${month}-`),
  );
}

export function saleDayProduct(
  document: PrototypeDocument,
  occurredOn: string,
  productId: string,
): SaleDayProduct {
  let pieces = ZERO;
  let revenueWith = ZERO;
  let revenueEx = ZERO;
  let revenueComplete = true;
  const product = productById(document, productId);

  for (const sale of workingSales(document)) {
    if (sale.occurredOn !== occurredOn) {
      continue;
    }
    for (const line of sale.lines) {
      if (line.productId !== productId) {
        continue;
      }
      pieces += BigInt(line.pieces);
      revenueWith += BigInt(line.amountWithVat);
      const ex =
        product === null
          ? null
          : amountExVat(line.amountWithVat, product.vatPercent);
      if (ex === null) {
        revenueComplete = false;
      } else {
        revenueEx += BigInt(ex);
      }
    }
  }

  const salesPieces = toSafeNumber(pieces) ?? 0;
  return {
    pieces: salesPieces,
    revenueWithVat: toSafeNumber(revenueWith),
    revenueExVat: revenueComplete ? toSafeNumber(revenueEx) : null,
  };
}

/**
 * Рабочие товары и те, на которые в этом месяце есть серый ввод, продажа
 * или ненулевой остаток на 1-е число.
 */
export function salesFactGridProducts(
  document: PrototypeDocument,
  fact: SalesFact | null,
  month: string,
): Product[] {
  const referenced = new Set<string>();
  if (fact) {
    for (const day of fact.days) {
      for (const cell of day.cells) {
        referenced.add(cell.productId);
      }
    }
  }
  for (const sale of salesInMonth(document, month)) {
    for (const line of sale.lines) {
      referenced.add(line.productId);
    }
  }

  return document.products.filter((item) => {
    if (item.deletedAt === null || referenced.has(item.id)) {
      return true;
    }

    const opening = monthOpening(document, month, item.id);
    return opening.productionPieces !== 0 || opening.distributionPieces !== 0;
  });
}

function inputsOn(
  fact: SalesFact | null,
  occurredOn: string,
  productId: string,
): SalesFactInputs {
  const cell = fact?.days
    .find((day) => day.occurredOn === occurredOn)
    ?.cells.find((item) => item.productId === productId);
  return cell ? inputsFromCell(cell) : blankInputs();
}

interface DayStock {
  occurredOn: string;
  inputs: SalesFactInputs;
  salesPieces: number;
  revenueWithVat: number | null;
  revenueExVat: number | null;
  productionStart: number;
  distributionStart: number;
  productionEnd: number;
  distributionEnd: number;
}

interface StockPieces {
  productionPieces: number;
  distributionPieces: number;
}

function dayEnds(
  productionStart: number,
  distributionStart: number,
  inputs: SalesFactInputs,
  salesPieces: number,
): { productionEnd: number; distributionEnd: number } {
  return {
    productionEnd:
      productionStart + inputs.outputPieces - inputs.transferPieces,
    distributionEnd:
      distributionStart -
      salesPieces +
      inputs.transferPieces -
      inputs.staffMealsPieces -
      inputs.samplesPieces +
      inputs.returnsPieces -
      inputs.writeOffPieces,
  };
}

/**
 * Остаток на 1-е число. На 1 октября 2026 — 0 на производстве и 100 на РЦ.
 * Позже — конец предыдущего месяца. Раньше октября 2026 — нули.
 * В перенос входят рабочие продажи и рабочая запись месяца.
 */
export function monthOpening(
  document: PrototypeDocument,
  month: string,
  productId: string,
): StockPieces {
  if (month < STOCK_SEED_MONTH) {
    return { productionPieces: 0, distributionPieces: 0 };
  }

  let production = 0;
  let distribution = STOCK_SEED_DISTRIBUTION_PIECES;
  let cursor = STOCK_SEED_MONTH;

  while (cursor < month) {
    const fact = workingSalesFact(document, cursor);
    for (const occurredOn of monthDates(cursor)) {
      const inputs = inputsOn(fact, occurredOn, productId);
      const sold = saleDayProduct(document, occurredOn, productId);
      const ends = dayEnds(production, distribution, inputs, sold.pieces);
      production = ends.productionEnd;
      distribution = ends.distributionEnd;
    }
    cursor = shiftMonth(cursor, 1);
  }

  return { productionPieces: production, distributionPieces: distribution };
}

/**
 * Цепочка календарных дней. Пропуск в документе не перескакивает остаток:
 * 1-е число берёт остаток месяца, каждый следующий день — конец предыдущего.
 * Конец на производстве = начало + выпуск − перемещение на РЦ.
 * Конец на РЦ = начало − продажи + перемещение − питание − образцы + возвраты − списание.
 * Клетки дня берутся из переданной записи, остаток на 1-е — из рабочей цепочки.
 */
function stockChain(
  document: PrototypeDocument,
  fact: SalesFact | null,
  month: string,
  productId: string,
): DayStock[] {
  const opening = monthOpening(document, month, productId);
  let production = opening.productionPieces;
  let distribution = opening.distributionPieces;
  const chain: DayStock[] = [];

  for (const occurredOn of monthDates(month)) {
    const inputs = inputsOn(fact, occurredOn, productId);
    const sold = saleDayProduct(document, occurredOn, productId);
    const productionStart = production;
    const distributionStart = distribution;
    const ends = dayEnds(
      productionStart,
      distributionStart,
      inputs,
      sold.pieces,
    );
    chain.push({
      occurredOn,
      inputs,
      salesPieces: sold.pieces,
      revenueWithVat: sold.revenueWithVat,
      revenueExVat: sold.revenueExVat,
      productionStart,
      distributionStart,
      productionEnd: ends.productionEnd,
      distributionEnd: ends.distributionEnd,
    });
    production = ends.productionEnd;
    distribution = ends.distributionEnd;
  }

  return chain;
}

function rowMetrics(
  document: PrototypeDocument,
  product: Product,
  stock: DayStock,
): SalesFactRow {
  const inputs = stock.inputs;
  const vat = product.vatPercent;
  const cost = unitCost(document, product.id);
  const salesPieces = stock.salesPieces;
  const revenueWith = stock.revenueWithVat;
  const revenueEx = stock.revenueExVat;
  const salesVolumeWith =
    cost === null ? null : multiplyAmount(cost.withVat, salesPieces);
  const salesVolumeEx =
    cost === null ? null : multiplyAmount(cost.exVat, salesPieces);
  const outputVolumeWith =
    cost === null ? null : multiplyAmount(cost.withVat, inputs.outputPieces);
  const outputVolumeEx =
    cost === null ? null : multiplyAmount(cost.exVat, inputs.outputPieces);
  const contribution =
    revenueEx === null || salesVolumeEx === null
      ? null
      : revenueEx - salesVolumeEx;

  return {
    productId: product.id,
    name: product.name,
    deleted: product.deletedAt !== null,
    vatPercent: vat,
    inputs,
    salesPieces,
    productionStart: stock.productionStart,
    distributionStart: stock.distributionStart,
    productionEnd: stock.productionEnd,
    distributionEnd: stock.distributionEnd,
    priceWithVat: averageAmount(revenueWith, salesPieces),
    priceExVat: averageAmount(revenueEx, salesPieces),
    revenueWithVat: revenueWith,
    revenueExVat: revenueEx,
    unitCost: cost,
    salesVolumeCostWithVat: salesVolumeWith,
    salesVolumeCostExVat: salesVolumeEx,
    outputVolumeCostWithVat: outputVolumeWith,
    outputVolumeCostExVat: outputVolumeEx,
    contribution: contribution,
    profitabilityHundredths:
      contribution === null || salesVolumeEx === null
        ? null
        : percentHundredths(contribution, salesVolumeEx),
  };
}

function dayTotals(rows: readonly SalesFactRow[]): SalesFactTotals {
  let productionStart = ZERO;
  let distributionStart = ZERO;
  let salesPieces = ZERO;
  let outputPieces = ZERO;
  let transferPieces = ZERO;
  let staffMealsPieces = ZERO;
  let samplesPieces = ZERO;
  let returnsPieces = ZERO;
  let writeOffPieces = ZERO;
  let productionEnd = ZERO;
  let distributionEnd = ZERO;
  let revenueWith = ZERO;
  let revenueEx = ZERO;
  let salesCostWith = ZERO;
  let salesCostEx = ZERO;
  let outputCostWith = ZERO;
  let outputCostEx = ZERO;
  let contributionSum = ZERO;
  let salesCostComplete = true;
  let outputCostComplete = true;
  let revenueComplete = true;

  for (const row of rows) {
    productionStart += BigInt(row.productionStart);
    distributionStart += BigInt(row.distributionStart);
    salesPieces += BigInt(row.salesPieces);
    outputPieces += BigInt(row.inputs.outputPieces);
    transferPieces += BigInt(row.inputs.transferPieces);
    staffMealsPieces += BigInt(row.inputs.staffMealsPieces);
    samplesPieces += BigInt(row.inputs.samplesPieces);
    returnsPieces += BigInt(row.inputs.returnsPieces);
    writeOffPieces += BigInt(row.inputs.writeOffPieces);
    productionEnd += BigInt(row.productionEnd);
    distributionEnd += BigInt(row.distributionEnd);

    if (row.revenueWithVat === null || row.revenueExVat === null) {
      if (row.salesPieces > 0) {
        revenueComplete = false;
      }
    } else {
      revenueWith += BigInt(row.revenueWithVat);
      revenueEx += BigInt(row.revenueExVat);
    }

    if (
      row.salesPieces > 0 &&
      (row.salesVolumeCostWithVat === null ||
        row.salesVolumeCostExVat === null ||
        row.contribution === null)
    ) {
      salesCostComplete = false;
    } else if (
      row.salesVolumeCostWithVat !== null &&
      row.salesVolumeCostExVat !== null &&
      row.contribution !== null
    ) {
      salesCostWith += BigInt(row.salesVolumeCostWithVat);
      salesCostEx += BigInt(row.salesVolumeCostExVat);
      contributionSum += BigInt(row.contribution);
    }

    if (
      row.inputs.outputPieces > 0 &&
      (row.outputVolumeCostWithVat === null ||
        row.outputVolumeCostExVat === null)
    ) {
      outputCostComplete = false;
    } else if (
      row.outputVolumeCostWithVat !== null &&
      row.outputVolumeCostExVat !== null
    ) {
      outputCostWith += BigInt(row.outputVolumeCostWithVat);
      outputCostEx += BigInt(row.outputVolumeCostExVat);
    }
  }

  const salesVolume = toSafeNumber(salesPieces);
  const outputVolume = toSafeNumber(outputPieces);
  const revenueWithVat = revenueComplete ? toSafeNumber(revenueWith) : null;
  const revenueExVat = revenueComplete ? toSafeNumber(revenueEx) : null;
  const salesVolumeCostWithVat = salesCostComplete
    ? toSafeNumber(salesCostWith)
    : null;
  const salesVolumeCostExVat = salesCostComplete
    ? toSafeNumber(salesCostEx)
    : null;
  const outputVolumeCostWithVat = outputCostComplete
    ? toSafeNumber(outputCostWith)
    : null;
  const outputVolumeCostExVat = outputCostComplete
    ? toSafeNumber(outputCostEx)
    : null;
  const priceWithVat = averageAmount(revenueWithVat, salesVolume);
  const priceExVat = averageAmount(revenueExVat, salesVolume);
  const salesUnitCostWithVat = averageAmount(
    salesVolumeCostWithVat,
    salesVolume,
  );
  const salesUnitCostExVat = averageAmount(salesVolumeCostExVat, salesVolume);
  const contribution =
    salesCostComplete && revenueComplete ? toSafeNumber(contributionSum) : null;

  return {
    productionStart: toSafeNumber(productionStart),
    distributionStart: toSafeNumber(distributionStart),
    salesPieces: salesVolume,
    outputPieces: outputVolume,
    transferPieces: toSafeNumber(transferPieces),
    staffMealsPieces: toSafeNumber(staffMealsPieces),
    samplesPieces: toSafeNumber(samplesPieces),
    returnsPieces: toSafeNumber(returnsPieces),
    writeOffPieces: toSafeNumber(writeOffPieces),
    productionEnd: toSafeNumber(productionEnd),
    distributionEnd: toSafeNumber(distributionEnd),
    revenueWithVat,
    revenueExVat,
    salesCostComplete,
    outputCostComplete,
    revenueComplete,
    salesVolumeCostWithVat,
    salesVolumeCostExVat,
    outputVolumeCostWithVat,
    outputVolumeCostExVat,
    contribution,
    priceWithVat,
    priceExVat,
    vatPercentHundredths: vatPercentHundredths(revenueWithVat, revenueExVat),
    salesUnitCostWithVat,
    salesUnitCostExVat,
    outputUnitCostWithVat: averageAmount(outputVolumeCostWithVat, outputVolume),
    outputUnitCostExVat: averageAmount(outputVolumeCostExVat, outputVolume),
    profitabilityHundredths:
      salesCostComplete && revenueComplete
        ? percentHundredths(contribution, salesVolumeCostExVat)
        : null,
  };
}

function salesFactGroups(
  document: PrototypeDocument,
  products: readonly Product[],
  rows: readonly SalesFactRow[],
): SalesFactGroup[] {
  const byId = new Map(rows.map((row) => [row.productId, row]));

  return visibleCategories(document, products).map((category) => {
    const groupRows = products
      .filter((item) => item.categoryId === category.id)
      .sort((left, right) => left.name.localeCompare(right.name, 'ru'))
      .flatMap((item) => {
        const row = byId.get(item.id);
        return row ? [row] : [];
      });

    return {
      categoryId: category.id,
      name: category.name,
      deleted: category.deletedAt !== null,
      rows: groupRows,
      totals: dayTotals(groupRows),
    };
  });
}

/** Дни месяца сверху вниз. `fact` — рабочая или удалённая запись, либо пустой месяц. */
export function salesFactMonth(
  document: PrototypeDocument,
  fact: SalesFact | null,
  month: string,
): SalesFactDayView[] {
  const products = salesFactGridProducts(document, fact, month);
  const chains = new Map(
    products.map((product) => [
      product.id,
      stockChain(document, fact, month, product.id),
    ]),
  );

  return monthDates(month).map((occurredOn, index) => {
    const rows = products.map((product) => {
      const stock = chains.get(product.id)?.[index] ?? {
        occurredOn,
        inputs: blankInputs(),
        salesPieces: 0,
        revenueWithVat: 0,
        revenueExVat: 0,
        productionStart: 0,
        distributionStart: 0,
        productionEnd: 0,
        distributionEnd: 0,
      };
      return rowMetrics(document, product, stock);
    });
    const groups = salesFactGroups(document, products, rows);
    const groupedRows = groups.flatMap((group) => group.rows);

    return {
      occurredOn,
      groups,
      rows: groupedRows,
      totals: dayTotals(groupedRows),
    };
  });
}

function inputRejection(inputs: SalesFactInputs): SalesFactRejection | null {
  const pieces = [
    inputs.outputPieces,
    inputs.transferPieces,
    inputs.staffMealsPieces,
    inputs.samplesPieces,
    inputs.returnsPieces,
    inputs.writeOffPieces,
  ];
  if (pieces.some((value) => !isPieces(value))) {
    return 'pieces';
  }

  return null;
}

function editableProduct(
  document: PrototypeDocument,
  month: string,
  productId: string,
  today: Date,
): SalesFactRejection | null {
  if (!salesFactMonthOpen(month, today)) {
    return 'month';
  }

  const product = productById(document, productId);
  if (!product) {
    return 'product';
  }
  if (product.deletedAt !== null) {
    return 'locked';
  }

  return null;
}

function replaceFacts(
  document: PrototypeDocument,
  salesFacts: SalesFact[],
): PrototypeDocument {
  return { ...document, salesFacts };
}

function withoutBlank(fact: SalesFact): SalesFact | null {
  if (fact.days.length === 0) {
    return null;
  }

  return fact;
}

function upsertFact(
  document: PrototypeDocument,
  month: string,
  factId: string,
  update: (fact: SalesFact) => SalesFact | null,
): PrototypeDocument | null {
  const current = workingSalesFact(document, month);
  if (!current) {
    if (
      !isEntityId(factId) ||
      document.salesFacts.some((item) => item.id === factId)
    ) {
      return null;
    }

    const created = update({
      id: factId,
      month,
      days: [],
      deletedAt: null,
    });
    if (!created) {
      return document;
    }

    return replaceFacts(document, [...document.salesFacts, created]);
  }

  const next = update(current);
  if (!next) {
    return replaceFacts(
      document,
      document.salesFacts.filter((item) => item.id !== current.id),
    );
  }
  if (next === current) {
    return document;
  }

  return replaceFacts(
    document,
    document.salesFacts.map((item) => (item.id === current.id ? next : item)),
  );
}

export function setSalesFactCellRejection(
  document: PrototypeDocument,
  month: string,
  occurredOn: string,
  productId: string,
  inputs: SalesFactInputs,
  ids: SalesFactIds,
  today: Date,
): SalesFactRejection | null {
  const locked = editableProduct(document, month, productId, today);
  if (locked) {
    return locked;
  }
  if (!occurredOn.startsWith(`${month}-`) || !isOccurredOn(occurredOn)) {
    return 'date';
  }

  const numbers = inputRejection(inputs);
  if (numbers) {
    return numbers;
  }

  const fact = workingSalesFact(document, month);
  const cell = fact?.days
    .find((day) => day.occurredOn === occurredOn)
    ?.cells.find((item) => item.productId === productId);
  if (!cell && inputsAreBlank(inputs)) {
    return null;
  }
  if (!fact && !isEntityId(ids.factId)) {
    return 'missing';
  }
  if (!cell && !isEntityId(ids.recordId)) {
    return 'missing';
  }
  if (
    fact &&
    !cell &&
    fact.days.some((day) => day.cells.some((item) => item.id === ids.recordId))
  ) {
    return 'missing';
  }
  return null;
}

export function setSalesFactCell(
  document: PrototypeDocument,
  month: string,
  occurredOn: string,
  productId: string,
  inputs: SalesFactInputs,
  ids: SalesFactIds,
  today: Date,
): PrototypeDocument {
  if (
    setSalesFactCellRejection(
      document,
      month,
      occurredOn,
      productId,
      inputs,
      ids,
      today,
    )
  ) {
    return document;
  }

  const fact = workingSalesFact(document, month);
  const existing = fact?.days
    .find((day) => day.occurredOn === occurredOn)
    ?.cells.find((item) => item.productId === productId);
  if (existing && sameInputs(inputsFromCell(existing), inputs)) {
    return document;
  }
  if (!existing && inputsAreBlank(inputs)) {
    return document;
  }

  const next = upsertFact(document, month, ids.factId, (current) => {
    const days = current.days.filter((day) => day.occurredOn !== occurredOn);
    const previous =
      current.days.find((day) => day.occurredOn === occurredOn)?.cells ?? [];
    const cells = previous.filter((cell) => cell.productId !== productId);
    if (!inputsAreBlank(inputs)) {
      const kept = previous.find((cell) => cell.productId === productId);
      cells.push({
        id: kept?.id ?? ids.recordId,
        productId,
        ...inputs,
      });
    }
    if (cells.length > 0) {
      days.push({ occurredOn, cells });
    }
    days.sort((left, right) => (left.occurredOn < right.occurredOn ? -1 : 1));
    return withoutBlank({ ...current, days });
  });

  return next ?? document;
}

export function deleteSalesFact(
  document: PrototypeDocument,
  id: string,
  deletedAt: string,
): PrototypeDocument {
  if (!isDeletionMark(deletedAt)) {
    return document;
  }

  const current = document.salesFacts.find(
    (item) => item.id === id && item.deletedAt === null,
  );
  if (!current) {
    return document;
  }

  return replaceFacts(
    document,
    document.salesFacts.map((item) =>
      item.id === id ? { ...item, deletedAt } : item,
    ),
  );
}

export function restoreSalesFactRejection(
  document: PrototypeDocument,
  id: string,
): SalesFactRejection | null {
  const current = document.salesFacts.find(
    (item) => item.id === id && item.deletedAt !== null,
  );
  if (!current) {
    return 'missing';
  }
  if (workingSalesFact(document, current.month)) {
    return 'taken';
  }

  return null;
}

export function restoreSalesFact(
  document: PrototypeDocument,
  id: string,
): PrototypeDocument {
  if (restoreSalesFactRejection(document, id)) {
    return document;
  }

  return replaceFacts(
    document,
    document.salesFacts.map((item) =>
      item.id === id ? { ...item, deletedAt: null } : item,
    ),
  );
}
