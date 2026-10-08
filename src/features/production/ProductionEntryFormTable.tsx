'use client';

import { useState } from 'react';

import type { Product, ProductCategory } from '@/domain/document';
import { parseProductionEntryPieces } from '@/features/production/text';
import { IconChevronDown, IconChevronRight } from '@/features/shell/Icons';
import {
  ColumnLabel,
  Empty,
  gridFieldClassName,
  keepWithNext,
  MergedTwoStory,
  stickyHeadClassName,
  TableNumber,
  tableBorder,
} from '@/features/table';
import { sanitizeDraft } from '@/features/table/format';

export interface ProductionEntryLineDraft {
  id: string;
  pieces: string;
}

interface EntryFormRow {
  product: Product;
  draft: ProductionEntryLineDraft;
  pieces: number | null;
  filled: boolean;
}

interface EntryFormGroup {
  category: ProductCategory;
  rows: EntryFormRow[];
  pieces: number | null;
}

export function emptyProductionEntryLineDraft(): ProductionEntryLineDraft {
  return {
    id: `production-entry-line:${crypto.randomUUID()}`,
    pieces: '0',
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
  onChange: (productId: string, raw: string) => void;
}) {
  const groups = buildGroups(categories, products, drafts);
  const totalPieces = sumPieces(groups.flatMap((group) => group.rows));
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(() => new Set(groups.map((group) => group.category.id)));

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
        <caption className="sr-only">Товары выпуска</caption>
        <thead className={stickyHeadClassName}>
          <tr>
            <th className={`sticky left-0 z-40 ${tableBorder.bottomThin} ${tableBorder.rightThick} bg-paper`} />
            <th
              scope="colgroup"
              className={`${tableBorder.bottomThin} bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-ink`}
            >
              {keepWithNext('Выпуск')}
            </th>
          </tr>
          <tr>
            <th
              scope="col"
              className={`sticky left-0 z-40 w-px max-w-max whitespace-nowrap ${tableBorder.bottomThin} ${tableBorder.rightThick} bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-muted`}
            >
              Товар
            </th>
            <th
              scope="col"
              className={`w-px whitespace-normal ${tableBorder.rightThin} ${tableBorder.bottomThin} bg-paper px-1.5 py-2 text-center align-middle text-sm font-normal leading-5 text-muted last:border-r-0`}
            >
              <ColumnLabel label="Шт" />
            </th>
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
            <td className="h-px w-px border-t-[1.5px] border-t-muted border-r border-r-line border-b border-b-line bg-paper p-0 text-right align-middle last:border-r-0">
              <PiecesTotal pieces={totalPieces} />
            </td>
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
        if (!draft) {
          return [];
        }
        const pieces = parseProductionEntryPieces(draft.pieces);
        return [
          {
            product,
            draft,
            pieces,
            filled: pieces !== null,
          },
        ];
      });

    if (rows.length === 0 && category.deletedAt !== null) {
      return [];
    }

    return [
      {
        category,
        rows,
        pieces: sumPieces(rows),
      },
    ];
  });
}

function sumPieces(rows: readonly EntryFormRow[]): number | null {
  let pieces = 0;
  let filled = 0;
  for (const row of rows) {
    if (!row.filled || row.pieces === null) {
      continue;
    }
    filled += 1;
    pieces += row.pieces;
  }
  return filled === 0 ? null : pieces;
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
  onChange: (productId: string, raw: string) => void;
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
            {deleted ? <span className="text-sm font-normal text-muted">(архив)</span> : null}
          </div>
        </th>
        <td className="h-px w-px border-b border-b-line border-r border-r-line bg-paper p-0 text-right align-middle last:border-r-0">
          <PiecesTotal pieces={group.pieces} />
        </td>
      </tr>
      {open ? group.rows.map((row) => <ProductRow key={row.product.id} row={row} onChange={onChange} />) : null}
    </>
  );
}

function ProductRow({ row, onChange }: { row: EntryFormRow; onChange: (productId: string, raw: string) => void }) {
  return (
    <tr>
      <th
        scope="row"
        className="sticky left-0 z-10 w-px max-w-max whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted bg-sheet px-3 py-2 pl-8 text-left align-middle font-normal"
      >
        <div className="flex flex-col gap-1">
          <span className="text-sm text-ink">{row.product.name}</span>
          {row.product.deletedAt ? <span className="text-sm text-muted">(архив)</span> : null}
        </div>
      </th>
      <td className="h-px w-px border-b border-b-line border-r border-r-line p-0 text-right align-middle last:border-r-0">
        <MergedTwoStory highlighted>
          <PiecesInput
            label={`Штуки, ${row.product.name}`}
            value={row.draft.pieces}
            onChange={(raw) => onChange(row.product.id, raw)}
          />
        </MergedTwoStory>
      </td>
    </tr>
  );
}

function PiecesTotal({ pieces }: { pieces: number | null }) {
  return (
    <MergedTwoStory>
      {pieces === null ? (
        <Empty />
      ) : (
        <TableNumber value={pieces}>
          {new Intl.NumberFormat('ru-RU', {
            maximumFractionDigits: 0,
          }).format(pieces)}{' '}
          шт
        </TableNumber>
      )}
    </MergedTwoStory>
  );
}

function PiecesInput({ label, value, onChange }: { label: string; value: string; onChange: (raw: string) => void }) {
  return (
    <div data-editable-field="" className="min-w-0">
      <div className="flex items-baseline justify-end gap-1">
        <input
          value={value}
          inputMode="numeric"
          autoComplete="off"
          aria-label={label}
          onChange={(event) => onChange(sanitizeDraft(event.target.value, 'numeric'))}
          className={`${gridFieldClassName} text-ink`}
          placeholder={value ? undefined : '—'}
        />
        <span className="shrink-0 text-sm text-ink">шт</span>
      </div>
    </div>
  );
}
