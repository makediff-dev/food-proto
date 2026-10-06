import type { ReactNode } from 'react';

export function tableNumberClassName(value: number): string {
  return value < 0 ? 'whitespace-nowrap text-negative' : 'whitespace-nowrap';
}

export function TableNumber({
  value,
  children,
}: {
  value: number;
  children: ReactNode;
}) {
  return <span className={tableNumberClassName(value)}>{children}</span>;
}
