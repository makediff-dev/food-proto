import type { Metadata } from 'next';

import { OPEX_TRANSPORT_TITLE, parseOpexMonthQuery } from '@/features/opex/paths';
import { TransportSummaryScreen } from '@/features/opex/TransportSummaryScreen';

export const metadata: Metadata = {
  title: OPEX_TRANSPORT_TITLE,
};

export default async function OpexTransportPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const query = parseOpexMonthQuery(await searchParams);
  return <TransportSummaryScreen month={query.month} />;
}
