'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { isOccurredOn, type MaterialWarehouseId } from '@/domain/document';
import { maxProductionEntryOccurredOn } from '@/domain/production-journal';
import { defaultSalesFactDay, monthDates } from '@/domain/sales-fact';
import { monthKeyFromDate, planMonthOpen } from '@/domain/sales-plan';
import { MaterialsConsumptionTable } from '@/features/materials/MaterialsConsumptionTable';
import { MATERIALS_CONSUMPTION_TITLE, materialsConsumptionHref } from '@/features/materials/paths';
import { MATERIAL_CONSUMPTION_ERROR } from '@/features/materials/text';
import { useMaterials } from '@/features/materials/use-materials';
import { useRole } from '@/features/roles/RoleProvider';
import { monthFieldClassName } from '@/features/sales/fields';
import { MonthStep } from '@/features/shell/MonthStep';
import { PageFrame } from '@/features/shell/PageFrame';

const DAY_MIN = '2000-01-01';

function resolveDay(month: string, day: string, fallback: string): string {
  if (isOccurredOn(day) && day.startsWith(`${month}-`) && monthDates(month).includes(day)) {
    return day;
  }

  const dom = Number(day.slice(8, 10));
  if (Number.isInteger(dom) && dom > 0) {
    const last = monthDates(month).length;
    const clamped = Math.min(dom, last);
    const candidate = `${month}-${String(clamped).padStart(2, '0')}`;
    if (monthDates(month).includes(candidate)) {
      return candidate;
    }
  }

  return fallback;
}

function shiftCalendarDay(date: string, offset: -1 | 1): string | null {
  if (!isOccurredOn(date)) {
    return null;
  }

  const year = Number(date.slice(0, 4));
  const month = Number(date.slice(5, 7));
  const day = Number(date.slice(8, 10));
  const next = new Date(year, month - 1, day + offset);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`;
}

function resolveMaterialMonth(month: string, today: Date, currentMonth: string): string {
  if (month && planMonthOpen(month, today)) {
    return month;
  }
  return currentMonth;
}

export function MaterialsConsumptionScreen({ month, day }: { month: string; day: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveMaterialMonth(month, today, currentMonth);
  const fallbackDay = defaultSalesFactDay(selectedMonth, today);
  const selectedDay = resolveDay(selectedMonth, day, fallbackDay);
  const maxDay = maxProductionEntryOccurredOn(today);
  const previousDay = shiftCalendarDay(selectedDay, -1);
  const nextDay = shiftCalendarDay(selectedDay, 1);
  const materials = useMaterials();
  const { canEditMaterialConsumption } = useRole();
  const router = useRouter();
  const editable = materials.hydrated && canEditMaterialConsumption;

  function open(nextDayValue: string) {
    if (!isOccurredOn(nextDayValue)) {
      return;
    }
    if (nextDayValue < DAY_MIN || nextDayValue > maxDay) {
      return;
    }
    const targetMonth = nextDayValue.slice(0, 7);
    if (!planMonthOpen(targetMonth, today)) {
      return;
    }
    router.push(
      materialsConsumptionHref({
        month: targetMonth,
        day: nextDayValue,
        currentMonth,
        todayDay: defaultSalesFactDay(currentMonth, today),
      }),
      { scroll: false },
    );
  }

  function realError(warehouseId: MaterialWarehouseId, materialId: string, quantity: number): string | null {
    const rejection = materials.setConsumptionDay(selectedDay, warehouseId, materialId, quantity, today);
    return rejection ? MATERIAL_CONSUMPTION_ERROR[rejection] : null;
  }

  return (
    <PageFrame
      title={MATERIALS_CONSUMPTION_TITLE}
      full
      intro={
        <div className="w-full border border-line bg-sheet p-4">
          <div className="flex items-center gap-2">
            <MonthStep
              label="Предыдущий день"
              direction="previous"
              disabled={previousDay === null || previousDay < DAY_MIN || !planMonthOpen(previousDay.slice(0, 7), today)}
              onClick={() => {
                if (previousDay) {
                  open(previousDay);
                }
              }}
            />
            <input
              type="date"
              aria-label="День"
              min={DAY_MIN}
              max={maxDay}
              value={selectedDay}
              onChange={(event) => open(event.target.value)}
              className={monthFieldClassName}
            />
            <MonthStep
              label="Следующий день"
              direction="next"
              disabled={nextDay === null || nextDay > maxDay || !planMonthOpen(nextDay.slice(0, 7), today)}
              onClick={() => {
                if (nextDay) {
                  open(nextDay);
                }
              }}
            />
          </div>
        </div>
      }
    >
      <MaterialsConsumptionTable
        document={materials.document}
        day={selectedDay}
        editable={editable}
        onReal={realError}
      />
    </PageFrame>
  );
}
