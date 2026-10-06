import { visibleCategories } from '@/domain/categories';
import { type UnitCost, unitCost } from '@/domain/cost';
import {
  isMonthKey,
  isOccurredOn,
  type Product,
  type PrototypeDocument,
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
import { daysInMonth, monthKeyFromDate } from '@/domain/sales-plan';

const ZERO = BigInt(0);

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
  salesPieces: number;
  /** Выручка / объём, копейки. Нет объёма — пусто. */
  priceWithVat: number | null;
  priceExVat: number | null;
  revenueWithVat: number | null;
  revenueExVat: number | null;
  /** Себестоимость 1 шт с товара. */
  unitCost: UnitCost | null;
  salesVolumeCostWithVat: number | null;
  salesVolumeCostExVat: number | null;
  /** Выручка без НДС − себестоимость объёма продаж без НДС. */
  contribution: number | null;
  profitabilityHundredths: number | null;
}

export interface SalesFactTotals {
  salesPieces: number | null;
  revenueWithVat: number | null;
  revenueExVat: number | null;
  /** Есть строка с объёмом продаж, у которой себестоимость не считается. */
  salesCostComplete: boolean;
  revenueComplete: boolean;
  salesVolumeCostWithVat: number | null;
  salesVolumeCostExVat: number | null;
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

/** Рабочие товары и те, на которые в этом месяце есть продажа. */
export function salesFactGridProducts(
  document: PrototypeDocument,
  month: string,
): Product[] {
  const referenced = new Set<string>();
  for (const sale of salesInMonth(document, month)) {
    for (const line of sale.lines) {
      referenced.add(line.productId);
    }
  }

  return document.products.filter(
    (item) => item.deletedAt === null || referenced.has(item.id),
  );
}

function rowMetrics(
  document: PrototypeDocument,
  product: Product,
  sold: SaleDayProduct,
): SalesFactRow {
  const vat = product.vatPercent;
  const cost = unitCost(document, product.id);
  const salesPieces = sold.pieces;
  const revenueWith = sold.revenueWithVat;
  const revenueEx = sold.revenueExVat;
  const salesVolumeWith =
    cost === null ? null : multiplyAmount(cost.withVat, salesPieces);
  const salesVolumeEx =
    cost === null ? null : multiplyAmount(cost.exVat, salesPieces);
  const contribution =
    revenueEx === null || salesVolumeEx === null
      ? null
      : revenueEx - salesVolumeEx;

  return {
    productId: product.id,
    name: product.name,
    deleted: product.deletedAt !== null,
    vatPercent: vat,
    salesPieces,
    priceWithVat: averageAmount(revenueWith, salesPieces),
    priceExVat: averageAmount(revenueEx, salesPieces),
    revenueWithVat: revenueWith,
    revenueExVat: revenueEx,
    unitCost: cost,
    salesVolumeCostWithVat: salesVolumeWith,
    salesVolumeCostExVat: salesVolumeEx,
    contribution: contribution,
    profitabilityHundredths:
      contribution === null || salesVolumeEx === null
        ? null
        : percentHundredths(contribution, salesVolumeEx),
  };
}

function dayTotals(rows: readonly SalesFactRow[]): SalesFactTotals {
  let salesPieces = ZERO;
  let revenueWith = ZERO;
  let revenueEx = ZERO;
  let salesCostWith = ZERO;
  let salesCostEx = ZERO;
  let contributionSum = ZERO;
  let salesCostComplete = true;
  let revenueComplete = true;

  for (const row of rows) {
    salesPieces += BigInt(row.salesPieces);

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
  }

  const salesVolume = toSafeNumber(salesPieces);
  const revenueWithVat = revenueComplete ? toSafeNumber(revenueWith) : null;
  const revenueExVat = revenueComplete ? toSafeNumber(revenueEx) : null;
  const salesVolumeCostWithVat = salesCostComplete
    ? toSafeNumber(salesCostWith)
    : null;
  const salesVolumeCostExVat = salesCostComplete
    ? toSafeNumber(salesCostEx)
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
    salesPieces: salesVolume,
    revenueWithVat,
    revenueExVat,
    salesCostComplete,
    revenueComplete,
    salesVolumeCostWithVat,
    salesVolumeCostExVat,
    contribution,
    priceWithVat,
    priceExVat,
    vatPercentHundredths: vatPercentHundredths(revenueWithVat, revenueExVat),
    salesUnitCostWithVat,
    salesUnitCostExVat,
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

/** Дни месяца сверху вниз. Факт дня считается из журнала продаж. */
export function salesFactMonth(
  document: PrototypeDocument,
  month: string,
): SalesFactDayView[] {
  const products = salesFactGridProducts(document, month);

  return monthDates(month).map((occurredOn) => {
    const rows = products.map((product) =>
      rowMetrics(
        document,
        product,
        saleDayProduct(document, occurredOn, product.id),
      ),
    );
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
