import {
  catalogCategories,
  type Product,
  type ProductionPlan,
  type PrototypeDocument,
  type SalesPlan,
  SCHEMA_VERSION,
} from '@/domain/document';

/**
 * Мок: два салата, одно горячее и гамбургер. План сентября. Факт продаж, журнал выпуска
 * и операционные расходы пустые.
 * В книге строки салатов пустые (`Svod!C15:C29`), имена и цены салатов — для мока.
 * НДС у всех товаров 20%. В книге у горячих `Svod!N31` 10%, у роллов `Svod!N63` 20%.
 * Себестоимость 1 шт с НДС — мок: у гуляша в книге `Svod!D31` 0, у салатов кэша нет.
 * У гамбургера 39,30 ₽ — прежний итог рецепта. Без НДС 32,75 ₽
 * (3930 × 100 / 120, половина вверх), а не смешанные ставки рецепта (34,84 ₽).
 * План производства сентября — те же четыре товара, объёмы выпуска заданы здесь.
 */
const caesar: Product = {
  id: 'product-caesar',
  name: 'Цезарь с курицей',
  categoryId: 'category-salads',
  vatPercent: 20,
  /** 44,50 ₽. В книге строки салата нет. */
  unitCostWithVat: 4_450,
  deletedAt: null,
};

const olivier: Product = {
  id: 'product-olivier',
  name: 'Оливье',
  categoryId: 'category-salads',
  vatPercent: 20,
  /** 31,60 ₽. В книге строки салата нет. */
  unitCostWithVat: 3_160,
  deletedAt: null,
};

const goulash: Product = {
  id: 'product-goulash',
  name: 'Гуляш из курицы с рисом',
  categoryId: 'category-hot',
  vatPercent: 20,
  /** 45,80 ₽. `Svod!D31` в файле 0. */
  unitCostWithVat: 4_580,
  deletedAt: null,
};

const burger: Product = {
  id: 'product-burger',
  name: 'Гамбургер',
  categoryId: 'category-rolls',
  vatPercent: 20,
  unitCostWithVat: 3_930,
  deletedAt: null,
};

const salesPlans: SalesPlan[] = [
  {
    id: 'plan-2026-09',
    month: '2026-09',
    deletedAt: null,
    lines: [
      {
        id: 'plan-2026-09-caesar',
        productId: 'product-caesar',
        /** В книге цены салата нет. 96,40 ₽ — мок. */
        priceWithVat: 9_640,
        volumePieces: 4_000,
      },
      {
        id: 'plan-2026-09-olivier',
        productId: 'product-olivier',
        /** В книге цены салата нет. 68,50 ₽ — мок. */
        priceWithVat: 6_850,
        volumePieces: 5_000,
      },
      {
        id: 'plan-2026-09-goulash',
        productId: 'product-goulash',
        /** `Svod!F31`, 99,14 ₽. */
        priceWithVat: 9_914,
        /** `Svod!H31`. */
        volumePieces: 6_000,
      },
      {
        id: 'plan-2026-09-burger',
        productId: 'product-burger',
        /** `Svod!F63`, 85,13 ₽. */
        priceWithVat: 8_513,
        volumePieces: 20_000,
      },
    ],
  },
];

const productionPlans: ProductionPlan[] = [
  {
    id: 'production-plan-2026-09',
    month: '2026-09',
    deletedAt: null,
    lines: [
      {
        id: 'production-plan-2026-09-caesar',
        productId: 'product-caesar',
        volumePieces: 4_200,
      },
      {
        id: 'production-plan-2026-09-olivier',
        productId: 'product-olivier',
        volumePieces: 5_200,
      },
      {
        id: 'production-plan-2026-09-goulash',
        productId: 'product-goulash',
        volumePieces: 6_500,
      },
      {
        id: 'production-plan-2026-09-burger',
        productId: 'product-burger',
        volumePieces: 22_000,
      },
    ],
  },
];

export const mockDocument: PrototypeDocument = {
  schemaVersion: SCHEMA_VERSION,
  categories: catalogCategories(),
  products: [caesar, olivier, goulash, burger],
  salesPlans,
  productionPlans,
  sales: [],
  productionEntries: [],
  operatingExpenses: [],
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
  };
}
