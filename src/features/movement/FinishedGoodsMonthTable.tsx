'use client';

import { useState } from 'react';

import type { FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals } from '@/domain/finished-goods';
import { FinishedGoodsReportColumnHeaders } from '@/features/movement/FinishedGoodsNormativeColumnHeading';
import { NormDeviationCell } from '@/features/movement/NormDeviationCell';
import { formatPieces } from '@/features/sales/text';
import { IconChevronDown, IconChevronRight } from '@/features/shell/Icons';
import {
  blockCornerClassName,
  blockHeadingClassName,
  categoryBandClassName,
  categoryNameClassName,
  columnDividerClassName,
  IntegerCell,
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

type ColumnKey =
  | 'bookOpening'
  | 'inventory'
  | 'openingDeviation'
  | 'openingPrice'
  | 'openingDeviationValue'
  | 'openingValue'
  | 'salesPieces'
  | 'salesPrice'
  | 'salesRevenue'
  | 'productionPieces'
  | 'productionPrice'
  | 'productionValue'
  | 'closing'
  | 'min'
  | 'max'
  | 'normDeviation'
  | 'factPrice'
  | 'closingValue';

const COLUMN_GROUPS: { label: string; columns: { key: ColumnKey; label: string }[] }[] = [
  {
    label: 'Остаток на начало',
    columns: [
      { key: 'bookOpening', label: 'План' },
      { key: 'inventory', label: 'Факт' },
      { key: 'openingDeviation', label: 'Откл.' },
      { key: 'openingPrice', label: 'Цена' },
      { key: 'openingDeviationValue', label: 'Стоимость отклонения' },
      { key: 'openingValue', label: 'Стоимость' },
    ],
  },
  {
    label: 'Продажи',
    columns: [
      { key: 'salesPieces', label: 'Объём' },
      { key: 'salesPrice', label: 'Цена' },
      { key: 'salesRevenue', label: 'Стоимость' },
    ],
  },
  {
    label: 'Производство',
    columns: [
      { key: 'productionPieces', label: 'Объём' },
      { key: 'productionPrice', label: 'Себест.' },
      { key: 'productionValue', label: 'Стоимость' },
    ],
  },
  {
    label: 'Остаток на конец',
    columns: [
      { key: 'closing', label: 'Остаток' },
      { key: 'min', label: 'Мин.' },
      { key: 'max', label: 'Макс.' },
      { key: 'normDeviation', label: 'Откл.' },
      { key: 'factPrice', label: 'Цена (факт)' },
      { key: 'closingValue', label: 'Стоимость' },
    ],
  },
];

const COLUMNS = COLUMN_GROUPS.flatMap((group) => group.columns);

const GROUP_END_KEYS = new Set(COLUMN_GROUPS.slice(0, -1).map((group) => group.columns[group.columns.length - 1].key));

function groupEndClass(key: ColumnKey): string {
  return GROUP_END_KEYS.has(key) ? tableBorder.rightThick : columnDividerClassName;
}

export function FinishedGoodsMonthTable({
  groups,
  totals,
  expanded = false,
  caption = 'Отчет общий: движение готовой продукции за месяц',
}: {
  groups: FinishedGoodsGroup[];
  totals: FinishedGoodsTotals;
  expanded?: boolean;
  caption?: string;
}) {
  return (
    <div className={expanded ? tableFrameExpandedClassName : tableFrameClassName}>
      <table className={tableClassName}>
        <caption className="sr-only">{caption}</caption>
        <thead className={stickyHeadClassName}>
          <tr>
            <th className={`sticky left-0 z-40 ${blockCornerClassName} ${tableBorder.rightThick}`} />
            {COLUMN_GROUPS.map((group, index) => (
              <th
                key={group.label}
                colSpan={group.columns.length}
                scope="colgroup"
                className={`${blockHeadingClassName} ${index < COLUMN_GROUPS.length - 1 ? tableBorder.rightThick : ''}`}
              >
                {keepWithNext(group.label)}
              </th>
            ))}
          </tr>
          <tr>
            <th rowSpan={2} scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
              Товар
            </th>
            <FinishedGoodsReportColumnHeaders
              row="primary"
              columns={COLUMNS}
              groupEndClass={groupEndClass}
              lastColumnExtraClassName="last:border-r-0"
            />
          </tr>
          <tr>
            <FinishedGoodsReportColumnHeaders row="secondary" columns={COLUMNS} groupEndClass={groupEndClass} />
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <CategoryBlock key={group.categoryId} group={group} />
          ))}
          <tr>
            <th scope="row" className={`sticky left-0 z-10 ${totalNameClassName}`}>
              Всего
            </th>
            {COLUMNS.map((column) => (
              <td
                key={`total:${column.key}`}
                className={`${totalValueClassName} last:border-r-0 ${groupEndClass(column.key)}`}
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

function CategoryBlock({ group }: { group: FinishedGoodsGroup }) {
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
            className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle last:border-r-0 ${categoryBandClassName} ${groupEndClass(column.key)}`}
          >
            <TotalsCell column={column.key} totals={group.totals} />
          </td>
        ))}
      </tr>
      {open ? group.rows.map((row, index) => <ProductRow key={row.productId} row={row} index={index + 1} />) : null}
    </>
  );
}

function ProductRow({ row, index }: { row: FinishedGoodsRow; index: number }) {
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
          className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle last:border-r-0 ${groupEndClass(column.key)}`}
        >
          <RowCell column={column.key} row={row} />
        </td>
      ))}
    </tr>
  );
}

function RowCell({ column, row }: { column: ColumnKey; row: FinishedGoodsRow }) {
  switch (column) {
    case 'bookOpening':
      return <TableNumber value={row.bookOpeningPieces}>{formatPieces(row.bookOpeningPieces)} шт</TableNumber>;
    case 'inventory':
      return <TableNumber value={row.openingPieces}>{formatPieces(row.openingPieces)} шт</TableNumber>;
    case 'openingDeviation':
      return <IntegerCell value={row.openingDeviationPieces} unit="шт" signed />;
    case 'openingPrice':
      return <VatMoneyCell withVat={row.openingPriceWithVat} exVat={row.openingPriceExVat} />;
    case 'openingDeviationValue':
      return <VatMoneyCell withVat={row.openingDeviationValueWithVat} exVat={row.openingDeviationValueExVat} signed />;
    case 'openingValue':
      return <VatMoneyCell withVat={row.openingValueWithVat} exVat={row.openingValueExVat} />;
    case 'salesPieces':
      return <TableNumber value={row.salesPieces}>{formatPieces(row.salesPieces)} шт</TableNumber>;
    case 'salesPrice':
      if (!row.revenueComplete) {
        return <Muted>{keepWithNext('не по всем товарам')}</Muted>;
      }
      return <VatMoneyCell withVat={row.factPriceWithVat} exVat={row.factPriceExVat} />;
    case 'salesRevenue':
      if (!row.revenueComplete) {
        return <Muted>{keepWithNext('не по всем товарам')}</Muted>;
      }
      return <VatMoneyCell withVat={row.salesRevenueWithVat} exVat={row.salesRevenueExVat} />;
    case 'productionPieces':
      return <TableNumber value={row.productionPieces}>{formatPieces(row.productionPieces)} шт</TableNumber>;
    case 'productionPrice':
      return <VatMoneyCell withVat={row.productionPriceWithVat} exVat={row.productionPriceExVat} />;
    case 'productionValue':
      return <VatMoneyCell withVat={row.productionValueWithVat} exVat={row.productionValueExVat} />;
    case 'closing':
      return <IntegerCell value={row.closingPieces} unit="шт" signed />;
    case 'min':
      return <TableNumber value={row.minPieces}>{formatPieces(row.minPieces)} шт</TableNumber>;
    case 'max':
      return <TableNumber value={row.maxPieces}>{formatPieces(row.maxPieces)} шт</TableNumber>;
    case 'normDeviation':
      return <NormDeviationCell belowMinPieces={row.belowMinPieces} aboveMaxPieces={row.aboveMaxPieces} />;
    case 'factPrice':
      return <VatMoneyCell withVat={row.factPriceWithVat} exVat={row.factPriceExVat} />;
    case 'closingValue':
      return <VatMoneyCell withVat={row.closingValueWithVat} exVat={row.closingValueExVat} signed />;
  }
}

function TotalsCell({ column, totals }: { column: ColumnKey; totals: FinishedGoodsTotals }) {
  switch (column) {
    case 'bookOpening':
      return <TableNumber value={totals.bookOpeningPieces}>{formatPieces(totals.bookOpeningPieces)} шт</TableNumber>;
    case 'inventory':
      return <TableNumber value={totals.openingPieces}>{formatPieces(totals.openingPieces)} шт</TableNumber>;
    case 'openingDeviation':
      return <IntegerCell value={totals.openingDeviationPieces} unit="шт" signed />;
    case 'openingPrice':
      return <VatMoneyCell withVat={totals.openingPriceWithVat} exVat={totals.openingPriceExVat} />;
    case 'openingDeviationValue':
      return (
        <VatMoneyCell withVat={totals.openingDeviationValueWithVat} exVat={totals.openingDeviationValueExVat} signed />
      );
    case 'openingValue':
      return <VatMoneyCell withVat={totals.openingValueWithVat} exVat={totals.openingValueExVat} />;
    case 'salesPieces':
      return <TableNumber value={totals.salesPieces}>{formatPieces(totals.salesPieces)} шт</TableNumber>;
    case 'salesPrice':
      if (!totals.revenueComplete) {
        return <Muted>{keepWithNext('не по всем товарам')}</Muted>;
      }
      return <VatMoneyCell withVat={totals.factPriceWithVat} exVat={totals.factPriceExVat} />;
    case 'salesRevenue':
      if (!totals.revenueComplete) {
        return <Muted>{keepWithNext('не по всем товарам')}</Muted>;
      }
      return <VatMoneyCell withVat={totals.salesRevenueWithVat} exVat={totals.salesRevenueExVat} />;
    case 'productionPieces':
      return <TableNumber value={totals.productionPieces}>{formatPieces(totals.productionPieces)} шт</TableNumber>;
    case 'productionPrice':
      return <VatMoneyCell withVat={totals.productionPriceWithVat} exVat={totals.productionPriceExVat} />;
    case 'productionValue':
      return <VatMoneyCell withVat={totals.productionValueWithVat} exVat={totals.productionValueExVat} />;
    case 'closing':
      return <IntegerCell value={totals.closingPieces} unit="шт" signed />;
    case 'min':
      return <TableNumber value={totals.minPieces}>{formatPieces(totals.minPieces)} шт</TableNumber>;
    case 'max':
      return <TableNumber value={totals.maxPieces}>{formatPieces(totals.maxPieces)} шт</TableNumber>;
    case 'normDeviation':
      return <NormDeviationCell belowMinPieces={totals.belowMinPieces} aboveMaxPieces={totals.aboveMaxPieces} />;
    case 'factPrice':
      return <VatMoneyCell withVat={totals.factPriceWithVat} exVat={totals.factPriceExVat} />;
    case 'closingValue':
      return <VatMoneyCell withVat={totals.closingValueWithVat} exVat={totals.closingValueExVat} signed />;
  }
}
