import type { Creditor, CreditResourceMonth } from '@/domain/document';

/** Т-Банк из книги `CashFlow!D145`, ставка 18 %. Стартовое тело — масштаб мока. */
export const mockCreditors: Creditor[] = [
  {
    id: 'creditor:t-bank',
    name: 'Т-Банк',
    initialPrincipal: 5_000_000_00,
    interestRateHundredths: 1800,
    deletedAt: null,
  },
];

/** Начальный остаток денег на старте учёта (масштаб мока). */
export const mockInitialCashBalance = 2_500_000_00;

function creditMonth(
  month: string,
  line: {
    planReceived?: number;
    factReceived?: number;
    planRepaid: number;
    factRepaid: number;
    planInterest: number;
    factInterest: number;
  },
): CreditResourceMonth {
  return {
    id: `credit-month:${month}`,
    month,
    lines: [
      {
        id: `credit-line:${month}:creditor:t-bank`,
        creditorId: 'creditor:t-bank',
        planReceived: line.planReceived ?? 0,
        factReceived: line.factReceived ?? 0,
        planRepaid: line.planRepaid,
        factRepaid: line.factRepaid,
        planInterest: line.planInterest,
        factInterest: line.factInterest,
      },
    ],
  };
}

/**
 * Сентябрь–ноябрь 2026: погашение тела и проценты в масштабе мока.
 * Ноябрь — частичный факт (как у продаж).
 */
export const mockCreditResourceMonths: CreditResourceMonth[] = [
  creditMonth('2026-09', {
    planRepaid: 200_000_00,
    factRepaid: 200_000_00,
    planInterest: 75_000_00,
    factInterest: 74_500_00,
  }),
  creditMonth('2026-10', {
    planRepaid: 200_000_00,
    factRepaid: 180_000_00,
    planInterest: 72_000_00,
    factInterest: 71_200_00,
  }),
  creditMonth('2026-11', {
    planRepaid: 200_000_00,
    factRepaid: 50_000_00,
    planInterest: 69_000_00,
    factInterest: 17_000_00,
  }),
];
