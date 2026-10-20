'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useMemo, useState } from 'react';

import { MATERIAL_GROUPS, MATERIAL_WAREHOUSES, type MaterialWarehouseId } from '@/domain/document';
import {
  activeMaterials,
  materialConsumptionIsNormed,
  materialIssueById,
  materialIssueRejection,
  materialReceiptById,
  materialReceiptRejection,
} from '@/domain/materials';
import { maxProductionEntryOccurredOn } from '@/domain/production-journal';
import { monthKeyFromDate } from '@/domain/sales-plan';
import {
  MATERIALS_ISSUES_TITLE,
  MATERIALS_RECEIPTS_TITLE,
  materialsIssuesHref,
  materialsReceiptsHref,
  NEW_MATERIAL_ISSUE_TITLE,
  NEW_MATERIAL_RECEIPT_TITLE,
} from '@/features/materials/paths';
import { formatQuantityDraft, MATERIAL_DOCUMENT_ERROR, parseQuantityInput } from '@/features/materials/text';
import { useMaterials } from '@/features/materials/use-materials';
import { fieldClassName, primaryButtonClassName } from '@/features/sales/fields';
import { IconArrowLeft, IconCheck, IconTrash } from '@/features/shell/Icons';
import { PageFrame } from '@/features/shell/PageFrame';
import { formatMoneyDraft, parseMoneyInput } from '@/features/table/format';

type Kind = 'receipt' | 'issue';

export function MaterialDocumentScreen({ kind, documentId }: { kind: Kind; documentId: string | null }) {
  const materials = useMaterials();
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const existing =
    kind === 'receipt'
      ? documentId
        ? materialReceiptById(materials.document, documentId)
        : null
      : documentId
        ? materialIssueById(materials.document, documentId)
        : null;

  if (documentId && !existing) {
    return (
      <PageFrame title={kind === 'receipt' ? MATERIALS_RECEIPTS_TITLE : MATERIALS_ISSUES_TITLE} full>
        <p className="border border-line bg-sheet px-4 py-4 text-sm text-muted">Запись не найдена.</p>
      </PageFrame>
    );
  }

  return (
    <DocumentForm
      key={documentId ?? 'new'}
      kind={kind}
      documentId={documentId}
      currentMonth={currentMonth}
      today={today}
    />
  );
}

function DocumentForm({
  kind,
  documentId,
  currentMonth,
  today,
}: {
  kind: Kind;
  documentId: string | null;
  currentMonth: string;
  today: Date;
}) {
  const materials = useMaterials();
  const router = useRouter();
  const dateId = useId();
  const supplierId = useId();
  const receipt = kind === 'receipt' && documentId ? materialReceiptById(materials.document, documentId) : null;
  const issue = kind === 'issue' && documentId ? materialIssueById(materials.document, documentId) : null;
  const existing = receipt ?? issue;
  const listHref = (month: string) =>
    kind === 'receipt' ? materialsReceiptsHref({ month, currentMonth }) : materialsIssuesHref({ month, currentMonth });

  const [warehouseId, setWarehouseId] = useState<MaterialWarehouseId>(existing?.warehouseId ?? 'warehouse-1');
  const [occurredOn, setOccurredOn] = useState(
    existing?.occurredOn ?? `${currentMonth}-${String(today.getDate()).padStart(2, '0')}`,
  );
  const [supplierName, setSupplierName] = useState(receipt?.supplierName ?? '');
  const [drafts, setDrafts] = useState<Record<string, { quantity: string; price: string }>>(() => {
    const next: Record<string, { quantity: string; price: string }> = {};
    for (const material of activeMaterials(materials.document)) {
      const receiptLine = receipt?.lines.find((item) => item.materialId === material.id);
      const issueLine = issue?.lines.find((item) => item.materialId === material.id);
      const quantity = receiptLine?.quantity ?? issueLine?.quantity;
      next[material.id] = {
        quantity: quantity === undefined ? '' : formatQuantityDraft(quantity),
        price: receiptLine ? formatMoneyDraft(receiptLine.priceWithVat) : '',
      };
    }
    return next;
  });
  const [error, setError] = useState<string | null>(null);
  const rows = activeMaterials(materials.document).filter(
    (material) => kind === 'receipt' || !materialConsumptionIsNormed(materials.document, warehouseId, material.id),
  );
  const normed = activeMaterials(materials.document).filter((material) =>
    materialConsumptionIsNormed(materials.document, warehouseId, material.id),
  );

  function save() {
    const receiptLines: Array<{ id: string; materialId: string; quantity: number; priceWithVat: number }> = [];
    const issueLines: Array<{ id: string; materialId: string; quantity: number }> = [];
    const id =
      documentId ??
      (kind === 'receipt' ? `material-receipt:${crypto.randomUUID()}` : `material-issue:${crypto.randomUUID()}`);

    for (const material of rows) {
      const draft = drafts[material.id];
      if (!draft || draft.quantity.trim() === '') {
        continue;
      }
      const quantity = parseQuantityInput(draft.quantity, false);
      if (quantity === null || quantity <= 0) {
        setError(kind === 'receipt' ? 'Проверьте количество и цену.' : 'Проверьте количество.');
        return;
      }
      if (kind === 'receipt') {
        const priceWithVat = parseMoneyInput(draft.price);
        if (priceWithVat === null) {
          setError('Проверьте количество и цену.');
          return;
        }
        receiptLines.push({ id: `${id}:${material.id}`, materialId: material.id, quantity, priceWithVat });
      } else {
        issueLines.push({ id: `${id}:${material.id}`, materialId: material.id, quantity });
      }
    }

    if (kind === 'receipt') {
      const draft = { id, warehouseId, supplierName, occurredOn, lines: receiptLines };
      const rejection = materialReceiptRejection(materials.document, draft, today);
      if (rejection) {
        setError(MATERIAL_DOCUMENT_ERROR[rejection]);
        return;
      }
      materials.saveReceipt(draft, today);
    } else {
      const draft = { id, warehouseId, occurredOn, lines: issueLines };
      const rejection = materialIssueRejection(materials.document, draft, today);
      if (rejection) {
        setError(MATERIAL_DOCUMENT_ERROR[rejection]);
        return;
      }
      materials.saveIssue(draft, today);
    }
    router.replace(listHref(occurredOn.slice(0, 7) || currentMonth));
  }

  const title = documentId
    ? kind === 'receipt'
      ? MATERIALS_RECEIPTS_TITLE
      : MATERIALS_ISSUES_TITLE
    : kind === 'receipt'
      ? NEW_MATERIAL_RECEIPT_TITLE
      : NEW_MATERIAL_ISSUE_TITLE;

  return (
    <PageFrame
      title={title}
      full
      lede={
        kind === 'receipt'
          ? 'Поступление на один склад. В остаток входит количество и цена этой записи.'
          : 'Расход со склада в производство. Позиции с нормой сюда не входят.'
      }
      back={
        <Link
          href={listHref(existing?.occurredOn.slice(0, 7) ?? currentMonth)}
          aria-label="Назад"
          className="inline-flex size-11 shrink-0 items-center justify-center text-ink outline-none hover:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <IconArrowLeft />
        </Link>
      }
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 border border-line bg-sheet">
          {MATERIAL_GROUPS.map((group) => {
            const groupRows = rows.filter((item) => item.groupId === group.id);
            if (groupRows.length === 0) {
              return null;
            }
            return (
              <section key={group.id}>
                <h2 className="border-b border-line bg-paper px-4 py-2 text-sm text-ink">{group.name}</h2>
                <ul>
                  {groupRows.map((material) => {
                    const draft = drafts[material.id] ?? { quantity: '', price: '' };
                    return (
                      <li
                        key={material.id}
                        className="grid gap-3 border-b border-line px-4 py-3 sm:grid-cols-[minmax(0,1fr)_9rem_9rem]"
                      >
                        <span className="text-sm text-ink">
                          {material.name}
                          <span className="text-muted"> · {material.unit}</span>
                        </span>
                        <label className="text-sm text-muted">
                          Количество
                          <input
                            aria-label={`Количество ${material.name}`}
                            value={draft.quantity}
                            inputMode="decimal"
                            onChange={(event) =>
                              setDrafts((current) => ({
                                ...current,
                                [material.id]: { ...draft, quantity: event.target.value },
                              }))
                            }
                            className={`mt-1 ${fieldClassName}`}
                          />
                        </label>
                        {kind === 'receipt' ? (
                          <label className="text-sm text-muted">
                            Цена с НДС, ₽
                            <input
                              aria-label={`Цена ${material.name}`}
                              value={draft.price}
                              inputMode="decimal"
                              onChange={(event) =>
                                setDrafts((current) => ({
                                  ...current,
                                  [material.id]: { ...draft, price: event.target.value },
                                }))
                              }
                              className={`mt-1 ${fieldClassName}`}
                            />
                          </label>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
          {kind === 'issue' && normed.length > 0 ? (
            <p className="px-4 py-3 text-sm leading-6 text-muted">
              По норме на выпуск, в этот расход не входят: {normed.map((item) => item.name).join(', ')}.
            </p>
          ) : null}
        </div>
        <div className="sticky top-4 flex w-full shrink-0 flex-col gap-4 border border-line bg-sheet p-4 lg:w-72">
          <label className="text-sm text-muted" htmlFor={dateId}>
            Дата
            <input
              id={dateId}
              type="date"
              min="2000-01-01"
              max={maxProductionEntryOccurredOn(today)}
              value={occurredOn}
              onChange={(event) => setOccurredOn(event.target.value)}
              className={`mt-2 ${fieldClassName}`}
            />
          </label>
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
                  {warehouse.name} · {warehouse.productionName}
                </option>
              ))}
            </select>
          </label>
          {kind === 'receipt' ? (
            <label className="text-sm text-muted" htmlFor={supplierId}>
              Поставщик
              <input
                id={supplierId}
                value={supplierName}
                onChange={(event) => setSupplierName(event.target.value)}
                className={`mt-2 ${fieldClassName}`}
              />
            </label>
          ) : null}
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
              onClick={() => {
                const confirmed = window.confirm(
                  kind === 'receipt'
                    ? 'Удалить приход? Его нельзя будет вернуть.'
                    : 'Удалить расход? Его нельзя будет вернуть.',
                );
                if (!confirmed) {
                  return;
                }
                if (kind === 'receipt') {
                  materials.removeReceipt(documentId);
                } else {
                  materials.removeIssue(documentId);
                }
                router.push(listHref(existing?.occurredOn.slice(0, 7) ?? currentMonth));
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
    </PageFrame>
  );
}
