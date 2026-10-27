import { formatQuantity } from '@/features/materials/text';
import { formatRecipeWeightGap } from '@/features/recipes/text';

/** Вес закладки («рассчитан на») и вес по компонентам с пояснением разницы. */
export function RecipeWeightCompare({
  batchKilogramThousandths,
  componentsKilogramThousandths,
}: {
  batchKilogramThousandths: number | null;
  componentsKilogramThousandths: number;
}) {
  const gap = formatRecipeWeightGap(batchKilogramThousandths, componentsKilogramThousandths);
  const batchLabel = batchKilogramThousandths === null ? '—' : formatQuantity(batchKilogramThousandths, 'кг');

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-sm text-muted">Вес закладки</p>
        <p className="mt-2 text-base text-ink">{batchLabel}</p>
      </div>
      <div>
        <p className="text-sm text-muted">Вес по компонентам</p>
        <p className="mt-2 text-base text-ink">{formatQuantity(componentsKilogramThousandths, 'кг')}</p>
      </div>
      {gap ? <p className="text-sm text-ink">{gap}</p> : null}
    </div>
  );
}
