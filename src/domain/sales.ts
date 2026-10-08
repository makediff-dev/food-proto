import { isOccurredOn, type PrototypeDocument, type Sale, type SaleLine } from '@/domain/document';
import { amountExVat, averageAmount } from '@/domain/money';
import { productAllowedInPeriodSale } from '@/domain/period-grid';
import { daysInMonth, monthKeyFromDate, PLAN_HORIZON_MONTHS, planMonthOpen, shiftMonth } from '@/domain/sales-plan';

export type SaleRejection =
  | 'missing'
  | 'month'
  | 'date'
  | 'customer'
  | 'lines'
  | 'product'
  | 'duplicate-line'
  | 'pieces'
  | 'amount'
  | 'locked';

export interface SaleTotals {
  pieces: number | null;
  revenueWithVat: number | null;
  revenueExVat: number | null;
}

/** Последний день горизонта плана — верхняя граница даты продажи. */
export function maxSaleOccurredOn(today: Date): string {
  const month = shiftMonth(monthKeyFromDate(today), PLAN_HORIZON_MONTHS - 1);
  return `${month}-${String(daysInMonth(month)).padStart(2, '0')}`;
}

function normalizeCustomer(name: string): string {
  return name.trim();
}

function saleById(document: PrototypeDocument, id: string): Sale | null {
  return document.sales.find((item) => item.id === id) ?? null;
}

/** Все продажи в документе. Удалённых в массиве нет. */
export function workingSales(document: PrototypeDocument): Sale[] {
  return document.sales;
}

export function workingSalesInMonth(document: PrototypeDocument, month: string): Sale[] {
  return workingSales(document)
    .filter((item) => item.occurredOn.startsWith(`${month}-`))
    .sort((left, right) => {
      const byDate = left.occurredOn.localeCompare(right.occurredOn);
      if (byDate !== 0) {
        return byDate;
      }
      return left.customerName.localeCompare(right.customerName, 'ru');
    });
}

/**
 * Сумма строки с НДС из цены штуки и объёма.
 * В документ пишется сумма; цена штуки в документ не пишется.
 */
export function saleLineAmountWithVat(priceWithVat: number, pieces: number): number {
  return priceWithVat * pieces;
}

/** Цена штуки с НДС из суммы строки и объёма. В документ не пишется. */
export function saleLinePriceWithVat(amountWithVat: number, pieces: number): number | null {
  return averageAmount(amountWithVat, pieces);
}

export function saleTotals(document: PrototypeDocument, sale: Sale): SaleTotals {
  let pieces = 0;
  let revenueWith = 0;
  let revenueEx = 0;
  let revenueComplete = true;

  for (const line of sale.lines) {
    pieces += line.pieces;
    revenueWith += line.amountWithVat;
    const product = document.products.find((item) => item.id === line.productId);
    const ex = product === undefined ? null : amountExVat(line.amountWithVat, product.vatPercent);
    if (ex === null) {
      revenueComplete = false;
    } else {
      revenueEx += ex;
    }
  }

  return {
    pieces,
    revenueWithVat: revenueWith,
    revenueExVat: revenueComplete ? revenueEx : null,
  };
}

function lineRejection(
  document: PrototypeDocument,
  lines: readonly SaleLine[],
  previous: Sale | null,
  month: string,
): SaleRejection | null {
  if (lines.length === 0) {
    return 'lines';
  }

  const seenProducts = new Set<string>();
  const previousProducts = new Set(previous?.lines.map((line) => line.productId) ?? []);

  for (const line of lines) {
    if (seenProducts.has(line.productId)) {
      return 'duplicate-line';
    }

    const product = document.products.find((item) => item.id === line.productId);
    if (!product) {
      return 'product';
    }
    if (
      product.deletedAt !== null &&
      !previousProducts.has(line.productId) &&
      !productAllowedInPeriodSale(document, line.productId, month)
    ) {
      return 'locked';
    }
    if (!Number.isInteger(line.pieces) || line.pieces < 1) {
      return 'pieces';
    }
    if (!Number.isInteger(line.amountWithVat) || line.amountWithVat < 0) {
      return 'amount';
    }

    seenProducts.add(line.productId);
  }

  return null;
}

function writeRejection(
  document: PrototypeDocument,
  customerName: string,
  occurredOn: string,
  lines: readonly SaleLine[],
  today: Date,
  previous: Sale | null,
): SaleRejection | null {
  const customer = normalizeCustomer(customerName);
  if (customer.length === 0) {
    return 'customer';
  }
  if (!isOccurredOn(occurredOn)) {
    return 'date';
  }

  const month = occurredOn.slice(0, 7);
  if (!planMonthOpen(month, today)) {
    return 'month';
  }

  return lineRejection(document, lines, previous, month);
}

function replaceSales(document: PrototypeDocument, sales: Sale[]): PrototypeDocument {
  return { ...document, sales };
}

export function addSaleRejection(
  document: PrototypeDocument,
  customerName: string,
  occurredOn: string,
  lines: readonly SaleLine[],
  today: Date,
): SaleRejection | null {
  return writeRejection(document, customerName, occurredOn, lines, today, null);
}

export function addSale(
  document: PrototypeDocument,
  id: string,
  customerName: string,
  occurredOn: string,
  lines: readonly SaleLine[],
  today: Date,
): PrototypeDocument {
  if (addSaleRejection(document, customerName, occurredOn, lines, today)) {
    return document;
  }

  const sale: Sale = {
    id,
    customerName: normalizeCustomer(customerName),
    occurredOn,
    lines: lines.map((line) => ({ ...line })),
  };

  return replaceSales(document, [...document.sales, sale]);
}

export function updateSaleRejection(
  document: PrototypeDocument,
  id: string,
  customerName: string,
  occurredOn: string,
  lines: readonly SaleLine[],
  today: Date,
): SaleRejection | null {
  const current = saleById(document, id);
  if (!current) {
    return 'missing';
  }

  return writeRejection(document, customerName, occurredOn, lines, today, current);
}

export function updateSale(
  document: PrototypeDocument,
  id: string,
  customerName: string,
  occurredOn: string,
  lines: readonly SaleLine[],
  today: Date,
): PrototypeDocument {
  if (updateSaleRejection(document, id, customerName, occurredOn, lines, today)) {
    return document;
  }

  return replaceSales(
    document,
    document.sales.map((item) =>
      item.id === id
        ? {
            ...item,
            customerName: normalizeCustomer(customerName),
            occurredOn,
            lines: lines.map((line) => ({ ...line })),
          }
        : item,
    ),
  );
}

/** Стирает продажу из документа. Вернуть нельзя. */
export function deleteSale(document: PrototypeDocument, id: string): PrototypeDocument {
  const current = saleById(document, id);
  if (!current) {
    return document;
  }

  return replaceSales(
    document,
    document.sales.filter((item) => item.id !== id),
  );
}

export function saleByIdOrNull(document: PrototypeDocument, id: string): Sale | null {
  return saleById(document, id);
}

export function defaultSaleDay(month: string, today: Date): string {
  const todayKey = `${monthKeyFromDate(today)}-${String(today.getDate()).padStart(2, '0')}`;
  if (todayKey.startsWith(`${month}-`) && isOccurredOn(todayKey)) {
    return todayKey;
  }

  return `${month}-01`;
}
