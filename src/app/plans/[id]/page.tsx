import type { Metadata } from 'next';

import { PlanRedirect } from '@/features/sales/PlanRedirect';
import { SUMMARY_SECTION_TITLE } from '@/features/sales/paths';

export const metadata: Metadata = {
  title: SUMMARY_SECTION_TITLE,
};

export default async function PlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PlanRedirect id={decodeURIComponent(id)} />;
}
