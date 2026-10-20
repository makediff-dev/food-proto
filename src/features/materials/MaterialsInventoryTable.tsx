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
  { key: 'bookOpening', label: 'План' },
  { key: 'opening', label: 'Факт' },
  { key: 'openingDeviation', label: 'Откл.' },
] as const;

export function MaterialsInventoryTable({
  caption,
  rows,
  totals,
  editable,
  onOpening,
}: {
  caption: string;
  rows: MaterialMovementRow[];
  totals: MaterialMovementTotals;
  editable: boolean;
  onOpening: (materialId: string, quantity: number) => string | null;
}) {
  return (
    <div className={tableFrameClassName}>
      <table className={tableClassName}>
        <caption className="sr-only">{caption}</caption>
        <thead className={stickyHeadClassName}>
          <tr>
            <th className={`sticky left-0 z-40 ${blockCornerClassName} ${tableBorder.rightThick}`} />
            <th colSpan={COLUMNS.length} scope="colgroup" className={blockHeadingClassName}>
              {keepWithNext('Остаток на начало')}
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
                <QuantityRead value={row.bookOpeningQuantity} unit={row.unit} />
              </td>
              <td
                className={`border-b border-b-line px-2 py-2 text-right ${columnDividerClassName} ${
                  editable && !row.deleted ? editableCellClassName : ''
                }`}
              >
                {editable && !row.deleted ? (
                  <QuantityCell
                    label={`Остаток на начало ${row.name}`}
                    value={row.openingQuantity}
                    unit={row.unit}
                    allowNegative
                    onChange={(value) => onOpening(row.materialId, value)}
                  />
                ) : (
                  <QuantityRead value={row.openingQuantity} unit={row.unit} />
                )}
              </td>
              <td className={`border-b border-b-line px-2 py-2 text-right ${columnDividerClassName}`}>
                <QuantityRead value={row.openingDeviationQuantity} unit={row.unit} signed />
              </td>
            </tr>
          ))}
          <tr>
            <th scope="row" className={`sticky left-0 z-10 ${totalNameClassName}`}>
              {totals.unit ? 'Всего' : 'Сумма'}
            </th>
            <td className={`${totalValueClassName} ${columnDividerClassName}`}>
              <QuantityRead value={totals.bookOpeningQuantity} unit={totals.unit ?? undefined} />
            </td>
            <td className={`${totalValueClassName} ${columnDividerClassName}`}>
              <QuantityRead value={totals.openingQuantity} unit={totals.unit ?? undefined} />
            </td>
            <td className={`${totalValueClassName} ${columnDividerClassName}`}>
              <QuantityRead value={totals.openingDeviationQuantity} unit={totals.unit ?? undefined} signed />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
