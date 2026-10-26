'use client';

import { useState } from 'react';

import type { DerivativeMovementRow, DerivativeMovementSection } from '@/domain/derivative-movement';
import { QuantityRead } from '@/features/materials/QuantityCell';
import { IconChevronDown, IconChevronRight } from '@/features/shell/Icons';
import {
  blockCornerClassName,
  blockHeadingClassName,
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

type ColumnKey = 'planConsumption' | 'factConsumption';

const COLUMN_GROUPS: { label: string; columns: { key: ColumnKey; label: string; hint: string }[] }[] = [
  {
    label: 'План расхода',
    columns: [
      {
        key: 'planConsumption',
        label: 'Кол-во',
        hint: 'Количество, необходимое для продаж по плану',
      },
    ],
  },
  {
    label: 'Факт расхода',
    columns: [
      {
        key: 'factConsumption',
        label: 'Кол-во',
        hint: 'Количество, необходимое для фактических продаж',
      },
    ],
  },
];

const COLUMNS = COLUMN_GROUPS.flatMap((group) => group.columns);
const GROUP_END_KEYS = new Set(COLUMN_GROUPS.slice(0, -1).map((group) => group.columns.at(-1)?.key));

function columnEdgeClass(key: ColumnKey): string {
  return GROUP_END_KEYS.has(key) ? tableBorder.rightThick : columnDividerClassName;
}

export function DerivativeMovementSummaryTable({ sections }: { sections: readonly DerivativeMovementSection[] }) {
  return (
    <div className={tableFrameClassName}>
      <table className={tableClassName}>
        <caption className="sr-only">Движение производных: план и факт расхода</caption>
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
            <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
              Производная
            </th>
            {COLUMNS.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`${columnHeadingClassName} last:border-r-0 ${columnEdgeClass(column.key)}`}
              >
                <ColumnLabel label={column.label} hint={column.hint} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sections.map((section) => (
            <WorkshopBlock key={section.workshopId} section={section} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WorkshopBlock({ section }: { section: DerivativeMovementSection }) {
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
            className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${categoryBandClassName} ${columnEdgeClass(column.key)}`}
          />
        ))}
      </tr>
      {open
        ? section.rows.map((row, index) => <DerivativeRow key={row.derivativeId} row={row} index={index + 1} />)
        : null}
    </>
  );
}

function DerivativeRow({ row, index }: { row: DerivativeMovementRow; index: number }) {
  return (
    <tr>
      <th scope="row" className={entityNameRowClassName('repeated')}>
        <div className="flex items-center gap-2">
          <ProductIndex index={index} />
          <span className="flex h-8 min-w-max items-center text-sm leading-none text-ink">{row.name}</span>
        </div>
      </th>
      {COLUMNS.map((column) => (
        <td
          key={`row:${column.key}`}
          className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${cellKindClassName.computed} ${columnEdgeClass(column.key)}`}
        >
          <QuantityRead
            value={column.key === 'planConsumption' ? row.planConsumptionQuantity : row.factConsumptionQuantity}
            unit={row.unit}
          />
        </td>
      ))}
    </tr>
  );
}
