'use client';

import { type ReactNode, useId, useState } from 'react';

import {
  adjacentDay,
  type SalesFactDayView,
  type SalesFactGroup,
  type SalesFactInputs,
  type SalesFactRejection,
  type SalesFactRow,
  type SalesFactTotals,
} from '@/domain/sales-fact';
import { formatMoney } from '@/features/sales/money';
import { formatPercentHundredths } from '@/features/sales/text';
import {
  factPiecesDraft,
  formatSignedPieces,
  parseFactPieces,
  SALES_FACT_ERROR,
} from '@/features/sales-fact/text';
import {
  IconChevronDown,
  IconChevronRight,
  IconChevronUp,
} from '@/features/shell/icons';

const gridFieldClassName =
  'w-full min-w-0 cursor-text appearance-none border-0 bg-transparent p-0 text-right text-sm text-ink shadow-none outline-none';

const editableCellClassName = 'bg-[#e4e4e0]';

/** Предлоги, союзы и частицы, которые не оставляют в конце строки. */
const HANGING_WORDS = new Set([
  'а',
  'без',
  'бы',
  'в',
  'во',
  'для',
  'до',
  'же',
  'за',
  'и',
  'из',
  'к',
  'ко',
  'ли',
  'на',
  'не',
  'ни',
  'но',
  'о',
  'об',
  'от',
  'по',
  'под',
  'при',
  'с',
  'со',
  'у',
]);

function keepWithNext(text: string): string {
  const parts = text.split(' ');
  let line = '';
  for (let index = 0; index < parts.length; index += 1) {
    line += parts[index] ?? '';
    if (index === parts.length - 1) {
      break;
    }
    const bare = (parts[index] ?? '')
      .toLowerCase()
      .replace(/^[^a-zа-яё]+|[^a-zа-яё]+$/gi, '');
    line += HANGING_WORDS.has(bare) ? '\u00A0' : ' ';
  }
  return line;
}

function ColumnLabel({ label }: { label: string }) {
  const chunks = keepWithNext(label).split(' ');
  return (
    <span className="mx-auto block w-min text-center">
      {chunks.map((chunk) => (
        <span key={chunk} className="block whitespace-nowrap">
          {chunk}
        </span>
      ))}
    </span>
  );
}

type ColumnKey =
  | 'opening'
  | 'salesUnitCost'
  | 'profitability'
  | 'price'
  | 'salesPieces'
  | 'revenue'
  | 'contribution'
  | 'salesVolumeCost'
  | 'vat'
  | 'outputUnitCost'
  | 'outputPieces'
  | 'outputVolumeCost'
  | 'transfer'
  | 'staffMeals'
  | 'samples'
  | 'returns'
  | 'writeOff'
  | 'closing';

const COLUMNS: { key: ColumnKey; label: string; group: 'sales' | 'output' }[] =
  [
    { key: 'opening', label: 'Остаток на начало', group: 'sales' },
    { key: 'salesUnitCost', label: 'Себест продажи', group: 'sales' },
    { key: 'profitability', label: 'Рентаб', group: 'sales' },
    { key: 'price', label: 'Цена', group: 'sales' },
    { key: 'salesPieces', label: 'Объём продаж', group: 'sales' },
    { key: 'revenue', label: 'Выручка', group: 'sales' },
    { key: 'contribution', label: 'Т-проток', group: 'sales' },
    { key: 'salesVolumeCost', label: 'Себест объёма', group: 'sales' },
    { key: 'vat', label: 'НДС', group: 'sales' },
    { key: 'outputUnitCost', label: 'Себест произв', group: 'output' },
    { key: 'outputPieces', label: 'Объём произв', group: 'output' },
    { key: 'outputVolumeCost', label: 'Себест объёма произв', group: 'output' },
    { key: 'transfer', label: 'Перемещение на РЦ', group: 'output' },
    { key: 'staffMeals', label: 'Питание сотрудников', group: 'output' },
    { key: 'samples', label: 'Образцы для клиентов', group: 'output' },
    { key: 'returns', label: 'Возвраты клиентов', group: 'output' },
    { key: 'writeOff', label: 'Списание', group: 'output' },
    { key: 'closing', label: 'Остаток на конец', group: 'output' },
  ];

const SALES_SPAN = COLUMNS.filter((column) => column.group === 'sales').length;
const OUTPUT_SPAN = COLUMNS.length - SALES_SPAN;
const LAST_SALES_KEY = COLUMNS.filter((column) => column.group === 'sales').at(
  -1,
)?.key;

const INPUTS: Partial<
  Record<ColumnKey, { field: keyof SalesFactInputs; kind: 'pieces' }>
> = {
  outputPieces: { field: 'outputPieces', kind: 'pieces' },
  transfer: { field: 'transferPieces', kind: 'pieces' },
  staffMeals: { field: 'staffMealsPieces', kind: 'pieces' },
  samples: { field: 'samplesPieces', kind: 'pieces' },
  returns: { field: 'returnsPieces', kind: 'pieces' },
  writeOff: { field: 'writeOffPieces', kind: 'pieces' },
};

function sectionRightClass(column: ColumnKey): string {
  return column === LAST_SALES_KEY
    ? 'border-r-[1.5px] border-r-muted'
    : 'border-r border-r-line';
}

export function SalesFactTable({
  days,
  editable,
  showDayArrows,
  onDay,
  onCell,
  expanded = false,
}: {
  days: SalesFactDayView[];
  editable: boolean;
  showDayArrows: boolean;
  onDay: (day: string) => void;
  onCell: (
    occurredOn: string,
    productId: string,
    inputs: SalesFactInputs,
  ) => SalesFactRejection | null;
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
          ? 'h-dvh contain-paint overflow-auto bg-sheet'
          : 'max-h-[calc(100dvh-14rem)] contain-paint overflow-auto border border-line bg-sheet'
      }
    >
      {/* contain-paint не даёт широкой таблице растянуть прокрутку страницы */}
      <table className="w-max min-w-full border-separate border-spacing-0 text-sm">
        <caption className="sr-only">Факт продаж по дням</caption>
        <thead className="sticky top-0 z-30">
          <tr>
            <th
              colSpan={2}
              className="sticky left-0 z-40 border-b border-b-line border-r-[1.5px] border-r-muted bg-paper"
            />
            <th
              colSpan={SALES_SPAN}
              scope="colgroup"
              className="border-b border-b-line border-r-[1.5px] border-r-muted bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-ink"
            >
              {keepWithNext('Фактические показатели продаж за дату')}
            </th>
            <th
              colSpan={OUTPUT_SPAN}
              scope="colgroup"
              className="border-b border-b-line bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-ink"
            >
              {keepWithNext('Фактические показатели производства за дату')}
            </th>
          </tr>
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-40 w-10 max-w-10 border-r border-r-line border-b border-b-line bg-paper p-0"
            >
              <span className="sr-only">Дата</span>
            </th>
            <th
              scope="col"
              className="sticky left-10 z-40 w-px max-w-max whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-muted"
            >
              Товар
            </th>
            {COLUMNS.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`w-px whitespace-normal border-b border-b-line ${sectionRightClass(column.key)} bg-paper px-1.5 py-2 text-center align-middle text-sm font-normal leading-5 text-muted last:border-r-0`}
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
                dayBreak
                  ? 'border-b-[3px] border-b-muted'
                  : 'border-b border-b-line'
              }`}
            >
              <DayLabel
                occurredOn={day.occurredOn}
                showArrows={showDayArrows}
                onDay={onDay}
              />
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
                  editable={editable}
                  occurredOn={day.occurredOn}
                  onToggle={() => toggleGroup(group.categoryId)}
                  onCell={onCell}
                />
              ))}
              <tr>
                {day.groups.length === 0 ? dateCell : null}
                <th
                  scope="row"
                  className={`sticky left-10 z-10 w-px max-w-max whitespace-nowrap border-t-[1.5px] border-t-muted border-r-[1.5px] border-r-muted bg-paper px-3 py-2 text-left align-middle font-normal text-ink ${
                    dayBreak
                      ? 'border-b-[3px] border-b-muted'
                      : 'border-b border-b-line'
                  }`}
                >
                  Всего
                </th>
                {COLUMNS.map((column) => (
                  <td
                    key={column.key}
                    className={`w-px border-t-[1.5px] border-t-muted bg-paper px-1.5 py-2 text-right align-middle last:border-r-0 ${sectionRightClass(column.key)} ${
                      dayBreak
                        ? 'border-b-[3px] border-b-muted'
                        : 'border-b border-b-line'
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

function visibleDayRows(
  groups: readonly SalesFactGroup[],
  openIds: ReadonlySet<string>,
): number {
  return groups.reduce(
    (count, group) =>
      count + 1 + (openIds.has(group.categoryId) ? group.rows.length : 0),
    1,
  );
}

function CategoryBlock({
  group,
  open,
  dateCell,
  editable,
  occurredOn,
  onToggle,
  onCell,
}: {
  group: SalesFactGroup;
  open: boolean;
  dateCell: ReactNode;
  editable: boolean;
  occurredOn: string;
  onToggle: () => void;
  onCell: (
    occurredOn: string,
    productId: string,
    inputs: SalesFactInputs,
  ) => SalesFactRejection | null;
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
                open
                  ? `Свернуть товары категории ${group.name}`
                  : `Развернуть товары категории ${group.name}`
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
          </div>
        </th>
        {COLUMNS.map((column) => (
          <td
            key={column.key}
            className={`w-px border-b border-b-line bg-paper px-1.5 py-2 text-right align-middle last:border-r-0 ${sectionRightClass(column.key)}`}
          >
            <TotalCell column={column.key} totals={group.totals} />
          </td>
        ))}
      </tr>
      {open
        ? group.rows.map((row) => (
            <ProductRow
              key={`${occurredOn}:${row.productId}`}
              row={row}
              editable={editable}
              onCommit={(inputs) => onCell(occurredOn, row.productId, inputs)}
            />
          ))
        : null}
    </>
  );
}

function ProductRow({
  row,
  editable,
  onCommit,
}: {
  row: SalesFactRow;
  editable: boolean;
  onCommit: (inputs: SalesFactInputs) => SalesFactRejection | null;
}) {
  return (
    <tr>
      <th
        scope="row"
        className="sticky left-10 z-10 w-px max-w-max whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted bg-sheet px-3 py-2 pl-8 text-left align-middle font-normal"
      >
        <ProductName row={row} />
      </th>
      {COLUMNS.map((column) => {
        const canEdit = Boolean(INPUTS[column.key]) && editable && !row.deleted;
        const highlightCell = canEdit;
        return (
          <td
            key={column.key}
            className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle last:border-r-0 ${sectionRightClass(column.key)} ${
              highlightCell ? editableCellClassName : ''
            }`}
            onClick={(event) => {
              if (!canEdit) {
                return;
              }
              const field = event.currentTarget.querySelector('input');
              if (
                field instanceof HTMLInputElement &&
                document.activeElement !== field
              ) {
                field.focus();
              }
            }}
            onKeyDown={(event) => {
              if (!canEdit) {
                return;
              }
              if (event.key !== 'Enter' && event.key !== ' ') {
                return;
              }
              if (event.target instanceof HTMLInputElement) {
                return;
              }
              const field = event.currentTarget.querySelector('input');
              if (field instanceof HTMLInputElement) {
                field.focus();
              }
            }}
          >
            <RowCell
              column={column.key}
              row={row}
              editable={editable && !row.deleted}
              onCommit={onCommit}
            />
          </td>
        );
      })}
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
      {row.deleted ? <span className="text-sm text-muted">удалён</span> : null}
    </div>
  );
}

function RowCell({
  column,
  row,
  editable,
  onCommit,
}: {
  column: ColumnKey;
  row: SalesFactRow;
  editable: boolean;
  onCommit: (inputs: SalesFactInputs) => SalesFactRejection | null;
}) {
  if (column === 'price') {
    return (
      <VatMoneyOrEmpty withVat={row.priceWithVat} exVat={row.priceExVat} />
    );
  }

  if (column === 'salesPieces') {
    return <Pieces value={row.salesPieces} />;
  }

  const input = INPUTS[column];
  if (input) {
    const value = row.inputs[input.field];
    return (
      <GridNumber
        label={`${COLUMNS.find((item) => item.key === column)?.label ?? ''}, ${row.name}`}
        value={factPiecesDraft(value)}
        disabled={!editable}
        inputMode="numeric"
        unit="шт"
        invalidMessage={SALES_FACT_ERROR.pieces}
        parse={parseFactPieces}
        onCommit={(next) => onCommit({ ...row.inputs, [input.field]: next })}
      />
    );
  }

  switch (column) {
    case 'opening':
      return (
        <PlacePair
          production={row.productionStart}
          distribution={row.distributionStart}
        />
      );
    case 'closing':
      return (
        <PlacePair
          production={row.productionEnd}
          distribution={row.distributionEnd}
        />
      );
    case 'salesUnitCost':
    case 'outputUnitCost':
      return row.unitCost ? (
        <VatPair
          withVat={<MoneyAmount amount={row.unitCost.withVat} />}
          exVat={<MoneyAmount amount={row.unitCost.exVat} />}
        />
      ) : (
        <Muted>{keepWithNext('Себестоимость не считается')}</Muted>
      );
    case 'salesVolumeCost':
      return (
        <VatMoneyOrEmpty
          withVat={row.salesVolumeCostWithVat}
          exVat={row.salesVolumeCostExVat}
        />
      );
    case 'outputVolumeCost':
      return (
        <VatMoneyOrEmpty
          withVat={row.outputVolumeCostWithVat}
          exVat={row.outputVolumeCostExVat}
        />
      );
    case 'revenue':
      return (
        <VatMoneyOrEmpty
          withVat={row.revenueWithVat}
          exVat={row.revenueExVat}
        />
      );
    case 'contribution':
      return row.contribution === null ? (
        <Empty />
      ) : (
        <MoneyAmount amount={row.contribution} />
      );
    case 'profitability':
      return row.profitabilityHundredths === null ? (
        <Empty />
      ) : (
        <span className="whitespace-nowrap">
          {formatPercentHundredths(row.profitabilityHundredths)}
        </span>
      );
    case 'vat':
      return row.vatPercent === null ? (
        <Empty />
      ) : (
        <span className="whitespace-nowrap">{row.vatPercent} %</span>
      );
    default:
      return <Empty />;
  }
}

function TotalCell({
  column,
  totals,
}: {
  column: ColumnKey;
  totals: SalesFactTotals;
}) {
  switch (column) {
    case 'opening':
      return (
        <PlacePair
          production={totals.productionStart}
          distribution={totals.distributionStart}
        />
      );
    case 'closing':
      return (
        <PlacePair
          production={totals.productionEnd}
          distribution={totals.distributionEnd}
        />
      );
    case 'salesPieces':
      return <Pieces value={totals.salesPieces} />;
    case 'outputPieces':
      return <Pieces value={totals.outputPieces} />;
    case 'transfer':
      return <Pieces value={totals.transferPieces} />;
    case 'staffMeals':
      return <Pieces value={totals.staffMealsPieces} />;
    case 'samples':
      return <Pieces value={totals.samplesPieces} />;
    case 'returns':
      return <Pieces value={totals.returnsPieces} />;
    case 'writeOff':
      return <Pieces value={totals.writeOffPieces} />;
    case 'price':
      return (
        <VatMoneyOrEmpty
          withVat={totals.priceWithVat}
          exVat={totals.priceExVat}
        />
      );
    case 'revenue':
      return (
        <VatMoneyOrEmpty
          withVat={totals.revenueWithVat}
          exVat={totals.revenueExVat}
        />
      );
    case 'contribution':
      return !totals.salesCostComplete || !totals.revenueComplete ? (
        <Muted>{keepWithNext('не по всем товарам')}</Muted>
      ) : totals.contribution === null ? (
        <Empty />
      ) : (
        <MoneyAmount amount={totals.contribution} />
      );
    case 'salesUnitCost':
      return (
        <AverageCost
          complete={totals.salesCostComplete}
          withVat={totals.salesUnitCostWithVat}
          exVat={totals.salesUnitCostExVat}
        />
      );
    case 'outputUnitCost':
      return (
        <AverageCost
          complete={totals.outputCostComplete}
          withVat={totals.outputUnitCostWithVat}
          exVat={totals.outputUnitCostExVat}
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
    case 'outputVolumeCost':
      return (
        <VolumeTotal
          complete={totals.outputCostComplete}
          withVat={totals.outputVolumeCostWithVat}
          exVat={totals.outputVolumeCostExVat}
        />
      );
    case 'profitability':
      return !totals.salesCostComplete ||
        totals.profitabilityHundredths === null ? (
        <Empty />
      ) : (
        <span className="whitespace-nowrap">
          {formatPercentHundredths(totals.profitabilityHundredths)}
        </span>
      );
    case 'vat':
      return totals.vatPercentHundredths === null ? (
        <Empty />
      ) : (
        <span className="whitespace-nowrap">
          {formatPercentHundredths(totals.vatPercentHundredths)}
        </span>
      );
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

  return <VatMoneyOrEmpty withVat={withVat} exVat={exVat} />;
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

  return <VatMoneyOrEmpty withVat={withVat} exVat={exVat} />;
}

function Pieces({ value }: { value: number | null }) {
  if (value === null) {
    return <Empty />;
  }

  return (
    <span className="whitespace-nowrap">{formatSignedPieces(value)} шт</span>
  );
}

function PlacePair({
  production,
  distribution,
}: {
  production: number | null;
  distribution: number | null;
}) {
  return (
    <StackedPair
      topLabel="на произв."
      bottomLabel="на РЦ"
      top={<Pieces value={production} />}
      bottom={<Pieces value={distribution} />}
    />
  );
}

function MoneyAmount({ amount }: { amount: number }) {
  return <span className="whitespace-nowrap">{formatMoney(amount)}</span>;
}

function VatMoneyOrEmpty({
  withVat,
  exVat,
}: {
  withVat: number | null;
  exVat: number | null;
}) {
  if (withVat === null && exVat === null) {
    return <Empty />;
  }

  return (
    <VatPair
      withVat={withVat === null ? <Empty /> : <MoneyAmount amount={withVat} />}
      exVat={exVat === null ? <Empty /> : <MoneyAmount amount={exVat} />}
    />
  );
}

function VatPair({
  withVat,
  exVat,
  withVatHighlighted = false,
}: {
  withVat: ReactNode;
  exVat: ReactNode;
  withVatHighlighted?: boolean;
}) {
  return (
    <StackedPair
      topLabel="с НДС"
      bottomLabel="без НДС"
      topHighlighted={withVatHighlighted}
      top={withVat}
      bottom={exVat}
    />
  );
}

function StackedPair({
  topLabel,
  bottomLabel,
  top,
  bottom,
  topHighlighted = false,
}: {
  topLabel: string;
  bottomLabel: string;
  top: ReactNode;
  bottom: ReactNode;
  topHighlighted?: boolean;
}) {
  return (
    <div className="-mx-1.5 -my-2 flex min-w-[4.5rem] flex-col">
      <div
        className={`flex flex-col items-end border-b border-line px-1.5 py-1 ${
          topHighlighted ? editableCellClassName : ''
        }`}
      >
        <span className="text-[0.5rem] leading-none text-muted">
          {topLabel}
        </span>
        {top}
      </div>
      <div className="flex flex-col items-end px-1.5 py-1">
        <span className="text-[0.5rem] leading-none text-muted">
          {bottomLabel}
        </span>
        {bottom}
      </div>
    </div>
  );
}

function Empty() {
  return <span className="text-muted">—</span>;
}

function Muted({ children }: { children: string }) {
  return <span className="text-sm text-muted">{children}</span>;
}

/** Оставляет цифры; для цены — ещё одну дробную запятую. Точку приводит к запятой. */
function sanitizeFactDraft(raw: string, mode: 'decimal' | 'numeric'): string {
  let result = '';
  let hasComma = false;

  for (const char of raw) {
    if (char >= '0' && char <= '9') {
      result += char;
      continue;
    }

    if (mode === 'decimal' && (char === ',' || char === '.') && !hasComma) {
      result += ',';
      hasComma = true;
    }
  }

  return result;
}

function GridNumber({
  label,
  value,
  disabled,
  inputMode,
  unit,
  invalidMessage,
  parse,
  onCommit,
}: {
  label: string;
  value: string;
  disabled: boolean;
  inputMode: 'decimal' | 'numeric';
  unit?: string;
  invalidMessage: string;
  parse: (raw: string) => number | null;
  onCommit: (value: number) => SalesFactRejection | null;
}) {
  const inputId = useId();
  const errorId = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const shown = draft ?? value;

  function commit(raw: string) {
    const parsed = parse(raw);
    if (parsed === null) {
      setError(invalidMessage);
      setDraft(raw);
      return;
    }

    const rejection = onCommit(parsed);
    if (rejection) {
      setError(SALES_FACT_ERROR[rejection]);
      setDraft(raw);
      return;
    }

    setDraft(null);
    setError(null);
  }

  if (disabled) {
    return (
      <>
        <span className="sr-only">{label}</span>
        <span className="whitespace-nowrap">
          {shown}
          {unit ? ` ${unit}` : ''}
        </span>
      </>
    );
  }

  return (
    <div className="min-w-0">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div className="flex items-baseline justify-end gap-1">
        <input
          id={inputId}
          value={shown}
          inputMode={inputMode}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onFocus={() => {
            setDraft(sanitizeFactDraft(value, inputMode));
            setError(null);
          }}
          onChange={(event) =>
            setDraft(sanitizeFactDraft(event.target.value, inputMode))
          }
          onBlur={(event) => commit(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              event.stopPropagation();
              event.currentTarget.blur();
            }
          }}
          className={gridFieldClassName}
        />
        {unit ? (
          <span className="shrink-0 text-sm text-ink">{unit}</span>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className="mt-1 text-sm text-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}
