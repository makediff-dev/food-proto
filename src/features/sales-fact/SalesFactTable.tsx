'use client';

import type { ReactNode } from 'react';

import {
  adjacentDay,
  type SalesFactDayView,
  type SalesFactGroup,
  type SalesFactRow,
  type SalesFactTotals,
} from '@/domain/sales-fact';
import { formatSignedPieces } from '@/features/sales-fact/text';
import { IconChevronDown, IconChevronRight, IconChevronUp } from '@/features/shell/Icons';
import {
  blockCornerClassName,
  blockHeadingClassName,
  ColumnLabel,
  categoryBandClassName,
  categoryNameClassName,
  columnDividerClassName,
  columnHeadingClassName,
  dayDateColumnClassName,
  dayFactSpacerBandClassName,
  dayFactSpacerCellClassName,
  dayFactSpacerHeadClassName,
  dayFactSpacerTotalClassName,
  dayFactTableClassName,
  Empty,
  keepWithNext,
  MoneyCell,
  Muted,
  nameHeadingClassName,
  PercentCell,
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
  const { toggleCategory, categoryOpen } = useOpenCategories();

  return (
    <div
      className={
        expanded
          ? tableFrameExpandedClassName
          : 'h-full min-h-0 contain-paint overflow-auto border border-line bg-sheet'
      }
    >
      {/* contain-paint не даёт широкой таблице растянуть прокрутку страницы */}
      <table className={dayFactTableClassName}>
        <caption className="sr-only">Факт продаж по дням</caption>
        <thead className={stickyHeadClassName}>
          <tr>
            <th colSpan={2} className={`sticky left-0 z-40 ${blockCornerClassName} ${tableBorder.rightThick}`} />
            <th colSpan={COLUMNS.length + 1} scope="colgroup" className={blockHeadingClassName}>
              {keepWithNext('Фактические показатели продаж за дату')}
            </th>
          </tr>
          <tr>
            <th
              scope="col"
              className={`sticky left-0 z-40 ${dayDateColumnClassName} border-y-[3px] border-y-muted ${tableBorder.rightThin} bg-paper p-0`}
            >
              <span className="sr-only">Дата</span>
            </th>
            <th scope="col" className={`sticky left-10 z-40 ${nameHeadingClassName}`}>
              Товар
            </th>
            {COLUMNS.map((column) => (
              <th key={column.key} scope="col" className={`${columnHeadingClassName} ${columnDividerClassName}`}>
                <ColumnLabel label={column.label} />
              </th>
            ))}
            <th aria-hidden className={dayFactSpacerHeadClassName} />
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
                  onToggle={() => toggleCategory(group.categoryId)}
                />
              ))}
              <tr>
                {day.groups.length === 0 ? dateCell : null}
                <th scope="row" className={`sticky left-10 z-10 ${totalNameClassName}`}>
                  Всего
                </th>
                {COLUMNS.map((column) => (
                  <td key={column.key} className={`${totalValueClassName} ${columnDividerClassName}`}>
                    <TotalCell column={column.key} totals={day.totals} />
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

function visibleDayRows(groups: readonly SalesFactGroup[], categoryOpen: (categoryId: string) => boolean): number {
  return groups.reduce((count, group) => count + 1 + (categoryOpen(group.categoryId) ? group.rows.length : 0), 1);
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
          className={`sticky left-10 z-10 w-px max-w-max whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted px-3 py-2 text-left align-middle font-normal text-ink ${categoryBandClassName}`}
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
            className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${categoryBandClassName} ${columnDividerClassName}`}
          >
            <TotalCell column={column.key} totals={group.totals} />
          </td>
        ))}
        <td aria-hidden className={dayFactSpacerBandClassName} />
      </tr>
      {open ? group.rows.map((row, index) => <ProductRow key={row.productId} row={row} index={index + 1} />) : null}
    </>
  );
}

function ProductRow({ row, index }: { row: SalesFactRow; index: number }) {
  return (
    <tr>
      <th
        scope="row"
        className="sticky left-10 z-10 w-px max-w-max whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted bg-sheet px-3 py-2 text-left align-middle font-normal"
      >
        <div className="flex items-center gap-2">
          <ProductIndex index={index} />
          <ProductName row={row} />
        </div>
      </th>
      {COLUMNS.map((column) => (
        <td
          key={column.key}
          className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`}
        >
          <RowCell column={column.key} row={row} />
        </td>
      ))}
      <td aria-hidden className={dayFactSpacerCellClassName} />
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
    <span className="flex items-center gap-2">
      <span className="text-sm text-ink">{row.name}</span>
      {row.deleted ? <span className="text-sm text-muted">(архив)</span> : null}
    </span>
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
      return <VatMoneyCell whole withVat={row.salesVolumeCostWithVat} exVat={row.salesVolumeCostExVat} />;
    case 'revenue':
      return <VatMoneyCell whole withVat={row.revenueWithVat} exVat={row.revenueExVat} />;
    case 'contribution':
      return <MoneyCell whole value={row.contribution} />;
    case 'profitability':
      return <PercentCell value={row.profitabilityHundredths} scale="hundredths" fractionDigits={1} />;
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
      return <VatMoneyCell whole withVat={totals.revenueWithVat} exVat={totals.revenueExVat} />;
    case 'contribution':
      return !totals.salesCostComplete || !totals.revenueComplete ? (
        <Muted>{keepWithNext('не по всем товарам')}</Muted>
      ) : (
        <MoneyCell whole value={totals.contribution} />
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
        <PercentCell value={totals.profitabilityHundredths} scale="hundredths" fractionDigits={1} />
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

  return <VatMoneyCell whole withVat={withVat} exVat={exVat} />;
}

function Pieces({ value }: { value: number | null }) {
  if (value === null) {
    return <Empty />;
  }

  return <TableNumber value={value}>{formatSignedPieces(value)} шт</TableNumber>;
}
