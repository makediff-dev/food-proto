import { formatPieces } from '@/features/sales/text';

/** Отклонение остатка от норматива мин/макс: число со знаком − / + или зелёный 0. */
export function NormDeviationCell({
  belowMinPieces,
  aboveMaxPieces,
}: {
  belowMinPieces: number;
  aboveMaxPieces: number;
}) {
  if (belowMinPieces !== 0) {
    return (
      <span className="whitespace-nowrap text-negative" title="Ниже минимума">
        {formatPieces(belowMinPieces)} шт
        <span className="sr-only"> ниже минимума</span>
      </span>
    );
  }

  if (aboveMaxPieces !== 0) {
    return (
      <span className="whitespace-nowrap text-caution" title="Выше максимума">
        +{formatPieces(aboveMaxPieces)} шт
        <span className="sr-only"> выше максимума</span>
      </span>
    );
  }

  return (
    <span className="whitespace-nowrap text-positive" title="В норме">
      0 шт
      <span className="sr-only"> в норме</span>
    </span>
  );
}
