import type { Metadata } from 'next';

import { HrSummaryScreen } from '@/features/opex/HrSummaryScreen';
import { OPEX_HR_TITLE, parseOpexMonthQuery } from '@/features/opex/paths';

export const metadata: Metadata = {
  title: OPEX_HR_TITLE,
};

export default async function OpexHrPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const query = parseOpexMonthQuery(await searchParams);
  return <HrSummaryScreen month={query.month} />;
}
