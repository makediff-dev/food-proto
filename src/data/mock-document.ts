import {
  catalogCategories,
  type Product,
  type PrototypeDocument,
  type SalesPlan,
  SCHEMA_VERSION,
} from '@/domain/document';

/**
 * Мок: два салата, одно горячее и гамбургер. План сентября. Факт продаж и операционные расходы пустые.
 * В книге строки салатов пустые (`Svod!C15:C29`), имена и цены салатов — для мока.
 * Себестоимость гамбургера 39,30 ₽ с НДС — прежний итог рецепта. Без НДС 32,75 ₽
 * (3930 × 100 / 120, половина вверх), а не смешанные ставки рецепта (34,84 ₽).
 * У салатов и гуляша себестоимость 0, как кэш `Svod!D`.
 */
const caesar: Product = {
  id: 'product-caesar',
  name: 'Цезарь с курицей',
  categoryId: 'category-salads',
  /** Как у горячих блюд, `Svod!N31`. В книге у салатов ставки нет. */
  vatPercent: 10,
  unitCostWithVat: 0,
  deletedAt: null,
};

const olivier: Product = {
  id: 'product-olivier',
  name: 'Оливье',
  categoryId: 'category-salads',
  vatPercent: 10,
  unitCostWithVat: 0,
  deletedAt: null,
};

const goulash: Product = {
  id: 'product-goulash',
  name: 'Гуляш из курицы с рисом',
  categoryId: 'category-hot',
  /** `Svod!N31`. */
  vatPercent: 10,
  /** `Svod!D31` в файле 0. */
  unitCostWithVat: 0,
  deletedAt: null,
};

const burger: Product = {
  id: 'product-burger',
  name: 'Гамбургер',
  categoryId: 'category-rolls',
  /** `Svod!N63`, роллы и сэндвичи. */
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
        /** `Svod!H63`. */
        volumePieces: 20_000,
      },
    ],
  },
];

export const mockDocument: PrototypeDocument = {
  schemaVersion: SCHEMA_VERSION,
  categories: catalogCategories(),
  products: [caesar, olivier, goulash, burger],
  salesPlans,
  salesFacts: [],
  sales: [],
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
    salesFacts: mockDocument.salesFacts.map((item) => ({
      ...item,
      days: item.days.map((day) => ({
        ...day,
        cells: day.cells.map((cell) => ({ ...cell })),
      })),
    })),
    sales: mockDocument.sales.map((item) => ({
      ...item,
      lines: item.lines.map((line) => ({ ...line })),
    })),
    operatingExpenses: mockDocument.operatingExpenses.map((item) => ({
      ...item,
    })),
  };
}
