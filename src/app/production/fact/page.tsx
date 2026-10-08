import type { Metadata } from 'next';

import { PRODUCTION_FACT_TITLE, parseProductionJournalFactQuery } from '@/features/production/paths';
import { ProductionJournalFactScreen } from '@/features/production/production-journal-fact-screen';

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
