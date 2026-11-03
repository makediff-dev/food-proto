'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { isOccurredOn } from '@/domain/document';
import { HR_DEPARTMENT_LABELS, HR_SHOP_DEPARTMENT_IDS, hrDayOutsourcingHours, hrDayStaffValue } from '@/domain/hr';
import { defaultSalesFactDay, monthDates } from '@/domain/sales-fact';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { QuantityCell } from '@/features/materials/QuantityCell';
import { OpexMonthBar, resolveOpexMonth } from '@/features/opex/OpexMonthBar';
import { OPEX_HR_FACT_TITLE, opexHrFactHref } from '@/features/opex/paths';
import { HR_ERROR, parseOpexMoney } from '@/features/opex/text';
import { useOpex } from '@/features/opex/use-opex';
import { useRole } from '@/features/roles/RoleProvider';
import { monthFieldClassName } from '@/features/sales/fields';
import { PageFrame } from '@/features/shell/PageFrame';
import {
  ColumnLabel,
  cellKindClassName,
  columnDividerClassName,
  columnHeadingClassName,
  MoneyAmount,
  MoneyCell,
  nameHeadingClassName,
  tableClassName,
  tableFrameClassName,
} from '@/features/table';

const valueHead = `${columnHeadingClassName} ${columnDividerClassName}`;
const valueCell = `border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`;
const nameCell =
  'sticky left-0 z-10 border-b border-b-line border-r-[1.5px] border-r-muted bg-sheet px-3 py-2 text-left align-middle text-sm';

export function HrFactScreen({ month, day }: { month: string; day: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveOpexMonth(month, today, currentMonth);
  const fallbackDay = defaultSalesFactDay(selectedMonth, today);
  const selectedDay = resolveDay(selectedMonth, day, fallbackDay);
  const opex = useOpex();
  const { canEditSalesOpex } = useRole();
  const router = useRouter();
  const editable = opex.hydrated && canEditSalesOpex;

  const shopDepartments = useMemo(() => {
    return HR_SHOP_DEPARTMENT_IDS.map((departmentId) => {
      const positions = opex.document.hrPositions.filter(
        (item) => item.departmentId === departmentId && item.kind === 'staff' && item.deletedAt === null,
      );
      return { departmentId, name: HR_DEPARTMENT_LABELS[departmentId], positions };
    });
  }, [opex.document]);

  function open(next: { month?: string; day?: string }) {
    const targetMonth = next.month ?? selectedMonth;
    const targetFallback = defaultSalesFactDay(targetMonth, today);
    const targetDay = resolveDay(targetMonth, next.day ?? selectedDay, targetFallback);
    router.push(
      opexHrFactHref({
        month: targetMonth,
        day: targetDay,
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
      lede="Дневной факт цехов и РЦ: часы и суммы штатных, часы аутсорсинга. Администрацию правят в отчёте HR."
      intro={
        <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
          <OpexMonthBar month={selectedMonth} today={today} onOpen={(next) => open({ month: next })} />
          <div className="flex items-center border border-line bg-sheet p-4">
            <input
              type="date"
              aria-label="День"
              min={`${selectedMonth}-01`}
              max={monthDates(selectedMonth).at(-1) ?? `${selectedMonth}-01`}
              value={selectedDay}
              onChange={(event) => {
                const next = event.target.value;
                if (next.startsWith(`${selectedMonth}-`)) {
                  open({ day: next });
                }
              }}
              className={monthFieldClassName}
            />
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {shopDepartments.map((department) => (
          <section key={department.departmentId} className="flex flex-col gap-2">
            <h2 className="px-1 text-sm font-medium">{department.name}</h2>
            <div className={tableFrameClassName}>
              <table className={tableClassName}>
                <caption className="sr-only">{`Факт HR, ${department.name}, ${selectedDay}`}</caption>
                <thead>
                  <tr>
                    <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                      <ColumnLabel label="Наименование" />
                    </th>
                    <th scope="col" className={valueHead}>
                      <ColumnLabel label="Часы" />
                    </th>
                    <th scope="col" className={valueHead}>
                      <ColumnLabel label="Сумма" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {department.positions.map((position) => {
                    const values = hrDayStaffValue(opex.document, selectedDay, position.id);
                    return (
                      <tr key={position.id}>
                        <th scope="row" className={nameCell}>
                          {position.name}
                        </th>
                        <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
                          {editable ? (
                            <QuantityCell
                              label={`Часы, ${position.name}`}
                              value={values.hourThousandths}
                              unit="ч"
                              blankIfZero
                              onChange={(next) => {
                                const rejection = opex.setHrDayStaff(
                                  selectedDay,
                                  position.id,
                                  next,
                                  values.amountExVat,
                                );
                                return rejection ? HR_ERROR[rejection] : null;
                              }}
                            />
                          ) : (
                            values.hourThousandths
                          )}
                        </td>
                        <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
                          {editable ? (
                            <MoneyCell
                              label={`Сумма, ${position.name}`}
                              value={values.amountExVat}
                              parse={parseOpexMoney}
                              invalidMessage={HR_ERROR.amount}
                              onChange={(next) => {
                                const rejection = opex.setHrDayStaff(
                                  selectedDay,
                                  position.id,
                                  values.hourThousandths,
                                  next,
                                );
                                return rejection ? HR_ERROR[rejection] : null;
                              }}
                            />
                          ) : (
                            <MoneyAmount amount={values.amountExVat} />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <th scope="row" className={nameCell}>
                      Аутсорсинговый персонал
                    </th>
                    <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
                      {editable ? (
                        <QuantityCell
                          label={`Часы аутсорсинга, ${department.name}`}
                          value={hrDayOutsourcingHours(opex.document, selectedDay, department.departmentId)}
                          unit="ч"
                          blankIfZero
                          onChange={(next) => {
                            const rejection = opex.setHrDayOutsourcing(selectedDay, department.departmentId, next);
                            return rejection ? HR_ERROR[rejection] : null;
                          }}
                        />
                      ) : (
                        hrDayOutsourcingHours(opex.document, selectedDay, department.departmentId)
                      )}
                    </td>
                    <td className={`${valueCell} ${cellKindClassName.computed}`} />
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </PageFrame>
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
