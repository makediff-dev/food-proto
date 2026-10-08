'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useDocumentStore } from '@/data/document-store';
import { isOccurredOn } from '@/domain/document';
import { defaultSalesFactDay, monthDates, salesFactGridProducts, salesFactMonth } from '@/domain/sales-fact';
import { monthKeyFromDate, planMonthOpen, shiftMonth } from '@/domain/sales-plan';
import { lastHorizonMonth } from '@/domain/summary';
import { monthFieldClassName, primaryButtonClassName } from '@/features/sales/fields';
import {
  SALES_SECTION_TITLE,
  type SalesFactView,
  saleNewHref,
  salesFactHref,
  salesJournalHref,
} from '@/features/sales-fact/paths';
import { SalesFactTable } from '@/features/sales-fact/sales-fact-table';
import { formatSalesFactDay } from '@/features/sales-fact/text';
import { IconEye, IconFullscreen, IconFullscreenExit, IconList, IconPlan, IconPlus } from '@/features/shell/icons';
import { MonthStep } from '@/features/shell/month-step';
import { PageFrame } from '@/features/shell/page-frame';

const WEEKDAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] as const;

export function SalesFactScreen({ month, day, view }: { month: string; day: string; view: SalesFactView }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveMonth(month, today);

  return <Workspace month={selectedMonth} dayQuery={day} view={view} currentMonth={currentMonth} today={today} />;
}

function Workspace({
  month,
  dayQuery,
  view,
  currentMonth,
  today,
}: {
  month: string;
  dayQuery: string;
  view: SalesFactView;
  currentMonth: string;
  today: Date;
}) {
  const store = useDocumentStore();
  const router = useRouter();
  const [fullscreen, setFullscreen] = useState(false);
  const products = salesFactGridProducts(store.document, month);
  const days = useMemo(() => salesFactMonth(store.document, month), [store.document, month]);
  const fallbackDay = defaultSalesFactDay(month, today);
  const selectedDay = resolveDay(month, dayQuery, fallbackDay);
  const visible = view === 'all' ? days : days.filter((item) => item.occurredOn === selectedDay);
  const previousMonth = shiftMonth(month, -1);
  const nextMonth = shiftMonth(month, 1);
  const horizonEnd = lastHorizonMonth(today);
  const nextDisabled = nextMonth > horizonEnd;
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
    const targetDefaultDay = defaultSalesFactDay(targetMonth, today);
    const targetDay = resolveDay(targetMonth, next.day ?? selectedDay, targetDefaultDay);
    router.push(
      salesFactHref({
        month: targetMonth,
        currentMonth,
        day: targetDay,
        defaultDay: targetDefaultDay,
        view: next.view ?? view,
      }),
      { scroll: false },
    );
  }

  return (
    <>
      <PageFrame
        title={SALES_SECTION_TITLE}
        full
        fill
        aside={
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <Link href={salesJournalHref({ month, currentMonth })} className={quietLinkClassName}>
              <IconList />
              Журнал продаж
            </Link>
            <Link href={saleNewHref()} className={primaryButtonClassName}>
              <IconPlus />
              Добавить продажу
            </Link>
          </div>
        }
      >
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="shrink-0 border border-line bg-sheet">
            <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex shrink-0 items-center gap-2">
                <MonthStep
                  label="Предыдущий месяц"
                  direction="previous"
                  disabled={!planMonthOpen(previousMonth, today)}
                  onClick={() => open({ month: previousMonth })}
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
                      open({ month: next });
                    }
                  }}
                  className={monthFieldClassName}
                />
                <MonthStep
                  label="Следующий месяц"
                  direction="next"
                  disabled={nextDisabled}
                  onClick={() => open({ month: nextMonth })}
                />
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
                  })}
                  aria-current={view === 'all' ? 'page' : undefined}
                  className={viewLinkClass(view === 'all')}
                >
                  <IconEye />
                  Все даты
                </Link>
              </div>
            </div>
          </div>

          {hasTable ? (
            <section
              className={tableExpanded ? 'fixed inset-0 z-50 bg-paper' : 'min-h-0 flex-1'}
              aria-label={tableExpanded ? 'Таблица на весь экран' : 'Таблица факта'}
            >
              <SalesFactTable
                days={visible}
                showDayArrows={view === 'day'}
                expanded={tableExpanded}
                onDay={(next) => open({ day: next })}
              />
            </section>
          ) : (
            <p className="shrink-0 border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
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
        <FullscreenToggle active={tableExpanded} onToggle={() => setFullscreen((current) => !current)} />
      ) : null}
    </>
  );
}

function FullscreenToggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
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
  if (planMonthOpen(month, today)) {
    return month;
  }

  return monthKeyFromDate(today);
}

function resolveDay(month: string, day: string, fallback: string): string {
  if (isOccurredOn(day) && day.startsWith(`${month}-`) && monthDates(month).includes(day)) {
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
              <span key={label} className="flex size-8 items-center justify-center text-xs text-muted">
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
                    selected ? 'bg-ink text-white' : 'text-ink hover:border hover:border-ink'
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
    selected ? 'border-ink bg-ink text-white' : 'border-line bg-sheet text-ink hover:border-ink'
  }`;
}

const quietLinkClassName =
  'inline-flex h-11 items-center justify-center gap-2 border border-line bg-sheet px-3 text-sm text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';
