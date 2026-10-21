'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useState } from 'react';

import { useDocumentStore } from '@/data/DocumentProvider';
import { activeCategories } from '@/domain/categories';
import { finishedGoodsRangeView, lastSummaryMonth, resolveSummaryMonthRange } from '@/domain/finished-goods';
import { FinishedGoodsMonthTable } from '@/features/movement/FinishedGoodsMonthTable';
import { finishedGoodsSummaryHref, MOVEMENT_SUMMARY_TITLE } from '@/features/movement/paths';
import { monthFieldClassName } from '@/features/sales/fields';
import { formatMonth } from '@/features/sales/text';
import { IconFullscreen, IconFullscreenExit } from '@/features/shell/Icons';
import { PageFrame } from '@/features/shell/PageFrame';

export function FinishedGoodsMonthScreen({ from, to }: { from: string; to: string }) {
  const today = useMemo(() => new Date(), []);
  const router = useRouter();
  const range = resolveSummaryMonthRange(from, to, today);
  const currentMonth = lastSummaryMonth(today);
  const rangeFrom = range?.from ?? '';
  const rangeTo = range?.to ?? '';

  useEffect(() => {
    if (!currentMonth || !rangeFrom || !rangeTo) {
      return;
    }
    if (from === rangeFrom && to === rangeTo) {
      return;
    }
    if (from === '' && to === '' && rangeFrom === currentMonth && rangeTo === currentMonth) {
      return;
    }
    router.replace(finishedGoodsSummaryHref({ from: rangeFrom, to: rangeTo, currentMonth }), { scroll: false });
  }, [from, to, rangeFrom, rangeTo, currentMonth, router]);

  if (!range) {
    return (
      <PageFrame title={MOVEMENT_SUMMARY_TITLE}>
        <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
          Свод строится с января 2000 по текущий месяц. Этот месяц ещё не наступил.
        </p>
      </PageFrame>
    );
  }

  return <Workspace from={range.from} to={range.to} today={today} />;
}

function Workspace({ from, to, today }: { from: string; to: string; today: Date }) {
  const { document: prototypeDocument } = useDocumentStore();
  const router = useRouter();
  const fromFieldId = useId();
  const toFieldId = useId();
  const [fullscreen, setFullscreen] = useState(false);
  const currentMonth = lastSummaryMonth(today) ?? from;
  const view = useMemo(
    () => finishedGoodsRangeView(prototypeDocument, from, to, today),
    [prototypeDocument, from, to, today],
  );
  const categories = activeCategories(prototypeDocument);
  const hasTable = view.groups.length > 0;
  const tableExpanded = fullscreen && hasTable;
  const caption =
    from === to
      ? `Отчет общий: движение готовой продукции за ${formatMonth(from)}`
      : `Отчет общий: движение готовой продукции с ${formatMonth(from)} по ${formatMonth(to)}`;

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

  function open(nextFrom: string, nextTo: string) {
    const range = resolveSummaryMonthRange(nextFrom, nextTo, today);
    if (!range) {
      return;
    }
    router.push(finishedGoodsSummaryHref({ from: range.from, to: range.to, currentMonth }), { scroll: false });
  }

  return (
    <>
      <PageFrame
        title={MOVEMENT_SUMMARY_TITLE}
        full
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
                  max={currentMonth}
                  value={from}
                  onChange={(event) => {
                    const next = event.target.value;
                    if (!next) {
                      return;
                    }
                    open(next, next > to ? next : to);
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
                  max={currentMonth}
                  value={to}
                  onChange={(event) => {
                    const next = event.target.value;
                    if (!next) {
                      return;
                    }
                    open(next < from ? next : from, next);
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
              aria-label={tableExpanded ? 'Таблица на весь экран' : 'Таблица движения готовой продукции'}
            >
              <FinishedGoodsMonthTable
                groups={view.groups}
                totals={view.totals}
                expanded={tableExpanded}
                caption={caption}
              />
            </section>
          ) : (
            <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
              {categories.length === 0
                ? 'Добавьте категорию и товар во «Вводе плана». Движение строится по товарам.'
                : 'Добавьте товар во «Вводе плана». Движение строится по товарам.'}
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
      className="fixed right-5 bottom-5 z-60 inline-flex size-12 items-center justify-center rounded-full border border-line bg-sheet text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      {active ? <IconFullscreenExit /> : <IconFullscreen />}
    </button>
  );
}
