'use client';

import { type ReactNode, useId, useState } from 'react';

import { costWithVat, type UnitCost } from '@/domain/cost';
import { amountExVat } from '@/domain/money';
import {
  priceWithVatFromExVat,
  type SalesPlanRejection,
} from '@/domain/sales-plan';
import type {
  SummaryGroup,
  SummaryLens,
  SummaryRow,
  SummarySide,
  SummaryVariance,
} from '@/domain/summary';
import { FIELD_ERROR, parseWholePercent } from '@/features/sales/fields';
import { formatMoney } from '@/features/sales/money';
import {
  formatPercentHundredths,
  formatPerDay,
  formatPieces,
  formatPriceExVat,
  parsePlanPrice,
  parseVolumePieces,
  priceDraft,
  SALES_PLAN_ERROR,
  volumeDraft,
} from '@/features/sales/text';
import {
  IconChevronDown,
  IconChevronRight,
  IconPlus,
  IconTrash,
} from '@/features/shell/icons';
import { TableNumber } from '@/features/shell/table-number';

const gridFieldClassName =
  'w-full min-w-0 cursor-text appearance-none border-0 bg-transparent p-0 text-right text-sm text-ink shadow-none outline-none';

const gridNameClassName =
  'absolute inset-0 w-full cursor-text appearance-none border-0 bg-transparent p-0 text-left text-sm leading-8 text-ink shadow-none outline-none';

const editableCellClassName = 'bg-[#e4e4e0]';

const HANGING_WORDS = new Set([
  'а',
  'без',
  'бы',
  'в',
  'во',
  'для',
  'до',
  'же',
  'за',
  'и',
  'из',
  'к',
  'ко',
  'ли',
  'на',
  'не',
  'ни',
  'но',
  'о',
  'об',
  'от',
  'по',
  'под',
  'при',
  'с',
  'со',
  'у',
]);

function keepWithNext(text: string): string {
  const parts = text.split(' ');
  let line = '';
  for (let index = 0; index < parts.length; index += 1) {
    line += parts[index] ?? '';
    if (index === parts.length - 1) {
      break;
    }
    const bare = (parts[index] ?? '')
      .toLowerCase()
      .replace(/^[^a-zа-яё]+|[^a-zа-яё]+$/gi, '');
    line += HANGING_WORDS.has(bare) ? '\u00A0' : ' ';
  }
  return line;
}

function ColumnLabel({ label }: { label: string }) {
  const chunks = keepWithNext(label).split(' ');
  return (
    <span className="mx-auto block w-min text-center">
      {chunks.map((chunk) => (
        <span key={chunk} className="block whitespace-nowrap">
          {chunk}
        </span>
      ))}
    </span>
  );
}

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
  { key: 'unitCost', label: 'Себест' },
  { key: 'profitability', label: 'Рентаб' },
  { key: 'price', label: 'Цена' },
  { key: 'volume', label: 'Объём продаж' },
  { key: 'revenue', label: 'Выручка' },
  { key: 'contribution', label: 'Т-проток' },
  { key: 'volumeCost', label: 'Себест объёма' },
  { key: 'perDay', label: 'В сутки' },
  { key: 'vat', label: 'НДС' },
];

const VARIANCE_COLUMNS: { key: VarianceKey; label: string }[] = [
  { key: 'revenue', label: 'Выручка' },
  { key: 'contribution', label: 'Т-проток' },
];

const LAST_PLAN_KEY = SIDE_COLUMNS.at(-1)?.key;
const LAST_FACT_KEY = SIDE_COLUMNS.at(-1)?.key;

function sectionRightClass(
  kind: 'plan' | 'fact' | 'variance',
  key: string,
  part: 'full' | 'plan',
): string {
  if (part === 'plan') {
    return 'border-r border-r-line';
  }
  if (kind === 'plan' && key === LAST_PLAN_KEY) {
    return 'border-r-[1.5px] border-r-muted';
  }
  if (kind === 'fact' && key === LAST_FACT_KEY) {
    return 'border-r-[1.5px] border-r-muted';
  }

  return 'border-r border-r-line';
}

export function SummaryTable({
  groups,
  planTotals,
  factTotals,
  variance,
  view,
  part = 'full',
  editable,
  vatEditable,
  catalogEditable,
  expanded = false,
  onPlanLineAction,
  onProductVatAction,
  onProductCostAction,
  onRenameProduct,
  onDeleteProduct,
  onRenameCategory,
  onDeleteCategory,
  onAddProduct,
}: {
  groups: SummaryGroup[];
  planTotals: SummarySide | null;
  factTotals: SummarySide;
  variance: SummaryVariance;
  view: SummaryLens;
  part?: 'full' | 'plan';
  editable: boolean;
  vatEditable: boolean;
  catalogEditable: boolean;
  expanded?: boolean;
  onPlanLineAction: (
    lineId: string,
    priceWithVat: number,
    volumePieces: number,
  ) => SalesPlanRejection | null;
  onProductVatAction: (productId: string, vatPercent: number) => string | null;
  onProductCostAction: (
    productId: string,
    unitCostWithVat: number,
  ) => string | null;
  onRenameProduct: (productId: string, name: string) => string | null;
  onDeleteProduct: (productId: string, name: string) => void;
  onRenameCategory: (categoryId: string, name: string) => string | null;
  onDeleteCategory: (categoryId: string, name: string) => void;
  onAddProduct: (categoryId: string) => void;
}) {
  const showFact = part === 'full';
  const planHeader =
    part === 'plan'
      ? 'Плановые показатели'
      : view === 'current'
        ? 'Плановые показатели (корр.)'
        : 'Плановые показатели';
  const caption =
    part === 'plan'
      ? 'Планирование месяца: плановые показатели'
      : view === 'current'
        ? 'Сводка месяца: план (корр.), факт и отклонение'
        : 'Сводка месяца: план, факт (прогноз) и отклонение';

  return (
    <div
      className={
        expanded
          ? 'h-dvh contain-paint overflow-auto bg-sheet'
          : 'contain-paint overflow-x-auto border border-line bg-sheet'
      }
    >
      <table className="w-max min-w-full border-separate border-spacing-0 text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="sticky top-0 z-30">
          <tr>
            <th className="sticky left-0 z-40 border-b border-b-line border-r-[1.5px] border-r-muted bg-paper" />
            <th
              colSpan={SIDE_COLUMNS.length}
              scope="colgroup"
              className={`border-b border-b-line bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-ink ${
                showFact ? 'border-r-[1.5px] border-r-muted' : ''
              }`}
            >
              {keepWithNext(planHeader)}
            </th>
            {showFact ? (
              <>
                <th
                  colSpan={SIDE_COLUMNS.length}
                  scope="colgroup"
                  className="border-b border-b-line border-r-[1.5px] border-r-muted bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-ink"
                >
                  {keepWithNext(
                    view === 'forecast'
                      ? 'Фактические показатели (прогноз)'
                      : 'Фактические показатели',
                  )}
                </th>
                <th
                  colSpan={VARIANCE_COLUMNS.length}
                  scope="colgroup"
                  className="border-b border-b-line bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-ink"
                >
                  Отклонение
                </th>
              </>
            ) : null}
          </tr>
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-40 w-px max-w-max whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-muted"
            >
              Товар
            </th>
            {SIDE_COLUMNS.map((column) => (
              <th
                key={`plan:${column.key}`}
                scope="col"
                className={`w-px whitespace-normal border-b border-b-line ${sectionRightClass('plan', column.key, part)} bg-paper px-1.5 py-2 text-center align-middle text-sm font-normal leading-5 text-muted last:border-r-0`}
              >
                <ColumnLabel label={column.label} />
              </th>
            ))}
            {showFact
              ? SIDE_COLUMNS.map((column) => (
                  <th
                    key={`fact:${column.key}`}
                    scope="col"
                    className={`w-px whitespace-normal border-b border-b-line ${sectionRightClass('fact', column.key, part)} bg-paper px-1.5 py-2 text-center align-middle text-sm font-normal leading-5 text-muted last:border-r-0`}
                  >
                    <ColumnLabel label={column.label} />
                  </th>
                ))
              : null}
            {showFact
              ? VARIANCE_COLUMNS.map((column) => (
                  <th
                    key={`var:${column.key}`}
                    scope="col"
                    className="w-px whitespace-normal border-r border-r-line border-b border-b-line bg-paper px-1.5 py-2 text-center align-middle text-sm font-normal leading-5 text-muted last:border-r-0"
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
              editable={editable}
              vatEditable={vatEditable}
              catalogEditable={catalogEditable}
              onPlanLineAction={onPlanLineAction}
              onProductVatAction={onProductVatAction}
              onProductCostAction={onProductCostAction}
              onRenameProduct={onRenameProduct}
              onDeleteProduct={onDeleteProduct}
              onRenameCategory={onRenameCategory}
              onDeleteCategory={onDeleteCategory}
              onAddProduct={onAddProduct}
            />
          ))}
          <tr>
            <th
              scope="row"
              className="sticky left-0 z-10 w-px max-w-max whitespace-nowrap border-t-[1.5px] border-t-muted border-b border-b-line border-r-[1.5px] border-r-muted bg-paper px-3 py-2 text-left align-middle font-normal text-ink"
            >
              Всего
            </th>
            {SIDE_COLUMNS.map((column) => (
              <td
                key={`plan-total:${column.key}`}
                className={`w-px border-t-[1.5px] border-t-muted border-b border-b-line bg-paper px-1.5 py-2 text-right align-middle last:border-r-0 ${sectionRightClass('plan', column.key, part)}`}
              >
                {planTotals ? (
                  <SideCell
                    column={column.key}
                    side={planTotals}
                    kind="total"
                  />
                ) : (
                  <Empty />
                )}
              </td>
            ))}
            {showFact
              ? SIDE_COLUMNS.map((column) => (
                  <td
                    key={`fact-total:${column.key}`}
                    className={`w-px border-t-[1.5px] border-t-muted border-b border-b-line bg-paper px-1.5 py-2 text-right align-middle last:border-r-0 ${sectionRightClass('fact', column.key, part)}`}
                  >
                    <SideCell
                      column={column.key}
                      side={factTotals}
                      kind="total"
                    />
                  </td>
                ))
              : null}
            {showFact
              ? VARIANCE_COLUMNS.map((column) => (
                  <td
                    key={`var-total:${column.key}`}
                    className="w-px border-t-[1.5px] border-t-muted border-r border-r-line border-b border-b-line bg-paper px-1.5 py-2 text-right align-middle last:border-r-0"
                  >
                    <VarianceCell column={column.key} variance={variance} />
                  </td>
                ))
              : null}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function CategoryBlock({
  group,
  part,
  editable,
  vatEditable,
  catalogEditable,
  onPlanLineAction,
  onProductVatAction,
  onProductCostAction,
  onRenameProduct,
  onDeleteProduct,
  onRenameCategory,
  onDeleteCategory,
  onAddProduct,
}: {
  group: SummaryGroup;
  part: 'full' | 'plan';
  editable: boolean;
  vatEditable: boolean;
  catalogEditable: boolean;
  onPlanLineAction: (
    lineId: string,
    priceWithVat: number,
    volumePieces: number,
  ) => SalesPlanRejection | null;
  onProductVatAction: (productId: string, vatPercent: number) => string | null;
  onProductCostAction: (
    productId: string,
    unitCostWithVat: number,
  ) => string | null;
  onRenameProduct: (productId: string, name: string) => string | null;
  onDeleteProduct: (productId: string, name: string) => void;
  onRenameCategory: (categoryId: string, name: string) => string | null;
  onDeleteCategory: (categoryId: string, name: string) => void;
  onAddProduct: (categoryId: string) => void;
}) {
  const header = 'bg-paper';
  const [open, setOpen] = useState(false);
  const productCount = group.rows.length;
  const showFact = part === 'full';

  return (
    <>
      <tr>
        <th
          scope="row"
          className={`sticky left-0 z-10 w-px max-w-max whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted px-3 py-2 text-left align-middle font-normal text-ink ${header}`}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-expanded={open}
              aria-label={
                open
                  ? `Свернуть товары категории ${group.name}`
                  : `Развернуть товары категории ${group.name}`
              }
              title={open ? 'Свернуть' : 'Развернуть'}
              onClick={() => setOpen((current) => !current)}
              className="inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {open ? <IconChevronDown /> : <IconChevronRight />}
            </button>
            {group.deleted || !catalogEditable ? (
              <span className="flex h-8 min-w-max flex-1 items-center text-sm font-semibold leading-none text-ink">
                {group.name} ({productCount})
              </span>
            ) : (
              <>
                <GridText
                  label={`Категория, ${group.name}`}
                  value={group.name}
                  invalidMessage={FIELD_ERROR.empty}
                  onCommit={(next) => onRenameCategory(group.categoryId, next)}
                />
                <span className="text-sm text-muted">({productCount})</span>
              </>
            )}
            {group.deleted ? (
              <span className="text-sm text-muted">удалена</span>
            ) : catalogEditable ? (
              <>
                <button
                  type="button"
                  aria-label={`Добавить товар в ${group.name}`}
                  title="Добавить товар"
                  onClick={() => {
                    setOpen(true);
                    onAddProduct(group.categoryId);
                  }}
                  className="inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  <IconPlus />
                </button>
                <button
                  type="button"
                  aria-label={`Удалить категорию ${group.name}`}
                  title="Удалить категорию"
                  onClick={() => onDeleteCategory(group.categoryId, group.name)}
                  className="inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  <IconTrash />
                </button>
              </>
            ) : null}
          </div>
        </th>
        {SIDE_COLUMNS.map((column) => (
          <td
            key={`plan-group:${column.key}`}
            className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle last:border-r-0 ${header} ${sectionRightClass('plan', column.key, part)}`}
          >
            {group.plan ? (
              <SideCell column={column.key} side={group.plan} kind="total" />
            ) : (
              <Empty />
            )}
          </td>
        ))}
        {showFact
          ? SIDE_COLUMNS.map((column) => (
              <td
                key={`fact-group:${column.key}`}
                className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle last:border-r-0 ${header} ${sectionRightClass('fact', column.key, part)}`}
              >
                <SideCell column={column.key} side={group.fact} kind="total" />
              </td>
            ))
          : null}
        {showFact
          ? VARIANCE_COLUMNS.map((column) => (
              <td
                key={`var-group:${column.key}`}
                className={`w-px border-r border-r-line border-b border-b-line px-1.5 py-2 text-right align-middle last:border-r-0 ${header}`}
              >
                <VarianceCell column={column.key} variance={group.variance} />
              </td>
            ))
          : null}
      </tr>
      {open
        ? group.rows.map((row) => (
            <ProductRow
              key={row.productId}
              row={row}
              part={part}
              editable={editable}
              vatEditable={vatEditable}
              catalogEditable={catalogEditable}
              onPlanLineAction={onPlanLineAction}
              onProductVatAction={onProductVatAction}
              onProductCostAction={onProductCostAction}
              onRenameProduct={onRenameProduct}
              onDeleteProduct={onDeleteProduct}
            />
          ))
        : null}
    </>
  );
}

function ProductRow({
  row,
  part,
  editable,
  vatEditable,
  catalogEditable,
  onPlanLineAction,
  onProductVatAction,
  onProductCostAction,
  onRenameProduct,
  onDeleteProduct,
}: {
  row: SummaryRow;
  part: 'full' | 'plan';
  editable: boolean;
  vatEditable: boolean;
  catalogEditable: boolean;
  onPlanLineAction: (
    lineId: string,
    priceWithVat: number,
    volumePieces: number,
  ) => SalesPlanRejection | null;
  onProductVatAction: (productId: string, vatPercent: number) => string | null;
  onProductCostAction: (
    productId: string,
    unitCostWithVat: number,
  ) => string | null;
  onRenameProduct: (productId: string, name: string) => string | null;
  onDeleteProduct: (productId: string, name: string) => void;
}) {
  const showFact = part === 'full';

  return (
    <tr>
      <th
        scope="row"
        className="sticky left-0 z-10 w-px max-w-max whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted bg-sheet px-3 py-2 pl-8 text-left align-middle font-normal"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {row.deleted || !catalogEditable ? (
              <span className="flex h-8 min-w-max flex-1 items-center text-sm leading-none text-ink">
                {row.name}
              </span>
            ) : (
              <GridText
                label={`Название, ${row.name}`}
                value={row.name}
                invalidMessage={FIELD_ERROR.empty}
                onCommit={(next) => onRenameProduct(row.productId, next)}
              />
            )}
            {row.deleted || !catalogEditable ? null : (
              <button
                type="button"
                aria-label={`Удалить ${row.name}`}
                title="Удалить"
                onClick={() => onDeleteProduct(row.productId, row.name)}
                className="inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <IconTrash />
              </button>
            )}
          </div>
          {row.deleted ? (
            <span className="text-sm text-muted">удалён</span>
          ) : null}
        </div>
      </th>
      {SIDE_COLUMNS.map((column) => {
        const canEdit =
          !row.deleted &&
          ((editable &&
            row.planLineId !== null &&
            (column.key === 'price' || column.key === 'volume')) ||
            (vatEditable &&
              (column.key === 'vat' || column.key === 'unitCost')));
        return (
          <td
            key={`plan:${column.key}`}
            className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle last:border-r-0 ${sectionRightClass('plan', column.key, part)} ${
              canEdit && (column.key === 'volume' || column.key === 'vat')
                ? editableCellClassName
                : ''
            }`}
            onClick={(event) => {
              if (!canEdit) {
                return;
              }
              if (event.target instanceof HTMLInputElement) {
                return;
              }
              const field = editableFieldNear(
                event.target,
                event.currentTarget,
              );
              if (
                field instanceof HTMLInputElement &&
                document.activeElement !== field
              ) {
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
              const field = editableFieldNear(
                event.target,
                event.currentTarget,
              );
              if (field instanceof HTMLInputElement) {
                field.focus();
              }
            }}
          >
            <PlanCell
              column={column.key}
              row={row}
              editable={editable && !row.deleted}
              vatEditable={vatEditable && !row.deleted}
              onPlanLine={onPlanLineAction}
              onProductVat={onProductVatAction}
              onProductCost={onProductCostAction}
            />
          </td>
        );
      })}
      {showFact
        ? SIDE_COLUMNS.map((column) => (
            <td
              key={`fact:${column.key}`}
              className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle last:border-r-0 ${sectionRightClass('fact', column.key, part)}`}
            >
              <SideCell column={column.key} side={row.fact} kind="row" />
            </td>
          ))
        : null}
      {showFact
        ? VARIANCE_COLUMNS.map((column) => (
            <td
              key={`var:${column.key}`}
              className="w-px border-r border-r-line border-b border-b-line px-1.5 py-2 text-right align-middle last:border-r-0"
            >
              <VarianceCell column={column.key} variance={row.variance} />
            </td>
          ))
        : null}
    </tr>
  );
}

function PlanCell({
  column,
  row,
  editable,
  vatEditable,
  onPlanLine,
  onProductVat,
  onProductCost,
}: {
  column: SideKey;
  row: SummaryRow;
  editable: boolean;
  vatEditable: boolean;
  onPlanLine: (
    lineId: string,
    priceWithVat: number,
    volumePieces: number,
  ) => SalesPlanRejection | null;
  onProductVat: (productId: string, vatPercent: number) => string | null;
  onProductCost: (productId: string, unitCostWithVat: number) => string | null;
}) {
  if (column === 'vat') {
    if (!vatEditable) {
      const side = row.plan ?? row.fact;
      return <SideCell column={column} side={side} kind="row" />;
    }

    return (
      <GridNumber
        label={`НДС, ${row.name}`}
        value={String(row.plan?.vatPercent ?? row.fact.vatPercent ?? '')}
        disabled={false}
        inputMode="numeric"
        unit="%"
        invalidMessage={FIELD_ERROR.vat}
        parse={parseWholePercent}
        onCommit={(next) => onProductVat(row.productId, next)}
      />
    );
  }

  if (column === 'unitCost') {
    if (!vatEditable) {
      const side = row.plan ?? row.fact;
      return <SideCell column={column} side={side} kind="row" />;
    }

    const cost = row.plan?.unitCost ?? row.fact.unitCost;
    if (!cost) {
      return <UnitCostValue cost={null} />;
    }

    const vatPercent = row.plan?.vatPercent ?? row.fact.vatPercent;

    return (
      <StackedPair
        topHighlighted
        bottomHighlighted
        topLabel="с НДС"
        bottomLabel="без НДС"
        top={
          <GridNumber
            label={`Себестоимость с НДС, ${row.name}`}
            value={priceDraft(cost.withVat)}
            disabled={false}
            inputMode="decimal"
            unit="₽"
            invalidMessage={FIELD_ERROR.cost}
            parse={parsePlanPrice}
            onCommit={(next) => onProductCost(row.productId, next)}
          />
        }
        bottom={
          <GridNumber
            label={`Себестоимость без НДС, ${row.name}`}
            value={priceDraft(cost.exVat)}
            disabled={false}
            inputMode="decimal"
            unit="₽"
            invalidMessage={FIELD_ERROR.cost}
            parse={parsePlanPrice}
            onCommit={(next) => {
              if (vatPercent === null) {
                return FIELD_ERROR.vat;
              }
              const withVat = costWithVat(next, vatPercent);
              if (withVat === null) {
                return FIELD_ERROR.cost;
              }
              return onProductCost(row.productId, withVat);
            }}
          />
        }
      />
    );
  }

  if (!row.plan || row.planLineId === null) {
    return <Empty />;
  }

  if (column === 'price') {
    if (!editable) {
      return <SideCell column={column} side={row.plan} kind="row" />;
    }

    const vatPercent = row.plan.vatPercent;
    const priceExVatKopecks =
      vatPercent === null
        ? null
        : amountExVat(row.planPriceWithVat ?? 0, vatPercent);

    return (
      <StackedPair
        topHighlighted={editable}
        bottomHighlighted={editable}
        topLabel="с НДС"
        bottomLabel="без НДС"
        top={
          <GridNumber
            label={`Плановая цена с НДС, ${row.name}`}
            value={priceDraft(row.planPriceWithVat ?? 0)}
            disabled={!editable}
            inputMode="decimal"
            unit="₽"
            invalidMessage={SALES_PLAN_ERROR.price}
            parse={parsePlanPrice}
            onCommit={(next) => {
              const rejection = onPlanLine(
                row.planLineId ?? '',
                next,
                row.planVolumePieces ?? 0,
              );
              return rejection ? SALES_PLAN_ERROR[rejection] : null;
            }}
          />
        }
        bottom={
          priceExVatKopecks === null ? (
            <Empty />
          ) : (
            <GridNumber
              label={`Плановая цена без НДС, ${row.name}`}
              value={priceDraft(priceExVatKopecks)}
              disabled={!editable}
              inputMode="decimal"
              unit="₽"
              invalidMessage={SALES_PLAN_ERROR.price}
              parse={parsePlanPrice}
              onCommit={(next) => {
                if (vatPercent === null) {
                  return FIELD_ERROR.vat;
                }
                const withVat = priceWithVatFromExVat(next, vatPercent);
                if (withVat === null) {
                  return SALES_PLAN_ERROR.price;
                }
                const rejection = onPlanLine(
                  row.planLineId ?? '',
                  withVat,
                  row.planVolumePieces ?? 0,
                );
                return rejection ? SALES_PLAN_ERROR[rejection] : null;
              }}
            />
          )
        }
      />
    );
  }

  if (column === 'volume') {
    if (!editable) {
      return <SideCell column={column} side={row.plan} kind="row" />;
    }

    return (
      <GridNumber
        label={`Плановый объём, ${row.name}`}
        value={volumeDraft(row.planVolumePieces ?? 0)}
        disabled={!editable}
        inputMode="numeric"
        unit="шт"
        invalidMessage={SALES_PLAN_ERROR.volume}
        parse={parseVolumePieces}
        onCommit={(next) => {
          const rejection = onPlanLine(
            row.planLineId ?? '',
            row.planPriceWithVat ?? 0,
            next,
          );
          return rejection ? SALES_PLAN_ERROR[rejection] : null;
        }}
      />
    );
  }

  return <SideCell column={column} side={row.plan} kind="row" />;
}

function SideCell({
  column,
  side,
  kind,
}: {
  column: SideKey;
  side: SummarySide;
  kind: 'row' | 'total';
}) {
  switch (column) {
    case 'unitCost':
      if (kind === 'total') {
        if (!side.costComplete) {
          return <Muted>{keepWithNext('не по всем товарам')}</Muted>;
        }

        return (
          <VatMoneyOrEmpty
            withVat={side.averageCostWithVat}
            exVat={side.averageCostExVat}
          />
        );
      }
      return <UnitCostValue cost={side.unitCost} />;
    case 'profitability':
      if (kind === 'total' && !side.costComplete) {
        return <Empty />;
      }
      return side.profitabilityHundredths === null ? (
        <Empty />
      ) : (
        <TableNumber value={side.profitabilityHundredths}>
          {formatPercentHundredths(side.profitabilityHundredths)}
        </TableNumber>
      );
    case 'price':
      if (
        side.priceExVatTenThousandths !== null &&
        side.priceWithVat !== null
      ) {
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
      return (
        <VatMoneyOrEmpty withVat={side.priceWithVat} exVat={side.priceExVat} />
      );
    case 'volume':
      return side.volumePieces === null ? (
        <Empty />
      ) : (
        <TableNumber value={side.volumePieces}>
          {formatPieces(side.volumePieces)} шт
        </TableNumber>
      );
    case 'revenue':
      if (kind === 'total' && !side.revenueComplete) {
        return <Muted>{keepWithNext('не по всем товарам')}</Muted>;
      }
      return (
        <VatMoneyOrEmpty
          withVat={side.revenueWithVat}
          exVat={side.revenueExVat}
        />
      );
    case 'contribution':
      if (kind === 'total' && (!side.costComplete || !side.revenueComplete)) {
        return <Muted>{keepWithNext('не по всем товарам')}</Muted>;
      }
      return side.contribution === null ? (
        <Empty />
      ) : (
        <MoneyAmount amount={side.contribution} />
      );
    case 'volumeCost':
      if (kind === 'total' && !side.costComplete) {
        return <Muted>{keepWithNext('не по всем товарам')}</Muted>;
      }
      return (
        <VatMoneyOrEmpty
          withVat={side.volumeCostWithVat}
          exVat={side.volumeCostExVat}
        />
      );
    case 'perDay':
      return side.perDay === null ? (
        <Empty />
      ) : (
        <TableNumber value={side.perDay}>
          {formatPerDay(side.perDay)}
        </TableNumber>
      );
    case 'vat':
      if (kind === 'total') {
        return side.vatPercentHundredths === null ? (
          <Empty />
        ) : (
          <TableNumber value={side.vatPercentHundredths}>
            {formatPercentHundredths(side.vatPercentHundredths)}
          </TableNumber>
        );
      }
      return side.vatPercent === null ? (
        <Empty />
      ) : (
        <TableNumber value={side.vatPercent}>{side.vatPercent} %</TableNumber>
      );
    default:
      return <Empty />;
  }
}

function VarianceCell({
  column,
  variance,
}: {
  column: VarianceKey;
  variance: SummaryVariance;
}) {
  if (column === 'revenue') {
    return (
      <VatMoneyOrEmpty
        signed
        withVat={variance.revenueWithVat}
        exVat={variance.revenueExVat}
      />
    );
  }

  return variance.contribution === null ? (
    <Empty />
  ) : (
    <MoneyAmount amount={variance.contribution} signed />
  );
}

function UnitCostValue({ cost }: { cost: UnitCost | null }) {
  if (!cost) {
    return <Muted>{keepWithNext('Себестоимость не считается')}</Muted>;
  }

  return (
    <VatPair
      withVat={<MoneyAmount amount={cost.withVat} />}
      exVat={<MoneyAmount amount={cost.exVat} />}
    />
  );
}

function MoneyAmount({
  amount,
  signed = false,
}: {
  amount: number;
  signed?: boolean;
}) {
  return (
    <TableNumber value={amount} signed={signed}>
      {formatMoney(amount)}
    </TableNumber>
  );
}

function VatMoneyOrEmpty({
  withVat,
  exVat,
  signed = false,
}: {
  withVat: number | null;
  exVat: number | null;
  signed?: boolean;
}) {
  if (withVat === null && exVat === null) {
    return <Empty />;
  }

  return (
    <VatPair
      withVat={
        withVat === null ? (
          <Empty />
        ) : (
          <MoneyAmount amount={withVat} signed={signed} />
        )
      }
      exVat={
        exVat === null ? (
          <Empty />
        ) : (
          <MoneyAmount amount={exVat} signed={signed} />
        )
      }
    />
  );
}

function VatPair({
  withVat,
  exVat,
  withVatHighlighted = false,
}: {
  withVat: ReactNode;
  exVat: ReactNode;
  withVatHighlighted?: boolean;
}) {
  return (
    <StackedPair
      topLabel="с НДС"
      bottomLabel="без НДС"
      topHighlighted={withVatHighlighted}
      top={withVat}
      bottom={exVat}
    />
  );
}

function editableFieldNear(
  target: EventTarget | null,
  cell: HTMLElement,
): HTMLInputElement | null {
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

function StackedPair({
  topLabel,
  bottomLabel,
  top,
  bottom,
  topHighlighted = false,
  bottomHighlighted = false,
}: {
  topLabel: string;
  bottomLabel: string;
  top: ReactNode;
  bottom: ReactNode;
  topHighlighted?: boolean;
  bottomHighlighted?: boolean;
}) {
  return (
    <div className="-mx-1.5 -my-2 flex min-w-18 flex-col">
      <div
        data-editable-field=""
        className={`flex flex-col items-end border-b border-line px-1.5 py-1 ${
          topHighlighted ? editableCellClassName : ''
        }`}
      >
        <span className="text-[0.5rem] leading-none text-muted">
          {topLabel}
        </span>
        {top}
      </div>
      <div
        data-editable-field=""
        className={`flex flex-col items-end px-1.5 py-1 ${
          bottomHighlighted ? editableCellClassName : ''
        }`}
      >
        <span className="text-[0.5rem] leading-none text-muted">
          {bottomLabel}
        </span>
        {bottom}
      </div>
    </div>
  );
}

function Empty() {
  return <span className="text-muted">—</span>;
}

function Muted({ children }: { children: string }) {
  return <span className="text-sm text-muted">{children}</span>;
}

function sanitizeDraft(raw: string, mode: 'decimal' | 'numeric'): string {
  let result = '';
  let hasComma = false;

  for (const char of raw) {
    if (char >= '0' && char <= '9') {
      result += char;
      continue;
    }

    if (mode === 'decimal' && (char === ',' || char === '.') && !hasComma) {
      result += ',';
      hasComma = true;
    }
  }

  return result;
}

function GridNumber({
  label,
  value,
  disabled,
  inputMode,
  unit,
  invalidMessage,
  parse,
  onCommit,
}: {
  label: string;
  value: string;
  disabled: boolean;
  inputMode: 'decimal' | 'numeric';
  unit?: string;
  invalidMessage: string;
  parse: (raw: string) => number | null;
  onCommit: (value: number) => string | null;
}) {
  const inputId = useId();
  const errorId = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const shown = draft ?? value;

  function commit(raw: string) {
    const parsed = parse(raw);
    if (parsed === null) {
      setError(invalidMessage);
      setDraft(raw);
      return;
    }

    const rejection = onCommit(parsed);
    if (rejection) {
      setError(rejection);
      setDraft(raw);
      return;
    }

    setDraft(null);
    setError(null);
  }

  if (disabled) {
    return (
      <>
        <span className="sr-only">{label}</span>
        <span className="whitespace-nowrap">
          {shown}
          {unit ? ` ${unit}` : ''}
        </span>
      </>
    );
  }

  return (
    <div data-editable-field="" className="min-w-0">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div className="flex items-baseline justify-end gap-1">
        <input
          id={inputId}
          value={shown}
          inputMode={inputMode}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onFocus={() => {
            setDraft(sanitizeDraft(value, inputMode));
            setError(null);
          }}
          onChange={(event) =>
            setDraft(sanitizeDraft(event.target.value, inputMode))
          }
          onBlur={(event) => commit(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              event.stopPropagation();
              event.currentTarget.blur();
            }
          }}
          className={gridFieldClassName}
        />
        {unit ? (
          <span className="shrink-0 text-sm text-ink">{unit}</span>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className="mt-1 text-sm text-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function GridText({
  label,
  value,
  disabled = false,
  invalidMessage,
  onCommit,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  invalidMessage: string;
  onCommit: (value: string) => string | null;
}) {
  const inputId = useId();
  const errorId = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const shown = draft ?? value;

  function commit(raw: string) {
    if (raw.trim().length === 0) {
      setError(invalidMessage);
      setDraft(raw);
      return;
    }

    const rejection = onCommit(raw);
    if (rejection) {
      setError(rejection);
      setDraft(raw);
      return;
    }

    setDraft(null);
    setError(null);
  }

  return (
    <div className="min-w-max flex-1">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div className="relative min-w-max flex-1">
        <span
          className="invisible flex h-8 items-center whitespace-nowrap text-sm leading-none"
          aria-hidden
        >
          {shown.length > 0 ? shown : '\u00a0'}
        </span>
        <input
          id={inputId}
          value={shown}
          autoComplete="off"
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onFocus={() => {
            setDraft(value);
            setError(null);
          }}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={(event) => commit(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              event.stopPropagation();
              event.currentTarget.blur();
            }
          }}
          className={gridNameClassName}
        />
      </div>
      {error ? (
        <p id={errorId} className="mt-1 text-sm text-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}
