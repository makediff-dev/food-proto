import type { Metadata } from 'next';

import { CashflowFactScreen } from '@/features/cashflow/CashflowFactScreen';
import { CASHFLOW_FACT_TITLE, parseCashflowMonthQuery } from '@/features/cashflow/paths';

export const metadata: Metadata = {
  title: CASHFLOW_FACT_TITLE,
};

export default async function CashflowFactPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const query = parseCashflowMonthQuery(await searchParams);
  return <CashflowFactScreen month={query.month} />;
}
