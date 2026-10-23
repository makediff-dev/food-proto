'use client';

import type { ReactNode } from 'react';
import type { RecipeListSection } from '@/features/recipes/RecipeJournalsTable';
import { RecipeJournalsTable } from '@/features/recipes/RecipeJournalsTable';
import { PageFrame } from '@/features/shell/PageFrame';

export function RecipeJournalsScreen({
  title,
  sections,
  caption,
  aside,
}: {
  title: string;
  sections: readonly RecipeListSection[];
  caption: string;
  aside?: ReactNode;
}) {
  return (
    <PageFrame title={title} wide aside={aside}>
      <RecipeJournalsTable sections={sections} caption={caption} />
    </PageFrame>
  );
}
