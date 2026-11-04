import {
  isDeletionMark,
  isMonthKey,
  isOccurredOn,
  isTransportHireKind,
  isTransportVehicleId,
  type PrototypeDocument,
  TRANSPORT_HIRE_KINDS,
  TRANSPORT_VEHICLE_IDS,
  type TransportCarrier,
  type TransportHireKind,
  type TransportHireMonthPlan,
  type TransportHireMonthPlanLine,
  type TransportOwnMonthPlan,
  type TransportVehicleId,
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
  | 'archived';

export const TRANSPORT_HIRE_LABELS: Record<TransportHireKind, string> = {
  finishedDelivery: 'Доставка готовой продукции наёмный',
  finishedTransfer: 'Перемещение готовой продукции наёмный',
  materialDelivery: 'Доставка сырья и материалов',
};

export const TRANSPORT_VEHICLE_LABELS: Record<TransportVehicleId, string> = {
  'vehicle-1': 'Авто № 1',
  'vehicle-2': 'Авто № 2',
  'vehicle-3': 'Авто № 3',
};

export interface TransportHireCarrierView {
  carrierId: string;
  name: string;
  deleted: boolean;
  planQuantityThousandths: number;
  planUnitPriceExVat: number;
  planAmountExVat: number;
  factQuantityThousandths: number;
  factUnitPriceExVat: number;
  factAmountExVat: number;
  varianceQuantityThousandths: number;
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
  varianceAmountExVat: number;
}

export interface TransportOwnVehicleView {
  vehicleId: TransportVehicleId;
  name: string;
  litersPer100KmThousandths: number;
  planFuelPriceExVat: number;
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
  /** Сумма трёх блоков наёмного — строка 7.1. */
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
export function ownDayKmThousandths(
  document: PrototypeDocument,
  occurredOn: string,
  vehicleId: TransportVehicleId,
): number {
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
      return {
        carrierId: carrier.id,
        name: carrier.name,
        deleted: carrier.deletedAt !== null,
        planQuantityThousandths: planQty,
        planUnitPriceExVat: planPrice,
        planAmountExVat: planAmount,
        factQuantityThousandths: factQty,
        factUnitPriceExVat: unitPrice(factAmount, factQty),
        factAmountExVat: factAmount,
        varianceQuantityThousandths: factQty - planQty,
        varianceAmountExVat: factAmount - planAmount,
      };
    });
    const planQty = views.reduce((sum, item) => sum + item.planQuantityThousandths, 0);
    const planAmount = views.reduce((sum, item) => sum + item.planAmountExVat, 0);
    const factQty = views.reduce((sum, item) => sum + item.factQuantityThousandths, 0);
    const factAmount = views.reduce((sum, item) => sum + item.factAmountExVat, 0);
    return {
      kind,
      name: TRANSPORT_HIRE_LABELS[kind],
      quantityUnit: kind === 'materialDelivery' ? 'кг' : 'шт',
      carriers: views,
      planQuantityThousandths: planQty,
      planUnitPriceExVat: unitPrice(planAmount, planQty),
      planAmountExVat: planAmount,
      factQuantityThousandths: factQty,
      factUnitPriceExVat: unitPrice(factAmount, factQty),
      factAmountExVat: factAmount,
      varianceAmountExVat: factAmount - planAmount,
    };
  });

  const own: TransportOwnVehicleView[] = TRANSPORT_VEHICLE_IDS.map((vehicleId) => {
    const planRow = ownPlan?.vehicles.find((item) => item.vehicleId === vehicleId);
    const liters = planRow?.litersPer100KmThousandths ?? 0;
    const fuelPrice = planRow?.fuelPriceExVat ?? 0;
    const planKm = planRow?.planKmThousandths ?? 0;
    const planPerKm = ownPlanCostPerKmExVat(liters, fuelPrice);
    const planAmount = ownPlanAmountExVat(planKm, liters, fuelPrice);

    let factKm = 0;
    let factAmount = 0;
    for (const day of ownDays) {
      const km = ownDayKmThousandths(document, day.occurredOn, vehicleId);
      const fuel = day.vehicles.find((item) => item.vehicleId === vehicleId)?.fuelPriceExVat ?? 0;
      factKm += km;
      factAmount += ownDayFuelAmountExVat(km, liters, fuel);
    }

    return {
      vehicleId,
      name: TRANSPORT_VEHICLE_LABELS[vehicleId],
      litersPer100KmThousandths: liters,
      planFuelPriceExVat: fuelPrice,
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
  return {
    ...document,
    transportCarriers: [...document.transportCarriers, { ...carrier, name: carrier.name.trim(), deletedAt: null }],
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
  _document: PrototypeDocument,
  month: string,
  vehicleId: TransportVehicleId,
  litersPer100KmThousandths: number,
  fuelPriceExVat: number,
  planKmThousandths: number,
): TransportFieldRejection | null {
  if (!isMonthKey(month)) {
    return 'month';
  }
  if (!isTransportVehicleId(vehicleId)) {
    return 'missing';
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
  vehicleId: TransportVehicleId,
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
  _document: PrototypeDocument,
  occurredOn: string,
  vehicleId: TransportVehicleId,
  odometerThousandths: number,
  fuelPriceExVat: number,
): TransportFieldRejection | null {
  if (!isOccurredOn(occurredOn)) {
    return 'day';
  }
  if (!isTransportVehicleId(vehicleId)) {
    return 'missing';
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
  vehicleId: TransportVehicleId,
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
  vehicleId: TransportVehicleId,
): { odometerThousandths: number; fuelPriceExVat: number } {
  const day = document.transportOwnDayFacts.find((item) => item.occurredOn === occurredOn);
  const row = day?.vehicles.find((item) => item.vehicleId === vehicleId);
  return {
    odometerThousandths: row?.odometerThousandths ?? 0,
    fuelPriceExVat: row?.fuelPriceExVat ?? 0,
  };
}
