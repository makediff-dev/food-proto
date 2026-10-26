'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { derivativeMovementMonth } from '@/domain/derivative-movement';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { DerivativeMovementInventoryTable } from '@/features/derivative-movement/DerivativeMovementInventoryTable';
import {
  DERIVATIVE_MOVEMENT_INVENTORY_TITLE,
  derivativeMovementInventoryHref,
} from '@/features/derivative-movement/paths';
import { DERIVATIVE_OPENING_ERROR } from '@/features/derivative-movement/text';
import { useDerivativeMovement } from '@/features/derivative-movement/use-derivative-movement';
import { MaterialMonthBar, resolveMaterialMonth } from '@/features/materials/MaterialMonthBar';
import { PageFrame } from '@/features/shell/PageFrame';

export function DerivativeMovementInventoryScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveMaterialMonth(month, today, currentMonth);
  const movement = useDerivativeMovement();
  const router = useRouter();
  const view = useMemo(
    () => derivativeMovementMonth(movement.document, selectedMonth),
    [movement.document, selectedMonth],
  );

  function closingError(derivativeId: string, quantity: number): string | null {
    const rejection = movement.setOpening(selectedMonth, derivativeId, quantity, today);
    return rejection ? DERIVATIVE_OPENING_ERROR[rejection] : null;
  }

  return (
    <PageFrame
      title={DERIVATIVE_MOVEMENT_INVENTORY_TITLE}
      full
      lede="Факт остатка производных на конец месяца. Переносится на начало следующего месяца."
      intro={
        <MaterialMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) =>
            router.push(derivativeMovementInventoryHref({ month: next, currentMonth }), { scroll: false })
          }
        />
      }
    >
      {view.sections.every((section) => section.rows.length === 0) ? (
        <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
          Производных пока нет. Добавьте их в рецептурных журналах.
        </p>
      ) : (
        <DerivativeMovementInventoryTable
          sections={view.sections}
          editable={movement.hydrated}
          onClosing={closingError}
        />
      )}
    </PageFrame>
  );
}
