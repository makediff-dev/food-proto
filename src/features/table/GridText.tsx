'use client';

import { useId, useState } from 'react';

import { gridNameClassName } from '@/features/table/styles';

export function GridText({
  label,
  value,
  disabled,
  caps,
  invalidMessage,
  onCommit,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  caps?: boolean;
  invalidMessage: string;
  onCommit: (value: string) => string | null;
}) {
  const inputId = useId();
  const errorId = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const shown = draft ?? value;

  function commit(raw: string) {
    if (raw.trim().length === 0) {
      setError(invalidMessage);
      setDraft(raw);
      return;
    }

    const rejection = onCommit(raw);
    if (rejection) {
      setError(rejection);
      setDraft(raw);
      return;
    }

    setDraft(null);
    setError(null);
  }

  return (
    <div className="min-w-max flex-1">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div className="relative min-w-max flex-1">
        <span
          className={`invisible flex h-8 items-center whitespace-nowrap text-sm leading-none ${caps ? 'uppercase' : ''}`}
          aria-hidden
        >
          {shown.length > 0 ? shown : '\u00a0'}
        </span>
        <input
          id={inputId}
          value={shown}
          autoComplete="off"
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onFocus={() => {
            setDraft(value);
            setError(null);
          }}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={(event) => commit(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              event.stopPropagation();
              event.currentTarget.blur();
            }
          }}
          className={`${gridNameClassName} ${caps ? 'uppercase' : ''}`}
        />
      </div>
      {error ? (
        <p id={errorId} className="mt-1 text-sm text-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}
