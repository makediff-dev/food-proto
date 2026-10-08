import { type NameRejection, rejectName } from '@/domain/directory';
import { isDeletionMark, type Product, type PrototypeDocument, type SalesPlanLine } from '@/domain/document';
import { MAX_PRICE_KOPECKS } from '@/domain/units';

export type FieldRejection = NameRejection | 'cost' | 'missing' | 'category';

function isUnitCost(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= MAX_PRICE_KOPECKS;
}

export function activeProducts(document: PrototypeDocument): Product[] {
  return document.products.filter((item) => item.deletedAt === null);
}

export function deletedProducts(document: PrototypeDocument): Product[] {
  return document.products.filter((item) => item.deletedAt !== null);
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

function appendPlanLines(document: PrototypeDocument, productId: string) {
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

export function productCategoryRejection(document: PrototypeDocument, categoryId: string): FieldRejection | null {
  const category = document.categories.find((item) => item.id === categoryId && item.deletedAt === null);
  return category ? null : 'category';
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

  const next: Product = {
    id: product.id,
    name: product.name.trim(),
    categoryId: product.categoryId,
    vatPercent,
    unitCostWithVat,
    deletedAt: null,
  };

  const withProduct: PrototypeDocument = {
    ...document,
    products: [...document.products, next],
  };

  return {
    ...withProduct,
    salesPlans: appendPlanLines(withProduct, next.id),
  };
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
