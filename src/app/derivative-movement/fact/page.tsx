import type { Metadata } from 'next';

import { DerivativeConsumptionScreen } from '@/features/derivative-movement/DerivativeConsumptionScreen';
import {
  DERIVATIVE_MOVEMENT_CONSUMPTION_TITLE,
  parseDerivativeMovementDayQuery,
} from '@/features/derivative-movement/paths';

export const metadata: Metadata = {
  title: DERIVATIVE_MOVEMENT_CONSUMPTION_TITLE,
};

export default async function DerivativeConsumptionPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; day?: string }>;
}) {
  const query = parseDerivativeMovementDayQuery(await searchParams);
  return <DerivativeConsumptionScreen month={query.month} day={query.day} />;
}
