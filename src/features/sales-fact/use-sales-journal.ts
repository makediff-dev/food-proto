'use client';

import { useDocumentStore } from '@/data/document-store';
import type { PrototypeDocument, SaleLine } from '@/domain/document';
import {
  addSale,
  addSaleRejection,
  deleteSale,
  type SaleRejection,
  updateSale,
  updateSaleRejection,
} from '@/domain/sales';

function commit(
  updateDocument: (
    recipe: (current: PrototypeDocument) => PrototypeDocument,
  ) => void,
  recipe: (current: PrototypeDocument) => PrototypeDocument,
  explain: (current: PrototypeDocument) => SaleRejection | null,
): SaleRejection | null {
  let rejection: SaleRejection | null = null;
  updateDocument((current) => {
    const next = recipe(current);
    if (next === current) {
      rejection = explain(current);
    }
    return next;
  });
  return rejection;
}

export function useSalesJournal() {
  const { document, hydrated, updateDocument } = useDocumentStore();

  return {
    hydrated,
    document,
    add(customerName: string, occurredOn: string, lines: readonly SaleLine[]) {
      const today = new Date();
      const id = `sale:${crypto.randomUUID()}`;
      const rejection = commit(
        updateDocument,
        (current) =>
          addSale(current, id, customerName, occurredOn, lines, today),
        (current) =>
          addSaleRejection(current, id, customerName, occurredOn, lines, today),
      );
      return { id, rejection };
    },
    update(
      id: string,
      customerName: string,
      occurredOn: string,
      lines: readonly SaleLine[],
    ) {
      const today = new Date();
      return commit(
        updateDocument,
        (current) =>
          updateSale(current, id, customerName, occurredOn, lines, today),
        (current) =>
          updateSaleRejection(
            current,
            id,
            customerName,
            occurredOn,
            lines,
            today,
          ),
      );
    },
    remove(id: string) {
      updateDocument((current) => deleteSale(current, id));
    },
  };
}
