'use client';

import { type ReactNode, useId, useState } from 'react';

import { formatRubles } from '@/domain/units';
import {
  formatMoneyDraft,
  formatPercentHundredths,
  parseMoneyInput,
  parseNonNegativeInteger,
  parsePercentWhole,
  sanitizeDraft,
} from '@/features/table/format';
import { StackedPair } from '@/features/table/stack';
import { gridFieldClassName } from '@/features/table/styles';

type CellCommit = (value: number) => string | null;
type VarianceSense = 'income' | 'cost';

const DEFAULT_MONEY_ERROR = 'Укажите сумму.';
const DEFAULT_PERCENT_ERROR = 'Укажите процент целым числом.';
const DEFAULT_INTEGER_ERROR = 'Укажите целое число.';

export function Empty() {
  return <span className="text-muted">—</span>;
}

export function Muted({ children }: { children: ReactNode }) {
  return <span className="text-sm text-muted">{children}</span>;
}

export function TableNumber({
  value,
  signed = false,
  sense = 'income',
  children,
}: {
  value: number;
  signed?: boolean;
  sense?: VarianceSense;
  children: ReactNode;
}) {
  let className = 'whitespace-nowrap';
  if (signed && value !== 0) {
    const favorable = sense === 'cost' ? value < 0 : value > 0;
    className = favorable ? 'whitespace-nowrap text-positive' : 'whitespace-nowrap text-negative';
  }

  return <span className={className}>{children}</span>;
}

/** Read-only сумма в копейках (без подписи поля). */
export function MoneyAmount({
  amount,
  signed = false,
  sense = 'income',
}: {
  amount: number;
  signed?: boolean;
  sense?: VarianceSense;
}) {
  return (
    <TableNumber value={amount} signed={signed} sense={sense}>
      {formatRubles(amount, true)}
    </TableNumber>
  );
}

/** Сумма в копейках. Без `onChange` — только показ; с `onChange` — правка по blur. */
export function MoneyCell({
  label = 'Сумма',
  value,
  signed = false,
  sense = 'income',
  invalidMessage = DEFAULT_MONEY_ERROR,
  parse = parseMoneyInput,
  inputClassName = `${gridFieldClassName} text-ink`,
  unitClassName = 'shrink-0 text-sm text-ink',
  onChange,
}: {
  label?: string;
  value: number | null;
  signed?: boolean;
  sense?: VarianceSense;
  invalidMessage?: string;
  parse?: (raw: string) => number | null;
  inputClassName?: string;
  unitClassName?: string;
  onChange?: CellCommit;
}) {
  if (value === null && !onChange) {
    return <Empty />;
  }

  if (!onChange) {
    return <MoneyAmount amount={value ?? 0} signed={signed} sense={sense} />;
  }

  return (
    <EditableNumber
      label={label}
      value={value === null ? '' : formatMoneyDraft(value)}
      inputMode="decimal"
      unit="₽"
      invalidMessage={invalidMessage}
      parse={parse}
      inputClassName={inputClassName}
      unitClassName={unitClassName}
      onChange={onChange}
    />
  );
}

/** Процент: целый (`whole`, НДС) или сотые (`hundredths`, рентабельность). */
export function PercentCell({
  label = 'Процент',
  value,
  scale = 'whole',
  signed = false,
  invalidMessage = DEFAULT_PERCENT_ERROR,
  onChange,
}: {
  label?: string;
  value: number | null;
  scale?: 'whole' | 'hundredths';
  signed?: boolean;
  invalidMessage?: string;
  onChange?: CellCommit;
}) {
  if (value === null && !onChange) {
    return <Empty />;
  }

  if (!onChange || scale === 'hundredths') {
    if (value === null) {
      return <Empty />;
    }
    const text = scale === 'hundredths' ? formatPercentHundredths(value) : `${value} %`;
    return (
      <TableNumber value={value} signed={signed}>
        {text}
      </TableNumber>
    );
  }

  return (
    <EditableNumber
      label={label}
      value={value === null ? '' : String(value)}
      inputMode="numeric"
      unit="%"
      invalidMessage={invalidMessage}
      parse={parsePercentWhole}
      onChange={onChange}
    />
  );
}

/** Целое неотрицательное (объём, штуки). */
export function IntegerCell({
  label = 'Число',
  value,
  unit,
  invalidMessage = DEFAULT_INTEGER_ERROR,
  onChange,
}: {
  label?: string;
  value: number | null;
  unit?: string;
  invalidMessage?: string;
  onChange?: CellCommit;
}) {
  if (value === null && !onChange) {
    return <Empty />;
  }

  if (!onChange) {
    if (value === null) {
      return <Empty />;
    }
    const text = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(value);
    return <TableNumber value={value}>{unit ? `${text} ${unit}` : text}</TableNumber>;
  }

  return (
    <EditableNumber
      label={label}
      value={value === null ? '' : String(value)}
      inputMode="numeric"
      unit={unit}
      invalidMessage={invalidMessage}
      parse={parseNonNegativeInteger}
      onChange={onChange}
    />
  );
}

/**
 * Двойная ячейка «с НДС» / «без НДС».
 * Хендлер на половину делает её редактируемой и подсвечивает фон.
 */
export function VatMoneyCell({
  label = 'Сумма',
  withVat,
  exVat,
  signed = false,
  sense = 'income',
  invalidMessage = DEFAULT_MONEY_ERROR,
  onChangeWithVat,
  onChangeExVat,
}: {
  label?: string;
  withVat: number | null;
  exVat: number | null;
  signed?: boolean;
  sense?: VarianceSense;
  invalidMessage?: string;
  onChangeWithVat?: CellCommit;
  onChangeExVat?: CellCommit;
}) {
  if (withVat === null && exVat === null && !onChangeWithVat && !onChangeExVat) {
    return <Empty />;
  }

  return (
    <StackedPair
      topLabel="с НДС"
      bottomLabel="без НДС"
      topHighlighted={Boolean(onChangeWithVat)}
      bottomHighlighted={Boolean(onChangeExVat)}
      top={
        <MoneyCell
          label={`${label} с НДС`}
          value={withVat}
          signed={signed}
          sense={sense}
          invalidMessage={invalidMessage}
          onChange={onChangeWithVat}
        />
      }
      bottom={
        <MoneyCell
          label={`${label} без НДС`}
          value={exVat}
          signed={signed}
          sense={sense}
          invalidMessage={invalidMessage}
          onChange={onChangeExVat}
        />
      }
    />
  );
}

function EditableNumber({
  label,
  value,
  inputMode,
  unit,
  invalidMessage,
  parse,
  inputClassName = `${gridFieldClassName} text-ink`,
  unitClassName = 'shrink-0 text-sm text-ink',
  onChange,
}: {
  label: string;
  value: string;
  inputMode: 'decimal' | 'numeric';
  unit?: string;
  invalidMessage: string;
  parse: (raw: string) => number | null;
  inputClassName?: string;
  unitClassName?: string;
  onChange: CellCommit;
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
    <div data-editable-field="" className="min-w-0">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div className="flex items-baseline justify-end gap-1">
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
            if (event.key === 'Enter') {
              event.preventDefault();
              event.stopPropagation();
              event.currentTarget.blur();
            }
            if (event.key === 'Escape') {
              setDraft(null);
              setError(null);
              event.currentTarget.blur();
            }
          }}
          className={inputClassName}
        />
        {unit ? <span className={unitClassName}>{unit}</span> : null}
      </div>
      {error ? (
        <p id={errorId} className="mt-1 text-sm text-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}
