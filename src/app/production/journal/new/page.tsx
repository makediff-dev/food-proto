import type { Metadata } from 'next';
import { ProductionEntryScreen } from '@/features/production/ProductionEntryScreen';
import { NEW_PRODUCTION_ENTRY_TITLE } from '@/features/production/paths';

export const metadata: Metadata = {
  title: NEW_PRODUCTION_ENTRY_TITLE,
};

export default async function NewProductionEntryPage({ searchParams }: { searchParams: Promise<{ day?: string }> }) {
  const params = await searchParams;
  return <ProductionEntryScreen entryId={null} dayQuery={params.day ?? ''} />;
}
