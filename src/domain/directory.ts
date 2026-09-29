import {
  isDeletionMark,
  MAX_ID_LENGTH,
  MAX_LABEL_LENGTH,
  type DeletableRecord,
  type PrototypeDocument,
  type Warehouse,
  type Workshop,
} from "@/domain/document";

export type NameRejection = "empty" | "too-long" | "duplicate";

export function normalizeName(name: string): string {
  return name.trim();
}

function isPlaceId(value: string): boolean {
  return value.length > 0 && value.length <= MAX_ID_LENGTH && value === value.trim();
}

function nameKey(name: string): string {
  return normalizeName(name).toLocaleLowerCase("ru-RU");
}

/** Пустое, длинное или уже занятое среди записей без `deletedAt`. */
export function rejectName(
  name: string,
  items: readonly DeletableRecord[],
  exceptId?: string,
): NameRejection | null {
  const normalized = normalizeName(name);
  if (normalized.length === 0) {
    return "empty";
  }

  if (normalized.length > MAX_LABEL_LENGTH) {
    return "too-long";
  }

  const key = nameKey(normalized);
  const clash = items.some(
    (item) =>
      item.deletedAt === null && item.id !== exceptId && nameKey(item.name) === key,
  );

  return clash ? "duplicate" : null;
}

export function activeWorkshops(document: PrototypeDocument): Workshop[] {
  return document.workshops.filter((item) => item.deletedAt === null);
}

export function activeWarehouses(document: PrototypeDocument): Warehouse[] {
  return document.warehouses.filter((item) => item.deletedAt === null);
}

export function deletedWorkshops(document: PrototypeDocument): Workshop[] {
  return document.workshops.filter((item) => item.deletedAt !== null);
}

export function deletedWarehouses(document: PrototypeDocument): Warehouse[] {
  return document.warehouses.filter((item) => item.deletedAt !== null);
}

function addRecord<T extends DeletableRecord>(
  items: readonly T[],
  record: T,
): T[] | null {
  if (!isPlaceId(record.id) || items.some((item) => item.id === record.id)) {
    return null;
  }

  if (rejectName(record.name, items)) {
    return null;
  }

  const next: T = {
    ...record,
    name: normalizeName(record.name),
    deletedAt: null,
  };

  return [...items, next];
}

function renameRecord<T extends DeletableRecord>(
  items: T[],
  id: string,
  name: string,
): T[] | null {
  const current = items.find((item) => item.id === id);
  if (!current || rejectName(name, items, id)) {
    return null;
  }

  const normalized = normalizeName(name);
  if (normalized === current.name) {
    return items;
  }

  return items.map((item) => (item.id === id ? { ...item, name: normalized } : item));
}

function deleteRecord<T extends DeletableRecord>(
  items: readonly T[],
  id: string,
  deletedAt: string,
): T[] | null {
  if (!isDeletionMark(deletedAt)) {
    return null;
  }

  const current = items.find((item) => item.id === id && item.deletedAt === null);
  if (!current) {
    return null;
  }

  return items.map((item) => (item.id === id ? { ...item, deletedAt } : item));
}

function restoreRecord<T extends DeletableRecord>(
  items: readonly T[],
  id: string,
): T[] | null {
  const current = items.find((item) => item.id === id && item.deletedAt !== null);
  if (!current || rejectName(current.name, items, id)) {
    return null;
  }

  return items.map((item) => (item.id === id ? { ...item, deletedAt: null } : item));
}

/** Неудача и прежнее имя возвращают тот же документ, без записи в хранилище. */
export function addWorkshop(
  document: PrototypeDocument,
  workshop: Workshop,
): PrototypeDocument {
  const workshops = addRecord(document.workshops, workshop);
  if (!workshops) {
    return document;
  }

  return { ...document, workshops };
}

export function renameWorkshop(
  document: PrototypeDocument,
  id: string,
  name: string,
): PrototypeDocument {
  const workshops = renameRecord(document.workshops, id, name);
  if (!workshops || workshops === document.workshops) {
    return document;
  }

  return { ...document, workshops };
}

export function deleteWorkshop(
  document: PrototypeDocument,
  id: string,
  deletedAt: string,
): PrototypeDocument {
  const workshops = deleteRecord(document.workshops, id, deletedAt);
  if (!workshops) {
    return document;
  }

  return { ...document, workshops };
}

export function restoreWorkshop(
  document: PrototypeDocument,
  id: string,
): PrototypeDocument {
  const workshops = restoreRecord(document.workshops, id);
  if (!workshops) {
    return document;
  }

  return { ...document, workshops };
}

export function addWarehouse(
  document: PrototypeDocument,
  warehouse: Warehouse,
): PrototypeDocument {
  const warehouses = addRecord(document.warehouses, warehouse);
  if (!warehouses) {
    return document;
  }

  return { ...document, warehouses };
}

export function renameWarehouse(
  document: PrototypeDocument,
  id: string,
  name: string,
): PrototypeDocument {
  const warehouses = renameRecord(document.warehouses, id, name);
  if (!warehouses || warehouses === document.warehouses) {
    return document;
  }

  return { ...document, warehouses };
}

export function deleteWarehouse(
  document: PrototypeDocument,
  id: string,
  deletedAt: string,
): PrototypeDocument {
  const warehouses = deleteRecord(document.warehouses, id, deletedAt);
  if (!warehouses) {
    return document;
  }

  return { ...document, warehouses };
}

export function restoreWarehouse(
  document: PrototypeDocument,
  id: string,
): PrototypeDocument {
  const warehouses = restoreRecord(document.warehouses, id);
  if (!warehouses) {
    return document;
  }

  return { ...document, warehouses };
}
