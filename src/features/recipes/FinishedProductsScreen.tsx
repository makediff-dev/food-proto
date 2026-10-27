'use client';

import { useDocumentStore } from '@/data/DocumentProvider';
import { productCompositionLines, productRecipeSections } from '@/domain/products';
import { finishedProductHref, RECIPES_FINISHED_TITLE } from '@/features/recipes/paths';
import { RecipeJournalsScreen } from '@/features/recipes/RecipeJournalsScreen';
import { productPrintModel } from '@/features/recipes/RecipePrint';
import { formatRecipeBatchLabel } from '@/features/recipes/text';

export function FinishedProductsScreen() {
  const store = useDocumentStore();
  const sections = productRecipeSections(store.document).map((section) => ({
    id: section.warehouseId,
    name: section.name,
    items: section.items.map((item) => ({
      id: item.id,
      name: item.name,
      href: finishedProductHref(item.id),
      editAction: true,
      batchLabel: formatRecipeBatchLabel(item.outputKilogramThousandths, item.outputPieceThousandths),
      components: productCompositionLines(store.document, item).map((line) => ({
        id: line.id,
        name: line.name,
        quantity: line.quantity,
        unit: line.unit,
      })),
      printModel: productPrintModel(store.document, item),
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
