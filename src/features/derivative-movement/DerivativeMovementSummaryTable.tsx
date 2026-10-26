'use client';

import { useState } from 'react';

import type { DerivativeMovementRow, DerivativeMovementSection } from '@/domain/derivative-movement';
import { MaterialNormDeviation } from '@/features/materials/MaterialNormDeviation';
import { QuantityRead } from '@/features/materials/QuantityCell';
import {
  ReportSubBannerColumnHeaders,
  type ReportSubBannerGroup,
} from '@/features/movement/FinishedGoodsNormativeColumnHeading';
import { IconChevronDown, IconChevronRight } from '@/features/shell/Icons';
import {
  blockCornerClassName,
  blockHeadingClassName,
  type CellKind,
  categoryBandClassName,
  categoryNameClassName,
  categoryNameRowClassName,
  cellKindClassName,
  columnDividerClassName,
  entityNameRowClassName,
  keepWithNext,
  nameHeadingClassName,
  ProductIndex,
  stickyHeadClassName,
  tableBorder,
  tableClassName,
  tableFrameClassName,
  VatMoneyCell,
} from '@/features/table';

type ColumnKey =
  | 'opening'
  | 'planConsumption'
  | 'planConsumptionPrice'
  | 'planConsumptionCost'
  | 'factConsumption'
  | 'factConsumptionPrice'
  | 'factConsumptionCost'
  | 'inventoryClosing'
  | 'min'
  | 'max'
  | 'normDeviation';

const COLUMN_GROUPS: { label: string; columns: { key: ColumnKey; label: string; hint?: string }[] }[] = [
  {
    label: 'Остаток на начало',
    columns: [{ key: 'opening', label: 'Факт', hint: 'по данным инвентаризации прошлого месяца' }],
  },
  {
    label: 'План расхода',
    columns: [
      {
        key: 'planConsumption',
        label: 'Кол-во',
        hint: 'Количество, необходимое для выпуска по плану',
      },
      {
        key: 'planConsumptionPrice',
        label: 'Цена',
        hint: 'Себестоимость единицы по плановым ценам сырья',
      },
      {
        key: 'planConsumptionCost',
        label: 'Стоимость',
      },
    ],
  },
  {
    label: 'Факт расхода',
    columns: [
      {
        key: 'factConsumption',
        label: 'Кол-во',
        hint: 'Количество, необходимое для фактического выпуска',
      },
      {
        key: 'factConsumptionPrice',
        label: 'Цена',
        hint: 'Себестоимость единицы по фактическим ценам расхода сырья',
      },
      {
        key: 'factConsumptionCost',
        label: 'Стоимость',
      },
    ],
  },
  {
    label: 'Остаток на конец',
    columns: [
      {
        key: 'inventoryClosing',
        label: 'Факт',
        hint: 'по данным инвентаризации',
      },
      { key: 'min', label: 'Мин.' },
      { key: 'max', label: 'Макс.' },
      { key: 'normDeviation', label: 'Откл.' },
    ],
  },
];

const DERIVATIVE_CLOSING_SUB_BANNERS: readonly ReportSubBannerGroup[] = [
  {
    label: 'инвентаризация',
    keys: ['inventoryClosing'],
  },
  {
    label: 'нормативный',
    keys: ['min', 'max', 'normDeviation'],
  },
];

const COLUMNS = COLUMN_GROUPS.flatMap((group) => group.columns);
const GROUP_END_KEYS = new Set(COLUMN_GROUPS.slice(0, -1).map((group) => group.columns.at(-1)?.key));

const COLUMN_KIND: Record<ColumnKey, CellKind> = {
  opening: 'repeated',
  planConsumption: 'computed',
  planConsumptionPrice: 'computed',
  planConsumptionCost: 'computed',
  factConsumption: 'computed',
  factConsumptionPrice: 'computed',
  factConsumptionCost: 'computed',
  inventoryClosing: 'repeated',
  min: 'repeated',
  max: 'repeated',
  normDeviation: 'computed',
};

function columnEdgeClass(key: ColumnKey): string {
  return GROUP_END_KEYS.has(key) ? tableBorder.rightThick : columnDividerClassName;
}

export function DerivativeMovementSummaryTable({ sections }: { sections: readonly DerivativeMovementSection[] }) {
  return (
    <div className={tableFrameClassName}>
      <table className={tableClassName}>
        <caption className="sr-only">Движение производных: остатки, расход и норматив</caption>
        <thead className={stickyHeadClassName}>
          <tr>
            <th className={`sticky left-0 z-40 ${blockCornerClassName} ${tableBorder.rightThick}`} />
            {COLUMN_GROUPS.map((group, index) => (
              <th
                key={group.label}
                colSpan={group.columns.length}
                scope="colgroup"
                className={`${blockHeadingClassName} ${index < COLUMN_GROUPS.length - 1 ? tableBorder.rightThick : ''}`}
              >
                {keepWithNext(group.label)}
              </th>
            ))}
          </tr>
          <tr>
            <th rowSpan={2} scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
              Производная
            </th>
            <ReportSubBannerColumnHeaders
              row="primary"
              columns={COLUMNS}
              subBannerGroups={DERIVATIVE_CLOSING_SUB_BANNERS}
              groupEndClass={columnEdgeClass}
            />
          </tr>
          <tr>
            <ReportSubBannerColumnHeaders
              row="secondary"
              columns={COLUMNS}
              subBannerGroups={DERIVATIVE_CLOSING_SUB_BANNERS}
              groupEndClass={columnEdgeClass}
            />
          </tr>
        </thead>
        <tbody>
          {sections.map((section) => (
            <WorkshopBlock key={section.workshopId} section={section} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WorkshopBlock({ section }: { section: DerivativeMovementSection }) {
  const [open, setOpen] = useState(true);
  const count = section.rows.length;

  return (
    <>
      <tr>
        <th scope="row" className={categoryNameRowClassName(false)}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-expanded={open}
              aria-label={open ? `Свернуть ${section.name}` : `Развернуть ${section.name}`}
              title={open ? 'Свернуть' : 'Развернуть'}
              onClick={() => setOpen((current) => !current)}
              className="inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {open ? <IconChevronDown /> : <IconChevronRight />}
            </button>
            <span className={categoryNameClassName}>
              {section.name} ({count})
            </span>
          </div>
        </th>
        {COLUMNS.map((column) => (
          <td
            key={`group:${column.key}`}
            className={`w-px border-b border-b-line px-2 py-2 text-right align-middle ${categoryBandClassName} ${columnEdgeClass(column.key)}`}
          >
            <WorkshopCell column={column.key} section={section} />
          </td>
        ))}
      </tr>
      {open
        ? section.rows.map((row, index) => <DerivativeRow key={row.derivativeId} row={row} index={index + 1} />)
        : null}
    </>
  );
}

function WorkshopCell({ column, section }: { column: ColumnKey; section: DerivativeMovementSection }) {
  if (column === 'planConsumptionCost') {
    return (
      <VatMoneyCell
        label="Плановая стоимость расхода"
        withVat={section.planConsumptionCost.withVat}
        exVat={section.planConsumptionCost.exVat}
      />
    );
  }
  if (column === 'factConsumptionCost') {
    return (
      <VatMoneyCell
        label="Фактическая стоимость расхода"
        withVat={section.factConsumptionCost.withVat}
        exVat={section.factConsumptionCost.exVat}
      />
    );
  }
  return null;
}

function DerivativeRow({ row, index }: { row: DerivativeMovementRow; index: number }) {
  return (
    <tr>
      <th scope="row" className={entityNameRowClassName('repeated')}>
        <div className="flex items-center gap-2">
          <ProductIndex index={index} />
          <span className="flex h-8 min-w-max items-center text-sm leading-none text-ink">{row.name}</span>
        </div>
      </th>
      {COLUMNS.map((column) => (
        <td
          key={`row:${column.key}`}
          className={`w-px border-b border-b-line px-2 py-2 text-right align-middle ${cellKindClassName[COLUMN_KIND[column.key]]} ${columnEdgeClass(column.key)}`}
        >
          <RowCell column={column.key} row={row} />
        </td>
      ))}
    </tr>
  );
}

function RowCell({ column, row }: { column: ColumnKey; row: DerivativeMovementRow }) {
  const unit = row.unit;
  switch (column) {
    case 'opening':
      return <QuantityRead value={row.openingQuantity} unit={unit} signed />;
    case 'planConsumption':
      return <QuantityRead value={row.planConsumptionQuantity} unit={unit} />;
    case 'planConsumptionPrice':
      return (
        <VatMoneyCell
          label="Плановая цена расхода"
          withVat={row.planConsumptionPrice.withVat}
          exVat={row.planConsumptionPrice.exVat}
        />
      );
    case 'planConsumptionCost':
      return (
        <VatMoneyCell
          label="Плановая стоимость расхода"
          withVat={row.planConsumptionCost.withVat}
          exVat={row.planConsumptionCost.exVat}
        />
      );
    case 'factConsumption':
      return <QuantityRead value={row.factConsumptionQuantity} unit={unit} />;
    case 'factConsumptionPrice':
      return (
        <VatMoneyCell
          label="Фактическая цена расхода"
          withVat={row.factConsumptionPrice.withVat}
          exVat={row.factConsumptionPrice.exVat}
        />
      );
    case 'factConsumptionCost':
      return (
        <VatMoneyCell
          label="Фактическая стоимость расхода"
          withVat={row.factConsumptionCost.withVat}
          exVat={row.factConsumptionCost.exVat}
        />
      );
    case 'inventoryClosing':
      return <QuantityRead value={row.inventoryClosingQuantity} unit={unit} signed />;
    case 'min':
      return <QuantityRead value={row.minQuantity} unit={unit} />;
    case 'max':
      return <QuantityRead value={row.maxQuantity} unit={unit} />;
    case 'normDeviation':
      return (
        <MaterialNormDeviation
          belowMinQuantity={row.belowMinQuantity}
          aboveMaxQuantity={row.aboveMaxQuantity}
          unit={unit}
        />
      );
    default:
      return null;
  }
}
