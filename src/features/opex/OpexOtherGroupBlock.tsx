'use client';

import { Fragment, useState } from 'react';

import type { OpexOtherGroupView } from '@/domain/operating-expense';
import { AGENCY_LINE_HINT, OPEX_LINE_ERROR, parseOpexMoney } from '@/features/opex/text';
import { FIELD_ERROR } from '@/features/sales/fields';
import { IconChevronDown, IconChevronRight, IconPanelOut, IconPlus, IconTrash, IconUndo } from '@/features/shell/Icons';
import {
  categoryBandClassName,
  categoryNameClassName,
  categoryNameRowClassName,
  cellKindClassName,
  columnDividerClassName,
  entityNameRowClassName,
  GridText,
  HintedText,
  MoneyAmount,
  MoneyCell,
  PercentCell,
} from '@/features/table';

const valueCell = `border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`;

export function OtherGroupBlock({
  group,
  side,
  editable,
  onRename,
  onAmount,
  onVat,
  onAdd,
  onDelete,
  onRestore,
  onPromote,
}: {
  group: OpexOtherGroupView;
  side: 'plan' | 'fact';
  editable: boolean;
  onRename?: (lineId: string, name: string) => string | null;
  onAmount: (lineId: string, amount: number) => string | null;
  /** Колонка ставки НДС — только на вводе плана прочих статей. */
  onVat?: (lineId: string, vatPercent: number) => string | null;
  onAdd?: () => void;
  onDelete?: (lineId: string, name: string) => void;
  onRestore?: (lineId: string) => string | null;
  /** Вынести группу в отдельный раздел меню (только на «Прочее · план»). */
  onPromote?: () => void;
}) {
  const [open, setOpen] = useState(true);
  const count = group.lines.length;
  const total = side === 'plan' ? group.totalPlanExVat : group.totalFactExVat;
  const renameEnabled = Boolean(editable && onRename);
  const showVat = Boolean(onVat);

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
              {group.displayCode ? <span className="text-muted">{group.displayCode}</span> : null}
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
            {onPromote ? (
              <button
                type="button"
                aria-label={`В отдельный раздел: ${group.name}`}
                title="В отдельный раздел"
                onClick={onPromote}
                className="inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <IconPanelOut />
              </button>
            ) : null}
          </div>
        </th>
        {showVat ? <td className={`${valueCell} ${categoryBandClassName}`} /> : null}
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
            const vatEditable = Boolean(showVat && editable && row.vatEditable && onVat);
            const vatKind = vatEditable ? 'assigned' : 'computed';
            return (
              <tr key={row.id}>
                <th
                  scope="row"
                  className={`${entityNameRowClassName(nameKind)}${row.kind === 'agency' ? ' hover:z-40' : ''}`}
                >
                  <div className="flex w-full items-center gap-2">
                    {row.code ? <span className="text-muted">{row.code}</span> : null}
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
                          {row.kind === 'agency' ? <HintedText text={row.name} hint={AGENCY_LINE_HINT} /> : row.name}
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
                {showVat ? (
                  <td className={`${valueCell} ${cellKindClassName[vatKind]}`}>
                    <PercentCell
                      label={`НДС, ${row.name}`}
                      value={row.vatPercent}
                      invalidMessage={OPEX_LINE_ERROR.vat}
                      onChange={vatEditable && onVat ? (next) => onVat(row.id, next) : undefined}
                    />
                  </td>
                ) : null}
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
