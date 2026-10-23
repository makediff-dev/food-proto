import type { Metadata } from 'next';

import { DERIVATIVE_SECTIONS } from '@/features/recipes/mock-sections';
import { RECIPES_DERIVATIVES_TITLE } from '@/features/recipes/paths';
import { RecipeJournalsScreen } from '@/features/recipes/RecipeJournalsScreen';

export const metadata: Metadata = {
  title: RECIPES_DERIVATIVES_TITLE,
};

export default function RecipeDerivativesPage() {
  return (
    <RecipeJournalsScreen
      title={RECIPES_DERIVATIVES_TITLE}
      sections={DERIVATIVE_SECTIONS}
      caption="Производные по цехам"
    />
  );
}
