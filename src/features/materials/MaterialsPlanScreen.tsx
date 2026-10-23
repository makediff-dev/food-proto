'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import {
  MATERIAL_GROUPS,
  MATERIAL_UNITS,
  MATERIAL_WAREHOUSES,
  type MaterialGroupId,
  type MaterialUnit,
  type MaterialWarehouseId,
  type MaterialWeightPair,
} from '@/domain/document';
import { deletedMaterials, materialMovementMonth } from '@/domain/materials';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { MaterialMonthBar, resolveMaterialMonth } from '@/features/materials/MaterialMonthBar';
import { MaterialsPlanTable } from '@/features/materials/MaterialsPlanTable';
import { MaterialsWarehouseBlocks } from '@/features/materials/MaterialsWarehouseBlocks';
import { MATERIALS_PLAN_TITLE, materialsPlanHref } from '@/features/materials/paths';
import {
  formatMaterialWeightPair,
  MATERIAL_NAME_ERROR,
  MATERIAL_PLAN_ERROR,
  parseQuantityInput,
} from '@/features/materials/text';
import { useMaterials } from '@/features/materials/use-materials';
import { fieldClassName, primaryButtonClassName } from '@/features/sales/fields';
import { Dialog } from '@/features/shell/Dialog';
import { IconPlus, IconUndo } from '@/features/shell/Icons';
import { PageFrame } from '@/features/shell/PageFrame';

function materialUnitHint(unit: MaterialUnit, weight: MaterialWeightPair | null): string {
  if (weight === null) {
    return unit;
  }
  return `${unit} · ${formatMaterialWeightPair(weight, unit)}`;
}

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
  const [adding, setAdding] = useState<{ groupId: MaterialGroupId; warehouseId: MaterialWarehouseId } | null>(null);
  const deleted = deletedMaterials(materials.document);

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
      lede="Цена, план прихода, минимум и максимум. План и факт расхода вводят в отчёте."
      intro={
        <MaterialMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(materialsPlanHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      <div className="flex flex-col gap-8">
        <MaterialsWarehouseBlocks
          groups={view.groups}
          renderWarehouseExtra={(group, warehouse) => (
            <button
              type="button"
              onClick={() => setAdding({ groupId: group.groupId, warehouseId: warehouse.warehouseId })}
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
              onRename={(materialId, name) => {
                const rejection = materials.rename(materialId, name);
                return rejection ? MATERIAL_NAME_ERROR[rejection] : null;
              }}
              onDelete={(materialId, name) => {
                const confirmed = window.confirm(
                  `Удалить «${name}»? Позиция пропадёт из рабочего списка. Вернуть можно здесь, если имя свободно.`,
                );
                if (confirmed) {
                  materials.remove(materialId);
                }
              }}
            />
          )}
        />
        <section className="border border-line bg-sheet">
          <h2 className="border-b border-line px-4 py-3 text-sm text-ink">Удалённые</h2>
          {deleted.length === 0 ? (
            <p className="px-4 py-4 text-sm leading-6 text-muted">Удалённых позиций нет.</p>
          ) : (
            <ul>
              {deleted.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 last:border-b-0"
                >
                  <span className="text-sm text-ink">
                    {item.name}
                    <span className="text-muted">
                      {' '}
                      · {MATERIAL_WAREHOUSES.find((warehouse) => warehouse.id === item.warehouseId)?.name} ·{' '}
                      {MATERIAL_GROUPS.find((group) => group.id === item.groupId)?.name} ·{' '}
                      {materialUnitHint(item.unit, item.weight)}
                    </span>
                  </span>
                  <button
                    type="button"
                    aria-label={`Вернуть ${item.name}`}
                    onClick={() => {
                      const rejection = materials.restore(item.id);
                      if (rejection === 'duplicate') {
                        window.alert('Такое название уже есть у рабочей позиции. Сначала переименуйте её.');
                      }
                    }}
                    className="inline-flex h-10 items-center gap-2 px-2 text-sm text-ink outline-none hover:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    <IconUndo />
                    Вернуть
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      {adding ? (
        <AddMaterialDialog
          groupId={adding.groupId}
          warehouseId={adding.warehouseId}
          onClose={() => setAdding(null)}
          onSubmit={(name, unit, weight, vatPercent) => {
            const rejection = materials.addMaterial({
              id: `material:${crypto.randomUUID()}`,
              name,
              groupId: adding.groupId,
              warehouseId: adding.warehouseId,
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
          }}
        />
      ) : null}
    </PageFrame>
  );
}

function AddMaterialDialog({
  groupId,
  warehouseId,
  onClose,
  onSubmit,
}: {
  groupId: MaterialGroupId;
  warehouseId: MaterialWarehouseId;
  onClose: () => void;
  onSubmit: (name: string, unit: MaterialUnit, weight: MaterialWeightPair | null, vatPercent: number) => string | null;
}) {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState<MaterialUnit>('кг');
  const [weight, setWeight] = useState('0');
  const [unitQuantity, setUnitQuantity] = useState('1');
  const [vat, setVat] = useState('20');
  const [error, setError] = useState<string | null>(null);
  const groupName = MATERIAL_GROUPS.find((item) => item.id === groupId)?.name ?? '';
  const warehouseName = MATERIAL_WAREHOUSES.find((item) => item.id === warehouseId)?.name ?? '';

  return (
    <Dialog title={`Новая позиция · ${warehouseName} · ${groupName}`} onClose={onClose}>
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          const vatPercent = Number(vat);
          if (!Number.isInteger(vatPercent) || vatPercent < 0 || vatPercent > 100) {
            setError('Укажите НДС целым числом от 0 до 100.');
            return;
          }
          let weightPair: MaterialWeightPair | null = null;
          if (unit !== 'кг') {
            const kilogramThousandths = parseQuantityInput(weight, false);
            if (kilogramThousandths === null) {
              setError('Укажите вес в килограммах.');
              return;
            }
            const unitThousandths = parseQuantityInput(unitQuantity, false);
            if (unitThousandths === null || unitThousandths === 0) {
              setError(`Укажите количество в ${unit} больше нуля.`);
              return;
            }
            weightPair = { kilogramThousandths, unitThousandths };
          }
          const rejection = onSubmit(name, unit, weightPair, vatPercent);
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
          Добавить
        </button>
      </form>
    </Dialog>
  );
}
