"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { MAX_LABEL_LENGTH } from "@/domain/document";
import { normalizeName, type NameRejection } from "@/domain/directory";
import type { DeletableRecord } from "@/domain/document";
import {
  placeDetailHref,
  placeListHref,
  type PlaceKind,
} from "@/features/directory/place-paths";
import {
  IconPlus,
  IconTrash,
  IconUndo,
  IconWarehouse,
  IconWorkshop,
} from "@/features/shell/icons";

const NAME_ERROR: Record<NameRejection, string> = {
  empty: "Укажите название.",
  "too-long": "Слишком длинное название.",
  duplicate: "Такое название уже есть.",
};

const fieldClassName =
  "h-11 w-full border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-ink focus-visible:bg-sheet focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60";

interface PlaceBoardProps {
  kind: PlaceKind;
  showDeleted: boolean;
  items: DeletableRecord[];
  deletedCount: number;
  disabled: boolean;
  onAdd: (name: string) => NameRejection | null;
  onDelete: (id: string) => void;
  onRestore: (id: string) => NameRejection | null;
}

export function PlaceBoard({
  kind,
  showDeleted,
  items,
  deletedCount,
  disabled,
  onAdd,
  onDelete,
  onRestore,
}: PlaceBoardProps) {
  const noun = kind === "workshops" ? "цех" : "склад";
  const emptyLabel = showDeleted
    ? kind === "workshops"
      ? "Удалённых цехов нет."
      : "Удалённых складов нет."
    : kind === "workshops"
      ? "Цехов нет."
      : "Складов нет.";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid grid-cols-2 border border-line bg-sheet p-1 sm:flex">
          <KindLink kind="workshops" current={kind} showDeleted={showDeleted} />
          <KindLink kind="warehouses" current={kind} showDeleted={showDeleted} />
        </div>
        <Link
          href={placeListHref(kind, !showDeleted)}
          aria-current={showDeleted ? "page" : undefined}
          className={`inline-flex h-11 items-center justify-center gap-2 border px-4 text-sm whitespace-nowrap outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
            showDeleted
              ? "border-ink bg-ink text-white"
              : "border-line bg-sheet text-ink hover:border-ink"
          }`}
        >
          <IconUndo />
          Удалённые{deletedCount > 0 ? ` ${deletedCount}` : ""}
        </Link>
      </div>

      {showDeleted ? null : (
        <AddPlaceForm kind={kind} disabled={disabled} onAdd={onAdd} />
      )}

      {items.length === 0 ? (
        <p className="border border-line bg-sheet px-4 py-4 text-sm text-muted">
          {emptyLabel}
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <PlaceCard
              key={item.id}
              item={item}
              kind={kind}
              noun={noun}
              showDeleted={showDeleted}
              disabled={disabled}
              onDelete={onDelete}
              onRestore={onRestore}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function KindLink({
  kind,
  current,
  showDeleted,
}: {
  kind: PlaceKind;
  current: PlaceKind;
  showDeleted: boolean;
}) {
  const selected = kind === current;
  const label = kind === "workshops" ? "Цеха" : "Склады";

  return (
    <Link
      href={placeListHref(kind, showDeleted)}
      aria-current={selected ? "page" : undefined}
      className={`inline-flex h-10 items-center justify-center gap-2 px-4 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
        selected ? "bg-ink text-white" : "text-muted hover:text-ink"
      }`}
    >
      {kind === "workshops" ? <IconWorkshop /> : <IconWarehouse />}
      {label}
    </Link>
  );
}

function PlaceCard({
  item,
  kind,
  noun,
  showDeleted,
  disabled,
  onDelete,
  onRestore,
}: {
  item: DeletableRecord;
  kind: PlaceKind;
  noun: string;
  showDeleted: boolean;
  disabled: boolean;
  onDelete: (id: string) => void;
  onRestore: (id: string) => NameRejection | null;
}) {
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    const confirmed = window.confirm(
      `Удалить ${noun} «${item.name}»? Он пропадёт из рабочего списка. Вернуть его можно среди удалённых.`,
    );
    if (!confirmed) {
      return;
    }

    onDelete(item.id);
  }

  function handleRestore() {
    const rejection = onRestore(item.id);
    setError(rejection ? NAME_ERROR[rejection] : null);
  }

  return (
    <li className="relative border border-line bg-sheet">
      <Link
        href={placeDetailHref(kind, item.id)}
        aria-label={item.name}
        className="absolute inset-0 z-0 outline-none hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      />
      <div className="pointer-events-none relative z-10 flex min-h-14 items-center">
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 px-4 py-2.5">
          <span className="text-base font-semibold break-words text-ink sm:text-lg">
            {item.name}
          </span>
          {showDeleted ? <span className="text-sm text-muted">Удалён</span> : null}
        </div>
        {showDeleted ? (
          <button
            type="button"
            aria-label={`Вернуть ${noun} «${item.name}»`}
            title="Вернуть"
            disabled={disabled}
            onClick={handleRestore}
            className="pointer-events-auto mr-2 inline-flex size-11 shrink-0 items-center justify-center text-ink outline-none hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
          >
            <IconUndo />
          </button>
        ) : (
          <button
            type="button"
            aria-label={`Удалить ${noun} «${item.name}»`}
            title="Удалить"
            disabled={disabled}
            onClick={handleDelete}
            className="pointer-events-auto mr-2 inline-flex size-11 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
          >
            <IconTrash />
          </button>
        )}
      </div>
      {error ? (
        <p className="pointer-events-none relative z-10 px-4 pb-3 text-sm text-ink">
          {error}
        </p>
      ) : null}
    </li>
  );
}

function AddPlaceForm({
  kind,
  disabled,
  onAdd,
}: {
  kind: PlaceKind;
  disabled: boolean;
  onAdd: (name: string) => NameRejection | null;
}) {
  const inputId = useId();
  const errorId = useId();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const canSubmit = !disabled && normalizeName(name).length > 0;
  const fieldLabel = kind === "workshops" ? "Новый цех" : "Новый склад";
  const addLabel = kind === "workshops" ? "Добавить цех" : "Добавить склад";

  function submit() {
    if (!canSubmit) {
      setError(NAME_ERROR.empty);
      return;
    }

    const rejection = onAdd(name);
    if (rejection) {
      setError(NAME_ERROR[rejection]);
      return;
    }

    setName("");
    setError(null);
  }

  return (
    <form
      className="border border-line bg-sheet px-4 py-3"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <label htmlFor={inputId} className="text-sm text-muted">
        {fieldLabel}
      </label>
      <div className="mt-1.5 flex flex-col gap-2 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <input
            id={inputId}
            value={name}
            maxLength={MAX_LABEL_LENGTH}
            disabled={disabled}
            autoComplete="off"
            placeholder="Название"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            onChange={(event) => {
              setName(event.target.value);
              setError(null);
            }}
            className={fieldClassName}
          />
          {error ? (
            <p id={errorId} className="mt-2 text-sm text-ink">
              {error}
            </p>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 bg-ink px-4 text-sm text-white outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:bg-line disabled:text-muted sm:w-auto"
        >
          <IconPlus />
          {addLabel}
        </button>
      </div>
    </form>
  );
}
