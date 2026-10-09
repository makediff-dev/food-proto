import type { Metadata } from 'next';

import { MovementPlanScreen } from '@/features/movement/MovementPlanScreen';
import { MOVEMENT_PLAN_TITLE, parseMovementPlanQuery } from '@/features/movement/paths';

export const metadata: Metadata = {
  title: MOVEMENT_PLAN_TITLE,
};

export default async function MovementPlanPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const params = await searchParams;
  const query = parseMovementPlanQuery(params);
  return <MovementPlanScreen month={query.month} />;
}
