'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { activeCategories } from '@/domain/categories';
import {
  missingProductionPlanProducts,
  productionPlanMonthView,
  workingProductionPlan,
} from '@/domain/production-plan';
import { activeProducts } from '@/domain/products';
import { monthKeyFromDate, planMonthOpen, shiftMonth } from '@/domain/sales-plan';
import { lastHorizonMonth } from '@/domain/summary';
import { productionPlanHref } from '@/features/production/paths';
import { ProductionPlanTable } from '@/features/production/production-plan-table';
import { useProductionPlan } from '@/features/production/use-production-plan';
import { FIELD_ERROR, monthFieldClassName, primaryButtonClassName } from '@/features/sales/fields';
import { IconFullscreen, IconFullscreenExit, IconPlus } from '@/features/shell/icons';
import { MonthStep } from '@/features/shell/month-step';
import { PageFrame } from '@/features/shell/page-frame';

export function ProductionPlanScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveMonth(month, today);

  return <Workspace month={selectedMonth} currentMonth={currentMonth} today={today} />;
}

function Workspace({ month, currentMonth, today }: { month: string; currentMonth: string; today: Date }) {
  const production = useProductionPlan();
  const router = useRouter();
  const [fullscreen, setFullscreen] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const storedPlan = workingProductionPlan(production.document, month);
  const view = useMemo(() => productionPlanMonthView(production.document, month), [production.document, month]);
  const products = activeProducts(production.document);
  const categories = activeCategories(production.document);
  const planEditable = production.hydrated && products.length > 0;
  const costEditable = production.hydrated;
  const missing = planEditable && storedPlan ? missingProductionPlanProducts(production.document, storedPlan) : [];
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
    router.push(productionPlanHref({ month: nextMonthKey, currentMonth }), {
      scroll: false,
    });
  }

  function addMissing() {
    if (!storedPlan) {
      return;
    }

    const lines = missing.map((product) => ({
      id: `production-plan-line:${crypto.randomUUID()}`,
      productId: product.id,
    }));
    const rejection = production.addMissingProduction(storedPlan.id, lines);
    if (rejection === 'products') {
      setAddError('В плане должны быть все рабочие товары.');
    } else if (rejection === 'closed') {
      setAddError('Этот план сейчас нельзя править.');
    } else if (rejection) {
      setAddError('Запись не найдена.');
    } else {
      setAddError(null);
    }
  }

  return (
    <>
      <PageFrame
        title="Планируемое производство"
        lede="План выпуска готовой продукции."
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
          {missing.length > 0 ? (
            <div className="flex flex-col gap-3 border border-line bg-sheet p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-ink">В справочнике есть товары, которых нет в этом плане.</p>
              <div className="flex flex-col gap-2 sm:items-end">
                <button type="button" onClick={addMissing} className={`w-full sm:w-auto ${primaryButtonClassName}`}>
                  <IconPlus />
                  Добавить новые товары
                </button>
                {addError ? <p className="text-sm text-ink">{addError}</p> : null}
              </div>
            </div>
          ) : null}

          {hasTable ? (
            <section
              className={tableExpanded ? 'fixed inset-0 z-50 bg-paper' : undefined}
              aria-label={tableExpanded ? 'Таблица на весь экран' : 'Таблица плана производства'}
            >
              <ProductionPlanTable
                groups={view.groups}
                totals={view.totals}
                editable={planEditable}
                costEditable={costEditable}
                expanded={tableExpanded}
                onVolumeAction={(lineId, volumePieces) => {
                  const rejection = production.updateProductionVolume(month, lineId, volumePieces);
                  if (rejection === 'volume') {
                    return 'Укажите объём целым числом штук.';
                  }
                  if (rejection === 'month') {
                    return 'Этот месяц выбрать нельзя.';
                  }
                  if (rejection === 'closed') {
                    return 'Этот план сейчас нельзя править.';
                  }
                  if (rejection) {
                    return 'Запись не найдена.';
                  }
                  return null;
                }}
                onProductCostAction={(productId, unitCostWithVat) => {
                  const rejection = production.updateProductCost(productId, unitCostWithVat);
                  return rejection ? FIELD_ERROR[rejection] : null;
                }}
              />
            </section>
          ) : (
            <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
              {categories.length === 0
                ? 'Добавьте категорию и товар в «Планировании». План производства строится по товарам.'
                : 'Добавьте товар в «Планировании». План производства строится по товарам.'}
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
