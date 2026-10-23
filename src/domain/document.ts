export const SCHEMA_VERSION = 49 as const;

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

/** Категории мока, в которых есть товары. На экране их правят. */
export const PRODUCT_CATEGORIES: ProductCategory[] = [
  { id: 'category-salads', name: 'Салаты', deletedAt: null },
  { id: 'category-hot', name: 'Горячие блюда', deletedAt: null },
  { id: 'category-rolls', name: 'Роллы и сэндвичи', deletedAt: null },
];

export function catalogCategories(): ProductCategory[] {
  return PRODUCT_CATEGORIES.map((item) => ({ ...item }));
}

/**
 * Строка состава рецепта готовой продукции: сырьё или производная того же склада.
 * Другие готовые товары в состав нельзя.
 */
export interface ProductRecipeLine {
  id: string;
  componentKind: 'material' | 'derivative';
  componentId: string;
  /** Количество закладки, тысячные доли единицы. Больше нуля. */
  quantity: number;
}

/**
 * Конечный товар. Себестоимость единицы с НДС вводится во «Вводе плана» продаж.
 * Склад производства задают при создании и не меняют. Рецепт правят в журнале готовой продукции.
 */
export interface Product extends DeletableRecord {
  /** Категория ассортимента. Ссылка живёт и после удаления категории. */
  categoryId: string;
  /**
   * Склад производства (завод 1/2). После создания не меняют.
   * Остатки готовой продукции в движении по-прежнему общие.
   */
  warehouseId: MaterialWarehouseId;
  /** НДС продажи, целые проценты. `Svod!N`. */
  vatPercent: number;
  /** Ручная себестоимость 1 шт с НДС, копейки. */
  unitCostWithVat: number;
  /**
   * Состав рецепта. Пустой — рецепт ещё не задан.
   * Выход и себестоимость из состава пока не считаются.
   */
  lines: ProductRecipeLine[];
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

/** Строка плана производства. Стоимость (цена × объём) в документ не пишется. */
export interface ProductionPlanLine {
  id: string;
  /** Конечный товар. Ссылка живёт и после удаления товара. */
  productId: string;
  /** Устаревшее поле документа; объём выпуска считают из плана продаж и норматива движения. */
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

/**
 * Строка записи выпуска.
 * Цену вводят здесь (расчётная цена месяца по умолчанию). Сумма = цена × штуки, в документ не пишется.
 */
export interface ProductionEntryLine {
  id: string;
  /** Конечный товар. Ссылка живёт и после удаления товара. */
  productId: string;
  /** Объём выпуска, шт. От 1. */
  pieces: number;
  /**
   * Цена 1 шт с НДС, копейки. Стоимость строки = цена × штуки.
   * Новая строка — расчётная цена месяца.
   */
  priceWithVat: number;
}

/**
 * Запись выпуска готовой продукции за календарный день.
 * Пустая запись без строк не пишется.
 * Удаление стирает запись из документа — без `deletedAt` и без возврата.
 * В сводку продаж, факт продаж и план выпуска не суммируется.
 * На экранах «Отчет общий» и «Отчет подневный» производства штуки и стоимость по цене суммируются.
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
  /** Копейки без НДС. План за весь месяц. На фактической сводке — доля прошедших дней. */
  planExVat: number;
  /**
   * Копейки без НДС. Факт за весь месяц.
   * На фактической сводке показывается доля прошедших дней;
   * ввод за эти дни пересчитывается в эту сумму.
   */
  factExVat: number;
}

/** Строка инвентаризации на конец месяца на производстве. */
export interface FinishedGoodsOpeningLine {
  id: string;
  /** Конечный товар. Ссылка живёт и после удаления товара. */
  productId: string;
  /** Результат инвентаризации, шт. Может быть отрицательным. */
  pieces: number;
}

/**
 * Инвентаризация на конец месяца на производстве.
 * На один месяц — одна запись. Мягкого удаления нет: это не план.
 * Расчётный остаток, отклонение и стоимости в документ не пишутся.
 */
export interface FinishedGoodsOpening {
  id: string;
  /** `ГГГГ-ММ`. */
  month: string;
  lines: FinishedGoodsOpeningLine[];
}

/** Строка норматива остатков готовой продукции. `DGP!AF`–`AH`. */
export interface FinishedGoodsNormLine {
  id: string;
  /** Конечный товар. Ссылка живёт и после удаления товара. */
  productId: string;
  /** Нормативный минимум, шт. Может быть отрицательным. */
  minPieces: number;
  /** Нормативный максимум, шт. Может быть отрицательным. */
  maxPieces: number;
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

/** Четыре группы листов `DSM`. Это не справочник категорий. */
export const MATERIAL_GROUPS = [
  { id: 'meat', name: 'Мясное сырьё и мясные специи' },
  { id: 'bakery', name: 'Пекарня' },
  { id: 'sauces', name: 'Соусы, овощи и крупы' },
  { id: 'packaging', name: 'Упаковка и вспомогательные материалы' },
] as const;

export type MaterialGroupId = (typeof MATERIAL_GROUPS)[number]['id'];

/**
 * Два склада двух производств (завод 1 / завод 2).
 * У сырья, норм и производных — позиции склада. У конечного товара — склад выпуска и рецепта.
 * Остатки готовой продукции в «Движении» по-прежнему общие, без разреза по складам.
 */
export const MATERIAL_WAREHOUSES = [
  { id: 'warehouse-1', name: 'Склад 1' },
  { id: 'warehouse-2', name: 'Склад 2' },
] as const;

export type MaterialWarehouseId = (typeof MATERIAL_WAREHOUSES)[number]['id'];

/** Единицы листов `DSM`: кг, шт, л, м (в книге оболочка — погонные метры, в интерфейсе — м). */
export const MATERIAL_UNITS = ['кг', 'шт', 'л', 'м'] as const;

export type MaterialUnit = (typeof MATERIAL_UNITS)[number];

/**
 * Пара веса для единицы, отличной от кг.
 * Деление не хранят: на экране показывают как «10 кг/30 шт».
 */
export interface MaterialWeightPair {
  /** Тысячные доли кг. 0 — весом пренебрегают. */
  kilogramThousandths: number;
  /** Тысячные доли единицы учёта. Больше нуля. */
  unitThousandths: number;
}

/**
 * Группа, в которой расход можно нормировать на штуку продукции.
 * Ножи, лезвия, оболочка и остальная упаковка.
 */
export const NORMED_MATERIAL_GROUP_ID: MaterialGroupId = 'packaging';

/**
 * Позиция сырья или материалов одного склада.
 * Группу и склад после создания не меняют. Одинаковые имена на разных складах — разные записи.
 */
export interface Material extends DeletableRecord {
  groupId: MaterialGroupId;
  /** Склад, которому принадлежит позиция. Общих позиций нет. */
  warehouseId: MaterialWarehouseId;
  unit: MaterialUnit;
  /**
   * Пара «кг / количество в единице». `null`, если единица — кг (вес и есть учёт).
   * Для шт, л, м обязательна. Нулевой вес допустим.
   */
  weight: MaterialWeightPair | null;
  /** НДС закупки, целые проценты. `DSM Meat!F`. */
  vatPercent: number;
}

/**
 * Норма расхода склада на одну штуку продукции.
 * Тысячные доли единицы материала на 1 шт. Нет записи — позиция не нормирована.
 * Имени нет: норма — связь склада, позиции и товара.
 */
export interface MaterialNorm {
  id: string;
  materialId: string;
  warehouseId: MaterialWarehouseId;
  productId: string;
  /** Тысячные доли единицы на 1 шт продукции. */
  quantityPerPiece: number;
  deletedAt: string | null;
}

/** Строка месячного плана склада: приход, расход, цена и норматив. */
export interface MaterialMonthPlanLine {
  id: string;
  materialId: string;
  /** План прихода, тысячные доли единицы. */
  receiptQuantity: number;
  /**
   * План расхода, тысячные доли единицы.
   * Если на этом складе есть норма, ввод не используется: расход считается из выпуска.
   */
  consumptionQuantity: number;
  /**
   * Факт расхода за месяц, тысячные доли.
   * Пока нормы нет, вводят в отчёте; при норме считается из выпуска.
   */
  factConsumptionQuantity: number;
  /** Плановая цена закупки с НДС, копейки за 1 единицу. `DSM Meat!H`. */
  priceWithVat: number;
  /** Нормативный минимум, тысячные доли. `DSM Meat!DU`. */
  minQuantity: number;
  /** Нормативный максимум, тысячные доли. `DSM Meat!DV`. */
  maxQuantity: number;
}

/**
 * План склада на месяц. На один месяц и один склад — одна запись.
 * Мягкого удаления нет.
 */
export interface MaterialMonthPlan {
  id: string;
  month: string;
  warehouseId: MaterialWarehouseId;
  lines: MaterialMonthPlanLine[];
}

/** Строка инвентаризации склада на конец месяца. */
export interface MaterialOpeningLine {
  id: string;
  materialId: string;
  /** Факт остатка на конец, тысячные доли. Может быть отрицательным. */
  quantity: number;
}

/**
 * Инвентаризация склада на конец месяца.
 * На один месяц и один склад — одна запись. Мягкого удаления нет.
 * Остаток на начало следующего месяца — этот факт.
 */
export interface MaterialOpening {
  id: string;
  month: string;
  warehouseId: MaterialWarehouseId;
  lines: MaterialOpeningLine[];
}

/** Строка прихода от поставщика. Сумма строки в документ не пишется. */
export interface MaterialReceiptLine {
  id: string;
  materialId: string;
  /** Количество, тысячные доли единицы. Больше нуля. */
  quantity: number;
  /** Цена с НДС, копейки за 1 единицу. */
  priceWithVat: number;
}

/**
 * Приход от поставщика на один склад.
 * Удаление вырезает запись. Поля `deletedAt` нет.
 */
export interface MaterialReceipt {
  id: string;
  warehouseId: MaterialWarehouseId;
  supplierName: string;
  /** Календарный день, `ГГГГ-ММ-ДД`. */
  occurredOn: string;
  lines: MaterialReceiptLine[];
}

/**
 * Цех производных. Цифра в id совпадает со складом сырья: `*-1` → склад 1, `*-2` → склад 2.
 * Справочник фиксирован; в документ не пишется.
 */
export const DERIVATIVE_WORKSHOPS = [
  { id: 'meat-1', name: 'Производные мясного цеха 1', warehouseId: 'warehouse-1' },
  { id: 'meat-2', name: 'Производные мясного цеха 2', warehouseId: 'warehouse-2' },
  { id: 'bakery-1', name: 'Производные пекарни 1', warehouseId: 'warehouse-1' },
  { id: 'bakery-2', name: 'Производные пекарни 2', warehouseId: 'warehouse-2' },
  { id: 'veg-1', name: 'Производные овощного цеха 1', warehouseId: 'warehouse-1' },
  { id: 'veg-2', name: 'Производные овощного цеха 2', warehouseId: 'warehouse-2' },
  { id: 'soup-1', name: 'Производные цеха варки супов и каш 1', warehouseId: 'warehouse-1' },
  { id: 'soup-2', name: 'Производные цеха варки супов и каш 2', warehouseId: 'warehouse-2' },
  { id: 'side-1', name: 'Производные цеха гарниров 1', warehouseId: 'warehouse-1' },
  { id: 'side-2', name: 'Производные цеха гарниров 2', warehouseId: 'warehouse-2' },
] as const;

export type DerivativeWorkshopId = (typeof DERIVATIVE_WORKSHOPS)[number]['id'];

/** Единицы производной на этом этапе: шт и кг. */
export const DERIVATIVE_UNITS = ['шт', 'кг'] as const;

export type DerivativeUnit = (typeof DERIVATIVE_UNITS)[number];

/** Строка состава производной: сырьё или другая производная того же склада. */
export interface DerivativeLine {
  id: string;
  componentKind: 'material' | 'derivative';
  componentId: string;
  /** Количество закладки, тысячные доли единицы. Больше нуля. */
  quantity: number;
}

/**
 * Производная цеха. Имя уникально в пределах склада.
 * Выход рецепта и себестоимость из состава пока не считаются.
 */
export interface Derivative extends DeletableRecord {
  workshopId: DerivativeWorkshopId;
  unit: DerivativeUnit;
  lines: DerivativeLine[];
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
   * Инвентаризация на конец месяца на производстве (факт, шт).
   * Старый документ без поля читается как пустой массив.
   */
  finishedGoodsOpenings: FinishedGoodsOpening[];
  /**
   * Нормативы остатков месяца.
   * Старый документ без поля читается как пустой массив.
   */
  finishedGoodsNorms: FinishedGoodsNorm[];
  /**
   * Сырьё и материалы четырёх групп `DSM`.
   * Старый документ без поля читается как пустой массив.
   */
  materials: Material[];
  /** Нормы расхода упаковки и вспомогательных материалов на штуку продукции. */
  materialNorms: MaterialNorm[];
  /** План прихода, расхода, цены и норматива по складу и месяцу. */
  materialMonthPlans: MaterialMonthPlan[];
  /** Инвентаризация остатка на конец по складу и месяцу. */
  materialOpenings: MaterialOpening[];
  /** Приходы от поставщика. Удаление вырезает запись. */
  materialReceipts: MaterialReceipt[];
  /**
   * Производные по цехам. Старый документ без поля читается как пустой массив.
   */
  derivatives: Derivative[];
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
