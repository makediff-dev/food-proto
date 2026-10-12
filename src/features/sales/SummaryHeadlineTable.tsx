'use client';

import type { SummaryHeadline as Headline, OperatingExpenseSide, SummaryLens } from '@/domain/summary';
import { OPERATING_EXPENSE_ERROR, parseOperatingExpense } from '@/features/sales/text';
import {
  ColumnLabel,
  columnDividerClassName,
  columnHeadingClassName,
  editableCellClassName,
  MoneyAmount,
  MoneyCell,
  nameHeadingClassName,
  PercentCell,
  tableClassName,
  tableFrameClassName,
} from '@/features/table';

const valueHeadClassName = `${columnHeadingClassName} ${columnDividerClassName}`;

const labelCellClassName =
  'sticky left-0 z-10 whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted bg-sheet px-3 py-2 text-left align-middle text-sm font-normal text-ink';

const valueCellClassName = `border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`;

type HeadlineRowId = 'revenue' | 'contribution' | 'opex' | 'profit' | 'tax' | 'net' | 'rentability';

const ROWS: { id: HeadlineRowId; label: string }[] = [
  { id: 'revenue', label: 'Выручка с НДС' },
  { id: 'contribution', label: 'Т-проток' },
  { id: 'opex', label: 'Операционные расходы' },
  { id: 'profit', label: 'Прибыль' },
  { id: 'tax', label: 'Налог на прибыль' },
  { id: 'net', label: 'Чистая прибыль' },
  { id: 'rentability', label: 'Рентабельность' },
];

function IndicatorHead({ id, label, taxPercent }: { id: HeadlineRowId; label: string; taxPercent: number }) {
  return (
    <th scope="col" className={valueHeadClassName}>
      <ColumnLabel label={label} />
      {id === 'tax' ? <span className="mt-0.5 block text-sm text-muted">{taxPercent}&nbsp;%</span> : null}
    </th>
  );
}

export function SummaryHeadlineTable({
  headline,
  periodLabel,
  view,
  periodClosed = false,
  expenseBasis = 'month',
  onFactOperatingExpense,
}: {
  headline: Headline;
  periodLabel: string;
  view: SummaryLens;
  periodClosed?: boolean;
  /** Прогноз — сумма месяца. Фактическая — доля прошедших дней. */
  expenseBasis?: 'month' | 'elapsed';
  /** Фактические операционные расходы при одном месяце. План здесь не правят. */
  onFactOperatingExpense?: (amountExVat: number) => string | null;
}) {
  const planLabel = view === 'current' ? 'План (корр.)' : 'План';
  const factIsForecast = view === 'forecast' && !periodClosed;
  const factLabel = factIsForecast ? 'Факт (прогноз)' : 'Факт';
  const factOpexEditable = onFactOperatingExpense !== undefined;

  return (
    <div className={tableFrameClassName}>
      <table className={tableClassName}>
        <caption className="sr-only">
          {view === 'current'
            ? 'Свод периода: план (корр.), факт и отклонение. Операционные расходы без НДС за прошедшие дни.'
            : factIsForecast
              ? 'Свод периода: план, факт (прогноз) и отклонение. Операционные расходы без НДС за месяц.'
              : 'Свод периода: план, факт и отклонение. Операционные расходы без НДС за месяц.'}
        </caption>
        <thead>
          <tr>
            <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
              <span className="sr-only">Показатель</span>
            </th>
            {ROWS.map((row) => (
              <IndicatorHead key={row.id} id={row.id} label={row.label} taxPercent={headline.taxPercent} />
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" className={labelCellClassName}>
              {planLabel}
            </th>
            {ROWS.map((row) => (
              <td key={row.id} className={valueCellClassName}>
                <HeadlineValue
                  row={row.id}
                  side="plan"
                  headline={headline}
                  periodLabel={periodLabel}
                  expenseBasis={expenseBasis}
                />
              </td>
            ))}
          </tr>
          <tr>
            <th scope="row" className={labelCellClassName}>
              {factLabel}
            </th>
            {ROWS.map((row) => (
              <td
                key={row.id}
                className={`${valueCellClassName} ${row.id === 'opex' && factOpexEditable ? editableCellClassName : ''}`}
              >
                <HeadlineValue
                  row={row.id}
                  side="fact"
                  headline={headline}
                  periodLabel={periodLabel}
                  expenseBasis={expenseBasis}
                  onOperatingExpense={
                    row.id === 'opex' && onFactOperatingExpense
                      ? (_side, amountExVat) => onFactOperatingExpense(amountExVat)
                      : undefined
                  }
                />
              </td>
            ))}
          </tr>
          <tr>
            <th scope="row" className={labelCellClassName}>
              Откл.
            </th>
            {ROWS.map((row) => (
              <td key={row.id} className={valueCellClassName}>
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
  expenseBasis = 'month',
  onOperatingExpense,
}: {
  row: HeadlineRowId;
  side: OperatingExpenseSide;
  headline: Headline;
  periodLabel: string;
  expenseBasis?: 'month' | 'elapsed';
  onOperatingExpense?: (side: OperatingExpenseSide, amountExVat: number) => string | null;
}) {
  const values = side === 'plan' ? headline.plan : headline.fact;

  if (row === 'opex') {
    const span = expenseBasis === 'elapsed' ? 'за прошедшие дни' : 'за месяц';
    return (
      <MoneyCell
        label={
          side === 'plan'
            ? `Операционные расходы, план ${span}, ${periodLabel}`
            : `Операционные расходы, факт ${span}, ${periodLabel}`
        }
        value={values.operatingExpenseExVat}
        invalidMessage={OPERATING_EXPENSE_ERROR.amount}
        parse={parseOperatingExpense}
        onChange={onOperatingExpense ? (next) => onOperatingExpense(side, next) : undefined}
      />
    );
  }

  if (row === 'revenue') {
    return <MoneyCell whole value={values.revenueWithVat} />;
  }
  if (row === 'contribution') {
    return <MoneyCell whole value={values.contribution} />;
  }
  if (row === 'profit') {
    return <MoneyCell value={values.profit} />;
  }
  if (row === 'tax') {
    return <MoneyCell value={values.profitTax} />;
  }
  if (row === 'net') {
    return <MoneyCell value={values.netProfit} />;
  }

  return <PercentCell value={values.netProfitabilityHundredths} scale="hundredths" />;
}

function VarianceValue({ row, headline }: { row: HeadlineRowId; headline: Headline }) {
  const variance = headline.variance;

  if (row === 'opex') {
    return <MoneyAmount amount={variance.operatingExpenseExVat} signed sense="cost" />;
  }
  if (row === 'revenue') {
    return <MoneyCell whole value={variance.revenueWithVat} signed />;
  }
  if (row === 'contribution') {
    return <MoneyCell whole value={variance.contribution} signed />;
  }
  if (row === 'profit') {
    return <MoneyCell value={variance.profit} signed />;
  }
  if (row === 'tax') {
    return <MoneyCell value={variance.profitTax} signed sense="cost" />;
  }
  if (row === 'net') {
    return <MoneyCell value={variance.netProfit} signed />;
  }

  return <PercentCell value={variance.netProfitabilityHundredths} scale="hundredths" signed />;
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
    <div className={tableFrameClassName}>
      <table className={tableClassName}>
        <caption className="sr-only">{`Плановые показатели, ${periodLabel}. Операционные расходы без НДС.`}</caption>
        <thead>
          <tr>
            <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
              <span className="sr-only">Показатель</span>
            </th>
            {ROWS.map((row) => (
              <IndicatorHead key={row.id} id={row.id} label={row.label} taxPercent={headline.taxPercent} />
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" className={labelCellClassName}>
              План
            </th>
            {ROWS.map((row) => (
              <td
                key={row.id}
                className={`${valueCellClassName} ${row.id === 'opex' && editable ? editableCellClassName : ''}`}
              >
                <HeadlineValue
                  row={row.id}
                  side="plan"
                  headline={headline}
                  periodLabel={periodLabel}
                  onOperatingExpense={
                    row.id === 'opex' && editable ? (_side, amountExVat) => onOperatingExpense(amountExVat) : undefined
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
