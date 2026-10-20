'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import type { MaterialWarehouseId } from '@/domain/document';
import { type MaterialPlanField, materialMovementMonth } from '@/domain/materials';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { MaterialMonthBar, resolveMaterialMonth } from '@/features/materials/MaterialMonthBar';
import { MaterialsSummaryTable } from '@/features/materials/MaterialsSummaryTable';
import { MaterialsWarehouseBlocks } from '@/features/materials/MaterialsWarehouseBlocks';
import { MATERIALS_SUMMARY_TITLE, materialsSummaryHref } from '@/features/materials/paths';
import { MATERIAL_PLAN_ERROR } from '@/features/materials/text';
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

  function factConsumptionError(
    warehouseId: MaterialWarehouseId,
    materialId: string,
    field: MaterialPlanField,
    value: number,
  ): string | null {
    const rejection = materials.setPlan(selectedMonth, warehouseId, materialId, field, value, today);
    return rejection ? MATERIAL_PLAN_ERROR[rejection] : null;
  }

  return (
    <PageFrame
      title={MATERIALS_SUMMARY_TITLE}
      full
      lede="Остаток на начало — конец прошлого месяца по инвентаризации. План конца: начало + приход − расход. Факт конца — инвентаризация. Факт расхода вводят в колонке «Факт». Склад 1 и склад 2 здесь не складываются."
      intro={
        <MaterialMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(materialsSummaryHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      <MaterialsWarehouseBlocks
        groups={view.groups}
        renderWarehouse={(group, warehouse) => (
          <MaterialsSummaryTable
            caption={`${group.name}, ${warehouse.name}`}
            rows={warehouse.rows}
            totals={warehouse.totals}
            editable={materials.hydrated}
            onFactConsumption={(materialId, field, value) =>
              factConsumptionError(warehouse.warehouseId, materialId, field, value)
            }
          />
        )}
      />
    </PageFrame>
  );
}
