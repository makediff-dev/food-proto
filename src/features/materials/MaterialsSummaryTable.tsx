'use client';

import type { MaterialMovementRow, MaterialMovementTotals } from '@/domain/materials';
import { MaterialNormDeviation } from '@/features/materials/MaterialNormDeviation';
import { QuantityRead } from '@/features/materials/QuantityCell';
import {
  MATERIALS_SUMMARY_SUB_BANNERS,
  ReportSubBannerColumnHeaders,
} from '@/features/movement/FinishedGoodsNormativeColumnHeading';
import {
  blockCornerClassName,
  blockHeadingClassName,
  type CellKind,
  cellKindClassName,
  columnDividerClassName,
  entityNameRowClassName,
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
  | 'planReceiptPrice'
  | 'planReceiptCost'
  | 'factReceipt'
  | 'factReceiptPrice'
  | 'factReceiptCost'
  | 'receiptDeviation'
  | 'receiptDeviationPrice'
  | 'receiptDeviationCost'
  | 'planConsumption'
  | 'planConsumptionPrice'
  | 'planConsumptionCost'
  | 'factConsumption'
  | 'factConsumptionPrice'
  | 'factConsumptionCost'
  | 'consumptionDeviation'
  | 'consumptionDeviationPrice'
  | 'consumptionDeviationCost'
  | 'bookClosing'
  | 'currentClosing'
  | 'currentClosingDeviation'
  | 'currentClosingDeviationCost'
  | 'inventoryClosing'
  | 'closingInventoryDeviation'
  | 'closingInventoryDeviationCost'
  | 'min'
  | 'max'
  | 'normDeviation'
  | 'closingCost';

const COLUMN_GROUPS: { label: string; columns: { key: ColumnKey; label: string; hint?: string }[] }[] = [
  {
    label: 'Остаток на начало',
    columns: [{ key: 'opening', label: 'Остаток' }],
  },
  {
    label: 'Приход от поставщика',
    columns: [
      { key: 'planReceipt', label: 'Кол-во' },
      { key: 'planReceiptPrice', label: 'Цена' },
      { key: 'planReceiptCost', label: 'Стоимость' },
      { key: 'factReceipt', label: 'Кол-во' },
      { key: 'factReceiptPrice', label: 'Цена' },
      { key: 'factReceiptCost', label: 'Стоимость' },
      { key: 'receiptDeviation', label: 'Кол-во' },
      { key: 'receiptDeviationPrice', label: 'Цена' },
      { key: 'receiptDeviationCost', label: 'Стоимость' },
    ],
  },
  {
    label: 'Расход в производстве',
    columns: [
      {
        key: 'planConsumption',
        label: 'Кол-во',
        hint: 'Количество, необходимое для выпуска по плану',
      },
      { key: 'planConsumptionPrice', label: 'Цена' },
      { key: 'planConsumptionCost', label: 'Стоимость' },
      {
        key: 'factConsumption',
        label: 'Кол-во',
        hint: 'Количество, необходимое для фактического выпуска',
      },
      { key: 'factConsumptionPrice', label: 'Цена' },
      { key: 'factConsumptionCost', label: 'Стоимость' },
      { key: 'consumptionDeviation', label: 'Кол-во' },
      { key: 'consumptionDeviationPrice', label: 'Цена' },
      { key: 'consumptionDeviationCost', label: 'Стоимость' },
    ],
  },
  {
    label: 'Остаток на конец',
    columns: [
      {
        key: 'bookClosing',
        label: 'План',
        hint: 'остаток на начало + план прихода − план расхода',
      },
      { key: 'currentClosing', label: 'Факт' },
      { key: 'currentClosingDeviation', label: 'Откл.' },
      { key: 'currentClosingDeviationCost', label: 'Стоим. откл.' },
      {
        key: 'inventoryClosing',
        label: 'Факт',
        hint: 'по данным инвентаризации',
      },
      { key: 'closingInventoryDeviation', label: 'Откл.' },
      { key: 'closingInventoryDeviationCost', label: 'Стоим. откл.' },
      { key: 'min', label: 'Мин.' },
      { key: 'max', label: 'Макс.' },
      { key: 'normDeviation', label: 'Откл.' },
      { key: 'closingCost', label: 'Стоимость' },
    ],
  },
];

const COLUMNS = COLUMN_GROUPS.flatMap((group) => group.columns);
const GROUP_END_KEYS = new Set(COLUMN_GROUPS.slice(0, -1).map((group) => group.columns[group.columns.length - 1]?.key));

const COLUMN_KIND: Record<ColumnKey, CellKind> = {
  opening: 'repeated',
  planReceipt: 'repeated',
  planReceiptPrice: 'repeated',
  planReceiptCost: 'repeated',
  factReceipt: 'computed',
  factReceiptPrice: 'computed',
  factReceiptCost: 'computed',
  receiptDeviation: 'computed',
  receiptDeviationPrice: 'computed',
  receiptDeviationCost: 'computed',
  planConsumption: 'computed',
  planConsumptionPrice: 'repeated',
  planConsumptionCost: 'computed',
  factConsumption: 'computed',
  factConsumptionPrice: 'computed',
  factConsumptionCost: 'computed',
  consumptionDeviation: 'computed',
  consumptionDeviationPrice: 'computed',
  consumptionDeviationCost: 'computed',
  bookClosing: 'computed',
  currentClosing: 'computed',
  currentClosingDeviation: 'computed',
  currentClosingDeviationCost: 'computed',
  inventoryClosing: 'repeated',
  closingInventoryDeviation: 'computed',
  closingInventoryDeviationCost: 'computed',
  min: 'repeated',
  max: 'repeated',
  normDeviation: 'computed',
  closingCost: 'computed',
};

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
            <th rowSpan={2} scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
              Наименование
            </th>
            <ReportSubBannerColumnHeaders
              row="primary"
              columns={COLUMNS}
              subBannerGroups={MATERIALS_SUMMARY_SUB_BANNERS}
              groupEndClass={groupEndClass}
              lastColumnExtraClassName="last:border-r-0"
            />
          </tr>
          <tr>
            <ReportSubBannerColumnHeaders
              row="secondary"
              columns={COLUMNS}
              subBannerGroups={MATERIALS_SUMMARY_SUB_BANNERS}
              groupEndClass={groupEndClass}
            />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.materialId}>
              <th scope="row" className={entityNameRowClassName('repeated')}>
                {row.name}
                {row.deleted ? <span className="text-muted"> (архив)</span> : null}
              </th>
              {COLUMNS.map((column) => (
                <td
                  key={column.key}
                  className={`border-b border-b-line px-2 py-2 text-right align-middle ${groupEndClass(column.key)} ${cellKindClassName[COLUMN_KIND[column.key]]}`}
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
    case 'opening':
      return <QuantityRead value={row.openingQuantity} unit={unit} />;
    case 'planReceipt':
      return <QuantityRead value={row.planReceiptQuantity} unit={unit} />;
    case 'planReceiptPrice':
      return <VatMoneyCell label="Плановая цена прихода" withVat={row.planPrice.withVat} exVat={row.planPrice.exVat} />;
    case 'planReceiptCost':
      return (
        <VatMoneyCell
          label="Плановая стоимость прихода"
          withVat={row.planReceiptCost.withVat}
          exVat={row.planReceiptCost.exVat}
        />
      );
    case 'factReceipt':
      return <QuantityRead value={row.factReceiptQuantity} unit={unit} />;
    case 'factReceiptPrice':
      return row.factReceiptPrice ? (
        <VatMoneyCell label="Цена прихода" withVat={row.factReceiptPrice.withVat} exVat={row.factReceiptPrice.exVat} />
      ) : (
        <span className="text-muted">—</span>
      );
    case 'factReceiptCost':
      return (
        <VatMoneyCell
          label="Стоимость прихода"
          withVat={row.factReceiptCost.withVat}
          exVat={row.factReceiptCost.exVat}
        />
      );
    case 'receiptDeviation':
      return <QuantityRead value={row.receiptDeviationQuantity} unit={unit} signed />;
    case 'receiptDeviationPrice':
      return row.receiptDeviationPrice ? (
        <VatMoneyCell
          label="Отклонение цены прихода"
          withVat={row.receiptDeviationPrice.withVat}
          exVat={row.receiptDeviationPrice.exVat}
          signed
          sense="cost"
        />
      ) : (
        <span className="text-muted">—</span>
      );
    case 'receiptDeviationCost':
      return (
        <VatMoneyCell
          label="Отклонение стоимости прихода"
          withVat={row.receiptDeviationCost.withVat}
          exVat={row.receiptDeviationCost.exVat}
          signed
          sense="cost"
        />
      );
    case 'planConsumption':
      return <QuantityRead value={row.planConsumptionQuantity} unit={unit} />;
    case 'factConsumption':
      return <QuantityRead value={row.factConsumptionQuantity} unit={unit} />;
    case 'planConsumptionPrice':
      return <VatMoneyCell label="Плановая цена расхода" withVat={row.planPrice.withVat} exVat={row.planPrice.exVat} />;
    case 'planConsumptionCost':
      return (
        <VatMoneyCell
          label="Плановая стоимость расхода"
          withVat={row.planConsumptionCost.withVat}
          exVat={row.planConsumptionCost.exVat}
        />
      );
    case 'factConsumptionPrice':
      return (
        <VatMoneyCell label="Цена расхода" withVat={row.consumptionPrice.withVat} exVat={row.consumptionPrice.exVat} />
      );
    case 'factConsumptionCost':
      return (
        <VatMoneyCell
          label="Стоимость расхода"
          withVat={row.factConsumptionCost.withVat}
          exVat={row.factConsumptionCost.exVat}
        />
      );
    case 'consumptionDeviation':
      return <QuantityRead value={row.consumptionDeviationQuantity} unit={unit} signed />;
    case 'consumptionDeviationPrice':
      return (
        <VatMoneyCell
          label="Отклонение цены расхода"
          withVat={row.consumptionDeviationPrice.withVat}
          exVat={row.consumptionDeviationPrice.exVat}
          signed
          sense="cost"
        />
      );
    case 'consumptionDeviationCost':
      return (
        <VatMoneyCell
          label="Отклонение стоимости расхода"
          withVat={row.consumptionDeviationCost.withVat}
          exVat={row.consumptionDeviationCost.exVat}
          signed
          sense="cost"
        />
      );
    case 'bookClosing':
      return <QuantityRead value={row.bookClosingQuantity} unit={unit} signed />;
    case 'currentClosing':
      return <QuantityRead value={row.currentClosingQuantity} unit={unit} signed />;
    case 'currentClosingDeviation':
      return <QuantityRead value={row.currentClosingDeviationQuantity} unit={unit} signed />;
    case 'currentClosingDeviationCost':
      return (
        <VatMoneyCell
          label="Стоимость отклонения текущего остатка"
          withVat={row.currentClosingDeviationCost.withVat}
          exVat={row.currentClosingDeviationCost.exVat}
          signed
        />
      );
    case 'inventoryClosing':
      return <QuantityRead value={row.closingQuantity} unit={unit} signed />;
    case 'closingInventoryDeviation':
      return <QuantityRead value={row.closingDeviationQuantity} unit={unit} signed />;
    case 'closingInventoryDeviationCost':
      return (
        <VatMoneyCell
          label="Стоимость отклонения инвентаризации"
          withVat={row.closingInventoryDeviationCost?.withVat ?? null}
          exVat={row.closingInventoryDeviationCost?.exVat ?? null}
          signed
        />
      );
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
    case 'planReceiptPrice':
    case 'factReceiptPrice':
    case 'receiptDeviationPrice':
    case 'planConsumptionPrice':
    case 'factConsumptionPrice':
    case 'consumptionDeviationPrice':
      return <span className="text-muted">—</span>;
    case 'planReceiptCost':
      return (
        <VatMoneyCell
          label="Плановая стоимость прихода"
          withVat={totals.planReceiptCost.withVat}
          exVat={totals.planReceiptCost.exVat}
        />
      );
    case 'factReceipt':
      return <QuantityRead value={totals.factReceiptQuantity} unit={unit} />;
    case 'factReceiptCost':
      return (
        <VatMoneyCell
          label="Стоимость прихода"
          withVat={totals.factReceiptCost.withVat}
          exVat={totals.factReceiptCost.exVat}
        />
      );
    case 'receiptDeviation':
      return <QuantityRead value={totals.receiptDeviationQuantity} unit={unit} signed />;
    case 'receiptDeviationCost':
      return (
        <VatMoneyCell
          label="Отклонение стоимости прихода"
          withVat={totals.receiptDeviationCost.withVat}
          exVat={totals.receiptDeviationCost.exVat}
          signed
          sense="cost"
        />
      );
    case 'planConsumption':
      return <QuantityRead value={totals.planConsumptionQuantity} unit={unit} />;
    case 'factConsumption':
      return <QuantityRead value={totals.factConsumptionQuantity} unit={unit} />;
    case 'planConsumptionCost':
      return (
        <VatMoneyCell
          label="Плановая стоимость расхода"
          withVat={totals.planConsumptionCost.withVat}
          exVat={totals.planConsumptionCost.exVat}
        />
      );
    case 'consumptionDeviation':
      return <QuantityRead value={totals.consumptionDeviationQuantity} unit={unit} signed />;
    case 'factConsumptionCost':
      return (
        <VatMoneyCell
          label="Стоимость расхода"
          withVat={totals.factConsumptionCost.withVat}
          exVat={totals.factConsumptionCost.exVat}
        />
      );
    case 'consumptionDeviationCost':
      return (
        <VatMoneyCell
          label="Отклонение стоимости расхода"
          withVat={totals.consumptionDeviationCost.withVat}
          exVat={totals.consumptionDeviationCost.exVat}
          signed
          sense="cost"
        />
      );
    case 'bookClosing':
      return <QuantityRead value={totals.bookClosingQuantity} unit={unit} signed />;
    case 'currentClosing':
      return <QuantityRead value={totals.currentClosingQuantity} unit={unit} signed />;
    case 'currentClosingDeviation':
      return <QuantityRead value={totals.currentClosingDeviationQuantity} unit={unit} signed />;
    case 'currentClosingDeviationCost':
      return (
        <VatMoneyCell
          label="Стоимость отклонения текущего остатка"
          withVat={totals.currentClosingDeviationCost.withVat}
          exVat={totals.currentClosingDeviationCost.exVat}
          signed
        />
      );
    case 'inventoryClosing':
      return <QuantityRead value={totals.closingQuantity} unit={unit} signed />;
    case 'closingInventoryDeviation':
      return <QuantityRead value={totals.closingDeviationQuantity} unit={unit} signed />;
    case 'closingInventoryDeviationCost':
      return (
        <VatMoneyCell
          label="Стоимость отклонения инвентаризации"
          withVat={totals.closingInventoryDeviationCost?.withVat ?? null}
          exVat={totals.closingInventoryDeviationCost?.exVat ?? null}
          signed
        />
      );
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
