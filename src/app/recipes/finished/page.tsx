import type { Metadata } from 'next';

import { FINISHED_SECTIONS } from '@/features/recipes/mock-sections';
import { RECIPES_FINISHED_TITLE } from '@/features/recipes/paths';
import { RecipeJournalsScreen } from '@/features/recipes/RecipeJournalsScreen';

export const metadata: Metadata = {
  title: RECIPES_FINISHED_TITLE,
};

export default function RecipeFinishedPage() {
  return (
    <RecipeJournalsScreen
      title={RECIPES_FINISHED_TITLE}
      sections={FINISHED_SECTIONS}
      caption="Готовая продукция завода"
    />
  );
}
