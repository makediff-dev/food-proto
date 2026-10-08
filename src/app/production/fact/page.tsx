import type { Metadata } from 'next';
import { ProductionJournalFactScreen } from '@/features/production/ProductionJournalFactScreen';
import { PRODUCTION_FACT_TITLE, parseProductionJournalFactQuery } from '@/features/production/paths';

export const metadata: Metadata = {
  title: PRODUCTION_FACT_TITLE,
};

export default async function ProductionFactPage({
  searchParams,
}: {
  searchParams: Promise<{
    month?: string;
    day?: string;
    view?: string;
  }>;
}) {
  const params = await searchParams;
  const query = parseProductionJournalFactQuery(params);

  return <ProductionJournalFactScreen month={query.month} day={query.day} view={query.view} />;
}
