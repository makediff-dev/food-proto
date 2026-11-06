'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { cashflowMonthView } from '@/domain/cashflow';
import { creditResourcesMonthView, initialCashBalance } from '@/domain/credit-resources';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { CashflowMonthBar, resolveCashflowMonth } from '@/features/cashflow/CashflowMonthBar';
import { CASHFLOW_FACT_TITLE, cashflowFactHref } from '@/features/cashflow/paths';
import { useCashflow } from '@/features/cashflow/use-cashflow';
import { CREDIT_ERROR } from '@/features/credit-resources/text';
import { useRole } from '@/features/roles/RoleProvider';
import { PageFrame } from '@/features/shell/PageFrame';
import {
  ColumnLabel,
  cellKindClassName,
  columnDividerClassName,
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

const valueHead = `${columnHeadingClassName} ${columnDividerClassName}`;
const valueCell = `w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`;
const groupEnd = `${columnHeadingClassName} ${tableBorder.rightThick}`;
const valueEnd = `w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${tableBorder.rightThick}`;

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

  const creditView = useMemo(
    () => creditResourcesMonthView(cashflow.document, selectedMonth),
    [cashflow.document, selectedMonth],
  );
  const ddsView = useMemo(
    () => cashflowMonthView(cashflow.document, selectedMonth),
    [cashflow.document, selectedMonth],
  );
  const openingBalance = initialCashBalance(cashflow.document);

  return (
    <PageFrame
      title={CASHFLOW_FACT_TITLE}
      full
      lede="Начальный остаток денежных средств и фактические операции по кредитам и займам. Суммы синхронизируются с разделом «Движение кредитных ресурсов»."
      intro={
        <CashflowMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(cashflowFactHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      <div className={`${tableFrameClassName} mb-6`}>
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

      <div className={tableFrameClassName}>
        <table className={tableClassName}>
          <caption className="sr-only">{`Факт кредитов и займов за ${selectedMonth}`}</caption>
          <thead className={stickyHeadClassName}>
            <tr>
              <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                <ColumnLabel label="Кредитор" />
              </th>
              <th scope="col" className={valueHead}>
                <ColumnLabel label="Получение, факт" />
              </th>
              <th scope="col" className={valueHead}>
                <ColumnLabel label="Погашение, факт" />
              </th>
              <th scope="col" className={groupEnd}>
                <ColumnLabel label="Проценты, факт" />
              </th>
            </tr>
          </thead>
          <tbody>
            {creditView.rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="border-b border-b-line px-3 py-6 text-sm text-muted">
                  Кредиторов пока нет. Добавьте их во «Вводе плана» кредитных ресурсов.
                </td>
              </tr>
            ) : null}
            {creditView.rows.map((row) => {
              const rowEditable = editable && !row.deleted;
              return (
                <tr key={row.creditorId}>
                  <th scope="row" className={entityNameRowClassName('repeated')}>
                    {row.name}
                    {row.deleted ? ' (архив)' : ''}
                  </th>
                  <td className={`${valueCell} ${cellKindClassName[inputKind(rowEditable)]}`}>
                    <MoneyCell
                      label={`Получение, факт, ${row.name}`}
                      value={row.factReceived}
                      onChange={
                        rowEditable
                          ? (amount) => {
                              const rejection = cashflow.setMonthField(
                                selectedMonth,
                                row.creditorId,
                                'factReceived',
                                amount,
                              );
                              return rejection ? CREDIT_ERROR[rejection] : null;
                            }
                          : undefined
                      }
                    />
                  </td>
                  <td className={`${valueCell} ${cellKindClassName[inputKind(rowEditable)]}`}>
                    <MoneyCell
                      label={`Погашение, факт, ${row.name}`}
                      value={row.factRepaid}
                      onChange={
                        rowEditable
                          ? (amount) => {
                              const rejection = cashflow.setMonthField(
                                selectedMonth,
                                row.creditorId,
                                'factRepaid',
                                amount,
                              );
                              return rejection ? CREDIT_ERROR[rejection] : null;
                            }
                          : undefined
                      }
                    />
                  </td>
                  <td className={`${valueEnd} ${cellKindClassName[inputKind(rowEditable)]}`}>
                    <MoneyCell
                      label={`Проценты, факт, ${row.name}`}
                      value={row.factInterest}
                      onChange={
                        rowEditable
                          ? (amount) => {
                              const rejection = cashflow.setMonthField(
                                selectedMonth,
                                row.creditorId,
                                'factInterest',
                                amount,
                              );
                              return rejection ? CREDIT_ERROR[rejection] : null;
                            }
                          : undefined
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </PageFrame>
  );
}
