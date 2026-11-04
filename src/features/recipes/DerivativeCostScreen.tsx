'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { useDocumentStore } from '@/data/DocumentProvider';
import { derivativeCostMonth } from '@/domain/derivative-cost';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { MaterialMonthBar, resolveMaterialMonth } from '@/features/materials/MaterialMonthBar';
import { DerivativeCostTable } from '@/features/recipes/DerivativeCostTable';
import { RECIPES_COST_TITLE, recipesCostHref } from '@/features/recipes/paths';
import { PageFrame } from '@/features/shell/PageFrame';

export function DerivativeCostScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveMaterialMonth(month, today, currentMonth);
  const store = useDocumentStore();
  const router = useRouter();
  const view = useMemo(() => derivativeCostMonth(store.document, selectedMonth), [store.document, selectedMonth]);

  return (
    <PageFrame
      title={RECIPES_COST_TITLE}
      full
      lede="Плановая и фактическая себестоимость производных из рецепта и цен сырья."
      intro={
        <MaterialMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(recipesCostHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      {view.sections.every((section) => section.rows.length === 0) ? (
        <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
          Производных пока нет. Добавьте их в рецептурных журналах.
        </p>
      ) : (
        <DerivativeCostTable sections={view.sections} month={selectedMonth} />
      )}
    </PageFrame>
  );
}
