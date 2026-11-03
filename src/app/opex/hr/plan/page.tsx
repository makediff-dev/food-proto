import type { Metadata } from 'next';

import { HrPlanScreen } from '@/features/opex/HrPlanScreen';
import { OPEX_HR_PLAN_TITLE, parseOpexMonthQuery } from '@/features/opex/paths';

export const metadata: Metadata = {
  title: OPEX_HR_PLAN_TITLE,
};

export default async function OpexHrPlanPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const query = parseOpexMonthQuery(await searchParams);
  return <HrPlanScreen month={query.month} />;
}
