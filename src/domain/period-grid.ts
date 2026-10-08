import { activeCategories } from '@/domain/categories';
import { type Product, type ProductCategory, type PrototypeDocument } from '@/domain/document';
import { activeProducts } from '@/domain/products';

/**
 * Id товаров, на которые в месяце есть строка рабочего плана
 * или хотя бы одна продажа.
 */
export function periodReferencedProductIds(document: PrototypeDocument, month: string): Set<string> {
  const ids = new Set<string>();

  for (const plan of document.salesPlans) {
    if (plan.deletedAt !== null || plan.month !== month) {
      continue;
    }
    for (const line of plan.lines) {
      ids.add(line.productId);
    }
  }

  const prefix = `${month}-`;
  for (const sale of document.sales) {
    if (!sale.occurredOn.startsWith(prefix)) {
      continue;
    }
    for (const line of sale.lines) {
      ids.add(line.productId);
    }
  }

  return ids;
}

/**
 * Рабочие товары плюс удалённые, у которых в этом месяце есть план или продажа.
 * Виртуальный нулевой план месяца в документ не пишется — архивные из него не берутся.
 */
export function periodGridProducts(document: PrototypeDocument, month: string): Product[] {
  const active = activeProducts(document);
  const referenced = periodReferencedProductIds(document, month);
  const activeIds = new Set(active.map((item) => item.id));
  const archived = document.products.filter(
    (item) => item.deletedAt !== null && referenced.has(item.id) && !activeIds.has(item.id),
  );

  return [...active, ...archived];
}

/**
 * Рабочие категории всегда. Удалённая — только если в сетке есть её товар.
 */
export function periodGridCategories(document: PrototypeDocument, products: readonly Product[]): ProductCategory[] {
  const productCategoryIds = new Set(products.map((item) => item.categoryId));
  const active = activeCategories(document);
  const activeIds = new Set(active.map((item) => item.id));
  const archived = document.categories.filter(
    (item) => item.deletedAt !== null && productCategoryIds.has(item.id) && !activeIds.has(item.id),
  );

  return [...active, ...archived];
}

/** Удалённый товар можно брать в продажу месяца, если он уже в сетке периода. */
export function productAllowedInPeriodSale(document: PrototypeDocument, productId: string, month: string): boolean {
  const product = document.products.find((item) => item.id === productId);
  if (!product) {
    return false;
  }
  if (product.deletedAt === null) {
    return true;
  }

  return periodReferencedProductIds(document, month).has(productId);
}
