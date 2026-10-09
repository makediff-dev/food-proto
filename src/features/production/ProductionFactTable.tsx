'use client';

import { type ReactNode, useState } from 'react';

import type {
  ProductionFactGroup,
  ProductionFactRow,
  ProductionFactSide,
  ProductionFactVariance,
} from '@/domain/production-fact';
import type { SummaryLens } from '@/domain/summary';
import { formatPieces } from '@/features/sales/text';
import { IconChevronDown, IconChevronRight } from '@/features/shell/Icons';
import {
  ColumnLabel,
  keepWithNext,
  Muted,
  stickyHeadClassName,
  TableNumber,
  tableBorder,
  tableClassName,
  tableFrameClassName,
  tableFrameExpandedClassName,
  VatMoneyCell,
} from '@/features/table';

type ColumnKey = 'unitCost' | 'volume' | 'volumeCost';
type SectionKind = 'plan' | 'fact' | 'variance';

const COLUMNS: { key: ColumnKey; label: string }[] = [
  { key: 'unitCost', label: 'Себест' },
  { key: 'volume', label: 'Объём' },
  { key: 'volumeCost', label: 'Себест объёма' },
];

const LAST_COLUMN = COLUMNS.at(-1)?.key;

function sectionRightClass(kind: SectionKind, key: ColumnKey): string {
  if (kind !== 'variance' && key === LAST_COLUMN) {
    return tableBorder.rightThick;
  }

  return tableBorder.rightThin;
}

export function ProductionFactTable({
  groups,
  plan,
  fact,
  variance,
  view,
  periodClosed = false,
  expanded = false,
}: {
  groups: ProductionFactGroup[];
  plan: ProductionFactSide;
  fact: ProductionFactSide;
  variance: ProductionFactVariance;
  view: SummaryLens;
  periodClosed?: boolean;
  expanded?: boolean;
}) {
  const factIsForecast = view === 'forecast' && !periodClosed;
  const planHeader = view === 'current' ? 'Плановые показатели (корр.)' : 'Плановые показатели';
  const caption =
    view === 'current'
      ? 'Производство: план (корр.), факт и отклонение'
      : factIsForecast
        ? 'Производство: план, факт (прогноз) и отклонение'
        : 'Производство: план, факт и отклонение';

  return (
    <div className={expanded ? tableFrameExpandedClassName : tableFrameClassName}>
      <table className={tableClassName}>
        <caption className="sr-only">{caption}</caption>
        <thead className={stickyHeadClassName}>
          <tr>
            <th className={`sticky left-0 z-40 ${tableBorder.bottomThin} ${tableBorder.rightThick} bg-paper`} />
            <SectionHeading label={planHeader} />
            <SectionHeading label={factIsForecast ? 'Фактические показатели (прогноз)' : 'Фактические показатели'} />
            <SectionHeading label="Отклонение" last />
          </tr>
          <tr>
            <th
              scope="col"
              className={`sticky left-0 z-40 w-px max-w-max whitespace-nowrap ${tableBorder.bottomThin} ${tableBorder.rightThick} bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-muted`}
            >
              Товар
            </th>
            <ColumnHeadings kind="plan" />
            <ColumnHeadings kind="fact" />
            <ColumnHeadings kind="variance" />
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <CategoryBlock key={group.categoryId} group={group} />
          ))}
          <tr>
            <th
              scope="row"
              className="sticky left-0 z-10 w-px max-w-max whitespace-nowrap border-t-[1.5px] border-t-muted border-b border-b-line border-r-[1.5px] border-r-muted bg-paper px-3 py-2 text-left align-middle font-normal text-ink"
            >
              Всего
            </th>
            <SideCells kind="plan" side={plan} total />
            <SideCells kind="fact" side={fact} total />
            <VarianceCells variance={variance} total />
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function CategoryBlock({ group }: { group: ProductionFactGroup }) {
  const [open, setOpen] = useState(false);
  const productCount = group.rows.length;

  return (
    <>
      <tr>
        <th
          scope="row"
          className="sticky left-0 z-10 w-px max-w-max whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted bg-paper px-3 py-2 text-left align-middle font-normal text-ink"
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
            <span className="flex h-8 min-w-max flex-1 items-center text-sm font-semibold leading-none text-ink">
              {group.name} ({productCount})
            </span>
            {group.deleted ? <span className="text-sm text-muted">(архив)</span> : null}
          </div>
        </th>
        <SideCells kind="plan" side={group.plan} />
        <SideCells kind="fact" side={group.fact} />
        <VarianceCells variance={group.variance} />
      </tr>
      {open ? group.rows.map((row) => <ProductRow key={row.productId} row={row} />) : null}
    </>
  );
}

function ProductRow({ row }: { row: ProductionFactRow }) {
  return (
    <tr>
      <th
        scope="row"
        className="sticky left-0 z-10 w-px max-w-max whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted bg-sheet px-3 py-2 pl-8 text-left align-middle font-normal"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-8 min-w-max flex-1 items-center text-sm leading-none text-ink">{row.name}</span>
          {row.deleted ? <span className="text-sm text-muted">(архив)</span> : null}
        </div>
      </th>
      <ProductSideCells kind="plan" row={row} />
      <ProductSideCells kind="fact" row={row} />
      <ProductVarianceCells row={row} />
    </tr>
  );
}

function SectionHeading({ label, last = false }: { label: string; last?: boolean }) {
  return (
    <th
      colSpan={COLUMNS.length}
      scope="colgroup"
      className={`${tableBorder.bottomThin} ${last ? '' : tableBorder.rightThick} bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-ink`}
    >
      {keepWithNext(label)}
    </th>
  );
}

function ColumnHeadings({ kind }: { kind: SectionKind }) {
  return COLUMNS.map((column) => (
    <th
      key={`${kind}:${column.key}`}
      scope="col"
      className={`w-px whitespace-normal border-b border-b-line ${sectionRightClass(kind, column.key)} bg-paper px-1.5 py-2 text-center align-middle text-sm font-normal leading-5 text-muted last:border-r-0`}
    >
      <ColumnLabel label={column.label} />
    </th>
  ));
}

function SideCells({ kind, side, total = false }: { kind: SectionKind; side: ProductionFactSide; total?: boolean }) {
  return COLUMNS.map((column) => (
    <MetricCell key={`${kind}:${column.key}`} kind={kind} column={column.key} total={total}>
      <SideValue column={column.key} side={side} />
    </MetricCell>
  ));
}

function VarianceCells({ variance, total = false }: { variance: ProductionFactVariance; total?: boolean }) {
  return COLUMNS.map((column) => (
    <MetricCell key={`variance:${column.key}`} kind="variance" column={column.key} total={total}>
      <VarianceValue column={column.key} variance={variance} />
    </MetricCell>
  ));
}

function ProductSideCells({ kind, row }: { kind: 'plan' | 'fact'; row: ProductionFactRow }) {
  const side = kind === 'plan' ? row.plan : row.fact;
  return COLUMNS.map((column) => (
    <MetricCell key={`${kind}:${column.key}`} kind={kind} column={column.key} sheet>
      {column.key === 'unitCost' ? (
        row.unitCost ? (
          <VatMoneyCell withVat={row.unitCost.withVat} exVat={row.unitCost.exVat} />
        ) : (
          <Muted>{keepWithNext('Себестоимость не считается')}</Muted>
        )
      ) : (
        <SideValue column={column.key} side={side} />
      )}
    </MetricCell>
  ));
}

function ProductVarianceCells({ row }: { row: ProductionFactRow }) {
  const incomplete = !row.plan.costComplete || !row.fact.costComplete;
  return COLUMNS.map((column) => (
    <MetricCell key={`variance:${column.key}`} kind="variance" column={column.key} sheet>
      {column.key === 'volume' ? (
        <Pieces value={row.variance.volumePieces} signed />
      ) : column.key === 'unitCost' ? (
        row.unitCost ? (
          <VatMoneyCell
            signed
            sense="cost"
            withVat={row.variance.averageCostWithVat}
            exVat={row.variance.averageCostExVat}
          />
        ) : (
          <Muted>{keepWithNext('Себестоимость не считается')}</Muted>
        )
      ) : incomplete ? (
        <Muted>{keepWithNext('не по всем товарам')}</Muted>
      ) : (
        <VatMoneyCell
          signed
          sense="cost"
          withVat={row.variance.volumeCostWithVat}
          exVat={row.variance.volumeCostExVat}
        />
      )}
    </MetricCell>
  ));
}

function SideValue({ column, side }: { column: ColumnKey; side: ProductionFactSide }) {
  if (column === 'volume') {
    return <Pieces value={side.volumePieces} />;
  }

  if (!side.costComplete) {
    return <Muted>{keepWithNext('не по всем товарам')}</Muted>;
  }

  if (column === 'unitCost') {
    return <VatMoneyCell withVat={side.averageCostWithVat} exVat={side.averageCostExVat} />;
  }

  return <VatMoneyCell withVat={side.volumeCostWithVat} exVat={side.volumeCostExVat} />;
}

function VarianceValue({ column, variance }: { column: ColumnKey; variance: ProductionFactVariance }) {
  if (column === 'volume') {
    return <Pieces value={variance.volumePieces} signed />;
  }

  if (column === 'unitCost') {
    if (variance.volumeCostWithVat === null || variance.volumeCostExVat === null) {
      return <Muted>{keepWithNext('не по всем товарам')}</Muted>;
    }

    return <VatMoneyCell signed sense="cost" withVat={variance.averageCostWithVat} exVat={variance.averageCostExVat} />;
  }

  if (variance.volumeCostWithVat === null || variance.volumeCostExVat === null) {
    return <Muted>{keepWithNext('не по всем товарам')}</Muted>;
  }

  return <VatMoneyCell signed sense="cost" withVat={variance.volumeCostWithVat} exVat={variance.volumeCostExVat} />;
}

function Pieces({ value, signed = false }: { value: number; signed?: boolean }) {
  return (
    <TableNumber value={value} signed={signed}>
      {formatPieces(value)} шт
    </TableNumber>
  );
}

function MetricCell({
  kind,
  column,
  total = false,
  sheet = false,
  children,
}: {
  kind: SectionKind;
  column: ColumnKey;
  total?: boolean;
  sheet?: boolean;
  children: ReactNode;
}) {
  const bg = sheet ? 'bg-sheet' : 'bg-paper';
  const top = total ? 'border-t-[1.5px] border-t-muted' : '';

  return (
    <td
      className={`w-px ${top} border-b border-b-line ${sectionRightClass(kind, column)} ${bg} px-1.5 py-2 text-right align-middle last:border-r-0`}
    >
      {children}
    </td>
  );
}
