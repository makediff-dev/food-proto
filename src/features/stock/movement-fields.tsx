"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { MAX_LABEL_LENGTH, type PrototypeDocument } from "@/domain/document";
import { activeWarehouses } from "@/domain/directory";
import type { MovementHeader, StockRejection } from "@/domain/stock";
import { fieldClassName } from "@/features/materials/fields";
import { IconArrowLeft, IconTrash, IconUndo } from "@/features/shell/icons";
import { STOCK_ERROR, warehouseName } from "@/features/stock/text";

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex h-11 items-center gap-2 text-sm text-ink outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <IconArrowLeft />
      {label}
    </Link>
  );
}

export function MovementHeaderFields({
  document,
  header,
  lineCount,
  disabled,
  onCommit,
}: {
  document: PrototypeDocument;
  header: MovementHeader;
  lineCount: number;
  disabled: boolean;
  onCommit: (draft: MovementHeader) => StockRejection | null;
}) {
  const locked = lineCount > 0;
  const warehouses = activeWarehouses(document);
  const options = warehouses.some((item) => item.id === header.warehouseId)
    ? warehouses
    : [
        ...document.warehouses.filter((item) => item.id === header.warehouseId),
        ...warehouses,
      ];

  function commit(patch: Partial<MovementHeader>) {
    return onCommit({
      warehouseId: patch.warehouseId ?? header.warehouseId,
      occurredOn: patch.occurredOn ?? header.occurredOn,
      note: patch.note ?? header.note,
    });
  }

  return (
    <div className="grid gap-4 border border-line bg-sheet p-4 md:grid-cols-2">
      <DateField
        value={header.occurredOn}
        disabled={disabled}
        onCommit={(occurredOn) => commit({ occurredOn })}
      />
      <WarehouseField
        value={header.warehouseId}
        options={options.map((item) => ({
          id: item.id,
          label: item.deletedAt === null ? item.name : `${item.name} · удалён`,
        }))}
        locked={locked}
        disabled={disabled}
        onCommit={(warehouseId) => commit({ warehouseId })}
      />
      <NoteField
        value={header.note}
        disabled={disabled}
        onCommit={(note) => commit({ note })}
      />
    </div>
  );
}

function DateField({
  value,
  disabled,
  onCommit,
}: {
  value: string;
  disabled: boolean;
  onCommit: (value: string) => StockRejection | null;
}) {
  const inputId = useId();
  const errorId = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-w-0">
      <label htmlFor={inputId} className="text-sm text-muted">
        Дата
      </label>
      <input
        id={inputId}
        type="date"
        value={draft ?? value}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => {
          const next = event.target.value;
          setDraft(next);
          const rejection = onCommit(next);
          if (rejection) {
            setError(STOCK_ERROR[rejection]);
            return;
          }
          setError(null);
          setDraft(null);
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

function WarehouseField({
  value,
  options,
  locked,
  disabled,
  onCommit,
}: {
  value: string;
  options: { id: string; label: string }[];
  locked: boolean;
  disabled: boolean;
  onCommit: (value: string) => StockRejection | null;
}) {
  const inputId = useId();
  const errorId = useId();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-w-0">
      <label htmlFor={inputId} className="text-sm text-muted">
        Склад
      </label>
      <select
        id={inputId}
        value={value}
        disabled={disabled || locked}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => {
          const rejection = onCommit(event.target.value);
          setError(rejection ? STOCK_ERROR[rejection] : null);
        }}
        className={`mt-1.5 ${fieldClassName}`}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
      {locked && !disabled ? (
        <p className="mt-2 text-sm text-muted">
          Склад не меняется, пока в документе есть строки.
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function NoteField({
  value,
  disabled,
  onCommit,
}: {
  value: string;
  disabled: boolean;
  onCommit: (value: string) => StockRejection | null;
}) {
  const inputId = useId();
  const errorId = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const shown = draft ?? value;

  function commit(raw: string) {
    const rejection = onCommit(raw);
    if (rejection) {
      setError(STOCK_ERROR[rejection]);
      setDraft(raw);
      return;
    }
    setError(null);
    setDraft(null);
  }

  return (
    <div className="min-w-0 md:col-span-2">
      <label htmlFor={inputId} className="text-sm text-muted">
        Пометка
      </label>
      <input
        id={inputId}
        value={shown}
        maxLength={MAX_LABEL_LENGTH}
        disabled={disabled}
        autoComplete="off"
        placeholder="Необязательно"
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

export function DocumentActions({
  deleted,
  disabled,
  noun,
  title,
  onDelete,
  onRestore,
}: {
  deleted: boolean;
  disabled: boolean;
  noun: string;
  title: string;
  onDelete: () => void;
  onRestore: () => StockRejection | null;
}) {
  const [error, setError] = useState<string | null>(null);

  if (deleted) {
    return (
      <div className="flex flex-col items-stretch gap-2 sm:items-end">
        <button
          type="button"
          aria-label={`Вернуть ${noun} «${title}»`}
          disabled={disabled}
          onClick={() => {
            const rejection = onRestore();
            setError(rejection ? STOCK_ERROR[rejection] : null);
          }}
          className="inline-flex h-11 items-center justify-center gap-2 border border-line bg-sheet px-4 text-sm text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
        >
          <IconUndo />
          Вернуть
        </button>
        {error ? <p className="text-sm text-ink">{error}</p> : null}
      </div>
    );
  }

  return (
    <button
      type="button"
      aria-label={`Удалить ${noun} «${title}»`}
      title="Удалить"
      disabled={disabled}
      onClick={() => {
        const confirmed = window.confirm(
          `Удалить ${noun} «${title}»? Документ пропадёт из рабочего списка, количества выйдут из остатка. Вернуть можно среди удалённых.`,
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

export function warehouseOptions(
  document: PrototypeDocument,
): { id: string; label: string }[] {
  const active = activeWarehouses(document).map((item) => ({
    id: item.id,
    label: item.name,
  }));
  const deleted = document.warehouses
    .filter((item) => item.deletedAt !== null)
    .map((item) => ({ id: item.id, label: `${item.name} · удалён` }));
  return [...active, ...deleted];
}

export function placeLabel(document: PrototypeDocument, id: string): string {
  const place = document.warehouses.find((item) => item.id === id);
  if (!place) {
    return warehouseName(document, id);
  }

  return place.deletedAt === null ? place.name : `${place.name} · удалён`;
}
