'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

import { isOccurredOn } from '@/domain/document';
import { saleTotals, workingSalesInMonth } from '@/domain/sales';
import {
  defaultSalesFactDay,
  monthDates,
  salesFactById,
  salesFactGridProducts,
  salesFactMonth,
  salesFactMonthOpen,
  workingSalesFact,
} from '@/domain/sales-fact';
import { monthKeyFromDate, shiftMonth } from '@/domain/sales-plan';
import {
  fieldClassName,
  primaryButtonClassName,
} from '@/features/sales/fields';
import { formatMoney } from '@/features/sales/money';
import { formatMonth } from '@/features/sales/text';
import {
  deletedSalesHref,
  SALES_FACT_SECTION_TITLE,
  type SalesFactView,
  saleHref,
  saleNewHref,
  salesFactHref,
} from '@/features/sales-fact/paths';
import { SalesFactTable } from '@/features/sales-fact/sales-fact-table';
import {
  formatSaleDate,
  formatSalesFactDay,
  SALES_FACT_ERROR,
} from '@/features/sales-fact/text';
import { useSalesFact } from '@/features/sales-fact/use-sales-fact';
import {
  IconChevronLeft,
  IconChevronRight,
  IconEye,
  IconFullscreen,
  IconFullscreenExit,
  IconPlan,
  IconPlus,
  IconTrash,
  IconUndo,
} from '@/features/shell/icons';
import { PageFrame } from '@/features/shell/page-frame';

const WEEKDAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] as const;

export function SalesFactScreen({
  month,
  day,
  view,
  showDeleted,
  factId,
}: {
  month: string;
  day: string;
  view: SalesFactView;
  showDeleted: boolean;
  factId: string;
}) {
  const sales = useSalesFact();
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);

  if (showDeleted && !factId) {
    return <DeletedList />;
  }

  const opened = factId ? salesFactById(sales.document, factId) : null;
  const readOnly = showDeleted;
  const selectedMonth = readOnly
    ? (opened?.month ?? currentMonth)
    : resolveMonth(month, today);
  const fact = readOnly
    ? opened && opened.deletedAt !== null
      ? opened
      : null
    : workingSalesFact(sales.document, selectedMonth);

  if (readOnly && !fact) {
    return (
      <PageFrame
        title={SALES_FACT_SECTION_TITLE}
        full
        lede="Дневной факт продаж и выпуска: цена, объём и остатки на производстве и на РЦ."
      >
        <p className="border border-line bg-sheet px-4 py-4 text-sm text-ink">
          Запись не найдена.
        </p>
        <Link
          href={salesFactHref({
            month: currentMonth,
            currentMonth,
            showDeleted: true,
          })}
          className={quietLinkClassName}
        >
          <IconUndo />К удалённым
        </Link>
      </PageFrame>
    );
  }

  return (
    <Workspace
      month={selectedMonth}
      dayQuery={day}
      view={view}
      currentMonth={currentMonth}
      today={today}
      readOnly={readOnly}
      factId={fact?.id ?? ''}
    />
  );
}

function Workspace({
  month,
  dayQuery,
  view,
  currentMonth,
  today,
  readOnly,
  factId,
}: {
  month: string;
  dayQuery: string;
  view: SalesFactView;
  currentMonth: string;
  today: Date;
  readOnly: boolean;
  factId: string;
}) {
  const sales = useSalesFact();
  const router = useRouter();
  const monthFieldId = useId();
  const [fullscreen, setFullscreen] = useState(false);
  const fact = readOnly
    ? salesFactById(sales.document, factId)
    : workingSalesFact(sales.document, month);
  const products = salesFactGridProducts(sales.document, fact, month);
  const days = useMemo(
    () =>
      salesFactMonth(
        sales.document,
        readOnly
          ? salesFactById(sales.document, factId)
          : workingSalesFact(sales.document, month),
        month,
      ),
    [sales.document, readOnly, factId, month],
  );
  const fallbackDay = defaultSalesFactDay(month);
  const selectedDay = resolveDay(month, dayQuery, fallbackDay);
  const visible =
    view === 'all'
      ? days
      : days.filter((item) => item.occurredOn === selectedDay);
  const editable =
    sales.hydrated && !readOnly && salesFactMonthOpen(month, today);
  const previousMonth = shiftMonth(month, -1);
  const nextMonth = shiftMonth(month, 1);
  const nextDisabled = nextMonth > currentMonth;
  const hasTable = products.length > 0;
  const tableExpanded = fullscreen && hasTable;

  useEffect(() => {
    if (!tableExpanded) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setFullscreen(false);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [tableExpanded]);

  function open(next: { month?: string; day?: string; view?: SalesFactView }) {
    const targetMonth = next.month ?? month;
    const targetDay = resolveDay(
      targetMonth,
      next.day ?? selectedDay,
      defaultSalesFactDay(targetMonth),
    );
    router.push(
      salesFactHref({
        month: targetMonth,
        currentMonth,
        day: targetDay,
        defaultDay: defaultSalesFactDay(targetMonth),
        view: next.view ?? view,
        showDeleted: readOnly,
        factId: readOnly ? factId : undefined,
      }),
      { scroll: false },
    );
  }

  return (
    <>
      <PageFrame
        title={SALES_FACT_SECTION_TITLE}
        full
        lede="Дневной факт продаж и выпуска: цена, объём и остатки на производстве и на РЦ."
      >
        <div className="flex flex-col gap-4">
          <div className="border border-line bg-sheet">
            <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex shrink-0 items-end gap-2">
                <div>
                  <label htmlFor={monthFieldId} className="text-sm text-muted">
                    Месяц
                  </label>
                  <div className="mt-2 flex items-center gap-2">
                    {readOnly ? null : (
                      <MonthStep
                        label="Предыдущий месяц"
                        direction="previous"
                        disabled={!salesFactMonthOpen(previousMonth, today)}
                        onClick={() => open({ month: previousMonth })}
                      />
                    )}
                    {readOnly ? (
                      <p className="text-sm text-ink">{formatMonth(month)}</p>
                    ) : (
                      <input
                        id={monthFieldId}
                        type="month"
                        min="2000-01"
                        max={currentMonth}
                        value={month}
                        onChange={(event) => {
                          const next = event.target.value;
                          if (salesFactMonthOpen(next, today)) {
                            open({ month: next });
                          }
                        }}
                        className={`w-44 ${fieldClassName}`}
                      />
                    )}
                    {readOnly ? null : (
                      <MonthStep
                        label="Следующий месяц"
                        direction="next"
                        disabled={nextDisabled}
                        onClick={() => open({ month: nextMonth })}
                      />
                    )}
                  </div>
                </div>
                {readOnly ? (
                  <RestoreButton
                    factId={factId}
                    monthLabel={formatMonth(month)}
                  />
                ) : (
                  <DeleteMonthButton
                    factId={fact?.id ?? ''}
                    monthLabel={formatMonth(month)}
                    disabled={!sales.hydrated || !fact}
                  />
                )}
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
                <DayDateControl
                  key={month}
                  month={month}
                  selectedDay={selectedDay}
                  active={view === 'day'}
                  onPick={(next) => open({ day: next, view: 'day' })}
                />
                <Link
                  href={salesFactHref({
                    month,
                    currentMonth,
                    day: selectedDay,
                    defaultDay: fallbackDay,
                    view: 'all',
                    showDeleted: readOnly,
                    factId: readOnly ? factId : undefined,
                  })}
                  aria-current={view === 'all' ? 'page' : undefined}
                  className={viewLinkClass(view === 'all')}
                >
                  <IconEye />
                  Все даты
                </Link>
                <Link
                  href={salesFactHref({
                    month: currentMonth,
                    currentMonth,
                    showDeleted: true,
                  })}
                  className={quietLinkClassName}
                >
                  <IconUndo />
                  {readOnly ? 'К удалённым' : 'Удалённые'}
                  {readOnly || sales.deleted.length === 0
                    ? ''
                    : ` ${sales.deleted.length}`}
                </Link>
              </div>
            </div>
          </div>

          {readOnly ? null : <SalesJournal month={month} day={selectedDay} />}

          {hasTable ? (
            <section
              className={
                tableExpanded ? 'fixed inset-0 z-50 bg-paper' : undefined
              }
              aria-label={
                tableExpanded ? 'Таблица на весь экран' : 'Таблица факта'
              }
            >
              <SalesFactTable
                days={visible}
                editable={editable}
                showDayArrows={view === 'day'}
                expanded={tableExpanded}
                onDay={(next) => open({ day: next })}
                onCell={(occurredOn, productId, inputs) =>
                  sales.setCell(month, occurredOn, productId, inputs)
                }
              />
            </section>
          ) : (
            <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
              Сначала добавьте товар на{' '}
              <Link
                href="/"
                className="text-ink underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                Сводке
              </Link>
              . Факт продаж строится по товарам.
            </p>
          )}
        </div>
      </PageFrame>

      {hasTable ? (
        <FullscreenToggle
          active={tableExpanded}
          onToggle={() => setFullscreen((current) => !current)}
        />
      ) : null}
    </>
  );
}

function SalesJournal({ month, day }: { month: string; day: string }) {
  const sales = useSalesFact();
  const items = workingSalesInMonth(sales.document, month);
  const deletedCount = sales.document.sales.filter(
    (item) => item.deletedAt !== null,
  ).length;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Link href={saleNewHref(day)} className={primaryButtonClassName}>
          <IconPlus />
          Добавить продажу
        </Link>
        <Link href={deletedSalesHref()} className={quietLinkClassName}>
          <IconUndo />
          Удалённые продажи
          {deletedCount === 0 ? '' : ` ${deletedCount}`}
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
          Добавьте продажу: заказчик, дата и товары. Она попадёт в таблицу факта
          за этот день.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {items.map((item) => {
            const totals = saleTotals(sales.document, item);
            return (
              <li key={item.id}>
                <Link
                  href={saleHref(item.id)}
                  className="block border border-line bg-sheet p-4 outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
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
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function FullscreenToggle({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={active ? 'Обычный режим' : 'На весь экран'}
      aria-pressed={active}
      title={active ? 'Обычный режим' : 'На весь экран'}
      onClick={onToggle}
      className="fixed right-5 bottom-5 z-[60] inline-flex size-12 items-center justify-center rounded-full border border-line bg-sheet text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      {active ? <IconFullscreenExit /> : <IconFullscreen />}
    </button>
  );
}

function resolveMonth(month: string, today: Date): string {
  if (salesFactMonthOpen(month, today)) {
    return month;
  }

  return monthKeyFromDate(today);
}

function resolveDay(month: string, day: string, fallback: string): string {
  if (
    isOccurredOn(day) &&
    day.startsWith(`${month}-`) &&
    monthDates(month).includes(day)
  ) {
    return day;
  }

  const dom = Number(day.slice(8, 10));
  if (Number.isInteger(dom) && dom > 0) {
    const last = monthDates(month).length;
    const clamped = Math.min(dom, last);
    const candidate = `${month}-${String(clamped).padStart(2, '0')}`;
    if (monthDates(month).includes(candidate)) {
      return candidate;
    }
  }

  return fallback;
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

function DeleteMonthButton({
  factId,
  monthLabel,
  disabled,
}: {
  factId: string;
  monthLabel: string;
  disabled: boolean;
}) {
  const sales = useSalesFact();

  return (
    <button
      type="button"
      aria-label={`Удалить факт ${monthLabel}`}
      title="Удалить"
      disabled={disabled}
      onClick={() => {
        const confirmed = window.confirm(
          `Удалить факт продаж за ${monthLabel}? Он пропадёт из рабочего месяца. Вернуть можно среди удалённых.`,
        );
        if (confirmed) {
          sales.remove(factId);
        }
      }}
      className="inline-flex size-11 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-40"
    >
      <IconTrash />
    </button>
  );
}

function RestoreButton({
  factId,
  monthLabel,
}: {
  factId: string;
  monthLabel: string;
}) {
  const sales = useSalesFact();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={!sales.hydrated}
        onClick={() => {
          const rejection = sales.restore(factId);
          if (rejection) {
            setError(SALES_FACT_ERROR[rejection]);
            return;
          }
          router.push(
            salesFactHref({
              month: monthOf(sales.document, factId) ?? currentMonth,
              currentMonth,
            }),
          );
        }}
        className="inline-flex h-11 items-center justify-center gap-2 border border-line bg-sheet px-4 text-sm text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
      >
        <IconUndo />
        Вернуть {monthLabel}
      </button>
      {error ? <p className="text-sm text-ink">{error}</p> : null}
    </div>
  );
}

function monthOf(
  document: { salesFacts: { id: string; month: string }[] },
  factId: string,
): string | null {
  return document.salesFacts.find((item) => item.id === factId)?.month ?? null;
}

function DeletedList() {
  const sales = useSalesFact();
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const [error, setError] = useState<string | null>(null);

  return (
    <PageFrame
      title={SALES_FACT_SECTION_TITLE}
      full
      lede="Удалённые месяцы факта продаж можно открыть и вернуть."
    >
      <div className="flex flex-col gap-4">
        <Link
          href={salesFactHref({ month: currentMonth, currentMonth })}
          className={`w-full sm:w-auto ${quietLinkClassName}`}
        >
          <IconUndo />К рабочему месяцу
        </Link>
        {error ? <p className="text-sm text-ink">{error}</p> : null}
        {sales.deleted.length === 0 ? (
          <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
            Удалённых месяцев нет.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {sales.deleted.map((item) => (
              <li key={item.id} className="border border-line bg-sheet p-4">
                <p className="text-sm text-ink">{formatMonth(item.month)}</p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Link
                    href={salesFactHref({
                      month: item.month,
                      currentMonth,
                      showDeleted: true,
                      factId: item.id,
                    })}
                    className={quietLinkClassName}
                  >
                    <IconEye />
                    Открыть
                  </Link>
                  <button
                    type="button"
                    disabled={!sales.hydrated}
                    onClick={() => {
                      const rejection = sales.restore(item.id);
                      setError(rejection ? SALES_FACT_ERROR[rejection] : null);
                    }}
                    className={quietLinkClassName}
                  >
                    <IconUndo />
                    Вернуть
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageFrame>
  );
}

function DayDateControl({
  month,
  selectedDay,
  active,
  onPick,
}: {
  month: string;
  selectedDay: string;
  active: boolean;
  onPick: (day: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const dates = useMemo(() => monthDates(month), [month]);
  const lead = useMemo(() => mondayLeadForMonth(month), [month]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-current={active ? 'page' : undefined}
        className={viewLinkClass(active)}
        onClick={() => setOpen((current) => !current)}
      >
        <IconPlan />
        {formatSalesFactDay(selectedDay)}
      </button>
      {open ? (
        <div
          role="dialog"
          aria-label="Выбор даты"
          className="absolute top-full left-0 z-30 mt-2 w-[17.5rem] border border-line bg-sheet p-3"
        >
          <div className="grid grid-cols-7 gap-1">
            {WEEKDAY_LABELS.map((label) => (
              <span
                key={label}
                className="flex size-8 items-center justify-center text-xs text-muted"
              >
                {label}
              </span>
            ))}
            {Array.from({ length: lead }, (_, index) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: пустые клетки календаря позиционные
                key={`pad-${index}`}
                className="size-8"
                aria-hidden="true"
              />
            ))}
            {dates.map((occurredOn) => {
              const selected = active && occurredOn === selectedDay;
              const dayNumber = Number(occurredOn.slice(8, 10));
              return (
                <button
                  key={occurredOn}
                  type="button"
                  aria-label={formatSalesFactDay(occurredOn)}
                  aria-pressed={selected}
                  onClick={() => {
                    setOpen(false);
                    onPick(occurredOn);
                  }}
                  className={`flex size-8 items-center justify-center text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                    selected
                      ? 'bg-ink text-white'
                      : 'text-ink hover:border hover:border-ink'
                  }`}
                >
                  {dayNumber}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** Сколько пустых клеток перед 1-м числом, если неделя с понедельника. */
function mondayLeadForMonth(month: string): number {
  const year = Number(month.slice(0, 4));
  const monthIndex = Number(month.slice(5, 7)) - 1;
  if (!Number.isInteger(year) || !Number.isInteger(monthIndex)) {
    return 0;
  }

  const weekday = new Date(year, monthIndex, 1).getDay();
  return (weekday + 6) % 7;
}

function viewLinkClass(selected: boolean): string {
  return `inline-flex h-11 items-center justify-center gap-2 border px-3 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
    selected
      ? 'border-ink bg-ink text-white'
      : 'border-line bg-sheet text-ink hover:border-ink'
  }`;
}

const quietLinkClassName =
  'inline-flex h-11 items-center justify-center gap-2 border border-line bg-sheet px-3 text-sm text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';
