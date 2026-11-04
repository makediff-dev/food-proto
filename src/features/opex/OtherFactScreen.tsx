'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { operatingExpenseOtherMonthView } from '@/domain/operating-expense';
import { monthKeyFromDate, salesPlanForMonth, salesPlanTotals } from '@/domain/sales-plan';
import { OpexMonthBar, resolveOpexMonth } from '@/features/opex/OpexMonthBar';
import { OtherGroupBlock } from '@/features/opex/OpexOtherGroupBlock';
import { OPEX_OTHER_FACT_TITLE, opexOtherFactHref } from '@/features/opex/paths';
import { OPEX_LINE_ERROR } from '@/features/opex/text';
import { useOpex } from '@/features/opex/use-opex';
import { useRole } from '@/features/roles/RoleProvider';
import { PageFrame } from '@/features/shell/PageFrame';
import {
  ColumnLabel,
  categoryNameClassName,
  categoryNameRowClassName,
  cellKindClassName,
  columnDividerClassName,
  columnHeadingClassName,
  MoneyAmount,
  nameHeadingClassName,
  tableClassName,
  tableFrameClassName,
} from '@/features/table';

const valueHead = `${columnHeadingClassName} ${columnDividerClassName}`;
const valueCell = `border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`;

export function OtherFactScreen({ month }: { month: string }) {
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
    () => operatingExpenseOtherMonthView(opex.document, selectedMonth, totals?.revenueWithVat ?? 0),
    [opex.document, selectedMonth, totals?.revenueWithVat],
  );

  return (
    <PageFrame
      title={OPEX_OTHER_FACT_TITLE}
      full
      lede="Факт прочих статей без НДС за месяц. Статьи и названия заводят во «Вводе плана» прочих расходов."
      intro={
        <OpexMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(opexOtherFactHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      <div className={tableFrameClassName}>
        <table className={tableClassName}>
          <caption className="sr-only">{`Прочие операционные расходы, факт за ${selectedMonth}`}</caption>
          <thead>
            <tr>
              <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                <ColumnLabel label="Наименование" />
              </th>
              <th scope="col" className={valueHead}>
                <ColumnLabel label="Факт" />
              </th>
            </tr>
          </thead>
          <tbody>
            {view.groups.map((group) => (
              <OtherGroupBlock
                key={group.code}
                group={group}
                side="fact"
                editable={editable}
                onAmount={(lineId, amount) => {
                  const rejection = opex.setOpexLine(selectedMonth, lineId, 'fact', amount);
                  return rejection ? OPEX_LINE_ERROR[rejection] : null;
                }}
              />
            ))}
            <tr className="font-medium">
              <th scope="row" className={categoryNameRowClassName(false)}>
                <span className={categoryNameClassName}>ВСЕГО</span>
              </th>
              <td className={`${valueCell} ${cellKindClassName.computed}`}>
                <MoneyAmount amount={view.totalFactExVat} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </PageFrame>
  );
}
