'use client';

import { useState } from 'react';

import { MATERIAL_GROUPS, type Material } from '@/domain/document';
import { amountExVat, averageAmount, ratioRound } from '@/domain/money';
import { QUANTITY_SCALE } from '@/domain/quantity';
import { formatQuantityDraft, parseQuantityInput } from '@/features/materials/text';
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
  entityNameRowClassName,
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
import { formatMoneyDraft, parseMoneyInput, sanitizeDraft } from '@/features/table/format';

export interface MaterialReceiptLineDraft {
  quantity: string;
  price: string;
}

export type MaterialReceiptLineField = 'quantity' | 'price';

interface EntryFormRow {
  material: Material;
  draft: MaterialReceiptLineDraft;
  priceWithVat: number | null;
  priceExVat: number | null;
  quantity: number | null;
  amountWithVat: number | null;
  amountExVat: number | null;
  filled: boolean;
}

interface EntryFormTotals {
  quantity: number | null;
  priceWithVat: number | null;
  priceExVat: number | null;
  amountWithVat: number | null;
  amountExVat: number | null;
}

interface EntryFormGroup {
  groupId: string;
  groupName: string;
  rows: EntryFormRow[];
  totals: EntryFormTotals;
}

const COLUMNS = [
  { key: 'price', label: 'Цена' },
  { key: 'quantity', label: 'Кол-во' },
  { key: 'amount', label: 'Сумма' },
] as const;

type ColumnKey = (typeof COLUMNS)[number]['key'];

const COLUMN_KIND: Record<ColumnKey, CellKind> = {
  price: 'assigned',
  quantity: 'assigned',
  amount: 'computed',
};

function lineAmountWithVat(priceWithVat: number, quantity: number): number | null {
  return ratioRound(priceWithVat * quantity, QUANTITY_SCALE);
}

function rowMetrics(material: Material, draft: MaterialReceiptLineDraft): EntryFormRow {
  const priceWithVat = parseMoneyInput(draft.price);
  const quantity = parseQuantityInput(draft.quantity, false);
  const displayQuantity = quantityForAmount(draft.quantity);
  const amountWithVat =
    priceWithVat === null || displayQuantity === null ? null : lineAmountWithVat(priceWithVat, displayQuantity);
  const lineAmountExVat = amountWithVat === null ? null : amountExVat(amountWithVat, material.vatPercent);

  return {
    material,
    draft,
    priceWithVat,
    priceExVat: priceWithVat === null ? null : amountExVat(priceWithVat, material.vatPercent),
    quantity,
    amountWithVat,
    amountExVat: lineAmountExVat,
    filled: quantity !== null && quantity > 0 && priceWithVat !== null,
  };
}

function quantityForAmount(raw: string): number | null {
  const quantity = parseQuantityInput(raw, false);
  if (quantity !== null) {
    return quantity;
  }

  const trimmed = raw.trim();
  if (trimmed === '' || trimmed === '0') {
    return 0;
  }

  return null;
}

function groupTotals(rows: readonly EntryFormRow[]): EntryFormTotals {
  let quantity = 0;
  let amountWith = 0;
  let amountEx = 0;
  let amountExComplete = true;
  let filledCount = 0;

  for (const row of rows) {
    if (!row.filled || row.quantity === null || row.amountWithVat === null) {
      continue;
    }
    filledCount += 1;
    quantity += row.quantity;
    amountWith += row.amountWithVat;
    if (row.amountExVat === null) {
      amountExComplete = false;
    } else {
      amountEx += row.amountExVat;
    }
  }

  if (filledCount === 0) {
    return {
      quantity: null,
      priceWithVat: null,
      priceExVat: null,
      amountWithVat: null,
      amountExVat: null,
    };
  }

  const amountExVatValue = amountExComplete ? amountEx : null;
  return {
    quantity,
    amountWithVat: amountWith,
    amountExVat: amountExVatValue,
    priceWithVat: averageAmount(amountWith, quantity),
    priceExVat: averageAmount(amountExVatValue, quantity),
  };
}

export function emptyMaterialReceiptLineDraft(): MaterialReceiptLineDraft {
  return {
    quantity: '',
    price: '',
  };
}

export function MaterialReceiptFormTable({
  materials,
  drafts,
  onChange,
}: {
  materials: readonly Material[];
  drafts: Readonly<Record<string, MaterialReceiptLineDraft>>;
  onChange: (materialId: string, field: MaterialReceiptLineField, raw: string) => void;
}) {
  const groups = buildGroups(materials, drafts);
  const totals = groupTotals(groups.flatMap((group) => group.rows));
  const { toggleCategory, categoryOpen } = useOpenCategories();

  return (
    <div className="w-max max-w-full border border-line bg-sheet">
      <table className="w-max border-separate border-spacing-0 text-sm">
        <caption className="sr-only">Позиции прихода</caption>
        <thead className={stickyHeadClassName}>
          <tr>
            <th className={`sticky left-0 z-40 ${blockCornerClassName} ${tableBorder.rightThick}`} />
            <th colSpan={COLUMNS.length} scope="colgroup" className={blockHeadingClassName}>
              {keepWithNext('Приход')}
            </th>
          </tr>
          <tr>
            <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
              Наименование
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
            <GroupBlock
              key={group.groupId}
              group={group}
              open={categoryOpen(group.groupId)}
              onToggle={() => toggleCategory(group.groupId)}
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
                  column.key === 'quantity' ? 'h-px p-0' : 'px-1.5 py-2'
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
  materials: readonly Material[],
  drafts: Readonly<Record<string, MaterialReceiptLineDraft>>,
): EntryFormGroup[] {
  return MATERIAL_GROUPS.flatMap((group) => {
    const rows = materials
      .filter((item) => item.groupId === group.id)
      .sort((left, right) => left.name.localeCompare(right.name, 'ru'))
      .map((material) => rowMetrics(material, drafts[material.id] ?? emptyMaterialReceiptLineDraft()));

    if (rows.length === 0) {
      return [];
    }

    return [
      {
        groupId: group.id,
        groupName: group.name,
        rows,
        totals: groupTotals(rows),
      },
    ];
  });
}

function GroupBlock({
  group,
  open,
  onToggle,
  onChange,
}: {
  group: EntryFormGroup;
  open: boolean;
  onToggle: () => void;
  onChange: (materialId: string, field: MaterialReceiptLineField, raw: string) => void;
}) {
  const materialCount = group.rows.length;

  return (
    <>
      <tr>
        <th scope="row" className={categoryNameRowClassName(false)}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-expanded={open}
              aria-label={
                open ? `Свернуть позиции группы ${group.groupName}` : `Развернуть позиции группы ${group.groupName}`
              }
              title={open ? 'Свернуть' : 'Развернуть'}
              onClick={onToggle}
              className="inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {open ? <IconChevronDown /> : <IconChevronRight />}
            </button>
            <span className={categoryNameClassName}>
              {group.groupName} ({materialCount})
            </span>
          </div>
        </th>
        {COLUMNS.map((column) => (
          <td
            key={column.key}
            className={`w-px border-b border-b-line text-right align-middle ${categoryBandClassName} ${columnDividerClassName} ${
              column.key === 'quantity' ? 'h-px p-0' : 'px-1.5 py-2'
            }`}
          >
            <TotalCell column={column.key} totals={group.totals} />
          </td>
        ))}
      </tr>
      {open
        ? group.rows.map((row, index) => (
            <MaterialRow key={row.material.id} row={row} index={index + 1} onChange={onChange} />
          ))
        : null}
    </>
  );
}

function MaterialRow({
  row,
  index,
  onChange,
}: {
  row: EntryFormRow;
  index: number;
  onChange: (materialId: string, field: MaterialReceiptLineField, raw: string) => void;
}) {
  return (
    <tr>
      <th scope="row" className={entityNameRowClassName('repeated')}>
        <div className="flex items-center gap-2">
          <ProductIndex index={index} />
          <span className="text-sm text-ink">{row.material.name}</span>
          {row.material.deletedAt ? <span className="text-sm text-muted">(архив)</span> : null}
        </div>
      </th>
      {COLUMNS.map((column) => (
        <td
          key={column.key}
          className={`w-px border-b border-b-line text-right align-middle ${columnDividerClassName} ${cellKindClassName[COLUMN_KIND[column.key]]} ${
            column.key === 'quantity' ? 'h-px p-0' : 'px-1.5 py-2'
          }`}
        >
          <RowCell column={column.key} row={row} onChange={(field, raw) => onChange(row.material.id, field, raw)} />
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
  onChange: (field: MaterialReceiptLineField, raw: string) => void;
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
            label={`Цена с НДС, ${row.material.name}`}
            value={row.draft.price}
            inputMode="decimal"
            unit="₽"
            format={formatKopecks(parseMoneyInput)}
            onChange={(raw) => onChange('price', raw)}
          />
        }
        bottom={row.priceExVat === null ? <Empty /> : <MoneyAmount amount={row.priceExVat} />}
      />
    );
  }

  if (column === 'quantity') {
    return (
      <MergedTwoStory kind="assigned">
        <GridInput
          label={`Количество, ${row.material.name}`}
          value={row.draft.quantity}
          inputMode="decimal"
          unit={row.material.unit}
          onChange={(raw) => onChange('quantity', raw)}
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

  if (column === 'quantity') {
    return (
      <MergedTwoStory>
        {totals.quantity === null ? (
          <Empty />
        ) : (
          <TableNumber value={totals.quantity}>{formatQuantityDraft(totals.quantity)}</TableNumber>
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
