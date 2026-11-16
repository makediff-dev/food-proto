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

const PLAN_FIELD: Record<'ndfl' | 'social' | 'injury', HrTaxRateField> = {
  ndfl: 'planNdflHundredths',
  social: 'planSocialHundredths',
  injury: 'planInjuryHundredths',
};

/** Плановые ставки НДФЛ, соцстраха и травматизма месяца. База и сумма считаются. Ставку НДС аутсорса задают у цеха во вводе плана; суммы с НДС — в ДДС. */
export function HrTaxRateBlock({
  taxes,
  editable,
  onRate,
}: {
  taxes: HrTaxLineView[];
  editable: boolean;
  onRate: (field: HrTaxRateField, rateHundredths: number) => string | null;
}) {
  const editableTaxes = taxes.filter(
    (tax): tax is HrTaxLineView & { id: 'ndfl' | 'social' | 'injury' } => tax.id !== 'outsourcing-vat',
  );

  return (
    <section className="flex flex-col gap-2">
      <h2 className="px-1 text-sm font-medium">Зарплатные налоги</h2>
      <div className={tableFrameClassName}>
        <table className={tableClassName}>
          <caption className="sr-only">Зарплатные налоги</caption>
          <thead>
            <tr>
              <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                <ColumnLabel label="Налог" />
              </th>
              <th scope="col" className={valueHead}>
                <ColumnLabel label="База" />
              </th>
              <th scope="col" className={valueHead}>
                <ColumnLabel label="%" />
              </th>
              <th scope="col" className={valueHead}>
                <ColumnLabel label="Сумма" />
              </th>
            </tr>
          </thead>
          <tbody>
            {editableTaxes.map((tax) => (
              <tr key={tax.id}>
                <th scope="row" className={entityNameRowClassName('repeated')}>
                  {tax.name}
                </th>
                <td className={`${valueCell} ${cellKindClassName.computed}`}>
                  <MoneyAmount amount={tax.planBaseExVat} />
                </td>
                <td className={`${valueCell} ${cellKindClassName[editable ? 'assigned' : 'computed']}`}>
                  {editable ? (
                    <HundredthsCell
                      label={`Ставка, ${tax.name}`}
                      value={tax.planRateHundredths}
                      invalidMessage={HR_ERROR.taxRate}
                      onChange={(next) => onRate(PLAN_FIELD[tax.id], next)}
                    />
                  ) : (
                    formatTaxRate(tax.planRateHundredths)
                  )}
                </td>
                <td className={`${valueCell} ${cellKindClassName.computed}`}>
                  <MoneyAmount amount={tax.planAmountExVat} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
