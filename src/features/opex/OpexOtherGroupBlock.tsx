'use client';

import { Fragment, useState } from 'react';

import type { OpexOtherGroupView } from '@/domain/operating-expense';
import { OPEX_LINE_ERROR, parseOpexMoney } from '@/features/opex/text';
import { FIELD_ERROR } from '@/features/sales/fields';
import { IconChevronDown, IconChevronRight, IconPlus, IconTrash, IconUndo } from '@/features/shell/Icons';
import {
  categoryBandClassName,
  categoryNameClassName,
  categoryNameRowClassName,
  cellKindClassName,
  columnDividerClassName,
  entityNameRowClassName,
  GridText,
  MoneyAmount,
  MoneyCell,
} from '@/features/table';

const valueCell = `border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`;

export function OtherGroupBlock({
  group,
  side,
  editable,
  onRename,
  onAmount,
  onAdd,
  onDelete,
  onRestore,
}: {
  group: OpexOtherGroupView;
  side: 'plan' | 'fact';
  editable: boolean;
  onRename?: (lineId: string, name: string) => string | null;
  onAmount: (lineId: string, amount: number) => string | null;
  onAdd?: () => void;
  onDelete?: (lineId: string, name: string) => void;
  onRestore?: (lineId: string) => string | null;
}) {
  const [open, setOpen] = useState(true);
  const count = group.lines.length;
  const total = side === 'plan' ? group.totalPlanExVat : group.totalFactExVat;
  const renameEnabled = Boolean(editable && onRename);

  return (
    <Fragment>
      <tr>
        <th scope="row" className={categoryNameRowClassName(false)}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-expanded={open}
              aria-label={open ? `Свернуть ${group.name}` : `Развернуть ${group.name}`}
              title={open ? 'Свернуть' : 'Развернуть'}
              onClick={() => setOpen((current) => !current)}
              className="inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {open ? <IconChevronDown /> : <IconChevronRight />}
            </button>
            <span className={`${categoryNameClassName} gap-1`}>
              <span className="text-muted">{group.code}</span>
              <span>
                {group.name} ({count})
              </span>
            </span>
            {onAdd ? (
              <button
                type="button"
                aria-label={`Добавить расход в ${group.name}`}
                title="Добавить расход"
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
        <td className={`${valueCell} ${categoryBandClassName}`}>
          <MoneyAmount amount={total} />
        </td>
      </tr>
      {open
        ? group.lines.map((row) => {
            const amountEditable = editable && (side === 'plan' ? row.planEditable : row.factEditable);
            const amount = side === 'plan' ? row.planExVat : row.factExVat;
            const isDerived = row.kind === 'derived';
            const isFixedLine = isDerived || row.kind === 'agency';
            const canRename = renameEnabled && !row.deleted && !isFixedLine && onRename;
            const nameKind = canRename ? 'assigned' : isFixedLine ? 'computed' : 'repeated';
            const amountKind = amountEditable ? 'assigned' : 'computed';
            return (
              <tr key={row.id}>
                <th scope="row" className={entityNameRowClassName(nameKind)}>
                  <div className="flex w-full items-center gap-2">
                    <span className="text-muted">{row.code}</span>
                    <span className="min-w-0 flex-1">
                      {canRename ? (
                        <GridText
                          label={`Название, ${row.name}`}
                          value={row.name}
                          invalidMessage={FIELD_ERROR.empty}
                          onCommit={(next) => onRename(row.id, next)}
                        />
                      ) : (
                        <span className="text-sm leading-8 text-ink">
                          {row.name}
                          {row.deleted ? <span className="text-muted"> (архив)</span> : null}
                        </span>
                      )}
                    </span>
                    {editable && !row.deleted && !isFixedLine && onDelete ? (
                      <button
                        type="button"
                        aria-label={`Удалить ${row.name}`}
                        title="Удалить"
                        onClick={() => onDelete(row.id, row.name)}
                        className="inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                      >
                        <IconTrash />
                      </button>
                    ) : null}
                    {editable && row.deleted && onRestore ? (
                      <button
                        type="button"
                        aria-label={`Вернуть ${row.name}`}
                        title="Вернуть"
                        onClick={() => {
                          const message = onRestore(row.id);
                          if (message) {
                            window.alert(message);
                          }
                        }}
                        className="inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                      >
                        <IconUndo />
                      </button>
                    ) : null}
                  </div>
                </th>
                <td className={`${valueCell} ${cellKindClassName[amountKind]}`}>
                  {amountEditable ? (
                    <MoneyCell
                      label={`${side === 'plan' ? 'План' : 'Факт'}, ${row.name}`}
                      value={amount}
                      parse={parseOpexMoney}
                      invalidMessage={OPEX_LINE_ERROR.amount}
                      onChange={(next) => onAmount(row.id, next)}
                    />
                  ) : (
                    <MoneyAmount amount={amount} />
                  )}
                </td>
              </tr>
            );
          })
        : null}
    </Fragment>
  );
}
