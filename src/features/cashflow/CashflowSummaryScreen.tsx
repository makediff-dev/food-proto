'use client';

import { useRouter } from 'next/navigation';
import { type CSSProperties, Fragment, useMemo, useState } from 'react';

import { type CashflowLineView, cashflowMonthView } from '@/domain/cashflow';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { CashflowMonthBar, resolveCashflowMonth } from '@/features/cashflow/CashflowMonthBar';
import { CASHFLOW_SUMMARY_TITLE, cashflowSummaryHref } from '@/features/cashflow/paths';
import { useCashflow } from '@/features/cashflow/use-cashflow';
import { IconChevronDown, IconChevronRight } from '@/features/shell/Icons';
import { PageFrame } from '@/features/shell/PageFrame';
import {
  type CellKind,
  ColumnLabel,
  categoryBandClassName,
  categoryNameClassName,
  categoryNameRowClassName,
  cellKindClassName,
  columnDividerClassName,
  columnHeadingClassName,
  Empty,
  entityNameRowClassName,
  MoneyAmount,
  MoneyCell,
  nameHeadingClassName,
  stickyCategoryCellClassName,
  stickyHeadClassName,
  tableBorder,
  tableClassName,
  tableFrameScrollClassName,
  totalNameClassName,
  totalValueClassName,
  useStickyTableHead,
} from '@/features/table';

const valueHead = `${columnHeadingClassName} ${columnDividerClassName}`;
const valueEnd = `${columnHeadingClassName} ${tableBorder.rightThick}`;
const valueCell = `w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`;
const valueCellEnd = `w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${tableBorder.rightThick}`;
const dayHead = `${columnHeadingClassName} ${columnDividerClassName}`;
const dayCell = `w-px whitespace-nowrap border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`;
const dayCellEnd = `w-px whitespace-nowrap border-b border-b-line px-1.5 py-2 text-right align-middle ${tableBorder.rightThick}`;

type VarianceSense = 'income' | 'cost';

function dayLabel(occurredOn: string): string {
  return String(Number(occurredOn.slice(8, 10)));
}

function DayAmountCells({
  days,
  dayFacts,
  show,
  signed,
  sense,
  blankIfZero = true,
  fill,
  stickyStyle,
}: {
  days: readonly string[];
  dayFacts: readonly number[];
  show: boolean;
  signed?: boolean;
  sense: VarianceSense;
  /** Для остатков ноль тоже показывают: это рабочее значение дня. */
  blankIfZero?: boolean;
  fill: string;
  stickyStyle?: CSSProperties;
}) {
  return (
    <>
      {days.map((occurredOn, index) => {
        const amount = dayFacts[index] ?? 0;
        const isLast = index === days.length - 1;
        const visible = show && (!blankIfZero || amount !== 0);
        return (
          <td key={occurredOn} className={`${isLast ? dayCellEnd : dayCell} ${fill}`} style={stickyStyle}>
            {visible ? <MoneyAmount amount={amount} signed={signed} sense={sense} /> : <Empty />}
          </td>
        );
      })}
    </>
  );
}

function LineRows({
  line,
  depth,
  days,
  openIds,
  toggle,
  sense,
  showDayFacts,
  categoryStickyStyle,
}: {
  line: CashflowLineView;
  depth: number;
  days: readonly string[];
  openIds: Set<string>;
  toggle: (id: string) => void;
  /** Доходы: факт выше плана — хорошо; расходы: факт ниже плана — хорошо. */
  sense: VarianceSense;
  showDayFacts: boolean;
  categoryStickyStyle?: CSSProperties;
}) {
  const hasChildren = Boolean(line.children && line.children.length > 0);
  const open = openIds.has(line.id);
  const isGroup = depth === 0 || (hasChildren && depth <= 1);
  const nameRow = isGroup
    ? categoryNameRowClassName(false, { stack: 'belowHead' })
    : entityNameRowClassName('repeated');
  /** Группа — итог (computed / полоса категории); лист — повтор из другой таблицы. */
  const sideKind: CellKind = hasChildren ? 'computed' : 'repeated';
  const amountFill = isGroup ? categoryBandClassName : cellKindClassName[sideKind];
  const varianceFill = isGroup ? categoryBandClassName : cellKindClassName.computed;
  const sticky = isGroup ? categoryStickyStyle : undefined;

  return (
    <Fragment>
      <tr>
        <th scope="row" className={nameRow} style={sticky}>
          <div className="flex items-center gap-2" style={{ paddingLeft: `${depth * 1.25}rem` }}>
            {hasChildren ? (
              <button
                type="button"
                aria-expanded={open}
                aria-label={open ? `Свернуть ${line.name}` : `Развернуть ${line.name}`}
                title={open ? 'Свернуть' : 'Развернуть'}
                onClick={() => toggle(line.id)}
                className="inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                {open ? <IconChevronDown /> : <IconChevronRight />}
              </button>
            ) : (
              <span className="inline-block size-8 shrink-0" aria-hidden />
            )}
            <span className={isGroup ? categoryNameClassName : 'text-sm'}>{line.name}</span>
          </div>
        </th>
        <td className={`${valueCell} ${isGroup ? stickyCategoryCellClassName : ''} ${amountFill}`} style={sticky}>
          <MoneyAmount amount={line.amounts.plan} />
        </td>
        <td className={`${valueCell} ${isGroup ? stickyCategoryCellClassName : ''} ${amountFill}`} style={sticky}>
          <MoneyAmount amount={line.amounts.fact} />
        </td>
        <td className={`${valueCellEnd} ${isGroup ? stickyCategoryCellClassName : ''} ${varianceFill}`} style={sticky}>
          <MoneyCell label={`Откл., ${line.name}`} value={line.amounts.variance} signed sense={sense} />
        </td>
        <DayAmountCells
          days={days}
          dayFacts={line.dayFacts}
          show={showDayFacts}
          signed={line.id === 'tax:vat'}
          sense={sense}
          fill={`${isGroup ? stickyCategoryCellClassName : ''} ${amountFill}`}
          stickyStyle={sticky}
        />
      </tr>
      {hasChildren && open
        ? line.children?.map((child) => (
            <LineRows
              key={child.id}
              line={child}
              depth={depth + 1}
              days={days}
              openIds={openIds}
              toggle={toggle}
              sense={sense}
              showDayFacts={showDayFacts}
              categoryStickyStyle={categoryStickyStyle}
            />
          ))
        : null}
    </Fragment>
  );
}

function defaultOpenIds(view: ReturnType<typeof cashflowMonthView>): Set<string> {
  return new Set([view.income.id, view.expense.id]);
}

export function CashflowSummaryScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveCashflowMonth(month, today, currentMonth);
  const cashflow = useCashflow();
  const router = useRouter();
  const view = useMemo(() => cashflowMonthView(cashflow.document, selectedMonth), [cashflow.document, selectedMonth]);
  const [openIds, setOpenIds] = useState<Set<string>>(() => defaultOpenIds(view));
  const { headRef, categoryStickyStyle } = useStickyTableHead();
  function toggle(id: string) {
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <PageFrame
      title={CASHFLOW_SUMMARY_TITLE}
      full
      fill
      intro={
        <CashflowMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(cashflowSummaryHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      <div className={tableFrameScrollClassName}>
        <table className={tableClassName}>
          <caption className="sr-only">{`Движение денежных средств за ${selectedMonth}`}</caption>
          <thead ref={headRef} className={stickyHeadClassName}>
            <tr>
              <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                <ColumnLabel label="Статья" />
              </th>
              <th scope="col" className={valueHead}>
                <ColumnLabel label="План" hint="С НДС" />
              </th>
              <th scope="col" className={valueHead}>
                <ColumnLabel label="Факт" hint="С НДС" />
              </th>
              <th scope="col" className={valueEnd}>
                <ColumnLabel label="Откл." hint="С НДС" />
              </th>
              {view.days.map((occurredOn, index) => (
                <th
                  key={occurredOn}
                  scope="col"
                  className={
                    index === view.days.length - 1 ? `${columnHeadingClassName} ${tableBorder.rightThick}` : dayHead
                  }
                >
                  <ColumnLabel
                    label={dayLabel(occurredOn)}
                    hint="Факт за день: доходы, расходы и остаток на начало/конец дня, с НДС"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className={`sticky left-0 z-10 ${totalNameClassName}`}>
                Остаток денежных средств на начало периода
              </th>
              <td className={`${totalValueClassName} ${columnDividerClassName}`}>
                <MoneyAmount amount={view.opening.plan} />
              </td>
              <td className={`${totalValueClassName} ${columnDividerClassName}`}>
                <MoneyAmount amount={view.opening.fact} />
              </td>
              <td className={`${totalValueClassName} ${tableBorder.rightThick}`}>
                <MoneyCell label="Откл., остаток на начало" value={view.opening.variance} signed sense="income" />
              </td>
              <DayAmountCells
                days={view.days}
                dayFacts={view.openingDayFacts}
                show
                signed
                sense="income"
                blankIfZero={false}
                fill={totalValueClassName}
              />
            </tr>
            <LineRows
              line={view.income}
              depth={0}
              days={view.days}
              openIds={openIds}
              toggle={toggle}
              sense="income"
              showDayFacts
              categoryStickyStyle={categoryStickyStyle}
            />
            <LineRows
              line={view.expense}
              depth={0}
              days={view.days}
              openIds={openIds}
              toggle={toggle}
              sense="cost"
              showDayFacts
              categoryStickyStyle={categoryStickyStyle}
            />
            <tr>
              <th scope="row" className={`sticky left-0 z-10 ${totalNameClassName}`}>
                Остаток денежных средств на конец периода
              </th>
              <td className={`${totalValueClassName} ${columnDividerClassName}`}>
                <MoneyAmount amount={view.closing.plan} />
              </td>
              <td className={`${totalValueClassName} ${columnDividerClassName}`}>
                <MoneyAmount amount={view.closing.fact} />
              </td>
              <td className={`${totalValueClassName} ${tableBorder.rightThick}`}>
                <MoneyCell label="Откл., остаток на конец" value={view.closing.variance} signed sense="income" />
              </td>
              <DayAmountCells
                days={view.days}
                dayFacts={view.closingDayFacts}
                show
                signed
                sense="income"
                blankIfZero={false}
                fill={totalValueClassName}
              />
            </tr>
          </tbody>
        </table>
      </div>
    </PageFrame>
  );
}
