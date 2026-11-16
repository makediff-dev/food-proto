import type { Metadata } from 'next';

import { CashflowFactScreen } from '@/features/cashflow/CashflowFactScreen';
import { CASHFLOW_FACT_TITLE, parseCashflowDayQuery } from '@/features/cashflow/paths';

export const metadata: Metadata = {
  title: CASHFLOW_FACT_TITLE,
};

export default async function CashflowFactPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; day?: string }>;
}) {
  const query = parseCashflowDayQuery(await searchParams);
  return <CashflowFactScreen month={query.month} day={query.day} />;
}
