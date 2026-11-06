import type { Metadata } from 'next';

import { CashflowSummaryScreen } from '@/features/cashflow/CashflowSummaryScreen';
import { CASHFLOW_SUMMARY_TITLE, parseCashflowMonthQuery } from '@/features/cashflow/paths';

export const metadata: Metadata = {
  title: CASHFLOW_SUMMARY_TITLE,
};

export default async function CashflowSummaryPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const query = parseCashflowMonthQuery(await searchParams);
  return <CashflowSummaryScreen month={query.month} />;
}
