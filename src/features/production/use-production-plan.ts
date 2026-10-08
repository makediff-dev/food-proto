'use client';

import { commitDocumentUpdate, useDocumentStore } from '@/data/DocumentProvider';
import {
  addMissingProductionPlanLines,
  addMissingProductionPlanLinesRejection,
  ensureProductionPlan,
  updateProductionPlanLine,
  updateProductionPlanLineRejection,
  workingProductionPlan,
} from '@/domain/production-plan';
import { type FieldRejection, productUnitCostRejection, setProductUnitCost } from '@/domain/products';

export function useProductionPlan() {
  const { document, hydrated, updateDocument } = useDocumentStore();

  return {
    hydrated,
    document,
    updateProductionVolume(month: string, lineId: string, volumePieces: number) {
      const today = new Date();
      return commitDocumentUpdate(
        updateDocument,
        (current) => {
          let next = current;
          if (!workingProductionPlan(next, month)) {
            next = ensureProductionPlan(next, `production-plan:${crypto.randomUUID()}`, month, today);
          }
          const plan = workingProductionPlan(next, month);
          if (!plan) {
            return current;
          }
          return updateProductionPlanLine(next, plan.id, lineId, volumePieces, today);
        },
        (current) => {
          const plan = workingProductionPlan(current, month);
          if (!plan) {
            const ensured = ensureProductionPlan(current, `production-plan:${crypto.randomUUID()}`, month, today);
            if (ensured === current) {
              return 'month';
            }
            const created = workingProductionPlan(ensured, month);
            if (!created) {
              return 'missing';
            }
            return updateProductionPlanLineRejection(ensured, created.id, lineId, volumePieces, today);
          }
          return updateProductionPlanLineRejection(current, plan.id, lineId, volumePieces, today);
        },
      );
    },
    addMissingProduction(planId: string, lines: readonly { id: string; productId: string }[]) {
      const today = new Date();
      return commitDocumentUpdate(
        updateDocument,
        (current) => addMissingProductionPlanLines(current, planId, lines, today),
        (current) => addMissingProductionPlanLinesRejection(current, planId, lines, today),
      );
    },
    updateProductCost(id: string, unitCostWithVat: number): FieldRejection | null {
      const rejection = productUnitCostRejection(document, id, unitCostWithVat);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => setProductUnitCost(current, id, unitCostWithVat));
      return null;
    },
  };
}
