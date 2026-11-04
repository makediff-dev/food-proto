'use client';

import { useRouter } from 'next/navigation';
import { Fragment, useMemo, useState } from 'react';

import { type OpexGroupView, operatingExpenseMonthView } from '@/domain/operating-expense';
import { monthKeyFromDate, salesPlanForMonth, salesPlanTotals } from '@/domain/sales-plan';
import { OpexMonthBar, resolveOpexMonth } from '@/features/opex/OpexMonthBar';
import { OPEX_SUMMARY_TITLE, opexSummaryHref } from '@/features/opex/paths';
import { useOpex } from '@/features/opex/use-opex';
import { IconChevronDown, IconChevronRight } from '@/features/shell/Icons';
import { PageFrame } from '@/features/shell/PageFrame';
import {
  ColumnLabel,
  categoryBandClassName,
  categoryNameClassName,
  categoryNameRowClassName,
  cellKindClassName,
  columnDividerClassName,
  columnHeadingClassName,
  entityNameRowClassName,
  MoneyAmount,
  nameHeadingClassName,
  PercentCell,
  tableClassName,
  tableFrameClassName,
} from '@/features/table';

const valueHead = `${columnHeadingClassName} ${columnDividerClassName}`;
const valueCell = `border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`;

export function OpexSummaryScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveOpexMonth(month, today, currentMonth);
  const opex = useOpex();
  const router = useRouter();

  const plan = salesPlanForMonth(opex.document, selectedMonth);
  const totals = plan ? salesPlanTotals(opex.document, plan) : null;
  const view = useMemo(
    () =>
      operatingExpenseMonthView(opex.document, selectedMonth, totals?.revenueWithVat ?? 0, totals?.revenueExVat ?? 0),
    [opex.document, selectedMonth, totals?.revenueExVat, totals?.revenueWithVat],
  );

  return (
    <PageFrame
      title={OPEX_SUMMARY_TITLE}
      full
      lede="План, факт и отклонение статей без НДС. HR и транспорт — из своих экранов; прочие — из «Прочее · Ввод плана» и «Прочее · Ввод факта»."
      intro={
        <OpexMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(opexSummaryHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      <div className={tableFrameClassName}>
        <table className={tableClassName}>
          <caption className="sr-only">{`Операционные расходы за ${selectedMonth}, без НДС`}</caption>
          <thead>
            <tr>
              <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                <ColumnLabel label="Наименование" />
              </th>
              <th scope="col" className={valueHead}>
                <ColumnLabel label="План" />
              </th>
              <th scope="col" className={valueHead}>
                <ColumnLabel label="Факт" />
              </th>
              <th scope="col" className={valueHead}>
                <ColumnLabel label="Откл." />
              </th>
              <th scope="col" className={valueHead}>
                <ColumnLabel label="Доля план, %" />
              </th>
              <th scope="col" className={valueHead}>
                <ColumnLabel label="Доля факт, %" />
              </th>
            </tr>
          </thead>
          <tbody>
            {view.groups.map((group) => (
              <GroupBlock key={group.id} group={group} />
            ))}
            <tr className="font-medium">
              <th scope="row" className={categoryNameRowClassName(false)}>
                <span className={categoryNameClassName}>ВСЕГО</span>
              </th>
              <td className={`${valueCell} ${cellKindClassName.computed}`}>
                <MoneyAmount amount={view.totalPlanExVat} />
              </td>
              <td className={`${valueCell} ${cellKindClassName.computed}`}>
                <MoneyAmount amount={view.totalFactExVat} />
              </td>
              <td className={`${valueCell} ${cellKindClassName.computed}`}>
                <MoneyAmount amount={view.totalVarianceExVat} signed sense="cost" />
              </td>
              <td className={`${valueCell} ${cellKindClassName.computed}`} />
              <td className={`${valueCell} ${cellKindClassName.computed}`} />
            </tr>
          </tbody>
        </table>
      </div>
    </PageFrame>
  );
}

function GroupBlock({ group }: { group: OpexGroupView }) {
  const [open, setOpen] = useState(true);
  const count = group.lines.length;

  return (
    <Fragment>
      <tr>
        <th scope="row" className={categoryNameRowClassName(false)}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-expanded={open}
              aria-label={open ? `Свернуть ${group.name}` : `Развернуть ${group.name}`}
              title={open ? 'Свернуть' : 'Развернуть'}
              onClick={() => setOpen((current) => !current)}
              className="inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {open ? <IconChevronDown /> : <IconChevronRight />}
            </button>
            <span className={`${categoryNameClassName} gap-1`}>
              <span className="text-muted">{group.code}</span>
              <span>
                {group.name} ({count})
              </span>
            </span>
          </div>
        </th>
        <td className={`${valueCell} ${categoryBandClassName}`}>
          <MoneyAmount amount={group.planExVat} />
        </td>
        <td className={`${valueCell} ${categoryBandClassName}`}>
          <MoneyAmount amount={group.factExVat} />
        </td>
        <td className={`${valueCell} ${categoryBandClassName}`}>
          <MoneyAmount amount={group.varianceExVat} signed sense="cost" />
        </td>
        <td className={`${valueCell} ${categoryBandClassName}`}>
          <PercentCell value={group.planShareHundredths} scale="hundredths" />
        </td>
        <td className={`${valueCell} ${categoryBandClassName}`}>
          <PercentCell value={group.factShareHundredths} scale="hundredths" />
        </td>
      </tr>
      {open
        ? group.lines.map((row) => (
            <tr key={row.id}>
              <th scope="row" className={entityNameRowClassName('repeated')}>
                <span className="inline-flex items-center gap-1">
                  <span className="text-muted">{row.code}</span>
                  <span>
                    {row.name}
                    {row.deleted ? <span className="text-muted"> (архив)</span> : null}
                  </span>
                </span>
              </th>
              <td className={`${valueCell} ${cellKindClassName.computed}`}>
                <MoneyAmount amount={row.planExVat} />
              </td>
              <td className={`${valueCell} ${cellKindClassName.computed}`}>
                <MoneyAmount amount={row.factExVat} />
              </td>
              <td className={`${valueCell} ${cellKindClassName.computed}`}>
                <MoneyAmount amount={row.varianceExVat} signed sense="cost" />
              </td>
              <td className={`${valueCell} ${cellKindClassName.computed}`}>
                <PercentCell value={row.planShareHundredths} scale="hundredths" />
              </td>
              <td className={`${valueCell} ${cellKindClassName.computed}`}>
                <PercentCell value={row.factShareHundredths} scale="hundredths" />
              </td>
            </tr>
          ))
        : null}
    </Fragment>
  );
}
