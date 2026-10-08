'use client';

import { type ReactNode, useState } from 'react';

import {
  adjacentDay,
  type SalesFactDayView,
  type SalesFactGroup,
  type SalesFactRow,
  type SalesFactTotals,
} from '@/domain/sales-fact';
import { formatSignedPieces } from '@/features/sales-fact/text';
import { IconChevronDown, IconChevronRight, IconChevronUp } from '@/features/shell/icons';
import {
  ColumnLabel,
  Empty,
  keepWithNext,
  MoneyCell,
  Muted,
  PercentCell,
  stickyHeadClassName,
  TableNumber,
  tableBorder,
  tableClassName,
  tableFrameExpandedClassName,
  VatMoneyCell,
} from '@/features/table';

type ColumnKey =
  | 'salesUnitCost'
  | 'profitability'
  | 'price'
  | 'salesPieces'
  | 'revenue'
  | 'contribution'
  | 'salesVolumeCost'
  | 'vat';

const COLUMNS: { key: ColumnKey; label: string }[] = [
  { key: 'salesUnitCost', label: 'Себест продажи' },
  { key: 'profitability', label: 'Рентаб' },
  { key: 'price', label: 'Цена' },
  { key: 'salesPieces', label: 'Объём продаж' },
  { key: 'revenue', label: 'Выручка' },
  { key: 'contribution', label: 'Т-проток' },
  { key: 'salesVolumeCost', label: 'Себест объёма' },
  { key: 'vat', label: 'НДС' },
];

export function SalesFactTable({
  days,
  showDayArrows,
  onDay,
  expanded = false,
}: {
  days: SalesFactDayView[];
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
      {/* contain-paint не даёт широкой таблице растянуть прокрутку страницы */}
      <table className={tableClassName}>
        <caption className="sr-only">Факт продаж по дням</caption>
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
              {keepWithNext('Фактические показатели продаж за дату')}
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
                    <TotalCell column={column.key} totals={day.totals} />
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

function visibleDayRows(groups: readonly SalesFactGroup[], openIds: ReadonlySet<string>): number {
  return groups.reduce((count, group) => count + 1 + (openIds.has(group.categoryId) ? group.rows.length : 0), 1);
}

function CategoryBlock({
  group,
  open,
  dateCell,
  onToggle,
}: {
  group: SalesFactGroup;
  open: boolean;
  dateCell: ReactNode;
  onToggle: () => void;
}) {
  const productCount = group.rows.length;

  return (
    <>
      <tr>
        {dateCell}
        <th
          scope="row"
          className="sticky left-10 z-10 w-px max-w-max whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted bg-paper px-3 py-2 text-left align-middle font-normal text-ink"
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
            className="w-px border-b border-b-line border-r border-r-line bg-paper px-1.5 py-2 text-right align-middle last:border-r-0"
          >
            <TotalCell column={column.key} totals={group.totals} />
          </td>
        ))}
      </tr>
      {open ? group.rows.map((row) => <ProductRow key={row.productId} row={row} />) : null}
    </>
  );
}

function ProductRow({ row }: { row: SalesFactRow }) {
  return (
    <tr>
      <th
        scope="row"
        className="sticky left-10 z-10 w-px max-w-max whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted bg-sheet px-3 py-2 pl-8 text-left align-middle font-normal"
      >
        <ProductName row={row} />
      </th>
      {COLUMNS.map((column) => (
        <td
          key={column.key}
          className="w-px border-b border-b-line border-r border-r-line px-1.5 py-2 text-right align-middle last:border-r-0"
        >
          <RowCell column={column.key} row={row} />
        </td>
      ))}
    </tr>
  );
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

function ProductName({ row }: { row: SalesFactRow }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-ink">{row.name}</span>
      {row.deleted ? <span className="text-sm text-muted">(архив)</span> : null}
    </div>
  );
}

function RowCell({ column, row }: { column: ColumnKey; row: SalesFactRow }) {
  if (column === 'price') {
    return <VatMoneyCell withVat={row.priceWithVat} exVat={row.priceExVat} />;
  }

  if (column === 'salesPieces') {
    return <Pieces value={row.salesPieces} />;
  }

  switch (column) {
    case 'salesUnitCost':
      return row.unitCost ? (
        <VatMoneyCell withVat={row.unitCost.withVat} exVat={row.unitCost.exVat} />
      ) : (
        <Muted>{keepWithNext('Себестоимость не считается')}</Muted>
      );
    case 'salesVolumeCost':
      return <VatMoneyCell withVat={row.salesVolumeCostWithVat} exVat={row.salesVolumeCostExVat} />;
    case 'revenue':
      return <VatMoneyCell withVat={row.revenueWithVat} exVat={row.revenueExVat} />;
    case 'contribution':
      return <MoneyCell value={row.contribution} />;
    case 'profitability':
      return <PercentCell value={row.profitabilityHundredths} scale="hundredths" />;
    case 'vat':
      return <PercentCell value={row.vatPercent} />;
    default:
      return <Empty />;
  }
}

function TotalCell({ column, totals }: { column: ColumnKey; totals: SalesFactTotals }) {
  switch (column) {
    case 'salesPieces':
      return <Pieces value={totals.salesPieces} />;
    case 'price':
      return <VatMoneyCell withVat={totals.priceWithVat} exVat={totals.priceExVat} />;
    case 'revenue':
      return <VatMoneyCell withVat={totals.revenueWithVat} exVat={totals.revenueExVat} />;
    case 'contribution':
      return !totals.salesCostComplete || !totals.revenueComplete ? (
        <Muted>{keepWithNext('не по всем товарам')}</Muted>
      ) : (
        <MoneyCell value={totals.contribution} />
      );
    case 'salesUnitCost':
      return (
        <AverageCost
          complete={totals.salesCostComplete}
          withVat={totals.salesUnitCostWithVat}
          exVat={totals.salesUnitCostExVat}
        />
      );
    case 'salesVolumeCost':
      return (
        <VolumeTotal
          complete={totals.salesCostComplete}
          withVat={totals.salesVolumeCostWithVat}
          exVat={totals.salesVolumeCostExVat}
        />
      );
    case 'profitability':
      return !totals.salesCostComplete ? (
        <Empty />
      ) : (
        <PercentCell value={totals.profitabilityHundredths} scale="hundredths" />
      );
    case 'vat':
      return <PercentCell value={totals.vatPercentHundredths} scale="hundredths" />;
    default:
      return <Empty />;
  }
}

function AverageCost({
  complete,
  withVat,
  exVat,
}: {
  complete: boolean;
  withVat: number | null;
  exVat: number | null;
}) {
  if (!complete) {
    return <Muted>{keepWithNext('не по всем товарам')}</Muted>;
  }

  return <VatMoneyCell withVat={withVat} exVat={exVat} />;
}

function VolumeTotal({
  complete,
  withVat,
  exVat,
}: {
  complete: boolean;
  withVat: number | null;
  exVat: number | null;
}) {
  if (!complete) {
    return <Muted>{keepWithNext('не по всем товарам')}</Muted>;
  }

  return <VatMoneyCell withVat={withVat} exVat={exVat} />;
}

function Pieces({ value }: { value: number | null }) {
  if (value === null) {
    return <Empty />;
  }

  return <TableNumber value={value}>{formatSignedPieces(value)} шт</TableNumber>;
}
