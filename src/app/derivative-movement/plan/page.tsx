import type { Metadata } from 'next';

import { DerivativeMovementPlanScreen } from '@/features/derivative-movement/DerivativeMovementPlanScreen';
import { DERIVATIVE_MOVEMENT_PLAN_TITLE, parseDerivativeMovementPlanQuery } from '@/features/derivative-movement/paths';

export const metadata: Metadata = {
  title: DERIVATIVE_MOVEMENT_PLAN_TITLE,
};

export default async function DerivativeMovementPlanPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const query = parseDerivativeMovementPlanQuery(await searchParams);
  return <DerivativeMovementPlanScreen month={query.month} />;
}
