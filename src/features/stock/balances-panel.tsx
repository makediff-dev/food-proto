"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { isMonthKey } from "@/domain/document";
import { plannedRequirement, plannedRequirements } from "@/domain/production-plan";
import { activeSalesPlans, horizonMonths, monthKeyFromDate } from "@/domain/sales-plan";
import type { BalanceRow, StockLevel } from "@/domain/stock";
import { materialsToReorder, stockLevel, warehouseBalances } from "@/domain/stock";
import { fieldClassName, primaryButtonClassName } from "@/features/materials/fields";
import { derivativeDetailHref, materialDetailHref } from "@/features/materials/paths";
import {
  IconClose,
  IconEye,
  IconEyeOff,
  IconLamp,
  IconOrder,
} from "@/features/shell/icons";
import { formatMonth } from "@/features/sales/text";
import { stockHref, ALL_WAREHOUSES } from "@/features/stock/paths";
import { ReorderDialog } from "@/features/stock/reorder-dialog";
import { formatQuantity, formatQuantityNumber, unitWord } from "@/features/stock/text";
import { useStock } from "@/features/stock/use-stock";

type KindFilter = "" | "material" | "derivative" | "product";

export function BalancesPanel({
  warehouseId,
  month,
  lockedWarehouseId,
}: {
  warehouseId: string;
  month: string;
  lockedWarehouseId?: string;
}) {
  const stock = useStock();
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const locked = Boolean(lockedWarehouseId);
  const [localMonth, setLocalMonth] = useState(currentMonth);
  const selectedMonth = locked
    ? isMonthKey(localMonth)
      ? localMonth
      : currentMonth
    : isMonthKey(month)
      ? month
      : currentMonth;
  const monthParam = selectedMonth === currentMonth ? "" : selectedMonth;
  const [reorderOpen, setReorderOpen] = useState(false);
  const places = stock.document.warehouses.filter(
    (item) => item.deletedAt === null || hasMovement(stock.document, item.id),
  );
  const lockedPlace = locked
    ? stock.document.warehouses.find((item) => item.id === lockedWarehouseId)
    : undefined;
  const selected = locked
    ? (lockedWarehouseId ?? "")
    : warehouseId === ALL_WAREHOUSES
      ? ALL_WAREHOUSES
      : places.some((item) => item.id === warehouseId)
        ? warehouseId
        : (places[0]?.id ?? "");
  const orderPlaces = locked
    ? lockedPlace
      ? [lockedPlace]
      : []
    : selected === ALL_WAREHOUSES
      ? places
      : places.filter((item) => item.id === selected);
  const orderCount = orderPlaces.reduce(
    (sum, place) => sum + materialsToReorder(stock.document, place.id).length,
    0,
  );

  useEffect(() => {
    if (locked || !selected || selected === warehouseId) {
      return;
    }

    router.replace(stockHref("balances", false, selected, monthParam));
  }, [locked, monthParam, router, selected, warehouseId]);

  if (!locked && places.length === 0) {
    return (
      <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
        Складов нет. Добавьте склад в разделе «Цеха и склады».
      </p>
    );
  }

  if (locked && !lockedPlace) {
    return (
      <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
        Такого склада нет.
      </p>
    );
  }

  const orderLabel = orderCount > 0 ? `К заказу ${orderCount}` : "К заказу";

  return (
    <div className="flex flex-col gap-4">
      {locked ? null : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" aria-label="Склад">
            <Link
              href={stockHref("balances", false, ALL_WAREHOUSES, monthParam)}
              aria-current={selected === ALL_WAREHOUSES ? "page" : undefined}
              className={chipClass(selected === ALL_WAREHOUSES)}
            >
              Все
            </Link>
            {places.map((place) => {
              const current = place.id === selected;
              return (
                <Link
                  key={place.id}
                  href={stockHref("balances", false, place.id, monthParam)}
                  aria-current={current ? "page" : undefined}
                  className={chipClass(current)}
                >
                  {place.deletedAt === null ? place.name : `${place.name} · удалён`}
                </Link>
              );
            })}
          </div>
          {selected ? (
            <button
              type="button"
              onClick={() => setReorderOpen(true)}
              className={primaryButtonClassName}
            >
              <IconOrder />
              {orderLabel}
            </button>
          ) : null}
        </div>
      )}
      {selected ? (
        <BalanceList
          warehouseId={selected}
          month={selectedMonth}
          orderLabel={locked ? orderLabel : undefined}
          onOrder={locked ? () => setReorderOpen(true) : undefined}
          onMonth={(next) => {
            if (locked) {
              setLocalMonth(next);
              return;
            }

            router.replace(
              stockHref("balances", false, selected, next === currentMonth ? "" : next),
            );
          }}
        />
      ) : null}
      {reorderOpen && selected ? (
        <ReorderDialog
          places={orderPlaces.map((place) => ({
            id: place.id,
            name: place.deletedAt === null ? place.name : `${place.name} · удалён`,
          }))}
          grouped={selected === ALL_WAREHOUSES}
          onClose={() => setReorderOpen(false)}
        />
      ) : null}
    </div>
  );
}

function chipClass(current: boolean): string {
  return `inline-flex h-11 items-center px-4 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${current
      ? "bg-ink text-white"
      : "border border-line bg-sheet text-ink hover:border-ink"
    }`;
}

function hasMovement(
  document: ReturnType<typeof useStock>["document"],
  warehouseId: string,
): boolean {
  return (
    document.deliveries.some(
      (item) => item.deletedAt === null && item.warehouseId === warehouseId,
    ) ||
    document.writeOffs.some(
      (item) => item.deletedAt === null && item.warehouseId === warehouseId,
    )
  );
}

function BalanceList({
  warehouseId,
  month,
  onMonth,
  orderLabel,
  onOrder,
}: {
  warehouseId: string;
  month: string;
  onMonth: (month: string) => void;
  orderLabel?: string;
  onOrder?: () => void;
}) {
  const stock = useStock();
  const today = useMemo(() => new Date(), []);
  const showWarehouse = warehouseId === ALL_WAREHOUSES;
  const places = stock.document.warehouses.filter(
    (item) => item.deletedAt === null || hasMovement(stock.document, item.id),
  );
  const rows = showWarehouse
    ? places.flatMap((place) => warehouseBalances(stock.document, place.id))
    : warehouseBalances(stock.document, warehouseId);
  const required = useMemo(
    () => plannedRequirements(stock.document, month),
    [month, stock.document],
  );
  const months = useMemo(() => {
    const values = new Set<string>([
      ...horizonMonths(today),
      ...activeSalesPlans(stock.document).map((item) => item.month),
    ]);
    if (isMonthKey(month)) {
      values.add(month);
    }

    return [...values].sort();
  }, [month, stock.document, today]);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<KindFilter>("");
  const [hideZero, setHideZero] = useState(false);
  const filtersOn = query.trim().length > 0 || kind !== "";
  const visible = rows.filter((row) => {
    if (hideZero && row.balance === 0) {
      return false;
    }
    if (kind === "material" && row.kind !== "material") {
      return false;
    }
    if (kind === "derivative" && (row.kind !== "derivative" || row.isFinalProduct)) {
      return false;
    }
    if (kind === "product" && !row.isFinalProduct) {
      return false;
    }
    const needle = query.trim().toLocaleLowerCase("ru-RU");
    if (!needle) {
      return true;
    }
    const warehouseName = warehouseLabel(stock.document, row.warehouseId);
    return `${row.name}\n${warehouseName}`.toLocaleLowerCase("ru-RU").includes(needle);
  });

  if (rows.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        {onOrder && orderLabel ? (
          <div className="flex sm:justify-end">
            <OrderButton label={orderLabel} onClick={onOrder} />
          </div>
        ) : null}
        <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
          {showWarehouse
            ? "Нет сырья, производных и товаров."
            : "На этом складе нет сырья, производных и товаров. Остаток появится из поставок."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <BalanceFilters
        query={query}
        kind={kind}
        month={month}
        months={months}
        hideZero={hideZero}
        visibleCount={visible.length}
        totalCount={rows.length}
        filtersOn={filtersOn}
        onQuery={setQuery}
        onKind={setKind}
        onMonth={onMonth}
        onHideZero={setHideZero}
        orderLabel={orderLabel}
        onOrder={onOrder}
        onReset={() => {
          setQuery("");
          setKind("");
          setHideZero(false);
        }}
      />
      {visible.length === 0 ? (
        <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
          {hideZero && rows.every((row) => row.balance === 0)
            ? "Ненулевых остатков нет. Нажмите «Показать нулевые» или добавьте поставку."
            : "Ничего не найдено. Измените поиск или сбросьте фильтр."}
        </p>
      ) : (
        <>
          <ul className="flex flex-col gap-4 md:hidden">
            {visible.map((row) => (
              <li key={rowKey(row)} className="border border-line bg-sheet p-4">
                <BalanceName row={row} />
                <p className="mt-1 text-sm text-muted">
                  {showWarehouse
                    ? `${kindLabel(row)} · ${warehouseLabel(stock.document, row.warehouseId)}`
                    : kindLabel(row)}
                </p>
                <dl className="mt-4 border-t border-line pt-3">
                  <div>
                    <dt className="text-sm text-muted">Текущее</dt>
                    <dd className="mt-1 flex items-center gap-2 text-base font-semibold text-ink">
                      <LevelMark level={rowLevel(stock.document, row)} />
                      {formatQuantity(row.balance, row.unit)}
                    </dd>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-muted">Минимум</dt>
                      <dd className="mt-1 text-ink">
                        {formatNorm(stock.document, row, true)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted">Максимум</dt>
                      <dd className="mt-1 text-ink">
                        {formatNorm(stock.document, row, false)}
                      </dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-muted">Требуется в месяце</dt>
                      <dd className="mt-1 text-ink">
                        {formatRequirement(required, row, true)}
                      </dd>
                    </div>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
          <div className="hidden overflow-x-auto border border-line bg-sheet md:block">
            <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line text-muted">
                  <th className="px-4 py-3 font-normal">Название</th>
                  {showWarehouse ? (
                    <th className="px-4 py-3 font-normal">Склад</th>
                  ) : null}
                  <th className="px-4 py-3 font-normal">Вид</th>
                  <th className="px-4 py-3 text-right font-normal">Минимум</th>
                  <th className="px-4 py-3 text-right font-normal">Максимум</th>
                  <th className="px-4 py-3 text-right font-semibold text-ink">Текущее</th>
                  <th className="px-4 py-3 text-right font-normal">Требуется в месяце</th>
                  <th className="px-4 py-3 font-normal">Единица</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => (
                  <tr key={rowKey(row)} className="border-b border-line last:border-b-0">
                    <td className="px-4 py-3">
                      <BalanceName row={row} />
                    </td>
                    {showWarehouse ? (
                      <td className="px-4 py-3 text-ink">
                        {warehouseLabel(stock.document, row.warehouseId)}
                      </td>
                    ) : null}
                    <td className="px-4 py-3 text-muted">{kindLabel(row)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink">
                      {formatNormNumber(stock.document, row, true)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink">
                      {formatNormNumber(stock.document, row, false)}
                    </td>
                    <td className="px-4 py-3 text-right text-base font-semibold tabular-nums text-ink">
                      <span className="inline-flex items-center justify-end gap-2">
                        <LevelMark level={rowLevel(stock.document, row)} />
                        {formatQuantityNumber(row.balance, row.unit)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink">
                      {formatRequirement(required, row, false)}
                    </td>
                    <td className="px-4 py-3 text-ink">{unitWord(row.unit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function rowKey(row: BalanceRow): string {
  return `${row.warehouseId}:${row.kind}:${row.refId}`;
}

function warehouseLabel(
  document: ReturnType<typeof useStock>["document"],
  warehouseId: string,
): string {
  const place = document.warehouses.find((item) => item.id === warehouseId);
  if (!place) {
    return "Склад";
  }

  return place.deletedAt === null ? place.name : `${place.name} · удалён`;
}

function rowNorms(
  document: ReturnType<typeof useStock>["document"],
  row: BalanceRow,
): { min: number; max: number } | null {
  if (row.kind !== "material") {
    return null;
  }

  const material = document.materials.find((item) => item.id === row.refId);
  if (!material) {
    return null;
  }

  return { min: material.minNormStock, max: material.maxNormStock };
}

function rowLevel(
  document: ReturnType<typeof useStock>["document"],
  row: BalanceRow,
): StockLevel | null {
  const norms = rowNorms(document, row);
  if (!norms) {
    return null;
  }

  return stockLevel(row.balance, norms.min, norms.max);
}

function formatNorm(
  document: ReturnType<typeof useStock>["document"],
  row: BalanceRow,
  minimum: boolean,
): string {
  const norms = rowNorms(document, row);
  if (!norms) {
    return "—";
  }

  return formatQuantity(minimum ? norms.min : norms.max, row.unit);
}

function formatNormNumber(
  document: ReturnType<typeof useStock>["document"],
  row: BalanceRow,
  minimum: boolean,
): string {
  const norms = rowNorms(document, row);
  if (!norms) {
    return "—";
  }

  return formatQuantityNumber(minimum ? norms.min : norms.max, row.unit);
}

function formatRequirement(
  required: Map<string, number> | null,
  row: BalanceRow,
  withUnit: boolean,
): string {
  const quantity = plannedRequirement(required, row.warehouseId, row.kind, row.refId);
  if (quantity === null) {
    return "—";
  }

  return withUnit
    ? formatQuantity(quantity, row.unit)
    : formatQuantityNumber(quantity, row.unit);
}

function LevelMark({ level }: { level: StockLevel | null }) {
  if (!level) {
    return null;
  }

  const low = level === "low";

  return (
    <span
      className={low ? "text-[#b42318]" : "text-[#c2410c]"}
      title={low ? "Ниже минимума" : "Выше максимума"}
    >
      <span className="sr-only">{low ? "Ниже минимума" : "Выше максимума"}</span>
      <IconLamp />
    </span>
  );
}

function kindLabel(row: BalanceRow): string {
  if (row.kind === "material") {
    return row.deleted ? "Сырьё · удалено" : "Сырьё";
  }
  if (row.isFinalProduct) {
    return row.deleted ? "Товар · удалён" : "Товар";
  }
  return row.deleted ? "Производная · удалена" : "Производная";
}

function BalanceName({ row }: { row: BalanceRow }) {
  const href =
    row.kind === "material"
      ? materialDetailHref(row.refId)
      : derivativeDetailHref(row.refId);

  return (
    <Link
      href={href}
      className="font-semibold break-words text-ink outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      {row.name}
    </Link>
  );
}

function OrderButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={primaryButtonClassName}>
      <IconOrder />
      {label}
    </button>
  );
}

function BalanceFilters({
  query,
  kind,
  month,
  months,
  hideZero,
  visibleCount,
  totalCount,
  filtersOn,
  onQuery,
  onKind,
  onMonth,
  onHideZero,
  onReset,
  orderLabel,
  onOrder,
}: {
  query: string;
  kind: KindFilter;
  month: string;
  months: string[];
  hideZero: boolean;
  visibleCount: number;
  totalCount: number;
  filtersOn: boolean;
  onQuery: (value: string) => void;
  onKind: (value: KindFilter) => void;
  onMonth: (month: string) => void;
  onHideZero: (value: boolean) => void;
  onReset: () => void;
  orderLabel?: string;
  onOrder?: () => void;
}) {
  const searchId = useId();
  const kindId = useId();
  const monthId = useId();

  return (
    <div className="flex flex-col gap-4 border border-line bg-sheet p-4">
      <div
        className={
          onOrder
            ? "grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(9rem,0.7fr)_minmax(11rem,0.8fr)_auto] md:items-end"
            : "grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(11rem,0.7fr)_minmax(12rem,0.8fr)] md:items-end"
        }
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
            placeholder="Название"
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
            onChange={(event) => onKind(event.target.value as KindFilter)}
            className={`mt-1.5 ${fieldClassName}`}
          >
            <option value="">Все</option>
            <option value="material">Сырьё</option>
            <option value="derivative">Производные</option>
            <option value="product">Товары</option>
          </select>
        </div>
        <div className="min-w-0">
          <label htmlFor={monthId} className="text-sm text-muted">
            Месяц
          </label>
          <select
            id={monthId}
            value={month}
            onChange={(event) => onMonth(event.target.value)}
            className={`mt-1.5 ${fieldClassName}`}
          >
            {months.map((item) => (
              <option key={item} value={item}>
                {formatMonth(item)}
              </option>
            ))}
          </select>
        </div>
        {onOrder && orderLabel ? (
          <div className="md:justify-self-end">
            <OrderButton label={orderLabel} onClick={onOrder} />
          </div>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Показано {visibleCount} из {totalCount}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={hideZero}
            onClick={() => onHideZero(!hideZero)}
            className="inline-flex h-11 items-center justify-center gap-2 border border-line bg-paper px-4 text-sm text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {hideZero ? <IconEye /> : <IconEyeOff />}
            {hideZero ? "Показать нулевые" : "Скрыть нулевые"}
          </button>
          {filtersOn ? (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex h-11 items-center justify-center gap-2 border border-line bg-paper px-4 text-sm text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <IconClose />
              Сбросить
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
