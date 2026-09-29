"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { MAX_LABEL_LENGTH, MAX_VAT_PERCENT, MIN_VAT_PERCENT } from "@/domain/document";
import { activeWarehouses, activeWorkshops, normalizeName } from "@/domain/directory";
import type { FieldRejection } from "@/domain/materials";
import {
  FIELD_ERROR,
  fieldClassName,
  parseWholePercent,
} from "@/features/materials/fields";
import { materialListHref } from "@/features/materials/paths";
import { RecipeEditor } from "@/features/materials/recipe-editor";
import { UsedIn } from "@/features/materials/used-in";
import { useMaterials } from "@/features/materials/use-materials";
import { IconArrowLeft, IconTrash, IconUndo } from "@/features/shell/icons";
import { PageFrame } from "@/features/shell/page-frame";

export function DerivativeDetailScreen({ id }: { id: string }) {
  const catalog = useMaterials();
  const item = [...catalog.derivatives, ...catalog.deletedDerivatives].find(
    (entry) => entry.id === id,
  );

  if (!catalog.hydrated) {
    return (
      <PageFrame title="Производная" lede="Запись открывается.">
        {null}
      </PageFrame>
    );
  }

  if (!item) {
    return (
      <PageFrame title="Производная" lede="Такой записи нет.">
        <BackLink href={materialListHref("derivatives", false)} />
      </PageFrame>
    );
  }

  const deleted = item.deletedAt !== null;

  return (
    <PageFrame
      title={item.name}
      lede={
        deleted
          ? "Запись удалена. Её можно вернуть в рабочий список."
          : item.isFinalProduct
            ? "Конечный товар делается в одном цехе. Ставка НДС нужна, чтобы планировать выручку."
            : "Производная делается в одном цехе. Состав задаётся на 100 кг готового продукта, выход после обработки задаёт массу сырья."
      }
    >
      <BackLink
        href={materialListHref(item.isFinalProduct ? "products" : "derivatives", deleted)}
      />
      <div className="mt-3 border border-line bg-sheet">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2">
          <p className="text-sm text-muted">
            {deleted ? "Удалено" : item.isFinalProduct ? "Конечный товар" : "Производная"}
          </p>
          {deleted ? (
            <RestoreControl
              label={`Вернуть «${item.name}»`}
              disabled={!catalog.hydrated}
              onRestore={() => catalog.restoreDerivative(item.id)}
            />
          ) : (
            <button
              type="button"
              aria-label={`Удалить «${item.name}»`}
              title="Удалить"
              disabled={!catalog.hydrated}
              onClick={() => {
                const confirmed = window.confirm(
                  `Удалить «${item.name}»? Запись пропадёт из рабочего списка. Вернуть её можно среди удалённых.`,
                );
                if (confirmed) {
                  catalog.removeDerivative(item.id);
                }
              }}
              className="inline-flex size-11 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
            >
              <IconTrash />
            </button>
          )}
        </div>
        <IdentityFields id={item.id} />
      </div>
      <RecipeEditor derivative={item} />
      {item.isFinalProduct ? null : <UsedIn kind="derivative" refId={item.id} />}
    </PageFrame>
  );
}

function IdentityFields({ id }: { id: string }) {
  const catalog = useMaterials();
  const item = catalog.document.derivatives.find((entry) => entry.id === id);
  const nameId = useId();
  const warehouseId = useId();
  const workshopId = useId();
  const vatId = useId();
  const [nameDraft, setNameDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [vatDraft, setVatDraft] = useState<string | null>(null);

  if (!item) {
    return null;
  }

  const warehouses = withCurrent(
    activeWarehouses(catalog.document),
    catalog.document.warehouses,
    item.warehouseId,
  );
  const workshops = withCurrent(
    activeWorkshops(catalog.document),
    catalog.document.workshops,
    item.workshopId,
  );

  function save(patch: {
    name?: string;
    warehouseId?: string;
    workshopId?: string;
    vatPercent?: number | null;
  }): FieldRejection | null {
    if (!item) {
      return "missing";
    }

    return catalog.updateDerivative(item.id, {
      name: patch.name ?? item.name,
      isFinalProduct: item.isFinalProduct,
      warehouseId: patch.warehouseId ?? item.warehouseId,
      workshopId: patch.workshopId ?? item.workshopId,
      vatPercent:
        patch.vatPercent !== undefined
          ? patch.vatPercent
          : item.isFinalProduct
            ? item.vatPercent
            : null,
    });
  }

  return (
    <div className="grid lg:grid-cols-2">
      <div className="border-t border-line px-4 py-3">
        <label htmlFor={nameId} className="text-sm text-muted">
          Название
        </label>
        <input
          id={nameId}
          value={nameDraft ?? item.name}
          maxLength={MAX_LABEL_LENGTH}
          disabled={!catalog.hydrated}
          autoComplete="off"
          onFocus={() => {
            setNameDraft(item.name);
            setError(null);
          }}
          onChange={(event) => setNameDraft(event.target.value)}
          onBlur={(event) => {
            if (normalizeName(event.currentTarget.value) === item.name) {
              setNameDraft(null);
              return;
            }
            const rejection = save({ name: event.currentTarget.value });
            if (rejection) {
              setError(FIELD_ERROR[rejection]);
              setNameDraft(event.currentTarget.value);
              return;
            }
            setNameDraft(null);
          }}
          className={`mt-1.5 ${fieldClassName}`}
        />
      </div>
      {item.isFinalProduct ? (
        <div className="border-t border-line px-4 py-3">
          <label htmlFor={vatId} className="text-sm text-muted">
            НДС, %
          </label>
          <input
            id={vatId}
            value={vatDraft ?? String(item.vatPercent ?? "")}
            inputMode="numeric"
            disabled={!catalog.hydrated}
            autoComplete="off"
            onFocus={() => {
              setVatDraft(String(item.vatPercent ?? ""));
              setError(null);
            }}
            onChange={(event) => setVatDraft(event.target.value)}
            onBlur={(event) => {
              const parsed = parseWholePercent(event.currentTarget.value);
              if (
                parsed === null ||
                parsed < MIN_VAT_PERCENT ||
                parsed > MAX_VAT_PERCENT
              ) {
                setError(FIELD_ERROR.vat);
                setVatDraft(event.currentTarget.value);
                return;
              }
              if (parsed === item.vatPercent) {
                setVatDraft(null);
                setError(null);
                return;
              }
              const rejection = save({ vatPercent: parsed });
              if (rejection) {
                setError(FIELD_ERROR[rejection]);
                setVatDraft(event.currentTarget.value);
                return;
              }
              setVatDraft(null);
              setError(null);
            }}
            className={`mt-1.5 ${fieldClassName}`}
          />
        </div>
      ) : null}
      <PlaceSelect
        id={warehouseId}
        label="Склад хранения"
        value={item.warehouseId}
        disabled={!catalog.hydrated}
        options={warehouses}
        onChange={(warehouseIdValue) => {
          const rejection = save({ warehouseId: warehouseIdValue });
          setError(rejection ? FIELD_ERROR[rejection] : null);
        }}
      />
      <PlaceSelect
        id={workshopId}
        label="Цех производства"
        value={item.workshopId}
        disabled={!catalog.hydrated}
        options={workshops}
        onChange={(workshopIdValue) => {
          const rejection = save({ workshopId: workshopIdValue });
          setError(rejection ? FIELD_ERROR[rejection] : null);
        }}
      />
      {error ? (
        <p className="border-t border-line px-4 py-3 text-sm text-ink lg:col-span-2">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function withCurrent<T extends { id: string; name: string; deletedAt: string | null }>(
  active: readonly T[],
  all: readonly T[],
  currentId: string,
): T[] {
  if (active.some((item) => item.id === currentId)) {
    return [...active];
  }

  const current = all.find((item) => item.id === currentId);
  return current ? [current, ...active] : [...active];
}

function PlaceSelect({
  id,
  label,
  value,
  disabled,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  disabled: boolean;
  options: { id: string; name: string; deletedAt: string | null }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="border-t border-line px-4 py-3">
      <label htmlFor={id} className="text-sm text-muted">
        {label}
      </label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-1.5 ${fieldClassName}`}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.deletedAt ? `${option.name} (удалён)` : option.name}
          </option>
        ))}
      </select>
    </div>
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
