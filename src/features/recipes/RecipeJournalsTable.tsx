'use client';

import { useState } from 'react';

import type { RecipeItem, RecipeSection } from '@/features/recipes/mock-sections';
import { IconChevronDown, IconChevronRight } from '@/features/shell/Icons';
import {
  categoryBandClassName,
  categoryNameClassName,
  categoryNameRowClassName,
  cellKindClassName,
  columnDividerClassName,
  entityNameRowClassName,
  ProductIndex,
  TableNumber,
  tableClassName,
  tableFrameClassName,
} from '@/features/table';

function formatQuantityValue(quantity: number): string {
  return Number.isInteger(quantity) ? String(quantity) : quantity.toLocaleString('ru-RU', { maximumFractionDigits: 2 });
}

export function RecipeJournalsTable({ sections, caption }: { sections: readonly RecipeSection[]; caption: string }) {
  return (
    <div className={tableFrameClassName}>
      <table className={tableClassName}>
        <caption className="sr-only">{caption}</caption>
        <tbody>
          {sections.map((section) => (
            <SectionBlock key={section.id} section={section} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionBlock({ section }: { section: RecipeSection }) {
  const [open, setOpen] = useState(true);
  const itemCount = section.items.length;

  return (
    <>
      <tr>
        <th scope="row" className={categoryNameRowClassName(false)}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-expanded={open}
              aria-label={
                open ? `Свернуть товары раздела ${section.name}` : `Развернуть товары раздела ${section.name}`
              }
              title={open ? 'Свернуть' : 'Развернуть'}
              onClick={() => setOpen((current) => !current)}
              className="inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {open ? <IconChevronDown /> : <IconChevronRight />}
            </button>
            <span className={categoryNameClassName}>
              {section.name} ({itemCount})
            </span>
          </div>
        </th>
        <td
          className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle ${categoryBandClassName} ${columnDividerClassName}`}
        />
      </tr>
      {open ? section.items.map((item, index) => <ItemRow key={item.id} item={item} index={index + 1} />) : null}
    </>
  );
}

function ItemRow({ item, index }: { item: RecipeItem; index: number }) {
  return (
    <tr>
      <th scope="row" className={entityNameRowClassName('repeated')}>
        <div className="flex items-center gap-2">
          <ProductIndex index={index} />
          <span className="min-w-max text-sm leading-none text-ink">{item.name}</span>
        </div>
      </th>
      <td
        className={`h-px w-px border-b border-b-line p-0 text-right align-middle ${columnDividerClassName} ${cellKindClassName.repeated}`}
      >
        <div className="flex min-w-18 flex-col">
          <div
            className={`flex h-8 items-center justify-end border-b border-line px-1.5 text-sm leading-none text-ink ${cellKindClassName.repeated}`}
          >
            {item.name}
          </div>
          <div className={`flex h-8 items-center justify-end px-1.5 ${cellKindClassName.repeated}`}>
            <TableNumber value={item.quantity}>
              {formatQuantityValue(item.quantity)} {item.unit}
            </TableNumber>
          </div>
        </div>
      </td>
    </tr>
  );
}
