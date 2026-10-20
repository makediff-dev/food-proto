import { costExVat } from '@/domain/cost';
import { rejectName } from '@/domain/directory';
import {
  isDeletionMark,
  isMonthKey,
  isOccurredOn,
  MATERIAL_GROUPS,
  MATERIAL_UNITS,
  MATERIAL_WAREHOUSES,
  type Material,
  type MaterialGroupId,
  type MaterialIssue,
  type MaterialIssueLine,
  type MaterialMonthPlan,
  type MaterialMonthPlanLine,
  type MaterialNorm,
  type MaterialOpening,
  type MaterialOpeningLine,
  type MaterialReceipt,
  type MaterialReceiptLine,
  type MaterialUnit,
  type MaterialWarehouseId,
  NORMED_MATERIAL_GROUP_ID,
  type PrototypeDocument,
} from '@/domain/document';
import { ratioRound } from '@/domain/money';
import { maxProductionEntryOccurredOn } from '@/domain/production-journal';
import { productionPlanForMonth } from '@/domain/production-plan';
import { isQuantityThousandths, QUANTITY_SCALE } from '@/domain/quantity';
import { planMonthOpen, shiftMonth } from '@/domain/sales-plan';
import { MAX_PRICE_KOPECKS } from '@/domain/units';

export type MaterialNameRejection = 'empty' | 'too-long' | 'duplicate' | 'missing' | 'locked';

export type MaterialFieldRejection = MaterialNameRejection | 'unit' | 'vat' | 'group';

export type MaterialPlanField =
  | 'receiptQuantity'
  | 'consumptionQuantity'
  | 'priceWithVat'
  | 'minQuantity'
  | 'maxQuantity';

export type MaterialPlanRejection = 'month' | 'closed' | 'material' | 'locked' | 'quantity' | 'price' | 'normed';

export type MaterialOpeningRejection = 'month' | 'closed' | 'material' | 'locked' | 'quantity' | 'warehouse';

export type MaterialNormRejection = 'material' | 'locked' | 'group' | 'product' | 'warehouse' | 'quantity';

export type MaterialDocumentRejection =
  | 'warehouse'
  | 'date'
  | 'closed'
  | 'supplier'
  | 'empty'
  | 'material'
  | 'locked'
  | 'quantity'
  | 'price'
  | 'normed'
  | 'missing';

export interface MaterialMoney {
  withVat: number;
  exVat: number;
}

export interface MaterialMovementRow {
  materialId: string;
  name: string;
  unit: MaterialUnit;
  vatPercent: number;
  deleted: boolean;
  /** Расход этого склада считается из нормы и выпуска, журнал расхода не входит в остаток. */
  normed: boolean;
  bookOpeningQuantity: number;
  openingQuantity: number;
  openingDeviationQuantity: number;
  openingCost: MaterialMoney;
  /** Плановая цена закупки. `DSM Meat!H`. */
  planPrice: MaterialMoney;
  planReceiptQuantity: number;
  factReceiptQuantity: number;
  receiptDeviationQuantity: number;
  planReceiptCost: MaterialMoney;
  factReceiptCost: MaterialMoney;
  /** Цена факта прихода. Нет прихода — пусто. */
  factReceiptPrice: MaterialMoney | null;
  planConsumptionQuantity: number;
  factConsumptionQuantity: number;
  consumptionDeviationQuantity: number;
  planConsumptionCost: MaterialMoney;
  factConsumptionCost: MaterialMoney;
  /** Цена расхода: цена прихода, если приход был, иначе плановая цена. `DSM Meat!R8`. */
  consumptionPrice: MaterialMoney;
  closingQuantity: number;
  minQuantity: number;
  maxQuantity: number;
  belowMinQuantity: number;
  aboveMaxQuantity: number;
  recommendedReceiptQuantity: number;
  closingCost: MaterialMoney;
}

export interface MaterialMovementTotals {
  /** Общая единица строк. Разные единицы — количества не складываются. */
  unit: MaterialUnit | null;
  bookOpeningQuantity: number | null;
  openingQuantity: number | null;
  openingDeviationQuantity: number | null;
  openingCost: MaterialMoney;
  planReceiptQuantity: number | null;
  factReceiptQuantity: number | null;
  receiptDeviationQuantity: number | null;
  planReceiptCost: MaterialMoney;
  factReceiptCost: MaterialMoney;
  planConsumptionQuantity: number | null;
  factConsumptionQuantity: number | null;
  consumptionDeviationQuantity: number | null;
  planConsumptionCost: MaterialMoney;
  factConsumptionCost: MaterialMoney;
  closingQuantity: number | null;
  minQuantity: number | null;
  maxQuantity: number | null;
  belowMinQuantity: number | null;
  aboveMaxQuantity: number | null;
  recommendedReceiptQuantity: number | null;
  closingCost: MaterialMoney;
}

export interface MaterialWarehouseMovement {
  warehouseId: MaterialWarehouseId;
  name: string;
  productionName: string;
  rows: MaterialMovementRow[];
  totals: MaterialMovementTotals;
}

export interface MaterialGroupMovement {
  groupId: MaterialGroupId;
  name: string;
  warehouses: MaterialWarehouseMovement[];
}

export interface MaterialMovementMonth {
  month: string;
  groups: MaterialGroupMovement[];
}

const ZERO_MONEY: MaterialMoney = { withVat: 0, exVat: 0 };

export function materialsList(document: PrototypeDocument): Material[] {
  return document.materials ?? [];
}

export function materialNormsList(document: PrototypeDocument): MaterialNorm[] {
  return document.materialNorms ?? [];
}

export function materialMonthPlansList(document: PrototypeDocument): MaterialMonthPlan[] {
  return document.materialMonthPlans ?? [];
}

export function materialOpeningsList(document: PrototypeDocument): MaterialOpening[] {
  return document.materialOpenings ?? [];
}

export function materialReceiptsList(document: PrototypeDocument): MaterialReceipt[] {
  return document.materialReceipts ?? [];
}

export function materialIssuesList(document: PrototypeDocument): MaterialIssue[] {
  return document.materialIssues ?? [];
}

export function activeMaterials(document: PrototypeDocument): Material[] {
  return materialsList(document).filter((item) => item.deletedAt === null);
}

export function deletedMaterials(document: PrototypeDocument): Material[] {
  return materialsList(document).filter((item) => item.deletedAt !== null);
}

export function isMaterialGroupId(value: string): value is MaterialGroupId {
  return MATERIAL_GROUPS.some((item) => item.id === value);
}

export function isMaterialWarehouseId(value: string): value is MaterialWarehouseId {
  return MATERIAL_WAREHOUSES.some((item) => item.id === value);
}

export function isMaterialUnit(value: string): value is MaterialUnit {
  return (MATERIAL_UNITS as readonly string[]).includes(value);
}

export function materialGroupName(groupId: MaterialGroupId): string {
  return MATERIAL_GROUPS.find((item) => item.id === groupId)?.name ?? groupId;
}

export function materialWarehouse(warehouseId: MaterialWarehouseId): (typeof MATERIAL_WAREHOUSES)[number] {
  const found = MATERIAL_WAREHOUSES.find((item) => item.id === warehouseId);
  if (!found) {
    throw new Error(`Unknown material warehouse: ${warehouseId}`);
  }
  return found;
}

function isVatPercent(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 100;
}

function isPrice(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= MAX_PRICE_KOPECKS;
}

export function materialNameRejection(
  document: PrototypeDocument,
  name: string,
  exceptId?: string,
): MaterialNameRejection | null {
  return rejectName(name, materialsList(document), exceptId);
}

export function addMaterial(
  document: PrototypeDocument,
  material: Pick<Material, 'id' | 'name' | 'groupId' | 'unit' | 'vatPercent'>,
): PrototypeDocument {
  if (materialNameRejection(document, material.name)) {
    return document;
  }
  if (!isMaterialGroupId(material.groupId) || !isMaterialUnit(material.unit) || !isVatPercent(material.vatPercent)) {
    return document;
  }

  const next: Material = {
    id: material.id,
    name: material.name.trim(),
    groupId: material.groupId,
    unit: material.unit,
    vatPercent: material.vatPercent,
    deletedAt: null,
  };

  return {
    ...document,
    materials: [...materialsList(document), next],
  };
}

export function renameMaterial(document: PrototypeDocument, id: string, name: string): PrototypeDocument {
  const current = materialsList(document).find((item) => item.id === id && item.deletedAt === null);
  if (!current || materialNameRejection(document, name, id)) {
    return document;
  }

  const nextName = name.trim();
  if (nextName === current.name) {
    return document;
  }

  return {
    ...document,
    materials: materialsList(document).map((item) => (item.id === id ? { ...item, name: nextName } : item)),
  };
}

export function setMaterialVat(document: PrototypeDocument, id: string, vatPercent: number): PrototypeDocument {
  const current = materialsList(document).find((item) => item.id === id && item.deletedAt === null);
  if (!current || !isVatPercent(vatPercent) || current.vatPercent === vatPercent) {
    return document;
  }

  return {
    ...document,
    materials: materialsList(document).map((item) => (item.id === id ? { ...item, vatPercent } : item)),
  };
}

export function setMaterialUnit(document: PrototypeDocument, id: string, unit: MaterialUnit): PrototypeDocument {
  const current = materialsList(document).find((item) => item.id === id && item.deletedAt === null);
  if (!current || !isMaterialUnit(unit) || current.unit === unit) {
    return document;
  }

  return {
    ...document,
    materials: materialsList(document).map((item) => (item.id === id ? { ...item, unit } : item)),
  };
}

export function deleteMaterial(document: PrototypeDocument, id: string, deletedAt: string): PrototypeDocument {
  const current = materialsList(document).find((item) => item.id === id && item.deletedAt === null);
  if (!current || !isDeletionMark(deletedAt)) {
    return document;
  }

  return {
    ...document,
    materials: materialsList(document).map((item) => (item.id === id ? { ...item, deletedAt } : item)),
  };
}

export function restoreMaterial(document: PrototypeDocument, id: string): PrototypeDocument {
  const current = materialsList(document).find((item) => item.id === id && item.deletedAt !== null);
  if (!current || materialNameRejection(document, current.name, id)) {
    return document;
  }

  return {
    ...document,
    materials: materialsList(document).map((item) => (item.id === id ? { ...item, deletedAt: null } : item)),
  };
}

export function materialById(document: PrototypeDocument, id: string): Material | null {
  return materialsList(document).find((item) => item.id === id) ?? null;
}

function liveNorms(document: PrototypeDocument, warehouseId: MaterialWarehouseId, materialId: string): MaterialNorm[] {
  return materialNormsList(document).filter(
    (item) => item.deletedAt === null && item.warehouseId === warehouseId && item.materialId === materialId,
  );
}

/** На этом складе расход позиции считается из выпуска. Журнал расхода в остаток не входит. */
export function materialConsumptionIsNormed(
  document: PrototypeDocument,
  warehouseId: MaterialWarehouseId,
  materialId: string,
): boolean {
  const material = materialById(document, materialId);
  if (!material || material.groupId !== NORMED_MATERIAL_GROUP_ID) {
    return false;
  }

  return liveNorms(document, warehouseId, materialId).length > 0;
}

export function setMaterialNormRejection(
  document: PrototypeDocument,
  warehouseId: MaterialWarehouseId,
  materialId: string,
  productId: string,
  quantityPerPiece: number | null,
): MaterialNormRejection | null {
  if (!isMaterialWarehouseId(warehouseId)) {
    return 'warehouse';
  }
  const material = materialById(document, materialId);
  if (!material) {
    return 'material';
  }
  if (material.groupId !== NORMED_MATERIAL_GROUP_ID) {
    return 'group';
  }
  if (material.deletedAt !== null) {
    return 'locked';
  }
  const product = document.products.find((item) => item.id === productId);
  if (!product) {
    return 'product';
  }
  if (product.deletedAt !== null) {
    return 'locked';
  }
  if (quantityPerPiece !== null && (!isQuantityThousandths(quantityPerPiece, false) || quantityPerPiece < 0)) {
    return 'quantity';
  }
  return null;
}

/**
 * Пишет норму склада на 1 шт продукции.
 * `null` мягко снимает норму. Ноль остаётся нормой: расход считается нулевым, журнал не используется.
 */
export function setMaterialNorm(
  document: PrototypeDocument,
  warehouseId: MaterialWarehouseId,
  materialId: string,
  productId: string,
  quantityPerPiece: number | null,
  deletedAt: string | null = null,
): PrototypeDocument {
  if (setMaterialNormRejection(document, warehouseId, materialId, productId, quantityPerPiece)) {
    return document;
  }

  const norms = materialNormsList(document);
  const existing = norms.find(
    (item) => item.warehouseId === warehouseId && item.materialId === materialId && item.productId === productId,
  );

  if (quantityPerPiece === null) {
    if (!existing || existing.deletedAt !== null || !isDeletionMark(deletedAt ?? '')) {
      return document;
    }
    return {
      ...document,
      materialNorms: norms.map((item) => (item.id === existing.id ? { ...item, deletedAt } : item)),
    };
  }

  if (existing) {
    if (existing.deletedAt === null && existing.quantityPerPiece === quantityPerPiece) {
      return document;
    }
    return {
      ...document,
      materialNorms: norms.map((item) =>
        item.id === existing.id ? { ...item, quantityPerPiece, deletedAt: null } : item,
      ),
    };
  }

  const created: MaterialNorm = {
    id: `material-norm:${warehouseId}:${materialId}:${productId}`,
    materialId,
    warehouseId,
    productId,
    quantityPerPiece,
    deletedAt: null,
  };
  return {
    ...document,
    materialNorms: [...norms, created],
  };
}

function planFor(
  document: PrototypeDocument,
  month: string,
  warehouseId: MaterialWarehouseId,
): MaterialMonthPlan | null {
  return (
    materialMonthPlansList(document).find((item) => item.month === month && item.warehouseId === warehouseId) ?? null
  );
}

function planLineFor(
  document: PrototypeDocument,
  month: string,
  warehouseId: MaterialWarehouseId,
  materialId: string,
): MaterialMonthPlanLine | null {
  return planFor(document, month, warehouseId)?.lines.find((item) => item.materialId === materialId) ?? null;
}

function emptyPlanLine(materialId: string, month: string, warehouseId: MaterialWarehouseId): MaterialMonthPlanLine {
  return {
    id: `material-plan-line:${month}:${warehouseId}:${materialId}`,
    materialId,
    receiptQuantity: 0,
    consumptionQuantity: 0,
    priceWithVat: 0,
    minQuantity: 0,
    maxQuantity: 0,
  };
}

export function setMaterialPlanRejection(
  document: PrototypeDocument,
  month: string,
  warehouseId: MaterialWarehouseId,
  materialId: string,
  field: MaterialPlanField,
  value: number,
  today: Date,
): MaterialPlanRejection | null {
  if (!isMaterialWarehouseId(warehouseId)) {
    return 'month';
  }
  if (!isMonthKey(month) || !planMonthOpen(month, today)) {
    return month < '2000-01' || !isMonthKey(month) ? 'month' : 'closed';
  }
  const material = materialById(document, materialId);
  if (!material) {
    return 'material';
  }
  if (material.deletedAt !== null) {
    return 'locked';
  }
  if (field === 'priceWithVat') {
    return isPrice(value) ? null : 'price';
  }
  if (field === 'consumptionQuantity' && materialConsumptionIsNormed(document, warehouseId, materialId)) {
    return 'normed';
  }
  const allowNegative = field === 'minQuantity' || field === 'maxQuantity';
  return isQuantityThousandths(value, allowNegative) ? null : 'quantity';
}

export function setMaterialPlanField(
  document: PrototypeDocument,
  month: string,
  warehouseId: MaterialWarehouseId,
  materialId: string,
  field: MaterialPlanField,
  value: number,
  today: Date,
): PrototypeDocument {
  if (setMaterialPlanRejection(document, month, warehouseId, materialId, field, value, today)) {
    return document;
  }

  const plans = materialMonthPlansList(document);
  const existing = planFor(document, month, warehouseId);
  if (!existing) {
    const created: MaterialMonthPlan = {
      id: `material-plan:${month}:${warehouseId}`,
      month,
      warehouseId,
      lines: [{ ...emptyPlanLine(materialId, month, warehouseId), [field]: value }],
    };
    return { ...document, materialMonthPlans: [...plans, created] };
  }

  const line = existing.lines.find((item) => item.materialId === materialId);
  if (line) {
    if (line[field] === value) {
      return document;
    }
    return {
      ...document,
      materialMonthPlans: plans.map((item) =>
        item.id !== existing.id
          ? item
          : {
              ...item,
              lines: item.lines.map((entry) =>
                entry.materialId === materialId ? { ...entry, [field]: value } : entry,
              ),
            },
      ),
    };
  }

  return {
    ...document,
    materialMonthPlans: plans.map((item) =>
      item.id !== existing.id
        ? item
        : { ...item, lines: [...item.lines, { ...emptyPlanLine(materialId, month, warehouseId), [field]: value }] },
    ),
  };
}

function openingFor(
  document: PrototypeDocument,
  month: string,
  warehouseId: MaterialWarehouseId,
): MaterialOpening | null {
  return (
    materialOpeningsList(document).find((item) => item.month === month && item.warehouseId === warehouseId) ?? null
  );
}

export function openingQuantityFor(
  document: PrototypeDocument,
  month: string,
  warehouseId: MaterialWarehouseId,
  materialId: string,
): number {
  return openingFor(document, month, warehouseId)?.lines.find((item) => item.materialId === materialId)?.quantity ?? 0;
}

export function setMaterialOpeningRejection(
  document: PrototypeDocument,
  month: string,
  warehouseId: MaterialWarehouseId,
  materialId: string,
  quantity: number,
  today: Date,
): MaterialOpeningRejection | null {
  if (!isMaterialWarehouseId(warehouseId)) {
    return 'warehouse';
  }
  if (!isMonthKey(month) || !planMonthOpen(month, today)) {
    return month < '2000-01' || !isMonthKey(month) ? 'month' : 'closed';
  }
  const material = materialById(document, materialId);
  if (!material) {
    return 'material';
  }
  if (material.deletedAt !== null) {
    return 'locked';
  }
  return isQuantityThousandths(quantity, true) ? null : 'quantity';
}

export function setMaterialOpening(
  document: PrototypeDocument,
  month: string,
  warehouseId: MaterialWarehouseId,
  materialId: string,
  quantity: number,
  today: Date,
): PrototypeDocument {
  if (setMaterialOpeningRejection(document, month, warehouseId, materialId, quantity, today)) {
    return document;
  }

  const openings = materialOpeningsList(document);
  const existing = openingFor(document, month, warehouseId);
  if (!existing) {
    const created: MaterialOpening = {
      id: `material-opening:${month}:${warehouseId}`,
      month,
      warehouseId,
      lines: [
        {
          id: `material-opening-line:${month}:${warehouseId}:${materialId}`,
          materialId,
          quantity,
        },
      ],
    };
    return { ...document, materialOpenings: [...openings, created] };
  }

  const line = existing.lines.find((item) => item.materialId === materialId);
  if (line) {
    if (line.quantity === quantity) {
      return document;
    }
    return {
      ...document,
      materialOpenings: openings.map((item) =>
        item.id !== existing.id
          ? item
          : {
              ...item,
              lines: item.lines.map((entry) => (entry.materialId === materialId ? { ...entry, quantity } : entry)),
            },
      ),
    };
  }

  const nextLine: MaterialOpeningLine = {
    id: `material-opening-line:${month}:${warehouseId}:${materialId}`,
    materialId,
    quantity,
  };
  return {
    ...document,
    materialOpenings: openings.map((item) =>
      item.id !== existing.id ? item : { ...item, lines: [...item.lines, nextLine] },
    ),
  };
}

function moneyOf(priceWithVat: number, quantity: number, vatPercent: number): MaterialMoney {
  const withVat = ratioRound(priceWithVat * quantity, QUANTITY_SCALE) ?? 0;
  return { withVat, exVat: costExVat(withVat, vatPercent) ?? 0 };
}

function priceOf(priceWithVat: number, vatPercent: number): MaterialMoney {
  return { withVat: priceWithVat, exVat: costExVat(priceWithVat, vatPercent) ?? 0 };
}

function addMoney(left: MaterialMoney, right: MaterialMoney): MaterialMoney {
  return { withVat: left.withVat + right.withVat, exVat: left.exVat + right.exVat };
}

function productionPieces(document: PrototypeDocument, month: string, mode: 'plan' | 'fact'): Map<string, number> {
  const pieces = new Map<string, number>();
  if (mode === 'plan') {
    for (const line of productionPlanForMonth(document, month).lines) {
      pieces.set(line.productId, line.volumePieces);
    }
    return pieces;
  }

  for (const entry of document.productionEntries ?? []) {
    if (!entry.occurredOn.startsWith(`${month}-`)) {
      continue;
    }
    for (const line of entry.lines) {
      pieces.set(line.productId, (pieces.get(line.productId) ?? 0) + line.pieces);
    }
  }
  return pieces;
}

function normedQuantity(
  document: PrototypeDocument,
  warehouseId: MaterialWarehouseId,
  materialId: string,
  piecesByProduct: ReadonlyMap<string, number>,
): number {
  let quantity = 0;
  for (const norm of liveNorms(document, warehouseId, materialId)) {
    quantity += norm.quantityPerPiece * (piecesByProduct.get(norm.productId) ?? 0);
  }
  return quantity;
}

function receiptFact(
  document: PrototypeDocument,
  month: string,
  warehouseId: MaterialWarehouseId,
  materialId: string,
  vatPercent: number,
): { quantity: number; cost: MaterialMoney } {
  let quantity = 0;
  let cost = ZERO_MONEY;
  for (const receipt of materialReceiptsList(document)) {
    if (receipt.warehouseId !== warehouseId || !receipt.occurredOn.startsWith(`${month}-`)) {
      continue;
    }
    for (const line of receipt.lines) {
      if (line.materialId !== materialId) {
        continue;
      }
      quantity += line.quantity;
      cost = addMoney(cost, moneyOf(line.priceWithVat, line.quantity, vatPercent));
    }
  }
  return { quantity, cost };
}

function issueQuantity(
  document: PrototypeDocument,
  month: string,
  warehouseId: MaterialWarehouseId,
  materialId: string,
): number {
  let quantity = 0;
  for (const issue of materialIssuesList(document)) {
    if (issue.warehouseId !== warehouseId || !issue.occurredOn.startsWith(`${month}-`)) {
      continue;
    }
    for (const line of issue.lines) {
      if (line.materialId === materialId) {
        quantity += line.quantity;
      }
    }
  }
  return quantity;
}

function consumptionQuantity(
  document: PrototypeDocument,
  month: string,
  warehouseId: MaterialWarehouseId,
  materialId: string,
  mode: 'plan' | 'fact',
  piecesByProduct: ReadonlyMap<string, number>,
  planConsumption: number,
): number {
  if (materialConsumptionIsNormed(document, warehouseId, materialId)) {
    return normedQuantity(document, warehouseId, materialId, piecesByProduct);
  }
  if (mode === 'plan') {
    return planConsumption;
  }
  return issueQuantity(document, month, warehouseId, materialId);
}

/**
 * Остаток на конец склада.
 * `DSM Meat!DP8 = L8 + BF8 − Q8` без возвратов и списаний.
 */
export function closingMaterialQuantity(opening: number, receipt: number, consumption: number): number {
  return opening + receipt - consumption;
}

/**
 * План остатка на начало — конец прошлого месяца этого же склада.
 * Другой склад в перенос не входит.
 */
export function bookOpeningQuantity(
  document: PrototypeDocument,
  month: string,
  warehouseId: MaterialWarehouseId,
  materialId: string,
): number {
  if (!isMonthKey(month) || month <= '2000-01') {
    return 0;
  }
  const previous = shiftMonth(month, -1);
  if (!isMonthKey(previous) || previous < '2000-01') {
    return 0;
  }
  const material = materialById(document, materialId);
  const vatPercent = material?.vatPercent ?? 0;
  const opening = openingQuantityFor(document, previous, warehouseId, materialId);
  const receipt = receiptFact(document, previous, warehouseId, materialId, vatPercent).quantity;
  const planLine = planLineFor(document, previous, warehouseId, materialId);
  const pieces = materialConsumptionIsNormed(document, warehouseId, materialId)
    ? productionPieces(document, previous, 'fact')
    : new Map<string, number>();
  const consumption = consumptionQuantity(
    document,
    previous,
    warehouseId,
    materialId,
    'fact',
    pieces,
    planLine?.consumptionQuantity ?? 0,
  );
  return closingMaterialQuantity(opening, receipt, consumption);
}

function movementMetrics(closing: number, minQuantity: number, maxQuantity: number) {
  const belowMinQuantity = closing < minQuantity ? closing - minQuantity : 0;
  const aboveMaxQuantity = closing > maxQuantity ? closing - maxQuantity : 0;
  const recommendedReceiptQuantity = belowMinQuantity === 0 ? 0 : maxQuantity - closing;
  return { belowMinQuantity, aboveMaxQuantity, recommendedReceiptQuantity };
}

function movementRow(
  document: PrototypeDocument,
  month: string,
  warehouseId: MaterialWarehouseId,
  material: Material,
  planPieces: ReadonlyMap<string, number>,
  factPieces: ReadonlyMap<string, number>,
): MaterialMovementRow {
  const planLine = planLineFor(document, month, warehouseId, material.id);
  const priceWithVat = planLine?.priceWithVat ?? 0;
  const normed = materialConsumptionIsNormed(document, warehouseId, material.id);
  const openingQuantity = openingQuantityFor(document, month, warehouseId, material.id);
  const bookOpening = bookOpeningQuantity(document, month, warehouseId, material.id);
  const receipt = receiptFact(document, month, warehouseId, material.id, material.vatPercent);
  const planReceiptQuantity = planLine?.receiptQuantity ?? 0;
  const planConsumptionQuantity = consumptionQuantity(
    document,
    month,
    warehouseId,
    material.id,
    'plan',
    planPieces,
    planLine?.consumptionQuantity ?? 0,
  );
  const factConsumptionQuantity = consumptionQuantity(
    document,
    month,
    warehouseId,
    material.id,
    'fact',
    factPieces,
    planLine?.consumptionQuantity ?? 0,
  );
  const closingQuantity = closingMaterialQuantity(openingQuantity, receipt.quantity, factConsumptionQuantity);
  const valuation =
    receipt.quantity === 0 ? priceWithVat : (ratioRound(receipt.cost.withVat * QUANTITY_SCALE, receipt.quantity) ?? 0);
  const minQuantity = planLine?.minQuantity ?? 0;
  const maxQuantity = planLine?.maxQuantity ?? 0;
  const metrics = movementMetrics(closingQuantity, minQuantity, maxQuantity);
  const factReceiptPrice =
    receipt.quantity === 0
      ? null
      : priceOf(ratioRound(receipt.cost.withVat * QUANTITY_SCALE, receipt.quantity) ?? 0, material.vatPercent);

  return {
    materialId: material.id,
    name: material.name,
    unit: material.unit,
    vatPercent: material.vatPercent,
    deleted: material.deletedAt !== null,
    normed,
    bookOpeningQuantity: bookOpening,
    openingQuantity,
    openingDeviationQuantity: openingQuantity - bookOpening,
    openingCost: moneyOf(priceWithVat, openingQuantity, material.vatPercent),
    planPrice: priceOf(priceWithVat, material.vatPercent),
    planReceiptQuantity,
    factReceiptQuantity: receipt.quantity,
    receiptDeviationQuantity: receipt.quantity - planReceiptQuantity,
    planReceiptCost: moneyOf(priceWithVat, planReceiptQuantity, material.vatPercent),
    factReceiptCost: receipt.cost,
    factReceiptPrice,
    planConsumptionQuantity,
    factConsumptionQuantity,
    consumptionDeviationQuantity: factConsumptionQuantity - planConsumptionQuantity,
    planConsumptionCost: moneyOf(priceWithVat, planConsumptionQuantity, material.vatPercent),
    factConsumptionCost: moneyOf(valuation, factConsumptionQuantity, material.vatPercent),
    consumptionPrice: priceOf(valuation, material.vatPercent),
    closingQuantity,
    minQuantity,
    maxQuantity,
    ...metrics,
    closingCost: moneyOf(valuation, closingQuantity, material.vatPercent),
  };
}

function referencedMaterialIds(
  document: PrototypeDocument,
  month: string,
  warehouseId: MaterialWarehouseId,
): Set<string> {
  const ids = new Set<string>();
  for (const line of planFor(document, month, warehouseId)?.lines ?? []) {
    ids.add(line.materialId);
  }
  for (const line of openingFor(document, month, warehouseId)?.lines ?? []) {
    ids.add(line.materialId);
  }
  for (const receipt of materialReceiptsList(document)) {
    if (receipt.warehouseId !== warehouseId || !receipt.occurredOn.startsWith(`${month}-`)) {
      continue;
    }
    for (const line of receipt.lines) {
      ids.add(line.materialId);
    }
  }
  for (const issue of materialIssuesList(document)) {
    if (issue.warehouseId !== warehouseId || !issue.occurredOn.startsWith(`${month}-`)) {
      continue;
    }
    for (const line of issue.lines) {
      ids.add(line.materialId);
    }
  }
  for (const norm of materialNormsList(document)) {
    if (norm.deletedAt === null && norm.warehouseId === warehouseId) {
      ids.add(norm.materialId);
    }
  }
  return ids;
}

function gridMaterials(
  document: PrototypeDocument,
  groupId: MaterialGroupId,
  warehouseId: MaterialWarehouseId,
  month: string,
): Material[] {
  const materials = materialsList(document).filter((item) => item.groupId === groupId);
  const active = materials.filter((item) => item.deletedAt === null);
  const activeIds = new Set(active.map((item) => item.id));
  const referenced = referencedMaterialIds(document, month, warehouseId);
  const archived = materials.filter((item) => {
    if (item.deletedAt === null || activeIds.has(item.id)) {
      return false;
    }
    if (referenced.has(item.id)) {
      return true;
    }
    return bookOpeningQuantity(document, month, warehouseId, item.id) !== 0;
  });
  return [...active, ...archived];
}

function emptyTotals(): MaterialMovementTotals {
  return {
    unit: null,
    bookOpeningQuantity: null,
    openingQuantity: null,
    openingDeviationQuantity: null,
    openingCost: ZERO_MONEY,
    planReceiptQuantity: null,
    factReceiptQuantity: null,
    receiptDeviationQuantity: null,
    planReceiptCost: ZERO_MONEY,
    factReceiptCost: ZERO_MONEY,
    planConsumptionQuantity: null,
    factConsumptionQuantity: null,
    consumptionDeviationQuantity: null,
    planConsumptionCost: ZERO_MONEY,
    factConsumptionCost: ZERO_MONEY,
    closingQuantity: null,
    minQuantity: null,
    maxQuantity: null,
    belowMinQuantity: null,
    aboveMaxQuantity: null,
    recommendedReceiptQuantity: null,
    closingCost: ZERO_MONEY,
  };
}

function sumRows(rows: readonly MaterialMovementRow[]): MaterialMovementTotals {
  const unit = rows.length > 0 && rows.every((row) => row.unit === rows[0]?.unit) ? rows[0].unit : null;
  const money = rows.reduce(
    (total, row) => ({
      openingCost: addMoney(total.openingCost, row.openingCost),
      planReceiptCost: addMoney(total.planReceiptCost, row.planReceiptCost),
      factReceiptCost: addMoney(total.factReceiptCost, row.factReceiptCost),
      planConsumptionCost: addMoney(total.planConsumptionCost, row.planConsumptionCost),
      factConsumptionCost: addMoney(total.factConsumptionCost, row.factConsumptionCost),
      closingCost: addMoney(total.closingCost, row.closingCost),
    }),
    {
      openingCost: ZERO_MONEY,
      planReceiptCost: ZERO_MONEY,
      factReceiptCost: ZERO_MONEY,
      planConsumptionCost: ZERO_MONEY,
      factConsumptionCost: ZERO_MONEY,
      closingCost: ZERO_MONEY,
    },
  );

  if (!unit) {
    return { ...emptyTotals(), ...money };
  }

  const sum = (pick: (row: MaterialMovementRow) => number) => rows.reduce((total, row) => total + pick(row), 0);
  const below = sum((row) => row.belowMinQuantity);
  const above = sum((row) => row.aboveMaxQuantity);
  return {
    unit,
    bookOpeningQuantity: sum((row) => row.bookOpeningQuantity),
    openingQuantity: sum((row) => row.openingQuantity),
    openingDeviationQuantity: sum((row) => row.openingDeviationQuantity),
    planReceiptQuantity: sum((row) => row.planReceiptQuantity),
    factReceiptQuantity: sum((row) => row.factReceiptQuantity),
    receiptDeviationQuantity: sum((row) => row.receiptDeviationQuantity),
    planConsumptionQuantity: sum((row) => row.planConsumptionQuantity),
    factConsumptionQuantity: sum((row) => row.factConsumptionQuantity),
    consumptionDeviationQuantity: sum((row) => row.consumptionDeviationQuantity),
    closingQuantity: sum((row) => row.closingQuantity),
    minQuantity: sum((row) => row.minQuantity),
    maxQuantity: sum((row) => row.maxQuantity),
    belowMinQuantity: below !== 0 ? below : 0,
    aboveMaxQuantity: below !== 0 ? 0 : above,
    recommendedReceiptQuantity: sum((row) => row.recommendedReceiptQuantity),
    ...money,
  };
}

/** Движение четырёх групп. Склад 1 и склад 2 не складываются. */
export function materialMovementMonth(document: PrototypeDocument, month: string): MaterialMovementMonth {
  const planPieces = productionPieces(document, month, 'plan');
  const factPieces = productionPieces(document, month, 'fact');

  return {
    month,
    groups: MATERIAL_GROUPS.map((group) => ({
      groupId: group.id,
      name: group.name,
      warehouses: MATERIAL_WAREHOUSES.map((warehouse) => {
        const rows = gridMaterials(document, group.id, warehouse.id, month).map((material) =>
          movementRow(document, month, warehouse.id, material, planPieces, factPieces),
        );
        return {
          warehouseId: warehouse.id,
          name: warehouse.name,
          productionName: warehouse.productionName,
          rows,
          totals: rows.length === 0 ? emptyTotals() : sumRows(rows),
        };
      }),
    })),
  };
}

export function materialNormQuantity(
  document: PrototypeDocument,
  warehouseId: MaterialWarehouseId,
  materialId: string,
  productId: string,
): number | null {
  const norm = materialNormsList(document).find(
    (item) =>
      item.deletedAt === null &&
      item.warehouseId === warehouseId &&
      item.materialId === materialId &&
      item.productId === productId,
  );
  return norm ? norm.quantityPerPiece : null;
}

function occurredOnOpen(occurredOn: string, today: Date): boolean {
  return isOccurredOn(occurredOn) && occurredOn >= '2000-01-01' && occurredOn <= maxProductionEntryOccurredOn(today);
}

export interface MaterialReceiptDraft {
  id: string;
  warehouseId: string;
  supplierName: string;
  occurredOn: string;
  lines: MaterialReceiptLine[];
}

export interface MaterialIssueDraft {
  id: string;
  warehouseId: string;
  occurredOn: string;
  lines: MaterialIssueLine[];
}

export function materialReceiptRejection(
  document: PrototypeDocument,
  draft: MaterialReceiptDraft,
  today: Date,
): MaterialDocumentRejection | null {
  if (!isMaterialWarehouseId(draft.warehouseId)) {
    return 'warehouse';
  }
  if (!occurredOnOpen(draft.occurredOn, today)) {
    return 'date';
  }
  const supplierName = draft.supplierName.trim();
  if (supplierName.length === 0 || supplierName.length > 200) {
    return 'supplier';
  }
  const lines = draft.lines.filter((line) => line.quantity !== 0);
  if (lines.length === 0) {
    return 'empty';
  }
  for (const line of lines) {
    const material = materialById(document, line.materialId);
    if (!material) {
      return 'material';
    }
    if (material.deletedAt !== null) {
      return 'locked';
    }
    if (!isQuantityThousandths(line.quantity, false) || line.quantity <= 0) {
      return 'quantity';
    }
    if (!isPrice(line.priceWithVat)) {
      return 'price';
    }
  }
  return null;
}

export function saveMaterialReceipt(
  document: PrototypeDocument,
  draft: MaterialReceiptDraft,
  today: Date,
): PrototypeDocument {
  if (materialReceiptRejection(document, draft, today) || !isMaterialWarehouseId(draft.warehouseId)) {
    return document;
  }

  const next: MaterialReceipt = {
    id: draft.id,
    warehouseId: draft.warehouseId,
    supplierName: draft.supplierName.trim(),
    occurredOn: draft.occurredOn,
    lines: draft.lines
      .filter((line) => line.quantity > 0)
      .map((line) => ({
        id: line.id,
        materialId: line.materialId,
        quantity: line.quantity,
        priceWithVat: line.priceWithVat,
      })),
  };
  const receipts = materialReceiptsList(document);
  const exists = receipts.some((item) => item.id === next.id);
  return {
    ...document,
    materialReceipts: exists ? receipts.map((item) => (item.id === next.id ? next : item)) : [...receipts, next],
  };
}

export function deleteMaterialReceipt(document: PrototypeDocument, id: string): PrototypeDocument {
  const receipts = materialReceiptsList(document);
  if (!receipts.some((item) => item.id === id)) {
    return document;
  }
  return {
    ...document,
    materialReceipts: receipts.filter((item) => item.id !== id),
  };
}

export function materialReceiptById(document: PrototypeDocument, id: string): MaterialReceipt | null {
  return materialReceiptsList(document).find((item) => item.id === id) ?? null;
}

export function materialReceiptsInMonth(
  document: PrototypeDocument,
  month: string,
  warehouseId?: MaterialWarehouseId,
): MaterialReceipt[] {
  return materialReceiptsList(document)
    .filter((item) => item.occurredOn.startsWith(`${month}-`) && (!warehouseId || item.warehouseId === warehouseId))
    .sort(
      (left, right) =>
        right.occurredOn.localeCompare(left.occurredOn) || left.supplierName.localeCompare(right.supplierName, 'ru'),
    );
}

export function materialIssueRejection(
  document: PrototypeDocument,
  draft: MaterialIssueDraft,
  today: Date,
): MaterialDocumentRejection | null {
  if (!isMaterialWarehouseId(draft.warehouseId)) {
    return 'warehouse';
  }
  if (!occurredOnOpen(draft.occurredOn, today)) {
    return 'date';
  }
  const lines = draft.lines.filter((line) => line.quantity !== 0);
  if (lines.length === 0) {
    return 'empty';
  }
  for (const line of lines) {
    const material = materialById(document, line.materialId);
    if (!material) {
      return 'material';
    }
    if (material.deletedAt !== null) {
      return 'locked';
    }
    if (materialConsumptionIsNormed(document, draft.warehouseId, line.materialId)) {
      return 'normed';
    }
    if (!isQuantityThousandths(line.quantity, false) || line.quantity <= 0) {
      return 'quantity';
    }
  }
  return null;
}

export function saveMaterialIssue(
  document: PrototypeDocument,
  draft: MaterialIssueDraft,
  today: Date,
): PrototypeDocument {
  if (materialIssueRejection(document, draft, today) || !isMaterialWarehouseId(draft.warehouseId)) {
    return document;
  }

  const next: MaterialIssue = {
    id: draft.id,
    warehouseId: draft.warehouseId,
    occurredOn: draft.occurredOn,
    lines: draft.lines
      .filter((line) => line.quantity > 0)
      .map((line) => ({
        id: line.id,
        materialId: line.materialId,
        quantity: line.quantity,
      })),
  };
  const issues = materialIssuesList(document);
  const exists = issues.some((item) => item.id === next.id);
  return {
    ...document,
    materialIssues: exists ? issues.map((item) => (item.id === next.id ? next : item)) : [...issues, next],
  };
}

export function deleteMaterialIssue(document: PrototypeDocument, id: string): PrototypeDocument {
  const issues = materialIssuesList(document);
  if (!issues.some((item) => item.id === id)) {
    return document;
  }
  return {
    ...document,
    materialIssues: issues.filter((item) => item.id !== id),
  };
}

export function materialIssueById(document: PrototypeDocument, id: string): MaterialIssue | null {
  return materialIssuesList(document).find((item) => item.id === id) ?? null;
}

export function materialIssuesInMonth(
  document: PrototypeDocument,
  month: string,
  warehouseId?: MaterialWarehouseId,
): MaterialIssue[] {
  return materialIssuesList(document)
    .filter((item) => item.occurredOn.startsWith(`${month}-`) && (!warehouseId || item.warehouseId === warehouseId))
    .sort((left, right) => right.occurredOn.localeCompare(left.occurredOn));
}

export function materialIssueIgnoredByNorm(document: PrototypeDocument, issue: MaterialIssue): boolean {
  return issue.lines.some((line) => materialConsumptionIsNormed(document, issue.warehouseId, line.materialId));
}
