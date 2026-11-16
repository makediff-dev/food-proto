'use client';

import { useRouter } from 'next/navigation';
import { Fragment, useMemo, useState } from 'react';

import { HR_DEPARTMENT_IDS, type HrDepartmentId, isOccurredOn } from '@/domain/document';
import {
  HR_DEPARTMENT_LABELS,
  type HrOutsourcingRowView,
  hrDayOutsourcingValue,
  hrDayStaffValue,
  hrMonthView,
  outsourcingAmountExVat,
} from '@/domain/hr';
import { maxProductionEntryOccurredOn } from '@/domain/production-journal';
import { defaultSalesFactDay, monthDates } from '@/domain/sales-fact';
import { monthKeyFromDate, planMonthOpen } from '@/domain/sales-plan';
import { QuantityCell, QuantityRead } from '@/features/materials/QuantityCell';
import { resolveOpexMonth } from '@/features/opex/OpexMonthBar';
import { OPEX_HR_FACT_TITLE, opexHrFactHref } from '@/features/opex/paths';
import { HR_ERROR, parseOpexMoney } from '@/features/opex/text';
import { useOpex } from '@/features/opex/use-opex';
import { useRole } from '@/features/roles/RoleProvider';
import { monthFieldClassName } from '@/features/sales/fields';
import { IconChevronDown, IconChevronRight } from '@/features/shell/Icons';
import { MonthStep } from '@/features/shell/MonthStep';
import { PageFrame } from '@/features/shell/PageFrame';
import {
  ColumnLabel,
  categoryBandClassName,
  categoryNameClassName,
  categoryNameRowClassName,
  cellKindClassName,
  columnDividerClassName,
  columnHeadingClassName,
  entityNameRowClassName,
  MoneyAmount,
  MoneyCell,
  nameHeadingClassName,
  tableClassName,
  tableFrameClassName,
} from '@/features/table';

const DAY_MIN = '2000-01-01';

const valueHead = `${columnHeadingClassName} ${columnDividerClassName}`;
const valueCell = `border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`;

type FactDepartment = {
  departmentId: HrDepartmentId;
  name: string;
  positions: { id: string; name: string }[];
};

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

export function HrFactScreen({ month, day }: { month: string; day: string }) {
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
  const view = useMemo(() => hrMonthView(opex.document, selectedMonth), [opex.document, selectedMonth]);
  const outsourcingRows = useMemo(
    () => view.departments.flatMap((department) => (department.outsourcing ? [department.outsourcing] : [])),
    [view.departments],
  );

  const staffDepartments = useMemo((): FactDepartment[] => {
    return HR_DEPARTMENT_IDS.map((departmentId) => {
      const positions = opex.document.hrPositions
        .filter((item) => item.departmentId === departmentId && item.kind === 'staff' && item.deletedAt === null)
        .map((item) => ({ id: item.id, name: item.name }));
      return {
        departmentId,
        name: HR_DEPARTMENT_LABELS[departmentId],
        positions,
      };
    }).filter((department) => department.positions.length > 0);
  }, [opex.document]);

  function openDay(nextDayValue: string) {
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
      opexHrFactHref({
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
      title={OPEX_HR_FACT_TITLE}
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
                  openDay(previousDay);
                }
              }}
            />
            <input
              type="date"
              aria-label="День"
              min={DAY_MIN}
              max={maxDay}
              value={selectedDay}
              onChange={(event) => openDay(event.target.value)}
              className={monthFieldClassName}
            />
            <MonthStep
              label="Следующий день"
              direction="next"
              disabled={nextDay === null || nextDay > maxDay || !planMonthOpen(nextDay.slice(0, 7), today)}
              onClick={() => {
                if (nextDay) {
                  openDay(nextDay);
                }
              }}
            />
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-2">
          <h2 className="px-1 text-sm font-medium">Выплаты</h2>
          <div className={tableFrameClassName}>
            <table className={tableClassName}>
              <caption className="sr-only">{`Выплаты HR на ${selectedDay}`}</caption>
              <thead>
                <tr>
                  <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                    <ColumnLabel label="Наименование" />
                  </th>
                  <th scope="col" className={valueHead}>
                    <ColumnLabel label="Сумма" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {staffDepartments.map((department) => (
                  <DepartmentBlock
                    key={department.departmentId}
                    department={department}
                    editable={editable}
                    amount={(positionId) => hrDayStaffValue(opex.document, selectedDay, positionId)}
                    onAmount={(positionId, amountExVat) => {
                      const rejection = opex.setHrDayStaff(selectedDay, positionId, amountExVat);
                      return rejection ? HR_ERROR[rejection] : null;
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="flex flex-col gap-2">
          <h2 className="px-1 text-sm font-medium">Аутсорсинг</h2>
          <div className={tableFrameClassName}>
            <table className={tableClassName}>
              <caption className="sr-only">{`Факт аутсорсинга на ${selectedDay}`}</caption>
              <thead>
                <tr>
                  <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                    <ColumnLabel label="Цех" />
                  </th>
                  <th scope="col" className={valueHead}>
                    <ColumnLabel label="Часы" />
                  </th>
                  <th scope="col" className={valueHead}>
                    <ColumnLabel label="Ставка" />
                  </th>
                  <th scope="col" className={valueHead}>
                    <ColumnLabel label="Сумма" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {outsourcingRows.map((row) => (
                  <OutsourcingFactRow
                    key={row.departmentId}
                    row={row}
                    editable={editable}
                    values={hrDayOutsourcingValue(opex.document, selectedDay, row.departmentId)}
                    onChange={(hourThousandths, rateExVat) => {
                      const rejection = opex.setHrDayOutsourcing(
                        selectedDay,
                        row.departmentId,
                        hourThousandths,
                        rateExVat,
                      );
                      return rejection ? HR_ERROR[rejection] : null;
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PageFrame>
  );
}

function DepartmentBlock({
  department,
  editable,
  amount,
  onAmount,
}: {
  department: FactDepartment;
  editable: boolean;
  amount: (positionId: string) => number;
  onAmount: (positionId: string, amountExVat: number) => string | null;
}) {
  const [open, setOpen] = useState(true);
  const count = department.positions.length;

  return (
    <Fragment>
      <tr>
        <th scope="row" className={categoryNameRowClassName(false)}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-expanded={open}
              aria-label={open ? `Свернуть ${department.name}` : `Развернуть ${department.name}`}
              title={open ? 'Свернуть' : 'Развернуть'}
              onClick={() => setOpen((current) => !current)}
              className="inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {open ? <IconChevronDown /> : <IconChevronRight />}
            </button>
            <span className={categoryNameClassName}>
              {department.name} ({count})
            </span>
          </div>
        </th>
        <td className={`${valueCell} ${categoryBandClassName}`} />
      </tr>
      {open
        ? department.positions.map((position) => {
            const value = amount(position.id);
            return (
              <tr key={position.id}>
                <th scope="row" className={entityNameRowClassName('repeated')}>
                  {position.name}
                </th>
                <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
                  {editable ? (
                    <MoneyCell
                      label={`Сумма, ${position.name}`}
                      value={value}
                      parse={parseOpexMoney}
                      invalidMessage={HR_ERROR.amount}
                      onChange={(next) => onAmount(position.id, next)}
                    />
                  ) : (
                    <MoneyAmount amount={value} />
                  )}
                </td>
              </tr>
            );
          })
        : null}
    </Fragment>
  );
}

function OutsourcingFactRow({
  row,
  editable,
  values,
  onChange,
}: {
  row: HrOutsourcingRowView;
  editable: boolean;
  values: { hourThousandths: number; rateExVat: number };
  onChange: (hourThousandths: number, rateExVat: number) => string | null;
}) {
  const amountExVat = outsourcingAmountExVat(values.hourThousandths, values.rateExVat);

  return (
    <tr>
      <th scope="row" className={entityNameRowClassName('repeated')}>
        {row.departmentName}
      </th>
      <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
        {editable ? (
          <QuantityCell
            label={`Часы аутсорсинга, ${row.departmentName}`}
            value={values.hourThousandths}
            unit="ч"
            blankIfZero
            onChange={(next) => onChange(next, values.rateExVat)}
          />
        ) : (
          <QuantityRead value={values.hourThousandths} unit="ч" />
        )}
      </td>
      <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
        {editable ? (
          <MoneyCell
            label={`Ставка, ${row.departmentName}`}
            value={values.rateExVat}
            parse={parseOpexMoney}
            invalidMessage={HR_ERROR.rate}
            onChange={(next) => onChange(values.hourThousandths, next)}
          />
        ) : (
          <>
            <MoneyAmount amount={values.rateExVat} />
            <span className="text-muted"> /ч</span>
          </>
        )}
      </td>
      <td className={`${valueCell} ${cellKindClassName.computed}`}>
        <MoneyAmount amount={amountExVat} />
      </td>
    </tr>
  );
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
