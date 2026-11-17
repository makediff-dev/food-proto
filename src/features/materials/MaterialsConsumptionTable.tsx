'use client';

import { useMemo, useState } from 'react';

import {
  MATERIAL_GROUPS,
  MATERIAL_WAREHOUSES,
  type Material,
  type MaterialGroupId,
  type MaterialWarehouseId,
  type PrototypeDocument,
} from '@/domain/document';
import {
  calculatedConsumptionQuantityForMaterialDay,
  materialsList,
  realConsumptionQuantityForMaterialDay,
} from '@/domain/materials';
import { QuantityCell, QuantityRead } from '@/features/materials/QuantityCell';
import { IconChevronDown, IconChevronRight } from '@/features/shell/Icons';
import {
  ColumnLabel,
  categoryBandClassName,
  categoryNameClassName,
  categoryNameRowClassName,
  cellKindClassName,
  columnDividerClassName,
  columnHeadingClassName,
  entityNameRowClassName,
  nameHeadingClassName,
  ProductIndex,
  stickyHeadClassName,
  tableBorder,
  tableClassName,
  tableFrameClassName,
} from '@/features/table';

type ConsumptionLine = {
  id: string;
  name: string;
  unit: Material['unit'];
  deleted: boolean;
  calculated: number;
  realDay: number;
};

type ConsumptionSection = {
  key: string;
  label: string;
  warehouseId: MaterialWarehouseId;
  rows: ConsumptionLine[];
};

const iconButtonClassName =
  'inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';

const valueHead = `${columnHeadingClassName} ${columnDividerClassName}`;
const valueCell = `w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`;
const valueEnd = `w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${tableBorder.rightThick}`;
const bandCell = `${valueCell} ${categoryBandClassName}`;
const bandEnd = `${valueEnd} ${categoryBandClassName}`;

function inputKind(editable: boolean): 'assigned' | 'computed' {
  return editable ? 'assigned' : 'computed';
}

function dayGridMaterials(
  document: PrototypeDocument,
  groupId: MaterialGroupId,
  warehouseId: MaterialWarehouseId,
  occurredOn: string,
): Material[] {
  const materials = materialsList(document).filter(
    (item) => item.groupId === groupId && item.warehouseId === warehouseId,
  );
  const active = materials.filter((item) => item.deletedAt === null);
  const archived = materials.filter(
    (item) =>
      item.deletedAt !== null &&
      realConsumptionQuantityForMaterialDay(document, occurredOn, warehouseId, item.id) !== 0,
  );
  return [...active, ...archived];
}

function buildSections(document: PrototypeDocument, day: string): ConsumptionSection[] {
  return MATERIAL_GROUPS.flatMap((group) =>
    MATERIAL_WAREHOUSES.map((warehouse) => ({
      key: `${group.id}:${warehouse.id}`,
      label: `${group.name}, ${warehouse.name}`,
      warehouseId: warehouse.id,
      rows: dayGridMaterials(document, group.id, warehouse.id, day).map((row) => ({
        id: row.id,
        name: row.name,
        unit: row.unit,
        deleted: row.deletedAt !== null,
        calculated: calculatedConsumptionQuantityForMaterialDay(document, day, row.id),
        realDay: realConsumptionQuantityForMaterialDay(document, day, warehouse.id, row.id),
      })),
    })),
  );
}

export function MaterialsConsumptionTable({
  document,
  day,
  editable,
  onReal,
}: {
  document: PrototypeDocument;
  day: string;
  editable: boolean;
  onReal: (warehouseId: MaterialWarehouseId, materialId: string, quantity: number) => string | null;
}) {
  const sections = useMemo(() => buildSections(document, day), [document, day]);

  return (
    <div className={tableFrameClassName}>
      <table className={tableClassName}>
        <caption className="sr-only">{`Расход в производстве, ${day}`}</caption>
        <thead className={stickyHeadClassName}>
          <tr>
            <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
              <ColumnLabel label="Наименование" />
            </th>
            <th scope="col" className={valueHead}>
              <ColumnLabel label="Расчёт" hint="Количество по рецепту на выпуск этого дня" />
            </th>
            <th scope="col" className={`${columnHeadingClassName} ${tableBorder.rightThick}`}>
              <ColumnLabel label="Реальный" />
            </th>
          </tr>
        </thead>
        <tbody>
          {sections.map((section) => (
            <SectionBlock key={section.key} section={section} editable={editable} onReal={onReal} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionBlock({
  section,
  editable,
  onReal,
}: {
  section: ConsumptionSection;
  editable: boolean;
  onReal: (warehouseId: MaterialWarehouseId, materialId: string, quantity: number) => string | null;
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
        <td className={bandCell} />
        <td className={bandEnd} />
      </tr>
      {open && count === 0 ? (
        <tr>
          <th scope="row" className={entityNameRowClassName('repeated')}>
            <span className="text-sm text-muted">Позиций нет. Добавьте наименование во вводе плана.</span>
          </th>
          <td className={`${valueCell} ${cellKindClassName.computed}`} />
          <td className={`${valueEnd} ${cellKindClassName.computed}`} />
        </tr>
      ) : null}
      {open
        ? section.rows.map((row, index) => (
            <MaterialRow
              key={row.id}
              row={row}
              index={index + 1}
              editable={editable && !row.deleted}
              onReal={(quantity) => onReal(section.warehouseId, row.id, quantity)}
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
  onReal,
}: {
  row: ConsumptionLine;
  index: number;
  editable: boolean;
  onReal: (quantity: number) => string | null;
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
      <td className={`${valueCell} ${cellKindClassName.computed}`}>
        <QuantityRead value={row.calculated} unit={row.unit} />
      </td>
      <td className={`${valueEnd} ${cellKindClassName[inputKind(editable)]}`}>
        {editable ? (
          <QuantityCell
            label={`Реальный расход, ${row.name}`}
            value={row.realDay}
            unit={row.unit}
            blankIfZero
            onChange={onReal}
          />
        ) : (
          <QuantityRead value={row.realDay} unit={row.unit} />
        )}
      </td>
    </tr>
  );
}
