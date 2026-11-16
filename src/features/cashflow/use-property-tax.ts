'use client';

import { useDocumentStore } from '@/data/DocumentProvider';
import { type PropertyTaxRejection, setPropertyTaxPlan, setPropertyTaxPlanRejection } from '@/domain/property-tax';

export function usePropertyTax() {
  const { document, hydrated, updateDocument } = useDocumentStore();

  return {
    hydrated,
    document,
    setPlan(month: string, amount: number): PropertyTaxRejection | null {
      const rejection = setPropertyTaxPlanRejection(document, month, amount);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => setPropertyTaxPlan(current, month, amount));
      return null;
    },
  };
}
