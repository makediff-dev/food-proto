"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { priceExVatKopecks } from "@/domain/cost";
import { MAX_LABEL_LENGTH, type RawMaterial } from "@/domain/document";
import { activeWarehouses, normalizeName } from "@/domain/directory";
import type { FieldRejection } from "@/domain/materials";
import { formatRublesFromKopecks } from "@/domain/units";
import {
  FIELD_ERROR,
  fieldClassName,
  parseKopecks,
  parseStockQuantity,
  parseWholePercent,
} from "@/features/materials/fields";
import { formatStockAmount } from "@/features/materials/money";
import { materialListHref } from "@/features/materials/paths";
import { UsedIn } from "@/features/materials/used-in";
import { useMaterials } from "@/features/materials/use-materials";
import { IconArrowLeft, IconTrash, IconUndo } from "@/features/shell/icons";
import { PageFrame } from "@/features/shell/page-frame";

export function MaterialDetailScreen({ id }: { id: string }) {
  const catalog = useMaterials();
  const item = [...catalog.materials, ...catalog.deletedMaterials].find(
    (entry) => entry.id === id,
  );

  if (!catalog.hydrated) {
    return (
      <PageFrame title="Сырьё" lede="Запись открывается.">
        {null}
      </PageFrame>
    );
  }

  if (!item) {
    return (
      <PageFrame title="Сырьё" lede="Такой записи нет.">
        <BackLink href={materialListHref("materials", false)} />
      </PageFrame>
    );
  }

  const material = item;
  const deleted = material.deletedAt !== null;
  const exVat = priceExVatKopecks(material);
  const warehouses = activeWarehouses(catalog.document);
  const warehouseOptions =
    item.warehouseId && !warehouses.some((place) => place.id === item.warehouseId)
      ? [
          ...catalog.document.warehouses.filter((place) => place.id === item.warehouseId),
          ...warehouses,
        ]
      : warehouses;

  function save(patch: Partial<RawMaterial>): FieldRejection | null {
    return catalog.updateMaterial(material.id, {
      name: patch.name ?? material.name,
      brand: patch.brand ?? material.brand,
      warehouseId: patch.warehouseId ?? material.warehouseId,
      unit: patch.unit ?? material.unit,
      priceWithVatKopecks: patch.priceWithVatKopecks ?? material.priceWithVatKopecks,
      vatPercent: patch.vatPercent ?? material.vatPercent,
      minNormStock: patch.minNormStock ?? material.minNormStock,
      maxNormStock: patch.maxNormStock ?? material.maxNormStock,
    });
  }

  return (
    <PageFrame
      title={item.name}
      lede={
        deleted
          ? "Сырьё удалено. Его можно вернуть в рабочий список."
          : "Цена без НДС считается из цены с НДС и ставки."
      }
    >
      <BackLink href={materialListHref("materials", deleted)} />
      <div className="mt-3 border border-line bg-sheet">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2">
          <p className="text-sm text-muted">{deleted ? "Сырьё, удалено" : "Сырьё"}</p>
          {deleted ? (
            <RestoreControl
              label={`Вернуть сырьё «${item.name}»`}
              disabled={!catalog.hydrated}
              onRestore={() => catalog.restoreMaterial(item.id)}
            />
          ) : (
            <button
              type="button"
              aria-label={`Удалить сырьё «${item.name}»`}
              title="Удалить"
              disabled={!catalog.hydrated}
              onClick={() => {
                const confirmed = window.confirm(
                  `Удалить сырьё «${item.name}»? Оно пропадёт из рабочего списка. Вернуть его можно среди удалённых.`,
                );
                if (confirmed) {
                  catalog.removeMaterial(item.id);
                }
              }}
              className="inline-flex size-11 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
            >
              <IconTrash />
            </button>
          )}
        </div>
        <div className="grid gap-0 lg:grid-cols-2">
          <TextCommit
            label="Название"
            value={item.name}
            maxLength={MAX_LABEL_LENGTH}
            disabled={!catalog.hydrated}
            onCommit={(name) => {
              if (normalizeName(name) === item.name) {
                return null;
              }
              return save({ name });
            }}
          />
          <TextCommit
            label="Бренд, производитель"
            hint="Справочно"
            value={item.brand}
            maxLength={MAX_LABEL_LENGTH}
            disabled={!catalog.hydrated}
            onCommit={(brand) => {
              if (brand.trim() === item.brand) {
                return null;
              }
              return save({ brand });
            }}
          />
          <SelectCommit
            label="Склад хранения"
            value={item.warehouseId}
            disabled={!catalog.hydrated}
            options={warehouseOptions.map((place) => ({
              id: place.id,
              label: place.deletedAt ? `${place.name} (удалён)` : place.name,
            }))}
            onCommit={(warehouseId) => save({ warehouseId })}
          />
          <SelectCommit
            label="Единица"
            value={item.unit}
            disabled={!catalog.hydrated}
            options={[
              { id: "kg", label: "кг" },
              { id: "piece", label: "шт" },
            ]}
            onCommit={(unit) => save({ unit: unit === "piece" ? "piece" : "kg" })}
          />
          <NumberCommit
            label={`Плановая цена закупки с НДС, ₽/${item.unit === "piece" ? "шт" : "кг"}`}
            value={formatRublesFromKopecks(item.priceWithVatKopecks)}
            disabled={!catalog.hydrated}
            parse={parseKopecks}
            invalidMessage={FIELD_ERROR.price}
            onCommit={(priceWithVatKopecks) => {
              if (priceWithVatKopecks === item.priceWithVatKopecks) {
                return null;
              }
              return save({ priceWithVatKopecks });
            }}
          />
          <NumberCommit
            label={`Минимальный нормативный остаток, ${item.unit === "piece" ? "шт" : "кг"}`}
            value={formatStockAmount(item.minNormStock, item.unit)}
            disabled={!catalog.hydrated}
            parse={(raw) => parseStockQuantity(raw, item.unit)}
            invalidMessage={FIELD_ERROR.stock}
            onCommit={(minNormStock) => {
              if (minNormStock === item.minNormStock) {
                return null;
              }
              return save({ minNormStock });
            }}
          />
          <NumberCommit
            label={`Максимальный нормативный остаток, ${item.unit === "piece" ? "шт" : "кг"}`}
            value={formatStockAmount(item.maxNormStock, item.unit)}
            disabled={!catalog.hydrated}
            parse={(raw) => parseStockQuantity(raw, item.unit)}
            invalidMessage={FIELD_ERROR.stock}
            onCommit={(maxNormStock) => {
              if (maxNormStock === item.maxNormStock) {
                return null;
              }
              return save({ maxNormStock });
            }}
          />
          <NumberCommit
            label="НДС, %"
            value={String(item.vatPercent)}
            disabled={!catalog.hydrated}
            parse={parseWholePercent}
            invalidMessage={FIELD_ERROR.vat}
            onCommit={(vatPercent) => {
              if (vatPercent === item.vatPercent) {
                return null;
              }
              return save({ vatPercent });
            }}
          />
          <div className="border-t border-line px-4 py-3">
            <p className="text-sm text-muted">Цена закупки</p>
            <p className="mt-1.5 text-base text-ink">
              {formatRublesFromKopecks(item.priceWithVatKopecks, true)} с НДС за{" "}
              {item.unit === "piece" ? "шт" : "кг"}
            </p>
            <p className="text-base text-ink">
              {exVat === null
                ? "Цена без НДС не считается"
                : `${formatRublesFromKopecks(exVat, true)} без НДС за ${item.unit === "piece" ? "шт" : "кг"}`}
            </p>
          </div>
        </div>
      </div>
      <UsedIn kind="material" refId={material.id} />
    </PageFrame>
  );
}

function BackLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex h-8 items-center gap-2 text-sm text-ink outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <IconArrowLeft />К списку
    </Link>
  );
}

function RestoreControl({
  label,
  disabled,
  onRestore,
}: {
  label: string;
  disabled: boolean;
  onRestore: () => FieldRejection | null;
}) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        aria-label={label}
        title="Вернуть"
        disabled={disabled}
        onClick={() => {
          const rejection = onRestore();
          setError(rejection ? FIELD_ERROR[rejection] : null);
        }}
        className="inline-flex size-11 items-center justify-center text-ink outline-none hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
      >
        <IconUndo />
      </button>
      {error ? <p className="max-w-48 text-right text-sm text-ink">{error}</p> : null}
    </div>
  );
}

function TextCommit({
  label,
  hint,
  value,
  maxLength,
  disabled,
  onCommit,
}: {
  label: string;
  hint?: string;
  value: string;
  maxLength: number;
  disabled: boolean;
  onCommit: (value: string) => FieldRejection | null;
}) {
  const inputId = useId();
  const errorId = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const shown = draft ?? value;

  function commit(raw: string) {
    const rejection = onCommit(raw);
    if (rejection) {
      setError(FIELD_ERROR[rejection]);
      setDraft(raw);
      return;
    }
    setDraft(null);
    setError(null);
  }

  return (
    <div className="border-t border-line px-4 py-3">
      <label htmlFor={inputId} className="text-sm text-muted">
        {label}
        {hint ? ` · ${hint}` : ""}
      </label>
      <input
        id={inputId}
        value={shown}
        maxLength={maxLength}
        disabled={disabled}
        autoComplete="off"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onFocus={() => {
          setDraft(value);
          setError(null);
        }}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={(event) => commit(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
        }}
        className={`mt-1.5 ${fieldClassName}`}
      />
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function NumberCommit({
  label,
  value,
  disabled,
  parse,
  invalidMessage,
  onCommit,
}: {
  label: string;
  value: string;
  disabled: boolean;
  parse: (raw: string) => number | null;
  invalidMessage: string;
  onCommit: (value: number) => FieldRejection | null;
}) {
  const inputId = useId();
  const errorId = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const shown = draft ?? value;

  function commit(raw: string) {
    const parsed = parse(raw);
    if (parsed === null) {
      setError(invalidMessage);
      setDraft(raw);
      return;
    }

    const rejection = onCommit(parsed);
    if (rejection) {
      setError(FIELD_ERROR[rejection]);
      setDraft(raw);
      return;
    }

    setDraft(null);
    setError(null);
  }

  return (
    <div className="border-t border-line px-4 py-3">
      <label htmlFor={inputId} className="text-sm text-muted">
        {label}
      </label>
      <input
        id={inputId}
        value={shown}
        inputMode="decimal"
        disabled={disabled}
        autoComplete="off"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onFocus={() => {
          setDraft(value);
          setError(null);
        }}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={(event) => commit(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
        }}
        className={`mt-1.5 ${fieldClassName}`}
      />
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SelectCommit({
  label,
  value,
  disabled,
  options,
  onCommit,
}: {
  label: string;
  value: string;
  disabled: boolean;
  options: { id: string; label: string }[];
  onCommit: (value: string) => FieldRejection | null;
}) {
  const inputId = useId();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="border-t border-line px-4 py-3">
      <label htmlFor={inputId} className="text-sm text-muted">
        {label}
      </label>
      <select
        id={inputId}
        value={value}
        disabled={disabled}
        onChange={(event) => {
          const rejection = onCommit(event.target.value);
          setError(rejection ? FIELD_ERROR[rejection] : null);
        }}
        className={`mt-1.5 ${fieldClassName}`}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="mt-2 text-sm text-ink">{error}</p> : null}
    </div>
  );
}
