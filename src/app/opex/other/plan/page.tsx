import type { Metadata } from 'next';

import { OtherPlanScreen } from '@/features/opex/OtherPlanScreen';
import { OPEX_OTHER_PLAN_TITLE, parseOpexMonthQuery } from '@/features/opex/paths';

export const metadata: Metadata = {
  title: OPEX_OTHER_PLAN_TITLE,
};

export default async function OpexOtherPlanPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const query = parseOpexMonthQuery(await searchParams);
  return <OtherPlanScreen month={query.month} />;
}
