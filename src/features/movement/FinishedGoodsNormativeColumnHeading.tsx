import type { ReactNode } from 'react';

import { ColumnLabel, keepWithNext } from '@/features/table/ColumnLabel';
import { columnHeadingClassName } from '@/features/table/styles';

const NORMATIVE_GROUP_LABEL = 'нормативный';

const NORMATIVE_COLUMN_KEYS = new Set(['min', 'max', 'normDeviation']);

function NormativeGroupedHeading({ columns }: { columns: readonly { key: string; label: string }[] }) {
  return (
    <div className="-mx-1.5 -my-2 flex min-w-0 flex-col">
      <div className="border-b border-line px-1.5 py-1 text-center text-sm font-normal uppercase leading-5 text-ink">
        {keepWithNext(NORMATIVE_GROUP_LABEL)}
      </div>
      <div className="grid grid-cols-3 divide-x divide-line">
        {columns.map((column) => (
          <div key={column.key} className="px-1.5 py-1 text-center">
            <ColumnLabel label={column.label} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FinishedGoodsReportColumnHeaders<K extends string>({
  columns,
  groupEndClass,
  lastColumnExtraClassName = '',
}: {
  columns: readonly { key: K; label: string }[];
  groupEndClass: (key: K) => string;
  lastColumnExtraClassName?: string;
}): ReactNode {
  const normativeColumns = columns.filter((column) => NORMATIVE_COLUMN_KEYS.has(column.key));

  return columns.map((column) => {
    if (column.key === 'max' || column.key === 'normDeviation') {
      return null;
    }

    if (column.key === 'min') {
      return (
        <th
          key="normative-columns"
          colSpan={3}
          scope="colgroup"
          className={`${columnHeadingClassName} ${groupEndClass(column.key)}`}
        >
          <NormativeGroupedHeading columns={normativeColumns} />
        </th>
      );
    }

    return (
      <th
        key={column.key}
        scope="col"
        className={`${columnHeadingClassName} ${lastColumnExtraClassName} ${groupEndClass(column.key)}`}
      >
        <ColumnLabel label={column.label} />
      </th>
    );
  });
}
