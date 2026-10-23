import type { RecipeListSection } from '@/features/recipes/RecipeJournalsTable';

export const FINISHED_SECTIONS: readonly RecipeListSection[] = [
  {
    id: 'final-1',
    name: 'Готовая продукция завода 1',
    items: [
      { id: 'final-1-a', name: 'Салат Цезарь', quantity: 24, unit: 'шт' },
      { id: 'final-1-b', name: 'Суп куриный', quantity: 36, unit: 'шт' },
      { id: 'final-1-c', name: 'Рис отварной', quantity: 4.2, unit: 'кг' },
    ],
  },
  {
    id: 'final-2',
    name: 'Готовая продукция завода 2',
    items: [],
  },
];
