'use client';

import { QuantityRead } from '@/features/materials/QuantityCell';
import {
  ColumnLabel,
  cellKindClassName,
  columnDividerClassName,
  columnHeadingClassName,
  Empty,
  entityNameRowClassName,
  nameHeadingClassName,
  ProductIndex,
  stickyHeadClassName,
  tableBorder,
  tableClassName,
  tableFrameClassName,
  totalNameClassName,
  totalValueClassName,
  VatMoneyCell,
} from '@/features/table';

export type RecipeCostDetailLine = {
  lineId: string;
  name: string;
  unit: string;
  quantity: number;
  planUnitPrice: { withVat: number; exVat: number };
  factUnitPrice: { withVat: number; exVat: number };
  planContribution: { withVat: number; exVat: number };
  factContribution: { withVat: number; exVat: number };
  contributionDeviation: { withVat: number; exVat: number };
};

export type RecipeCostDetailUnitCost = {
  plan: { withVat: number; exVat: number };
  fact: { withVat: number; exVat: number };
};

export type RecipeCostDetailExtraUnitRow = {
  label: string;
  plan: { withVat: number; exVat: number };
  fact: { withVat: number; exVat: number };
  deviation: { withVat: number; exVat: number };
};

const COLUMNS = [
  { key: 'quantity', label: 'Кол-во' },
  { key: 'planPrice', label: 'Цена план' },
  { key: 'factPrice', label: 'Цена факт' },
  { key: 'planContribution', label: 'Вклад план' },
  { key: 'factContribution', label: 'Вклад факт' },
  { key: 'deviation', label: 'Откл.' },
] as const;

type ColumnKey = (typeof COLUMNS)[number]['key'];

function columnEdgeClass(key: ColumnKey): string {
  return key === 'deviation' ? tableBorder.rightThick : columnDividerClassName;
}

/**
 * Вклад ингредиентов и одна строка «Всего»: сумма количества, цена единицы (план/факт),
 * сумма вклада в рублях — как сумма/среднее в остальных отчётах.
 */
export function RecipeCostDetailTable({
  caption,
  lines,
  unitCost,
  extraUnitRows = [],
  embedded = false,
}: {
  caption: string;
  lines: readonly RecipeCostDetailLine[];
  /** Себестоимость единицы в колонках «Цена план» / «Цена факт» строки «Всего». */
  unitCost: RecipeCostDetailUnitCost;
  /** Доп. единица (например «За шт»), только цены. */
  extraUnitRows?: readonly RecipeCostDetailExtraUnitRow[];
  /** Вложенная таблица под строкой свода: без собственной рамки и sticky-шапки, в край ячейки. */
  embedded?: boolean;
}) {
  const quantityTotal = sumQuantity(lines);
  const planContribution = sumMoney(lines.map((line) => line.planContribution));
  const factContribution = sumMoney(lines.map((line) => line.factContribution));
  const contributionDeviation = sumMoney(lines.map((line) => line.contributionDeviation));

  return (
    <div className={embedded ? 'overflow-x-auto bg-sheet' : tableFrameClassName}>
      <table className={tableClassName}>
        <caption className="sr-only">{caption}</caption>
        <thead className={embedded ? undefined : stickyHeadClassName}>
          <tr>
            <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
              Ингредиент
            </th>
            {COLUMNS.map((column) => (
              <th key={column.key} scope="col" className={`${columnHeadingClassName} ${columnEdgeClass(column.key)}`}>
                <ColumnLabel label={column.label} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lines.map((line, index) => (
            <tr key={line.lineId}>
              <th scope="row" className={entityNameRowClassName('repeated')}>
                <span className="inline-flex w-full min-w-0 items-center gap-2">
                  <ProductIndex index={index + 1} />
                  <span className="min-w-0 flex-1 text-left text-sm leading-none text-ink">{line.name}</span>
                </span>
              </th>
              <td
                className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${cellKindClassName.repeated} ${columnEdgeClass('quantity')}`}
              >
                <QuantityRead value={line.quantity} unit={line.unit} />
              </td>
              <td
                className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${cellKindClassName.computed} ${columnEdgeClass('planPrice')}`}
              >
                <VatMoneyCell label="Цена план" withVat={line.planUnitPrice.withVat} exVat={line.planUnitPrice.exVat} />
              </td>
              <td
                className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${cellKindClassName.computed} ${columnEdgeClass('factPrice')}`}
              >
                <VatMoneyCell label="Цена факт" withVat={line.factUnitPrice.withVat} exVat={line.factUnitPrice.exVat} />
              </td>
              <td
                className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${cellKindClassName.computed} ${columnEdgeClass('planContribution')}`}
              >
                <VatMoneyCell
                  label="Вклад план"
                  withVat={line.planContribution.withVat}
                  exVat={line.planContribution.exVat}
                />
              </td>
              <td
                className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${cellKindClassName.computed} ${columnEdgeClass('factContribution')}`}
              >
                <VatMoneyCell
                  label="Вклад факт"
                  withVat={line.factContribution.withVat}
                  exVat={line.factContribution.exVat}
                />
              </td>
              <td
                className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${cellKindClassName.computed} ${columnEdgeClass('deviation')}`}
              >
                <VatMoneyCell
                  label="Откл. вклада"
                  withVat={line.contributionDeviation.withVat}
                  exVat={line.contributionDeviation.exVat}
                  signed
                />
              </td>
            </tr>
          ))}
          <tr>
            <th scope="row" className={`sticky left-0 z-10 ${totalNameClassName}`}>
              Всего
            </th>
            <td className={`${totalValueClassName} ${columnEdgeClass('quantity')}`}>
              {quantityTotal ? <QuantityRead value={quantityTotal.value} unit={quantityTotal.unit} /> : <Empty />}
            </td>
            <td className={`${totalValueClassName} ${columnEdgeClass('planPrice')}`}>
              <VatMoneyCell label="Цена план всего" withVat={unitCost.plan.withVat} exVat={unitCost.plan.exVat} />
            </td>
            <td className={`${totalValueClassName} ${columnEdgeClass('factPrice')}`}>
              <VatMoneyCell label="Цена факт всего" withVat={unitCost.fact.withVat} exVat={unitCost.fact.exVat} />
            </td>
            <td className={`${totalValueClassName} ${columnEdgeClass('planContribution')}`}>
              <VatMoneyCell
                label="Вклад план всего"
                withVat={planContribution.withVat}
                exVat={planContribution.exVat}
              />
            </td>
            <td className={`${totalValueClassName} ${columnEdgeClass('factContribution')}`}>
              <VatMoneyCell
                label="Вклад факт всего"
                withVat={factContribution.withVat}
                exVat={factContribution.exVat}
              />
            </td>
            <td className={`${totalValueClassName} ${columnEdgeClass('deviation')}`}>
              <VatMoneyCell
                label="Откл. вклада всего"
                withVat={contributionDeviation.withVat}
                exVat={contributionDeviation.exVat}
                signed
              />
            </td>
          </tr>
          {extraUnitRows.map((row) => (
            <tr key={row.label}>
              <th scope="row" className={`sticky left-0 z-10 ${totalNameClassName} border-t-0`}>
                {row.label}
              </th>
              <TotalEmpty edge="quantity" continued />
              <td className={`${totalValueClassName} border-t-0 ${columnEdgeClass('planPrice')}`}>
                <VatMoneyCell label={`${row.label} план`} withVat={row.plan.withVat} exVat={row.plan.exVat} />
              </td>
              <td className={`${totalValueClassName} border-t-0 ${columnEdgeClass('factPrice')}`}>
                <VatMoneyCell label={`${row.label} факт`} withVat={row.fact.withVat} exVat={row.fact.exVat} />
              </td>
              <TotalEmpty edge="planContribution" continued />
              <TotalEmpty edge="factContribution" continued />
              <td className={`${totalValueClassName} border-t-0 ${columnEdgeClass('deviation')}`}>
                <VatMoneyCell
                  label={`${row.label} откл.`}
                  withVat={row.deviation.withVat}
                  exVat={row.deviation.exVat}
                  signed
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TotalEmpty({ edge, continued = false }: { edge: ColumnKey; continued?: boolean }) {
  const valueClass = continued ? `${totalValueClassName} border-t-0` : totalValueClassName;
  return (
    <td className={`${valueClass} ${columnEdgeClass(edge)}`}>
      <Empty />
    </td>
  );
}

function sumMoney(items: readonly { withVat: number; exVat: number }[]): { withVat: number; exVat: number } {
  return items.reduce((sum, item) => ({ withVat: sum.withVat + item.withVat, exVat: sum.exVat + item.exVat }), {
    withVat: 0,
    exVat: 0,
  });
}

function sumQuantity(lines: readonly RecipeCostDetailLine[]): { value: number; unit: string } | null {
  if (lines.length === 0) {
    return null;
  }
  const unit = lines[0]?.unit;
  if (!unit || lines.some((line) => line.unit !== unit)) {
    return null;
  }
  return {
    value: lines.reduce((sum, line) => sum + line.quantity, 0),
    unit,
  };
}
