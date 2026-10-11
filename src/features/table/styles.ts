export const tableBorder = {
  rightThin: 'border-r border-r-line',
  rightThick: 'border-r-[1.5px] border-r-muted',
  bottomThin: 'border-b border-b-line',
  topThick: 'border-t-[1.5px] border-t-muted',
  bottomThick: 'border-b-[3px] border-b-muted',
} as const;

/** Фон ячейки, которую можно править. */
export const editableCellClassName = 'bg-[#e4e4e0]';

/** Прозрачное поле внутри числовой ячейки сетки (цвет текста задаёт вызывающий). */
export const gridFieldClassName =
  'w-full min-w-0 cursor-text appearance-none border-0 bg-transparent p-0 text-right text-sm shadow-none outline-none';

/** Поле имени товара/категории в первой колонке. */
export const gridNameClassName =
  'absolute inset-0 w-full cursor-text appearance-none border-0 bg-transparent p-0 text-left text-sm leading-8 text-ink shadow-none outline-none';

export const tableFrameClassName = 'contain-paint overflow-x-auto border border-line bg-sheet';

export const tableFrameExpandedClassName = 'h-dvh contain-paint overflow-auto bg-sheet';

export const tableClassName = 'w-max min-w-full border-separate border-spacing-0 text-sm';

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

/** «Всего»: жирная подпись, толстая черта сверху и снизу, без заливки. */
export const totalNameClassName =
  'w-px max-w-max whitespace-nowrap border-y-[3px] border-y-muted border-r-[1.5px] border-r-muted bg-sheet px-3 py-2 text-left align-middle text-sm font-bold text-ink';

export const totalValueClassName =
  'w-px border-y-[3px] border-y-muted bg-sheet px-1.5 py-2 text-right align-middle text-sm font-bold';

/** Тонкая линия между столбцами. У крайней колонки её закрывает рамка таблицы. */
export const columnDividerClassName = `${tableBorder.rightThin} last:border-r-0`;
