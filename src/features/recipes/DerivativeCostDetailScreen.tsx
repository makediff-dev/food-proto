'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import { useDocumentStore } from '@/data/DocumentProvider';
import { derivativeCostDetail } from '@/domain/derivative-cost';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { resolveMaterialMonth } from '@/features/materials/MaterialMonthBar';
import { RECIPES_COST_TITLE, recipesCostHref } from '@/features/recipes/paths';
import { type RecipeCostDetailExtraUnitRow, RecipeCostDetailTable } from '@/features/recipes/RecipeCostDetailTable';
import { IconArrowLeft } from '@/features/shell/Icons';
import { PageFrame } from '@/features/shell/PageFrame';

export function DerivativeCostDetailScreen({ derivativeId, month }: { derivativeId: string; month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveMaterialMonth(month, today, currentMonth);
  const store = useDocumentStore();
  const detail = useMemo(
    () => derivativeCostDetail(store.document, derivativeId, selectedMonth),
    [store.document, derivativeId, selectedMonth],
  );
  const listHref = recipesCostHref({ month: selectedMonth, currentMonth });

  const back = (
    <Link
      href={listHref}
      aria-label="Назад"
      className="inline-flex size-11 shrink-0 items-center justify-center text-ink outline-none hover:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <IconArrowLeft />
    </Link>
  );

  if (!detail) {
    return (
      <PageFrame title={RECIPES_COST_TITLE} full back={back}>
        <p className="border border-line bg-sheet px-4 py-4 text-sm text-ink">Производная не найдена.</p>
      </PageFrame>
    );
  }

  const extraUnitRows: RecipeCostDetailExtraUnitRow[] = [];
  if (detail.hasPieceCost && detail.planCostPerPiece && detail.factCostPerPiece && detail.costPerPieceDeviation) {
    extraUnitRows.push({
      label: 'За шт',
      plan: detail.planCostPerPiece,
      fact: detail.factCostPerPiece,
      deviation: detail.costPerPieceDeviation,
    });
  }

  return (
    <PageFrame
      title={detail.name}
      full
      back={back}
      lede="Состав себестоимости: вклад каждого ингредиента рецепта. План — по плановым ценам сырья, факт — по фактическим."
    >
      <div className="flex flex-col gap-4">
        {detail.lines.length === 0 ? (
          <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
            В рецепте нет ингредиентов с ненулевым вкладом в стоимость.
          </p>
        ) : null}
        <RecipeCostDetailTable
          caption={`Вклад ингредиентов в себестоимость ${detail.name}`}
          lines={detail.lines}
          unitCost={{ plan: detail.planCostPerKg, fact: detail.factCostPerKg }}
          extraUnitRows={extraUnitRows}
        />
      </div>
    </PageFrame>
  );
}
