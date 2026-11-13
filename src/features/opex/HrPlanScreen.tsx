'use client';

import { useRouter } from 'next/navigation';
import { Fragment, useMemo, useState } from 'react';

import type { HrDepartmentId, HrShopDepartmentId } from '@/domain/document';
import { HR_DEPARTMENT_LABELS, type HrDepartmentView, type HrOutsourcingRowView, hrMonthView } from '@/domain/hr';
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
  PercentCell,
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
  const outsourcingRows = useMemo(
    () => view.departments.flatMap((department) => (department.outsourcing ? [department.outsourcing] : [])),
    [view.departments],
  );

  return (
    <PageFrame
      title={OPEX_HR_PLAN_TITLE}
      full
      lede="Плановая численность и зарплата по должностям. Аутсорсинг — отдельной таблицей: часы, ставка без НДС, сумма и процент НДС по цехам (суммы с НДС — в ДДС). Ниже — ставки зарплатных налогов."
      intro={
        <OpexMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(opexHrPlanHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-2">
          <h2 className="px-1 text-sm font-medium">Должности</h2>
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
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="px-1 text-sm font-medium">Аутсорсинг</h2>
          <div className={tableFrameClassName}>
            <table className={tableClassName}>
              <caption className="sr-only">{`План аутсорсинга за ${selectedMonth}`}</caption>
              <thead>
                <tr>
                  <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                    <ColumnLabel label="Цех" />
                  </th>
                  <th scope="col" className={valueHead}>
                    <ColumnLabel label="План, часы" />
                  </th>
                  <th scope="col" className={valueHead}>
                    <ColumnLabel label="План, ставка" />
                  </th>
                  <th scope="col" className={valueHead}>
                    <ColumnLabel label="План, сумма" />
                  </th>
                  <th scope="col" className={valueHead}>
                    <ColumnLabel label="НДС" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {outsourcingRows.map((row) => (
                  <OutsourcingPlanRow
                    key={row.departmentId}
                    row={row}
                    editable={editable}
                    onChange={(departmentId, hoursThousandths, rateExVat, vatPercent) => {
                      const rejection = opex.setHrOutsourcingPlan(
                        selectedMonth,
                        departmentId,
                        hoursThousandths,
                        rateExVat,
                        vatPercent,
                      );
                      return rejection ? HR_ERROR[rejection] : null;
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <HrTaxRateBlock
          side="plan"
          taxes={view.taxes.filter((tax) => tax.id !== 'outsourcing-vat')}
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
  onDelete,
}: {
  department: HrDepartmentView;
  editable: boolean;
  onAdd?: () => void;
  onStaffPlan: (positionId: string, headcount: number, salaryExVat: number) => string | null;
  onDelete: (positionId: string, name: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const count = department.staff.length;

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
          <MoneyAmount amount={department.planPayrollExVat} />
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
    </Fragment>
  );
}

function OutsourcingPlanRow({
  row,
  editable,
  onChange,
}: {
  row: HrOutsourcingRowView;
  editable: boolean;
  onChange: (
    departmentId: HrShopDepartmentId,
    hoursThousandths: number,
    rateExVat: number,
    vatPercent: number,
  ) => string | null;
}) {
  return (
    <tr>
      <th scope="row" className={entityNameRowClassName('repeated')}>
        {row.departmentName}
      </th>
      <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
        {editable ? (
          <QuantityCell
            label={`План, часы, ${row.departmentName}`}
            value={row.planHoursThousandths}
            unit="ч"
            blankIfZero
            onChange={(next) => onChange(row.departmentId, next, row.planRateExVat, row.vatPercent)}
          />
        ) : (
          `${formatHours(row.planHoursThousandths)} ч`
        )}
      </td>
      <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
        {editable ? (
          <MoneyCell
            label={`Ставка аутсорсинга, ${row.departmentName}`}
            value={row.planRateExVat}
            parse={parseOpexMoney}
            invalidMessage={HR_ERROR.rate}
            onChange={(next) => onChange(row.departmentId, row.planHoursThousandths, next, row.vatPercent)}
          />
        ) : (
          <>
            <MoneyAmount amount={row.planRateExVat} />
            <span className="text-muted"> /ч</span>
          </>
        )}
      </td>
      <td className={`${valueCell} ${cellKindClassName.computed}`}>
        <MoneyAmount amount={row.planAmountExVat} />
      </td>
      <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
        {editable ? (
          <PercentCell
            label={`НДС, ${row.departmentName}`}
            value={row.vatPercent}
            invalidMessage={HR_ERROR.vat}
            onChange={(next) => onChange(row.departmentId, row.planHoursThousandths, row.planRateExVat, next)}
          />
        ) : (
          `${row.vatPercent} %`
        )}
      </td>
    </tr>
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
