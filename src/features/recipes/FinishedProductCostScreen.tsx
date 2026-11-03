'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { useDocumentStore } from '@/data/DocumentProvider';
import { finishedProductCostMonth } from '@/domain/finished-product-cost';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { MaterialMonthBar, resolveMaterialMonth } from '@/features/materials/MaterialMonthBar';
import { FinishedProductCostTable } from '@/features/recipes/FinishedProductCostTable';
import { RECIPES_FINISHED_COST_TITLE, recipesFinishedCostHref } from '@/features/recipes/paths';
import { PageFrame } from '@/features/shell/PageFrame';

export function FinishedProductCostScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveMaterialMonth(month, today, currentMonth);
  const store = useDocumentStore();
  const router = useRouter();
  const view = useMemo(() => finishedProductCostMonth(store.document, selectedMonth), [store.document, selectedMonth]);

  return (
    <PageFrame
      title={RECIPES_FINISHED_COST_TITLE}
      full
      lede="Плановая и фактическая себестоимость готовой продукции из рецепта и цен сырья."
      intro={
        <MaterialMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(recipesFinishedCostHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      {view.sections.every((section) => section.rows.length === 0) ? (
        <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
          Товаров пока нет. Заведите их во «Вводе плана» продаж.
        </p>
      ) : (
        <FinishedProductCostTable sections={view.sections} month={selectedMonth} currentMonth={currentMonth} />
      )}
    </PageFrame>
  );
}
