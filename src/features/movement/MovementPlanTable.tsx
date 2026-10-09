'use client';

import { useState } from 'react';

import type {
  FinishedGoodsNormField,
  MovementPlanGroup,
  MovementPlanRow,
  MovementPlanTotals,
} from '@/domain/movement-plan';
import { formatPieces } from '@/features/sales/text';
import { IconChevronDown, IconChevronRight } from '@/features/shell/Icons';
import {
  ColumnLabel,
  editableCellClassName,
  IntegerCell,
  stickyHeadClassName,
  TableNumber,
  tableBorder,
  tableClassName,
  tableFrameClassName,
  tableFrameExpandedClassName,
} from '@/features/table';

type ColumnKey = 'stock' | 'min' | 'max' | 'belowMin' | 'aboveMax' | 'recommended';

const COLUMNS: { key: ColumnKey; label: string }[] = [
  { key: 'stock', label: 'Остаток на конец' },
  { key: 'min', label: 'Минимум' },
  { key: 'max', label: 'Максимум' },
  { key: 'belowMin', label: 'Ниже минимума' },
  { key: 'aboveMax', label: 'Выше максимума' },
  { key: 'recommended', label: 'Рекомендуемый объём' },
];

const EDITABLE_COLUMNS = new Set<ColumnKey>(['min', 'max']);

export function MovementPlanTable({
  groups,
  totals,
  editable,
  expanded = false,
  onNormAction,
}: {
  groups: MovementPlanGroup[];
  totals: MovementPlanTotals;
  editable: boolean;
  expanded?: boolean;
  onNormAction: (productId: string, field: FinishedGoodsNormField, value: number) => string | null;
}) {
  return (
    <div className={expanded ? tableFrameExpandedClassName : tableFrameClassName}>
      <table className={tableClassName}>
        <caption className="sr-only">Ввод плана: движение готовой продукции</caption>
        <thead className={stickyHeadClassName}>
          <tr>
            <th
              scope="col"
              className={`sticky left-0 z-40 w-px max-w-max whitespace-nowrap ${tableBorder.bottomThin} ${tableBorder.rightThick} bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-muted`}
            >
              Товар
            </th>
            {COLUMNS.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`w-px whitespace-normal ${tableBorder.bottomThin} ${tableBorder.rightThin} bg-paper px-1.5 py-2 text-center align-middle text-sm font-normal leading-5 text-muted last:border-r-0`}
              >
                <ColumnLabel label={column.label} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <CategoryBlock key={group.categoryId} group={group} editable={editable} onNormAction={onNormAction} />
          ))}
          <tr>
            <th
              scope="row"
              className="sticky left-0 z-10 w-px max-w-max whitespace-nowrap border-t-[1.5px] border-t-muted border-b border-b-line border-r-[1.5px] border-r-muted bg-paper px-3 py-2 text-left align-middle font-normal text-ink"
            >
              Всего
            </th>
            {COLUMNS.map((column) => (
              <td
                key={`total:${column.key}`}
                className={`w-px border-t-[1.5px] border-t-muted border-b border-b-line ${tableBorder.rightThin} bg-paper px-1.5 py-2 text-right align-middle last:border-r-0`}
              >
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
  onNormAction,
}: {
  group: MovementPlanGroup;
  editable: boolean;
  onNormAction: (productId: string, field: FinishedGoodsNormField, value: number) => string | null;
}) {
  const [open, setOpen] = useState(false);
  const productCount = group.rows.length;

  return (
    <>
      <tr>
        <th
          scope="row"
          className="sticky left-0 z-10 w-px max-w-max whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted bg-paper px-3 py-2 text-left align-middle font-normal text-ink"
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
            <span className="flex h-8 min-w-max flex-1 items-center text-sm font-semibold leading-none text-ink">
              {group.name} ({productCount})
            </span>
            {group.deleted ? <span className="text-sm text-muted">(архив)</span> : null}
          </div>
        </th>
        {COLUMNS.map((column) => (
          <td
            key={`group:${column.key}`}
            className={`w-px border-b border-b-line ${tableBorder.rightThin} bg-paper px-1.5 py-2 text-right align-middle last:border-r-0`}
          >
            <TotalsCell column={column.key} totals={group.totals} />
          </td>
        ))}
      </tr>
      {open
        ? group.rows.map((row) => (
            <ProductRow key={row.productId} row={row} editable={editable} onNormAction={onNormAction} />
          ))
        : null}
    </>
  );
}

function ProductRow({
  row,
  editable,
  onNormAction,
}: {
  row: MovementPlanRow;
  editable: boolean;
  onNormAction: (productId: string, field: FinishedGoodsNormField, value: number) => string | null;
}) {
  const canEdit = editable && !row.deleted;

  return (
    <tr>
      <th
        scope="row"
        className="sticky left-0 z-10 w-px max-w-max whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted bg-sheet px-3 py-2 pl-8 text-left align-middle font-normal"
      >
        <div className="flex flex-col gap-1">
          <span className="flex h-8 min-w-max flex-1 items-center text-sm leading-none text-ink">{row.name}</span>
          {row.deleted ? <span className="text-sm text-muted">(архив)</span> : null}
        </div>
      </th>
      {COLUMNS.map((column) => {
        const cellEditable = canEdit && EDITABLE_COLUMNS.has(column.key);
        return (
          <td
            key={`row:${column.key}`}
            className={`w-px border-b border-b-line ${tableBorder.rightThin} px-1.5 py-2 text-right align-middle last:border-r-0 ${
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
            <RowCell column={column.key} row={row} editable={canEdit} onNormAction={onNormAction} />
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
  onNormAction,
}: {
  column: ColumnKey;
  row: MovementPlanRow;
  editable: boolean;
  onNormAction: (productId: string, field: FinishedGoodsNormField, value: number) => string | null;
}) {
  switch (column) {
    case 'stock':
      return <IntegerCell value={row.stockPieces} unit="шт" signed />;
    case 'min':
      if (!editable) {
        return <TableNumber value={row.minPieces}>{formatPieces(row.minPieces)} шт</TableNumber>;
      }
      return (
        <IntegerCell
          label={`Минимум, ${row.name}`}
          value={row.minPieces}
          unit="шт"
          allowNegative
          invalidMessage="Укажите минимум целым числом штук."
          onChange={(next) => onNormAction(row.productId, 'minPieces', next)}
        />
      );
    case 'max':
      if (!editable) {
        return <TableNumber value={row.maxPieces}>{formatPieces(row.maxPieces)} шт</TableNumber>;
      }
      return (
        <IntegerCell
          label={`Максимум, ${row.name}`}
          value={row.maxPieces}
          unit="шт"
          allowNegative
          invalidMessage="Укажите максимум целым числом штук."
          onChange={(next) => onNormAction(row.productId, 'maxPieces', next)}
        />
      );
    case 'belowMin':
      return <IntegerCell value={row.belowMinPieces} unit="шт" signed />;
    case 'aboveMax':
      return <IntegerCell value={row.aboveMaxPieces} unit="шт" signed />;
    case 'recommended':
      return <TableNumber value={row.recommendedPieces}>{formatPieces(row.recommendedPieces)} шт</TableNumber>;
  }
}

function TotalsCell({ column, totals }: { column: ColumnKey; totals: MovementPlanTotals }) {
  switch (column) {
    case 'stock':
      return <IntegerCell value={totals.stockPieces} unit="шт" signed />;
    case 'min':
      return <TableNumber value={totals.minPieces}>{formatPieces(totals.minPieces)} шт</TableNumber>;
    case 'max':
      return <TableNumber value={totals.maxPieces}>{formatPieces(totals.maxPieces)} шт</TableNumber>;
    case 'belowMin':
      return <IntegerCell value={totals.belowMinPieces} unit="шт" signed />;
    case 'aboveMax':
      return <IntegerCell value={totals.aboveMaxPieces} unit="шт" signed />;
    case 'recommended':
      return <TableNumber value={totals.recommendedPieces}>{formatPieces(totals.recommendedPieces)} шт</TableNumber>;
  }
}

function editableFieldNear(target: EventTarget | null, cell: HTMLElement): HTMLInputElement | null {
  if (target instanceof HTMLInputElement) {
    return target;
  }
  return cell.querySelector('input');
}
