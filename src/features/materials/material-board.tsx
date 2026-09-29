"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { priceExVatKopecks, unitCost } from "@/domain/cost";
import type { DeletableRecord, Derivative, RawMaterial } from "@/domain/document";
import { compositionGrams, inputGramsForFinishedBatch } from "@/domain/materials";
import { formatKilogramsFromGrams } from "@/domain/units";
import { formatMoney, formatStockRange, formatVatPair } from "@/features/materials/money";
import {
  FIELD_ERROR,
  fieldClassName,
  primaryButtonClassName,
} from "@/features/materials/fields";
import { CreateEntryDialog } from "@/features/materials/create-entry-dialog";
import {
  derivativeDetailHref,
  materialDetailHref,
  materialListHref,
  type MaterialKind,
} from "@/features/materials/paths";
import { useMaterials } from "@/features/materials/use-materials";
import {
  IconClose,
  IconDerivative,
  IconMaterial,
  IconPlus,
  IconProduct,
  IconTrash,
  IconUndo,
} from "@/features/shell/icons";

function placeName(
  places: readonly { id: string; name: string; deletedAt: string | null }[],
  id: string,
): string {
  const place = places.find((item) => item.id === id);
  if (!place) {
    return "Не найдено";
  }

  return place.deletedAt ? `${place.name} (удалён)` : place.name;
}

function derivativeStatus(
  item: Derivative,
  recipe: { lines: { quantityGrams: number }[]; yieldPercent: number | null } | null,
  cost: { withVatKopecks: number; exVatKopecks: number; per: "kg" | "piece" } | null,
): string {
  if (!recipe) {
    return "Нет рецептурной карты";
  }

  if (!item.isFinalProduct) {
    if (recipe.yieldPercent === null) {
      return "Нет выхода после обработки";
    }
    const target = inputGramsForFinishedBatch(recipe.yieldPercent);
    const grams = compositionGrams(recipe.lines);
    if (grams !== target) {
      return `В составе ${formatKilogramsFromGrams(grams)} из ${formatKilogramsFromGrams(target)} кг`;
    }
  }

  if (!cost) {
    return "Себестоимость не считается";
  }

  return `Себестоимость ${formatVatPair(cost.withVatKopecks, cost.exVatKopecks, cost.per === "kg" ? "кг" : "шт")}`;
}

export function MaterialBoard({
  kind,
  showDeleted,
}: {
  kind: MaterialKind;
  showDeleted: boolean;
}) {
  const catalog = useMaterials();
  const [createOpen, setCreateOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [workshopId, setWorkshopId] = useState("");
  const materials = showDeleted ? catalog.deletedMaterials : catalog.materials;
  const made = (showDeleted ? catalog.deletedDerivatives : catalog.derivatives).filter(
    (item) => (kind === "products" ? item.isFinalProduct : !item.isFinalProduct),
  );
  const deletedCount =
    kind === "materials"
      ? catalog.deletedMaterials.length
      : catalog.deletedDerivatives.filter((item) =>
          kind === "products" ? item.isFinalProduct : !item.isFinalProduct,
        ).length;

  const addLabel =
    kind === "materials"
      ? "Добавить сырьё"
      : kind === "products"
        ? "Добавить товар"
        : "Добавить производную";
  const source = kind === "materials" ? materials : made;
  const filteredMaterials = materials.filter(
    (item) =>
      matchesQuery(query, [item.name, item.brand]) &&
      (!warehouseId || item.warehouseId === warehouseId),
  );
  const filteredMade = made.filter(
    (item) =>
      matchesQuery(query, [item.name]) &&
      (!warehouseId || item.warehouseId === warehouseId) &&
      (!workshopId || item.workshopId === workshopId),
  );
  const visibleCount =
    kind === "materials" ? filteredMaterials.length : filteredMade.length;
  const filtersOn =
    query.trim().length > 0 ||
    Boolean(warehouseId) ||
    (kind !== "materials" && Boolean(workshopId));

  function resetFilters() {
    setQuery("");
    setWarehouseId("");
    setWorkshopId("");
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid grid-cols-3 border border-line bg-sheet p-1 sm:flex">
          <KindLink kind="materials" current={kind} showDeleted={showDeleted} />
          <KindLink kind="derivatives" current={kind} showDeleted={showDeleted} />
          <KindLink kind="products" current={kind} showDeleted={showDeleted} />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {showDeleted ? null : (
            <button
              type="button"
              disabled={!catalog.hydrated}
              onClick={() => setCreateOpen(true)}
              className={`w-full sm:w-auto ${primaryButtonClassName}`}
            >
              <IconPlus />
              {addLabel}
            </button>
          )}
          <Link
            href={materialListHref(kind, !showDeleted)}
            aria-current={showDeleted ? "page" : undefined}
            className={`inline-flex h-11 items-center justify-center gap-2 border px-3 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
              showDeleted
                ? "border-ink bg-ink text-white"
                : "border-line bg-sheet text-ink hover:border-ink"
            }`}
          >
            <IconUndo />
            Удалённые{deletedCount > 0 ? ` ${deletedCount}` : ""}
          </Link>
        </div>
      </div>

      {createOpen ? (
        <CreateEntryDialog kind={kind} onClose={() => setCreateOpen(false)} />
      ) : null}

      {source.length > 0 ? (
        <FilterBar
          kind={kind}
          query={query}
          warehouseId={warehouseId}
          workshopId={workshopId}
          warehouses={catalog.document.warehouses}
          workshops={catalog.document.workshops}
          visibleCount={visibleCount}
          totalCount={source.length}
          filtersOn={filtersOn}
          onQuery={setQuery}
          onWarehouse={setWarehouseId}
          onWorkshop={setWorkshopId}
          onReset={resetFilters}
        />
      ) : null}

      {kind === "materials" ? (
        materials.length === 0 ? (
          <p className="text-sm leading-6 text-muted">
            {showDeleted
              ? "Удалённого сырья нет."
              : "Сырья нет. Добавьте название, склад и цену закупки."}
          </p>
        ) : filteredMaterials.length === 0 ? (
          <p className="text-sm leading-6 text-muted">
            Ничего не найдено. Измените поиск или сбросьте фильтр.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredMaterials.map((item) => (
              <MaterialCard
                key={item.id}
                item={item}
                warehouse={placeName(catalog.document.warehouses, item.warehouseId)}
                showDeleted={showDeleted}
                disabled={!catalog.hydrated}
              />
            ))}
          </ul>
        )
      ) : made.length === 0 ? (
        <p className="text-sm leading-6 text-muted">
          {kind === "products"
            ? showDeleted
              ? "Удалённых товаров нет."
              : "Товаров нет. Добавьте товар и откройте рецептурную карту."
            : showDeleted
              ? "Удалённых производных нет."
              : "Производных нет. Добавьте производную и откройте рецептурную карту."}
        </p>
      ) : filteredMade.length === 0 ? (
        <p className="text-sm leading-6 text-muted">
          Ничего не найдено. Измените поиск или сбросьте фильтр.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filteredMade.map((item) => (
            <DerivativeCard
              key={item.id}
              item={item}
              workshop={placeName(catalog.document.workshops, item.workshopId)}
              warehouse={placeName(catalog.document.warehouses, item.warehouseId)}
              showDeleted={showDeleted}
              disabled={!catalog.hydrated}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function matchesQuery(query: string, parts: string[]): boolean {
  const needle = query.trim().toLocaleLowerCase("ru-RU");
  if (!needle) {
    return true;
  }

  return parts.some((part) => part.toLocaleLowerCase("ru-RU").includes(needle));
}

function FilterBar({
  kind,
  query,
  warehouseId,
  workshopId,
  warehouses,
  workshops,
  visibleCount,
  totalCount,
  filtersOn,
  onQuery,
  onWarehouse,
  onWorkshop,
  onReset,
}: {
  kind: MaterialKind;
  query: string;
  warehouseId: string;
  workshopId: string;
  warehouses: DeletableRecord[];
  workshops: DeletableRecord[];
  visibleCount: number;
  totalCount: number;
  filtersOn: boolean;
  onQuery: (value: string) => void;
  onWarehouse: (value: string) => void;
  onWorkshop: (value: string) => void;
  onReset: () => void;
}) {
  const searchId = useId();
  const warehouseSelectId = useId();
  const workshopSelectId = useId();

  return (
    <div className="flex flex-col gap-3 border border-line bg-sheet p-3">
      <div
        className={`grid gap-3 md:items-end ${
          kind === "materials"
            ? "md:grid-cols-[minmax(0,1.4fr)_minmax(11rem,0.7fr)]"
            : "md:grid-cols-[minmax(0,1.4fr)_minmax(9rem,0.8fr)_minmax(9rem,0.8fr)]"
        }`}
      >
        <div className="min-w-0">
          <label htmlFor={searchId} className="text-sm text-muted">
            Поиск
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            autoComplete="off"
            placeholder={kind === "materials" ? "Название или бренд" : "Название"}
            onChange={(event) => onQuery(event.target.value)}
            className={`mt-1.5 ${fieldClassName}`}
          />
        </div>
        <div className="min-w-0">
          <label htmlFor={warehouseSelectId} className="text-sm text-muted">
            Склад
          </label>
          <select
            id={warehouseSelectId}
            value={warehouseId}
            onChange={(event) => onWarehouse(event.target.value)}
            className={`mt-1.5 ${fieldClassName}`}
          >
            <option value="">Все склады</option>
            {placeOptions(warehouses).map((place) => (
              <option key={place.id} value={place.id}>
                {place.deletedAt ? `${place.name} (удалён)` : place.name}
              </option>
            ))}
          </select>
        </div>
        {kind !== "materials" ? (
          <div className="min-w-0">
            <label htmlFor={workshopSelectId} className="text-sm text-muted">
              Цех
            </label>
            <select
              id={workshopSelectId}
              value={workshopId}
              onChange={(event) => onWorkshop(event.target.value)}
              className={`mt-1.5 ${fieldClassName}`}
            >
              <option value="">Все цеха</option>
              {placeOptions(workshops).map((place) => (
                <option key={place.id} value={place.id}>
                  {place.deletedAt ? `${place.name} (удалён)` : place.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>
      {filtersOn ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted">
            {visibleCount} из {totalCount}
          </p>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-11 items-center justify-center gap-2 border border-line bg-paper px-3 text-sm text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <IconClose />
            Сбросить
          </button>
        </div>
      ) : null}
    </div>
  );
}

function placeOptions(places: DeletableRecord[]): DeletableRecord[] {
  return [
    ...places.filter((place) => place.deletedAt === null),
    ...places.filter((place) => place.deletedAt !== null),
  ];
}

function KindLink({
  kind,
  current,
  showDeleted,
}: {
  kind: MaterialKind;
  current: MaterialKind;
  showDeleted: boolean;
}) {
  const selected = kind === current;
  const label =
    kind === "materials" ? "Сырьё" : kind === "products" ? "Товары" : "Производные";

  return (
    <Link
      href={materialListHref(kind, showDeleted)}
      aria-current={selected ? "page" : undefined}
      className={`inline-flex h-9 min-w-0 items-center justify-center gap-1 px-1 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:gap-2 sm:justify-start sm:px-4 ${
        selected ? "bg-ink text-white" : "text-muted hover:text-ink"
      }`}
    >
      {kind === "materials" ? (
        <IconMaterial />
      ) : kind === "products" ? (
        <IconProduct />
      ) : (
        <IconDerivative />
      )}
      {label}
    </Link>
  );
}

function MaterialCard({
  item,
  warehouse,
  showDeleted,
  disabled,
}: {
  item: RawMaterial;
  warehouse: string;
  showDeleted: boolean;
  disabled: boolean;
}) {
  const catalog = useMaterials();
  const [error, setError] = useState<string | null>(null);
  const exVat = priceExVatKopecks(item);

  function handleRestore() {
    const rejection = catalog.restoreMaterial(item.id);
    setError(rejection ? FIELD_ERROR[rejection] : null);
  }

  return (
    <li className="relative border border-line bg-sheet">
      <Link
        href={materialDetailHref(item.id)}
        aria-label={item.name}
        className="absolute inset-0 z-0 outline-none hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      />
      <div className="pointer-events-none relative z-10 flex items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-1 px-4 py-3">
          <p className="text-base font-semibold break-words text-ink">{item.name}</p>
          {item.brand ? <p className="text-sm text-muted">{item.brand}</p> : null}
          <p className="text-sm text-ink">{warehouse}</p>
          <p className="text-sm text-muted">
            {formatMoney(item.priceWithVatKopecks)} с НДС за{" "}
            {item.unit === "piece" ? "шт" : "кг"} · НДС {item.vatPercent}%
          </p>
          {exVat === null ? null : (
            <p className="text-sm text-muted">
              {formatMoney(exVat)} без НДС за {item.unit === "piece" ? "шт" : "кг"}
            </p>
          )}
          <p className="text-sm text-ink">
            {formatStockRange(item.minNormStock, item.maxNormStock, item.unit)}
          </p>
          {showDeleted ? <p className="text-sm text-muted">Удалён</p> : null}
        </div>
        <div className="pointer-events-auto pt-1 pr-1">
          <CardAction
            showDeleted={showDeleted}
            disabled={disabled}
            noun="сырьё"
            name={item.name}
            onDelete={() => catalog.removeMaterial(item.id)}
            onRestore={handleRestore}
          />
        </div>
      </div>
      {error ? <p className="relative z-10 px-4 pb-3 text-sm text-ink">{error}</p> : null}
    </li>
  );
}

function DerivativeCard({
  item,
  workshop,
  warehouse,
  showDeleted,
  disabled,
}: {
  item: Derivative;
  workshop: string;
  warehouse: string;
  showDeleted: boolean;
  disabled: boolean;
}) {
  const catalog = useMaterials();
  const [error, setError] = useState<string | null>(null);
  const cost = unitCost(catalog.document, item.id);
  const recipe = catalog.activeRecipeFor(item.id);

  function handleRestore() {
    const rejection = catalog.restoreDerivative(item.id);
    setError(rejection ? FIELD_ERROR[rejection] : null);
  }

  return (
    <li className="relative border border-line bg-sheet">
      <Link
        href={derivativeDetailHref(item.id)}
        aria-label={item.name}
        className="absolute inset-0 z-0 outline-none hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      />
      <div className="pointer-events-none relative z-10 flex items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-1 px-4 py-3">
          <p className="text-base font-semibold break-words text-ink">{item.name}</p>
          <p className="text-sm text-muted">
            {item.isFinalProduct
              ? `Конечный товар · НДС ${item.vatPercent} %`
              : "Производная"}
          </p>
          <p className="text-sm text-ink">
            {workshop} · {warehouse}
          </p>
          <p className="text-sm text-muted">{derivativeStatus(item, recipe, cost)}</p>
          {showDeleted ? <p className="text-sm text-muted">Удалён</p> : null}
        </div>
        <div className="pointer-events-auto pt-1 pr-1">
          <CardAction
            showDeleted={showDeleted}
            disabled={disabled}
            noun={item.isFinalProduct ? "товар" : "производную"}
            name={item.name}
            onDelete={() => catalog.removeDerivative(item.id)}
            onRestore={handleRestore}
          />
        </div>
      </div>
      {error ? <p className="relative z-10 px-4 pb-3 text-sm text-ink">{error}</p> : null}
    </li>
  );
}

function CardAction({
  showDeleted,
  disabled,
  noun,
  name,
  onDelete,
  onRestore,
}: {
  showDeleted: boolean;
  disabled: boolean;
  noun: string;
  name: string;
  onDelete: () => void;
  onRestore: () => void;
}) {
  if (showDeleted) {
    return (
      <button
        type="button"
        aria-label={`Вернуть ${noun} «${name}»`}
        title="Вернуть"
        disabled={disabled}
        onClick={onRestore}
        className="inline-flex size-11 items-center justify-center text-ink outline-none hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
      >
        <IconUndo />
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={`Удалить ${noun} «${name}»`}
      title="Удалить"
      disabled={disabled}
      onClick={() => {
        const confirmed = window.confirm(
          `Удалить ${noun} «${name}»? Запись пропадёт из рабочего списка. Вернуть её можно среди удалённых.`,
        );
        if (confirmed) {
          onDelete();
        }
      }}
      className="inline-flex size-11 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
    >
      <IconTrash />
    </button>
  );
}
