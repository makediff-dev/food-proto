'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { creditResourcesMonthView } from '@/domain/credit-resources';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { CreditMonthBar, resolveCreditMonth } from '@/features/credit-resources/CreditMonthBar';
import { CREDIT_RESOURCES_PLAN_TITLE, creditResourcesPlanHref } from '@/features/credit-resources/paths';
import { CREDIT_ERROR } from '@/features/credit-resources/text';
import { useCreditResources } from '@/features/credit-resources/use-credit-resources';
import { useRole } from '@/features/roles/RoleProvider';
import { FIELD_ERROR, fieldClassName, primaryButtonClassName } from '@/features/sales/fields';
import { Dialog } from '@/features/shell/Dialog';
import { IconPlus, IconTrash, IconUndo } from '@/features/shell/Icons';
import { PageFrame } from '@/features/shell/PageFrame';
import {
  ColumnLabel,
  cellKindClassName,
  columnDividerClassName,
  columnHeadingClassName,
  entityNameRowClassName,
  GridText,
  HundredthsCell,
  MoneyCell,
  nameHeadingClassName,
  stickyHeadClassName,
  tableBorder,
  tableClassName,
  tableFrameClassName,
} from '@/features/table';

const valueHead = `${columnHeadingClassName} ${columnDividerClassName}`;
const valueCell = `w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`;
const groupEnd = `${columnHeadingClassName} ${tableBorder.rightThick}`;
const valueEnd = `w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${tableBorder.rightThick}`;

function inputKind(editable: boolean): 'assigned' | 'computed' {
  return editable ? 'assigned' : 'computed';
}

export function CreditResourcesPlanScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveCreditMonth(month, today, currentMonth);
  const credit = useCreditResources();
  const { canEditCreditAndCashflow } = useRole();
  const router = useRouter();
  const editable = credit.hydrated && canEditCreditAndCashflow;
  const [addOpen, setAddOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addError, setAddError] = useState<string | null>(null);

  const view = useMemo(
    () => creditResourcesMonthView(credit.document, selectedMonth),
    [credit.document, selectedMonth],
  );

  return (
    <PageFrame
      title={CREDIT_RESOURCES_PLAN_TITLE}
      full
      lede="Справочник кредиторов и план месяца: стартовая сумма, ставка, получение, погашение тела и процентные платежи."
      intro={
        <CreditMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(creditResourcesPlanHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      {editable ? (
        <div className="mb-3">
          <button
            type="button"
            className={primaryButtonClassName}
            onClick={() => {
              setAddName('');
              setAddError(null);
              setAddOpen(true);
            }}
          >
            <IconPlus />
            Добавить кредитора
          </button>
        </div>
      ) : null}

      <div className={tableFrameClassName}>
        <table className={tableClassName}>
          <caption className="sr-only">{`План кредитных ресурсов за ${selectedMonth}`}</caption>
          <thead className={stickyHeadClassName}>
            <tr>
              <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                <ColumnLabel label="Наименование" />
              </th>
              <th scope="col" className={valueHead}>
                <ColumnLabel label="Сумма кредита" />
              </th>
              <th scope="col" className={groupEnd}>
                <ColumnLabel label="Ставка, %" />
              </th>
              <th scope="col" className={valueHead}>
                <ColumnLabel label="Получение, план" />
              </th>
              <th scope="col" className={valueHead}>
                <ColumnLabel label="Погашение, план" />
              </th>
              <th scope="col" className={groupEnd}>
                <ColumnLabel label="Проценты, план" />
              </th>
              {editable ? <th scope="col" className={columnHeadingClassName} /> : null}
            </tr>
          </thead>
          <tbody>
            {view.rows.length === 0 ? (
              <tr>
                <td colSpan={editable ? 7 : 6} className="border-b border-b-line px-3 py-6 text-sm text-muted">
                  Кредиторов пока нет. Нажмите «Добавить кредитора».
                </td>
              </tr>
            ) : null}
            {view.rows.map((row) => {
              const rowEditable = editable && !row.deleted;
              return (
                <tr key={row.creditorId}>
                  <th scope="row" className={entityNameRowClassName(rowEditable ? 'assigned' : 'repeated')}>
                    <div className="flex w-full items-center gap-2">
                      {rowEditable ? (
                        <GridText
                          label={`Название, ${row.name}`}
                          value={row.name}
                          invalidMessage={FIELD_ERROR.empty}
                          onCommit={(name) => {
                            const rejection = credit.renameCreditor(row.creditorId, name);
                            return rejection ? CREDIT_ERROR[rejection] : null;
                          }}
                        />
                      ) : (
                        <span>
                          {row.name}
                          {row.deleted ? ' (архив)' : ''}
                        </span>
                      )}
                    </div>
                  </th>
                  <td className={`${valueCell} ${cellKindClassName[inputKind(rowEditable)]}`}>
                    <MoneyCell
                      label={`Сумма кредита, ${row.name}`}
                      value={row.initialPrincipal}
                      onChange={
                        rowEditable
                          ? (amount) => {
                              const rejection = credit.setInitialPrincipal(row.creditorId, amount);
                              return rejection ? CREDIT_ERROR[rejection] : null;
                            }
                          : undefined
                      }
                    />
                  </td>
                  <td className={`${valueEnd} ${cellKindClassName[inputKind(rowEditable)]}`}>
                    <HundredthsCell
                      label={`Ставка, ${row.name}`}
                      value={row.interestRateHundredths}
                      invalidMessage={CREDIT_ERROR.rate}
                      onChange={
                        rowEditable
                          ? (rate) => {
                              const rejection = credit.setInterestRate(row.creditorId, rate);
                              return rejection ? CREDIT_ERROR[rejection] : null;
                            }
                          : undefined
                      }
                    />
                  </td>
                  <td className={`${valueCell} ${cellKindClassName[inputKind(rowEditable)]}`}>
                    <MoneyCell
                      label={`Получение, план, ${row.name}`}
                      value={row.planReceived}
                      onChange={
                        rowEditable
                          ? (amount) => {
                              const rejection = credit.setMonthField(
                                selectedMonth,
                                row.creditorId,
                                'planReceived',
                                amount,
                              );
                              return rejection ? CREDIT_ERROR[rejection] : null;
                            }
                          : undefined
                      }
                    />
                  </td>
                  <td className={`${valueCell} ${cellKindClassName[inputKind(rowEditable)]}`}>
                    <MoneyCell
                      label={`Погашение, план, ${row.name}`}
                      value={row.planRepaid}
                      onChange={
                        rowEditable
                          ? (amount) => {
                              const rejection = credit.setMonthField(
                                selectedMonth,
                                row.creditorId,
                                'planRepaid',
                                amount,
                              );
                              return rejection ? CREDIT_ERROR[rejection] : null;
                            }
                          : undefined
                      }
                    />
                  </td>
                  <td className={`${valueEnd} ${cellKindClassName[inputKind(rowEditable)]}`}>
                    <MoneyCell
                      label={`Проценты, план, ${row.name}`}
                      value={row.planInterest}
                      onChange={
                        rowEditable
                          ? (amount) => {
                              const rejection = credit.setMonthField(
                                selectedMonth,
                                row.creditorId,
                                'planInterest',
                                amount,
                              );
                              return rejection ? CREDIT_ERROR[rejection] : null;
                            }
                          : undefined
                      }
                    />
                  </td>
                  {editable ? (
                    <td className="border-b border-b-line px-1.5 py-2 align-middle">
                      {row.deleted ? (
                        <button
                          type="button"
                          aria-label={`Вернуть ${row.name}`}
                          title="Вернуть"
                          className="inline-flex size-8 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                          onClick={() => {
                            const rejection = credit.restoreCreditor(row.creditorId);
                            if (rejection) {
                              window.alert(CREDIT_ERROR[rejection]);
                            }
                          }}
                        >
                          <IconUndo />
                        </button>
                      ) : (
                        <button
                          type="button"
                          aria-label={`Удалить ${row.name}`}
                          title="Удалить"
                          className="inline-flex size-8 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                          onClick={() => {
                            const confirmed = window.confirm(
                              `Удалить «${row.name}»? Кредитор пропадёт из рабочего списка.`,
                            );
                            if (confirmed) {
                              credit.deleteCreditor(row.creditorId);
                            }
                          }}
                        >
                          <IconTrash />
                        </button>
                      )}
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {addOpen ? (
        <Dialog title="Новый кредитор" onClose={() => setAddOpen(false)}>
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              const rejection = credit.addCreditor(addName);
              if (rejection) {
                setAddError(CREDIT_ERROR[rejection]);
                return;
              }
              setAddOpen(false);
            }}
          >
            <label className="flex flex-col gap-1 text-sm">
              <span>Наименование</span>
              <input
                type="text"
                value={addName}
                onChange={(event) => {
                  setAddName(event.target.value);
                  setAddError(null);
                }}
                className={fieldClassName}
                autoComplete="off"
              />
            </label>
            {addError ? <p className="text-sm text-negative">{addError}</p> : null}
            <div className="flex justify-end gap-2">
              <button type="button" className={primaryButtonClassName} onClick={() => setAddOpen(false)}>
                Отмена
              </button>
              <button type="submit" className={primaryButtonClassName}>
                <IconPlus />
                Добавить
              </button>
            </div>
          </form>
        </Dialog>
      ) : null}
    </PageFrame>
  );
}
