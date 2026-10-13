'use client';

import { useState } from 'react';

import { costWithVat } from '@/domain/cost';
import type { ProductionPlanGroup, ProductionPlanRow, ProductionPlanTotals } from '@/domain/production-plan';
import { FIELD_ERROR } from '@/features/sales/fields';
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
  Empty,
  editableCellClassName,
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

type ColumnKey = 'unitCost' | 'recommended' | 'volume' | 'volumeCost';

const COLUMNS: { key: ColumnKey; label: string }[] = [
  { key: 'unitCost', label: 'Себест.' },
  { key: 'recommended', label: 'Реком. объём' },
  { key: 'volume', label: 'Объём' },
  { key: 'volumeCost', label: 'Себест. объёма' },
];

export function ProductionPlanTable({
  groups,
  totals,
  recommendedByProduct,
  recommendedTotal,
  editable,
  costEditable,
  expanded = false,
  onVolumeAction,
  onProductCostAction,
}: {
  groups: ProductionPlanGroup[];
  totals: ProductionPlanTotals;
  recommendedByProduct: ReadonlyMap<string, number>;
  recommendedTotal: number;
  editable: boolean;
  costEditable: boolean;
  expanded?: boolean;
  onVolumeAction: (lineId: string, volumePieces: number) => string | null;
  onProductCostAction: (productId: string, unitCostWithVat: number) => string | null;
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
            <CategoryBlock
              key={group.categoryId}
              group={group}
              recommendedByProduct={recommendedByProduct}
              editable={editable}
              costEditable={costEditable}
              onVolumeAction={onVolumeAction}
              onProductCostAction={onProductCostAction}
            />
          ))}
          <tr>
            <th scope="row" className={`sticky left-0 z-10 ${totalNameClassName}`}>
              Всего
            </th>
            {COLUMNS.map((column) => (
              <td key={`total:${column.key}`} className={`${totalValueClassName} ${columnDividerClassName}`}>
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
  editable,
  costEditable,
  onVolumeAction,
  onProductCostAction,
}: {
  group: ProductionPlanGroup;
  recommendedByProduct: ReadonlyMap<string, number>;
  editable: boolean;
  costEditable: boolean;
  onVolumeAction: (lineId: string, volumePieces: number) => string | null;
  onProductCostAction: (productId: string, unitCostWithVat: number) => string | null;
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
              editable={editable}
              costEditable={costEditable}
              onVolumeAction={onVolumeAction}
              onProductCostAction={onProductCostAction}
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
  editable,
  costEditable,
  onVolumeAction,
  onProductCostAction,
}: {
  row: ProductionPlanRow;
  index: number;
  recommendedPieces: number;
  editable: boolean;
  costEditable: boolean;
  onVolumeAction: (lineId: string, volumePieces: number) => string | null;
  onProductCostAction: (productId: string, unitCostWithVat: number) => string | null;
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
      {COLUMNS.map((column) => {
        const canEdit =
          (editable && row.planLineId !== null && column.key === 'volume') ||
          (costEditable && column.key === 'unitCost');
        return (
          <td
            key={`row:${column.key}`}
            className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName} ${
              canEdit && column.key === 'volume' ? editableCellClassName : ''
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
            <RowCell
              column={column.key}
              row={row}
              recommendedPieces={recommendedPieces}
              editable={editable}
              costEditable={costEditable}
              onVolumeAction={onVolumeAction}
              onProductCostAction={onProductCostAction}
            />
          </td>
        );
      })}
    </tr>
  );
}

function RowCell({
  column,
  row,
  recommendedPieces,
  editable,
  costEditable,
  onVolumeAction,
  onProductCostAction,
}: {
  column: ColumnKey;
  row: ProductionPlanRow;
  recommendedPieces: number;
  editable: boolean;
  costEditable: boolean;
  onVolumeAction: (lineId: string, volumePieces: number) => string | null;
  onProductCostAction: (productId: string, unitCostWithVat: number) => string | null;
}) {
  if (column === 'unitCost') {
    const cost = row.metrics.unitCost;
    if (!costEditable || !cost) {
      return cost ? <VatMoneyCell withVat={cost.withVat} exVat={cost.exVat} /> : <Empty />;
    }

    return (
      <VatMoneyCell
        label={`Себестоимость, ${row.name}`}
        withVat={cost.withVat}
        exVat={cost.exVat}
        invalidMessage={FIELD_ERROR.cost}
        onChangeWithVat={(next) => onProductCostAction(row.productId, next)}
        onChangeExVat={(next) => {
          const withVat = costWithVat(next, row.vatPercent);
          if (withVat === null) {
            return FIELD_ERROR.cost;
          }
          return onProductCostAction(row.productId, withVat);
        }}
      />
    );
  }

  if (column === 'recommended') {
    return <TableNumber value={recommendedPieces}>{formatPieces(recommendedPieces)} шт</TableNumber>;
  }

  if (column === 'volume') {
    if (!editable || row.planLineId === null || row.volumePieces === null) {
      return row.volumePieces === null ? (
        <Empty />
      ) : (
        <TableNumber value={row.volumePieces}>{formatPieces(row.volumePieces)} шт</TableNumber>
      );
    }

    return (
      <IntegerCell
        label={`Объём выпуска, ${row.name}`}
        value={row.volumePieces}
        unit="шт"
        invalidMessage="Укажите объём целым числом штук."
        onChange={(next) => onVolumeAction(row.planLineId ?? '', next)}
      />
    );
  }

  if (row.metrics.volumeCostWithVat === null || row.metrics.volumeCostExVat === null) {
    return <Empty />;
  }

  return <VatMoneyCell whole withVat={row.metrics.volumeCostWithVat} exVat={row.metrics.volumeCostExVat} />;
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
    case 'unitCost':
      if (!totals.costComplete) {
        return <Muted>{keepWithNext('не по всем товарам')}</Muted>;
      }
      return <VatMoneyCell withVat={totals.averageCostWithVat} exVat={totals.averageCostExVat} />;
    case 'recommended':
      return <TableNumber value={recommendedPieces}>{formatPieces(recommendedPieces)} шт</TableNumber>;
    case 'volume':
      return <TableNumber value={totals.volumePieces}>{formatPieces(totals.volumePieces)} шт</TableNumber>;
    case 'volumeCost':
      if (!totals.costComplete) {
        return <Muted>{keepWithNext('не по всем товарам')}</Muted>;
      }
      return <VatMoneyCell whole withVat={totals.volumeCostWithVat} exVat={totals.volumeCostExVat} />;
  }
}

function editableFieldNear(target: EventTarget | null, cell: HTMLElement): HTMLInputElement | null {
  if (target instanceof HTMLInputElement) {
    return target;
  }
  return cell.querySelector('input');
}
