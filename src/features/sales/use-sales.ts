'use client';

import { commitDocumentUpdate, useDocumentStore } from '@/data/DocumentProvider';
import {
  addCategory,
  type CategoryRejection,
  categoryNameRejection,
  deleteCategory,
  renameCategory,
  restoreCategory,
} from '@/domain/categories';
import {
  addProduct,
  deleteProduct,
  type FieldRejection,
  productCategoryRejection,
  productNameRejection,
  productVatRejection,
  renameProduct,
  restoreProduct,
  setProductVat,
} from '@/domain/products';
import {
  addMissingPlanLines,
  addMissingPlanLinesRejection,
  ensureSalesPlan,
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

export function useSales() {
  const { document, hydrated, updateDocument } = useDocumentStore();

  return {
    hydrated,
    document,
    updateMonthLine(month: string, lineId: string, priceWithVat: number, volumePieces: number) {
      const today = new Date();
      return commitDocumentUpdate(
        updateDocument,
        (current) => {
          let next = current;
          if (!workingSalesPlan(next, month)) {
            next = ensureSalesPlan(next, `sales-plan:${crypto.randomUUID()}`, month, today);
          }
          const plan = workingSalesPlan(next, month);
          if (!plan) {
            return current;
          }
          return updateSalesPlanLine(next, plan.id, lineId, priceWithVat, volumePieces, today);
        },
        (current) => {
          const plan = workingSalesPlan(current, month);
          if (!plan) {
            const ensured = ensureSalesPlan(current, `sales-plan:${crypto.randomUUID()}`, month, today);
            if (ensured === current) {
              return 'month';
            }
            const created = workingSalesPlan(ensured, month);
            if (!created) {
              return 'missing';
            }
            return updateSalesPlanLineRejection(ensured, created.id, lineId, priceWithVat, volumePieces, today);
          }
          return updateSalesPlanLineRejection(current, plan.id, lineId, priceWithVat, volumePieces, today);
        },
      );
    },
    addCategory(name: string): CategoryRejection | null {
      const id = `category:${crypto.randomUUID()}`;
      const rejection = categoryNameRejection(document, name);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => addCategory(current, { id, name, deletedAt: null }));
      return null;
    },
    renameCategory(id: string, name: string): CategoryRejection | null {
      const rejection = categoryNameRejection(document, name, id);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => renameCategory(current, id, name));
      return null;
    },
    deleteCategory(id: string) {
      updateDocument((current) => deleteCategory(current, id, new Date().toISOString()));
    },
    restoreCategory(id: string): CategoryRejection | null {
      const current = document.categories.find((item) => item.id === id);
      if (!current || current.deletedAt === null) {
        return 'missing';
      }
      const rejection = categoryNameRejection(document, current.name, id);
      if (rejection) {
        return rejection;
      }
      updateDocument((next) => restoreCategory(next, id));
      return null;
    },
    addProduct(name: string, categoryId: string): FieldRejection | null {
      const id = `product:${crypto.randomUUID()}`;
      const rejection = productNameRejection(document, name) ?? productCategoryRejection(document, categoryId);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) =>
        addProduct(current, {
          id,
          name,
          categoryId,
          vatPercent: 20,
          unitCostWithVat: 0,
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
      const rejection = productVatRejection(document, id);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => setProductVat(current, id, vatPercent));
      return null;
    },
    deleteProduct(id: string) {
      updateDocument((current) => deleteProduct(current, id, new Date().toISOString()));
    },
    restoreProduct(id: string): FieldRejection | null {
      const current = document.products.find((item) => item.id === id);
      if (!current || current.deletedAt === null) {
        return 'missing';
      }
      const rejection =
        productNameRejection(document, current.name, id) ?? productCategoryRejection(document, current.categoryId);
      if (rejection) {
        return rejection;
      }
      updateDocument((next) => restoreProduct(next, id));
      return null;
    },
    updateOperatingExpense(
      month: string,
      side: OperatingExpenseSide,
      amountExVat: number,
    ): OperatingExpenseRejection | null {
      const rejection = setOperatingExpenseRejection(document, month, side, amountExVat);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => setOperatingExpense(current, month, side, amountExVat));
      return null;
    },
    addMissing(planId: string, lines: readonly { id: string; productId: string }[]) {
      const today = new Date();
      return commitDocumentUpdate(
        updateDocument,
        (current) => addMissingPlanLines(current, planId, lines, today),
        (current) => addMissingPlanLinesRejection(current, planId, lines, today),
      );
    },
  };
}
