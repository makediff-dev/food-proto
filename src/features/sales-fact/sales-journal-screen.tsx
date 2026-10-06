'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useMemo } from 'react';

import type { PrototypeDocument, Sale } from '@/domain/document';
import { saleTotals, workingSalesInMonth } from '@/domain/sales';
import { salesFactMonthOpen } from '@/domain/sales-fact';
import { monthKeyFromDate, shiftMonth } from '@/domain/sales-plan';
import {
  fieldClassName,
  primaryButtonClassName,
} from '@/features/sales/fields';
import { formatMoney } from '@/features/sales/money';
import { formatPieces } from '@/features/sales/text';
import {
  deletedSalesHref,
  SALES_SECTION_TITLE,
  saleHref,
  saleNewHref,
  salesFactHref,
  salesJournalHref,
} from '@/features/sales-fact/paths';
import { formatSaleDate } from '@/features/sales-fact/text';
import { useSalesFact } from '@/features/sales-fact/use-sales-fact';
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
  IconUndo,
} from '@/features/shell/icons';
import { PageFrame } from '@/features/shell/page-frame';
import { TableNumber } from '@/features/shell/table-number';

const LEDE = 'Отдельные продажи месяца по датам: заказчик, товары и сумма.';

export function SalesJournalScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = salesFactMonthOpen(month, today) ? month : currentMonth;

  return (
    <Workspace
      month={selectedMonth}
      currentMonth={currentMonth}
      today={today}
    />
  );
}

function Workspace({
  month,
  currentMonth,
  today,
}: {
  month: string;
  currentMonth: string;
  today: Date;
}) {
  const sales = useSalesFact();
  const router = useRouter();
  const monthFieldId = useId();
  const items = workingSalesInMonth(sales.document, month);
  const days = groupSalesByDay(items);
  const deletedCount = sales.document.sales.filter(
    (item) => item.deletedAt !== null,
  ).length;
  const previousMonth = shiftMonth(month, -1);
  const nextMonth = shiftMonth(month, 1);
  const nextDisabled = nextMonth > currentMonth;

  function open(nextMonthKey: string) {
    router.push(salesJournalHref({ month: nextMonthKey, currentMonth }), {
      scroll: false,
    });
  }

  return (
    <PageFrame title={SALES_SECTION_TITLE} full lede={LEDE}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={saleNewHref()} className={primaryButtonClassName}>
            <IconPlus />
            Добавить продажу
          </Link>
          <Link href={deletedSalesHref()} className={quietLinkClassName}>
            <IconUndo />
            Удалённые продажи
            {deletedCount === 0 ? '' : ` ${deletedCount}`}
          </Link>
          <Link
            href={salesFactHref({ month, currentMonth })}
            className={quietLinkClassName}
          >
            <IconUndo />К продажам
          </Link>
        </div>

        <div className="border border-line bg-sheet p-4">
          <label htmlFor={monthFieldId} className="text-sm text-muted">
            Месяц
          </label>
          <div className="mt-2 flex items-center gap-2">
            <MonthStep
              label="Предыдущий месяц"
              direction="previous"
              disabled={!salesFactMonthOpen(previousMonth, today)}
              onClick={() => open(previousMonth)}
            />
            <input
              id={monthFieldId}
              type="month"
              min="2000-01"
              max={currentMonth}
              value={month}
              onChange={(event) => {
                const next = event.target.value;
                if (salesFactMonthOpen(next, today)) {
                  open(next);
                }
              }}
              className={`w-44 ${fieldClassName}`}
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
            За этот месяц рабочих продаж нет. Добавьте продажу: заказчик, дата и
            товары. Она попадёт в таблицу факта за этот день.
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
                    const totals = saleTotals(sales.document, item);
                    return (
                      <li
                        key={item.id}
                        className="border-b border-line last:border-b-0"
                      >
                        <Link
                          href={saleHref(item.id)}
                          className="flex flex-col gap-2 px-4 py-3 outline-none hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:flex-row sm:items-start sm:justify-between sm:gap-6"
                        >
                          <div className="min-w-0">
                            <p className="text-sm text-ink">
                              {item.customerName}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-muted">
                              {saleComposition(sales.document, item)}
                            </p>
                          </div>
                          <p className="shrink-0 text-sm text-ink sm:text-right">
                            {totals.revenueWithVat === null ||
                            totals.revenueExVat === null ? (
                              '—'
                            ) : (
                              <>
                                <TableNumber value={totals.revenueWithVat}>
                                  {formatMoney(totals.revenueWithVat)}
                                </TableNumber>{' '}
                                с НДС
                                <span className="mt-1 block text-muted">
                                  <TableNumber value={totals.revenueExVat}>
                                    {formatMoney(totals.revenueExVat)}
                                  </TableNumber>{' '}
                                  без НДС
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
      const product = document.products.find(
        (item) => item.id === line.productId,
      );
      const name = product?.name ?? 'Товар';
      const deleted = product?.deletedAt ? ' · удалён' : '';
      return `${name}${deleted}, ${formatPieces(line.pieces)} шт`;
    })
    .join('; ');
}

function MonthStep({
  label,
  direction,
  disabled,
  onClick,
}: {
  label: string;
  direction: 'previous' | 'next';
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-11 items-center justify-center border border-line bg-sheet text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40"
    >
      {direction === 'previous' ? <IconChevronLeft /> : <IconChevronRight />}
    </button>
  );
}

const quietLinkClassName =
  'inline-flex h-11 items-center justify-center gap-2 border border-line bg-sheet px-3 text-sm text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';
