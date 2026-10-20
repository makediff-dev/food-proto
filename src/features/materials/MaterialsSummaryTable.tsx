import type { MaterialMovementRow, MaterialMovementTotals } from '@/domain/materials';
import { MaterialNormDeviation } from '@/features/materials/MaterialNormDeviation';
import { QuantityRead } from '@/features/materials/QuantityCell';
import {
  blockCornerClassName,
  blockHeadingClassName,
  columnDividerClassName,
  columnHeadingClassName,
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
  | 'bookOpening'
  | 'opening'
  | 'openingDeviation'
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
  | 'closing'
  | 'min'
  | 'max'
  | 'normDeviation'
  | 'closingCost';

const COLUMN_GROUPS: { label: string; columns: { key: ColumnKey; label: string }[] }[] = [
  {
    label: 'Остаток на начало',
    columns: [
      { key: 'bookOpening', label: 'План' },
      { key: 'opening', label: 'Факт' },
      { key: 'openingDeviation', label: 'Откл.' },
    ],
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
      { key: 'closing', label: 'Остаток' },
      { key: 'min', label: 'Мин.' },
      { key: 'max', label: 'Макс.' },
      { key: 'normDeviation', label: 'Откл.' },
      { key: 'closingCost', label: 'Стоимость' },
    ],
  },
];

const COLUMNS = COLUMN_GROUPS.flatMap((group) => group.columns);
const GROUP_END_KEYS = new Set(COLUMN_GROUPS.slice(0, -1).map((group) => group.columns[group.columns.length - 1]?.key));

function groupEndClass(key: ColumnKey): string {
  return GROUP_END_KEYS.has(key) ? tableBorder.rightThick : columnDividerClassName;
}

export function MaterialsSummaryTable({
  caption,
  rows,
  totals,
}: {
  caption: string;
  rows: MaterialMovementRow[];
  totals: MaterialMovementTotals;
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
                {row.normed ? <span className="mt-0.5 block text-xs text-muted">расход по норме</span> : null}
              </th>
              {COLUMNS.map((column) => (
                <td
                  key={column.key}
                  className={`border-b border-b-line px-2 py-2 text-right align-middle ${groupEndClass(column.key)}`}
                >
                  <RowCell column={column.key} row={row} />
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

function RowCell({ column, row }: { column: ColumnKey; row: MaterialMovementRow }) {
  const unit = row.unit;
  switch (column) {
    case 'bookOpening':
      return <QuantityRead value={row.bookOpeningQuantity} unit={unit} />;
    case 'opening':
      return <QuantityRead value={row.openingQuantity} unit={unit} />;
    case 'openingDeviation':
      return <QuantityRead value={row.openingDeviationQuantity} unit={unit} signed />;
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
      return <QuantityRead value={row.factConsumptionQuantity} unit={unit} />;
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
    case 'closing':
      return <QuantityRead value={row.closingQuantity} unit={unit} signed />;
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
    case 'bookOpening':
      return <QuantityRead value={totals.bookOpeningQuantity} unit={unit} />;
    case 'opening':
      return <QuantityRead value={totals.openingQuantity} unit={unit} />;
    case 'openingDeviation':
      return <QuantityRead value={totals.openingDeviationQuantity} unit={unit} signed />;
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
    case 'closing':
      return <QuantityRead value={totals.closingQuantity} unit={unit} signed />;
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
