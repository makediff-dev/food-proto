import type { Metadata } from 'next';

import { parseSalesJournalQuery, SALES_JOURNAL_TITLE } from '@/features/sales-fact/paths';
import { SalesJournalScreen } from '@/features/sales-fact/SalesJournalScreen';

export const metadata: Metadata = {
  title: SALES_JOURNAL_TITLE,
};

export default async function SalesJournalPage({
  searchParams,
}: {
  searchParams: Promise<{
    month?: string;
  }>;
}) {
  const params = await searchParams;
  const query = parseSalesJournalQuery(params);

  return <SalesJournalScreen month={query.month} />;
}
