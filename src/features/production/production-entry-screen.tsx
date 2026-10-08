'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useState } from 'react';

import {
  isOccurredOn,
  type Product,
  type ProductCategory,
  type ProductionEntryLine,
  type PrototypeDocument,
} from '@/domain/document';
import { periodGridCategories, periodGridProducts } from '@/domain/period-grid';
import {
  defaultProductionEntryDay,
  maxProductionEntryOccurredOn,
  productionEntryByIdOrNull,
} from '@/domain/production-journal';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { planningHref } from '@/features/planning/paths';
import {
  NEW_PRODUCTION_ENTRY_TITLE,
  PRODUCTION_JOURNAL_TITLE,
  productionJournalHref,
} from '@/features/production/paths';
import {
  emptyProductionEntryLineDraft,
  ProductionEntryFormTable,
  type ProductionEntryLineDraft,
} from '@/features/production/production-entry-form-table';
import { PRODUCTION_ENTRY_ERROR, parseProductionEntryPieces } from '@/features/production/text';
import { useProductionJournal } from '@/features/production/use-production-journal';
import { fieldClassName, primaryButtonClassName } from '@/features/sales/fields';
import { IconArrowLeft, IconCheck, IconTrash } from '@/features/shell/icons';
import { PageFrame } from '@/features/shell/page-frame';

function lineDraftFromEntry(line: ProductionEntryLine): ProductionEntryLineDraft {
  return {
    id: line.id,
    pieces: String(line.pieces),
  };
}

function entryFormProducts(document: PrototypeDocument, month: string, lineProductIds: readonly string[]): Product[] {
  const referenced = new Set(lineProductIds);
  const period = periodGridProducts(document, month);
  const periodIds = new Set(period.map((item) => item.id));
  const extras = document.products.filter((item) => referenced.has(item.id) && !periodIds.has(item.id));
  return [...period, ...extras];
}

function entryFormCategories(document: PrototypeDocument, products: readonly Product[]): ProductCategory[] {
  return periodGridCategories(document, products);
}

function initialDrafts(
  document: PrototypeDocument,
  existingLines: readonly ProductionEntryLine[],
  month: string,
): Record<string, ProductionEntryLineDraft> {
  const byProduct = new Map(existingLines.map((line) => [line.productId, lineDraftFromEntry(line)]));
  const products = entryFormProducts(
    document,
    month,
    existingLines.map((line) => line.productId),
  );
  const drafts: Record<string, ProductionEntryLineDraft> = {};

  for (const product of products) {
    drafts[product.id] = byProduct.get(product.id) ?? emptyProductionEntryLineDraft();
  }

  return drafts;
}

export function ProductionEntryScreen({ entryId, dayQuery }: { entryId: string | null; dayQuery: string }) {
  const journal = useProductionJournal();
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const existing = entryId ? productionEntryByIdOrNull(journal.document, entryId) : null;

  if (entryId && !existing) {
    return (
      <PageFrame
        title={PRODUCTION_JOURNAL_TITLE}
        full
        lede="Запись выпуска: дата и штуки по товарам."
        back={
          <Link
            href={productionJournalHref({ month: currentMonth, currentMonth })}
            aria-label="Назад"
            className="inline-flex size-11 shrink-0 items-center justify-center text-ink outline-none hover:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <IconArrowLeft />
          </Link>
        }
      >
        <p className="border border-line bg-sheet px-4 py-4 text-sm text-ink">Запись не найдена.</p>
      </PageFrame>
    );
  }

  const initialDay =
    existing?.occurredOn ?? (isOccurredOn(dayQuery) ? dayQuery : defaultProductionEntryDay(currentMonth, today));

  return (
    <EntryForm
      entryId={existing?.id ?? null}
      initialDay={initialDay}
      initialDrafts={initialDrafts(journal.document, existing?.lines ?? [], initialDay.slice(0, 7))}
    />
  );
}

function EntryForm({
  entryId,
  initialDay,
  initialDrafts,
}: {
  entryId: string | null;
  initialDay: string;
  initialDrafts: Record<string, ProductionEntryLineDraft>;
}) {
  const journal = useProductionJournal();
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const maxDay = maxProductionEntryOccurredOn(today);
  const dateId = useId();
  const [occurredOn, setOccurredOn] = useState(initialDay);
  const [drafts, setDrafts] = useState(initialDrafts);
  const [saveError, setSaveError] = useState<string | null>(null);
  const month = occurredOn.slice(0, 7);

  const filledProductIds = useMemo(
    () =>
      Object.entries(drafts)
        .filter(([, line]) => parseProductionEntryPieces(line.pieces) !== null)
        .map(([productId]) => productId),
    [drafts],
  );

  const products = entryFormProducts(journal.document, month, filledProductIds);
  const categories = entryFormCategories(journal.document, products);

  useEffect(() => {
    setDrafts((current) => {
      let changed = false;
      const next = { ...current };
      for (const product of products) {
        if (next[product.id]) {
          continue;
        }
        next[product.id] = emptyProductionEntryLineDraft();
        changed = true;
      }
      return changed ? next : current;
    });
  }, [products]);

  function setLine(productId: string, raw: string) {
    setDrafts((current) => {
      const line = current[productId];
      if (!line) {
        return current;
      }
      return { ...current, [productId]: { ...line, pieces: raw } };
    });
  }

  function parsedLines(): ProductionEntryLine[] | null {
    const result: ProductionEntryLine[] = [];

    for (const product of products) {
      const line = drafts[product.id];
      if (!line) {
        continue;
      }

      const pieces = parseProductionEntryPieces(line.pieces);
      if (pieces === null) {
        const trimmed = line.pieces.trim();
        if (trimmed !== '' && trimmed !== '0') {
          setSaveError(PRODUCTION_ENTRY_ERROR.pieces);
          return null;
        }
        continue;
      }

      result.push({
        id: line.id,
        productId: product.id,
        pieces,
      });
    }

    if (result.length === 0) {
      setSaveError(PRODUCTION_ENTRY_ERROR.lines);
      return null;
    }

    return result;
  }

  function save() {
    const nextLines = parsedLines();
    if (!nextLines) {
      return;
    }

    const rejection = entryId
      ? journal.update(entryId, occurredOn, nextLines)
      : journal.add(occurredOn, nextLines).rejection;
    if (rejection) {
      setSaveError(PRODUCTION_ENTRY_ERROR[rejection]);
      return;
    }

    const entryMonth = occurredOn.slice(0, 7);
    router.replace(
      productionJournalHref({
        month: entryMonth || currentMonth,
        currentMonth,
      }),
    );
  }

  const backHref = productionJournalHref({
    month: month || currentMonth,
    currentMonth,
  });

  return (
    <PageFrame
      title={entryId ? PRODUCTION_JOURNAL_TITLE : NEW_PRODUCTION_ENTRY_TITLE}
      full
      lede={entryId ? 'Запись выпуска: дата и штуки по товарам.' : undefined}
      back={
        entryId ? (
          <Link
            href={backHref}
            aria-label="Назад"
            className="inline-flex size-11 shrink-0 items-center justify-center text-ink outline-none hover:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <IconArrowLeft />
          </Link>
        ) : (
          <button
            type="button"
            aria-label="Назад"
            onClick={() => router.back()}
            className="inline-flex size-11 shrink-0 items-center justify-center text-ink outline-none hover:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <IconArrowLeft />
          </button>
        )
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start gap-4">
          {products.length === 0 ? (
            <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
              Сначала добавьте товар в{' '}
              <Link
                href={planningHref()}
                className="text-ink underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                Планировании
              </Link>
              .
            </p>
          ) : (
            <ProductionEntryFormTable categories={categories} products={products} drafts={drafts} onChange={setLine} />
          )}

          <div className="sticky top-16 z-20 flex w-72 shrink-0 flex-col gap-4 self-start border border-line bg-sheet p-4 lg:top-4">
            <div>
              <label htmlFor={dateId} className="text-sm text-muted">
                Дата
              </label>
              <input
                id={dateId}
                type="date"
                min="2000-01-01"
                max={maxDay}
                value={occurredOn}
                onChange={(event) => setOccurredOn(event.target.value)}
                className={`mt-2 ${fieldClassName}`}
              />
            </div>
            <button
              type="button"
              disabled={!journal.hydrated}
              onClick={save}
              className={`${primaryButtonClassName} w-full`}
            >
              <IconCheck />
              Сохранить
            </button>
            {entryId ? (
              <button
                type="button"
                aria-label="Удалить запись"
                onClick={() => {
                  const confirmed = window.confirm('Удалить запись выпуска? Её нельзя будет вернуть.');
                  if (!confirmed) {
                    return;
                  }
                  journal.remove(entryId);
                  router.push(
                    productionJournalHref({
                      month: month || currentMonth,
                      currentMonth,
                    }),
                  );
                }}
                className="inline-flex h-11 w-full items-center justify-center gap-2 text-sm text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <IconTrash />
                Удалить
              </button>
            ) : null}
            {saveError ? <p className="text-sm text-ink">{saveError}</p> : null}
          </div>
        </div>
      </div>
    </PageFrame>
  );
}
