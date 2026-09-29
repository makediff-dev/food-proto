import {
  SCHEMA_VERSION,
  type Delivery,
  type DeliveryLine,
  type ProductionFact,
  type ProductionFactOutput,
  type ProductionFactUse,
  type PrototypeDocument,
  type RawMaterial,
  type RecipeCard,
  type RecipeLine,
  type SalesPlan,
  type Warehouse,
  type Workshop,
} from "@/domain/document";
import { recipeBatch, scaleRecipeQuantity } from "@/domain/production-plan";

/**
 * Цеха — из книги. Склады мока — только №1–№4.
 * Мясное сырьё лежит на складе №4: в книге это склад №5, в моке его нет.
 * Упаковка — на складе №3, рядом с сырьём финальной сборки.
 * Составы упрощены до понятной цепочки одного гамбургера, цены и выход — по книге.
 * Закладка производной — на 100 кг готового продукта: при выходе 80% сырья 125 кг.
 * Норматив сырья — минимум и максимум из книги, не остаток на начало периода.
 * `DSM Meat`, `DSM Bakery`, `DSM Vegetables`: колонки DU и DV.
 * `DSM Packaging`: колонки DL и DM. У воды пары нет.
 * Плёнка и лоток гамбургера в моке — десятая часть книги: 170–350 кг и 35 000–65 000 шт.
 */
const workshops: Workshop[] = [
  { id: "workshop-meat", name: "Мясной цех", deletedAt: null },
  { id: "workshop-bakery", name: "Пекарня", deletedAt: null },
  { id: "workshop-vegetables", name: "Овощной цех", deletedAt: null },
  { id: "workshop-final", name: "Финальный цех", deletedAt: null },
];

const warehouses: Warehouse[] = [
  { id: "warehouse-1", name: "Склад №1", deletedAt: null },
  { id: "warehouse-2", name: "Склад №2", deletedAt: null },
  { id: "warehouse-3", name: "Склад №3", deletedAt: null },
  { id: "warehouse-4", name: "Склад №4", deletedAt: null },
];

function material(
  id: string,
  name: string,
  brand: string,
  warehouseId: string,
  unit: RawMaterial["unit"],
  priceRubles: number,
  vatPercent: number,
  /** Минимум, кг или шт. `DSM!DU` или `DSM Packaging!DL`. */
  minStock: number,
  /** Максимум, кг или шт. `DSM!DV` или `DSM Packaging!DM`. */
  maxStock: number,
): RawMaterial {
  const stored = (amount: number) =>
    unit === "kg" ? Math.round(amount * 1000) : Math.round(amount);

  return {
    id,
    name,
    brand,
    warehouseId,
    unit,
    priceWithVatKopecks: Math.round(priceRubles * 100),
    vatPercent,
    minNormStock: stored(minStock),
    maxNormStock: stored(maxStock),
    deletedAt: null,
  };
}

const materials: RawMaterial[] = [
  // DSM Meat!DU8:DV8, DU9:DV9, DU10:DV10
  material(
    "material-beef-1",
    "Говядина 1",
    "НКМИТ, Велес",
    "warehouse-4",
    "kg",
    700,
    10,
    1300,
    3000,
  ),
  material(
    "material-beef-2",
    "Говядина 2",
    "Велес",
    "warehouse-4",
    "kg",
    515,
    10,
    1300,
    3000,
  ),
  material(
    "material-fat",
    "Жир говяжий",
    "Парсит",
    "warehouse-4",
    "kg",
    135,
    10,
    620,
    1500,
  ),
  // DSM Bakery!DU8:DV8, DU9:DV9, DU12:DV12. У воды пары нет.
  material(
    "material-flour",
    "Мука пшеничная в/с",
    "Волгоград Царская",
    "warehouse-1",
    "kg",
    30.42,
    10,
    3000,
    12000,
  ),
  material(
    "material-yeast",
    "Дрожжи сухие",
    "Саф Нева",
    "warehouse-1",
    "kg",
    402,
    20,
    140,
    300,
  ),
  material(
    "material-sugar",
    "Сахар-песок",
    "Аврора",
    "warehouse-1",
    "kg",
    66.8,
    10,
    300,
    2000,
  ),
  material("material-water", "Вода", "", "warehouse-1", "kg", 0, 0, 0, 0),
  // DSM Vegetables!DU8, DU11, DU14, DU9, DU12, DU88, DU91 и соседние DV.
  material(
    "material-salt",
    "Соль пищевая",
    "Илецкая",
    "warehouse-2",
    "kg",
    11.63,
    10,
    100,
    400,
  ),
  material(
    "material-oil",
    "Масло подсолнечное",
    "Благо",
    "warehouse-2",
    "kg",
    129,
    10,
    350,
    1500,
  ),
  material(
    "material-ketchup",
    "Кетчуп томатный",
    "Хайнц",
    "warehouse-2",
    "kg",
    219,
    20,
    1200,
    4000,
  ),
  material(
    "material-mustard",
    "Горчица столовая",
    "КК Ахтуба",
    "warehouse-2",
    "kg",
    120,
    20,
    170,
    600,
  ),
  material(
    "material-xanthan",
    "Ксантановая камедь",
    "Профессиональные биотехнологии",
    "warehouse-2",
    "kg",
    560,
    20,
    10,
    30,
  ),
  material("material-onion", "Лук репчатый", "", "warehouse-2", "kg", 46, 10, 400, 1500),
  material(
    "material-pickles",
    "Огурцы маринованные слайсами",
    "Аграм Юг",
    "warehouse-2",
    "kg",
    213.45,
    20,
    900,
    4000,
  ),
  // Плёнка и лоток — десятая часть `DSM Packaging!DL8:DM9`. Этикетка — `DL11:DM11`, цена 1,28 ₽.
  material(
    "material-film",
    "Плёнка для гамбургера",
    "Пакетти групп",
    "warehouse-3",
    "kg",
    419,
    20,
    170,
    350,
  ),
  material(
    "material-tray",
    "Лоток для гамбургера",
    "Георг Полимер",
    "warehouse-3",
    "piece",
    3.91,
    20,
    35000,
    65000,
  ),
  material(
    "material-label",
    "Этикетка для гамбургера",
    "МЛ Принт",
    "warehouse-3",
    "piece",
    1.28,
    20,
    25000,
    70000,
  ),
];

function line(
  id: string,
  refId: string,
  quantityGrams: number,
  kind: RecipeLine["kind"] = "material",
): RecipeLine {
  return { id, kind, refId, quantityGrams };
}

const recipes: RecipeCard[] = [
  {
    id: "recipe-cutlet",
    derivativeId: "derivative-cutlet",
    yieldPercent: 80,
    deletedAt: null,
    lines: [
      line("line-cutlet-beef-1", "material-beef-1", 50_000),
      line("line-cutlet-beef-2", "material-beef-2", 50_000),
      line("line-cutlet-fat", "material-fat", 25_000),
    ],
  },
  {
    id: "recipe-bun",
    derivativeId: "derivative-bun",
    yieldPercent: 83,
    deletedAt: null,
    lines: [
      line("line-bun-flour", "material-flour", 65_060),
      line("line-bun-water", "material-water", 39_759),
      line("line-bun-sugar", "material-sugar", 7_229),
      line("line-bun-oil", "material-oil", 6_024),
      line("line-bun-yeast", "material-yeast", 1_205),
      line("line-bun-salt", "material-salt", 1_205),
    ],
  },
  {
    id: "recipe-ketchup",
    derivativeId: "derivative-ketchup",
    yieldPercent: 100,
    deletedAt: null,
    lines: [
      line("line-ketchup-base", "material-ketchup", 99_600),
      line("line-ketchup-xanthan", "material-xanthan", 400),
    ],
  },
  {
    id: "recipe-mustard",
    derivativeId: "derivative-mustard",
    yieldPercent: 100,
    deletedAt: null,
    lines: [
      line("line-mustard-base", "material-mustard", 99_700),
      line("line-mustard-xanthan", "material-xanthan", 300),
    ],
  },
  {
    id: "recipe-onion",
    derivativeId: "derivative-onion",
    yieldPercent: 80,
    deletedAt: null,
    lines: [line("line-onion-raw", "material-onion", 125_000)],
  },
  {
    id: "recipe-burger",
    derivativeId: "derivative-burger",
    yieldPercent: null,
    deletedAt: null,
    lines: [
      line("line-burger-cutlet", "derivative-cutlet", 40_000, "derivative"),
      line("line-burger-bun", "derivative-bun", 50_000, "derivative"),
      line("line-burger-ketchup", "derivative-ketchup", 10_000, "derivative"),
      line("line-burger-mustard", "derivative-mustard", 5_000, "derivative"),
      line("line-burger-onion", "derivative-onion", 5_000, "derivative"),
      line("line-burger-pickles", "material-pickles", 10_000),
      line("line-burger-film", "material-film", 3_250),
      line("line-burger-tray", "material-tray", 1_000),
      line("line-burger-label", "material-label", 1_000),
    ],
  },
];

/**
 * Факт 1–15 сентября 2026, сумма близка к половине плана на 20 000 шт.
 * Выпуск производных — закладка рецепта на выпуск гамбургера этого дня.
 * Расход по дням чуть выше или ниже нормы, в сумме около половины плана.
 */
const SEPTEMBER_BURGER_PIECES = [
  720, 780, 808, 752, 420, 380, 760, 800, 740, 820, 788, 452, 360, 768, 652,
] as const;

/** Отклонение расхода от нормы, целые проценты. Сумма по дням близка к нулю. */
const SEPTEMBER_USE_DRIFT_PERCENT = [
  2, -1, 3, -2, 1, -2, 2, -1, 2, -3, 1, 0, 4, -3, 0,
] as const;

const SEPTEMBER_FACT_NOTES = [
  "Утренняя сборка",
  "Полная смена",
  "Добор к заказу",
  "Пятничная отгрузка",
  "Короткая суббота",
  "Дежурная смена",
  "Старт недели",
  "Две бригады",
  "Сборка после обеда",
  "Запас на пятницу",
  "Отгрузка сетей",
  "Короткая суббота",
  "Дежурная смена",
  "Полная смена",
  "Середина месяца",
] as const;

function recipeOf(derivativeId: string): RecipeCard {
  const recipe = recipes.find(
    (item) => item.derivativeId === derivativeId && item.deletedAt === null,
  );
  if (!recipe) {
    throw new Error(derivativeId);
  }

  return recipe;
}

function scaledQuantity(norm: number, output: number, isFinalProduct: boolean): number {
  const quantity = scaleRecipeQuantity(norm, output, recipeBatch(isFinalProduct));
  if (quantity === null) {
    throw new Error("norm");
  }

  return quantity;
}

function driftedQuantity(quantity: number, percent: number): number {
  if (percent === 0) {
    return quantity;
  }

  const factor = 100 + percent;
  if (factor <= 0) {
    return 0;
  }

  return scaleRecipeQuantity(quantity, factor, BigInt(100)) ?? quantity;
}

function factUses(
  recipe: RecipeCard,
  outputQuantity: number,
  isFinalProduct: boolean,
  driftPercent: number,
  idPrefix: string,
): ProductionFactUse[] {
  return recipe.lines.map((entry) => ({
    id: `${idPrefix}-${entry.refId}`,
    kind: entry.kind,
    refId: entry.refId,
    quantity: driftedQuantity(
      scaledQuantity(entry.quantityGrams, outputQuantity, isFinalProduct),
      driftPercent,
    ),
  }));
}

function septemberProductionFacts(): ProductionFact[] {
  const burger = recipeOf("derivative-burger");

  return SEPTEMBER_BURGER_PIECES.map((pieces, index) => {
    const day = String(index + 1).padStart(2, "0");
    const occurredOn = `2026-09-${day}`;
    const driftPercent = SEPTEMBER_USE_DRIFT_PERCENT[index] ?? 0;
    const burgerOutputId = `fact-${occurredOn}-burger`;
    const outputs: ProductionFactOutput[] = [
      {
        id: burgerOutputId,
        refId: "derivative-burger",
        quantity: pieces,
        uses: factUses(burger, pieces, true, driftPercent, burgerOutputId),
      },
    ];

    for (const entry of burger.lines) {
      if (entry.kind !== "derivative") {
        continue;
      }

      const grams = scaledQuantity(entry.quantityGrams, pieces, true);
      const outputId = `fact-${occurredOn}-${entry.refId.slice("derivative-".length)}`;
      outputs.push({
        id: outputId,
        refId: entry.refId,
        quantity: grams,
        uses: factUses(recipeOf(entry.refId), grams, false, driftPercent, outputId),
      });
    }

    return {
      id: `fact-${occurredOn}`,
      occurredOn,
      note: SEPTEMBER_FACT_NOTES[index] ?? "",
      outputs,
      deletedAt: null,
    };
  });
}

/**
 * Цена строки поставки — закупочная цена сырья, `DSM` колонка H.
 * Ставка копируется с сырья в момент записи.
 */
function deliveryLine(id: string, materialId: string, quantity: number): DeliveryLine {
  const source = materials.find((item) => item.id === materialId);
  if (!source) {
    throw new Error(materialId);
  }

  return {
    id,
    materialId,
    quantity,
    priceWithVatKopecks: source.priceWithVatKopecks,
    vatPercent: source.vatPercent,
  };
}

/**
 * План сентября — «Гамбургер 120 охл»: `Svod!F63` = 85,13 ₽, `Svod!H63` = 20 000 шт.
 * Поставки 1 сентября закрывают закладку этого объёма.
 * На 1000 шт, `Rec&Calc Final Products` строка 58: 40 кг котлеты, 50 кг булочки,
 * 10 кг кетчупа, 5 кг горчицы, 5 кг лука, 10 кг огурцов, 3,25 кг плёнки,
 * 1000 лотков и 1000 этикеток. Производные разложены до сырья по рецепту на 100 кг.
 * Воды нет: закупочная цена в книге нулевая.
 * Поставка лежит на одном складе, поэтому день разбит на четыре документа.
 */
const SEPTEMBER_PLAN_NOTE = "Под план сентября";

const deliveries: Delivery[] = [
  {
    id: "delivery-2026-09-01-meat",
    warehouseId: "warehouse-4",
    occurredOn: "2026-09-01",
    note: SEPTEMBER_PLAN_NOTE,
    deletedAt: null,
    lines: [
      deliveryLine("delivery-line-beef-1", "material-beef-1", 400_000),
      deliveryLine("delivery-line-beef-2", "material-beef-2", 400_000),
      deliveryLine("delivery-line-fat", "material-fat", 200_000),
    ],
  },
  {
    id: "delivery-2026-09-01-bakery",
    warehouseId: "warehouse-1",
    occurredOn: "2026-09-01",
    note: SEPTEMBER_PLAN_NOTE,
    deletedAt: null,
    lines: [
      deliveryLine("delivery-line-flour", "material-flour", 650_600),
      deliveryLine("delivery-line-yeast", "material-yeast", 12_050),
      deliveryLine("delivery-line-sugar", "material-sugar", 72_290),
    ],
  },
  {
    id: "delivery-2026-09-01-vegetables",
    warehouseId: "warehouse-2",
    occurredOn: "2026-09-01",
    note: SEPTEMBER_PLAN_NOTE,
    deletedAt: null,
    lines: [
      deliveryLine("delivery-line-salt", "material-salt", 12_050),
      deliveryLine("delivery-line-oil", "material-oil", 60_240),
      deliveryLine("delivery-line-ketchup", "material-ketchup", 199_200),
      deliveryLine("delivery-line-mustard", "material-mustard", 99_700),
      deliveryLine("delivery-line-xanthan", "material-xanthan", 1_100),
      deliveryLine("delivery-line-onion", "material-onion", 125_000),
      deliveryLine("delivery-line-pickles", "material-pickles", 200_000),
    ],
  },
  {
    id: "delivery-2026-09-01-packaging",
    warehouseId: "warehouse-3",
    occurredOn: "2026-09-01",
    note: SEPTEMBER_PLAN_NOTE,
    deletedAt: null,
    lines: [
      deliveryLine("delivery-line-film", "material-film", 65_000),
      deliveryLine("delivery-line-tray", "material-tray", 20_000),
      deliveryLine("delivery-line-label", "material-label", 20_000),
    ],
  },
];

const salesPlans: SalesPlan[] = [
  {
    id: "plan-2026-09",
    month: "2026-09",
    deletedAt: null,
    lines: [
      {
        id: "plan-2026-09-burger",
        productId: "derivative-burger",
        /** `Svod!F63`, 85,13 ₽. */
        priceWithVatKopecks: 8_513,
        /** `Svod!H63`. */
        volumePieces: 20_000,
      },
    ],
  },
];

/** Мок одного гамбургера: сырьё, производные, рецепты, план сентября, поставки 1 сентября и факт 1–15 сентября. */
export const mockDocument: PrototypeDocument = {
  schemaVersion: SCHEMA_VERSION,
  workshops,
  warehouses,
  materials,
  derivatives: [
    {
      id: "derivative-cutlet",
      name: "Котлета говяжья",
      isFinalProduct: false,
      warehouseId: "warehouse-4",
      workshopId: "workshop-meat",
      vatPercent: null,
      deletedAt: null,
    },
    {
      id: "derivative-bun",
      name: "Булочка для бургера",
      isFinalProduct: false,
      warehouseId: "warehouse-1",
      workshopId: "workshop-bakery",
      vatPercent: null,
      deletedAt: null,
    },
    {
      id: "derivative-ketchup",
      name: "Кетчуп с загустителем",
      isFinalProduct: false,
      warehouseId: "warehouse-2",
      workshopId: "workshop-vegetables",
      vatPercent: null,
      deletedAt: null,
    },
    {
      id: "derivative-mustard",
      name: "Горчица с загустителем",
      isFinalProduct: false,
      warehouseId: "warehouse-2",
      workshopId: "workshop-vegetables",
      vatPercent: null,
      deletedAt: null,
    },
    {
      id: "derivative-onion",
      name: "Лук репчатый очищенный нарезанный",
      isFinalProduct: false,
      warehouseId: "warehouse-2",
      workshopId: "workshop-vegetables",
      vatPercent: null,
      deletedAt: null,
    },
    {
      id: "derivative-burger",
      name: "Гамбургер",
      isFinalProduct: true,
      warehouseId: "warehouse-3",
      workshopId: "workshop-final",
      /** `Svod!N63`, роллы и сэндвичи. */
      vatPercent: 20,
      deletedAt: null,
    },
  ],
  recipes,
  deliveries,
  writeOffs: [],
  salesPlans,
  productionFacts: septemberProductionFacts(),
  salesFacts: [],
};

export function createMockDocument(): PrototypeDocument {
  return {
    schemaVersion: mockDocument.schemaVersion,
    workshops: mockDocument.workshops.map((item) => ({ ...item })),
    warehouses: mockDocument.warehouses.map((item) => ({ ...item })),
    materials: mockDocument.materials.map((item) => ({ ...item })),
    derivatives: mockDocument.derivatives.map((item) => ({ ...item })),
    recipes: mockDocument.recipes.map((item) => ({
      ...item,
      lines: item.lines.map((entry) => ({ ...entry })),
    })),
    deliveries: mockDocument.deliveries.map((item) => ({
      ...item,
      lines: item.lines.map((entry) => ({ ...entry })),
    })),
    writeOffs: mockDocument.writeOffs.map((item) => ({
      ...item,
      lines: item.lines.map((entry) => ({ ...entry })),
    })),
    salesPlans: mockDocument.salesPlans.map((item) => ({
      ...item,
      lines: item.lines.map((entry) => ({ ...entry })),
    })),
    productionFacts: mockDocument.productionFacts.map((item) => ({
      ...item,
      outputs: item.outputs.map((output) => ({
        ...output,
        uses: output.uses.map((use) => ({ ...use })),
      })),
    })),
    salesFacts: mockDocument.salesFacts.map((item) => ({
      ...item,
      openings: item.openings.map((opening) => ({ ...opening })),
      days: item.days.map((day) => ({
        ...day,
        cells: day.cells.map((cell) => ({ ...cell })),
      })),
    })),
  };
}
