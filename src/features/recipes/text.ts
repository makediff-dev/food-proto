import type { DerivativeAddRejection } from '@/domain/derivatives';
import type { ProductRecipeRejection } from '@/domain/products';

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
};

export const PRODUCT_RECIPE_ERROR: Record<ProductRecipeRejection, string> = {
  missing: 'Товар не найден.',
  quantity: 'Укажите количество.',
  component: 'В состав можно брать только сырьё и производные этого склада.',
  warehouse: 'У товара не указан склад.',
};
