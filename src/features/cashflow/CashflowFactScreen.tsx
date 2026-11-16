'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { isOccurredOn, type TaxPaymentKind } from '@/domain/document';
import { maxProductionEntryOccurredOn } from '@/domain/production-journal';
import { defaultSalesFactDay, monthDates } from '@/domain/sales-fact';
import { monthKeyFromDate, planMonthOpen } from '@/domain/sales-plan';
import { TAX_PAYMENT_KINDS, TAX_PAYMENT_LABEL, taxPaymentForDay } from '@/domain/tax-payment';
import { resolveCashflowMonth } from '@/features/cashflow/CashflowMonthBar';
import { CASHFLOW_FACT_TITLE, cashflowFactHref } from '@/features/cashflow/paths';
import { parseTaxPaymentMoney, TAX_PAYMENT_ERROR } from '@/features/cashflow/text';
import { useTaxPayment } from '@/features/cashflow/use-tax-payment';
import { useRole } from '@/features/roles/RoleProvider';
import { monthFieldClassName } from '@/features/sales/fields';
import { MonthStep } from '@/features/shell/MonthStep';
import { PageFrame } from '@/features/shell/PageFrame';
import {
  ColumnLabel,
  cellKindClassName,
  columnHeadingClassName,
  entityNameRowClassName,
  MoneyCell,
  nameHeadingClassName,
  tableBorder,
  tableClassName,
  tableFrameClassName,
} from '@/features/table';

const DAY_MIN = '2000-01-01';

const valueEnd = `${columnHeadingClassName} ${tableBorder.rightThick}`;
const valueCellEnd = `w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${tableBorder.rightThick}`;

function inputKind(editable: boolean): 'assigned' | 'computed' {
  return editable ? 'assigned' : 'computed';
}

function resolveDay(month: string, day: string, fallback: string): string {
  if (isOccurredOn(day) && day.startsWith(`${month}-`) && monthDates(month).includes(day)) {
    return day;
  }

  const dom = Number(day.slice(8, 10));
  if (Number.isInteger(dom) && dom > 0) {
    const last = monthDates(month).length;
    const clamped = Math.min(dom, last);
    const candidate = `${month}-${String(clamped).padStart(2, '0')}`;
    if (monthDates(month).includes(candidate)) {
      return candidate;
    }
  }

  return fallback;
}

/** Соседний календарный день, в том числе через границу месяца. */
function shiftCalendarDay(date: string, offset: -1 | 1): string | null {
  if (!isOccurredOn(date)) {
    return null;
  }

  const year = Number(date.slice(0, 4));
  const month = Number(date.slice(5, 7));
  const day = Number(date.slice(8, 10));
  const next = new Date(year, month - 1, day + offset);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`;
}

function PaymentRow({
  kind,
  day,
  amount,
  editable,
  onChange,
}: {
  kind: TaxPaymentKind;
  day: string;
  amount: number;
  editable: boolean;
  onChange: (kind: TaxPaymentKind, amount: number) => string | null;
}) {
  const label = TAX_PAYMENT_LABEL[kind];
  return (
    <tr>
      <th scope="row" className={entityNameRowClassName('repeated')}>
        {label}
      </th>
      <td className={`${valueCellEnd} ${cellKindClassName[inputKind(editable)]}`}>
        <MoneyCell
          label={`${label}, ${day}`}
          value={amount}
          signed
          sense="cost"
          parse={parseTaxPaymentMoney}
          onChange={editable ? (next) => onChange(kind, next) : undefined}
        />
      </td>
    </tr>
  );
}

export function CashflowFactScreen({ month, day }: { month: string; day: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveCashflowMonth(month, today, currentMonth);
  const fallbackDay = defaultSalesFactDay(selectedMonth, today);
  const selectedDay = resolveDay(selectedMonth, day, fallbackDay);
  const maxDay = maxProductionEntryOccurredOn(today);
  const previousDay = shiftCalendarDay(selectedDay, -1);
  const nextDay = shiftCalendarDay(selectedDay, 1);
  const taxPayment = useTaxPayment();
  const { canEditCreditAndCashflow } = useRole();
  const router = useRouter();
  const editable = taxPayment.hydrated && canEditCreditAndCashflow;
  const amounts = useMemo(() => {
    const next = {} as Record<TaxPaymentKind, number>;
    for (const kind of TAX_PAYMENT_KINDS) {
      next[kind] = taxPaymentForDay(taxPayment.document, kind, selectedDay);
    }
    return next;
  }, [taxPayment.document, selectedDay]);

  function open(nextDayValue: string) {
    if (!isOccurredOn(nextDayValue)) {
      return;
    }
    if (nextDayValue < DAY_MIN || nextDayValue > maxDay) {
      return;
    }
    const targetMonth = nextDayValue.slice(0, 7);
    if (!planMonthOpen(targetMonth, today)) {
      return;
    }
    router.push(
      cashflowFactHref({
        month: targetMonth,
        day: nextDayValue,
        currentMonth,
        todayDay: defaultSalesFactDay(currentMonth, today),
      }),
      { scroll: false },
    );
  }

  return (
    <PageFrame
      title={CASHFLOW_FACT_TITLE}
      full
      intro={
        <div className="w-full border border-line bg-sheet p-4">
          <div className="flex items-center gap-2">
            <MonthStep
              label="Предыдущий день"
              direction="previous"
              disabled={previousDay === null || previousDay < DAY_MIN || !planMonthOpen(previousDay.slice(0, 7), today)}
              onClick={() => {
                if (previousDay) {
                  open(previousDay);
                }
              }}
            />
            <input
              type="date"
              aria-label="День"
              min={DAY_MIN}
              max={maxDay}
              value={selectedDay}
              onChange={(event) => open(event.target.value)}
              className={monthFieldClassName}
            />
            <MonthStep
              label="Следующий день"
              direction="next"
              disabled={nextDay === null || nextDay > maxDay || !planMonthOpen(nextDay.slice(0, 7), today)}
              onClick={() => {
                if (nextDay) {
                  open(nextDay);
                }
              }}
            />
          </div>
        </div>
      }
    >
      <div className={tableFrameClassName}>
        <table className={tableClassName}>
          <caption className="sr-only">{`Оплаты налогов за ${selectedDay}`}</caption>
          <thead>
            <tr>
              <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                <ColumnLabel label="Статья" />
              </th>
              <th scope="col" className={valueEnd}>
                <ColumnLabel label="Сумма" />
              </th>
            </tr>
          </thead>
          <tbody>
            {TAX_PAYMENT_KINDS.map((kind) => (
              <PaymentRow
                key={kind}
                kind={kind}
                day={selectedDay}
                amount={amounts[kind]}
                editable={editable}
                onChange={(paymentKind, next) => {
                  const rejection = taxPayment.setDay(paymentKind, selectedDay, next);
                  return rejection ? TAX_PAYMENT_ERROR[rejection] : null;
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
    </PageFrame>
  );
}
