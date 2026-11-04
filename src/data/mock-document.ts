import { mockMaterials } from '@/data/mock-materials';
import { mockHrPositions, mockTransportCarriers } from '@/data/mock-opex';
import {
  catalogCategories,
  catalogOpexOtherLines,
  type Derivative,
  type FinishedGoodsNorm,
  type FinishedGoodsOpening,
  type Product,
  type ProductionEntry,
  type ProductionPlan,
  type PrototypeDocument,
  type Sale,
  type SalesPlan,
  SCHEMA_VERSION,
} from '@/domain/document';

/**
 * Мок: два салата, одно горячее, гамбургер и сэндвич без рецепта.
 * Себестоимость 1 шт продаж считается из рецепта, в документ не пишется.
 * План продаж и план выпуска сентября и октября 2026 одинаковые: 500, 600, 800 и 1 000 шт (сэндвич — 0).
 * Ноябрь: 500, 800, 900 и 900 — Оливье и гуляш выше к зиме, гамбургер чуть ниже.
 * Факт продаж сентября чуть выше плана: 550, 650, 900 и 1 100.
 * Выпуск сентября чуть выше продаж у салатов и гуляша (650, 800, 1 050) — расчётный перенос на октябрь 140, 200 и 220 шт.
 * У гамбургера выпуск 1 000 при продажах 1 100 — расчётный перенос 20 шт. Инвентаризация сентября: недостача у Цезаря, гуляша и гамбургера, излишек у Оливье.
 * Факт октября — 2, 9, 13, 16 и 20 число. Продажи за месяц: 350, 420, 560 и 380 шт.
 * Выпуск октября не копирует продажи: Цезарь и гуляш чуть впереди, Оливье и гамбургер отстают.
 * Инвентаризация октября (перенос на ноябрь): 160, 195, 220 и 0. Журнальный конец 170, 185, 235 и −33:
 * у салатов и гуляша счёт рядом с журналом, у гамбургера остаток не ниже нуля.
 * Факт ноября — одна отгрузка 2 ноября: продажи 45, 90, 80 и 100; выпуск 50, 85, 90 и 110.
 * Это около десятой плана (3 дня из 30), чтобы прогноз месяца не раздувался. Инвентаризации ноября нет.
 * Операционные расходы, HR и транспорт — справочники из книги, суммы нулевые. Нормативы движения — сентябрь, октябрь и ноябрь.
 * Плановые цены с НДС: салаты — мок, гуляш `Svod!F31`, гамбургер `Svod!F63`.
 * Факт продаж — круглые и полукруглые: 95, 70, 100 и 85 ₽ с НДС.
 * НДС у всех товаров 20%. В книге у горячих `Svod!N31` 10%, у роллов `Svod!N63` 20%.
 * Объёмы книги (4 000, 5 000, 6 000, 20 000) в мок не переносятся: на экране нужны лёгкие сотни.
 */
/** Тысячные доли единицы закладки рецепта. */
const q = (units: number) => Math.round(units * 1000);

const caesar: Product = {
  id: 'product-caesar',
  name: 'Цезарь с курицей',
  categoryId: 'category-salads',
  warehouseId: 'warehouse-1',
  vatPercent: 20,
  /** Партия ×1000: 80 + 15 + лоток 0 кг → 95 кг / 1000 шт. */
  outputKilogramThousandths: q(95),
  outputPieceThousandths: q(1000),
  lines: [
    {
      id: 'product-line-caesar-chicken',
      componentKind: 'material',
      componentId: 'material-chicken',
      quantity: q(80),
    },
    {
      id: 'product-line-caesar-oil',
      componentKind: 'material',
      componentId: 'material-oil',
      quantity: q(15),
    },
    {
      id: 'product-line-caesar-tray',
      componentKind: 'material',
      componentId: 'material-tray',
      quantity: q(1000),
    },
  ],
  deletedAt: null,
};

const olivier: Product = {
  id: 'product-olivier',
  name: 'Оливье',
  categoryId: 'category-salads',
  warehouseId: 'warehouse-2',
  vatPercent: 20,
  /** Партия ×1000: 20 + 5 + лоток 0 кг → 25 кг / 1000 шт. */
  outputKilogramThousandths: q(25),
  outputPieceThousandths: q(1000),
  lines: [
    {
      id: 'product-line-olivier-oil',
      componentKind: 'material',
      componentId: 'material-oil-w2',
      quantity: q(20),
    },
    {
      id: 'product-line-olivier-salt',
      componentKind: 'material',
      componentId: 'material-salt-w2',
      quantity: q(5),
    },
    {
      id: 'product-line-olivier-tray',
      componentKind: 'material',
      componentId: 'material-tray-w2',
      quantity: q(1000),
    },
  ],
  deletedAt: null,
};

const goulash: Product = {
  id: 'product-goulash',
  name: 'Гуляш из курицы с рисом',
  categoryId: 'category-hot',
  warehouseId: 'warehouse-1',
  vatPercent: 20,
  /** Партия ×100: 15 бульона + 12 курицы + лоток 0 кг → 27 кг / 100 шт. */
  outputKilogramThousandths: q(27),
  outputPieceThousandths: q(100),
  lines: [
    {
      id: 'product-line-goulash-broth',
      componentKind: 'derivative',
      componentId: 'derivative-broth',
      quantity: q(15),
    },
    {
      id: 'product-line-goulash-chicken',
      componentKind: 'material',
      componentId: 'material-chicken',
      quantity: q(12),
    },
    {
      id: 'product-line-goulash-tray',
      componentKind: 'material',
      componentId: 'material-tray',
      quantity: q(100),
    },
  ],
  deletedAt: null,
};

const burger: Product = {
  id: 'product-burger',
  name: 'Гамбургер',
  categoryId: 'category-rolls',
  warehouseId: 'warehouse-1',
  vatPercent: 20,
  /** Партия ×1000: котлета 97 + булочка 65 + кетчуп 20 + этикетка 0 → 182 кг / 1000 шт. */
  outputKilogramThousandths: q(182),
  outputPieceThousandths: q(1000),
  lines: [
    {
      id: 'product-line-burger-cutlet',
      componentKind: 'derivative',
      componentId: 'derivative-cutlet',
      quantity: q(1000),
    },
    {
      id: 'product-line-burger-bun',
      componentKind: 'derivative',
      componentId: 'derivative-bun',
      quantity: q(1000),
    },
    {
      id: 'product-line-burger-ketchup',
      componentKind: 'material',
      componentId: 'material-ketchup',
      quantity: q(20),
    },
    {
      id: 'product-line-burger-label',
      componentKind: 'material',
      componentId: 'material-label',
      quantity: q(1000),
    },
  ],
  deletedAt: null,
};

/** Рецепт пустой — для журнала готовой продукции без состава. */
const sandwich: Product = {
  id: 'product-sandwich',
  name: 'Сэндвич с курицей',
  categoryId: 'category-rolls',
  warehouseId: 'warehouse-2',
  vatPercent: 20,
  outputKilogramThousandths: 0,
  outputPieceThousandths: q(1),
  lines: [],
  deletedAt: null,
};

/** Плановая цена с НДС и расчётная цена выпуска, копейки. Салаты — мок, гуляш `Svod!F31`, гамбургер `Svod!F63`. */
const priceWithVat = {
  'product-caesar': 9_640,
  'product-olivier': 6_850,
  'product-goulash': 9_914,
  'product-burger': 8_513,
  'product-sandwich': 7_500,
} as const;

/**
 * Фактическая цена продажи с НДС, копейки. Круглые и полукруглые, рядом с планом:
 * 95, 70, 100 и 85 ₽.
 */
const factPriceWithVat = {
  'product-caesar': 9_500,
  'product-olivier': 7_000,
  'product-goulash': 10_000,
  'product-burger': 8_500,
  'product-sandwich': 7_500,
} as const;

type CatalogProductId = keyof typeof priceWithVat;

/** План продаж и план выпуска, шт. Сентябрь и октябрь совпадают. */
const planPieces = {
  'product-caesar': 500,
  'product-olivier': 600,
  'product-goulash': 800,
  'product-burger': 1_000,
  'product-sandwich': 0,
} as const;

/** Ноябрь: новогодний Оливье и горячее выше, гамбургер чуть ниже октябрьского плана. */
const novemberPlanPieces = {
  'product-caesar': 500,
  'product-olivier': 800,
  'product-goulash': 900,
  'product-burger': 900,
  'product-sandwich': 0,
} as const satisfies Record<CatalogProductId, number>;

const catalogProductIds = Object.keys(planPieces) as CatalogProductId[];

function salesPlan(month: string, pieces: Readonly<Record<CatalogProductId, number>> = planPieces): SalesPlan {
  return {
    id: `plan-${month}`,
    month,
    deletedAt: null,
    lines: catalogProductIds.map((productId) => ({
      id: `plan-${month}-${productId.slice('product-'.length)}`,
      productId,
      priceWithVat: priceWithVat[productId],
      volumePieces: pieces[productId],
    })),
  };
}

function productionPlan(
  month: string,
  pieces: Readonly<Record<CatalogProductId, number>> = planPieces,
): ProductionPlan {
  return {
    id: `production-plan-${month}`,
    month,
    deletedAt: null,
    lines: catalogProductIds.map((productId) => ({
      id: `production-plan-${month}-${productId.slice('product-'.length)}`,
      productId,
      volumePieces: pieces[productId],
    })),
  };
}

/** Норматив остатков на производстве, шт. Одинаковый в сентябре и октябре. */
const normPieces = {
  'product-caesar': { minPieces: 80, maxPieces: 180 },
  'product-olivier': { minPieces: 100, maxPieces: 220 },
  'product-goulash': { minPieces: 120, maxPieces: 250 },
  'product-burger': { minPieces: 0, maxPieces: 80 },
  'product-sandwich': { minPieces: 0, maxPieces: 0 },
} as const satisfies Record<CatalogProductId, { minPieces: number; maxPieces: number }>;

/**
 * Инвентаризация на конец сентября 2026, шт.
 * Расчётный остаток на конец сентября: 140, 200, 220 и 20 шт.
 * Ниже расчёта — недостача в «Откл.»; у Оливье излишек +10.
 * Сэндвич без продаж и выпуска — 0.
 */
const closingInventorySeptember = {
  'product-caesar': 125,
  'product-olivier': 210,
  'product-goulash': 195,
  'product-burger': 12,
  'product-sandwich': 0,
} as const satisfies Record<CatalogProductId, number>;

/**
 * Инвентаризация на конец октября 2026, шт. Это остаток на начало ноября.
 * Журнальный конец октября: 170, 185, 235 и −33 (сэндвич 0).
 * Счёт рядом с журналом; гамбургер не уходит ниже нуля.
 */
const closingInventoryOctober = {
  'product-caesar': 160,
  'product-olivier': 195,
  'product-goulash': 220,
  'product-burger': 0,
  'product-sandwich': 0,
} as const satisfies Record<CatalogProductId, number>;

function finishedGoodsOpening(month: string, piecesByProduct: Record<CatalogProductId, number>): FinishedGoodsOpening {
  return {
    id: `finished-goods-opening:${month}`,
    month,
    lines: catalogProductIds.map((productId) => ({
      id: `finished-goods-opening-line:${month}:${productId.slice('product-'.length)}`,
      productId,
      pieces: piecesByProduct[productId],
    })),
  };
}

function finishedGoodsNorm(month: string): FinishedGoodsNorm {
  return {
    id: `finished-goods-norm:${month}`,
    month,
    lines: catalogProductIds.map((productId) => ({
      id: `finished-goods-norm-line:${month}:${productId.slice('product-'.length)}`,
      productId,
      minPieces: normPieces[productId].minPieces,
      maxPieces: normPieces[productId].maxPieces,
    })),
  };
}

interface OrderDraft {
  id: string;
  customerName: string;
  occurredOn: string;
  pieces: Partial<Record<CatalogProductId, number>>;
}

/**
 * Сентябрь продажи: 550, 650, 900 и 1 100 шт — примерно на десятую выше плана.
 * Октябрь: 350, 420, 560 и 380 шт за 2, 9, 13, 16 и 20 число.
 * До 21 октября Цезарь, Оливье и гуляш не ниже темпа, гамбургер ниже.
 * Ноябрь, 2-е число: 45, 90, 80 и 100 — около десятой месячного плана.
 */
const orders: OrderDraft[] = [
  {
    id: 'sale-2026-09-03',
    customerName: 'РИТЕЙЛ Север',
    occurredOn: '2026-09-03',
    pieces: {
      'product-caesar': 150,
      'product-olivier': 200,
      'product-goulash': 250,
      'product-burger': 300,
    },
  },
  {
    id: 'sale-2026-09-10',
    customerName: 'РИТЕЙЛ Центр',
    occurredOn: '2026-09-10',
    pieces: {
      'product-caesar': 200,
      'product-olivier': 250,
      'product-goulash': 300,
      'product-burger': 400,
    },
  },
  {
    id: 'sale-2026-09-18',
    customerName: 'РИТЕЙЛ Юг',
    occurredOn: '2026-09-18',
    pieces: {
      'product-caesar': 200,
      'product-olivier': 200,
      'product-goulash': 350,
      'product-burger': 400,
    },
  },
  {
    id: 'sale-2026-10-02',
    customerName: 'РИТЕЙЛ Север',
    occurredOn: '2026-10-02',
    pieces: {
      'product-caesar': 100,
      'product-olivier': 150,
      'product-goulash': 150,
      'product-burger': 150,
    },
  },
  {
    id: 'sale-2026-10-09',
    customerName: 'РИТЕЙЛ Юг',
    occurredOn: '2026-10-09',
    pieces: {
      'product-caesar': 100,
      'product-olivier': 100,
      'product-goulash': 100,
      'product-burger': 150,
    },
  },
  {
    id: 'sale-2026-10-13',
    customerName: 'РИТЕЙЛ Центр',
    occurredOn: '2026-10-13',
    pieces: {
      'product-caesar': 50,
      'product-olivier': 60,
      'product-goulash': 110,
      'product-burger': 30,
    },
  },
  {
    id: 'sale-2026-10-16',
    customerName: 'РИТЕЙЛ Север',
    occurredOn: '2026-10-16',
    pieces: {
      'product-caesar': 50,
      'product-olivier': 60,
      'product-goulash': 100,
      'product-burger': 30,
    },
  },
  {
    id: 'sale-2026-10-20',
    customerName: 'РИТЕЙЛ Юг',
    occurredOn: '2026-10-20',
    pieces: {
      'product-caesar': 50,
      'product-olivier': 50,
      'product-goulash': 100,
      'product-burger': 20,
    },
  },
  {
    id: 'sale-2026-11-02',
    customerName: 'РИТЕЙЛ Север',
    occurredOn: '2026-11-02',
    pieces: {
      'product-caesar': 45,
      'product-olivier': 90,
      'product-goulash': 80,
      'product-burger': 100,
    },
  },
];

/**
 * Выпуск тех же дней, что и продажи. Октябрь по товарам расходится с продажами.
 * Сентябрь: салаты и гуляш выше продаж (остаток), гамбургер ниже.
 * Итого выпуск сентября: 650, 800, 1 050 и 1 000.
 * 2 ноября: 50, 85, 90 и 110 — Цезарь и гуляш чуть впереди продаж дня, Оливье сзади, гамбургер догоняет нулевой остаток.
 */
const productionOrders: OrderDraft[] = [
  {
    id: 'sale-2026-09-03',
    customerName: 'РИТЕЙЛ Север',
    occurredOn: '2026-09-03',
    pieces: {
      'product-caesar': 180,
      'product-olivier': 250,
      'product-goulash': 300,
      'product-burger': 270,
    },
  },
  {
    id: 'sale-2026-09-10',
    customerName: 'РИТЕЙЛ Центр',
    occurredOn: '2026-09-10',
    pieces: {
      'product-caesar': 240,
      'product-olivier': 300,
      'product-goulash': 350,
      'product-burger': 360,
    },
  },
  {
    id: 'sale-2026-09-18',
    customerName: 'РИТЕЙЛ Юг',
    occurredOn: '2026-09-18',
    pieces: {
      'product-caesar': 230,
      'product-olivier': 250,
      'product-goulash': 400,
      'product-burger': 370,
    },
  },
  {
    id: 'sale-2026-10-02',
    customerName: 'РИТЕЙЛ Север',
    occurredOn: '2026-10-02',
    pieces: {
      'product-caesar': 115,
      'product-olivier': 145,
      'product-goulash': 165,
      'product-burger': 130,
    },
  },
  {
    id: 'sale-2026-10-09',
    customerName: 'РИТЕЙЛ Юг',
    occurredOn: '2026-10-09',
    pieces: {
      'product-caesar': 110,
      'product-olivier': 90,
      'product-goulash': 115,
      'product-burger': 140,
    },
  },
  {
    id: 'sale-2026-10-13',
    customerName: 'РИТЕЙЛ Центр',
    occurredOn: '2026-10-13',
    pieces: {
      'product-caesar': 55,
      'product-olivier': 55,
      'product-goulash': 120,
      'product-burger': 25,
    },
  },
  {
    id: 'sale-2026-10-16',
    customerName: 'РИТЕЙЛ Север',
    occurredOn: '2026-10-16',
    pieces: {
      'product-caesar': 60,
      'product-olivier': 55,
      'product-goulash': 105,
      'product-burger': 25,
    },
  },
  {
    id: 'sale-2026-10-20',
    customerName: 'РИТЕЙЛ Юг',
    occurredOn: '2026-10-20',
    pieces: {
      'product-caesar': 55,
      'product-olivier': 50,
      'product-goulash': 95,
      'product-burger': 15,
    },
  },
  {
    id: 'sale-2026-11-02',
    customerName: 'РИТЕЙЛ Север',
    occurredOn: '2026-11-02',
    pieces: {
      'product-caesar': 50,
      'product-olivier': 85,
      'product-goulash': 90,
      'product-burger': 110,
    },
  },
];

function orderLines(order: OrderDraft): Array<{ productId: CatalogProductId; pieces: number }> {
  return catalogProductIds.flatMap((productId) => {
    const pieces = order.pieces[productId] ?? 0;
    return pieces > 0 ? [{ productId, pieces }] : [];
  });
}

function salesFromOrders(drafts: readonly OrderDraft[]): Sale[] {
  return drafts.map((order) => ({
    id: order.id,
    customerName: order.customerName,
    occurredOn: order.occurredOn,
    lines: orderLines(order).map((line) => ({
      id: `${order.id}-${line.productId.slice('product-'.length)}`,
      productId: line.productId,
      pieces: line.pieces,
      amountWithVat: line.pieces * factPriceWithVat[line.productId],
    })),
  }));
}

function productionFromOrders(drafts: readonly OrderDraft[]): ProductionEntry[] {
  return drafts.map((order) => ({
    id: order.id.replace('sale-', 'output-'),
    occurredOn: order.occurredOn,
    lines: orderLines(order).map((line) => ({
      id: `${order.id.replace('sale-', 'output-')}-${line.productId.slice('product-'.length)}`,
      productId: line.productId,
      pieces: line.pieces,
      priceWithVat: priceWithVat[line.productId],
    })),
  }));
}

const salesPlans: SalesPlan[] = [salesPlan('2026-09'), salesPlan('2026-10'), salesPlan('2026-11', novemberPlanPieces)];
const productionPlans: ProductionPlan[] = [
  productionPlan('2026-09'),
  productionPlan('2026-10'),
  productionPlan('2026-11', novemberPlanPieces),
];
const finishedGoodsNorms: FinishedGoodsNorm[] = [
  finishedGoodsNorm('2026-09'),
  finishedGoodsNorm('2026-10'),
  finishedGoodsNorm('2026-11'),
];
const finishedGoodsOpenings: FinishedGoodsOpening[] = [
  finishedGoodsOpening('2026-09', closingInventorySeptember),
  finishedGoodsOpening('2026-10', closingInventoryOctober),
];

/**
 * Имена с макета рецептурных журналов. Выход = сумма кг компонентов.
 * Партии домножены на степень 10, чтобы кг выхода были целыми (напр. 1000 котлет / 97 кг).
 */
const mockDerivatives: Derivative[] = [
  {
    id: 'derivative-mince',
    name: 'Фарш говяжий',
    workshopId: 'meat-1',
    unit: 'кг',
    /** ×100: 800 + 12 + 20 → 832 кг. */
    outputKilogramThousandths: q(832),
    outputPieceThousandths: null,
    heatTreatmentYieldPercent: 100,
    lines: [
      {
        id: 'derivative-line-mince-beef',
        componentKind: 'material',
        componentId: 'material-beef',
        quantity: q(800),
      },
      {
        id: 'derivative-line-mince-salt',
        componentKind: 'material',
        componentId: 'material-salt',
        quantity: q(12),
      },
      {
        id: 'derivative-line-mince-oil',
        componentKind: 'material',
        componentId: 'material-oil',
        quantity: q(20),
      },
    ],
    deletedAt: null,
  },
  {
    id: 'derivative-cutlet',
    name: 'Котлета сырая',
    workshopId: 'meat-1',
    unit: 'шт',
    /** ×1000: 80 + 2 + 10 + 5 → 97 кг / 1000 шт. */
    outputKilogramThousandths: q(97),
    outputPieceThousandths: q(1000),
    heatTreatmentYieldPercent: 100,
    lines: [
      {
        id: 'derivative-line-cutlet-mince',
        componentKind: 'derivative',
        componentId: 'derivative-mince',
        quantity: q(80),
      },
      {
        id: 'derivative-line-cutlet-nitrite',
        componentKind: 'material',
        componentId: 'material-nitrite',
        quantity: q(2),
      },
      {
        id: 'derivative-line-cutlet-oil',
        componentKind: 'material',
        componentId: 'material-oil',
        quantity: q(10),
      },
      {
        id: 'derivative-line-cutlet-salt',
        componentKind: 'material',
        componentId: 'material-salt',
        quantity: q(5),
      },
    ],
    deletedAt: null,
  },
  {
    id: 'derivative-broth',
    name: 'Бульон мясной',
    workshopId: 'meat-1',
    unit: 'кг',
    /** ×100: 200 + 150 + 5 → 355 кг. */
    outputKilogramThousandths: q(355),
    outputPieceThousandths: null,
    heatTreatmentYieldPercent: 100,
    lines: [
      {
        id: 'derivative-line-broth-beef',
        componentKind: 'material',
        componentId: 'material-beef',
        quantity: q(200),
      },
      {
        id: 'derivative-line-broth-chicken',
        componentKind: 'material',
        componentId: 'material-chicken',
        quantity: q(150),
      },
      {
        id: 'derivative-line-broth-salt',
        componentKind: 'material',
        componentId: 'material-salt',
        quantity: q(5),
      },
    ],
    deletedAt: null,
  },
  {
    id: 'derivative-dough',
    name: 'Тесто дрожжевое',
    workshopId: 'bakery-1',
    unit: 'кг',
    /** ×100: 500 + 8 + 10 + 15 → 533 кг. */
    outputKilogramThousandths: q(533),
    outputPieceThousandths: null,
    heatTreatmentYieldPercent: 100,
    lines: [
      {
        id: 'derivative-line-dough-flour',
        componentKind: 'material',
        componentId: 'material-flour',
        quantity: q(500),
      },
      {
        id: 'derivative-line-dough-yeast',
        componentKind: 'material',
        componentId: 'material-yeast',
        quantity: q(8),
      },
      {
        id: 'derivative-line-dough-salt',
        componentKind: 'material',
        componentId: 'material-salt',
        quantity: q(10),
      },
      {
        id: 'derivative-line-dough-oil',
        componentKind: 'material',
        componentId: 'material-oil',
        quantity: q(15),
      },
    ],
    deletedAt: null,
  },
  {
    id: 'derivative-bun',
    name: 'Булочка для сэндвича',
    workshopId: 'bakery-1',
    unit: 'шт',
    /** ×1000: 60 + 5 → 65 кг / 1000 шт. */
    outputKilogramThousandths: q(65),
    outputPieceThousandths: q(1000),
    heatTreatmentYieldPercent: 100,
    lines: [
      {
        id: 'derivative-line-bun-dough',
        componentKind: 'derivative',
        componentId: 'derivative-dough',
        quantity: q(60),
      },
      {
        id: 'derivative-line-bun-oil',
        componentKind: 'material',
        componentId: 'material-oil',
        quantity: q(5),
      },
    ],
    deletedAt: null,
  },
];

export const mockDocument: PrototypeDocument = {
  schemaVersion: SCHEMA_VERSION,
  categories: catalogCategories(),
  products: [caesar, olivier, goulash, burger, sandwich],
  salesPlans,
  productionPlans,
  sales: salesFromOrders(orders),
  productionEntries: productionFromOrders(productionOrders),
  hrPositions: mockHrPositions,
  hrMonthPlans: [],
  hrDayFacts: [],
  hrTaxRates: [],
  transportCarriers: mockTransportCarriers,
  transportHireMonthPlans: [],
  transportHireDayFacts: [],
  transportOwnMonthPlans: [],
  transportOwnDayFacts: [],
  opexOtherLines: catalogOpexOtherLines(),
  opexMonthLines: [],
  finishedGoodsOpenings,
  finishedGoodsNorms,
  materials: mockMaterials.materials,
  materialNorms: mockMaterials.materialNorms,
  materialMonthPlans: mockMaterials.materialMonthPlans,
  materialOpenings: mockMaterials.materialOpenings,
  materialReceipts: mockMaterials.materialReceipts,
  derivatives: mockDerivatives,
  derivativeOpenings: [],
  derivativeNorms: [],
};

export function createMockDocument(): PrototypeDocument {
  return {
    schemaVersion: mockDocument.schemaVersion,
    categories: mockDocument.categories.map((item) => ({ ...item })),
    products: mockDocument.products.map((item) => ({
      ...item,
      lines: item.lines.map((line) => ({ ...line })),
    })),
    salesPlans: mockDocument.salesPlans.map((item) => ({
      ...item,
      lines: item.lines.map((entry) => ({ ...entry })),
    })),
    productionPlans: mockDocument.productionPlans.map((item) => ({
      ...item,
      lines: item.lines.map((entry) => ({ ...entry })),
    })),
    sales: mockDocument.sales.map((item) => ({
      ...item,
      lines: item.lines.map((line) => ({ ...line })),
    })),
    productionEntries: mockDocument.productionEntries.map((item) => ({
      ...item,
      lines: item.lines.map((line) => ({ ...line })),
    })),
    hrPositions: mockDocument.hrPositions.map((item) => ({ ...item })),
    hrMonthPlans: mockDocument.hrMonthPlans.map((item) => ({
      ...item,
      staffLines: item.staffLines.map((line) => ({ ...line })),
      outsourcingLines: item.outsourcingLines.map((line) => ({ ...line })),
    })),
    hrDayFacts: mockDocument.hrDayFacts.map((item) => ({
      ...item,
      staffLines: item.staffLines.map((line) => ({ ...line })),
      outsourcingLines: item.outsourcingLines.map((line) => ({ ...line })),
    })),
    hrTaxRates: mockDocument.hrTaxRates.map((item) => ({ ...item })),
    transportCarriers: mockDocument.transportCarriers.map((item) => ({ ...item })),
    transportHireMonthPlans: mockDocument.transportHireMonthPlans.map((item) => ({
      ...item,
      lines: item.lines.map((line) => ({ ...line })),
    })),
    transportHireDayFacts: mockDocument.transportHireDayFacts.map((item) => ({
      ...item,
      lines: item.lines.map((line) => ({ ...line })),
    })),
    transportOwnMonthPlans: mockDocument.transportOwnMonthPlans.map((item) => ({
      ...item,
      vehicles: item.vehicles.map((line) => ({ ...line })),
    })),
    transportOwnDayFacts: mockDocument.transportOwnDayFacts.map((item) => ({
      ...item,
      vehicles: item.vehicles.map((line) => ({ ...line })),
    })),
    opexOtherLines: mockDocument.opexOtherLines.map((item) => ({ ...item })),
    opexMonthLines: mockDocument.opexMonthLines.map((item) => ({
      ...item,
      lines: item.lines.map((line) => ({ ...line })),
    })),
    finishedGoodsOpenings: mockDocument.finishedGoodsOpenings.map((item) => ({
      ...item,
      lines: item.lines.map((line) => ({ ...line })),
    })),
    finishedGoodsNorms: mockDocument.finishedGoodsNorms.map((item) => ({
      ...item,
      lines: item.lines.map((line) => ({ ...line })),
    })),
    materials: mockDocument.materials.map((item) => ({ ...item })),
    materialNorms: mockDocument.materialNorms.map((item) => ({ ...item })),
    materialMonthPlans: mockDocument.materialMonthPlans.map((item) => ({
      ...item,
      lines: item.lines.map((line) => ({ ...line })),
    })),
    materialOpenings: mockDocument.materialOpenings.map((item) => ({
      ...item,
      lines: item.lines.map((line) => ({ ...line })),
    })),
    materialReceipts: mockDocument.materialReceipts.map((item) => ({
      ...item,
      lines: item.lines.map((line) => ({ ...line })),
    })),
    derivatives: mockDocument.derivatives.map((item) => ({
      ...item,
      lines: item.lines.map((line) => ({ ...line })),
    })),
    derivativeOpenings: mockDocument.derivativeOpenings.map((item) => ({
      ...item,
      lines: item.lines.map((line) => ({ ...line })),
    })),
    derivativeNorms: mockDocument.derivativeNorms.map((item) => ({
      ...item,
      lines: item.lines.map((line) => ({ ...line })),
    })),
  };
}
