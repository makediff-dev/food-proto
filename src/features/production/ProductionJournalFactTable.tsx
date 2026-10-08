'use client';

import { type ReactNode, useState } from 'react';

import {
  adjacentDay,
  type ProductionJournalFactDayView,
  type ProductionJournalFactGroup,
  type ProductionJournalFactRow,
} from '@/domain/production-journal-fact';
import { formatSignedPieces } from '@/features/sales-fact/text';
import { IconChevronDown, IconChevronRight, IconChevronUp } from '@/features/shell/Icons';
import {
  ColumnLabel,
  Empty,
  keepWithNext,
  stickyHeadClassName,
  TableNumber,
  tableBorder,
  tableClassName,
  tableFrameExpandedClassName,
} from '@/features/table';

export function ProductionJournalFactTable({
  days,
  showDayArrows,
  onDay,
  expanded = false,
}: {
  days: ProductionJournalFactDayView[];
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
        <caption className="sr-only">Факт выпуска по дням</caption>
        <thead className={stickyHeadClassName}>
          <tr>
            <th
              colSpan={2}
              className={`sticky left-0 z-40 ${tableBorder.bottomThin} ${tableBorder.rightThick} bg-paper`}
            />
            <th
              scope="colgroup"
              className={`${tableBorder.bottomThin} bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-ink`}
            >
              {keepWithNext('Фактические показатели выпуска за дату')}
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
            <th
              scope="col"
              className={`w-px whitespace-normal ${tableBorder.bottomThin} bg-paper px-1.5 py-2 text-center align-middle text-sm font-normal leading-5 text-muted`}
            >
              <ColumnLabel label="Объём" />
            </th>
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
                <td
                  className={`w-px border-t-[1.5px] border-t-muted bg-paper px-1.5 py-2 text-right align-middle ${
                    dayBreak ? 'border-b-[3px] border-b-muted' : 'border-b border-b-line'
                  }`}
                >
                  <Pieces value={day.totals.pieces} />
                </td>
              </tr>
            </tbody>
          );
        })}
      </table>
    </div>
  );
}

function visibleDayRows(groups: readonly ProductionJournalFactGroup[], openIds: ReadonlySet<string>): number {
  return groups.reduce((count, group) => count + 1 + (openIds.has(group.categoryId) ? group.rows.length : 0), 1);
}

function CategoryBlock({
  group,
  open,
  dateCell,
  onToggle,
}: {
  group: ProductionJournalFactGroup;
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
        <td className="w-px border-b border-b-line bg-paper px-1.5 py-2 text-right align-middle">
          <Pieces value={group.totals.pieces} />
        </td>
      </tr>
      {open ? group.rows.map((row) => <ProductRow key={row.productId} row={row} />) : null}
    </>
  );
}

function ProductRow({ row }: { row: ProductionJournalFactRow }) {
  return (
    <tr>
      <th
        scope="row"
        className="sticky left-10 z-10 w-px max-w-max whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted bg-sheet px-3 py-2 pl-8 text-left align-middle font-normal"
      >
        <div className="flex flex-col gap-1">
          <span className="text-sm text-ink">{row.name}</span>
          {row.deleted ? <span className="text-sm text-muted">(архив)</span> : null}
        </div>
      </th>
      <td className="w-px border-b border-b-line px-1.5 py-2 text-right align-middle">
        <Pieces value={row.pieces} />
      </td>
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

function Pieces({ value }: { value: number | null }) {
  if (value === null) {
    return <Empty />;
  }

  return <TableNumber value={value}>{formatSignedPieces(value)} шт</TableNumber>;
}
