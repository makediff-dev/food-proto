'use client';

import { useState } from 'react';

import type { Product, ProductCategory } from '@/domain/document';
import { amountExVat, averageAmount } from '@/domain/money';
import { productionLineAmountExVat, productionLineAmountWithVat } from '@/domain/production-journal';
import { parseProductionEntryPieces, parseProductionEntryPrice } from '@/features/production/text';
import { IconChevronDown, IconChevronRight } from '@/features/shell/Icons';
import {
  blockCornerClassName,
  blockHeadingClassName,
  type CellKind,
  ColumnLabel,
  categoryBandClassName,
  categoryNameClassName,
  cellKindClassName,
  columnDividerClassName,
  columnHeadingClassName,
  Empty,
  gridFieldClassName,
  keepWithNext,
  MergedTwoStory,
  MoneyAmount,
  nameHeadingClassName,
  ProductIndex,
  StackedPair,
  stickyHeadClassName,
  TableNumber,
  tableBorder,
  totalNameClassName,
  useOpenCategories,
  VatMoneyCell,
} from '@/features/table';
import { formatMoneyDraft, sanitizeDraft } from '@/features/table/format';

export interface ProductionEntryLineDraft {
  id: string;
  pieces: string;
  price: string;
}

export type ProductionEntryLineField = 'pieces' | 'price';

interface EntryFormRow {
  product: Product;
  draft: ProductionEntryLineDraft;
  priceWithVat: number | null;
  priceExVat: number | null;
  pieces: number | null;
  amountWithVat: number | null;
  amountExVat: number | null;
  filled: boolean;
}

interface EntryFormTotals {
  pieces: number | null;
  priceWithVat: number | null;
  priceExVat: number | null;
  amountWithVat: number | null;
  amountExVat: number | null;
}

interface EntryFormGroup {
  category: ProductCategory;
  rows: EntryFormRow[];
  totals: EntryFormTotals;
}

const COLUMNS = [
  { key: 'price', label: 'Цена' },
  { key: 'pieces', label: 'Шт' },
  { key: 'amount', label: 'Сумма' },
] as const;

type ColumnKey = (typeof COLUMNS)[number]['key'];

const COLUMN_KIND: Record<ColumnKey, CellKind> = {
  price: 'assigned',
  pieces: 'assigned',
  amount: 'computed',
};

function rowMetrics(product: Product, draft: ProductionEntryLineDraft): EntryFormRow {
  const priceWithVat = parseProductionEntryPrice(draft.price);
  const pieces = parseProductionEntryPieces(draft.pieces);
  const displayPieces = piecesForAmount(draft.pieces);
  const lineAmountWithVat =
    priceWithVat === null || displayPieces === null ? null : productionLineAmountWithVat(priceWithVat, displayPieces);
  const lineAmountExVat =
    priceWithVat === null || displayPieces === null
      ? null
      : productionLineAmountExVat(priceWithVat, displayPieces, product.vatPercent);

  return {
    product,
    draft,
    priceWithVat,
    priceExVat: priceWithVat === null ? null : amountExVat(priceWithVat, product.vatPercent),
    pieces,
    amountWithVat: lineAmountWithVat,
    amountExVat: lineAmountExVat,
    filled: pieces !== null && priceWithVat !== null,
  };
}

/** Ноль и пустое поле — 0 штук для суммы. Нечисло — сумму не считаем. */
function piecesForAmount(raw: string): number | null {
  const pieces = parseProductionEntryPieces(raw);
  if (pieces !== null) {
    return pieces;
  }

  const trimmed = raw.trim();
  if (trimmed === '' || trimmed === '0') {
    return 0;
  }

  return null;
}

function groupTotals(rows: readonly EntryFormRow[]): EntryFormTotals {
  let pieces = 0;
  let amountWith = 0;
  let amountEx = 0;
  let amountExComplete = true;
  let filledCount = 0;

  for (const row of rows) {
    if (!row.filled || row.pieces === null || row.amountWithVat === null) {
      continue;
    }
    filledCount += 1;
    pieces += row.pieces;
    amountWith += row.amountWithVat;
    if (row.amountExVat === null) {
      amountExComplete = false;
    } else {
      amountEx += row.amountExVat;
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

  const amountExVatValue = amountExComplete ? amountEx : null;
  return {
    pieces,
    amountWithVat: amountWith,
    amountExVat: amountExVatValue,
    priceWithVat: averageAmount(amountWith, pieces),
    priceExVat: averageAmount(amountExVatValue, pieces),
  };
}

export function emptyProductionEntryLineDraft(priceWithVat = 0): ProductionEntryLineDraft {
  return {
    id: `production-entry-line:${crypto.randomUUID()}`,
    pieces: '0',
    price: formatMoneyDraft(priceWithVat),
  };
}

export function ProductionEntryFormTable({
  categories,
  products,
  drafts,
  onChange,
}: {
  categories: readonly ProductCategory[];
  products: readonly Product[];
  drafts: Readonly<Record<string, ProductionEntryLineDraft>>;
  onChange: (productId: string, field: ProductionEntryLineField, raw: string) => void;
}) {
  const groups = buildGroups(categories, products, drafts);
  const totals = groupTotals(groups.flatMap((group) => group.rows));
  const { toggleCategory, categoryOpen } = useOpenCategories();

  return (
    <div className="w-max max-w-full border border-line bg-sheet">
      <table className="w-max border-separate border-spacing-0 text-sm">
        <caption className="sr-only">Товары выпуска</caption>
        <thead className={stickyHeadClassName}>
          <tr>
            <th className={`sticky left-0 z-40 ${blockCornerClassName} ${tableBorder.rightThick}`} />
            <th colSpan={COLUMNS.length} scope="colgroup" className={blockHeadingClassName}>
              {keepWithNext('Выпуск')}
            </th>
          </tr>
          <tr>
            <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
              Товар
            </th>
            {COLUMNS.map((column) => (
              <th key={column.key} scope="col" className={`${columnHeadingClassName} ${columnDividerClassName}`}>
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
              open={categoryOpen(group.category.id)}
              onToggle={() => toggleCategory(group.category.id)}
              onChange={onChange}
            />
          ))}
          <tr>
            <th scope="row" className={`sticky left-0 z-10 ${totalNameClassName}`}>
              Всего
            </th>
            {COLUMNS.map((column) => (
              <td
                key={column.key}
                className={`w-px border-y-[3px] border-y-muted text-right align-middle text-sm font-bold ${columnDividerClassName} ${cellKindClassName.computed} ${
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
  drafts: Readonly<Record<string, ProductionEntryLineDraft>>,
): EntryFormGroup[] {
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
  group: EntryFormGroup;
  open: boolean;
  onToggle: () => void;
  onChange: (productId: string, field: ProductionEntryLineField, raw: string) => void;
}) {
  const productCount = group.rows.length;
  const deleted = group.category.deletedAt !== null;

  return (
    <>
      <tr>
        <th
          scope="row"
          className={`sticky left-0 z-10 w-px max-w-max whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted px-3 py-2 text-left align-middle font-normal text-ink ${categoryBandClassName}`}
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
            <span className={categoryNameClassName}>
              {group.category.name} ({productCount})
            </span>
            {deleted ? <span className="text-sm font-normal text-muted">(архив)</span> : null}
          </div>
        </th>
        {COLUMNS.map((column) => (
          <td
            key={column.key}
            className={`w-px border-b border-b-line text-right align-middle ${categoryBandClassName} ${columnDividerClassName} ${
              column.key === 'pieces' ? 'h-px p-0' : 'px-1.5 py-2'
            }`}
          >
            <TotalCell column={column.key} totals={group.totals} />
          </td>
        ))}
      </tr>
      {open
        ? group.rows.map((row, index) => (
            <ProductRow key={row.product.id} row={row} index={index + 1} onChange={onChange} />
          ))
        : null}
    </>
  );
}

function ProductRow({
  row,
  index,
  onChange,
}: {
  row: EntryFormRow;
  index: number;
  onChange: (productId: string, field: ProductionEntryLineField, raw: string) => void;
}) {
  return (
    <tr>
      <th
        scope="row"
        className="sticky left-0 z-10 w-px max-w-max whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted bg-sheet px-3 py-2 text-left align-middle font-normal"
      >
        <div className="flex items-center gap-2">
          <ProductIndex index={index} />
          <span className="text-sm text-ink">{row.product.name}</span>
          {row.product.deletedAt ? <span className="text-sm text-muted">(архив)</span> : null}
        </div>
      </th>
      {COLUMNS.map((column) => (
        <td
          key={column.key}
          className={`w-px border-b border-b-line text-right align-middle ${columnDividerClassName} ${cellKindClassName[COLUMN_KIND[column.key]]} ${
            column.key === 'pieces' ? 'h-px p-0' : 'px-1.5 py-2'
          }`}
        >
          <RowCell column={column.key} row={row} onChange={(field, raw) => onChange(row.product.id, field, raw)} />
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
  row: EntryFormRow;
  onChange: (field: ProductionEntryLineField, raw: string) => void;
}) {
  if (column === 'price') {
    return (
      <StackedPair
        topKind="assigned"
        bottomKind="computed"
        topLabel="с НДС"
        bottomLabel="без НДС"
        top={
          <GridInput
            label={`Цена с НДС, ${row.product.name}`}
            value={row.draft.price}
            inputMode="decimal"
            unit="₽"
            format={formatKopecks(parseProductionEntryPrice)}
            onChange={(raw) => onChange('price', raw)}
          />
        }
        bottom={row.priceExVat === null ? <Empty /> : <MoneyAmount amount={row.priceExVat} />}
      />
    );
  }

  if (column === 'pieces') {
    return (
      <MergedTwoStory kind="assigned">
        <GridInput
          label={`Штуки, ${row.product.name}`}
          value={row.draft.pieces}
          inputMode="numeric"
          unit="шт"
          onChange={(raw) => onChange('pieces', raw)}
        />
      </MergedTwoStory>
    );
  }

  return <VatMoneyCell label="Сумма" withVat={row.amountWithVat} exVat={row.amountExVat} />;
}

function TotalCell({ column, totals }: { column: ColumnKey; totals: EntryFormTotals }) {
  if (column === 'price') {
    return <VatMoneyCell label="Цена" withVat={totals.priceWithVat} exVat={totals.priceExVat} />;
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

  return <VatMoneyCell label="Сумма" withVat={totals.amountWithVat} exVat={totals.amountExVat} />;
}

function formatKopecks(parse: (raw: string) => number | null): (raw: string) => string | null {
  return (raw) => {
    const amount = parse(raw);
    return amount === null ? null : formatMoneyDraft(amount);
  };
}

function GridInput({
  label,
  value,
  inputMode,
  unit,
  format,
  onChange,
}: {
  label: string;
  value: string;
  inputMode: 'decimal' | 'numeric';
  unit?: string;
  format?: (raw: string) => string | null;
  onChange: (raw: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const formatted = format?.(value) ?? null;
  const shown = editing ? value : (formatted ?? value);

  return (
    <div data-editable-field="" className="min-w-0">
      <div className="flex items-baseline justify-end gap-1">
        <input
          value={shown}
          inputMode={inputMode}
          autoComplete="off"
          aria-label={label}
          onFocus={() => setEditing(true)}
          onBlur={() => {
            setEditing(false);
            if (formatted && formatted !== value) {
              onChange(formatted);
            }
          }}
          onChange={(event) => onChange(sanitizeDraft(event.target.value, inputMode))}
          className={`${gridFieldClassName} text-ink`}
          placeholder={value ? undefined : '—'}
        />
        {unit ? <span className="shrink-0 text-sm text-ink">{unit}</span> : null}
      </div>
    </div>
  );
}
