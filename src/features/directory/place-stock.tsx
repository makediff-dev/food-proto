"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { priceExVatKopecks, unitCost } from "@/domain/cost";
import type {
  DeletableRecord,
  Derivative,
  PrototypeDocument,
  RawMaterial,
} from "@/domain/document";
import {
  activeRecipeFor,
  compositionGrams,
  inputGramsForFinishedBatch,
} from "@/domain/materials";
import { formatKilogramsFromGrams } from "@/domain/units";
import { fieldClassName } from "@/features/materials/fields";
import { formatStockRange, formatVatPair } from "@/features/materials/money";
import { derivativeDetailHref, materialDetailHref } from "@/features/materials/paths";
import { IconClose } from "@/features/shell/icons";

type StockMode = "warehouse" | "workshop";
type EntryKind = "material" | "derivative" | "product";

interface StockEntry {
  id: string;
  kind: EntryKind;
  name: string;
  search: string;
  href: string;
  kindLabel: string;
  aside: string;
  figure: string;
  warehouseId: string;
}

export function PlaceStock({
  mode,
  placeId,
  document,
}: {
  mode: StockMode;
  placeId: string;
  document: PrototypeDocument;
}) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<EntryKind | "">("");
  const [warehouseId, setWarehouseId] = useState("");
  const title = mode === "warehouse" ? "Содержимое" : "Производится";
  const entries = collect(document, mode, placeId);
  const visible = entries.filter(
    (entry) =>
      matchesQuery(query, entry.search) &&
      (!kind || entry.kind === kind) &&
      (mode === "warehouse" || !warehouseId || entry.warehouseId === warehouseId),
  );
  const filtersOn =
    query.trim().length > 0 ||
    Boolean(kind) ||
    (mode === "workshop" && Boolean(warehouseId));

  function resetFilters() {
    setQuery("");
    setKind("");
    setWarehouseId("");
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-ink">{title}</h2>

      {entries.length > 0 ? (
        <FilterBar
          mode={mode}
          query={query}
          kind={kind}
          warehouseId={warehouseId}
          warehouses={document.warehouses}
          visibleCount={visible.length}
          totalCount={entries.length}
          filtersOn={filtersOn}
          onQuery={setQuery}
          onKind={setKind}
          onWarehouse={setWarehouseId}
          onReset={resetFilters}
        />
      ) : null}

      {entries.length === 0 ? (
        <p className="text-sm leading-6 text-muted">{emptyCopy(mode)}</p>
      ) : visible.length === 0 ? (
        <p className="text-sm leading-6 text-muted">
          Ничего не найдено. Измените поиск или сбросьте фильтр.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((entry) => (
            <li key={`${entry.kind}:${entry.id}`}>
              <Link
                href={entry.href}
                className="flex h-full flex-col gap-1 border border-line bg-sheet px-4 py-3 outline-none hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <p className="text-base font-semibold break-words text-ink">
                  {entry.name}
                </p>
                <p className="text-sm text-muted">{entry.kindLabel}</p>
                {entry.aside ? <p className="text-sm text-ink">{entry.aside}</p> : null}
                <p className="text-sm text-muted">{entry.figure}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function FilterBar({
  mode,
  query,
  kind,
  warehouseId,
  warehouses,
  visibleCount,
  totalCount,
  filtersOn,
  onQuery,
  onKind,
  onWarehouse,
  onReset,
}: {
  mode: StockMode;
  query: string;
  kind: EntryKind | "";
  warehouseId: string;
  warehouses: DeletableRecord[];
  visibleCount: number;
  totalCount: number;
  filtersOn: boolean;
  onQuery: (value: string) => void;
  onKind: (value: EntryKind | "") => void;
  onWarehouse: (value: string) => void;
  onReset: () => void;
}) {
  const searchId = useId();
  const kindId = useId();
  const warehouseSelectId = useId();

  return (
    <div className="flex flex-col gap-3 border border-line bg-sheet p-3">
      <div
        className={`grid gap-3 md:items-end ${
          mode === "workshop"
            ? "md:grid-cols-[minmax(0,1.4fr)_minmax(9rem,0.8fr)_minmax(9rem,0.8fr)]"
            : "md:grid-cols-[minmax(0,1.4fr)_minmax(11rem,0.7fr)]"
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
            placeholder={mode === "warehouse" ? "Название или бренд" : "Название"}
            onChange={(event) => onQuery(event.target.value)}
            className={`mt-1.5 ${fieldClassName}`}
          />
        </div>
        <div className="min-w-0">
          <label htmlFor={kindId} className="text-sm text-muted">
            Вид
          </label>
          <select
            id={kindId}
            value={kind}
            onChange={(event) => onKind(event.target.value as EntryKind | "")}
            className={`mt-1.5 ${fieldClassName}`}
          >
            <option value="">Все</option>
            {mode === "warehouse" ? <option value="material">Сырьё</option> : null}
            <option value="derivative">Производные</option>
            <option value="product">Товары</option>
          </select>
        </div>
        {mode === "workshop" ? (
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
              {orderedPlaces(warehouses).map((place) => (
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

function collect(
  document: PrototypeDocument,
  mode: StockMode,
  placeId: string,
): StockEntry[] {
  const materials =
    mode === "warehouse"
      ? document.materials.filter(
          (item) => item.warehouseId === placeId && item.deletedAt === null,
        )
      : [];
  const made = document.derivatives.filter(
    (item) =>
      item.deletedAt === null &&
      (mode === "warehouse" ? item.warehouseId === placeId : item.workshopId === placeId),
  );

  return [
    ...materials.map((item) => materialEntry(item)),
    ...made
      .filter((item) => !item.isFinalProduct)
      .map((item) => derivativeEntry(document, item, mode)),
    ...made
      .filter((item) => item.isFinalProduct)
      .map((item) => derivativeEntry(document, item, mode)),
  ];
}

function materialEntry(item: RawMaterial): StockEntry {
  const exVat = priceExVatKopecks(item);
  const unit = item.unit === "piece" ? "шт" : "кг";

  return {
    id: item.id,
    kind: "material",
    name: item.name,
    search: `${item.name} ${item.brand}`,
    href: materialDetailHref(item.id),
    kindLabel: "Сырьё",
    aside: [item.brand, formatStockRange(item.minNormStock, item.maxNormStock, item.unit)]
      .filter((part) => part.length > 0)
      .join(" · "),
    figure:
      exVat === null
        ? "Цена не считается"
        : formatVatPair(item.priceWithVatKopecks, exVat, unit),
    warehouseId: item.warehouseId,
  };
}

function derivativeEntry(
  document: PrototypeDocument,
  item: Derivative,
  mode: StockMode,
): StockEntry {
  const recipe = activeRecipeFor(document, item.id);
  const cost = unitCost(document, item.id);
  const aside =
    mode === "warehouse"
      ? placeLabel(document.workshops, item.workshopId)
      : placeLabel(document.warehouses, item.warehouseId);

  return {
    id: item.id,
    kind: item.isFinalProduct ? "product" : "derivative",
    name: item.name,
    search: item.name,
    href: derivativeDetailHref(item.id),
    kindLabel: item.isFinalProduct
      ? `Конечный товар · НДС ${item.vatPercent} %`
      : "Производная",
    aside,
    figure: derivativeFigure(item, recipe, cost),
    warehouseId: item.warehouseId,
  };
}

function derivativeFigure(
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

function placeLabel(places: readonly DeletableRecord[], id: string): string {
  const place = places.find((item) => item.id === id);
  if (!place) {
    return "Не найдено";
  }

  return place.deletedAt ? `${place.name} (удалён)` : place.name;
}

function orderedPlaces(places: DeletableRecord[]): DeletableRecord[] {
  return [
    ...places.filter((place) => place.deletedAt === null),
    ...places.filter((place) => place.deletedAt !== null),
  ];
}

function matchesQuery(query: string, search: string): boolean {
  const needle = query.trim().toLocaleLowerCase("ru-RU");
  if (!needle) {
    return true;
  }

  return search.toLocaleLowerCase("ru-RU").includes(needle);
}

function emptyCopy(mode: StockMode): string {
  return mode === "warehouse"
    ? "На складе ничего не хранится."
    : "В цехе ничего не производится.";
}
