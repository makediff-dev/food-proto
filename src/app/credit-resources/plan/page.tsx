import type { Metadata } from 'next';

import { CreditResourcesPlanScreen } from '@/features/credit-resources/CreditResourcesPlanScreen';
import { CREDIT_RESOURCES_PLAN_TITLE, parseCreditMonthQuery } from '@/features/credit-resources/paths';

export const metadata: Metadata = {
  title: CREDIT_RESOURCES_PLAN_TITLE,
};

export default async function CreditResourcesPlanPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const query = parseCreditMonthQuery(await searchParams);
  return <CreditResourcesPlanScreen month={query.month} />;
}
