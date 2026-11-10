'use client';

import { useDocumentStore } from '@/data/DocumentProvider';
import {
  addCreditor,
  addCreditorRejection,
  type CreditFieldRejection,
  type CreditMonthField,
  deleteCreditor,
  renameCreditor,
  renameCreditorRejection,
  restoreCreditor,
  restoreCreditorRejection,
  setCreditMonthField,
  setCreditMonthFieldRejection,
  setCreditorInitialPrincipal,
  setCreditorInitialPrincipalRejection,
  setCreditorInterestRate,
  setCreditorInterestRateRejection,
} from '@/domain/credit-resources';

export function useCreditResources() {
  const { document, hydrated, updateDocument } = useDocumentStore();

  return {
    hydrated,
    document,
    addCreditor(name: string): CreditFieldRejection | null {
      const id = `creditor:${crypto.randomUUID()}`;
      const rejection = addCreditorRejection(document, name);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => addCreditor(current, { id, name }));
      return null;
    },
    renameCreditor(creditorId: string, name: string): CreditFieldRejection | null {
      const rejection = renameCreditorRejection(document, creditorId, name);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => renameCreditor(current, creditorId, name));
      return null;
    },
    deleteCreditor(creditorId: string) {
      updateDocument((current) => deleteCreditor(current, creditorId, new Date().toISOString()));
    },
    restoreCreditor(creditorId: string): CreditFieldRejection | null {
      const rejection = restoreCreditorRejection(document, creditorId);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => restoreCreditor(current, creditorId));
      return null;
    },
    setInitialPrincipal(creditorId: string, amount: number): CreditFieldRejection | null {
      const rejection = setCreditorInitialPrincipalRejection(document, creditorId, amount);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => setCreditorInitialPrincipal(current, creditorId, amount));
      return null;
    },
    setInterestRate(creditorId: string, rateHundredths: number): CreditFieldRejection | null {
      const rejection = setCreditorInterestRateRejection(document, creditorId, rateHundredths);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => setCreditorInterestRate(current, creditorId, rateHundredths));
      return null;
    },
    setMonthField(
      month: string,
      creditorId: string,
      field: CreditMonthField,
      amount: number,
    ): CreditFieldRejection | null {
      const rejection = setCreditMonthFieldRejection(document, month, creditorId, field, amount);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => setCreditMonthField(current, month, creditorId, field, amount));
      return null;
    },
  };
}
