'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { creditResourcesMonthView } from '@/domain/credit-resources';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { CreditMonthBar, resolveCreditMonth } from '@/features/credit-resources/CreditMonthBar';
import { CREDIT_RESOURCES_SUMMARY_TITLE, creditResourcesSummaryHref } from '@/features/credit-resources/paths';
import { formatInterestRate } from '@/features/credit-resources/text';
import { useCreditResources } from '@/features/credit-resources/use-credit-resources';
import { PageFrame } from '@/features/shell/PageFrame';
import {
  ColumnLabel,
  columnDividerClassName,
  columnHeadingClassName,
  entityNameRowClassName,
  MoneyAmount,
  MoneyCell,
  nameHeadingClassName,
  stickyHeadClassName,
  tableBorder,
  tableClassName,
  tableFrameClassName,
  totalNameClassName,
  totalValueClassName,
} from '@/features/table';

type ColumnKey =
  | 'initial'
  | 'rate'
  | 'opening'
  | 'planReceived'
  | 'factReceived'
  | 'varianceReceived'
  | 'planRepaid'
  | 'factRepaid'
  | 'varianceRepaid'
  | 'planClosing'
  | 'factClosing'
  | 'varianceClosing'
  | 'planInterest'
  | 'factInterest'
  | 'varianceInterest';

const COLUMN_GROUPS: { label: string; columns: { key: ColumnKey; label: string }[] }[] = [
  {
    label: 'Кредитор',
    columns: [
      { key: 'initial', label: 'Сумма кредита' },
      { key: 'rate', label: 'Ставка, %' },
      { key: 'opening', label: 'Остаток на начало' },
    ],
  },
  {
    label: 'Получение',
    columns: [
      { key: 'planReceived', label: 'План' },
      { key: 'factReceived', label: 'Факт' },
      { key: 'varianceReceived', label: 'Откл.' },
    ],
  },
  {
    label: 'Погашение тела',
    columns: [
      { key: 'planRepaid', label: 'План' },
      { key: 'factRepaid', label: 'Факт' },
      { key: 'varianceRepaid', label: 'Откл.' },
    ],
  },
  {
    label: 'Остаток на конец',
    columns: [
      { key: 'planClosing', label: 'План' },
      { key: 'factClosing', label: 'Факт' },
      { key: 'varianceClosing', label: 'Откл.' },
    ],
  },
  {
    label: 'Процентные платежи',
    columns: [
      { key: 'planInterest', label: 'План' },
      { key: 'factInterest', label: 'Факт' },
      { key: 'varianceInterest', label: 'Откл.' },
    ],
  },
];

const COLUMNS = COLUMN_GROUPS.flatMap((group) => group.columns);
const GROUP_END = new Set<ColumnKey>([
  'opening',
  'varianceReceived',
  'varianceRepaid',
  'varianceClosing',
  'varianceInterest',
]);

function columnEdge(key: ColumnKey): string {
  return GROUP_END.has(key) ? tableBorder.rightThick : columnDividerClassName;
}

const valueCell = `w-px border-b border-b-line px-1.5 py-2 text-right align-middle`;

export function CreditResourcesSummaryScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveCreditMonth(month, today, currentMonth);
  const credit = useCreditResources();
  const router = useRouter();
  const view = useMemo(
    () => creditResourcesMonthView(credit.document, selectedMonth),
    [credit.document, selectedMonth],
  );

  return (
    <PageFrame
      title={CREDIT_RESOURCES_SUMMARY_TITLE}
      full
      lede="Остатки и оборот тела кредита по банкам и частным кредиторам. Процентные платежи входят в сводку продаж и в ДДС."
      intro={
        <CreditMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(creditResourcesSummaryHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      <div className={tableFrameClassName}>
        <table className={tableClassName}>
          <caption className="sr-only">{`Кредитные ресурсы за ${selectedMonth}`}</caption>
          <thead className={stickyHeadClassName}>
            <tr>
              <th scope="col" rowSpan={2} className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                <ColumnLabel label="Наименование" />
              </th>
              {COLUMN_GROUPS.map((group) => (
                <th
                  key={group.label}
                  scope="colgroup"
                  colSpan={group.columns.length}
                  className={`${columnHeadingClassName} ${tableBorder.rightThick} text-center`}
                >
                  {group.label}
                </th>
              ))}
            </tr>
            <tr>
              {COLUMNS.map((column) => (
                <th key={column.key} scope="col" className={`${columnHeadingClassName} ${columnEdge(column.key)}`}>
                  <ColumnLabel label={column.label} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {view.rows.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length + 1} className="border-b border-b-line px-3 py-6 text-sm text-muted">
                  Кредиторов пока нет. Добавьте их во «Вводе плана».
                </td>
              </tr>
            ) : null}
            {view.rows.map((row) => (
              <tr key={row.creditorId}>
                <th scope="row" className={entityNameRowClassName('repeated')}>
                  {row.name}
                  {row.deleted ? ' (архив)' : ''}
                </th>
                <td className={`${valueCell} ${columnEdge('initial')}`}>
                  <MoneyAmount amount={row.initialPrincipal} />
                </td>
                <td className={`${valueCell} ${columnEdge('rate')}`}>
                  <span className="text-sm tabular-nums">{formatInterestRate(row.interestRateHundredths)}</span>
                </td>
                <td className={`${valueCell} ${columnEdge('opening')}`}>
                  <MoneyAmount amount={row.openingPrincipal} />
                </td>
                <td className={`${valueCell} ${columnEdge('planReceived')}`}>
                  <MoneyAmount amount={row.planReceived} />
                </td>
                <td className={`${valueCell} ${columnEdge('factReceived')}`}>
                  <MoneyAmount amount={row.factReceived} />
                </td>
                <td className={`${valueCell} ${columnEdge('varianceReceived')}`}>
                  <MoneyCell label="Откл., получение" value={row.varianceReceived} signed sense="income" />
                </td>
                <td className={`${valueCell} ${columnEdge('planRepaid')}`}>
                  <MoneyAmount amount={row.planRepaid} />
                </td>
                <td className={`${valueCell} ${columnEdge('factRepaid')}`}>
                  <MoneyAmount amount={row.factRepaid} />
                </td>
                <td className={`${valueCell} ${columnEdge('varianceRepaid')}`}>
                  <MoneyCell label="Откл., погашение" value={row.varianceRepaid} signed sense="cost" />
                </td>
                <td className={`${valueCell} ${columnEdge('planClosing')}`}>
                  <MoneyAmount amount={row.planClosingPrincipal} />
                </td>
                <td className={`${valueCell} ${columnEdge('factClosing')}`}>
                  <MoneyAmount amount={row.factClosingPrincipal} />
                </td>
                <td className={`${valueCell} ${columnEdge('varianceClosing')}`}>
                  <MoneyCell label="Откл., остаток" value={row.varianceClosingPrincipal} signed sense="income" />
                </td>
                <td className={`${valueCell} ${columnEdge('planInterest')}`}>
                  <MoneyAmount amount={row.planInterest} />
                </td>
                <td className={`${valueCell} ${columnEdge('factInterest')}`}>
                  <MoneyAmount amount={row.factInterest} />
                </td>
                <td className={`${valueCell} ${columnEdge('varianceInterest')}`}>
                  <MoneyCell label="Откл., проценты" value={row.varianceInterest} signed sense="cost" />
                </td>
              </tr>
            ))}
          </tbody>
          {view.rows.length > 0 ? (
            <tfoot>
              <tr>
                <th scope="row" className={totalNameClassName}>
                  Всего
                </th>
                <td className={`${totalValueClassName} ${columnEdge('initial')}`}>
                  <MoneyAmount amount={view.total.initialPrincipal} />
                </td>
                <td className={`${totalValueClassName} ${columnEdge('rate')}`} />
                <td className={`${totalValueClassName} ${columnEdge('opening')}`}>
                  <MoneyAmount amount={view.total.openingPrincipal} />
                </td>
                <td className={`${totalValueClassName} ${columnEdge('planReceived')}`}>
                  <MoneyAmount amount={view.total.planReceived} />
                </td>
                <td className={`${totalValueClassName} ${columnEdge('factReceived')}`}>
                  <MoneyAmount amount={view.total.factReceived} />
                </td>
                <td className={`${totalValueClassName} ${columnEdge('varianceReceived')}`}>
                  <MoneyCell label="Откл., получение" value={view.total.varianceReceived} signed sense="income" />
                </td>
                <td className={`${totalValueClassName} ${columnEdge('planRepaid')}`}>
                  <MoneyAmount amount={view.total.planRepaid} />
                </td>
                <td className={`${totalValueClassName} ${columnEdge('factRepaid')}`}>
                  <MoneyAmount amount={view.total.factRepaid} />
                </td>
                <td className={`${totalValueClassName} ${columnEdge('varianceRepaid')}`}>
                  <MoneyCell label="Откл., погашение" value={view.total.varianceRepaid} signed sense="cost" />
                </td>
                <td className={`${totalValueClassName} ${columnEdge('planClosing')}`}>
                  <MoneyAmount amount={view.total.planClosingPrincipal} />
                </td>
                <td className={`${totalValueClassName} ${columnEdge('factClosing')}`}>
                  <MoneyAmount amount={view.total.factClosingPrincipal} />
                </td>
                <td className={`${totalValueClassName} ${columnEdge('varianceClosing')}`}>
                  <MoneyCell label="Откл., остаток" value={view.total.varianceClosingPrincipal} signed sense="income" />
                </td>
                <td className={`${totalValueClassName} ${columnEdge('planInterest')}`}>
                  <MoneyAmount amount={view.total.planInterest} />
                </td>
                <td className={`${totalValueClassName} ${columnEdge('factInterest')}`}>
                  <MoneyAmount amount={view.total.factInterest} />
                </td>
                <td className={`${totalValueClassName} ${columnEdge('varianceInterest')}`}>
                  <MoneyCell label="Откл., проценты" value={view.total.varianceInterest} signed sense="cost" />
                </td>
              </tr>
            </tfoot>
          ) : null}
        </table>
      </div>
    </PageFrame>
  );
}
