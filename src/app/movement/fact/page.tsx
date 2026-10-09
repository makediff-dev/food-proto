import type { Metadata } from 'next';

import { FinishedGoodsFactScreen } from '@/features/movement/FinishedGoodsFactScreen';
import { MOVEMENT_FACT_TITLE, parseFinishedGoodsFactQuery } from '@/features/movement/paths';

export const metadata: Metadata = {
  title: MOVEMENT_FACT_TITLE,
};

export default async function MovementFactPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; day?: string; view?: string }>;
}) {
  const params = await searchParams;
  const query = parseFinishedGoodsFactQuery(params);
  return <FinishedGoodsFactScreen month={query.month} day={query.day} view={query.view} />;
}
