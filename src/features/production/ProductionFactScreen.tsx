'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useState } from 'react';

import { useDocumentStore } from '@/data/DocumentProvider';
import { activeCategories } from '@/domain/categories';
import { productionFactForLens } from '@/domain/production-fact';
import { monthKeyFromDate, planMonthOpen } from '@/domain/sales-plan';
import {
  elapsedDaysInMonth,
  ensureRangeIncludesMonth,
  lastHorizonMonth,
  monthsInRange,
  normalizeMonthRange,
  type SummaryLens,
} from '@/domain/summary';
import { planningHref } from '@/features/planning/paths';
import { ProductionFactTable } from '@/features/production/ProductionFactTable';
import { productionFactHref } from '@/features/production/paths';
import { monthFieldClassName, primaryButtonClassName } from '@/features/sales/fields';
import { daysPhrase, formatMonth, formatMonthNameGenitive } from '@/features/sales/text';
import { IconFact, IconFullscreen, IconFullscreenExit, IconPlan } from '@/features/shell/Icons';
import { PageFrame } from '@/features/shell/PageFrame';

export function ProductionFactScreen({ from, to, view }: { from: string; to: string; view: SummaryLens }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const range = resolveRange(from, to, today);

  return <Workspace from={range.from} to={range.to} currentMonth={currentMonth} today={today} view={view} />;
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
  const store = useDocumentStore();
  const router = useRouter();
  const fromFieldId = useId();
  const toFieldId = useId();
  const [fullscreen, setFullscreen] = useState(false);
  const isActual = view === 'current';
  const period = isActual ? ensureRangeIncludesMonth(from, to, currentMonth) : { from, to };
  const periodFrom = period.from;
  const periodTo = period.to;
  const summary = useMemo(
    () => productionFactForLens(store.document, periodFrom, periodTo, view, today),
    [store.document, periodFrom, periodTo, today, view],
  );
  const categories = activeCategories(store.document);
  const horizonEnd = lastHorizonMonth(today);
  const hasTable = summary.groups.length > 0;
  const tableExpanded = fullscreen && hasTable;
  const periodClosed = periodTo < currentMonth;
  const actualAvailable = periodFrom <= currentMonth && currentMonth <= periodTo;
  const title = productionFactPageTitle({
    view,
    from: periodFrom,
    to: periodTo,
    today,
  });

  useEffect(() => {
    if (!isActual) {
      return;
    }
    if (from === periodFrom && to === periodTo) {
      return;
    }
    router.replace(
      productionFactHref({
        from: periodFrom,
        to: periodTo,
        currentMonth,
        view: 'current',
      }),
      { scroll: false },
    );
  }, [isActual, from, to, periodFrom, periodTo, currentMonth, router]);

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

  function open(nextFrom: string, nextTo: string, nextView: SummaryLens = view) {
    const range = normalizeMonthRange(nextFrom, nextTo);
    const hrefRange = nextView === 'current' ? ensureRangeIncludesMonth(range.from, range.to, currentMonth) : range;
    router.push(
      productionFactHref({
        from: hrefRange.from,
        to: hrefRange.to,
        currentMonth,
        view: nextView,
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
          isActual ? (
            <button
              type="button"
              className={primaryButtonClassName}
              onClick={() => open(periodFrom, periodTo, 'forecast')}
            >
              <IconPlan />
              Прогноз
            </button>
          ) : actualAvailable ? (
            <button
              type="button"
              className={primaryButtonClassName}
              onClick={() => open(periodFrom, periodTo, 'current')}
            >
              <IconFact />
              Фактическая
            </button>
          ) : null
        }
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
                  max={isActual ? currentMonth : horizonEnd}
                  value={periodFrom}
                  onChange={(event) => {
                    const next = event.target.value;
                    if (!planMonthOpen(next, today)) {
                      return;
                    }
                    if (isActual && next > currentMonth) {
                      return;
                    }
                    const nextTo = next > periodTo ? next : periodTo;
                    open(next, isActual && nextTo < currentMonth ? currentMonth : nextTo, view);
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
                  min={isActual ? currentMonth : '2000-01'}
                  max={horizonEnd}
                  value={periodTo}
                  onChange={(event) => {
                    const next = event.target.value;
                    if (!planMonthOpen(next, today)) {
                      return;
                    }
                    if (isActual && next < currentMonth) {
                      return;
                    }
                    const nextFrom = next < periodFrom ? next : periodFrom;
                    open(isActual && nextFrom > currentMonth ? currentMonth : nextFrom, next, view);
                  }}
                  className={monthFieldClassName}
                />
              </div>
            </div>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          {hasTable ? (
            <section
              className={tableExpanded ? 'fixed inset-0 z-50 bg-paper' : undefined}
              aria-label={tableExpanded ? 'Таблица на весь экран' : 'Таблица фактического производства'}
            >
              <ProductionFactTable
                groups={summary.groups}
                planVolumePieces={summary.planVolumePieces}
                factVolumePieces={summary.factVolumePieces}
                varianceVolumePieces={summary.varianceVolumePieces}
                view={view}
                periodClosed={periodClosed}
                expanded={tableExpanded}
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
        <FullscreenToggle active={tableExpanded} onToggle={() => setFullscreen((current) => !current)} />
      ) : null}
    </>
  );
}

function productionFactPageTitle({
  view,
  from,
  to,
  today,
}: {
  view: SummaryLens;
  from: string;
  to: string;
  today: Date;
}): string {
  const currentMonth = monthKeyFromDate(today);
  if (view === 'current') {
    const elapsed = monthsInRange(from, to).reduce((sum, month) => sum + elapsedDaysInMonth(month, today), 0);
    if (from === to) {
      return `Фактическое производство за ${daysPhrase(elapsed)} ${formatMonthNameGenitive(from)}`;
    }
    return `Фактическое производство за ${daysPhrase(elapsed)} с ${formatMonth(from)} до ${formatMonth(to)}`;
  }

  const endIsPast = to < currentMonth;
  if (from === to) {
    return endIsPast ? `Производство за ${formatMonth(from)}` : `Прогноз производства на ${formatMonth(from)}`;
  }

  return endIsPast
    ? `Производство за период с ${formatMonth(from)} до ${formatMonth(to)}`
    : `Прогноз производства на период с ${formatMonth(from)} до ${formatMonth(to)}`;
}

function resolveRange(from: string, to: string, today: Date): { from: string; to: string } {
  const current = monthKeyFromDate(today);
  const rawFrom = planMonthOpen(from, today) ? from : current;
  const rawTo = planMonthOpen(to, today) ? to : rawFrom;
  return normalizeMonthRange(rawFrom, rawTo);
}

function FullscreenToggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
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
