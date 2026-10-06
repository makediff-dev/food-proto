'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { saleTotals } from '@/domain/sales';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { formatMoney } from '@/features/sales/money';
import {
  SALES_SECTION_TITLE,
  saleHref,
  salesFactHref,
} from '@/features/sales-fact/paths';
import { formatSaleDate, SALE_ERROR } from '@/features/sales-fact/text';
import { useSalesJournal } from '@/features/sales-fact/use-sales-journal';
import { IconEye, IconUndo } from '@/features/shell/icons';
import { PageFrame } from '@/features/shell/page-frame';

export function DeletedSalesScreen() {
  const journal = useSalesJournal();
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const [error, setError] = useState<string | null>(null);

  return (
    <PageFrame
      title={SALES_SECTION_TITLE}
      lede="Удалённые продажи можно открыть и вернуть."
    >
      <div className="flex flex-col gap-4">
        <Link
          href={salesFactHref({ month: currentMonth, currentMonth })}
          className={quietLinkClassName}
        >
          <IconUndo />К продажам
        </Link>
        {error ? <p className="text-sm text-ink">{error}</p> : null}
        {journal.deleted.length === 0 ? (
          <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
            Удалённых продаж нет.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {journal.deleted.map((item) => {
              const totals = saleTotals(journal.document, item);
              return (
                <li key={item.id} className="border border-line bg-sheet p-4">
                  <p className="text-sm text-ink">{item.customerName}</p>
                  <p className="mt-1 text-sm text-muted">
                    {formatSaleDate(item.occurredOn)}
                  </p>
                  {totals.revenueWithVat !== null &&
                  totals.revenueExVat !== null ? (
                    <p className="mt-2 text-sm text-ink">
                      {formatMoney(totals.revenueWithVat)} с НДС ·{' '}
                      {formatMoney(totals.revenueExVat)} без НДС
                    </p>
                  ) : null}
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Link
                      href={saleHref(item.id)}
                      className={quietLinkClassName}
                    >
                      <IconEye />
                      Открыть
                    </Link>
                    <button
                      type="button"
                      disabled={!journal.hydrated}
                      onClick={() => {
                        const rejection = journal.restore(item.id);
                        setError(rejection ? SALE_ERROR[rejection] : null);
                      }}
                      className={quietLinkClassName}
                    >
                      <IconUndo />
                      Вернуть
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </PageFrame>
  );
}

const quietLinkClassName =
  'inline-flex h-11 items-center justify-center gap-2 border border-line bg-sheet px-3 text-sm text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';
