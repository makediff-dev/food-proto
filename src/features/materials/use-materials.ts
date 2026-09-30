"use client";

import { useDocumentStore } from "@/data/document-store";
import type { PrototypeDocument } from "@/domain/document";
import { MAX_WEIGHT_GRAMS } from "@/domain/units";
import {
  activeDerivatives,
  activeMaterials,
  activeRecipeFor,
  compositionGrams,
  addDerivative,
  addMaterial,
  addRecipe,
  addRecipeLine,
  deleteDerivative,
  deleteMaterial,
  deletedDerivatives,
  deletedMaterials,
  deletedRecipesFor,
  deleteRecipe as removeRecipeRecord,
  derivativeDraftRejection,
  FINAL_BATCH_PIECES,
  FINISHED_BATCH_GRAMS,
  inputGramsForFinishedBatch,
  materialDraftRejection,
  lineQuantityRejection,
  recipeLineRejection,
  removeRecipeLine,
  restoreDerivative,
  restoreMaterial,
  restoreRecipe,
  restoreRecipeRejection,
  setRecipeBatchSize,
  setRecipeYield,
  updateDerivative,
  updateMaterial,
  updateRecipeLineQuantity,
  type DerivativeDraft,
  type FieldRejection,
  type MaterialDraft,
  type RecipeLineDraft,
} from "@/domain/materials";

function commit(
  updateDocument: (recipe: (current: PrototypeDocument) => PrototypeDocument) => void,
  recipe: (current: PrototypeDocument) => PrototypeDocument,
  explain: (current: PrototypeDocument) => FieldRejection | null,
): FieldRejection | null {
  let rejection: FieldRejection | null = null;
  updateDocument((current) => {
    const next = recipe(current);
    if (next === current) {
      rejection = explain(current);
    }
    return next;
  });
  return rejection;
}

export function useMaterials() {
  const { document, hydrated, updateDocument } = useDocumentStore();

  return {
    hydrated,
    document,
    materials: activeMaterials(document),
    deletedMaterials: deletedMaterials(document),
    derivatives: activeDerivatives(document),
    deletedDerivatives: deletedDerivatives(document),
    activeRecipeFor(derivativeId: string) {
      return activeRecipeFor(document, derivativeId);
    },
    deletedRecipesFor(derivativeId: string) {
      return deletedRecipesFor(document, derivativeId);
    },
    addMaterial(id: string, draft: MaterialDraft) {
      return commit(
        updateDocument,
        (current) =>
          addMaterial(current, {
            id,
            ...draft,
            deletedAt: null,
          }),
        (current) => materialDraftRejection(current, draft) ?? "missing",
      );
    },
    updateMaterial(id: string, draft: MaterialDraft) {
      return commit(
        updateDocument,
        (current) => updateMaterial(current, id, draft),
        (current) => {
          if (!current.materials.some((item) => item.id === id)) {
            return "missing";
          }
          return materialDraftRejection(current, draft, id);
        },
      );
    },
    removeMaterial(id: string) {
      const deletedAt = new Date().toISOString();
      updateDocument((current) => deleteMaterial(current, id, deletedAt));
    },
    restoreMaterial(id: string) {
      return commit(
        updateDocument,
        (current) => restoreMaterial(current, id),
        (current) => {
          const item = current.materials.find((entry) => entry.id === id);
          if (!item) {
            return "missing";
          }
          return materialDraftRejection(current, item, id) ?? "missing";
        },
      );
    },
    addDerivative(id: string, draft: DerivativeDraft) {
      return commit(
        updateDocument,
        (current) =>
          addDerivative(current, {
            id,
            name: draft.name,
            isFinalProduct: draft.isFinalProduct,
            warehouseId: draft.warehouseId,
            workshopId: draft.workshopId,
            vatPercent: draft.isFinalProduct ? (draft.vatPercent ?? null) : null,
            pieceWeightGrams: draft.isFinalProduct
              ? null
              : (draft.pieceWeightGrams ?? null),
            deletedAt: null,
          }),
        (current) => derivativeDraftRejection(current, draft) ?? "missing",
      );
    },
    updateDerivative(id: string, draft: DerivativeDraft) {
      return commit(
        updateDocument,
        (current) => updateDerivative(current, id, draft),
        (current) => {
          if (!current.derivatives.some((item) => item.id === id)) {
            return "missing";
          }
          return derivativeDraftRejection(current, draft, id);
        },
      );
    },
    removeDerivative(id: string) {
      const deletedAt = new Date().toISOString();
      updateDocument((current) => deleteDerivative(current, id, deletedAt));
    },
    restoreDerivative(id: string) {
      return commit(
        updateDocument,
        (current) => restoreDerivative(current, id),
        (current) => {
          const item = current.derivatives.find((entry) => entry.id === id);
          if (!item) {
            return "missing";
          }
          return derivativeDraftRejection(current, item, id) ?? "missing";
        },
      );
    },
    addRecipe(id: string, derivativeId: string, yieldPercent: number | null) {
      return commit(
        updateDocument,
        (current) => {
          const derivative = current.derivatives.find((item) => item.id === derivativeId);
          return addRecipe(current, {
            id,
            derivativeId,
            batchSize: derivative?.isFinalProduct
              ? FINAL_BATCH_PIECES
              : FINISHED_BATCH_GRAMS,
            yieldPercent,
            lines: [],
            deletedAt: null,
          });
        },
        (current) => {
          const derivative = current.derivatives.find((item) => item.id === derivativeId);
          if (!derivative) {
            return "missing";
          }
          if (activeRecipeFor(current, derivativeId)) {
            return "recipe-exists";
          }
          if (!derivative.isFinalProduct && yieldPercent === null) {
            return "yield";
          }
          return "missing";
        },
      );
    },
    setYield(recipeId: string, yieldPercent: number) {
      return commit(
        updateDocument,
        (current) => setRecipeYield(current, recipeId, yieldPercent),
        (current) => {
          const recipe = current.recipes.find((item) => item.id === recipeId);
          if (!recipe) {
            return "missing";
          }
          const derivative = current.derivatives.find(
            (item) => item.id === recipe.derivativeId,
          );
          if (!derivative || derivative.isFinalProduct) {
            return "yield";
          }
          if (
            compositionGrams(recipe.lines) >
            inputGramsForFinishedBatch(yieldPercent, recipe.batchSize)
          ) {
            return "batch";
          }
          return "yield";
        },
      );
    },
    setBatchSize(recipeId: string, batchSize: number) {
      return commit(
        updateDocument,
        (current) => setRecipeBatchSize(current, recipeId, batchSize),
        (current) => {
          const recipe = current.recipes.find((item) => item.id === recipeId);
          if (!recipe) {
            return "missing";
          }
          if (
            !Number.isInteger(batchSize) ||
            batchSize < 1 ||
            batchSize > MAX_WEIGHT_GRAMS
          ) {
            return "batch-size";
          }
          if (recipe.batchSize === batchSize) {
            return "batch-size";
          }
          return "quantity";
        },
      );
    },
    addLine(recipeId: string, draft: RecipeLineDraft) {
      return commit(
        updateDocument,
        (current) => addRecipeLine(current, recipeId, draft),
        (current) => recipeLineRejection(current, recipeId, draft) ?? "missing",
      );
    },
    updateLine(recipeId: string, lineId: string, quantityGrams: number) {
      return commit(
        updateDocument,
        (current) => updateRecipeLineQuantity(current, recipeId, lineId, quantityGrams),
        (current) =>
          lineQuantityRejection(current, recipeId, lineId, quantityGrams) ?? "quantity",
      );
    },
    removeLine(recipeId: string, lineId: string) {
      updateDocument((current) => removeRecipeLine(current, recipeId, lineId));
    },
    removeRecipe(recipeId: string) {
      const deletedAt = new Date().toISOString();
      updateDocument((current) => removeRecipeRecord(current, recipeId, deletedAt));
    },
    restoreRecipe(recipeId: string) {
      return commit(
        updateDocument,
        (current) => restoreRecipe(current, recipeId),
        (current) => restoreRecipeRejection(current, recipeId) ?? "missing",
      );
    },
  };
}
