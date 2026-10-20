'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { MATERIAL_WAREHOUSES } from '@/domain/document';
import { materialById, materialReceiptsInMonth } from '@/domain/materials';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { MaterialMonthBar, resolveMaterialMonth } from '@/features/materials/MaterialMonthBar';
import {
  MATERIALS_RECEIPTS_TITLE,
  materialReceiptHref,
  materialReceiptNewHref,
  materialsReceiptsHref,
} from '@/features/materials/paths';
import { formatQuantity } from '@/features/materials/text';
import { useMaterials } from '@/features/materials/use-materials';
import { formatProductionEntryDate } from '@/features/production/text';
import { primaryButtonClassName } from '@/features/sales/fields';
import { IconPlus } from '@/features/shell/Icons';
import { PageFrame } from '@/features/shell/PageFrame';

export function MaterialJournalScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveMaterialMonth(month, today, currentMonth);
  const materials = useMaterials();
  const router = useRouter();
  const items = materialReceiptsInMonth(materials.document, selectedMonth);

  return (
    <PageFrame
      title={MATERIALS_RECEIPTS_TITLE}
      full
      lede="Приход от поставщика на склад 1 или склад 2. В отчёте это факт прихода."
      aside={
        <Link href={materialReceiptNewHref()} className={primaryButtonClassName}>
          <IconPlus />
          Добавить приход
        </Link>
      }
      intro={
        <MaterialMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(materialsReceiptsHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      {items.length === 0 ? (
        <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
          За этот месяц приходов нет. Добавьте поступление: склад, поставщик, дата и количество.
        </p>
      ) : (
        <div className="border border-line bg-sheet">
          <ul>
            {items.map((item) => {
              const warehouse = MATERIAL_WAREHOUSES.find((entry) => entry.id === item.warehouseId);
              const composition = item.lines
                .map((line) => {
                  const material = materialById(materials.document, line.materialId);
                  return `${material?.name ?? 'Позиция'} ${formatQuantity(line.quantity, material?.unit)}`;
                })
                .join(', ');
              return (
                <li key={item.id} className="border-b border-line last:border-b-0">
                  <Link
                    href={materialReceiptHref(item.id)}
                    className="flex flex-col gap-1 px-4 py-3 outline-none hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    <span className="text-sm text-ink">
                      {formatProductionEntryDate(item.occurredOn)}
                      {' · '}
                      {warehouse?.name} · {warehouse?.productionName}
                      {` · ${item.supplierName}`}
                    </span>
                    <span className="text-sm text-muted">{composition}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </PageFrame>
  );
}
