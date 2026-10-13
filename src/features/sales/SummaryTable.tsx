'use client';

import { useId, useState } from 'react';

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
  ColumnLabel,
  categoryBandClassName,
  categoryNameClassName,
  columnDividerClassName,
  columnHeadingClassName,
  Empty,
  editableCellClassName,
  gridNameClassName,
  IntegerCell,
  keepWithNext,
  MoneyAmount,
  MoneyCell,
  Muted,
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

const LAST_PLAN_KEY = SIDE_COLUMNS.at(-1)?.key;
const LAST_FACT_KEY = SIDE_COLUMNS.at(-1)?.key;

function sectionRightClass(kind: 'plan' | 'fact' | 'variance', key: string, part: 'full' | 'plan'): string {
  if (part === 'plan') {
    return tableBorder.rightThin;
  }
  if (kind === 'plan' && key === LAST_PLAN_KEY) {
    return tableBorder.rightThick;
  }
  if (kind === 'fact' && key === LAST_FACT_KEY) {
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
  /** Правка плана и справочника. Без него таблица только для просмотра. */
  edit?: SummaryTableEdit;
}) {
  const showFact = part === 'full';
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
              colSpan={SIDE_COLUMNS.length}
              scope="colgroup"
              className={`${blockHeadingClassName} ${showFact ? tableBorder.rightThick : ''}`}
            >
              {keepWithNext(planHeader)}
            </th>
            {showFact ? (
              <>
                <th
                  colSpan={SIDE_COLUMNS.length}
                  scope="colgroup"
                  className={`${blockHeadingClassName} ${tableBorder.rightThick}`}
                >
                  {keepWithNext(factIsForecast ? 'Фактические показатели (прогноз)' : 'Фактические показатели')}
                </th>
                <th colSpan={VARIANCE_COLUMNS.length} scope="colgroup" className={blockHeadingClassName}>
                  Отклонение
                </th>
              </>
            ) : null}
          </tr>
          <tr>
            <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
              Товар
            </th>
            {SIDE_COLUMNS.map((column) => (
              <th
                key={`plan:${column.key}`}
                scope="col"
                className={`${columnHeadingClassName} last:border-r-0 ${sectionRightClass('plan', column.key, part)}`}
              >
                <ColumnLabel label={column.label} />
              </th>
            ))}
            {showFact
              ? SIDE_COLUMNS.map((column) => (
                  <th
                    key={`fact:${column.key}`}
                    scope="col"
                    className={`${columnHeadingClassName} last:border-r-0 ${sectionRightClass('fact', column.key, part)}`}
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
            <CategoryBlock key={group.categoryId} group={group} part={part} edit={edit} />
          ))}
          <tr>
            <th scope="row" className={`sticky left-0 z-10 ${totalNameClassName}`}>
              Всего
            </th>
            {SIDE_COLUMNS.map((column) => (
              <td
                key={`plan-total:${column.key}`}
                className={`${totalValueClassName} last:border-r-0 ${sectionRightClass('plan', column.key, part)}`}
              >
                {planTotals ? <SideCell column={column.key} side={planTotals} kind="total" /> : <Empty />}
              </td>
            ))}
            {showFact
              ? SIDE_COLUMNS.map((column) => (
                  <td
                    key={`fact-total:${column.key}`}
                    className={`${totalValueClassName} last:border-r-0 ${sectionRightClass('fact', column.key, part)}`}
                  >
                    <SideCell column={column.key} side={factTotals} kind="total" />
                  </td>
                ))
              : null}
            {showFact
              ? VARIANCE_COLUMNS.map((column) => (
                  <td key={`var-total:${column.key}`} className={`${totalValueClassName} ${columnDividerClassName}`}>
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

function CategoryBlock({ group, part, edit }: { group: SummaryGroup; part: 'full' | 'plan'; edit?: SummaryTableEdit }) {
  const header = categoryBandClassName;
  const [open, setOpen] = useState(true);
  const productCount = group.rows.length;
  const showFact = part === 'full';
  const catalogEditable = edit?.catalog === true;

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
        {SIDE_COLUMNS.map((column) => (
          <td
            key={`plan-group:${column.key}`}
            className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle last:border-r-0 ${header} ${sectionRightClass('plan', column.key, part)}`}
          >
            {group.plan ? <SideCell column={column.key} side={group.plan} kind="total" /> : <Empty />}
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
                className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${header} ${columnDividerClassName}`}
              >
                <VarianceCell column={column.key} variance={group.variance} />
              </td>
            ))
          : null}
      </tr>
      {open
        ? group.rows.map((row, index) => (
            <ProductRow key={row.productId} row={row} index={index + 1} part={part} edit={edit} />
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
}: {
  row: SummaryRow;
  index: number;
  part: 'full' | 'plan';
  edit?: SummaryTableEdit;
}) {
  const showFact = part === 'full';
  const catalogEditable = edit?.catalog === true;
  const planEditable = edit?.plan === true;
  const vatEditable = edit?.vat === true;

  return (
    <tr>
      <th
        scope="row"
        className="sticky left-0 z-10 w-px max-w-max whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted bg-sheet px-3 py-2 text-left align-middle font-normal"
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
      {SIDE_COLUMNS.map((column) => {
        const canEdit =
          (planEditable && row.planLineId !== null && (column.key === 'price' || column.key === 'volume')) ||
          (vatEditable && column.key === 'vat');
        return (
          <td
            key={`plan:${column.key}`}
            className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle last:border-r-0 ${sectionRightClass('plan', column.key, part)} ${
              canEdit && (column.key === 'volume' || column.key === 'vat') ? editableCellClassName : ''
            }`}
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
              className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`}
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
      return <UnitCostValue cost={side.unitCost} />;
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

function UnitCostValue({ cost }: { cost: UnitCost | null }) {
  if (!cost) {
    return <Muted>{keepWithNext('Себестоимость не считается')}</Muted>;
  }

  return <VatMoneyCell withVat={cost.withVat} exVat={cost.exVat} />;
}

function GridText({
  label,
  value,
  disabled = false,
  caps = false,
  invalidMessage,
  onCommit,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  caps?: boolean;
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
          className={`invisible flex h-8 items-center whitespace-nowrap text-sm leading-none ${caps ? 'uppercase' : ''}`}
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
          className={`${gridNameClassName} ${caps ? 'uppercase' : ''}`}
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
