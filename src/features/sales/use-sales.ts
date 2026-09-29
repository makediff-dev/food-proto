"use client";

import { useDocumentStore } from "@/data/document-store";
import type { PrototypeDocument, SalesPlanLine } from "@/domain/document";
import {
  activeSalesPlans,
  addMissingPlanLines,
  addMissingPlanLinesRejection,
  addSalesPlan,
  addSalesPlanRejection,
  deletedSalesPlans,
  deleteSalesPlan,
  restoreSalesPlan,
  restoreSalesPlanRejection,
  updateSalesPlanLine,
  updateSalesPlanLineRejection,
  type SalesPlanRejection,
} from "@/domain/sales-plan";

function commit(
  updateDocument: (recipe: (current: PrototypeDocument) => PrototypeDocument) => void,
  recipe: (current: PrototypeDocument) => PrototypeDocument,
  explain: (current: PrototypeDocument) => SalesPlanRejection | null,
): SalesPlanRejection | null {
  let rejection: SalesPlanRejection | null = null;
  updateDocument((current) => {
    const next = recipe(current);
    if (next === current) {
      rejection = explain(current);
    }
    return next;
  });
  return rejection;
}

export function useSales() {
  const { document, hydrated, updateDocument } = useDocumentStore();

  return {
    hydrated,
    document,
    plans: activeSalesPlans(document),
    deletedPlans: deletedSalesPlans(document),
    addPlan(id: string, month: string, lines: readonly SalesPlanLine[]) {
      const today = new Date();
      return commit(
        updateDocument,
        (current) => addSalesPlan(current, id, month, lines, today),
        (current) => addSalesPlanRejection(current, id, month, lines, today),
      );
    },
    updateLine(
      planId: string,
      lineId: string,
      priceWithVatKopecks: number,
      volumePieces: number,
    ) {
      const today = new Date();
      return commit(
        updateDocument,
        (current) =>
          updateSalesPlanLine(
            current,
            planId,
            lineId,
            priceWithVatKopecks,
            volumePieces,
            today,
          ),
        (current) =>
          updateSalesPlanLineRejection(
            current,
            planId,
            lineId,
            priceWithVatKopecks,
            volumePieces,
            today,
          ),
      );
    },
    addMissing(planId: string, lines: readonly { id: string; productId: string }[]) {
      const today = new Date();
      return commit(
        updateDocument,
        (current) => addMissingPlanLines(current, planId, lines, today),
        (current) => addMissingPlanLinesRejection(current, planId, lines, today),
      );
    },
    removePlan(id: string) {
      updateDocument((current) => deleteSalesPlan(current, id, new Date().toISOString()));
    },
    restorePlan(id: string) {
      return commit(
        updateDocument,
        (current) => restoreSalesPlan(current, id),
        (current) => restoreSalesPlanRejection(current, id),
      );
    },
  };
}
