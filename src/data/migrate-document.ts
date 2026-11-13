import {
  type FinishedGoodsOpening,
  type HrDayOutsourcingLine,
  type HrMonthPlanOutsourcingLine,
  isMonthKey,
  type MaterialUnit,
  type OpexOtherLine,
  type PrototypeDocument,
  SCHEMA_VERSION,
  type TransportCarrier,
  type TransportVehicle,
} from '@/domain/document';
import { DEFAULT_OUTSOURCING_VAT_PERCENT, outsourcingFactRateExVat } from '@/domain/hr';
import { shiftMonth } from '@/domain/sales-plan';

const DEFAULT_OPEX_OTHER_VAT_PERCENT = 20;
const DEFAULT_TRANSPORT_HIRE_VAT_PERCENT = 20;
const DEFAULT_TRANSPORT_FUEL_VAT_PERCENT = 20;

/** Раньше в прототипе была единица `пм`; в интерфейсе — `м`. */
function normalizeMaterialUnits(document: PrototypeDocument): PrototypeDocument {
  let changed = false;
  const materials = document.materials.map((material) => {
    if ((material as { unit: string }).unit !== 'пм') {
      return material;
    }
    changed = true;
    return { ...material, unit: 'м' as MaterialUnit };
  });
  return changed ? { ...document, materials } : document;
}

/** Ставка НДС прочих статей — поле справочника; у старых записей подставляем 20 %. */
function normalizeOpexOtherVat(document: PrototypeDocument): PrototypeDocument {
  let changed = false;
  const opexOtherLines = (document.opexOtherLines ?? []).map((line) => {
    const raw = line as OpexOtherLine & { vatPercent?: number };
    if (Number.isInteger(raw.vatPercent) && raw.vatPercent >= 0 && raw.vatPercent <= 100) {
      return line;
    }
    changed = true;
    return { ...line, vatPercent: DEFAULT_OPEX_OTHER_VAT_PERCENT };
  });
  return changed ? { ...document, opexOtherLines } : document;
}

/** Ставка НДС контрагента наёмного транспорта; у старых записей подставляем 20 %. */
function normalizeTransportCarrierVat(document: PrototypeDocument): PrototypeDocument {
  let changed = false;
  const transportCarriers = (document.transportCarriers ?? []).map((carrier) => {
    const raw = carrier as TransportCarrier & { vatPercent?: number };
    if (Number.isInteger(raw.vatPercent) && raw.vatPercent >= 0 && raw.vatPercent <= 100) {
      return carrier;
    }
    changed = true;
    return { ...carrier, vatPercent: DEFAULT_TRANSPORT_HIRE_VAT_PERCENT };
  });
  return changed ? { ...document, transportCarriers } : document;
}

/** Ставка НДС топлива автомобиля; у старых записей подставляем 20 %. */
function normalizeTransportFuelVat(document: PrototypeDocument): PrototypeDocument {
  let changed = false;
  const transportVehicles = (document.transportVehicles ?? []).map((vehicle) => {
    const raw = vehicle as TransportVehicle & { fuelVatPercent?: number };
    if (Number.isInteger(raw.fuelVatPercent) && raw.fuelVatPercent >= 0 && raw.fuelVatPercent <= 100) {
      return vehicle;
    }
    changed = true;
    return { ...vehicle, fuelVatPercent: DEFAULT_TRANSPORT_FUEL_VAT_PERCENT };
  });
  return changed ? { ...document, transportVehicles } : document;
}

/** НДС аутсорса — на строке цеха; у старых планов подставляем 20 %. */
function normalizeHrOutsourcingPlanVat(document: PrototypeDocument): PrototypeDocument {
  let changed = false;
  const hrMonthPlans = (document.hrMonthPlans ?? []).map((plan) => {
    const outsourcingLines = plan.outsourcingLines.map((line) => {
      const raw = line as HrMonthPlanOutsourcingLine & { vatPercent?: number };
      if (Number.isInteger(raw.vatPercent) && raw.vatPercent >= 0 && raw.vatPercent <= 100) {
        return line;
      }
      changed = true;
      return { ...line, vatPercent: DEFAULT_OUTSOURCING_VAT_PERCENT };
    });
    return { ...plan, outsourcingLines };
  });
  return changed ? { ...document, hrMonthPlans } : document;
}

/**
 * Дневной факт аутсорса хранит ставку часа без НДС.
 * Старые строки с `amountExVat` переводим в ставку = сумма / часы.
 */
function normalizeHrOutsourcingDayRate(document: PrototypeDocument): PrototypeDocument {
  let changed = false;
  const hrDayFacts = (document.hrDayFacts ?? []).map((day) => {
    const outsourcingLines = day.outsourcingLines.map((line) => {
      const raw = line as HrDayOutsourcingLine & { amountExVat?: number; rateExVat?: number };
      if (Number.isInteger(raw.rateExVat) && raw.rateExVat >= 0) {
        if (raw.amountExVat === undefined) {
          return line;
        }
        changed = true;
        return {
          id: line.id,
          departmentId: line.departmentId,
          hourThousandths: line.hourThousandths,
          rateExVat: raw.rateExVat,
        };
      }
      changed = true;
      const amountExVat = Number.isInteger(raw.amountExVat) ? (raw.amountExVat ?? 0) : 0;
      return {
        id: line.id,
        departmentId: line.departmentId,
        hourThousandths: line.hourThousandths,
        rateExVat: outsourcingFactRateExVat(amountExVat, line.hourThousandths),
      };
    });
    return { ...day, outsourcingLines };
  });
  return changed ? { ...document, hrDayFacts } : document;
}

const LEGACY_OPENING_SCHEMA = 41 as const;

/**
 * v42: инвентаризация на конец месяца; перенос на начало следующего — факт прошлого конца.
 * Старые записи месяца M хранили остаток на начало M → переносим в конец M−1.
 */
export function migrateDocument(document: PrototypeDocument): PrototypeDocument {
  const normalizedUnits = normalizeHrOutsourcingDayRate(
    normalizeHrOutsourcingPlanVat(
      normalizeTransportFuelVat(normalizeTransportCarrierVat(normalizeOpexOtherVat(normalizeMaterialUnits(document)))),
    ),
  );

  if (normalizedUnits.schemaVersion === SCHEMA_VERSION) {
    return normalizedUnits;
  }

  if (normalizedUnits.schemaVersion !== LEGACY_OPENING_SCHEMA) {
    return normalizedUnits;
  }

  const legacyOpenings = normalizedUnits.finishedGoodsOpenings ?? [];
  const endByMonth = new Map<string, Map<string, number>>();

  for (const opening of legacyOpenings) {
    if (!isMonthKey(opening.month)) {
      continue;
    }
    const previousMonth = shiftMonth(opening.month, -1);
    if (!isMonthKey(previousMonth) || previousMonth < '2000-01') {
      continue;
    }
    const lines = new Map<string, number>();
    for (const line of opening.lines) {
      lines.set(line.productId, line.pieces);
    }
    endByMonth.set(previousMonth, lines);
  }

  const finishedGoodsOpenings: FinishedGoodsOpening[] = [];
  for (const [month, linesByProduct] of endByMonth) {
    finishedGoodsOpenings.push({
      id: `finished-goods-opening:${month}`,
      month,
      lines: [...linesByProduct.entries()].map(([productId, pieces]) => ({
        id: `finished-goods-opening-line:${month}:${productId}`,
        productId,
        pieces,
      })),
    });
  }

  return normalizeTransportFuelVat(
    normalizeTransportCarrierVat(
      normalizeOpexOtherVat(
        normalizeMaterialUnits({
          ...normalizedUnits,
          schemaVersion: SCHEMA_VERSION,
          finishedGoodsOpenings,
        }),
      ),
    ),
  );
}
