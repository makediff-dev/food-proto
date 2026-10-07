'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useState } from 'react';

import { activeCategories } from '@/domain/categories';
import { monthKeyFromDate, planPhase, shiftMonth } from '@/domain/sales-plan';
import {
  applySummaryLens,
  isSingleMonthSummary,
  lastHorizonMonth,
  monthsInRange,
  normalizeMonthRange,
  rangeSummary,
  type SummaryLens,
  summaryMonthOpen,
} from '@/domain/summary';
import { planningHref } from '@/features/planning/paths';
import { monthFieldClassName } from '@/features/sales/fields';
import { summaryHref } from '@/features/sales/paths';
import { SummaryHeadlineTable } from '@/features/sales/summary-headline';
import { SummaryTable } from '@/features/sales/summary-table';
import { daysPhrase, OPERATING_EXPENSE_ERROR } from '@/features/sales/text';
import { useSales } from '@/features/sales/use-sales';
import { IconFullscreen, IconFullscreenExit } from '@/features/shell/icons';
import { MonthStep } from '@/features/shell/month-step';
import { PageFrame } from '@/features/shell/page-frame';

export function SummaryScreen({
  from,
  to,
  view,
}: {
  from: string;
  to: string;
  view: SummaryLens;
}) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const range = resolveRange(from, to, today);

  return (
    <Workspace
      from={range.from}
      to={range.to}
      currentMonth={currentMonth}
      today={today}
      view={view}
    />
  );
}

function Workspace({
  from,
  to,
  currentMonth,
  today,
  view,
}: {
  from: string;
  to: string;
  currentMonth: string;
  today: Date;
  view: SummaryLens;
}) {
  const sales = useSales();
  const router = useRouter();
  const fromFieldId = useId();
  const toFieldId = useId();
  const [fullscreen, setFullscreen] = useState(false);
  const singleMonth = from === to;
  const activeView: SummaryLens = singleMonth ? view : 'forecast';
  const summary = useMemo(() => {
    const base = rangeSummary(sales.document, from, to);
    if (!isSingleMonthSummary(base)) {
      return base;
    }
    return applySummaryLens(base, activeView, today);
  }, [sales.document, from, to, today, activeView]);
  const categories = activeCategories(sales.document);
  const phase = singleMonth ? planPhase(from, today) : null;
  const catalogEditable = sales.hydrated && singleMonth;
  const planOperatingEditable =
    sales.hydrated && singleMonth && activeView === 'forecast';
  const monthCount = monthsInRange(from, to).length;
  const previousFrom = shiftMonth(from, -1);
  const previousTo = shiftMonth(to, -1);
  const nextFrom = shiftMonth(from, 1);
  const nextTo = shiftMonth(to, 1);
  const horizonEnd = lastHorizonMonth(today);
  const canStepPrevious = summaryMonthOpen(previousFrom, today);
  const canStepNext = nextTo <= horizonEnd;
  const hasTable = summary.groups.length > 0;
  const tableExpanded = fullscreen && hasTable;
  const periodLabel = singleMonth ? from : `${from} — ${to}`;

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

  function open(
    nextFrom: string,
    nextTo: string,
    nextView: SummaryLens = activeView,
  ) {
    const range = normalizeMonthRange(nextFrom, nextTo);
    const viewForHref =
      range.from === range.to ? nextView : ('forecast' as const);
    router.push(
      summaryHref({
        from: range.from,
        to: range.to,
        currentMonth,
        view: viewForHref,
      }),
      {
        scroll: false,
      },
    );
  }

  return (
    <>
      <PageFrame
        title={
          <SummaryModeTitle
            view={activeView}
            singleMonth={singleMonth}
            onSelect={(next) => open(from, to, next)}
          />
        }
        full
        lede={lede({
          singleMonth,
          phase,
          days: summary.days,
          monthCount,
          view: activeView,
        })}
        intro={
          <div className="w-full border border-line bg-sheet p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <label htmlFor={fromFieldId} className="text-sm text-muted">
                  С
                </label>
                <input
                  id={fromFieldId}
                  type="month"
                  min="2000-01"
                  max={horizonEnd}
                  value={from}
                  onChange={(event) => {
                    const next = event.target.value;
                    if (summaryMonthOpen(next, today)) {
                      open(next, to);
                    }
                  }}
                  className={monthFieldClassName}
                />
              </div>
              <div className="flex min-w-0 items-center gap-2">
                <label htmlFor={toFieldId} className="text-sm text-muted">
                  По
                </label>
                <input
                  id={toFieldId}
                  type="month"
                  min="2000-01"
                  max={horizonEnd}
                  value={to}
                  onChange={(event) => {
                    const next = event.target.value;
                    if (summaryMonthOpen(next, today)) {
                      open(from, next);
                    }
                  }}
                  className={monthFieldClassName}
                />
              </div>
              <div className="flex items-center gap-2">
                <MonthStep
                  label="Предыдущий период"
                  direction="previous"
                  disabled={!canStepPrevious}
                  onClick={() => open(previousFrom, previousTo)}
                />
                <MonthStep
                  label="Следующий период"
                  direction="next"
                  disabled={!canStepNext}
                  onClick={() => open(nextFrom, nextTo)}
                />
              </div>
            </div>
          </div>
        }
        aside={
          <SummaryHeadlineTable
            headline={summary.headline}
            periodLabel={periodLabel}
            view={activeView}
            planEditable={planOperatingEditable}
            factEditable={catalogEditable}
            onOperatingExpense={(side, amountExVat) => {
              const rejection = sales.updateOperatingExpense(
                from,
                side,
                amountExVat,
              );
              return rejection ? OPERATING_EXPENSE_ERROR[rejection] : null;
            }}
          />
        }
      >
        <div className="flex flex-col gap-4">
          {hasTable ? (
            <section
              className={
                tableExpanded ? 'fixed inset-0 z-50 bg-paper' : undefined
              }
              aria-label={
                tableExpanded ? 'Таблица на весь экран' : 'Таблица сводки'
              }
            >
              <SummaryTable
                groups={summary.groups}
                planTotals={summary.planTotalsSide}
                factTotals={summary.factTotals}
                variance={summary.variance}
                view={activeView}
                editable={false}
                vatEditable={false}
                catalogEditable={false}
                expanded={tableExpanded}
                onPlanLineAction={() => null}
                onProductVatAction={() => null}
                onProductCostAction={() => null}
                onRenameProduct={() => null}
                onRenameCategory={() => null}
                onDeleteCategory={() => undefined}
                onDeleteProduct={() => undefined}
                onAddProduct={() => undefined}
              />
            </section>
          ) : (
            <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
              {categories.length === 0 ? (
                <>
                  Категорий пока нет.{' '}
                  <Link
                    href={planningHref({ month: from, currentMonth })}
                    className="text-ink underline underline-offset-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    Добавьте категорию и товар в «Планировании»
                  </Link>
                  . План и факт строятся по товарам.
                </>
              ) : (
                <>
                  Товаров пока нет.{' '}
                  <Link
                    href={planningHref({ month: from, currentMonth })}
                    className="text-ink underline underline-offset-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    Добавьте товар в «Планировании»
                  </Link>
                  . План и факт строятся по товарам.
                </>
              )}
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

function lede({
  singleMonth,
  phase,
  days,
  monthCount,
  view,
}: {
  singleMonth: boolean;
  phase: ReturnType<typeof planPhase> | null;
  days: number;
  monthCount: number;
  view: SummaryLens;
}): string {
  if (!singleMonth) {
    return `Сумма ${monthsPhrase(monthCount)}. Режим «текущая» для интервала недоступен. План правят в «Планировании» по месяцам. Операционные расходы здесь только смотрят — сумма по месяцам. Факт считается из дней раздела «Продажи». В периоде ${daysPhrase(days)}.`;
  }

  const length = `В месяце ${daysPhrase(days)}.`;
  if (view === 'forecast') {
    if (phase === 'past') {
      return `Месяц прошёл. План и факт — за весь месяц. План правят в «Планировании». ${length}`;
    }
    if (phase === 'future') {
      return `План на месяц. Прогноз факта нулевой: продаж ещё нет. План правят в «Планировании». ${length}`;
    }

    return `План на месяц. Факт — прогноз до конца месяца тем же темпом, что уже есть. План правят в «Планировании». Факт считается из дней раздела «Продажи». ${length}`;
  }

  if (phase === 'past') {
    return `Месяц прошёл. Факт считается из дней раздела «Продажи». План правят в «Планировании». ${length}`;
  }
  if (phase === 'future') {
    return `План урезан до нуля: месяц ещё не начался. Факт нулевой. План правят в «Планировании». ${length}`;
  }

  return `Факт на сегодня. План урезан на прошедшую долю месяца. Плановые показатели здесь только для просмотра; правят в «Планировании». Факт считается из дней раздела «Продажи». ${length}`;
}

function SummaryModeTitle({
  view,
  singleMonth,
  onSelect,
}: {
  view: SummaryLens;
  singleMonth: boolean;
  onSelect: (next: SummaryLens) => void;
}) {
  if (!singleMonth) {
    return (
      <>
        Сводка{' '}
        <span className="underline decoration-ink underline-offset-4">
          за период
        </span>
      </>
    );
  }

  return (
    <>
      Сводка{' '}
      <ModeWord
        label="текущая"
        active={view === 'current'}
        onClick={() => onSelect('current')}
      />
      {'/'}
      <ModeWord
        label="за месяц"
        active={view === 'forecast'}
        onClick={() => onSelect('forecast')}
      />
    </>
  );
}

function ModeWord({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  if (active) {
    return (
      <span className="underline decoration-ink underline-offset-4">
        {label}
      </span>
    );
  }

  return (
    <button
      type="button"
      aria-label={
        label === 'текущая'
          ? 'Показать текущую сводку'
          : 'Показать сводку за месяц'
      }
      onClick={onClick}
      className="font-[inherit] text-inherit underline-offset-4 outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      {label}
    </button>
  );
}

function resolveRange(
  from: string,
  to: string,
  today: Date,
): { from: string; to: string } {
  const current = monthKeyFromDate(today);
  const rawFrom = summaryMonthOpen(from, today) ? from : current;
  const rawTo = summaryMonthOpen(to, today) ? to : rawFrom;
  return normalizeMonthRange(rawFrom, rawTo);
}

function monthsPhrase(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  const word =
    mod10 === 1 && mod100 !== 11
      ? 'полный месяц'
      : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
        ? 'полных месяца'
        : 'полных месяцев';
  return `${count} ${word}`;
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
      className="fixed right-5 bottom-5 z-60 inline-flex size-12 items-center justify-center rounded-full border border-line bg-sheet text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      {active ? <IconFullscreenExit /> : <IconFullscreen />}
    </button>
  );
}
