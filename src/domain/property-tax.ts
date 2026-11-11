import { isMonthKey, type PropertyTaxMonth, type PrototypeDocument } from '@/domain/document';

const MAX_MONEY = 100_000_000_000;

export type PropertyTaxField = 'plan' | 'fact';

export type PropertyTaxRejection = 'month' | 'amount';

export interface PropertyTaxMonthView {
  month: string;
  plan: number;
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
  const stored = monthRecord(document, month);
  const plan = stored?.plan ?? 0;
  const fact = stored?.fact ?? 0;
  return {
    month,
    plan,
    fact,
    variance: fact - plan,
  };
}

export function setPropertyTaxFieldRejection(
  document: PrototypeDocument,
  month: string,
  field: PropertyTaxField,
  amount: number,
): PropertyTaxRejection | null {
  void document;
  void field;
  if (!isMonthKey(month)) {
    return 'month';
  }
  if (!isMoney(amount)) {
    return 'amount';
  }
  return null;
}

export function setPropertyTaxField(
  document: PrototypeDocument,
  month: string,
  field: PropertyTaxField,
  amount: number,
): PrototypeDocument {
  if (setPropertyTaxFieldRejection(document, month, field, amount)) {
    return document;
  }

  const existing = monthRecord(document, month);
  const current: PropertyTaxMonth = existing ?? {
    id: `property-tax:${month}`,
    month,
    plan: 0,
    fact: 0,
  };
  const next: PropertyTaxMonth = { ...current, [field]: amount };
  const keep = next.plan !== 0 || next.fact !== 0;

  if (!existing) {
    if (!keep) {
      return document;
    }
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
    propertyTaxMonths: propertyTaxMonthsList(document).map((item) => (item.month === month ? next : item)),
  };
}
