'use client';

import { type CSSProperties, useState } from 'react';

import type { MaterialWarehouseId } from '@/domain/document';
import type {
  MaterialGroupMovement,
  MaterialMovementRow,
  MaterialMovementTotals,
  MaterialWarehouseMovement,
} from '@/domain/materials';
import { QuantityCell, QuantityRead } from '@/features/materials/QuantityCell';
import { IconChevronDown, IconChevronRight } from '@/features/shell/Icons';
import {
  blockCornerClassName,
  blockHeadingClassName,
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
  stickyCategoryCellClassName,
  stickyHeadClassName,
  tableBorder,
  tableClassName,
  tableFrameScrollClassName,
  useStickyTableHead,
} from '@/features/table';

type ColumnKey = 'bookClosing' | 'closing' | 'closingDeviation';

type InventorySection = {
  key: string;
  label: string;
  warehouseId: MaterialWarehouseId;
  warehouse: MaterialWarehouseMovement;
};

const COLUMNS: { key: ColumnKey; label: string }[] = [
  { key: 'bookClosing', label: 'План' },
  { key: 'closing', label: 'Факт' },
  { key: 'closingDeviation', label: 'Откл.' },
];

const iconButtonClassName =
  'inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';

const bandCellClassName = `w-px border-b border-b-line px-2 py-2 text-right align-middle ${categoryBandClassName} ${columnDividerClassName}`;
const valueCellClassName = `border-b border-b-line px-2 py-2 text-right align-middle ${columnDividerClassName}`;

function buildSections(groups: readonly MaterialGroupMovement[]): InventorySection[] {
  return groups.flatMap((group) =>
    group.warehouses.map((warehouse) => ({
      key: `${group.groupId}:${warehouse.warehouseId}`,
      label: `${group.name}, ${warehouse.name}`,
      warehouseId: warehouse.warehouseId,
      warehouse,
    })),
  );
}

export function MaterialsInventoryTable({
  groups,
  editable,
  onClosing,
}: {
  groups: readonly MaterialGroupMovement[];
  editable: boolean;
  onClosing: (warehouseId: MaterialWarehouseId, materialId: string, quantity: number) => string | null;
}) {
  const sections = buildSections(groups);
  const { headRef, categoryStickyStyle } = useStickyTableHead();

  return (
    <div className={tableFrameScrollClassName}>
      <table className={tableClassName}>
        <caption className="sr-only">Инвентаризация: сырьё и материалы</caption>
        <thead ref={headRef} className={stickyHeadClassName}>
          <tr>
            <th className={`sticky left-0 z-40 ${blockCornerClassName} ${tableBorder.rightThick}`} />
            <th colSpan={COLUMNS.length} scope="colgroup" className={blockHeadingClassName}>
              {keepWithNext('Остаток на конец')}
            </th>
          </tr>
          <tr>
            <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
              Наименование
            </th>
            {COLUMNS.map((column) => (
              <th key={column.key} scope="col" className={`${columnHeadingClassName} ${tableBorder.rightThin}`}>
                {keepWithNext(column.label)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sections.map((section) => (
            <SectionBlock
              key={section.key}
              section={section}
              editable={editable}
              categoryStickyStyle={categoryStickyStyle}
              onClosing={onClosing}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionBlock({
  section,
  editable,
  categoryStickyStyle,
  onClosing,
}: {
  section: InventorySection;
  editable: boolean;
  categoryStickyStyle: CSSProperties | undefined;
  onClosing: (warehouseId: MaterialWarehouseId, materialId: string, quantity: number) => string | null;
}) {
  const [open, setOpen] = useState(true);
  const count = section.warehouse.rows.length;

  return (
    <>
      <tr>
        <th
          scope="row"
          className={categoryNameRowClassName(editable, { stack: 'belowHead' })}
          style={categoryStickyStyle}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-expanded={open}
              aria-label={open ? `Свернуть ${section.label}` : `Развернуть ${section.label}`}
              title={open ? 'Свернуть' : 'Развернуть'}
              onClick={() => setOpen((current) => !current)}
              className={iconButtonClassName}
            >
              {open ? <IconChevronDown /> : <IconChevronRight />}
            </button>
            <span className={categoryNameClassName}>
              {section.label} ({count})
            </span>
          </div>
        </th>
        {COLUMNS.map((column) => (
          <td
            key={`group:${column.key}`}
            className={`${bandCellClassName} ${stickyCategoryCellClassName}`}
            style={categoryStickyStyle}
          >
            {count > 0 ? <InventoryTotal column={column.key} totals={section.warehouse.totals} /> : null}
          </td>
        ))}
      </tr>
      {open && count === 0 ? (
        <tr>
          <th scope="row" className={entityNameRowClassName('repeated')}>
            <span className="text-sm text-muted">Позиций нет. Добавьте наименование во вводе плана.</span>
          </th>
          {COLUMNS.map((column) => (
            <td key={`empty:${column.key}`} className={`${valueCellClassName} ${cellKindClassName.computed}`} />
          ))}
        </tr>
      ) : null}
      {open
        ? section.warehouse.rows.map((row, index) => (
            <MaterialRow
              key={row.materialId}
              row={row}
              index={index + 1}
              editable={editable && !row.deleted}
              onClosing={(quantity) => onClosing(section.warehouseId, row.materialId, quantity)}
            />
          ))
        : null}
    </>
  );
}

function MaterialRow({
  row,
  index,
  editable,
  onClosing,
}: {
  row: MaterialMovementRow;
  index: number;
  editable: boolean;
  onClosing: (quantity: number) => string | null;
}) {
  return (
    <tr>
      <th scope="row" className={entityNameRowClassName('repeated')}>
        <span className="inline-flex w-full items-center gap-2">
          <ProductIndex index={index} />
          <span>
            {row.name}
            {row.deleted ? <span className="text-muted"> (архив)</span> : null}
          </span>
        </span>
      </th>
      <td className={`${valueCellClassName} ${cellKindClassName.computed}`}>
        <QuantityRead value={row.bookClosingQuantity} unit={row.unit} signed />
      </td>
      <td className={`${valueCellClassName} ${cellKindClassName.assigned}`}>
        {editable ? (
          <QuantityCell
            label={`Остаток на конец ${row.name}`}
            value={row.closingQuantity}
            unit={row.unit}
            allowNegative
            onChange={onClosing}
          />
        ) : (
          <QuantityRead value={row.closingQuantity} unit={row.unit} signed />
        )}
      </td>
      <td className={`${valueCellClassName} ${cellKindClassName.computed}`}>
        <QuantityRead value={row.closingDeviationQuantity} unit={row.unit} signed />
      </td>
    </tr>
  );
}

function InventoryTotal({ column, totals }: { column: ColumnKey; totals: MaterialMovementTotals }) {
  const unit = totals.unit ?? undefined;
  switch (column) {
    case 'bookClosing':
      return <QuantityRead value={totals.bookClosingQuantity} unit={unit} signed />;
    case 'closing':
      return <QuantityRead value={totals.closingQuantity} unit={unit} signed />;
    case 'closingDeviation':
      return <QuantityRead value={totals.closingDeviationQuantity} unit={unit} signed />;
    default:
      return null;
  }
}
