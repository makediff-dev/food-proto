import {
  isDeletionMark,
  isMonthKey,
  isOccurredOn,
  isTransportHireKind,
  type PrototypeDocument,
  TRANSPORT_HIRE_KINDS,
  type TransportCarrier,
  type TransportHireKind,
  type TransportHireMonthPlan,
  type TransportHireMonthPlanLine,
  type TransportOwnMonthPlan,
  type TransportVehicle,
} from '@/domain/document';
import { ratioRound } from '@/domain/money';
import { isQuantityThousandths, QUANTITY_SCALE } from '@/domain/quantity';
import { daysInMonth } from '@/domain/sales-plan';

const MAX_MONEY = 100_000_000_000;
const MAX_Q = 1_000_000_000_000;

export type TransportFieldRejection =
  | 'missing'
  | 'month'
  | 'day'
  | 'name'
  | 'kind'
  | 'quantity'
  | 'price'
  | 'amount'
  | 'odometer'
  | 'vat'
  | 'archived';

/** Ставка НДС нового контрагента и записей без ставки. Как у прочих статей. */
export const DEFAULT_TRANSPORT_HIRE_VAT_PERCENT = 20;

/** Ставка НДС топлива нового автомобиля и записей без ставки. */
export const DEFAULT_TRANSPORT_FUEL_VAT_PERCENT = 20;

export function isTransportVatPercent(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 100;
}

export const TRANSPORT_HIRE_LABELS: Record<TransportHireKind, string> = {
  finishedDelivery: 'Доставка готовой продукции наёмный',
  materialDelivery: 'Доставка сырья и материалов',
};

export interface TransportHireCarrierView {
  carrierId: string;
  name: string;
  deleted: boolean;
  /** Ставка НДС контрагента, целое 0–100. */
  vatPercent: number;
  planQuantityThousandths: number;
  planUnitPriceExVat: number;
  planAmountExVat: number;
  factQuantityThousandths: number;
  /** Сумма / количество; без факта количества — 0. */
  factUnitPriceExVat: number;
  factAmountExVat: number;
  varianceQuantityThousandths: number;
  /** Факт − план; без факта количества — null. */
  varianceUnitPriceExVat: number | null;
  varianceAmountExVat: number;
}

export interface TransportHireBlockView {
  kind: TransportHireKind;
  name: string;
  quantityUnit: 'шт' | 'кг';
  carriers: TransportHireCarrierView[];
  planQuantityThousandths: number;
  planUnitPriceExVat: number;
  planAmountExVat: number;
  factQuantityThousandths: number;
  factUnitPriceExVat: number;
  factAmountExVat: number;
  varianceQuantityThousandths: number;
  varianceUnitPriceExVat: number | null;
  varianceAmountExVat: number;
}

export interface TransportOwnVehicleView {
  vehicleId: string;
  name: string;
  deleted: boolean;
  litersPer100KmThousandths: number;
  planFuelPriceExVat: number;
  /** Ставка НДС топлива, целое 0–100. Одна на все месяцы. */
  fuelVatPercent: number;
  planKmThousandths: number;
  /** Цена за 1 км = норма/100 × цена литра. `Transport!E57`. */
  planCostPerKmExVat: number;
  planAmountExVat: number;
  factKmThousandths: number;
  factCostPerKmExVat: number;
  factAmountExVat: number;
  varianceAmountExVat: number;
}

export interface TransportMonthView {
  month: string;
  days: number;
  hire: TransportHireBlockView[];
  /** Сумма блоков наёмного — строка 7.1. */
  hireTotalPlanExVat: number;
  hireTotalFactExVat: number;
  own: TransportOwnVehicleView[];
  /** Топливо своего транспорта — строка 7.2. */
  ownTotalPlanExVat: number;
  ownTotalFactExVat: number;
}

function isMoney(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= MAX_MONEY;
}

function isQty(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= MAX_Q && isQuantityThousandths(value, false);
}

export function activeTransportCarriers(document: PrototypeDocument): TransportCarrier[] {
  return document.transportCarriers.filter((item) => item.deletedAt === null);
}

export function activeTransportVehicles(document: PrototypeDocument): TransportVehicle[] {
  return document.transportVehicles.filter((item) => item.deletedAt === null);
}

export function transportHirePlan(document: PrototypeDocument, month: string): TransportHireMonthPlan | null {
  return document.transportHireMonthPlans.find((item) => item.month === month) ?? null;
}

export function transportOwnPlan(document: PrototypeDocument, month: string): TransportOwnMonthPlan | null {
  return document.transportOwnMonthPlans.find((item) => item.month === month) ?? null;
}

/** Цена за км плана: норма л/100 км × цена литра / 100. */
export function ownPlanCostPerKmExVat(litersPer100KmThousandths: number, fuelPriceExVat: number): number {
  return ratioRound(litersPer100KmThousandths * fuelPriceExVat, 100 * QUANTITY_SCALE) ?? 0;
}

export function ownPlanAmountExVat(
  planKmThousandths: number,
  litersPer100KmThousandths: number,
  fuelPriceExVat: number,
): number {
  const perKm = ownPlanCostPerKmExVat(litersPer100KmThousandths, fuelPriceExVat);
  return ratioRound(planKmThousandths * perKm, QUANTITY_SCALE) ?? 0;
}

/** Сумма факта дня: норма/100 × км × цена литра. `Transport!L57`. */
export function ownDayFuelAmountExVat(
  kmThousandths: number,
  litersPer100KmThousandths: number,
  fuelPriceExVat: number,
): number {
  return (
    ratioRound(litersPer100KmThousandths * kmThousandths * fuelPriceExVat, 100 * QUANTITY_SCALE * QUANTITY_SCALE) ?? 0
  );
}

function previousDay(occurredOn: string): string | null {
  const date = new Date(`${occurredOn}T12:00:00`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  date.setDate(date.getDate() - 1);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Пробег дня = одометр утра − одометр утра предыдущего дня.
 * Нет предыдущего или ноль — 0. `Transport!J57 = M63 - J63`.
 */
export function ownDayKmThousandths(document: PrototypeDocument, occurredOn: string, vehicleId: string): number {
  const day = document.transportOwnDayFacts.find((item) => item.occurredOn === occurredOn);
  const reading = day?.vehicles.find((item) => item.vehicleId === vehicleId)?.odometerThousandths ?? 0;
  if (reading === 0) {
    return 0;
  }
  const prev = previousDay(occurredOn);
  if (!prev) {
    return 0;
  }
  const prevDay = document.transportOwnDayFacts.find((item) => item.occurredOn === prev);
  const prevReading = prevDay?.vehicles.find((item) => item.vehicleId === vehicleId)?.odometerThousandths ?? 0;
  if (prevReading === 0) {
    return 0;
  }
  const delta = reading - prevReading;
  return delta > 0 ? delta : 0;
}

function hirePlanLine(plan: TransportHireMonthPlan | null, carrierId: string): TransportHireMonthPlanLine | null {
  return plan?.lines.find((line) => line.carrierId === carrierId) ?? null;
}

function hireAmount(quantityThousandths: number, unitPriceExVat: number): number {
  return ratioRound(quantityThousandths * unitPriceExVat, QUANTITY_SCALE) ?? 0;
}

function unitPrice(amountExVat: number, quantityThousandths: number): number {
  if (quantityThousandths === 0) {
    return 0;
  }
  return ratioRound(amountExVat * QUANTITY_SCALE, quantityThousandths) ?? 0;
}

export function transportMonthView(document: PrototypeDocument, month: string): TransportMonthView {
  const days = daysInMonth(month);
  const hirePlan = transportHirePlan(document, month);
  const ownPlan = transportOwnPlan(document, month);
  const hireDays = document.transportHireDayFacts.filter((item) => item.occurredOn.startsWith(`${month}-`));
  const ownDays = document.transportOwnDayFacts.filter((item) => item.occurredOn.startsWith(`${month}-`));

  const hire: TransportHireBlockView[] = TRANSPORT_HIRE_KINDS.map((kind) => {
    const carriers = document.transportCarriers.filter(
      (item) => item.kind === kind && (item.deletedAt === null || hirePlanLine(hirePlan, item.id) !== null),
    );
    const views: TransportHireCarrierView[] = carriers.map((carrier) => {
      const planLine = hirePlanLine(hirePlan, carrier.id);
      const planQty = planLine?.quantityThousandths ?? 0;
      const planPrice = planLine?.unitPriceExVat ?? 0;
      const planAmount = hireAmount(planQty, planPrice);
      let factQty = 0;
      let factAmount = 0;
      for (const day of hireDays) {
        for (const line of day.lines) {
          if (line.carrierId === carrier.id) {
            factQty += line.quantityThousandths;
            factAmount += line.amountExVat;
          }
        }
      }
      const factPrice = unitPrice(factAmount, factQty);
      return {
        carrierId: carrier.id,
        name: carrier.name,
        deleted: carrier.deletedAt !== null,
        vatPercent: isTransportVatPercent(carrier.vatPercent) ? carrier.vatPercent : DEFAULT_TRANSPORT_HIRE_VAT_PERCENT,
        planQuantityThousandths: planQty,
        planUnitPriceExVat: planPrice,
        planAmountExVat: planAmount,
        factQuantityThousandths: factQty,
        factUnitPriceExVat: factPrice,
        factAmountExVat: factAmount,
        varianceQuantityThousandths: factQty - planQty,
        varianceUnitPriceExVat: factQty > 0 ? factPrice - planPrice : null,
        varianceAmountExVat: factAmount - planAmount,
      };
    });
    const planQty = views.reduce((sum, item) => sum + item.planQuantityThousandths, 0);
    const planAmount = views.reduce((sum, item) => sum + item.planAmountExVat, 0);
    const factQty = views.reduce((sum, item) => sum + item.factQuantityThousandths, 0);
    const factAmount = views.reduce((sum, item) => sum + item.factAmountExVat, 0);
    const planPrice = unitPrice(planAmount, planQty);
    const factPrice = unitPrice(factAmount, factQty);
    return {
      kind,
      name: TRANSPORT_HIRE_LABELS[kind],
      quantityUnit: kind === 'materialDelivery' ? 'кг' : 'шт',
      carriers: views,
      planQuantityThousandths: planQty,
      planUnitPriceExVat: planPrice,
      planAmountExVat: planAmount,
      factQuantityThousandths: factQty,
      factUnitPriceExVat: factPrice,
      factAmountExVat: factAmount,
      varianceQuantityThousandths: factQty - planQty,
      varianceUnitPriceExVat: factQty > 0 ? factPrice - planPrice : null,
      varianceAmountExVat: factAmount - planAmount,
    };
  });

  const ownVehicles = document.transportVehicles.filter(
    (item) =>
      item.deletedAt === null ||
      ownPlan?.vehicles.some((row) => row.vehicleId === item.id) === true ||
      ownDays.some((day) => day.vehicles.some((row) => row.vehicleId === item.id)),
  );
  const own: TransportOwnVehicleView[] = ownVehicles.map((vehicle) => {
    const planRow = ownPlan?.vehicles.find((item) => item.vehicleId === vehicle.id);
    const liters = planRow?.litersPer100KmThousandths ?? 0;
    const fuelPrice = planRow?.fuelPriceExVat ?? 0;
    const planKm = planRow?.planKmThousandths ?? 0;
    const planPerKm = ownPlanCostPerKmExVat(liters, fuelPrice);
    const planAmount = ownPlanAmountExVat(planKm, liters, fuelPrice);

    let factKm = 0;
    let factAmount = 0;
    for (const day of ownDays) {
      const km = ownDayKmThousandths(document, day.occurredOn, vehicle.id);
      const fuel = day.vehicles.find((item) => item.vehicleId === vehicle.id)?.fuelPriceExVat ?? 0;
      factKm += km;
      factAmount += ownDayFuelAmountExVat(km, liters, fuel);
    }

    return {
      vehicleId: vehicle.id,
      name: vehicle.name,
      deleted: vehicle.deletedAt !== null,
      litersPer100KmThousandths: liters,
      planFuelPriceExVat: fuelPrice,
      fuelVatPercent: isTransportVatPercent(vehicle.fuelVatPercent)
        ? vehicle.fuelVatPercent
        : DEFAULT_TRANSPORT_FUEL_VAT_PERCENT,
      planKmThousandths: planKm,
      planCostPerKmExVat: planPerKm,
      planAmountExVat: planAmount,
      factKmThousandths: factKm,
      factCostPerKmExVat: unitPrice(factAmount, factKm),
      factAmountExVat: factAmount,
      varianceAmountExVat: factAmount - planAmount,
    };
  });

  return {
    month,
    days,
    hire,
    hireTotalPlanExVat: hire.reduce((sum, item) => sum + item.planAmountExVat, 0),
    hireTotalFactExVat: hire.reduce((sum, item) => sum + item.factAmountExVat, 0),
    own,
    ownTotalPlanExVat: own.reduce((sum, item) => sum + item.planAmountExVat, 0),
    ownTotalFactExVat: own.reduce((sum, item) => sum + item.factAmountExVat, 0),
  };
}

export function addTransportCarrierRejection(
  document: PrototypeDocument,
  kind: TransportHireKind,
  name: string,
): TransportFieldRejection | null {
  if (!isTransportHireKind(kind)) {
    return 'kind';
  }
  const trimmed = name.trim();
  if (!trimmed) {
    return 'name';
  }
  const taken = activeTransportCarriers(document).some((item) => item.kind === kind && item.name === trimmed);
  if (taken) {
    return 'name';
  }
  return null;
}

export function addTransportCarrier(document: PrototypeDocument, carrier: TransportCarrier): PrototypeDocument {
  if (addTransportCarrierRejection(document, carrier.kind, carrier.name)) {
    return document;
  }
  const vatPercent = isTransportVatPercent(carrier.vatPercent)
    ? carrier.vatPercent
    : DEFAULT_TRANSPORT_HIRE_VAT_PERCENT;
  return {
    ...document,
    transportCarriers: [
      ...document.transportCarriers,
      { ...carrier, name: carrier.name.trim(), vatPercent, deletedAt: null },
    ],
  };
}

export function setTransportCarrierVatRejection(
  document: PrototypeDocument,
  carrierId: string,
  vatPercent: number,
): TransportFieldRejection | null {
  const carrier = document.transportCarriers.find((item) => item.id === carrierId);
  if (!carrier) {
    return 'missing';
  }
  if (carrier.deletedAt !== null) {
    return 'archived';
  }
  if (!isTransportVatPercent(vatPercent)) {
    return 'vat';
  }
  return null;
}

/** Ставка НДС контрагента наёмного. Одна на все месяцы, как у статьи прочих расходов. */
export function setTransportCarrierVat(
  document: PrototypeDocument,
  carrierId: string,
  vatPercent: number,
): PrototypeDocument {
  if (setTransportCarrierVatRejection(document, carrierId, vatPercent)) {
    return document;
  }
  const carrier = document.transportCarriers.find((item) => item.id === carrierId);
  if (!carrier || carrier.vatPercent === vatPercent) {
    return document;
  }
  return {
    ...document,
    transportCarriers: document.transportCarriers.map((item) =>
      item.id === carrierId ? { ...item, vatPercent } : item,
    ),
  };
}

export function deleteTransportCarrier(
  document: PrototypeDocument,
  carrierId: string,
  deletedAt: string,
): PrototypeDocument {
  if (!isDeletionMark(deletedAt)) {
    return document;
  }
  return {
    ...document,
    transportCarriers: document.transportCarriers.map((item) =>
      item.id === carrierId && item.deletedAt === null ? { ...item, deletedAt } : item,
    ),
  };
}

export function renameTransportCarrierRejection(
  document: PrototypeDocument,
  carrierId: string,
  name: string,
): TransportFieldRejection | null {
  const carrier = document.transportCarriers.find((item) => item.id === carrierId);
  if (!carrier || carrier.deletedAt !== null) {
    return 'missing';
  }
  const trimmed = name.trim();
  if (!trimmed) {
    return 'name';
  }
  const taken = activeTransportCarriers(document).some(
    (item) => item.kind === carrier.kind && item.name === trimmed && item.id !== carrierId,
  );
  if (taken) {
    return 'name';
  }
  return null;
}

export function renameTransportCarrier(
  document: PrototypeDocument,
  carrierId: string,
  name: string,
): PrototypeDocument {
  if (renameTransportCarrierRejection(document, carrierId, name)) {
    return document;
  }
  const trimmed = name.trim();
  return {
    ...document,
    transportCarriers: document.transportCarriers.map((item) =>
      item.id === carrierId ? { ...item, name: trimmed } : item,
    ),
  };
}

export function restoreTransportCarrier(document: PrototypeDocument, carrierId: string): PrototypeDocument {
  const carrier = document.transportCarriers.find((item) => item.id === carrierId);
  if (!carrier || carrier.deletedAt === null) {
    return document;
  }
  if (addTransportCarrierRejection(document, carrier.kind, carrier.name)) {
    return document;
  }
  return {
    ...document,
    transportCarriers: document.transportCarriers.map((item) =>
      item.id === carrierId ? { ...item, deletedAt: null } : item,
    ),
  };
}

export function addTransportVehicleRejection(
  document: PrototypeDocument,
  name: string,
): TransportFieldRejection | null {
  const trimmed = name.trim();
  if (!trimmed) {
    return 'name';
  }
  const taken = activeTransportVehicles(document).some((item) => item.name === trimmed);
  if (taken) {
    return 'name';
  }
  return null;
}

export function addTransportVehicle(document: PrototypeDocument, vehicle: TransportVehicle): PrototypeDocument {
  if (addTransportVehicleRejection(document, vehicle.name)) {
    return document;
  }
  const fuelVatPercent = isTransportVatPercent(vehicle.fuelVatPercent)
    ? vehicle.fuelVatPercent
    : DEFAULT_TRANSPORT_FUEL_VAT_PERCENT;
  return {
    ...document,
    transportVehicles: [
      ...document.transportVehicles,
      { ...vehicle, name: vehicle.name.trim(), fuelVatPercent, deletedAt: null },
    ],
  };
}

export function setTransportVehicleFuelVatRejection(
  document: PrototypeDocument,
  vehicleId: string,
  fuelVatPercent: number,
): TransportFieldRejection | null {
  const vehicle = document.transportVehicles.find((item) => item.id === vehicleId);
  if (!vehicle) {
    return 'missing';
  }
  if (vehicle.deletedAt !== null) {
    return 'archived';
  }
  if (!isTransportVatPercent(fuelVatPercent)) {
    return 'vat';
  }
  return null;
}

/** Ставка НДС топлива автомобиля. Одна на все месяцы, как у контрагента наёмного. */
export function setTransportVehicleFuelVat(
  document: PrototypeDocument,
  vehicleId: string,
  fuelVatPercent: number,
): PrototypeDocument {
  if (setTransportVehicleFuelVatRejection(document, vehicleId, fuelVatPercent)) {
    return document;
  }
  const vehicle = document.transportVehicles.find((item) => item.id === vehicleId);
  if (!vehicle || vehicle.fuelVatPercent === fuelVatPercent) {
    return document;
  }
  return {
    ...document,
    transportVehicles: document.transportVehicles.map((item) =>
      item.id === vehicleId ? { ...item, fuelVatPercent } : item,
    ),
  };
}

export function deleteTransportVehicle(
  document: PrototypeDocument,
  vehicleId: string,
  deletedAt: string,
): PrototypeDocument {
  if (!isDeletionMark(deletedAt)) {
    return document;
  }
  return {
    ...document,
    transportVehicles: document.transportVehicles.map((item) =>
      item.id === vehicleId && item.deletedAt === null ? { ...item, deletedAt } : item,
    ),
  };
}

export function renameTransportVehicleRejection(
  document: PrototypeDocument,
  vehicleId: string,
  name: string,
): TransportFieldRejection | null {
  const vehicle = document.transportVehicles.find((item) => item.id === vehicleId);
  if (!vehicle || vehicle.deletedAt !== null) {
    return 'missing';
  }
  const trimmed = name.trim();
  if (!trimmed) {
    return 'name';
  }
  const taken = activeTransportVehicles(document).some((item) => item.name === trimmed && item.id !== vehicleId);
  if (taken) {
    return 'name';
  }
  return null;
}

export function renameTransportVehicle(
  document: PrototypeDocument,
  vehicleId: string,
  name: string,
): PrototypeDocument {
  if (renameTransportVehicleRejection(document, vehicleId, name)) {
    return document;
  }
  const trimmed = name.trim();
  return {
    ...document,
    transportVehicles: document.transportVehicles.map((item) =>
      item.id === vehicleId ? { ...item, name: trimmed } : item,
    ),
  };
}

export function restoreTransportVehicle(document: PrototypeDocument, vehicleId: string): PrototypeDocument {
  const vehicle = document.transportVehicles.find((item) => item.id === vehicleId);
  if (!vehicle || vehicle.deletedAt === null) {
    return document;
  }
  if (addTransportVehicleRejection(document, vehicle.name)) {
    return document;
  }
  return {
    ...document,
    transportVehicles: document.transportVehicles.map((item) =>
      item.id === vehicleId ? { ...item, deletedAt: null } : item,
    ),
  };
}

export function setTransportHirePlanRejection(
  document: PrototypeDocument,
  month: string,
  carrierId: string,
  quantityThousandths: number,
  unitPriceExVat: number,
): TransportFieldRejection | null {
  if (!isMonthKey(month)) {
    return 'month';
  }
  const carrier = document.transportCarriers.find((item) => item.id === carrierId);
  if (!carrier) {
    return 'missing';
  }
  if (carrier.deletedAt !== null) {
    return 'archived';
  }
  if (!isQty(quantityThousandths)) {
    return 'quantity';
  }
  if (!isMoney(unitPriceExVat)) {
    return 'price';
  }
  return null;
}

export function setTransportHirePlan(
  document: PrototypeDocument,
  month: string,
  carrierId: string,
  quantityThousandths: number,
  unitPriceExVat: number,
): PrototypeDocument {
  if (setTransportHirePlanRejection(document, month, carrierId, quantityThousandths, unitPriceExVat)) {
    return document;
  }
  const existing = transportHirePlan(document, month);
  const nextLine: TransportHireMonthPlanLine = {
    id: `transport-hire-plan:${month}:${carrierId}`,
    carrierId,
    quantityThousandths,
    unitPriceExVat,
  };
  if (!existing) {
    return {
      ...document,
      transportHireMonthPlans: [
        ...document.transportHireMonthPlans,
        { id: `transport-hire-plan:${month}`, month, lines: [nextLine] },
      ],
    };
  }
  const without = existing.lines.filter((line) => line.carrierId !== carrierId);
  const lines = quantityThousandths === 0 && unitPriceExVat === 0 ? without : [...without, nextLine];
  return {
    ...document,
    transportHireMonthPlans: document.transportHireMonthPlans.map((item) =>
      item.month === month ? { ...item, lines } : item,
    ),
  };
}

export function setTransportHireDayRejection(
  document: PrototypeDocument,
  occurredOn: string,
  carrierId: string,
  quantityThousandths: number,
  amountExVat: number,
): TransportFieldRejection | null {
  if (!isOccurredOn(occurredOn)) {
    return 'day';
  }
  const carrier = document.transportCarriers.find((item) => item.id === carrierId);
  if (!carrier || carrier.deletedAt !== null) {
    return carrier?.deletedAt ? 'archived' : 'missing';
  }
  if (!isQty(quantityThousandths)) {
    return 'quantity';
  }
  if (!isMoney(amountExVat)) {
    return 'amount';
  }
  return null;
}

export function setTransportHireDay(
  document: PrototypeDocument,
  occurredOn: string,
  carrierId: string,
  quantityThousandths: number,
  amountExVat: number,
): PrototypeDocument {
  if (setTransportHireDayRejection(document, occurredOn, carrierId, quantityThousandths, amountExVat)) {
    return document;
  }
  const existing = document.transportHireDayFacts.find((item) => item.occurredOn === occurredOn);
  const nextLine = {
    id: `transport-hire-day:${occurredOn}:${carrierId}`,
    carrierId,
    quantityThousandths,
    amountExVat,
  };
  if (!existing) {
    if (quantityThousandths === 0 && amountExVat === 0) {
      return document;
    }
    return {
      ...document,
      transportHireDayFacts: [
        ...document.transportHireDayFacts,
        { id: `transport-hire-day:${occurredOn}`, occurredOn, lines: [nextLine] },
      ],
    };
  }
  const without = existing.lines.filter((line) => line.carrierId !== carrierId);
  const lines = quantityThousandths === 0 && amountExVat === 0 ? without : [...without, nextLine];
  if (lines.length === 0) {
    return {
      ...document,
      transportHireDayFacts: document.transportHireDayFacts.filter((item) => item.occurredOn !== occurredOn),
    };
  }
  return {
    ...document,
    transportHireDayFacts: document.transportHireDayFacts.map((item) =>
      item.occurredOn === occurredOn ? { ...item, lines } : item,
    ),
  };
}

export function setTransportOwnPlanRejection(
  document: PrototypeDocument,
  month: string,
  vehicleId: string,
  litersPer100KmThousandths: number,
  fuelPriceExVat: number,
  planKmThousandths: number,
): TransportFieldRejection | null {
  if (!isMonthKey(month)) {
    return 'month';
  }
  const vehicle = document.transportVehicles.find((item) => item.id === vehicleId);
  if (!vehicle) {
    return 'missing';
  }
  if (vehicle.deletedAt !== null) {
    return 'archived';
  }
  if (!isQty(litersPer100KmThousandths) || !isQty(planKmThousandths)) {
    return 'quantity';
  }
  if (!isMoney(fuelPriceExVat)) {
    return 'price';
  }
  return null;
}

export function setTransportOwnPlan(
  document: PrototypeDocument,
  month: string,
  vehicleId: string,
  litersPer100KmThousandths: number,
  fuelPriceExVat: number,
  planKmThousandths: number,
): PrototypeDocument {
  if (
    setTransportOwnPlanRejection(
      document,
      month,
      vehicleId,
      litersPer100KmThousandths,
      fuelPriceExVat,
      planKmThousandths,
    )
  ) {
    return document;
  }
  const existing = transportOwnPlan(document, month);
  const nextVehicle = {
    id: `transport-own-plan:${month}:${vehicleId}`,
    vehicleId,
    litersPer100KmThousandths,
    fuelPriceExVat,
    planKmThousandths,
  };
  if (!existing) {
    return {
      ...document,
      transportOwnMonthPlans: [
        ...document.transportOwnMonthPlans,
        { id: `transport-own-plan:${month}`, month, vehicles: [nextVehicle] },
      ],
    };
  }
  const without = existing.vehicles.filter((item) => item.vehicleId !== vehicleId);
  return {
    ...document,
    transportOwnMonthPlans: document.transportOwnMonthPlans.map((item) =>
      item.month === month ? { ...item, vehicles: [...without, nextVehicle] } : item,
    ),
  };
}

export function setTransportOwnDayRejection(
  document: PrototypeDocument,
  occurredOn: string,
  vehicleId: string,
  odometerThousandths: number,
  fuelPriceExVat: number,
): TransportFieldRejection | null {
  if (!isOccurredOn(occurredOn)) {
    return 'day';
  }
  const vehicle = document.transportVehicles.find((item) => item.id === vehicleId);
  if (!vehicle) {
    return 'missing';
  }
  if (vehicle.deletedAt !== null) {
    return 'archived';
  }
  if (!isQty(odometerThousandths)) {
    return 'odometer';
  }
  if (!isMoney(fuelPriceExVat)) {
    return 'price';
  }
  return null;
}

export function setTransportOwnDay(
  document: PrototypeDocument,
  occurredOn: string,
  vehicleId: string,
  odometerThousandths: number,
  fuelPriceExVat: number,
): PrototypeDocument {
  if (setTransportOwnDayRejection(document, occurredOn, vehicleId, odometerThousandths, fuelPriceExVat)) {
    return document;
  }
  const existing = document.transportOwnDayFacts.find((item) => item.occurredOn === occurredOn);
  const nextVehicle = {
    id: `transport-own-day:${occurredOn}:${vehicleId}`,
    vehicleId,
    odometerThousandths,
    fuelPriceExVat,
  };
  if (!existing) {
    if (odometerThousandths === 0 && fuelPriceExVat === 0) {
      return document;
    }
    return {
      ...document,
      transportOwnDayFacts: [
        ...document.transportOwnDayFacts,
        { id: `transport-own-day:${occurredOn}`, occurredOn, vehicles: [nextVehicle] },
      ],
    };
  }
  const without = existing.vehicles.filter((item) => item.vehicleId !== vehicleId);
  const vehicles = odometerThousandths === 0 && fuelPriceExVat === 0 ? without : [...without, nextVehicle];
  if (vehicles.length === 0) {
    return {
      ...document,
      transportOwnDayFacts: document.transportOwnDayFacts.filter((item) => item.occurredOn !== occurredOn),
    };
  }
  return {
    ...document,
    transportOwnDayFacts: document.transportOwnDayFacts.map((item) =>
      item.occurredOn === occurredOn ? { ...item, vehicles } : item,
    ),
  };
}

export function transportHireDayValue(
  document: PrototypeDocument,
  occurredOn: string,
  carrierId: string,
): { quantityThousandths: number; amountExVat: number } {
  const day = document.transportHireDayFacts.find((item) => item.occurredOn === occurredOn);
  const line = day?.lines.find((item) => item.carrierId === carrierId);
  return {
    quantityThousandths: line?.quantityThousandths ?? 0,
    amountExVat: line?.amountExVat ?? 0,
  };
}

export function transportOwnDayValue(
  document: PrototypeDocument,
  occurredOn: string,
  vehicleId: string,
): { odometerThousandths: number; fuelPriceExVat: number } {
  const day = document.transportOwnDayFacts.find((item) => item.occurredOn === occurredOn);
  const row = day?.vehicles.find((item) => item.vehicleId === vehicleId);
  return {
    odometerThousandths: row?.odometerThousandths ?? 0,
    fuelPriceExVat: row?.fuelPriceExVat ?? 0,
  };
}
