import { type NameRejection, rejectName } from '@/domain/directory';
import {
  DERIVATIVE_WORKSHOPS,
  isDeletionMark,
  MATERIAL_WAREHOUSES,
  type MaterialWarehouseId,
  type Product,
  type ProductionPlanLine,
  type ProductRecipeLine,
  type PrototypeDocument,
  type SalesPlanLine,
} from '@/domain/document';
import { isQuantityThousandths } from '@/domain/quantity';
import { validateRecipeYield } from '@/domain/recipe-yield';
import { MAX_PRICE_KOPECKS } from '@/domain/units';

export type FieldRejection = NameRejection | 'cost' | 'missing' | 'category' | 'warehouse';

export type ProductRecipeRejection = 'missing' | 'quantity' | 'component' | 'warehouse' | 'output' | 'yield' | 'pieces';

function isUnitCost(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= MAX_PRICE_KOPECKS;
}

function isWarehouseId(value: string): value is MaterialWarehouseId {
  return MATERIAL_WAREHOUSES.some((item) => item.id === value);
}

function warehouseIdForDerivativeWorkshop(workshopId: string): MaterialWarehouseId | null {
  const workshop = DERIVATIVE_WORKSHOPS.find((item) => item.id === workshopId);
  return workshop?.warehouseId ?? null;
}

export function activeProducts(
  document: PrototypeDocument,
  options?: { warehouseId?: MaterialWarehouseId },
): Product[] {
  return document.products.filter((item) => {
    if (item.deletedAt !== null) {
      return false;
    }
    if (options?.warehouseId !== undefined && item.warehouseId !== options.warehouseId) {
      return false;
    }
    return true;
  });
}

export function deletedProducts(document: PrototypeDocument): Product[] {
  return document.products.filter((item) => item.deletedAt !== null);
}

export function productByIdOrNull(document: PrototypeDocument, id: string): Product | null {
  return document.products.find((item) => item.id === id) ?? null;
}

function suggestedPriceWithVat(document: PrototypeDocument, productId: string, month: string): number {
  const earlier = document.salesPlans
    .filter((item) => item.deletedAt === null && item.month < month)
    .sort((left, right) => (left.month < right.month ? 1 : -1));

  for (const plan of earlier) {
    const line = plan.lines.find((item) => item.productId === productId);
    if (line) {
      return line.priceWithVat;
    }
  }

  return 0;
}

function appendSalesPlanLines(document: PrototypeDocument, productId: string) {
  return document.salesPlans.map((plan) => {
    if (plan.deletedAt !== null || plan.lines.some((line) => line.productId === productId)) {
      return plan;
    }

    const line: SalesPlanLine = {
      id: `sales-plan-line:${plan.month}:${productId}`,
      productId,
      priceWithVat: suggestedPriceWithVat(document, productId, plan.month),
      volumePieces: 0,
    };

    return { ...plan, lines: [...plan.lines, line] };
  });
}

function appendProductionPlanLines(document: PrototypeDocument, productId: string) {
  return document.productionPlans.map((plan) => {
    if (plan.deletedAt !== null || plan.lines.some((line) => line.productId === productId)) {
      return plan;
    }

    const line: ProductionPlanLine = {
      id: `production-plan-line:${plan.month}:${productId}`,
      productId,
      volumePieces: 0,
    };

    return { ...plan, lines: [...plan.lines, line] };
  });
}

export function productCategoryRejection(document: PrototypeDocument, categoryId: string): FieldRejection | null {
  const category = document.categories.find((item) => item.id === categoryId && item.deletedAt === null);
  return category ? null : 'category';
}

export function productWarehouseRejection(warehouseId: string): FieldRejection | null {
  return isWarehouseId(warehouseId) ? null : 'warehouse';
}

export function productNameRejection(
  document: PrototypeDocument,
  name: string,
  exceptId?: string,
): FieldRejection | null {
  return rejectName(name, document.products, exceptId);
}

export function productVatRejection(document: PrototypeDocument, id: string): FieldRejection | null {
  const product = document.products.find((item) => item.id === id);
  return product ? null : 'missing';
}

export function productUnitCostRejection(
  document: PrototypeDocument,
  id: string,
  unitCostWithVat: number,
): FieldRejection | null {
  const product = document.products.find((item) => item.id === id);
  if (!product) {
    return 'missing';
  }
  if (!isUnitCost(unitCostWithVat)) {
    return 'cost';
  }

  return null;
}

function lineKey(kind: ProductRecipeLine['componentKind'], id: string): string {
  return `${kind}:${id}`;
}

function validateRecipeLines(
  document: PrototypeDocument,
  warehouseId: MaterialWarehouseId,
  lines: readonly ProductRecipeLine[],
): ProductRecipeRejection | null {
  const seen = new Set<string>();
  const materials = document.materials ?? [];
  const derivatives = document.derivatives ?? [];

  for (const line of lines) {
    if (!line.id || !isQuantityThousandths(line.quantity, false) || line.quantity <= 0) {
      return 'quantity';
    }

    const key = lineKey(line.componentKind, line.componentId);
    if (seen.has(key)) {
      return 'component';
    }
    seen.add(key);

    if (line.componentKind === 'material') {
      const material = materials.find((item) => item.id === line.componentId);
      if (!material || material.deletedAt !== null || material.warehouseId !== warehouseId) {
        return 'component';
      }
    } else if (line.componentKind === 'derivative') {
      const derivative = derivatives.find((item) => item.id === line.componentId);
      const derivativeWarehouse = derivative ? warehouseIdForDerivativeWorkshop(derivative.workshopId) : null;
      if (!derivative || derivative.deletedAt !== null || derivativeWarehouse !== warehouseId) {
        return 'component';
      }
    } else {
      return 'component';
    }
  }

  return null;
}

export function addProduct(document: PrototypeDocument, product: Product): PrototypeDocument {
  if (productNameRejection(document, product.name)) {
    return document;
  }

  const vatPercent = product.vatPercent ?? 20;
  const unitCostWithVat = product.unitCostWithVat ?? 0;
  const category = document.categories.find((item) => item.id === product.categoryId && item.deletedAt === null);
  if (!category || !isUnitCost(unitCostWithVat)) {
    return document;
  }
  if (!isWarehouseId(product.warehouseId)) {
    return document;
  }

  const outputPieceThousandths = product.outputPieceThousandths;
  if (!isQuantityThousandths(outputPieceThousandths, false) || outputPieceThousandths <= 0) {
    return document;
  }

  const next: Product = {
    id: product.id,
    name: product.name.trim(),
    categoryId: product.categoryId,
    warehouseId: product.warehouseId,
    vatPercent,
    unitCostWithVat,
    outputKilogramThousandths: product.outputKilogramThousandths ?? 0,
    outputPieceThousandths,
    lines: (product.lines ?? []).map((line) => ({ ...line })),
    deletedAt: null,
  };

  if (validateRecipeLines(document, next.warehouseId, next.lines)) {
    return document;
  }
  if (validateRecipeYield(document, next.outputKilogramThousandths, next.lines)) {
    return document;
  }

  const withProduct: PrototypeDocument = {
    ...document,
    products: [...document.products, next],
  };

  return {
    ...withProduct,
    salesPlans: appendSalesPlanLines(withProduct, next.id),
    productionPlans: appendProductionPlanLines(withProduct, next.id),
  };
}

export function updateProductRecipe(
  document: PrototypeDocument,
  id: string,
  lines: readonly ProductRecipeLine[],
  outputKilogramThousandths: number,
  outputPieceThousandths: number,
): { document: PrototypeDocument; rejection: ProductRecipeRejection | null } {
  const current = productByIdOrNull(document, id);
  if (!current || current.deletedAt !== null) {
    return { document, rejection: 'missing' };
  }
  if (!isWarehouseId(current.warehouseId)) {
    return { document, rejection: 'warehouse' };
  }
  if (!isQuantityThousandths(outputPieceThousandths, false) || outputPieceThousandths <= 0) {
    return { document, rejection: 'pieces' };
  }

  const linesRejection = validateRecipeLines(document, current.warehouseId, lines);
  if (linesRejection) {
    return { document, rejection: linesRejection };
  }

  const yieldRejection = validateRecipeYield(document, outputKilogramThousandths, lines);
  if (yieldRejection) {
    return { document, rejection: yieldRejection };
  }

  return {
    document: {
      ...document,
      products: document.products.map((item) =>
        item.id === id
          ? {
              ...item,
              outputKilogramThousandths,
              outputPieceThousandths,
              lines: lines.map((line) => ({ ...line })),
            }
          : item,
      ),
    },
    rejection: null,
  };
}

/** Секции журнала готовой продукции: завод 1 и завод 2, внутри — рабочие товары склада. */
export function productRecipeSections(document: PrototypeDocument): {
  warehouseId: MaterialWarehouseId;
  name: string;
  items: Product[];
}[] {
  return MATERIAL_WAREHOUSES.map((warehouse) => ({
    warehouseId: warehouse.id,
    name: `Готовая продукция завода ${warehouse.id === 'warehouse-1' ? '1' : '2'}`,
    items: activeProducts(document, { warehouseId: warehouse.id }).sort((left, right) =>
      left.name.localeCompare(right.name, 'ru'),
    ),
  }));
}

export type ProductCompositionLineView = {
  id: string;
  name: string;
  unit: string;
  /** Тысячные доли единицы. */
  quantity: number;
};

/** Строки состава для списка: имя и единица компонента (сырьё или производная). */
export function productCompositionLines(document: PrototypeDocument, product: Product): ProductCompositionLineView[] {
  const result: ProductCompositionLineView[] = [];
  const materials = document.materials ?? [];
  const derivatives = document.derivatives ?? [];

  for (const line of product.lines) {
    if (line.componentKind === 'material') {
      const material = materials.find((item) => item.id === line.componentId);
      if (!material) {
        continue;
      }
      result.push({
        id: line.id,
        name: material.name,
        unit: material.unit,
        quantity: line.quantity,
      });
      continue;
    }

    const component = derivatives.find((item) => item.id === line.componentId);
    if (!component) {
      continue;
    }
    result.push({
      id: line.id,
      name: component.name,
      unit: component.unit,
      quantity: line.quantity,
    });
  }

  return result;
}

export function renameProduct(document: PrototypeDocument, id: string, name: string): PrototypeDocument {
  const current = document.products.find((item) => item.id === id && item.deletedAt === null);
  if (!current || productNameRejection(document, name, id)) {
    return document;
  }

  const nextName = name.trim();
  if (nextName === current.name) {
    return document;
  }

  return {
    ...document,
    products: document.products.map((item) => (item.id === id ? { ...item, name: nextName } : item)),
  };
}

export function setProductVat(document: PrototypeDocument, id: string, vatPercent: number): PrototypeDocument {
  if (productVatRejection(document, id)) {
    return document;
  }

  return {
    ...document,
    products: document.products.map((item) => (item.id === id ? { ...item, vatPercent } : item)),
  };
}

export function setProductUnitCost(
  document: PrototypeDocument,
  id: string,
  unitCostWithVat: number,
): PrototypeDocument {
  if (productUnitCostRejection(document, id, unitCostWithVat)) {
    return document;
  }

  const current = document.products.find((item) => item.id === id);
  if (!current || current.unitCostWithVat === unitCostWithVat) {
    return document;
  }

  return {
    ...document,
    products: document.products.map((item) => (item.id === id ? { ...item, unitCostWithVat } : item)),
  };
}

export function deleteProduct(document: PrototypeDocument, id: string, deletedAt: string): PrototypeDocument {
  if (!isDeletionMark(deletedAt)) {
    return document;
  }

  const current = document.products.find((item) => item.id === id && item.deletedAt === null);
  if (!current) {
    return document;
  }

  return {
    ...document,
    products: document.products.map((item) => (item.id === id ? { ...item, deletedAt } : item)),
  };
}

export function restoreProduct(document: PrototypeDocument, id: string): PrototypeDocument {
  const current = document.products.find((item) => item.id === id && item.deletedAt !== null);
  if (!current || rejectName(current.name, document.products, id)) {
    return document;
  }

  const category = document.categories.find((item) => item.id === current.categoryId && item.deletedAt === null);
  if (!category) {
    return document;
  }

  return {
    ...document,
    products: document.products.map((item) => (item.id === id ? { ...item, deletedAt: null } : item)),
  };
}
