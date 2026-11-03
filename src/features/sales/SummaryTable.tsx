'use client';

import { useState } from 'react';

import type { UnitCost } from '@/domain/cost';
import { amountExVat } from '@/domain/money';
import { priceWithVatFromExVat, type SalesPlanRejection } from '@/domain/sales-plan';
import type { SummaryGroup, SummaryLens, SummaryRow, SummarySide, SummaryVariance } from '@/domain/summary';
import { FIELD_ERROR, VAT_PARSE_ERROR } from '@/features/sales/fields';
import { formatPerDay, formatPieces, formatPriceExVat, SALES_PLAN_ERROR } from '@/features/sales/text';
import { IconChevronDown, IconChevronRight, IconPlus, IconTrash } from '@/features/shell/Icons';
import {
  blockCornerClassName,
  blockHeadingClassName,
  type CellKind,
  ColumnLabel,
  categoryBandClassName,
  categoryNameClassName,
  categoryNameRowClassName,
  cellKindClassName,
  columnDividerClassName,
  columnHeadingClassName,
  Empty,
  entityNameRowClassName,
  GridText,
  IntegerCell,
  keepWithNext,
  MoneyAmount,
  MoneyCell,
  Muted,
  nameCellKind,
  nameHeadingClassName,
  PercentCell,
  ProductIndex,
  StackedPair,
  stickyHeadClassName,
  TableNumber,
  tableBorder,
  tableClassName,
  tableFrameClassName,
  tableFrameExpandedClassName,
  totalNameClassName,
  totalValueClassName,
  VatMoneyCell,
} from '@/features/table';

type SideKey =
  | 'unitCost'
  | 'profitability'
  | 'price'
  | 'volume'
  | 'revenue'
  | 'contribution'
  | 'volumeCost'
  | 'perDay'
  | 'vat';

type VarianceKey = 'revenue' | 'contribution';

const SIDE_COLUMNS: { key: SideKey; label: string }[] = [
  { key: 'unitCost', label: 'Себест.' },
  { key: 'profitability', label: 'Рентаб.' },
  { key: 'price', label: 'Цена' },
  { key: 'volume', label: 'Объём продаж' },
  { key: 'revenue', label: 'Выручка' },
  { key: 'contribution', label: 'Т-проток' },
  { key: 'volumeCost', label: 'Себест. объёма' },
  { key: 'perDay', label: 'В сутки' },
  { key: 'vat', label: 'НДС' },
];

const VARIANCE_COLUMNS: { key: VarianceKey; label: string }[] = [
  { key: 'revenue', label: 'Выручка' },
  { key: 'contribution', label: 'Т-проток' },
];

const FINANCE_SIDE_KEYS = new Set<SideKey>(['unitCost', 'profitability', 'contribution', 'volumeCost']);

function visibleSideColumns(showFinance: boolean): { key: SideKey; label: string }[] {
  if (showFinance) {
    return SIDE_COLUMNS;
  }
  return SIDE_COLUMNS.filter((column) => !FINANCE_SIDE_KEYS.has(column.key));
}

function visibleVarianceColumns(showFinance: boolean): { key: VarianceKey; label: string }[] {
  if (showFinance) {
    return VARIANCE_COLUMNS;
  }
  return VARIANCE_COLUMNS.filter((column) => column.key === 'revenue');
}

const PLAN_ASSIGNED = new Set<SideKey>(['price', 'volume', 'vat']);
const PLAN_REPEATED = new Set<SideKey>(['unitCost']);
const FACT_REPEATED = new Set<SideKey>(['unitCost', 'vat']);

function planColumnKind(column: SideKey, part: 'full' | 'plan'): CellKind {
  if (part === 'full' || PLAN_REPEATED.has(column)) {
    return 'repeated';
  }
  return PLAN_ASSIGNED.has(column) ? 'assigned' : 'computed';
}

function factColumnKind(column: SideKey): CellKind {
  return FACT_REPEATED.has(column) ? 'repeated' : 'computed';
}

function sectionRightClass(
  kind: 'plan' | 'fact' | 'variance',
  key: string,
  part: 'full' | 'plan',
  lastPlanKey: SideKey | undefined,
  lastFactKey: SideKey | undefined,
): string {
  if (part === 'plan') {
    return tableBorder.rightThin;
  }
  if (kind === 'plan' && key === lastPlanKey) {
    return tableBorder.rightThick;
  }
  if (kind === 'fact' && key === lastFactKey) {
    return tableBorder.rightThick;
  }

  return tableBorder.rightThin;
}

export type SummaryTableEdit = {
  plan: boolean;
  vat: boolean;
  catalog: boolean;
  onPlanLine: (lineId: string, priceWithVat: number, volumePieces: number) => SalesPlanRejection | null;
  onProductVat: (productId: string, vatPercent: number) => string | null;
  onRenameProduct: (productId: string, name: string) => string | null;
  onDeleteProduct: (productId: string, name: string) => void;
  onRenameCategory: (categoryId: string, name: string) => string | null;
  onDeleteCategory: (categoryId: string, name: string) => void;
  onAddProduct: (categoryId: string) => void;
};

export function SummaryTable({
  groups,
  planTotals,
  factTotals,
  variance,
  view,
  periodClosed = false,
  part = 'full',
  expanded = false,
  showFinance = true,
  showTotals = true,
  edit,
}: {
  groups: SummaryGroup[];
  planTotals: SummarySide | null;
  factTotals: SummarySide;
  variance: SummaryVariance;
  view: SummaryLens;
  periodClosed?: boolean;
  part?: 'full' | 'plan';
  expanded?: boolean;
  /** Себестоимость, Т-проток и рентабельность — для экономиста и админа. */
  showFinance?: boolean;
  /** Строка «Всего» внизу сетки. */
  showTotals?: boolean;
  /** Правка плана и справочника. Без него таблица только для просмотра. */
  edit?: SummaryTableEdit;
}) {
  const showFact = part === 'full';
  const sideColumns = visibleSideColumns(showFinance);
  const varianceColumns = visibleVarianceColumns(showFinance);
  const lastPlanKey = sideColumns.at(-1)?.key;
  const lastFactKey = sideColumns.at(-1)?.key;
  const factIsForecast = view === 'forecast' && !periodClosed;
  const planHeader =
    part === 'plan'
      ? 'Плановые показатели'
      : view === 'current'
        ? 'Плановые показатели (корр.)'
        : 'Плановые показатели';
  const caption =
    part === 'plan'
      ? 'Ввод плана: плановые показатели'
      : view === 'current'
        ? 'Отчет общий: план (корр.), факт и отклонение'
        : factIsForecast
          ? 'Отчет общий: план, факт (прогноз) и отклонение'
          : 'Отчет общий: план, факт и отклонение';

  return (
    <div className={expanded ? tableFrameExpandedClassName : tableFrameClassName}>
      <table className={tableClassName}>
        <caption className="sr-only">{caption}</caption>
        <thead className={stickyHeadClassName}>
          <tr>
            <th className={`sticky left-0 z-40 ${blockCornerClassName} ${tableBorder.rightThick}`} />
            <th
              colSpan={sideColumns.length}
              scope="colgroup"
              className={`${blockHeadingClassName} ${showFact ? tableBorder.rightThick : ''}`}
            >
              {keepWithNext(planHeader)}
            </th>
            {showFact ? (
              <>
                <th
                  colSpan={sideColumns.length}
                  scope="colgroup"
                  className={`${blockHeadingClassName} ${tableBorder.rightThick}`}
                >
                  {keepWithNext(factIsForecast ? 'Фактические показатели (прогноз)' : 'Фактические показатели')}
                </th>
                <th colSpan={varianceColumns.length} scope="colgroup" className={blockHeadingClassName}>
                  Отклонение
                </th>
              </>
            ) : null}
          </tr>
          <tr>
            <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
              Товар
            </th>
            {sideColumns.map((column) => (
              <th
                key={`plan:${column.key}`}
                scope="col"
                className={`${columnHeadingClassName} last:border-r-0 ${sectionRightClass('plan', column.key, part, lastPlanKey, lastFactKey)}`}
              >
                <ColumnLabel label={column.label} />
              </th>
            ))}
            {showFact
              ? sideColumns.map((column) => (
                  <th
                    key={`fact:${column.key}`}
                    scope="col"
                    className={`${columnHeadingClassName} last:border-r-0 ${sectionRightClass('fact', column.key, part, lastPlanKey, lastFactKey)}`}
                  >
                    <ColumnLabel label={column.label} />
                  </th>
                ))
              : null}
            {showFact
              ? varianceColumns.map((column) => (
                  <th
                    key={`var:${column.key}`}
                    scope="col"
                    className={`${columnHeadingClassName} ${columnDividerClassName}`}
                  >
                    <ColumnLabel label={column.label} />
                  </th>
                ))
              : null}
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <CategoryBlock
              key={group.categoryId}
              group={group}
              part={part}
              edit={edit}
              sideColumns={sideColumns}
              varianceColumns={varianceColumns}
              lastPlanKey={lastPlanKey}
              lastFactKey={lastFactKey}
            />
          ))}
          {showTotals ? (
            <tr>
              <th scope="row" className={`sticky left-0 z-10 ${totalNameClassName}`}>
                Всего
              </th>
              {sideColumns.map((column) => (
                <td
                  key={`plan-total:${column.key}`}
                  className={`${totalValueClassName} last:border-r-0 ${sectionRightClass('plan', column.key, part, lastPlanKey, lastFactKey)}`}
                >
                  {planTotals ? <SideCell column={column.key} side={planTotals} kind="total" /> : <Empty />}
                </td>
              ))}
              {showFact
                ? sideColumns.map((column) => (
                    <td
                      key={`fact-total:${column.key}`}
                      className={`${totalValueClassName} last:border-r-0 ${sectionRightClass('fact', column.key, part, lastPlanKey, lastFactKey)}`}
                    >
                      <SideCell column={column.key} side={factTotals} kind="total" />
                    </td>
                  ))
                : null}
              {showFact
                ? varianceColumns.map((column) => (
                    <td key={`var-total:${column.key}`} className={`${totalValueClassName} ${columnDividerClassName}`}>
                      <VarianceCell column={column.key} variance={variance} />
                    </td>
                  ))
                : null}
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

function CategoryBlock({
  group,
  part,
  edit,
  sideColumns,
  varianceColumns,
  lastPlanKey,
  lastFactKey,
}: {
  group: SummaryGroup;
  part: 'full' | 'plan';
  edit?: SummaryTableEdit;
  sideColumns: readonly { key: SideKey; label: string }[];
  varianceColumns: readonly { key: VarianceKey; label: string }[];
  lastPlanKey: SideKey | undefined;
  lastFactKey: SideKey | undefined;
}) {
  const header = categoryBandClassName;
  const [open, setOpen] = useState(true);
  const productCount = group.rows.length;
  const showFact = part === 'full';
  const catalogEditable = edit?.catalog === true;

  return (
    <>
      <tr>
        <th scope="row" className={categoryNameRowClassName(catalogEditable && Boolean(edit) && !group.deleted)}>
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
            {group.deleted || !catalogEditable || !edit ? (
              <span className={categoryNameClassName}>
                {group.name} ({productCount})
              </span>
            ) : (
              <>
                <GridText
                  label={`Категория, ${group.name}`}
                  value={group.name}
                  caps
                  invalidMessage={FIELD_ERROR.empty}
                  onCommit={(next) => edit.onRenameCategory(group.categoryId, next)}
                />
                <span className="text-sm text-muted">({productCount})</span>
              </>
            )}
            {group.deleted ? (
              <span className="text-sm text-muted">(архив)</span>
            ) : catalogEditable && edit ? (
              <>
                <button
                  type="button"
                  aria-label={`Добавить товар в ${group.name}`}
                  title="Добавить товар"
                  onClick={() => {
                    setOpen(true);
                    edit.onAddProduct(group.categoryId);
                  }}
                  className="inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  <IconPlus />
                </button>
                <button
                  type="button"
                  aria-label={`Удалить категорию ${group.name}`}
                  title="Удалить категорию"
                  onClick={() => edit.onDeleteCategory(group.categoryId, group.name)}
                  className="inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  <IconTrash />
                </button>
              </>
            ) : null}
          </div>
        </th>
        {sideColumns.map((column) => (
          <td
            key={`plan-group:${column.key}`}
            className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle last:border-r-0 ${header} ${sectionRightClass('plan', column.key, part, lastPlanKey, lastFactKey)}`}
          >
            {group.plan ? <SideCell column={column.key} side={group.plan} kind="total" /> : <Empty />}
          </td>
        ))}
        {showFact
          ? sideColumns.map((column) => (
              <td
                key={`fact-group:${column.key}`}
                className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle last:border-r-0 ${header} ${sectionRightClass('fact', column.key, part, lastPlanKey, lastFactKey)}`}
              >
                <SideCell column={column.key} side={group.fact} kind="total" />
              </td>
            ))
          : null}
        {showFact
          ? varianceColumns.map((column) => (
              <td
                key={`var-group:${column.key}`}
                className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${header} ${columnDividerClassName}`}
              >
                <VarianceCell column={column.key} variance={group.variance} />
              </td>
            ))
          : null}
      </tr>
      {open
        ? group.rows.map((row, index) => (
            <ProductRow
              key={row.productId}
              row={row}
              index={index + 1}
              part={part}
              edit={edit}
              sideColumns={sideColumns}
              varianceColumns={varianceColumns}
              lastPlanKey={lastPlanKey}
              lastFactKey={lastFactKey}
            />
          ))
        : null}
    </>
  );
}

function ProductRow({
  row,
  index,
  part,
  edit,
  sideColumns,
  varianceColumns,
  lastPlanKey,
  lastFactKey,
}: {
  row: SummaryRow;
  index: number;
  part: 'full' | 'plan';
  edit?: SummaryTableEdit;
  sideColumns: readonly { key: SideKey; label: string }[];
  varianceColumns: readonly { key: VarianceKey; label: string }[];
  lastPlanKey: SideKey | undefined;
  lastFactKey: SideKey | undefined;
}) {
  const showFact = part === 'full';
  const catalogEditable = edit?.catalog === true;
  const planEditable = edit?.plan === true;
  const vatEditable = edit?.vat === true;

  return (
    <tr>
      <th
        scope="row"
        className={entityNameRowClassName(nameCellKind(catalogEditable && Boolean(edit) && !row.deleted))}
      >
        <div className="flex items-center gap-2">
          <ProductIndex index={index} />
          {row.deleted || !catalogEditable || !edit ? (
            <span className="flex h-8 min-w-max items-center text-sm leading-none text-ink">{row.name}</span>
          ) : (
            <GridText
              label={`Название, ${row.name}`}
              value={row.name}
              invalidMessage={FIELD_ERROR.empty}
              onCommit={(next) => edit.onRenameProduct(row.productId, next)}
            />
          )}
          {row.deleted ? <span className="text-sm text-muted">(архив)</span> : null}
          {row.deleted || !catalogEditable || !edit ? null : (
            <button
              type="button"
              aria-label={`Удалить ${row.name}`}
              title="Удалить"
              onClick={() => edit.onDeleteProduct(row.productId, row.name)}
              className="inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <IconTrash />
            </button>
          )}
        </div>
      </th>
      {sideColumns.map((column) => {
        const canEdit =
          (planEditable && row.planLineId !== null && (column.key === 'price' || column.key === 'volume')) ||
          (vatEditable && column.key === 'vat');
        return (
          <td
            key={`plan:${column.key}`}
            className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle last:border-r-0 ${sectionRightClass('plan', column.key, part, lastPlanKey, lastFactKey)} ${cellKindClassName[planColumnKind(column.key, part)]}`}
            onClick={(event) => {
              if (!canEdit) {
                return;
              }
              if (event.target instanceof HTMLInputElement) {
                return;
              }
              const field = editableFieldNear(event.target, event.currentTarget);
              if (field instanceof HTMLInputElement && document.activeElement !== field) {
                field.focus();
              }
            }}
            onKeyDown={(event) => {
              if (!canEdit) {
                return;
              }
              if (event.key !== 'Enter' && event.key !== ' ') {
                return;
              }
              if (event.target instanceof HTMLInputElement) {
                return;
              }
              const field = editableFieldNear(event.target, event.currentTarget);
              if (field instanceof HTMLInputElement) {
                field.focus();
              }
            }}
          >
            <PlanCell column={column.key} row={row} edit={edit} />
          </td>
        );
      })}
      {showFact
        ? sideColumns.map((column) => (
            <td
              key={`fact:${column.key}`}
              className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle last:border-r-0 ${sectionRightClass('fact', column.key, part, lastPlanKey, lastFactKey)} ${cellKindClassName[factColumnKind(column.key)]}`}
            >
              <SideCell column={column.key} side={row.fact} kind="row" />
            </td>
          ))
        : null}
      {showFact
        ? varianceColumns.map((column) => (
            <td
              key={`var:${column.key}`}
              className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName} ${cellKindClassName.computed}`}
            >
              <VarianceCell column={column.key} variance={row.variance} />
            </td>
          ))
        : null}
    </tr>
  );
}

function PlanCell({ column, row, edit }: { column: SideKey; row: SummaryRow; edit?: SummaryTableEdit }) {
  const planEditable = edit?.plan === true;
  const vatEditable = edit?.vat === true;

  if (column === 'vat') {
    if (!vatEditable || !edit) {
      const side = row.plan ?? row.fact;
      return <SideCell column={column} side={side} kind="row" />;
    }

    return (
      <PercentCell
        label={`НДС, ${row.name}`}
        value={row.plan?.vatPercent ?? row.fact.vatPercent}
        invalidMessage={VAT_PARSE_ERROR}
        onChange={(next) => edit.onProductVat(row.productId, next)}
      />
    );
  }

  if (column === 'unitCost') {
    const side = row.plan ?? row.fact;
    return <SideCell column={column} side={side} kind="row" />;
  }

  if (!row.plan) {
    return <Empty />;
  }

  // Интервал месяцев складывает план, но строки одного товара уже не одна.
  // Цифры есть в `row.plan`; править их можно только у строки одного месяца.
  if (row.planLineId === null) {
    return <SideCell column={column} side={row.plan} kind="row" />;
  }

  if (column === 'price') {
    if (!planEditable || !edit) {
      return <SideCell column={column} side={row.plan} kind="row" />;
    }

    const vatPercent = row.plan.vatPercent;
    const priceExVatKopecks = vatPercent === null ? null : amountExVat(row.planPriceWithVat ?? 0, vatPercent);

    return (
      <VatMoneyCell
        label={`Плановая цена, ${row.name}`}
        withVat={row.planPriceWithVat ?? 0}
        exVat={priceExVatKopecks}
        invalidMessage={SALES_PLAN_ERROR.price}
        onChangeWithVat={(next) => {
          const rejection = edit.onPlanLine(row.planLineId ?? '', next, row.planVolumePieces ?? 0);
          return rejection ? SALES_PLAN_ERROR[rejection] : null;
        }}
        onChangeExVat={
          priceExVatKopecks === null
            ? undefined
            : (next) => {
                if (vatPercent === null) {
                  return VAT_PARSE_ERROR;
                }
                const withVat = priceWithVatFromExVat(next, vatPercent);
                if (withVat === null) {
                  return SALES_PLAN_ERROR.price;
                }
                const rejection = edit.onPlanLine(row.planLineId ?? '', withVat, row.planVolumePieces ?? 0);
                return rejection ? SALES_PLAN_ERROR[rejection] : null;
              }
        }
      />
    );
  }

  if (column === 'volume') {
    if (!planEditable || !edit) {
      return <SideCell column={column} side={row.plan} kind="row" />;
    }

    return (
      <IntegerCell
        label={`Плановый объём, ${row.name}`}
        value={row.planVolumePieces ?? 0}
        unit="шт"
        invalidMessage={SALES_PLAN_ERROR.volume}
        onChange={(next) => {
          const rejection = edit.onPlanLine(row.planLineId ?? '', row.planPriceWithVat ?? 0, next);
          return rejection ? SALES_PLAN_ERROR[rejection] : null;
        }}
      />
    );
  }

  return <SideCell column={column} side={row.plan} kind="row" />;
}

function SideCell({ column, side, kind }: { column: SideKey; side: SummarySide; kind: 'row' | 'total' }) {
  switch (column) {
    case 'unitCost':
      if (kind === 'total') {
        if (!side.costComplete) {
          return <Muted>{keepWithNext('не по всем товарам')}</Muted>;
        }

        return <VatMoneyCell withVat={side.averageCostWithVat} exVat={side.averageCostExVat} />;
      }
      return <UnitCostValue cost={side.unitCost ?? averagedUnitCost(side)} />;
    case 'profitability':
      if (kind === 'total' && !side.costComplete) {
        return <Empty />;
      }
      return <PercentCell value={side.profitabilityHundredths} scale="hundredths" fractionDigits={1} />;
    case 'price':
      if (side.priceExVatTenThousandths !== null && side.priceWithVat !== null) {
        return (
          <StackedPair
            topLabel="с НДС"
            bottomLabel="без НДС"
            top={<MoneyAmount amount={side.priceWithVat} />}
            bottom={
              <TableNumber value={side.priceExVatTenThousandths}>
                {formatPriceExVat(side.priceExVatTenThousandths)}
              </TableNumber>
            }
          />
        );
      }
      return <VatMoneyCell withVat={side.priceWithVat} exVat={side.priceExVat} />;
    case 'volume':
      return side.volumePieces === null ? (
        <Empty />
      ) : (
        <TableNumber value={side.volumePieces}>{formatPieces(side.volumePieces)} шт</TableNumber>
      );
    case 'revenue':
      if (kind === 'total' && !side.revenueComplete) {
        return <Muted>{keepWithNext('не по всем товарам')}</Muted>;
      }
      return <VatMoneyCell whole withVat={side.revenueWithVat} exVat={side.revenueExVat} />;
    case 'contribution':
      if (kind === 'total' && (!side.costComplete || !side.revenueComplete)) {
        return <Muted>{keepWithNext('не по всем товарам')}</Muted>;
      }
      return <MoneyCell whole value={side.contribution} />;
    case 'volumeCost':
      if (kind === 'total' && !side.costComplete) {
        return <Muted>{keepWithNext('не по всем товарам')}</Muted>;
      }
      return <VatMoneyCell whole withVat={side.volumeCostWithVat} exVat={side.volumeCostExVat} />;
    case 'perDay':
      return side.perDay === null ? (
        <Empty />
      ) : (
        <TableNumber value={side.perDay}>{formatPerDay(side.perDay)}</TableNumber>
      );
    case 'vat':
      if (kind === 'total') {
        return <PercentCell value={side.vatPercentHundredths} scale="hundredths" />;
      }
      return <PercentCell value={side.vatPercent} />;
    default:
      return <Empty />;
  }
}

function VarianceCell({ column, variance }: { column: VarianceKey; variance: SummaryVariance }) {
  if (column === 'revenue') {
    return <VatMoneyCell whole signed withVat={variance.revenueWithVat} exVat={variance.revenueExVat} />;
  }

  return <MoneyCell whole value={variance.contribution} signed />;
}

function averagedUnitCost(side: SummarySide): UnitCost | null {
  if (side.averageCostWithVat === null || side.averageCostExVat === null) {
    return null;
  }
  return { withVat: side.averageCostWithVat, exVat: side.averageCostExVat };
}

function UnitCostValue({ cost }: { cost: UnitCost | null }) {
  if (!cost) {
    return <Muted>{keepWithNext('Себестоимость не считается')}</Muted>;
  }

  return <VatMoneyCell withVat={cost.withVat} exVat={cost.exVat} />;
}

function editableFieldNear(target: EventTarget | null, cell: HTMLElement): HTMLInputElement | null {
  if (target instanceof Element) {
    const section = target.closest('[data-editable-field]');
    const inSection = section?.querySelector('input');
    if (inSection instanceof HTMLInputElement) {
      return inSection;
    }
  }

  const fallback = cell.querySelector('input');
  return fallback instanceof HTMLInputElement ? fallback : null;
}
