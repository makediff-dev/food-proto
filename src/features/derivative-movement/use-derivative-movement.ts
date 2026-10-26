'use client';

import { useDocumentStore } from '@/data/DocumentProvider';
import {
  type DerivativeNormField,
  type DerivativeNormRejection,
  type DerivativeOpeningRejection,
  setDerivativeNorm,
  setDerivativeNormRejection,
  setDerivativeOpening,
  setDerivativeOpeningRejection,
} from '@/domain/derivative-movement';

export function useDerivativeMovement() {
  const store = useDocumentStore();

  return {
    document: store.document,
    hydrated: store.hydrated,
    setOpening(month: string, derivativeId: string, quantity: number, today: Date): DerivativeOpeningRejection | null {
      const rejection = setDerivativeOpeningRejection(store.document, month, derivativeId, quantity, today);
      if (rejection) {
        return rejection;
      }
      store.updateDocument((current) => setDerivativeOpening(current, month, derivativeId, quantity, today));
      return null;
    },
    setNorm(
      month: string,
      derivativeId: string,
      field: DerivativeNormField,
      value: number,
      today: Date,
    ): DerivativeNormRejection | null {
      const rejection = setDerivativeNormRejection(store.document, month, derivativeId, field, value, today);
      if (rejection) {
        return rejection;
      }
      store.updateDocument((current) => setDerivativeNorm(current, month, derivativeId, field, value, today));
      return null;
    },
  };
}
