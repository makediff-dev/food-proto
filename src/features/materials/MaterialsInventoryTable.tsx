'use client';

import type { MaterialMovementRow, MaterialMovementTotals } from '@/domain/materials';
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
} from '@/features/table';

const COLUMNS = [
  { key: 'bookClosing', label: 'План' },
  { key: 'closing', label: 'Факт' },
  { key: 'closingDeviation', label: 'Откл.' },
] as const;

export function MaterialsInventoryTable({
  caption,
  rows,
  totals,
  editable,
  onClosing,
}: {
  caption: string;
  rows: MaterialMovementRow[];
  totals: MaterialMovementTotals;
  editable: boolean;
  onClosing: (materialId: string, quantity: number) => string | null;
}) {
  return (
    <div className={tableFrameClassName}>
      <table className={tableClassName}>
        <caption className="sr-only">{caption}</caption>
        <thead className={stickyHeadClassName}>
          <tr>
            <th className={`sticky left-0 z-40 ${blockCornerClassName} ${tableBorder.rightThick}`} />
            <th colSpan={COLUMNS.length} scope="colgroup" className={blockHeadingClassName}>
              {keepWithNext('Остаток на конец')}
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
                {row.name}
                {row.deleted ? <span className="text-muted"> (архив)</span> : null}
              </th>
              <td className={`border-b border-b-line px-2 py-2 text-right ${columnDividerClassName}`}>
                <QuantityRead value={row.bookClosingQuantity} unit={row.unit} signed />
              </td>
              <td
                className={`border-b border-b-line px-2 py-2 text-right ${columnDividerClassName} ${
                  editable && !row.deleted ? editableCellClassName : ''
                }`}
              >
                {editable && !row.deleted ? (
                  <QuantityCell
                    label={`Остаток на конец ${row.name}`}
                    value={row.closingQuantity}
                    unit={row.unit}
                    allowNegative
                    onChange={(value) => onClosing(row.materialId, value)}
                  />
                ) : (
                  <QuantityRead value={row.closingQuantity} unit={row.unit} signed />
                )}
              </td>
              <td className={`border-b border-b-line px-2 py-2 text-right ${columnDividerClassName}`}>
                <QuantityRead value={row.closingDeviationQuantity} unit={row.unit} signed />
              </td>
            </tr>
          ))}
          <tr>
            <th scope="row" className={`sticky left-0 z-10 ${totalNameClassName}`}>
              {totals.unit ? 'Всего' : 'Сумма'}
            </th>
            <td className={`${totalValueClassName} ${columnDividerClassName}`}>
              <QuantityRead value={totals.bookClosingQuantity} unit={totals.unit ?? undefined} signed />
            </td>
            <td className={`${totalValueClassName} ${columnDividerClassName}`}>
              <QuantityRead value={totals.closingQuantity} unit={totals.unit ?? undefined} signed />
            </td>
            <td className={`${totalValueClassName} ${columnDividerClassName}`}>
              <QuantityRead value={totals.closingDeviationQuantity} unit={totals.unit ?? undefined} signed />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
