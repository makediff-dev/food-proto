'use client';

import { type CSSProperties, useMemo, useState } from 'react';

import {
  calculatedConsumptionQuantityForDerivativeDay,
  realConsumptionQuantityForDerivativeDay,
  realReceiptQuantityForDerivativeDay,
} from '@/domain/derivative-movement';
import { derivativesList } from '@/domain/derivatives';
import {
  DERIVATIVE_WORKSHOPS,
  type Derivative,
  type DerivativeWorkshopId,
  type PrototypeDocument,
} from '@/domain/document';
import { QuantityCell, QuantityRead } from '@/features/materials/QuantityCell';
import { IconChevronDown, IconChevronRight } from '@/features/shell/Icons';
import {
  blockCornerClassName,
  blockHeadingClassName,
  ColumnLabel,
  categoryBandClassName,
  categoryNameClassName,
  categoryNameRowClassName,
  cellKindClassName,
  columnDividerClassName,
  columnHeadingClassName,
  entityNameRowClassName,
  keepWithNext,
  nameHeadingClassName,
  ProductIndex,
  stickyCategoryCellClassName,
  stickyHeadClassName,
  tableBorder,
  tableClassName,
  tableFrameScrollClassName,
  useStickyTableHead,
} from '@/features/table';

type ConsumptionLine = {
  id: string;
  name: string;
  unit: Derivative['unit'];
  deleted: boolean;
  realReceiptDay: number;
  calculated: number;
  realDay: number;
};

type ConsumptionSection = {
  key: string;
  label: string;
  rows: ConsumptionLine[];
};

const iconButtonClassName =
  'inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';

const valueHead = `${columnHeadingClassName} ${columnDividerClassName}`;
const valueCell = `w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${columnDividerClassName}`;
const valueEnd = `w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${tableBorder.rightThick}`;
const bandCell = `${valueCell} ${categoryBandClassName}`;
const bandEnd = `${valueEnd} ${categoryBandClassName}`;

function inputKind(editable: boolean): 'assigned' | 'computed' {
  return editable ? 'assigned' : 'computed';
}

function dayGridDerivatives(
  document: PrototypeDocument,
  workshopId: DerivativeWorkshopId,
  occurredOn: string,
): Derivative[] {
  const items = derivativesList(document).filter((item) => item.workshopId === workshopId);
  const active = items.filter((item) => item.deletedAt === null);
  const archived = items.filter(
    (item) =>
      item.deletedAt !== null &&
      (realReceiptQuantityForDerivativeDay(document, occurredOn, item.id) !== 0 ||
        realConsumptionQuantityForDerivativeDay(document, occurredOn, item.id) !== 0),
  );
  return [...active, ...archived].sort((left, right) => left.name.localeCompare(right.name, 'ru'));
}

function buildSections(document: PrototypeDocument, day: string): ConsumptionSection[] {
  return DERIVATIVE_WORKSHOPS.flatMap((workshop) => {
    const rows = dayGridDerivatives(document, workshop.id, day).map((row) => ({
      id: row.id,
      name: row.name,
      unit: row.unit,
      deleted: row.deletedAt !== null,
      realReceiptDay: realReceiptQuantityForDerivativeDay(document, day, row.id),
      calculated: calculatedConsumptionQuantityForDerivativeDay(document, day, row.id),
      realDay: realConsumptionQuantityForDerivativeDay(document, day, row.id),
    }));
    if (rows.length === 0) {
      return [];
    }
    return [{ key: workshop.id, label: workshop.name, rows }];
  });
}

export function DerivativeConsumptionTable({
  document,
  day,
  editable,
  onReceipt,
  onReal,
}: {
  document: PrototypeDocument;
  day: string;
  editable: boolean;
  onReceipt: (derivativeId: string, quantity: number) => string | null;
  onReal: (derivativeId: string, quantity: number) => string | null;
}) {
  const sections = useMemo(() => buildSections(document, day), [document, day]);
  const { headRef, categoryStickyStyle } = useStickyTableHead();

  if (sections.length === 0) {
    return (
      <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
        Производных нет. Добавьте производную в рецептурном журнале.
      </p>
    );
  }

  return (
    <div className={tableFrameScrollClassName}>
      <table className={tableClassName}>
        <caption className="sr-only">{`Расход в производстве, ${day}`}</caption>
        <thead ref={headRef} className={stickyHeadClassName}>
          <tr>
            <th className={`sticky left-0 z-40 ${blockCornerClassName} ${tableBorder.rightThick}`} />
            <th scope="colgroup" className={`${blockHeadingClassName} ${tableBorder.rightThick}`}>
              {keepWithNext('Произведено производных')}
            </th>
            <th colSpan={2} scope="colgroup" className={`${blockHeadingClassName} ${tableBorder.rightThick}`}>
              {keepWithNext('Расход в производство')}
            </th>
          </tr>
          <tr>
            <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
              <ColumnLabel label="Производная" />
            </th>
            <th scope="col" className={`${columnHeadingClassName} ${tableBorder.rightThick}`}>
              <ColumnLabel label="Реальный" hint="Сколько производных действительно произвели за этот день" />
            </th>
            <th scope="col" className={valueHead}>
              <ColumnLabel label="Расчёт" hint="Количество по рецепту на выпуск этого дня" />
            </th>
            <th scope="col" className={`${columnHeadingClassName} ${tableBorder.rightThick}`}>
              <ColumnLabel
                label="Реальный"
                hint="Сколько производных действительно списали в производство за этот день"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {sections.map((section) => (
            <SectionBlock
              key={section.key}
              section={section}
              editable={editable}
              categoryStickyStyle={categoryStickyStyle}
              onReceipt={onReceipt}
              onReal={onReal}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionBlock({
  section,
  editable,
  categoryStickyStyle,
  onReceipt,
  onReal,
}: {
  section: ConsumptionSection;
  editable: boolean;
  categoryStickyStyle: CSSProperties | undefined;
  onReceipt: (derivativeId: string, quantity: number) => string | null;
  onReal: (derivativeId: string, quantity: number) => string | null;
}) {
  const [open, setOpen] = useState(true);
  const count = section.rows.length;

  return (
    <>
      <tr>
        <th
          scope="row"
          className={categoryNameRowClassName(editable, { stack: 'belowHead' })}
          style={categoryStickyStyle}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-expanded={open}
              aria-label={open ? `Свернуть ${section.label}` : `Развернуть ${section.label}`}
              title={open ? 'Свернуть' : 'Развернуть'}
              onClick={() => setOpen((current) => !current)}
              className={iconButtonClassName}
            >
              {open ? <IconChevronDown /> : <IconChevronRight />}
            </button>
            <span className={categoryNameClassName}>
              {section.label} ({count})
            </span>
          </div>
        </th>
        <td className={`${bandEnd} ${stickyCategoryCellClassName}`} style={categoryStickyStyle} />
        <td className={`${bandCell} ${stickyCategoryCellClassName}`} style={categoryStickyStyle} />
        <td className={`${bandEnd} ${stickyCategoryCellClassName}`} style={categoryStickyStyle} />
      </tr>
      {open
        ? section.rows.map((row, index) => (
            <DerivativeRow
              key={row.id}
              row={row}
              index={index + 1}
              editable={editable && !row.deleted}
              onReceipt={(quantity) => onReceipt(row.id, quantity)}
              onReal={(quantity) => onReal(row.id, quantity)}
            />
          ))
        : null}
    </>
  );
}

function DerivativeRow({
  row,
  index,
  editable,
  onReceipt,
  onReal,
}: {
  row: ConsumptionLine;
  index: number;
  editable: boolean;
  onReceipt: (quantity: number) => string | null;
  onReal: (quantity: number) => string | null;
}) {
  return (
    <tr>
      <th scope="row" className={entityNameRowClassName('repeated')}>
        <span className="inline-flex w-full items-center gap-2">
          <ProductIndex index={index} />
          <span>
            {row.name}
            {row.deleted ? <span className="text-muted"> (архив)</span> : null}
          </span>
        </span>
      </th>
      <td className={`${valueEnd} ${cellKindClassName[inputKind(editable)]}`}>
        {editable ? (
          <QuantityCell
            label={`Реальный выпуск, ${row.name}`}
            value={row.realReceiptDay}
            unit={row.unit}
            onChange={onReceipt}
          />
        ) : (
          <QuantityRead value={row.realReceiptDay} unit={row.unit} />
        )}
      </td>
      <td className={`${valueCell} ${cellKindClassName.computed}`}>
        <QuantityRead value={row.calculated} unit={row.unit} />
      </td>
      <td className={`${valueEnd} ${cellKindClassName[inputKind(editable)]}`}>
        {editable ? (
          <QuantityCell label={`Реальный расход, ${row.name}`} value={row.realDay} unit={row.unit} onChange={onReal} />
        ) : (
          <QuantityRead value={row.realDay} unit={row.unit} />
        )}
      </td>
    </tr>
  );
}
