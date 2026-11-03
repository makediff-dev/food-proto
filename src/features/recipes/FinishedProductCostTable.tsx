'use client';

import Link from 'next/link';
import { useState } from 'react';

import type { FinishedProductCostRow, FinishedProductCostSection } from '@/domain/finished-product-cost';
import { recipesFinishedCostDetailHref } from '@/features/recipes/paths';
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
  Empty,
  entityNameRowClassName,
  keepWithNext,
  nameHeadingClassName,
  ProductIndex,
  stickyHeadClassName,
  tableBorder,
  tableClassName,
  tableFrameClassName,
  VatMoneyCell,
} from '@/features/table';

type ColumnKey =
  | 'planCostPerPiece'
  | 'factCostPerPiece'
  | 'costPerPieceDeviation'
  | 'planCostPerKg'
  | 'factCostPerKg'
  | 'costPerKgDeviation';

const COLUMN_GROUPS: { label: string; columns: { key: ColumnKey; label: string; hint?: string }[] }[] = [
  {
    label: 'Себестоимость за шт',
    columns: [
      { key: 'planCostPerPiece', label: 'План', hint: 'По плановым ценам сырья, Rec&Calc Final Products' },
      { key: 'factCostPerPiece', label: 'Факт', hint: 'По фактическим ценам расхода сырья' },
      { key: 'costPerPieceDeviation', label: 'Откл.' },
    ],
  },
  {
    label: 'Себестоимость за кг',
    columns: [
      {
        key: 'planCostPerKg',
        label: 'План',
        hint: 'Если задан вес партии: стоимость партии / кг',
      },
      { key: 'factCostPerKg', label: 'Факт' },
      { key: 'costPerKgDeviation', label: 'Откл.' },
    ],
  },
];

const COLUMNS = COLUMN_GROUPS.flatMap((group) => group.columns);

const GROUP_END_KEYS = new Set<ColumnKey>(['costPerPieceDeviation', 'costPerKgDeviation']);

const COLUMN_KIND: Record<ColumnKey, CellKind> = {
  planCostPerPiece: 'computed',
  factCostPerPiece: 'computed',
  costPerPieceDeviation: 'computed',
  planCostPerKg: 'computed',
  factCostPerKg: 'computed',
  costPerKgDeviation: 'computed',
};

function columnEdgeClass(key: ColumnKey): string {
  return GROUP_END_KEYS.has(key) ? tableBorder.rightThick : columnDividerClassName;
}

export function FinishedProductCostTable({
  sections,
  month,
  currentMonth,
}: {
  sections: readonly FinishedProductCostSection[];
  month: string;
  currentMonth: string;
}) {
  return (
    <div className={tableFrameClassName}>
      <table className={tableClassName}>
        <caption className="sr-only">Себестоимость готовой продукции: план и факт за штуку и за килограмм</caption>
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
              Товар
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
            <WarehouseBlock key={section.warehouseId} section={section} month={month} currentMonth={currentMonth} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WarehouseBlock({
  section,
  month,
  currentMonth,
}: {
  section: FinishedProductCostSection;
  month: string;
  currentMonth: string;
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
            className={`w-px border-b border-b-line px-2 py-2 text-right align-middle ${categoryBandClassName} ${columnEdgeClass(column.key)}`}
          />
        ))}
      </tr>
      {open
        ? section.rows.map((row, index) => (
            <CostRow key={row.productId} row={row} index={index + 1} month={month} currentMonth={currentMonth} />
          ))
        : null}
    </>
  );
}

function CostRow({
  row,
  index,
  month,
  currentMonth,
}: {
  row: FinishedProductCostRow;
  index: number;
  month: string;
  currentMonth: string;
}) {
  const href = recipesFinishedCostDetailHref(row.productId, { month, currentMonth });

  return (
    <tr>
      <th scope="row" className={entityNameRowClassName('repeated')}>
        <Link
          href={href}
          className="inline-flex w-full min-w-0 items-center gap-2 outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <ProductIndex index={index} />
          <span className="min-w-0 flex-1 text-left text-sm leading-none text-ink">{row.name}</span>
        </Link>
      </th>
      {COLUMNS.map((column) => (
        <td
          key={column.key}
          className={`w-px border-b border-b-line px-2 py-2 text-right align-middle ${cellKindClassName[COLUMN_KIND[column.key]]} ${columnEdgeClass(column.key)}`}
        >
          <CostCell column={column.key} row={row} />
        </td>
      ))}
    </tr>
  );
}

function CostCell({ column, row }: { column: ColumnKey; row: FinishedProductCostRow }) {
  switch (column) {
    case 'planCostPerPiece':
      return (
        <VatMoneyCell label="План за шт" withVat={row.planCostPerPiece.withVat} exVat={row.planCostPerPiece.exVat} />
      );
    case 'factCostPerPiece':
      return (
        <VatMoneyCell label="Факт за шт" withVat={row.factCostPerPiece.withVat} exVat={row.factCostPerPiece.exVat} />
      );
    case 'costPerPieceDeviation':
      return (
        <VatMoneyCell
          label="Откл. за шт"
          withVat={row.costPerPieceDeviation.withVat}
          exVat={row.costPerPieceDeviation.exVat}
          signed
        />
      );
    case 'planCostPerKg':
      return row.planCostPerKg ? (
        <VatMoneyCell label="План за кг" withVat={row.planCostPerKg.withVat} exVat={row.planCostPerKg.exVat} />
      ) : (
        <Empty />
      );
    case 'factCostPerKg':
      return row.factCostPerKg ? (
        <VatMoneyCell label="Факт за кг" withVat={row.factCostPerKg.withVat} exVat={row.factCostPerKg.exVat} />
      ) : (
        <Empty />
      );
    case 'costPerKgDeviation':
      return row.costPerKgDeviation ? (
        <VatMoneyCell
          label="Откл. за кг"
          withVat={row.costPerKgDeviation.withVat}
          exVat={row.costPerKgDeviation.exVat}
          signed
        />
      ) : (
        <Empty />
      );
  }
}
