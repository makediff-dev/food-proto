import type { ReactNode } from 'react';

import { ColumnLabel, keepWithNext } from '@/features/table/ColumnLabel';
import { columnHeadingClassName, tableBorder } from '@/features/table/styles';

export type ReportSubBannerGroup = { label: string; keys: readonly string[] };

export const FINISHED_GOODS_CLOSING_SUB_BANNERS: ReportSubBannerGroup[] = [
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

export const MATERIALS_CLOSING_SUB_BANNERS: ReportSubBannerGroup[] = [
  {
    label: 'текущий',
    keys: ['currentClosing', 'currentClosingDeviation', 'currentClosingDeviationCost'],
  },
  {
    label: 'инвентаризация',
    keys: ['inventoryClosing', 'closingInventoryDeviation', 'closingInventoryDeviationCost'],
  },
  {
    label: 'нормативный',
    keys: ['min', 'max', 'normDeviation'],
  },
];

const subBannerHeadingClassName =
  'w-px whitespace-normal border-t-[3px] border-t-muted border-b border-b-line bg-paper px-1.5 py-1 text-center align-middle text-sm font-normal uppercase leading-5 text-ink';

const subBannerSubHeadingClassName =
  'w-px whitespace-normal border-b-[3px] border-b-muted bg-paper px-1.5 py-1 text-center align-middle text-sm font-normal leading-5 text-ink';

function subBannerGroupForKey<K extends string>(
  key: K,
  subBannerGroups: readonly ReportSubBannerGroup[],
): ReportSubBannerGroup | undefined {
  return subBannerGroups.find((group) => group.keys.includes(key));
}

function subBannerLastKey(keys: readonly string[]): string {
  return keys[keys.length - 1] ?? '';
}

export function ReportSubBannerColumnHeaders<K extends string>({
  row,
  columns,
  subBannerGroups,
  groupEndClass,
  lastColumnExtraClassName = '',
}: {
  row: 'primary' | 'secondary';
  columns: readonly { key: K; label: string; hint?: string }[];
  subBannerGroups: readonly ReportSubBannerGroup[];
  groupEndClass: (key: K) => string;
  lastColumnExtraClassName?: string;
}): ReactNode {
  const subBannerKeys = new Set(subBannerGroups.flatMap((group) => group.keys));
  const subBannerColumns = columns.filter((column) => subBannerKeys.has(column.key));

  if (row === 'secondary') {
    return subBannerColumns.map((column) => {
      const group = subBannerGroupForKey(column.key, subBannerGroups);
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
    const group = subBannerGroupForKey(column.key, subBannerGroups);
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
  return (
    <ReportSubBannerColumnHeaders
      row={row}
      columns={columns}
      subBannerGroups={FINISHED_GOODS_CLOSING_SUB_BANNERS}
      groupEndClass={groupEndClass}
      lastColumnExtraClassName={lastColumnExtraClassName}
    />
  );
}
