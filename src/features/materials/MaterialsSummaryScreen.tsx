'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { materialMovementMonth } from '@/domain/materials';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { MaterialMonthBar, resolveMaterialMonth } from '@/features/materials/MaterialMonthBar';
import { MaterialsSummaryTable } from '@/features/materials/MaterialsSummaryTable';
import { MATERIALS_SUMMARY_TITLE, materialsSummaryHref } from '@/features/materials/paths';
import { useMaterials } from '@/features/materials/use-materials';
import { PageFrame } from '@/features/shell/PageFrame';

export function MaterialsSummaryScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveMaterialMonth(month, today, currentMonth);
  const materials = useMaterials();
  const router = useRouter();
  const view = useMemo(
    () => materialMovementMonth(materials.document, selectedMonth),
    [materials.document, selectedMonth],
  );

  return (
    <PageFrame
      title={MATERIALS_SUMMARY_TITLE}
      full
      lede="Остаток на начало — конец прошлого месяца по инвентаризации. План конца: начало + приход − расход. Факт конца — инвентаризация. План и факт расхода в производстве считаются из выпуска по рецептам. Склад 1 и склад 2 здесь не складываются."
      intro={
        <MaterialMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(materialsSummaryHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      <MaterialsSummaryTable groups={view.groups} />
    </PageFrame>
  );
}
