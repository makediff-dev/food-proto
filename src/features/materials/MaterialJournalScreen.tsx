'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { MATERIAL_WAREHOUSES } from '@/domain/document';
import {
  materialById,
  materialIssueIgnoredByNorm,
  materialIssuesInMonth,
  materialReceiptsInMonth,
} from '@/domain/materials';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { MaterialMonthBar, resolveMaterialMonth } from '@/features/materials/MaterialMonthBar';
import {
  MATERIALS_ISSUES_TITLE,
  MATERIALS_RECEIPTS_TITLE,
  materialIssueHref,
  materialIssueNewHref,
  materialReceiptHref,
  materialReceiptNewHref,
  materialsIssuesHref,
  materialsReceiptsHref,
} from '@/features/materials/paths';
import { formatQuantity } from '@/features/materials/text';
import { useMaterials } from '@/features/materials/use-materials';
import { formatProductionEntryDate } from '@/features/production/text';
import { primaryButtonClassName } from '@/features/sales/fields';
import { IconPlus } from '@/features/shell/Icons';
import { PageFrame } from '@/features/shell/PageFrame';

type Kind = 'receipt' | 'issue';

export function MaterialJournalScreen({ kind, month }: { kind: Kind; month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveMaterialMonth(month, today, currentMonth);
  const materials = useMaterials();
  const router = useRouter();
  const items =
    kind === 'receipt'
      ? materialReceiptsInMonth(materials.document, selectedMonth)
      : materialIssuesInMonth(materials.document, selectedMonth);
  const href = kind === 'receipt' ? materialsReceiptsHref : materialsIssuesHref;

  return (
    <PageFrame
      title={kind === 'receipt' ? MATERIALS_RECEIPTS_TITLE : MATERIALS_ISSUES_TITLE}
      full
      lede={
        kind === 'receipt'
          ? 'Приход от поставщика на склад 1 или склад 2. В отчёте это факт прихода.'
          : 'Расход в производстве со склада. Позиция с нормой в остаток из этого списка не входит.'
      }
      aside={
        <Link
          href={kind === 'receipt' ? materialReceiptNewHref() : materialIssueNewHref()}
          className={primaryButtonClassName}
        >
          <IconPlus />
          {kind === 'receipt' ? 'Добавить приход' : 'Добавить расход'}
        </Link>
      }
      intro={
        <MaterialMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(href({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      {items.length === 0 ? (
        <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
          {kind === 'receipt'
            ? 'За этот месяц приходов нет. Добавьте поступление: склад, поставщик, дата и количество.'
            : 'За этот месяц расхода нет. Добавьте расход склада в производство. Позиции с нормой считаются из выпуска.'}
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
              const ignored =
                kind === 'issue' && 'lines' in item && materialIssueIgnoredByNorm(materials.document, item);
              return (
                <li key={item.id} className="border-b border-line last:border-b-0">
                  <Link
                    href={kind === 'receipt' ? materialReceiptHref(item.id) : materialIssueHref(item.id)}
                    className="flex flex-col gap-1 px-4 py-3 outline-none hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    <span className="text-sm text-ink">
                      {formatProductionEntryDate(item.occurredOn)}
                      {' · '}
                      {warehouse?.name} · {warehouse?.productionName}
                      {'supplierName' in item ? ` · ${item.supplierName}` : ''}
                    </span>
                    <span className="text-sm text-muted">{composition}</span>
                    {ignored ? (
                      <span className="text-xs text-muted">В остаток не входит: расход считается по норме.</span>
                    ) : null}
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
