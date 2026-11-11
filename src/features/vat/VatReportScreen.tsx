'use client';

import { useRouter } from 'next/navigation';
import { Fragment, useMemo, useState } from 'react';

import { monthKeyFromDate } from '@/domain/sales-plan';
import { type VatMoneySide, type VatReportLine, vatReportMonthView } from '@/domain/vat-report';
import { CashflowMonthBar, resolveCashflowMonth } from '@/features/cashflow/CashflowMonthBar';
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
import { VAT_REPORT_SUMMARY_TITLE, vatReportSummaryHref } from '@/features/vat/paths';
import { useVatReport } from '@/features/vat/use-vat-report';

const valueHead = `${columnHeadingClassName} ${columnDividerClassName}`;
const valueEnd = `${columnHeadingClassName} ${tableBorder.rightThick}`;
const valueCell = `w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`;
const valueCellEnd = `w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${tableBorder.rightThick}`;

/** Зачет уменьшает платёж, остальные налоги его увеличивают. */
function varianceSense(id: string): 'income' | 'cost' {
  return id === 'deductible' || id.startsWith('deductible:') ? 'income' : 'cost';
}

function LineRows({
  line,
  depth,
  openIds,
  toggle,
}: {
  line: VatReportLine;
  depth: number;
  openIds: Set<string>;
  toggle: (id: string) => void;
}) {
  const hasChildren = Boolean(line.children && line.children.length > 0);
  const open = openIds.has(line.id);
  const isGroup = depth === 0 || hasChildren;
  const nameRow = isGroup ? categoryNameRowClassName(false) : entityNameRowClassName('repeated');
  const sideKind: CellKind = hasChildren ? 'computed' : 'repeated';
  const amountFill = isGroup ? categoryBandClassName : cellKindClassName[sideKind];
  const varianceFill = isGroup ? categoryBandClassName : cellKindClassName.computed;

  return (
    <Fragment>
      <tr>
        <th scope="row" className={nameRow}>
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
        <AmountCells line={line} amountFill={amountFill} varianceFill={varianceFill} />
      </tr>
      {hasChildren && open
        ? line.children?.map((child) => (
            <LineRows key={child.id} line={child} depth={depth + 1} openIds={openIds} toggle={toggle} />
          ))
        : null}
    </Fragment>
  );
}

function AmountCells({
  line,
  amountFill,
  varianceFill,
}: {
  line: VatReportLine;
  amountFill: string;
  varianceFill: string;
}) {
  return (
    <>
      <td className={`${valueCell} ${amountFill}`}>
        <MoneyAmount amount={line.amounts.plan} />
      </td>
      <td className={`${valueCell} ${amountFill}`}>
        <MoneyAmount amount={line.amounts.fact} />
      </td>
      <td className={`${valueCellEnd} ${varianceFill}`}>
        <MoneyCell label={`Откл., ${line.name}`} value={line.amounts.variance} signed sense={varianceSense(line.id)} />
      </td>
    </>
  );
}

function ResultRow({ label, amounts, total = false }: { label: string; amounts: VatMoneySide; total?: boolean }) {
  const nameClass = total ? totalNameClassName : categoryNameRowClassName(false);
  const valueClass = total
    ? `${totalValueClassName} ${columnDividerClassName}`
    : `${valueCell} ${categoryBandClassName}`;
  const endClass = total
    ? `${totalValueClassName} ${tableBorder.rightThick}`
    : `${valueCellEnd} ${categoryBandClassName}`;
  return (
    <tr>
      <th scope="row" className={nameClass}>
        <div className="flex items-center gap-2" style={total ? undefined : { paddingLeft: '1.25rem' }}>
          <span className="inline-block size-8 shrink-0" aria-hidden />
          <span className={total ? undefined : categoryNameClassName}>{label}</span>
        </div>
      </th>
      <td className={valueClass}>
        <MoneyAmount amount={amounts.plan} />
      </td>
      <td className={valueClass}>
        <MoneyAmount amount={amounts.fact} />
      </td>
      <td className={endClass}>
        <MoneyCell label={`Откл., ${label}`} value={amounts.variance} signed sense="cost" />
      </td>
    </tr>
  );
}

export function VatReportScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveCashflowMonth(month, today, currentMonth);
  const store = useVatReport();
  const router = useRouter();
  const view = useMemo(() => vatReportMonthView(store.document, selectedMonth), [store.document, selectedMonth]);
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set([view.deductible.id, view.payroll.id]));

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
      title={VAT_REPORT_SUMMARY_TITLE}
      full
      lede="НДС к зачету со сырья и расходов, зарплатные налоги, налог на прибыль и налог на имущество. Отрицательный НДС — к возмещению."
      intro={
        <CashflowMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(vatReportSummaryHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      <div className={tableFrameClassName}>
        <table className={tableClassName}>
          <caption className="sr-only">{`Налоги за ${selectedMonth}`}</caption>
          <thead className={stickyHeadClassName}>
            <tr>
              <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                <ColumnLabel label="Статья" />
              </th>
              <th scope="col" className={valueHead}>
                <ColumnLabel label="План" />
              </th>
              <th scope="col" className={valueHead}>
                <ColumnLabel label="Факт" />
              </th>
              <th scope="col" className={valueEnd}>
                <ColumnLabel label="Откл." />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className={categoryNameRowClassName(false)}>
                <div className="flex items-center gap-2">
                  <span className="inline-block size-8 shrink-0" aria-hidden />
                  <span className={categoryNameClassName}>Расчет НДС</span>
                </div>
              </th>
              <td className={`${valueCell} ${categoryBandClassName}`} />
              <td className={`${valueCell} ${categoryBandClassName}`} />
              <td className={`${valueCellEnd} ${categoryBandClassName}`} />
            </tr>
            <LineRows line={view.sales} depth={1} openIds={openIds} toggle={toggle} />
            <LineRows line={view.deductible} depth={1} openIds={openIds} toggle={toggle} />
            <ResultRow label="НДС к уплате" amounts={view.payable} />
            <LineRows line={view.payroll} depth={0} openIds={openIds} toggle={toggle} />
            <LineRows line={view.profit} depth={0} openIds={openIds} toggle={toggle} />
            <LineRows line={view.property} depth={0} openIds={openIds} toggle={toggle} />
            <ResultRow label="Всего налоги" amounts={view.total} total />
          </tbody>
        </table>
      </div>
    </PageFrame>
  );
}
