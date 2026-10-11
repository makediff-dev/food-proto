'use client';

import type { Product, ProductCategory } from '@/domain/document';
import { parseProductionEntryPieces } from '@/features/production/text';
import { IconChevronDown, IconChevronRight } from '@/features/shell/Icons';
import {
  blockCornerClassName,
  blockHeadingClassName,
  ColumnLabel,
  categoryBandClassName,
  categoryNameClassName,
  columnDividerClassName,
  columnHeadingClassName,
  Empty,
  gridFieldClassName,
  keepWithNext,
  MergedTwoStory,
  nameHeadingClassName,
  ProductIndex,
  stickyHeadClassName,
  TableNumber,
  tableBorder,
  totalNameClassName,
  useOpenCategories,
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
  const { toggleCategory, categoryOpen } = useOpenCategories();

  return (
    <div className="w-max max-w-full border border-line bg-sheet">
      <table className="w-max border-separate border-spacing-0 text-sm">
        <caption className="sr-only">Товары выпуска</caption>
        <thead className={stickyHeadClassName}>
          <tr>
            <th className={`sticky left-0 z-40 ${blockCornerClassName} ${tableBorder.rightThick}`} />
            <th scope="colgroup" className={blockHeadingClassName}>
              {keepWithNext('Выпуск')}
            </th>
          </tr>
          <tr>
            <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
              Товар
            </th>
            <th scope="col" className={`${columnHeadingClassName} ${columnDividerClassName}`}>
              <ColumnLabel label="Шт" />
            </th>
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
            <td
              className={`h-px w-px border-y-[3px] border-y-muted bg-sheet p-0 text-right align-middle text-sm font-bold ${columnDividerClassName}`}
            >
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
        <td
          className={`h-px w-px border-b border-b-line p-0 text-right align-middle ${categoryBandClassName} ${columnDividerClassName}`}
        >
          <PiecesTotal pieces={group.pieces} />
        </td>
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
  onChange: (productId: string, raw: string) => void;
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
      <td className={`h-px w-px border-b border-b-line p-0 text-right align-middle ${columnDividerClassName}`}>
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
