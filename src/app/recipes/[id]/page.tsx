import type { Metadata } from 'next';

import { DerivativeEditScreen } from '@/features/recipes/DerivativeCreateScreen';
import { RECIPES_DERIVATIVES_TITLE } from '@/features/recipes/paths';

export const metadata: Metadata = {
  title: RECIPES_DERIVATIVES_TITLE,
};

export default async function DerivativePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DerivativeEditScreen derivativeId={decodeURIComponent(id)} />;
}
