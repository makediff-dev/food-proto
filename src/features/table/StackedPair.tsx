import type { ReactNode } from 'react';

import { editableCellClassName } from '@/features/table/styles';

/** Две строки в ячейке: подпись сверху и снизу (обычно «с НДС» / «без НДС»). */
export function StackedPair({
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
        <span className="text-[0.5rem] leading-none text-muted">{topLabel}</span>
        {top}
      </div>
      <div
        data-editable-field=""
        className={`flex flex-col items-end px-1.5 py-1 ${bottomHighlighted ? editableCellClassName : ''}`}
      >
        <span className="text-[0.5rem] leading-none text-muted">{bottomLabel}</span>
        {bottom}
      </div>
    </div>
  );
}

/** Одна величина на высоту двухэтажной ячейки (штуки и т.п.). */
export function MergedTwoStory({ highlighted = false, children }: { highlighted?: boolean; children: ReactNode }) {
  return (
    <div
      className={`flex h-full min-w-18 flex-col items-end justify-center px-1.5 py-1 ${
        highlighted ? editableCellClassName : ''
      }`}
    >
      {children}
    </div>
  );
}
