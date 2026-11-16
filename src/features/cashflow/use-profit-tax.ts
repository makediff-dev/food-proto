'use client';

import { useDocumentStore } from '@/data/DocumentProvider';
import { type ProfitTaxRejection, setProfitTaxRate, setProfitTaxRateRejection } from '@/domain/profit-tax';

export function useProfitTax() {
  const { document, hydrated, updateDocument } = useDocumentStore();

  return {
    hydrated,
    document,
    setRate(month: string, rateHundredths: number): ProfitTaxRejection | null {
      const rejection = setProfitTaxRateRejection(document, month, rateHundredths);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => setProfitTaxRate(current, month, rateHundredths));
      return null;
    },
  };
}
