'use client';

import { useRouter } from 'next/navigation';
import { Fragment, useMemo, useState } from 'react';

import { HR_DEPARTMENT_IDS, type HrDepartmentId, isHrShopDepartmentId, isOccurredOn } from '@/domain/document';
import { HR_DEPARTMENT_LABELS, hrDayOutsourcingValue, hrDayStaffValue, hrMonthView } from '@/domain/hr';
import { defaultSalesFactDay, monthDates } from '@/domain/sales-fact';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { QuantityCell, QuantityRead } from '@/features/materials/QuantityCell';
import { HrTaxRateBlock } from '@/features/opex/HrTaxRateBlock';
import { OpexMonthBar, resolveOpexMonth } from '@/features/opex/OpexMonthBar';
import { OPEX_HR_FACT_TITLE, opexHrFactHref } from '@/features/opex/paths';
import { HR_ERROR, parseOpexMoney } from '@/features/opex/text';
import { useOpex } from '@/features/opex/use-opex';
import { useRole } from '@/features/roles/RoleProvider';
import { monthFieldClassName } from '@/features/sales/fields';
import { IconChevronDown, IconChevronRight } from '@/features/shell/Icons';
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

const valueHead = `${columnHeadingClassName} ${columnDividerClassName}`;
const valueCell = `border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`;

type FactDepartment = {
  departmentId: HrDepartmentId;
  name: string;
  positions: { id: string; name: string }[];
  hasOutsourcing: boolean;
};

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
  const taxes = useMemo(() => hrMonthView(opex.document, selectedMonth).taxes, [opex.document, selectedMonth]);

  const departments = useMemo((): FactDepartment[] => {
    return HR_DEPARTMENT_IDS.map((departmentId) => {
      const positions = opex.document.hrPositions
        .filter((item) => item.departmentId === departmentId && item.kind === 'staff' && item.deletedAt === null)
        .map((item) => ({ id: item.id, name: item.name }));
      return {
        departmentId,
        name: HR_DEPARTMENT_LABELS[departmentId],
        positions,
        hasOutsourcing: isHrShopDepartmentId(departmentId),
      };
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
      lede="Дневной факт подразделений: численность и суммы штатных. У цехов и РЦ — часы и сумма аутсорсинга. Ставки налогов — на месяц, под сеткой дня."
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
        <div className={tableFrameClassName}>
          <table className={tableClassName}>
            <caption className="sr-only">{`Факт HR на ${selectedDay}`}</caption>
            <thead>
              <tr>
                <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                  <ColumnLabel label="Наименование" />
                </th>
                <th scope="col" className={valueHead}>
                  <ColumnLabel label="Кол-во" />
                </th>
                <th scope="col" className={valueHead}>
                  <ColumnLabel label="Сумма" />
                </th>
              </tr>
            </thead>
            <tbody>
              {departments.map((department) => (
                <DepartmentBlock
                  key={department.departmentId}
                  department={department}
                  editable={editable}
                  staff={(positionId) => hrDayStaffValue(opex.document, selectedDay, positionId)}
                  outsourcing={() =>
                    department.hasOutsourcing && isHrShopDepartmentId(department.departmentId)
                      ? hrDayOutsourcingValue(opex.document, selectedDay, department.departmentId)
                      : { hourThousandths: 0, amountExVat: 0 }
                  }
                  onStaff={(positionId, headcountThousandths, amountExVat) => {
                    const rejection = opex.setHrDayStaff(selectedDay, positionId, headcountThousandths, amountExVat);
                    return rejection ? HR_ERROR[rejection] : null;
                  }}
                  onOutsourcing={(hourThousandths, amountExVat) => {
                    if (!isHrShopDepartmentId(department.departmentId)) {
                      return null;
                    }
                    const rejection = opex.setHrDayOutsourcing(
                      selectedDay,
                      department.departmentId,
                      hourThousandths,
                      amountExVat,
                    );
                    return rejection ? HR_ERROR[rejection] : null;
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
        <HrTaxRateBlock
          side="fact"
          taxes={taxes}
          editable={editable}
          onRate={(field, rateHundredths) => {
            const rejection = opex.setHrTaxRate(selectedMonth, field, rateHundredths);
            return rejection ? HR_ERROR[rejection] : null;
          }}
        />
      </div>
    </PageFrame>
  );
}

function DepartmentBlock({
  department,
  editable,
  staff,
  outsourcing,
  onStaff,
  onOutsourcing,
}: {
  department: FactDepartment;
  editable: boolean;
  staff: (positionId: string) => { headcountThousandths: number; amountExVat: number };
  outsourcing: () => { hourThousandths: number; amountExVat: number };
  onStaff: (positionId: string, headcountThousandths: number, amountExVat: number) => string | null;
  onOutsourcing: (hourThousandths: number, amountExVat: number) => string | null;
}) {
  const [open, setOpen] = useState(true);
  const count = department.positions.length + (department.hasOutsourcing ? 1 : 0);
  const outsource = outsourcing();

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
        <td className={`${valueCell} ${categoryBandClassName}`} />
      </tr>
      {open
        ? department.positions.map((position) => {
            const values = staff(position.id);
            return (
              <tr key={position.id}>
                <th scope="row" className={entityNameRowClassName('repeated')}>
                  {position.name}
                </th>
                <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
                  {editable ? (
                    <QuantityCell
                      label={`Численность, ${position.name}`}
                      value={values.headcountThousandths}
                      unit="чел"
                      blankIfZero
                      onChange={(next) => onStaff(position.id, next, values.amountExVat)}
                    />
                  ) : (
                    <QuantityRead value={values.headcountThousandths} unit="чел" />
                  )}
                </td>
                <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
                  {editable ? (
                    <MoneyCell
                      label={`Сумма, ${position.name}`}
                      value={values.amountExVat}
                      parse={parseOpexMoney}
                      invalidMessage={HR_ERROR.amount}
                      onChange={(next) => onStaff(position.id, values.headcountThousandths, next)}
                    />
                  ) : (
                    <MoneyAmount amount={values.amountExVat} />
                  )}
                </td>
              </tr>
            );
          })
        : null}
      {open && department.hasOutsourcing ? (
        <tr>
          <th scope="row" className={entityNameRowClassName('repeated')}>
            Аутсорсинговый персонал
          </th>
          <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
            {editable ? (
              <QuantityCell
                label={`Часы аутсорсинга, ${department.name}`}
                value={outsource.hourThousandths}
                unit="ч"
                blankIfZero
                onChange={(next) => onOutsourcing(next, outsource.amountExVat)}
              />
            ) : (
              <QuantityRead value={outsource.hourThousandths} unit="ч" />
            )}
          </td>
          <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
            {editable ? (
              <MoneyCell
                label={`Сумма аутсорсинга, ${department.name}`}
                value={outsource.amountExVat}
                parse={parseOpexMoney}
                invalidMessage={HR_ERROR.amount}
                onChange={(next) => onOutsourcing(outsource.hourThousandths, next)}
              />
            ) : (
              <MoneyAmount amount={outsource.amountExVat} />
            )}
          </td>
        </tr>
      ) : null}
    </Fragment>
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
