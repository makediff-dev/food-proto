'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { useDocumentStore } from '@/data/DocumentProvider';
import type { PrototypeDocument, Sale } from '@/domain/document';
import { saleTotals, workingSalesInMonth } from '@/domain/sales';
import { monthKeyFromDate, planMonthOpen, shiftMonth } from '@/domain/sales-plan';
import { lastHorizonMonth } from '@/domain/summary';
import { monthFieldClassName, primaryButtonClassName } from '@/features/sales/fields';
import { formatPieces } from '@/features/sales/text';
import { SALES_JOURNAL_TITLE, saleHref, saleNewHref, salesJournalHref } from '@/features/sales-fact/paths';
import { formatSaleDate } from '@/features/sales-fact/text';
import { IconPlus } from '@/features/shell/Icons';
import { MonthStep } from '@/features/shell/MonthStep';
import { PageFrame } from '@/features/shell/PageFrame';
import { MoneyAmount } from '@/features/table';

export function SalesJournalScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = planMonthOpen(month, today) ? month : currentMonth;

  return <Workspace month={selectedMonth} currentMonth={currentMonth} today={today} />;
}

function Workspace({ month, currentMonth, today }: { month: string; currentMonth: string; today: Date }) {
  const store = useDocumentStore();
  const router = useRouter();
  const items = workingSalesInMonth(store.document, month);
  const days = groupSalesByDay(items);
  const previousMonth = shiftMonth(month, -1);
  const nextMonth = shiftMonth(month, 1);
  const horizonEnd = lastHorizonMonth(today);
  const nextDisabled = nextMonth > horizonEnd;

  function open(nextMonthKey: string) {
    router.push(salesJournalHref({ month: nextMonthKey, currentMonth }), {
      scroll: false,
    });
  }

  return (
    <PageFrame
      title={SALES_JOURNAL_TITLE}
      full
      aside={
        <Link href={saleNewHref()} className={primaryButtonClassName}>
          <IconPlus />
          Добавить продажу
        </Link>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="border border-line bg-sheet p-4">
          <div className="flex items-center gap-2">
            <MonthStep
              label="Предыдущий месяц"
              direction="previous"
              disabled={!planMonthOpen(previousMonth, today)}
              onClick={() => open(previousMonth)}
            />
            <input
              type="month"
              aria-label="Месяц"
              min="2000-01"
              max={horizonEnd}
              value={month}
              onChange={(event) => {
                const next = event.target.value;
                if (planMonthOpen(next, today)) {
                  open(next);
                }
              }}
              className={monthFieldClassName}
            />
            <MonthStep
              label="Следующий месяц"
              direction="next"
              disabled={nextDisabled}
              onClick={() => open(nextMonth)}
            />
          </div>
        </div>

        {items.length === 0 ? (
          <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
            За этот месяц рабочих продаж нет. Добавьте продажу: заказчик, дата и товары. Она попадёт в таблицу факта за
            этот день.
          </p>
        ) : (
          <div className="border border-line bg-sheet">
            {days.map((day) => (
              <section key={day.occurredOn}>
                <h2 className="border-b border-line bg-paper px-4 py-2 text-sm text-ink">
                  {formatSaleDate(day.occurredOn)}
                </h2>
                <ul>
                  {day.items.map((item) => {
                    const totals = saleTotals(store.document, item);
                    return (
                      <li key={item.id} className="border-b border-line last:border-b-0">
                        <Link
                          href={saleHref(item.id)}
                          className="flex flex-col gap-2 px-4 py-3 outline-none hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:flex-row sm:items-start sm:justify-between sm:gap-6"
                        >
                          <div className="min-w-0">
                            <p className="text-sm text-ink">{item.customerName}</p>
                            <p className="mt-1 text-sm leading-6 text-muted">{saleComposition(store.document, item)}</p>
                          </div>
                          <p className="shrink-0 text-sm text-ink sm:text-right">
                            {totals.revenueWithVat === null || totals.revenueExVat === null ? (
                              '—'
                            ) : (
                              <>
                                <MoneyAmount amount={totals.revenueWithVat} /> с НДС
                                <span className="mt-1 block text-muted">
                                  <MoneyAmount amount={totals.revenueExVat} /> без НДС
                                </span>
                              </>
                            )}
                          </p>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </PageFrame>
  );
}

function groupSalesByDay(items: readonly Sale[]): {
  occurredOn: string;
  items: Sale[];
}[] {
  const groups = new Map<string, Sale[]>();
  for (const item of items) {
    const bucket = groups.get(item.occurredOn);
    if (bucket) {
      bucket.push(item);
    } else {
      groups.set(item.occurredOn, [item]);
    }
  }

  return [...groups.entries()]
    .sort((left, right) => right[0].localeCompare(left[0]))
    .map(([occurredOn, dayItems]) => ({
      occurredOn,
      items: dayItems,
    }));
}

function saleComposition(document: PrototypeDocument, sale: Sale): string {
  return sale.lines
    .map((line) => {
      const product = document.products.find((item) => item.id === line.productId);
      const name = product?.name ?? 'Товар';
      const archived = product?.deletedAt ? ' (архив)' : '';
      return `${name}${archived}, ${formatPieces(line.pieces)} шт`;
    })
    .join('; ');
}
