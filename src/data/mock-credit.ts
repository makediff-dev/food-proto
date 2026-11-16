import type { Creditor, CreditResourceDay, CreditResourceMonth } from '@/domain/document';

/** Т-Банк из книги `CashFlow!D145`, ставка 18 %. Сумма договора — справочно; тело появляется с получения в сентябре. */
export const mockCreditors: Creditor[] = [
  {
    id: 'creditor:t-bank',
    name: 'Т-Банк',
    initialPrincipal: 5_000_000_00,
    interestRateHundredths: 1800,
    deletedAt: null,
  },
];

function creditMonth(
  month: string,
  line: {
    planReceived?: number;
    planRepaid: number;
    planInterest: number;
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
        planRepaid: line.planRepaid,
        planInterest: line.planInterest,
      },
    ],
  };
}

function creditDay(
  occurredOn: string,
  line: {
    received?: number;
    repaid: number;
    interest: number;
  },
): CreditResourceDay {
  return {
    id: `credit-day:${occurredOn}`,
    occurredOn,
    lines: [
      {
        id: `credit-day-line:${occurredOn}:creditor:t-bank`,
        creditorId: 'creditor:t-bank',
        received: line.received ?? 0,
        repaid: line.repaid,
        interest: line.interest,
      },
    ],
  };
}

/**
 * Сентябрь–ноябрь 2026: в сентябре берут тело 5 млн, дальше погашение и проценты.
 * Факт — на 1-е число месяца. Ноябрь — частичный факт (как у продаж).
 */
export const mockCreditResourceMonths: CreditResourceMonth[] = [
  creditMonth('2026-09', {
    planReceived: 5_000_000_00,
    planRepaid: 200_000_00,
    planInterest: 75_000_00,
  }),
  creditMonth('2026-10', {
    planRepaid: 200_000_00,
    planInterest: 72_000_00,
  }),
  creditMonth('2026-11', {
    planRepaid: 200_000_00,
    planInterest: 69_000_00,
  }),
];

export const mockCreditResourceDays: CreditResourceDay[] = [
  creditDay('2026-09-01', {
    received: 5_000_000_00,
    repaid: 200_000_00,
    interest: 74_500_00,
  }),
  creditDay('2026-10-01', {
    repaid: 180_000_00,
    interest: 71_200_00,
  }),
  creditDay('2026-11-01', {
    repaid: 50_000_00,
    interest: 17_000_00,
  }),
];
