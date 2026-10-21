'use client';

import { useState } from 'react';

import type {
  FinishedGoodsNormField,
  MovementPlanGroup,
  MovementPlanRow,
  MovementPlanTotals,
} from '@/domain/movement-plan';
import { NormDeviationCell } from '@/features/movement/NormDeviationCell';
import { formatPieces } from '@/features/sales/text';
import { IconChevronDown, IconChevronRight } from '@/features/shell/Icons';
import {
  blockCornerClassName,
  blockHeadingClassName,
  type CellKind,
  ColumnLabel,
  categoryBandClassName,
  categoryNameClassName,
  cellKindClassName,
  columnDividerClassName,
  columnHeadingClassName,
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

type ColumnKey = 'min' | 'max' | 'normDeviation' | 'recommended';

const COLUMNS: { key: ColumnKey; label: string }[] = [
  { key: 'min', label: 'Мин.' },
  { key: 'max', label: 'Макс.' },
  { key: 'normDeviation', label: 'Откл.' },
  { key: 'recommended', label: 'Реком. объём' },
];

const EDITABLE_COLUMNS = new Set<ColumnKey>(['min', 'max']);

const COLUMN_KIND: Record<ColumnKey, CellKind> = {
  min: 'assigned',
  max: 'assigned',
  normDeviation: 'computed',
  recommended: 'computed',
};

export function movementPlanNormRangeInvalid(minPieces: number, maxPieces: number): boolean {
  return minPieces > maxPieces;
}

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
            <th className={`sticky left-0 z-40 ${blockCornerClassName} ${tableBorder.rightThick}`} />
            <th colSpan={COLUMNS.length} scope="colgroup" className={blockHeadingClassName}>
              {keepWithNext('Плановые показатели')}
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
            <CategoryBlock key={group.categoryId} group={group} editable={editable} onNormAction={onNormAction} />
          ))}
          <tr>
            <th scope="row" className={`sticky left-0 z-10 ${totalNameClassName}`}>
              Всего
            </th>
            {COLUMNS.map((column) => (
              <td
                key={`total:${column.key}`}
                className={`${totalValueClassName} ${columnDividerClassName} ${cellKindClassName[COLUMN_KIND[column.key]]}`}
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
              onNormAction={onNormAction}
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
  onNormAction,
}: {
  row: MovementPlanRow;
  index: number;
  editable: boolean;
  onNormAction: (productId: string, field: FinishedGoodsNormField, value: number) => string | null;
}) {
  const canEdit = editable && !row.deleted;
  const normRangeInvalid = movementPlanNormRangeInvalid(row.minPieces, row.maxPieces);

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
        const cellEditable = canEdit && EDITABLE_COLUMNS.has(column.key);
        const normCellInvalid = normRangeInvalid && (column.key === 'min' || column.key === 'max');
        return (
          <td
            key={`row:${column.key}`}
            className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName} ${cellKindClassName[COLUMN_KIND[column.key]]} ${normCellInvalid ? 'bg-caution/15 ring-1 ring-inset ring-caution/50' : ''}`}
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
    case 'normDeviation':
      return <NormDeviationCell belowMinPieces={row.belowMinPieces} aboveMaxPieces={row.aboveMaxPieces} />;
    case 'recommended':
      return <TableNumber value={row.recommendedPieces}>{formatPieces(row.recommendedPieces)} шт</TableNumber>;
  }
}

function TotalsCell({ column, totals }: { column: ColumnKey; totals: MovementPlanTotals }) {
  switch (column) {
    case 'min':
      return <TableNumber value={totals.minPieces}>{formatPieces(totals.minPieces)} шт</TableNumber>;
    case 'max':
      return <TableNumber value={totals.maxPieces}>{formatPieces(totals.maxPieces)} шт</TableNumber>;
    case 'normDeviation':
      return <NormDeviationCell belowMinPieces={totals.belowMinPieces} aboveMaxPieces={totals.aboveMaxPieces} />;
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
