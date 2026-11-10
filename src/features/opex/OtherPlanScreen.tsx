'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import type { OpexGroupCode } from '@/domain/document';
import { isPromotableOpexGroupCode, operatingExpenseOtherMonthView } from '@/domain/operating-expense';
import { monthKeyFromDate, salesPlanForMonth, salesPlanTotals } from '@/domain/sales-plan';
import { OpexMonthBar, resolveOpexMonth } from '@/features/opex/OpexMonthBar';
import { OtherGroupBlock } from '@/features/opex/OpexOtherGroupBlock';
import { OPEX_OTHER_PLAN_TITLE, opexGroupHref, opexOtherPlanHref } from '@/features/opex/paths';
import { OPEX_LINE_ERROR } from '@/features/opex/text';
import { useOpex } from '@/features/opex/use-opex';
import { useRole } from '@/features/roles/RoleProvider';
import { fieldClassName, primaryButtonClassName } from '@/features/sales/fields';
import { Dialog } from '@/features/shell/Dialog';
import { IconPlus } from '@/features/shell/Icons';
import { PageFrame } from '@/features/shell/PageFrame';
import {
  ColumnLabel,
  columnDividerClassName,
  columnHeadingClassName,
  MoneyAmount,
  nameHeadingClassName,
  tableClassName,
  tableFrameClassName,
  totalNameClassName,
  totalValueClassName,
} from '@/features/table';

const valueHead = `${columnHeadingClassName} ${columnDividerClassName}`;

export function OtherPlanScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveOpexMonth(month, today, currentMonth);
  const opex = useOpex();
  const { canEditSalesOpex } = useRole();
  const router = useRouter();
  const editable = opex.hydrated && canEditSalesOpex;
  const [addGroup, setAddGroup] = useState<OpexGroupCode | null>(null);

  const plan = salesPlanForMonth(opex.document, selectedMonth);
  const totals = plan ? salesPlanTotals(opex.document, plan) : null;
  const view = useMemo(
    () => operatingExpenseOtherMonthView(opex.document, selectedMonth, totals?.revenueWithVat ?? 0),
    [opex.document, selectedMonth, totals?.revenueWithVat],
  );

  return (
    <PageFrame
      title={OPEX_OTHER_PLAN_TITLE}
      full
      lede="План прочих статей без НДС. Строки из HR и транспорта и «Агентское соглашение» только смотрят. Названия правят в ячейке; новые расходы добавляют в категорию, ненужные — мягко удаляют. Категорию без строк HR и транспорта можно вынести в отдельный раздел: она пропадёт отсюда, нумерация остальных сдвинется, факт там станет подневным."
      intro={
        <OpexMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(opexOtherPlanHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      <div className={tableFrameClassName}>
        <table className={tableClassName}>
          <caption className="sr-only">{`Прочие операционные расходы, план за ${selectedMonth}`}</caption>
          <thead>
            <tr>
              <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                <ColumnLabel label="Наименование" />
              </th>
              <th scope="col" className={valueHead}>
                <ColumnLabel label="План" />
              </th>
            </tr>
          </thead>
          <tbody>
            {view.groups.map((group) => (
              <OtherGroupBlock
                key={group.code}
                group={group}
                side="plan"
                editable={editable}
                onRename={(lineId, name) => {
                  const rejection = opex.renameOpexOtherLine(lineId, name);
                  return rejection ? OPEX_LINE_ERROR[rejection] : null;
                }}
                onAmount={(lineId, amount) => {
                  const rejection = opex.setOpexLine(selectedMonth, lineId, 'plan', amount);
                  return rejection ? OPEX_LINE_ERROR[rejection] : null;
                }}
                onAdd={editable ? () => setAddGroup(group.code) : undefined}
                onPromote={
                  editable && isPromotableOpexGroupCode(group.code)
                    ? () => {
                        const rejection = opex.promoteOpexGroup(group.code);
                        if (rejection) {
                          window.alert(OPEX_LINE_ERROR[rejection]);
                          return;
                        }
                        router.push(opexGroupHref({ code: group.code, month: selectedMonth, currentMonth }));
                      }
                    : undefined
                }
                onDelete={
                  editable
                    ? (lineId, name) => {
                        const confirmed = window.confirm(`Удалить «${name}»? Расход пропадёт из рабочего списка.`);
                        if (confirmed) {
                          opex.deleteOpexOtherLine(lineId);
                        }
                      }
                    : undefined
                }
                onRestore={
                  editable
                    ? (lineId) => {
                        const rejection = opex.restoreOpexOtherLine(lineId);
                        return rejection ? OPEX_LINE_ERROR[rejection] : null;
                      }
                    : undefined
                }
              />
            ))}
            <tr>
              <th scope="row" className={`sticky left-0 z-10 ${totalNameClassName}`}>
                Всего
              </th>
              <td className={`${totalValueClassName} ${columnDividerClassName}`}>
                <MoneyAmount amount={view.totalPlanExVat} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {addGroup && editable ? (
        <AddOtherLineDialog
          groupName={view.groups.find((item) => item.code === addGroup)?.name ?? addGroup}
          onClose={() => setAddGroup(null)}
          onSubmit={(name) => {
            const rejection = opex.addOpexOtherLine(addGroup, name);
            if (rejection) {
              return OPEX_LINE_ERROR[rejection];
            }
            setAddGroup(null);
            return null;
          }}
        />
      ) : null}
    </PageFrame>
  );
}

function AddOtherLineDialog({
  groupName,
  onClose,
  onSubmit,
}: {
  groupName: string;
  onClose: () => void;
  onSubmit: (name: string) => string | null;
}) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  return (
    <Dialog title={`Новый расход · ${groupName}`} onClose={onClose}>
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
