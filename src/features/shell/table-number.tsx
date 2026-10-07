import type { ReactNode } from 'react';

export type VarianceSense = 'income' | 'cost';

export function tableNumberClassName(
  value: number,
  signed = false,
  sense: VarianceSense = 'income',
): string {
  if (!signed || value === 0) {
    return 'whitespace-nowrap';
  }

  const favorable = sense === 'cost' ? value < 0 : value > 0;
  return favorable
    ? 'whitespace-nowrap text-positive'
    : 'whitespace-nowrap text-negative';
}

export function TableNumber({
  value,
  signed = false,
  sense = 'income',
  children,
}: {
  value: number;
  signed?: boolean;
  sense?: VarianceSense;
  children: ReactNode;
}) {
  return (
    <span className={tableNumberClassName(value, signed, sense)}>
      {children}
    </span>
  );
}
