'use client';

import { useId, useState } from 'react';

import type {
  SummaryHeadline as Headline,
  OperatingExpenseSide,
  SummaryLens,
} from '@/domain/summary';
import { formatMoney } from '@/features/sales/money';
import {
  formatPercentHundredths,
  OPERATING_EXPENSE_ERROR,
  parseOperatingExpense,
  priceDraft,
} from '@/features/sales/text';
import { TableNumber, type VarianceSense } from '@/features/shell/table-number';

const editableCellClassName = 'bg-[#e4e4e0]';

const labelHeadClassName =
  'border-b border-b-line border-r-[1.5px] border-r-muted bg-paper px-2 py-1.5 text-center align-middle font-normal text-muted';

const valueHeadClassName =
  'border-b border-b-line border-r border-r-line bg-paper px-1.5 py-1.5 text-center align-middle font-normal text-muted last:border-r-0';

const labelCellClassName =
  'border-b border-b-line border-r-[1.5px] border-r-muted px-2 py-1.5 text-left align-middle font-normal';

const valueCellClassName =
  'border-b border-b-line border-r border-r-line px-1.5 py-1.5 text-right align-middle last:border-r-0';

type HeadlineRowId =
  | 'revenue'
  | 'contribution'
  | 'opex'
  | 'profit'
  | 'tax'
  | 'net'
  | 'rentability';

const ROWS: { id: HeadlineRowId; label: string }[] = [
  { id: 'revenue', label: 'Выручка с НДС' },
  { id: 'contribution', label: 'Т-проток' },
  { id: 'opex', label: 'Операционные расходы' },
  { id: 'profit', label: 'Прибыль' },
  { id: 'tax', label: 'Налог на прибыль' },
  { id: 'net', label: 'Чистая прибыль' },
  { id: 'rentability', label: 'Рентабельность' },
];

export function SummaryHeadlineTable({
  headline,
  periodLabel,
  view,
  planEditable,
  factEditable,
  onOperatingExpense,
}: {
  headline: Headline;
  periodLabel: string;
  view: SummaryLens;
  planEditable: boolean;
  factEditable: boolean;
  onOperatingExpense: (
    side: OperatingExpenseSide,
    amountExVat: number,
  ) => string | null;
}) {
  const planLabel = view === 'current' ? 'План (корр.)' : 'План';
  const factLabel = view === 'forecast' ? 'Факт (прогноз)' : 'Факт';

  return (
    <div className="w-full overflow-x-auto border border-line bg-sheet">
      <table className="w-full border-separate border-spacing-0 text-[11px] leading-tight text-ink">
        <caption className="sr-only">
          {view === 'current'
            ? 'Свод периода: план (корр.), факт и отклонение. Операционные расходы без НДС.'
            : 'Свод периода: план, факт (прогноз) и отклонение. Операционные расходы без НДС.'}
        </caption>
        <thead>
          <tr>
            <th scope="col" className={labelHeadClassName}>
              <span className="sr-only">Показатель</span>
            </th>
            {ROWS.map((row) => (
              <th
                key={row.id}
                scope="col"
                className={`${valueHeadClassName} whitespace-nowrap`}
              >
                {row.id === 'tax' ? (
                  <span>
                    {row.label}{' '}
                    <span className="text-[10px] text-muted">
                      {headline.taxPercent}&nbsp;%
                    </span>
                  </span>
                ) : (
                  row.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th
              scope="row"
              className={`${labelCellClassName} whitespace-nowrap`}
            >
              {planLabel}
            </th>
            {ROWS.map((row) => (
              <td
                key={row.id}
                className={`${valueCellClassName} min-w-28 ${row.id === 'opex' && planEditable ? editableCellClassName : ''}`}
              >
                <HeadlineValue
                  row={row.id}
                  side="plan"
                  headline={headline}
                  periodLabel={periodLabel}
                  editable={row.id === 'opex' && planEditable}
                  onOperatingExpense={onOperatingExpense}
                />
              </td>
            ))}
          </tr>
          <tr>
            <th
              scope="row"
              className={`${labelCellClassName} whitespace-nowrap`}
            >
              {factLabel}
            </th>
            {ROWS.map((row) => (
              <td
                key={row.id}
                className={`${valueCellClassName} min-w-28 ${row.id === 'opex' && factEditable ? editableCellClassName : ''}`}
              >
                <HeadlineValue
                  row={row.id}
                  side="fact"
                  headline={headline}
                  periodLabel={periodLabel}
                  editable={row.id === 'opex' && factEditable}
                  onOperatingExpense={onOperatingExpense}
                />
              </td>
            ))}
          </tr>
          <tr>
            <th
              scope="row"
              className={`${labelCellClassName} whitespace-nowrap`}
            >
              Откл.
            </th>
            {ROWS.map((row) => (
              <td key={row.id} className={`${valueCellClassName} min-w-28`}>
                <VarianceValue row={row.id} headline={headline} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function HeadlineValue({
  row,
  side,
  headline,
  periodLabel,
  editable,
  onOperatingExpense,
}: {
  row: HeadlineRowId;
  side: OperatingExpenseSide;
  headline: Headline;
  periodLabel: string;
  editable: boolean;
  onOperatingExpense: (
    side: OperatingExpenseSide,
    amountExVat: number,
  ) => string | null;
}) {
  const values = side === 'plan' ? headline.plan : headline.fact;

  if (row === 'opex') {
    return (
      <ExpenseInput
        label={
          side === 'plan'
            ? `Операционные расходы, план, ${periodLabel}`
            : `Операционные расходы, факт, ${periodLabel}`
        }
        value={values.operatingExpenseExVat}
        disabled={!editable}
        onCommit={(next) => onOperatingExpense(side, next)}
      />
    );
  }

  if (row === 'revenue') {
    return <MoneyOrEmpty amount={values.revenueWithVat} />;
  }
  if (row === 'contribution') {
    return <MoneyOrEmpty amount={values.contribution} />;
  }
  if (row === 'profit') {
    return <MoneyOrEmpty amount={values.profit} />;
  }
  if (row === 'tax') {
    return <MoneyOrEmpty amount={values.profitTax} />;
  }
  if (row === 'net') {
    return <MoneyOrEmpty amount={values.netProfit} />;
  }

  return values.netProfitabilityHundredths === null ? (
    <Empty />
  ) : (
    <TableNumber value={values.netProfitabilityHundredths}>
      {formatPercentHundredths(values.netProfitabilityHundredths)}
    </TableNumber>
  );
}

function VarianceValue({
  row,
  headline,
}: {
  row: HeadlineRowId;
  headline: Headline;
}) {
  const variance = headline.variance;

  if (row === 'opex') {
    return (
      <MoneyAmount
        amount={variance.operatingExpenseExVat}
        signed
        sense="cost"
      />
    );
  }
  if (row === 'revenue') {
    return <MoneyOrEmpty amount={variance.revenueWithVat} signed />;
  }
  if (row === 'contribution') {
    return <MoneyOrEmpty amount={variance.contribution} signed />;
  }
  if (row === 'profit') {
    return <MoneyOrEmpty amount={variance.profit} signed />;
  }
  if (row === 'tax') {
    return <MoneyOrEmpty amount={variance.profitTax} signed sense="cost" />;
  }
  if (row === 'net') {
    return <MoneyOrEmpty amount={variance.netProfit} signed />;
  }

  return variance.netProfitabilityHundredths === null ? (
    <Empty />
  ) : (
    <TableNumber value={variance.netProfitabilityHundredths} signed>
      {formatPercentHundredths(variance.netProfitabilityHundredths)}
    </TableNumber>
  );
}

function MoneyOrEmpty({
  amount,
  signed = false,
  sense = 'income',
}: {
  amount: number | null;
  signed?: boolean;
  sense?: VarianceSense;
}) {
  if (amount === null) {
    return <Empty />;
  }

  return <MoneyAmount amount={amount} signed={signed} sense={sense} />;
}

function MoneyAmount({
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
      {formatMoney(amount)}
    </TableNumber>
  );
}

/** Плановые показатели месяца: столбец «План» верхнего блока, строки стали колонками. */
export function PlanHeadlineTable({
  headline,
  periodLabel,
  editable,
  onOperatingExpense,
}: {
  headline: Headline;
  periodLabel: string;
  editable: boolean;
  onOperatingExpense: (amountExVat: number) => string | null;
}) {
  return (
    <div className="w-full overflow-x-auto border border-line bg-sheet">
      <table className="w-full border-separate border-spacing-0 text-[11px] leading-tight text-ink">
        <caption className="sr-only">
          {`Плановые показатели, ${periodLabel}. Операционные расходы без НДС.`}
        </caption>
        <thead>
          <tr>
            <th scope="col" className={labelHeadClassName}>
              <span className="sr-only">Показатель</span>
            </th>
            {ROWS.map((row) => (
              <th
                key={row.id}
                scope="col"
                className={`${valueHeadClassName} whitespace-nowrap`}
              >
                {row.id === 'tax' ? (
                  <span>
                    {row.label}{' '}
                    <span className="text-[10px] text-muted">
                      {headline.taxPercent}&nbsp;%
                    </span>
                  </span>
                ) : (
                  row.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th
              scope="row"
              className={`${labelCellClassName} whitespace-nowrap`}
            >
              План
            </th>
            {ROWS.map((row) => (
              <td
                key={row.id}
                className={`${valueCellClassName} min-w-28 ${row.id === 'opex' && editable ? editableCellClassName : ''}`}
              >
                <HeadlineValue
                  row={row.id}
                  side="plan"
                  headline={headline}
                  periodLabel={periodLabel}
                  editable={row.id === 'opex' && editable}
                  onOperatingExpense={(_side, amountExVat) =>
                    onOperatingExpense(amountExVat)
                  }
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function Empty() {
  return <span className="text-muted">—</span>;
}

function ExpenseInput({
  label,
  value,
  disabled,
  onCommit,
}: {
  label: string;
  value: number;
  disabled: boolean;
  onCommit: (value: number) => string | null;
}) {
  const inputId = useId();
  const errorId = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const shown = draft ?? priceDraft(value);

  function commit(raw: string) {
    const parsed = parseOperatingExpense(raw);
    if (parsed === null) {
      setError(OPERATING_EXPENSE_ERROR.amount);
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
        <MoneyAmount amount={value} />
      </>
    );
  }

  return (
    <div className="min-w-0">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div className="flex min-w-0 items-baseline justify-end">
        <input
          id={inputId}
          value={shown}
          inputMode="decimal"
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onFocus={() => {
            setDraft(sanitizeDraft(priceDraft(value)));
            setError(null);
          }}
          onChange={(event) => {
            setDraft(sanitizeDraft(event.target.value));
            setError(null);
          }}
          onBlur={(event) => commit(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.currentTarget.blur();
            }
            if (event.key === 'Escape') {
              setDraft(null);
              setError(null);
              event.currentTarget.blur();
            }
          }}
          className="w-full min-w-0 cursor-text appearance-none border-0 bg-transparent p-0 font-[inherit] text-right text-[11px] leading-tight text-ink shadow-none outline-none"
        />
        <span aria-hidden="true" className="whitespace-nowrap leading-tight">
          {'\u00a0'}₽
        </span>
      </div>
      {error ? (
        <p id={errorId} className="mt-0.5 text-left text-[10px] text-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function sanitizeDraft(raw: string): string {
  let result = '';
  let hasComma = false;

  for (const char of raw) {
    if (char >= '0' && char <= '9') {
      result += char;
      continue;
    }

    if ((char === ',' || char === '.') && !hasComma) {
      result += ',';
      hasComma = true;
    }
  }

  return result;
}
