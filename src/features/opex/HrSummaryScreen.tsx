'use client';

import { useRouter } from 'next/navigation';
import { Fragment, useMemo } from 'react';

import { type HrTaxRateField, hrMonthView, hrTaxRatesOrDefault } from '@/domain/hr';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { OpexMonthBar, resolveOpexMonth } from '@/features/opex/OpexMonthBar';
import { OPEX_HR_TITLE, opexHrHref } from '@/features/opex/paths';
import { formatHours, formatTaxRate, HR_ERROR, parseOpexMoney } from '@/features/opex/text';
import { useOpex } from '@/features/opex/use-opex';
import { useRole } from '@/features/roles/RoleProvider';
import { PageFrame } from '@/features/shell/PageFrame';
import {
  ColumnLabel,
  cellKindClassName,
  columnDividerClassName,
  columnHeadingClassName,
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
const nameCell =
  'sticky left-0 z-10 border-b border-b-line border-r-[1.5px] border-r-muted bg-sheet px-3 py-2 text-left align-middle text-sm';

function formatHeadcount(value: number, mode: 'people' | 'hoursPerDay'): string {
  if (mode === 'people') {
    return String(value);
  }
  return formatHours(value);
}

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
      lede="План и факт по подразделениям и должностям. Факт цехов собран из дневных часов; администрацию правят здесь за месяц. Ниже — зарплатные налоги."
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
                  <ColumnLabel label="Факт, чел" hint="У цехов — сумма часов штатных / дни месяца" />
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
                <Fragment key={department.departmentId}>
                  <tr className="font-medium">
                    <th scope="row" className={nameCell}>
                      {department.name}
                    </th>
                    <td className={`${valueCell} ${cellKindClassName.computed}`}>{department.plan.headcount}</td>
                    <td className={`${valueCell} ${cellKindClassName.computed}`}>
                      <MoneyAmount amount={department.plan.salaryExVat} />
                    </td>
                    <td className={`${valueCell} ${cellKindClassName.computed}`}>
                      <MoneyAmount amount={department.plan.fotExVat} />
                    </td>
                    <td className={`${valueCell} ${cellKindClassName.computed}`}>
                      {department.departmentId === 'admin'
                        ? department.fact.headcount
                        : formatHeadcount(department.fact.headcount, 'hoursPerDay')}
                    </td>
                    <td className={`${valueCell} ${cellKindClassName.computed}`}>
                      <MoneyAmount amount={department.fact.salaryExVat} />
                    </td>
                    <td className={`${valueCell} ${cellKindClassName.computed}`}>
                      <MoneyAmount amount={department.fact.fotExVat} />
                    </td>
                  </tr>
                  {department.staff.map((row) => (
                    <tr key={row.positionId}>
                      <th scope="row" className={nameCell}>
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
                      <td
                        className={`${valueCell} ${cellKindClassName[department.departmentId === 'admin' && editable ? 'assigned' : 'computed']}`}
                      >
                        {department.departmentId === 'admin' && editable ? (
                          <IntegerCell
                            label={`Факт, чел, ${row.name}`}
                            value={row.fact.headcount}
                            onChange={(next) => {
                              const rejection = opex.setHrAdminFact(
                                selectedMonth,
                                row.positionId,
                                next,
                                row.fact.salaryExVat,
                              );
                              return rejection ? HR_ERROR[rejection] : null;
                            }}
                          />
                        ) : department.departmentId === 'admin' ? (
                          row.fact.headcount
                        ) : (
                          formatHeadcount(row.fact.headcount, 'hoursPerDay')
                        )}
                      </td>
                      <td
                        className={`${valueCell} ${cellKindClassName[department.departmentId === 'admin' && editable ? 'assigned' : 'computed']}`}
                      >
                        {department.departmentId === 'admin' && editable ? (
                          <MoneyCell
                            label={`Факт, зарплата, ${row.name}`}
                            value={row.fact.salaryExVat}
                            parse={parseOpexMoney}
                            invalidMessage={HR_ERROR.salary}
                            onChange={(next) => {
                              const rejection = opex.setHrAdminFact(
                                selectedMonth,
                                row.positionId,
                                row.fact.headcount,
                                next,
                              );
                              return rejection ? HR_ERROR[rejection] : null;
                            }}
                          />
                        ) : (
                          <MoneyAmount amount={row.fact.salaryExVat} />
                        )}
                      </td>
                      <td className={`${valueCell} ${cellKindClassName.computed}`}>
                        <MoneyAmount amount={row.fact.fotExVat} />
                      </td>
                    </tr>
                  ))}
                  {department.outsourcing ? (
                    <tr key={`${department.departmentId}-out`}>
                      <th scope="row" className={nameCell}>
                        {department.outsourcing.name}
                      </th>
                      <td className={`${valueCell} ${cellKindClassName.computed}`}>
                        {formatHours(department.outsourcing.planHoursThousandths)} ч
                      </td>
                      <td className={`${valueCell} ${cellKindClassName.computed}`}>
                        <MoneyAmount amount={department.outsourcing.planRateExVat} />
                        <span className="text-muted"> /ч</span>
                      </td>
                      <td className={`${valueCell} ${cellKindClassName.computed}`}>
                        <MoneyAmount amount={department.outsourcing.planAmountExVat} />
                      </td>
                      <td className={`${valueCell} ${cellKindClassName.computed}`}>
                        {formatHours(department.outsourcing.factHoursThousandths)} ч
                      </td>
                      <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
                        {editable ? (
                          <MoneyCell
                            label={`Ставка аутсорсинга, ${department.name}`}
                            value={department.outsourcing.factRateExVat}
                            parse={parseOpexMoney}
                            invalidMessage={HR_ERROR.rate}
                            onChange={(next) => {
                              const outsourcing = department.outsourcing;
                              if (!outsourcing) {
                                return HR_ERROR.missing;
                              }
                              const rejection = opex.setHrOutsourcingRate(
                                selectedMonth,
                                outsourcing.departmentId,
                                next,
                              );
                              return rejection ? HR_ERROR[rejection] : null;
                            }}
                          />
                        ) : (
                          <MoneyAmount amount={department.outsourcing.factRateExVat} />
                        )}
                      </td>
                      <td className={`${valueCell} ${cellKindClassName.computed}`}>
                        <MoneyAmount amount={department.outsourcing.factAmountExVat} />
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              ))}
              <tr className="font-medium">
                <th scope="row" className={nameCell}>
                  ВСЕГО
                </th>
                <td className={`${valueCell} ${cellKindClassName.computed}`}>{view.total.plan.headcount}</td>
                <td className={`${valueCell} ${cellKindClassName.computed}`}>
                  <MoneyAmount amount={view.total.plan.salaryExVat} />
                </td>
                <td className={`${valueCell} ${cellKindClassName.computed}`}>
                  <MoneyAmount amount={view.total.plan.fotExVat} />
                </td>
                <td className={`${valueCell} ${cellKindClassName.computed}`}>
                  {formatHours(view.total.fact.headcount)}
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
                    <th scope="row" className={nameCell}>
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
                <th scope="row" className={nameCell}>
                  ВСЕГО
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
