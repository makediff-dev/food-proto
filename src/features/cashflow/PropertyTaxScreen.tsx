'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { profitTaxRateHundredths } from '@/domain/profit-tax';
import { propertyTaxForMonth } from '@/domain/property-tax';
import { monthKeyFromDate } from '@/domain/sales-plan';
import { CashflowMonthBar, resolveCashflowMonth } from '@/features/cashflow/CashflowMonthBar';
import { CASHFLOW_PLAN_TITLE, cashflowPlanHref } from '@/features/cashflow/paths';
import { PROFIT_TAX_ERROR, PROPERTY_TAX_ERROR, parsePropertyTaxMoney } from '@/features/cashflow/text';
import { useProfitTax } from '@/features/cashflow/use-profit-tax';
import { usePropertyTax } from '@/features/cashflow/use-property-tax';
import { useRole } from '@/features/roles/RoleProvider';
import { PageFrame } from '@/features/shell/PageFrame';
import {
  ColumnLabel,
  cellKindClassName,
  columnHeadingClassName,
  entityNameRowClassName,
  HundredthsCell,
  MoneyCell,
  nameHeadingClassName,
  stickyHeadClassName,
  tableBorder,
  tableClassName,
  tableFrameBorderClassName,
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
  const profitTax = useProfitTax();
  const { canEditCreditAndCashflow } = useRole();
  const router = useRouter();
  const editable = propertyTax.hydrated && profitTax.hydrated && canEditCreditAndCashflow;
  const view = useMemo(
    () => propertyTaxForMonth(propertyTax.document, selectedMonth),
    [propertyTax.document, selectedMonth],
  );
  const profitTaxRate = useMemo(
    () => profitTaxRateHundredths(profitTax.document, selectedMonth),
    [profitTax.document, selectedMonth],
  );

  return (
    <PageFrame
      title={CASHFLOW_PLAN_TITLE}
      full
      fill
      intro={
        <CashflowMonthBar
          month={selectedMonth}
          today={today}
          onOpen={(next) => router.push(cashflowPlanHref({ month: next, currentMonth }), { scroll: false })}
        />
      }
    >
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="flex flex-col gap-8">
          <div className={tableFrameBorderClassName}>
            <table className={tableClassName}>
              <caption className="sr-only">{`Ставка налога на прибыль за ${selectedMonth}`}</caption>
              <thead className={stickyHeadClassName}>
                <tr>
                  <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                    <ColumnLabel label="Статья" />
                  </th>
                  <th scope="col" className={valueEnd}>
                    <ColumnLabel label="Ставка" hint="Этот месяц и все следующие" />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" className={entityNameRowClassName('repeated')}>
                    Налог на прибыль
                  </th>
                  <td className={`${valueCellEnd} ${cellKindClassName[inputKind(editable)]}`}>
                    <HundredthsCell
                      label="Ставка налога на прибыль"
                      value={profitTaxRate}
                      unit="%"
                      invalidMessage={PROFIT_TAX_ERROR.rate}
                      onChange={
                        editable
                          ? (rateHundredths) => {
                              const rejection = profitTax.setRate(selectedMonth, rateHundredths);
                              return rejection ? PROFIT_TAX_ERROR[rejection] : null;
                            }
                          : undefined
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={tableFrameBorderClassName}>
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
        </div>
      </div>
    </PageFrame>
  );
}
