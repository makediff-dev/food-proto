/** Порядковый номер товара внутри категории. В документ не пишется. */
export function ProductIndex({ index }: { index: number }) {
  return <span className="w-5 shrink-0 text-right text-sm tabular-nums text-muted">{index}</span>;
}
