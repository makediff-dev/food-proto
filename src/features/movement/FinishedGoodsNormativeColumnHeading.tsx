import type { ReactNode } from 'react';

import { ColumnLabel, keepWithNext } from '@/features/table/ColumnLabel';
import { columnHeadingClassName, tableBorder } from '@/features/table/styles';

export type ReportSubBannerGroup = { label: string; keys: readonly string[] };

export const FINISHED_GOODS_CLOSING_SUB_BANNERS: ReportSubBannerGroup[] = [
  {
    label: 'расчетный',
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

export const FINISHED_GOODS_SALES_SUB_BANNERS: ReportSubBannerGroup[] = [
  {
    label: 'план',
    keys: ['planSalesPieces', 'planSalesPrice', 'planSalesRevenue'],
  },
  {
    label: 'факт',
    keys: ['salesPieces', 'salesPrice', 'salesRevenue'],
  },
  {
    label: 'отклонение',
    keys: ['salesDeviationPieces', 'salesDeviationPrice', 'salesDeviationRevenue'],
  },
];

export const FINISHED_GOODS_PRODUCTION_SUB_BANNERS: ReportSubBannerGroup[] = [
  {
    label: 'план',
    keys: ['planProductionPieces', 'planProductionPrice', 'planProductionValue'],
  },
  {
    label: 'факт',
    keys: ['productionPieces', 'productionPrice', 'productionValue'],
  },
  {
    label: 'отклонение',
    keys: ['productionDeviationPieces', 'productionDeviationPrice', 'productionDeviationValue'],
  },
];

export const FINISHED_GOODS_SUMMARY_SUB_BANNERS: ReportSubBannerGroup[] = [
  ...FINISHED_GOODS_SALES_SUB_BANNERS,
  ...FINISHED_GOODS_PRODUCTION_SUB_BANNERS,
  ...FINISHED_GOODS_CLOSING_SUB_BANNERS,
];

export const MATERIALS_RECEIPT_SUB_BANNERS: ReportSubBannerGroup[] = [
  {
    label: 'план',
    keys: ['planReceipt', 'planReceiptPrice', 'planReceiptCost'],
  },
  {
    label: 'факт',
    keys: ['factReceipt', 'factReceiptPrice', 'factReceiptCost'],
  },
  {
    label: 'отклонение',
    keys: ['receiptDeviation', 'receiptDeviationPrice', 'receiptDeviationCost'],
  },
];

export const MATERIALS_CONSUMPTION_SUB_BANNERS: ReportSubBannerGroup[] = [
  {
    label: 'план',
    keys: ['planConsumption', 'planConsumptionPrice', 'planConsumptionCost'],
  },
  {
    label: 'факт',
    keys: ['factConsumption', 'factConsumptionPrice', 'factConsumptionCost'],
  },
  {
    label: 'отклонение',
    keys: ['consumptionDeviation', 'consumptionDeviationPrice', 'consumptionDeviationCost'],
  },
];

export const MATERIALS_CLOSING_SUB_BANNERS: ReportSubBannerGroup[] = [
  {
    label: 'расчетный',
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

export const MATERIALS_SUMMARY_SUB_BANNERS: ReportSubBannerGroup[] = [
  ...MATERIALS_RECEIPT_SUB_BANNERS,
  ...MATERIALS_CONSUMPTION_SUB_BANNERS,
  ...MATERIALS_CLOSING_SUB_BANNERS,
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

function subBannerColumnBorderClass<K extends string>(
  columnKey: K,
  lastKeyInSubBanner: string,
  groupEndClass: (key: K) => string,
): string {
  const groupEnd = groupEndClass(columnKey);
  if (columnKey === lastKeyInSubBanner && groupEnd !== tableBorder.rightThick) {
    return tableBorder.rightThin;
  }
  return groupEnd;
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
          className={`${subBannerSubHeadingClassName} ${subBannerColumnBorderClass(column.key, lastKey, groupEndClass)}`}
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
      const bannerLastKey = subBannerLastKey(group.keys) as K;
      return (
        <th
          key={`banner:${bannerLastKey}`}
          colSpan={group.keys.length}
          scope="colgroup"
          className={`${subBannerHeadingClassName} ${groupEndClass(bannerLastKey)}`}
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
  subBannerGroups = FINISHED_GOODS_CLOSING_SUB_BANNERS,
}: {
  row: 'primary' | 'secondary';
  columns: readonly { key: K; label: string; hint?: string }[];
  groupEndClass: (key: K) => string;
  lastColumnExtraClassName?: string;
  subBannerGroups?: readonly ReportSubBannerGroup[];
}): ReactNode {
  return (
    <ReportSubBannerColumnHeaders
      row={row}
      columns={columns}
      subBannerGroups={subBannerGroups}
      groupEndClass={groupEndClass}
      lastColumnExtraClassName={lastColumnExtraClassName}
    />
  );
}
