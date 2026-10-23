'use client';

import { useDocumentStore } from '@/data/DocumentProvider';
import type { ProductRecipeLine } from '@/domain/document';
import { type ProductRecipeRejection, updateProductRecipe } from '@/domain/products';

export function useFinishedRecipes() {
  const store = useDocumentStore();

  return {
    document: store.document,
    hydrated: store.hydrated,
    updateRecipe(productId: string, lines: readonly ProductRecipeLine[]): ProductRecipeRejection | null {
      const preview = updateProductRecipe(store.document, productId, lines);
      if (preview.rejection) {
        return preview.rejection;
      }
      store.updateDocument((current) => {
        const next = updateProductRecipe(current, productId, lines);
        return next.rejection ? current : next.document;
      });
      return null;
    },
  };
}
