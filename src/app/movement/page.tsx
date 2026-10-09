import type { Metadata } from 'next';

import { FinishedGoodsMonthScreen } from '@/features/movement/FinishedGoodsMonthScreen';
import { MOVEMENT_SECTION_TITLE, parseFinishedGoodsMonthQuery } from '@/features/movement/paths';

export const metadata: Metadata = {
  title: MOVEMENT_SECTION_TITLE,
};

export default async function MovementPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const params = await searchParams;
  const query = parseFinishedGoodsMonthQuery(params);
  return <FinishedGoodsMonthScreen month={query.month} />;
}
