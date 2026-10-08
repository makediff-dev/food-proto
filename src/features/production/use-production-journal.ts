'use client';

import { commitDocumentUpdate, useDocumentStore } from '@/data/DocumentProvider';
import type { ProductionEntryLine } from '@/domain/document';
import {
  addProductionEntry,
  addProductionEntryRejection,
  deleteProductionEntry,
  updateProductionEntry,
  updateProductionEntryRejection,
} from '@/domain/production-journal';

export function useProductionJournal() {
  const { document, hydrated, updateDocument } = useDocumentStore();

  return {
    hydrated,
    document,
    add(occurredOn: string, lines: readonly ProductionEntryLine[]) {
      const today = new Date();
      const id = `production-entry:${crypto.randomUUID()}`;
      const rejection = commitDocumentUpdate(
        updateDocument,
        (current) => addProductionEntry(current, id, occurredOn, lines, today),
        (current) => addProductionEntryRejection(current, occurredOn, lines, today),
      );
      return { id, rejection };
    },
    update(id: string, occurredOn: string, lines: readonly ProductionEntryLine[]) {
      const today = new Date();
      return commitDocumentUpdate(
        updateDocument,
        (current) => updateProductionEntry(current, id, occurredOn, lines, today),
        (current) => updateProductionEntryRejection(current, id, occurredOn, lines, today),
      );
    },
    remove(id: string) {
      updateDocument((current) => deleteProductionEntry(current, id));
    },
  };
}
