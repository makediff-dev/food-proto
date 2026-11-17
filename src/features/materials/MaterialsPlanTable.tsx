'use client';

import { type CSSProperties, useState } from 'react';

import { costWithVat } from '@/domain/cost';
import type { MaterialGroupId, MaterialWarehouseId } from '@/domain/document';
import type {
  MaterialGroupMovement,
  MaterialMovementRow,
  MaterialMovementTotals,
  MaterialPlanField,
  MaterialWarehouseMovement,
} from '@/domain/materials';
import { MaterialNormDeviation } from '@/features/materials/MaterialNormDeviation';
import { MATERIALS_RECEIPTS_TITLE } from '@/features/materials/paths';
import { QuantityCell, QuantityRead } from '@/features/materials/QuantityCell';
import { formatMaterialWeightPair } from '@/features/materials/text';
import { IconChevronDown, IconChevronRight, IconPencil, IconPlus, IconTrash } from '@/features/shell/Icons';
import {
  blockCornerClassName,
  blockHeadingClassName,
  type CellKind,
  categoryBandClassName,
  categoryNameClassName,
  categoryNameRowClassName,
  cellKindClassName,
  columnDividerClassName,
  columnHeadingClassName,
  entityNameRowClassName,
  keepWithNext,
  nameCellKind,
  nameHeadingClassName,
  ProductIndex,
  stickyCategoryCellClassName,
  stickyHeadClassName,
  tableBorder,
  tableClassName,
  tableFrameScrollClassName,
  useStickyTableHead,
  VatMoneyCell,
} from '@/features/table';

type ColumnKey = 'price' | 'planReceipt' | 'planReceiptCost' | 'min' | 'max' | 'normDeviation' | 'recommended';

type PlanSection = {
  key: string;
  label: string;
  groupId: MaterialGroupId;
  warehouseId: MaterialWarehouseId;
  warehouse: MaterialWarehouseMovement;
};

function materialUnitHint(row: Pick<MaterialMovementRow, 'unit' | 'weight'>): string {
  if (row.weight === null) {
    return row.unit;
  }
  return `${row.unit} · ${formatMaterialWeightPair(row.weight, row.unit)}`;
}

const COLUMNS: { key: ColumnKey; label: string; editable: boolean }[] = [
  { key: 'price', label: 'Цена', editable: true },
  { key: 'planReceipt', label: MATERIALS_RECEIPTS_TITLE, editable: true },
  { key: 'planReceiptCost', label: 'Стоимость прихода', editable: false },
  { key: 'min', label: 'Мин.', editable: true },
  { key: 'max', label: 'Макс.', editable: true },
  { key: 'normDeviation', label: 'Откл.', editable: false },
  { key: 'recommended', label: 'Рекомендуемый приход', editable: false },
];

function planColumnKind(column: (typeof COLUMNS)[number]): CellKind {
  return column.editable ? 'assigned' : 'computed';
}

function buildSections(groups: readonly MaterialGroupMovement[]): PlanSection[] {
  return groups.flatMap((group) =>
    group.warehouses.map((warehouse) => ({
      key: `${group.groupId}:${warehouse.warehouseId}`,
      label: `${group.name}, ${warehouse.name}`,
      groupId: group.groupId,
      warehouseId: warehouse.warehouseId,
      warehouse,
    })),
  );
}

const iconButtonClassName =
  'inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';

export function MaterialsPlanTable({
  groups,
  editable,
  onField,
  onEdit,
  onDelete,
  onAdd,
}: {
  groups: readonly MaterialGroupMovement[];
  editable: boolean;
  onField: (
    warehouseId: MaterialWarehouseId,
    materialId: string,
    field: MaterialPlanField,
    value: number,
  ) => string | null;
  onEdit?: (materialId: string) => void;
  onDelete?: (materialId: string, name: string) => void;
  onAdd?: (groupId: MaterialGroupId, warehouseId: MaterialWarehouseId) => void;
}) {
  const sections = buildSections(groups);
  const { headRef, categoryStickyStyle } = useStickyTableHead();

  return (
    <div className={tableFrameScrollClassName}>
      <table className={tableClassName}>
        <caption className="sr-only">Ввод плана: сырьё и материалы</caption>
        <thead ref={headRef} className={stickyHeadClassName}>
          <tr>
            <th className={`sticky left-0 z-40 ${blockCornerClassName} ${tableBorder.rightThick}`} />
            <th colSpan={COLUMNS.length} scope="colgroup" className={blockHeadingClassName}>
              {keepWithNext('Плановые показатели')}
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
              onField={onField}
              onEdit={onEdit}
              onDelete={onDelete}
              onAdd={onAdd}
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
  onField,
  onEdit,
  onDelete,
  onAdd,
}: {
  section: PlanSection;
  editable: boolean;
  categoryStickyStyle: CSSProperties | undefined;
  onField: (
    warehouseId: MaterialWarehouseId,
    materialId: string,
    field: MaterialPlanField,
    value: number,
  ) => string | null;
  onEdit?: (materialId: string) => void;
  onDelete?: (materialId: string, name: string) => void;
  onAdd?: (groupId: MaterialGroupId, warehouseId: MaterialWarehouseId) => void;
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
            {onAdd ? (
              <button
                type="button"
                aria-label={`Добавить позицию в ${section.label}`}
                title="Добавить позицию"
                onClick={() => {
                  setOpen(true);
                  onAdd(section.groupId, section.warehouseId);
                }}
                className={iconButtonClassName}
              >
                <IconPlus />
              </button>
            ) : null}
          </div>
        </th>
        {COLUMNS.map((column) => (
          <td
            key={`group:${column.key}`}
            className={`w-px border-b border-b-line px-2 py-2 text-right align-middle ${stickyCategoryCellClassName} ${categoryBandClassName} ${columnDividerClassName}`}
            style={categoryStickyStyle}
          >
            {count > 0 ? <PlanTotal column={column.key} totals={section.warehouse.totals} /> : null}
          </td>
        ))}
      </tr>
      {open && count === 0 ? (
        <tr>
          <th scope="row" className={entityNameRowClassName('repeated')}>
            <span className="text-sm text-muted">
              {editable ? 'Позиций нет. Добавьте наименование.' : 'Позиций нет.'}
            </span>
          </th>
          {COLUMNS.map((column) => (
            <td
              key={`empty:${column.key}`}
              className={`border-b border-b-line px-2 py-2 ${columnDividerClassName} ${cellKindClassName.computed}`}
            />
          ))}
        </tr>
      ) : null}
      {open
        ? section.warehouse.rows.map((row, index) => (
            <MaterialRow
              key={row.materialId}
              row={row}
              index={index + 1}
              editable={editable}
              onField={(materialId, field, value) => onField(section.warehouseId, materialId, field, value)}
              onEdit={onEdit}
              onDelete={onDelete}
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
  onField,
  onEdit,
  onDelete,
}: {
  row: MaterialMovementRow;
  index: number;
  editable: boolean;
  onField: (materialId: string, field: MaterialPlanField, value: number) => string | null;
  onEdit?: (materialId: string) => void;
  onDelete?: (materialId: string, name: string) => void;
}) {
  const canEdit = editable && !row.deleted;

  return (
    <tr>
      <th scope="row" className={entityNameRowClassName(nameCellKind(canEdit))}>
        <span className="inline-flex w-full items-center gap-2">
          <ProductIndex index={index} />
          <span className="min-w-0 flex-1">
            {row.name}
            {row.deleted ? <span className="text-muted"> (архив)</span> : null}
            <span className="text-muted"> · {materialUnitHint(row)}</span>
          </span>
          {canEdit && onEdit && onDelete ? (
            <span className="ml-auto inline-flex shrink-0 items-center">
              <button
                type="button"
                aria-label={`Изменить ${row.name}`}
                title="Изменить"
                onClick={() => onEdit(row.materialId)}
                className={iconButtonClassName}
              >
                <IconPencil />
              </button>
              <button
                type="button"
                aria-label={`Удалить ${row.name}`}
                title="Удалить"
                onClick={() => onDelete(row.materialId, row.name)}
                className={iconButtonClassName}
              >
                <IconTrash />
              </button>
            </span>
          ) : null}
        </span>
      </th>
      {COLUMNS.map((column) => (
        <td
          key={column.key}
          className={`border-b border-b-line px-2 py-2 text-right align-middle ${columnDividerClassName} ${cellKindClassName[planColumnKind(column)]}`}
        >
          <PlanCell column={column.key} row={row} editable={canEdit} onField={onField} />
        </td>
      ))}
    </tr>
  );
}

function PlanCell({
  column,
  row,
  editable,
  onField,
}: {
  column: ColumnKey;
  row: MaterialMovementRow;
  editable: boolean;
  onField: (materialId: string, field: MaterialPlanField, value: number) => string | null;
}) {
  const unit = row.unit;
  switch (column) {
    case 'price':
      return (
        <VatMoneyCell
          label={`Цена ${row.name}`}
          withVat={row.planPrice.withVat}
          exVat={row.planPrice.exVat}
          onChangeWithVat={editable ? (value) => onField(row.materialId, 'priceWithVat', value) : undefined}
          onChangeExVat={
            editable
              ? (value) => {
                  const withVat = costWithVat(value, row.vatPercent);
                  if (withVat === null) {
                    return 'Укажите цену.';
                  }
                  return onField(row.materialId, 'priceWithVat', withVat);
                }
              : undefined
          }
        />
      );
    case 'planReceipt':
      return editable ? (
        <QuantityCell
          label={`План прихода ${row.name}`}
          value={row.planReceiptQuantity}
          unit={unit}
          onChange={(value) => onField(row.materialId, 'receiptQuantity', value)}
        />
      ) : (
        <QuantityRead value={row.planReceiptQuantity} unit={unit} />
      );
    case 'planReceiptCost':
      return (
        <VatMoneyCell
          label="Стоимость прихода"
          withVat={row.planReceiptCost.withVat}
          exVat={row.planReceiptCost.exVat}
        />
      );
    case 'min':
      return editable ? (
        <QuantityCell
          label={`Минимум ${row.name}`}
          value={row.minQuantity}
          unit={unit}
          allowNegative
          onChange={(value) => onField(row.materialId, 'minQuantity', value)}
        />
      ) : (
        <QuantityRead value={row.minQuantity} unit={unit} />
      );
    case 'max':
      return editable ? (
        <QuantityCell
          label={`Максимум ${row.name}`}
          value={row.maxQuantity}
          unit={unit}
          allowNegative
          onChange={(value) => onField(row.materialId, 'maxQuantity', value)}
        />
      ) : (
        <QuantityRead value={row.maxQuantity} unit={unit} />
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
      return <QuantityRead value={row.recommendedReceiptQuantity} unit={unit} />;
    default:
      return null;
  }
}

function PlanTotal({ column, totals }: { column: ColumnKey; totals: MaterialMovementTotals }) {
  const unit = totals.unit ?? undefined;
  switch (column) {
    case 'price':
      return <span className="text-muted">—</span>;
    case 'planReceipt':
      return <QuantityRead value={totals.planReceiptQuantity} unit={unit} />;
    case 'planReceiptCost':
      return (
        <VatMoneyCell
          label="Стоимость прихода"
          withVat={totals.planReceiptCost.withVat}
          exVat={totals.planReceiptCost.exVat}
        />
      );
    case 'min':
      return <QuantityRead value={totals.minQuantity} unit={unit} />;
    case 'max':
      return <QuantityRead value={totals.maxQuantity} unit={unit} />;
    case 'normDeviation':
      return (
        <MaterialNormDeviation
          belowMinQuantity={totals.belowMinQuantity}
          aboveMaxQuantity={totals.aboveMaxQuantity}
          unit={unit}
        />
      );
    case 'recommended':
      return <QuantityRead value={totals.recommendedReceiptQuantity} unit={unit} />;
    default:
      return null;
  }
}
