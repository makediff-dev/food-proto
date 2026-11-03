'use client';

import Link from 'next/link';
import { useState } from 'react';

import type { DerivativeCostRow, DerivativeCostSection } from '@/domain/derivative-cost';
import { recipesCostDetailHref } from '@/features/recipes/paths';
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
  | 'planCostPerKg'
  | 'factCostPerKg'
  | 'costPerKgDeviation'
  | 'planCostPerPiece'
  | 'factCostPerPiece'
  | 'costPerPieceDeviation';

const COLUMN_GROUPS: { label: string; columns: { key: ColumnKey; label: string; hint?: string }[] }[] = [
  {
    label: 'Себестоимость за кг',
    columns: [
      { key: 'planCostPerKg', label: 'План', hint: 'По плановым ценам сырья, Rec&Calc' },
      { key: 'factCostPerKg', label: 'Факт', hint: 'По фактическим ценам расхода сырья' },
      { key: 'costPerKgDeviation', label: 'Откл.' },
    ],
  },
  {
    label: 'Себестоимость за шт',
    columns: [
      {
        key: 'planCostPerPiece',
        label: 'План',
        hint: 'Если задан вес единицы: ₽/кг × г/1000',
      },
      { key: 'factCostPerPiece', label: 'Факт' },
      { key: 'costPerPieceDeviation', label: 'Откл.' },
    ],
  },
];

const COLUMNS = COLUMN_GROUPS.flatMap((group) => group.columns);

const GROUP_END_KEYS = new Set<ColumnKey>(['costPerKgDeviation', 'costPerPieceDeviation']);

const COLUMN_KIND: Record<ColumnKey, CellKind> = {
  planCostPerKg: 'computed',
  factCostPerKg: 'computed',
  costPerKgDeviation: 'computed',
  planCostPerPiece: 'computed',
  factCostPerPiece: 'computed',
  costPerPieceDeviation: 'computed',
};

function columnEdgeClass(key: ColumnKey): string {
  return GROUP_END_KEYS.has(key) ? tableBorder.rightThick : columnDividerClassName;
}

export function DerivativeCostTable({
  sections,
  month,
  currentMonth,
}: {
  sections: readonly DerivativeCostSection[];
  month: string;
  currentMonth: string;
}) {
  return (
    <div className={tableFrameClassName}>
      <table className={tableClassName}>
        <caption className="sr-only">Себестоимость производных: план и факт за килограмм и за штуку</caption>
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
            <WorkshopBlock key={section.workshopId} section={section} month={month} currentMonth={currentMonth} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WorkshopBlock({
  section,
  month,
  currentMonth,
}: {
  section: DerivativeCostSection;
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
            <CostRow key={row.derivativeId} row={row} index={index + 1} month={month} currentMonth={currentMonth} />
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
  row: DerivativeCostRow;
  index: number;
  month: string;
  currentMonth: string;
}) {
  const href = recipesCostDetailHref(row.derivativeId, { month, currentMonth });

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

function CostCell({ column, row }: { column: ColumnKey; row: DerivativeCostRow }) {
  switch (column) {
    case 'planCostPerKg':
      return <VatMoneyCell label="План за кг" withVat={row.planCostPerKg.withVat} exVat={row.planCostPerKg.exVat} />;
    case 'factCostPerKg':
      return <VatMoneyCell label="Факт за кг" withVat={row.factCostPerKg.withVat} exVat={row.factCostPerKg.exVat} />;
    case 'costPerKgDeviation':
      return (
        <VatMoneyCell
          label="Откл. за кг"
          withVat={row.costPerKgDeviation.withVat}
          exVat={row.costPerKgDeviation.exVat}
          signed
        />
      );
    case 'planCostPerPiece':
      return row.planCostPerPiece ? (
        <VatMoneyCell label="План за шт" withVat={row.planCostPerPiece.withVat} exVat={row.planCostPerPiece.exVat} />
      ) : (
        <Empty />
      );
    case 'factCostPerPiece':
      return row.factCostPerPiece ? (
        <VatMoneyCell label="Факт за шт" withVat={row.factCostPerPiece.withVat} exVat={row.factCostPerPiece.exVat} />
      ) : (
        <Empty />
      );
    case 'costPerPieceDeviation':
      return row.costPerPieceDeviation ? (
        <VatMoneyCell
          label="Откл. за шт"
          withVat={row.costPerPieceDeviation.withVat}
          exVat={row.costPerPieceDeviation.exVat}
          signed
        />
      ) : (
        <Empty />
      );
  }
}
