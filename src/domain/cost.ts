import type { PrototypeDocument, RawMaterial, RecipeLine } from "@/domain/document";
import {
  activeRecipeFor,
  compositionGrams,
  inputGramsForFinishedBatch,
} from "@/domain/materials";

const ZERO = BigInt(0);
const ONE = BigInt(1);
const TWO = BigInt(2);
const HUNDRED = BigInt(100);
const THOUSAND = BigInt(1000);

interface Ratio {
  num: bigint;
  den: bigint;
}

interface PricePair {
  withVat: Ratio;
  exVat: Ratio;
}

export type CostPer = "kg" | "piece";

export interface UnitCost {
  /** Копейки за 1 кг или за 1 шт с НДС, половина вверх. */
  withVatKopecks: number;
  /** Копейки за 1 кг или за 1 шт без НДС, половина вверх. */
  exVatKopecks: number;
  per: CostPer;
}

export interface LineContribution {
  withVatKopecks: number;
  exVatKopecks: number;
}

function gcd(left: bigint, right: bigint): bigint {
  let a = left < ZERO ? -left : left;
  let b = right < ZERO ? -right : right;
  while (b !== ZERO) {
    const next = a % b;
    a = b;
    b = next;
  }

  return a === ZERO ? ONE : a;
}

function ratio(num: bigint, den: bigint): Ratio {
  if (den < ZERO) {
    return ratio(-num, -den);
  }
  if (num === ZERO) {
    return { num: ZERO, den: ONE };
  }

  const divisor = gcd(num, den);
  return { num: num / divisor, den: den / divisor };
}

function addRatio(left: Ratio, right: Ratio): Ratio {
  return ratio(left.num * right.den + right.num * left.den, left.den * right.den);
}

/** Копейки из числителя и знаменателя, половина вверх. */
export function ratioKopecks(numerator: bigint, denominator: bigint): number | null {
  return roundHalfUpKopecks(ratio(numerator, denominator));
}

function roundHalfUpKopecks(value: Ratio): number | null {
  if (value.den <= ZERO || value.num < ZERO) {
    return null;
  }

  const rounded = (value.num + value.den / TWO) / value.den;
  if (rounded > BigInt(Number.MAX_SAFE_INTEGER)) {
    return null;
  }

  return Number(rounded);
}

/** Цена закупки без НДС, копейки за 1 кг. `DSM Meat!J8 = H8 / (100 + F8) * 100`. */
export function priceExVatKopecks(material: RawMaterial): number | null {
  return roundHalfUpKopecks(priceExVatPerKilogram(material));
}

function priceExVatPerKilogram(material: RawMaterial): Ratio {
  return ratio(
    BigInt(material.priceWithVatKopecks) * HUNDRED,
    BigInt(100 + material.vatPercent),
  );
}

function isPieceLine(document: PrototypeDocument, line: RecipeLine): boolean {
  if (line.kind !== "material") {
    return false;
  }

  return document.materials.find((item) => item.id === line.refId)?.unit === "piece";
}

/** Штуки делятся на базу карты. Килограммы — на базу × 1000, потому что хранятся граммами. */
function finalLinePart(
  document: PrototypeDocument,
  line: RecipeLine,
  price: Ratio,
  batchSize: number,
): Ratio {
  const divisor = isPieceLine(document, line)
    ? BigInt(batchSize)
    : BigInt(batchSize) * THOUSAND;
  return ratio(BigInt(line.quantityGrams) * price.num, price.den * divisor);
}

function zeroPair(): PricePair {
  return { withVat: ratio(ZERO, ONE), exVat: ratio(ZERO, ONE) };
}

function addPair(left: PricePair, right: PricePair): PricePair {
  return {
    withVat: addRatio(left.withVat, right.withVat),
    exVat: addRatio(left.exVat, right.exVat),
  };
}

function materialPrices(material: RawMaterial): PricePair {
  return {
    withVat: ratio(BigInt(material.priceWithVatKopecks), ONE),
    exVat: priceExVatPerKilogram(material),
  };
}

/**
 * Цена компонента за 1 кг: у сырья закупочная, у производной — её себестоимость.
 * С НДС и без НДС считаются одной закладкой, каждая от своей цены.
 */
function componentPrices(
  document: PrototypeDocument,
  line: RecipeLine,
  stack: ReadonlySet<string>,
): PricePair | null {
  if (line.kind === "material") {
    const material = document.materials.find((item) => item.id === line.refId);
    return material ? materialPrices(material) : null;
  }

  const derivative = document.derivatives.find((item) => item.id === line.refId);
  if (!derivative || derivative.isFinalProduct) {
    return null;
  }

  return costPerKilogram(document, derivative.id, stack);
}

/**
 * Вклад ингредиента в 1 кг готовой производной.
 * Количество задано на партию `batchSize` граммов готового продукта, делитель — база, не выход.
 * Книга хранила закладку на 100 кг сырья и делила на выход:
 * `Rec&Calc Meat!G42 = количество на 100 кг сырья * цена / выход_%`.
 * 32,4 кг при выходе 80% в прототипе записываются как 40,5 кг на 100 кг; вклад тот же, 257,727… ₽.
 */
function finishedKilogramPart(grams: number, price: Ratio, batchGrams: number): Ratio {
  return ratio(BigInt(grams) * price.num, price.den * BigInt(batchGrams));
}

function costPerKilogram(
  document: PrototypeDocument,
  derivativeId: string,
  stack: ReadonlySet<string>,
): PricePair | null {
  if (stack.has(derivativeId)) {
    return null;
  }

  const derivative = document.derivatives.find((item) => item.id === derivativeId);
  if (!derivative || derivative.isFinalProduct) {
    return null;
  }

  const recipe = activeRecipeFor(document, derivativeId);
  if (!recipe || recipe.yieldPercent === null) {
    return null;
  }

  // Неполная закладка на партию готового продукта — не себестоимость.
  if (
    compositionGrams(recipe.lines) !==
    inputGramsForFinishedBatch(recipe.yieldPercent, recipe.batchSize)
  ) {
    return null;
  }

  const next = new Set(stack);
  next.add(derivativeId);
  let total = zeroPair();

  for (const line of recipe.lines) {
    const price = componentPrices(document, line, next);
    if (!price) {
      return null;
    }

    total = addPair(total, {
      withVat: finishedKilogramPart(line.quantityGrams, price.withVat, recipe.batchSize),
      exVat: finishedKilogramPart(line.quantityGrams, price.exVat, recipe.batchSize),
    });
  }

  return total;
}

/**
 * Себестоимость 1 шт конечного товара.
 * `Rec&Calc Final Products!G160 = количество на партию / batchSize * цена`.
 * Выход после обработки в эту формулу не входит. Цена берётся и с НДС, и без НДС.
 */
function costPerPiece(
  document: PrototypeDocument,
  derivativeId: string,
  stack: ReadonlySet<string>,
): PricePair | null {
  if (stack.has(derivativeId)) {
    return null;
  }

  const derivative = document.derivatives.find((item) => item.id === derivativeId);
  if (!derivative || !derivative.isFinalProduct) {
    return null;
  }

  const recipe = activeRecipeFor(document, derivativeId);
  if (!recipe) {
    return null;
  }

  const next = new Set(stack);
  next.add(derivativeId);
  let total = zeroPair();

  for (const line of recipe.lines) {
    const price = componentPrices(document, line, next);
    if (!price) {
      return null;
    }

    total = addPair(total, {
      withVat: finalLinePart(document, line, price.withVat, recipe.batchSize),
      exVat: finalLinePart(document, line, price.exVat, recipe.batchSize),
    });
  }

  return total;
}

function unitCostPair(
  document: PrototypeDocument,
  derivativeId: string,
): { pair: PricePair; per: CostPer } | null {
  const derivative = document.derivatives.find((item) => item.id === derivativeId);
  if (!derivative) {
    return null;
  }

  if (derivative.isFinalProduct) {
    const value = costPerPiece(document, derivativeId, new Set());
    return value ? { pair: value, per: "piece" } : null;
  }

  const value = costPerKilogram(document, derivativeId, new Set());
  return value ? { pair: value, per: "kg" } : null;
}

function roundPair(pair: PricePair): Omit<UnitCost, "per"> | null {
  const withVatKopecks = roundHalfUpKopecks(pair.withVat);
  const exVatKopecks = roundHalfUpKopecks(pair.exVat);
  if (withVatKopecks === null || exVatKopecks === null) {
    return null;
  }

  return { withVatKopecks, exVatKopecks };
}

/** Себестоимость единицы для экрана. В документ не записывается. */
export function unitCost(
  document: PrototypeDocument,
  derivativeId: string,
): UnitCost | null {
  const value = unitCostPair(document, derivativeId);
  if (!value) {
    return null;
  }

  const rounded = roundPair(value.pair);
  return rounded ? { ...rounded, per: value.per } : null;
}

/** Вклад строки в себестоимость 1 кг или 1 шт. Считается и с НДС, и без НДС. */
export function lineContribution(
  document: PrototypeDocument,
  derivativeId: string,
  lineId: string,
): LineContribution | null {
  const derivative = document.derivatives.find((item) => item.id === derivativeId);
  const recipe = derivative ? activeRecipeFor(document, derivativeId) : null;
  const line = recipe?.lines.find((item) => item.id === lineId);
  if (!derivative || !recipe || !line) {
    return null;
  }

  const price = componentPrices(document, line, new Set([derivativeId]));
  if (!price) {
    return null;
  }

  const part = derivative.isFinalProduct
    ? {
        withVat: finalLinePart(document, line, price.withVat, recipe.batchSize),
        exVat: finalLinePart(document, line, price.exVat, recipe.batchSize),
      }
    : {
        withVat: finishedKilogramPart(
          line.quantityGrams,
          price.withVat,
          recipe.batchSize,
        ),
        exVat: finishedKilogramPart(line.quantityGrams, price.exVat, recipe.batchSize),
      };

  return roundPair(part);
}
