'use client';

import { useRouter } from 'next/navigation';
import { Fragment, useMemo, useState } from 'react';

import type { HrDepartmentId } from '@/domain/document';
import { HR_DEPARTMENT_LABELS, hrMonthView } from '@/domain/hr';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { QuantityCell } from '@/features/materials/QuantityCell';
import { OpexMonthBar, resolveOpexMonth } from '@/features/opex/OpexMonthBar';
import { OPEX_HR_PLAN_TITLE, opexHrPlanHref } from '@/features/opex/paths';
import { formatHours, HR_ERROR, parseOpexMoney } from '@/features/opex/text';
import { useOpex } from '@/features/opex/use-opex';
import { useRole } from '@/features/roles/RoleProvider';
import { fieldClassName, primaryButtonClassName } from '@/features/sales/fields';
import { Dialog } from '@/features/shell/Dialog';
import { IconPlus, IconTrash } from '@/features/shell/Icons';
import { PageFrame } from '@/features/shell/PageFrame';
import {
  ColumnLabel,
  cellKindClassName,
  columnDividerClassName,
  columnHeadingClassName,
  IntegerCell,
  MoneyAmount,
  MoneyCell,
  nameHeadingClassName,
  tableClassName,
  tableFrameClassName,
} from '@/features/table';

const deleteIconButtonClassName =
  'inline-flex size-8 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';

const valueHead = `${columnHeadingClassName} ${columnDividerClassName}`;
const valueCell = `border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`;
const nameCell =
  'sticky left-0 z-10 border-b border-b-line border-r-[1.5px] border-r-muted bg-sheet px-3 py-2 text-left align-middle text-sm';

export function HrPlanScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveOpexMonth(month, today, currentMonth);
  const opex = useOpex();
  const { canEditSalesOpex } = useRole();
  const router = useRouter();
  const editable = opex.hydrated && canEditSalesOpex;
  const view = useMemo(() => hrMonthView(opex.document, selectedMonth), [opex.document, selectedMonth]);
  const [addDepartment, setAddDepartment] = useState<HrDepartmentId | null>(null);

  return (
    <PageFrame
      title={OPEX_HR_PLAN_TITLE}
      full
      lede="Плановая численность и зарплата по должностям. У цехов и РЦ — часы и ставка аутсорсинга на месяц."
      intro={
        <OpexMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(opexHrPlanHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      <div className="flex flex-col gap-6">
        {view.departments.map((department) => {
          const outsourcing = department.outsourcing;
          return (
            <section key={department.departmentId} className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                <h2 className="text-sm font-medium">{department.name}</h2>
                {editable ? (
                  <button
                    type="button"
                    className={primaryButtonClassName}
                    onClick={() => setAddDepartment(department.departmentId)}
                  >
                    <IconPlus />
                    Добавить должность
                  </button>
                ) : null}
              </div>
              <div className={tableFrameClassName}>
                <table className={tableClassName}>
                  <caption className="sr-only">{`План HR, ${department.name}`}</caption>
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
                      {editable ? (
                        <th scope="col" className={`${valueHead} w-12`}>
                          <span className="sr-only">Действия</span>
                        </th>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody>
                    {department.staff.map((row) => (
                      <tr key={row.positionId}>
                        <th scope="row" className={nameCell}>
                          {row.name}
                          {row.deleted ? ' (архив)' : ''}
                        </th>
                        <td
                          className={`${valueCell} ${cellKindClassName[editable && !row.deleted ? 'assigned' : 'computed']}`}
                        >
                          {editable && !row.deleted ? (
                            <IntegerCell
                              label={`План, чел, ${row.name}`}
                              value={row.plan.headcount}
                              onChange={(next) => {
                                const rejection = opex.setHrStaffPlan(
                                  selectedMonth,
                                  row.positionId,
                                  next,
                                  row.plan.salaryExVat,
                                );
                                return rejection ? HR_ERROR[rejection] : null;
                              }}
                            />
                          ) : (
                            row.plan.headcount
                          )}
                        </td>
                        <td
                          className={`${valueCell} ${cellKindClassName[editable && !row.deleted ? 'assigned' : 'computed']}`}
                        >
                          {editable && !row.deleted ? (
                            <MoneyCell
                              label={`План, зарплата, ${row.name}`}
                              value={row.plan.salaryExVat}
                              parse={parseOpexMoney}
                              invalidMessage={HR_ERROR.salary}
                              onChange={(next) => {
                                const rejection = opex.setHrStaffPlan(
                                  selectedMonth,
                                  row.positionId,
                                  row.plan.headcount,
                                  next,
                                );
                                return rejection ? HR_ERROR[rejection] : null;
                              }}
                            />
                          ) : (
                            <MoneyAmount amount={row.plan.salaryExVat} />
                          )}
                        </td>
                        <td className={`${valueCell} ${cellKindClassName.computed}`}>
                          <MoneyAmount amount={row.plan.fotExVat} />
                        </td>
                        {editable ? (
                          <td className={`${valueCell} text-center`}>
                            {!row.deleted ? (
                              <button
                                type="button"
                                aria-label={`Удалить ${row.name}`}
                                className={deleteIconButtonClassName}
                                onClick={() => {
                                  const confirmed = window.confirm(
                                    `Удалить «${row.name}»? Должность пропадёт из рабочего списка.`,
                                  );
                                  if (confirmed) {
                                    opex.deleteHrPosition(row.positionId);
                                  }
                                }}
                              >
                                <IconTrash />
                              </button>
                            ) : null}
                          </td>
                        ) : null}
                      </tr>
                    ))}
                    {outsourcing ? (
                      <Fragment key={`${department.departmentId}-out`}>
                        <tr>
                          <th scope="row" className={nameCell}>
                            {outsourcing.name}
                          </th>
                          <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
                            {editable ? (
                              <QuantityCell
                                label={`План, часы, ${department.name}`}
                                value={outsourcing.planHoursThousandths}
                                unit="ч"
                                blankIfZero
                                onChange={(next) => {
                                  const rejection = opex.setHrOutsourcingPlan(
                                    selectedMonth,
                                    outsourcing.departmentId,
                                    next,
                                    outsourcing.planRateExVat,
                                  );
                                  return rejection ? HR_ERROR[rejection] : null;
                                }}
                              />
                            ) : (
                              `${formatHours(outsourcing.planHoursThousandths)} ч`
                            )}
                          </td>
                          <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
                            {editable ? (
                              <MoneyCell
                                label={`Ставка аутсорсинга, ${department.name}`}
                                value={outsourcing.planRateExVat}
                                parse={parseOpexMoney}
                                invalidMessage={HR_ERROR.rate}
                                onChange={(next) => {
                                  const rejection = opex.setHrOutsourcingPlan(
                                    selectedMonth,
                                    outsourcing.departmentId,
                                    outsourcing.planHoursThousandths,
                                    next,
                                  );
                                  return rejection ? HR_ERROR[rejection] : null;
                                }}
                              />
                            ) : (
                              <>
                                <MoneyAmount amount={outsourcing.planRateExVat} />
                                <span className="text-muted"> /ч</span>
                              </>
                            )}
                          </td>
                          <td className={`${valueCell} ${cellKindClassName.computed}`}>
                            <MoneyAmount amount={outsourcing.planAmountExVat} />
                          </td>
                          {editable ? <td className={valueCell} /> : null}
                        </tr>
                      </Fragment>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
      {addDepartment && editable ? (
        <AddPositionDialog
          departmentName={HR_DEPARTMENT_LABELS[addDepartment]}
          onClose={() => setAddDepartment(null)}
          onSubmit={(name) => {
            const rejection = opex.addHrPosition(addDepartment, name);
            if (rejection) {
              return HR_ERROR[rejection];
            }
            setAddDepartment(null);
            return null;
          }}
        />
      ) : null}
    </PageFrame>
  );
}

function AddPositionDialog({
  departmentName,
  onClose,
  onSubmit,
}: {
  departmentName: string;
  onClose: () => void;
  onSubmit: (name: string) => string | null;
}) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  return (
    <Dialog title={`Новая должность · ${departmentName}`} onClose={onClose}>
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          const message = onSubmit(name);
          if (message) {
            setError(message);
          }
        }}
      >
        <label className="flex flex-col gap-1 text-sm">
          <span>Название</span>
          <input
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError(null);
            }}
            className={fieldClassName}
            autoComplete="off"
          />
        </label>
        {error ? <p className="text-sm text-negative">{error}</p> : null}
        <div className="flex justify-end gap-2">
          <button type="button" className={primaryButtonClassName} onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className={primaryButtonClassName}>
            <IconPlus />
            Добавить
          </button>
        </div>
      </form>
    </Dialog>
  );
}
