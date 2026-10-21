import type { ReactNode } from 'react';

import { ColumnLabel, keepWithNext } from '@/features/table/ColumnLabel';
import { columnHeadingClassName, tableBorder } from '@/features/table/styles';

const SUB_BANNER_GROUPS: { label: string; keys: readonly string[] }[] = [
  {
    label: 'текущий',
    keys: ['currentClosing', 'currentClosingDeviation', 'currentClosingDeviationValue'],
  },
  {
    label: 'инвентаризация',
    keys: ['inventoryClosing', 'closingInventoryDeviation', 'closingInventoryDeviationValue'],
  },
  {
    label: 'нормативный',
    keys: ['min', 'max', 'normDeviation'],
  },
];

const SUB_BANNER_KEYS = new Set(SUB_BANNER_GROUPS.flatMap((group) => group.keys));

const subBannerHeadingClassName =
  'w-px whitespace-normal border-t-[3px] border-t-muted border-b border-b-line bg-paper px-1.5 py-1 text-center align-middle text-sm font-normal uppercase leading-5 text-ink';

const subBannerSubHeadingClassName =
  'w-px whitespace-normal border-b-[3px] border-b-muted bg-paper px-1.5 py-1 text-center align-middle text-sm font-normal leading-5 text-ink';

function subBannerGroupForKey<K extends string>(key: K): { label: string; keys: readonly string[] } | undefined {
  return SUB_BANNER_GROUPS.find((group) => group.keys.includes(key));
}

function subBannerLastKey(keys: readonly string[]): string {
  return keys[keys.length - 1] ?? '';
}

export function FinishedGoodsReportColumnHeaders<K extends string>({
  row,
  columns,
  groupEndClass,
  lastColumnExtraClassName = '',
}: {
  row: 'primary' | 'secondary';
  columns: readonly { key: K; label: string; hint?: string }[];
  groupEndClass: (key: K) => string;
  lastColumnExtraClassName?: string;
}): ReactNode {
  const subBannerColumns = columns.filter((column) => SUB_BANNER_KEYS.has(column.key));

  if (row === 'secondary') {
    return subBannerColumns.map((column) => {
      const group = subBannerGroupForKey(column.key);
      const lastKey = group ? subBannerLastKey(group.keys) : column.key;
      return (
        <th
          key={column.key}
          scope="col"
          className={`${subBannerSubHeadingClassName} ${
            column.key === lastKey ? tableBorder.rightThin : groupEndClass(column.key)
          }`}
        >
          <ColumnLabel label={column.label} hint={column.hint} />
        </th>
      );
    });
  }

  return columns.map((column) => {
    const group = subBannerGroupForKey(column.key);
    if (group) {
      if (column.key !== group.keys[0]) {
        return null;
      }
      return (
        <th
          key={`banner:${group.label}`}
          colSpan={group.keys.length}
          scope="colgroup"
          className={`${subBannerHeadingClassName} ${groupEndClass(column.key)}`}
        >
          {keepWithNext(group.label)}
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
        <ColumnLabel label={column.label} hint={column.hint} />
      </th>
    );
  });
}
