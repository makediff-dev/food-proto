'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import {
  MATERIAL_GROUPS,
  MATERIAL_UNITS,
  MATERIAL_WAREHOUSES,
  type Material,
  type MaterialGroupId,
  type MaterialUnit,
  type MaterialWarehouseId,
  type MaterialWeightPair,
} from '@/domain/document';
import { materialById, materialMovementMonth } from '@/domain/materials';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { MaterialMonthBar, resolveMaterialMonth } from '@/features/materials/MaterialMonthBar';
import { MaterialsPlanTable } from '@/features/materials/MaterialsPlanTable';
import { MaterialsWarehouseBlocks } from '@/features/materials/MaterialsWarehouseBlocks';
import { MATERIALS_PLAN_TITLE, materialsPlanHref } from '@/features/materials/paths';
import {
  formatQuantityDraft,
  MATERIAL_NAME_ERROR,
  MATERIAL_PLAN_ERROR,
  parseQuantityInput,
} from '@/features/materials/text';
import { useMaterials } from '@/features/materials/use-materials';
import { fieldClassName, primaryButtonClassName } from '@/features/sales/fields';
import { Dialog } from '@/features/shell/Dialog';
import { IconPlus } from '@/features/shell/Icons';
import { PageFrame } from '@/features/shell/PageFrame';

type MaterialDialogState =
  | { mode: 'create'; groupId: MaterialGroupId; warehouseId: MaterialWarehouseId }
  | { mode: 'edit'; material: Material };

export function MaterialsPlanScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveMaterialMonth(month, today, currentMonth);
  const materials = useMaterials();
  const router = useRouter();
  const view = useMemo(
    () => materialMovementMonth(materials.document, selectedMonth),
    [materials.document, selectedMonth],
  );
  const [dialog, setDialog] = useState<MaterialDialogState | null>(null);

  function fieldError(
    warehouseId: MaterialWarehouseId,
    materialId: string,
    field: Parameters<typeof materials.setPlan>[3],
    value: number,
  ): string | null {
    const rejection = materials.setPlan(selectedMonth, warehouseId, materialId, field, value, today);
    return rejection ? MATERIAL_PLAN_ERROR[rejection] : null;
  }

  return (
    <PageFrame
      title={MATERIALS_PLAN_TITLE}
      full
      lede="Цена, план прихода, минимум и максимум. План и факт расхода в отчёте считаются из выпуска по рецептам."
      intro={
        <MaterialMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(materialsPlanHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      <MaterialsWarehouseBlocks
        groups={view.groups}
        renderWarehouseExtra={(group, warehouse) => (
          <button
            type="button"
            onClick={() => setDialog({ mode: 'create', groupId: group.groupId, warehouseId: warehouse.warehouseId })}
            className={primaryButtonClassName}
          >
            <IconPlus />
            Добавить
          </button>
        )}
        renderWarehouse={(group, warehouse) => (
          <MaterialsPlanTable
            caption={`${group.name}, ${warehouse.name}, план`}
            rows={warehouse.rows}
            totals={warehouse.totals}
            editable={materials.hydrated}
            onField={(materialId, field, value) => fieldError(warehouse.warehouseId, materialId, field, value)}
            onEdit={(materialId) => {
              const material = materialById(materials.document, materialId);
              if (material && material.deletedAt === null) {
                setDialog({ mode: 'edit', material });
              }
            }}
            onDelete={(materialId, name) => {
              const confirmed = window.confirm(`Удалить «${name}»? Позиция пропадёт из рабочего списка.`);
              if (confirmed) {
                materials.remove(materialId);
              }
            }}
          />
        )}
      />
      {dialog ? (
        <MaterialDialog
          state={dialog}
          onClose={() => setDialog(null)}
          onSubmit={(name, unit, weight, vatPercent) => {
            if (dialog.mode === 'create') {
              const rejection = materials.addMaterial({
                id: `material:${crypto.randomUUID()}`,
                name,
                groupId: dialog.groupId,
                warehouseId: dialog.warehouseId,
                unit,
                weight,
                vatPercent,
              });
              return rejection === 'duplicate'
                ? 'Такое название уже есть.'
                : rejection === 'empty'
                  ? 'Укажите название.'
                  : rejection
                    ? 'Позицию не удалось добавить.'
                    : null;
            }
            const rejection = materials.update(dialog.material.id, {
              name,
              unit: dialog.material.unit,
              weight,
              vatPercent,
            });
            return rejection ? MATERIAL_NAME_ERROR[rejection] : null;
          }}
        />
      ) : null}
    </PageFrame>
  );
}

function MaterialDialog({
  state,
  onClose,
  onSubmit,
}: {
  state: MaterialDialogState;
  onClose: () => void;
  onSubmit: (name: string, unit: MaterialUnit, weight: MaterialWeightPair | null, vatPercent: number) => string | null;
}) {
  const initial = state.mode === 'edit' ? state.material : null;
  const [name, setName] = useState(initial?.name ?? '');
  const [unit, setUnit] = useState<MaterialUnit>(initial?.unit ?? 'кг');
  const [weight, setWeight] = useState(initial?.weight ? formatQuantityDraft(initial.weight.kilogramThousandths) : '0');
  const [unitQuantity, setUnitQuantity] = useState(
    initial?.weight ? formatQuantityDraft(initial.weight.unitThousandths) : '1',
  );
  const [vat, setVat] = useState(String(initial?.vatPercent ?? 20));
  const [error, setError] = useState<string | null>(null);

  const groupId = state.mode === 'create' ? state.groupId : state.material.groupId;
  const warehouseId = state.mode === 'create' ? state.warehouseId : state.material.warehouseId;
  const groupName = MATERIAL_GROUPS.find((item) => item.id === groupId)?.name ?? '';
  const warehouseName = MATERIAL_WAREHOUSES.find((item) => item.id === warehouseId)?.name ?? '';
  const title =
    state.mode === 'create'
      ? `Новая позиция · ${warehouseName} · ${groupName}`
      : `Позиция · ${warehouseName} · ${groupName}`;
  const submitLabel = state.mode === 'create' ? 'Добавить' : 'Сохранить';
  const unitLocked = state.mode === 'edit';

  return (
    <Dialog title={title} onClose={onClose}>
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          const vatPercent = Number(vat);
          if (!Number.isInteger(vatPercent) || vatPercent < 0 || vatPercent > 100) {
            setError('Укажите НДС целым числом от 0 до 100.');
            return;
          }
          const nextUnit = unitLocked ? state.material.unit : unit;
          let weightPair: MaterialWeightPair | null = null;
          if (nextUnit !== 'кг') {
            const kilogramThousandths = parseQuantityInput(weight, false);
            if (kilogramThousandths === null) {
              setError('Укажите вес в килограммах.');
              return;
            }
            const unitThousandths = parseQuantityInput(unitQuantity, false);
            if (unitThousandths === null || unitThousandths === 0) {
              setError(`Укажите количество в ${nextUnit} больше нуля.`);
              return;
            }
            weightPair = { kilogramThousandths, unitThousandths };
          }
          const rejection = onSubmit(name, nextUnit, weightPair, vatPercent);
          if (rejection) {
            setError(rejection);
            return;
          }
          onClose();
        }}
      >
        <label className="flex flex-col gap-2 text-sm text-muted">
          Наименование
          <input value={name} onChange={(event) => setName(event.target.value)} className={fieldClassName} />
        </label>
        <label className="flex flex-col gap-2 text-sm text-muted">
          Единица
          <select
            value={unit}
            disabled={unitLocked}
            onChange={(event) => setUnit(event.target.value as MaterialUnit)}
            className={fieldClassName}
          >
            {MATERIAL_UNITS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        {unit !== 'кг' ? (
          <>
            <label className="flex flex-col gap-2 text-sm text-muted">
              Вес, кг
              <input
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
                inputMode="decimal"
                className={fieldClassName}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-muted">
              Количество, {unit}
              <input
                value={unitQuantity}
                onChange={(event) => setUnitQuantity(event.target.value)}
                inputMode="decimal"
                className={fieldClassName}
              />
            </label>
          </>
        ) : null}
        <label className="flex flex-col gap-2 text-sm text-muted">
          НДС, %
          <input
            value={vat}
            onChange={(event) => setVat(event.target.value)}
            inputMode="numeric"
            className={fieldClassName}
          />
        </label>
        {error ? <p className="text-sm text-ink">{error}</p> : null}
        <button type="submit" className={primaryButtonClassName}>
          {submitLabel}
        </button>
      </form>
    </Dialog>
  );
}
