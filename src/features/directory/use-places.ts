"use client";

import { useDocumentStore } from "@/data/document-store";
import {
  activeWarehouses,
  activeWorkshops,
  addWarehouse,
  addWorkshop,
  deletedWarehouses,
  deletedWorkshops,
  deleteWarehouse,
  deleteWorkshop,
  rejectName,
  renameWarehouse,
  renameWorkshop,
  restoreWarehouse,
  restoreWorkshop,
  type NameRejection,
} from "@/domain/directory";
import type { DeletableRecord, PrototypeDocument } from "@/domain/document";
import type { PlaceKind } from "@/features/directory/place-paths";

function placesOf(document: PrototypeDocument, kind: PlaceKind): DeletableRecord[] {
  return kind === "workshops" ? document.workshops : document.warehouses;
}

export function usePlaces(kind: PlaceKind) {
  const { document, hydrated, updateDocument } = useDocumentStore();

  function change(
    recipe: (current: PrototypeDocument) => PrototypeDocument,
    onUnchanged: (current: PrototypeDocument) => NameRejection | null,
  ): NameRejection | null {
    let rejection: NameRejection | null = null;
    updateDocument((current) => {
      const next = recipe(current);
      if (next === current) {
        rejection = onUnchanged(current);
      }
      return next;
    });
    return rejection;
  }

  return {
    hydrated,
    document,
    active: kind === "workshops" ? activeWorkshops(document) : activeWarehouses(document),
    deleted:
      kind === "workshops" ? deletedWorkshops(document) : deletedWarehouses(document),
    add(name: string) {
      const prefix = kind === "workshops" ? "workshop" : "warehouse";
      const id = `${prefix}:${crypto.randomUUID()}`;
      return change(
        (current) =>
          kind === "workshops"
            ? addWorkshop(current, { id, name, deletedAt: null })
            : addWarehouse(current, { id, name, deletedAt: null }),
        (current) => rejectName(name, placesOf(current, kind)) ?? "empty",
      );
    },
    rename(id: string, name: string) {
      return change(
        (current) =>
          kind === "workshops"
            ? renameWorkshop(current, id, name)
            : renameWarehouse(current, id, name),
        (current) => rejectName(name, placesOf(current, kind), id),
      );
    },
    remove(id: string) {
      const deletedAt = new Date().toISOString();
      updateDocument((current) =>
        kind === "workshops"
          ? deleteWorkshop(current, id, deletedAt)
          : deleteWarehouse(current, id, deletedAt),
      );
    },
    restore(id: string) {
      return change(
        (current) =>
          kind === "workshops"
            ? restoreWorkshop(current, id)
            : restoreWarehouse(current, id),
        (current) => {
          const item = placesOf(current, kind).find((entry) => entry.id === id);
          if (!item) {
            return "empty";
          }
          return rejectName(item.name, placesOf(current, kind), id) ?? "empty";
        },
      );
    },
  };
}
