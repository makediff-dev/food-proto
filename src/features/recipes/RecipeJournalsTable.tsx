'use client';

import Link from 'next/link';
import { Fragment, type RefObject, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { formatQuantity } from '@/features/materials/text';
import { IconChevronDown, IconChevronRight, IconPlus } from '@/features/shell/Icons';
import { categoryBandClassName, cellKindClassName, ProductIndex, tableBorder } from '@/features/table';

export type RecipeListComponent = {
  id: string;
  name: string;
  /** Тысячные доли; на экране через `formatQuantity`. */
  quantity: number;
  unit: string;
};

export type RecipeListItem = {
  id: string;
  name: string;
  /** Состав одной строкой «имя количество + …». Без состава правая колонка пустая. */
  components?: readonly RecipeListComponent[];
  /** Открыть запись на своей странице. */
  href?: string;
};

export type RecipeListSection = {
  id: string;
  name: string;
  items: readonly RecipeListItem[];
  /** Ссылка «плюс» справа от названия секции. */
  addHref?: string;
};

const frameClassName = 'relative contain-paint overflow-x-hidden border border-line bg-sheet';

function componentLabel(component: RecipeListComponent): string {
  return `${component.name} ${formatQuantity(component.quantity, component.unit)}`;
}

function useNameColumnWidth(catalogueKey: string): {
  measureRef: RefObject<HTMLDivElement | null>;
  width: number;
} {
  const measureRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: catalogueKey triggers remeasure after name DOM updates
  useLayoutEffect(() => {
    const root = measureRef.current;
    if (!root) {
      return;
    }
    let max = 0;
    for (const child of root.children) {
      max = Math.max(max, (child as HTMLElement).offsetWidth);
    }
    setWidth(max);
  }, [catalogueKey]);

  return { measureRef, width };
}

export function RecipeJournalsTable({
  sections,
  caption,
}: {
  sections: readonly RecipeListSection[];
  caption: string;
}) {
  const measureItems = useMemo(
    () => sections.flatMap((section) => section.items.map((item) => ({ id: item.id, name: item.name }))),
    [sections],
  );
  const catalogueKey = useMemo(() => measureItems.map((item) => `${item.id}:${item.name}`).join('|'), [measureItems]);
  const { measureRef, width: nameColumnWidth } = useNameColumnWidth(catalogueKey);

  return (
    <div className={frameClassName}>
      <p className="sr-only">{caption}</p>
      <div
        ref={measureRef}
        className="pointer-events-none absolute top-0 -left-[9999px] flex flex-col"
        aria-hidden="true"
      >
        {measureItems.map((item) => (
          <div key={item.id} className="flex items-center gap-2 whitespace-nowrap px-3 py-2">
            <ProductIndex index={1} />
            <span className="text-sm leading-none">{item.name}</span>
          </div>
        ))}
      </div>
      {sections.map((section) => (
        <SectionBlock key={section.id} section={section} nameColumnWidth={nameColumnWidth} />
      ))}
    </div>
  );
}

function SectionBlock({ section, nameColumnWidth }: { section: RecipeListSection; nameColumnWidth: number }) {
  const [open, setOpen] = useState(true);
  const itemCount = section.items.length;

  return (
    <div>
      <div className={`flex min-w-0 items-center gap-2 border-b border-b-line px-3 py-2 ${categoryBandClassName}`}>
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? `Свернуть товары раздела ${section.name}` : `Развернуть товары раздела ${section.name}`}
          title={open ? 'Свернуть' : 'Развернуть'}
          onClick={() => setOpen((current) => !current)}
          className="inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          {open ? <IconChevronDown /> : <IconChevronRight />}
        </button>
        <span className="min-w-0 text-sm font-normal uppercase leading-snug text-ink">
          {section.name} ({itemCount})
        </span>
        {section.addHref ? (
          <Link
            href={section.addHref}
            aria-label={`Добавить производную в ${section.name}`}
            title="Добавить производную"
            className="inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <IconPlus />
          </Link>
        ) : null}
      </div>
      {open
        ? section.items.map((item, index) => (
            <ItemRow key={item.id} item={item} index={index + 1} nameColumnWidth={nameColumnWidth} />
          ))
        : null}
    </div>
  );
}

function ItemRow({ item, index, nameColumnWidth }: { item: RecipeListItem; index: number; nameColumnWidth: number }) {
  const components = item.components ?? [];
  const hasComponents = components.length > 0;

  const body = (
    <>
      <div
        className={`relative z-10 box-border flex shrink-0 items-center gap-2 whitespace-nowrap px-3 py-2 ${tableBorder.rightThick} ${cellKindClassName.repeated}`}
        style={nameColumnWidth > 0 ? { width: nameColumnWidth, minWidth: nameColumnWidth } : undefined}
      >
        <ProductIndex index={index} />
        <span className="text-sm leading-none text-ink">{item.name}</span>
      </div>
      <div className="min-w-0 flex-1 overflow-hidden">
        {hasComponents ? <CompositionLine components={components} /> : null}
      </div>
    </>
  );

  const rowClassName = `flex min-w-0 border-b border-b-line ${cellKindClassName.repeated}`;

  if (item.href) {
    return (
      <Link
        href={item.href}
        className={`${rowClassName} outline-none hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
      >
        {body}
      </Link>
    );
  }

  return <div className={rowClassName}>{body}</div>;
}

/**
 * Состав в оставшейся ширине. Перенос только перед следующей составляющей:
 * «+» в конце верхней строки и «+ …» в начале нижней (на одной строке плюсы сливаются в один).
 */
function CompositionLine({ components }: { components: readonly RecipeListComponent[] }) {
  return (
    <div
      className={`flex min-w-0 w-full flex-wrap items-baseline py-2 pr-1.5 pl-[calc(0.375rem+1ch)] text-sm leading-5 text-ink ${cellKindClassName.repeated}`}
    >
      {components.map((component, index) => {
        const label = componentLabel(component);
        if (index === 0) {
          return (
            <span key={component.id} className="shrink-0 whitespace-nowrap">
              {label}
            </span>
          );
        }

        return (
          <Fragment key={component.id}>
            <span className="shrink-0 font-semibold text-ink" aria-hidden="true">
              {'\u00A0+'}
            </span>
            <span className="shrink-0 whitespace-nowrap">
              <span className="composition-join-start font-semibold text-ink" aria-hidden="true">
                {'+\u00A0'}
              </span>
              {label}
            </span>
          </Fragment>
        );
      })}
    </div>
  );
}
