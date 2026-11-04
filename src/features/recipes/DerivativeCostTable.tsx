'use client';

import { useMemo, useState } from 'react';

import { useDocumentStore } from '@/data/DocumentProvider';
import { type DerivativeCostRow, type DerivativeCostSection, derivativeCostDetail } from '@/domain/derivative-cost';
import { type RecipeCostDetailExtraUnitRow } from '@/features/recipes/RecipeCostDetailTable';
import { RecipeCostExpandedDetail } from '@/features/recipes/RecipeCostExpandedDetail';
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
  ExVatMoneyCell,
  entityNameRowClassName,
  keepWithNext,
  nameHeadingClassName,
  ProductIndex,
  stickyHeadClassName,
  tableBorder,
  tableClassName,
  tableFrameClassName,
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

const DETAIL_COL_SPAN = COLUMNS.length + 1;

function columnEdgeClass(key: ColumnKey): string {
  return GROUP_END_KEYS.has(key) ? tableBorder.rightThick : columnDividerClassName;
}

export function DerivativeCostTable({
  sections,
  month,
}: {
  sections: readonly DerivativeCostSection[];
  month: string;
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
            <WorkshopBlock key={section.workshopId} section={section} month={month} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WorkshopBlock({ section, month }: { section: DerivativeCostSection; month: string }) {
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
        ? section.rows.map((row, index) => <CostRow key={row.derivativeId} row={row} index={index + 1} month={month} />)
        : null}
    </>
  );
}

function CostRow({ row, index, month }: { row: DerivativeCostRow; index: number; month: string }) {
  const [open, setOpen] = useState(false);
  const store = useDocumentStore();
  const detail = useMemo(
    () => (open ? derivativeCostDetail(store.document, row.derivativeId, month) : null),
    [open, store.document, row.derivativeId, month],
  );

  const extraUnitRows: RecipeCostDetailExtraUnitRow[] = [];
  if (detail?.hasPieceCost && detail.planCostPerPiece && detail.factCostPerPiece && detail.costPerPieceDeviation) {
    extraUnitRows.push({
      label: 'За шт',
      plan: detail.planCostPerPiece,
      fact: detail.factCostPerPiece,
      deviation: detail.costPerPieceDeviation,
    });
  }

  return (
    <>
      <tr>
        <th scope="row" className={entityNameRowClassName('repeated')}>
          <div className="flex w-full min-w-0 items-center gap-2">
            <button
              type="button"
              aria-expanded={open}
              aria-label={open ? `Свернуть состав ${row.name}` : `Развернуть состав ${row.name}`}
              title={open ? 'Свернуть состав' : 'Развернуть состав'}
              onClick={() => setOpen((current) => !current)}
              className="inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {open ? <IconChevronDown /> : <IconChevronRight />}
            </button>
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpen((current) => !current)}
              className="inline-flex min-w-0 flex-1 items-center gap-2 text-left outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <ProductIndex index={index} />
              <span className="min-w-0 flex-1 text-sm leading-none text-ink">{row.name}</span>
            </button>
          </div>
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
      {open ? (
        <tr>
          <td colSpan={DETAIL_COL_SPAN} className="border-b border-b-line bg-sheet p-0">
            {detail ? (
              <RecipeCostExpandedDetail
                name={detail.name}
                lines={detail.lines}
                unitCost={{ plan: detail.planCostPerKg, fact: detail.factCostPerKg }}
                extraUnitRows={extraUnitRows}
              />
            ) : (
              <p className="px-3 py-3 text-sm leading-6 text-muted">Производная не найдена.</p>
            )}
          </td>
        </tr>
      ) : null}
    </>
  );
}

function CostCell({ column, row }: { column: ColumnKey; row: DerivativeCostRow }) {
  switch (column) {
    case 'planCostPerKg':
      return <ExVatMoneyCell label="План за кг" value={row.planCostPerKg.exVat} />;
    case 'factCostPerKg':
      return <ExVatMoneyCell label="Факт за кг" value={row.factCostPerKg.exVat} />;
    case 'costPerKgDeviation':
      return <ExVatMoneyCell label="Откл. за кг" value={row.costPerKgDeviation.exVat} signed />;
    case 'planCostPerPiece':
      return row.planCostPerPiece ? (
        <ExVatMoneyCell label="План за шт" value={row.planCostPerPiece.exVat} />
      ) : (
        <Empty />
      );
    case 'factCostPerPiece':
      return row.factCostPerPiece ? (
        <ExVatMoneyCell label="Факт за шт" value={row.factCostPerPiece.exVat} />
      ) : (
        <Empty />
      );
    case 'costPerPieceDeviation':
      return row.costPerPieceDeviation ? (
        <ExVatMoneyCell label="Откл. за шт" value={row.costPerPieceDeviation.exVat} signed />
      ) : (
        <Empty />
      );
  }
}
