'use client';

import { useRouter } from 'next/navigation';
import { Fragment, useMemo, useState } from 'react';

import type { HrShopDepartmentId } from '@/domain/document';
import { type HrDepartmentView, type HrTaxRateField, hrMonthView, hrTaxRatesOrDefault } from '@/domain/hr';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { OpexMonthBar, resolveOpexMonth } from '@/features/opex/OpexMonthBar';
import { OPEX_HR_TITLE, opexHrHref } from '@/features/opex/paths';
import { formatHours, formatQuantity, formatTaxRate, HR_ERROR, parseOpexMoney } from '@/features/opex/text';
import { useOpex } from '@/features/opex/use-opex';
import { useRole } from '@/features/roles/RoleProvider';
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
  HundredthsCell,
  IntegerCell,
  MoneyAmount,
  MoneyCell,
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
  const { canEditSalesOpex } = useRole();
  const router = useRouter();
  const editable = opex.hydrated && canEditSalesOpex;
  const view = useMemo(() => hrMonthView(opex.document, selectedMonth), [opex.document, selectedMonth]);
  const taxRates = hrTaxRatesOrDefault(opex.document, selectedMonth);

  function setTax(field: HrTaxRateField, rateHundredths: number): string | null {
    const rejection = opex.setHrTaxRate(selectedMonth, field, rateHundredths);
    return rejection ? HR_ERROR[rejection] : null;
  }

  return (
    <PageFrame
      title={OPEX_HR_TITLE}
      full
      lede="План и факт по подразделениям и должностям. Факт цехов собран из дневной численности; администрацию правят здесь за месяц. Ниже — зарплатные налоги."
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
                  <ColumnLabel label="Факт, чел" hint="У цехов — сумма людей по дням / дни месяца" />
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
                <DepartmentBlock
                  key={department.departmentId}
                  department={department}
                  editable={editable}
                  onAdminFact={(positionId, headcount, salaryExVat) => {
                    const rejection = opex.setHrAdminFact(selectedMonth, positionId, headcount, salaryExVat);
                    return rejection ? HR_ERROR[rejection] : null;
                  }}
                  onOutsourcingRate={(departmentId, rateExVat) => {
                    const rejection = opex.setHrOutsourcingRate(selectedMonth, departmentId, rateExVat);
                    return rejection ? HR_ERROR[rejection] : null;
                  }}
                />
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
              {view.taxes.map((tax) => {
                const planField =
                  tax.id === 'ndfl'
                    ? 'planNdflHundredths'
                    : tax.id === 'social'
                      ? 'planSocialHundredths'
                      : 'planInjuryHundredths';
                const factField =
                  tax.id === 'ndfl'
                    ? 'factNdflHundredths'
                    : tax.id === 'social'
                      ? 'factSocialHundredths'
                      : 'factInjuryHundredths';
                return (
                  <tr key={tax.id}>
                    <th scope="row" className={entityNameRowClassName('repeated')}>
                      {tax.name}
                    </th>
                    <td className={`${valueCell} ${cellKindClassName.computed}`}>
                      <MoneyAmount amount={tax.planBaseExVat} />
                    </td>
                    <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
                      {editable ? (
                        <HundredthsCell
                          label={`План ставка, ${tax.name}`}
                          value={tax.planRateHundredths}
                          invalidMessage={HR_ERROR.taxRate}
                          onChange={(next) => setTax(planField, next)}
                        />
                      ) : (
                        formatTaxRate(tax.planRateHundredths)
                      )}
                    </td>
                    <td className={`${valueCell} ${cellKindClassName.computed}`}>
                      <MoneyAmount amount={tax.planAmountExVat} />
                    </td>
                    <td className={`${valueCell} ${cellKindClassName.computed}`}>
                      <MoneyAmount amount={tax.factBaseExVat} />
                    </td>
                    <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
                      {editable ? (
                        <HundredthsCell
                          label={`Факт ставка, ${tax.name}`}
                          value={tax.factRateHundredths}
                          invalidMessage={HR_ERROR.taxRate}
                          onChange={(next) => setTax(factField, next)}
                        />
                      ) : (
                        formatTaxRate(tax.factRateHundredths)
                      )}
                    </td>
                    <td className={`${valueCell} ${cellKindClassName.computed}`}>
                      <MoneyAmount amount={tax.factAmountExVat} />
                    </td>
                  </tr>
                );
              })}
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
          <p className="sr-only">
            Ставки по умолчанию {formatTaxRate(taxRates.planNdflHundredths)} /{' '}
            {formatTaxRate(taxRates.planSocialHundredths)} / {formatTaxRate(taxRates.planInjuryHundredths)}.
          </p>
        </div>
      </div>
    </PageFrame>
  );
}

function DepartmentBlock({
  department,
  editable,
  onAdminFact,
  onOutsourcingRate,
}: {
  department: HrDepartmentView;
  editable: boolean;
  onAdminFact: (positionId: string, headcount: number, salaryExVat: number) => string | null;
  onOutsourcingRate: (departmentId: HrShopDepartmentId, rateExVat: number) => string | null;
}) {
  const [open, setOpen] = useState(true);
  const outsourcing = department.outsourcing;
  const count = department.staff.length + (outsourcing ? 1 : 0);
  const isAdmin = department.departmentId === 'admin';

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
        <td className={`${valueCell} ${categoryBandClassName}`}>
          {isAdmin ? department.fact.headcount : formatQuantity(department.fact.headcount)}
        </td>
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
              <td className={`${valueCell} ${cellKindClassName[isAdmin && editable ? 'assigned' : 'computed']}`}>
                {isAdmin && editable ? (
                  <IntegerCell
                    label={`Факт, чел, ${row.name}`}
                    value={row.fact.headcount}
                    onChange={(next) => onAdminFact(row.positionId, next, row.fact.salaryExVat)}
                  />
                ) : isAdmin ? (
                  row.fact.headcount
                ) : (
                  formatQuantity(row.fact.headcount)
                )}
              </td>
              <td className={`${valueCell} ${cellKindClassName[isAdmin && editable ? 'assigned' : 'computed']}`}>
                {isAdmin && editable ? (
                  <MoneyCell
                    label={`Факт, зарплата, ${row.name}`}
                    value={row.fact.salaryExVat}
                    parse={parseOpexMoney}
                    invalidMessage={HR_ERROR.salary}
                    onChange={(next) => onAdminFact(row.positionId, row.fact.headcount, next)}
                  />
                ) : (
                  <MoneyAmount amount={row.fact.salaryExVat} />
                )}
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
          <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
            {editable ? (
              <MoneyCell
                label={`Ставка аутсорсинга, ${department.name}`}
                value={outsourcing.factRateExVat}
                parse={parseOpexMoney}
                invalidMessage={HR_ERROR.rate}
                onChange={(next) => onOutsourcingRate(outsourcing.departmentId, next)}
              />
            ) : (
              <MoneyAmount amount={outsourcing.factRateExVat} />
            )}
          </td>
          <td className={`${valueCell} ${cellKindClassName.computed}`}>
            <MoneyAmount amount={outsourcing.factAmountExVat} />
          </td>
        </tr>
      ) : null}
    </Fragment>
  );
}
