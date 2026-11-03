import type { Metadata } from 'next';

import { OPEX_TRANSPORT_FACT_TITLE, parseOpexDayQuery } from '@/features/opex/paths';
import { TransportFactScreen } from '@/features/opex/TransportFactScreen';

export const metadata: Metadata = {
  title: OPEX_TRANSPORT_FACT_TITLE,
};

export default async function OpexTransportFactPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; day?: string }>;
}) {
  const query = parseOpexDayQuery(await searchParams);
  return <TransportFactScreen month={query.month} day={query.day} />;
}
