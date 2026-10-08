import type { Metadata } from 'next';
import { ProductionEntryScreen } from '@/features/production/ProductionEntryScreen';
import { PRODUCTION_JOURNAL_TITLE } from '@/features/production/paths';

export const metadata: Metadata = {
  title: PRODUCTION_JOURNAL_TITLE,
};

export default async function ProductionEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductionEntryScreen entryId={decodeURIComponent(id)} dayQuery="" />;
}
