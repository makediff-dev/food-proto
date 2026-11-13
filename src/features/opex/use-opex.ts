'use client';

import { useDocumentStore } from '@/data/DocumentProvider';
import type {
  HrDepartmentId,
  HrShopDepartmentId,
  HrTaxRatesMonth,
  OpexGroupCode,
  TransportHireKind,
} from '@/domain/document';
import {
  addHrPosition,
  addHrPositionRejection,
  deleteHrPosition,
  type HrFieldRejection,
  type HrTaxRateField,
  restoreHrPosition,
  setHrDayOutsourcing,
  setHrDayOutsourcingRejection,
  setHrDayStaff,
  setHrDayStaffRejection,
  setHrMonthStaff,
  setHrMonthStaffRejection,
  setHrOutsourcingPlan,
  setHrOutsourcingPlanRejection,
  setHrStaffPlan,
  setHrStaffPlanRejection,
  setHrTaxRate,
  setHrTaxRateRejection,
} from '@/domain/hr';
import {
  addOpexOtherLine,
  addOpexOtherLineRejection,
  deleteOpexOtherLine,
  demoteOpexGroup,
  demoteOpexGroupRejection,
  type OpexFieldRejection,
  promoteOpexGroup,
  promoteOpexGroupRejection,
  renameOpexOtherLine,
  renameOpexOtherLineRejection,
  restoreOpexOtherLine,
  restoreOpexOtherLineRejection,
  setOpexDayLine,
  setOpexDayLineRejection,
  setOpexLine,
  setOpexLineRejection,
  setOpexOtherLineVat,
  setOpexOtherLineVatRejection,
} from '@/domain/operating-expense';
import {
  addTransportCarrier,
  addTransportCarrierRejection,
  addTransportVehicle,
  addTransportVehicleRejection,
  DEFAULT_TRANSPORT_FUEL_VAT_PERCENT,
  DEFAULT_TRANSPORT_HIRE_VAT_PERCENT,
  deleteTransportCarrier,
  deleteTransportVehicle,
  renameTransportCarrier,
  renameTransportCarrierRejection,
  renameTransportVehicle,
  renameTransportVehicleRejection,
  restoreTransportCarrier,
  restoreTransportVehicle,
  setTransportCarrierVat,
  setTransportCarrierVatRejection,
  setTransportHireDay,
  setTransportHireDayRejection,
  setTransportHirePlan,
  setTransportHirePlanRejection,
  setTransportOwnDay,
  setTransportOwnDayRejection,
  setTransportOwnPlan,
  setTransportOwnPlanRejection,
  setTransportVehicleFuelVat,
  setTransportVehicleFuelVatRejection,
  type TransportFieldRejection,
} from '@/domain/transport';

export function useOpex() {
  const { document, hydrated, updateDocument } = useDocumentStore();

  return {
    hydrated,
    document,
    setOpexLine(month: string, lineId: string, side: 'plan' | 'fact', amountExVat: number): OpexFieldRejection | null {
      const rejection = setOpexLineRejection(document, month, lineId, side, amountExVat);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => setOpexLine(current, month, lineId, side, amountExVat));
      return null;
    },
    setOpexDayLine(occurredOn: string, lineId: string, amountExVat: number): OpexFieldRejection | null {
      const rejection = setOpexDayLineRejection(document, occurredOn, lineId, amountExVat);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => setOpexDayLine(current, occurredOn, lineId, amountExVat));
      return null;
    },
    addOpexOtherLine(groupCode: OpexGroupCode, name: string): OpexFieldRejection | null {
      const id = `opex-other:${crypto.randomUUID()}`;
      const rejection = addOpexOtherLineRejection(document, groupCode, name);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => addOpexOtherLine(current, { id, groupCode, name }));
      return null;
    },
    renameOpexOtherLine(lineId: string, name: string): OpexFieldRejection | null {
      const rejection = renameOpexOtherLineRejection(document, lineId, name);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => renameOpexOtherLine(current, lineId, name));
      return null;
    },
    setOpexOtherLineVat(lineId: string, vatPercent: number): OpexFieldRejection | null {
      const rejection = setOpexOtherLineVatRejection(document, lineId, vatPercent);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => setOpexOtherLineVat(current, lineId, vatPercent));
      return null;
    },
    deleteOpexOtherLine(lineId: string) {
      updateDocument((current) => deleteOpexOtherLine(current, lineId, new Date().toISOString()));
    },
    restoreOpexOtherLine(lineId: string): OpexFieldRejection | null {
      const rejection = restoreOpexOtherLineRejection(document, lineId);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => restoreOpexOtherLine(current, lineId));
      return null;
    },
    promoteOpexGroup(groupCode: OpexGroupCode): OpexFieldRejection | null {
      const rejection = promoteOpexGroupRejection(document, groupCode);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => promoteOpexGroup(current, groupCode));
      return null;
    },
    demoteOpexGroup(groupCode: OpexGroupCode): OpexFieldRejection | null {
      const rejection = demoteOpexGroupRejection(document, groupCode);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => demoteOpexGroup(current, groupCode));
      return null;
    },
    addHrPosition(departmentId: HrDepartmentId, name: string): HrFieldRejection | null {
      const id = `hr-position:${crypto.randomUUID()}`;
      const rejection = addHrPositionRejection(document, departmentId, name);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) =>
        addHrPosition(current, {
          id,
          departmentId,
          name,
          kind: 'staff',
          deletedAt: null,
        }),
      );
      return null;
    },
    deleteHrPosition(positionId: string) {
      updateDocument((current) => deleteHrPosition(current, positionId, new Date().toISOString()));
    },
    restoreHrPosition(positionId: string): HrFieldRejection | null {
      const position = document.hrPositions.find((item) => item.id === positionId);
      if (!position || position.deletedAt === null) {
        return 'missing';
      }
      const rejection = addHrPositionRejection(document, position.departmentId, position.name);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => restoreHrPosition(current, positionId));
      return null;
    },
    setHrStaffPlan(month: string, positionId: string, headcount: number, salaryExVat: number): HrFieldRejection | null {
      const rejection = setHrStaffPlanRejection(document, month, positionId, headcount, salaryExVat);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => setHrStaffPlan(current, month, positionId, headcount, salaryExVat));
      return null;
    },
    setHrOutsourcingPlan(
      month: string,
      departmentId: HrShopDepartmentId,
      hourThousandths: number,
      rateExVat: number,
      vatPercent: number,
    ): HrFieldRejection | null {
      const rejection = setHrOutsourcingPlanRejection(
        document,
        month,
        departmentId,
        hourThousandths,
        rateExVat,
        vatPercent,
      );
      if (rejection) {
        return rejection;
      }
      updateDocument((current) =>
        setHrOutsourcingPlan(current, month, departmentId, hourThousandths, rateExVat, vatPercent),
      );
      return null;
    },
    setHrMonthStaff(
      month: string,
      positionId: string,
      headcountThousandths: number,
      amountExVat: number,
    ): HrFieldRejection | null {
      const rejection = setHrMonthStaffRejection(document, month, positionId, headcountThousandths, amountExVat);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => setHrMonthStaff(current, month, positionId, headcountThousandths, amountExVat));
      return null;
    },
    setHrDayStaff(
      occurredOn: string,
      positionId: string,
      headcountThousandths: number,
      amountExVat: number,
    ): HrFieldRejection | null {
      const rejection = setHrDayStaffRejection(document, occurredOn, positionId, headcountThousandths, amountExVat);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => setHrDayStaff(current, occurredOn, positionId, headcountThousandths, amountExVat));
      return null;
    },
    setHrDayOutsourcing(
      occurredOn: string,
      departmentId: HrShopDepartmentId,
      hourThousandths: number,
      rateExVat: number,
    ): HrFieldRejection | null {
      const rejection = setHrDayOutsourcingRejection(document, occurredOn, departmentId, hourThousandths, rateExVat);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => setHrDayOutsourcing(current, occurredOn, departmentId, hourThousandths, rateExVat));
      return null;
    },
    setHrTaxRate(month: string, field: HrTaxRateField, rateHundredths: number): HrFieldRejection | null {
      const rejection = setHrTaxRateRejection(document, month, field, rateHundredths);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => setHrTaxRate(current, month, field, rateHundredths));
      return null;
    },
    addTransportCarrier(kind: TransportHireKind, name: string): TransportFieldRejection | null {
      const id = `transport-carrier:${crypto.randomUUID()}`;
      const rejection = addTransportCarrierRejection(document, kind, name);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) =>
        addTransportCarrier(current, {
          id,
          kind,
          name,
          vatPercent: DEFAULT_TRANSPORT_HIRE_VAT_PERCENT,
          deletedAt: null,
        }),
      );
      return null;
    },
    deleteTransportCarrier(carrierId: string) {
      updateDocument((current) => deleteTransportCarrier(current, carrierId, new Date().toISOString()));
    },
    setTransportCarrierVat(carrierId: string, vatPercent: number): TransportFieldRejection | null {
      const rejection = setTransportCarrierVatRejection(document, carrierId, vatPercent);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => setTransportCarrierVat(current, carrierId, vatPercent));
      return null;
    },
    renameTransportCarrier(carrierId: string, name: string): TransportFieldRejection | null {
      const rejection = renameTransportCarrierRejection(document, carrierId, name);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => renameTransportCarrier(current, carrierId, name));
      return null;
    },
    restoreTransportCarrier(carrierId: string): TransportFieldRejection | null {
      const carrier = document.transportCarriers.find((item) => item.id === carrierId);
      if (!carrier || carrier.deletedAt === null) {
        return 'missing';
      }
      const rejection = addTransportCarrierRejection(document, carrier.kind, carrier.name);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => restoreTransportCarrier(current, carrierId));
      return null;
    },
    addTransportVehicle(name: string): TransportFieldRejection | null {
      const id = `transport-vehicle:${crypto.randomUUID()}`;
      const rejection = addTransportVehicleRejection(document, name);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) =>
        addTransportVehicle(current, {
          id,
          name,
          fuelVatPercent: DEFAULT_TRANSPORT_FUEL_VAT_PERCENT,
          deletedAt: null,
        }),
      );
      return null;
    },
    deleteTransportVehicle(vehicleId: string) {
      updateDocument((current) => deleteTransportVehicle(current, vehicleId, new Date().toISOString()));
    },
    setTransportVehicleFuelVat(vehicleId: string, fuelVatPercent: number): TransportFieldRejection | null {
      const rejection = setTransportVehicleFuelVatRejection(document, vehicleId, fuelVatPercent);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => setTransportVehicleFuelVat(current, vehicleId, fuelVatPercent));
      return null;
    },
    renameTransportVehicle(vehicleId: string, name: string): TransportFieldRejection | null {
      const rejection = renameTransportVehicleRejection(document, vehicleId, name);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => renameTransportVehicle(current, vehicleId, name));
      return null;
    },
    restoreTransportVehicle(vehicleId: string): TransportFieldRejection | null {
      const vehicle = document.transportVehicles.find((item) => item.id === vehicleId);
      if (!vehicle || vehicle.deletedAt === null) {
        return 'missing';
      }
      const rejection = addTransportVehicleRejection(document, vehicle.name);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => restoreTransportVehicle(current, vehicleId));
      return null;
    },
    setTransportHirePlan(
      month: string,
      carrierId: string,
      quantityThousandths: number,
      unitPriceExVat: number,
    ): TransportFieldRejection | null {
      const rejection = setTransportHirePlanRejection(document, month, carrierId, quantityThousandths, unitPriceExVat);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) => setTransportHirePlan(current, month, carrierId, quantityThousandths, unitPriceExVat));
      return null;
    },
    setTransportHireDay(
      occurredOn: string,
      carrierId: string,
      quantityThousandths: number,
      amountExVat: number,
    ): TransportFieldRejection | null {
      const rejection = setTransportHireDayRejection(document, occurredOn, carrierId, quantityThousandths, amountExVat);
      if (rejection) {
        return rejection;
      }
      updateDocument((current) =>
        setTransportHireDay(current, occurredOn, carrierId, quantityThousandths, amountExVat),
      );
      return null;
    },
    setTransportOwnPlan(
      month: string,
      vehicleId: string,
      litersPer100KmThousandths: number,
      fuelPriceExVat: number,
      planKmThousandths: number,
    ): TransportFieldRejection | null {
      const rejection = setTransportOwnPlanRejection(
        document,
        month,
        vehicleId,
        litersPer100KmThousandths,
        fuelPriceExVat,
        planKmThousandths,
      );
      if (rejection) {
        return rejection;
      }
      updateDocument((current) =>
        setTransportOwnPlan(current, month, vehicleId, litersPer100KmThousandths, fuelPriceExVat, planKmThousandths),
      );
      return null;
    },
    setTransportOwnDay(
      occurredOn: string,
      vehicleId: string,
      odometerThousandths: number,
      fuelPriceExVat: number,
    ): TransportFieldRejection | null {
      const rejection = setTransportOwnDayRejection(
        document,
        occurredOn,
        vehicleId,
        odometerThousandths,
        fuelPriceExVat,
      );
      if (rejection) {
        return rejection;
      }
      updateDocument((current) =>
        setTransportOwnDay(current, occurredOn, vehicleId, odometerThousandths, fuelPriceExVat),
      );
      return null;
    },
  };
}

export type { HrTaxRatesMonth };
