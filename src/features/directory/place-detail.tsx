"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { MAX_LABEL_LENGTH } from "@/domain/document";
import { normalizeName, type NameRejection } from "@/domain/directory";
import { placeListHref, type PlaceKind } from "@/features/directory/place-paths";
import { PlaceStock } from "@/features/directory/place-stock";
import { usePlaces } from "@/features/directory/use-places";
import { PageFrame } from "@/features/shell/page-frame";
import { IconArrowLeft, IconTrash, IconUndo } from "@/features/shell/icons";
import { WarehouseStock } from "@/features/stock/stock-screen";

const NAME_ERROR: Record<NameRejection, string> = {
  empty: "Укажите название.",
  "too-long": "Слишком длинное название.",
  duplicate: "Такое название уже есть.",
};

export function PlaceDetailScreen({ kind, id }: { kind: PlaceKind; id: string }) {
  const places = usePlaces(kind);
  const item = [...places.active, ...places.deleted].find((entry) => entry.id === id);
  const noun = kind === "workshops" ? "цех" : "склад";
  const kindLabel = kind === "workshops" ? "Цех" : "Склад";

  if (!places.hydrated) {
    return (
      <PageFrame title={kindLabel} lede="Запись открывается.">
        {null}
      </PageFrame>
    );
  }

  if (!item) {
    return (
      <PageFrame title={kindLabel} lede="Такой записи нет.">
        <BackLink href={placeListHref(kind, false)} label="К списку" />
      </PageFrame>
    );
  }

  const deleted = item.deletedAt !== null;

  return (
    <PageFrame
      title={item.name}
      wide={kind === "warehouses"}
      lede={
        deleted
          ? `${kindLabel} удалён. Его можно вернуть в рабочий список.`
          : kind === "workshops"
            ? "Здесь производят производные и товары."
            : "Сырьё, производные и товары, поставки, списания и остатки этого склада."
      }
    >
      <div
        className={
          kind === "warehouses" ? "flex min-w-0 flex-col gap-6" : "flex flex-col gap-3"
        }
      >
        <BackLink href={placeListHref(kind, deleted)} label="К списку" />
        <div className="border border-line bg-sheet">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2">
            <p className="text-sm text-muted">
              {deleted ? `${kindLabel}, удалён` : kindLabel}
            </p>
            {deleted ? (
              <RestoreButton
                label={`Вернуть ${noun} «${item.name}»`}
                disabled={!places.hydrated}
                onRestore={() => places.restore(item.id)}
              />
            ) : (
              <button
                type="button"
                aria-label={`Удалить ${noun} «${item.name}»`}
                title="Удалить"
                disabled={!places.hydrated}
                onClick={() => {
                  const confirmed = window.confirm(
                    `Удалить ${noun} «${item.name}»? Он пропадёт из рабочего списка. Вернуть его можно среди удалённых.`,
                  );
                  if (confirmed) {
                    places.remove(item.id);
                  }
                }}
                className="inline-flex size-11 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
              >
                <IconTrash />
              </button>
            )}
          </div>
          <NameField
            name={item.name}
            disabled={!places.hydrated}
            onRename={(name) => places.rename(item.id, name)}
          />
          {kind === "workshops" ? (
            <section className="border-t border-line px-4 py-3">
              <h2 className="text-base font-semibold text-ink">Товарооборот</h2>
              <p className="mt-1 text-sm leading-5 text-muted">Появится здесь.</p>
            </section>
          ) : null}
        </div>
        <PlaceStock
          mode={kind === "workshops" ? "workshop" : "warehouse"}
          placeId={item.id}
          document={places.document}
        />
        {kind === "warehouses" ? (
          <section className="flex min-w-0 flex-col gap-3">
            <div>
              <h2 className="text-base font-semibold text-ink">Складской учет</h2>
              <p className="mt-1 max-w-2xl text-sm leading-5 text-muted">
                Поставки, списания, расход и приход, остатки — только этого склада.
              </p>
            </div>
            <WarehouseStock key={item.id} warehouseId={item.id} />
          </section>
        ) : null}
      </div>
    </PageFrame>
  );
}

function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex h-8 items-center gap-2 text-sm text-ink outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <IconArrowLeft />
      {label}
    </Link>
  );
}

function RestoreButton({
  label,
  disabled,
  onRestore,
}: {
  label: string;
  disabled: boolean;
  onRestore: () => NameRejection | null;
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
          setError(rejection ? NAME_ERROR[rejection] : null);
        }}
        className="inline-flex size-11 items-center justify-center text-ink outline-none hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
      >
        <IconUndo />
      </button>
      {error ? <p className="max-w-48 text-right text-sm text-ink">{error}</p> : null}
    </div>
  );
}

function NameField({
  name,
  disabled,
  onRename,
}: {
  name: string;
  disabled: boolean;
  onRename: (name: string) => NameRejection | null;
}) {
  const inputId = useId();
  const errorId = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const shown = draft ?? name;

  function commit(raw: string) {
    if (normalizeName(raw) === name) {
      setDraft(null);
      setError(null);
      return;
    }

    const rejection = onRename(raw);
    if (rejection) {
      setError(NAME_ERROR[rejection]);
      setDraft(raw);
      return;
    }

    setDraft(null);
    setError(null);
  }

  return (
    <div className="px-4 py-3">
      <label htmlFor={inputId} className="text-sm text-muted">
        Название
      </label>
      <input
        id={inputId}
        value={shown}
        maxLength={MAX_LABEL_LENGTH}
        disabled={disabled}
        autoComplete="off"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onFocus={() => {
          setDraft(name);
          setError(null);
        }}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={(event) => {
          commit(event.currentTarget.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
        }}
        className="mt-1.5 h-10 w-full border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-ink focus-visible:bg-sheet focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
      />
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}
