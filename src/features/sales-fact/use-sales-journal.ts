'use client';

import { commitDocumentUpdate, useDocumentStore } from '@/data/document-store';
import type { SaleLine } from '@/domain/document';
import { addSale, addSaleRejection, deleteSale, updateSale, updateSaleRejection } from '@/domain/sales';

export function useSalesJournal() {
  const { document, hydrated, updateDocument } = useDocumentStore();

  return {
    hydrated,
    document,
    add(customerName: string, occurredOn: string, lines: readonly SaleLine[]) {
      const today = new Date();
      const id = `sale:${crypto.randomUUID()}`;
      const rejection = commitDocumentUpdate(
        updateDocument,
        (current) => addSale(current, id, customerName, occurredOn, lines, today),
        (current) => addSaleRejection(current, customerName, occurredOn, lines, today),
      );
      return { id, rejection };
    },
    update(id: string, customerName: string, occurredOn: string, lines: readonly SaleLine[]) {
      const today = new Date();
      return commitDocumentUpdate(
        updateDocument,
        (current) => updateSale(current, id, customerName, occurredOn, lines, today),
        (current) => updateSaleRejection(current, id, customerName, occurredOn, lines, today),
      );
    },
    remove(id: string) {
      updateDocument((current) => deleteSale(current, id));
    },
  };
}
