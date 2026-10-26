'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { type DerivativeNormField, derivativeMovementMonth } from '@/domain/derivative-movement';
import { monthKeyFromDate } from '@/domain/sales-plan';
import {
  DerivativeMovementPlanTable,
  derivativeNormRangeInvalid,
} from '@/features/derivative-movement/DerivativeMovementPlanTable';
import { DERIVATIVE_MOVEMENT_PLAN_TITLE, derivativeMovementPlanHref } from '@/features/derivative-movement/paths';
import { DERIVATIVE_NORM_ERROR } from '@/features/derivative-movement/text';
import { useDerivativeMovement } from '@/features/derivative-movement/use-derivative-movement';
import { MaterialMonthBar, resolveMaterialMonth } from '@/features/materials/MaterialMonthBar';
import { PageFrame } from '@/features/shell/PageFrame';

export function DerivativeMovementPlanScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveMaterialMonth(month, today, currentMonth);
  const movement = useDerivativeMovement();
  const router = useRouter();
  const view = useMemo(
    () => derivativeMovementMonth(movement.document, selectedMonth),
    [movement.document, selectedMonth],
  );
  const invalidNormRanges = view.sections.some((section) =>
    section.rows.some((row) => derivativeNormRangeInvalid(row.minQuantity, row.maxQuantity)),
  );

  function normError(derivativeId: string, field: DerivativeNormField, value: number): string | null {
    const rejection = movement.setNorm(selectedMonth, derivativeId, field, value, today);
    return rejection ? DERIVATIVE_NORM_ERROR[rejection] : null;
  }

  return (
    <PageFrame
      title={DERIVATIVE_MOVEMENT_PLAN_TITLE}
      full
      lede="Нормативный минимум и максимум остатка производных на конец месяца. Рекомендуемый объём приводит остаток с начала месяца к середине интервала с учётом плана расхода."
      intro={
        <MaterialMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(derivativeMovementPlanHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      <div className="flex flex-col gap-4">
        {invalidNormRanges ? (
          <p role="alert" className="border border-caution/60 bg-caution/10 px-4 py-3 text-sm leading-6 text-ink">
            У части производных минимум больше максимума — норматив противоречивый. Исправьте значения в колонках «Мин.»
            и «Макс.» (ячейки подсвечены).
          </p>
        ) : null}
        {view.sections.every((section) => section.rows.length === 0) ? (
          <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
            Производных пока нет. Добавьте их в рецептурных журналах.
          </p>
        ) : (
          <DerivativeMovementPlanTable sections={view.sections} editable={movement.hydrated} onNorm={normError} />
        )}
      </div>
    </PageFrame>
  );
}
