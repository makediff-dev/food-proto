import { MAX_PRICE_PER_KILOGRAM_KOPECKS, MAX_WEIGHT_GRAMS } from "@/domain/units";

export const SCHEMA_VERSION = 20 as const;

export const MAX_LABEL_LENGTH = 200;

export const MAX_ID_LENGTH = 80;

/** Потолок объёма плана, штуки. Произведение с ценой остаётся безопасным целым. */
export const MAX_VOLUME_PIECES = 100_000_000;

/**
 * Потолок суммы операционных расходов, копейки.
 * На своде одна сумма за месяц, без построчного разбиения листа Operation Expense.
 */
export const MAX_OPERATING_EXPENSE_KOPECKS = 100_000_000_000;

/** Ставка налога на прибыль, %. `Svod!C6`. */
export const PROFIT_TAX_PERCENT = 20;

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
  /**
   * Вес одной штуки, целые граммы. Только у производной.
   * У конечного товара `null`: штуки товара — база закладки карты, не граммы.
   */
  pieceWeightGrams: number | null;
}

export type RecipeComponentKind = "material" | "derivative";

/** Строка состава. Это часть карты, отдельной учётной сущностью не считается. */
export interface RecipeLine {
  id: string;
  kind: RecipeComponentKind;
  refId: string;
  /**
   * Количество на партию карты (`batchSize`).
   * Килограммы хранятся граммами. Штучное сырьё у товара — целыми штуками.
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
  /**
   * База закладки: у производной — граммы готового выхода, у товара — штуки.
   * По умолчанию 100 кг или 1000 шт.
   */
  batchSize: number;
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
 * Остаток на 1-е число месяца. Целые штуки, включая отрицательные.
 * Со 2-го числа начало не хранится: его даёт конец предыдущего дня.
 */
export interface SalesFactOpening {
  id: string;
  productId: string;
  /** На производстве, шт. */
  productionPieces: number;
  /** На РЦ, шт. */
  distributionPieces: number;
}

/**
 * Серые клетки дня по товару. Выручка, цены без НДС и остатки сюда не пишутся.
 * Ноль допустим. Клетка из одних нулей в документ не попадает.
 */
export interface SalesFactCell {
  id: string;
  productId: string;
  /** Цена с НДС, копейки за 1 шт. */
  priceWithVatKopecks: number;
  /** Объём продаж, шт. */
  salesPieces: number;
  /** Объём производства, шт. Не читает факт производства. */
  outputPieces: number;
  /** Перемещение на РЦ, шт. */
  transferPieces: number;
  /** Питание сотрудников, шт. */
  staffMealsPieces: number;
  /** Образцы для клиентов, шт. */
  samplesPieces: number;
  /** Возвраты клиентов, шт. В выручку не входят. */
  returnsPieces: number;
  /** Списание, шт. Складской документ не создаёт. */
  writeOffPieces: number;
}

/** День месяца факта продаж. Пустой день в документ не пишется. */
export interface SalesFactDay {
  /** Календарный день этого месяца, `ГГГГ-ММ-ДД`. */
  occurredOn: string;
  cells: SalesFactCell[];
}

/**
 * Факт продаж на календарный месяц. Лист `Sales&Production`, не сводная строка.
 * На один месяц — одна рабочая запись. Следующий месяц из конца этого не продолжается.
 */
export interface SalesFact {
  id: string;
  /** `ГГГГ-ММ`. */
  month: string;
  openings: SalesFactOpening[];
  days: SalesFactDay[];
  deletedAt: string | null;
}

/**
 * Операционные расходы месяца одной суммой.
 * В книге это итог `Operation Expense!E62` / `F62` на своде `Svod!G4` / `I4`.
 * Сумма без НДС: прибыль = Т-проток − эта сумма.
 */
export interface MonthOperatingExpense {
  /** `ГГГГ-ММ`. На один месяц — одна запись. */
  month: string;
  /** Копейки без НДС. План. */
  planExVatKopecks: number;
  /** Копейки без НДС. Факт. */
  factExVatKopecks: number;
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
  salesFacts: SalesFact[];
  operatingExpenses: MonthOperatingExpense[];
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

  const pieceWeightGrams = value.isFinalProduct
    ? value.pieceWeightGrams === null
      ? null
      : undefined
    : parseInteger(value.pieceWeightGrams, 1, MAX_WEIGHT_GRAMS);
  if (
    pieceWeightGrams === undefined ||
    (!value.isFinalProduct && pieceWeightGrams === null)
  ) {
    return null;
  }

  return {
    id,
    name: value.name,
    isFinalProduct: value.isFinalProduct,
    warehouseId,
    workshopId,
    vatPercent,
    pieceWeightGrams,
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

  // У производной — граммы, у товара — штуки; потолок один.
  const batchSize = parseInteger(value.batchSize, 1, MAX_WEIGHT_GRAMS);
  if (batchSize === null) {
    return null;
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

  return { id, derivativeId, batchSize, yieldPercent, lines, deletedAt };
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

function parseOperatingExpense(value: unknown): MonthOperatingExpense | null {
  if (!isRecord(value)) {
    return null;
  }

  if (typeof value.month !== "string" || !isMonthKey(value.month)) {
    return null;
  }

  const planExVatKopecks = parseInteger(
    value.planExVatKopecks,
    0,
    MAX_OPERATING_EXPENSE_KOPECKS,
  );
  const factExVatKopecks = parseInteger(
    value.factExVatKopecks,
    0,
    MAX_OPERATING_EXPENSE_KOPECKS,
  );

  if (planExVatKopecks === null || factExVatKopecks === null) {
    return null;
  }

  return {
    month: value.month,
    planExVatKopecks,
    factExVatKopecks,
  };
}

function parseOperatingExpenses(value: unknown): MonthOperatingExpense[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const seen = new Set<string>();
  const items: MonthOperatingExpense[] = [];

  for (const entry of value) {
    const item = parseOperatingExpense(entry);
    if (!item || seen.has(item.month)) {
      return null;
    }

    seen.add(item.month);
    items.push(item);
  }

  return items;
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

function dateInMonth(date: string, month: string): boolean {
  return date.startsWith(`${month}-`) && isOccurredOn(date);
}

function parseSalesFactOpening(
  value: unknown,
  derivatives: readonly Derivative[],
): SalesFactOpening | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = parseId(value.id);
  const productId = parseId(value.productId);
  const product = derivatives.find((item) => item.id === productId);
  const productionPieces = parseInteger(
    value.productionPieces,
    -MAX_VOLUME_PIECES,
    MAX_VOLUME_PIECES,
  );
  const distributionPieces = parseInteger(
    value.distributionPieces,
    -MAX_VOLUME_PIECES,
    MAX_VOLUME_PIECES,
  );

  if (
    !id ||
    !productId ||
    !product?.isFinalProduct ||
    productionPieces === null ||
    distributionPieces === null ||
    (productionPieces === 0 && distributionPieces === 0)
  ) {
    return null;
  }

  return { id, productId, productionPieces, distributionPieces };
}

function parseSalesFactCell(
  value: unknown,
  derivatives: readonly Derivative[],
): SalesFactCell | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = parseId(value.id);
  const productId = parseId(value.productId);
  const product = derivatives.find((item) => item.id === productId);
  const priceWithVatKopecks = parseInteger(
    value.priceWithVatKopecks,
    0,
    MAX_PRICE_PER_KILOGRAM_KOPECKS,
  );
  const salesPieces = parseInteger(value.salesPieces, 0, MAX_VOLUME_PIECES);
  const outputPieces = parseInteger(value.outputPieces, 0, MAX_VOLUME_PIECES);
  const transferPieces = parseInteger(value.transferPieces, 0, MAX_VOLUME_PIECES);
  const staffMealsPieces = parseInteger(value.staffMealsPieces, 0, MAX_VOLUME_PIECES);
  const samplesPieces = parseInteger(value.samplesPieces, 0, MAX_VOLUME_PIECES);
  const returnsPieces = parseInteger(value.returnsPieces, 0, MAX_VOLUME_PIECES);
  const writeOffPieces = parseInteger(value.writeOffPieces, 0, MAX_VOLUME_PIECES);

  if (
    !id ||
    !productId ||
    !product?.isFinalProduct ||
    priceWithVatKopecks === null ||
    salesPieces === null ||
    outputPieces === null ||
    transferPieces === null ||
    staffMealsPieces === null ||
    samplesPieces === null ||
    returnsPieces === null ||
    writeOffPieces === null ||
    !fitsSafeKopeckProduct(priceWithVatKopecks, salesPieces)
  ) {
    return null;
  }

  const blank =
    priceWithVatKopecks === 0 &&
    salesPieces === 0 &&
    outputPieces === 0 &&
    transferPieces === 0 &&
    staffMealsPieces === 0 &&
    samplesPieces === 0 &&
    returnsPieces === 0 &&
    writeOffPieces === 0;
  if (blank) {
    return null;
  }

  return {
    id,
    productId,
    priceWithVatKopecks,
    salesPieces,
    outputPieces,
    transferPieces,
    staffMealsPieces,
    samplesPieces,
    returnsPieces,
    writeOffPieces,
  };
}

function parseSalesFactDay(
  value: unknown,
  month: string,
  derivatives: readonly Derivative[],
): SalesFactDay | null {
  if (!isRecord(value) || !Array.isArray(value.cells)) {
    return null;
  }

  if (typeof value.occurredOn !== "string" || !dateInMonth(value.occurredOn, month)) {
    return null;
  }

  const seenCells = new Set<string>();
  const seenProducts = new Set<string>();
  const cells: SalesFactCell[] = [];

  for (const entry of value.cells) {
    const cell = parseSalesFactCell(entry, derivatives);
    if (!cell || seenCells.has(cell.id) || seenProducts.has(cell.productId)) {
      return null;
    }

    seenCells.add(cell.id);
    seenProducts.add(cell.productId);
    cells.push(cell);
  }

  if (cells.length === 0) {
    return null;
  }

  return { occurredOn: value.occurredOn, cells };
}

function parseSalesFact(
  value: unknown,
  derivatives: readonly Derivative[],
): SalesFact | null {
  if (!isRecord(value) || !Array.isArray(value.openings) || !Array.isArray(value.days)) {
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

  const seenOpenings = new Set<string>();
  const seenOpeningProducts = new Set<string>();
  const openings: SalesFactOpening[] = [];

  for (const entry of value.openings) {
    const opening = parseSalesFactOpening(entry, derivatives);
    if (
      !opening ||
      seenOpenings.has(opening.id) ||
      seenOpeningProducts.has(opening.productId)
    ) {
      return null;
    }

    seenOpenings.add(opening.id);
    seenOpeningProducts.add(opening.productId);
    openings.push(opening);
  }

  const seenDays = new Set<string>();
  const seenCellIds = new Set<string>(seenOpenings);
  const days: SalesFactDay[] = [];

  for (const entry of value.days) {
    const day = parseSalesFactDay(entry, value.month, derivatives);
    if (!day || seenDays.has(day.occurredOn)) {
      return null;
    }

    for (const cell of day.cells) {
      if (seenCellIds.has(cell.id)) {
        return null;
      }
      seenCellIds.add(cell.id);
    }

    seenDays.add(day.occurredOn);
    days.push(day);
  }

  if (openings.length === 0 && days.length === 0) {
    return null;
  }

  return { id, month: value.month, openings, days, deletedAt };
}

function parseSalesFacts(
  value: unknown,
  derivatives: readonly Derivative[],
): SalesFact[] | null {
  const facts = parseMovementList(value, (entry) => parseSalesFact(entry, derivatives));
  if (!facts) {
    return null;
  }

  const activeMonths = new Set<string>();
  for (const fact of facts) {
    if (fact.deletedAt !== null) {
      continue;
    }
    if (activeMonths.has(fact.month)) {
      return null;
    }
    activeMonths.add(fact.month);
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
  const salesFacts = parseSalesFacts(value.salesFacts, derivatives);
  const operatingExpenses = parseOperatingExpenses(value.operatingExpenses);

  if (
    !deliveries ||
    !writeOffs ||
    !salesPlans ||
    !productionFacts ||
    !salesFacts ||
    !operatingExpenses
  ) {
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
    salesFacts,
    operatingExpenses,
  };
}
