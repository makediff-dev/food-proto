'use client';

import { type ReactNode, useState } from 'react';
import { flushSync } from 'react-dom';
import type { RecipeListSection } from '@/features/recipes/RecipeJournalsTable';
import { RecipeJournalsTable } from '@/features/recipes/RecipeJournalsTable';
import type { RecipePrintModel } from '@/features/recipes/RecipePrint';
import { RecipePrintSheet } from '@/features/recipes/RecipePrint';
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
  const [printModel, setPrintModel] = useState<RecipePrintModel | null>(null);

  function printRecipe(model: RecipePrintModel) {
    flushSync(() => setPrintModel(model));
    window.print();
  }

  return (
    <>
      <div className="screen-only">
        <PageFrame title={title} wide aside={aside}>
          <RecipeJournalsTable sections={sections} caption={caption} onPrint={printRecipe} />
        </PageFrame>
      </div>
      {printModel ? <RecipePrintSheet model={printModel} /> : null}
    </>
  );
}
