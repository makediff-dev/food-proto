import { MAX_PRICE_PER_KILOGRAM_KOPECKS, MAX_WEIGHT_GRAMS } from "@/domain/units";

export const SCHEMA_VERSION = 16 as const;

export const MAX_LABEL_LENGTH = 200;

export const MAX_ID_LENGTH = 80;

/** Потолок объёма плана, штуки. Произведение с ценой остаётся безопасным целым. */
export const MAX_VOLUME_PIECES = 100_000_000;

export const MIN_VAT_PERCENT = 0;

export const MAX_VAT_PERCENT = 100;

export const MIN_YIELD_PERCENT = 1;

export const MAX_YIELD_PERCENT = 100;

const DELETION_MARK = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

/**
 * Общие поля учёта. Удаление не вырезает запись: `deletedAt` — ISO-время,
 * `null` — запись в работе. Так же устроены все будущие сущности.
 */
export interface DeletableRecord {
  id: string;
  name: string;
  deletedAt: string | null;
}

/** Цех производит производные и товары. У товара и у производной один цех. */
export type Workshop = DeletableRecord;

/** Склад хранит сырьё, производные и товары. У каждой такой позиции один склад. */
export type Warehouse = DeletableRecord;

/** Килограммы или штуки. Штуки в граммы не переводятся. */
export type MaterialUnit = "kg" | "piece";

/** Сырьё. Цена без НДС в документ не пишется: `DSM Meat!J8`. */
export interface RawMaterial extends DeletableRecord {
  /** Бренд, производитель. Справочно, на себестоимость не влияет. `DSM Meat!D`. */
  brand: string;
  warehouseId: string;
  unit: MaterialUnit;
  /** Плановая цена закупки с НДС, копейки за 1 кг или за 1 шт. `DSM Meat!H`. */
  priceWithVatKopecks: number;
  /** НДС, целые проценты. `DSM Meat!F`. */
  vatPercent: number;
  /**
   * Минимальный нормативный остаток.
   * Килограммы — целые граммы, штуки — целые штуки. Штуки в граммы не переводить.
   * `DSM Meat!DU`, `DSM Bakery!DU`, `DSM Vegetables!DU`, у упаковки `DSM Packaging!DL`.
   */
  minNormStock: number;
  /** Максимальный нормативный остаток. `DV` на тех же листах, у упаковки `DM`. */
  maxNormStock: number;
}

/**
 * Производная или конечный товар.
 * Конечный товар в состав других рецептурных карт не входит.
 */
export interface Derivative extends DeletableRecord {
  isFinalProduct: boolean;
  warehouseId: string;
  workshopId: string;
  /**
   * НДС продажи, целые проценты. Только у конечного товара: `Svod!N`.
   * У производной `null`: выручку планируют по товару.
   */
  vatPercent: number | null;
}

export type RecipeComponentKind = "material" | "derivative";

/** Строка состава. Это часть карты, отдельной учётной сущностью не считается. */
export interface RecipeLine {
  id: string;
  kind: RecipeComponentKind;
  refId: string;
  /**
   * Количество на партию карты.
   * Килограммы хранятся граммами: производная — на 100 кг готового продукта,
   * товар — на 1000 шт. Штучное сырьё — целыми штуками на 1000 шт товара.
   */
  quantityGrams: number;
}

/**
 * Рецептурная карта производной или конечного товара.
 * Выход есть только у производной: `Rec&Calc Meat!D`. У конечного товара `null`.
 */
export interface RecipeCard {
  id: string;
  derivativeId: string;
  yieldPercent: number | null;
  lines: RecipeLine[];
  deletedAt: string | null;
}

/**
 * Строка поставки. Часть документа, не отдельная учётная сущность.
 * Ставка НДС копируется с сырья в момент записи и дальше не едет за справочником.
 */
export interface DeliveryLine {
  id: string;
  materialId: string;
  /** Килограммы — целые граммы, штуки — целые штуки. */
  quantity: number;
  /** Реальная себестоимость с НДС, копейки за 1 кг или за 1 шт. */
  priceWithVatKopecks: number;
  /** НДС этой поставки, целые проценты. */
  vatPercent: number;
}

/** Поставка сырья на один склад. Итог в документ не пишется. */
export interface Delivery {
  id: string;
  warehouseId: string;
  /** Календарный день, `ГГГГ-ММ-ДД`. */
  occurredOn: string;
  note: string;
  lines: DeliveryLine[];
  deletedAt: string | null;
}

/** Строка списания. Вид `derivative` покрывает и производную, и конечный товар. */
export interface WriteOffLine {
  id: string;
  kind: RecipeComponentKind;
  refId: string;
  /** Килограммы — целые граммы, штуки — целые штуки. */
  quantity: number;
}

/** Списание с одного склада. Потенциальный убыток в документ не пишется. */
export interface WriteOff {
  id: string;
  warehouseId: string;
  occurredOn: string;
  note: string;
  lines: WriteOffLine[];
  deletedAt: string | null;
}

/** Строка плана продаж. Цена без НДС, выручка и Т-проток в документ не пишутся. */
export interface SalesPlanLine {
  id: string;
  /** Конечный товар. Ссылка живёт и после удаления товара. */
  productId: string;
  /** Цена с НДС, копейки за 1 шт. `Svod!F`. */
  priceWithVatKopecks: number;
  /** Объём продаж, шт. `Svod!H`. */
  volumePieces: number;
}

/** План продаж на календарный месяц. На один месяц — один рабочий план. */
export interface SalesPlan {
  id: string;
  /** `ГГГГ-ММ`. */
  month: string;
  lines: SalesPlanLine[];
  deletedAt: string | null;
}

/**
 * Фактический расход ингредиента. Часть выпуска, не отдельная учётная сущность.
 * Количество вводится вручную и не следует за нормой рецепта.
 */
export interface ProductionFactUse {
  id: string;
  kind: RecipeComponentKind;
  refId: string;
  /** Килограммы — целые граммы, штуки — целые штуки. Ноль допустим. */
  quantity: number;
}

/** Фактический выпуск одной позиции за день. Часть записи дня. */
export interface ProductionFactOutput {
  id: string;
  /** Конечный товар или производная. Одна позиция в дне один раз. */
  refId: string;
  /** Товар — штуки, производная — граммы. Больше нуля. */
  quantity: number;
  uses: ProductionFactUse[];
}

/** Факт производства за календарный день. На одну дату — одна рабочая запись. */
export interface ProductionFact {
  id: string;
  /** Календарный день, `ГГГГ-ММ-ДД`. */
  occurredOn: string;
  note: string;
  outputs: ProductionFactOutput[];
  deletedAt: string | null;
}

/**
 * Единственный сохраняемый документ прототипа.
 * Предметные разделы добавляются полями сюда. Производные суммы сюда не писать.
 */
export interface PrototypeDocument {
  schemaVersion: typeof SCHEMA_VERSION;
  workshops: Workshop[];
  warehouses: Warehouse[];
  materials: RawMaterial[];
  derivatives: Derivative[];
  recipes: RecipeCard[];
  deliveries: Delivery[];
  writeOffs: WriteOff[];
  salesPlans: SalesPlan[];
  productionFacts: ProductionFact[];
}

/** Метка мягкого удаления, которую пишет экран через `Date.toISOString()`. */
export function isDeletionMark(value: string): boolean {
  return DELETION_MARK.test(value);
}

const OCCURRED_ON = /^(\d{4})-(\d{2})-(\d{2})$/;
const MONTH_KEY = /^(\d{4})-(\d{2})$/;

/** Календарный день поставки или списания. Время суток не хранится. */
export function isOccurredOn(value: string): boolean {
  const match = OCCURRED_ON.exec(value);
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/** Календарный месяц плана, `ГГГГ-ММ`. */
export function isMonthKey(value: string): boolean {
  const match = MONTH_KEY.exec(value);
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  return year >= 2000 && year <= 2100 && month >= 1 && month <= 12;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parsePlace(value: unknown): DeletableRecord | null {
  if (!isRecord(value)) {
    return null;
  }

  const { id, name, deletedAt } = value;

  if (
    typeof id !== "string" ||
    id.length === 0 ||
    id.length > MAX_ID_LENGTH ||
    id !== id.trim()
  ) {
    return null;
  }

  if (
    typeof name !== "string" ||
    name.length > MAX_LABEL_LENGTH ||
    name.trim().length === 0
  ) {
    return null;
  }

  if (
    deletedAt !== null &&
    (typeof deletedAt !== "string" || !isDeletionMark(deletedAt))
  ) {
    return null;
  }

  return { id, name, deletedAt };
}

function parsePlaceList(value: unknown): DeletableRecord[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const seen = new Set<string>();
  const items: DeletableRecord[] = [];

  for (const entry of value) {
    const place = parsePlace(entry);
    if (!place || seen.has(place.id)) {
      return null;
    }

    seen.add(place.id);
    items.push(place);
  }

  return items;
}

function parseId(value: unknown): string | null {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value.length > MAX_ID_LENGTH ||
    value !== value.trim()
  ) {
    return null;
  }

  return value;
}

function parseDeletedAt(value: unknown): string | null | undefined {
  if (value === null) {
    return null;
  }

  if (typeof value === "string" && isDeletionMark(value)) {
    return value;
  }

  return undefined;
}

function parseInteger(value: unknown, min: number, max: number): number | null {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < min ||
    value > max
  ) {
    return null;
  }

  return value;
}

function uniqueActiveNames(items: readonly DeletableRecord[]): boolean {
  const seen = new Set<string>();

  for (const item of items) {
    if (item.deletedAt !== null) {
      continue;
    }

    const key = item.name.trim().toLocaleLowerCase("ru-RU");
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
  }

  return true;
}

function parseMaterial(
  value: unknown,
  warehouseIds: ReadonlySet<string>,
): RawMaterial | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = parseId(value.id);
  const deletedAt = parseDeletedAt(value.deletedAt);
  const warehouseId = parseId(value.warehouseId);
  const priceWithVatKopecks = parseInteger(
    value.priceWithVatKopecks,
    0,
    MAX_PRICE_PER_KILOGRAM_KOPECKS,
  );
  const vatPercent = parseInteger(value.vatPercent, MIN_VAT_PERCENT, MAX_VAT_PERCENT);

  if (
    !id ||
    deletedAt === undefined ||
    typeof value.name !== "string" ||
    value.name.length > MAX_LABEL_LENGTH ||
    value.name.trim().length === 0 ||
    typeof value.brand !== "string" ||
    value.brand.length > MAX_LABEL_LENGTH ||
    !warehouseId ||
    !warehouseIds.has(warehouseId) ||
    (value.unit !== "kg" && value.unit !== "piece") ||
    priceWithVatKopecks === null ||
    vatPercent === null
  ) {
    return null;
  }

  const minNormStock = parseInteger(value.minNormStock, 0, MAX_WEIGHT_GRAMS);
  const maxNormStock = parseInteger(value.maxNormStock, 0, MAX_WEIGHT_GRAMS);
  if (minNormStock === null || maxNormStock === null || minNormStock > maxNormStock) {
    return null;
  }

  return {
    id,
    name: value.name,
    brand: value.brand,
    warehouseId,
    unit: value.unit,
    priceWithVatKopecks,
    vatPercent,
    minNormStock,
    maxNormStock,
    deletedAt,
  };
}

function parseDerivative(
  value: unknown,
  warehouseIds: ReadonlySet<string>,
  workshopIds: ReadonlySet<string>,
): Derivative | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = parseId(value.id);
  const deletedAt = parseDeletedAt(value.deletedAt);
  const warehouseId = parseId(value.warehouseId);
  const workshopId = parseId(value.workshopId);

  if (
    !id ||
    deletedAt === undefined ||
    typeof value.name !== "string" ||
    value.name.length > MAX_LABEL_LENGTH ||
    value.name.trim().length === 0 ||
    typeof value.isFinalProduct !== "boolean" ||
    !warehouseId ||
    !warehouseIds.has(warehouseId) ||
    !workshopId ||
    !workshopIds.has(workshopId)
  ) {
    return null;
  }

  const vatPercent = value.isFinalProduct
    ? parseInteger(value.vatPercent, MIN_VAT_PERCENT, MAX_VAT_PERCENT)
    : value.vatPercent === null
      ? null
      : undefined;
  if (vatPercent === undefined || (value.isFinalProduct && vatPercent === null)) {
    return null;
  }

  return {
    id,
    name: value.name,
    isFinalProduct: value.isFinalProduct,
    warehouseId,
    workshopId,
    vatPercent,
    deletedAt,
  };
}

function parseRecipeLine(value: unknown): RecipeLine | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = parseId(value.id);
  const refId = parseId(value.refId);
  const quantityGrams = parseInteger(value.quantityGrams, 1, MAX_WEIGHT_GRAMS);

  if (
    !id ||
    !refId ||
    quantityGrams === null ||
    (value.kind !== "material" && value.kind !== "derivative")
  ) {
    return null;
  }

  return {
    id,
    kind: value.kind,
    refId,
    quantityGrams,
  };
}

function parseRecipe(
  value: unknown,
  derivativeIds: ReadonlySet<string>,
): RecipeCard | null {
  if (!isRecord(value) || !Array.isArray(value.lines)) {
    return null;
  }

  const id = parseId(value.id);
  const derivativeId = parseId(value.derivativeId);
  const deletedAt = parseDeletedAt(value.deletedAt);

  if (
    !id ||
    !derivativeId ||
    !derivativeIds.has(derivativeId) ||
    deletedAt === undefined
  ) {
    return null;
  }

  let yieldPercent: number | null;
  if (value.yieldPercent === null) {
    yieldPercent = null;
  } else {
    const parsed = parseInteger(value.yieldPercent, MIN_YIELD_PERCENT, MAX_YIELD_PERCENT);
    if (parsed === null) {
      return null;
    }
    yieldPercent = parsed;
  }

  const seenLines = new Set<string>();
  const seenRefs = new Set<string>();
  const lines: RecipeLine[] = [];

  for (const entry of value.lines) {
    const line = parseRecipeLine(entry);
    if (!line || seenLines.has(line.id) || seenRefs.has(`${line.kind}:${line.refId}`)) {
      return null;
    }

    seenLines.add(line.id);
    seenRefs.add(`${line.kind}:${line.refId}`);
    lines.push(line);
  }

  return { id, derivativeId, yieldPercent, lines, deletedAt };
}

function recipesMatchDerivatives(
  recipes: readonly RecipeCard[],
  derivatives: readonly Derivative[],
  materialIds: ReadonlySet<string>,
): boolean {
  const derivativeById = new Map(derivatives.map((item) => [item.id, item]));
  const activeByDerivative = new Set<string>();

  for (const recipe of recipes) {
    const derivative = derivativeById.get(recipe.derivativeId);
    if (!derivative) {
      return false;
    }

    if (derivative.isFinalProduct !== (recipe.yieldPercent === null)) {
      return false;
    }

    if (recipe.deletedAt === null) {
      if (activeByDerivative.has(recipe.derivativeId)) {
        return false;
      }
      activeByDerivative.add(recipe.derivativeId);
    }

    for (const line of recipe.lines) {
      if (line.kind === "material") {
        if (!materialIds.has(line.refId)) {
          return false;
        }
        continue;
      }

      const component = derivativeById.get(line.refId);
      if (!component || component.isFinalProduct) {
        return false;
      }
    }
  }

  return !recipeGraphHasCycle(recipes);
}

function recipeGraphHasCycle(recipes: readonly RecipeCard[]): boolean {
  const active = new Map<string, RecipeCard>();
  for (const recipe of recipes) {
    if (recipe.deletedAt === null) {
      active.set(recipe.derivativeId, recipe);
    }
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();

  function walk(derivativeId: string): boolean {
    if (visited.has(derivativeId)) {
      return false;
    }
    if (visiting.has(derivativeId)) {
      return true;
    }

    visiting.add(derivativeId);
    const recipe = active.get(derivativeId);
    if (recipe) {
      for (const line of recipe.lines) {
        if (line.kind === "derivative" && walk(line.refId)) {
          return true;
        }
      }
    }
    visiting.delete(derivativeId);
    visited.add(derivativeId);
    return false;
  }

  for (const derivativeId of active.keys()) {
    if (walk(derivativeId)) {
      return true;
    }
  }

  return false;
}

function parseNamedList<T extends DeletableRecord>(
  value: unknown,
  parseItem: (entry: unknown) => T | null,
): T[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const seen = new Set<string>();
  const items: T[] = [];

  for (const entry of value) {
    const item = parseItem(entry);
    if (!item || seen.has(item.id)) {
      return null;
    }

    seen.add(item.id);
    items.push(item);
  }

  if (!uniqueActiveNames(items)) {
    return null;
  }

  return items;
}

function parseDeliveryLine(
  value: unknown,
  materialIds: ReadonlySet<string>,
): DeliveryLine | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = parseId(value.id);
  const materialId = parseId(value.materialId);
  const quantity = parseInteger(value.quantity, 1, MAX_WEIGHT_GRAMS);
  const priceWithVatKopecks = parseInteger(
    value.priceWithVatKopecks,
    0,
    MAX_PRICE_PER_KILOGRAM_KOPECKS,
  );
  const vatPercent = parseInteger(value.vatPercent, MIN_VAT_PERCENT, MAX_VAT_PERCENT);

  if (
    !id ||
    !materialId ||
    !materialIds.has(materialId) ||
    quantity === null ||
    priceWithVatKopecks === null ||
    vatPercent === null
  ) {
    return null;
  }

  return { id, materialId, quantity, priceWithVatKopecks, vatPercent };
}

function parseDelivery(
  value: unknown,
  warehouseIds: ReadonlySet<string>,
  materialIds: ReadonlySet<string>,
): Delivery | null {
  if (!isRecord(value) || !Array.isArray(value.lines)) {
    return null;
  }

  const id = parseId(value.id);
  const warehouseId = parseId(value.warehouseId);
  const deletedAt = parseDeletedAt(value.deletedAt);

  if (
    !id ||
    !warehouseId ||
    !warehouseIds.has(warehouseId) ||
    deletedAt === undefined ||
    typeof value.occurredOn !== "string" ||
    !isOccurredOn(value.occurredOn) ||
    typeof value.note !== "string" ||
    value.note.length > MAX_LABEL_LENGTH
  ) {
    return null;
  }

  const seenLines = new Set<string>();
  const seenMaterials = new Set<string>();
  const lines: DeliveryLine[] = [];

  for (const entry of value.lines) {
    const line = parseDeliveryLine(entry, materialIds);
    if (!line || seenLines.has(line.id) || seenMaterials.has(line.materialId)) {
      return null;
    }

    seenLines.add(line.id);
    seenMaterials.add(line.materialId);
    lines.push(line);
  }

  return {
    id,
    warehouseId,
    occurredOn: value.occurredOn,
    note: value.note,
    lines,
    deletedAt,
  };
}

function parseWriteOffLine(
  value: unknown,
  materialIds: ReadonlySet<string>,
  derivativeIds: ReadonlySet<string>,
): WriteOffLine | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = parseId(value.id);
  const refId = parseId(value.refId);
  const quantity = parseInteger(value.quantity, 1, MAX_WEIGHT_GRAMS);

  if (
    !id ||
    !refId ||
    quantity === null ||
    (value.kind !== "material" && value.kind !== "derivative")
  ) {
    return null;
  }

  if (value.kind === "material" && !materialIds.has(refId)) {
    return null;
  }

  if (value.kind === "derivative" && !derivativeIds.has(refId)) {
    return null;
  }

  return { id, kind: value.kind, refId, quantity };
}

function parseWriteOff(
  value: unknown,
  warehouseIds: ReadonlySet<string>,
  materialIds: ReadonlySet<string>,
  derivativeIds: ReadonlySet<string>,
): WriteOff | null {
  if (!isRecord(value) || !Array.isArray(value.lines)) {
    return null;
  }

  const id = parseId(value.id);
  const warehouseId = parseId(value.warehouseId);
  const deletedAt = parseDeletedAt(value.deletedAt);

  if (
    !id ||
    !warehouseId ||
    !warehouseIds.has(warehouseId) ||
    deletedAt === undefined ||
    typeof value.occurredOn !== "string" ||
    !isOccurredOn(value.occurredOn) ||
    typeof value.note !== "string" ||
    value.note.length > MAX_LABEL_LENGTH
  ) {
    return null;
  }

  const seenLines = new Set<string>();
  const seenRefs = new Set<string>();
  const lines: WriteOffLine[] = [];

  for (const entry of value.lines) {
    const line = parseWriteOffLine(entry, materialIds, derivativeIds);
    if (!line || seenLines.has(line.id) || seenRefs.has(`${line.kind}:${line.refId}`)) {
      return null;
    }

    seenLines.add(line.id);
    seenRefs.add(`${line.kind}:${line.refId}`);
    lines.push(line);
  }

  return {
    id,
    warehouseId,
    occurredOn: value.occurredOn,
    note: value.note,
    lines,
    deletedAt,
  };
}

function parseMovementList<T extends { id: string }>(
  value: unknown,
  parseItem: (entry: unknown) => T | null,
): T[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const seen = new Set<string>();
  const items: T[] = [];

  for (const entry of value) {
    const item = parseItem(entry);
    if (!item || seen.has(item.id)) {
      return null;
    }

    seen.add(item.id);
    items.push(item);
  }

  return items;
}

function fitsSafeKopeckProduct(priceKopecks: number, volume: number): boolean {
  return BigInt(priceKopecks) * BigInt(volume) <= BigInt(Number.MAX_SAFE_INTEGER);
}

function parseSalesPlanLine(
  value: unknown,
  derivativeIds: ReadonlySet<string>,
): SalesPlanLine | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = parseId(value.id);
  const productId = parseId(value.productId);
  const priceWithVatKopecks = parseInteger(
    value.priceWithVatKopecks,
    0,
    MAX_PRICE_PER_KILOGRAM_KOPECKS,
  );
  const volumePieces = parseInteger(value.volumePieces, 0, MAX_VOLUME_PIECES);

  if (
    !id ||
    !productId ||
    !derivativeIds.has(productId) ||
    priceWithVatKopecks === null ||
    volumePieces === null ||
    !fitsSafeKopeckProduct(priceWithVatKopecks, volumePieces)
  ) {
    return null;
  }

  return { id, productId, priceWithVatKopecks, volumePieces };
}

function parseSalesPlan(
  value: unknown,
  derivativeIds: ReadonlySet<string>,
): SalesPlan | null {
  if (!isRecord(value) || !Array.isArray(value.lines)) {
    return null;
  }

  const id = parseId(value.id);
  const deletedAt = parseDeletedAt(value.deletedAt);

  if (
    !id ||
    deletedAt === undefined ||
    typeof value.month !== "string" ||
    !isMonthKey(value.month)
  ) {
    return null;
  }

  const seenLines = new Set<string>();
  const seenProducts = new Set<string>();
  const lines: SalesPlanLine[] = [];

  for (const entry of value.lines) {
    const line = parseSalesPlanLine(entry, derivativeIds);
    if (!line || seenLines.has(line.id) || seenProducts.has(line.productId)) {
      return null;
    }

    seenLines.add(line.id);
    seenProducts.add(line.productId);
    lines.push(line);
  }

  return { id, month: value.month, lines, deletedAt };
}

function parseSalesPlans(
  value: unknown,
  derivativeIds: ReadonlySet<string>,
): SalesPlan[] | null {
  const plans = parseMovementList(value, (entry) => parseSalesPlan(entry, derivativeIds));
  if (!plans) {
    return null;
  }

  const activeMonths = new Set<string>();
  for (const plan of plans) {
    if (plan.deletedAt !== null) {
      continue;
    }
    if (activeMonths.has(plan.month)) {
      return null;
    }
    activeMonths.add(plan.month);
  }

  return plans;
}

function parseProductionFactUse(
  value: unknown,
  materialIds: ReadonlySet<string>,
  derivatives: readonly Derivative[],
): ProductionFactUse | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = parseId(value.id);
  const refId = parseId(value.refId);
  const quantity = parseInteger(value.quantity, 0, MAX_WEIGHT_GRAMS);

  if (
    !id ||
    !refId ||
    quantity === null ||
    (value.kind !== "material" && value.kind !== "derivative")
  ) {
    return null;
  }

  if (value.kind === "material") {
    if (!materialIds.has(refId)) {
      return null;
    }
  } else {
    const component = derivatives.find((item) => item.id === refId);
    if (!component || component.isFinalProduct) {
      return null;
    }
  }

  return { id, kind: value.kind, refId, quantity };
}

function parseProductionFactOutput(
  value: unknown,
  materialIds: ReadonlySet<string>,
  derivatives: readonly Derivative[],
): ProductionFactOutput | null {
  if (!isRecord(value) || !Array.isArray(value.uses)) {
    return null;
  }

  const id = parseId(value.id);
  const refId = parseId(value.refId);
  const owner = derivatives.find((item) => item.id === refId);
  const quantityMax = owner?.isFinalProduct ? MAX_VOLUME_PIECES : MAX_WEIGHT_GRAMS;
  const quantity = parseInteger(value.quantity, 1, quantityMax);

  if (!id || !refId || !owner || quantity === null) {
    return null;
  }

  const seenUses = new Set<string>();
  const seenRefs = new Set<string>();
  const uses: ProductionFactUse[] = [];

  for (const entry of value.uses) {
    const use = parseProductionFactUse(entry, materialIds, derivatives);
    if (!use || seenUses.has(use.id) || seenRefs.has(`${use.kind}:${use.refId}`)) {
      return null;
    }

    seenUses.add(use.id);
    seenRefs.add(`${use.kind}:${use.refId}`);
    uses.push(use);
  }

  return { id, refId, quantity, uses };
}

function parseProductionFact(
  value: unknown,
  materialIds: ReadonlySet<string>,
  derivatives: readonly Derivative[],
): ProductionFact | null {
  if (!isRecord(value) || !Array.isArray(value.outputs)) {
    return null;
  }

  const id = parseId(value.id);
  const deletedAt = parseDeletedAt(value.deletedAt);

  if (
    !id ||
    deletedAt === undefined ||
    typeof value.occurredOn !== "string" ||
    !isOccurredOn(value.occurredOn) ||
    typeof value.note !== "string" ||
    value.note.length > MAX_LABEL_LENGTH
  ) {
    return null;
  }

  const seenOutputs = new Set<string>();
  const seenRefs = new Set<string>();
  const outputs: ProductionFactOutput[] = [];

  for (const entry of value.outputs) {
    const output = parseProductionFactOutput(entry, materialIds, derivatives);
    if (!output || seenOutputs.has(output.id) || seenRefs.has(output.refId)) {
      return null;
    }

    seenOutputs.add(output.id);
    seenRefs.add(output.refId);
    outputs.push(output);
  }

  return {
    id,
    occurredOn: value.occurredOn,
    note: value.note,
    outputs,
    deletedAt,
  };
}

function parseProductionFacts(
  value: unknown,
  materialIds: ReadonlySet<string>,
  derivatives: readonly Derivative[],
): ProductionFact[] | null {
  const facts = parseMovementList(value, (entry) =>
    parseProductionFact(entry, materialIds, derivatives),
  );
  if (!facts) {
    return null;
  }

  const activeDates = new Set<string>();
  for (const fact of facts) {
    if (fact.deletedAt !== null) {
      continue;
    }
    if (activeDates.has(fact.occurredOn)) {
      return null;
    }
    activeDates.add(fact.occurredOn);
  }

  return facts;
}

/** Собирает документ только из известных полей. Чужие ключи отбрасываются. */
export function parsePrototypeDocument(value: unknown): PrototypeDocument | null {
  if (!isRecord(value) || value.schemaVersion !== SCHEMA_VERSION) {
    return null;
  }

  const workshops = parsePlaceList(value.workshops);
  const warehouses = parsePlaceList(value.warehouses);
  if (!workshops || !warehouses) {
    return null;
  }

  const warehouseIds = new Set(warehouses.map((item) => item.id));
  const workshopIds = new Set(workshops.map((item) => item.id));
  const materials = parseNamedList(value.materials, (entry) =>
    parseMaterial(entry, warehouseIds),
  );
  const derivatives = parseNamedList(value.derivatives, (entry) =>
    parseDerivative(entry, warehouseIds, workshopIds),
  );

  if (!materials || !derivatives) {
    return null;
  }

  if (!Array.isArray(value.recipes)) {
    return null;
  }

  const derivativeIds = new Set(derivatives.map((item) => item.id));
  const materialIds = new Set(materials.map((item) => item.id));
  const seenRecipes = new Set<string>();
  const recipes: RecipeCard[] = [];

  for (const entry of value.recipes) {
    const recipe = parseRecipe(entry, derivativeIds);
    if (!recipe || seenRecipes.has(recipe.id)) {
      return null;
    }

    seenRecipes.add(recipe.id);
    recipes.push(recipe);
  }

  if (!recipesMatchDerivatives(recipes, derivatives, materialIds)) {
    return null;
  }

  const deliveries = parseMovementList(value.deliveries, (entry) =>
    parseDelivery(entry, warehouseIds, materialIds),
  );
  const writeOffs = parseMovementList(value.writeOffs, (entry) =>
    parseWriteOff(entry, warehouseIds, materialIds, derivativeIds),
  );

  const salesPlans = parseSalesPlans(value.salesPlans, derivativeIds);
  const productionFacts = parseProductionFacts(
    value.productionFacts,
    materialIds,
    derivatives,
  );

  if (!deliveries || !writeOffs || !salesPlans || !productionFacts) {
    return null;
  }

  return {
    schemaVersion: SCHEMA_VERSION,
    workshops,
    warehouses,
    materials,
    derivatives,
    recipes,
    deliveries,
    writeOffs,
    salesPlans,
    productionFacts,
  };
}
