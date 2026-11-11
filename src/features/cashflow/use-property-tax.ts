'use client';

import { useDocumentStore } from '@/data/DocumentProvider';
import {
  type PropertyTaxField,
  type PropertyTaxRejection,
  setPropertyTaxField,
  setPropertyTaxFieldRejection,
} from '@/domain/property-tax';

export function usePropertyTax() {
  const { document, hydrated, updateDocument } = useDocumentStore();

  return {
    hydrated,
    document,
    setField(month: string, field: PropertyTaxField, amount: number): PropertyTaxRejection | null {
      const rejection = setPropertyTaxFieldRejection(document, month, field, amount);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => setPropertyTaxField(current, month, field, amount));
      return null;
    },
  };
}
