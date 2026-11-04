'use client';

import {
  type RecipeCostDetailExtraUnitRow,
  type RecipeCostDetailLine,
  RecipeCostDetailTable,
  type RecipeCostDetailUnitCost,
} from '@/features/recipes/RecipeCostDetailTable';

/** Состав себестоимости под раскрытой строкой свода. */
export function RecipeCostExpandedDetail({
  name,
  lines,
  unitCost,
  extraUnitRows = [],
}: {
  name: string;
  lines: readonly RecipeCostDetailLine[];
  unitCost: RecipeCostDetailUnitCost;
  extraUnitRows?: readonly RecipeCostDetailExtraUnitRow[];
}) {
  if (lines.length === 0) {
    return (
      <p className="px-3 py-3 text-sm leading-6 text-muted">
        В рецепте нет ингредиентов с ненулевым вкладом в стоимость.
      </p>
    );
  }

  return (
    <RecipeCostDetailTable
      embedded
      caption={`Вклад ингредиентов в себестоимость ${name}`}
      lines={lines}
      unitCost={unitCost}
      extraUnitRows={extraUnitRows}
    />
  );
}
