'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { creditDayAmounts, creditResourcesMonthView } from '@/domain/credit-resources';
import { isOccurredOn } from '@/domain/document';
import { maxProductionEntryOccurredOn } from '@/domain/production-journal';
import { defaultSalesFactDay, monthDates } from '@/domain/sales-fact';
import { monthKeyFromDate, planMonthOpen } from '@/domain/sales-plan';
import { resolveCreditMonth } from '@/features/credit-resources/CreditMonthBar';
import { CREDIT_RESOURCES_FACT_TITLE, creditResourcesFactHref } from '@/features/credit-resources/paths';
import { CREDIT_ERROR, parseCreditMoney } from '@/features/credit-resources/text';
import { useCreditResources } from '@/features/credit-resources/use-credit-resources';
import { useRole } from '@/features/roles/RoleProvider';
import { monthFieldClassName } from '@/features/sales/fields';
import { MonthStep } from '@/features/shell/MonthStep';
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

const DAY_MIN = '2000-01-01';

const valueHead = `${columnHeadingClassName} ${columnDividerClassName}`;
const valueCell = `w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`;
const groupEnd = `${columnHeadingClassName} ${tableBorder.rightThick}`;
const valueEnd = `w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${tableBorder.rightThick}`;

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

export function CreditResourcesFactScreen({ month, day }: { month: string; day: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveCreditMonth(month, today, currentMonth);
  const fallbackDay = defaultSalesFactDay(selectedMonth, today);
  const selectedDay = resolveDay(selectedMonth, day, fallbackDay);
  const maxDay = maxProductionEntryOccurredOn(today);
  const previousDay = shiftCalendarDay(selectedDay, -1);
  const nextDay = shiftCalendarDay(selectedDay, 1);
  const credit = useCreditResources();
  const { canEditCreditAndCashflow } = useRole();
  const router = useRouter();
  const editable = credit.hydrated && canEditCreditAndCashflow;

  const view = useMemo(
    () => creditResourcesMonthView(credit.document, selectedMonth, { includeIdleActive: true }),
    [credit.document, selectedMonth],
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
      creditResourcesFactHref({
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
      title={CREDIT_RESOURCES_FACT_TITLE}
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
          <caption className="sr-only">{`Факт кредитных ресурсов на ${selectedDay}`}</caption>
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
              const dayValues = creditDayAmounts(credit.document, selectedDay, row.creditorId);
              return (
                <tr key={row.creditorId}>
                  <th scope="row" className={entityNameRowClassName('repeated')}>
                    {row.name}
                    {row.deleted ? ' (архив)' : ''}
                  </th>
                  <td className={`${valueCell} ${cellKindClassName[inputKind(rowEditable)]}`}>
                    <MoneyCell
                      label={`Получение, факт, ${row.name}`}
                      value={dayValues.received}
                      parse={parseCreditMoney}
                      onChange={
                        rowEditable
                          ? (amount) => {
                              const rejection = credit.setDayField(selectedDay, row.creditorId, 'received', amount);
                              return rejection ? CREDIT_ERROR[rejection] : null;
                            }
                          : undefined
                      }
                    />
                  </td>
                  <td className={`${valueCell} ${cellKindClassName[inputKind(rowEditable)]}`}>
                    <MoneyCell
                      label={`Погашение, факт, ${row.name}`}
                      value={dayValues.repaid}
                      parse={parseCreditMoney}
                      onChange={
                        rowEditable
                          ? (amount) => {
                              const rejection = credit.setDayField(selectedDay, row.creditorId, 'repaid', amount);
                              return rejection ? CREDIT_ERROR[rejection] : null;
                            }
                          : undefined
                      }
                    />
                  </td>
                  <td className={`${valueEnd} ${cellKindClassName[inputKind(rowEditable)]}`}>
                    <MoneyCell
                      label={`Проценты, факт, ${row.name}`}
                      value={dayValues.interest}
                      parse={parseCreditMoney}
                      onChange={
                        rowEditable
                          ? (amount) => {
                              const rejection = credit.setDayField(selectedDay, row.creditorId, 'interest', amount);
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
