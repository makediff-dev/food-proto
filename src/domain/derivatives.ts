import { rejectName } from '@/domain/directory';
import {
  DERIVATIVE_UNITS,
  DERIVATIVE_WORKSHOPS,
  type Derivative,
  type DerivativeLine,
  type DerivativeUnit,
  type DerivativeWorkshopId,
  type MaterialWarehouseId,
  type PrototypeDocument,
} from '@/domain/document';
import { materialsList } from '@/domain/materials';
import { isQuantityThousandths } from '@/domain/quantity';

export type DerivativeNameRejection = 'empty' | 'too-long' | 'duplicate' | 'missing';

export type DerivativeAddRejection =
  | DerivativeNameRejection
  | 'workshop'
  | 'unit'
  | 'lines'
  | 'quantity'
  | 'component'
  | 'warehouse';

export function derivativesList(document: PrototypeDocument): Derivative[] {
  return document.derivatives ?? [];
}

export function isDerivativeWorkshopId(value: string): value is DerivativeWorkshopId {
  return DERIVATIVE_WORKSHOPS.some((item) => item.id === value);
}

export function isDerivativeUnit(value: string): value is DerivativeUnit {
  return (DERIVATIVE_UNITS as readonly string[]).includes(value);
}

export function derivativeWorkshopById(workshopId: DerivativeWorkshopId) {
  for (const workshop of DERIVATIVE_WORKSHOPS) {
    if (workshop.id === workshopId) {
      return workshop;
    }
  }
  return DERIVATIVE_WORKSHOPS[0];
}

export function warehouseIdForWorkshop(workshopId: DerivativeWorkshopId): MaterialWarehouseId {
  return derivativeWorkshopById(workshopId).warehouseId;
}

export function activeDerivatives(
  document: PrototypeDocument,
  options?: { warehouseId?: MaterialWarehouseId; workshopId?: DerivativeWorkshopId },
): Derivative[] {
  return derivativesList(document).filter((item) => {
    if (item.deletedAt !== null) {
      return false;
    }
    if (options?.workshopId !== undefined && item.workshopId !== options.workshopId) {
      return false;
    }
    if (options?.warehouseId !== undefined) {
      return warehouseIdForWorkshop(item.workshopId) === options.warehouseId;
    }
    return true;
  });
}

export function derivativeNameRejection(
  document: PrototypeDocument,
  name: string,
  warehouseId: MaterialWarehouseId,
  exceptId?: string,
): DerivativeNameRejection | null {
  const peers = activeDerivatives(document, { warehouseId });
  return rejectName(name, peers, exceptId);
}

function lineKey(kind: DerivativeLine['componentKind'], id: string): string {
  return `${kind}:${id}`;
}

function validateLines(
  document: PrototypeDocument,
  warehouseId: MaterialWarehouseId,
  lines: readonly DerivativeLine[],
  selfId?: string,
): DerivativeAddRejection | null {
  if (lines.length === 0) {
    return 'lines';
  }

  const seen = new Set<string>();

  for (const line of lines) {
    if (!line.id || !isQuantityThousandths(line.quantity, false) || line.quantity <= 0) {
      return 'quantity';
    }

    const key = lineKey(line.componentKind, line.componentId);
    if (seen.has(key)) {
      return 'component';
    }
    seen.add(key);

    if (line.componentKind === 'material') {
      const material = materialsList(document).find((item) => item.id === line.componentId);
      if (!material || material.deletedAt !== null || material.warehouseId !== warehouseId) {
        return 'component';
      }
    } else {
      if (selfId !== undefined && line.componentId === selfId) {
        return 'component';
      }
      const derivative = derivativesList(document).find((item) => item.id === line.componentId);
      if (
        !derivative ||
        derivative.deletedAt !== null ||
        warehouseIdForWorkshop(derivative.workshopId) !== warehouseId
      ) {
        return 'component';
      }
    }
  }

  return null;
}

export function derivativeByIdOrNull(document: PrototypeDocument, id: string): Derivative | null {
  return derivativesList(document).find((item) => item.id === id) ?? null;
}

function writeRejection(
  document: PrototypeDocument,
  input: {
    name: string;
    workshopId: DerivativeWorkshopId;
    unit: DerivativeUnit;
    lines: readonly DerivativeLine[];
  },
  options?: { exceptId?: string },
): DerivativeAddRejection | null {
  if (!isDerivativeWorkshopId(input.workshopId)) {
    return 'workshop';
  }
  if (!isDerivativeUnit(input.unit)) {
    return 'unit';
  }

  const warehouseId = warehouseIdForWorkshop(input.workshopId);
  const nameRejection = derivativeNameRejection(document, input.name, warehouseId, options?.exceptId);
  if (nameRejection) {
    return nameRejection;
  }

  return validateLines(document, warehouseId, input.lines, options?.exceptId);
}

export function addDerivative(
  document: PrototypeDocument,
  input: {
    id: string;
    name: string;
    workshopId: DerivativeWorkshopId;
    unit: DerivativeUnit;
    lines: readonly DerivativeLine[];
  },
): { document: PrototypeDocument; rejection: DerivativeAddRejection | null } {
  const rejection = writeRejection(document, input);
  if (rejection) {
    return { document, rejection };
  }

  const next: Derivative = {
    id: input.id,
    name: input.name.trim(),
    workshopId: input.workshopId,
    unit: input.unit,
    lines: input.lines.map((line) => ({ ...line })),
    deletedAt: null,
  };

  return {
    document: {
      ...document,
      derivatives: [...derivativesList(document), next],
    },
    rejection: null,
  };
}

export function updateDerivative(
  document: PrototypeDocument,
  id: string,
  input: {
    name: string;
    workshopId: DerivativeWorkshopId;
    unit: DerivativeUnit;
    lines: readonly DerivativeLine[];
  },
): { document: PrototypeDocument; rejection: DerivativeAddRejection | null } {
  const current = derivativeByIdOrNull(document, id);
  if (!current || current.deletedAt !== null) {
    return { document, rejection: 'missing' };
  }

  const rejection = writeRejection(document, input, { exceptId: id });
  if (rejection) {
    return { document, rejection };
  }

  return {
    document: {
      ...document,
      derivatives: derivativesList(document).map((item) =>
        item.id === id
          ? {
              ...item,
              name: input.name.trim(),
              workshopId: input.workshopId,
              unit: input.unit,
              lines: input.lines.map((line) => ({ ...line })),
            }
          : item,
      ),
    },
    rejection: null,
  };
}

/** Секции списка: все цеха по порядку константы, внутри — рабочие производные. */
export function derivativeSections(document: PrototypeDocument): {
  workshopId: DerivativeWorkshopId;
  name: string;
  items: Derivative[];
}[] {
  return DERIVATIVE_WORKSHOPS.map((workshop) => ({
    workshopId: workshop.id,
    name: workshop.name,
    items: activeDerivatives(document, { workshopId: workshop.id }).sort((left, right) =>
      left.name.localeCompare(right.name, 'ru'),
    ),
  }));
}

export type DerivativeCompositionLineView = {
  id: string;
  name: string;
  unit: string;
  /** Тысячные доли единицы. */
  quantity: number;
};

/** Строки состава для списка: имя и единица компонента (сырьё или производная). */
export function derivativeCompositionLines(
  document: PrototypeDocument,
  derivative: Derivative,
): DerivativeCompositionLineView[] {
  const result: DerivativeCompositionLineView[] = [];

  for (const line of derivative.lines) {
    if (line.componentKind === 'material') {
      const material = materialsList(document).find((item) => item.id === line.componentId);
      if (!material) {
        continue;
      }
      result.push({
        id: line.id,
        name: material.name,
        unit: material.unit,
        quantity: line.quantity,
      });
      continue;
    }

    const component = derivativesList(document).find((item) => item.id === line.componentId);
    if (!component) {
      continue;
    }
    result.push({
      id: line.id,
      name: component.name,
      unit: component.unit,
      quantity: line.quantity,
    });
  }

  return result;
}
