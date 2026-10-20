'use client';

import { useDocumentStore } from '@/data/DocumentProvider';
import type { Material, MaterialGroupId, MaterialUnit, MaterialWarehouseId } from '@/domain/document';
import {
  addMaterial,
  deleteMaterial,
  deleteMaterialReceipt,
  type MaterialPlanField,
  type MaterialReceiptDraft,
  materialNameRejection,
  renameMaterial,
  restoreMaterial,
  saveMaterialReceipt,
  setMaterialNorm,
  setMaterialNormRejection,
  setMaterialOpening,
  setMaterialOpeningRejection,
  setMaterialPlanField,
  setMaterialPlanRejection,
  setMaterialUnit,
  setMaterialVat,
} from '@/domain/materials';

export function useMaterials() {
  const store = useDocumentStore();

  return {
    document: store.document,
    hydrated: store.hydrated,
    setPlan(
      month: string,
      warehouseId: MaterialWarehouseId,
      materialId: string,
      field: MaterialPlanField,
      value: number,
      today: Date,
    ) {
      const rejection = setMaterialPlanRejection(store.document, month, warehouseId, materialId, field, value, today);
      if (rejection) {
        return rejection;
      }
      store.updateDocument((current) =>
        setMaterialPlanField(current, month, warehouseId, materialId, field, value, today),
      );
      return null;
    },
    setOpening(month: string, warehouseId: MaterialWarehouseId, materialId: string, quantity: number, today: Date) {
      const rejection = setMaterialOpeningRejection(store.document, month, warehouseId, materialId, quantity, today);
      if (rejection) {
        return rejection;
      }
      store.updateDocument((current) => setMaterialOpening(current, month, warehouseId, materialId, quantity, today));
      return null;
    },
    setNorm(
      warehouseId: MaterialWarehouseId,
      materialId: string,
      productId: string,
      quantityPerPiece: number | null,
      deletedAt: string | null,
    ) {
      const rejection = setMaterialNormRejection(store.document, warehouseId, materialId, productId, quantityPerPiece);
      if (rejection) {
        return rejection;
      }
      store.updateDocument((current) =>
        setMaterialNorm(current, warehouseId, materialId, productId, quantityPerPiece, deletedAt),
      );
      return null;
    },
    addMaterial(material: Pick<Material, 'id' | 'name' | 'groupId' | 'unit' | 'vatPercent'>) {
      const rejection = materialNameRejection(store.document, material.name);
      if (rejection) {
        return rejection;
      }
      store.updateDocument((current) => addMaterial(current, material));
      return null;
    },
    rename(id: string, name: string) {
      store.updateDocument((current) => renameMaterial(current, id, name));
    },
    setVat(id: string, vatPercent: number) {
      store.updateDocument((current) => setMaterialVat(current, id, vatPercent));
    },
    setUnit(id: string, unit: MaterialUnit) {
      store.updateDocument((current) => setMaterialUnit(current, id, unit));
    },
    remove(id: string) {
      store.updateDocument((current) => deleteMaterial(current, id, new Date().toISOString()));
    },
    restore(id: string) {
      const current = store.document.materials.find((item) => item.id === id);
      if (!current || current.deletedAt === null) {
        return 'missing' as const;
      }
      const rejection = materialNameRejection(store.document, current.name, id);
      if (rejection) {
        return rejection;
      }
      store.updateDocument((document) => restoreMaterial(document, id));
      return null;
    },
    saveReceipt(draft: MaterialReceiptDraft, today: Date) {
      store.updateDocument((current) => saveMaterialReceipt(current, draft, today));
    },
    removeReceipt(id: string) {
      store.updateDocument((current) => deleteMaterialReceipt(current, id));
    },
  };
}

export type MaterialsGroupId = MaterialGroupId;
