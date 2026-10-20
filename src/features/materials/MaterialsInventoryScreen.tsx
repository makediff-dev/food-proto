'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import type { MaterialWarehouseId } from '@/domain/document';
import { materialMovementMonth } from '@/domain/materials';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { MaterialMonthBar, resolveMaterialMonth } from '@/features/materials/MaterialMonthBar';
import { MaterialsInventoryTable } from '@/features/materials/MaterialsInventoryTable';
import { MaterialsWarehouseBlocks } from '@/features/materials/MaterialsWarehouseBlocks';
import { MATERIALS_INVENTORY_TITLE, materialsInventoryHref } from '@/features/materials/paths';
import { MATERIAL_OPENING_ERROR } from '@/features/materials/text';
import { useMaterials } from '@/features/materials/use-materials';
import { PageFrame } from '@/features/shell/PageFrame';

export function MaterialsInventoryScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveMaterialMonth(month, today, currentMonth);
  const materials = useMaterials();
  const router = useRouter();
  const view = useMemo(
    () => materialMovementMonth(materials.document, selectedMonth),
    [materials.document, selectedMonth],
  );

  function closingError(warehouseId: MaterialWarehouseId, materialId: string, quantity: number): string | null {
    const rejection = materials.setOpening(selectedMonth, warehouseId, materialId, quantity, today);
    return rejection ? MATERIAL_OPENING_ERROR[rejection] : null;
  }

  return (
    <PageFrame
      title={MATERIALS_INVENTORY_TITLE}
      full
      lede="Факт остатка на конец каждого склада. Отклонение показывает недостачу или излишек именно этого склада и производства. Этот факт — остаток на начало следующего месяца."
      intro={
        <MaterialMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(materialsInventoryHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      <MaterialsWarehouseBlocks
        groups={view.groups}
        renderWarehouse={(group, warehouse) => (
          <MaterialsInventoryTable
            caption={`${group.name}, ${warehouse.name}, инвентаризация`}
            rows={warehouse.rows}
            totals={warehouse.totals}
            editable={materials.hydrated}
            onClosing={(materialId, quantity) => closingError(warehouse.warehouseId, materialId, quantity)}
          />
        )}
      />
    </PageFrame>
  );
}
