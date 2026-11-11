import type { PropertyTaxMonth } from '@/domain/document';

function propertyTaxMonth(month: string, plan: number, fact: number): PropertyTaxMonth {
  return {
    id: `property-tax:${month}`,
    month,
    plan,
    fact,
  };
}

/**
 * Сентябрь–ноябрь 2026: итоговый налог на имущество без расчёта базы.
 * Ноябрь — частичный факт (месяц ещё идёт).
 */
export const mockPropertyTaxMonths: PropertyTaxMonth[] = [
  propertyTaxMonth('2026-09', 85_000_00, 85_000_00),
  propertyTaxMonth('2026-10', 85_000_00, 84_200_00),
  propertyTaxMonth('2026-11', 85_000_00, 21_000_00),
];
