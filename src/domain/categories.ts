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

/** Рабочие категории и удалённые, у которых есть товары в текущей сетке. */
export function visibleCategories(
  document: PrototypeDocument,
  products: readonly { categoryId: string }[],
): ProductCategory[] {
  const used = new Set(products.map((item) => item.categoryId));
  return document.categories.filter(
    (item) => item.deletedAt === null || used.has(item.id),
  );
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

  return {
    ...document,
    categories: document.categories.map((item) =>
      item.id === id ? { ...item, deletedAt: null } : item,
    ),
  };
}
