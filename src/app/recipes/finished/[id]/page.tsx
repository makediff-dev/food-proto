import type { Metadata } from 'next';

import { FinishedProductEditScreen } from '@/features/recipes/FinishedProductEditScreen';
import { RECIPES_FINISHED_TITLE } from '@/features/recipes/paths';

export const metadata: Metadata = {
  title: RECIPES_FINISHED_TITLE,
};

export default async function FinishedProductRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FinishedProductEditScreen productId={decodeURIComponent(id)} />;
}
