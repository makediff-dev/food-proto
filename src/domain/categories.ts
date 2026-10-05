import {
  type ProductCategory,
  type PrototypeDocument,
} from '@/domain/document';

export function activeCategories(
  document: PrototypeDocument,
): ProductCategory[] {
  return document.categories;
}
