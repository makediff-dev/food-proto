import type { Metadata } from 'next';

import { OPEX_TRANSPORT_PLAN_TITLE, parseOpexMonthQuery } from '@/features/opex/paths';
import { TransportPlanScreen } from '@/features/opex/TransportPlanScreen';

export const metadata: Metadata = {
  title: OPEX_TRANSPORT_PLAN_TITLE,
};

export default async function OpexTransportPlanPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const query = parseOpexMonthQuery(await searchParams);
  return <TransportPlanScreen month={query.month} />;
}
