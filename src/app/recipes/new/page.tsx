import type { Metadata } from 'next';

import { DerivativeCreateScreen } from '@/features/recipes/DerivativeCreateScreen';
import { NEW_DERIVATIVE_TITLE } from '@/features/recipes/paths';

export const metadata: Metadata = {
  title: NEW_DERIVATIVE_TITLE,
};

export default async function NewDerivativePage({ searchParams }: { searchParams: Promise<{ workshop?: string }> }) {
  const params = await searchParams;
  return <DerivativeCreateScreen workshopQuery={params.workshop ?? ''} />;
}
