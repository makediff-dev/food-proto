"use client";

import { useId, useState, type ReactNode } from "react";

import type { DeletableRecord } from "@/domain/document";
import { formatMoney } from "@/features/materials/money";
import { IconTrash, IconUndo } from "@/features/shell/icons";

export const gridFieldClassName =
  "w-full min-w-0 cursor-text appearance-none border-0 bg-transparent p-0 text-sm text-ink shadow-none outline-none";

export const gridSelectClassName =
  "w-full min-w-0 max-w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-sm text-ink shadow-none outline-none";

export const editableCellClassName = "bg-[#e4e4e0]";

const HANGING_WORDS = new Set([
  "а",
  "без",
  "бы",
  "в",
  "во",
  "для",
  "до",
  "же",
  "за",
  "и",
  "из",
  "к",
  "ко",
  "ли",
  "на",
  "не",
  "ни",
  "но",
  "о",
  "об",
  "от",
  "по",
  "под",
  "при",
  "с",
  "со",
  "у",
]);

export function keepWithNext(text: string): string {
  const parts = text.split(" ");
  let line = "";
  for (let index = 0; index < parts.length; index += 1) {
    line += parts[index] ?? "";
    if (index === parts.length - 1) {
      break;
    }
    const bare = (parts[index] ?? "")
      .toLowerCase()
      .replace(/^[^a-zа-яё]+|[^a-zа-яё]+$/gi, "");
    line += HANGING_WORDS.has(bare) ? "\u00A0" : " ";
  }
  return line;
}

export function ColumnLabel({ label }: { label: string }) {
  const chunks = keepWithNext(label).split(" ");
  return (
    <span className="mx-auto block w-min text-center">
      {chunks.map((chunk, index) => (
        <span key={`${index}:${chunk}`} className="block whitespace-nowrap">
          {chunk}
        </span>
      ))}
    </span>
  );
}

export function CatalogTable({
  caption,
  children,
}: {
  caption: string;
  children: ReactNode;
}) {
  return (
    <div className="max-h-[calc(100dvh-16rem)] contain-paint overflow-auto border border-line bg-sheet">
      <table className="w-max min-w-full border-separate border-spacing-0 text-sm">
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  );
}

export function HeadCell({
  label,
  sticky = false,
  stickyLeft = "left-0",
  align = "center",
  className = "",
}: {
  label: string;
  sticky?: boolean;
  stickyLeft?: "left-0" | "left-10";
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={`border-b border-b-line border-r border-r-line bg-paper px-1.5 py-2 align-middle text-sm font-normal leading-5 text-muted last:border-r-0 ${
        sticky
          ? `sticky ${stickyLeft} z-40 w-px max-w-max whitespace-nowrap`
          : "w-px whitespace-normal"
      } ${align === "left" ? "text-left" : "text-center"} ${className}`}
    >
      {align === "left" ? label : <ColumnLabel label={label} />}
    </th>
  );
}

export function DataCell({
  children,
  editable = false,
  sticky = false,
  stickyLeft = "left-0",
  align = "right",
  className = "",
}: {
  children: ReactNode;
  editable?: boolean;
  sticky?: boolean;
  stickyLeft?: "left-0" | "left-10";
  align?: "left" | "right" | "center";
  className?: string;
}) {
  return (
    <td
      className={`border-b border-b-line border-r border-r-line px-1.5 py-2 align-middle last:border-r-0 ${
        sticky
          ? `sticky ${stickyLeft} z-10 w-px max-w-max ${editable ? "" : "bg-sheet"}`
          : "w-px"
      } ${
        align === "left" ? "text-left" : align === "center" ? "text-center" : "text-right"
      } ${editable ? editableCellClassName : ""} ${className}`}
      onClick={(event) => {
        if (!editable) {
          return;
        }
        const field = event.currentTarget.querySelector("input, select");
        if (
          (field instanceof HTMLInputElement || field instanceof HTMLSelectElement) &&
          document.activeElement !== field
        ) {
          field.focus();
        }
      }}
    >
      {children}
    </td>
  );
}

export function GridNumber({
  label,
  value,
  disabled,
  inputMode,
  unit,
  invalidMessage,
  parse,
  onCommit,
  align = "right",
}: {
  label: string;
  value: string;
  disabled: boolean;
  inputMode: "decimal" | "numeric";
  unit?: string;
  invalidMessage: string;
  parse: (raw: string) => number | null;
  onCommit: (value: number) => string | null;
  align?: "left" | "right";
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
      setError(rejection);
      setDraft(raw);
      return;
    }

    setDraft(null);
    setError(null);
  }

  if (disabled) {
    return (
      <>
        <span className="sr-only">{label}</span>
        <span className="whitespace-nowrap">
          {shown}
          {unit ? ` ${unit}` : ""}
        </span>
      </>
    );
  }

  return (
    <div className="min-w-0">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div
        className={`flex items-baseline gap-1 ${
          align === "right" ? "justify-end" : "justify-start"
        }`}
      >
        <input
          id={inputId}
          value={shown}
          inputMode={inputMode}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onFocus={() => {
            setDraft(sanitizeDraft(value, inputMode));
            setError(null);
          }}
          onChange={(event) => setDraft(sanitizeDraft(event.target.value, inputMode))}
          onBlur={(event) => commit(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.currentTarget.blur();
            }
          }}
          className={`${gridFieldClassName} ${align === "right" ? "text-right" : "text-left"}`}
        />
        {unit ? <span className="shrink-0 text-sm text-ink">{unit}</span> : null}
      </div>
      {error ? (
        <p id={errorId} className="mt-1 text-sm text-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function GridText({
  label,
  value,
  disabled,
  maxLength,
  onCommit,
}: {
  label: string;
  value: string;
  disabled: boolean;
  maxLength?: number;
  onCommit: (value: string) => string | null;
}) {
  const inputId = useId();
  const errorId = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const shown = draft ?? value;

  function commit(raw: string) {
    const rejection = onCommit(raw);
    if (rejection) {
      setError(rejection);
      setDraft(raw);
      return;
    }
    setDraft(null);
    setError(null);
  }

  if (disabled) {
    return (
      <>
        <span className="sr-only">{label}</span>
        <span className="block max-w-56 min-w-32 whitespace-nowrap text-ink">
          {value || "—"}
        </span>
      </>
    );
  }

  return (
    <div className="min-w-32 max-w-56">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <input
        id={inputId}
        value={shown}
        maxLength={maxLength}
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
        className={`${gridFieldClassName} text-left`}
      />
      {error ? (
        <p id={errorId} className="mt-1 text-sm text-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function GridSelect({
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
  onCommit: (value: string) => string | null;
}) {
  const inputId = useId();
  const [error, setError] = useState<string | null>(null);
  const current = options.find((option) => option.id === value);

  if (disabled) {
    return (
      <>
        <span className="sr-only">{label}</span>
        <span className="whitespace-nowrap text-ink">{current?.label ?? "—"}</span>
      </>
    );
  }

  return (
    <div className="min-w-28">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <select
        id={inputId}
        value={value}
        onChange={(event) => {
          const rejection = onCommit(event.target.value);
          setError(rejection);
        }}
        className={gridSelectClassName}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-sm text-ink">{error}</p> : null}
    </div>
  );
}

export function StackedPair({
  topLabel,
  bottomLabel,
  top,
  bottom,
  topHighlighted = false,
}: {
  topLabel: string;
  bottomLabel: string;
  top: ReactNode;
  bottom: ReactNode;
  topHighlighted?: boolean;
}) {
  return (
    <div className="-mx-1.5 -my-2 flex min-w-18 flex-col">
      <div
        className={`flex flex-col items-end border-b border-line px-1.5 py-1 ${
          topHighlighted ? editableCellClassName : ""
        }`}
      >
        <span className="text-[0.5rem] leading-none text-muted">{topLabel}</span>
        {top}
      </div>
      <div className="flex flex-col items-end px-1.5 py-1">
        <span className="text-[0.5rem] leading-none text-muted">{bottomLabel}</span>
        {bottom}
      </div>
    </div>
  );
}

export function VatPair({ withVat, exVat }: { withVat: ReactNode; exVat: ReactNode }) {
  return (
    <StackedPair topLabel="с НДС" bottomLabel="без НДС" top={withVat} bottom={exVat} />
  );
}

export function MoneyAmount({ kopecks }: { kopecks: number }) {
  return <span className="whitespace-nowrap">{formatMoney(kopecks)}</span>;
}

export function Empty() {
  return <span className="text-muted">—</span>;
}

export function placeLabel(places: readonly DeletableRecord[], id: string): string {
  const place = places.find((item) => item.id === id);
  if (!place) {
    return "Не найдено";
  }

  return place.deletedAt ? `${place.name} (удалён)` : place.name;
}

export function placeChoices(
  places: readonly DeletableRecord[],
  currentId?: string,
): { id: string; label: string }[] {
  const active = places.filter((place) => place.deletedAt === null);
  const current = currentId ? places.find((place) => place.id === currentId) : undefined;
  const list =
    current && !active.some((place) => place.id === current.id)
      ? [current, ...active]
      : active;
  return list.map((place) => ({
    id: place.id,
    label: place.deletedAt ? `${place.name} (удалён)` : place.name,
  }));
}

export function RowAction({
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
  onRestore: () => string | null;
}) {
  const [error, setError] = useState<string | null>(null);

  if (showDeleted) {
    return (
      <div className="flex flex-col items-end">
        <button
          type="button"
          aria-label={`Вернуть ${noun} «${name}»`}
          title="Вернуть"
          disabled={disabled}
          onClick={() => {
            const rejection = onRestore();
            setError(rejection);
          }}
          className="inline-flex size-8 items-center justify-center text-ink outline-none hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
        >
          <IconUndo />
        </button>
        {error ? <p className="max-w-40 text-right text-sm text-ink">{error}</p> : null}
      </div>
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
      className="inline-flex size-8 cursor-pointer items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-default disabled:opacity-60"
    >
      <IconTrash />
    </button>
  );
}

function sanitizeDraft(raw: string, mode: "decimal" | "numeric"): string {
  let result = "";
  let hasComma = false;

  for (const char of raw) {
    if (char >= "0" && char <= "9") {
      result += char;
      continue;
    }

    if (mode === "decimal" && (char === "," || char === ".") && !hasComma) {
      result += ",";
      hasComma = true;
    }
  }

  return result;
}
