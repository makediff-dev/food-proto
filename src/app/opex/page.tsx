import type { Metadata } from 'next';

import { OpexSummaryScreen } from '@/features/opex/OpexSummaryScreen';
import { OPEX_SUMMARY_TITLE, parseOpexMonthQuery } from '@/features/opex/paths';

export const metadata: Metadata = {
  title: OPEX_SUMMARY_TITLE,
};

export default async function OpexSummaryPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const query = parseOpexMonthQuery(await searchParams);
  return <OpexSummaryScreen month={query.month} />;
}
