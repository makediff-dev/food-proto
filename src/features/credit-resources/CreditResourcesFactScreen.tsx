'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { creditResourcesMonthView } from '@/domain/credit-resources';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { CreditMonthBar, resolveCreditMonth } from '@/features/credit-resources/CreditMonthBar';
import { CREDIT_RESOURCES_FACT_TITLE, creditResourcesFactHref } from '@/features/credit-resources/paths';
import { CREDIT_ERROR } from '@/features/credit-resources/text';
import { useCreditResources } from '@/features/credit-resources/use-credit-resources';
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
} from '@/features/table';

const valueHead = `${columnHeadingClassName} ${columnDividerClassName}`;
const valueCell = `w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`;
const groupEnd = `${columnHeadingClassName} ${tableBorder.rightThick}`;
const valueEnd = `w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${tableBorder.rightThick}`;

function inputKind(editable: boolean): 'assigned' | 'computed' {
  return editable ? 'assigned' : 'computed';
}

export function CreditResourcesFactScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveCreditMonth(month, today, currentMonth);
  const credit = useCreditResources();
  const { canEditCreditAndCashflow } = useRole();
  const router = useRouter();
  const editable = credit.hydrated && canEditCreditAndCashflow;

  const view = useMemo(
    () => creditResourcesMonthView(credit.document, selectedMonth),
    [credit.document, selectedMonth],
  );

  return (
    <PageFrame
      title={CREDIT_RESOURCES_FACT_TITLE}
      full
      lede="Фактическое получение, погашение тела и процентные платежи по кредиторам. Суммы сами попадают в отчёт ДДС и в процентные платежи свода продаж."
      intro={
        <CreditMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(creditResourcesFactHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      <div className={tableFrameClassName}>
        <table className={tableClassName}>
          <caption className="sr-only">{`Факт кредитных ресурсов за ${selectedMonth}`}</caption>
          <thead className={stickyHeadClassName}>
            <tr>
              <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                <ColumnLabel label="Наименование" />
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
            {view.rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="border-b border-b-line px-3 py-6 text-sm text-muted">
                  Кредиторов пока нет. Добавьте их во «Вводе плана».
                </td>
              </tr>
            ) : null}
            {view.rows.map((row) => {
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
                              const rejection = credit.setMonthField(
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
                              const rejection = credit.setMonthField(
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
                              const rejection = credit.setMonthField(
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
