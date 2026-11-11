'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { propertyTaxForMonth } from '@/domain/property-tax';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { CashflowMonthBar, resolveCashflowMonth } from '@/features/cashflow/CashflowMonthBar';
import { CASHFLOW_PROPERTY_TAX_TITLE, cashflowPropertyTaxHref } from '@/features/cashflow/paths';
import { PROPERTY_TAX_ERROR, parsePropertyTaxMoney } from '@/features/cashflow/text';
import { usePropertyTax } from '@/features/cashflow/use-property-tax';
import { useRole } from '@/features/roles/RoleProvider';
import { PageFrame } from '@/features/shell/PageFrame';
import {
  ColumnLabel,
  cellKindClassName,
  columnDividerClassName,
  columnHeadingClassName,
  entityNameRowClassName,
  MoneyCell,
  nameHeadingClassName,
  stickyHeadClassName,
  tableBorder,
  tableClassName,
  tableFrameClassName,
} from '@/features/table';

const valueHead = `${columnHeadingClassName} ${columnDividerClassName}`;
const valueCell = `w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`;
const groupEnd = `${columnHeadingClassName} ${tableBorder.rightThick}`;
const valueEnd = `w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${tableBorder.rightThick}`;

function inputKind(editable: boolean): 'assigned' | 'computed' {
  return editable ? 'assigned' : 'computed';
}

export function PropertyTaxScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveCashflowMonth(month, today, currentMonth);
  const propertyTax = usePropertyTax();
  const { canEditCreditAndCashflow } = useRole();
  const router = useRouter();
  const editable = propertyTax.hydrated && canEditCreditAndCashflow;
  const view = useMemo(
    () => propertyTaxForMonth(propertyTax.document, selectedMonth),
    [propertyTax.document, selectedMonth],
  );

  return (
    <PageFrame
      title={CASHFLOW_PROPERTY_TAX_TITLE}
      full
      lede="План и факт налога на имущество за месяц — итоговые суммы в рублях, без расчёта базы. Суммы попадают в отчёт ДДС."
      intro={
        <CashflowMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(cashflowPropertyTaxHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      <div className={tableFrameClassName}>
        <table className={tableClassName}>
          <caption className="sr-only">{`Налог на имущество за ${selectedMonth}`}</caption>
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
              <th scope="col" className={groupEnd}>
                <ColumnLabel label="Откл." />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className={entityNameRowClassName('repeated')}>
                Налог на имущество
              </th>
              <td className={`${valueCell} ${cellKindClassName[inputKind(editable)]}`}>
                <MoneyCell
                  label="Налог на имущество, план"
                  value={view.plan}
                  parse={parsePropertyTaxMoney}
                  onChange={
                    editable
                      ? (amount) => {
                          const rejection = propertyTax.setField(selectedMonth, 'plan', amount);
                          return rejection ? PROPERTY_TAX_ERROR[rejection] : null;
                        }
                      : undefined
                  }
                />
              </td>
              <td className={`${valueCell} ${cellKindClassName[inputKind(editable)]}`}>
                <MoneyCell
                  label="Налог на имущество, факт"
                  value={view.fact}
                  parse={parsePropertyTaxMoney}
                  onChange={
                    editable
                      ? (amount) => {
                          const rejection = propertyTax.setField(selectedMonth, 'fact', amount);
                          return rejection ? PROPERTY_TAX_ERROR[rejection] : null;
                        }
                      : undefined
                  }
                />
              </td>
              <td className={`${valueEnd} ${cellKindClassName.computed}`}>
                <MoneyCell label="Налог на имущество, откл." value={view.variance} signed sense="income" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </PageFrame>
  );
}
