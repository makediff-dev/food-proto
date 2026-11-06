'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { isOpexGroupCode } from '@/domain/document';
import { operatingExpenseOtherGroupMonthView, opexGroupName } from '@/domain/operating-expense';
import { monthKeyFromDate, salesPlanForMonth, salesPlanTotals } from '@/domain/sales-plan';
import { OpexMonthBar, resolveOpexMonth } from '@/features/opex/OpexMonthBar';
import { OtherGroupBlock } from '@/features/opex/OpexOtherGroupBlock';
import {
  OPEX_OTHER_PLAN_HREF,
  OPEX_OTHER_PLAN_TITLE,
  opexGroupPlanHref,
  opexOtherPlanHref,
} from '@/features/opex/paths';
import { OPEX_LINE_ERROR } from '@/features/opex/text';
import { useOpex } from '@/features/opex/use-opex';
import { useRole } from '@/features/roles/RoleProvider';
import { fieldClassName, primaryButtonClassName } from '@/features/sales/fields';
import { Dialog } from '@/features/shell/Dialog';
import { IconPlus, IconUndo } from '@/features/shell/Icons';
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

export function OpexGroupPlanScreen({ code, month }: { code: string; month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveOpexMonth(month, today, currentMonth);
  const opex = useOpex();
  const { canEditSalesOpex } = useRole();
  const router = useRouter();
  const editable = opex.hydrated && canEditSalesOpex;
  const [adding, setAdding] = useState(false);
  const groupCode = isOpexGroupCode(code) ? code : null;
  const promoted = groupCode !== null && opex.document.opexPromotedGroupCodes.includes(groupCode);

  useEffect(() => {
    if (!opex.hydrated) {
      return;
    }
    if (!groupCode || !promoted) {
      router.replace(OPEX_OTHER_PLAN_HREF);
    }
  }, [opex.hydrated, groupCode, promoted, router]);

  const plan = salesPlanForMonth(opex.document, selectedMonth);
  const totals = plan ? salesPlanTotals(opex.document, plan) : null;
  const view = useMemo(() => {
    if (!groupCode || !promoted) {
      return null;
    }
    return operatingExpenseOtherGroupMonthView(opex.document, selectedMonth, groupCode, totals?.revenueWithVat ?? 0);
  }, [groupCode, promoted, opex.document, selectedMonth, totals?.revenueWithVat]);

  if (!groupCode || !promoted || !view) {
    return null;
  }

  const title = opexGroupName(groupCode);

  return (
    <PageFrame
      title={`${title} · ${OPEX_OTHER_PLAN_TITLE}`}
      full
      lede="План статей без НДС. Можно вернуть категорию в «Прочее»."
      intro={
        <div className="flex flex-wrap items-end gap-3">
          <OpexMonthBar
            month={selectedMonth}
            today={today}
            onOpen={(next) =>
              router.push(opexGroupPlanHref({ code: groupCode, month: next, currentMonth }), { scroll: false })
            }
          />
          {editable ? (
            <button
              type="button"
              className={primaryButtonClassName}
              onClick={() => {
                const rejection = opex.demoteOpexGroup(groupCode);
                if (rejection) {
                  window.alert(OPEX_LINE_ERROR[rejection]);
                  return;
                }
                router.push(opexOtherPlanHref({ month: selectedMonth, currentMonth }));
              }}
            >
              <IconUndo />
              Вернуть в Прочее
            </button>
          ) : null}
        </div>
      }
    >
      <div className={tableFrameClassName}>
        <table className={tableClassName}>
          <caption className="sr-only">{`${title}, план за ${selectedMonth}`}</caption>
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
            <OtherGroupBlock
              group={view}
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
              onAdd={editable ? () => setAdding(true) : undefined}
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
      {adding && editable ? (
        <AddLineDialog
          groupName={title}
          onClose={() => setAdding(false)}
          onSubmit={(name) => {
            const rejection = opex.addOpexOtherLine(groupCode, name);
            if (rejection) {
              return OPEX_LINE_ERROR[rejection];
            }
            setAdding(false);
            return null;
          }}
        />
      ) : null}
    </PageFrame>
  );
}

function AddLineDialog({
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
