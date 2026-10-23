import type { Metadata } from 'next';

import { FinishedProductsScreen } from '@/features/recipes/FinishedProductsScreen';
import { RECIPES_FINISHED_TITLE } from '@/features/recipes/paths';

export const metadata: Metadata = {
  title: RECIPES_FINISHED_TITLE,
};

export default function RecipeFinishedPage() {
  return <FinishedProductsScreen />;
}
