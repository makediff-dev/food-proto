'use client';

import { useDocumentStore } from '@/data/DocumentProvider';
import { productCompositionLines, productRecipeSections } from '@/domain/products';
import { finishedProductHref, RECIPES_FINISHED_TITLE } from '@/features/recipes/paths';
import { RecipeJournalsScreen } from '@/features/recipes/RecipeJournalsScreen';

export function FinishedProductsScreen() {
  const store = useDocumentStore();
  const sections = productRecipeSections(store.document).map((section) => ({
    id: section.warehouseId,
    name: section.name,
    items: section.items.map((item) => ({
      id: item.id,
      name: item.name,
      href: finishedProductHref(item.id),
      components: productCompositionLines(store.document, item).map((line) => ({
        id: line.id,
        name: line.name,
        quantity: line.quantity,
        unit: line.unit,
      })),
    })),
  }));

  return (
    <RecipeJournalsScreen
      title={RECIPES_FINISHED_TITLE}
      sections={sections}
      caption="Готовая продукция по заводам. Товар заводят во «Вводе плана» продаж; здесь правят только рецепт."
    />
  );
}
