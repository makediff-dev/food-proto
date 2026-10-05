'use client';

import { useDocumentStore } from '@/data/document-store';
import type { PrototypeDocument } from '@/domain/document';
import {
  deletedSalesFacts,
  deleteSalesFact,
  restoreSalesFact,
  restoreSalesFactRejection,
  type SalesFactIds,
  type SalesFactInputs,
  type SalesFactRejection,
  setSalesFactCell,
  setSalesFactCellRejection,
  setSalesFactOpening,
  setSalesFactOpeningRejection,
} from '@/domain/sales-fact';

function commit(
  updateDocument: (
    recipe: (current: PrototypeDocument) => PrototypeDocument,
  ) => void,
  recipe: (current: PrototypeDocument) => PrototypeDocument,
  explain: (current: PrototypeDocument) => SalesFactRejection | null,
): SalesFactRejection | null {
  let rejection: SalesFactRejection | null = null;
  updateDocument((current) => {
    const next = recipe(current);
    if (next === current) {
      rejection = explain(current);
    }
    return next;
  });
  return rejection;
}

function freshIds(): SalesFactIds {
  return {
    factId: `sales-fact:${crypto.randomUUID()}`,
    recordId: `sales-fact-line:${crypto.randomUUID()}`,
  };
}

export function useSalesFact() {
  const { document, hydrated, updateDocument } = useDocumentStore();

  return {
    hydrated,
    document,
    deleted: deletedSalesFacts(document),
    setCell(
      month: string,
      occurredOn: string,
      productId: string,
      inputs: SalesFactInputs,
    ) {
      const today = new Date();
      const ids = freshIds();
      return commit(
        updateDocument,
        (current) =>
          setSalesFactCell(
            current,
            month,
            occurredOn,
            productId,
            inputs,
            ids,
            today,
          ),
        (current) =>
          setSalesFactCellRejection(
            current,
            month,
            occurredOn,
            productId,
            inputs,
            ids,
            today,
          ),
      );
    },
    setOpening(
      month: string,
      productId: string,
      productionPieces: number,
      distributionPieces: number,
    ) {
      const today = new Date();
      const ids = freshIds();
      return commit(
        updateDocument,
        (current) =>
          setSalesFactOpening(
            current,
            month,
            productId,
            productionPieces,
            distributionPieces,
            ids,
            today,
          ),
        (current) =>
          setSalesFactOpeningRejection(
            current,
            month,
            productId,
            productionPieces,
            distributionPieces,
            ids,
            today,
          ),
      );
    },
    remove(id: string) {
      updateDocument((current) =>
        deleteSalesFact(current, id, new Date().toISOString()),
      );
    },
    restore(id: string) {
      return commit(
        updateDocument,
        (current) => restoreSalesFact(current, id),
        (current) => restoreSalesFactRejection(current, id),
      );
    },
  };
}
