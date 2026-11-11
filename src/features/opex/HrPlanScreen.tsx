'use client';

import { useRouter } from 'next/navigation';
import { Fragment, useMemo, useState } from 'react';

import type { HrDepartmentId, HrShopDepartmentId } from '@/domain/document';
import { HR_DEPARTMENT_LABELS, type HrDepartmentView, hrMonthView } from '@/domain/hr';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { QuantityCell } from '@/features/materials/QuantityCell';
import { HrTaxRateBlock } from '@/features/opex/HrTaxRateBlock';
import { OpexMonthBar, resolveOpexMonth } from '@/features/opex/OpexMonthBar';
import { OPEX_HR_PLAN_TITLE, opexHrPlanHref } from '@/features/opex/paths';
import { formatHours, HR_ERROR, parseOpexMoney } from '@/features/opex/text';
import { useOpex } from '@/features/opex/use-opex';
import { useRole } from '@/features/roles/RoleProvider';
import { fieldClassName, primaryButtonClassName } from '@/features/sales/fields';
import { Dialog } from '@/features/shell/Dialog';
import { IconChevronDown, IconChevronRight, IconPlus, IconTrash } from '@/features/shell/Icons';
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
      lede="Плановая численность и зарплата по должностям. У цехов и РЦ — часы и ставка аутсорсинга на месяц. Ниже — ставки зарплатных налогов и НДС аутсорса."
      intro={
        <OpexMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(opexHrPlanHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      <div className="flex flex-col gap-6">
        <div className={tableFrameClassName}>
          <table className={tableClassName}>
            <caption className="sr-only">{`План HR за ${selectedMonth}`}</caption>
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
              </tr>
            </thead>
            <tbody>
              {view.departments.map((department) => (
                <DepartmentBlock
                  key={department.departmentId}
                  department={department}
                  editable={editable}
                  onAdd={
                    editable
                      ? () => {
                          setAddDepartment(department.departmentId);
                        }
                      : undefined
                  }
                  onStaffPlan={(positionId, headcount, salaryExVat) => {
                    const rejection = opex.setHrStaffPlan(selectedMonth, positionId, headcount, salaryExVat);
                    return rejection ? HR_ERROR[rejection] : null;
                  }}
                  onOutsourcingPlan={(departmentId, hoursThousandths, rateExVat) => {
                    const rejection = opex.setHrOutsourcingPlan(
                      selectedMonth,
                      departmentId,
                      hoursThousandths,
                      rateExVat,
                    );
                    return rejection ? HR_ERROR[rejection] : null;
                  }}
                  onDelete={(positionId, name) => {
                    const confirmed = window.confirm(`Удалить «${name}»? Должность пропадёт из рабочего списка.`);
                    if (confirmed) {
                      opex.deleteHrPosition(positionId);
                    }
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
        <HrTaxRateBlock
          side="plan"
          taxes={view.taxes}
          editable={editable}
          onRate={(field, rateHundredths) => {
            const rejection = opex.setHrTaxRate(selectedMonth, field, rateHundredths);
            return rejection ? HR_ERROR[rejection] : null;
          }}
        />
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

function DepartmentBlock({
  department,
  editable,
  onAdd,
  onStaffPlan,
  onOutsourcingPlan,
  onDelete,
}: {
  department: HrDepartmentView;
  editable: boolean;
  onAdd?: () => void;
  onStaffPlan: (positionId: string, headcount: number, salaryExVat: number) => string | null;
  onOutsourcingPlan: (departmentId: HrShopDepartmentId, hoursThousandths: number, rateExVat: number) => string | null;
  onDelete: (positionId: string, name: string) => void;
}) {
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
            {onAdd ? (
              <button
                type="button"
                aria-label={`Добавить должность в ${department.name}`}
                title="Добавить должность"
                onClick={() => {
                  setOpen(true);
                  onAdd();
                }}
                className="inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <IconPlus />
              </button>
            ) : null}
          </div>
        </th>
        <td className={`${valueCell} ${categoryBandClassName}`}>{department.plan.headcount}</td>
        <td className={`${valueCell} ${categoryBandClassName}`}>
          <MoneyAmount amount={department.plan.salaryExVat} />
        </td>
        <td className={`${valueCell} ${categoryBandClassName}`}>
          <MoneyAmount amount={department.plan.fotExVat} />
        </td>
      </tr>
      {open
        ? department.staff.map((row) => (
            <tr key={row.positionId}>
              <th scope="row" className={entityNameRowClassName('repeated')}>
                <div className="flex w-full items-center gap-2">
                  <span className="min-w-0 flex-1">
                    {row.name}
                    {row.deleted ? ' (архив)' : ''}
                  </span>
                  {editable && !row.deleted ? (
                    <button
                      type="button"
                      aria-label={`Удалить ${row.name}`}
                      title="Удалить"
                      className={`${deleteIconButtonClassName} shrink-0`}
                      onClick={() => onDelete(row.positionId, row.name)}
                    >
                      <IconTrash />
                    </button>
                  ) : null}
                </div>
              </th>
              <td className={`${valueCell} ${cellKindClassName[editable && !row.deleted ? 'assigned' : 'computed']}`}>
                {editable && !row.deleted ? (
                  <IntegerCell
                    label={`План, чел, ${row.name}`}
                    value={row.plan.headcount}
                    onChange={(next) => onStaffPlan(row.positionId, next, row.plan.salaryExVat)}
                  />
                ) : (
                  row.plan.headcount
                )}
              </td>
              <td className={`${valueCell} ${cellKindClassName[editable && !row.deleted ? 'assigned' : 'computed']}`}>
                {editable && !row.deleted ? (
                  <MoneyCell
                    label={`План, зарплата, ${row.name}`}
                    value={row.plan.salaryExVat}
                    parse={parseOpexMoney}
                    invalidMessage={HR_ERROR.salary}
                    onChange={(next) => onStaffPlan(row.positionId, row.plan.headcount, next)}
                  />
                ) : (
                  <MoneyAmount amount={row.plan.salaryExVat} />
                )}
              </td>
              <td className={`${valueCell} ${cellKindClassName.computed}`}>
                <MoneyAmount amount={row.plan.fotExVat} />
              </td>
            </tr>
          ))
        : null}
      {open && outsourcing ? (
        <tr>
          <th scope="row" className={entityNameRowClassName('repeated')}>
            {outsourcing.name}
          </th>
          <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
            {editable ? (
              <QuantityCell
                label={`План, часы, ${department.name}`}
                value={outsourcing.planHoursThousandths}
                unit="ч"
                blankIfZero
                onChange={(next) => onOutsourcingPlan(outsourcing.departmentId, next, outsourcing.planRateExVat)}
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
                onChange={(next) => onOutsourcingPlan(outsourcing.departmentId, outsourcing.planHoursThousandths, next)}
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
        </tr>
      ) : null}
    </Fragment>
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
