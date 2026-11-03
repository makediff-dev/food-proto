'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { operatingExpenseMonthView } from '@/domain/operating-expense';
import { monthKeyFromDate, salesPlanForMonth, salesPlanTotals } from '@/domain/sales-plan';
import { OpexMonthBar, resolveOpexMonth } from '@/features/opex/OpexMonthBar';
import { OPEX_SUMMARY_TITLE, opexSummaryHref } from '@/features/opex/paths';
import { OPEX_LINE_ERROR, parseOpexMoney } from '@/features/opex/text';
import { useOpex } from '@/features/opex/use-opex';
import { useRole } from '@/features/roles/RoleProvider';
import { PageFrame } from '@/features/shell/PageFrame';
import {
  ColumnLabel,
  cellKindClassName,
  columnDividerClassName,
  columnHeadingClassName,
  MoneyAmount,
  MoneyCell,
  nameHeadingClassName,
  PercentCell,
  tableClassName,
  tableFrameClassName,
} from '@/features/table';

const valueHead = `${columnHeadingClassName} ${columnDividerClassName}`;
const valueCell = `border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`;
const nameCell =
  'sticky left-0 z-10 border-b border-b-line border-r-[1.5px] border-r-muted bg-sheet px-3 py-2 text-left align-middle text-sm';

export function OpexSummaryScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveOpexMonth(month, today, currentMonth);
  const opex = useOpex();
  const { canEditSalesOpex } = useRole();
  const router = useRouter();
  const editable = opex.hydrated && canEditSalesOpex;

  const plan = salesPlanForMonth(opex.document, selectedMonth);
  const totals = plan ? salesPlanTotals(opex.document, plan) : null;
  const view = useMemo(
    () =>
      operatingExpenseMonthView(opex.document, selectedMonth, totals?.revenueWithVat ?? 0, totals?.revenueExVat ?? 0),
    [opex.document, selectedMonth, totals?.revenueExVat, totals?.revenueWithVat],
  );

  return (
    <PageFrame
      title={OPEX_SUMMARY_TITLE}
      full
      lede="План, факт и отклонение статей без НДС. HR и транспорт подтягиваются из своих экранов; прочие строки правят здесь."
      intro={
        <OpexMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(opexSummaryHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      <div className={tableFrameClassName}>
        <table className={tableClassName}>
          <caption className="sr-only">{`Операционные расходы за ${selectedMonth}, без НДС`}</caption>
          <thead>
            <tr>
              <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                <ColumnLabel label="Наименование" />
              </th>
              <th scope="col" className={valueHead}>
                <ColumnLabel label="План" />
              </th>
              <th scope="col" className={valueHead}>
                <ColumnLabel label="Факт" />
              </th>
              <th scope="col" className={valueHead}>
                <ColumnLabel label="Откл." />
              </th>
              <th scope="col" className={valueHead}>
                <ColumnLabel label="Доля план, %" />
              </th>
              <th scope="col" className={valueHead}>
                <ColumnLabel label="Доля факт, %" />
              </th>
            </tr>
          </thead>
          <tbody>
            {view.rows.map((row) => {
              const isGroup = row.kind === 'group';
              return (
                <tr key={row.id} className={isGroup ? 'font-medium' : undefined}>
                  <th scope="row" className={nameCell}>
                    <span className="text-muted">{row.code}</span> {row.name}
                  </th>
                  <td
                    className={`${valueCell} ${cellKindClassName[row.planEditable && editable ? 'assigned' : 'computed']}`}
                  >
                    {row.planEditable && editable ? (
                      <MoneyCell
                        label={`План, ${row.name}`}
                        value={row.planExVat}
                        parse={parseOpexMoney}
                        invalidMessage={OPEX_LINE_ERROR.amount}
                        onChange={(next) => {
                          const rejection = opex.setOpexLine(selectedMonth, row.id as never, 'plan', next);
                          return rejection ? OPEX_LINE_ERROR[rejection] : null;
                        }}
                      />
                    ) : (
                      <MoneyAmount amount={row.planExVat} />
                    )}
                  </td>
                  <td
                    className={`${valueCell} ${cellKindClassName[row.factEditable && editable ? 'assigned' : 'computed']}`}
                  >
                    {row.factEditable && editable ? (
                      <MoneyCell
                        label={`Факт, ${row.name}`}
                        value={row.factExVat}
                        parse={parseOpexMoney}
                        invalidMessage={OPEX_LINE_ERROR.amount}
                        onChange={(next) => {
                          const rejection = opex.setOpexLine(selectedMonth, row.id as never, 'fact', next);
                          return rejection ? OPEX_LINE_ERROR[rejection] : null;
                        }}
                      />
                    ) : (
                      <MoneyAmount amount={row.factExVat} />
                    )}
                  </td>
                  <td className={`${valueCell} ${cellKindClassName.computed}`}>
                    <MoneyAmount amount={row.varianceExVat} signed sense="cost" />
                  </td>
                  <td className={`${valueCell} ${cellKindClassName.computed}`}>
                    <PercentCell value={row.planShareHundredths} scale="hundredths" />
                  </td>
                  <td className={`${valueCell} ${cellKindClassName.computed}`}>
                    <PercentCell value={row.factShareHundredths} scale="hundredths" />
                  </td>
                </tr>
              );
            })}
            <tr className="font-medium">
              <th scope="row" className={nameCell}>
                ВСЕГО
              </th>
              <td className={`${valueCell} ${cellKindClassName.computed}`}>
                <MoneyAmount amount={view.totalPlanExVat} />
              </td>
              <td className={`${valueCell} ${cellKindClassName.computed}`}>
                <MoneyAmount amount={view.totalFactExVat} />
              </td>
              <td className={`${valueCell} ${cellKindClassName.computed}`}>
                <MoneyAmount amount={view.totalVarianceExVat} signed sense="cost" />
              </td>
              <td className={`${valueCell} ${cellKindClassName.computed}`} />
              <td className={`${valueCell} ${cellKindClassName.computed}`} />
            </tr>
          </tbody>
        </table>
      </div>
    </PageFrame>
  );
}
