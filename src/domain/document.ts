export const SCHEMA_VERSION = 36 as const;

/** Ставка налога на прибыль, %. `Svod!C6`. */
export const PROFIT_TAX_PERCENT = 20;

const DELETION_MARK = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

/**
 * Общие поля мягкого удаления. `deletedAt` — ISO-время, `null` — в работе.
 * Так у категорий, товаров и планов. Продажа и запись выпуска удаляются насовсем — без этого поля.
 */
export interface DeletableRecord {
  id: string;
  name: string;
  deletedAt: string | null;
}

/** Категория ассортимента. Строка группы на `Svod`. */
export type ProductCategory = DeletableRecord;

/** Шесть категорий ритейла из `docs/domain.md`. Мок; на экране их правят. */
export const PRODUCT_CATEGORIES: ProductCategory[] = [
  { id: 'category-salads', name: 'Салаты', deletedAt: null },
  { id: 'category-hot', name: 'Горячие блюда', deletedAt: null },
  { id: 'category-rolls', name: 'Роллы и сэндвичи', deletedAt: null },
  { id: 'category-breakfast', name: 'Завтраки', deletedAt: null },
  { id: 'category-desserts', name: 'Десерты и выпечка', deletedAt: null },
  { id: 'category-semifinished', name: 'Полуфабрикаты', deletedAt: null },
];

export function catalogCategories(): ProductCategory[] {
  return PRODUCT_CATEGORIES.map((item) => ({ ...item }));
}

/** Конечный товар. Себестоимость единицы с НДС вводится на сводке. */
export interface Product extends DeletableRecord {
  /** Категория ассортимента. Ссылка живёт и после удаления категории. */
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

/** Строка плана производства. Себестоимость объёма в документ не пишется. */
export interface ProductionPlanLine {
  id: string;
  /** Конечный товар. Ссылка живёт и после удаления товара. */
  productId: string;
  /** Объём выпуска, шт. */
  volumePieces: number;
}

/** План производства на календарный месяц. На один месяц — один рабочий план. */
export interface ProductionPlan {
  id: string;
  /** `ГГГГ-ММ`. */
  month: string;
  lines: ProductionPlanLine[];
  deletedAt: string | null;
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
 * Удаление стирает запись из документа — без `deletedAt` и без возврата.
 */
export interface Sale {
  id: string;
  customerName: string;
  /** Календарный день, `ГГГГ-ММ-ДД`. */
  occurredOn: string;
  lines: SaleLine[];
}

/** Строка записи выпуска. Только объём; цены и суммы нет. */
export interface ProductionEntryLine {
  id: string;
  /** Конечный товар. Ссылка живёт и после удаления товара. */
  productId: string;
  /** Объём выпуска, шт. От 1. */
  pieces: number;
}

/**
 * Запись выпуска готовой продукции за календарный день.
 * Пустая запись без строк не пишется.
 * Удаление стирает запись из документа — без `deletedAt` и без возврата.
 * В сводку продаж, факт продаж и план выпуска не суммируется.
 * На экранах «Производство» и «Фактическое производство» штуки суммируются.
 */
export interface ProductionEntry {
  id: string;
  /** Календарный день, `ГГГГ-ММ-ДД`. */
  occurredOn: string;
  lines: ProductionEntryLine[];
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

/** Строка остатка на начало месяца на производстве. `DGP!D`. */
export interface FinishedGoodsOpeningLine {
  id: string;
  /** Конечный товар. Ссылка живёт и после удаления товара. */
  productId: string;
  /** Остаток на начало периода на произв-ве, шт. Может быть отрицательным. */
  pieces: number;
}

/**
 * Остатки на начало месяца на производстве.
 * На один месяц — одна запись. Мягкого удаления нет: это не план.
 * Стоимости и конец периода в документ не пишутся.
 */
export interface FinishedGoodsOpening {
  id: string;
  /** `ГГГГ-ММ`. */
  month: string;
  lines: FinishedGoodsOpeningLine[];
}

/** Строка норматива остатков готовой продукции. `DGP!AF`–`AL`. */
export interface FinishedGoodsNormLine {
  id: string;
  /** Конечный товар. Ссылка живёт и после удаления товара. */
  productId: string;
  /** Нормативный минимум, шт. Может быть отрицательным. */
  minPieces: number;
  /** Нормативный максимум, шт. Может быть отрицательным. */
  maxPieces: number;
  /**
   * Поправочный коэффициент в сотых: 1,25 → 125.
   * Может быть отрицательным.
   */
  coefficientHundredths: number;
}

/**
 * Нормативы остатков месяца для планирования движения.
 * На один месяц — одна запись. Мягкого удаления нет.
 * Отклонения и рекомендуемый объём в документ не пишутся.
 */
export interface FinishedGoodsNorm {
  id: string;
  /** `ГГГГ-ММ`. */
  month: string;
  lines: FinishedGoodsNormLine[];
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
  productionPlans: ProductionPlan[];
  sales: Sale[];
  productionEntries: ProductionEntry[];
  operatingExpenses: MonthOperatingExpense[];
  /**
   * Остатки на начало месяца на производстве.
   * Старый документ без поля читается как пустой массив.
   */
  finishedGoodsOpenings: FinishedGoodsOpening[];
  /**
   * Нормативы остатков месяца.
   * Старый документ без поля читается как пустой массив.
   */
  finishedGoodsNorms: FinishedGoodsNorm[];
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
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
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
