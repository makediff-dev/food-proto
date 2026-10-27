import type { DerivativeAddRejection } from '@/domain/derivatives';
import type { ProductRecipeRejection } from '@/domain/products';
import { RECIPE_YIELD_TOLERANCE_THOUSANDTHS } from '@/domain/recipe-yield';
import { formatQuantity } from '@/features/materials/text';

export const DERIVATIVE_ADD_ERROR: Record<DerivativeAddRejection, string> = {
  empty: 'Укажите название.',
  'too-long': 'Слишком длинное название.',
  duplicate: 'Такое название уже есть на этом складе.',
  missing: 'Производная не найдена.',
  workshop: 'Выберите цех.',
  unit: 'Выберите единицу.',
  lines: 'Добавьте хотя бы одну позицию в состав.',
  quantity: 'Укажите количество.',
  component: 'Состав можно брать только со склада этого цеха.',
  warehouse: 'Выберите склад.',
  output: 'Укажите, на сколько кг рассчитан рецепт.',
  yield: 'Вес закладки и вес по компонентам не сходятся больше чем на 1 г.',
  pieces: 'Укажите число штук.',
  'heat-treatment-yield': 'Укажите выход после термообработки целым процентом больше нуля.',
};

export const PRODUCT_RECIPE_ERROR: Record<ProductRecipeRejection, string> = {
  missing: 'Товар не найден.',
  quantity: 'Укажите количество.',
  component: 'В состав можно брать только сырьё и производные этого склада.',
  warehouse: 'У товара не указан склад.',
  output: 'Укажите, на сколько кг рассчитан рецепт.',
  yield: 'Вес закладки и вес по компонентам не сходятся больше чем на 1 г.',
  pieces: 'Укажите число штук.',
};

/**
 * Колонка выхода. Штуки заданы — «на 1000 шт / 97 кг», иначе «на X кг».
 */
export function formatRecipeBatchLabel(
  outputKilogramThousandths: number,
  pieceThousandths: number | null = null,
): string {
  const kilograms = outputKilogramThousandths > 0 ? formatQuantity(outputKilogramThousandths, 'кг') : '';
  if (pieceThousandths !== null && pieceThousandths > 0 && kilograms) {
    return `на ${formatQuantity(pieceThousandths, 'шт')} / ${kilograms}`;
  }
  return kilograms ? `на ${kilograms}` : '';
}

/**
 * Разница «по компонентам − вес закладки» вне допуска 1 г:
 * «−13 кг не хватает» / «+13 кг лишнее». Нет числа закладки — без подписи.
 */
export function formatRecipeWeightGap(
  batchKilogramThousandths: number | null,
  componentsKilogramThousandths: number,
): string | null {
  if (batchKilogramThousandths === null) {
    return null;
  }
  const gap = componentsKilogramThousandths - batchKilogramThousandths;
  if (Math.abs(gap) <= RECIPE_YIELD_TOLERANCE_THOUSANDTHS) {
    return null;
  }
  const amount = formatQuantity(Math.abs(gap), 'кг');
  return gap < 0 ? `−${amount} не хватает` : `+${amount} лишнее`;
}
