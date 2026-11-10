'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { isOpexGroupCode } from '@/domain/document';
import { operatingExpenseOtherGroupMonthView, opexGroupName } from '@/domain/operating-expense';
import { monthKeyFromDate, salesPlanForMonth, salesPlanTotals } from '@/domain/sales-plan';
import { OpexMonthBar, resolveOpexMonth } from '@/features/opex/OpexMonthBar';
import { OPEX_OTHER_PLAN_HREF, opexGroupHref } from '@/features/opex/paths';
import { useOpex } from '@/features/opex/use-opex';
import { PageFrame } from '@/features/shell/PageFrame';
import {
  ColumnLabel,
  cellKindClassName,
  columnDividerClassName,
  columnHeadingClassName,
  entityNameRowClassName,
  MoneyAmount,
  nameHeadingClassName,
  tableClassName,
  tableFrameClassName,
  totalNameClassName,
  totalValueClassName,
} from '@/features/table';

const valueHead = `${columnHeadingClassName} ${columnDividerClassName}`;
const valueCell = `border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`;

export function OpexGroupSummaryScreen({ code, month }: { code: string; month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveOpexMonth(month, today, currentMonth);
  const opex = useOpex();
  const router = useRouter();
  const groupCode = isOpexGroupCode(code) ? code : null;
  const promoted = groupCode !== null && opex.document.opexPromotedGroupCodes.includes(groupCode);

  useEffect(() => {
    if (!opex.hydrated) {
      return;
    }
    if (!groupCode || !promoted) {
      router.replace(OPEX_OTHER_PLAN_HREF);
    }
  }, [opex.hydrated, groupCode, promoted, router]);

  const plan = salesPlanForMonth(opex.document, selectedMonth);
  const totals = plan ? salesPlanTotals(opex.document, plan) : null;
  const view = useMemo(() => {
    if (!groupCode || !promoted) {
      return null;
    }
    return operatingExpenseOtherGroupMonthView(opex.document, selectedMonth, groupCode, totals?.revenueWithVat ?? 0);
  }, [groupCode, promoted, opex.document, selectedMonth, totals?.revenueWithVat]);

  if (!groupCode || !promoted || !view) {
    return null;
  }

  const title = opexGroupName(groupCode);

  return (
    <PageFrame
      title={title}
      full
      lede="План и факт статей без НДС. План — за месяц, факт — сумма дней. Ввод — на страницах плана и факта этой категории."
      intro={
        <OpexMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) =>
            router.push(opexGroupHref({ code: groupCode, month: next, currentMonth }), { scroll: false })
          }
        />
      }
    >
      <div className={tableFrameClassName}>
        <table className={tableClassName}>
          <caption className="sr-only">{`${title}, отчёт за ${selectedMonth}`}</caption>
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
            </tr>
          </thead>
          <tbody>
            {view.lines.map((row) => (
              <tr key={row.id}>
                <th scope="row" className={entityNameRowClassName('repeated')}>
                  <span className="inline-flex items-center gap-1">
                    {row.code ? <span className="text-muted">{row.code}</span> : null}
                    <span>
                      {row.name}
                      {row.deleted ? <span className="text-muted"> (архив)</span> : null}
                    </span>
                  </span>
                </th>
                <td className={`${valueCell} ${cellKindClassName.computed}`}>
                  <MoneyAmount amount={row.planExVat} />
                </td>
                <td className={`${valueCell} ${cellKindClassName.computed}`}>
                  <MoneyAmount amount={row.factExVat} />
                </td>
                <td className={`${valueCell} ${cellKindClassName.computed}`}>
                  <MoneyAmount amount={row.varianceExVat} signed sense="cost" />
                </td>
              </tr>
            ))}
            <tr>
              <th scope="row" className={`sticky left-0 z-10 ${totalNameClassName}`}>
                Всего
              </th>
              <td className={`${totalValueClassName} ${columnDividerClassName}`}>
                <MoneyAmount amount={view.totalPlanExVat} />
              </td>
              <td className={`${totalValueClassName} ${columnDividerClassName}`}>
                <MoneyAmount amount={view.totalFactExVat} />
              </td>
              <td className={`${totalValueClassName} ${columnDividerClassName}`}>
                <MoneyAmount amount={view.totalVarianceExVat} signed sense="cost" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </PageFrame>
  );
}
