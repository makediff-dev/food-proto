'use client';

import type { ReactNode } from 'react';
import type {
  FinishedGoodsDayView,
  FinishedGoodsGroup,
  FinishedGoodsRow,
  FinishedGoodsTotals,
} from '@/domain/finished-goods';
import { adjacentDay } from '@/domain/sales-fact';
import { FinishedGoodsReportColumnHeaders } from '@/features/movement/FinishedGoodsNormativeColumnHeading';
import { NormDeviationCell } from '@/features/movement/NormDeviationCell';
import { formatPieces } from '@/features/sales/text';
import { IconChevronDown, IconChevronRight, IconChevronUp } from '@/features/shell/Icons';
import {
  blockCornerClassName,
  blockHeadingClassName,
  categoryBandClassName,
  categoryNameClassName,
  columnDividerClassName,
  dayDateColumnClassName,
  dayFactSpacerBandClassName,
  dayFactSpacerCellClassName,
  dayFactSpacerHeadClassName,
  dayFactSpacerTotalClassName,
  dayFactTableClassName,
  IntegerCell,
  keepWithNext,
  Muted,
  nameHeadingClassName,
  ProductIndex,
  stickyHeadClassName,
  TableNumber,
  tableBorder,
  tableFrameExpandedClassName,
  totalNameClassName,
  totalValueClassName,
  useOpenCategories,
  VatMoneyCell,
} from '@/features/table';

type ColumnKey =
  | 'opening'
  | 'planPrice'
  | 'openingValue'
  | 'salesPieces'
  | 'salesPrice'
  | 'salesRevenue'
  | 'productionPieces'
  | 'productionPrice'
  | 'productionValue'
  | 'closing'
  | 'min'
  | 'max'
  | 'normDeviation'
  | 'factPrice'
  | 'closingValue';

const COLUMN_GROUPS: { label: string; columns: { key: ColumnKey; label: string }[] }[] = [
  {
    label: 'Остаток на начало',
    columns: [
      { key: 'opening', label: 'Факт' },
      { key: 'planPrice', label: 'Цена' },
      { key: 'openingValue', label: 'Стоимость' },
    ],
  },
  {
    label: 'Продажи',
    columns: [
      { key: 'salesPieces', label: 'Объём' },
      { key: 'salesPrice', label: 'Цена' },
      { key: 'salesRevenue', label: 'Стоимость' },
    ],
  },
  {
    label: 'Производство',
    columns: [
      { key: 'productionPieces', label: 'Объём' },
      { key: 'productionPrice', label: 'Себест.' },
      { key: 'productionValue', label: 'Стоимость' },
    ],
  },
  {
    label: 'Остаток на конец',
    columns: [
      { key: 'closing', label: 'Остаток' },
      { key: 'min', label: 'Мин.' },
      { key: 'max', label: 'Макс.' },
      { key: 'normDeviation', label: 'Откл.' },
      { key: 'factPrice', label: 'Цена' },
      { key: 'closingValue', label: 'Стоимость' },
    ],
  },
];

const COLUMNS = COLUMN_GROUPS.flatMap((group) => group.columns);

const GROUP_END_KEYS = new Set(COLUMN_GROUPS.slice(0, -1).map((group) => group.columns[group.columns.length - 1].key));

function groupEndClass(key: ColumnKey): string {
  return GROUP_END_KEYS.has(key) ? tableBorder.rightThick : columnDividerClassName;
}

export function FinishedGoodsFactTable({
  days,
  showDayArrows,
  onDay,
  expanded = false,
}: {
  days: FinishedGoodsDayView[];
  showDayArrows: boolean;
  onDay: (day: string) => void;
  expanded?: boolean;
}) {
  const { toggleCategory, categoryOpen } = useOpenCategories();

  return (
    <div
      className={
        expanded
          ? tableFrameExpandedClassName
          : 'h-full min-h-0 contain-paint overflow-auto border border-line bg-sheet'
      }
    >
      <table className={dayFactTableClassName}>
        <caption className="sr-only">Отчет подневный: движение готовой продукции по дням</caption>
        <thead className={stickyHeadClassName}>
          <tr>
            <th colSpan={2} className={`sticky left-0 z-40 ${blockCornerClassName} ${tableBorder.rightThick}`} />
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
            <th aria-hidden className="w-full min-w-0 border-b-[3px] border-b-muted bg-paper p-0" />
          </tr>
          <tr>
            <th
              rowSpan={2}
              scope="col"
              className={`sticky left-0 z-40 ${dayDateColumnClassName} border-y-[3px] border-y-muted ${tableBorder.rightThin} bg-paper p-0`}
            >
              <span className="sr-only">Дата</span>
            </th>
            <th rowSpan={2} scope="col" className={`sticky left-10 z-40 ${nameHeadingClassName}`}>
              Товар
            </th>
            <FinishedGoodsReportColumnHeaders row="primary" columns={COLUMNS} groupEndClass={groupEndClass} />
            <th rowSpan={2} aria-hidden className={dayFactSpacerHeadClassName} />
          </tr>
          <tr>
            <FinishedGoodsReportColumnHeaders row="secondary" columns={COLUMNS} groupEndClass={groupEndClass} />
          </tr>
        </thead>
        {days.map((day, dayIndex) => {
          const dayBreak = days.length > 1 && dayIndex < days.length - 1;
          const dateCell = (
            <th
              scope="rowgroup"
              rowSpan={visibleDayRows(day.groups, categoryOpen)}
              className={`sticky left-0 z-10 h-px ${dayDateColumnClassName} border-r border-r-line bg-sheet p-0 align-middle font-normal ${
                dayBreak ? 'border-b-[3px] border-b-muted' : 'border-b border-b-line'
              }`}
            >
              <DayLabel occurredOn={day.occurredOn} showArrows={showDayArrows} onDay={onDay} />
            </th>
          );
          return (
            <tbody key={day.occurredOn}>
              {day.groups.map((group, groupIndex) => (
                <CategoryBlock
                  key={group.categoryId}
                  group={group}
                  open={categoryOpen(group.categoryId)}
                  dateCell={groupIndex === 0 ? dateCell : null}
                  dayBreak={dayBreak}
                  onToggle={() => toggleCategory(group.categoryId)}
                />
              ))}
              <tr>
                {day.groups.length === 0 ? dateCell : null}
                <th scope="row" className={`sticky left-10 z-10 ${totalNameClassName}`}>
                  Всего
                </th>
                {COLUMNS.map((column) => (
                  <td key={column.key} className={`${totalValueClassName} ${groupEndClass(column.key)}`}>
                    <MetricCell column={column.key} metrics={day.totals} />
                  </td>
                ))}
                <td aria-hidden className={dayFactSpacerTotalClassName} />
              </tr>
            </tbody>
          );
        })}
      </table>
    </div>
  );
}

function visibleDayRows(groups: readonly FinishedGoodsGroup[], categoryOpen: (categoryId: string) => boolean): number {
  return groups.reduce((count, group) => count + 1 + (categoryOpen(group.categoryId) ? group.rows.length : 0), 1);
}

function CategoryBlock({
  group,
  open,
  dateCell,
  dayBreak,
  onToggle,
}: {
  group: FinishedGoodsGroup;
  open: boolean;
  dateCell: ReactNode;
  dayBreak: boolean;
  onToggle: () => void;
}) {
  const productCount = group.rows.length;
  const bottom = dayBreak && !open ? 'border-b-[3px] border-b-muted' : 'border-b border-b-line';

  return (
    <>
      <tr>
        {dateCell}
        <th
          scope="row"
          className={`sticky left-10 z-10 w-px max-w-max whitespace-nowrap ${bottom} border-r-[1.5px] border-r-muted px-3 py-2 text-left align-middle font-normal text-ink ${categoryBandClassName}`}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-expanded={open}
              aria-label={
                open ? `Свернуть товары категории ${group.name}` : `Развернуть товары категории ${group.name}`
              }
              title={open ? 'Свернуть' : 'Развернуть'}
              onClick={onToggle}
              className="inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {open ? <IconChevronDown /> : <IconChevronRight />}
            </button>
            <span className={categoryNameClassName}>
              {group.name} ({productCount})
            </span>
            {group.deleted ? <span className="text-sm font-normal text-muted">(архив)</span> : null}
          </div>
        </th>
        {COLUMNS.map((column) => (
          <td
            key={column.key}
            className={`w-px ${bottom} px-1.5 py-2 text-right align-middle ${categoryBandClassName} ${groupEndClass(column.key)}`}
          >
            <MetricCell column={column.key} metrics={group.totals} />
          </td>
        ))}
        <td
          aria-hidden
          className={
            dayBreak && !open ? 'w-full min-w-0 border-b-[3px] border-b-muted bg-band p-0' : dayFactSpacerBandClassName
          }
        />
      </tr>
      {open
        ? group.rows.map((row, index) => (
            <ProductRow
              key={row.productId}
              row={row}
              index={index + 1}
              dayBreak={dayBreak && index === group.rows.length - 1}
            />
          ))
        : null}
    </>
  );
}

function ProductRow({ row, index, dayBreak }: { row: FinishedGoodsRow; index: number; dayBreak: boolean }) {
  const bottom = dayBreak ? 'border-b-[3px] border-b-muted' : 'border-b border-b-line';
  return (
    <tr>
      <th
        scope="row"
        className={`sticky left-10 z-10 w-px max-w-max whitespace-nowrap ${bottom} border-r-[1.5px] border-r-muted bg-sheet px-3 py-2 text-left align-middle font-normal`}
      >
        <div className="flex items-center gap-2">
          <ProductIndex index={index} />
          <span className="flex h-8 min-w-max flex-1 items-center text-sm leading-none text-ink">{row.name}</span>
          {row.deleted ? <span className="text-sm text-muted">(архив)</span> : null}
        </div>
      </th>
      {COLUMNS.map((column) => (
        <td
          key={column.key}
          className={`w-px ${bottom} px-1.5 py-2 text-right align-middle ${groupEndClass(column.key)}`}
        >
          <MetricCell column={column.key} metrics={row} />
        </td>
      ))}
      <td
        aria-hidden
        className={dayBreak ? 'w-full min-w-0 border-b-[3px] border-b-muted bg-sheet p-0' : dayFactSpacerCellClassName}
      />
    </tr>
  );
}

function MetricCell({ column, metrics }: { column: ColumnKey; metrics: FinishedGoodsTotals }) {
  switch (column) {
    case 'opening':
      return <TableNumber value={metrics.openingPieces}>{formatPieces(metrics.openingPieces)} шт</TableNumber>;
    case 'planPrice':
      return <VatMoneyCell withVat={metrics.openingPriceWithVat} exVat={metrics.openingPriceExVat} />;
    case 'openingValue':
      return <VatMoneyCell withVat={metrics.openingValueWithVat} exVat={metrics.openingValueExVat} />;
    case 'salesPieces':
      return <TableNumber value={metrics.salesPieces}>{formatPieces(metrics.salesPieces)} шт</TableNumber>;
    case 'salesPrice':
      if (!metrics.revenueComplete) {
        return <Muted>{keepWithNext('не по всем товарам')}</Muted>;
      }
      return <VatMoneyCell withVat={metrics.factPriceWithVat} exVat={metrics.factPriceExVat} />;
    case 'salesRevenue':
      if (!metrics.revenueComplete) {
        return <Muted>{keepWithNext('не по всем товарам')}</Muted>;
      }
      return <VatMoneyCell withVat={metrics.salesRevenueWithVat} exVat={metrics.salesRevenueExVat} />;
    case 'productionPieces':
      return <TableNumber value={metrics.productionPieces}>{formatPieces(metrics.productionPieces)} шт</TableNumber>;
    case 'productionPrice':
      return <VatMoneyCell withVat={metrics.productionPriceWithVat} exVat={metrics.productionPriceExVat} />;
    case 'productionValue':
      return <VatMoneyCell withVat={metrics.productionValueWithVat} exVat={metrics.productionValueExVat} />;
    case 'closing':
      return <IntegerCell value={metrics.closingPieces} unit="шт" signed />;
    case 'min':
      return <TableNumber value={metrics.minPieces}>{formatPieces(metrics.minPieces)} шт</TableNumber>;
    case 'max':
      return <TableNumber value={metrics.maxPieces}>{formatPieces(metrics.maxPieces)} шт</TableNumber>;
    case 'normDeviation':
      return <NormDeviationCell belowMinPieces={metrics.belowMinPieces} aboveMaxPieces={metrics.aboveMaxPieces} />;
    case 'factPrice':
      return <VatMoneyCell withVat={metrics.factPriceWithVat} exVat={metrics.factPriceExVat} />;
    case 'closingValue':
      return <VatMoneyCell withVat={metrics.closingValueWithVat} exVat={metrics.closingValueExVat} signed />;
  }
}

function dayOfMonth(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match?.[3]) {
    return iso;
  }

  return String(Number(match[3]));
}

function DayLabel({
  occurredOn,
  showArrows,
  onDay,
}: {
  occurredOn: string;
  showArrows: boolean;
  onDay: (day: string) => void;
}) {
  return (
    <div className="flex h-full flex-col items-center py-1">
      {showArrows ? (
        <ArrowButton
          label="Предыдущий день"
          direction="up"
          onClick={() => onDay(adjacentDay(occurredOn, -1) ?? occurredOn)}
          disabled={adjacentDay(occurredOn, -1) === null}
        />
      ) : null}
      <span className="flex flex-1 items-center text-2xl leading-none font-bold text-ink">
        {dayOfMonth(occurredOn)}
      </span>
      {showArrows ? (
        <ArrowButton
          label="Следующий день"
          direction="down"
          onClick={() => onDay(adjacentDay(occurredOn, 1) ?? occurredOn)}
          disabled={adjacentDay(occurredOn, 1) === null}
        />
      ) : null}
    </div>
  );
}

function ArrowButton({
  label,
  direction,
  disabled,
  onClick,
}: {
  label: string;
  direction: 'up' | 'down';
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-5 shrink-0 items-center justify-center text-ink outline-none hover:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40"
    >
      {direction === 'up' ? <IconChevronUp /> : <IconChevronDown />}
    </button>
  );
}
