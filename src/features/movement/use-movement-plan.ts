'use client';

import { commitDocumentUpdate, useDocumentStore } from '@/data/DocumentProvider';
import {
  type FinishedGoodsNormField,
  type FinishedGoodsNormRejection,
  setFinishedGoodsNorm,
  setFinishedGoodsNormRejection,
} from '@/domain/movement-plan';

export function useMovementPlan() {
  const { document, hydrated, updateDocument } = useDocumentStore();

  return {
    hydrated,
    document,
    setNorm(
      month: string,
      productId: string,
      field: FinishedGoodsNormField,
      value: number,
    ): FinishedGoodsNormRejection | null {
      const today = new Date();
      return commitDocumentUpdate(
        updateDocument,
        (current) => setFinishedGoodsNorm(current, month, productId, field, value, today),
        (current) => setFinishedGoodsNormRejection(current, month, productId, field, value, today),
      );
    },
  };
}
