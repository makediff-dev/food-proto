'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { isOccurredOn, isOpexGroupCode } from '@/domain/document';
import { operatingExpenseOtherGroupDayView, opexGroupName } from '@/domain/operating-expense';
import { maxProductionEntryOccurredOn } from '@/domain/production-journal';
import { defaultSalesFactDay, monthDates } from '@/domain/sales-fact';
import { monthKeyFromDate, planMonthOpen, salesPlanForMonth, salesPlanTotals } from '@/domain/sales-plan';
import { resolveOpexMonth } from '@/features/opex/OpexMonthBar';
import { OtherGroupBlock } from '@/features/opex/OpexOtherGroupBlock';
import { OPEX_OTHER_FACT_TITLE, OPEX_OTHER_PLAN_HREF, opexGroupFactHref } from '@/features/opex/paths';
import { OPEX_LINE_ERROR } from '@/features/opex/text';
import { useOpex } from '@/features/opex/use-opex';
import { useRole } from '@/features/roles/RoleProvider';
import { monthFieldClassName } from '@/features/sales/fields';
import { PageFrame } from '@/features/shell/PageFrame';
import {
  ColumnLabel,
  columnDividerClassName,
  columnHeadingClassName,
  MoneyAmount,
  nameHeadingClassName,
  tableClassName,
  tableFrameClassName,
  totalNameClassName,
  totalValueClassName,
} from '@/features/table';

const valueHead = `${columnHeadingClassName} ${columnDividerClassName}`;

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

export function OpexGroupFactScreen({ code, month, day }: { code: string; month: string; day: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveOpexMonth(month, today, currentMonth);
  const fallbackDay = defaultSalesFactDay(selectedMonth, today);
  const selectedDay = resolveDay(selectedMonth, day, fallbackDay);
  const maxDay = maxProductionEntryOccurredOn(today);
  const opex = useOpex();
  const { canEditSalesOpex } = useRole();
  const router = useRouter();
  const editable = opex.hydrated && canEditSalesOpex;
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
    return operatingExpenseOtherGroupDayView(opex.document, selectedDay, groupCode, totals?.revenueWithVat ?? 0);
  }, [groupCode, promoted, opex.document, selectedDay, totals?.revenueWithVat]);

  function open(nextDay: string) {
    if (!groupCode || !isOccurredOn(nextDay)) {
      return;
    }
    const targetMonth = nextDay.slice(0, 7);
    if (!planMonthOpen(targetMonth, today)) {
      return;
    }
    router.push(
      opexGroupFactHref({
        code: groupCode,
        month: targetMonth,
        day: nextDay,
        currentMonth,
        todayDay: defaultSalesFactDay(currentMonth, today),
      }),
      { scroll: false },
    );
  }

  if (!groupCode || !promoted || !view) {
    return null;
  }

  const title = opexGroupName(groupCode);

  return (
    <PageFrame
      title={`${title} · ${OPEX_OTHER_FACT_TITLE}`}
      full
      lede="Дневной факт статей без НДС. Статьи и названия правят во вводе плана этой категории."
      intro={
        <div className="flex items-center border border-line bg-sheet p-4">
          <input
            type="date"
            aria-label="День"
            min="2000-01-01"
            max={maxDay}
            value={selectedDay}
            onChange={(event) => open(event.target.value)}
            className={monthFieldClassName}
          />
        </div>
      }
    >
      <div className={tableFrameClassName}>
        <table className={tableClassName}>
          <caption className="sr-only">{`${title}, факт за ${selectedDay}`}</caption>
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
            <OtherGroupBlock
              group={view}
              side="fact"
              editable={editable}
              onAmount={(lineId, amount) => {
                const rejection = opex.setOpexDayLine(selectedDay, lineId, amount);
                return rejection ? OPEX_LINE_ERROR[rejection] : null;
              }}
            />
            <tr>
              <th scope="row" className={`sticky left-0 z-10 ${totalNameClassName}`}>
                Всего
              </th>
              <td className={`${totalValueClassName} ${columnDividerClassName}`}>
                <MoneyAmount amount={view.totalFactExVat} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </PageFrame>
  );
}
