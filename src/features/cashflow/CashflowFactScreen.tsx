'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { cashflowMonthView } from '@/domain/cashflow';
import { initialCashBalance } from '@/domain/credit-resources';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { CashflowMonthBar, resolveCashflowMonth } from '@/features/cashflow/CashflowMonthBar';
import { CASHFLOW_FACT_TITLE, cashflowFactHref } from '@/features/cashflow/paths';
import { useCashflow } from '@/features/cashflow/use-cashflow';
import { CREDIT_ERROR, parseCreditMoney } from '@/features/credit-resources/text';
import { useRole } from '@/features/roles/RoleProvider';
import { PageFrame } from '@/features/shell/PageFrame';
import {
  ColumnLabel,
  cellKindClassName,
  columnHeadingClassName,
  entityNameRowClassName,
  MoneyCell,
  nameHeadingClassName,
  stickyHeadClassName,
  tableBorder,
  tableClassName,
  tableFrameClassName,
  totalNameClassName,
  totalValueClassName,
} from '@/features/table';

const valueEnd = `w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${tableBorder.rightThick}`;
const groupEnd = `${columnHeadingClassName} ${tableBorder.rightThick}`;

function inputKind(editable: boolean): 'assigned' | 'computed' {
  return editable ? 'assigned' : 'computed';
}

export function CashflowFactScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveCashflowMonth(month, today, currentMonth);
  const cashflow = useCashflow();
  const { canEditCreditAndCashflow } = useRole();
  const router = useRouter();
  const editable = cashflow.hydrated && canEditCreditAndCashflow;

  const ddsView = useMemo(
    () => cashflowMonthView(cashflow.document, selectedMonth),
    [cashflow.document, selectedMonth],
  );
  const openingBalance = initialCashBalance(cashflow.document);

  return (
    <PageFrame
      title={CASHFLOW_FACT_TITLE}
      full
      lede="Начальный остаток денежных средств на старте учёта. Получение, погашение и проценты по кредитам вводят в «Кредиты · Ввод факта» — в отчёт ДДС они подтягиваются сами."
      intro={
        <CashflowMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(cashflowFactHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      <div className={tableFrameClassName}>
        <table className={tableClassName}>
          <caption className="sr-only">Начальный остаток денежных средств</caption>
          <thead className={stickyHeadClassName}>
            <tr>
              <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                <ColumnLabel label="Показатель" />
              </th>
              <th scope="col" className={groupEnd}>
                <ColumnLabel label="Сумма" hint="С НДС" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className={entityNameRowClassName(editable ? 'assigned' : 'repeated')}>
                Начальный остаток денежных средств
              </th>
              <td className={`${valueEnd} ${cellKindClassName[inputKind(editable)]}`}>
                <MoneyCell
                  label="Начальный остаток денежных средств"
                  value={openingBalance}
                  parse={parseCreditMoney}
                  onChange={
                    editable
                      ? (amount) => {
                          const rejection = cashflow.setInitialCashBalance(amount);
                          return rejection ? CREDIT_ERROR[rejection] : null;
                        }
                      : undefined
                  }
                />
              </td>
            </tr>
            <tr>
              <th scope="row" className={totalNameClassName}>
                Остаток на начало месяца (расчёт)
              </th>
              <td className={`${totalValueClassName} ${tableBorder.rightThick} ${cellKindClassName.computed}`}>
                <MoneyCell label="Остаток на начало, факт" value={ddsView.opening.fact} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </PageFrame>
  );
}
