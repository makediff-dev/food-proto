'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useMemo, useState } from 'react';
import {
  activeDerivatives,
  derivativeByIdOrNull,
  isDerivativeWorkshopId,
  outputPieceThousandthsOf,
  warehouseIdForWorkshop,
} from '@/domain/derivatives';
import {
  DERIVATIVE_WORKSHOPS,
  type Derivative,
  type DerivativeLine,
  type DerivativeWorkshopId,
} from '@/domain/document';
import { activeMaterials } from '@/domain/materials';
import { QUANTITY_SCALE } from '@/domain/quantity';
import {
  applyHeatTreatmentYield,
  gramsPerPieceThousandths,
  outputKilogramThousandthsFromPiecesAndGrams,
  recipeComponentsKilogramThousandths,
} from '@/domain/recipe-yield';
import { formatQuantity, formatQuantityDraft, parseQuantityInput } from '@/features/materials/text';
import {
  componentDraftKey,
  DerivativeFormEmpty,
  DerivativeFormNoCandidates,
  DerivativeFormTable,
  type DerivativeLineDraft,
  emptyDerivativeLineDraft,
  parseComponentDraftKey,
} from '@/features/recipes/DerivativeFormTable';
import { NEW_DERIVATIVE_TITLE, RECIPES_DERIVATIVES_HREF, RECIPES_DERIVATIVES_TITLE } from '@/features/recipes/paths';
import { DERIVATIVE_ADD_ERROR } from '@/features/recipes/text';
import { useDerivatives } from '@/features/recipes/use-derivatives';
import { fieldClassName, primaryButtonClassName } from '@/features/sales/fields';
import { IconArrowLeft, IconCheck } from '@/features/shell/Icons';
import { PageFrame } from '@/features/shell/PageFrame';
import { parsePercentWhole } from '@/features/table/format';

const yieldInputClassName =
  'h-11 min-w-0 flex-1 border border-line bg-paper px-2 text-base text-ink outline-none focus-visible:border-ink focus-visible:bg-sheet focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';

export function DerivativeCreateScreen({ workshopQuery }: { workshopQuery: string }) {
  const initialWorkshop = isDerivativeWorkshopId(workshopQuery) ? workshopQuery : '';
  return <DerivativeForm initialWorkshopId={initialWorkshop} existing={null} />;
}

export function DerivativeEditScreen({ derivativeId }: { derivativeId: string }) {
  const journal = useDerivatives();
  const existing = derivativeByIdOrNull(journal.document, derivativeId);

  if (!existing || existing.deletedAt !== null) {
    return (
      <PageFrame
        title={RECIPES_DERIVATIVES_TITLE}
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
        <p className="border border-line bg-sheet px-4 py-4 text-sm text-ink">Запись не найдена.</p>
      </PageFrame>
    );
  }

  return <DerivativeForm initialWorkshopId={existing.workshopId} existing={existing} />;
}

function draftsFromLines(lines: readonly DerivativeLine[]): Record<string, DerivativeLineDraft> {
  const drafts: Record<string, DerivativeLineDraft> = {};
  for (const line of lines) {
    drafts[componentDraftKey(line.componentKind, line.componentId)] = {
      quantity: formatQuantityDraft(line.quantity),
    };
  }
  return drafts;
}

function initialPiecesDraft(existing: Derivative | null): string {
  if (existing?.unit !== 'шт') {
    return '';
  }
  const pieces = outputPieceThousandthsOf(existing) ?? QUANTITY_SCALE;
  return formatQuantityDraft(pieces);
}

function initialGramsDraft(existing: Derivative | null): string {
  if (existing?.unit !== 'шт') {
    return '';
  }
  const pieces = outputPieceThousandthsOf(existing) ?? QUANTITY_SCALE;
  const grams = gramsPerPieceThousandths(existing.outputKilogramThousandths, pieces);
  return grams === null ? '' : formatQuantityDraft(grams);
}

function DerivativeForm({
  initialWorkshopId,
  existing,
}: {
  initialWorkshopId: DerivativeWorkshopId | '';
  existing: Derivative | null;
}) {
  const journal = useDerivatives();
  const router = useRouter();
  const workshopFieldId = useId();
  const nameFieldId = useId();
  const byPieceFieldId = useId();
  const piecesFieldId = useId();
  const gramsFieldId = useId();
  const outputFieldId = useId();
  const heatTreatmentFieldId = useId();
  const editingId = existing?.id ?? null;

  const [workshopId, setWorkshopId] = useState<DerivativeWorkshopId | ''>(initialWorkshopId);
  const [name, setName] = useState(existing?.name ?? '');
  const [byPiece, setByPiece] = useState(() => existing?.unit === 'шт');
  const [piecesDraft, setPiecesDraft] = useState(() => initialPiecesDraft(existing));
  const [gramsDraft, setGramsDraft] = useState(() => initialGramsDraft(existing));
  const [outputDraft, setOutputDraft] = useState(() => formatQuantityDraft(existing?.outputKilogramThousandths ?? 0));
  const [heatTreatmentDraft, setHeatTreatmentDraft] = useState(() =>
    String(existing?.heatTreatmentYieldPercent ?? 100),
  );
  const [drafts, setDrafts] = useState<Record<string, DerivativeLineDraft>>(() =>
    existing ? draftsFromLines(existing.lines) : {},
  );
  const [saveError, setSaveError] = useState<string | null>(null);

  const warehouseId = workshopId ? warehouseIdForWorkshop(workshopId) : null;

  const materials = useMemo(
    () => (warehouseId ? activeMaterials(journal.document, warehouseId) : []),
    [journal.document, warehouseId],
  );

  const derivatives = useMemo(
    () =>
      warehouseId ? activeDerivatives(journal.document, { warehouseId }).filter((item) => item.id !== editingId) : [],
    [journal.document, warehouseId, editingId],
  );

  const hasCandidates = materials.length > 0 || derivatives.length > 0;

  const draftLines = useMemo(() => {
    const result: DerivativeLine[] = [];
    for (const [key, draft] of Object.entries(drafts)) {
      const parsed = parseComponentDraftKey(key);
      if (!parsed) {
        continue;
      }
      const quantity = parseQuantityInput(draft.quantity, false);
      if (quantity === null || quantity <= 0) {
        continue;
      }
      result.push({
        id: key,
        componentKind: parsed.kind,
        componentId: parsed.id,
        quantity,
      });
    }
    return result;
  }, [drafts]);

  const componentsKilograms = useMemo(() => {
    const raw = recipeComponentsKilogramThousandths(journal.document, draftLines);
    const percent = parsePercentWhole(heatTreatmentDraft);
    if (percent === null || percent <= 0) {
      return raw;
    }
    return applyHeatTreatmentYield(raw, percent);
  }, [journal.document, draftLines, heatTreatmentDraft]);

  function setQuantity(key: string, raw: string) {
    setDrafts((current) => ({
      ...current,
      [key]: { ...(current[key] ?? emptyDerivativeLineDraft()), quantity: raw },
    }));
  }

  function enableByPiece() {
    setByPiece(true);
    setPiecesDraft(formatQuantityDraft(QUANTITY_SCALE));
    const kilograms = parseQuantityInput(outputDraft, false);
    if (kilograms === null || kilograms < 0) {
      setGramsDraft('');
      return;
    }
    const grams = gramsPerPieceThousandths(kilograms, QUANTITY_SCALE);
    setGramsDraft(grams === null ? '' : formatQuantityDraft(grams));
  }

  function disableByPiece() {
    setByPiece(false);
    setPiecesDraft('');
    setGramsDraft('');
  }

  function onOutputChange(raw: string) {
    setOutputDraft(raw);
    if (!byPiece) {
      return;
    }
    const kilograms = parseQuantityInput(raw, false);
    const pieces = parseQuantityInput(piecesDraft, false);
    if (kilograms === null || kilograms < 0 || pieces === null || pieces <= 0) {
      return;
    }
    const grams = gramsPerPieceThousandths(kilograms, pieces);
    if (grams !== null) {
      setGramsDraft(formatQuantityDraft(grams));
    }
  }

  function onPiecesChange(raw: string) {
    setPiecesDraft(raw);
    const pieces = parseQuantityInput(raw, false);
    const grams = parseQuantityInput(gramsDraft, false);
    if (pieces === null || pieces <= 0 || grams === null || grams < 0) {
      return;
    }
    const kilograms = outputKilogramThousandthsFromPiecesAndGrams(pieces, grams);
    if (kilograms !== null) {
      setOutputDraft(formatQuantityDraft(kilograms));
    }
  }

  function onGramsChange(raw: string) {
    setGramsDraft(raw);
    const pieces = parseQuantityInput(piecesDraft, false);
    const grams = parseQuantityInput(raw, false);
    if (pieces === null || pieces <= 0 || grams === null || grams < 0) {
      return;
    }
    const kilograms = outputKilogramThousandthsFromPiecesAndGrams(pieces, grams);
    if (kilograms !== null) {
      setOutputDraft(formatQuantityDraft(kilograms));
    }
  }

  function parsedLines(): DerivativeLine[] | null {
    const existingByKey = new Map(
      (existing?.lines ?? []).map((line) => [`${line.componentKind}:${line.componentId}`, line.id] as const),
    );
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
        id: existingByKey.get(`${parsed.kind}:${parsed.id}`) ?? `derivative-line:${crypto.randomUUID()}`,
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

    const outputKilogramThousandths = parseQuantityInput(outputDraft, false);
    if (outputKilogramThousandths === null) {
      setSaveError(DERIVATIVE_ADD_ERROR.output);
      return;
    }

    const heatTreatmentYieldPercent = parsePercentWhole(heatTreatmentDraft);
    if (heatTreatmentYieldPercent === null || heatTreatmentYieldPercent <= 0) {
      setSaveError(DERIVATIVE_ADD_ERROR['heat-treatment-yield']);
      return;
    }

    let outputPieceThousandths: number | null = null;
    if (byPiece) {
      const pieces = parseQuantityInput(piecesDraft, false);
      if (pieces === null || pieces <= 0) {
        setSaveError(DERIVATIVE_ADD_ERROR.pieces);
        return;
      }
      outputPieceThousandths = pieces;
    }

    const lines = parsedLines();
    if (!lines) {
      return;
    }

    const input = {
      name,
      workshopId,
      unit: byPiece ? ('шт' as const) : ('кг' as const),
      outputKilogramThousandths,
      outputPieceThousandths,
      heatTreatmentYieldPercent,
      lines,
    };

    const rejection = editingId
      ? journal.update(editingId, input)
      : journal.add({
          id: `derivative:${crypto.randomUUID()}`,
          ...input,
        });

    if (rejection) {
      setSaveError(DERIVATIVE_ADD_ERROR[rejection]);
      return;
    }

    router.replace(RECIPES_DERIVATIVES_HREF);
  }

  return (
    <PageFrame
      title={editingId ? RECIPES_DERIVATIVES_TITLE : NEW_DERIVATIVE_TITLE}
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

            <label htmlFor={byPieceFieldId} className="flex cursor-pointer items-center gap-2 text-base text-ink">
              <input
                id={byPieceFieldId}
                type="checkbox"
                checked={byPiece}
                onChange={(event) => {
                  if (event.target.checked) {
                    enableByPiece();
                  } else {
                    disableByPiece();
                  }
                }}
                className="size-4 accent-ink"
              />
              Поштучно
            </label>

            <fieldset className="min-w-0 border-0 p-0">
              <legend className="text-sm text-muted">Рассчитан на</legend>
              <div className="mt-2 flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <input
                    id={outputFieldId}
                    aria-label="Килограммы"
                    value={outputDraft}
                    onChange={(event) => onOutputChange(event.target.value)}
                    className={yieldInputClassName}
                    inputMode="decimal"
                    autoComplete="off"
                  />
                  <span className="shrink-0 text-sm text-ink">кг</span>
                </div>
                {byPiece ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      id={piecesFieldId}
                      aria-label="Штуки"
                      value={piecesDraft}
                      onChange={(event) => onPiecesChange(event.target.value)}
                      className={yieldInputClassName}
                      inputMode="decimal"
                      autoComplete="off"
                    />
                    <span className="shrink-0 text-sm text-ink">шт</span>
                    <input
                      id={gramsFieldId}
                      aria-label="Граммы на штуку"
                      value={gramsDraft}
                      onChange={(event) => onGramsChange(event.target.value)}
                      className={yieldInputClassName}
                      inputMode="decimal"
                      autoComplete="off"
                    />
                    <span className="shrink-0 text-sm text-ink">г/шт</span>
                  </div>
                ) : null}
              </div>
            </fieldset>

            <div>
              <label htmlFor={heatTreatmentFieldId} className="text-sm text-muted">
                Выход после термообработки
              </label>
              <div className="mt-2 flex items-center gap-1.5">
                <input
                  id={heatTreatmentFieldId}
                  value={heatTreatmentDraft}
                  onChange={(event) => setHeatTreatmentDraft(event.target.value)}
                  className={yieldInputClassName}
                  inputMode="numeric"
                  autoComplete="off"
                />
                <span className="shrink-0 text-sm text-ink">%</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted">По компонентам</p>
              <p className="mt-2 text-base text-ink">{formatQuantity(componentsKilograms, 'кг')}</p>
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
