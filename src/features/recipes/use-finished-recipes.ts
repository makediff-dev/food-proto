'use client';

import { useDocumentStore } from '@/data/DocumentProvider';
import type { ProductRecipeLine } from '@/domain/document';
import { type ProductRecipeRejection, updateProductRecipe } from '@/domain/products';

export function useFinishedRecipes() {
  const store = useDocumentStore();

  return {
    document: store.document,
    hydrated: store.hydrated,
    updateRecipe(
      productId: string,
      lines: readonly ProductRecipeLine[],
      outputKilogramThousandths: number,
      outputPieceThousandths: number,
    ): ProductRecipeRejection | null {
      const preview = updateProductRecipe(
        store.document,
        productId,
        lines,
        outputKilogramThousandths,
        outputPieceThousandths,
      );
      if (preview.rejection) {
        return preview.rejection;
      }
      store.updateDocument((current) => {
        const next = updateProductRecipe(current, productId, lines, outputKilogramThousandths, outputPieceThousandths);
        return next.rejection ? current : next.document;
      });
      return null;
    },
  };
}
