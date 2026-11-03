import type { Metadata } from 'next';

import { HrFactScreen } from '@/features/opex/HrFactScreen';
import { OPEX_HR_FACT_TITLE, parseOpexDayQuery } from '@/features/opex/paths';

export const metadata: Metadata = {
  title: OPEX_HR_FACT_TITLE,
};

export default async function OpexHrFactPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; day?: string }>;
}) {
  const query = parseOpexDayQuery(await searchParams);
  return <HrFactScreen month={query.month} day={query.day} />;
}
