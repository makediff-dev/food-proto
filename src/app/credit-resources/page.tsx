import type { Metadata } from 'next';

import { CreditResourcesSummaryScreen } from '@/features/credit-resources/CreditResourcesSummaryScreen';
import { CREDIT_RESOURCES_SUMMARY_TITLE, parseCreditMonthQuery } from '@/features/credit-resources/paths';

export const metadata: Metadata = {
  title: CREDIT_RESOURCES_SUMMARY_TITLE,
};

export default async function CreditResourcesSummaryPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const query = parseCreditMonthQuery(await searchParams);
  return <CreditResourcesSummaryScreen month={query.month} />;
}
