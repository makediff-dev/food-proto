'use client';

import { useState } from 'react';

import type {
  DerivativeMovementRow,
  DerivativeMovementSection,
  DerivativeNormField,
} from '@/domain/derivative-movement';
import { MaterialNormDeviation } from '@/features/materials/MaterialNormDeviation';
import { QuantityCell, QuantityRead } from '@/features/materials/QuantityCell';
import { IconChevronDown, IconChevronRight } from '@/features/shell/Icons';
import {
  blockCornerClassName,
  blockHeadingClassName,
  type CellKind,
  ColumnLabel,
  categoryBandClassName,
  categoryNameClassName,
  categoryNameRowClassName,
  cellKindClassName,
  columnDividerClassName,
  columnHeadingClassName,
  entityNameRowClassName,
  keepWithNext,
  nameHeadingClassName,
  ProductIndex,
  stickyHeadClassName,
  tableBorder,
  tableClassName,
  tableFrameClassName,
} from '@/features/table';

type ColumnKey = 'min' | 'max' | 'normDeviation' | 'recommended';

const COLUMNS: { key: ColumnKey; label: string; hint?: string }[] = [
  { key: 'min', label: 'Мин.' },
  { key: 'max', label: 'Макс.' },
  { key: 'normDeviation', label: 'Откл.' },
  {
    key: 'recommended',
    label: 'Реком. объём',
    hint: 'план расхода + (мин + макс) / 2 − остаток на начало',
  },
];

const COLUMN_KIND: Record<ColumnKey, CellKind> = {
  min: 'assigned',
  max: 'assigned',
  normDeviation: 'computed',
  recommended: 'computed',
};

export function derivativeNormRangeInvalid(minQuantity: number, maxQuantity: number): boolean {
  return minQuantity > maxQuantity;
}

export function DerivativeMovementPlanTable({
  sections,
  editable,
  onNorm,
}: {
  sections: readonly DerivativeMovementSection[];
  editable: boolean;
  onNorm: (derivativeId: string, field: DerivativeNormField, value: number) => string | null;
}) {
  return (
    <div className={tableFrameClassName}>
      <table className={tableClassName}>
        <caption className="sr-only">Ввод плана: движение производных</caption>
        <thead className={stickyHeadClassName}>
          <tr>
            <th className={`sticky left-0 z-40 ${blockCornerClassName} ${tableBorder.rightThick}`} />
            <th colSpan={COLUMNS.length} scope="colgroup" className={blockHeadingClassName}>
              {keepWithNext('Плановые показатели')}
            </th>
          </tr>
          <tr>
            <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
              Производная
            </th>
            {COLUMNS.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`${columnHeadingClassName} last:border-r-0 ${tableBorder.rightThin}`}
              >
                <ColumnLabel label={column.label} hint={column.hint} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sections.map((section) => (
            <WorkshopBlock key={section.workshopId} section={section} editable={editable} onNorm={onNorm} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WorkshopBlock({
  section,
  editable,
  onNorm,
}: {
  section: DerivativeMovementSection;
  editable: boolean;
  onNorm: (derivativeId: string, field: DerivativeNormField, value: number) => string | null;
}) {
  const [open, setOpen] = useState(true);
  const count = section.rows.length;

  return (
    <>
      <tr>
        <th scope="row" className={categoryNameRowClassName(false)}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-expanded={open}
              aria-label={open ? `Свернуть ${section.name}` : `Развернуть ${section.name}`}
              title={open ? 'Свернуть' : 'Развернуть'}
              onClick={() => setOpen((current) => !current)}
              className="inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {open ? <IconChevronDown /> : <IconChevronRight />}
            </button>
            <span className={categoryNameClassName}>
              {section.name} ({count})
            </span>
          </div>
        </th>
        {COLUMNS.map((column) => (
          <td
            key={`group:${column.key}`}
            className={`w-px border-b border-b-line px-2 py-2 text-right align-middle ${categoryBandClassName} ${columnDividerClassName}`}
          />
        ))}
      </tr>
      {open
        ? section.rows.map((row, index) => (
            <DerivativeRow key={row.derivativeId} row={row} index={index + 1} editable={editable} onNorm={onNorm} />
          ))
        : null}
    </>
  );
}

function DerivativeRow({
  row,
  index,
  editable,
  onNorm,
}: {
  row: DerivativeMovementRow;
  index: number;
  editable: boolean;
  onNorm: (derivativeId: string, field: DerivativeNormField, value: number) => string | null;
}) {
  const canEdit = editable && !row.deleted;
  const normRangeInvalid = derivativeNormRangeInvalid(row.minQuantity, row.maxQuantity);

  return (
    <tr>
      <th scope="row" className={entityNameRowClassName('repeated')}>
        <div className="flex items-center gap-2">
          <ProductIndex index={index} />
          <span className="flex h-8 min-w-max items-center text-sm leading-none text-ink">{row.name}</span>
          {row.deleted ? <span className="text-sm text-muted">(архив)</span> : null}
        </div>
      </th>
      {COLUMNS.map((column) => {
        const normCellInvalid = normRangeInvalid && (column.key === 'min' || column.key === 'max');
        return (
          <td
            key={`row:${column.key}`}
            className={`w-px border-b border-b-line px-2 py-2 text-right align-middle ${columnDividerClassName} ${cellKindClassName[COLUMN_KIND[column.key]]} ${normCellInvalid ? 'bg-caution/15 ring-1 ring-inset ring-caution/50' : ''}`}
          >
            <RowCell column={column.key} row={row} editable={canEdit} onNorm={onNorm} />
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
  onNorm,
}: {
  column: ColumnKey;
  row: DerivativeMovementRow;
  editable: boolean;
  onNorm: (derivativeId: string, field: DerivativeNormField, value: number) => string | null;
}) {
  const unit = row.unit;
  switch (column) {
    case 'min':
      return editable ? (
        <QuantityCell
          label={`Минимум ${row.name}`}
          value={row.minQuantity}
          unit={unit}
          allowNegative
          onChange={(value) => onNorm(row.derivativeId, 'minQuantity', value)}
        />
      ) : (
        <QuantityRead value={row.minQuantity} unit={unit} signed />
      );
    case 'max':
      return editable ? (
        <QuantityCell
          label={`Максимум ${row.name}`}
          value={row.maxQuantity}
          unit={unit}
          allowNegative
          onChange={(value) => onNorm(row.derivativeId, 'maxQuantity', value)}
        />
      ) : (
        <QuantityRead value={row.maxQuantity} unit={unit} signed />
      );
    case 'normDeviation':
      return (
        <MaterialNormDeviation
          belowMinQuantity={row.belowMinQuantity}
          aboveMaxQuantity={row.aboveMaxQuantity}
          unit={unit}
        />
      );
    case 'recommended':
      return <QuantityRead value={row.recommendedQuantity} unit={unit} />;
  }
}
