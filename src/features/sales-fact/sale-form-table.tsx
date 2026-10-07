'use client';

import { type ReactNode, useState } from 'react';

import type { Product, ProductCategory } from '@/domain/document';
import { amountExVat, averageAmount, toSafeNumber } from '@/domain/money';
import { formatMoney } from '@/features/sales/money';
import { priceDraft } from '@/features/sales/text';
import {
  hasAmountWithoutPieces,
  parseSaleAmount,
  parseSalePieces,
  parseSalePrice,
} from '@/features/sales-fact/text';
import { IconChevronDown, IconChevronRight } from '@/features/shell/icons';
import { TableNumber } from '@/features/shell/table-number';

export interface SaleLineDraft {
  id: string;
  pieces: string;
  price: string;
  amount: string;
}

export type SaleLineField = 'pieces' | 'price' | 'amount';

interface SaleFormRow {
  product: Product;
  draft: SaleLineDraft;
  priceWithVat: number | null;
  priceExVat: number | null;
  pieces: number | null;
  amountWithVat: number | null;
  amountExVat: number | null;
  filled: boolean;
}

interface SaleFormTotals {
  pieces: number | null;
  priceWithVat: number | null;
  priceExVat: number | null;
  amountWithVat: number | null;
  amountExVat: number | null;
}

interface SaleFormGroup {
  category: ProductCategory;
  rows: SaleFormRow[];
  totals: SaleFormTotals;
}

const COLUMNS = [
  { key: 'price', label: 'Цена' },
  { key: 'pieces', label: 'Шт' },
  { key: 'amount', label: 'Сумма' },
] as const;

type ColumnKey = (typeof COLUMNS)[number]['key'];

const gridFieldClassName =
  'w-full min-w-0 cursor-text appearance-none border-0 bg-transparent p-0 text-right text-sm shadow-none outline-none';

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

function rowMetrics(product: Product, draft: SaleLineDraft): SaleFormRow {
  const priceWithVat = parseSalePrice(draft.price);
  const pieces = parseSalePieces(draft.pieces);
  const amountWithVat = parseSaleAmount(draft.amount);
  const filled = pieces !== null && amountWithVat !== null;

  return {
    product,
    draft,
    priceWithVat,
    priceExVat:
      priceWithVat === null
        ? null
        : amountExVat(priceWithVat, product.vatPercent),
    pieces,
    amountWithVat,
    amountExVat:
      amountWithVat === null
        ? null
        : amountExVat(amountWithVat, product.vatPercent),
    filled,
  };
}

function groupTotals(rows: readonly SaleFormRow[]): SaleFormTotals {
  let pieces = BigInt(0);
  let amountWith = BigInt(0);
  let amountEx = BigInt(0);
  let amountExComplete = true;
  let filledCount = 0;

  for (const row of rows) {
    if (!row.filled || row.pieces === null || row.amountWithVat === null) {
      continue;
    }
    filledCount += 1;
    pieces += BigInt(row.pieces);
    amountWith += BigInt(row.amountWithVat);
    if (row.amountExVat === null) {
      amountExComplete = false;
    } else {
      amountEx += BigInt(row.amountExVat);
    }
  }

  if (filledCount === 0) {
    return {
      pieces: null,
      priceWithVat: null,
      priceExVat: null,
      amountWithVat: null,
      amountExVat: null,
    };
  }

  const piecesValue = toSafeNumber(pieces);
  const amountWithVat = toSafeNumber(amountWith);
  const amountExVatValue = amountExComplete ? toSafeNumber(amountEx) : null;

  return {
    pieces: piecesValue,
    amountWithVat,
    amountExVat: amountExVatValue,
    priceWithVat: averageAmount(amountWithVat, piecesValue),
    priceExVat: averageAmount(amountExVatValue, piecesValue),
  };
}

export function SaleFormTable({
  categories,
  products,
  drafts,
  onChange,
}: {
  categories: readonly ProductCategory[];
  products: readonly Product[];
  drafts: Readonly<Record<string, SaleLineDraft>>;
  onChange: (productId: string, field: SaleLineField, raw: string) => void;
}) {
  const groups = buildGroups(categories, products, drafts);
  const totals = groupTotals(groups.flatMap((group) => group.rows));
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(
    () => new Set(groups.map((group) => group.category.id)),
  );

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
    <div className="w-max max-w-full border border-line bg-sheet">
      <table className="w-max border-separate border-spacing-0 text-sm">
        <caption className="sr-only">Товары продажи</caption>
        <thead className="sticky top-0 z-30">
          <tr>
            <th className="sticky left-0 z-40 border-b border-b-line border-r-[1.5px] border-r-muted bg-paper" />
            <th
              colSpan={COLUMNS.length}
              scope="colgroup"
              className="border-b border-b-line bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-ink"
            >
              {keepWithNext('Показатели продажи')}
            </th>
          </tr>
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-40 w-px max-w-max whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-muted"
            >
              Товар
            </th>
            {COLUMNS.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="w-px whitespace-normal border-r border-r-line border-b border-b-line bg-paper px-1.5 py-2 text-center align-middle text-sm font-normal leading-5 text-muted last:border-r-0"
              >
                <ColumnLabel label={column.label} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <CategoryBlock
              key={group.category.id}
              group={group}
              open={openIds.has(group.category.id)}
              onToggle={() => toggleGroup(group.category.id)}
              onChange={onChange}
            />
          ))}
          <tr>
            <th
              scope="row"
              className="sticky left-0 z-10 w-px max-w-max whitespace-nowrap border-t-[1.5px] border-t-muted border-b border-b-line border-r-[1.5px] border-r-muted bg-paper px-3 py-2 text-left align-middle font-normal text-ink"
            >
              Всего
            </th>
            {COLUMNS.map((column) => (
              <td
                key={column.key}
                className={`w-px border-t-[1.5px] border-t-muted border-r border-r-line border-b border-b-line bg-paper text-right align-middle last:border-r-0 ${
                  column.key === 'pieces' ? 'h-px p-0' : 'px-1.5 py-2'
                }`}
              >
                <TotalCell column={column.key} totals={totals} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function buildGroups(
  categories: readonly ProductCategory[],
  products: readonly Product[],
  drafts: Readonly<Record<string, SaleLineDraft>>,
): SaleFormGroup[] {
  return categories.flatMap((category) => {
    const rows = products
      .filter((item) => item.categoryId === category.id)
      .sort((left, right) => left.name.localeCompare(right.name, 'ru'))
      .flatMap((product) => {
        const draft = drafts[product.id];
        return draft ? [rowMetrics(product, draft)] : [];
      });

    if (rows.length === 0 && category.deletedAt !== null) {
      return [];
    }

    return [
      {
        category,
        rows,
        totals: groupTotals(rows),
      },
    ];
  });
}

function CategoryBlock({
  group,
  open,
  onToggle,
  onChange,
}: {
  group: SaleFormGroup;
  open: boolean;
  onToggle: () => void;
  onChange: (productId: string, field: SaleLineField, raw: string) => void;
}) {
  const productCount = group.rows.length;
  const deleted = group.category.deletedAt !== null;

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
                open
                  ? `Свернуть товары категории ${group.category.name}`
                  : `Развернуть товары категории ${group.category.name}`
              }
              title={open ? 'Свернуть' : 'Развернуть'}
              onClick={onToggle}
              className="inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {open ? <IconChevronDown /> : <IconChevronRight />}
            </button>
            <span className="flex h-8 min-w-max flex-1 items-center text-sm font-semibold leading-none text-ink">
              {group.category.name} ({productCount})
            </span>
            {deleted ? (
              <span className="text-sm font-normal text-muted">удалена</span>
            ) : null}
          </div>
        </th>
        {COLUMNS.map((column) => (
          <td
            key={column.key}
            className={`w-px border-b border-b-line border-r border-r-line bg-paper text-right align-middle last:border-r-0 ${
              column.key === 'pieces' ? 'h-px p-0' : 'px-1.5 py-2'
            }`}
          >
            <TotalCell column={column.key} totals={group.totals} />
          </td>
        ))}
      </tr>
      {open
        ? group.rows.map((row) => (
            <ProductRow key={row.product.id} row={row} onChange={onChange} />
          ))
        : null}
    </>
  );
}

function ProductRow({
  row,
  onChange,
}: {
  row: SaleFormRow;
  onChange: (productId: string, field: SaleLineField, raw: string) => void;
}) {
  return (
    <tr>
      <th
        scope="row"
        className="sticky left-0 z-10 w-px max-w-max whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted bg-sheet px-3 py-2 pl-8 text-left align-middle font-normal"
      >
        <div className="flex flex-col gap-1">
          <span className="text-sm text-ink">{row.product.name}</span>
          {row.product.deletedAt ? (
            <span className="text-sm text-muted">удалён</span>
          ) : null}
        </div>
      </th>
      {COLUMNS.map((column) => (
        <td
          key={column.key}
          className={`w-px border-b border-b-line border-r border-r-line text-right align-middle last:border-r-0 ${
            column.key === 'pieces' ? 'h-px p-0' : 'px-1.5 py-2'
          }`}
        >
          <RowCell
            column={column.key}
            row={row}
            onChange={(field, raw) => onChange(row.product.id, field, raw)}
          />
        </td>
      ))}
    </tr>
  );
}

function RowCell({
  column,
  row,
  onChange,
}: {
  column: ColumnKey;
  row: SaleFormRow;
  onChange: (field: SaleLineField, raw: string) => void;
}) {
  if (column === 'price') {
    return (
      <StackedPair
        topHighlighted
        topLabel="с НДС"
        bottomLabel="без НДС"
        top={
          <GridInput
            label={`Цена с НДС, ${row.product.name}`}
            value={row.draft.price}
            inputMode="decimal"
            unit="₽"
            format={formatKopecks(parseSalePrice)}
            onChange={(raw) => onChange('price', raw)}
          />
        }
        bottom={
          row.priceExVat === null ? (
            <Empty />
          ) : (
            <MoneyAmount amount={row.priceExVat} />
          )
        }
      />
    );
  }

  if (column === 'pieces') {
    return (
      <MergedTwoStory highlighted>
        <GridInput
          label={`Штуки, ${row.product.name}`}
          value={row.draft.pieces}
          inputMode="numeric"
          unit="шт"
          invalid={hasAmountWithoutPieces(row.draft.pieces, row.draft.amount)}
          onChange={(raw) => onChange('pieces', raw)}
        />
      </MergedTwoStory>
    );
  }

  return (
    <StackedPair
      topHighlighted
      topLabel="с НДС"
      bottomLabel="без НДС"
      top={
        <GridInput
          label={`Сумма с НДС, ${row.product.name}`}
          value={row.draft.amount}
          inputMode="decimal"
          unit="₽"
          format={formatKopecks(parseSaleAmount)}
          onChange={(raw) => onChange('amount', raw)}
        />
      }
      bottom={
        row.amountExVat === null ? (
          <Empty />
        ) : (
          <MoneyAmount amount={row.amountExVat} />
        )
      }
    />
  );
}

function TotalCell({
  column,
  totals,
}: {
  column: ColumnKey;
  totals: SaleFormTotals;
}) {
  if (column === 'price') {
    return (
      <VatMoneyOrEmpty
        withVat={totals.priceWithVat}
        exVat={totals.priceExVat}
      />
    );
  }

  if (column === 'pieces') {
    return (
      <MergedTwoStory>
        {totals.pieces === null ? (
          <Empty />
        ) : (
          <TableNumber value={totals.pieces}>
            {new Intl.NumberFormat('ru-RU', {
              maximumFractionDigits: 0,
            }).format(totals.pieces)}{' '}
            шт
          </TableNumber>
        )}
      </MergedTwoStory>
    );
  }

  return (
    <VatMoneyOrEmpty
      withVat={totals.amountWithVat}
      exVat={totals.amountExVat}
    />
  );
}

function formatKopecks(
  parse: (raw: string) => number | null,
): (raw: string) => string | null {
  return (raw) => {
    const amount = parse(raw);
    return amount === null ? null : priceDraft(amount);
  };
}

function GridInput({
  label,
  value,
  inputMode,
  unit,
  invalid = false,
  format,
  onChange,
}: {
  label: string;
  value: string;
  inputMode: 'decimal' | 'numeric';
  unit?: string;
  invalid?: boolean;
  format?: (raw: string) => string | null;
  onChange: (raw: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const formatted = format?.(value) ?? null;
  const shown = editing ? value : (formatted ?? value);
  const tone = invalid ? 'text-negative' : 'text-ink';

  return (
    <div data-editable-field="" className="min-w-0">
      <div className="flex items-baseline justify-end gap-1">
        <input
          value={shown}
          inputMode={inputMode}
          autoComplete="off"
          aria-label={label}
          aria-invalid={invalid || undefined}
          onFocus={() => setEditing(true)}
          onBlur={() => {
            setEditing(false);
            if (formatted && formatted !== value) {
              onChange(formatted);
            }
          }}
          onChange={(event) =>
            onChange(sanitizeDraft(event.target.value, inputMode))
          }
          className={`${gridFieldClassName} ${tone}`}
          placeholder={value ? undefined : '—'}
        />
        {unit ? (
          <span className={`shrink-0 text-sm ${tone}`}>{unit}</span>
        ) : null}
      </div>
    </div>
  );
}

function sanitizeDraft(raw: string, mode: 'decimal' | 'numeric'): string {
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

function MoneyAmount({ amount }: { amount: number }) {
  return <TableNumber value={amount}>{formatMoney(amount)}</TableNumber>;
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
    <StackedPair
      topLabel="с НДС"
      bottomLabel="без НДС"
      top={withVat === null ? <Empty /> : <MoneyAmount amount={withVat} />}
      bottom={exVat === null ? <Empty /> : <MoneyAmount amount={exVat} />}
    />
  );
}

function MergedTwoStory({
  highlighted = false,
  children,
}: {
  highlighted?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex h-full min-w-18 flex-col items-end justify-center px-1.5 py-1 ${
        highlighted ? editableCellClassName : ''
      }`}
    >
      {children}
    </div>
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
    <div className="-mx-1.5 -my-2 flex min-w-18 flex-col">
      <div
        data-editable-field=""
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

/** Черновик строки из плановой цены, если она есть. */
export function emptySaleLineDraft(planPriceWithVat = 0): SaleLineDraft {
  return {
    id: `sale-line:${crypto.randomUUID()}`,
    pieces: '0',
    price: planPriceWithVat > 0 ? priceDraft(planPriceWithVat) : '',
    amount: priceDraft(0),
  };
}
