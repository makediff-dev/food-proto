import {
  isOccurredOn,
  MAX_ID_LENGTH,
  MAX_LABEL_LENGTH,
  MAX_SALE_LINE_AMOUNT,
  MAX_VOLUME_PIECES,
  type PrototypeDocument,
  type Sale,
  type SaleLine,
} from '@/domain/document';
import {
  amountExVat,
  averageAmount,
  multiplyAmount,
  toSafeNumber,
} from '@/domain/money';
import { productAllowedInPeriodSale } from '@/domain/period-grid';
import {
  daysInMonth,
  monthKeyFromDate,
  PLAN_HORIZON_MONTHS,
  planMonthOpen,
  shiftMonth,
} from '@/domain/sales-plan';

const ZERO = BigInt(0);

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

/** С 2000-01 до горизонта плана — как планирование и сводка. */
function saleMonthOpen(month: string, today: Date): boolean {
  return planMonthOpen(month, today);
}

/** Последний день горизонта плана — верхняя граница даты продажи. */
export function maxSaleOccurredOn(today: Date): string {
  const month = shiftMonth(monthKeyFromDate(today), PLAN_HORIZON_MONTHS - 1);
  return `${month}-${String(daysInMonth(month)).padStart(2, '0')}`;
}

function isEntityId(value: string): boolean {
  return (
    value.length > 0 && value.length <= MAX_ID_LENGTH && value === value.trim()
  );
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

export function workingSalesInMonth(
  document: PrototypeDocument,
  month: string,
): Sale[] {
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
export function saleLineAmountWithVat(
  priceWithVat: number,
  pieces: number,
): number | null {
  const amount = multiplyAmount(priceWithVat, pieces);
  if (amount === null || amount > MAX_SALE_LINE_AMOUNT) {
    return null;
  }

  return amount;
}

/** Цена штуки с НДС из суммы строки и объёма. В документ не пишется. */
export function saleLinePriceWithVat(
  amountWithVat: number,
  pieces: number,
): number | null {
  return averageAmount(amountWithVat, pieces);
}

export function saleTotals(
  document: PrototypeDocument,
  sale: Sale,
): SaleTotals {
  let pieces = ZERO;
  let revenueWith = ZERO;
  let revenueEx = ZERO;
  let revenueComplete = true;

  for (const line of sale.lines) {
    pieces += BigInt(line.pieces);
    revenueWith += BigInt(line.amountWithVat);
    const product = document.products.find(
      (item) => item.id === line.productId,
    );
    const ex =
      product === undefined
        ? null
        : amountExVat(line.amountWithVat, product.vatPercent);
    if (ex === null) {
      revenueComplete = false;
    } else {
      revenueEx += BigInt(ex);
    }
  }

  return {
    pieces: toSafeNumber(pieces),
    revenueWithVat: toSafeNumber(revenueWith),
    revenueExVat: revenueComplete ? toSafeNumber(revenueEx) : null,
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

  const seenLines = new Set<string>();
  const seenProducts = new Set<string>();
  const previousProducts = new Set(
    previous?.lines.map((line) => line.productId) ?? [],
  );

  for (const line of lines) {
    if (!isEntityId(line.id)) {
      return 'missing';
    }
    if (seenLines.has(line.id)) {
      return 'duplicate-line';
    }
    if (seenProducts.has(line.productId)) {
      return 'duplicate-line';
    }

    const product = document.products.find(
      (item) => item.id === line.productId,
    );
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
    if (
      !Number.isInteger(line.pieces) ||
      line.pieces < 1 ||
      line.pieces > MAX_VOLUME_PIECES
    ) {
      return 'pieces';
    }
    if (
      !Number.isInteger(line.amountWithVat) ||
      line.amountWithVat < 0 ||
      line.amountWithVat > MAX_SALE_LINE_AMOUNT
    ) {
      return 'amount';
    }

    seenLines.add(line.id);
    seenProducts.add(line.productId);
  }

  return null;
}

function writeRejection(
  document: PrototypeDocument,
  id: string,
  customerName: string,
  occurredOn: string,
  lines: readonly SaleLine[],
  today: Date,
  previous: Sale | null,
): SaleRejection | null {
  if (!isEntityId(id)) {
    return 'missing';
  }
  if (!previous && document.sales.some((item) => item.id === id)) {
    return 'missing';
  }

  const customer = normalizeCustomer(customerName);
  if (customer.length === 0 || customer.length > MAX_LABEL_LENGTH) {
    return 'customer';
  }
  if (!isOccurredOn(occurredOn)) {
    return 'date';
  }

  const month = occurredOn.slice(0, 7);
  if (!saleMonthOpen(month, today)) {
    return 'month';
  }

  return lineRejection(document, lines, previous, month);
}

function replaceSales(
  document: PrototypeDocument,
  sales: Sale[],
): PrototypeDocument {
  return { ...document, sales };
}

export function addSaleRejection(
  document: PrototypeDocument,
  id: string,
  customerName: string,
  occurredOn: string,
  lines: readonly SaleLine[],
  today: Date,
): SaleRejection | null {
  return writeRejection(
    document,
    id,
    customerName,
    occurredOn,
    lines,
    today,
    null,
  );
}

export function addSale(
  document: PrototypeDocument,
  id: string,
  customerName: string,
  occurredOn: string,
  lines: readonly SaleLine[],
  today: Date,
): PrototypeDocument {
  if (addSaleRejection(document, id, customerName, occurredOn, lines, today)) {
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

  return writeRejection(
    document,
    id,
    customerName,
    occurredOn,
    lines,
    today,
    current,
  );
}

export function updateSale(
  document: PrototypeDocument,
  id: string,
  customerName: string,
  occurredOn: string,
  lines: readonly SaleLine[],
  today: Date,
): PrototypeDocument {
  if (
    updateSaleRejection(document, id, customerName, occurredOn, lines, today)
  ) {
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
export function deleteSale(
  document: PrototypeDocument,
  id: string,
): PrototypeDocument {
  const current = saleById(document, id);
  if (!current) {
    return document;
  }

  return replaceSales(
    document,
    document.sales.filter((item) => item.id !== id),
  );
}

export function saleByIdOrNull(
  document: PrototypeDocument,
  id: string,
): Sale | null {
  return saleById(document, id);
}

export function defaultSaleDay(month: string, today: Date): string {
  const todayKey = `${monthKeyFromDate(today)}-${String(today.getDate()).padStart(2, '0')}`;
  if (todayKey.startsWith(`${month}-`) && isOccurredOn(todayKey)) {
    return todayKey;
  }

  return `${month}-01`;
}
