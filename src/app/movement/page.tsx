import type { Metadata } from 'next';

import { FinishedGoodsMonthScreen } from '@/features/movement/FinishedGoodsMonthScreen';
import { MOVEMENT_SUMMARY_TITLE, parseFinishedGoodsSummaryQuery } from '@/features/movement/paths';

export const metadata: Metadata = {
  title: MOVEMENT_SUMMARY_TITLE,
};

export default async function MovementPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; month?: string }>;
}) {
  const params = await searchParams;
  const query = parseFinishedGoodsSummaryQuery(params);
  return <FinishedGoodsMonthScreen from={query.from} to={query.to} />;
}
