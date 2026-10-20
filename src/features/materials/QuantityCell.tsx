'use client';

import { useId, useState } from 'react';

import { formatQuantity, formatQuantityDraft, parseQuantityInput } from '@/features/materials/text';
import { TableNumber } from '@/features/table';
import { gridFieldClassName } from '@/features/table/styles';

export function QuantityRead({
  value,
  unit,
  signed = false,
}: {
  value: number | null;
  unit?: string;
  signed?: boolean;
}) {
  if (value === null) {
    return <span className="text-muted">—</span>;
  }

  return (
    <TableNumber value={value} signed={signed}>
      {formatQuantity(value, unit)}
    </TableNumber>
  );
}

export function QuantityCell({
  label,
  value,
  unit,
  allowNegative = false,
  blankIfZero = false,
  onChange,
}: {
  label: string;
  value: number;
  unit?: string;
  allowNegative?: boolean;
  /** Ноль показывается пустой клеткой. Пустой ввод сохраняется как ноль. */
  blankIfZero?: boolean;
  onChange: (value: number) => string | null;
}) {
  const inputId = useId();
  const errorId = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const shown = draft ?? (blankIfZero && value === 0 ? '' : formatQuantityDraft(value));

  function commit(raw: string) {
    if (blankIfZero && raw.trim() === '') {
      const rejection = onChange(0);
      if (rejection) {
        setError(rejection);
        setDraft(raw);
        return;
      }
      setDraft(null);
      setError(null);
      return;
    }
    const parsed = parseQuantityInput(raw, allowNegative);
    if (parsed === null) {
      setError(allowNegative ? 'Укажите количество.' : 'Укажите количество больше либо равное нулю.');
      setDraft(raw);
      return;
    }
    const rejection = onChange(parsed);
    if (rejection) {
      setError(rejection);
      setDraft(raw);
      return;
    }
    setDraft(null);
    setError(null);
  }

  return (
    <div className="min-w-[5.5rem]">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div className="flex items-baseline justify-end gap-1">
        <input
          id={inputId}
          value={shown}
          inputMode="decimal"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => {
            setDraft(event.target.value);
            setError(null);
          }}
          onBlur={(event) => commit(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.currentTarget.blur();
            }
          }}
          className={`${gridFieldClassName} text-ink`}
        />
        {unit ? <span className="shrink-0 text-sm text-ink">{unit}</span> : null}
      </div>
      {error ? (
        <p id={errorId} className="mt-1 text-left text-xs text-negative">
          {error}
        </p>
      ) : null}
    </div>
  );
}
