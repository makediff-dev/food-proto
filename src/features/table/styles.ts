export const tableBorder = {
  rightThin: 'border-r border-r-line',
  rightThick: 'border-r-[1.5px] border-r-muted',
  bottomThin: 'border-b border-b-line',
  topThick: 'border-t-[1.5px] border-t-muted',
  bottomThick: 'border-b-[3px] border-b-muted',
} as const;

/**
 * Три типа ячеек сетки. Цвета — `--cell-assigned`, `--cell-computed`, `--cell-repeated` в `globals.css`.
 * assigned — вводят на этом экране; computed — формула; repeated — значение из другой таблицы.
 */
export type CellKind = 'assigned' | 'computed' | 'repeated';

export const cellKindClassName: Record<CellKind, string> = {
  assigned: 'cell-assigned',
  computed: 'cell-computed',
  repeated: 'cell-repeated',
};

/** Колонка названия: assigned — справочник правят на этом экране; repeated — из другой таблицы. */
export type NameCellKind = 'assigned' | 'repeated';

export function nameCellKind(editable: boolean): NameCellKind {
  return editable ? 'assigned' : 'repeated';
}

const entityNameRowBaseClassName =
  'z-10 w-px max-w-max whitespace-nowrap border-r-[1.5px] border-r-muted px-3 py-2 text-left align-middle font-normal text-ink';

type EntityNameRowOptions = {
  variant?: 'default' | 'dayFact';
  bottomBorder?: string;
};

function entityNameRowClassNameInternal(kind: NameCellKind, options?: EntityNameRowOptions): string {
  const sticky = options?.variant === 'dayFact' ? 'sticky left-10' : 'sticky left-0';
  const bottom = options?.bottomBorder ?? 'border-b border-b-line';
  return `${sticky} ${entityNameRowBaseClassName} ${bottom} ${cellKindClassName[kind]}`;
}

/** Sticky-ячейка названия товара, категории или сырья в обычной сетке. */
export function entityNameRowClassName(kind: NameCellKind, options?: Omit<EntityNameRowOptions, 'variant'>): string {
  return entityNameRowClassNameInternal(kind, options);
}

/** То же в подневной сетке со столбцом даты (sticky left-10). */
export function entityNameRowDayFactClassName(
  kind: NameCellKind,
  options?: Omit<EntityNameRowOptions, 'variant'>,
): string {
  return entityNameRowClassNameInternal(kind, { ...options, variant: 'dayFact' });
}

function categoryNameRowClassNameInternal(editable: boolean, options?: EntityNameRowOptions): string {
  const sticky = options?.variant === 'dayFact' ? 'sticky left-10' : 'sticky left-0';
  const bottom = options?.bottomBorder ?? 'border-b border-b-line';
  const fill = editable ? cellKindClassName.assigned : categoryBandClassName;
  return `${sticky} ${entityNameRowBaseClassName} ${bottom} ${fill}`;
}

/** Название категории: band, пока не редактируют справочник на этом экране. */
export function categoryNameRowClassName(editable: boolean, options?: Omit<EntityNameRowOptions, 'variant'>): string {
  return categoryNameRowClassNameInternal(editable, options);
}

export function categoryNameRowDayFactClassName(
  editable: boolean,
  options?: Omit<EntityNameRowOptions, 'variant'>,
): string {
  return categoryNameRowClassNameInternal(editable, { ...options, variant: 'dayFact' });
}

/** Прозрачное поле внутри числовой ячейки сетки (цвет текста задаёт вызывающий). */
export const gridFieldClassName =
  'w-full min-w-0 cursor-text appearance-none border-0 bg-transparent p-0 text-right text-sm shadow-none outline-none';

/** Поле имени товара/категории в первой колонке. */
export const gridNameClassName =
  'absolute inset-0 w-full cursor-text appearance-none border-0 bg-transparent p-0 text-left text-sm leading-8 text-ink shadow-none outline-none';

export const tableFrameClassName = 'contain-paint overflow-x-auto border border-line bg-sheet';

export const tableFrameExpandedClassName = 'h-dvh contain-paint overflow-auto bg-sheet';

export const tableClassName = 'w-max min-w-full border-separate border-spacing-0 text-sm';

/**
 * Подневные сетки: min-w-full заполняет узкий экран.
 * Лишнюю ширину забирает колонка-распорка (dayFactSpacer*), иначе колонка даты
 * растягивается и ломает sticky left-10 у названия товара.
 */
export const dayFactTableClassName = 'w-max min-w-full border-separate border-spacing-0 text-sm';

/** Колонка номера дня: как на /sales (2.5rem), совпадает с left-10. */
export const dayDateColumnClassName = 'w-10 min-w-10 max-w-10';

/** Пустая колонка: забирает свободную ширину при min-w-full. */
export const dayFactSpacerHeadClassName = 'w-full min-w-0 border-y-[3px] border-y-muted bg-paper p-0';

export const dayFactSpacerCellClassName = 'w-full min-w-0 border-b border-b-line bg-sheet p-0';

export const dayFactSpacerBandClassName = 'w-full min-w-0 border-b border-b-line bg-band p-0';

export const dayFactSpacerTotalClassName = 'w-full min-w-0 border-y-[3px] border-y-muted bg-sheet p-0';

export const stickyHeadClassName = 'sticky top-0 z-30';

/** Строка категории: темнее клетки ввода. */
export const categoryBandClassName = 'bg-band';

export const categoryNameClassName =
  'flex h-8 min-w-max items-center text-sm font-normal uppercase leading-none text-ink';

/** Заголовок блока («Плановые показатели» и соседние). */
export const blockHeadingClassName =
  'border-b-[3px] border-b-muted bg-paper px-3 py-2 text-center align-middle text-base font-normal uppercase text-ink';

/** Пустой угол над колонкой названия — та же нижняя черта, что у заголовка блока. */
export const blockCornerClassName = 'border-b-[3px] border-b-muted bg-paper';

/** Заголовок колонки: чёрный текст, толстая черта сверху и снизу. */
export const columnHeadingClassName =
  'w-px whitespace-normal border-y-[3px] border-y-muted bg-paper px-1.5 py-2 text-center align-middle text-sm font-normal leading-5 text-ink';

export const nameHeadingClassName =
  'w-px max-w-max whitespace-nowrap border-y-[3px] border-y-muted border-r-[1.5px] border-r-muted bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-ink';

/** «Всего»: как строка категории — band и жирная подпись, толстая черта сверху и снизу. */
export const totalNameClassName =
  'w-px max-w-max whitespace-nowrap border-y-[3px] border-y-muted border-r-[1.5px] border-r-muted bg-band px-3 py-2 text-left align-middle text-sm font-bold text-ink';

export const totalValueClassName =
  'w-px border-y-[3px] border-y-muted bg-band px-1.5 py-2 text-right align-middle text-sm font-bold';

/** Тонкая линия между столбцами. У крайней колонки её закрывает рамка таблицы. */
export const columnDividerClassName = `${tableBorder.rightThin} last:border-r-0`;
