'use client';

import { useState } from 'react';

import type { ProductionFactGroup, ProductionFactRow } from '@/domain/production-fact';
import type { SummaryLens } from '@/domain/summary';
import { formatPieces } from '@/features/sales/text';
import { IconChevronDown, IconChevronRight } from '@/features/shell/icons';
import {
  ColumnLabel,
  keepWithNext,
  stickyHeadClassName,
  TableNumber,
  tableBorder,
  tableClassName,
  tableFrameClassName,
  tableFrameExpandedClassName,
} from '@/features/table';

function sectionRightClass(kind: 'plan' | 'fact' | 'variance'): string {
  if (kind === 'variance') {
    return tableBorder.rightThin;
  }

  return tableBorder.rightThick;
}

export function ProductionFactTable({
  groups,
  planVolumePieces,
  factVolumePieces,
  varianceVolumePieces,
  view,
  periodClosed = false,
  expanded = false,
}: {
  groups: ProductionFactGroup[];
  planVolumePieces: number;
  factVolumePieces: number;
  varianceVolumePieces: number;
  view: SummaryLens;
  periodClosed?: boolean;
  expanded?: boolean;
}) {
  const factIsForecast = view === 'forecast' && !periodClosed;
  const planHeader = view === 'current' ? 'Плановые показатели (корр.)' : 'Плановые показатели';
  const caption =
    view === 'current'
      ? 'Производство: план (корр.), факт и отклонение'
      : factIsForecast
        ? 'Производство: план, факт (прогноз) и отклонение'
        : 'Производство: план, факт и отклонение';

  return (
    <div className={expanded ? tableFrameExpandedClassName : tableFrameClassName}>
      <table className={tableClassName}>
        <caption className="sr-only">{caption}</caption>
        <thead className={stickyHeadClassName}>
          <tr>
            <th className={`sticky left-0 z-40 ${tableBorder.bottomThin} ${tableBorder.rightThick} bg-paper`} />
            <th
              scope="colgroup"
              className={`${tableBorder.bottomThin} ${tableBorder.rightThick} bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-ink`}
            >
              {keepWithNext(planHeader)}
            </th>
            <th
              scope="colgroup"
              className={`${tableBorder.bottomThin} ${tableBorder.rightThick} bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-ink`}
            >
              {keepWithNext(factIsForecast ? 'Фактические показатели (прогноз)' : 'Фактические показатели')}
            </th>
            <th
              scope="colgroup"
              className={`${tableBorder.bottomThin} bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-ink`}
            >
              Отклонение
            </th>
          </tr>
          <tr>
            <th
              scope="col"
              className={`sticky left-0 z-40 w-px max-w-max whitespace-nowrap ${tableBorder.bottomThin} ${tableBorder.rightThick} bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-muted`}
            >
              Товар
            </th>
            <th
              scope="col"
              className={`w-px whitespace-normal border-b border-b-line ${sectionRightClass('plan')} bg-paper px-1.5 py-2 text-center align-middle text-sm font-normal leading-5 text-muted`}
            >
              <ColumnLabel label="Объём" />
            </th>
            <th
              scope="col"
              className={`w-px whitespace-normal border-b border-b-line ${sectionRightClass('fact')} bg-paper px-1.5 py-2 text-center align-middle text-sm font-normal leading-5 text-muted`}
            >
              <ColumnLabel label="Объём" />
            </th>
            <th
              scope="col"
              className={`w-px whitespace-normal border-b border-b-line ${sectionRightClass('variance')} bg-paper px-1.5 py-2 text-center align-middle text-sm font-normal leading-5 text-muted last:border-r-0`}
            >
              <ColumnLabel label="Объём" />
            </th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <CategoryBlock key={group.categoryId} group={group} />
          ))}
          <tr>
            <th
              scope="row"
              className="sticky left-0 z-10 w-px max-w-max whitespace-nowrap border-t-[1.5px] border-t-muted border-b border-b-line border-r-[1.5px] border-r-muted bg-paper px-3 py-2 text-left align-middle font-normal text-ink"
            >
              Всего
            </th>
            <VolumeCell value={planVolumePieces} kind="plan" total />
            <VolumeCell value={factVolumePieces} kind="fact" total />
            <VolumeCell value={varianceVolumePieces} kind="variance" total />
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function CategoryBlock({ group }: { group: ProductionFactGroup }) {
  const [open, setOpen] = useState(false);
  const productCount = group.rows.length;

  return (
    <>
      <tr>
        <th
          scope="row"
          className="sticky left-0 z-10 w-px max-w-max whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted bg-paper px-3 py-2 text-left align-middle font-normal text-ink"
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-expanded={open}
              aria-label={
                open ? `Свернуть товары категории ${group.name}` : `Развернуть товары категории ${group.name}`
              }
              title={open ? 'Свернуть' : 'Развернуть'}
              onClick={() => setOpen((current) => !current)}
              className="inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {open ? <IconChevronDown /> : <IconChevronRight />}
            </button>
            <span className="flex h-8 min-w-max flex-1 items-center text-sm font-semibold leading-none text-ink">
              {group.name} ({productCount})
            </span>
            {group.deleted ? <span className="text-sm text-muted">(архив)</span> : null}
          </div>
        </th>
        <VolumeCell value={group.planVolumePieces} kind="plan" />
        <VolumeCell value={group.factVolumePieces} kind="fact" />
        <VolumeCell value={group.varianceVolumePieces} kind="variance" />
      </tr>
      {open ? group.rows.map((row) => <ProductRow key={row.productId} row={row} />) : null}
    </>
  );
}

function ProductRow({ row }: { row: ProductionFactRow }) {
  return (
    <tr>
      <th
        scope="row"
        className="sticky left-0 z-10 w-px max-w-max whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted bg-sheet px-3 py-2 pl-8 text-left align-middle font-normal"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-8 min-w-max flex-1 items-center text-sm leading-none text-ink">{row.name}</span>
          {row.deleted ? <span className="text-sm text-muted">(архив)</span> : null}
        </div>
      </th>
      <VolumeCell value={row.planVolumePieces} kind="plan" sheet />
      <VolumeCell value={row.factVolumePieces} kind="fact" sheet />
      <VolumeCell value={row.varianceVolumePieces} kind="variance" sheet />
    </tr>
  );
}

function VolumeCell({
  value,
  kind,
  total = false,
  sheet = false,
}: {
  value: number;
  kind: 'plan' | 'fact' | 'variance';
  total?: boolean;
  sheet?: boolean;
}) {
  const bg = sheet ? 'bg-sheet' : 'bg-paper';
  const top = total ? 'border-t-[1.5px] border-t-muted' : '';

  return (
    <td
      className={`w-px ${top} border-b border-b-line ${sectionRightClass(kind)} ${bg} px-1.5 py-2 text-right align-middle last:border-r-0`}
    >
      <TableNumber>{formatPieces(value)}</TableNumber>
    </td>
  );
}
