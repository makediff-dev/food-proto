'use client';

import { commitDocumentUpdate, useDocumentStore } from '@/data/DocumentProvider';
import { addMissingProductionPlanLines, addMissingProductionPlanLinesRejection } from '@/domain/production-plan';

export function useProductionPlan() {
  const { document, hydrated, updateDocument } = useDocumentStore();

  return {
    hydrated,
    document,
    addMissingProduction(planId: string, lines: readonly { id: string; productId: string }[]) {
      const today = new Date();
      return commitDocumentUpdate(
        updateDocument,
        (current) => addMissingProductionPlanLines(current, planId, lines, today),
        (current) => addMissingProductionPlanLinesRejection(current, planId, lines, today),
      );
    },
  };
}
