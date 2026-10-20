'use client';

import { costWithVat } from '@/domain/cost';
import type { MaterialMovementRow, MaterialMovementTotals, MaterialPlanField } from '@/domain/materials';
import { MaterialNormDeviation } from '@/features/materials/MaterialNormDeviation';
import { QuantityCell, QuantityRead } from '@/features/materials/QuantityCell';
import { IconTrash } from '@/features/shell/Icons';
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
  | 'price'
  | 'planReceipt'
  | 'planReceiptCost'
  | 'planConsumption'
  | 'planConsumptionCost'
  | 'min'
  | 'max'
  | 'normDeviation'
  | 'recommended';

const COLUMNS: { key: ColumnKey; label: string; editable: boolean }[] = [
  { key: 'price', label: 'Цена', editable: true },
  { key: 'planReceipt', label: 'Приход', editable: true },
  { key: 'planReceiptCost', label: 'Стоимость прихода', editable: false },
  { key: 'planConsumption', label: 'Расход', editable: true },
  { key: 'planConsumptionCost', label: 'Стоимость расхода', editable: false },
  { key: 'min', label: 'Мин.', editable: true },
  { key: 'max', label: 'Макс.', editable: true },
  { key: 'normDeviation', label: 'Откл.', editable: false },
  { key: 'recommended', label: 'Рекомендуемый приход', editable: false },
];

export function MaterialsPlanTable({
  caption,
  rows,
  totals,
  editable,
  onField,
  onDelete,
}: {
  caption: string;
  rows: MaterialMovementRow[];
  totals: MaterialMovementTotals;
  editable: boolean;
  onField: (materialId: string, field: MaterialPlanField, value: number) => string | null;
  onDelete: (materialId: string, name: string) => void;
}) {
  return (
    <div className={tableFrameClassName}>
      <table className={tableClassName}>
        <caption className="sr-only">{caption}</caption>
        <thead className={stickyHeadClassName}>
          <tr>
            <th className={`sticky left-0 z-40 ${blockCornerClassName} ${tableBorder.rightThick}`} />
            <th colSpan={COLUMNS.length} scope="colgroup" className={blockHeadingClassName}>
              {keepWithNext('Плановые показатели')}
            </th>
          </tr>
          <tr>
            <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
              Наименование
            </th>
            {COLUMNS.map((column) => (
              <th key={column.key} scope="col" className={`${columnHeadingClassName} ${tableBorder.rightThin}`}>
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
                <span className="inline-flex items-center gap-2">
                  <span>
                    {row.name}
                    {row.deleted ? <span className="text-muted"> (архив)</span> : null}
                  </span>
                  {editable && !row.deleted ? (
                    <button
                      type="button"
                      aria-label={`Удалить ${row.name}`}
                      title="Удалить"
                      onClick={() => onDelete(row.materialId, row.name)}
                      className="inline-flex size-8 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                    >
                      <IconTrash />
                    </button>
                  ) : null}
                </span>
              </th>
              {COLUMNS.map((column) => (
                <td
                  key={column.key}
                  className={`border-b border-b-line px-2 py-2 text-right align-middle ${columnDividerClassName} ${
                    editable && !row.deleted && column.editable ? editableCellClassName : ''
                  }`}
                >
                  <PlanCell column={column.key} row={row} editable={editable && !row.deleted} onField={onField} />
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <th scope="row" className={`sticky left-0 z-10 ${totalNameClassName}`}>
              {totals.unit ? 'Всего' : 'Сумма'}
            </th>
            {COLUMNS.map((column) => (
              <td key={column.key} className={`${totalValueClassName} ${columnDividerClassName}`}>
                <PlanTotal column={column.key} totals={totals} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function PlanCell({
  column,
  row,
  editable,
  onField,
}: {
  column: ColumnKey;
  row: MaterialMovementRow;
  editable: boolean;
  onField: (materialId: string, field: MaterialPlanField, value: number) => string | null;
}) {
  const unit = row.unit;
  switch (column) {
    case 'price':
      return (
        <VatMoneyCell
          label={`Цена ${row.name}`}
          withVat={row.planPrice.withVat}
          exVat={row.planPrice.exVat}
          onChangeWithVat={editable ? (value) => onField(row.materialId, 'priceWithVat', value) : undefined}
          onChangeExVat={
            editable
              ? (value) => {
                  const withVat = costWithVat(value, row.vatPercent);
                  if (withVat === null) {
                    return 'Укажите цену.';
                  }
                  return onField(row.materialId, 'priceWithVat', withVat);
                }
              : undefined
          }
        />
      );
    case 'planReceipt':
      return editable ? (
        <QuantityCell
          label={`План прихода ${row.name}`}
          value={row.planReceiptQuantity}
          unit={unit}
          onChange={(value) => onField(row.materialId, 'receiptQuantity', value)}
        />
      ) : (
        <QuantityRead value={row.planReceiptQuantity} unit={unit} />
      );
    case 'planReceiptCost':
      return (
        <VatMoneyCell
          label="Стоимость прихода"
          withVat={row.planReceiptCost.withVat}
          exVat={row.planReceiptCost.exVat}
        />
      );
    case 'planConsumption':
      if (!editable) {
        return <QuantityRead value={row.planConsumptionQuantity} unit={unit} />;
      }
      return (
        <QuantityCell
          label={`План расхода ${row.name}`}
          value={row.planConsumptionQuantity}
          unit={unit}
          onChange={(value) => onField(row.materialId, 'consumptionQuantity', value)}
        />
      );
    case 'planConsumptionCost':
      return (
        <VatMoneyCell
          label="Стоимость расхода"
          withVat={row.planConsumptionCost.withVat}
          exVat={row.planConsumptionCost.exVat}
        />
      );
    case 'min':
      return editable ? (
        <QuantityCell
          label={`Минимум ${row.name}`}
          value={row.minQuantity}
          unit={unit}
          allowNegative
          onChange={(value) => onField(row.materialId, 'minQuantity', value)}
        />
      ) : (
        <QuantityRead value={row.minQuantity} unit={unit} />
      );
    case 'max':
      return editable ? (
        <QuantityCell
          label={`Максимум ${row.name}`}
          value={row.maxQuantity}
          unit={unit}
          allowNegative
          onChange={(value) => onField(row.materialId, 'maxQuantity', value)}
        />
      ) : (
        <QuantityRead value={row.maxQuantity} unit={unit} />
      );
    case 'normDeviation':
      return (
        <MaterialNormDeviation
          belowMinQuantity={row.belowMinQuantity}
          aboveMaxQuantity={row.aboveMaxQuantity}
          unit={unit}
        />
      );
    case 'recommended':
      return <QuantityRead value={row.recommendedReceiptQuantity} unit={unit} />;
    default:
      return null;
  }
}

function PlanTotal({ column, totals }: { column: ColumnKey; totals: MaterialMovementTotals }) {
  const unit = totals.unit ?? undefined;
  switch (column) {
    case 'price':
      return <span className="text-muted">—</span>;
    case 'planReceipt':
      return <QuantityRead value={totals.planReceiptQuantity} unit={unit} />;
    case 'planReceiptCost':
      return (
        <VatMoneyCell
          label="Стоимость прихода"
          withVat={totals.planReceiptCost.withVat}
          exVat={totals.planReceiptCost.exVat}
        />
      );
    case 'planConsumption':
      return <QuantityRead value={totals.planConsumptionQuantity} unit={unit} />;
    case 'planConsumptionCost':
      return (
        <VatMoneyCell
          label="Стоимость расхода"
          withVat={totals.planConsumptionCost.withVat}
          exVat={totals.planConsumptionCost.exVat}
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
    case 'recommended':
      return <QuantityRead value={totals.recommendedReceiptQuantity} unit={unit} />;
    default:
      return null;
  }
}
