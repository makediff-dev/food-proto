import {
  isMonthKey,
  isOccurredOn,
  type PrototypeDocument,
  type TaxPaymentDay,
  type TaxPaymentKind,
} from '@/domain/document';
import { monthDates } from '@/domain/sales-fact';
import { daysInMonth } from '@/domain/sales-plan';

const MAX_MONEY = 100_000_000_000;

export const TAX_PAYMENT_KINDS = [
  'vat',
  'ndfl',
  'social',
  'injury',
  'profit',
  'property',
] as const satisfies readonly TaxPaymentKind[];

export const TAX_PAYMENT_LABEL: Record<TaxPaymentKind, string> = {
  vat: 'Оплата НДС',
  ndfl: 'НДФЛ',
  social: 'Соцстрах',
  injury: 'Травматизм',
  profit: 'Налог на прибыль',
  property: 'Налог на имущество',
};

export type TaxPaymentRejection = 'day' | 'amount' | 'kind';

export interface TaxPaymentDayView {
  occurredOn: string;
  amount: number;
}

export interface TaxPaymentKindMonthView {
  kind: TaxPaymentKind;
  month: string;
  days: TaxPaymentDayView[];
  total: number;
}

function isSignedMoney(value: number): boolean {
  return Number.isInteger(value) && Math.abs(value) <= MAX_MONEY;
}

export function isTaxPaymentKind(value: string): value is TaxPaymentKind {
  return (TAX_PAYMENT_KINDS as readonly string[]).includes(value);
}

export function taxPaymentDaysList(document: PrototypeDocument): TaxPaymentDay[] {
  return document.taxPaymentDays ?? [];
}

function dayRecord(document: PrototypeDocument, kind: TaxPaymentKind, occurredOn: string): TaxPaymentDay | null {
  return taxPaymentDaysList(document).find((item) => item.kind === kind && item.occurredOn === occurredOn) ?? null;
}

/** Сумма оплаты вида налога за день. Нет записи — 0. */
export function taxPaymentForDay(document: PrototypeDocument, kind: TaxPaymentKind, occurredOn: string): number {
  if (!isOccurredOn(occurredOn)) {
    return 0;
  }
  return dayRecord(document, kind, occurredOn)?.amount ?? 0;
}

/** Сумма оплат вида налога за месяц. Пустой месяц — 0. */
export function taxPaymentMonthTotal(document: PrototypeDocument, kind: TaxPaymentKind, month: string): number {
  if (!isMonthKey(month)) {
    return 0;
  }
  let total = 0;
  for (const item of taxPaymentDaysList(document)) {
    if (item.kind === kind && item.occurredOn.startsWith(`${month}-`)) {
      total += item.amount;
    }
  }
  return total;
}

export function taxPaymentKindMonthView(
  document: PrototypeDocument,
  kind: TaxPaymentKind,
  month: string,
): TaxPaymentKindMonthView {
  const byDay = new Map(
    taxPaymentDaysList(document)
      .filter((item) => item.kind === kind)
      .map((item) => [item.occurredOn, item.amount]),
  );
  const days = monthDates(month).map((occurredOn) => ({
    occurredOn,
    amount: byDay.get(occurredOn) ?? 0,
  }));
  return {
    kind,
    month,
    days,
    total: taxPaymentMonthTotal(document, kind, month),
  };
}

export function setTaxPaymentDayRejection(
  document: PrototypeDocument,
  kind: TaxPaymentKind,
  occurredOn: string,
  amount: number,
): TaxPaymentRejection | null {
  void document;
  if (!isTaxPaymentKind(kind)) {
    return 'kind';
  }
  if (!isOccurredOn(occurredOn) || occurredOn < '2000-01-01') {
    return 'day';
  }
  const month = occurredOn.slice(0, 7);
  if (!isMonthKey(month)) {
    return 'day';
  }
  const day = Number(occurredOn.slice(8, 10));
  if (day < 1 || day > daysInMonth(month)) {
    return 'day';
  }
  if (!isSignedMoney(amount)) {
    return 'amount';
  }
  return null;
}

export function setTaxPaymentDay(
  document: PrototypeDocument,
  kind: TaxPaymentKind,
  occurredOn: string,
  amount: number,
): PrototypeDocument {
  if (setTaxPaymentDayRejection(document, kind, occurredOn, amount)) {
    return document;
  }

  const existing = dayRecord(document, kind, occurredOn);
  const keep = amount !== 0;

  if (!existing) {
    if (!keep) {
      return document;
    }
    const next: TaxPaymentDay = {
      id: `tax-payment:${kind}:${occurredOn}`,
      kind,
      occurredOn,
      amount,
    };
    return {
      ...document,
      taxPaymentDays: [...taxPaymentDaysList(document), next],
    };
  }

  if (!keep) {
    return {
      ...document,
      taxPaymentDays: taxPaymentDaysList(document).filter(
        (item) => !(item.kind === kind && item.occurredOn === occurredOn),
      ),
    };
  }

  return {
    ...document,
    taxPaymentDays: taxPaymentDaysList(document).map((item) =>
      item.kind === kind && item.occurredOn === occurredOn ? { ...item, amount } : item,
    ),
  };
}
