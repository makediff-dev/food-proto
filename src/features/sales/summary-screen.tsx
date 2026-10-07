'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

import { activeCategories } from '@/domain/categories';
import { monthKeyFromDate } from '@/domain/sales-plan';
import {
  applySummaryLens,
  elapsedDaysInMonth,
  isSingleMonthSummary,
  lastHorizonMonth,
  normalizeMonthRange,
  rangeSummary,
  type SummaryLens,
  summaryMonthOpen,
} from '@/domain/summary';
import { planningHref } from '@/features/planning/paths';
import {
  monthFieldClassName,
  primaryButtonClassName,
} from '@/features/sales/fields';
import { summaryHref } from '@/features/sales/paths';
import { SummaryHeadlineTable } from '@/features/sales/summary-headline';
import { SummaryTable } from '@/features/sales/summary-table';
import {
  daysPhrase,
  formatMonth,
  formatMonthNameGenitive,
  OPERATING_EXPENSE_ERROR,
} from '@/features/sales/text';
import { useSales } from '@/features/sales/use-sales';
import {
  IconFact,
  IconFullscreen,
  IconFullscreenExit,
  IconPlan,
} from '@/features/shell/icons';
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
  const isActual = view === 'current';
  const periodFrom = isActual ? currentMonth : from;
  const periodTo = isActual ? currentMonth : to;
  const singleMonth = periodFrom === periodTo;
  const activeView: SummaryLens =
    isActual && singleMonth ? 'current' : 'forecast';
  const lastForecastRange = useRef({ from: periodFrom, to: periodTo });
  if (activeView === 'forecast') {
    lastForecastRange.current = { from: periodFrom, to: periodTo };
  }
  const summary = useMemo(() => {
    const base = rangeSummary(sales.document, periodFrom, periodTo);
    if (!isSingleMonthSummary(base)) {
      return base;
    }
    return applySummaryLens(base, activeView, today);
  }, [sales.document, periodFrom, periodTo, today, activeView]);
  const categories = activeCategories(sales.document);
  const catalogEditable = sales.hydrated && singleMonth;
  const horizonEnd = lastHorizonMonth(today);
  const hasTable = summary.groups.length > 0;
  const tableExpanded = fullscreen && hasTable;
  const periodLabel = singleMonth ? periodFrom : `${periodFrom} — ${periodTo}`;
  const title = summaryPageTitle({
    view: activeView,
    from: periodFrom,
    to: periodTo,
    currentMonth,
    today,
  });

  useEffect(() => {
    if (!isActual) {
      return;
    }
    if (from === currentMonth && to === currentMonth) {
      return;
    }
    router.replace(
      summaryHref({
        from: currentMonth,
        to: currentMonth,
        currentMonth,
        view: 'current',
      }),
      { scroll: false },
    );
  }, [isActual, from, to, currentMonth, router]);

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
      nextView === 'current' && range.from === range.to
        ? ('current' as const)
        : ('forecast' as const);
    const hrefRange =
      viewForHref === 'current'
        ? { from: currentMonth, to: currentMonth }
        : range;
    router.push(
      summaryHref({
        from: hrefRange.from,
        to: hrefRange.to,
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
        title={title}
        full
        aside={
          activeView === 'current' ? (
            <button
              type="button"
              className={primaryButtonClassName}
              onClick={() =>
                open(
                  lastForecastRange.current.from,
                  lastForecastRange.current.to,
                  'forecast',
                )
              }
            >
              <IconPlan />
              Прогноз
            </button>
          ) : (
            <button
              type="button"
              className={primaryButtonClassName}
              onClick={() => open(currentMonth, currentMonth, 'current')}
            >
              <IconFact />
              Фактическая
            </button>
          )
        }
        intro={
          <div className="flex flex-col gap-4">
            {activeView === 'forecast' ? (
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
                      value={periodFrom}
                      onChange={(event) => {
                        const next = event.target.value;
                        if (!summaryMonthOpen(next, today)) {
                          return;
                        }
                        open(
                          next,
                          next > periodTo ? next : periodTo,
                          'forecast',
                        );
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
                      value={periodTo}
                      onChange={(event) => {
                        const next = event.target.value;
                        if (!summaryMonthOpen(next, today)) {
                          return;
                        }
                        open(
                          next < periodFrom ? next : periodFrom,
                          next,
                          'forecast',
                        );
                      }}
                      className={monthFieldClassName}
                    />
                  </div>
                </div>
              </div>
            ) : null}
            <SummaryHeadlineTable
              headline={summary.headline}
              periodLabel={periodLabel}
              view={activeView}
              planEditable={false}
              factEditable={catalogEditable}
              onOperatingExpense={(side, amountExVat) => {
                const rejection = sales.updateOperatingExpense(
                  periodFrom,
                  side,
                  amountExVat,
                );
                return rejection ? OPERATING_EXPENSE_ERROR[rejection] : null;
              }}
            />
          </div>
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
                    href={planningHref({ month: periodFrom, currentMonth })}
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
                    href={planningHref({ month: periodFrom, currentMonth })}
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

function summaryPageTitle({
  view,
  from,
  to,
  currentMonth,
  today,
}: {
  view: SummaryLens;
  from: string;
  to: string;
  currentMonth: string;
  today: Date;
}): string {
  if (view === 'current') {
    const days = elapsedDaysInMonth(currentMonth, today);
    return `Фактическая сводка за ${daysPhrase(days)} ${formatMonthNameGenitive(currentMonth)}`;
  }

  const endIsPast = to < currentMonth;
  if (from === to) {
    return endIsPast
      ? `Сводка за ${formatMonth(from)}`
      : `Прогноз на ${formatMonth(from)}`;
  }

  return endIsPast
    ? `Сводка за период с ${formatMonth(from)} до ${formatMonth(to)}`
    : `Прогноз на период с ${formatMonth(from)} до ${formatMonth(to)}`;
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
