import { ratioKopecks, type UnitCost, unitCost } from '@/domain/cost';
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
  daysInMonth,
  monthKeyFromDate,
  priceExVatTenThousandths,
  profitabilityHundredths,
  revenueExVatKopecks,
  revenueWithVatKopecks,
} from '@/domain/sales-plan';
import { MAX_PRICE_PER_KILOGRAM_KOPECKS } from '@/domain/units';

const TEN_THOUSAND = BigInt(10_000);
const TWO = BigInt(2);
const ZERO = BigInt(0);

export type SalesFactRejection =
  | 'missing'
  | 'month'
  | 'date'
  | 'product'
  | 'locked'
  | 'price'
  | 'pieces'
  | 'opening'
  | 'overflow'
  | 'taken';

/** Серые вводы дня. На экране пустой день — нули, в документ он не пишется. */
export interface SalesFactInputs {
  priceWithVatKopecks: number;
  salesPieces: number;
  outputPieces: number;
  transferPieces: number;
  staffMealsPieces: number;
  samplesPieces: number;
  returnsPieces: number;
  writeOffPieces: number;
}

export interface SalesFactRow {
  productId: string;
  name: string;
  deleted: boolean;
  vatPercent: number | null;
  inputs: SalesFactInputs;
  productionStart: number;
  distributionStart: number;
  productionEnd: number;
  distributionEnd: number;
  /** Десятитысячные доли рубля. На экране до копеек, в выручку без НДС не подставляются. */
  priceExVatTenThousandths: number | null;
  revenueWithVatKopecks: number | null;
  revenueExVatKopecks: number | null;
  /** Себестоимость 1 шт с товара. Обе колонки «Себест, р/ед» совпадают. */
  unitCost: UnitCost | null;
  salesVolumeCostWithVatKopecks: number | null;
  salesVolumeCostExVatKopecks: number | null;
  outputVolumeCostWithVatKopecks: number | null;
  outputVolumeCostExVatKopecks: number | null;
  /** Выручка без НДС − себестоимость объёма продаж без НДС. */
  contributionKopecks: number | null;
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
  revenueWithVatKopecks: number | null;
  revenueExVatKopecks: number | null;
  /** Есть строка с объёмом продаж, у которой себестоимость не считается. */
  salesCostComplete: boolean;
  /** Есть строка с объёмом выпуска, у которой себестоимость не считается. */
  outputCostComplete: boolean;
  revenueComplete: boolean;
  salesVolumeCostWithVatKopecks: number | null;
  salesVolumeCostExVatKopecks: number | null;
  outputVolumeCostWithVatKopecks: number | null;
  outputVolumeCostExVatKopecks: number | null;
  contributionKopecks: number | null;
  /** Выручка с НДС / объём продаж, копейки. Не формула цены строки. */
  priceWithVatKopecks: number | null;
  /** Выручка без НДС / объём продаж, копейки. */
  priceExVatKopecks: number | null;
  /**
   * Сотые доли процента. `O = IF(I=0,0,H/I*100-100)`.
   * Нет цены без НДС — пусто.
   */
  vatPercentHundredths: number | null;
  salesUnitCostWithVatKopecks: number | null;
  salesUnitCostExVatKopecks: number | null;
  outputUnitCostWithVatKopecks: number | null;
  outputUnitCostExVatKopecks: number | null;
  profitabilityHundredths: number | null;
}

export interface SalesFactDayView {
  occurredOn: string;
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

function isPrice(value: number): boolean {
  return (
    Number.isInteger(value) &&
    value >= 0 &&
    value <= MAX_PRICE_PER_KILOGRAM_KOPECKS
  );
}

function isPieces(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= MAX_VOLUME_PIECES;
}

function isOpening(value: number): boolean {
  return (
    Number.isInteger(value) &&
    value >= -MAX_VOLUME_PIECES &&
    value <= MAX_VOLUME_PIECES
  );
}

function fitsSafeKopeckProduct(priceKopecks: number, volume: number): boolean {
  return (
    BigInt(priceKopecks) * BigInt(volume) <= BigInt(Number.MAX_SAFE_INTEGER)
  );
}

function toSafeNumber(value: bigint): number | null {
  if (
    value > BigInt(Number.MAX_SAFE_INTEGER) ||
    value < BigInt(Number.MIN_SAFE_INTEGER)
  ) {
    return null;
  }

  return Number(value);
}

function roundHalfAwayFromZero(
  numerator: bigint,
  denominator: bigint,
): number | null {
  if (denominator < ZERO) {
    return roundHalfAwayFromZero(-numerator, -denominator);
  }
  if (denominator === ZERO) {
    return null;
  }

  const negative = numerator < ZERO;
  const magnitude = negative ? -numerator : numerator;
  const rounded = (magnitude + denominator / TWO) / denominator;
  if (rounded > BigInt(Number.MAX_SAFE_INTEGER)) {
    return null;
  }

  const value = Number(rounded);
  return negative ? -value : value;
}

function multiplyKopecks(unitKopecks: number, volume: number): number | null {
  return toSafeNumber(BigInt(unitKopecks) * BigInt(volume));
}

export function blankInputs(): SalesFactInputs {
  return {
    priceWithVatKopecks: 0,
    salesPieces: 0,
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
    inputs.priceWithVatKopecks === 0 &&
    inputs.salesPieces === 0 &&
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
    priceWithVatKopecks: cell.priceWithVatKopecks,
    salesPieces: cell.salesPieces,
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
    left.priceWithVatKopecks === right.priceWithVatKopecks &&
    left.salesPieces === right.salesPieces &&
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

export function openingOf(
  fact: SalesFact | null,
  productId: string,
): { productionPieces: number; distributionPieces: number } {
  const opening = fact?.openings.find((item) => item.productId === productId);
  return {
    productionPieces: opening?.productionPieces ?? 0,
    distributionPieces: opening?.distributionPieces ?? 0,
  };
}

function finalProduct(
  document: PrototypeDocument,
  productId: string,
): Product | null {
  return document.products.find((item) => item.id === productId) ?? null;
}

/** Рабочие товары и те, на которые в этом месяце уже есть шапка или серый ввод. */
export function salesFactGridProducts(
  document: PrototypeDocument,
  fact: SalesFact | null,
): Product[] {
  const referenced = new Set<string>();
  if (fact) {
    for (const opening of fact.openings) {
      referenced.add(opening.productId);
    }
    for (const day of fact.days) {
      for (const cell of day.cells) {
        referenced.add(cell.productId);
      }
    }
  }

  return document.products.filter(
    (item) => item.deletedAt === null || referenced.has(item.id),
  );
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
  productionStart: number;
  distributionStart: number;
  productionEnd: number;
  distributionEnd: number;
}

/**
 * Цепочка календарных дней. Пропуск в документе не перескакивает остаток:
 * 1-е число берёт шапку, каждый следующий день — конец предыдущего.
 * Конец на производстве = начало + выпуск − перемещение на РЦ.
 * Конец на РЦ = начало − продажи + перемещение − питание − образцы + возвраты − списание.
 */
function stockChain(
  fact: SalesFact | null,
  month: string,
  productId: string,
): DayStock[] {
  const opening = openingOf(fact, productId);
  let production = opening.productionPieces;
  let distribution = opening.distributionPieces;
  const chain: DayStock[] = [];

  for (const occurredOn of monthDates(month)) {
    const inputs = inputsOn(fact, occurredOn, productId);
    const productionStart = production;
    const distributionStart = distribution;
    const productionEnd =
      productionStart + inputs.outputPieces - inputs.transferPieces;
    const distributionEnd =
      distributionStart -
      inputs.salesPieces +
      inputs.transferPieces -
      inputs.staffMealsPieces -
      inputs.samplesPieces +
      inputs.returnsPieces -
      inputs.writeOffPieces;
    chain.push({
      occurredOn,
      inputs,
      productionStart,
      distributionStart,
      productionEnd,
      distributionEnd,
    });
    production = productionEnd;
    distribution = distributionEnd;
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
  const revenueWith = revenueWithVatKopecks(
    inputs.priceWithVatKopecks,
    inputs.salesPieces,
  );
  const revenueEx =
    vat === null
      ? inputs.salesPieces === 0
        ? 0
        : null
      : revenueExVatKopecks(
          inputs.priceWithVatKopecks,
          vat,
          inputs.salesPieces,
        );
  const salesVolumeWith =
    cost === null
      ? null
      : multiplyKopecks(cost.withVatKopecks, inputs.salesPieces);
  const salesVolumeEx =
    cost === null
      ? null
      : multiplyKopecks(cost.exVatKopecks, inputs.salesPieces);
  const outputVolumeWith =
    cost === null
      ? null
      : multiplyKopecks(cost.withVatKopecks, inputs.outputPieces);
  const outputVolumeEx =
    cost === null
      ? null
      : multiplyKopecks(cost.exVatKopecks, inputs.outputPieces);
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
    productionStart: stock.productionStart,
    distributionStart: stock.distributionStart,
    productionEnd: stock.productionEnd,
    distributionEnd: stock.distributionEnd,
    priceExVatTenThousandths:
      vat === null
        ? null
        : priceExVatTenThousandths(inputs.priceWithVatKopecks, vat),
    revenueWithVatKopecks: revenueWith,
    revenueExVatKopecks: revenueEx,
    unitCost: cost,
    salesVolumeCostWithVatKopecks: salesVolumeWith,
    salesVolumeCostExVatKopecks: salesVolumeEx,
    outputVolumeCostWithVatKopecks: outputVolumeWith,
    outputVolumeCostExVatKopecks: outputVolumeEx,
    contributionKopecks: contribution,
    profitabilityHundredths:
      cost === null || vat === null
        ? null
        : profitabilityHundredths(
            inputs.priceWithVatKopecks,
            vat,
            cost.exVatKopecks,
          ),
  };
}

function averageKopecks(
  amount: number | null,
  volume: number | null,
): number | null {
  if (amount === null || volume === null || volume <= 0) {
    return null;
  }

  return ratioKopecks(BigInt(amount), BigInt(volume));
}

/**
 * НДС «Всего»: выручка с НДС / выручка без НДС × 100 − 100.
 * Через суммы выручек, без промежуточного округления средних цен —
 * иначе при одной строке ставка уезжает на сотые доли процента.
 */
function totalVatHundredths(
  revenueWithVatKopecks: number | null,
  revenueExVatKopecks: number | null,
): number | null {
  if (revenueWithVatKopecks === null || revenueExVatKopecks === null) {
    return null;
  }
  if (revenueExVatKopecks === 0) {
    return 0;
  }

  return roundHalfAwayFromZero(
    (BigInt(revenueWithVatKopecks) - BigInt(revenueExVatKopecks)) *
      TEN_THOUSAND,
    BigInt(revenueExVatKopecks),
  );
}

/**
 * Рентабельность «Всего»: Т-проток / себестоимость объёма продаж без НДС.
 * Как на плане — из сумм, не из средних цен, уже округлённых до копейки.
 */
function totalProfitabilityHundredths(
  contributionKopecks: number | null,
  salesVolumeCostExVatKopecks: number | null,
): number | null {
  if (contributionKopecks === null || salesVolumeCostExVatKopecks === null) {
    return null;
  }
  if (salesVolumeCostExVatKopecks === 0) {
    return 0;
  }

  return roundHalfAwayFromZero(
    BigInt(contributionKopecks) * TEN_THOUSAND,
    BigInt(salesVolumeCostExVatKopecks),
  );
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
  let contribution = ZERO;
  let salesCostComplete = true;
  let outputCostComplete = true;
  let revenueComplete = true;

  for (const row of rows) {
    productionStart += BigInt(row.productionStart);
    distributionStart += BigInt(row.distributionStart);
    salesPieces += BigInt(row.inputs.salesPieces);
    outputPieces += BigInt(row.inputs.outputPieces);
    transferPieces += BigInt(row.inputs.transferPieces);
    staffMealsPieces += BigInt(row.inputs.staffMealsPieces);
    samplesPieces += BigInt(row.inputs.samplesPieces);
    returnsPieces += BigInt(row.inputs.returnsPieces);
    writeOffPieces += BigInt(row.inputs.writeOffPieces);
    productionEnd += BigInt(row.productionEnd);
    distributionEnd += BigInt(row.distributionEnd);

    if (
      row.revenueWithVatKopecks === null ||
      row.revenueExVatKopecks === null
    ) {
      if (row.inputs.salesPieces > 0) {
        revenueComplete = false;
      }
    } else {
      revenueWith += BigInt(row.revenueWithVatKopecks);
      revenueEx += BigInt(row.revenueExVatKopecks);
    }

    if (
      row.inputs.salesPieces > 0 &&
      (row.salesVolumeCostWithVatKopecks === null ||
        row.salesVolumeCostExVatKopecks === null ||
        row.contributionKopecks === null)
    ) {
      salesCostComplete = false;
    } else if (
      row.salesVolumeCostWithVatKopecks !== null &&
      row.salesVolumeCostExVatKopecks !== null &&
      row.contributionKopecks !== null
    ) {
      salesCostWith += BigInt(row.salesVolumeCostWithVatKopecks);
      salesCostEx += BigInt(row.salesVolumeCostExVatKopecks);
      contribution += BigInt(row.contributionKopecks);
    }

    if (
      row.inputs.outputPieces > 0 &&
      (row.outputVolumeCostWithVatKopecks === null ||
        row.outputVolumeCostExVatKopecks === null)
    ) {
      outputCostComplete = false;
    } else if (
      row.outputVolumeCostWithVatKopecks !== null &&
      row.outputVolumeCostExVatKopecks !== null
    ) {
      outputCostWith += BigInt(row.outputVolumeCostWithVatKopecks);
      outputCostEx += BigInt(row.outputVolumeCostExVatKopecks);
    }
  }

  const salesVolume = toSafeNumber(salesPieces);
  const outputVolume = toSafeNumber(outputPieces);
  const revenueWithVatKopecks = revenueComplete
    ? toSafeNumber(revenueWith)
    : null;
  const revenueExVatKopecks = revenueComplete ? toSafeNumber(revenueEx) : null;
  const salesVolumeCostWithVatKopecks = salesCostComplete
    ? toSafeNumber(salesCostWith)
    : null;
  const salesVolumeCostExVatKopecks = salesCostComplete
    ? toSafeNumber(salesCostEx)
    : null;
  const outputVolumeCostWithVatKopecks = outputCostComplete
    ? toSafeNumber(outputCostWith)
    : null;
  const outputVolumeCostExVatKopecks = outputCostComplete
    ? toSafeNumber(outputCostEx)
    : null;
  const priceWithVatKopecks = averageKopecks(
    revenueWithVatKopecks,
    salesVolume,
  );
  const priceExVatKopecks = averageKopecks(revenueExVatKopecks, salesVolume);
  const salesUnitCostWithVatKopecks = averageKopecks(
    salesVolumeCostWithVatKopecks,
    salesVolume,
  );
  const salesUnitCostExVatKopecks = averageKopecks(
    salesVolumeCostExVatKopecks,
    salesVolume,
  );
  const contributionKopecks =
    salesCostComplete && revenueComplete ? toSafeNumber(contribution) : null;

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
    revenueWithVatKopecks,
    revenueExVatKopecks,
    salesCostComplete,
    outputCostComplete,
    revenueComplete,
    salesVolumeCostWithVatKopecks,
    salesVolumeCostExVatKopecks,
    outputVolumeCostWithVatKopecks,
    outputVolumeCostExVatKopecks,
    contributionKopecks,
    priceWithVatKopecks,
    priceExVatKopecks,
    vatPercentHundredths: totalVatHundredths(
      revenueWithVatKopecks,
      revenueExVatKopecks,
    ),
    salesUnitCostWithVatKopecks,
    salesUnitCostExVatKopecks,
    outputUnitCostWithVatKopecks: averageKopecks(
      outputVolumeCostWithVatKopecks,
      outputVolume,
    ),
    outputUnitCostExVatKopecks: averageKopecks(
      outputVolumeCostExVatKopecks,
      outputVolume,
    ),
    profitabilityHundredths:
      salesCostComplete && revenueComplete
        ? totalProfitabilityHundredths(
            contributionKopecks,
            salesVolumeCostExVatKopecks,
          )
        : null,
  };
}

/** Дни месяца сверху вниз. `fact` — рабочая или удалённая запись, либо пустой месяц. */
export function salesFactMonth(
  document: PrototypeDocument,
  fact: SalesFact | null,
  month: string,
): SalesFactDayView[] {
  const products = salesFactGridProducts(document, fact);
  const chains = new Map(
    products.map((product) => [
      product.id,
      stockChain(fact, month, product.id),
    ]),
  );

  return monthDates(month).map((occurredOn, index) => {
    const rows = products.map((product) => {
      const stock = chains.get(product.id)?.[index] ?? {
        occurredOn,
        inputs: blankInputs(),
        productionStart: 0,
        distributionStart: 0,
        productionEnd: 0,
        distributionEnd: 0,
      };
      return rowMetrics(document, product, stock);
    });

    return { occurredOn, rows, totals: dayTotals(rows) };
  });
}

function inputRejection(inputs: SalesFactInputs): SalesFactRejection | null {
  if (!isPrice(inputs.priceWithVatKopecks)) {
    return 'price';
  }

  const pieces = [
    inputs.salesPieces,
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
  if (!fitsSafeKopeckProduct(inputs.priceWithVatKopecks, inputs.salesPieces)) {
    return 'overflow';
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

  const product = finalProduct(document, productId);
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
  if (fact.openings.length === 0 && fact.days.length === 0) {
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
      openings: [],
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
  if (fact?.openings.some((item) => item.id === ids.recordId) && !cell) {
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

export function setSalesFactOpeningRejection(
  document: PrototypeDocument,
  month: string,
  productId: string,
  productionPieces: number,
  distributionPieces: number,
  ids: SalesFactIds,
  today: Date,
): SalesFactRejection | null {
  const locked = editableProduct(document, month, productId, today);
  if (locked) {
    return locked;
  }
  if (!isOpening(productionPieces) || !isOpening(distributionPieces)) {
    return 'opening';
  }

  const fact = workingSalesFact(document, month);
  const opening = fact?.openings.find((item) => item.productId === productId);
  const blank = productionPieces === 0 && distributionPieces === 0;
  if (!opening && blank) {
    return null;
  }
  if (!fact && !isEntityId(ids.factId)) {
    return 'missing';
  }
  if (!opening && !isEntityId(ids.recordId)) {
    return 'missing';
  }
  if (
    fact &&
    !opening &&
    fact.openings.some((item) => item.id === ids.recordId)
  ) {
    return 'missing';
  }
  if (
    fact &&
    !opening &&
    fact.days.some((day) => day.cells.some((cell) => cell.id === ids.recordId))
  ) {
    return 'missing';
  }

  return null;
}

export function setSalesFactOpening(
  document: PrototypeDocument,
  month: string,
  productId: string,
  productionPieces: number,
  distributionPieces: number,
  ids: SalesFactIds,
  today: Date,
): PrototypeDocument {
  if (
    setSalesFactOpeningRejection(
      document,
      month,
      productId,
      productionPieces,
      distributionPieces,
      ids,
      today,
    )
  ) {
    return document;
  }

  const fact = workingSalesFact(document, month);
  const existing = fact?.openings.find((item) => item.productId === productId);
  if (
    existing &&
    existing.productionPieces === productionPieces &&
    existing.distributionPieces === distributionPieces
  ) {
    return document;
  }
  if (!existing && productionPieces === 0 && distributionPieces === 0) {
    return document;
  }

  const next = upsertFact(document, month, ids.factId, (current) => {
    const openings = current.openings.filter(
      (item) => item.productId !== productId,
    );
    if (productionPieces !== 0 || distributionPieces !== 0) {
      const kept = current.openings.find(
        (item) => item.productId === productId,
      );
      openings.push({
        id: kept?.id ?? ids.recordId,
        productId,
        productionPieces,
        distributionPieces,
      });
    }
    return withoutBlank({ ...current, openings });
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
