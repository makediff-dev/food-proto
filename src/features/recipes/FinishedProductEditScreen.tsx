'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useMemo, useState } from 'react';

import { activeDerivatives } from '@/domain/derivatives';
import type { Product, ProductRecipeLine } from '@/domain/document';
import { MATERIAL_WAREHOUSES } from '@/domain/document';
import { activeMaterials } from '@/domain/materials';
import { productByIdOrNull } from '@/domain/products';
import { QUANTITY_SCALE } from '@/domain/quantity';
import {
  gramsPerPieceThousandths,
  outputKilogramThousandthsFromPiecesAndGrams,
  recipeComponentsKilogramThousandths,
} from '@/domain/recipe-yield';
import { formatQuantity, formatQuantityDraft, parseQuantityInput } from '@/features/materials/text';
import {
  componentDraftKey,
  DerivativeCompositionEditor,
  DerivativeFormNoCandidates,
  type DerivativeLineDraft,
  emptyDerivativeLineDraft,
  parseComponentDraftKey,
} from '@/features/recipes/DerivativeFormTable';
import { RECIPES_FINISHED_HREF, RECIPES_FINISHED_TITLE } from '@/features/recipes/paths';
import {
  formatPrintKilograms,
  formatPrintPieces,
  RecipePrintButton,
  RecipePrintSheet,
  recipePrintGroups,
} from '@/features/recipes/RecipePrint';
import { RecipeWeightCompare } from '@/features/recipes/RecipeWeightCompare';
import { formatRecipeWeightGap, PRODUCT_RECIPE_ERROR } from '@/features/recipes/text';
import { useFinishedRecipes } from '@/features/recipes/use-finished-recipes';
import { primaryButtonClassName } from '@/features/sales/fields';
import { IconArrowLeft, IconCheck } from '@/features/shell/Icons';
import { PageFrame } from '@/features/shell/PageFrame';

const yieldInputClassName =
  'h-11 min-w-0 flex-1 border border-line bg-paper px-2 text-base text-ink outline-none focus-visible:border-ink focus-visible:bg-sheet focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';

function draftsFromLines(lines: readonly ProductRecipeLine[]): Record<string, DerivativeLineDraft> {
  const drafts: Record<string, DerivativeLineDraft> = {};
  for (const line of lines) {
    drafts[componentDraftKey(line.componentKind, line.componentId)] = {
      quantity: formatQuantityDraft(line.quantity),
    };
  }
  return drafts;
}

function warehouseLabel(warehouseId: Product['warehouseId']): string {
  return MATERIAL_WAREHOUSES.find((item) => item.id === warehouseId)?.name ?? warehouseId;
}

function piecesOf(product: Product): number {
  return product.outputPieceThousandths > 0 ? product.outputPieceThousandths : QUANTITY_SCALE;
}

function initialPiecesDraft(product: Product): string {
  return formatQuantityDraft(piecesOf(product));
}

function initialGramsDraft(product: Product): string {
  const grams = gramsPerPieceThousandths(product.outputKilogramThousandths, piecesOf(product));
  return grams === null ? '' : formatQuantityDraft(grams);
}

export function FinishedProductEditScreen({ productId }: { productId: string }) {
  const journal = useFinishedRecipes();
  const existing = productByIdOrNull(journal.document, productId);

  if (!existing || existing.deletedAt !== null) {
    return (
      <PageFrame
        title={RECIPES_FINISHED_TITLE}
        full
        back={
          <Link
            href={RECIPES_FINISHED_HREF}
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

  return <FinishedProductRecipeForm product={existing} />;
}

function FinishedProductRecipeForm({ product }: { product: Product }) {
  const journal = useFinishedRecipes();
  const router = useRouter();
  const outputFieldId = useId();
  const piecesFieldId = useId();
  const gramsFieldId = useId();
  const [drafts, setDrafts] = useState<Record<string, DerivativeLineDraft>>(() => draftsFromLines(product.lines));
  const [outputDraft, setOutputDraft] = useState(() => formatQuantityDraft(product.outputKilogramThousandths));
  const [piecesDraft, setPiecesDraft] = useState(() => initialPiecesDraft(product));
  const [gramsDraft, setGramsDraft] = useState(() => initialGramsDraft(product));
  const [saveError, setSaveError] = useState<string | null>(null);

  const materials = useMemo(
    () => activeMaterials(journal.document, product.warehouseId),
    [journal.document, product.warehouseId],
  );

  const derivatives = useMemo(
    () => activeDerivatives(journal.document, { warehouseId: product.warehouseId }),
    [journal.document, product.warehouseId],
  );

  const hasCandidates = materials.length > 0 || derivatives.length > 0;

  const draftLines = useMemo(() => {
    const result: ProductRecipeLine[] = [];
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

  const componentsKilograms = useMemo(
    () => recipeComponentsKilogramThousandths(journal.document, draftLines),
    [journal.document, draftLines],
  );

  function setQuantity(key: string, raw: string) {
    setDrafts((current) => ({
      ...current,
      [key]: { ...(current[key] ?? emptyDerivativeLineDraft()), quantity: raw },
    }));
  }

  function addComponent(key: string) {
    setDrafts((current) => (Object.hasOwn(current, key) ? current : { ...current, [key]: emptyDerivativeLineDraft() }));
  }

  function removeComponent(key: string) {
    setDrafts((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function onOutputChange(raw: string) {
    setOutputDraft(raw);
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

  function parsedLines(): ProductRecipeLine[] | null {
    const existingByKey = new Map(
      product.lines.map((line) => [`${line.componentKind}:${line.componentId}`, line.id] as const),
    );
    const result: ProductRecipeLine[] = [];

    for (const [key, draft] of Object.entries(drafts)) {
      const parsed = parseComponentDraftKey(key);
      if (!parsed) {
        continue;
      }

      const quantity = parseQuantityInput(draft.quantity, false);
      if (quantity === null) {
        const trimmed = draft.quantity.trim();
        if (trimmed !== '' && trimmed !== '0') {
          setSaveError(PRODUCT_RECIPE_ERROR.quantity);
          return null;
        }
        continue;
      }

      if (quantity <= 0) {
        continue;
      }

      result.push({
        id: existingByKey.get(`${parsed.kind}:${parsed.id}`) ?? `product-line:${crypto.randomUUID()}`,
        componentKind: parsed.kind,
        componentId: parsed.id,
        quantity,
      });
    }

    return result;
  }

  function save() {
    setSaveError(null);

    const outputKilogramThousandths = parseQuantityInput(outputDraft, false);
    if (outputKilogramThousandths === null) {
      setSaveError(PRODUCT_RECIPE_ERROR.output);
      return;
    }

    const outputPieceThousandths = parseQuantityInput(piecesDraft, false);
    if (outputPieceThousandths === null || outputPieceThousandths <= 0) {
      setSaveError(PRODUCT_RECIPE_ERROR.pieces);
      return;
    }

    const lines = parsedLines();
    if (!lines) {
      return;
    }

    const rejection = journal.updateRecipe(product.id, lines, outputKilogramThousandths, outputPieceThousandths);
    if (rejection) {
      setSaveError(PRODUCT_RECIPE_ERROR[rejection]);
      return;
    }

    router.replace(RECIPES_FINISHED_HREF);
  }

  const batchKilogramThousandths = parseQuantityInput(outputDraft, false);
  const printModel = {
    kindLabel: 'готовая продукция',
    name: product.name,
    placeLabel: 'Склад',
    place: warehouseLabel(product.warehouseId),
    batchKilograms: formatPrintKilograms(outputDraft),
    batchPieces: formatPrintPieces(piecesDraft, gramsDraft),
    heatTreatment: null,
    componentsKilograms: formatQuantity(componentsKilograms, 'кг'),
    weightGap: formatRecipeWeightGap(batchKilogramThousandths, componentsKilograms),
    groups: recipePrintGroups(materials, derivatives, drafts),
  };

  return (
    <>
      <div className="screen-only">
        <PageFrame
          title={RECIPES_FINISHED_TITLE}
          full
          back={
            <Link
              href={RECIPES_FINISHED_HREF}
              aria-label="Назад"
              className="inline-flex size-11 shrink-0 items-center justify-center text-ink outline-none hover:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <IconArrowLeft />
            </Link>
          }
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-start gap-4">
              {!hasCandidates ? (
                <DerivativeFormNoCandidates />
              ) : (
                <DerivativeCompositionEditor
                  materials={materials}
                  derivatives={derivatives}
                  drafts={drafts}
                  onChange={setQuantity}
                  onAdd={addComponent}
                  onRemove={removeComponent}
                />
              )}

              <div className="sticky top-16 z-20 flex w-72 shrink-0 flex-col gap-4 self-start border border-line bg-sheet p-4 lg:top-4">
                <div>
                  <p className="text-sm text-muted">Название</p>
                  <p className="mt-2 text-base text-ink">{product.name}</p>
                </div>

                <div>
                  <p className="text-sm text-muted">Склад</p>
                  <p className="mt-2 text-base text-ink">{warehouseLabel(product.warehouseId)}</p>
                </div>

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
                  </div>
                </fieldset>

                <RecipeWeightCompare
                  batchKilogramThousandths={parseQuantityInput(outputDraft, false)}
                  componentsKilogramThousandths={componentsKilograms}
                />

                <button
                  type="button"
                  disabled={!journal.hydrated}
                  onClick={save}
                  className={`${primaryButtonClassName} w-full`}
                >
                  <IconCheck />
                  Сохранить
                </button>
                <RecipePrintButton />
                {saveError ? <p className="text-sm text-ink">{saveError}</p> : null}
              </div>
            </div>
          </div>
        </PageFrame>
      </div>
      <RecipePrintSheet model={printModel} />
    </>
  );
}
