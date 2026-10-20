import type {
  Material,
  MaterialMonthPlan,
  MaterialMonthPlanLine,
  MaterialNorm,
  MaterialOpening,
  MaterialReceipt,
  MaterialWarehouseId,
} from '@/domain/document';

/**
 * Мок сырья двух складов.
 * Сентябрь и октябрь: на складе 1 недостача говядины 30 кг, на складе 2 излишек 30 кг.
 * Сумма отклонений складов нулевая — объединённый остаток недостачу прячет.
 * Ножи и лезвия склада 1 расходуются по норме на выпуск. Склад 2 ножи вводят фактом в отчёте.
 * Оболочка в книге стоит на `DSM Meat`, в прототипе — в упаковке и вспомогательных, как на задаче.
 */

const q = (units: number) => Math.round(units * 1000);

const materials: Material[] = [
  { id: 'material-beef', name: 'Говядина 1 с зам', groupId: 'meat', unit: 'кг', vatPercent: 10, deletedAt: null },
  {
    id: 'material-chicken',
    name: 'Филе грудки куриное зам',
    groupId: 'meat',
    unit: 'кг',
    vatPercent: 10,
    deletedAt: null,
  },
  { id: 'material-nitrite', name: 'Соль нитритная', groupId: 'meat', unit: 'кг', vatPercent: 10, deletedAt: null },
  { id: 'material-flour', name: 'Мука пшеничная в/с', groupId: 'bakery', unit: 'кг', vatPercent: 10, deletedAt: null },
  {
    id: 'material-yeast',
    name: 'Дрожжи сухие быстродействующие',
    groupId: 'bakery',
    unit: 'кг',
    vatPercent: 20,
    deletedAt: null,
  },
  {
    id: 'material-ketchup',
    name: 'Кетчуп томатный Хайнц',
    groupId: 'sauces',
    unit: 'кг',
    vatPercent: 20,
    deletedAt: null,
  },
  { id: 'material-oil', name: 'Масло подсолнечное', groupId: 'sauces', unit: 'кг', vatPercent: 10, deletedAt: null },
  {
    id: 'material-salt',
    name: 'Соль пищевая мелк помола',
    groupId: 'sauces',
    unit: 'кг',
    vatPercent: 10,
    deletedAt: null,
  },
  {
    id: 'material-label',
    name: 'Этикетка Гамбургер 110х100',
    groupId: 'packaging',
    unit: 'шт',
    vatPercent: 20,
    deletedAt: null,
  },
  {
    id: 'material-tray',
    name: 'Лоток 142х142х53 прозрач',
    groupId: 'packaging',
    unit: 'шт',
    vatPercent: 20,
    deletedAt: null,
  },
  { id: 'material-knives', name: 'Ножи', groupId: 'packaging', unit: 'шт', vatPercent: 20, deletedAt: null },
  { id: 'material-blades', name: 'Лезвия', groupId: 'packaging', unit: 'шт', vatPercent: 20, deletedAt: null },
  {
    id: 'material-casing',
    name: 'Оболочка сосисочная',
    groupId: 'packaging',
    unit: 'пм',
    vatPercent: 20,
    deletedAt: null,
  },
];

/** Копейки за единицу с НДС. Круглые цены рядом с `DSM`. */
const priceWithVat: Record<string, number> = {
  'material-beef': 70_000,
  'material-chicken': 33_000,
  'material-nitrite': 8_000,
  'material-flour': 3_042,
  'material-yeast': 40_200,
  'material-ketchup': 21_900,
  'material-oil': 12_900,
  'material-salt': 1_163,
  'material-label': 128,
  'material-tray': 391,
  'material-knives': 15_000,
  'material-blades': 4_000,
  'material-casing': 1_200,
};

type LineOverride = Partial<
  Pick<
    MaterialMonthPlanLine,
    | 'receiptQuantity'
    | 'consumptionQuantity'
    | 'factConsumptionQuantity'
    | 'minQuantity'
    | 'maxQuantity'
    | 'priceWithVat'
  >
>;

function defaultMax(material: Material): number {
  if (material.unit === 'шт') {
    return q(100_000);
  }
  if (material.unit === 'пм') {
    return q(10_000);
  }
  return q(1_000);
}

function materialPlan(
  month: string,
  warehouseId: MaterialWarehouseId,
  overrides: Record<string, LineOverride> = {},
): MaterialMonthPlan {
  return {
    id: `material-plan:${month}:${warehouseId}`,
    month,
    warehouseId,
    lines: materials.map((material) => {
      const override = overrides[material.id] ?? {};
      return {
        id: `material-plan-line:${month}:${warehouseId}:${material.id}`,
        materialId: material.id,
        receiptQuantity: override.receiptQuantity ?? 0,
        consumptionQuantity: override.consumptionQuantity ?? 0,
        factConsumptionQuantity: override.factConsumptionQuantity ?? 0,
        priceWithVat: override.priceWithVat ?? priceWithVat[material.id] ?? 0,
        minQuantity: override.minQuantity ?? 0,
        maxQuantity: override.maxQuantity ?? defaultMax(material),
      };
    }),
  };
}

function materialOpening(
  month: string,
  warehouseId: MaterialWarehouseId,
  quantities: Record<string, number>,
): MaterialOpening {
  return {
    id: `material-opening:${month}:${warehouseId}`,
    month,
    warehouseId,
    lines: Object.entries(quantities).map(([materialId, quantity]) => ({
      id: `material-opening-line:${month}:${warehouseId}:${materialId}`,
      materialId,
      quantity,
    })),
  };
}

const septemberPlanW1 = materialPlan('2026-09', 'warehouse-1', {
  'material-beef': {
    receiptQuantity: q(50),
    consumptionQuantity: q(40),
    factConsumptionQuantity: q(35),
    minQuantity: q(80),
    maxQuantity: q(200),
  },
  'material-chicken': { receiptQuantity: q(25), consumptionQuantity: q(15), factConsumptionQuantity: q(12) },
  'material-nitrite': { factConsumptionQuantity: q(1) },
  'material-flour': { receiptQuantity: q(60), consumptionQuantity: q(40), factConsumptionQuantity: q(30) },
  'material-yeast': { receiptQuantity: q(10), consumptionQuantity: q(4), factConsumptionQuantity: q(3) },
  'material-ketchup': { receiptQuantity: q(15), consumptionQuantity: q(10), factConsumptionQuantity: q(8) },
  'material-oil': { receiptQuantity: q(12), consumptionQuantity: q(5), factConsumptionQuantity: q(4) },
  'material-salt': { receiptQuantity: q(6), consumptionQuantity: q(2), factConsumptionQuantity: q(1) },
  'material-label': { receiptQuantity: q(2_500), consumptionQuantity: q(1_000), factConsumptionQuantity: q(1_000) },
  'material-tray': { receiptQuantity: q(1_000), consumptionQuantity: q(400), factConsumptionQuantity: q(400) },
  'material-knives': {
    consumptionQuantity: q(18),
    factConsumptionQuantity: q(20.5),
    minQuantity: q(20),
    maxQuantity: q(40),
  },
  'material-blades': {
    consumptionQuantity: q(20),
    factConsumptionQuantity: q(20),
    minQuantity: q(15),
    maxQuantity: q(40),
  },
});

const septemberPlanW2 = materialPlan('2026-09', 'warehouse-2', {
  'material-beef': {
    receiptQuantity: q(30),
    consumptionQuantity: q(20),
    factConsumptionQuantity: q(15),
    minQuantity: q(40),
    maxQuantity: q(150),
  },
  'material-flour': { receiptQuantity: q(20), consumptionQuantity: q(12), factConsumptionQuantity: q(10) },
  'material-yeast': { receiptQuantity: q(5), consumptionQuantity: q(2), factConsumptionQuantity: q(1) },
  'material-ketchup': { receiptQuantity: q(8), consumptionQuantity: q(3), factConsumptionQuantity: q(2) },
  'material-salt': { receiptQuantity: q(3), consumptionQuantity: q(1), factConsumptionQuantity: q(1) },
  'material-label': { receiptQuantity: q(600), consumptionQuantity: q(200), factConsumptionQuantity: q(200) },
  'material-knives': {
    consumptionQuantity: q(2),
    factConsumptionQuantity: q(1),
    minQuantity: q(2),
    maxQuantity: q(15),
  },
});

const materialNorms: MaterialNorm[] = [
  {
    id: 'material-norm:warehouse-1:material-knives:product-goulash',
    materialId: 'material-knives',
    warehouseId: 'warehouse-1',
    productId: 'product-goulash',
    quantityPerPiece: 10,
    deletedAt: null,
  },
  {
    id: 'material-norm:warehouse-1:material-knives:product-burger',
    materialId: 'material-knives',
    warehouseId: 'warehouse-1',
    productId: 'product-burger',
    quantityPerPiece: 10,
    deletedAt: null,
  },
  {
    id: 'material-norm:warehouse-1:material-blades:product-burger',
    materialId: 'material-blades',
    warehouseId: 'warehouse-1',
    productId: 'product-burger',
    quantityPerPiece: 20,
    deletedAt: null,
  },
];

function receipt(
  id: string,
  warehouseId: MaterialWarehouseId,
  supplierName: string,
  occurredOn: string,
  lines: Array<{ materialId: string; quantity: number }>,
): MaterialReceipt {
  return {
    id,
    warehouseId,
    supplierName,
    occurredOn,
    lines: lines.map((line) => ({
      id: `${id}:${line.materialId}`,
      materialId: line.materialId,
      quantity: line.quantity,
      priceWithVat: priceWithVat[line.materialId] ?? 0,
    })),
  };
}

export const mockMaterials = {
  materials,
  materialNorms,
  materialMonthPlans: [
    materialPlan('2026-08', 'warehouse-1', {
      'material-beef': { factConsumptionQuantity: q(50) },
    }),
    materialPlan('2026-08', 'warehouse-2', {
      'material-beef': { factConsumptionQuantity: q(10) },
      'material-knives': { factConsumptionQuantity: q(3) },
    }),
    septemberPlanW1,
    septemberPlanW2,
    materialPlan('2026-10', 'warehouse-1', {
      'material-beef': { minQuantity: q(80), maxQuantity: q(200) },
      'material-knives': {
        consumptionQuantity: q(18),
        factConsumptionQuantity: q(9.35),
        minQuantity: q(20),
        maxQuantity: q(40),
      },
      'material-blades': {
        consumptionQuantity: q(20),
        factConsumptionQuantity: q(6.7),
        minQuantity: q(15),
        maxQuantity: q(40),
      },
    }),
    materialPlan('2026-10', 'warehouse-2', {
      'material-beef': { minQuantity: q(40), maxQuantity: q(150) },
      'material-knives': { minQuantity: q(2), maxQuantity: q(15) },
    }),
  ],
  materialOpenings: [
    materialOpening('2026-09', 'warehouse-1', {
      'material-beef': q(120),
      'material-knives': q(25),
      'material-blades': q(22),
    }),
    materialOpening('2026-09', 'warehouse-2', {
      'material-beef': q(100),
      'material-knives': q(5),
    }),
    materialOpening('2026-10', 'warehouse-1', {
      'material-beef': q(95),
      'material-chicken': q(8),
      'material-nitrite': q(2),
      'material-flour': q(20),
      'material-yeast': q(5),
      'material-ketchup': q(4),
      'material-oil': q(6),
      'material-salt': q(4),
      'material-label': q(1_000),
      'material-tray': q(400),
      'material-knives': q(14.5),
      'material-blades': q(10),
    }),
    materialOpening('2026-10', 'warehouse-2', {
      'material-beef': q(135),
      'material-flour': q(5),
      'material-yeast': q(3),
      'material-ketchup': q(4),
      'material-salt': q(1),
      'material-label': q(300),
      'material-knives': q(4),
    }),
  ],
  materialReceipts: [
    receipt('material-receipt:2026-08-12:w1', 'warehouse-1', 'Велес', '2026-08-12', [
      { materialId: 'material-beef', quantity: q(200) },
      { materialId: 'material-knives', quantity: q(30) },
      { materialId: 'material-blades', quantity: q(25) },
    ]),
    receipt('material-receipt:2026-08-12:w2', 'warehouse-2', 'Велес', '2026-08-12', [
      { materialId: 'material-beef', quantity: q(80) },
      { materialId: 'material-knives', quantity: q(8) },
    ]),
    receipt('material-receipt:2026-09-08:w1', 'warehouse-1', 'Велес', '2026-09-08', [
      { materialId: 'material-beef', quantity: q(40) },
      { materialId: 'material-chicken', quantity: q(20) },
      { materialId: 'material-nitrite', quantity: q(3) },
      { materialId: 'material-knives', quantity: q(10) },
      { materialId: 'material-blades', quantity: q(8) },
    ]),
    receipt('material-receipt:2026-09-08:w2', 'warehouse-2', 'Дзержинский', '2026-09-08', [
      { materialId: 'material-beef', quantity: q(20) },
    ]),
    receipt('material-receipt:2026-09-11:w1', 'warehouse-1', 'Волга Милл', '2026-09-11', [
      { materialId: 'material-flour', quantity: q(50) },
      { materialId: 'material-yeast', quantity: q(8) },
    ]),
    receipt('material-receipt:2026-09-11:w2', 'warehouse-2', 'Волга Милл', '2026-09-11', [
      { materialId: 'material-flour', quantity: q(15) },
      { materialId: 'material-yeast', quantity: q(4) },
    ]),
    receipt('material-receipt:2026-09-15:w1', 'warehouse-1', 'Хайнц', '2026-09-15', [
      { materialId: 'material-ketchup', quantity: q(12) },
      { materialId: 'material-oil', quantity: q(10) },
      { materialId: 'material-salt', quantity: q(5) },
    ]),
    receipt('material-receipt:2026-09-15:w2', 'warehouse-2', 'Хайнц', '2026-09-15', [
      { materialId: 'material-ketchup', quantity: q(6) },
      { materialId: 'material-salt', quantity: q(2) },
    ]),
    receipt('material-receipt:2026-09-18:w1', 'warehouse-1', 'МЛ Принт Реклама', '2026-09-18', [
      { materialId: 'material-label', quantity: q(2_000) },
      { materialId: 'material-tray', quantity: q(800) },
    ]),
    receipt('material-receipt:2026-09-18:w2', 'warehouse-2', 'МЛ Принт Реклама', '2026-09-18', [
      { materialId: 'material-label', quantity: q(500) },
    ]),
  ],
};
