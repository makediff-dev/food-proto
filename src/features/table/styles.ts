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
