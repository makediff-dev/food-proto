import type { Metadata } from 'next';

import { PRODUCTION_JOURNAL_TITLE, parseProductionJournalQuery } from '@/features/production/paths';
import { ProductionJournalScreen } from '@/features/production/production-journal-screen';

export const metadata: Metadata = {
  title: PRODUCTION_JOURNAL_TITLE,
};

export default async function ProductionJournalPage({
  searchParams,
}: {
  searchParams: Promise<{
    month?: string;
  }>;
}) {
  const params = await searchParams;
  const query = parseProductionJournalQuery(params);

  return <ProductionJournalScreen month={query.month} />;
}
