'use client';

import { commitDocumentUpdate, useDocumentStore } from '@/data/DocumentProvider';
import {
  type FinishedGoodsOpeningRejection,
  setFinishedGoodsOpening,
  setFinishedGoodsOpeningRejection,
} from '@/domain/finished-goods';

export function useFinishedGoods() {
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
  };
}
