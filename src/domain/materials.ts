import {
  isDeletionMark,
  MAX_ID_LENGTH,
  MAX_LABEL_LENGTH,
  MAX_VAT_PERCENT,
  MAX_YIELD_PERCENT,
  MIN_VAT_PERCENT,
  MIN_YIELD_PERCENT,
  type DeletableRecord,
  type Derivative,
  type MaterialUnit,
  type PrototypeDocument,
  type RawMaterial,
  type RecipeCard,
  type RecipeComponentKind,
  type RecipeLine,
} from "@/domain/document";
import { normalizeName, rejectName, type NameRejection } from "@/domain/directory";
import { MAX_PRICE_PER_KILOGRAM_KOPECKS, MAX_WEIGHT_GRAMS } from "@/domain/units";

/** 100 кг готовой производной. Сырьё на эту партию зависит от выхода. */
export const FINISHED_BATCH_GRAMS = 100_000;

/**
 * Сколько граммов сырья нужно на 100 кг готового продукта.
 * Выход 80% — 125 кг: 100 / 0,8. Граммы округляются половиной вверх.
 */
export function inputGramsForFinishedBatch(yieldPercent: number): number {
  const numerator = BigInt(FINISHED_BATCH_GRAMS) * BigInt(100);
  const denominator = BigInt(yieldPercent);
  return Number((numerator + denominator / BigInt(2)) / denominator);
}

export type FieldRejection =
  | NameRejection
  | "brand"
  | "warehouse"
  | "workshop"
  | "price"
  | "vat"
  | "yield"
  | "quantity"
  | "component"
  | "cycle"
  | "final-in-recipe"
  | "self"
  | "duplicate-line"
  | "recipe-exists"
  | "used-as-component"
  | "batch"
  | "piece"
  | "unit"
  | "stock"
  | "stock-range"
  | "missing";

export function compositionGrams(lines: readonly { quantityGrams: number }[]): number {
  return lines.reduce((sum, line) => sum + line.quantityGrams, 0);
}

export interface MaterialDraft {
  name: string;
  brand: string;
  warehouseId: string;
  unit: MaterialUnit;
  priceWithVatKopecks: number;
  vatPercent: number;
  /** Килограммы — граммы, штуки — штуки. */
  minNormStock: number;
  maxNormStock: number;
}

export interface DerivativeDraft {
  name: string;
  isFinalProduct: boolean;
  warehouseId: string;
  workshopId: string;
  /** НДС продажи. Есть только у конечного товара. */
  vatPercent?: number | null;
  /**
   * Выход, который запишется в карты, если производная перестаёт быть конечным товаром.
   * Пока флаг не меняется, карты не трогаем.
   */
  yieldPercent?: number | null;
}

export interface RecipeLineDraft {
  id: string;
  kind: RecipeComponentKind;
  refId: string;
  quantityGrams: number;
}

function isEntityId(value: string): boolean {
  return value.length > 0 && value.length <= MAX_ID_LENGTH && value === value.trim();
}

function isVat(value: number | null | undefined): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= MIN_VAT_PERCENT &&
    value <= MAX_VAT_PERCENT
  );
}

function isYield(value: number | null | undefined): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= MIN_YIELD_PERCENT &&
    value <= MAX_YIELD_PERCENT
  );
}

function isQuantity(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= MAX_WEIGHT_GRAMS;
}

export function activeMaterials(document: PrototypeDocument): RawMaterial[] {
  return document.materials.filter((item) => item.deletedAt === null);
}

export function deletedMaterials(document: PrototypeDocument): RawMaterial[] {
  return document.materials.filter((item) => item.deletedAt !== null);
}

export function activeDerivatives(document: PrototypeDocument): Derivative[] {
  return document.derivatives.filter((item) => item.deletedAt === null);
}

export function deletedDerivatives(document: PrototypeDocument): Derivative[] {
  return document.derivatives.filter((item) => item.deletedAt !== null);
}

export interface RecipeUsage {
  owner: Derivative;
  quantityGrams: number;
  /** Штуки на 1000 шт товара. Килограммы хранятся граммами. */
  piece: boolean;
}

/** Где позиция входит в рабочую рецептурную карту: при производстве чего её берут. */
export function recipeUsages(
  document: PrototypeDocument,
  kind: RecipeComponentKind,
  refId: string,
): RecipeUsage[] {
  const piece =
    kind === "material" &&
    document.materials.find((item) => item.id === refId)?.unit === "piece";
  const usages: RecipeUsage[] = [];

  for (const recipe of document.recipes) {
    if (recipe.deletedAt !== null) {
      continue;
    }

    const line = recipe.lines.find((item) => item.kind === kind && item.refId === refId);
    if (!line) {
      continue;
    }

    const owner = document.derivatives.find((item) => item.id === recipe.derivativeId);
    if (!owner) {
      continue;
    }

    usages.push({ owner, quantityGrams: line.quantityGrams, piece });
  }

  return usages;
}

export function activeRecipeFor(
  document: PrototypeDocument,
  derivativeId: string,
): RecipeCard | null {
  return (
    document.recipes.find(
      (recipe) => recipe.derivativeId === derivativeId && recipe.deletedAt === null,
    ) ?? null
  );
}

export function deletedRecipesFor(
  document: PrototypeDocument,
  derivativeId: string,
): RecipeCard[] {
  return document.recipes.filter(
    (recipe) => recipe.derivativeId === derivativeId && recipe.deletedAt !== null,
  );
}

function placeAccepted(
  places: readonly DeletableRecord[],
  id: string,
  previousId: string | null,
): boolean {
  const place = places.find((item) => item.id === id);
  if (!place) {
    return false;
  }

  return place.deletedAt === null || id === previousId;
}

export function materialDraftRejection(
  document: PrototypeDocument,
  draft: MaterialDraft,
  exceptId?: string,
): FieldRejection | null {
  const name = rejectName(draft.name, document.materials, exceptId);
  if (name) {
    return name;
  }

  if (draft.brand.trim().length > MAX_LABEL_LENGTH) {
    return "brand";
  }

  const current = exceptId
    ? document.materials.find((item) => item.id === exceptId)
    : undefined;
  if (
    !placeAccepted(document.warehouses, draft.warehouseId, current?.warehouseId ?? null)
  ) {
    return "warehouse";
  }

  if (
    !Number.isInteger(draft.priceWithVatKopecks) ||
    draft.priceWithVatKopecks < 0 ||
    draft.priceWithVatKopecks > MAX_PRICE_PER_KILOGRAM_KOPECKS
  ) {
    return "price";
  }

  if (
    !Number.isInteger(draft.vatPercent) ||
    draft.vatPercent < MIN_VAT_PERCENT ||
    draft.vatPercent > MAX_VAT_PERCENT
  ) {
    return "vat";
  }

  if (draft.unit !== "kg" && draft.unit !== "piece") {
    return "unit";
  }

  if (
    !Number.isInteger(draft.minNormStock) ||
    !Number.isInteger(draft.maxNormStock) ||
    draft.minNormStock < 0 ||
    draft.maxNormStock < 0 ||
    draft.minNormStock > MAX_WEIGHT_GRAMS ||
    draft.maxNormStock > MAX_WEIGHT_GRAMS
  ) {
    return "stock";
  }

  if (draft.minNormStock > draft.maxNormStock) {
    return "stock-range";
  }

  if (
    current &&
    draft.unit !== current.unit &&
    materialUnitIsLocked(document, current.id)
  ) {
    return "unit";
  }

  return null;
}

function materialUnitIsLocked(document: PrototypeDocument, materialId: string): boolean {
  if (
    document.recipes.some((recipe) =>
      recipe.lines.some((line) => line.kind === "material" && line.refId === materialId),
    )
  ) {
    return true;
  }

  return (
    document.deliveries.some((delivery) =>
      delivery.lines.some((line) => line.materialId === materialId),
    ) ||
    document.writeOffs.some((writeOff) =>
      writeOff.lines.some(
        (line) => line.kind === "material" && line.refId === materialId,
      ),
    )
  );
}

function materialFromDraft(id: string, draft: MaterialDraft): RawMaterial {
  return {
    id,
    name: normalizeName(draft.name),
    brand: draft.brand.trim(),
    warehouseId: draft.warehouseId,
    unit: draft.unit,
    priceWithVatKopecks: draft.priceWithVatKopecks,
    vatPercent: draft.vatPercent,
    minNormStock: draft.minNormStock,
    maxNormStock: draft.maxNormStock,
    deletedAt: null,
  };
}

function sameMaterial(current: RawMaterial, next: RawMaterial): boolean {
  return (
    current.name === next.name &&
    current.brand === next.brand &&
    current.warehouseId === next.warehouseId &&
    current.unit === next.unit &&
    current.priceWithVatKopecks === next.priceWithVatKopecks &&
    current.vatPercent === next.vatPercent &&
    current.minNormStock === next.minNormStock &&
    current.maxNormStock === next.maxNormStock
  );
}

export function addMaterial(
  document: PrototypeDocument,
  material: RawMaterial,
): PrototypeDocument {
  if (
    !isEntityId(material.id) ||
    document.materials.some((item) => item.id === material.id)
  ) {
    return document;
  }

  if (materialDraftRejection(document, material)) {
    return document;
  }

  return {
    ...document,
    materials: [...document.materials, materialFromDraft(material.id, material)],
  };
}

export function updateMaterial(
  document: PrototypeDocument,
  id: string,
  draft: MaterialDraft,
): PrototypeDocument {
  const current = document.materials.find((item) => item.id === id);
  if (!current || materialDraftRejection(document, draft, id)) {
    return document;
  }

  const next = { ...materialFromDraft(id, draft), deletedAt: current.deletedAt };
  if (sameMaterial(current, next)) {
    return document;
  }

  return {
    ...document,
    materials: document.materials.map((item) => (item.id === id ? next : item)),
  };
}

export function deleteMaterial(
  document: PrototypeDocument,
  id: string,
  deletedAt: string,
): PrototypeDocument {
  if (!isDeletionMark(deletedAt)) {
    return document;
  }

  const current = document.materials.find(
    (item) => item.id === id && item.deletedAt === null,
  );
  if (!current) {
    return document;
  }

  return {
    ...document,
    materials: document.materials.map((item) =>
      item.id === id ? { ...item, deletedAt } : item,
    ),
  };
}

export function restoreMaterial(
  document: PrototypeDocument,
  id: string,
): PrototypeDocument {
  const current = document.materials.find(
    (item) => item.id === id && item.deletedAt !== null,
  );
  if (!current || rejectName(current.name, document.materials, id)) {
    return document;
  }

  return {
    ...document,
    materials: document.materials.map((item) =>
      item.id === id ? { ...item, deletedAt: null } : item,
    ),
  };
}

function derivativeReferenced(
  document: PrototypeDocument,
  derivativeId: string,
): boolean {
  return document.recipes.some((recipe) =>
    recipe.lines.some(
      (line) => line.kind === "derivative" && line.refId === derivativeId,
    ),
  );
}

export function derivativeDraftRejection(
  document: PrototypeDocument,
  draft: DerivativeDraft,
  exceptId?: string,
): FieldRejection | null {
  const name = rejectName(draft.name, document.derivatives, exceptId);
  if (name) {
    return name;
  }

  const current = exceptId
    ? document.derivatives.find((item) => item.id === exceptId)
    : undefined;

  if (
    !placeAccepted(document.warehouses, draft.warehouseId, current?.warehouseId ?? null)
  ) {
    return "warehouse";
  }

  if (!placeAccepted(document.workshops, draft.workshopId, current?.workshopId ?? null)) {
    return "workshop";
  }

  if (draft.isFinalProduct && !isVat(draft.vatPercent)) {
    return "vat";
  }

  if (draft.isFinalProduct && current && !current.isFinalProduct) {
    if (derivativeReferenced(document, current.id)) {
      return "used-as-component";
    }
  }

  if (
    current &&
    !draft.isFinalProduct &&
    current.isFinalProduct &&
    document.recipes.some((recipe) => recipe.derivativeId === current.id) &&
    !isYield(draft.yieldPercent)
  ) {
    return "yield";
  }

  return null;
}

function replaceRecipes(
  document: PrototypeDocument,
  derivativeId: string,
  yieldPercent: number | null,
): RecipeCard[] {
  return document.recipes.map((recipe) =>
    recipe.derivativeId === derivativeId ? { ...recipe, yieldPercent } : recipe,
  );
}

export function addDerivative(
  document: PrototypeDocument,
  derivative: Derivative,
): PrototypeDocument {
  if (
    !isEntityId(derivative.id) ||
    document.derivatives.some((item) => item.id === derivative.id)
  ) {
    return document;
  }

  if (derivativeDraftRejection(document, derivative)) {
    return document;
  }

  return {
    ...document,
    derivatives: [
      ...document.derivatives,
      {
        id: derivative.id,
        name: normalizeName(derivative.name),
        isFinalProduct: derivative.isFinalProduct,
        warehouseId: derivative.warehouseId,
        workshopId: derivative.workshopId,
        vatPercent: derivative.isFinalProduct ? (derivative.vatPercent ?? null) : null,
        deletedAt: null,
      },
    ],
  };
}

export function updateDerivative(
  document: PrototypeDocument,
  id: string,
  draft: DerivativeDraft,
): PrototypeDocument {
  const current = document.derivatives.find((item) => item.id === id);
  if (!current || derivativeDraftRejection(document, draft, id)) {
    return document;
  }

  const next: Derivative = {
    ...current,
    name: normalizeName(draft.name),
    isFinalProduct: draft.isFinalProduct,
    warehouseId: draft.warehouseId,
    workshopId: draft.workshopId,
    vatPercent: draft.isFinalProduct ? (draft.vatPercent ?? null) : null,
  };

  const unchanged =
    next.name === current.name &&
    next.isFinalProduct === current.isFinalProduct &&
    next.warehouseId === current.warehouseId &&
    next.workshopId === current.workshopId &&
    next.vatPercent === current.vatPercent;

  if (unchanged) {
    return document;
  }

  let recipes = document.recipes;
  if (next.isFinalProduct !== current.isFinalProduct) {
    recipes = replaceRecipes(
      document,
      id,
      next.isFinalProduct ? null : (draft.yieldPercent ?? null),
    );
  }

  return {
    ...document,
    derivatives: document.derivatives.map((item) => (item.id === id ? next : item)),
    recipes,
  };
}

export function deleteDerivative(
  document: PrototypeDocument,
  id: string,
  deletedAt: string,
): PrototypeDocument {
  if (!isDeletionMark(deletedAt)) {
    return document;
  }

  const current = document.derivatives.find(
    (item) => item.id === id && item.deletedAt === null,
  );
  if (!current) {
    return document;
  }

  return {
    ...document,
    derivatives: document.derivatives.map((item) =>
      item.id === id ? { ...item, deletedAt } : item,
    ),
  };
}

export function restoreDerivative(
  document: PrototypeDocument,
  id: string,
): PrototypeDocument {
  const current = document.derivatives.find(
    (item) => item.id === id && item.deletedAt !== null,
  );
  if (!current || rejectName(current.name, document.derivatives, id)) {
    return document;
  }

  return {
    ...document,
    derivatives: document.derivatives.map((item) =>
      item.id === id ? { ...item, deletedAt: null } : item,
    ),
  };
}

function activeDependsOn(
  document: PrototypeDocument,
  startId: string,
  targetId: string,
  seen: Set<string>,
): boolean {
  if (startId === targetId) {
    return true;
  }
  if (seen.has(startId)) {
    return false;
  }

  seen.add(startId);
  const recipe = activeRecipeFor(document, startId);
  if (!recipe) {
    return false;
  }

  for (const line of recipe.lines) {
    if (
      line.kind === "derivative" &&
      activeDependsOn(document, line.refId, targetId, seen)
    ) {
      return true;
    }
  }

  return false;
}

function batchLimitGrams(document: PrototypeDocument, ownerId: string): number | null {
  const owner = document.derivatives.find((item) => item.id === ownerId);
  if (!owner || owner.isFinalProduct) {
    return null;
  }

  const recipe = activeRecipeFor(document, ownerId);
  if (!recipe || recipe.yieldPercent === null) {
    return null;
  }

  return inputGramsForFinishedBatch(recipe.yieldPercent);
}

function batchOverflow(
  document: PrototypeDocument,
  ownerId: string,
  grams: number,
): boolean {
  const limit = batchLimitGrams(document, ownerId);
  return limit !== null && grams > limit;
}

function newLineRejection(
  document: PrototypeDocument,
  ownerId: string,
  draft: RecipeLineDraft,
  lines: readonly RecipeLine[],
): FieldRejection | null {
  if (!isEntityId(draft.id) || !isQuantity(draft.quantityGrams)) {
    return draft.id && isEntityId(draft.id) ? "quantity" : "missing";
  }

  if (lines.some((line) => line.kind === draft.kind && line.refId === draft.refId)) {
    return "duplicate-line";
  }

  if (draft.kind === "material") {
    const material = document.materials.find(
      (item) => item.id === draft.refId && item.deletedAt === null,
    );
    if (!material) {
      return "component";
    }

    const owner = document.derivatives.find((item) => item.id === ownerId);
    if (material.unit === "piece" && !owner?.isFinalProduct) {
      return "piece";
    }
  } else {
    if (draft.refId === ownerId) {
      return "self";
    }

    const component = document.derivatives.find(
      (item) => item.id === draft.refId && item.deletedAt === null,
    );
    if (!component) {
      return "component";
    }
    if (component.isFinalProduct) {
      return "final-in-recipe";
    }
    if (activeDependsOn(document, component.id, ownerId, new Set())) {
      return "cycle";
    }
  }

  if (batchOverflow(document, ownerId, compositionGrams(lines) + draft.quantityGrams)) {
    return "batch";
  }

  return null;
}

export function recipeComponentChoices(
  document: PrototypeDocument,
  ownerId: string,
): { materials: RawMaterial[]; derivatives: Derivative[] } {
  const recipe = activeRecipeFor(document, ownerId);
  const owner = document.derivatives.find((item) => item.id === ownerId);
  const used = new Set((recipe?.lines ?? []).map((line) => `${line.kind}:${line.refId}`));

  return {
    materials: activeMaterials(document).filter((item) => {
      if (!owner?.isFinalProduct && item.unit === "piece") {
        return false;
      }
      return !used.has(`material:${item.id}`);
    }),
    derivatives: activeDerivatives(document).filter((item) => {
      if (
        item.isFinalProduct ||
        item.id === ownerId ||
        used.has(`derivative:${item.id}`)
      ) {
        return false;
      }
      return !activeDependsOn(document, item.id, ownerId, new Set());
    }),
  };
}

export function addRecipe(
  document: PrototypeDocument,
  recipe: RecipeCard,
): PrototypeDocument {
  if (!isEntityId(recipe.id) || document.recipes.some((item) => item.id === recipe.id)) {
    return document;
  }

  const derivative = document.derivatives.find((item) => item.id === recipe.derivativeId);
  if (!derivative || activeRecipeFor(document, derivative.id)) {
    return document;
  }

  if (derivative.isFinalProduct) {
    if (recipe.yieldPercent !== null) {
      return document;
    }
  } else if (!isYield(recipe.yieldPercent)) {
    return document;
  }

  return {
    ...document,
    recipes: [
      ...document.recipes,
      {
        id: recipe.id,
        derivativeId: derivative.id,
        yieldPercent: derivative.isFinalProduct ? null : recipe.yieldPercent,
        lines: [],
        deletedAt: null,
      },
    ],
  };
}

export function setRecipeYield(
  document: PrototypeDocument,
  recipeId: string,
  yieldPercent: number,
): PrototypeDocument {
  const recipe = document.recipes.find((item) => item.id === recipeId);
  if (!recipe || !isYield(yieldPercent) || recipe.yieldPercent === yieldPercent) {
    return document;
  }

  const derivative = document.derivatives.find((item) => item.id === recipe.derivativeId);
  if (!derivative || derivative.isFinalProduct) {
    return document;
  }

  if (compositionGrams(recipe.lines) > inputGramsForFinishedBatch(yieldPercent)) {
    return document;
  }

  return {
    ...document,
    recipes: document.recipes.map((item) =>
      item.id === recipeId ? { ...item, yieldPercent } : item,
    ),
  };
}

function mapRecipeLines(
  document: PrototypeDocument,
  recipeId: string,
  lines: RecipeLine[],
): PrototypeDocument {
  return {
    ...document,
    recipes: document.recipes.map((item) =>
      item.id === recipeId ? { ...item, lines } : item,
    ),
  };
}

export function addRecipeLine(
  document: PrototypeDocument,
  recipeId: string,
  draft: RecipeLineDraft,
): PrototypeDocument {
  const recipe = document.recipes.find((item) => item.id === recipeId);
  if (!recipe || recipe.lines.some((line) => line.id === draft.id)) {
    return document;
  }

  if (newLineRejection(document, recipe.derivativeId, draft, recipe.lines)) {
    return document;
  }

  return mapRecipeLines(document, recipeId, [
    ...recipe.lines,
    {
      id: draft.id,
      kind: draft.kind,
      refId: draft.refId,
      quantityGrams: draft.quantityGrams,
    },
  ]);
}

export function updateRecipeLineQuantity(
  document: PrototypeDocument,
  recipeId: string,
  lineId: string,
  quantityGrams: number,
): PrototypeDocument {
  const recipe = document.recipes.find((item) => item.id === recipeId);
  const line = recipe?.lines.find((item) => item.id === lineId);
  if (
    !recipe ||
    !line ||
    !isQuantity(quantityGrams) ||
    line.quantityGrams === quantityGrams
  ) {
    return document;
  }

  if (
    batchOverflow(
      document,
      recipe.derivativeId,
      compositionGrams(recipe.lines) - line.quantityGrams + quantityGrams,
    )
  ) {
    return document;
  }

  return mapRecipeLines(
    document,
    recipeId,
    recipe.lines.map((item) => (item.id === lineId ? { ...item, quantityGrams } : item)),
  );
}

/**
 * Строка состава — не учётная сущность: у карты нет отдельного «удалить навсегда»,
 * а сама карта удаляется полем `deletedAt`. Убрать компонент значит поправить состав.
 */
export function removeRecipeLine(
  document: PrototypeDocument,
  recipeId: string,
  lineId: string,
): PrototypeDocument {
  const recipe = document.recipes.find((item) => item.id === recipeId);
  if (!recipe || !recipe.lines.some((line) => line.id === lineId)) {
    return document;
  }

  return mapRecipeLines(
    document,
    recipeId,
    recipe.lines.filter((line) => line.id !== lineId),
  );
}

export function deleteRecipe(
  document: PrototypeDocument,
  recipeId: string,
  deletedAt: string,
): PrototypeDocument {
  if (!isDeletionMark(deletedAt)) {
    return document;
  }

  const recipe = document.recipes.find(
    (item) => item.id === recipeId && item.deletedAt === null,
  );
  if (!recipe) {
    return document;
  }

  return {
    ...document,
    recipes: document.recipes.map((item) =>
      item.id === recipeId ? { ...item, deletedAt } : item,
    ),
  };
}

function restoredRecipeRejection(
  document: PrototypeDocument,
  recipe: RecipeCard,
): FieldRejection | null {
  const derivative = document.derivatives.find((item) => item.id === recipe.derivativeId);
  if (!derivative) {
    return "missing";
  }

  if (activeRecipeFor(document, derivative.id)) {
    return "recipe-exists";
  }

  if (derivative.isFinalProduct) {
    if (recipe.yieldPercent !== null) {
      return "yield";
    }
  } else if (!isYield(recipe.yieldPercent)) {
    return "yield";
  }

  for (const line of recipe.lines) {
    if (line.kind === "material") {
      if (!document.materials.some((item) => item.id === line.refId)) {
        return "component";
      }
      continue;
    }

    if (line.refId === derivative.id) {
      return "self";
    }

    const component = document.derivatives.find((item) => item.id === line.refId);
    if (!component) {
      return "component";
    }
    if (component.isFinalProduct) {
      return "final-in-recipe";
    }
    if (activeDependsOn(document, component.id, derivative.id, new Set())) {
      return "cycle";
    }
  }

  return null;
}

export function restoreRecipe(
  document: PrototypeDocument,
  recipeId: string,
): PrototypeDocument {
  const recipe = document.recipes.find(
    (item) => item.id === recipeId && item.deletedAt !== null,
  );
  if (!recipe || restoredRecipeRejection(document, recipe)) {
    return document;
  }

  return {
    ...document,
    recipes: document.recipes.map((item) =>
      item.id === recipeId ? { ...item, deletedAt: null } : item,
    ),
  };
}

export function lineQuantityRejection(
  document: PrototypeDocument,
  recipeId: string,
  lineId: string,
  quantityGrams: number,
): FieldRejection | null {
  const recipe = document.recipes.find((item) => item.id === recipeId);
  const line = recipe?.lines.find((item) => item.id === lineId);
  if (!recipe || !line) {
    return "missing";
  }
  if (!isQuantity(quantityGrams)) {
    return "quantity";
  }
  if (
    batchOverflow(
      document,
      recipe.derivativeId,
      compositionGrams(recipe.lines) - line.quantityGrams + quantityGrams,
    )
  ) {
    return "batch";
  }

  return null;
}

export function recipeLineRejection(
  document: PrototypeDocument,
  recipeId: string,
  draft: RecipeLineDraft,
): FieldRejection | null {
  const recipe = document.recipes.find((item) => item.id === recipeId);
  if (!recipe) {
    return "missing";
  }
  if (recipe.lines.some((line) => line.id === draft.id)) {
    return "duplicate-line";
  }

  return newLineRejection(document, recipe.derivativeId, draft, recipe.lines);
}

export function restoreRecipeRejection(
  document: PrototypeDocument,
  recipeId: string,
): FieldRejection | null {
  const recipe = document.recipes.find((item) => item.id === recipeId);
  if (!recipe || recipe.deletedAt === null) {
    return "missing";
  }

  return restoredRecipeRejection(document, recipe);
}
