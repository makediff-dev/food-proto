'use client';

import Link from 'next/link';
import { useState } from 'react';

import { deletedCategories } from '@/domain/categories';
import { deletedProducts } from '@/domain/products';
import {
  PLANNING_ARCHIVE_TITLE,
  planningHref,
} from '@/features/planning/paths';
import { FIELD_ERROR } from '@/features/sales/fields';
import { useSales } from '@/features/sales/use-sales';
import { IconArrowLeft, IconUndo } from '@/features/shell/icons';
import { PageFrame } from '@/features/shell/page-frame';

export function PlanningArchiveScreen() {
  const sales = useSales();
  const [error, setError] = useState<string | null>(null);
  const categories = deletedCategories(sales.document);
  const products = deletedProducts(sales.document);
  const empty = categories.length === 0 && products.length === 0;

  return (
    <PageFrame
      title={PLANNING_ARCHIVE_TITLE}
      full
      lede="Удалённые категории и товары можно вернуть."
      back={
        <Link
          href={planningHref()}
          aria-label="Назад"
          className="inline-flex size-11 shrink-0 items-center justify-center text-ink outline-none hover:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <IconArrowLeft />
        </Link>
      }
    >
      <div className="flex flex-col gap-4">
        {error ? <p className="text-sm text-ink">{error}</p> : null}
        {empty ? (
          <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
            Удалённых категорий и товаров нет.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {categories.length > 0 ? (
              <section className="border border-line bg-sheet p-4">
                <h2 className="text-sm font-semibold text-ink">Категории</h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {categories.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <p className="text-sm text-ink">{item.name}</p>
                      <button
                        type="button"
                        disabled={!sales.hydrated}
                        onClick={() => {
                          const rejection = sales.restoreCategory(item.id);
                          setError(rejection ? FIELD_ERROR[rejection] : null);
                        }}
                        className={restoreButtonClassName}
                      >
                        <IconUndo />
                        Вернуть
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            {products.length > 0 ? (
              <section className="border border-line bg-sheet p-4">
                <h2 className="text-sm font-semibold text-ink">Товары</h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {products.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <p className="text-sm text-ink">{item.name}</p>
                      <button
                        type="button"
                        disabled={!sales.hydrated}
                        onClick={() => {
                          const rejection = sales.restoreProduct(item.id);
                          setError(rejection ? FIELD_ERROR[rejection] : null);
                        }}
                        className={restoreButtonClassName}
                      >
                        <IconUndo />
                        Вернуть
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        )}
      </div>
    </PageFrame>
  );
}

const restoreButtonClassName =
  'inline-flex h-11 items-center justify-center gap-2 border border-line bg-paper px-3 text-sm text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60';
