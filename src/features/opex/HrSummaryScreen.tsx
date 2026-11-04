'use client';

import { useRouter } from 'next/navigation';
import { Fragment, useMemo, useState } from 'react';

import { type HrDepartmentView, hrMonthView } from '@/domain/hr';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { OpexMonthBar, resolveOpexMonth } from '@/features/opex/OpexMonthBar';
import { OPEX_HR_TITLE, opexHrHref } from '@/features/opex/paths';
import { formatHours, formatQuantity, formatTaxRate } from '@/features/opex/text';
import { useOpex } from '@/features/opex/use-opex';
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
  nameHeadingClassName,
  tableClassName,
  tableFrameClassName,
} from '@/features/table';

const valueHead = `${columnHeadingClassName} ${columnDividerClassName}`;
const valueCell = `border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`;

export function HrSummaryScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveOpexMonth(month, today, currentMonth);
  const opex = useOpex();
  const router = useRouter();
  const view = useMemo(() => hrMonthView(opex.document, selectedMonth), [opex.document, selectedMonth]);

  return (
    <PageFrame
      title={OPEX_HR_TITLE}
      full
      lede="План и факт по подразделениям и должностям. Факт собран из дневных строк. Зарплатные налоги только показывают."
      intro={
        <OpexMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(opexHrHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      <div className="flex flex-col gap-6">
        <div className={tableFrameClassName}>
          <table className={tableClassName}>
            <caption className="sr-only">{`HR за ${selectedMonth}`}</caption>
            <thead>
              <tr>
                <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                  <ColumnLabel label="Наименование" />
                </th>
                <th scope="col" className={valueHead}>
                  <ColumnLabel label="План, чел" />
                </th>
                <th scope="col" className={valueHead}>
                  <ColumnLabel label="План, зарплата" />
                </th>
                <th scope="col" className={valueHead}>
                  <ColumnLabel label="План, ФОТ" />
                </th>
                <th scope="col" className={valueHead}>
                  <ColumnLabel label="Факт, чел" hint="Сумма людей по дням / дни месяца" />
                </th>
                <th scope="col" className={valueHead}>
                  <ColumnLabel label="Факт, зарплата" />
                </th>
                <th scope="col" className={valueHead}>
                  <ColumnLabel label="Факт, ФОТ" />
                </th>
              </tr>
            </thead>
            <tbody>
              {view.departments.map((department) => (
                <DepartmentBlock key={department.departmentId} department={department} />
              ))}
              <tr className="font-medium">
                <th scope="row" className={categoryNameRowClassName(false)}>
                  <span className={categoryNameClassName}>ВСЕГО</span>
                </th>
                <td className={`${valueCell} ${cellKindClassName.computed}`}>{view.total.plan.headcount}</td>
                <td className={`${valueCell} ${cellKindClassName.computed}`}>
                  <MoneyAmount amount={view.total.plan.salaryExVat} />
                </td>
                <td className={`${valueCell} ${cellKindClassName.computed}`}>
                  <MoneyAmount amount={view.total.plan.fotExVat} />
                </td>
                <td className={`${valueCell} ${cellKindClassName.computed}`}>
                  {formatQuantity(view.total.fact.headcount)}
                </td>
                <td className={`${valueCell} ${cellKindClassName.computed}`}>
                  <MoneyAmount amount={view.total.fact.salaryExVat} />
                </td>
                <td className={`${valueCell} ${cellKindClassName.computed}`}>
                  <MoneyAmount amount={view.total.fact.fotExVat} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={tableFrameClassName}>
          <table className={tableClassName}>
            <caption className="sr-only">Зарплатные налоги</caption>
            <thead>
              <tr>
                <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                  <ColumnLabel label="Налог" />
                </th>
                <th scope="col" className={valueHead}>
                  <ColumnLabel label="План, база" />
                </th>
                <th scope="col" className={valueHead}>
                  <ColumnLabel label="План, %" />
                </th>
                <th scope="col" className={valueHead}>
                  <ColumnLabel label="План, сумма" />
                </th>
                <th scope="col" className={valueHead}>
                  <ColumnLabel label="Факт, база" />
                </th>
                <th scope="col" className={valueHead}>
                  <ColumnLabel label="Факт, %" />
                </th>
                <th scope="col" className={valueHead}>
                  <ColumnLabel label="Факт, сумма" />
                </th>
              </tr>
            </thead>
            <tbody>
              {view.taxes.map((tax) => (
                <tr key={tax.id}>
                  <th scope="row" className={entityNameRowClassName('repeated')}>
                    {tax.name}
                  </th>
                  <td className={`${valueCell} ${cellKindClassName.computed}`}>
                    <MoneyAmount amount={tax.planBaseExVat} />
                  </td>
                  <td className={`${valueCell} ${cellKindClassName.repeated}`}>
                    {formatTaxRate(tax.planRateHundredths)}
                  </td>
                  <td className={`${valueCell} ${cellKindClassName.computed}`}>
                    <MoneyAmount amount={tax.planAmountExVat} />
                  </td>
                  <td className={`${valueCell} ${cellKindClassName.computed}`}>
                    <MoneyAmount amount={tax.factBaseExVat} />
                  </td>
                  <td className={`${valueCell} ${cellKindClassName.repeated}`}>
                    {formatTaxRate(tax.factRateHundredths)}
                  </td>
                  <td className={`${valueCell} ${cellKindClassName.computed}`}>
                    <MoneyAmount amount={tax.factAmountExVat} />
                  </td>
                </tr>
              ))}
              <tr className="font-medium">
                <th scope="row" className={categoryNameRowClassName(false)}>
                  <span className={categoryNameClassName}>ВСЕГО</span>
                </th>
                <td className={`${valueCell} ${cellKindClassName.computed}`} />
                <td className={`${valueCell} ${cellKindClassName.computed}`}>
                  {formatTaxRate(view.taxTotal.planEffectiveHundredths)}
                </td>
                <td className={`${valueCell} ${cellKindClassName.computed}`}>
                  <MoneyAmount amount={view.taxTotal.planAmountExVat} />
                </td>
                <td className={`${valueCell} ${cellKindClassName.computed}`} />
                <td className={`${valueCell} ${cellKindClassName.computed}`}>
                  {formatTaxRate(view.taxTotal.factEffectiveHundredths)}
                </td>
                <td className={`${valueCell} ${cellKindClassName.computed}`}>
                  <MoneyAmount amount={view.taxTotal.factAmountExVat} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </PageFrame>
  );
}

function DepartmentBlock({ department }: { department: HrDepartmentView }) {
  const [open, setOpen] = useState(true);
  const outsourcing = department.outsourcing;
  const count = department.staff.length + (outsourcing ? 1 : 0);

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
        <td className={`${valueCell} ${categoryBandClassName}`}>{department.plan.headcount}</td>
        <td className={`${valueCell} ${categoryBandClassName}`}>
          <MoneyAmount amount={department.plan.salaryExVat} />
        </td>
        <td className={`${valueCell} ${categoryBandClassName}`}>
          <MoneyAmount amount={department.plan.fotExVat} />
        </td>
        <td className={`${valueCell} ${categoryBandClassName}`}>{formatQuantity(department.fact.headcount)}</td>
        <td className={`${valueCell} ${categoryBandClassName}`}>
          <MoneyAmount amount={department.fact.salaryExVat} />
        </td>
        <td className={`${valueCell} ${categoryBandClassName}`}>
          <MoneyAmount amount={department.fact.fotExVat} />
        </td>
      </tr>
      {open
        ? department.staff.map((row) => (
            <tr key={row.positionId}>
              <th scope="row" className={entityNameRowClassName('repeated')}>
                {row.name}
                {row.deleted ? ' (архив)' : ''}
              </th>
              <td className={`${valueCell} ${cellKindClassName.computed}`}>{row.plan.headcount}</td>
              <td className={`${valueCell} ${cellKindClassName.computed}`}>
                <MoneyAmount amount={row.plan.salaryExVat} />
              </td>
              <td className={`${valueCell} ${cellKindClassName.computed}`}>
                <MoneyAmount amount={row.plan.fotExVat} />
              </td>
              <td className={`${valueCell} ${cellKindClassName.computed}`}>{formatQuantity(row.fact.headcount)}</td>
              <td className={`${valueCell} ${cellKindClassName.computed}`}>
                <MoneyAmount amount={row.fact.salaryExVat} />
              </td>
              <td className={`${valueCell} ${cellKindClassName.computed}`}>
                <MoneyAmount amount={row.fact.fotExVat} />
              </td>
            </tr>
          ))
        : null}
      {open && outsourcing ? (
        <tr key={`${department.departmentId}-out`}>
          <th scope="row" className={entityNameRowClassName('repeated')}>
            {outsourcing.name}
          </th>
          <td className={`${valueCell} ${cellKindClassName.computed}`}>
            {formatHours(outsourcing.planHoursThousandths)} ч
          </td>
          <td className={`${valueCell} ${cellKindClassName.computed}`}>
            <MoneyAmount amount={outsourcing.planRateExVat} />
            <span className="text-muted"> /ч</span>
          </td>
          <td className={`${valueCell} ${cellKindClassName.computed}`}>
            <MoneyAmount amount={outsourcing.planAmountExVat} />
          </td>
          <td className={`${valueCell} ${cellKindClassName.computed}`}>
            {formatHours(outsourcing.factHoursThousandths)} ч
          </td>
          <td className={`${valueCell} ${cellKindClassName.computed}`}>
            <MoneyAmount amount={outsourcing.factRateExVat} />
            <span className="text-muted"> /ч</span>
          </td>
          <td className={`${valueCell} ${cellKindClassName.computed}`}>
            <MoneyAmount amount={outsourcing.factAmountExVat} />
          </td>
        </tr>
      ) : null}
    </Fragment>
  );
}
