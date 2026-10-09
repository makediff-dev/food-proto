'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { activeCategories } from '@/domain/categories';
import { type FinishedGoodsNormField, movementPlanMonthView } from '@/domain/movement-plan';
import { activeProducts } from '@/domain/products';
import { monthKeyFromDate, planMonthOpen, shiftMonth } from '@/domain/sales-plan';
import { lastHorizonMonth } from '@/domain/summary';
import { MovementPlanTable } from '@/features/movement/MovementPlanTable';
import { MOVEMENT_PLAN_TITLE, movementPlanHref } from '@/features/movement/paths';
import { useMovementPlan } from '@/features/movement/use-movement-plan';
import { monthFieldClassName } from '@/features/sales/fields';
import { IconFullscreen, IconFullscreenExit } from '@/features/shell/Icons';
import { MonthStep } from '@/features/shell/MonthStep';
import { PageFrame } from '@/features/shell/PageFrame';

export function MovementPlanScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveMonth(month, today);

  return <Workspace month={selectedMonth} currentMonth={currentMonth} today={today} />;
}

function Workspace({ month, currentMonth, today }: { month: string; currentMonth: string; today: Date }) {
  const movementPlan = useMovementPlan();
  const router = useRouter();
  const [fullscreen, setFullscreen] = useState(false);
  const view = useMemo(() => movementPlanMonthView(movementPlan.document, month), [movementPlan.document, month]);
  const products = activeProducts(movementPlan.document);
  const categories = activeCategories(movementPlan.document);
  const normEditable = movementPlan.hydrated && products.length > 0;
  const previousMonth = shiftMonth(month, -1);
  const nextMonth = shiftMonth(month, 1);
  const horizonEnd = lastHorizonMonth(today);
  const hasTable = view.groups.length > 0;
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

  function open(nextMonthKey: string) {
    router.push(movementPlanHref({ month: nextMonthKey, currentMonth }), {
      scroll: false,
    });
  }

  function normError(rejection: ReturnType<typeof movementPlan.setNorm>): string | null {
    if (rejection === 'pieces') {
      return 'Укажите значение целым числом штук.';
    }
    if (rejection === 'coefficient') {
      return 'Укажите коэффициент числом с двумя знаками после запятой.';
    }
    if (rejection === 'month') {
      return 'Этот месяц выбрать нельзя.';
    }
    if (rejection === 'closed') {
      return 'Этот месяц сейчас нельзя править.';
    }
    if (rejection === 'locked') {
      return 'Удалённый товар не меняется.';
    }
    if (rejection) {
      return 'Запись не найдена.';
    }
    return null;
  }

  return (
    <>
      <PageFrame
        title={MOVEMENT_PLAN_TITLE}
        lede="Нормативы остатков, отклонения и рекомендуемый выпуск."
        full
        intro={
          <div className="w-full border border-line bg-sheet p-4">
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
                disabled={nextMonth > horizonEnd}
                onClick={() => open(nextMonth)}
              />
            </div>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          {hasTable ? (
            <section
              className={tableExpanded ? 'fixed inset-0 z-50 bg-paper' : undefined}
              aria-label={tableExpanded ? 'Таблица на весь экран' : 'Таблица планирования движения'}
            >
              <MovementPlanTable
                groups={view.groups}
                totals={view.totals}
                editable={normEditable}
                expanded={tableExpanded}
                onNormAction={(productId, field: FinishedGoodsNormField, value) =>
                  normError(movementPlan.setNorm(month, productId, field, value))
                }
              />
            </section>
          ) : (
            <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
              {categories.length === 0
                ? 'Добавьте категорию и товар в «Планировании». Планирование движения строится по товарам.'
                : 'Добавьте товар в «Планировании». Планирование движения строится по товарам.'}
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

function resolveMonth(month: string, today: Date): string {
  if (planMonthOpen(month, today)) {
    return month;
  }

  return monthKeyFromDate(today);
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
