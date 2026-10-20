import { mockMaterials } from '@/data/mock-materials';
import {
  catalogCategories,
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
 * Мок: два салата, одно горячее и гамбургер.
 * Себестоимость 1 шт с НДС округлена до целых десятков рублей.
 * План продаж и план выпуска сентября и октября 2026 одинаковые: 500, 600, 800 и 1 000 шт.
 * Факт продаж сентября чуть выше плана: 550, 650, 900 и 1 100.
 * Выпуск сентября чуть выше продаж у салатов и гуляша (650, 800, 1 050) — расчётный перенос на октябрь 140, 200 и 220 шт.
 * У гамбургера выпуск 1 000 при продажах 1 100 — расчётный перенос 20 шт. Инвентаризация октября: недостача у Цезаря, гуляша и гамбургера, излишек у Оливье.
 * Факт октября — 2, 9, 13, 16 и 20 число. Продажи за месяц: 350, 420, 560 и 380 шт.
 * Выпуск октября не копирует продажи: Цезарь и гуляш чуть впереди, Оливье и гамбургер отстают.
 * Операционные расходы пустые. Инвентаризация и нормативы движения — сентябрь и октябрь 2026; факт инвентаризации не ниже нуля, отклонение от переноса может быть отрицательным (недостача).
 * Плановые цены с НДС: салаты — мок, гуляш `Svod!F31`, гамбургер `Svod!F63`.
 * Факт продаж — круглые и полукруглые: 95, 70, 100 и 85 ₽ с НДС.
 * НДС у всех товаров 20%. В книге у горячих `Svod!N31` 10%, у роллов `Svod!N63` 20%.
 * Объёмы книги (4 000, 5 000, 6 000, 20 000) в мок не переносятся: на экране нужны лёгкие сотни.
 */
const caesar: Product = {
  id: 'product-caesar',
  name: 'Цезарь с курицей',
  categoryId: 'category-salads',
  vatPercent: 20,
  /** 40 ₽. В книге строки салата нет. */
  unitCostWithVat: 4_000,
  deletedAt: null,
};

const olivier: Product = {
  id: 'product-olivier',
  name: 'Оливье',
  categoryId: 'category-salads',
  vatPercent: 20,
  /** 30 ₽. В книге строки салата нет. */
  unitCostWithVat: 3_000,
  deletedAt: null,
};

const goulash: Product = {
  id: 'product-goulash',
  name: 'Гуляш из курицы с рисом',
  categoryId: 'category-hot',
  vatPercent: 20,
  /** 50 ₽. `Svod!D31` в файле 0. */
  unitCostWithVat: 5_000,
  deletedAt: null,
};

const burger: Product = {
  id: 'product-burger',
  name: 'Гамбургер',
  categoryId: 'category-rolls',
  vatPercent: 20,
  /** 40 ₽. */
  unitCostWithVat: 4_000,
  deletedAt: null,
};

/**
 * Фактическая себестоимость 1 шт с НДС в моке записей выпуска, копейки.
 * Совпадает с себестоимостью товара, чтобы факт мока не обнулялся.
 * Новая запись в форме начинается с 0.
 */
const productionUnitCostWithVat = {
  'product-caesar': caesar.unitCostWithVat,
  'product-olivier': olivier.unitCostWithVat,
  'product-goulash': goulash.unitCostWithVat,
  'product-burger': burger.unitCostWithVat,
} as const;

/** Плановая цена с НДС, копейки. Салаты — мок, гуляш `Svod!F31`, гамбургер `Svod!F63`. */
const priceWithVat = {
  'product-caesar': 9_640,
  'product-olivier': 6_850,
  'product-goulash': 9_914,
  'product-burger': 8_513,
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
} as const;

type CatalogProductId = keyof typeof priceWithVat;

/** План продаж и план выпуска, шт. Сентябрь и октябрь совпадают. */
const planPieces = {
  'product-caesar': 500,
  'product-olivier': 600,
  'product-goulash': 800,
  'product-burger': 1_000,
} as const;

const catalogProductIds = Object.keys(planPieces) as CatalogProductId[];

function salesPlan(month: string): SalesPlan {
  return {
    id: `plan-${month}`,
    month,
    deletedAt: null,
    lines: catalogProductIds.map((productId) => ({
      id: `plan-${month}-${productId.slice('product-'.length)}`,
      productId,
      priceWithVat: priceWithVat[productId],
      volumePieces: planPieces[productId],
    })),
  };
}

function productionPlan(month: string): ProductionPlan {
  return {
    id: `production-plan-${month}`,
    month,
    deletedAt: null,
    lines: catalogProductIds.map((productId) => ({
      id: `production-plan-${month}-${productId.slice('product-'.length)}`,
      productId,
      volumePieces: planPieces[productId],
    })),
  };
}

/** Норматив остатков на производстве, шт. Одинаковый в сентябре и октябре. */
const normPieces = {
  'product-caesar': { minPieces: 80, maxPieces: 180 },
  'product-olivier': { minPieces: 100, maxPieces: 220 },
  'product-goulash': { minPieces: 120, maxPieces: 250 },
  'product-burger': { minPieces: 0, maxPieces: 80 },
} as const satisfies Record<CatalogProductId, { minPieces: number; maxPieces: number }>;

/** Инвентаризация на начало месяца, шт. */
const openingInventorySeptember = {
  'product-caesar': 40,
  'product-olivier': 50,
  'product-goulash': 70,
  'product-burger': 120,
} as const satisfies Record<CatalogProductId, number>;

/**
 * На начало октября. Расчётный перенос с сентября: 140, 200, 220 и 20 шт.
 * Ниже переноса — недостача в «Откл.»; у Оливье излишек +10.
 */
const openingInventoryOctober = {
  'product-caesar': 125,
  'product-olivier': 210,
  'product-goulash': 195,
  'product-burger': 12,
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
];

/**
 * Выпуск тех же дней, что и продажи. Октябрь по товарам расходится с продажами.
 * Сентябрь: салаты и гуляш выше продаж (остаток), гамбургер ниже.
 * Итого выпуск сентября: 650, 800, 1 050 и 1 000.
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
      unitCostWithVat: productionUnitCostWithVat[line.productId],
    })),
  }));
}

const salesPlans: SalesPlan[] = [salesPlan('2026-09'), salesPlan('2026-10')];
const productionPlans: ProductionPlan[] = [productionPlan('2026-09'), productionPlan('2026-10')];
const finishedGoodsNorms: FinishedGoodsNorm[] = [finishedGoodsNorm('2026-09'), finishedGoodsNorm('2026-10')];
const finishedGoodsOpenings: FinishedGoodsOpening[] = [
  finishedGoodsOpening('2026-09', openingInventorySeptember),
  finishedGoodsOpening('2026-10', openingInventoryOctober),
];

export const mockDocument: PrototypeDocument = {
  schemaVersion: SCHEMA_VERSION,
  categories: catalogCategories(),
  products: [caesar, olivier, goulash, burger],
  salesPlans,
  productionPlans,
  sales: salesFromOrders(orders),
  productionEntries: productionFromOrders(productionOrders),
  operatingExpenses: [],
  finishedGoodsOpenings,
  finishedGoodsNorms,
  materials: mockMaterials.materials,
  materialNorms: mockMaterials.materialNorms,
  materialMonthPlans: mockMaterials.materialMonthPlans,
  materialOpenings: mockMaterials.materialOpenings,
  materialReceipts: mockMaterials.materialReceipts,
  materialIssues: mockMaterials.materialIssues,
};

export function createMockDocument(): PrototypeDocument {
  return {
    schemaVersion: mockDocument.schemaVersion,
    categories: mockDocument.categories.map((item) => ({ ...item })),
    products: mockDocument.products.map((item) => ({ ...item })),
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
    operatingExpenses: mockDocument.operatingExpenses.map((item) => ({
      ...item,
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
    materialIssues: mockDocument.materialIssues.map((item) => ({
      ...item,
      lines: item.lines.map((line) => ({ ...line })),
    })),
  };
}
