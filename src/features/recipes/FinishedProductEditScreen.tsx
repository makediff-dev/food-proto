'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useMemo, useState } from 'react';

import { activeDerivatives } from '@/domain/derivatives';
import type { Product, ProductRecipeLine } from '@/domain/document';
import { MATERIAL_WAREHOUSES } from '@/domain/document';
import { activeMaterials } from '@/domain/materials';
import { productByIdOrNull } from '@/domain/products';
import { recipeComponentsKilogramThousandths } from '@/domain/recipe-yield';
import { formatQuantity, formatQuantityDraft, parseQuantityInput } from '@/features/materials/text';
import {
  componentDraftKey,
  DerivativeFormNoCandidates,
  DerivativeFormTable,
  type DerivativeLineDraft,
  emptyDerivativeLineDraft,
  parseComponentDraftKey,
} from '@/features/recipes/DerivativeFormTable';
import { RECIPES_FINISHED_HREF, RECIPES_FINISHED_TITLE } from '@/features/recipes/paths';
import { PRODUCT_RECIPE_ERROR } from '@/features/recipes/text';
import { useFinishedRecipes } from '@/features/recipes/use-finished-recipes';
import { fieldClassName, primaryButtonClassName } from '@/features/sales/fields';
import { IconArrowLeft, IconCheck } from '@/features/shell/Icons';
import { PageFrame } from '@/features/shell/PageFrame';

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
  const [drafts, setDrafts] = useState<Record<string, DerivativeLineDraft>>(() => draftsFromLines(product.lines));
  const [outputDraft, setOutputDraft] = useState(() => formatQuantityDraft(product.outputKilogramThousandths));
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

    const lines = parsedLines();
    if (!lines) {
      return;
    }

    const rejection = journal.updateRecipe(product.id, lines, outputKilogramThousandths);
    if (rejection) {
      setSaveError(PRODUCT_RECIPE_ERROR[rejection]);
      return;
    }

    router.replace(RECIPES_FINISHED_HREF);
  }

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
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start gap-4">
          {!hasCandidates ? (
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
              <p className="text-sm text-muted">Название</p>
              <p className="mt-2 text-base text-ink">{product.name}</p>
            </div>

            <div>
              <p className="text-sm text-muted">Склад</p>
              <p className="mt-2 text-base text-ink">{warehouseLabel(product.warehouseId)}</p>
            </div>

            <div>
              <label htmlFor={outputFieldId} className="text-sm text-muted">
                Рассчитан на, кг
              </label>
              <input
                id={outputFieldId}
                value={outputDraft}
                onChange={(event) => setOutputDraft(event.target.value)}
                className={`mt-2 ${fieldClassName}`}
                inputMode="decimal"
                autoComplete="off"
              />
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
