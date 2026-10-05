'use client';

import { useDocumentStore } from '@/data/document-store';
import type { PrototypeDocument } from '@/domain/document';
import {
  addProduct,
  deleteProduct,
  type FieldRejection,
  productNameRejection,
  productUnitCostRejection,
  productVatRejection,
  renameProduct,
  restoreProduct,
  setProductUnitCost,
  setProductVat,
} from '@/domain/products';
import {
  addMissingPlanLines,
  addMissingPlanLinesRejection,
  ensureSalesPlan,
  type SalesPlanRejection,
  updateSalesPlanLine,
  updateSalesPlanLineRejection,
  workingSalesPlan,
} from '@/domain/sales-plan';
import {
  type OperatingExpenseRejection,
  type OperatingExpenseSide,
  setOperatingExpense,
  setOperatingExpenseRejection,
} from '@/domain/summary';

function commit(
  updateDocument: (
    recipe: (current: PrototypeDocument) => PrototypeDocument,
  ) => void,
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
              return 'month';
            }
            const created = workingSalesPlan(ensured, month);
            if (!created) {
              return 'missing';
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
    addProduct(name: string): FieldRejection | null {
      const id = `product:${crypto.randomUUID()}`;
      const rejection = productNameRejection(document, name);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) =>
        addProduct(current, {
          id,
          name,
          vatPercent: 20,
          unitCostWithVatKopecks: 0,
          deletedAt: null,
        }),
      );
      return null;
    },
    renameProduct(id: string, name: string): FieldRejection | null {
      const rejection = productNameRejection(document, name, id);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => renameProduct(current, id, name));
      return null;
    },
    updateProductVat(id: string, vatPercent: number): FieldRejection | null {
      const rejection = productVatRejection(document, id, vatPercent);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => setProductVat(current, id, vatPercent));
      return null;
    },
    updateProductCost(
      id: string,
      unitCostWithVatKopecks: number,
    ): FieldRejection | null {
      const rejection = productUnitCostRejection(
        document,
        id,
        unitCostWithVatKopecks,
      );
      if (rejection) {
        return rejection;
      }
      updateDocument((current) =>
        setProductUnitCost(current, id, unitCostWithVatKopecks),
      );
      return null;
    },
    deleteProduct(id: string) {
      updateDocument((current) =>
        deleteProduct(current, id, new Date().toISOString()),
      );
    },
    restoreProduct(id: string): FieldRejection | null {
      const current = document.products.find((item) => item.id === id);
      if (!current || current.deletedAt === null) {
        return 'missing';
      }
      const rejection = productNameRejection(document, current.name, id);
      if (rejection) {
        return rejection;
      }
      updateDocument((next) => restoreProduct(next, id));
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
    addMissing(
      planId: string,
      lines: readonly { id: string; productId: string }[],
    ) {
      const today = new Date();
      return commit(
        updateDocument,
        (current) => addMissingPlanLines(current, planId, lines, today),
        (current) =>
          addMissingPlanLinesRejection(current, planId, lines, today),
      );
    },
  };
}
