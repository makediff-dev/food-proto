import { ratioKopecks, unitCost } from "@/domain/cost";
import {
  isDeletionMark,
  isOccurredOn,
  MAX_ID_LENGTH,
  MAX_LABEL_LENGTH,
  type Delivery,
  type DeliveryLine,
  type Derivative,
  type MaterialUnit,
  type PrototypeDocument,
  type RawMaterial,
  type RecipeComponentKind,
  type WriteOff,
  type WriteOffLine,
} from "@/domain/document";
import { activeMaterials } from "@/domain/materials";
import { MAX_PRICE_PER_KILOGRAM_KOPECKS, MAX_WEIGHT_GRAMS } from "@/domain/units";

const HUNDRED = BigInt(100);
const THOUSAND = BigInt(1000);

export type StockRejection =
  | "warehouse"
  | "date"
  | "note"
  | "missing"
  | "locked-warehouse"
  | "quantity"
  | "price"
  | "component"
  | "duplicate-line";

export interface KopeckPair {
  withVatKopecks: number;
  exVatKopecks: number;
}

export interface MovementHeader {
  warehouseId: string;
  occurredOn: string;
  note: string;
}

export interface DeliveryLineDraft {
  id: string;
  materialId: string;
  quantity: number;
  priceWithVatKopecks: number;
}

export interface WriteOffLineDraft {
  id: string;
  kind: RecipeComponentKind;
  refId: string;
  quantity: number;
}

export interface WriteOffLoss extends KopeckPair {
  /** Строки, где плановая себестоимость не считается. */
  unknownLineIds: string[];
}

export interface BalanceRow {
  warehouseId: string;
  kind: RecipeComponentKind;
  refId: string;
  isFinalProduct: boolean;
  name: string;
  unit: MaterialUnit;
  inbound: number;
  outbound: number;
  balance: number;
  deleted: boolean;
}

export interface PlannedUnit extends KopeckPair {
  per: MaterialUnit;
}

interface MovementRecord {
  id: string;
  warehouseId: string;
  occurredOn: string;
  note: string;
  lines: readonly { id: string }[];
  deletedAt: string | null;
}

function isEntityId(value: string): boolean {
  return value.length > 0 && value.length <= MAX_ID_LENGTH && value === value.trim();
}

function isQuantity(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= MAX_WEIGHT_GRAMS;
}

function isPrice(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= MAX_PRICE_PER_KILOGRAM_KOPECKS;
}

function scale(unit: MaterialUnit): bigint {
  return unit === "kg" ? THOUSAND : BigInt(1);
}

function scalePrice(
  quantity: number,
  unit: MaterialUnit,
  priceKopecks: number,
): number | null {
  return ratioKopecks(BigInt(quantity) * BigInt(priceKopecks), scale(unit));
}

/**
 * Цена без НДС, копейки за единицу.
 * `DSM Meat!J8 = H8 / (100 + F8) * 100`.
 */
export function unitExVatKopecks(
  priceWithVatKopecks: number,
  vatPercent: number,
): number | null {
  return ratioKopecks(BigInt(priceWithVatKopecks) * HUNDRED, BigInt(100 + vatPercent));
}

/**
 * Сумма строки. Килограммы хранятся граммами, поэтому делитель 1000.
 * Без НДС считается от цены с НДС и ставки, без промежуточного округления единицы.
 * `DSM Meat!J8`.
 */
export function amountPair(
  quantity: number,
  unit: MaterialUnit,
  priceWithVatKopecks: number,
  vatPercent: number,
): KopeckPair | null {
  const withVatKopecks = scalePrice(quantity, unit, priceWithVatKopecks);
  const exVatKopecks = ratioKopecks(
    BigInt(quantity) * BigInt(priceWithVatKopecks) * HUNDRED,
    scale(unit) * BigInt(100 + vatPercent),
  );

  if (withVatKopecks === null || exVatKopecks === null) {
    return null;
  }

  return { withVatKopecks, exVatKopecks };
}

export function stockItemUnit(
  document: PrototypeDocument,
  kind: RecipeComponentKind,
  refId: string,
): MaterialUnit | null {
  if (kind === "material") {
    return document.materials.find((item) => item.id === refId)?.unit ?? null;
  }

  const derivative = document.derivatives.find((item) => item.id === refId);
  if (!derivative) {
    return null;
  }

  return derivative.isFinalProduct ? "piece" : "kg";
}

export function deliveryLineAmount(
  document: PrototypeDocument,
  line: DeliveryLine,
): KopeckPair | null {
  const unit = stockItemUnit(document, "material", line.materialId);
  if (!unit) {
    return null;
  }

  return amountPair(line.quantity, unit, line.priceWithVatKopecks, line.vatPercent);
}

/** Итог поставки — сумма уже округлённых строк, с НДС и без НДС отдельно. */
export function deliveryTotal(
  document: PrototypeDocument,
  delivery: Delivery,
): KopeckPair | null {
  let withVatKopecks = 0;
  let exVatKopecks = 0;

  for (const line of delivery.lines) {
    const amount = deliveryLineAmount(document, line);
    if (!amount) {
      return null;
    }

    withVatKopecks += amount.withVatKopecks;
    exVatKopecks += amount.exVatKopecks;
  }

  return { withVatKopecks, exVatKopecks };
}

/**
 * Плановая цена единицы для убытка списания.
 * Сырьё — закупочная цена справочника. Производная и товар — `unitCost`.
 * Фактическая цена поставки сюда не входит.
 */
export function plannedUnitPrice(
  document: PrototypeDocument,
  kind: RecipeComponentKind,
  refId: string,
): PlannedUnit | null {
  if (kind === "material") {
    const material = document.materials.find((item) => item.id === refId);
    if (!material) {
      return null;
    }

    const exVatKopecks = unitExVatKopecks(
      material.priceWithVatKopecks,
      material.vatPercent,
    );
    if (exVatKopecks === null) {
      return null;
    }

    return {
      withVatKopecks: material.priceWithVatKopecks,
      exVatKopecks,
      per: material.unit,
    };
  }

  const cost = unitCost(document, refId);
  if (!cost) {
    return null;
  }

  return {
    withVatKopecks: cost.withVatKopecks,
    exVatKopecks: cost.exVatKopecks,
    per: cost.per,
  };
}

/** Потенциальный убыток строки. Нет числа, если плановая себестоимость не считается. */
export function writeOffLineLoss(
  document: PrototypeDocument,
  line: WriteOffLine,
): KopeckPair | null {
  if (line.kind === "material") {
    const material = document.materials.find((item) => item.id === line.refId);
    if (!material) {
      return null;
    }

    // Строка от цены с НДС и ставки, без округления цены единицы. `DSM Meat!J8`.
    return amountPair(
      line.quantity,
      material.unit,
      material.priceWithVatKopecks,
      material.vatPercent,
    );
  }

  const planned = plannedUnitPrice(document, line.kind, line.refId);
  if (!planned) {
    return null;
  }

  const withVatKopecks = scalePrice(line.quantity, planned.per, planned.withVatKopecks);
  const exVatKopecks = scalePrice(line.quantity, planned.per, planned.exVatKopecks);
  if (withVatKopecks === null || exVatKopecks === null) {
    return null;
  }

  return { withVatKopecks, exVatKopecks };
}

export function writeOffLoss(
  document: PrototypeDocument,
  writeOff: WriteOff,
): WriteOffLoss {
  let withVatKopecks = 0;
  let exVatKopecks = 0;
  const unknownLineIds: string[] = [];

  for (const line of writeOff.lines) {
    const loss = writeOffLineLoss(document, line);
    if (!loss) {
      unknownLineIds.push(line.id);
      continue;
    }

    withVatKopecks += loss.withVatKopecks;
    exVatKopecks += loss.exVatKopecks;
  }

  return { withVatKopecks, exVatKopecks, unknownLineIds };
}

interface Qty {
  inbound: number;
  outbound: number;
}

function movementKey(kind: RecipeComponentKind, refId: string): string {
  return `${kind}:${refId}`;
}

function movementMap(document: PrototypeDocument, warehouseId: string): Map<string, Qty> {
  const map = new Map<string, Qty>();

  function add(key: string, field: keyof Qty, quantity: number) {
    const current = map.get(key) ?? { inbound: 0, outbound: 0 };
    current[field] += quantity;
    map.set(key, current);
  }

  for (const delivery of document.deliveries) {
    if (delivery.deletedAt !== null || delivery.warehouseId !== warehouseId) {
      continue;
    }

    for (const line of delivery.lines) {
      add(movementKey("material", line.materialId), "inbound", line.quantity);
    }
  }

  for (const writeOff of document.writeOffs) {
    if (writeOff.deletedAt !== null || writeOff.warehouseId !== warehouseId) {
      continue;
    }

    for (const line of writeOff.lines) {
      add(movementKey(line.kind, line.refId), "outbound", line.quantity);
    }
  }

  return map;
}

/** Остаток = поставки − списания. Удалённые документы не входят. */
export function quantityOnHand(
  document: PrototypeDocument,
  warehouseId: string,
  kind: RecipeComponentKind,
  refId: string,
): number {
  const qty = movementMap(document, warehouseId).get(movementKey(kind, refId));
  if (!qty) {
    return 0;
  }

  return qty.inbound - qty.outbound;
}

/**
 * Середина между минимумом и максимумом, целые граммы или штуки.
 * Нечётная сумма округляется половиной вверх.
 */
export function reorderTarget(minNormStock: number, maxNormStock: number): number {
  const sum = BigInt(minNormStock) + BigInt(maxNormStock);
  return Number((sum + BigInt(1)) / BigInt(2));
}

export interface ReorderLine {
  materialId: string;
  name: string;
  unit: MaterialUnit;
  current: number;
  minNormStock: number;
  maxNormStock: number;
  /** Сколько добрать до середины между минимумом и максимумом. */
  orderQuantity: number;
  /**
   * (минимум − сейчас) / минимум.
   * `null`, если минимум 0: доли от нуля нет.
   */
  shortfallRatio: number | null;
}

/** Рабочее сырьё склада, у которого текущий остаток ниже минимума. */
export function materialsToReorder(
  document: PrototypeDocument,
  warehouseId: string,
): ReorderLine[] {
  const lines: ReorderLine[] = [];

  for (const material of activeMaterials(document)) {
    if (material.warehouseId !== warehouseId) {
      continue;
    }

    const current = quantityOnHand(document, warehouseId, "material", material.id);
    if (current >= material.minNormStock) {
      continue;
    }

    const target = reorderTarget(material.minNormStock, material.maxNormStock);
    lines.push({
      materialId: material.id,
      name: material.name,
      unit: material.unit,
      current,
      minNormStock: material.minNormStock,
      maxNormStock: material.maxNormStock,
      orderQuantity: target - current,
      shortfallRatio:
        material.minNormStock === 0
          ? null
          : (material.minNormStock - current) / material.minNormStock,
    });
  }

  lines.sort((left, right) => {
    const leftRank = left.shortfallRatio ?? Number.POSITIVE_INFINITY;
    const rightRank = right.shortfallRatio ?? Number.POSITIVE_INFINITY;
    if (leftRank !== rightRank) {
      return rightRank - leftRank;
    }

    return left.name.localeCompare(right.name, "ru");
  });

  return lines;
}

export type StockLevel = "low" | "high";

/** Ниже минимума или выше максимума. Между границами включительно знака нет. */
export function stockLevel(
  current: number,
  minNormStock: number,
  maxNormStock: number,
): StockLevel | null {
  if (current < minNormStock) {
    return "low";
  }
  if (current > maxNormStock) {
    return "high";
  }
  return null;
}

function kindRank(row: BalanceRow): number {
  if (row.kind === "material") {
    return 0;
  }

  return row.isFinalProduct ? 2 : 1;
}

/**
 * Рабочие позиции этого склада — даже с нулём.
 * Удалённые и перенесённые — только если по ним было движение.
 */
export function warehouseBalances(
  document: PrototypeDocument,
  warehouseId: string,
): BalanceRow[] {
  const totals = movementMap(document, warehouseId);
  const rows: BalanceRow[] = [];
  const seen = new Set<string>();

  function push(
    kind: RecipeComponentKind,
    refId: string,
    name: string,
    assignedWarehouseId: string,
    deletedAt: string | null,
    isFinalProduct: boolean,
    unit: MaterialUnit,
  ) {
    const key = movementKey(kind, refId);
    if (seen.has(key)) {
      return;
    }

    const move = totals.get(key) ?? { inbound: 0, outbound: 0 };
    const hasMovement = move.inbound !== 0 || move.outbound !== 0;
    const activeHere = deletedAt === null && assignedWarehouseId === warehouseId;
    if (!activeHere && !hasMovement) {
      return;
    }

    seen.add(key);
    rows.push({
      warehouseId,
      kind,
      refId,
      isFinalProduct,
      name,
      unit,
      inbound: move.inbound,
      outbound: move.outbound,
      balance: move.inbound - move.outbound,
      deleted: deletedAt !== null,
    });
  }

  for (const material of document.materials) {
    push(
      "material",
      material.id,
      material.name,
      material.warehouseId,
      material.deletedAt,
      false,
      material.unit,
    );
  }

  for (const derivative of document.derivatives) {
    const unit = derivative.isFinalProduct ? "piece" : "kg";
    push(
      "derivative",
      derivative.id,
      derivative.name,
      derivative.warehouseId,
      derivative.deletedAt,
      derivative.isFinalProduct,
      unit,
    );
  }

  rows.sort((left, right) => {
    const rank = kindRank(left) - kindRank(right);
    if (rank !== 0) {
      return rank;
    }

    return left.name.localeCompare(right.name, "ru");
  });

  return rows;
}

function warehouseAccepted(
  document: PrototypeDocument,
  warehouseId: string,
  previousId: string | null,
): boolean {
  const place = document.warehouses.find((item) => item.id === warehouseId);
  if (!place) {
    return false;
  }

  return place.deletedAt === null || warehouseId === previousId;
}

export function movementHeaderRejection(
  document: PrototypeDocument,
  draft: MovementHeader,
  current: MovementRecord | null,
): StockRejection | null {
  if (current && draft.warehouseId !== current.warehouseId && current.lines.length > 0) {
    return "locked-warehouse";
  }

  if (!warehouseAccepted(document, draft.warehouseId, current?.warehouseId ?? null)) {
    return "warehouse";
  }

  if (!isOccurredOn(draft.occurredOn)) {
    return "date";
  }

  if (draft.note.trim().length > MAX_LABEL_LENGTH) {
    return "note";
  }

  return null;
}

function headerFromDraft(draft: MovementHeader): MovementHeader {
  return {
    warehouseId: draft.warehouseId,
    occurredOn: draft.occurredOn,
    note: draft.note.trim(),
  };
}

export function activeDeliveries(document: PrototypeDocument): Delivery[] {
  return document.deliveries.filter((item) => item.deletedAt === null);
}

export function deletedDeliveries(document: PrototypeDocument): Delivery[] {
  return document.deliveries.filter((item) => item.deletedAt !== null);
}

export function activeWriteOffs(document: PrototypeDocument): WriteOff[] {
  return document.writeOffs.filter((item) => item.deletedAt === null);
}

export function deletedWriteOffs(document: PrototypeDocument): WriteOff[] {
  return document.writeOffs.filter((item) => item.deletedAt !== null);
}

export function addDelivery(
  document: PrototypeDocument,
  id: string,
  draft: MovementHeader,
): PrototypeDocument {
  if (!isEntityId(id) || document.deliveries.some((item) => item.id === id)) {
    return document;
  }

  if (movementHeaderRejection(document, draft, null)) {
    return document;
  }

  const header = headerFromDraft(draft);
  return {
    ...document,
    deliveries: [...document.deliveries, { id, ...header, lines: [], deletedAt: null }],
  };
}

export function updateDelivery(
  document: PrototypeDocument,
  id: string,
  draft: MovementHeader,
): PrototypeDocument {
  const current = document.deliveries.find((item) => item.id === id);
  if (!current || current.deletedAt !== null) {
    return document;
  }

  if (movementHeaderRejection(document, draft, current)) {
    return document;
  }

  const header = headerFromDraft(draft);
  if (
    current.warehouseId === header.warehouseId &&
    current.occurredOn === header.occurredOn &&
    current.note === header.note
  ) {
    return document;
  }

  return {
    ...document,
    deliveries: document.deliveries.map((item) =>
      item.id === id ? { ...item, ...header } : item,
    ),
  };
}

export function deleteDelivery(
  document: PrototypeDocument,
  id: string,
  deletedAt: string,
): PrototypeDocument {
  if (!isDeletionMark(deletedAt)) {
    return document;
  }

  const current = document.deliveries.find(
    (item) => item.id === id && item.deletedAt === null,
  );
  if (!current) {
    return document;
  }

  return {
    ...document,
    deliveries: document.deliveries.map((item) =>
      item.id === id ? { ...item, deletedAt } : item,
    ),
  };
}

export function restoreDelivery(
  document: PrototypeDocument,
  id: string,
): PrototypeDocument {
  const current = document.deliveries.find(
    (item) => item.id === id && item.deletedAt !== null,
  );
  if (!current) {
    return document;
  }

  return {
    ...document,
    deliveries: document.deliveries.map((item) =>
      item.id === id ? { ...item, deletedAt: null } : item,
    ),
  };
}

function openDelivery(document: PrototypeDocument, deliveryId: string): Delivery | null {
  return (
    document.deliveries.find(
      (item) => item.id === deliveryId && item.deletedAt === null,
    ) ?? null
  );
}

export function deliveryLineRejection(
  document: PrototypeDocument,
  deliveryId: string,
  draft: DeliveryLineDraft,
): StockRejection | null {
  const delivery = openDelivery(document, deliveryId);
  if (!delivery || !isEntityId(draft.id)) {
    return "missing";
  }

  if (delivery.lines.some((line) => line.id === draft.id)) {
    return "duplicate-line";
  }

  if (delivery.lines.some((line) => line.materialId === draft.materialId)) {
    return "duplicate-line";
  }

  const material = activeMaterials(document).find(
    (item) => item.id === draft.materialId && item.warehouseId === delivery.warehouseId,
  );
  if (!material) {
    return "component";
  }

  if (!isQuantity(draft.quantity)) {
    return "quantity";
  }

  if (!isPrice(draft.priceWithVatKopecks)) {
    return "price";
  }

  return null;
}

export function addDeliveryLine(
  document: PrototypeDocument,
  deliveryId: string,
  draft: DeliveryLineDraft,
): PrototypeDocument {
  if (deliveryLineRejection(document, deliveryId, draft)) {
    return document;
  }

  const material = document.materials.find((item) => item.id === draft.materialId);
  if (!material) {
    return document;
  }

  const line: DeliveryLine = {
    id: draft.id,
    materialId: draft.materialId,
    quantity: draft.quantity,
    priceWithVatKopecks: draft.priceWithVatKopecks,
    vatPercent: material.vatPercent,
  };

  return {
    ...document,
    deliveries: document.deliveries.map((item) =>
      item.id === deliveryId ? { ...item, lines: [...item.lines, line] } : item,
    ),
  };
}

export function updateDeliveryLineRejection(
  document: PrototypeDocument,
  deliveryId: string,
  lineId: string,
  quantity: number,
  priceWithVatKopecks: number,
): StockRejection | null {
  const delivery = openDelivery(document, deliveryId);
  const line = delivery?.lines.find((item) => item.id === lineId);
  if (!delivery || !line) {
    return "missing";
  }

  if (!isQuantity(quantity)) {
    return "quantity";
  }

  if (!isPrice(priceWithVatKopecks)) {
    return "price";
  }

  return null;
}

export function updateDeliveryLine(
  document: PrototypeDocument,
  deliveryId: string,
  lineId: string,
  quantity: number,
  priceWithVatKopecks: number,
): PrototypeDocument {
  if (
    updateDeliveryLineRejection(
      document,
      deliveryId,
      lineId,
      quantity,
      priceWithVatKopecks,
    )
  ) {
    return document;
  }

  const delivery = openDelivery(document, deliveryId);
  const line = delivery?.lines.find((item) => item.id === lineId);
  if (!delivery || !line) {
    return document;
  }

  if (line.quantity === quantity && line.priceWithVatKopecks === priceWithVatKopecks) {
    return document;
  }

  return {
    ...document,
    deliveries: document.deliveries.map((item) =>
      item.id === deliveryId
        ? {
            ...item,
            lines: item.lines.map((entry) =>
              entry.id === lineId ? { ...entry, quantity, priceWithVatKopecks } : entry,
            ),
          }
        : item,
    ),
  };
}

export function removeDeliveryLine(
  document: PrototypeDocument,
  deliveryId: string,
  lineId: string,
): PrototypeDocument {
  const delivery = openDelivery(document, deliveryId);
  if (!delivery || !delivery.lines.some((line) => line.id === lineId)) {
    return document;
  }

  return {
    ...document,
    deliveries: document.deliveries.map((item) =>
      item.id === deliveryId
        ? { ...item, lines: item.lines.filter((line) => line.id !== lineId) }
        : item,
    ),
  };
}

export function deliveryMaterialChoices(
  document: PrototypeDocument,
  deliveryId: string,
): RawMaterial[] {
  const delivery = openDelivery(document, deliveryId);
  if (!delivery) {
    return [];
  }

  const used = new Set(delivery.lines.map((line) => line.materialId));
  return activeMaterials(document).filter(
    (item) => item.warehouseId === delivery.warehouseId && !used.has(item.id),
  );
}

export function addWriteOff(
  document: PrototypeDocument,
  id: string,
  draft: MovementHeader,
): PrototypeDocument {
  if (!isEntityId(id) || document.writeOffs.some((item) => item.id === id)) {
    return document;
  }

  if (movementHeaderRejection(document, draft, null)) {
    return document;
  }

  const header = headerFromDraft(draft);
  return {
    ...document,
    writeOffs: [...document.writeOffs, { id, ...header, lines: [], deletedAt: null }],
  };
}

export function updateWriteOff(
  document: PrototypeDocument,
  id: string,
  draft: MovementHeader,
): PrototypeDocument {
  const current = document.writeOffs.find((item) => item.id === id);
  if (!current || current.deletedAt !== null) {
    return document;
  }

  if (movementHeaderRejection(document, draft, current)) {
    return document;
  }

  const header = headerFromDraft(draft);
  if (
    current.warehouseId === header.warehouseId &&
    current.occurredOn === header.occurredOn &&
    current.note === header.note
  ) {
    return document;
  }

  return {
    ...document,
    writeOffs: document.writeOffs.map((item) =>
      item.id === id ? { ...item, ...header } : item,
    ),
  };
}

export function deleteWriteOff(
  document: PrototypeDocument,
  id: string,
  deletedAt: string,
): PrototypeDocument {
  if (!isDeletionMark(deletedAt)) {
    return document;
  }

  const current = document.writeOffs.find(
    (item) => item.id === id && item.deletedAt === null,
  );
  if (!current) {
    return document;
  }

  return {
    ...document,
    writeOffs: document.writeOffs.map((item) =>
      item.id === id ? { ...item, deletedAt } : item,
    ),
  };
}

export function restoreWriteOff(
  document: PrototypeDocument,
  id: string,
): PrototypeDocument {
  const current = document.writeOffs.find(
    (item) => item.id === id && item.deletedAt !== null,
  );
  if (!current) {
    return document;
  }

  return {
    ...document,
    writeOffs: document.writeOffs.map((item) =>
      item.id === id ? { ...item, deletedAt: null } : item,
    ),
  };
}

function openWriteOff(document: PrototypeDocument, writeOffId: string): WriteOff | null {
  return (
    document.writeOffs.find(
      (item) => item.id === writeOffId && item.deletedAt === null,
    ) ?? null
  );
}

function writeOffTargetAccepted(
  document: PrototypeDocument,
  writeOff: WriteOff,
  draft: WriteOffLineDraft,
): boolean {
  if (draft.kind === "material") {
    return activeMaterials(document).some(
      (item) => item.id === draft.refId && item.warehouseId === writeOff.warehouseId,
    );
  }

  return document.derivatives.some(
    (item) =>
      item.id === draft.refId &&
      item.deletedAt === null &&
      item.warehouseId === writeOff.warehouseId,
  );
}

export function writeOffLineRejection(
  document: PrototypeDocument,
  writeOffId: string,
  draft: WriteOffLineDraft,
): StockRejection | null {
  const writeOff = openWriteOff(document, writeOffId);
  if (!writeOff || !isEntityId(draft.id)) {
    return "missing";
  }

  if (writeOff.lines.some((line) => line.id === draft.id)) {
    return "duplicate-line";
  }

  if (
    writeOff.lines.some((line) => line.kind === draft.kind && line.refId === draft.refId)
  ) {
    return "duplicate-line";
  }

  if (!writeOffTargetAccepted(document, writeOff, draft)) {
    return "component";
  }

  if (!isQuantity(draft.quantity)) {
    return "quantity";
  }

  return null;
}

export function addWriteOffLine(
  document: PrototypeDocument,
  writeOffId: string,
  draft: WriteOffLineDraft,
): PrototypeDocument {
  if (writeOffLineRejection(document, writeOffId, draft)) {
    return document;
  }

  const line: WriteOffLine = {
    id: draft.id,
    kind: draft.kind,
    refId: draft.refId,
    quantity: draft.quantity,
  };

  return {
    ...document,
    writeOffs: document.writeOffs.map((item) =>
      item.id === writeOffId ? { ...item, lines: [...item.lines, line] } : item,
    ),
  };
}

export function updateWriteOffLineRejection(
  document: PrototypeDocument,
  writeOffId: string,
  lineId: string,
  quantity: number,
): StockRejection | null {
  const writeOff = openWriteOff(document, writeOffId);
  const line = writeOff?.lines.find((item) => item.id === lineId);
  if (!writeOff || !line) {
    return "missing";
  }

  if (!isQuantity(quantity)) {
    return "quantity";
  }

  return null;
}

export function updateWriteOffLine(
  document: PrototypeDocument,
  writeOffId: string,
  lineId: string,
  quantity: number,
): PrototypeDocument {
  if (updateWriteOffLineRejection(document, writeOffId, lineId, quantity)) {
    return document;
  }

  const writeOff = openWriteOff(document, writeOffId);
  const line = writeOff?.lines.find((item) => item.id === lineId);
  if (!writeOff || !line || line.quantity === quantity) {
    return document;
  }

  return {
    ...document,
    writeOffs: document.writeOffs.map((item) =>
      item.id === writeOffId
        ? {
            ...item,
            lines: item.lines.map((entry) =>
              entry.id === lineId ? { ...entry, quantity } : entry,
            ),
          }
        : item,
    ),
  };
}

export function removeWriteOffLine(
  document: PrototypeDocument,
  writeOffId: string,
  lineId: string,
): PrototypeDocument {
  const writeOff = openWriteOff(document, writeOffId);
  if (!writeOff || !writeOff.lines.some((line) => line.id === lineId)) {
    return document;
  }

  return {
    ...document,
    writeOffs: document.writeOffs.map((item) =>
      item.id === writeOffId
        ? { ...item, lines: item.lines.filter((line) => line.id !== lineId) }
        : item,
    ),
  };
}

export function writeOffChoices(
  document: PrototypeDocument,
  writeOffId: string,
): { materials: RawMaterial[]; derivatives: Derivative[]; products: Derivative[] } {
  const writeOff = openWriteOff(document, writeOffId);
  if (!writeOff) {
    return { materials: [], derivatives: [], products: [] };
  }

  const used = new Set(writeOff.lines.map((line) => movementKey(line.kind, line.refId)));
  const materials = activeMaterials(document).filter(
    (item) =>
      item.warehouseId === writeOff.warehouseId &&
      !used.has(movementKey("material", item.id)),
  );
  const made = document.derivatives.filter(
    (item) =>
      item.deletedAt === null &&
      item.warehouseId === writeOff.warehouseId &&
      !used.has(movementKey("derivative", item.id)),
  );

  return {
    materials,
    derivatives: made.filter((item) => !item.isFinalProduct),
    products: made.filter((item) => item.isFinalProduct),
  };
}
