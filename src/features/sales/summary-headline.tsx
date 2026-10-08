'use client';

import type { SummaryHeadline as Headline, OperatingExpenseSide, SummaryLens } from '@/domain/summary';
import { OPERATING_EXPENSE_ERROR, parseOperatingExpense } from '@/features/sales/text';
import { editableCellClassName, MoneyAmount, MoneyCell, PercentCell, tableBorder } from '@/features/table';

const labelHeadClassName = `${tableBorder.bottomThin} ${tableBorder.rightThick} bg-paper px-2 py-1.5 text-center align-middle font-normal text-muted`;

const valueHeadClassName = `${tableBorder.bottomThin} ${tableBorder.rightThin} bg-paper px-1.5 py-1.5 text-center align-middle font-normal text-muted last:border-r-0`;

const labelCellClassName = `${tableBorder.bottomThin} ${tableBorder.rightThick} px-2 py-1.5 text-left align-middle font-normal`;

const valueCellClassName = `${tableBorder.bottomThin} ${tableBorder.rightThin} px-1.5 py-1.5 text-right align-middle last:border-r-0`;

const headlineFieldClassName =
  'w-full min-w-0 cursor-text appearance-none border-0 bg-transparent p-0 font-[inherit] text-right text-[11px] leading-tight text-ink shadow-none outline-none';

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

export function SummaryHeadlineTable({
  headline,
  periodLabel,
  view,
  periodClosed = false,
  planEditable,
  factEditable,
  onOperatingExpense,
}: {
  headline: Headline;
  periodLabel: string;
  view: SummaryLens;
  periodClosed?: boolean;
  planEditable: boolean;
  factEditable: boolean;
  onOperatingExpense: (side: OperatingExpenseSide, amountExVat: number) => string | null;
}) {
  const planLabel = view === 'current' ? 'План (корр.)' : 'План';
  const factIsForecast = view === 'forecast' && !periodClosed;
  const factLabel = factIsForecast ? 'Факт (прогноз)' : 'Факт';

  return (
    <div className="w-full overflow-x-auto border border-line bg-sheet">
      <table className="w-full border-separate border-spacing-0 text-[11px] leading-tight text-ink">
        <caption className="sr-only">
          {view === 'current'
            ? 'Свод периода: план (корр.), факт и отклонение. Операционные расходы без НДС.'
            : factIsForecast
              ? 'Свод периода: план, факт (прогноз) и отклонение. Операционные расходы без НДС.'
              : 'Свод периода: план, факт и отклонение. Операционные расходы без НДС.'}
        </caption>
        <thead>
          <tr>
            <th scope="col" className={labelHeadClassName}>
              <span className="sr-only">Показатель</span>
            </th>
            {ROWS.map((row) => (
              <th key={row.id} scope="col" className={`${valueHeadClassName} whitespace-nowrap`}>
                {row.id === 'tax' ? (
                  <span>
                    {row.label} <span className="text-[10px] text-muted">{headline.taxPercent}&nbsp;%</span>
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
            <th scope="row" className={`${labelCellClassName} whitespace-nowrap`}>
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
            <th scope="row" className={`${labelCellClassName} whitespace-nowrap`}>
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
            <th scope="row" className={`${labelCellClassName} whitespace-nowrap`}>
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
  onOperatingExpense: (side: OperatingExpenseSide, amountExVat: number) => string | null;
}) {
  const values = side === 'plan' ? headline.plan : headline.fact;

  if (row === 'opex') {
    return (
      <MoneyCell
        label={
          side === 'plan' ? `Операционные расходы, план, ${periodLabel}` : `Операционные расходы, факт, ${periodLabel}`
        }
        value={values.operatingExpenseExVat}
        invalidMessage={OPERATING_EXPENSE_ERROR.amount}
        parse={parseOperatingExpense}
        inputClassName={headlineFieldClassName}
        unitClassName="whitespace-nowrap leading-tight"
        onChange={editable ? (next) => onOperatingExpense(side, next) : undefined}
      />
    );
  }

  if (row === 'revenue') {
    return <MoneyCell value={values.revenueWithVat} />;
  }
  if (row === 'contribution') {
    return <MoneyCell value={values.contribution} />;
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
    return <MoneyCell value={variance.revenueWithVat} signed />;
  }
  if (row === 'contribution') {
    return <MoneyCell value={variance.contribution} signed />;
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
    <div className="w-full overflow-x-auto border border-line bg-sheet">
      <table className="w-full border-separate border-spacing-0 text-[11px] leading-tight text-ink">
        <caption className="sr-only">{`Плановые показатели, ${periodLabel}. Операционные расходы без НДС.`}</caption>
        <thead>
          <tr>
            <th scope="col" className={labelHeadClassName}>
              <span className="sr-only">Показатель</span>
            </th>
            {ROWS.map((row) => (
              <th key={row.id} scope="col" className={`${valueHeadClassName} whitespace-nowrap`}>
                {row.id === 'tax' ? (
                  <span>
                    {row.label} <span className="text-[10px] text-muted">{headline.taxPercent}&nbsp;%</span>
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
            <th scope="row" className={`${labelCellClassName} whitespace-nowrap`}>
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
                  onOperatingExpense={(_side, amountExVat) => onOperatingExpense(amountExVat)}
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
