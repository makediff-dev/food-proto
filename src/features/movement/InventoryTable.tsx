'use client';

import { useState } from 'react';

import type { MovementPlanGroup, MovementPlanRow, MovementPlanTotals } from '@/domain/movement-plan';
import { formatPieces } from '@/features/sales/text';
import { IconChevronDown, IconChevronRight } from '@/features/shell/Icons';
import {
  blockCornerClassName,
  blockHeadingClassName,
  ColumnLabel,
  categoryBandClassName,
  categoryNameClassName,
  columnDividerClassName,
  columnHeadingClassName,
  editableCellClassName,
  IntegerCell,
  keepWithNext,
  nameHeadingClassName,
  ProductIndex,
  stickyHeadClassName,
  TableNumber,
  tableBorder,
  tableClassName,
  tableFrameClassName,
  tableFrameExpandedClassName,
  totalNameClassName,
  totalValueClassName,
} from '@/features/table';

type ColumnKey = 'bookOpening' | 'inventory' | 'openingDeviation';

const COLUMNS: { key: ColumnKey; label: string }[] = [
  { key: 'bookOpening', label: 'План' },
  { key: 'inventory', label: 'Факт' },
  { key: 'openingDeviation', label: 'Откл.' },
];

export function InventoryTable({
  groups,
  totals,
  editable,
  expanded = false,
  onOpeningAction,
}: {
  groups: MovementPlanGroup[];
  totals: MovementPlanTotals;
  editable: boolean;
  expanded?: boolean;
  onOpeningAction: (productId: string, pieces: number) => string | null;
}) {
  return (
    <div className={expanded ? tableFrameExpandedClassName : tableFrameClassName}>
      <table className={tableClassName}>
        <caption className="sr-only">Инвентаризация: остаток на начало</caption>
        <thead className={stickyHeadClassName}>
          <tr>
            <th className={`sticky left-0 z-40 ${blockCornerClassName} ${tableBorder.rightThick}`} />
            <th colSpan={COLUMNS.length} scope="colgroup" className={blockHeadingClassName}>
              {keepWithNext('Остаток на начало')}
            </th>
          </tr>
          <tr>
            <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
              Товар
            </th>
            {COLUMNS.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`${columnHeadingClassName} last:border-r-0 ${tableBorder.rightThin}`}
              >
                <ColumnLabel label={column.label} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <CategoryBlock key={group.categoryId} group={group} editable={editable} onOpeningAction={onOpeningAction} />
          ))}
          <tr>
            <th scope="row" className={`sticky left-0 z-10 ${totalNameClassName}`}>
              Всего
            </th>
            {COLUMNS.map((column) => (
              <td key={`total:${column.key}`} className={`${totalValueClassName} ${columnDividerClassName}`}>
                <TotalsCell column={column.key} totals={totals} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function CategoryBlock({
  group,
  editable,
  onOpeningAction,
}: {
  group: MovementPlanGroup;
  editable: boolean;
  onOpeningAction: (productId: string, pieces: number) => string | null;
}) {
  const [open, setOpen] = useState(true);
  const productCount = group.rows.length;

  return (
    <>
      <tr>
        <th
          scope="row"
          className={`sticky left-0 z-10 w-px max-w-max whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted px-3 py-2 text-left align-middle font-normal text-ink ${categoryBandClassName}`}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-expanded={open}
              aria-label={
                open ? `Свернуть товары категории ${group.name}` : `Развернуть товары категории ${group.name}`
              }
              title={open ? 'Свернуть' : 'Развернуть'}
              onClick={() => setOpen((current) => !current)}
              className="inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {open ? <IconChevronDown /> : <IconChevronRight />}
            </button>
            <span className={categoryNameClassName}>
              {group.name} ({productCount})
            </span>
            {group.deleted ? <span className="text-sm text-muted">(архив)</span> : null}
          </div>
        </th>
        {COLUMNS.map((column) => (
          <td
            key={`group:${column.key}`}
            className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${categoryBandClassName} ${columnDividerClassName}`}
          >
            <TotalsCell column={column.key} totals={group.totals} />
          </td>
        ))}
      </tr>
      {open
        ? group.rows.map((row, index) => (
            <ProductRow
              key={row.productId}
              row={row}
              index={index + 1}
              editable={editable}
              onOpeningAction={onOpeningAction}
            />
          ))
        : null}
    </>
  );
}

function ProductRow({
  row,
  index,
  editable,
  onOpeningAction,
}: {
  row: MovementPlanRow;
  index: number;
  editable: boolean;
  onOpeningAction: (productId: string, pieces: number) => string | null;
}) {
  const canEdit = editable && !row.deleted;

  return (
    <tr>
      <th
        scope="row"
        className="sticky left-0 z-10 w-px max-w-max whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted bg-sheet px-3 py-2 text-left align-middle font-normal"
      >
        <div className="flex items-center gap-2">
          <ProductIndex index={index} />
          <span className="flex h-8 min-w-max items-center text-sm leading-none text-ink">{row.name}</span>
          {row.deleted ? <span className="text-sm text-muted">(архив)</span> : null}
        </div>
      </th>
      {COLUMNS.map((column) => {
        const cellEditable = canEdit && column.key === 'inventory';
        return (
          <td
            key={`row:${column.key}`}
            className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName} ${
              cellEditable ? editableCellClassName : ''
            }`}
            onClick={(event) => {
              if (!cellEditable) {
                return;
              }
              if (event.target instanceof HTMLInputElement) {
                return;
              }
              const field = editableFieldNear(event.target, event.currentTarget);
              if (field instanceof HTMLInputElement && document.activeElement !== field) {
                field.focus();
              }
            }}
            onKeyDown={(event) => {
              if (!cellEditable) {
                return;
              }
              if (event.key !== 'Enter' && event.key !== ' ') {
                return;
              }
              if (event.target instanceof HTMLInputElement) {
                return;
              }
              const field = editableFieldNear(event.target, event.currentTarget);
              if (field instanceof HTMLInputElement) {
                field.focus();
              }
            }}
          >
            <RowCell column={column.key} row={row} editable={canEdit} onOpeningAction={onOpeningAction} />
          </td>
        );
      })}
    </tr>
  );
}

function RowCell({
  column,
  row,
  editable,
  onOpeningAction,
}: {
  column: ColumnKey;
  row: MovementPlanRow;
  editable: boolean;
  onOpeningAction: (productId: string, pieces: number) => string | null;
}) {
  switch (column) {
    case 'bookOpening':
      return <TableNumber value={row.bookOpeningPieces}>{formatPieces(row.bookOpeningPieces)} шт</TableNumber>;
    case 'inventory':
      if (!editable) {
        return <TableNumber value={row.openingPieces}>{formatPieces(row.openingPieces)} шт</TableNumber>;
      }
      return (
        <IntegerCell
          label={`Остаток на начало (факт), ${row.name}`}
          value={row.openingPieces}
          unit="шт"
          allowNegative
          invalidMessage="Укажите остаток на начало (факт) целым числом штук."
          onChange={(next) => onOpeningAction(row.productId, next)}
        />
      );
    case 'openingDeviation':
      return <IntegerCell value={row.openingDeviationPieces} unit="шт" signed />;
  }
}

function TotalsCell({ column, totals }: { column: ColumnKey; totals: MovementPlanTotals }) {
  switch (column) {
    case 'bookOpening':
      return <TableNumber value={totals.bookOpeningPieces}>{formatPieces(totals.bookOpeningPieces)} шт</TableNumber>;
    case 'inventory':
      return <TableNumber value={totals.openingPieces}>{formatPieces(totals.openingPieces)} шт</TableNumber>;
    case 'openingDeviation':
      return <IntegerCell value={totals.openingDeviationPieces} unit="шт" signed />;
  }
}

function editableFieldNear(target: EventTarget | null, cell: HTMLElement): HTMLInputElement | null {
  if (target instanceof HTMLInputElement) {
    return target;
  }
  return cell.querySelector('input');
}
