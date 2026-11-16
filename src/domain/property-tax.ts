import { isMonthKey, type PropertyTaxMonth, type PrototypeDocument } from '@/domain/document';
import { taxPaymentMonthTotal } from '@/domain/tax-payment';

const MAX_MONEY = 100_000_000_000;

export type PropertyTaxRejection = 'month' | 'amount';

export interface PropertyTaxMonthView {
  month: string;
  plan: number;
  /** Сумма дневных оплат (kind `property`). */
  fact: number;
  variance: number;
}

function isMoney(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= MAX_MONEY;
}

export function propertyTaxMonthsList(document: PrototypeDocument): PropertyTaxMonth[] {
  return document.propertyTaxMonths ?? [];
}

function monthRecord(document: PrototypeDocument, month: string): PropertyTaxMonth | null {
  return propertyTaxMonthsList(document).find((item) => item.month === month) ?? null;
}

export function propertyTaxForMonth(document: PrototypeDocument, month: string): PropertyTaxMonthView {
  const plan = monthRecord(document, month)?.plan ?? 0;
  const fact = taxPaymentMonthTotal(document, 'property', month);
  return {
    month,
    plan,
    fact,
    variance: fact - plan,
  };
}

export function setPropertyTaxPlanRejection(
  document: PrototypeDocument,
  month: string,
  amount: number,
): PropertyTaxRejection | null {
  void document;
  if (!isMonthKey(month)) {
    return 'month';
  }
  if (!isMoney(amount)) {
    return 'amount';
  }
  return null;
}

export function setPropertyTaxPlan(document: PrototypeDocument, month: string, amount: number): PrototypeDocument {
  if (setPropertyTaxPlanRejection(document, month, amount)) {
    return document;
  }

  const existing = monthRecord(document, month);
  const keep = amount !== 0;

  if (!existing) {
    if (!keep) {
      return document;
    }
    const next: PropertyTaxMonth = {
      id: `property-tax:${month}`,
      month,
      plan: amount,
    };
    return {
      ...document,
      propertyTaxMonths: [...propertyTaxMonthsList(document), next],
    };
  }

  if (!keep) {
    return {
      ...document,
      propertyTaxMonths: propertyTaxMonthsList(document).filter((item) => item.month !== month),
    };
  }

  return {
    ...document,
    propertyTaxMonths: propertyTaxMonthsList(document).map((item) =>
      item.month === month ? { ...item, plan: amount } : item,
    ),
  };
}
