'use client';

import type { HrTaxLineView, HrTaxRateField } from '@/domain/hr';
import { formatTaxRate, HR_ERROR } from '@/features/opex/text';
import {
  ColumnLabel,
  cellKindClassName,
  columnDividerClassName,
  columnHeadingClassName,
  entityNameRowClassName,
  HundredthsCell,
  MoneyAmount,
  nameHeadingClassName,
  tableClassName,
  tableFrameClassName,
} from '@/features/table';

const valueHead = `${columnHeadingClassName} ${columnDividerClassName}`;
const valueCell = `border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`;

const PLAN_FIELD: Record<HrTaxLineView['id'], HrTaxRateField> = {
  ndfl: 'planNdflHundredths',
  social: 'planSocialHundredths',
  injury: 'planInjuryHundredths',
  'outsourcing-vat': 'planOutsourcingVatHundredths',
};

const FACT_FIELD: Record<HrTaxLineView['id'], HrTaxRateField> = {
  ndfl: 'factNdflHundredths',
  social: 'factSocialHundredths',
  injury: 'factInjuryHundredths',
  'outsourcing-vat': 'factOutsourcingVatHundredths',
};

/** Ставки НДФЛ, соцстраха, травматизма и НДС аутсорса месяца. База и сумма считаются. */
export function HrTaxRateBlock({
  side,
  taxes,
  editable,
  onRate,
}: {
  side: 'plan' | 'fact';
  taxes: HrTaxLineView[];
  editable: boolean;
  onRate: (field: HrTaxRateField, rateHundredths: number) => string | null;
}) {
  const fields = side === 'plan' ? PLAN_FIELD : FACT_FIELD;
  const rateHint = side === 'fact' ? 'На весь месяц, не на выбранный день' : undefined;

  return (
    <div className={tableFrameClassName}>
      <table className={tableClassName}>
        <caption className="sr-only">Зарплатные налоги и НДС аутсорса</caption>
        <thead>
          <tr>
            <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
              <ColumnLabel label="Налог" />
            </th>
            <th scope="col" className={valueHead}>
              <ColumnLabel label="База" />
            </th>
            <th scope="col" className={valueHead}>
              <ColumnLabel label="%" hint={rateHint} />
            </th>
            <th scope="col" className={valueHead}>
              <ColumnLabel label="Сумма" />
            </th>
          </tr>
        </thead>
        <tbody>
          {taxes.map((tax) => {
            const rate = side === 'plan' ? tax.planRateHundredths : tax.factRateHundredths;
            const base = side === 'plan' ? tax.planBaseExVat : tax.factBaseExVat;
            const amount = side === 'plan' ? tax.planAmountExVat : tax.factAmountExVat;
            return (
              <tr key={tax.id}>
                <th scope="row" className={entityNameRowClassName('repeated')}>
                  {tax.name}
                </th>
                <td className={`${valueCell} ${cellKindClassName.computed}`}>
                  <MoneyAmount amount={base} />
                </td>
                <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
                  {editable ? (
                    <HundredthsCell
                      label={`Ставка, ${tax.name}`}
                      value={rate}
                      invalidMessage={HR_ERROR.taxRate}
                      onChange={(next) => onRate(fields[tax.id], next)}
                    />
                  ) : (
                    formatTaxRate(rate)
                  )}
                </td>
                <td className={`${valueCell} ${cellKindClassName.computed}`}>
                  <MoneyAmount amount={amount} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
