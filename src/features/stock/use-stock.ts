"use client";

import { useDocumentStore } from "@/data/document-store";
import type { PrototypeDocument } from "@/domain/document";
import {
  activeDeliveries,
  activeWriteOffs,
  addDelivery,
  addDeliveryLine,
  addWriteOff,
  addWriteOffLine,
  deleteDelivery,
  deleteWriteOff,
  deletedDeliveries,
  deletedWriteOffs,
  deliveryLineRejection,
  movementHeaderRejection,
  removeDeliveryLine,
  removeWriteOffLine,
  restoreDelivery,
  restoreWriteOff,
  updateDelivery,
  updateDeliveryLine,
  updateDeliveryLineRejection,
  updateWriteOff,
  updateWriteOffLine,
  updateWriteOffLineRejection,
  writeOffLineRejection,
  type DeliveryLineDraft,
  type MovementHeader,
  type StockRejection,
  type WriteOffLineDraft,
} from "@/domain/stock";

function commit(
  updateDocument: (recipe: (current: PrototypeDocument) => PrototypeDocument) => void,
  recipe: (current: PrototypeDocument) => PrototypeDocument,
  explain: (current: PrototypeDocument) => StockRejection | null,
): StockRejection | null {
  let rejection: StockRejection | null = null;
  updateDocument((current) => {
    const next = recipe(current);
    if (next === current) {
      rejection = explain(current);
    }
    return next;
  });
  return rejection;
}

export function useStock() {
  const { document, hydrated, updateDocument } = useDocumentStore();

  return {
    hydrated,
    document,
    deliveries: activeDeliveries(document),
    deletedDeliveries: deletedDeliveries(document),
    writeOffs: activeWriteOffs(document),
    deletedWriteOffs: deletedWriteOffs(document),
    addDelivery(id: string, draft: MovementHeader) {
      return commit(
        updateDocument,
        (current) => addDelivery(current, id, draft),
        (current) => movementHeaderRejection(current, draft, null) ?? "missing",
      );
    },
    updateDelivery(id: string, draft: MovementHeader) {
      return commit(
        updateDocument,
        (current) => updateDelivery(current, id, draft),
        (current) => {
          const item = current.deliveries.find((entry) => entry.id === id);
          if (!item || item.deletedAt !== null) {
            return "missing";
          }
          return movementHeaderRejection(current, draft, item);
        },
      );
    },
    removeDelivery(id: string) {
      const deletedAt = new Date().toISOString();
      updateDocument((current) => deleteDelivery(current, id, deletedAt));
    },
    restoreDelivery(id: string) {
      return commit(
        updateDocument,
        (current) => restoreDelivery(current, id),
        (current) => {
          const item = current.deliveries.find((entry) => entry.id === id);
          if (!item || item.deletedAt === null) {
            return "missing";
          }
          return null;
        },
      );
    },
    addDeliveryLine(deliveryId: string, draft: DeliveryLineDraft) {
      return commit(
        updateDocument,
        (current) => addDeliveryLine(current, deliveryId, draft),
        (current) => deliveryLineRejection(current, deliveryId, draft) ?? "missing",
      );
    },
    updateDeliveryLine(
      deliveryId: string,
      lineId: string,
      quantity: number,
      priceWithVatKopecks: number,
    ) {
      return commit(
        updateDocument,
        (current) =>
          updateDeliveryLine(current, deliveryId, lineId, quantity, priceWithVatKopecks),
        (current) =>
          updateDeliveryLineRejection(
            current,
            deliveryId,
            lineId,
            quantity,
            priceWithVatKopecks,
          ) ?? "missing",
      );
    },
    removeDeliveryLine(deliveryId: string, lineId: string) {
      updateDocument((current) => removeDeliveryLine(current, deliveryId, lineId));
    },
    addWriteOff(id: string, draft: MovementHeader) {
      return commit(
        updateDocument,
        (current) => addWriteOff(current, id, draft),
        (current) => movementHeaderRejection(current, draft, null) ?? "missing",
      );
    },
    updateWriteOff(id: string, draft: MovementHeader) {
      return commit(
        updateDocument,
        (current) => updateWriteOff(current, id, draft),
        (current) => {
          const item = current.writeOffs.find((entry) => entry.id === id);
          if (!item || item.deletedAt !== null) {
            return "missing";
          }
          return movementHeaderRejection(current, draft, item);
        },
      );
    },
    removeWriteOff(id: string) {
      const deletedAt = new Date().toISOString();
      updateDocument((current) => deleteWriteOff(current, id, deletedAt));
    },
    restoreWriteOff(id: string) {
      return commit(
        updateDocument,
        (current) => restoreWriteOff(current, id),
        (current) => {
          const item = current.writeOffs.find((entry) => entry.id === id);
          if (!item || item.deletedAt === null) {
            return "missing";
          }
          return null;
        },
      );
    },
    addWriteOffLine(writeOffId: string, draft: WriteOffLineDraft) {
      return commit(
        updateDocument,
        (current) => addWriteOffLine(current, writeOffId, draft),
        (current) => writeOffLineRejection(current, writeOffId, draft) ?? "missing",
      );
    },
    updateWriteOffLine(writeOffId: string, lineId: string, quantity: number) {
      return commit(
        updateDocument,
        (current) => updateWriteOffLine(current, writeOffId, lineId, quantity),
        (current) =>
          updateWriteOffLineRejection(current, writeOffId, lineId, quantity) ?? "missing",
      );
    },
    removeWriteOffLine(writeOffId: string, lineId: string) {
      updateDocument((current) => removeWriteOffLine(current, writeOffId, lineId));
    },
  };
}
