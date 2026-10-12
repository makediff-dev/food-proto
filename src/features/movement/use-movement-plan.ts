'use client';

import { commitDocumentUpdate, useDocumentStore } from '@/data/DocumentProvider';
import {
  type FinishedGoodsOpeningRejection,
  setFinishedGoodsOpening,
  setFinishedGoodsOpeningRejection,
} from '@/domain/finished-goods';
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
    setOpening(month: string, productId: string, pieces: number): FinishedGoodsOpeningRejection | null {
      const today = new Date();
      return commitDocumentUpdate(
        updateDocument,
        (current) => setFinishedGoodsOpening(current, month, productId, pieces, today),
        (current) => setFinishedGoodsOpeningRejection(current, month, productId, pieces, today),
      );
    },
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
