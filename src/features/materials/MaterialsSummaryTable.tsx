'use client';

import type { MaterialMovementRow, MaterialMovementTotals, MaterialPlanField } from '@/domain/materials';
import { MaterialNormDeviation } from '@/features/materials/MaterialNormDeviation';
import { QuantityCell, QuantityRead } from '@/features/materials/QuantityCell';
import {
  blockCornerClassName,
  blockHeadingClassName,
  columnDividerClassName,
  columnHeadingClassName,
  editableCellClassName,
  keepWithNext,
  nameHeadingClassName,
  stickyHeadClassName,
  tableBorder,
  tableClassName,
  tableFrameClassName,
  totalNameClassName,
  totalValueClassName,
  VatMoneyCell,
} from '@/features/table';

type ColumnKey =
  | 'opening'
  | 'planReceipt'
  | 'factReceipt'
  | 'receiptDeviation'
  | 'receiptPrice'
  | 'receiptCost'
  | 'planConsumption'
  | 'factConsumption'
  | 'consumptionDeviation'
  | 'consumptionPrice'
  | 'consumptionCost'
  | 'bookClosing'
  | 'closing'
  | 'closingDeviation'
  | 'min'
  | 'max'
  | 'normDeviation'
  | 'closingCost';

const COLUMN_GROUPS: { label: string; columns: { key: ColumnKey; label: string }[] }[] = [
  {
    label: 'Остаток на начало',
    columns: [{ key: 'opening', label: 'Остаток' }],
  },
  {
    label: 'Приход от поставщика',
    columns: [
      { key: 'planReceipt', label: 'План' },
      { key: 'factReceipt', label: 'Факт' },
      { key: 'receiptDeviation', label: 'Откл.' },
      { key: 'receiptPrice', label: 'Цена' },
      { key: 'receiptCost', label: 'Стоимость' },
    ],
  },
  {
    label: 'Расход в производстве',
    columns: [
      { key: 'planConsumption', label: 'План' },
      { key: 'factConsumption', label: 'Факт' },
      { key: 'consumptionDeviation', label: 'Откл.' },
      { key: 'consumptionPrice', label: 'Цена' },
      { key: 'consumptionCost', label: 'Стоимость' },
    ],
  },
  {
    label: 'Остаток на конец',
    columns: [
      { key: 'bookClosing', label: 'План' },
      { key: 'closing', label: 'Факт' },
      { key: 'closingDeviation', label: 'Откл.' },
      { key: 'min', label: 'Мин.' },
      { key: 'max', label: 'Макс.' },
      { key: 'normDeviation', label: 'Откл. от норм.' },
      { key: 'closingCost', label: 'Стоимость' },
    ],
  },
];

const COLUMNS = COLUMN_GROUPS.flatMap((group) => group.columns);
const GROUP_END_KEYS = new Set(COLUMN_GROUPS.slice(0, -1).map((group) => group.columns[group.columns.length - 1]?.key));

function factConsumptionEditable(editable: boolean, row: MaterialMovementRow): boolean {
  return editable && !row.deleted;
}

function groupEndClass(key: ColumnKey): string {
  return GROUP_END_KEYS.has(key) ? tableBorder.rightThick : columnDividerClassName;
}

export function MaterialsSummaryTable({
  caption,
  rows,
  totals,
  editable = false,
  onFactConsumption,
}: {
  caption: string;
  rows: MaterialMovementRow[];
  totals: MaterialMovementTotals;
  editable?: boolean;
  onFactConsumption?: (materialId: string, field: MaterialPlanField, value: number) => string | null;
}) {
  return (
    <div className={tableFrameClassName}>
      <table className={tableClassName}>
        <caption className="sr-only">{caption}</caption>
        <thead className={stickyHeadClassName}>
          <tr>
            <th className={`sticky left-0 z-40 ${blockCornerClassName} ${tableBorder.rightThick}`} />
            {COLUMN_GROUPS.map((group, index) => (
              <th
                key={group.label}
                colSpan={group.columns.length}
                scope="colgroup"
                className={`${blockHeadingClassName} ${index < COLUMN_GROUPS.length - 1 ? tableBorder.rightThick : ''}`}
              >
                {keepWithNext(group.label)}
              </th>
            ))}
          </tr>
          <tr>
            <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
              Наименование
            </th>
            {COLUMNS.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`${columnHeadingClassName} last:border-r-0 ${groupEndClass(column.key)}`}
              >
                {keepWithNext(column.label)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.materialId}>
              <th
                scope="row"
                className="sticky left-0 z-10 whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted bg-sheet px-3 py-2 text-left font-normal text-ink"
              >
                {row.name}
                {row.deleted ? <span className="text-muted"> (архив)</span> : null}
              </th>
              {COLUMNS.map((column) => (
                <td
                  key={column.key}
                  className={`border-b border-b-line px-2 py-2 text-right align-middle ${groupEndClass(column.key)} ${
                    column.key === 'factConsumption' && factConsumptionEditable(editable, row)
                      ? editableCellClassName
                      : ''
                  }`}
                >
                  <RowCell
                    column={column.key}
                    row={row}
                    editable={factConsumptionEditable(editable, row)}
                    onFactConsumption={onFactConsumption}
                  />
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <th scope="row" className={`sticky left-0 z-10 ${totalNameClassName}`}>
              {totals.unit ? 'Всего' : 'Сумма'}
            </th>
            {COLUMNS.map((column) => (
              <td key={column.key} className={`${totalValueClassName} ${groupEndClass(column.key)}`}>
                <TotalsCell column={column.key} totals={totals} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function RowCell({
  column,
  row,
  editable,
  onFactConsumption,
}: {
  column: ColumnKey;
  row: MaterialMovementRow;
  editable: boolean;
  onFactConsumption?: (materialId: string, field: MaterialPlanField, value: number) => string | null;
}) {
  const unit = row.unit;
  switch (column) {
    case 'opening':
      return <QuantityRead value={row.openingQuantity} unit={unit} />;
    case 'planReceipt':
      return <QuantityRead value={row.planReceiptQuantity} unit={unit} />;
    case 'factReceipt':
      return <QuantityRead value={row.factReceiptQuantity} unit={unit} />;
    case 'receiptDeviation':
      return <QuantityRead value={row.receiptDeviationQuantity} unit={unit} signed />;
    case 'receiptPrice':
      return row.factReceiptPrice ? (
        <VatMoneyCell label="Цена прихода" withVat={row.factReceiptPrice.withVat} exVat={row.factReceiptPrice.exVat} />
      ) : (
        <span className="text-muted">—</span>
      );
    case 'receiptCost':
      return (
        <VatMoneyCell
          label="Стоимость прихода"
          withVat={row.factReceiptCost.withVat}
          exVat={row.factReceiptCost.exVat}
        />
      );
    case 'planConsumption':
      return <QuantityRead value={row.planConsumptionQuantity} unit={unit} />;
    case 'factConsumption':
      if (!editable || !onFactConsumption) {
        return <QuantityRead value={row.factConsumptionQuantity} unit={unit} />;
      }
      return (
        <QuantityCell
          label={`Факт расхода ${row.name}`}
          value={row.factConsumptionQuantity}
          unit={unit}
          onChange={(value) => onFactConsumption(row.materialId, 'factConsumptionQuantity', value)}
        />
      );
    case 'consumptionDeviation':
      return <QuantityRead value={row.consumptionDeviationQuantity} unit={unit} signed />;
    case 'consumptionPrice':
      return (
        <VatMoneyCell label="Цена расхода" withVat={row.consumptionPrice.withVat} exVat={row.consumptionPrice.exVat} />
      );
    case 'consumptionCost':
      return (
        <VatMoneyCell
          label="Стоимость расхода"
          withVat={row.factConsumptionCost.withVat}
          exVat={row.factConsumptionCost.exVat}
        />
      );
    case 'bookClosing':
      return <QuantityRead value={row.bookClosingQuantity} unit={unit} signed />;
    case 'closing':
      return <QuantityRead value={row.closingQuantity} unit={unit} signed />;
    case 'closingDeviation':
      return <QuantityRead value={row.closingDeviationQuantity} unit={unit} signed />;
    case 'min':
      return <QuantityRead value={row.minQuantity} unit={unit} />;
    case 'max':
      return <QuantityRead value={row.maxQuantity} unit={unit} />;
    case 'normDeviation':
      return (
        <MaterialNormDeviation
          belowMinQuantity={row.belowMinQuantity}
          aboveMaxQuantity={row.aboveMaxQuantity}
          unit={unit}
        />
      );
    case 'closingCost':
      return (
        <VatMoneyCell
          label="Стоимость остатка"
          withVat={row.closingCost.withVat}
          exVat={row.closingCost.exVat}
          signed
        />
      );
    default:
      return null;
  }
}

function TotalsCell({ column, totals }: { column: ColumnKey; totals: MaterialMovementTotals }) {
  const unit = totals.unit ?? undefined;
  switch (column) {
    case 'opening':
      return <QuantityRead value={totals.openingQuantity} unit={unit} />;
    case 'planReceipt':
      return <QuantityRead value={totals.planReceiptQuantity} unit={unit} />;
    case 'factReceipt':
      return <QuantityRead value={totals.factReceiptQuantity} unit={unit} />;
    case 'receiptDeviation':
      return <QuantityRead value={totals.receiptDeviationQuantity} unit={unit} signed />;
    case 'receiptPrice':
    case 'consumptionPrice':
      return <span className="text-muted">—</span>;
    case 'receiptCost':
      return (
        <VatMoneyCell
          label="Стоимость прихода"
          withVat={totals.factReceiptCost.withVat}
          exVat={totals.factReceiptCost.exVat}
        />
      );
    case 'planConsumption':
      return <QuantityRead value={totals.planConsumptionQuantity} unit={unit} />;
    case 'factConsumption':
      return <QuantityRead value={totals.factConsumptionQuantity} unit={unit} />;
    case 'consumptionDeviation':
      return <QuantityRead value={totals.consumptionDeviationQuantity} unit={unit} signed />;
    case 'consumptionCost':
      return (
        <VatMoneyCell
          label="Стоимость расхода"
          withVat={totals.factConsumptionCost.withVat}
          exVat={totals.factConsumptionCost.exVat}
        />
      );
    case 'bookClosing':
      return <QuantityRead value={totals.bookClosingQuantity} unit={unit} signed />;
    case 'closing':
      return <QuantityRead value={totals.closingQuantity} unit={unit} signed />;
    case 'closingDeviation':
      return <QuantityRead value={totals.closingDeviationQuantity} unit={unit} signed />;
    case 'min':
      return <QuantityRead value={totals.minQuantity} unit={unit} />;
    case 'max':
      return <QuantityRead value={totals.maxQuantity} unit={unit} />;
    case 'normDeviation':
      return (
        <MaterialNormDeviation
          belowMinQuantity={totals.belowMinQuantity}
          aboveMaxQuantity={totals.aboveMaxQuantity}
          unit={unit}
        />
      );
    case 'closingCost':
      return (
        <VatMoneyCell
          label="Стоимость остатка"
          withVat={totals.closingCost.withVat}
          exVat={totals.closingCost.exVat}
          signed
        />
      );
    default:
      return null;
  }
}
