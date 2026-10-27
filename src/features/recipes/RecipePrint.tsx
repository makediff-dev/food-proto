'use client';

import {
  derivativesList,
  derivativeWorkshopById,
  outputPieceThousandthsOf,
  warehouseIdForWorkshop,
} from '@/domain/derivatives';
import type { Derivative, Material, Product, PrototypeDocument } from '@/domain/document';
import { MATERIAL_GROUPS, MATERIAL_WAREHOUSES } from '@/domain/document';
import { materialsList } from '@/domain/materials';
import { QUANTITY_SCALE } from '@/domain/quantity';
import {
  applyHeatTreatmentYield,
  gramsPerPieceThousandths,
  recipeComponentsKilogramThousandths,
} from '@/domain/recipe-yield';
import { formatQuantity, formatQuantityDraft, parseQuantityInput } from '@/features/materials/text';
import { componentDraftKey, type DerivativeLineDraft } from '@/features/recipes/DerivativeFormTable';
import { formatRecipeWeightGap } from '@/features/recipes/text';
import { IconPrint } from '@/features/shell/Icons';

const printButtonClassName =
  'inline-flex h-11 w-full items-center justify-center gap-2 border border-line bg-sheet px-3 text-sm text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';

export type RecipePrintLine = {
  id: string;
  name: string;
  quantity: string;
};

export type RecipePrintGroup = {
  id: string;
  name: string;
  lines: readonly RecipePrintLine[];
};

export type RecipePrintModel = {
  /** «производная» или «готовая продукция». */
  kindLabel: string;
  name: string;
  placeLabel: string;
  place: string;
  /** Килограммы партии. «—», если поле не разобралось. */
  batchKilograms: string;
  /** «1 000 шт · 65 г/шт». Нет — только килограммы. */
  batchPieces: string | null;
  /** Целый процент. Нет ячейки, если рецепт без термообработки. */
  heatTreatment: string | null;
  componentsKilograms: string;
  /** «−13 кг не хватает» / «+13 кг лишнее». Нет — сходится или закладка не разобралась. */
  weightGap: string | null;
  groups: readonly RecipePrintGroup[];
};

function lineFromDraft(
  key: string,
  name: string,
  unit: string,
  drafts: Readonly<Record<string, DerivativeLineDraft>>,
): RecipePrintLine | null {
  const quantity = parseQuantityInput(drafts[key]?.quantity ?? '', false);
  if (quantity === null || quantity <= 0) {
    return null;
  }
  return { id: key, name, quantity: formatQuantity(quantity, unit) };
}

/** Состав листа: группы как в таблице слева, только количество больше нуля. */
export function recipePrintGroups(
  materials: readonly Material[],
  derivatives: readonly Derivative[],
  drafts: Readonly<Record<string, DerivativeLineDraft>>,
): RecipePrintGroup[] {
  const groups: RecipePrintGroup[] = [];

  for (const group of MATERIAL_GROUPS) {
    const lines = materials
      .filter((item) => item.groupId === group.id)
      .sort((left, right) => left.name.localeCompare(right.name, 'ru'))
      .flatMap((material) => {
        const line = lineFromDraft(componentDraftKey('material', material.id), material.name, material.unit, drafts);
        return line ? [line] : [];
      });
    if (lines.length > 0) {
      groups.push({ id: group.id, name: group.name, lines });
    }
  }

  const derivativeLines = [...derivatives]
    .sort((left, right) => left.name.localeCompare(right.name, 'ru'))
    .flatMap((item) => {
      const line = lineFromDraft(componentDraftKey('derivative', item.id), item.name, item.unit, drafts);
      return line ? [line] : [];
    });
  if (derivativeLines.length > 0) {
    groups.push({ id: 'derivatives', name: 'Производные', lines: derivativeLines });
  }

  return groups;
}

export function formatPrintKilograms(draft: string): string {
  const kilograms = parseQuantityInput(draft, false);
  if (kilograms === null || kilograms < 0) {
    return '—';
  }
  return formatQuantity(kilograms, 'кг');
}

/** «1 000 шт · 65 г/шт». Пусто, если оба поля не разобрались. */
export function formatPrintPieces(piecesDraft: string, gramsDraft: string): string | null {
  const pieces = parseQuantityInput(piecesDraft, false);
  const grams = parseQuantityInput(gramsDraft, false);
  const parts: string[] = [];
  if (pieces !== null && pieces > 0) {
    parts.push(formatQuantity(pieces, 'шт'));
  }
  if (grams !== null && grams >= 0) {
    parts.push(formatQuantity(grams, 'г/шт'));
  }
  return parts.length > 0 ? parts.join(' · ') : null;
}

export function formatPrintPercent(draft: string): string {
  const trimmed = draft.trim();
  return trimmed === '' ? '—' : `${trimmed} %`;
}

function draftsFromSavedLines(
  lines: readonly { componentKind: 'material' | 'derivative'; componentId: string; quantity: number }[],
): Record<string, DerivativeLineDraft> {
  const drafts: Record<string, DerivativeLineDraft> = {};
  for (const line of lines) {
    drafts[componentDraftKey(line.componentKind, line.componentId)] = {
      quantity: formatQuantityDraft(line.quantity),
    };
  }
  return drafts;
}

function savedPiecesLabel(outputKilogramThousandths: number, pieceThousandths: number): string | null {
  if (pieceThousandths <= 0) {
    return null;
  }
  const grams = gramsPerPieceThousandths(outputKilogramThousandths, pieceThousandths);
  const pieces = formatQuantity(pieceThousandths, 'шт');
  return grams === null ? pieces : `${pieces} · ${formatQuantity(grams, 'г/шт')}`;
}

/** Лист по сохранённой производной — тот же, что кнопка на странице записи. */
export function derivativePrintModel(document: PrototypeDocument, derivative: Derivative): RecipePrintModel {
  const warehouseId = warehouseIdForWorkshop(derivative.workshopId);
  const pieces = derivative.unit === 'шт' ? (outputPieceThousandthsOf(derivative) ?? QUANTITY_SCALE) : null;
  const rawKilograms = recipeComponentsKilogramThousandths(document, derivative.lines);
  const componentsKilogramThousandths = applyHeatTreatmentYield(rawKilograms, derivative.heatTreatmentYieldPercent);
  return {
    kindLabel: 'производная',
    name: derivative.name,
    placeLabel: 'Цех',
    place: derivativeWorkshopById(derivative.workshopId).name,
    batchKilograms: formatQuantity(derivative.outputKilogramThousandths, 'кг'),
    batchPieces: pieces === null ? null : savedPiecesLabel(derivative.outputKilogramThousandths, pieces),
    heatTreatment: `${derivative.heatTreatmentYieldPercent} %`,
    componentsKilograms: formatQuantity(componentsKilogramThousandths, 'кг'),
    weightGap: formatRecipeWeightGap(derivative.outputKilogramThousandths, componentsKilogramThousandths),
    groups: recipePrintGroups(
      materialsList(document).filter((item) => item.warehouseId === warehouseId),
      derivativesList(document).filter((item) => warehouseIdForWorkshop(item.workshopId) === warehouseId),
      draftsFromSavedLines(derivative.lines),
    ),
  };
}

/** Лист по сохранённому рецепту готовой продукции. */
export function productPrintModel(document: PrototypeDocument, product: Product): RecipePrintModel {
  const pieces = product.outputPieceThousandths > 0 ? product.outputPieceThousandths : QUANTITY_SCALE;
  const componentsKilogramThousandths = recipeComponentsKilogramThousandths(document, product.lines);
  return {
    kindLabel: 'готовая продукция',
    name: product.name,
    placeLabel: 'Склад',
    place: MATERIAL_WAREHOUSES.find((item) => item.id === product.warehouseId)?.name ?? '',
    batchKilograms: formatQuantity(product.outputKilogramThousandths, 'кг'),
    batchPieces: savedPiecesLabel(product.outputKilogramThousandths, pieces),
    heatTreatment: null,
    componentsKilograms: formatQuantity(componentsKilogramThousandths, 'кг'),
    weightGap: formatRecipeWeightGap(product.outputKilogramThousandths, componentsKilogramThousandths),
    groups: recipePrintGroups(
      materialsList(document).filter((item) => item.warehouseId === product.warehouseId),
      derivativesList(document).filter((item) => warehouseIdForWorkshop(item.workshopId) === product.warehouseId),
      draftsFromSavedLines(product.lines),
    ),
  };
}

export function RecipePrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className={printButtonClassName}>
      <IconPrint />
      Печать
    </button>
  );
}

export function RecipePrintSheet({ model }: { model: RecipePrintModel }) {
  let running = 0;
  const blocks = model.groups.map((group) => {
    const startIndex = running;
    running += group.lines.length;
    return { group, startIndex };
  });

  return (
    <article className="recipe-print">
      <header>
        <p className="recipe-print__kicker">Рецептура · {model.kindLabel}</p>
        <h1 className="recipe-print__title">{model.name.trim() || '—'}</h1>
        <p className="recipe-print__place">
          <span className="recipe-print__place-label">{model.placeLabel}</span>
          {model.place || '—'}
        </p>
      </header>

      <div className="recipe-print__facts">
        <div className="recipe-print__fact">
          <p className="recipe-print__fact-label">Вес закладки</p>
          <p className="recipe-print__fact-value">{model.batchKilograms}</p>
          {model.batchPieces ? <p className="recipe-print__fact-note">{model.batchPieces}</p> : null}
        </div>
        {model.heatTreatment !== null ? (
          <div className="recipe-print__fact">
            <p className="recipe-print__fact-label">Выход после термообработки</p>
            <p className="recipe-print__fact-value">{model.heatTreatment}</p>
          </div>
        ) : null}
        <div className="recipe-print__fact">
          <p className="recipe-print__fact-label">Вес по компонентам</p>
          <p className="recipe-print__fact-value">{model.componentsKilograms}</p>
          {model.weightGap ? <p className="recipe-print__fact-note">{model.weightGap}</p> : null}
        </div>
      </div>

      {model.groups.length === 0 ? (
        <p className="recipe-print__empty">Состав не задан.</p>
      ) : (
        <table className="recipe-print__table">
          <thead>
            <tr>
              <th className="recipe-print__num" scope="col">
                №
              </th>
              <th scope="col">Наименование</th>
              <th className="recipe-print__qty" scope="col">
                Количество
              </th>
            </tr>
          </thead>
          <tbody>
            {blocks.map(({ group, startIndex }) => (
              <GroupRows key={group.id} group={group} startIndex={startIndex} />
            ))}
          </tbody>
        </table>
      )}
    </article>
  );
}

function GroupRows({ group, startIndex }: { group: RecipePrintGroup; startIndex: number }) {
  return (
    <>
      <tr className="recipe-print__group">
        <td colSpan={3}>{group.name}</td>
      </tr>
      {group.lines.map((line, offset) => (
        <tr key={line.id}>
          <td className="recipe-print__num">{startIndex + offset + 1}</td>
          <td>{line.name}</td>
          <td className="recipe-print__qty">{line.quantity}</td>
        </tr>
      ))}
    </>
  );
}
