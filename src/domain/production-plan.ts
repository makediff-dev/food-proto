import { ratioKopecks, unitCost } from "@/domain/cost";
import type {
  Derivative,
  MaterialUnit,
  PrototypeDocument,
  RecipeCard,
  RecipeLine,
} from "@/domain/document";
import {
  activeRecipeFor,
  compositionGrams,
  inputGramsForFinishedBatch,
} from "@/domain/materials";
import { activeSalesPlans } from "@/domain/sales-plan";
import { amountPair, type KopeckPair } from "@/domain/stock";

const ZERO = BigInt(0);
const TWO = BigInt(2);
const THOUSAND = BigInt(1000);

/** Партия нормы с карты: товар — штуки, производная — граммы готового продукта. */
export function recipeBatch(recipe: RecipeCard): bigint {
  return BigInt(recipe.batchSize);
}

export type ProductionRecipeGap =
  "missing-recipe" | "unbalanced" | "cycle" | "broken-link";

export type ProductionKind = "product" | "derivative" | "material";

/** Кто берёт позицию или что входит в выпуск. Количество — граммы или штуки. */
export interface ProductionShare {
  id: string;
  name: string;
  kind: ProductionKind;
  deleted: boolean;
  quantity: number;
  unit: MaterialUnit;
}

export interface ProductionOutputRow {
  id: string;
  name: string;
  kind: "product" | "derivative";
  deleted: boolean;
  workshopId: string;
  workshopName: string;
  /** Товар — штуки, производная — граммы. */
  quantity: number;
  unit: MaterialUnit;
  /** Себестоимость этого выпуска. В документ не пишется. */
  cost: KopeckPair | null;
  recipeGap: ProductionRecipeGap | null;
  /** Прямой состав на этот выпуск. Пусто, если рецепт не разложен. */
  components: ProductionShare[];
}

export interface ProductionInputRow {
  id: string;
  name: string;
  kind: "material" | "derivative";
  deleted: boolean;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  unit: MaterialUnit;
  /**
   * Сырьё — закупочная сумма строки, `DSM Meat!J8` через `amountPair`.
   * Производная — себестоимость этого количества, в итог сырья не входит.
   */
  cost: KopeckPair | null;
  recipeGap: ProductionRecipeGap | null;
  consumers: ProductionShare[];
}

export interface ProductionTotals {
  productPieces: number | null;
  productCount: number;
  derivativeGrams: number | null;
  derivativeCount: number;
  materialGrams: number | null;
  materialPieces: number | null;
  materialCount: number;
  /**
   * Себестоимость сырья за месяц. Считается как себестоимость выпуска:
   * `Svod!L31 = D31 * H31`, себестоимость штуки уже округлена до копейки.
   */
  materialCost: KopeckPair | null;
}

export type ProductionPlan =
  | { status: "missing-plan" }
  | { status: "empty-volume"; planId: string }
  | {
      status: "ready";
      planId: string;
      outputs: ProductionOutputRow[];
      inputs: ProductionInputRow[];
      totals: ProductionTotals;
    };

interface Consumption {
  kind: "material" | "derivative";
  unit: MaterialUnit;
  quantity: number;
  consumers: ProductionShare[];
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

/**
 * Норма уже лежит на готовый выход, выход второй раз не делим.
 * Товар: `норма * штуки / batchSize`. Производная: `норма * граммы / batchSize`.
 */
export function scaleRecipeQuantity(
  norm: number,
  output: number,
  batch: bigint,
): number | null {
  if (output === 0 || norm === 0) {
    return 0;
  }

  return roundHalfUp(BigInt(norm) * BigInt(output), batch);
}

function componentExists(
  document: PrototypeDocument,
  owner: Derivative,
  line: RecipeLine,
): boolean {
  if (line.kind === "material") {
    const material = document.materials.find((item) => item.id === line.refId);
    if (!material) {
      return false;
    }

    return owner.isFinalProduct || material.unit !== "piece";
  }

  const derivative = ownerOf(document, line.refId);
  return derivative !== null && !derivative.isFinalProduct;
}

function structuralGap(
  document: PrototypeDocument,
  id: string,
): ProductionRecipeGap | null {
  const owner = ownerOf(document, id);
  if (!owner) {
    return "broken-link";
  }

  const recipe = activeRecipeFor(document, id);
  if (!recipe) {
    return "missing-recipe";
  }

  if (!owner.isFinalProduct) {
    if (
      recipe.yieldPercent === null ||
      compositionGrams(recipe.lines) !==
        inputGramsForFinishedBatch(recipe.yieldPercent, recipe.batchSize)
    ) {
      return "unbalanced";
    }
  }

  for (const line of recipe.lines) {
    if (!componentExists(document, owner, line)) {
      return "broken-link";
    }
  }

  return null;
}

function derivativeParents(document: PrototypeDocument, componentId: string): string[] {
  const parents: string[] = [];
  for (const recipe of document.recipes) {
    if (recipe.deletedAt !== null) {
      continue;
    }

    if (
      recipe.lines.some(
        (line) => line.kind === "derivative" && line.refId === componentId,
      )
    ) {
      parents.push(recipe.derivativeId);
    }
  }

  return parents;
}

/** Себестоимость количества: штуки как `Svod!L31`, килограммы — цена за кг на граммы / 1000. */
export function plannedQuantityCost(
  document: PrototypeDocument,
  derivativeId: string,
  quantity: number,
  unit: MaterialUnit,
): KopeckPair | null {
  const cost = unitCost(document, derivativeId);
  if (!cost || quantity === 0) {
    return quantity === 0 ? { withVatKopecks: 0, exVatKopecks: 0 } : null;
  }

  if (unit === "piece") {
    if (cost.per !== "piece") {
      return null;
    }

    const withVatKopecks = ratioKopecks(
      BigInt(cost.withVatKopecks) * BigInt(quantity),
      BigInt(1),
    );
    const exVatKopecks = ratioKopecks(
      BigInt(cost.exVatKopecks) * BigInt(quantity),
      BigInt(1),
    );
    if (withVatKopecks === null || exVatKopecks === null) {
      return null;
    }

    return { withVatKopecks, exVatKopecks };
  }

  if (cost.per !== "kg") {
    return null;
  }

  const withVatKopecks = ratioKopecks(
    BigInt(cost.withVatKopecks) * BigInt(quantity),
    THOUSAND,
  );
  const exVatKopecks = ratioKopecks(
    BigInt(cost.exVatKopecks) * BigInt(quantity),
    THOUSAND,
  );
  if (withVatKopecks === null || exVatKopecks === null) {
    return null;
  }

  return { withVatKopecks, exVatKopecks };
}

function shareFromLine(
  document: PrototypeDocument,
  line: RecipeLine,
  quantity: number,
): ProductionShare | null {
  if (quantity <= 0) {
    return null;
  }

  if (line.kind === "material") {
    const material = document.materials.find((item) => item.id === line.refId);
    if (!material) {
      return null;
    }

    return {
      id: material.id,
      name: material.name,
      kind: "material",
      deleted: material.deletedAt !== null,
      quantity,
      unit: material.unit,
    };
  }

  const derivative = ownerOf(document, line.refId);
  if (!derivative || derivative.isFinalProduct) {
    return null;
  }

  return {
    id: derivative.id,
    name: derivative.name,
    kind: "derivative",
    deleted: derivative.deletedAt !== null,
    quantity,
    unit: "kg",
  };
}

function ownerShare(
  owner: Derivative,
  quantity: number,
  unit: MaterialUnit,
): ProductionShare {
  return {
    id: owner.id,
    name: owner.name,
    kind: owner.isFinalProduct ? "product" : "derivative",
    deleted: owner.deletedAt !== null,
    quantity,
    unit,
  };
}

function mergeShares(shares: readonly ProductionShare[]): ProductionShare[] {
  const merged: ProductionShare[] = [];
  for (const share of shares) {
    const existing = merged.find(
      (item) => item.id === share.id && item.kind === share.kind,
    );
    if (!existing) {
      merged.push({ ...share });
      continue;
    }

    const quantity = addQuantity(existing.quantity, share.quantity);
    if (quantity !== null) {
      existing.quantity = quantity;
    }
  }

  return merged;
}

function pushConsumer(bucket: Consumption, consumer: ProductionShare): void {
  const existing = bucket.consumers.find((item) => item.id === consumer.id);
  if (!existing) {
    bucket.consumers.push({ ...consumer });
    return;
  }

  const quantity = addQuantity(existing.quantity, consumer.quantity);
  if (quantity !== null) {
    existing.quantity = quantity;
  }
}

function markGaps(
  document: PrototypeDocument,
  roots: readonly string[],
): Map<string, ProductionRecipeGap> {
  const gaps = new Map<string, ProductionRecipeGap>();
  const color = new Map<string, "gray" | "black">();
  const stack: string[] = [];

  function visit(id: string): void {
    if (color.get(id) === "black" || gaps.get(id) === "cycle") {
      return;
    }

    if (color.get(id) === "gray") {
      const start = stack.indexOf(id);
      const cycle = start === -1 ? [id] : stack.slice(start);
      for (const node of cycle) {
        gaps.set(node, "cycle");
      }
      return;
    }

    color.set(id, "gray");
    stack.push(id);
    const problem = structuralGap(document, id);
    if (problem) {
      gaps.set(id, problem);
      stack.pop();
      color.set(id, "black");
      return;
    }

    const recipe = activeRecipeFor(document, id);
    if (recipe) {
      for (const line of recipe.lines) {
        if (line.kind === "derivative") {
          visit(line.refId);
        }
      }
    }

    stack.pop();
    color.set(id, "black");
  }

  for (const id of roots) {
    visit(id);
  }

  return gaps;
}

/** Пробел рецептуры самой позиции: карты нет, она не сходится, цикл или битая ссылка. */
export function recipeGap(
  document: PrototypeDocument,
  id: string,
): ProductionRecipeGap | null {
  return markGaps(document, [id]).get(id) ?? null;
}

function materialCost(
  document: PrototypeDocument,
  materialId: string,
  quantity: number,
  unit: MaterialUnit,
): KopeckPair | null {
  const material = document.materials.find((item) => item.id === materialId);
  if (!material) {
    return null;
  }

  return amountPair(quantity, unit, material.priceWithVatKopecks, material.vatPercent);
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

function sumMoney(costs: readonly (KopeckPair | null)[]): KopeckPair | null {
  let withVat = BigInt(0);
  let exVat = BigInt(0);
  for (const cost of costs) {
    if (!cost) {
      return null;
    }

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

function byName(left: { name: string }, right: { name: string }): number {
  return left.name.localeCompare(right.name, "ru");
}

/**
 * План выпуска и расхода на месяц плана продаж.
 * Остатки склада не вычитаются. Числа в документ не пишутся.
 */
export function productionPlan(
  document: PrototypeDocument,
  month: string,
): ProductionPlan {
  const plan = activeSalesPlans(document).find((item) => item.month === month) ?? null;
  if (!plan) {
    return { status: "missing-plan" };
  }

  const demanded = plan.lines.filter((line) => line.volumePieces > 0);
  if (demanded.length === 0) {
    return { status: "empty-volume", planId: plan.id };
  }

  const required = new Map<string, number>();
  for (const line of demanded) {
    const next = addQuantity(required.get(line.productId) ?? 0, line.volumePieces);
    if (next !== null) {
      required.set(line.productId, next);
    }
  }

  const gaps = markGaps(document, [...required.keys()]);
  const known = new Set(required.keys());
  const exploded = new Set<string>();
  const componentsByOwner = new Map<string, ProductionShare[]>();
  const consumed = new Map<string, Consumption>();

  const limit = document.derivatives.length + required.size + 2;
  for (let pass = 0; pass < limit; pass += 1) {
    let progressed = false;
    for (const id of [...known]) {
      if (exploded.has(id) || gaps.has(id) || (required.get(id) ?? 0) <= 0) {
        continue;
      }

      const waiting = derivativeParents(document, id).some(
        (parentId) =>
          known.has(parentId) && !gaps.has(parentId) && !exploded.has(parentId),
      );
      if (waiting) {
        continue;
      }

      const owner = ownerOf(document, id);
      const recipe = owner ? activeRecipeFor(document, id) : null;
      const output = required.get(id) ?? 0;
      if (!owner || !recipe) {
        gaps.set(id, owner ? "missing-recipe" : "broken-link");
        continue;
      }

      const batch = recipeBatch(recipe);
      const shares: ProductionShare[] = [];
      let failed = false;
      for (const line of recipe.lines) {
        const scaled = scaleRecipeQuantity(line.quantityGrams, output, batch);
        const share = scaled === null ? null : shareFromLine(document, line, scaled);
        if (scaled === null || (scaled > 0 && !share)) {
          failed = true;
          break;
        }
        if (share) {
          shares.push(share);
        }
      }

      const merged = failed ? [] : mergeShares(shares);
      const nextRequired = new Map(required);
      const nextConsumed = new Map<string, number>();
      if (!failed) {
        for (const share of merged) {
          const used = addQuantity(
            nextConsumed.get(share.id) ?? consumed.get(share.id)?.quantity ?? 0,
            share.quantity,
          );
          if (share.kind === "derivative") {
            const next = addQuantity(nextRequired.get(share.id) ?? 0, share.quantity);
            if (next === null || used === null) {
              failed = true;
              break;
            }

            nextRequired.set(share.id, next);
          } else if (used === null) {
            failed = true;
            break;
          }

          if (used !== null) {
            nextConsumed.set(share.id, used);
          }
        }
      }

      if (failed) {
        gaps.set(id, "broken-link");
        continue;
      }

      componentsByOwner.set(id, merged);
      for (const share of merged) {
        const bucket = consumed.get(share.id) ?? {
          kind: share.kind === "material" ? "material" : "derivative",
          unit: share.unit,
          quantity: 0,
          consumers: [],
        };
        const quantity = nextConsumed.get(share.id);
        if (quantity === undefined) {
          continue;
        }

        bucket.quantity = quantity;
        pushConsumer(bucket, ownerShare(owner, share.quantity, share.unit));
        consumed.set(share.id, bucket);
        if (share.kind === "derivative") {
          known.add(share.id);
          const next = nextRequired.get(share.id);
          if (next !== undefined) {
            required.set(share.id, next);
          }
        }
      }

      exploded.add(id);
      progressed = true;
    }

    if (!progressed) {
      break;
    }
  }

  for (const id of known) {
    if ((required.get(id) ?? 0) > 0 && !gaps.has(id) && !exploded.has(id)) {
      gaps.set(id, "cycle");
    }
  }

  const outputs = [...required.entries()]
    .filter(([, quantity]) => quantity > 0)
    .map(([id, quantity]) => outputRow(document, id, quantity, gaps, componentsByOwner))
    .sort(byName);

  const inputs = [...consumed.entries()]
    .filter(([, bucket]) => bucket.quantity > 0)
    .map(([id, bucket]) => inputRow(document, id, bucket, gaps))
    .sort(byName);

  const products = outputs.filter((row) => row.kind === "product");
  const derivatives = outputs.filter((row) => row.kind === "derivative");
  const materials = inputs.filter((row) => row.kind === "material");

  return {
    status: "ready",
    planId: plan.id,
    outputs,
    inputs,
    totals: {
      productPieces: sumQuantities(products.map((row) => row.quantity)),
      productCount: products.length,
      derivativeGrams: sumQuantities(derivatives.map((row) => row.quantity)),
      derivativeCount: derivatives.length,
      materialGrams: sumQuantities(
        materials.filter((row) => row.unit === "kg").map((row) => row.quantity),
      ),
      materialPieces: sumQuantities(
        materials.filter((row) => row.unit === "piece").map((row) => row.quantity),
      ),
      materialCount: materials.length,
      materialCost: sumMoney(products.map((row) => row.cost)),
    },
  };
}

function outputRow(
  document: PrototypeDocument,
  id: string,
  quantity: number,
  gaps: ReadonlyMap<string, ProductionRecipeGap>,
  componentsByOwner: ReadonlyMap<string, ProductionShare[]>,
): ProductionOutputRow {
  const owner = ownerOf(document, id);
  const product = owner?.isFinalProduct ?? true;
  const unit: MaterialUnit = product ? "piece" : "kg";

  return {
    id,
    name: owner?.name ?? "Товар",
    kind: product ? "product" : "derivative",
    deleted: owner !== null && owner.deletedAt !== null,
    workshopId: owner?.workshopId ?? "",
    workshopName: placeName(document.workshops, owner?.workshopId ?? "", "Цех"),
    quantity,
    unit,
    cost: owner ? plannedQuantityCost(document, owner.id, quantity, unit) : null,
    recipeGap: gaps.get(id) ?? null,
    components: (componentsByOwner.get(id) ?? []).slice().sort(byName),
  };
}

function inputRow(
  document: PrototypeDocument,
  id: string,
  bucket: Consumption,
  gaps: ReadonlyMap<string, ProductionRecipeGap>,
): ProductionInputRow {
  if (bucket.kind === "material") {
    const material = document.materials.find((item) => item.id === id);
    return {
      id,
      name: material?.name ?? "Сырьё",
      kind: "material",
      deleted: material !== undefined && material.deletedAt !== null,
      warehouseId: material?.warehouseId ?? "",
      warehouseName: placeName(document.warehouses, material?.warehouseId ?? "", "Склад"),
      quantity: bucket.quantity,
      unit: bucket.unit,
      cost: materialCost(document, id, bucket.quantity, bucket.unit),
      recipeGap: null,
      consumers: bucket.consumers.slice().sort(byName),
    };
  }

  const derivative = ownerOf(document, id);
  return {
    id,
    name: derivative?.name ?? "Производная",
    kind: "derivative",
    deleted: derivative !== null && derivative.deletedAt !== null,
    warehouseId: derivative?.warehouseId ?? "",
    warehouseName: placeName(document.warehouses, derivative?.warehouseId ?? "", "Склад"),
    quantity: bucket.quantity,
    unit: "kg",
    cost: derivative
      ? plannedQuantityCost(document, derivative.id, bucket.quantity, "kg")
      : null,
    recipeGap: gaps.get(id) ?? null,
    consumers: bucket.consumers.slice().sort(byName),
  };
}

function requirementKey(
  warehouseId: string,
  kind: "material" | "derivative",
  id: string,
): string {
  return `${warehouseId}:${kind}:${id}`;
}

/**
 * Сколько план производства требует с этого склада за месяц.
 * Сырьё и производные — план расхода. Конечный товар — план выпуска.
 * Нет рабочего плана или в нём нет объёма — `null`.
 */
export function plannedRequirements(
  document: PrototypeDocument,
  month: string,
): Map<string, number> | null {
  const plan = productionPlan(document, month);
  if (plan.status !== "ready") {
    return null;
  }

  const required = new Map<string, number>();
  for (const row of plan.inputs) {
    required.set(requirementKey(row.warehouseId, row.kind, row.id), row.quantity);
  }

  for (const row of plan.outputs) {
    if (row.kind !== "product") {
      continue;
    }

    const owner = ownerOf(document, row.id);
    if (!owner) {
      continue;
    }

    required.set(requirementKey(owner.warehouseId, "derivative", row.id), row.quantity);
  }

  return required;
}

export function plannedRequirement(
  required: Map<string, number> | null,
  warehouseId: string,
  kind: "material" | "derivative",
  id: string,
): number | null {
  if (!required) {
    return null;
  }

  return required.get(requirementKey(warehouseId, kind, id)) ?? 0;
}
