'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useMemo, useState } from 'react';
import {
  activeDerivatives,
  isDerivativeUnit,
  isDerivativeWorkshopId,
  warehouseIdForWorkshop,
} from '@/domain/derivatives';
import {
  DERIVATIVE_UNITS,
  DERIVATIVE_WORKSHOPS,
  type DerivativeLine,
  type DerivativeUnit,
  type DerivativeWorkshopId,
} from '@/domain/document';
import { activeMaterials } from '@/domain/materials';
import { parseQuantityInput } from '@/features/materials/text';
import {
  DerivativeFormEmpty,
  DerivativeFormNoCandidates,
  DerivativeFormTable,
  type DerivativeLineDraft,
  emptyDerivativeLineDraft,
  parseComponentDraftKey,
} from '@/features/recipes/DerivativeFormTable';
import { NEW_DERIVATIVE_TITLE, RECIPES_DERIVATIVES_HREF } from '@/features/recipes/paths';
import { DERIVATIVE_ADD_ERROR } from '@/features/recipes/text';
import { useDerivatives } from '@/features/recipes/use-derivatives';
import { fieldClassName, primaryButtonClassName } from '@/features/sales/fields';
import { IconArrowLeft, IconCheck } from '@/features/shell/Icons';
import { PageFrame } from '@/features/shell/PageFrame';

export function DerivativeCreateScreen({ workshopQuery }: { workshopQuery: string }) {
  const initialWorkshop = isDerivativeWorkshopId(workshopQuery) ? workshopQuery : '';
  return <CreateForm initialWorkshopId={initialWorkshop} />;
}

function CreateForm({ initialWorkshopId }: { initialWorkshopId: DerivativeWorkshopId | '' }) {
  const journal = useDerivatives();
  const router = useRouter();
  const workshopFieldId = useId();
  const nameFieldId = useId();
  const unitFieldId = useId();

  const [workshopId, setWorkshopId] = useState<DerivativeWorkshopId | ''>(initialWorkshopId);
  const [name, setName] = useState('');
  const [unit, setUnit] = useState<DerivativeUnit>('кг');
  const [drafts, setDrafts] = useState<Record<string, DerivativeLineDraft>>({});
  const [saveError, setSaveError] = useState<string | null>(null);

  const warehouseId = workshopId ? warehouseIdForWorkshop(workshopId) : null;

  const materials = useMemo(
    () => (warehouseId ? activeMaterials(journal.document, warehouseId) : []),
    [journal.document, warehouseId],
  );

  const derivatives = useMemo(
    () => (warehouseId ? activeDerivatives(journal.document, { warehouseId }) : []),
    [journal.document, warehouseId],
  );

  const hasCandidates = materials.length > 0 || derivatives.length > 0;

  function setQuantity(key: string, raw: string) {
    setDrafts((current) => ({
      ...current,
      [key]: { ...(current[key] ?? emptyDerivativeLineDraft()), quantity: raw },
    }));
  }

  function parsedLines(): DerivativeLine[] | null {
    const result: DerivativeLine[] = [];

    for (const [key, draft] of Object.entries(drafts)) {
      const parsed = parseComponentDraftKey(key);
      if (!parsed) {
        continue;
      }

      const quantity = parseQuantityInput(draft.quantity, false);
      if (quantity === null) {
        const trimmed = draft.quantity.trim();
        if (trimmed !== '' && trimmed !== '0') {
          setSaveError(DERIVATIVE_ADD_ERROR.quantity);
          return null;
        }
        continue;
      }

      if (quantity <= 0) {
        continue;
      }

      result.push({
        id: `derivative-line:${crypto.randomUUID()}`,
        componentKind: parsed.kind,
        componentId: parsed.id,
        quantity,
      });
    }

    if (result.length === 0) {
      setSaveError(DERIVATIVE_ADD_ERROR.lines);
      return null;
    }

    return result;
  }

  function save() {
    setSaveError(null);

    if (!workshopId || !isDerivativeWorkshopId(workshopId)) {
      setSaveError(DERIVATIVE_ADD_ERROR.workshop);
      return;
    }
    if (!isDerivativeUnit(unit)) {
      setSaveError(DERIVATIVE_ADD_ERROR.unit);
      return;
    }

    const lines = parsedLines();
    if (!lines) {
      return;
    }

    const rejection = journal.add({
      id: `derivative:${crypto.randomUUID()}`,
      name,
      workshopId,
      unit,
      lines,
    });

    if (rejection) {
      setSaveError(DERIVATIVE_ADD_ERROR[rejection]);
      return;
    }

    router.replace(RECIPES_DERIVATIVES_HREF);
  }

  return (
    <PageFrame
      title={NEW_DERIVATIVE_TITLE}
      full
      back={
        <Link
          href={RECIPES_DERIVATIVES_HREF}
          aria-label="Назад"
          className="inline-flex size-11 shrink-0 items-center justify-center text-ink outline-none hover:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <IconArrowLeft />
        </Link>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start gap-4">
          {!workshopId ? (
            <DerivativeFormEmpty />
          ) : !hasCandidates ? (
            <DerivativeFormNoCandidates />
          ) : (
            <DerivativeFormTable
              materials={materials}
              derivatives={derivatives}
              drafts={drafts}
              onChange={setQuantity}
            />
          )}

          <div className="sticky top-16 z-20 flex w-72 shrink-0 flex-col gap-4 self-start border border-line bg-sheet p-4 lg:top-4">
            <div>
              <label htmlFor={workshopFieldId} className="text-sm text-muted">
                Цех
              </label>
              <select
                id={workshopFieldId}
                value={workshopId}
                onChange={(event) => {
                  const next = event.target.value;
                  setWorkshopId(isDerivativeWorkshopId(next) ? next : '');
                  setDrafts({});
                  setSaveError(null);
                }}
                className={`mt-2 ${fieldClassName}`}
              >
                <option value="">Выберите цех</option>
                {DERIVATIVE_WORKSHOPS.map((workshop) => (
                  <option key={workshop.id} value={workshop.id}>
                    {workshop.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={nameFieldId} className="text-sm text-muted">
                Название
              </label>
              <input
                id={nameFieldId}
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={`mt-2 ${fieldClassName}`}
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor={unitFieldId} className="text-sm text-muted">
                Единица
              </label>
              <select
                id={unitFieldId}
                value={unit}
                onChange={(event) => {
                  const next = event.target.value;
                  if (isDerivativeUnit(next)) {
                    setUnit(next);
                  }
                }}
                className={`mt-2 ${fieldClassName}`}
              >
                {DERIVATIVE_UNITS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              disabled={!journal.hydrated}
              onClick={save}
              className={`${primaryButtonClassName} w-full`}
            >
              <IconCheck />
              Сохранить
            </button>
            {saveError ? <p className="text-sm text-ink">{saveError}</p> : null}
          </div>
        </div>
      </div>
    </PageFrame>
  );
}
