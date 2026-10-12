import type { ReactNode } from 'react';

import { ColumnLabel, keepWithNext } from '@/features/table/ColumnLabel';
import { columnHeadingClassName, tableBorder } from '@/features/table/styles';

const NORMATIVE_GROUP_LABEL = 'нормативный';

const NORMATIVE_COLUMN_KEYS = new Set(['min', 'max', 'normDeviation']);

const normativeBannerHeadingClassName =
  'w-px whitespace-normal border-t-[3px] border-t-muted border-b border-b-line bg-paper px-1.5 py-1 text-center align-middle text-sm font-normal uppercase leading-5 text-ink';

const normativeSubHeadingClassName =
  'w-px whitespace-normal border-b-[3px] border-b-muted bg-paper px-1.5 py-1 text-center align-middle text-sm font-normal leading-5 text-ink';

export function FinishedGoodsReportColumnHeaders<K extends string>({
  row,
  columns,
  groupEndClass,
  lastColumnExtraClassName = '',
}: {
  row: 'primary' | 'secondary';
  columns: readonly { key: K; label: string }[];
  groupEndClass: (key: K) => string;
  lastColumnExtraClassName?: string;
}): ReactNode {
  const normativeColumns = columns.filter((column) => NORMATIVE_COLUMN_KEYS.has(column.key));

  if (row === 'secondary') {
    return normativeColumns.map((column) => (
      <th
        key={column.key}
        scope="col"
        className={`${normativeSubHeadingClassName} ${
          column.key === 'normDeviation' ? tableBorder.rightThin : groupEndClass(column.key)
        }`}
      >
        <ColumnLabel label={column.label} />
      </th>
    ));
  }

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
          className={`${normativeBannerHeadingClassName} ${groupEndClass(column.key)}`}
        >
          {keepWithNext(NORMATIVE_GROUP_LABEL)}
        </th>
      );
    }

    return (
      <th
        key={column.key}
        rowSpan={2}
        scope="col"
        className={`${columnHeadingClassName} ${lastColumnExtraClassName} ${groupEndClass(column.key)}`}
      >
        <ColumnLabel label={column.label} />
      </th>
    );
  });
}
