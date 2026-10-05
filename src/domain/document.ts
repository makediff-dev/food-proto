import { fitsSafeMoneyProduct } from '@/domain/money';
import { MAX_PRICE_KOPECKS } from '@/domain/units';

export const SCHEMA_VERSION = 29 as const;

export const MAX_LABEL_LENGTH = 200;

export const MAX_ID_LENGTH = 80;

/** Потолок объёма плана, штуки. Произведение с ценой остаётся безопасным целым. */
export const MAX_VOLUME_PIECES = 100_000_000;

/**
 * Потолок суммы операционных расходов, копейки.
 * На своде одна сумма за месяц, без построчного разбиения листа Operation Expense.
 */
export const MAX_OPERATING_EXPENSE = 100_000_000_000;

/**
 * Потолок суммы строки продажи, копейки с НДС.
 * Это итог строки, не цена штуки.
 */
export const MAX_SALE_LINE_AMOUNT = 100_000_000_000;

/** Ставка налога на прибыль, %. `Svod!C6`. */
export const PROFIT_TAX_PERCENT = 20;

export const MIN_VAT_PERCENT = 0;

export const MAX_VAT_PERCENT = 100;

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

/** Категория ассортимента. Строка группы на `Svod`. Список только из мока. */
export interface ProductCategory {
  id: string;
  name: string;
}

/** Шесть категорий ритейла из `docs/domain.md`. Не добавляются и не удаляются. */
export const PRODUCT_CATEGORIES: ProductCategory[] = [
  { id: 'category-salads', name: 'Салаты' },
  { id: 'category-hot', name: 'Горячие блюда' },
  { id: 'category-rolls', name: 'Роллы и сэндвичи' },
  { id: 'category-breakfast', name: 'Завтраки' },
  { id: 'category-desserts', name: 'Десерты и выпечка' },
  { id: 'category-semifinished', name: 'Полуфабрикаты' },
];

export function catalogCategories(): ProductCategory[] {
  return PRODUCT_CATEGORIES.map((item) => ({ ...item }));
}

/** Конечный товар. Себестоимость единицы с НДС вводится на сводке. */
export interface Product extends DeletableRecord {
  /** Категория из справочника мока. */
  categoryId: string;
  /** НДС продажи, целые проценты. `Svod!N`. */
  vatPercent: number;
  /** Ручная себестоимость 1 шт с НДС, копейки. */
  unitCostWithVat: number;
}

/** Строка плана продаж. Цена без НДС, выручка и Т-проток в документ не пишутся. */
export interface SalesPlanLine {
  id: string;
  /** Конечный товар. Ссылка живёт и после удаления товара. */
  productId: string;
  /** Цена с НДС, копейки за 1 шт. `Svod!F`. */
  priceWithVat: number;
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
 * Серые клетки дня по товару, кроме продаж.
 * Цена и объём продаж считаются из журнала продаж и сюда не пишутся.
 * Выручка, цены без НДС и остатки сюда не пишутся.
 * Ноль допустим. Клетка из одних нулей в документ не попадает.
 */
export interface SalesFactCell {
  id: string;
  productId: string;
  /** Объём производства, шт. Ввод сетки факта продаж. */
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

/** Строка продажи. Цена штуки в документ не пишется. */
export interface SaleLine {
  id: string;
  /** Конечный товар. Ссылка живёт и после удаления товара. */
  productId: string;
  /** Объём, шт. От 1. */
  pieces: number;
  /** Сумма строки с НДС, копейки. */
  amountWithVat: number;
}

/**
 * Продажа заказчику за календарный день.
 * Имя заказчика не уникально. Пустая продажа без строк не пишется.
 */
export interface Sale {
  id: string;
  customerName: string;
  /** Календарный день, `ГГГГ-ММ-ДД`. */
  occurredOn: string;
  lines: SaleLine[];
  deletedAt: string | null;
}

/** День месяца факта продаж. Пустой день в документ не пишется. */
export interface SalesFactDay {
  /** Календарный день этого месяца, `ГГГГ-ММ-ДД`. */
  occurredOn: string;
  cells: SalesFactCell[];
}

/**
 * Факт продаж на календарный месяц. Лист `Sales&Production`, не сводная строка.
 * На один месяц — одна рабочая запись. Остатки в документ не пишутся:
 * их считает `src/domain/sales-fact.ts`.
 */
export interface SalesFact {
  id: string;
  /** `ГГГГ-ММ`. */
  month: string;
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
  planExVat: number;
  /** Копейки без НДС. Факт. */
  factExVat: number;
}

/**
 * Единственный сохраняемый документ прототипа.
 * Предметные разделы добавляются полями сюда. Производные суммы сюда не писать.
 */
export interface PrototypeDocument {
  schemaVersion: typeof SCHEMA_VERSION;
  categories: ProductCategory[];
  products: Product[];
  salesPlans: SalesPlan[];
  salesFacts: SalesFact[];
  sales: Sale[];
  operatingExpenses: MonthOperatingExpense[];
}

/** Метка мягкого удаления, которую пишет экран через `Date.toISOString()`. */
export function isDeletionMark(value: string): boolean {
  return DELETION_MARK.test(value);
}

const OCCURRED_ON = /^(\d{4})-(\d{2})-(\d{2})$/;
const MONTH_KEY = /^(\d{4})-(\d{2})$/;

/** Календарный день, `ГГГГ-ММ-ДД`. Время суток не хранится. */
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
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseId(value: unknown): string | null {
  if (
    typeof value !== 'string' ||
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

  if (typeof value === 'string' && isDeletionMark(value)) {
    return value;
  }

  return undefined;
}

function parseInteger(value: unknown, min: number, max: number): number | null {
  if (
    typeof value !== 'number' ||
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

    const key = item.name.trim().toLocaleLowerCase('ru-RU');
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
  }

  return true;
}

function parseCategory(value: unknown): ProductCategory | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = parseId(value.id);

  if (
    !id ||
    typeof value.name !== 'string' ||
    value.name.length > MAX_LABEL_LENGTH ||
    value.name.trim().length === 0
  ) {
    return null;
  }

  return { id, name: value.name };
}

/** Категории не правятся: в документе должен лежать справочник мока. */
function parseCatalogCategories(value: unknown): ProductCategory[] | null {
  if (!Array.isArray(value) || value.length !== PRODUCT_CATEGORIES.length) {
    return null;
  }

  for (let index = 0; index < PRODUCT_CATEGORIES.length; index += 1) {
    const expected = PRODUCT_CATEGORIES[index];
    const item = parseCategory(value[index]);
    if (
      !expected ||
      !item ||
      item.id !== expected.id ||
      item.name !== expected.name
    ) {
      return null;
    }
  }

  return catalogCategories();
}

function parseProduct(
  value: unknown,
  categoryIds: ReadonlySet<string>,
): Product | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = parseId(value.id);
  const categoryId = parseId(value.categoryId);
  const deletedAt = parseDeletedAt(value.deletedAt);
  const vatPercent = parseInteger(
    value.vatPercent,
    MIN_VAT_PERCENT,
    MAX_VAT_PERCENT,
  );
  const unitCostWithVat = parseInteger(
    value.unitCostWithVat,
    0,
    MAX_PRICE_KOPECKS,
  );

  if (
    !id ||
    !categoryId ||
    !categoryIds.has(categoryId) ||
    deletedAt === undefined ||
    typeof value.name !== 'string' ||
    value.name.length > MAX_LABEL_LENGTH ||
    value.name.trim().length === 0 ||
    vatPercent === null ||
    unitCostWithVat === null ||
    'isFinalProduct' in value ||
    'pieceWeightGrams' in value ||
    'workshopId' in value
  ) {
    return null;
  }

  return {
    id,
    name: value.name,
    categoryId,
    vatPercent,
    unitCostWithVat,
    deletedAt,
  };
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

function parseSalesPlanLine(
  value: unknown,
  productIds: ReadonlySet<string>,
): SalesPlanLine | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = parseId(value.id);
  const productId = parseId(value.productId);
  const priceWithVat = parseInteger(value.priceWithVat, 0, MAX_PRICE_KOPECKS);
  const volumePieces = parseInteger(value.volumePieces, 0, MAX_VOLUME_PIECES);

  if (
    !id ||
    !productId ||
    !productIds.has(productId) ||
    priceWithVat === null ||
    volumePieces === null ||
    !fitsSafeMoneyProduct(priceWithVat, volumePieces)
  ) {
    return null;
  }

  return { id, productId, priceWithVat, volumePieces };
}

function parseSalesPlan(
  value: unknown,
  productIds: ReadonlySet<string>,
): SalesPlan | null {
  if (!isRecord(value) || !Array.isArray(value.lines)) {
    return null;
  }

  const id = parseId(value.id);
  const deletedAt = parseDeletedAt(value.deletedAt);

  if (
    !id ||
    deletedAt === undefined ||
    typeof value.month !== 'string' ||
    !isMonthKey(value.month)
  ) {
    return null;
  }

  const seenLines = new Set<string>();
  const seenProducts = new Set<string>();
  const lines: SalesPlanLine[] = [];

  for (const entry of value.lines) {
    const line = parseSalesPlanLine(entry, productIds);
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
  productIds: ReadonlySet<string>,
): SalesPlan[] | null {
  const plans = parseMovementList(value, (entry) =>
    parseSalesPlan(entry, productIds),
  );
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

  if (typeof value.month !== 'string' || !isMonthKey(value.month)) {
    return null;
  }

  const planExVat = parseInteger(value.planExVat, 0, MAX_OPERATING_EXPENSE);
  const factExVat = parseInteger(value.factExVat, 0, MAX_OPERATING_EXPENSE);

  if (planExVat === null || factExVat === null) {
    return null;
  }

  return {
    month: value.month,
    planExVat,
    factExVat,
  };
}

function parseOperatingExpenses(
  value: unknown,
): MonthOperatingExpense[] | null {
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

function dateInMonth(date: string, month: string): boolean {
  return date.startsWith(`${month}-`) && isOccurredOn(date);
}

function parseSalesFactCell(
  value: unknown,
  products: readonly Product[],
): SalesFactCell | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = parseId(value.id);
  const productId = parseId(value.productId);
  const product = products.find((item) => item.id === productId);
  const outputPieces = parseInteger(value.outputPieces, 0, MAX_VOLUME_PIECES);
  const transferPieces = parseInteger(
    value.transferPieces,
    0,
    MAX_VOLUME_PIECES,
  );
  const staffMealsPieces = parseInteger(
    value.staffMealsPieces,
    0,
    MAX_VOLUME_PIECES,
  );
  const samplesPieces = parseInteger(value.samplesPieces, 0, MAX_VOLUME_PIECES);
  const returnsPieces = parseInteger(value.returnsPieces, 0, MAX_VOLUME_PIECES);
  const writeOffPieces = parseInteger(
    value.writeOffPieces,
    0,
    MAX_VOLUME_PIECES,
  );

  if (
    !id ||
    !productId ||
    !product ||
    outputPieces === null ||
    transferPieces === null ||
    staffMealsPieces === null ||
    samplesPieces === null ||
    returnsPieces === null ||
    writeOffPieces === null ||
    'priceWithVat' in value ||
    'salesPieces' in value
  ) {
    return null;
  }

  const blank =
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
  products: readonly Product[],
): SalesFactDay | null {
  if (!isRecord(value) || !Array.isArray(value.cells)) {
    return null;
  }

  if (
    typeof value.occurredOn !== 'string' ||
    !dateInMonth(value.occurredOn, month)
  ) {
    return null;
  }

  const seenCells = new Set<string>();
  const seenProducts = new Set<string>();
  const cells: SalesFactCell[] = [];

  for (const entry of value.cells) {
    const cell = parseSalesFactCell(entry, products);
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
  products: readonly Product[],
): SalesFact | null {
  if (!isRecord(value) || !Array.isArray(value.days) || 'openings' in value) {
    return null;
  }

  const id = parseId(value.id);
  const deletedAt = parseDeletedAt(value.deletedAt);

  if (
    !id ||
    deletedAt === undefined ||
    typeof value.month !== 'string' ||
    !isMonthKey(value.month)
  ) {
    return null;
  }

  const seenDays = new Set<string>();
  const seenCellIds = new Set<string>();
  const days: SalesFactDay[] = [];

  for (const entry of value.days) {
    const day = parseSalesFactDay(entry, value.month, products);
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

  if (days.length === 0) {
    return null;
  }

  return { id, month: value.month, days, deletedAt };
}

function parseSalesFacts(
  value: unknown,
  products: readonly Product[],
): SalesFact[] | null {
  const facts = parseMovementList(value, (entry) =>
    parseSalesFact(entry, products),
  );
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

function parseSaleLine(
  value: unknown,
  productIds: ReadonlySet<string>,
): SaleLine | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = parseId(value.id);
  const productId = parseId(value.productId);
  const pieces = parseInteger(value.pieces, 1, MAX_VOLUME_PIECES);
  const amountWithVat = parseInteger(
    value.amountWithVat,
    0,
    MAX_SALE_LINE_AMOUNT,
  );

  if (
    !id ||
    !productId ||
    !productIds.has(productId) ||
    pieces === null ||
    amountWithVat === null
  ) {
    return null;
  }

  return { id, productId, pieces, amountWithVat };
}

function parseSale(
  value: unknown,
  productIds: ReadonlySet<string>,
): Sale | null {
  if (!isRecord(value) || !Array.isArray(value.lines)) {
    return null;
  }

  const id = parseId(value.id);
  const deletedAt = parseDeletedAt(value.deletedAt);

  if (
    !id ||
    deletedAt === undefined ||
    typeof value.customerName !== 'string' ||
    value.customerName.length === 0 ||
    value.customerName.length > MAX_LABEL_LENGTH ||
    value.customerName.trim() !== value.customerName ||
    typeof value.occurredOn !== 'string' ||
    !isOccurredOn(value.occurredOn)
  ) {
    return null;
  }

  const seenLines = new Set<string>();
  const seenProducts = new Set<string>();
  const lines: SaleLine[] = [];

  for (const entry of value.lines) {
    const line = parseSaleLine(entry, productIds);
    if (!line || seenLines.has(line.id) || seenProducts.has(line.productId)) {
      return null;
    }

    seenLines.add(line.id);
    seenProducts.add(line.productId);
    lines.push(line);
  }

  if (lines.length === 0) {
    return null;
  }

  return {
    id,
    customerName: value.customerName,
    occurredOn: value.occurredOn,
    lines,
    deletedAt,
  };
}

function parseSales(
  value: unknown,
  productIds: ReadonlySet<string>,
): Sale[] | null {
  return parseMovementList(value, (entry) => parseSale(entry, productIds));
}

/** Собирает документ только из известных полей. Чужие ключи отбрасываются. */
export function parsePrototypeDocument(
  value: unknown,
): PrototypeDocument | null {
  if (!isRecord(value) || value.schemaVersion !== SCHEMA_VERSION) {
    return null;
  }

  if (
    'workshops' in value ||
    'workshopId' in value ||
    'materials' in value ||
    'derivatives' in value ||
    'recipes' in value
  ) {
    return null;
  }

  const categories = parseCatalogCategories(value.categories);
  if (!categories) {
    return null;
  }

  const categoryIds = new Set(categories.map((item) => item.id));
  const products = parseNamedList(value.products, (entry) =>
    parseProduct(entry, categoryIds),
  );
  if (!products) {
    return null;
  }

  const productIds = new Set(products.map((item) => item.id));
  const salesPlans = parseSalesPlans(value.salesPlans, productIds);
  const salesFacts = parseSalesFacts(value.salesFacts, products);
  const sales = parseSales(value.sales, productIds);
  const operatingExpenses = parseOperatingExpenses(value.operatingExpenses);

  if (!salesPlans || !salesFacts || !sales || !operatingExpenses) {
    return null;
  }

  return {
    schemaVersion: SCHEMA_VERSION,
    categories,
    products,
    salesPlans,
    salesFacts,
    sales,
    operatingExpenses,
  };
}
