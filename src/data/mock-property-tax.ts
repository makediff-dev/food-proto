import type { PropertyTaxMonth, TaxPaymentDay } from '@/domain/document';

function propertyTaxMonth(month: string, plan: number): PropertyTaxMonth {
  return {
    id: `property-tax:${month}`,
    month,
    plan,
  };
}

function propertyTaxPayment(occurredOn: string, amount: number): TaxPaymentDay {
  return {
    id: `tax-payment:property:${occurredOn}`,
    kind: 'property',
    occurredOn,
    amount,
  };
}

/**
 * Сентябрь–ноябрь 2026: план налога на имущество без расчёта базы.
 * Факт — дневные оплаты (1-е число; ноябрь — частичный).
 */
export const mockPropertyTaxMonths: PropertyTaxMonth[] = [
  propertyTaxMonth('2026-09', 85_000_00),
  propertyTaxMonth('2026-10', 85_000_00),
  propertyTaxMonth('2026-11', 85_000_00),
];

export const mockPropertyTaxPayments: TaxPaymentDay[] = [
  propertyTaxPayment('2026-09-01', 85_000_00),
  propertyTaxPayment('2026-10-01', 84_200_00),
  propertyTaxPayment('2026-11-01', 21_000_00),
];
