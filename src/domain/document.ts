export const SCHEMA_VERSION = 63 as const;

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
 * Конечный товар. Себестоимость 1 шт в документ не пишется: её считает рецепт.
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
  /**
   * На сколько кг рассчитан рецепт, тысячные доли кг.
   * Должен совпадать с суммой кг компонентов с допуском 1 г.
   * Пустой состав — 0. Себестоимость из состава считают в отчёте «Себестоимость готовой».
   */
  outputKilogramThousandths: number;
  /**
   * На сколько штук рассчитана партия, тысячные доли.
   * Готовая продукция всегда поштучно: партия из штук на `outputKilogramThousandths` кг;
   * вес одной штуки = выход / штуки. Больше нуля.
   */
  outputPieceThousandths: number;
  /** Состав рецепта. Пустой — рецепт ещё не задан. */
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
 * Подразделения листа `HR`. Не склады сырья и не цеха рецептов.
 * Производственные цеха — по две линии («1» / «2»); администрация, отдел продаж и цех готовой продукции без дубля.
 * У администрации и отдела продаж нет строки аутсорсинга.
 */
export type HrDepartmentId =
  | 'admin'
  | 'sales'
  | 'meat-1'
  | 'meat-2'
  | 'bakery-1'
  | 'bakery-2'
  | 'vegetables-1'
  | 'vegetables-2'
  | 'soup-1'
  | 'soup-2'
  | 'sides-1'
  | 'sides-2'
  | 'assembly-1'
  | 'assembly-2'
  | 'dc';

export const HR_DEPARTMENT_IDS = [
  'admin',
  'sales',
  'meat-1',
  'meat-2',
  'bakery-1',
  'bakery-2',
  'vegetables-1',
  'vegetables-2',
  'soup-1',
  'soup-2',
  'sides-1',
  'sides-2',
  'assembly-1',
  'assembly-2',
  'dc',
] as const satisfies readonly HrDepartmentId[];

/** Производственные цеха и цех готовой продукции — есть аутсорсинг. Порядок: мясо… сборка, затем готовая. */
export const HR_SHOP_DEPARTMENT_IDS = [
  'meat-1',
  'meat-2',
  'bakery-1',
  'bakery-2',
  'vegetables-1',
  'vegetables-2',
  'soup-1',
  'soup-2',
  'sides-1',
  'sides-2',
  'assembly-1',
  'assembly-2',
  'dc',
] as const satisfies readonly Exclude<HrDepartmentId, 'admin' | 'sales'>[];

export type HrShopDepartmentId = (typeof HR_SHOP_DEPARTMENT_IDS)[number];

export function isHrShopDepartmentId(value: string): value is HrShopDepartmentId {
  return (HR_SHOP_DEPARTMENT_IDS as readonly string[]).includes(value);
}

export function isHrDepartmentId(value: string): value is HrDepartmentId {
  return (HR_DEPARTMENT_IDS as readonly string[]).includes(value);
}

/**
 * Должность или фиксированная строка аутсорсинга подразделения.
 * Мягкое удаление только у штатных должностей.
 */
export interface HrPosition {
  id: string;
  departmentId: HrDepartmentId;
  name: string;
  /** `staff` — обычная должность; `outsourcing` — одна на цех/РЦ, не удаляется. */
  kind: 'staff' | 'outsourcing';
  deletedAt: string | null;
}

/** Плановая строка должности месяца. `HR!D/E/F`. */
export interface HrMonthPlanStaffLine {
  id: string;
  positionId: string;
  /** Численность, чел. */
  headcount: number;
  /** Зарплата на одного, копейки без НДС. */
  salaryExVat: number;
}

/** План аутсорсинга цеха/РЦ на месяц (расширение книги: в листе план был пуст). */
export interface HrMonthPlanOutsourcingLine {
  id: string;
  departmentId: HrShopDepartmentId;
  /** Часы периода, тысячные доли часа. */
  hourThousandths: number;
  /** Ставка, копейки за 1 час без НДС. */
  rateExVat: number;
}

/** План HR на календарный месяц. На один месяц — одна запись. */
export interface HrMonthPlan {
  id: string;
  month: string;
  staffLines: HrMonthPlanStaffLine[];
  outsourcingLines: HrMonthPlanOutsourcingLine[];
}

/** Месячный факт штатной должности (администрация и отдел продаж): численность и сумма отдельно. `HR!G/I`. */
export interface HrMonthFactStaffLine {
  id: string;
  positionId: string;
  /** Люди за месяц, тысячные доли. 1 чел → 1000. */
  headcountThousandths: number;
  /** Выплаченная сумма за месяц, копейки без НДС. */
  amountExVat: number;
}

/** Месячный факт администрации и отдела продаж. На один месяц — одна запись. */
export interface HrMonthFact {
  id: string;
  /** `ГГГГ-ММ`. */
  month: string;
  staffLines: HrMonthFactStaffLine[];
}

/** Дневной факт штатной должности: численность и сумма отдельно. `HR!J` штатной строки. */
export interface HrDayStaffLine {
  id: string;
  positionId: string;
  /** Люди за день, тысячные доли. 2,64 чел → 2640. */
  headcountThousandths: number;
  /** Выплаченная сумма, копейки без НДС. */
  amountExVat: number;
}

/** Дневной факт аутсорсинга цеха/РЦ: часы и выплаченная сумма отдельно. */
export interface HrDayOutsourcingLine {
  id: string;
  departmentId: HrShopDepartmentId;
  hourThousandths: number;
  /** Выплаченная сумма, копейки без НДС. */
  amountExVat: number;
}

export interface HrDayFact {
  id: string;
  /** `ГГГГ-ММ-ДД`. */
  occurredOn: string;
  staffLines: HrDayStaffLine[];
  outsourcingLines: HrDayOutsourcingLine[];
}

/**
 * Ставки зарплатных налогов месяца, сотые доли процента: 13 % → 1300, 0,2 % → 20.
 * План и факт раздельно, как `HR!E86:H88`.
 */
export interface HrTaxRatesMonth {
  id: string;
  month: string;
  planNdflHundredths: number;
  planSocialHundredths: number;
  planInjuryHundredths: number;
  factNdflHundredths: number;
  factSocialHundredths: number;
  factInjuryHundredths: number;
}

/** Два вида наёмного транспорта на листе `Transport`. */
export type TransportHireKind = 'finishedDelivery' | 'materialDelivery';

export const TRANSPORT_HIRE_KINDS = [
  'finishedDelivery',
  'materialDelivery',
] as const satisfies readonly TransportHireKind[];

export function isTransportHireKind(value: string): value is TransportHireKind {
  return (TRANSPORT_HIRE_KINDS as readonly string[]).includes(value);
}

/** Контрагент наёмного транспорта. Мягкое удаление. */
export interface TransportCarrier {
  id: string;
  kind: TransportHireKind;
  name: string;
  deletedAt: string | null;
}

export interface TransportHireMonthPlanLine {
  id: string;
  carrierId: string;
  /**
   * Количество: шт (доставка готовой) или кг (сырьё), тысячные доли.
   * `Transport!D`.
   */
  quantityThousandths: number;
  /** Цена за 1 шт или 1 кг без НДС, копейки. `Transport!E`. */
  unitPriceExVat: number;
}

export interface TransportHireMonthPlan {
  id: string;
  month: string;
  lines: TransportHireMonthPlanLine[];
}

export interface TransportHireDayLine {
  id: string;
  carrierId: string;
  quantityThousandths: number;
  /** Сумма дня без НДС, копейки. */
  amountExVat: number;
}

export interface TransportHireDayFact {
  id: string;
  occurredOn: string;
  lines: TransportHireDayLine[];
}

/** Автомобиль собственного транспорта. Мягкое удаление. */
export interface TransportVehicle extends DeletableRecord {}

/** План своего транспорта на месяц: норма, цена литра, км. */
export interface TransportOwnMonthPlanVehicle {
  id: string;
  /** Ссылка на `transportVehicles`. Живёт и после удаления. */
  vehicleId: string;
  /** Норма л/100 км, тысячные доли литра. */
  litersPer100KmThousandths: number;
  /** Цена 1 л без НДС, копейки. */
  fuelPriceExVat: number;
  /** План км, тысячные доли км. */
  planKmThousandths: number;
}

export interface TransportOwnMonthPlan {
  id: string;
  month: string;
  vehicles: TransportOwnMonthPlanVehicle[];
}

/** Показание спидометра на утро и цена литра дня. */
export interface TransportOwnDayVehicle {
  id: string;
  /** Ссылка на `transportVehicles`. Живёт и после удаления. */
  vehicleId: string;
  /** Одометр на утро, тысячные доли км. */
  odometerThousandths: number;
  fuelPriceExVat: number;
}

export interface TransportOwnDayFact {
  id: string;
  occurredOn: string;
  vehicles: TransportOwnDayVehicle[];
}

/** Код категории `Operation Expense` (группы 1–8). */
export type OpexGroupCode = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';

export const OPEX_GROUP_CODES = ['1', '2', '3', '4', '5', '6', '7', '8'] as const satisfies readonly OpexGroupCode[];

export function isOpexGroupCode(value: string): value is OpexGroupCode {
  return (OPEX_GROUP_CODES as readonly string[]).includes(value);
}

/**
 * Прочая статья `Operation Expense` (без HR и без 7.1/7.2 из Transport).
 * `agency` — план считает формула от выручки, факт вводят; `standard` — план и факт вводят.
 */
export type OpexOtherLineKind = 'standard' | 'agency';

export interface OpexOtherLine extends DeletableRecord {
  groupCode: OpexGroupCode;
  kind: OpexOtherLineKind;
}

/** Мок прочих статей — имена и группы как в книге. */
export const OPEX_OTHER_LINES: OpexOtherLine[] = [
  { id: 'electricity', groupCode: '2', name: 'Электроэнергия', kind: 'standard', deletedAt: null },
  { id: 'water', groupCode: '2', name: 'Водоснабжение', kind: 'standard', deletedAt: null },
  { id: 'sewage', groupCode: '2', name: 'Вывоз стоков', kind: 'standard', deletedAt: null },
  { id: 'garbage', groupCode: '2', name: 'Вывоз мусора', kind: 'standard', deletedAt: null },
  { id: 'pellets', groupCode: '2', name: 'Пелеты для отопления', kind: 'standard', deletedAt: null },
  { id: 'internetFixed', groupCode: '3', name: 'Стационарный интернет', kind: 'standard', deletedAt: null },
  { id: 'internetMobile', groupCode: '3', name: 'Мобильный интернет', kind: 'standard', deletedAt: null },
  { id: 'glonass', groupCode: '3', name: 'Услуги ГЛОНАСС', kind: 'standard', deletedAt: null },
  { id: 'trashBags', groupCode: '4', name: 'пакеты для мусора', kind: 'standard', deletedAt: null },
  { id: 'gloves', groupCode: '4', name: 'перчатки одноразовые', kind: 'standard', deletedAt: null },
  { id: 'workwear', groupCode: '4', name: 'спецодежда', kind: 'standard', deletedAt: null },
  { id: 'staffMeals', groupCode: '4', name: 'Питание персонала', kind: 'standard', deletedAt: null },
  { id: 'deratization', groupCode: '4', name: 'Дератизация', kind: 'standard', deletedAt: null },
  { id: 'haccp', groupCode: '4', name: 'Оснащение по ХАССП', kind: 'standard', deletedAt: null },
  { id: 'detergents', groupCode: '4', name: 'Моющие средства', kind: 'standard', deletedAt: null },
  { id: 'hygiene', groupCode: '4', name: 'Расходники по гигиене предприятия', kind: 'standard', deletedAt: null },
  { id: 'cartridges', groupCode: '5', name: 'картриджи для принтеров', kind: 'standard', deletedAt: null },
  { id: 'stationery', groupCode: '5', name: 'канцелярские принадлежности и бумага', kind: 'standard', deletedAt: null },
  { id: 'remoteWarehouse', groupCode: '5', name: 'Аренда удаленного склада', kind: 'standard', deletedAt: null },
  { id: 'factoryRent', groupCode: '5', name: 'Аренда заводского здания', kind: 'standard', deletedAt: null },
  { id: 'tbankFee', groupCode: '5', name: 'Комиссия Т-Банка за денежные переводы', kind: 'standard', deletedAt: null },
  { id: 'consulting', groupCode: '5', name: 'Что Делать консалт', kind: 'standard', deletedAt: null },
  { id: 'agency', groupCode: '6', name: 'Агентское соглашение', kind: 'agency', deletedAt: null },
  { id: 'certification', groupCode: '6', name: 'Регистрация и сертификация', kind: 'standard', deletedAt: null },
  { id: 'maintenance', groupCode: '7', name: 'ТО собственного транспорта', kind: 'standard', deletedAt: null },
  { id: 'insurance', groupCode: '7', name: 'Страхование транспорта', kind: 'standard', deletedAt: null },
  {
    id: 'leasing',
    groupCode: '7',
    name: 'Лизинговые платежи по собственному транспорту',
    kind: 'standard',
    deletedAt: null,
  },
  {
    id: 'otherTransportMaterials',
    groupCode: '7',
    name: 'Прочие материалы по собственному транспорту',
    kind: 'standard',
    deletedAt: null,
  },
  { id: 'gazelleRent', groupCode: '7', name: 'Аренда Газели', kind: 'standard', deletedAt: null },
  {
    id: 'fridgeService',
    groupCode: '8',
    name: 'обслуживание холодильного оборудования',
    kind: 'standard',
    deletedAt: null,
  },
  { id: 'waterPrepService', groupCode: '8', name: 'Обслуживание водоподготовки', kind: 'standard', deletedAt: null },
  { id: 'waterPrepMaterials', groupCode: '8', name: 'Материалы для водоподготовки', kind: 'standard', deletedAt: null },
  {
    id: 'plumbing',
    groupCode: '8',
    name: 'Сантехника и электрика для нового оборудования',
    kind: 'standard',
    deletedAt: null,
  },
  { id: 'bakeryParts', groupCode: '8', name: 'Запчасти для пекарни', kind: 'standard', deletedAt: null },
  { id: 'meatParts', groupCode: '8', name: 'Запчасти для мясного цеха', kind: 'standard', deletedAt: null },
  {
    id: 'assemblyParts',
    groupCode: '8',
    name: 'Сервисные работы и Запчасти для сборки и упаковки',
    kind: 'standard',
    deletedAt: null,
  },
  {
    id: 'buildings',
    groupCode: '8',
    name: 'Ремонт и содержание зданий и сооружений',
    kind: 'standard',
    deletedAt: null,
  },
];

export function catalogOpexOtherLines(): OpexOtherLine[] {
  return OPEX_OTHER_LINES.map((item) => ({ ...item }));
}

export interface OpexMonthLine {
  id: string;
  /** Id статьи из `opexOtherLines`. */
  lineId: string;
  planExVat: number;
  factExVat: number;
}

/** Ввод прочих операционных статей месяца. */
export interface OpexMonthLines {
  id: string;
  month: string;
  lines: OpexMonthLine[];
}

/** Дневной факт статьи поднятой категории прочих расходов. */
export interface OpexDayLine {
  id: string;
  /** Id статьи из `opexOtherLines`. */
  lineId: string;
  amountExVat: number;
}

export interface OpexDayFact {
  id: string;
  occurredOn: string;
  lines: OpexDayLine[];
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
 * Себестоимость из состава считают в отчёте «Себестоимость» (`derivative-cost.ts`).
 * У единицы «шт» (режим поштучно) — партия из `outputPieceThousandths` штук
 * на `outputKilogramThousandths` кг; вес одной штуки = выход / штуки.
 * У «кг» штуки не задают (`null`).
 */
export interface Derivative extends DeletableRecord {
  workshopId: DerivativeWorkshopId;
  unit: DerivativeUnit;
  /**
   * На сколько кг рассчитан рецепт, тысячные доли кг.
   * Должен совпадать с «весом по компонентам» (сумма кг × выход после термообработки / 100)
   * с допуском 1 г.
   */
  outputKilogramThousandths: number;
  /**
   * На сколько штук рассчитана партия, тысячные доли.
   * Обязательно при `unit === 'шт'`; при `кг` — `null`.
   * Старая запись без поля при `шт` читается как 1 шт.
   */
  outputPieceThousandths: number | null;
  /**
   * Выход после термообработки, целый процент (100 = без потерь).
   * Умножает только сумму кг компонентов на экране и при сверке с «рассчитан на».
   */
  heatTreatmentYieldPercent: number;
  lines: DerivativeLine[];
}

/** Строка инвентаризации производной на конец месяца. */
export interface DerivativeOpeningLine {
  id: string;
  /** Производная. Ссылка живёт и после удаления. */
  derivativeId: string;
  /** Факт остатка на конец, тысячные доли единицы. Может быть отрицательным. */
  quantity: number;
}

/**
 * Инвентаризация производных на конец месяца.
 * На один месяц — одна запись. Мягкого удаления нет.
 * Расчётный остаток и отклонение в документ не пишутся.
 * Остаток на начало следующего месяца — этот факт.
 */
export interface DerivativeOpening {
  id: string;
  /** `ГГГГ-ММ`. */
  month: string;
  lines: DerivativeOpeningLine[];
}

/** Строка норматива остатков производной. */
export interface DerivativeNormLine {
  id: string;
  /** Производная. Ссылка живёт и после удаления. */
  derivativeId: string;
  /** Нормативный минимум, тысячные доли единицы. Может быть отрицательным. */
  minQuantity: number;
  /** Нормативный максимум, тысячные доли единицы. Может быть отрицательным. */
  maxQuantity: number;
}

/**
 * Нормативы остатков производных на месяц.
 * На один месяц — одна запись. Мягкого удаления нет.
 * Отклонения и рекомендуемый объём в документ не пишутся.
 */
export interface DerivativeNorm {
  id: string;
  /** `ГГГГ-ММ`. */
  month: string;
  lines: DerivativeNormLine[];
}

/**
 * Кредитор (банк или частное лицо) раздела «Движение кредитных ресурсов».
 * Ставка — справочная; процентные платежи вводят вручную, не считают из ставки.
 */
export interface Creditor extends DeletableRecord {
  /**
   * Сумма кредита (справочно), копейки — размер договора, не остаток.
   * Остаток тела считают из получения и погашения по месяцам.
   */
  initialPrincipal: number;
  /**
   * Годовая процентная ставка, сотые доли процента.
   * Например 18 % → 1800. Информационная колонка.
   */
  interestRateHundredths: number;
}

/** Строка движения тела кредита и процентных платежей кредитора за месяц. */
export interface CreditResourceMonthLine {
  id: string;
  /** Ссылка на `creditors`. Живёт и после удаления кредитора. */
  creditorId: string;
  /** План получения тела кредита, копейки. */
  planReceived: number;
  /** Факт получения тела кредита, копейки. */
  factReceived: number;
  /** План погашения тела кредита, копейки. */
  planRepaid: number;
  /** Факт погашения тела кредита, копейки. То же поле для ДДС. */
  factRepaid: number;
  /** План процентных платежей за месяц, копейки. Вводят вручную. */
  planInterest: number;
  /** Факт процентных платежей за месяц, копейки. Вводят вручную. */
  factInterest: number;
}

/**
 * Движение кредитных ресурсов месяца.
 * На один месяц — одна запись. Остаток на конец в документ не пишется.
 */
export interface CreditResourceMonth {
  id: string;
  /** `ГГГГ-ММ`. */
  month: string;
  lines: CreditResourceMonthLine[];
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
  /** Должности и строки аутсорсинга листа `HR`. */
  hrPositions: HrPosition[];
  /** План численности и зарплат по месяцам. */
  hrMonthPlans: HrMonthPlan[];
  /** Месячный факт администрации и отдела продаж: численность и выплаты штатных. */
  hrMonthFacts: HrMonthFact[];
  /** Дневной факт цехов и РЦ: численность и выплаты штатных, часы и выплаты аутсорсинга. */
  hrDayFacts: HrDayFact[];
  /** Ставки НДФЛ, соцстраха и травматизма по месяцам. */
  hrTaxRates: HrTaxRatesMonth[];
  /** Контрагенты наёмного транспорта. */
  transportCarriers: TransportCarrier[];
  transportHireMonthPlans: TransportHireMonthPlan[];
  transportHireDayFacts: TransportHireDayFact[];
  /** Автомобили собственного транспорта. */
  transportVehicles: TransportVehicle[];
  transportOwnMonthPlans: TransportOwnMonthPlan[];
  transportOwnDayFacts: TransportOwnDayFact[];
  /** Справочник прочих статей `Operation Expense` (без HR и 7.1/7.2). */
  opexOtherLines: OpexOtherLine[];
  /** Ввод прочих статей `Operation Expense` (без HR и 7.1/7.2). */
  opexMonthLines: OpexMonthLines[];
  /**
   * Дневной факт статей поднятых категорий (`opexPromotedGroupCodes`).
   * Пока категория в «Прочем», факт лежит в `opexMonthLines`; при поднятии месячный факт
   * переносится на 1-е число, при возврате дни суммируются обратно в месяц.
   */
  opexDayFacts: OpexDayFact[];
  /**
   * Коды групп прочих статей, вынесенных в отдельный раздел меню (отчёт / план / факт).
   * Группы 1 и 7 не поднимают: строки из HR и транспорта.
   * У поднятой категории факт вводят по дням (`opexDayFacts`).
   */
  opexPromotedGroupCodes: OpexGroupCode[];
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
  /**
   * Инвентаризация производных на конец месяца (факт, тысячные доли).
   * Старый документ без поля читается как пустой массив.
   */
  derivativeOpenings: DerivativeOpening[];
  /**
   * Нормативы остатков производных месяца (мин/макс, тысячные доли).
   * Старый документ без поля читается как пустой массив.
   */
  derivativeNorms: DerivativeNorm[];
  /**
   * Кредиторы (банки и частные лица).
   * Старый документ без поля читается как пустой массив.
   */
  creditors: Creditor[];
  /**
   * Получение, погашение тела и процентные платежи по месяцам.
   * Старый документ без поля читается как пустой массив.
   */
  creditResourceMonths: CreditResourceMonth[];
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
