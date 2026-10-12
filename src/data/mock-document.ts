import {
  catalogCategories,
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
 * Выпуск сентября чуть выше продаж у салатов и гуляша (650, 800, 1 050) — на конец месяца остаток 100, 150 и 150 шт.
 * У гамбургера выпуск 1 000 при продажах 1 100 — дефицит −100 шт (переносится в октябрь как остаток на начало план).
 * Факт октября — 2 и 9 число: продажи и выпуск 200, 250, 250 и 300. Цезарь и Оливье выше темпа, гуляш и гамбургер ниже.
 * Операционные расходы и инвентаризация пустые.
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

interface OrderDraft {
  id: string;
  customerName: string;
  occurredOn: string;
  pieces: Partial<Record<CatalogProductId, number>>;
}

/**
 * Сентябрь продажи: 550, 650, 900 и 1 100 шт — примерно на десятую выше плана.
 * Октябрь: 200, 250, 250 и 300 шт за 2 и 9 число. Цезарь и Оливье выше темпа 11/31, гуляш и гамбургер ниже.
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
];

/**
 * Выпуск тех же дней. Октябрь = продажи.
 * Сентябрь: салаты и гуляш выше продаж (остаток), гамбургер ниже (дефицит −100).
 * Итого выпуск сентября: 650, 800, 1 050 и 1 000 → конец месяца 100, 150, 150 и −100.
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
    })),
  }));
}

const salesPlans: SalesPlan[] = [salesPlan('2026-09'), salesPlan('2026-10')];
const productionPlans: ProductionPlan[] = [productionPlan('2026-09'), productionPlan('2026-10')];

export const mockDocument: PrototypeDocument = {
  schemaVersion: SCHEMA_VERSION,
  categories: catalogCategories(),
  products: [caesar, olivier, goulash, burger],
  salesPlans,
  productionPlans,
  sales: salesFromOrders(orders),
  productionEntries: productionFromOrders(productionOrders),
  operatingExpenses: [],
  finishedGoodsOpenings: [],
  finishedGoodsNorms: [],
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
  };
}
