import type { Metadata } from 'next';

import { PropertyTaxScreen } from '@/features/cashflow/PropertyTaxScreen';
import { CASHFLOW_PLAN_TITLE, parseCashflowMonthQuery } from '@/features/cashflow/paths';

export const metadata: Metadata = {
  title: CASHFLOW_PLAN_TITLE,
};

export default async function CashflowPlanPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const query = parseCashflowMonthQuery(await searchParams);
  return <PropertyTaxScreen month={query.month} />;
}
