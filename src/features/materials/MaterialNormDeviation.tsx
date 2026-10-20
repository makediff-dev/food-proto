import { formatQuantity } from '@/features/materials/text';

/** Отклонение остатка склада от мин/макс. Ниже минимума — красным, выше максимума — жёлтым. */
export function MaterialNormDeviation({
  belowMinQuantity,
  aboveMaxQuantity,
  unit,
}: {
  belowMinQuantity: number | null;
  aboveMaxQuantity: number | null;
  unit?: string;
}) {
  if (belowMinQuantity === null || aboveMaxQuantity === null) {
    return <span className="text-muted">—</span>;
  }

  if (belowMinQuantity !== 0) {
    return (
      <span className="whitespace-nowrap text-negative" title="Ниже минимума">
        {formatQuantity(belowMinQuantity, unit)}
        <span className="sr-only"> ниже минимума</span>
      </span>
    );
  }

  if (aboveMaxQuantity !== 0) {
    return (
      <span className="whitespace-nowrap text-caution" title="Выше максимума">
        +{formatQuantity(aboveMaxQuantity, unit)}
        <span className="sr-only"> выше максимума</span>
      </span>
    );
  }

  return (
    <span className="whitespace-nowrap text-positive" title="В норме">
      0{unit ? ` ${unit}` : ''}
      <span className="sr-only"> в норме</span>
    </span>
  );
}
