"use client";

import Link from "next/link";
import { useId, useState } from "react";

import type { Delivery, PrototypeDocument, WriteOff } from "@/domain/document";
import { deliveryTotal, writeOffLoss, type StockRejection } from "@/domain/stock";
import { fieldClassName } from "@/features/materials/fields";
import { formatMoney } from "@/features/materials/money";
import { IconClose, IconUndo } from "@/features/shell/icons";
import { Labeled } from "@/features/stock/figures";
import { deliveryHref, writeOffHref } from "@/features/stock/paths";
import { formatOccurredOn, lineCountLabel, warehouseName } from "@/features/stock/text";
import { useStock } from "@/features/stock/use-stock";
import { placeLabel, warehouseOptions } from "@/features/stock/movement-fields";
import { STOCK_ERROR } from "@/features/stock/text";

type JournalMode = "deliveries" | "write-offs";

export function JournalBoard({
  mode,
  showDeleted,
  lockedWarehouseId,
}: {
  mode: JournalMode;
  showDeleted: boolean;
  lockedWarehouseId?: string;
}) {
  const stock = useStock();
  const hideWarehouse = Boolean(lockedWarehouseId);
  const items = (
    mode === "deliveries"
      ? showDeleted
        ? stock.deletedDeliveries
        : stock.deliveries
      : showDeleted
        ? stock.deletedWriteOffs
        : stock.writeOffs
  )
    .filter((item) => !lockedWarehouseId || item.warehouseId === lockedWarehouseId)
    .slice()
    .sort(byDateDesc);
  const [query, setQuery] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const filtersOn =
    query.trim().length > 0 ||
    (!hideWarehouse && warehouseId.length > 0) ||
    from.length > 0 ||
    to.length > 0;
  const visible = items.filter((item) =>
    matches(
      stock.document,
      mode,
      item,
      query,
      hideWarehouse ? "" : warehouseId,
      from,
      to,
    ),
  );

  if (items.length === 0) {
    return (
      <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
        {emptyCopy(mode, showDeleted, hideWarehouse)}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <FilterBar
        query={query}
        warehouseId={warehouseId}
        from={from}
        to={to}
        options={warehouseOptions(stock.document)}
        hideWarehouse={hideWarehouse}
        visibleCount={visible.length}
        totalCount={items.length}
        filtersOn={filtersOn}
        onQuery={setQuery}
        onWarehouse={setWarehouseId}
        onFrom={setFrom}
        onTo={setTo}
        onReset={() => {
          setQuery("");
          setWarehouseId("");
          setFrom("");
          setTo("");
        }}
      />
      {visible.length === 0 ? (
        <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
          Ничего не найдено. Измените поиск или сбросьте фильтр.
        </p>
      ) : (
        <div className="overflow-x-auto border border-line bg-sheet">
          <div
            className={`hidden w-full gap-3 border-b border-line px-4 py-3 text-sm text-muted lg:grid ${journalMinWidth(showDeleted, hideWarehouse)} ${journalColumns(showDeleted, hideWarehouse)}`}
          >
            <span>Дата</span>
            {hideWarehouse ? null : <span>Склад</span>}
            <span>Пометка</span>
            <span className="text-right">С НДС</span>
            <span className="text-right">Без НДС</span>
            {showDeleted ? <span className="sr-only">Вернуть</span> : null}
          </div>
          <ul className={journalMinWidth(showDeleted, hideWarehouse)}>
            {visible.map((item) => (
              <JournalCard
                key={item.id}
                mode={mode}
                item={item}
                document={stock.document}
                showDeleted={showDeleted}
                hideWarehouse={hideWarehouse}
                disabled={!stock.hydrated}
                onRestore={() =>
                  mode === "deliveries"
                    ? stock.restoreDelivery(item.id)
                    : stock.restoreWriteOff(item.id)
                }
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function journalColumns(showDeleted: boolean, hideWarehouse: boolean): string {
  if (hideWarehouse) {
    return showDeleted
      ? "lg:grid-cols-[7.5rem_minmax(0,1.4fr)_8.5rem_8.5rem_2.75rem]"
      : "lg:grid-cols-[7.5rem_minmax(0,1.4fr)_8.5rem_8.5rem]";
  }

  return showDeleted
    ? "lg:grid-cols-[7.5rem_minmax(8rem,0.9fr)_minmax(0,1.2fr)_8.5rem_8.5rem_2.75rem]"
    : "lg:grid-cols-[7.5rem_minmax(8rem,0.9fr)_minmax(0,1.2fr)_8.5rem_8.5rem]";
}

function journalMinWidth(showDeleted: boolean, hideWarehouse: boolean): string {
  if (hideWarehouse) {
    return showDeleted ? "lg:min-w-[40rem]" : "lg:min-w-[36rem]";
  }

  return showDeleted ? "lg:min-w-[52rem]" : "lg:min-w-[48rem]";
}

function emptyCopy(mode: JournalMode, showDeleted: boolean, locked: boolean): string {
  if (showDeleted) {
    return mode === "deliveries" ? "Удалённых поставок нет." : "Удалённых списаний нет.";
  }

  if (locked) {
    return mode === "deliveries"
      ? "На этом складе поставок нет. Добавьте поставку: сырьё, количество и реальная себестоимость с НДС."
      : "На этом складе списаний нет. Добавьте списание.";
  }

  return mode === "deliveries"
    ? "Поставок нет. Добавьте поставку: сырьё, количество и реальная себестоимость с НДС."
    : "Списаний нет. Добавьте списание с одного склада.";
}

function byDateDesc(
  left: { occurredOn: string; id: string },
  right: { occurredOn: string; id: string },
) {
  if (left.occurredOn !== right.occurredOn) {
    return left.occurredOn < right.occurredOn ? 1 : -1;
  }

  return left.id < right.id ? 1 : -1;
}

function matches(
  document: PrototypeDocument,
  mode: JournalMode,
  item: Delivery | WriteOff,
  query: string,
  warehouseId: string,
  from: string,
  to: string,
): boolean {
  if (warehouseId && item.warehouseId !== warehouseId) {
    return false;
  }
  if (from && item.occurredOn < from) {
    return false;
  }
  if (to && item.occurredOn > to) {
    return false;
  }

  const needle = query.trim().toLocaleLowerCase("ru-RU");
  if (!needle) {
    return true;
  }

  const names = movementNames(document, mode, item);
  const haystack = [
    item.occurredOn,
    formatOccurredOn(item.occurredOn),
    warehouseName(document, item.warehouseId),
    item.note,
    ...names,
  ]
    .join("\n")
    .toLocaleLowerCase("ru-RU");

  return haystack.includes(needle);
}

function movementNames(
  document: PrototypeDocument,
  mode: JournalMode,
  item: Delivery | WriteOff,
): string[] {
  if (mode === "deliveries") {
    const delivery = item as Delivery;
    return delivery.lines.map(
      (line) =>
        document.materials.find((material) => material.id === line.materialId)?.name ??
        "",
    );
  }

  const writeOff = item as WriteOff;
  return writeOff.lines.map((line) => {
    if (line.kind === "material") {
      return document.materials.find((entry) => entry.id === line.refId)?.name ?? "";
    }

    return document.derivatives.find((entry) => entry.id === line.refId)?.name ?? "";
  });
}

function cardMoney(
  document: PrototypeDocument,
  mode: JournalMode,
  item: Delivery | WriteOff,
): { withVatKopecks: number; exVatKopecks: number } | string {
  if (mode === "write-offs") {
    const loss = writeOffLoss(document, item as WriteOff);
    if (item.lines.length > 0 && loss.unknownLineIds.length === item.lines.length) {
      return "Не считается";
    }
    return loss;
  }

  return deliveryTotal(document, item as Delivery) ?? "Не считается";
}

function JournalCard({
  mode,
  item,
  document,
  showDeleted,
  hideWarehouse,
  disabled,
  onRestore,
}: {
  mode: JournalMode;
  item: Delivery | WriteOff;
  document: PrototypeDocument;
  showDeleted: boolean;
  hideWarehouse: boolean;
  disabled: boolean;
  onRestore: () => StockRejection | null;
}) {
  const [error, setError] = useState<string | null>(null);
  const noun = mode === "deliveries" ? "поставку" : "списание";
  const title = formatOccurredOn(item.occurredOn);
  const href = mode === "deliveries" ? deliveryHref(item.id) : writeOffHref(item.id);
  const money = cardMoney(document, mode, item);
  const note = item.note || "—";
  const linesLabel =
    item.lines.length === 0 ? "Строк нет" : lineCountLabel(item.lines.length);
  const rowClass = `relative border-b border-line last:border-b-0 hover:bg-paper lg:grid lg:w-full lg:items-center lg:gap-3 lg:px-4 lg:py-3 ${journalMinWidth(showDeleted, hideWarehouse)} ${journalColumns(showDeleted, hideWarehouse)}`;

  return (
    <li className={rowClass}>
      <Link
        href={href}
        aria-label={`${mode === "deliveries" ? "Поставка" : "Списание"} ${title}`}
        className="absolute inset-0 z-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      />
      <div className="pointer-events-none relative z-10 px-4 pt-4 lg:px-0 lg:pt-0">
        <div className="text-sm text-muted lg:sr-only">Дата</div>
        <div className="mt-1 text-base font-semibold text-ink lg:mt-0 lg:text-sm">
          {title}
          {showDeleted ? (
            <span className="ml-2 text-sm font-normal text-muted">Удалён</span>
          ) : null}
          <div className="text-sm font-normal text-muted">{linesLabel}</div>
        </div>
      </div>
      {hideWarehouse ? null : (
        <Labeled label="Склад">{placeLabel(document, item.warehouseId)}</Labeled>
      )}
      <Labeled label="Пометка">
        <span className="break-words">{note}</span>
      </Labeled>
      {typeof money === "string" ? (
        <div className="relative z-10 px-4 pb-4 text-sm text-muted lg:col-span-2 lg:px-0 lg:pb-0 lg:text-right">
          {money}
        </div>
      ) : (
        <>
          <Labeled label="С НДС" align="end">
            {formatMoney(money.withVatKopecks)}
          </Labeled>
          <Labeled label="Без НДС" align="end">
            {formatMoney(money.exVatKopecks)}
          </Labeled>
        </>
      )}
      {showDeleted ? (
        <div className="relative z-10 px-4 pb-4 lg:px-0 lg:pb-0">
          <button
            type="button"
            aria-label={`Вернуть ${noun} ${title}`}
            title="Вернуть"
            disabled={disabled}
            onClick={() => {
              const rejection = onRestore();
              setError(rejection ? STOCK_ERROR[rejection] : null);
            }}
            className="inline-flex size-11 items-center justify-center text-ink outline-none hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
          >
            <IconUndo />
          </button>
          {error ? <p className="text-sm text-ink">{error}</p> : null}
        </div>
      ) : null}
    </li>
  );
}

function FilterBar({
  query,
  warehouseId,
  from,
  to,
  options,
  hideWarehouse,
  visibleCount,
  totalCount,
  filtersOn,
  onQuery,
  onWarehouse,
  onFrom,
  onTo,
  onReset,
}: {
  query: string;
  warehouseId: string;
  from: string;
  to: string;
  options: { id: string; label: string }[];
  hideWarehouse: boolean;
  visibleCount: number;
  totalCount: number;
  filtersOn: boolean;
  onQuery: (value: string) => void;
  onWarehouse: (value: string) => void;
  onFrom: (value: string) => void;
  onTo: (value: string) => void;
  onReset: () => void;
}) {
  const searchId = useId();
  const warehouseSelectId = useId();
  const fromId = useId();
  const toId = useId();

  return (
    <div className="flex flex-col gap-4 border border-line bg-sheet p-4">
      <div
        className={
          hideWarehouse
            ? "grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1.4fr)_minmax(10rem,0.7fr)_minmax(10rem,0.7fr)]"
            : "grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        }
      >
        <div
          className={
            hideWarehouse
              ? "min-w-0 md:col-span-2 xl:col-span-1"
              : "min-w-0 md:col-span-2 xl:col-span-1"
          }
        >
          <label htmlFor={searchId} className="text-sm text-muted">
            Поиск
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            autoComplete="off"
            placeholder={
              hideWarehouse
                ? "Дата, пометка или название"
                : "Дата, склад, пометка или название"
            }
            onChange={(event) => onQuery(event.target.value)}
            className={`mt-1.5 ${fieldClassName}`}
          />
        </div>
        {hideWarehouse ? null : (
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
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="min-w-0">
          <label htmlFor={fromId} className="text-sm text-muted">
            Дата с
          </label>
          <input
            id={fromId}
            type="date"
            value={from}
            onChange={(event) => onFrom(event.target.value)}
            className={`mt-1.5 ${fieldClassName}`}
          />
        </div>
        <div className="min-w-0">
          <label htmlFor={toId} className="text-sm text-muted">
            Дата по
          </label>
          <input
            id={toId}
            type="date"
            value={to}
            onChange={(event) => onTo(event.target.value)}
            className={`mt-1.5 ${fieldClassName}`}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Показано {visibleCount} из {totalCount}
        </p>
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
  );
}
