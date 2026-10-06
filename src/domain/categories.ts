import {
  type NameRejection,
  normalizeName,
  rejectName,
} from '@/domain/directory';
import {
  isDeletionMark,
  MAX_ID_LENGTH,
  type ProductCategory,
  type PrototypeDocument,
} from '@/domain/document';

export type CategoryRejection = NameRejection | 'missing';

function isEntityId(value: string): boolean {
  return (
    value.length > 0 && value.length <= MAX_ID_LENGTH && value === value.trim()
  );
}

export function activeCategories(
  document: PrototypeDocument,
): ProductCategory[] {
  return document.categories.filter((item) => item.deletedAt === null);
}

export function deletedCategories(
  document: PrototypeDocument,
): ProductCategory[] {
  return document.categories.filter((item) => item.deletedAt !== null);
}

export function categoryNameRejection(
  document: PrototypeDocument,
  name: string,
  exceptId?: string,
): CategoryRejection | null {
  return rejectName(name, document.categories, exceptId);
}

export function addCategory(
  document: PrototypeDocument,
  category: ProductCategory,
): PrototypeDocument {
  if (
    !isEntityId(category.id) ||
    document.categories.some((item) => item.id === category.id)
  ) {
    return document;
  }

  if (categoryNameRejection(document, category.name)) {
    return document;
  }

  const next: ProductCategory = {
    id: category.id,
    name: normalizeName(category.name),
    deletedAt: null,
  };

  return {
    ...document,
    categories: [...document.categories, next],
  };
}

export function renameCategory(
  document: PrototypeDocument,
  id: string,
  name: string,
): PrototypeDocument {
  const current = document.categories.find(
    (item) => item.id === id && item.deletedAt === null,
  );
  if (!current || categoryNameRejection(document, name, id)) {
    return document;
  }

  const nextName = normalizeName(name);
  if (nextName === current.name) {
    return document;
  }

  return {
    ...document,
    categories: document.categories.map((item) =>
      item.id === id ? { ...item, name: nextName } : item,
    ),
  };
}

export function deleteCategory(
  document: PrototypeDocument,
  id: string,
  deletedAt: string,
): PrototypeDocument {
  if (!isDeletionMark(deletedAt)) {
    return document;
  }

  const current = document.categories.find(
    (item) => item.id === id && item.deletedAt === null,
  );
  if (!current) {
    return document;
  }

  return {
    ...document,
    categories: document.categories.map((item) =>
      item.id === id ? { ...item, deletedAt } : item,
    ),
    products: document.products.map((item) =>
      item.categoryId === id && item.deletedAt === null
        ? { ...item, deletedAt }
        : item,
    ),
  };
}

export function restoreCategory(
  document: PrototypeDocument,
  id: string,
): PrototypeDocument {
  const current = document.categories.find(
    (item) => item.id === id && item.deletedAt !== null,
  );
  if (!current || rejectName(current.name, document.categories, id)) {
    return document;
  }

  let products = document.products;
  for (const product of document.products) {
    if (product.categoryId !== id || product.deletedAt === null) {
      continue;
    }
    if (rejectName(product.name, products, product.id)) {
      continue;
    }
    products = products.map((item) =>
      item.id === product.id ? { ...item, deletedAt: null } : item,
    );
  }

  return {
    ...document,
    categories: document.categories.map((item) =>
      item.id === id ? { ...item, deletedAt: null } : item,
    ),
    products,
  };
}
