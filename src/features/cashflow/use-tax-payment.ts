'use client';

import { useDocumentStore } from '@/data/DocumentProvider';
import type { TaxPaymentKind } from '@/domain/document';
import { setTaxPaymentDay, setTaxPaymentDayRejection, type TaxPaymentRejection } from '@/domain/tax-payment';

export function useTaxPayment() {
  const { document, hydrated, updateDocument } = useDocumentStore();

  return {
    hydrated,
    document,
    setDay(kind: TaxPaymentKind, occurredOn: string, amount: number): TaxPaymentRejection | null {
      const rejection = setTaxPaymentDayRejection(document, kind, occurredOn, amount);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => setTaxPaymentDay(current, kind, occurredOn, amount));
      return null;
    },
  };
}
