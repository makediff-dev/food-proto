'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { isOccurredOn } from '@/domain/document';
import { operatingExpenseOtherDayView } from '@/domain/operating-expense';
import { maxProductionEntryOccurredOn } from '@/domain/production-journal';
import { defaultSalesFactDay, monthDates } from '@/domain/sales-fact';
import { monthKeyFromDate, planMonthOpen, salesPlanForMonth, salesPlanTotals } from '@/domain/sales-plan';
import { resolveOpexMonth } from '@/features/opex/OpexMonthBar';
import { OtherGroupBlock } from '@/features/opex/OpexOtherGroupBlock';
import { OPEX_OTHER_FACT_TITLE, opexOtherFactHref } from '@/features/opex/paths';
import { OPEX_LINE_ERROR } from '@/features/opex/text';
import { useOpex } from '@/features/opex/use-opex';
import { useRole } from '@/features/roles/RoleProvider';
import { monthFieldClassName } from '@/features/sales/fields';
import { MonthStep } from '@/features/shell/MonthStep';
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

const DAY_MIN = '2000-01-01';

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

export function OtherFactScreen({ month, day }: { month: string; day: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveOpexMonth(month, today, currentMonth);
  const fallbackDay = defaultSalesFactDay(selectedMonth, today);
  const selectedDay = resolveDay(selectedMonth, day, fallbackDay);
  const maxDay = maxProductionEntryOccurredOn(today);
  const previousDay = shiftCalendarDay(selectedDay, -1);
  const nextDay = shiftCalendarDay(selectedDay, 1);
  const opex = useOpex();
  const { canEditSalesOpex } = useRole();
  const router = useRouter();
  const editable = opex.hydrated && canEditSalesOpex;

  const plan = salesPlanForMonth(opex.document, selectedMonth);
  const totals = plan ? salesPlanTotals(opex.document, plan) : null;
  const view = useMemo(
    () => operatingExpenseOtherDayView(opex.document, selectedDay, totals?.revenueWithVat ?? 0),
    [opex.document, selectedDay, totals?.revenueWithVat],
  );

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
      opexOtherFactHref({
        month: targetMonth,
        day: nextDayValue,
        currentMonth,
        todayDay: defaultSalesFactDay(currentMonth, today),
      }),
      { scroll: false },
    );
  }

  if (!view) {
    return null;
  }

  return (
    <PageFrame
      title={OPEX_OTHER_FACT_TITLE}
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
          <caption className="sr-only">{`Прочие операционные расходы, факт на ${selectedDay}`}</caption>
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
                  const rejection = opex.setOpexDayLine(selectedDay, lineId, amount);
                  return rejection ? OPEX_LINE_ERROR[rejection] : null;
                }}
              />
            ))}
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
