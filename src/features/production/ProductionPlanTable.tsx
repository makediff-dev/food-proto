'use client';

import { useState } from 'react';

import type { ProductionPlanGroup, ProductionPlanRow, ProductionPlanTotals } from '@/domain/production-plan';
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
  Empty,
  keepWithNext,
  Muted,
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
  VatMoneyCell,
} from '@/features/table';

type ColumnKey = 'volume' | 'recommended' | 'price' | 'value';

const COLUMNS: { key: ColumnKey; label: string }[] = [
  { key: 'volume', label: 'Объём' },
  { key: 'recommended', label: 'Реком. объём' },
  { key: 'price', label: 'Цена' },
  { key: 'value', label: 'Стоимость' },
];

const COLUMN_KIND: Record<ColumnKey, CellKind> = {
  volume: 'computed',
  recommended: 'repeated',
  price: 'repeated',
  value: 'computed',
};

export function ProductionPlanTable({
  groups,
  totals,
  recommendedByProduct,
  recommendedTotal,
  expanded = false,
}: {
  groups: ProductionPlanGroup[];
  totals: ProductionPlanTotals;
  recommendedByProduct: ReadonlyMap<string, number>;
  recommendedTotal: number;
  expanded?: boolean;
}) {
  return (
    <div className={expanded ? tableFrameExpandedClassName : tableFrameClassName}>
      <table className={tableClassName}>
        <caption className="sr-only">План производства по товарам</caption>
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
            <CategoryBlock key={group.categoryId} group={group} recommendedByProduct={recommendedByProduct} />
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
                <TotalsCell column={column.key} totals={totals} recommendedPieces={recommendedTotal} />
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
  recommendedByProduct,
}: {
  group: ProductionPlanGroup;
  recommendedByProduct: ReadonlyMap<string, number>;
}) {
  const [open, setOpen] = useState(true);
  const productCount = group.rows.length;
  const recommendedGroup = group.rows.reduce((sum, row) => sum + (recommendedByProduct.get(row.productId) ?? 0), 0);

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
            <TotalsCell column={column.key} totals={group.totals} recommendedPieces={recommendedGroup} />
          </td>
        ))}
      </tr>
      {open
        ? group.rows.map((row, index) => (
            <ProductRow
              key={row.productId}
              row={row}
              index={index + 1}
              recommendedPieces={recommendedByProduct.get(row.productId) ?? 0}
            />
          ))
        : null}
    </>
  );
}

function ProductRow({
  row,
  index,
  recommendedPieces,
}: {
  row: ProductionPlanRow;
  index: number;
  recommendedPieces: number;
}) {
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
      {COLUMNS.map((column) => (
        <td
          key={`row:${column.key}`}
          className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName} ${cellKindClassName[COLUMN_KIND[column.key]]}`}
        >
          <RowCell column={column.key} row={row} recommendedPieces={recommendedPieces} />
        </td>
      ))}
    </tr>
  );
}

function RowCell({
  column,
  row,
  recommendedPieces,
}: {
  column: ColumnKey;
  row: ProductionPlanRow;
  recommendedPieces: number;
}) {
  if (column === 'recommended') {
    return <TableNumber value={recommendedPieces}>{formatPieces(recommendedPieces)} шт</TableNumber>;
  }

  if (column === 'volume') {
    return row.volumePieces === null ? (
      <Empty />
    ) : (
      <TableNumber value={row.volumePieces}>{formatPieces(row.volumePieces)} шт</TableNumber>
    );
  }

  if (column === 'price') {
    if (row.metrics.priceExVat === null) {
      return <Empty />;
    }
    return <VatMoneyCell withVat={row.metrics.priceWithVat} exVat={row.metrics.priceExVat} />;
  }

  if (row.metrics.valueWithVat === null || row.metrics.valueExVat === null) {
    return <Empty />;
  }

  return <VatMoneyCell whole withVat={row.metrics.valueWithVat} exVat={row.metrics.valueExVat} />;
}

function TotalsCell({
  column,
  totals,
  recommendedPieces,
}: {
  column: ColumnKey;
  totals: ProductionPlanTotals;
  recommendedPieces: number;
}) {
  switch (column) {
    case 'recommended':
      return <TableNumber value={recommendedPieces}>{formatPieces(recommendedPieces)} шт</TableNumber>;
    case 'volume':
      return <TableNumber value={totals.volumePieces}>{formatPieces(totals.volumePieces)} шт</TableNumber>;
    case 'price':
      if (!totals.priceComplete) {
        return <Muted>{keepWithNext('не по всем товарам')}</Muted>;
      }
      return <VatMoneyCell withVat={totals.averagePriceWithVat} exVat={totals.averagePriceExVat} />;
    case 'value':
      if (!totals.priceComplete) {
        return <Muted>{keepWithNext('не по всем товарам')}</Muted>;
      }
      return <VatMoneyCell whole withVat={totals.valueWithVat} exVat={totals.valueExVat} />;
  }
}
