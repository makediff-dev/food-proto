import type { Metadata } from 'next';

import { PRODUCTION_JOURNAL_TITLE } from '@/features/production/paths';
import { ProductionEntryScreen } from '@/features/production/production-entry-screen';

export const metadata: Metadata = {
  title: PRODUCTION_JOURNAL_TITLE,
};

export default async function ProductionEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductionEntryScreen entryId={decodeURIComponent(id)} dayQuery="" />;
}
