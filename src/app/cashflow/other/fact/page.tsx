import type { Metadata } from 'next';

import { OtherFactScreen } from '@/features/opex/OtherFactScreen';
import { OPEX_OTHER_FACT_TITLE, parseOpexDayQuery } from '@/features/opex/paths';

export const metadata: Metadata = {
  title: OPEX_OTHER_FACT_TITLE,
};

export default async function CashflowOtherFactPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; day?: string }>;
}) {
  const query = parseOpexDayQuery(await searchParams);
  return <OtherFactScreen month={query.month} day={query.day} />;
}
