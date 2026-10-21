'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useMemo, useState } from 'react';

import { MATERIAL_WAREHOUSES, type MaterialWarehouseId } from '@/domain/document';
import { activeMaterials, materialReceiptById, materialReceiptRejection } from '@/domain/materials';
import { maxProductionEntryOccurredOn } from '@/domain/production-journal';
import { monthKeyFromDate } from '@/domain/sales-plan';
import {
  emptyMaterialReceiptLineDraft,
  MaterialReceiptFormTable,
  type MaterialReceiptLineDraft,
  type MaterialReceiptLineField,
} from '@/features/materials/MaterialReceiptFormTable';
import {
  MATERIALS_RECEIPTS_TITLE,
  materialsReceiptsHref,
  NEW_MATERIAL_RECEIPT_TITLE,
} from '@/features/materials/paths';
import { formatQuantityDraft, MATERIAL_DOCUMENT_ERROR, parseQuantityInput } from '@/features/materials/text';
import { useMaterials } from '@/features/materials/use-materials';
import { fieldClassName, primaryButtonClassName } from '@/features/sales/fields';
import { IconArrowLeft, IconCheck, IconTrash } from '@/features/shell/Icons';
import { PageFrame } from '@/features/shell/PageFrame';
import { formatMoneyDraft, parseMoneyInput } from '@/features/table/format';

export function MaterialDocumentScreen({ documentId }: { documentId: string | null }) {
  const materials = useMaterials();
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const existing = documentId ? materialReceiptById(materials.document, documentId) : null;

  if (documentId && !existing) {
    return (
      <PageFrame
        title={MATERIALS_RECEIPTS_TITLE}
        full
        back={
          <Link
            href={materialsReceiptsHref({ month: currentMonth, currentMonth })}
            aria-label="Назад"
            className="inline-flex size-11 shrink-0 items-center justify-center text-ink outline-none hover:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <IconArrowLeft />
          </Link>
        }
      >
        <p className="border border-line bg-sheet px-4 py-4 text-sm text-ink">Запись не найдена.</p>
      </PageFrame>
    );
  }

  return <DocumentForm key={documentId ?? 'new'} documentId={documentId} currentMonth={currentMonth} today={today} />;
}

function DocumentForm({
  documentId,
  currentMonth,
  today,
}: {
  documentId: string | null;
  currentMonth: string;
  today: Date;
}) {
  const materials = useMaterials();
  const router = useRouter();
  const dateId = useId();
  const supplierId = useId();
  const receipt = documentId ? materialReceiptById(materials.document, documentId) : null;
  const listMonth = receipt?.occurredOn.slice(0, 7) ?? currentMonth;
  const listHref = materialsReceiptsHref({ month: listMonth, currentMonth });

  const [warehouseId, setWarehouseId] = useState<MaterialWarehouseId>(receipt?.warehouseId ?? 'warehouse-1');
  const [occurredOn, setOccurredOn] = useState(
    receipt?.occurredOn ?? `${currentMonth}-${String(today.getDate()).padStart(2, '0')}`,
  );
  const [supplierName, setSupplierName] = useState(receipt?.supplierName ?? '');
  const [drafts, setDrafts] = useState<Record<string, MaterialReceiptLineDraft>>(() => {
    const next: Record<string, MaterialReceiptLineDraft> = {};
    for (const material of activeMaterials(materials.document)) {
      const receiptLine = receipt?.lines.find((item) => item.materialId === material.id);
      next[material.id] = {
        quantity: receiptLine === undefined ? '' : formatQuantityDraft(receiptLine.quantity),
        price: receiptLine ? formatMoneyDraft(receiptLine.priceWithVat) : '',
      };
    }
    return next;
  });
  const [error, setError] = useState<string | null>(null);
  const rows = activeMaterials(materials.document);

  function setLine(materialId: string, field: MaterialReceiptLineField, raw: string) {
    setDrafts((current) => {
      const line = current[materialId] ?? emptyMaterialReceiptLineDraft();
      return { ...current, [materialId]: { ...line, [field]: raw } };
    });
  }

  function save() {
    const receiptLines: Array<{ id: string; materialId: string; quantity: number; priceWithVat: number }> = [];
    const id = documentId ?? `material-receipt:${crypto.randomUUID()}`;

    for (const material of rows) {
      const draft = drafts[material.id];
      if (!draft || draft.quantity.trim() === '') {
        continue;
      }
      const quantity = parseQuantityInput(draft.quantity, false);
      if (quantity === null || quantity <= 0) {
        setError('Проверьте количество и цену.');
        return;
      }
      const priceWithVat = parseMoneyInput(draft.price);
      if (priceWithVat === null) {
        setError('Проверьте количество и цену.');
        return;
      }
      receiptLines.push({ id: `${id}:${material.id}`, materialId: material.id, quantity, priceWithVat });
    }

    const draft = { id, warehouseId, supplierName, occurredOn, lines: receiptLines };
    const rejection = materialReceiptRejection(materials.document, draft, today);
    if (rejection) {
      setError(MATERIAL_DOCUMENT_ERROR[rejection]);
      return;
    }
    materials.saveReceipt(draft, today);
    router.replace(materialsReceiptsHref({ month: occurredOn.slice(0, 7) || currentMonth, currentMonth }));
  }

  const title = documentId ? MATERIALS_RECEIPTS_TITLE : NEW_MATERIAL_RECEIPT_TITLE;
  const backHref = materialsReceiptsHref({
    month: occurredOn.slice(0, 7) || currentMonth,
    currentMonth,
  });

  return (
    <PageFrame
      title={title}
      full
      back={
        documentId ? (
          <Link
            href={backHref}
            aria-label="Назад"
            className="inline-flex size-11 shrink-0 items-center justify-center text-ink outline-none hover:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <IconArrowLeft />
          </Link>
        ) : (
          <button
            type="button"
            aria-label="Назад"
            onClick={() => router.back()}
            className="inline-flex size-11 shrink-0 items-center justify-center text-ink outline-none hover:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <IconArrowLeft />
          </button>
        )
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start gap-4">
          <MaterialReceiptFormTable materials={rows} drafts={drafts} onChange={setLine} />

          <div className="sticky top-16 z-20 flex w-72 shrink-0 flex-col gap-4 self-start border border-line bg-sheet p-4 lg:top-4">
            <div>
              <label htmlFor={dateId} className="text-sm text-muted">
                Дата
              </label>
              <input
                id={dateId}
                type="date"
                min="2000-01-01"
                max={maxProductionEntryOccurredOn(today)}
                value={occurredOn}
                onChange={(event) => setOccurredOn(event.target.value)}
                className={`mt-2 ${fieldClassName}`}
              />
            </div>
            <div>
              <label className="text-sm text-muted">
                Склад
                <select
                  aria-label="Склад"
                  value={warehouseId}
                  onChange={(event) => setWarehouseId(event.target.value as MaterialWarehouseId)}
                  className={`mt-2 ${fieldClassName}`}
                >
                  {MATERIAL_WAREHOUSES.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div>
              <label htmlFor={supplierId} className="text-sm text-muted">
                Поставщик
              </label>
              <input
                id={supplierId}
                value={supplierName}
                onChange={(event) => setSupplierName(event.target.value)}
                className={`mt-2 ${fieldClassName}`}
              />
            </div>
            <button
              type="button"
              onClick={save}
              disabled={!materials.hydrated}
              className={`${primaryButtonClassName} w-full`}
            >
              <IconCheck />
              Сохранить
            </button>
            {documentId ? (
              <button
                type="button"
                aria-label="Удалить приход"
                onClick={() => {
                  const confirmed = window.confirm('Удалить приход? Его нельзя будет вернуть.');
                  if (!confirmed) {
                    return;
                  }
                  materials.removeReceipt(documentId);
                  router.push(listHref);
                }}
                className="inline-flex h-11 w-full items-center justify-center gap-2 text-sm text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <IconTrash />
                Удалить
              </button>
            ) : null}
            {error ? <p className="text-sm text-ink">{error}</p> : null}
          </div>
        </div>
      </div>
    </PageFrame>
  );
}
