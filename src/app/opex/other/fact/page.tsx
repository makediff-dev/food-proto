import type { Metadata } from 'next';

import { OtherFactScreen } from '@/features/opex/OtherFactScreen';
import { OPEX_OTHER_FACT_TITLE, parseOpexMonthQuery } from '@/features/opex/paths';

export const metadata: Metadata = {
  title: OPEX_OTHER_FACT_TITLE,
};

export default async function OpexOtherFactPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const query = parseOpexMonthQuery(await searchParams);
  return <OtherFactScreen month={query.month} />;
}
