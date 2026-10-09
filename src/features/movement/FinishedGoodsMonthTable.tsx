'use client';

import { useState } from 'react';

import type { FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals } from '@/domain/finished-goods';
import { formatPieces } from '@/features/sales/text';
import { IconChevronDown, IconChevronRight } from '@/features/shell/Icons';
import {
  ColumnLabel,
  editableCellClassName,
  IntegerCell,
  keepWithNext,
  Muted,
  stickyHeadClassName,
  TableNumber,
  tableBorder,
  tableClassName,
  tableFrameClassName,
  tableFrameExpandedClassName,
  VatMoneyCell,
} from '@/features/table';

type ColumnKey =
  | 'opening'
  | 'planPrice'
  | 'openingValue'
  | 'salesPieces'
  | 'salesRevenue'
  | 'productionPieces'
  | 'productionValue'
  | 'closing'
  | 'factPrice'
  | 'closingValue';

const COLUMNS: { key: ColumnKey; label: string }[] = [
  { key: 'opening', label: 'Остаток на начало' },
  { key: 'planPrice', label: 'Цена план' },
  { key: 'openingValue', label: 'Стоимость остатка на начало' },
  { key: 'salesPieces', label: 'Объём продаж' },
  { key: 'salesRevenue', label: 'Стоимость продаж' },
  { key: 'productionPieces', label: 'Объём произв-ва' },
  { key: 'productionValue', label: 'Стоимость произв-ва' },
  { key: 'closing', label: 'Остаток на конец' },
  { key: 'factPrice', label: 'Цена факт' },
  { key: 'closingValue', label: 'Стоимость остатка на конец' },
];

export function FinishedGoodsMonthTable({
  groups,
  totals,
  editable,
  expanded = false,
  onOpeningAction,
}: {
  groups: FinishedGoodsGroup[];
  totals: FinishedGoodsTotals;
  editable: boolean;
  expanded?: boolean;
  onOpeningAction: (productId: string, pieces: number) => string | null;
}) {
  return (
    <div className={expanded ? tableFrameExpandedClassName : tableFrameClassName}>
      <table className={tableClassName}>
        <caption className="sr-only">Отчет общий: движение готовой продукции за месяц</caption>
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
            <CategoryBlock key={group.categoryId} group={group} editable={editable} onOpeningAction={onOpeningAction} />
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
  onOpeningAction,
}: {
  group: FinishedGoodsGroup;
  editable: boolean;
  onOpeningAction: (productId: string, pieces: number) => string | null;
}) {
  const [open, setOpen] = useState(false);
  const productCount = group.rows.length;

  return (
    <>
      <tr>
        <th
          scope="row"
          className={`sticky left-0 z-10 w-px max-w-max whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted bg-paper px-3 py-2 text-left align-middle font-normal text-ink`}
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
            <ProductRow key={row.productId} row={row} editable={editable} onOpeningAction={onOpeningAction} />
          ))
        : null}
    </>
  );
}

function ProductRow({
  row,
  editable,
  onOpeningAction,
}: {
  row: FinishedGoodsRow;
  editable: boolean;
  onOpeningAction: (productId: string, pieces: number) => string | null;
}) {
  const canEditOpening = editable && !row.deleted;

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
        const canEdit = canEditOpening && column.key === 'opening';
        return (
          <td
            key={`row:${column.key}`}
            className={`w-px border-b border-b-line ${tableBorder.rightThin} px-1.5 py-2 text-right align-middle last:border-r-0 ${
              canEdit ? editableCellClassName : ''
            }`}
            onClick={(event) => {
              if (!canEdit) {
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
              if (!canEdit) {
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
            <RowCell column={column.key} row={row} editable={canEditOpening} onOpeningAction={onOpeningAction} />
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
  row: FinishedGoodsRow;
  editable: boolean;
  onOpeningAction: (productId: string, pieces: number) => string | null;
}) {
  switch (column) {
    case 'opening':
      if (!editable) {
        return <TableNumber value={row.openingPieces}>{formatPieces(row.openingPieces)} шт</TableNumber>;
      }
      return (
        <IntegerCell
          label={`Остаток на начало, ${row.name}`}
          value={row.openingPieces}
          unit="шт"
          allowNegative
          invalidMessage="Укажите остаток целым числом штук."
          onChange={(next) => onOpeningAction(row.productId, next)}
        />
      );
    case 'planPrice':
      return <VatMoneyCell withVat={row.planPriceWithVat} exVat={row.planPriceExVat} />;
    case 'openingValue':
      return <VatMoneyCell withVat={row.openingValueWithVat} exVat={row.openingValueExVat} />;
    case 'salesPieces':
      return <TableNumber value={row.salesPieces}>{formatPieces(row.salesPieces)} шт</TableNumber>;
    case 'salesRevenue':
      if (!row.revenueComplete) {
        return <Muted>{keepWithNext('не по всем товарам')}</Muted>;
      }
      return <VatMoneyCell withVat={row.salesRevenueWithVat} exVat={row.salesRevenueExVat} />;
    case 'productionPieces':
      return <TableNumber value={row.productionPieces}>{formatPieces(row.productionPieces)} шт</TableNumber>;
    case 'productionValue':
      return <VatMoneyCell withVat={row.productionValueWithVat} exVat={row.productionValueExVat} />;
    case 'closing':
      return <IntegerCell value={row.closingPieces} unit="шт" signed />;
    case 'factPrice':
      return <VatMoneyCell withVat={row.factPriceWithVat} exVat={row.factPriceExVat} />;
    case 'closingValue':
      return <VatMoneyCell withVat={row.closingValueWithVat} exVat={row.closingValueExVat} signed />;
  }
}

function TotalsCell({ column, totals }: { column: ColumnKey; totals: FinishedGoodsTotals }) {
  switch (column) {
    case 'opening':
      return <TableNumber value={totals.openingPieces}>{formatPieces(totals.openingPieces)} шт</TableNumber>;
    case 'planPrice':
      return <VatMoneyCell withVat={totals.planPriceWithVat} exVat={totals.planPriceExVat} />;
    case 'openingValue':
      return <VatMoneyCell withVat={totals.openingValueWithVat} exVat={totals.openingValueExVat} />;
    case 'salesPieces':
      return <TableNumber value={totals.salesPieces}>{formatPieces(totals.salesPieces)} шт</TableNumber>;
    case 'salesRevenue':
      if (!totals.revenueComplete) {
        return <Muted>{keepWithNext('не по всем товарам')}</Muted>;
      }
      return <VatMoneyCell withVat={totals.salesRevenueWithVat} exVat={totals.salesRevenueExVat} />;
    case 'productionPieces':
      return <TableNumber value={totals.productionPieces}>{formatPieces(totals.productionPieces)} шт</TableNumber>;
    case 'productionValue':
      return <VatMoneyCell withVat={totals.productionValueWithVat} exVat={totals.productionValueExVat} />;
    case 'closing':
      return <IntegerCell value={totals.closingPieces} unit="шт" signed />;
    case 'factPrice':
      return <VatMoneyCell withVat={totals.factPriceWithVat} exVat={totals.factPriceExVat} />;
    case 'closingValue':
      return <VatMoneyCell withVat={totals.closingValueWithVat} exVat={totals.closingValueExVat} signed />;
  }
}

function editableFieldNear(target: EventTarget | null, cell: HTMLElement): HTMLInputElement | null {
  if (target instanceof HTMLInputElement) {
    return target;
  }
  return cell.querySelector('input');
}
