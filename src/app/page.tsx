import type { Metadata } from 'next';

import { parseSummaryQuery, SUMMARY_SECTION_TITLE } from '@/features/sales/paths';
import { SummaryScreen } from '@/features/sales/SummaryScreen';

export const metadata: Metadata = {
  title: SUMMARY_SECTION_TITLE,
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    from?: string;
    to?: string;
    month?: string;
    view?: string;
  }>;
}) {
  const params = await searchParams;
  const query = parseSummaryQuery(params);
  return <SummaryScreen from={query.from} to={query.to} view={query.view} />;
}
