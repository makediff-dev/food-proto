'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { useDocumentStore } from '@/data/DocumentProvider';
import { derivativeMovementMonth } from '@/domain/derivative-movement';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { DerivativeMovementSummaryTable } from '@/features/derivative-movement/DerivativeMovementSummaryTable';
import { DERIVATIVE_MOVEMENT_SUMMARY_TITLE, derivativeMovementSummaryHref } from '@/features/derivative-movement/paths';
import { MaterialMonthBar, resolveMaterialMonth } from '@/features/materials/MaterialMonthBar';
import { PageFrame } from '@/features/shell/PageFrame';

export function DerivativeMovementSummaryScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveMaterialMonth(month, today, currentMonth);
  const store = useDocumentStore();
  const router = useRouter();
  const view = useMemo(() => derivativeMovementMonth(store.document, selectedMonth), [store.document, selectedMonth]);

  return (
    <PageFrame
      title={DERIVATIVE_MOVEMENT_SUMMARY_TITLE}
      full
      intro={
        <MaterialMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) =>
            router.push(derivativeMovementSummaryHref({ month: next, currentMonth }), { scroll: false })
          }
        />
      }
    >
      {view.sections.every((section) => section.rows.length === 0) ? (
        <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
          Производных пока нет. Добавьте их в рецептурных журналах.
        </p>
      ) : (
        <DerivativeMovementSummaryTable sections={view.sections} />
      )}
    </PageFrame>
  );
}
