"use client";

import { useDocumentStore } from "@/data/document-store";
import type { PrototypeDocument } from "@/domain/document";
import {
  finalProductVatRejection,
  setFinalProductVat,
  type FieldRejection,
} from "@/domain/materials";
import {
  addMissingPlanLines,
  addMissingPlanLinesRejection,
  ensureSalesPlan,
  updateSalesPlanLine,
  updateSalesPlanLineRejection,
  workingSalesPlan,
  type SalesPlanRejection,
} from "@/domain/sales-plan";
import {
  setOperatingExpense,
  setOperatingExpenseRejection,
  type OperatingExpenseRejection,
  type OperatingExpenseSide,
} from "@/domain/summary";

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
    updateMonthLine(
      month: string,
      lineId: string,
      priceWithVatKopecks: number,
      volumePieces: number,
    ) {
      const today = new Date();
      return commit(
        updateDocument,
        (current) => {
          let next = current;
          if (!workingSalesPlan(next, month)) {
            next = ensureSalesPlan(
              next,
              `sales-plan:${crypto.randomUUID()}`,
              month,
              today,
            );
          }
          const plan = workingSalesPlan(next, month);
          if (!plan) {
            return current;
          }
          return updateSalesPlanLine(
            next,
            plan.id,
            lineId,
            priceWithVatKopecks,
            volumePieces,
            today,
          );
        },
        (current) => {
          const plan = workingSalesPlan(current, month);
          if (!plan) {
            const ensured = ensureSalesPlan(
              current,
              `sales-plan:${crypto.randomUUID()}`,
              month,
              today,
            );
            if (ensured === current) {
              return "month";
            }
            const created = workingSalesPlan(ensured, month);
            if (!created) {
              return "missing";
            }
            return updateSalesPlanLineRejection(
              ensured,
              created.id,
              lineId,
              priceWithVatKopecks,
              volumePieces,
              today,
            );
          }
          return updateSalesPlanLineRejection(
            current,
            plan.id,
            lineId,
            priceWithVatKopecks,
            volumePieces,
            today,
          );
        },
      );
    },
    updateProductVat(id: string, vatPercent: number): FieldRejection | null {
      const rejection = finalProductVatRejection(document, id, vatPercent);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => setFinalProductVat(current, id, vatPercent));
      return null;
    },
    updateOperatingExpense(
      month: string,
      side: OperatingExpenseSide,
      amountExVatKopecks: number,
    ): OperatingExpenseRejection | null {
      const rejection = setOperatingExpenseRejection(
        document,
        month,
        side,
        amountExVatKopecks,
      );
      if (rejection) {
        return rejection;
      }
      updateDocument((current) =>
        setOperatingExpense(current, month, side, amountExVatKopecks),
      );
      return null;
    },
    addMissing(planId: string, lines: readonly { id: string; productId: string }[]) {
      const today = new Date();
      return commit(
        updateDocument,
        (current) => addMissingPlanLines(current, planId, lines, today),
        (current) => addMissingPlanLinesRejection(current, planId, lines, today),
      );
    },
  };
}
