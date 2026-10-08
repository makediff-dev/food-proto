import type { Metadata } from 'next';

import { PlanRedirect } from '@/features/sales/PlanRedirect';

export const metadata: Metadata = {
  title: 'Сводка',
};

export default async function PlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PlanRedirect id={decodeURIComponent(id)} />;
}
