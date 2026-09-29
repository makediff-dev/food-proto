"use client";

import { useDocumentStore } from "@/data/document-store";
import type { PrototypeDocument } from "@/domain/document";
import {
  activeFactOnDate,
  activeProductionFacts,
  addProductionFact,
  addProductionFactOutput,
  deleteProductionFact,
  deletedProductionFacts,
  factHeaderRejection,
  factOutputRejection,
  factUseRejection,
  factUsesRejection,
  outputQuantityRejection,
  removeProductionFactOutput,
  restoreProductionFact,
  setProductionFactOutputQuantity,
  setProductionFactOutputUses,
  updateProductionFact,
  upsertProductionFactUse,
  type FactHeader,
  type FactOutputDraft,
  type FactRejection,
  type FactUseDraft,
} from "@/domain/production-fact";

function commit(
  updateDocument: (recipe: (current: PrototypeDocument) => PrototypeDocument) => void,
  recipe: (current: PrototypeDocument) => PrototypeDocument,
  explain: (current: PrototypeDocument) => FactRejection | null,
): FactRejection | null {
  let rejection: FactRejection | null = null;
  updateDocument((current) => {
    const next = recipe(current);
    if (next === current) {
      rejection = explain(current);
    }
    return next;
  });
  return rejection;
}

export function useProductionFact() {
  const { document, hydrated, updateDocument } = useDocumentStore();

  return {
    hydrated,
    document,
    facts: activeProductionFacts(document),
    deletedFacts: deletedProductionFacts(document),
    addFact(id: string, draft: FactHeader) {
      return commit(
        updateDocument,
        (current) => addProductionFact(current, id, draft),
        (current) => factHeaderRejection(current, draft, null) ?? "missing",
      );
    },
    updateFact(id: string, draft: FactHeader) {
      return commit(
        updateDocument,
        (current) => updateProductionFact(current, id, draft),
        (current) => {
          const item = current.productionFacts.find((entry) => entry.id === id);
          if (!item || item.deletedAt !== null) {
            return "missing";
          }
          return factHeaderRejection(current, draft, item);
        },
      );
    },
    removeFact(id: string) {
      const deletedAt = new Date().toISOString();
      updateDocument((current) => deleteProductionFact(current, id, deletedAt));
    },
    restoreFact(id: string) {
      return commit(
        updateDocument,
        (current) => restoreProductionFact(current, id),
        (current) => {
          const item = current.productionFacts.find((entry) => entry.id === id);
          if (!item || item.deletedAt === null) {
            return "missing";
          }
          if (activeFactOnDate(current, item.occurredOn)) {
            return "date-taken";
          }
          return null;
        },
      );
    },
    addOutput(factId: string, draft: FactOutputDraft) {
      return commit(
        updateDocument,
        (current) => addProductionFactOutput(current, factId, draft),
        (current) => factOutputRejection(current, factId, draft) ?? "missing",
      );
    },
    setOutputQuantity(factId: string, outputId: string, quantity: number) {
      return commit(
        updateDocument,
        (current) => setProductionFactOutputQuantity(current, factId, outputId, quantity),
        (current) =>
          outputQuantityRejection(current, factId, outputId, quantity) ?? "missing",
      );
    },
    setUses(factId: string, outputId: string, uses: FactUseDraft[]) {
      return commit(
        updateDocument,
        (current) => setProductionFactOutputUses(current, factId, outputId, uses),
        (current) => factUsesRejection(current, factId, outputId, uses) ?? "missing",
      );
    },
    upsertUse(factId: string, outputId: string, draft: FactUseDraft) {
      return commit(
        updateDocument,
        (current) => upsertProductionFactUse(current, factId, outputId, draft),
        (current) => factUseRejection(current, factId, outputId, draft) ?? "missing",
      );
    },
    removeOutput(factId: string, outputId: string) {
      updateDocument((current) => removeProductionFactOutput(current, factId, outputId));
    },
  };
}
