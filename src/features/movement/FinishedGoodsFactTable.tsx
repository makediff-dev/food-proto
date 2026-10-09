'use client';

import { type ReactNode, useState } from 'react';
import type {
  FinishedGoodsDayView,
  FinishedGoodsGroup,
  FinishedGoodsRow,
  FinishedGoodsTotals,
} from '@/domain/finished-goods';
import { adjacentDay } from '@/domain/sales-fact';
import { formatPieces } from '@/features/sales/text';
import { IconChevronDown, IconChevronRight, IconChevronUp } from '@/features/shell/Icons';
import {
  ColumnLabel,
  IntegerCell,
  keepWithNext,
  Muted,
  stickyHeadClassName,
  TableNumber,
  tableBorder,
  tableClassName,
  tableFrameExpandedClassName,
  VatMoneyCell,
} from '@/features/table';

type ColumnKey =
  | 'opening'
  | 'planPrice'
  | 'openingValue'
  | 'salesPieces'
  | 'salesRevenue'
  | 'productionPieces'
  | 'productionValue'
  | 'closing'
  | 'factPrice'
  | 'closingValue';

const COLUMNS: { key: ColumnKey; label: string }[] = [
  { key: 'opening', label: 'Остаток на начало' },
  { key: 'planPrice', label: 'Цена план' },
  { key: 'openingValue', label: 'Стоимость остатка на начало' },
  { key: 'salesPieces', label: 'Объём продаж' },
  { key: 'salesRevenue', label: 'Стоимость продаж' },
  { key: 'productionPieces', label: 'Объём произв-ва' },
  { key: 'productionValue', label: 'Стоимость произв-ва' },
  { key: 'closing', label: 'Остаток на конец' },
  { key: 'factPrice', label: 'Цена факт' },
  { key: 'closingValue', label: 'Стоимость остатка на конец' },
];

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
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(() => new Set());

  function toggleGroup(categoryId: string) {
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }

  return (
    <div
      className={
        expanded
          ? tableFrameExpandedClassName
          : 'h-full min-h-0 contain-paint overflow-auto border border-line bg-sheet'
      }
    >
      <table className={tableClassName}>
        <caption className="sr-only">Отчет подневный: движение готовой продукции по дням</caption>
        <thead className={stickyHeadClassName}>
          <tr>
            <th
              colSpan={2}
              className={`sticky left-0 z-40 ${tableBorder.bottomThin} ${tableBorder.rightThick} bg-paper`}
            />
            <th
              colSpan={COLUMNS.length}
              scope="colgroup"
              className={`${tableBorder.bottomThin} bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-ink`}
            >
              {keepWithNext('Движение готовой продукции за дату')}
            </th>
          </tr>
          <tr>
            <th
              scope="col"
              className={`sticky left-0 z-40 w-10 max-w-10 ${tableBorder.rightThin} ${tableBorder.bottomThin} bg-paper p-0`}
            >
              <span className="sr-only">Дата</span>
            </th>
            <th
              scope="col"
              className={`sticky left-10 z-40 w-px max-w-max whitespace-nowrap ${tableBorder.bottomThin} ${tableBorder.rightThick} bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-muted`}
            >
              Товар
            </th>
            {COLUMNS.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`w-px whitespace-normal ${tableBorder.bottomThin} ${tableBorder.rightThin} bg-paper px-1.5 py-2 text-center align-middle text-sm font-normal leading-5 text-muted last:border-r-0`}
              >
                <ColumnLabel label={column.label} />
              </th>
            ))}
          </tr>
        </thead>
        {days.map((day, dayIndex) => {
          const dayBreak = days.length > 1 && dayIndex < days.length - 1;
          const dateCell = (
            <th
              scope="rowgroup"
              rowSpan={visibleDayRows(day.groups, openIds)}
              className={`sticky left-0 z-10 h-px w-10 max-w-10 border-r border-r-line bg-sheet p-0 align-middle font-normal ${
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
                  open={openIds.has(group.categoryId)}
                  dateCell={groupIndex === 0 ? dateCell : null}
                  dayBreak={dayBreak}
                  onToggle={() => toggleGroup(group.categoryId)}
                />
              ))}
              <tr>
                {day.groups.length === 0 ? dateCell : null}
                <th
                  scope="row"
                  className={`sticky left-10 z-10 w-px max-w-max whitespace-nowrap border-t-[1.5px] border-t-muted border-r-[1.5px] border-r-muted bg-paper px-3 py-2 text-left align-middle font-normal text-ink ${
                    dayBreak ? 'border-b-[3px] border-b-muted' : 'border-b border-b-line'
                  }`}
                >
                  Всего
                </th>
                {COLUMNS.map((column) => (
                  <td
                    key={column.key}
                    className={`w-px border-t-[1.5px] border-t-muted border-r border-r-line bg-paper px-1.5 py-2 text-right align-middle last:border-r-0 ${
                      dayBreak ? 'border-b-[3px] border-b-muted' : 'border-b border-b-line'
                    }`}
                  >
                    <MetricCell column={column.key} metrics={day.totals} />
                  </td>
                ))}
              </tr>
            </tbody>
          );
        })}
      </table>
    </div>
  );
}

function visibleDayRows(groups: readonly FinishedGoodsGroup[], openIds: ReadonlySet<string>): number {
  return groups.reduce((count, group) => count + 1 + (openIds.has(group.categoryId) ? group.rows.length : 0), 1);
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
          className={`sticky left-10 z-10 w-px max-w-max whitespace-nowrap ${bottom} border-r-[1.5px] border-r-muted bg-paper px-3 py-2 text-left align-middle font-normal text-ink`}
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
            <span className="flex h-8 min-w-max flex-1 items-center text-sm font-semibold leading-none text-ink">
              {group.name} ({productCount})
            </span>
            {group.deleted ? <span className="text-sm font-normal text-muted">(архив)</span> : null}
          </div>
        </th>
        {COLUMNS.map((column) => (
          <td
            key={column.key}
            className={`w-px ${bottom} border-r border-r-line bg-paper px-1.5 py-2 text-right align-middle last:border-r-0`}
          >
            <MetricCell column={column.key} metrics={group.totals} />
          </td>
        ))}
      </tr>
      {open
        ? group.rows.map((row, index) => (
            <ProductRow key={row.productId} row={row} dayBreak={dayBreak && index === group.rows.length - 1} />
          ))
        : null}
    </>
  );
}

function ProductRow({ row, dayBreak }: { row: FinishedGoodsRow; dayBreak: boolean }) {
  const bottom = dayBreak ? 'border-b-[3px] border-b-muted' : 'border-b border-b-line';
  return (
    <tr>
      <th
        scope="row"
        className={`sticky left-10 z-10 w-px max-w-max whitespace-nowrap ${bottom} border-r-[1.5px] border-r-muted bg-sheet px-3 py-2 pl-8 text-left align-middle font-normal`}
      >
        <div className="flex flex-col gap-1">
          <span className="flex h-8 min-w-max flex-1 items-center text-sm leading-none text-ink">{row.name}</span>
          {row.deleted ? <span className="text-sm text-muted">(архив)</span> : null}
        </div>
      </th>
      {COLUMNS.map((column) => (
        <td
          key={column.key}
          className={`w-px ${bottom} border-r border-r-line px-1.5 py-2 text-right align-middle last:border-r-0`}
        >
          <MetricCell column={column.key} metrics={row} />
        </td>
      ))}
    </tr>
  );
}

function MetricCell({ column, metrics }: { column: ColumnKey; metrics: FinishedGoodsTotals }) {
  switch (column) {
    case 'opening':
      return <TableNumber value={metrics.openingPieces}>{formatPieces(metrics.openingPieces)} шт</TableNumber>;
    case 'planPrice':
      return <VatMoneyCell withVat={metrics.planPriceWithVat} exVat={metrics.planPriceExVat} />;
    case 'openingValue':
      return <VatMoneyCell withVat={metrics.openingValueWithVat} exVat={metrics.openingValueExVat} />;
    case 'salesPieces':
      return <TableNumber value={metrics.salesPieces}>{formatPieces(metrics.salesPieces)} шт</TableNumber>;
    case 'salesRevenue':
      if (!metrics.revenueComplete) {
        return <Muted>{keepWithNext('не по всем товарам')}</Muted>;
      }
      return <VatMoneyCell withVat={metrics.salesRevenueWithVat} exVat={metrics.salesRevenueExVat} />;
    case 'productionPieces':
      return <TableNumber value={metrics.productionPieces}>{formatPieces(metrics.productionPieces)} шт</TableNumber>;
    case 'productionValue':
      return <VatMoneyCell withVat={metrics.productionValueWithVat} exVat={metrics.productionValueExVat} />;
    case 'closing':
      return <IntegerCell value={metrics.closingPieces} unit="шт" signed />;
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
