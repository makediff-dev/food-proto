'use client';

import { useDocumentStore } from '@/data/DocumentProvider';
import { addDerivative, type DerivativeAddRejection, updateDerivative } from '@/domain/derivatives';
import type { DerivativeLine, DerivativeUnit, DerivativeWorkshopId } from '@/domain/document';

type DerivativeWriteInput = {
  name: string;
  workshopId: DerivativeWorkshopId;
  unit: DerivativeUnit;
  lines: readonly DerivativeLine[];
};

export function useDerivatives() {
  const store = useDocumentStore();

  return {
    document: store.document,
    hydrated: store.hydrated,
    add(input: DerivativeWriteInput & { id: string }): DerivativeAddRejection | null {
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
    update(id: string, input: DerivativeWriteInput): DerivativeAddRejection | null {
      const preview = updateDerivative(store.document, id, input);
      if (preview.rejection) {
        return preview.rejection;
      }
      store.updateDocument((current) => {
        const next = updateDerivative(current, id, input);
        return next.rejection ? current : next.document;
      });
      return null;
    },
  };
}
