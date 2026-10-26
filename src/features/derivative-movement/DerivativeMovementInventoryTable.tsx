'use client';

import { useState } from 'react';

import type { DerivativeMovementRow, DerivativeMovementSection } from '@/domain/derivative-movement';
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
  stickyHeadClassName,
  tableBorder,
  tableClassName,
  tableFrameClassName,
} from '@/features/table';

export function DerivativeMovementInventoryTable({
  sections,
  editable,
  onClosing,
}: {
  sections: readonly DerivativeMovementSection[];
  editable: boolean;
  onClosing: (derivativeId: string, quantity: number) => string | null;
}) {
  return (
    <div className={tableFrameClassName}>
      <table className={tableClassName}>
        <caption className="sr-only">Инвентаризация производных: остаток на конец</caption>
        <thead className={stickyHeadClassName}>
          <tr>
            <th className={`sticky left-0 z-40 ${blockCornerClassName} ${tableBorder.rightThick}`} />
            <th scope="colgroup" className={blockHeadingClassName}>
              {keepWithNext('Остаток на конец')}
            </th>
          </tr>
          <tr>
            <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
              Производная
            </th>
            <th scope="col" className={`${columnHeadingClassName} last:border-r-0 ${tableBorder.rightThin}`}>
              {keepWithNext('Факт')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sections.map((section) => (
            <WorkshopBlock key={section.workshopId} section={section} editable={editable} onClosing={onClosing} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WorkshopBlock({
  section,
  editable,
  onClosing,
}: {
  section: DerivativeMovementSection;
  editable: boolean;
  onClosing: (derivativeId: string, quantity: number) => string | null;
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
        <td
          className={`w-px border-b border-b-line px-2 py-2 text-right align-middle ${categoryBandClassName} ${columnDividerClassName}`}
        />
      </tr>
      {open
        ? section.rows.map((row, index) => (
            <DerivativeRow
              key={row.derivativeId}
              row={row}
              index={index + 1}
              editable={editable}
              onClosing={onClosing}
            />
          ))
        : null}
    </>
  );
}

function DerivativeRow({
  row,
  index,
  editable,
  onClosing,
}: {
  row: DerivativeMovementRow;
  index: number;
  editable: boolean;
  onClosing: (derivativeId: string, quantity: number) => string | null;
}) {
  const canEdit = editable && !row.deleted;

  return (
    <tr>
      <th scope="row" className={entityNameRowClassName('repeated')}>
        <div className="flex items-center gap-2">
          <ProductIndex index={index} />
          <span className="flex h-8 min-w-max items-center text-sm leading-none text-ink">{row.name}</span>
          {row.deleted ? <span className="text-sm text-muted">(архив)</span> : null}
        </div>
      </th>
      <td
        className={`w-px border-b border-b-line px-2 py-2 text-right align-middle ${columnDividerClassName} ${cellKindClassName.assigned}`}
      >
        {canEdit ? (
          <QuantityCell
            label={`Остаток на конец ${row.name}`}
            value={row.inventoryClosingQuantity}
            unit={row.unit}
            allowNegative
            onChange={(value) => onClosing(row.derivativeId, value)}
          />
        ) : (
          <QuantityRead value={row.inventoryClosingQuantity} unit={row.unit} signed />
        )}
      </td>
    </tr>
  );
}
