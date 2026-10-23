'use client';

import { useDocumentStore } from '@/data/DocumentProvider';
import { addDerivative, type DerivativeAddRejection } from '@/domain/derivatives';
import type { DerivativeLine, DerivativeUnit, DerivativeWorkshopId } from '@/domain/document';

export function useDerivatives() {
  const store = useDocumentStore();

  return {
    document: store.document,
    hydrated: store.hydrated,
    add(input: {
      id: string;
      name: string;
      workshopId: DerivativeWorkshopId;
      unit: DerivativeUnit;
      lines: readonly DerivativeLine[];
    }): DerivativeAddRejection | null {
      const preview = addDerivative(store.document, input);
      if (preview.rejection) {
        return preview.rejection;
      }
      store.updateDocument((current) => {
        const next = addDerivative(current, input);
        return next.rejection ? current : next.document;
      });
      return null;
    },
  };
}
