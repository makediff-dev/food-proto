'use client';

import type { RecipeSection } from '@/features/recipes/mock-sections';
import { RecipeJournalsTable } from '@/features/recipes/RecipeJournalsTable';
import { PageFrame } from '@/features/shell/PageFrame';

export function RecipeJournalsScreen({
  title,
  sections,
  caption,
}: {
  title: string;
  sections: readonly RecipeSection[];
  caption: string;
}) {
  return (
    <PageFrame title={title} wide>
      <RecipeJournalsTable sections={sections} caption={caption} />
    </PageFrame>
  );
}
