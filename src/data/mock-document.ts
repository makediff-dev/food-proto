import {
  type Product,
  type PrototypeDocument,
  type SalesPlan,
  SCHEMA_VERSION,
} from '@/domain/document';

/**
 * Мок одного гамбургера: конечный товар и план сентября. Факт продаж и операционные расходы пустые.
 * Себестоимость 39,30 ₽ с НДС — прежний итог рецепта. Без НДС теперь 32,75 ₽
 * (3930 × 100 / 120, половина вверх), а не смешанные ставки рецепта (34,84 ₽).
 */
const burger: Product = {
  id: 'product-burger',
  name: 'Гамбургер',
  /** `Svod!N63`, роллы и сэндвичи. */
  vatPercent: 20,
  unitCostWithVatKopecks: 3_930,
  deletedAt: null,
};

const salesPlans: SalesPlan[] = [
  {
    id: 'plan-2026-09',
    month: '2026-09',
    deletedAt: null,
    lines: [
      {
        id: 'plan-2026-09-burger',
        productId: 'product-burger',
        /** `Svod!F63`, 85,13 ₽. */
        priceWithVatKopecks: 8_513,
        /** `Svod!H63`. */
        volumePieces: 20_000,
      },
    ],
  },
];

export const mockDocument: PrototypeDocument = {
  schemaVersion: SCHEMA_VERSION,
  products: [burger],
  salesPlans,
  salesFacts: [],
  operatingExpenses: [],
};

export function createMockDocument(): PrototypeDocument {
  return {
    schemaVersion: mockDocument.schemaVersion,
    products: mockDocument.products.map((item) => ({ ...item })),
    salesPlans: mockDocument.salesPlans.map((item) => ({
      ...item,
      lines: item.lines.map((entry) => ({ ...entry })),
    })),
    salesFacts: mockDocument.salesFacts.map((item) => ({
      ...item,
      openings: item.openings.map((opening) => ({ ...opening })),
      days: item.days.map((day) => ({
        ...day,
        cells: day.cells.map((cell) => ({ ...cell })),
      })),
    })),
    operatingExpenses: mockDocument.operatingExpenses.map((item) => ({
      ...item,
    })),
  };
}
