import type { Metadata } from 'next';

import { PropertyTaxScreen } from '@/features/cashflow/PropertyTaxScreen';
import { CASHFLOW_PROPERTY_TAX_TITLE, parseCashflowMonthQuery } from '@/features/cashflow/paths';

export const metadata: Metadata = {
  title: CASHFLOW_PROPERTY_TAX_TITLE,
};

export default async function CashflowPropertyTaxPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const query = parseCashflowMonthQuery(await searchParams);
  return <PropertyTaxScreen month={query.month} />;
}
