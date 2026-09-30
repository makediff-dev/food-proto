import { activeRecipeFor } from "@/domain/materials";
import {
  isDeletionMark,
  isMonthKey,
  isOccurredOn,
  MAX_ID_LENGTH,
  MAX_LABEL_LENGTH,
  MAX_VOLUME_PIECES,
  type Derivative,
  type MaterialUnit,
  type ProductionFact,
  type ProductionFactOutput,
  type ProductionFactUse,
  type PrototypeDocument,
  type RecipeComponentKind,
  type RecipeLine,
} from "@/domain/document";
import {
  plannedQuantityCost,
  productionPlan,
  recipeBatch,
  recipeGap,
  scaleRecipeQuantity,
  type ProductionKind,
  type ProductionRecipeGap,
} from "@/domain/production-plan";
import { daysInMonth } from "@/domain/sales-plan";
import { amountPair, type KopeckPair } from "@/domain/stock";
import { MAX_WEIGHT_GRAMS } from "@/domain/units";

const ZERO = BigInt(0);
const TWO = BigInt(2);

export type FactRejection =
  | "date"
  | "date-taken"
  | "note"
  | "missing"
  | "position"
  | "quantity"
  | "duplicate"
  | "recipe"
  | "use";

export interface FactHeader {
  occurredOn: string;
  note: string;
}

export interface FactUseDraft {
  id: string;
  kind: RecipeComponentKind;
  refId: string;
  quantity: number;
}

export interface FactOutputDraft {
  id: string;
  refId: string;
  quantity: number;
  uses: FactUseDraft[];
}

export interface FactEditorUse {
  storedId: string | null;
  kind: RecipeComponentKind;
  refId: string;
  name: string;
  unit: MaterialUnit;
  deleted: boolean;
  inRecipe: boolean;
  quantity: number | null;
  norm: number | null;
  cost: KopeckPair | null;
  normCost: KopeckPair | null;
}

export interface FactEditorOutput {
  name: string;
  kind: "product" | "derivative";
  unit: MaterialUnit;
  workshopId: string;
  workshopName: string;
  deleted: boolean;
  gap: ProductionRecipeGap | null;
  uses: FactEditorUse[];
  actualCost: KopeckPair | null;
  normCost: KopeckPair | null;
}

export interface FactUseTemplateLine {
  kind: RecipeComponentKind;
  refId: string;
  name: string;
  unit: MaterialUnit;
  deleted: boolean;
  norm: number | null;
}

export interface FactUseTemplate {
  gap: ProductionRecipeGap | null;
  name: string;
  kind: "product" | "derivative";
  unit: MaterialUnit;
  lines: FactUseTemplateLine[];
}

export interface FactContribution {
  factId: string;
  occurredOn: string;
  quantity: number;
}

export interface FactComparisonRow {
  id: string;
  name: string;
  kind: ProductionKind;
  deleted: boolean;
  placeId: string;
  placeName: string;
  unit: MaterialUnit;
  planQuantity: number | null;
  factQuantity: number;
  deviation: number | null;
  /** Десятые доли процента: 1000 — это 100,0 %. Нет плана или план нулевой — `null`. */
  shareTenths: number | null;
  planCost: KopeckPair | null;
  factCost: KopeckPair | null;
  days: FactContribution[];
}

export interface FactComparisonTotals {
  planProductPieces: number | null;
  factProductPieces: number | null;
  planDerivativeGrams: number | null;
  factDerivativeGrams: number | null;
  planMaterialGrams: number | null;
  factMaterialGrams: number | null;
  planMaterialPieces: number | null;
  factMaterialPieces: number | null;
  planMaterialCost: KopeckPair | null;
  factMaterialCost: KopeckPair | null;
  recordedDays: number;
  calendarDays: number;
}

export interface FactComparison {
  planStatus: "missing-plan" | "empty-volume" | "ready";
  planId: string | null;
  outputs: FactComparisonRow[];
  inputs: FactComparisonRow[];
  totals: FactComparisonTotals;
}

interface ResolvedUse {
  name: string;
  unit: MaterialUnit;
  deleted: boolean;
}

interface MoneyBucket {
  quantity: number;
  cost: KopeckPair | null;
  failed: boolean;
  days: Map<string, FactContribution>;
}

function isEntityId(value: string): boolean {
  return value.length > 0 && value.length <= MAX_ID_LENGTH && value === value.trim();
}

function roundHalfUp(numerator: bigint, denominator: bigint): number | null {
  if (denominator <= ZERO || numerator < ZERO) {
    return null;
  }

  const rounded = (numerator + denominator / TWO) / denominator;
  if (rounded > BigInt(Number.MAX_SAFE_INTEGER)) {
    return null;
  }

  return Number(rounded);
}

function addQuantity(current: number, extra: number): number | null {
  return roundHalfUp(BigInt(current) + BigInt(extra), BigInt(1));
}

function sumQuantities(values: readonly number[]): number | null {
  let total = BigInt(0);
  for (const value of values) {
    total += BigInt(value);
  }

  if (total > BigInt(Number.MAX_SAFE_INTEGER)) {
    return null;
  }

  return Number(total);
}

function sumMoney(costs: readonly KopeckPair[]): KopeckPair | null {
  let withVat = BigInt(0);
  let exVat = BigInt(0);
  for (const cost of costs) {
    withVat += BigInt(cost.withVatKopecks);
    exVat += BigInt(cost.exVatKopecks);
  }

  if (
    withVat > BigInt(Number.MAX_SAFE_INTEGER) ||
    exVat > BigInt(Number.MAX_SAFE_INTEGER)
  ) {
    return null;
  }

  return { withVatKopecks: Number(withVat), exVatKopecks: Number(exVat) };
}

function addMoney(
  current: KopeckPair | null,
  extra: KopeckPair | null,
): KopeckPair | null {
  if (!current || !extra) {
    return null;
  }

  return sumMoney([current, extra]);
}

function placeName(
  places: readonly { id: string; name: string }[],
  id: string,
  fallback: string,
): string {
  return places.find((item) => item.id === id)?.name ?? fallback;
}

function ownerOf(document: PrototypeDocument, id: string): Derivative | null {
  return document.derivatives.find((item) => item.id === id) ?? null;
}

function isOutputQuantity(owner: Derivative, quantity: number): boolean {
  const max = owner.isFinalProduct ? MAX_VOLUME_PIECES : MAX_WEIGHT_GRAMS;
  return Number.isInteger(quantity) && quantity >= 1 && quantity <= max;
}

function isUseQuantity(quantity: number): boolean {
  return Number.isInteger(quantity) && quantity >= 0 && quantity <= MAX_WEIGHT_GRAMS;
}

function activeRecipeLine(
  document: PrototypeDocument,
  ownerId: string,
  kind: RecipeComponentKind,
  refId: string,
): RecipeLine | null {
  const recipe = activeRecipeFor(document, ownerId);
  if (!recipe) {
    return null;
  }

  return recipe.lines.find((line) => line.kind === kind && line.refId === refId) ?? null;
}

function resolveUse(
  document: PrototypeDocument,
  kind: RecipeComponentKind,
  refId: string,
): ResolvedUse | null {
  if (kind === "material") {
    const material = document.materials.find((item) => item.id === refId);
    if (!material) {
      return null;
    }

    return {
      name: material.name,
      unit: material.unit,
      deleted: material.deletedAt !== null,
    };
  }

  const derivative = ownerOf(document, refId);
  if (!derivative || derivative.isFinalProduct) {
    return null;
  }

  return {
    name: derivative.name,
    unit: "kg",
    deleted: derivative.deletedAt !== null,
  };
}

/** Закупочная сумма сырья, `DSM Meat!J8`, или плановая себестоимость производной. */
function ingredientCost(
  document: PrototypeDocument,
  kind: RecipeComponentKind,
  refId: string,
  quantity: number,
  unit: MaterialUnit,
): KopeckPair | null {
  if (kind === "material") {
    const material = document.materials.find((item) => item.id === refId);
    if (!material || material.unit !== unit) {
      return null;
    }

    return amountPair(quantity, unit, material.priceWithVatKopecks, material.vatPercent);
  }

  return plannedQuantityCost(document, refId, quantity, "kg");
}

function normQuantity(
  document: PrototypeDocument,
  ownerId: string,
  outputQuantity: number,
  line: RecipeLine,
): number | null {
  const recipe = activeRecipeFor(document, ownerId);
  if (!recipe) {
    return null;
  }

  return scaleRecipeQuantity(line.quantityGrams, outputQuantity, recipeBatch(recipe));
}

export function activeProductionFacts(document: PrototypeDocument): ProductionFact[] {
  return document.productionFacts.filter((item) => item.deletedAt === null);
}

export function deletedProductionFacts(document: PrototypeDocument): ProductionFact[] {
  return document.productionFacts.filter((item) => item.deletedAt !== null);
}

export function productionFactsInMonth(
  document: PrototypeDocument,
  month: string,
  deleted: boolean,
): ProductionFact[] {
  return document.productionFacts.filter(
    (item) =>
      (item.deletedAt !== null) === deleted && item.occurredOn.startsWith(`${month}-`),
  );
}

export function activeFactOnDate(
  document: PrototypeDocument,
  occurredOn: string,
): ProductionFact | null {
  return (
    document.productionFacts.find(
      (item) => item.deletedAt === null && item.occurredOn === occurredOn,
    ) ?? null
  );
}

export function factHeaderRejection(
  document: PrototypeDocument,
  draft: FactHeader,
  current: ProductionFact | null,
): FactRejection | null {
  if (!isOccurredOn(draft.occurredOn)) {
    return "date";
  }

  if (draft.note.length > MAX_LABEL_LENGTH) {
    return "note";
  }

  const taken = document.productionFacts.some(
    (item) =>
      item.deletedAt === null &&
      item.occurredOn === draft.occurredOn &&
      item.id !== current?.id,
  );
  if (taken) {
    return "date-taken";
  }

  return null;
}

export function addProductionFact(
  document: PrototypeDocument,
  id: string,
  draft: FactHeader,
): PrototypeDocument {
  if (!isEntityId(id) || document.productionFacts.some((item) => item.id === id)) {
    return document;
  }

  if (factHeaderRejection(document, draft, null)) {
    return document;
  }

  return {
    ...document,
    productionFacts: [
      ...document.productionFacts,
      {
        id,
        occurredOn: draft.occurredOn,
        note: draft.note,
        outputs: [],
        deletedAt: null,
      },
    ],
  };
}

export function updateProductionFact(
  document: PrototypeDocument,
  id: string,
  draft: FactHeader,
): PrototypeDocument {
  const current = document.productionFacts.find((item) => item.id === id);
  if (!current || current.deletedAt !== null) {
    return document;
  }

  if (factHeaderRejection(document, draft, current)) {
    return document;
  }

  if (current.occurredOn === draft.occurredOn && current.note === draft.note) {
    return document;
  }

  return {
    ...document,
    productionFacts: document.productionFacts.map((item) =>
      item.id === id ? { ...item, occurredOn: draft.occurredOn, note: draft.note } : item,
    ),
  };
}

export function deleteProductionFact(
  document: PrototypeDocument,
  id: string,
  deletedAt: string,
): PrototypeDocument {
  if (!isDeletionMark(deletedAt)) {
    return document;
  }

  const current = document.productionFacts.find(
    (item) => item.id === id && item.deletedAt === null,
  );
  if (!current) {
    return document;
  }

  return {
    ...document,
    productionFacts: document.productionFacts.map((item) =>
      item.id === id ? { ...item, deletedAt } : item,
    ),
  };
}

export function restoreProductionFact(
  document: PrototypeDocument,
  id: string,
): PrototypeDocument {
  const current = document.productionFacts.find(
    (item) => item.id === id && item.deletedAt !== null,
  );
  if (!current || activeFactOnDate(document, current.occurredOn)) {
    return document;
  }

  return {
    ...document,
    productionFacts: document.productionFacts.map((item) =>
      item.id === id ? { ...item, deletedAt: null } : item,
    ),
  };
}

function findOpenFact(
  document: PrototypeDocument,
  factId: string,
): ProductionFact | null {
  return (
    document.productionFacts.find(
      (item) => item.id === factId && item.deletedAt === null,
    ) ?? null
  );
}

function replaceFact(
  document: PrototypeDocument,
  factId: string,
  recipe: (fact: ProductionFact) => ProductionFact,
): PrototypeDocument {
  return {
    ...document,
    productionFacts: document.productionFacts.map((item) =>
      item.id === factId ? recipe(item) : item,
    ),
  };
}

function usesRejection(
  document: PrototypeDocument,
  ownerId: string,
  previous: readonly ProductionFactUse[],
  drafts: readonly FactUseDraft[],
): FactRejection | null {
  const gap = recipeGap(document, ownerId);
  const seenIds = new Set<string>();
  const seenRefs = new Set<string>();

  for (const draft of drafts) {
    if (!isEntityId(draft.id)) {
      return "missing";
    }

    const key = `${draft.kind}:${draft.refId}`;
    if (seenIds.has(draft.id) || seenRefs.has(key)) {
      return "duplicate";
    }

    seenIds.add(draft.id);
    seenRefs.add(key);

    if (!resolveUse(document, draft.kind, draft.refId)) {
      return "use";
    }

    if (!isUseQuantity(draft.quantity)) {
      return "quantity";
    }

    const inRecipe =
      gap === null && activeRecipeLine(document, ownerId, draft.kind, draft.refId);
    const stored = previous.some(
      (item) => item.kind === draft.kind && item.refId === draft.refId,
    );
    if (!inRecipe && !stored) {
      return "recipe";
    }
  }

  if (gap === null) {
    const recipe = activeRecipeFor(document, ownerId);
    for (const line of recipe?.lines ?? []) {
      if (!seenRefs.has(`${line.kind}:${line.refId}`)) {
        return "recipe";
      }
    }
  }

  for (const stored of previous) {
    const stillInRecipe =
      gap === null &&
      activeRecipeLine(document, ownerId, stored.kind, stored.refId) !== null;
    if (!stillInRecipe && !seenRefs.has(`${stored.kind}:${stored.refId}`)) {
      return "recipe";
    }
  }

  return null;
}

export function factOutputRejection(
  document: PrototypeDocument,
  factId: string,
  draft: FactOutputDraft,
): FactRejection | null {
  const fact = findOpenFact(document, factId);
  if (!fact) {
    return "missing";
  }

  if (!isEntityId(draft.id) || fact.outputs.some((item) => item.id === draft.id)) {
    return "duplicate";
  }

  const owner = ownerOf(document, draft.refId);
  if (!owner || owner.deletedAt !== null) {
    return "position";
  }

  if (fact.outputs.some((item) => item.refId === draft.refId)) {
    return "duplicate";
  }

  if (!isOutputQuantity(owner, draft.quantity)) {
    return "quantity";
  }

  return usesRejection(document, owner.id, [], draft.uses);
}

export function addProductionFactOutput(
  document: PrototypeDocument,
  factId: string,
  draft: FactOutputDraft,
): PrototypeDocument {
  if (factOutputRejection(document, factId, draft)) {
    return document;
  }

  return replaceFact(document, factId, (fact) => ({
    ...fact,
    outputs: [
      ...fact.outputs,
      {
        id: draft.id,
        refId: draft.refId,
        quantity: draft.quantity,
        uses: draft.uses.map((item) => ({ ...item })),
      },
    ],
  }));
}

export function setProductionFactOutputQuantity(
  document: PrototypeDocument,
  factId: string,
  outputId: string,
  quantity: number,
): PrototypeDocument {
  const fact = findOpenFact(document, factId);
  const output = fact?.outputs.find((item) => item.id === outputId);
  const owner = output ? ownerOf(document, output.refId) : null;
  if (!fact || !output || !owner || !isOutputQuantity(owner, quantity)) {
    return document;
  }

  if (output.quantity === quantity) {
    return document;
  }

  return replaceFact(document, factId, (current) => ({
    ...current,
    outputs: current.outputs.map((item) =>
      item.id === outputId ? { ...item, quantity } : item,
    ),
  }));
}

export function setProductionFactOutputUses(
  document: PrototypeDocument,
  factId: string,
  outputId: string,
  uses: readonly FactUseDraft[],
): PrototypeDocument {
  const fact = findOpenFact(document, factId);
  const output = fact?.outputs.find((item) => item.id === outputId);
  if (!fact || !output) {
    return document;
  }

  if (usesRejection(document, output.refId, output.uses, uses)) {
    return document;
  }

  const same =
    output.uses.length === uses.length &&
    output.uses.every((item, index) => {
      const next = uses[index];
      return (
        next !== undefined &&
        item.id === next.id &&
        item.kind === next.kind &&
        item.refId === next.refId &&
        item.quantity === next.quantity
      );
    });
  if (same) {
    return document;
  }

  return replaceFact(document, factId, (current) => ({
    ...current,
    outputs: current.outputs.map((item) =>
      item.id === outputId ? { ...item, uses: uses.map((use) => ({ ...use })) } : item,
    ),
  }));
}

export function upsertProductionFactUse(
  document: PrototypeDocument,
  factId: string,
  outputId: string,
  draft: FactUseDraft,
): PrototypeDocument {
  const fact = findOpenFact(document, factId);
  const output = fact?.outputs.find((item) => item.id === outputId);
  if (!fact || !output || !isEntityId(draft.id) || !isUseQuantity(draft.quantity)) {
    return document;
  }

  if (!resolveUse(document, draft.kind, draft.refId)) {
    return document;
  }

  const gap = recipeGap(document, output.refId);
  const inRecipe =
    gap === null &&
    activeRecipeLine(document, output.refId, draft.kind, draft.refId) !== null;
  const existing = output.uses.find(
    (item) => item.kind === draft.kind && item.refId === draft.refId,
  );
  if (!inRecipe && !existing) {
    return document;
  }

  if (existing) {
    if (existing.quantity === draft.quantity) {
      return document;
    }

    return replaceFact(document, factId, (current) => ({
      ...current,
      outputs: current.outputs.map((item) =>
        item.id === outputId
          ? {
              ...item,
              uses: item.uses.map((use) =>
                use.id === existing.id ? { ...use, quantity: draft.quantity } : use,
              ),
            }
          : item,
      ),
    }));
  }

  if (output.uses.some((item) => item.id === draft.id)) {
    return document;
  }

  return replaceFact(document, factId, (current) => ({
    ...current,
    outputs: current.outputs.map((item) =>
      item.id === outputId ? { ...item, uses: [...item.uses, { ...draft }] } : item,
    ),
  }));
}

export function removeProductionFactOutput(
  document: PrototypeDocument,
  factId: string,
  outputId: string,
): PrototypeDocument {
  const fact = findOpenFact(document, factId);
  if (!fact || !fact.outputs.some((item) => item.id === outputId)) {
    return document;
  }

  return replaceFact(document, factId, (current) => ({
    ...current,
    outputs: current.outputs.filter((item) => item.id !== outputId),
  }));
}

export function outputQuantityRejection(
  document: PrototypeDocument,
  factId: string,
  outputId: string,
  quantity: number,
): FactRejection | null {
  const fact = findOpenFact(document, factId);
  const output = fact?.outputs.find((item) => item.id === outputId);
  const owner = output ? ownerOf(document, output.refId) : null;
  if (!fact || !output || !owner) {
    return "missing";
  }

  if (!isOutputQuantity(owner, quantity)) {
    return "quantity";
  }

  return null;
}

export function factUseRejection(
  document: PrototypeDocument,
  factId: string,
  outputId: string,
  draft: FactUseDraft,
): FactRejection | null {
  const fact = findOpenFact(document, factId);
  const output = fact?.outputs.find((item) => item.id === outputId);
  if (!fact || !output) {
    return "missing";
  }

  if (!isEntityId(draft.id)) {
    return "missing";
  }

  if (!isUseQuantity(draft.quantity)) {
    return "quantity";
  }

  if (!resolveUse(document, draft.kind, draft.refId)) {
    return "use";
  }

  const gap = recipeGap(document, output.refId);
  const inRecipe =
    gap === null &&
    activeRecipeLine(document, output.refId, draft.kind, draft.refId) !== null;
  const existing = output.uses.find(
    (item) => item.kind === draft.kind && item.refId === draft.refId,
  );
  if (!inRecipe && !existing) {
    return "recipe";
  }

  if (!existing && output.uses.some((item) => item.id === draft.id)) {
    return "duplicate";
  }

  return null;
}

export function factUsesRejection(
  document: PrototypeDocument,
  factId: string,
  outputId: string,
  uses: readonly FactUseDraft[],
): FactRejection | null {
  const fact = findOpenFact(document, factId);
  const output = fact?.outputs.find((item) => item.id === outputId);
  if (!fact || !output) {
    return "missing";
  }

  return usesRejection(document, output.refId, output.uses, uses);
}

function editorUse(
  document: PrototypeDocument,
  ownerId: string,
  outputQuantity: number,
  line: RecipeLine | null,
  stored: ProductionFactUse | null,
  resolved: ResolvedUse,
  inRecipe: boolean,
): FactEditorUse {
  const norm =
    inRecipe && line ? normQuantity(document, ownerId, outputQuantity, line) : null;
  const quantity = stored?.quantity ?? null;

  return {
    storedId: stored?.id ?? null,
    kind: stored?.kind ?? line?.kind ?? "material",
    refId: stored?.refId ?? line?.refId ?? "",
    name: resolved.name,
    unit: resolved.unit,
    deleted: resolved.deleted,
    inRecipe,
    quantity,
    norm,
    cost:
      quantity === null
        ? null
        : ingredientCost(
            document,
            resolvedKind(stored, line),
            resolvedRef(stored, line),
            quantity,
            resolved.unit,
          ),
    normCost:
      norm === null
        ? null
        : ingredientCost(
            document,
            resolvedKind(stored, line),
            resolvedRef(stored, line),
            norm,
            resolved.unit,
          ),
  };
}

function resolvedKind(
  stored: ProductionFactUse | null,
  line: RecipeLine | null,
): RecipeComponentKind {
  return stored?.kind ?? line?.kind ?? "material";
}

function resolvedRef(stored: ProductionFactUse | null, line: RecipeLine | null): string {
  return stored?.refId ?? line?.refId ?? "";
}

function costOfUses(
  uses: readonly FactEditorUse[],
  field: "cost" | "normCost",
): KopeckPair | null {
  const costs: KopeckPair[] = [];
  for (const use of uses) {
    if (field === "normCost" && !use.inRecipe) {
      continue;
    }

    if (field === "cost" && use.inRecipe && use.quantity === null) {
      return null;
    }

    const cost = use[field];
    if (field === "normCost" && use.inRecipe && cost === null) {
      return null;
    }

    if (field === "cost" && cost === null && use.quantity !== null) {
      return null;
    }

    if (cost) {
      costs.push(cost);
    }
  }

  return sumMoney(costs);
}

export function factEditorOutput(
  document: PrototypeDocument,
  output: ProductionFactOutput,
): FactEditorOutput {
  const owner = ownerOf(document, output.refId);
  const product = owner?.isFinalProduct ?? true;
  const gap = owner ? recipeGap(document, owner.id) : "broken-link";
  const recipe = gap === null && owner ? activeRecipeFor(document, owner.id) : null;
  const uses: FactEditorUse[] = [];
  const covered = new Set<string>();

  for (const line of recipe?.lines ?? []) {
    const resolved = resolveUse(document, line.kind, line.refId);
    if (!resolved) {
      continue;
    }

    const stored =
      output.uses.find((item) => item.kind === line.kind && item.refId === line.refId) ??
      null;
    covered.add(`${line.kind}:${line.refId}`);
    uses.push(
      editorUse(document, output.refId, output.quantity, line, stored, resolved, true),
    );
  }

  for (const stored of output.uses) {
    const key = `${stored.kind}:${stored.refId}`;
    if (covered.has(key)) {
      continue;
    }

    const resolved = resolveUse(document, stored.kind, stored.refId);
    if (!resolved) {
      continue;
    }

    uses.push(
      editorUse(document, output.refId, output.quantity, null, stored, resolved, false),
    );
  }

  return {
    name: owner?.name ?? "Позиция",
    kind: product ? "product" : "derivative",
    unit: product ? "piece" : "kg",
    workshopId: owner?.workshopId ?? "",
    workshopName: placeName(document.workshops, owner?.workshopId ?? "", "Цех"),
    deleted: owner !== null && owner.deletedAt !== null,
    gap,
    uses,
    actualCost: costOfUses(uses, "cost"),
    normCost: gap === null ? costOfUses(uses, "normCost") : null,
  };
}

export function factUseTemplate(
  document: PrototypeDocument,
  refId: string,
  outputQuantity: number | null,
): FactUseTemplate | null {
  const owner = ownerOf(document, refId);
  if (!owner || owner.deletedAt !== null) {
    return null;
  }

  const gap = recipeGap(document, owner.id);
  const recipe = gap === null ? activeRecipeFor(document, owner.id) : null;
  const lines: FactUseTemplateLine[] = [];

  for (const line of recipe?.lines ?? []) {
    const resolved = resolveUse(document, line.kind, line.refId);
    if (!resolved) {
      continue;
    }

    lines.push({
      kind: line.kind,
      refId: line.refId,
      name: resolved.name,
      unit: resolved.unit,
      deleted: resolved.deleted,
      norm:
        outputQuantity === null
          ? null
          : normQuantity(document, owner.id, outputQuantity, line),
    });
  }

  return {
    gap,
    name: owner.name,
    kind: owner.isFinalProduct ? "product" : "derivative",
    unit: owner.isFinalProduct ? "piece" : "kg",
    lines,
  };
}

function emptyBucket(): MoneyBucket {
  return {
    quantity: 0,
    cost: { withVatKopecks: 0, exVatKopecks: 0 },
    failed: false,
    days: new Map(),
  };
}

function pushBucket(
  bucket: MoneyBucket,
  quantity: number,
  cost: KopeckPair | null,
  factId: string,
  occurredOn: string,
): void {
  const nextQuantity = addQuantity(bucket.quantity, quantity);
  if (nextQuantity === null) {
    bucket.failed = true;
  } else {
    bucket.quantity = nextQuantity;
  }

  if (bucket.cost !== null) {
    if (cost === null) {
      bucket.cost = null;
      bucket.failed = true;
    } else {
      bucket.cost = addMoney(bucket.cost, cost);
      if (!bucket.cost) {
        bucket.failed = true;
      }
    }
  }

  const day = bucket.days.get(factId) ?? { factId, occurredOn, quantity: 0 };
  const dayQuantity = addQuantity(day.quantity, quantity);
  if (dayQuantity === null) {
    bucket.failed = true;
  } else {
    day.quantity = dayQuantity;
    bucket.days.set(factId, day);
  }
}

function dayList(bucket: MoneyBucket): FactContribution[] {
  return [...bucket.days.values()].sort((left, right) =>
    left.occurredOn < right.occurredOn ? -1 : left.occurredOn > right.occurredOn ? 1 : 0,
  );
}

function shareTenths(fact: number, plan: number | null): number | null {
  if (plan === null || plan <= 0) {
    return null;
  }

  return roundHalfUp(BigInt(fact) * BigInt(1000), BigInt(plan));
}

function byName(left: { name: string }, right: { name: string }): number {
  return left.name.localeCompare(right.name, "ru");
}

/**
 * Сводка факта месяца против плана выпуска и расхода.
 * Удалённые дни не входят. Числа в документ не пишутся.
 */
export function productionFactComparison(
  document: PrototypeDocument,
  month: string,
): FactComparison {
  const facts = isMonthKey(month) ? productionFactsInMonth(document, month, false) : [];
  const plan = productionPlan(document, month);
  const outputBuckets = new Map<string, MoneyBucket>();
  const inputBuckets = new Map<string, MoneyBucket>();
  const materialCosts: KopeckPair[] = [];
  let materialCostFailed = false;

  for (const fact of facts) {
    for (const output of fact.outputs) {
      const bucket = outputBuckets.get(output.refId) ?? emptyBucket();
      pushBucket(bucket, output.quantity, zeroMoney(), fact.id, fact.occurredOn);
      outputBuckets.set(output.refId, bucket);

      for (const use of output.uses) {
        const resolved = resolveUse(document, use.kind, use.refId);
        if (!resolved) {
          continue;
        }

        const key = `${use.kind}:${use.refId}`;
        const spent = inputBuckets.get(key) ?? emptyBucket();
        if (use.quantity === 0) {
          continue;
        }

        const lineCost = ingredientCost(
          document,
          use.kind,
          use.refId,
          use.quantity,
          resolved.unit,
        );
        pushBucket(spent, use.quantity, lineCost, fact.id, fact.occurredOn);
        inputBuckets.set(key, spent);
        if (use.kind === "material") {
          if (!lineCost) {
            materialCostFailed = true;
          } else {
            materialCosts.push(lineCost);
          }
        }
      }
    }
  }

  const outputs: FactComparisonRow[] = [];
  const coveredOutputs = new Set<string>();
  if (plan.status === "ready") {
    for (const row of plan.outputs) {
      coveredOutputs.add(row.id);
      const bucket = outputBuckets.get(row.id);
      const factQuantity = bucket?.quantity ?? 0;
      outputs.push({
        id: row.id,
        name: row.name,
        kind: row.kind,
        deleted: row.deleted,
        placeId: row.workshopId,
        placeName: row.workshopName,
        unit: row.unit,
        planQuantity: row.quantity,
        factQuantity,
        deviation: factQuantity - row.quantity,
        shareTenths: shareTenths(factQuantity, row.quantity),
        planCost: row.cost,
        factCost: plannedQuantityCost(document, row.id, factQuantity, row.unit),
        days: bucket ? dayList(bucket) : [],
      });
    }
  }

  for (const [id, bucket] of outputBuckets) {
    if (coveredOutputs.has(id) || bucket.quantity <= 0) {
      continue;
    }

    const owner = ownerOf(document, id);
    const product = owner?.isFinalProduct ?? true;
    outputs.push({
      id,
      name: owner?.name ?? "Позиция",
      kind: product ? "product" : "derivative",
      deleted: owner !== null && owner.deletedAt !== null,
      placeId: owner?.workshopId ?? "",
      placeName: placeName(document.workshops, owner?.workshopId ?? "", "Цех"),
      unit: product ? "piece" : "kg",
      planQuantity: null,
      factQuantity: bucket.quantity,
      deviation: null,
      shareTenths: null,
      planCost: null,
      factCost: owner
        ? plannedQuantityCost(
            document,
            owner.id,
            bucket.quantity,
            product ? "piece" : "kg",
          )
        : null,
      days: dayList(bucket),
    });
  }

  const inputs: FactComparisonRow[] = [];
  const coveredInputs = new Set<string>();
  if (plan.status === "ready") {
    for (const row of plan.inputs) {
      const key = `${row.kind}:${row.id}`;
      coveredInputs.add(key);
      const bucket = inputBuckets.get(key);
      const factQuantity = bucket?.quantity ?? 0;
      inputs.push({
        id: row.id,
        name: row.name,
        kind: row.kind,
        deleted: row.deleted,
        placeId: row.warehouseId,
        placeName: row.warehouseName,
        unit: row.unit,
        planQuantity: row.quantity,
        factQuantity,
        deviation: factQuantity - row.quantity,
        shareTenths: shareTenths(factQuantity, row.quantity),
        planCost: row.cost,
        factCost:
          factQuantity === 0
            ? zeroMoney()
            : bucket && !bucket.failed
              ? bucket.cost
              : null,
        days: bucket ? dayList(bucket) : [],
      });
    }
  }

  for (const [key, bucket] of inputBuckets) {
    if (coveredInputs.has(key) || bucket.quantity <= 0) {
      continue;
    }

    const slash = key.indexOf(":");
    const kind = key.slice(0, slash) === "material" ? "material" : "derivative";
    const id = key.slice(slash + 1);
    const resolved = resolveUse(document, kind, id);
    if (!resolved) {
      continue;
    }

    const owner = kind === "derivative" ? ownerOf(document, id) : null;
    const material =
      kind === "material" ? document.materials.find((item) => item.id === id) : null;
    const placeId = material?.warehouseId ?? owner?.warehouseId ?? "";
    inputs.push({
      id,
      name: resolved.name,
      kind,
      deleted: resolved.deleted,
      placeId,
      placeName: placeName(
        document.warehouses,
        placeId,
        kind === "material" ? "Склад" : "Склад",
      ),
      unit: resolved.unit,
      planQuantity: null,
      factQuantity: bucket.quantity,
      deviation: null,
      shareTenths: null,
      planCost: null,
      factCost: bucket.failed ? null : bucket.cost,
      days: dayList(bucket),
    });
  }

  const factOutputs = outputs;
  const factMaterials = inputs.filter((row) => row.kind === "material");
  const ready = plan.status === "ready" ? plan : null;

  return {
    planStatus: plan.status,
    planId: plan.status === "missing-plan" ? null : plan.planId,
    outputs: factOutputs.sort(byName),
    inputs: inputs.sort(byName),
    totals: {
      planProductPieces: ready ? ready.totals.productPieces : null,
      factProductPieces: sumQuantities(
        factOutputs
          .filter((row) => row.kind === "product")
          .map((row) => row.factQuantity),
      ),
      planDerivativeGrams: ready ? ready.totals.derivativeGrams : null,
      factDerivativeGrams: sumQuantities(
        factOutputs
          .filter((row) => row.kind === "derivative")
          .map((row) => row.factQuantity),
      ),
      planMaterialGrams: ready ? ready.totals.materialGrams : null,
      factMaterialGrams: sumQuantities(
        factMaterials.filter((row) => row.unit === "kg").map((row) => row.factQuantity),
      ),
      planMaterialPieces: ready ? ready.totals.materialPieces : null,
      factMaterialPieces: sumQuantities(
        factMaterials
          .filter((row) => row.unit === "piece")
          .map((row) => row.factQuantity),
      ),
      planMaterialCost: ready ? ready.totals.materialCost : null,
      factMaterialCost: materialCostFailed ? null : sumMoney(materialCosts),
      recordedDays: facts.length,
      calendarDays: isMonthKey(month) ? daysInMonth(month) : 0,
    },
  };
}

function zeroMoney(): KopeckPair {
  return { withVatKopecks: 0, exVatKopecks: 0 };
}
