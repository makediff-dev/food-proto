import type { Metadata } from 'next';

import { DerivativesScreen } from '@/features/recipes/DerivativesScreen';
import { RECIPES_DERIVATIVES_TITLE } from '@/features/recipes/paths';

export const metadata: Metadata = {
  title: RECIPES_DERIVATIVES_TITLE,
};

export default function RecipeDerivativesPage() {
  return <DerivativesScreen />;
}
