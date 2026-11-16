'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { propertyTaxForMonth } from '@/domain/property-tax';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { CashflowMonthBar, resolveCashflowMonth } from '@/features/cashflow/CashflowMonthBar';
import { CASHFLOW_PLAN_TITLE, cashflowPlanHref } from '@/features/cashflow/paths';
import { PROPERTY_TAX_ERROR, parsePropertyTaxMoney } from '@/features/cashflow/text';
import { usePropertyTax } from '@/features/cashflow/use-property-tax';
import { useRole } from '@/features/roles/RoleProvider';
import { PageFrame } from '@/features/shell/PageFrame';
import {
  ColumnLabel,
  cellKindClassName,
  columnHeadingClassName,
  entityNameRowClassName,
  MoneyCell,
  nameHeadingClassName,
  stickyHeadClassName,
  tableBorder,
  tableClassName,
  tableFrameClassName,
} from '@/features/table';

const valueEnd = `${columnHeadingClassName} ${tableBorder.rightThick}`;
const valueCellEnd = `w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${tableBorder.rightThick}`;

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
      title={CASHFLOW_PLAN_TITLE}
      full
      intro={
        <CashflowMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(cashflowPlanHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      <div className={tableFrameClassName}>
        <table className={tableClassName}>
          <caption className="sr-only">{`План налога на имущество за ${selectedMonth}`}</caption>
          <thead className={stickyHeadClassName}>
            <tr>
              <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                <ColumnLabel label="Статья" />
              </th>
              <th scope="col" className={valueEnd}>
                <ColumnLabel label="План" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className={entityNameRowClassName('repeated')}>
                Налог на имущество
              </th>
              <td className={`${valueCellEnd} ${cellKindClassName[inputKind(editable)]}`}>
                <MoneyCell
                  label="Налог на имущество, план"
                  value={view.plan}
                  parse={parsePropertyTaxMoney}
                  onChange={
                    editable
                      ? (amount) => {
                          const rejection = propertyTax.setPlan(selectedMonth, amount);
                          return rejection ? PROPERTY_TAX_ERROR[rejection] : null;
                        }
                      : undefined
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </PageFrame>
  );
}
