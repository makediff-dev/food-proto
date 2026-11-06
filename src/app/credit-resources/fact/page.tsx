import type { Metadata } from 'next';

import { CreditResourcesFactScreen } from '@/features/credit-resources/CreditResourcesFactScreen';
import { CREDIT_RESOURCES_FACT_TITLE, parseCreditMonthQuery } from '@/features/credit-resources/paths';

export const metadata: Metadata = {
  title: CREDIT_RESOURCES_FACT_TITLE,
};

export default async function CreditResourcesFactPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const query = parseCreditMonthQuery(await searchParams);
  return <CreditResourcesFactScreen month={query.month} />;
}
