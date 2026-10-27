'use client';

import Link from 'next/link';
import { Fragment, type RefObject, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { formatQuantity } from '@/features/materials/text';
import type { RecipePrintModel } from '@/features/recipes/RecipePrint';
import { IconChevronDown, IconChevronRight, IconPencil, IconPlus, IconPrint, IconTrash } from '@/features/shell/Icons';
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
  /**
   * Выход рецепта: «на X кг» или «на N шт / X кг».
   * Пусто — ячейка без текста (нет заданного выхода).
   */
  batchLabel?: string;
  /** Состав одной строкой «имя количество + …». Без состава правая колонка пустая. */
  components?: readonly RecipeListComponent[];
  /** Открыть запись на своей странице. */
  href?: string;
  /** Карандаш в ячейке названия; без него переход — по клику на строку. */
  editAction?: boolean;
  /** Мусорка: мягкое удаление. Не задавайте, если удаление не предусмотрено. */
  onDelete?: () => void;
  /** Неактивная мусорка и подсказка при наведении. */
  deleteBlockedTitle?: string;
  /** Сохранённый рецепт для иконки «Печать» в строке. */
  printModel?: RecipePrintModel;
};

/** Фиксированная ширина колонки выхода: «на 1 шт / 0,097 кг». */
const BATCH_COLUMN_WIDTH_PX = 148;

export type RecipeListSection = {
  id: string;
  name: string;
  items: readonly RecipeListItem[];
  /** Ссылка «плюс» справа от названия секции. */
  addHref?: string;
};

const frameClassName = 'relative contain-paint overflow-x-hidden border border-line bg-sheet';

const rowActionClassName =
  'inline-flex size-8 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';

const rowActionDisabledClassName = 'disabled:cursor-not-allowed disabled:opacity-40';

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
  onPrint,
}: {
  sections: readonly RecipeListSection[];
  caption: string;
  onPrint?: (model: RecipePrintModel) => void;
}) {
  const measureItems = useMemo(
    () =>
      sections.flatMap((section) =>
        section.items.map((item) => ({
          id: item.id,
          name: item.name,
          nameActionCount: item.editAction ? (item.onDelete || item.deleteBlockedTitle ? 2 : 1) : 0,
        })),
      ),
    [sections],
  );
  const catalogueKey = useMemo(
    () => measureItems.map((item) => `${item.id}:${item.name}:${item.nameActionCount}`).join('|'),
    [measureItems],
  );
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
            {item.nameActionCount > 0 ? (
              <span className="inline-flex shrink-0">
                <span className="size-8 shrink-0" aria-hidden="true" />
                {item.nameActionCount > 1 ? <span className="size-8 shrink-0" aria-hidden="true" /> : null}
              </span>
            ) : null}
          </div>
        ))}
      </div>
      {sections.map((section) => (
        <SectionBlock key={section.id} section={section} nameColumnWidth={nameColumnWidth} onPrint={onPrint} />
      ))}
    </div>
  );
}

function SectionBlock({
  section,
  nameColumnWidth,
  onPrint,
}: {
  section: RecipeListSection;
  nameColumnWidth: number;
  onPrint?: (model: RecipePrintModel) => void;
}) {
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
            <ItemRow key={item.id} item={item} index={index + 1} nameColumnWidth={nameColumnWidth} onPrint={onPrint} />
          ))
        : null}
    </div>
  );
}

function ItemRow({
  item,
  index,
  nameColumnWidth,
  onPrint,
}: {
  item: RecipeListItem;
  index: number;
  nameColumnWidth: number;
  onPrint?: (model: RecipePrintModel) => void;
}) {
  const components = item.components ?? [];
  const hasComponents = components.length > 0;

  const nameCellActions = item.editAction || item.onDelete || item.deleteBlockedTitle;

  const body = (
    <>
      <div
        className={`relative z-10 box-border flex shrink-0 items-center px-3 py-2 ${tableBorder.rightThick} ${cellKindClassName.repeated}`}
        style={nameColumnWidth > 0 ? { width: nameColumnWidth, minWidth: nameColumnWidth } : undefined}
      >
        <span className="inline-flex w-full min-w-0 items-center gap-2 whitespace-nowrap">
          <ProductIndex index={index} />
          <span className="min-w-0 flex-1 text-sm leading-none text-ink">{item.name}</span>
          {nameCellActions ? (
            <span className="ml-auto inline-flex shrink-0 items-center">
              {item.editAction && item.href ? (
                <Link
                  href={item.href}
                  aria-label={`Изменить ${item.name}`}
                  title="Изменить"
                  className={rowActionClassName}
                >
                  <IconPencil />
                </Link>
              ) : null}
              {item.onDelete || item.deleteBlockedTitle ? (
                <DeleteAction name={item.name} blockedTitle={item.deleteBlockedTitle} onDelete={item.onDelete} />
              ) : null}
            </span>
          ) : null}
        </span>
      </div>
      <div
        className={`box-border flex shrink-0 items-center whitespace-nowrap px-2 py-2 text-sm leading-none text-ink ${tableBorder.rightThick} ${cellKindClassName.repeated}`}
        style={{ width: BATCH_COLUMN_WIDTH_PX, minWidth: BATCH_COLUMN_WIDTH_PX }}
      >
        {item.batchLabel ?? ''}
      </div>
      <div className="min-w-0 flex-1 overflow-hidden">
        {hasComponents ? <CompositionLine components={components} /> : null}
      </div>
    </>
  );

  const rowClassName = `flex min-w-0 items-stretch border-b border-b-line ${cellKindClassName.repeated}`;
  const printButton =
    item.printModel && onPrint ? (
      <button
        type="button"
        aria-label={`Печать рецептуры ${item.name}`}
        title="Печать"
        onClick={() => {
          if (item.printModel) {
            onPrint(item.printModel);
          }
        }}
        className="mr-1 inline-flex size-8 shrink-0 items-center justify-center self-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        <IconPrint />
      </button>
    ) : null;

  if (item.href && !item.editAction) {
    return (
      <div className={rowClassName}>
        <Link
          href={item.href}
          className="flex min-w-0 flex-1 outline-none hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          {body}
        </Link>
        {printButton}
      </div>
    );
  }

  return (
    <div className={rowClassName}>
      <div className="flex min-w-0 flex-1">{body}</div>
      {printButton}
    </div>
  );
}

function DeleteAction({
  name,
  blockedTitle,
  onDelete,
}: {
  name: string;
  blockedTitle?: string;
  onDelete?: () => void;
}) {
  const disabled = Boolean(blockedTitle);

  const button = (
    <button
      type="button"
      aria-label={`Удалить ${name}`}
      title={disabled ? undefined : 'Удалить'}
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          onDelete?.();
        }
      }}
      className={`${rowActionClassName} ${rowActionDisabledClassName}`}
    >
      <IconTrash />
    </button>
  );

  if (disabled && blockedTitle) {
    return (
      <span className="inline-flex" title={blockedTitle}>
        {button}
      </span>
    );
  }

  return button;
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
