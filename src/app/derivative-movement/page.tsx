import type { Metadata } from 'next';

import { DerivativeMovementSummaryScreen } from '@/features/derivative-movement/DerivativeMovementSummaryScreen';
import {
  DERIVATIVE_MOVEMENT_SUMMARY_TITLE,
  parseDerivativeMovementMonthQuery,
} from '@/features/derivative-movement/paths';

export const metadata: Metadata = {
  title: DERIVATIVE_MOVEMENT_SUMMARY_TITLE,
};

export default async function DerivativeMovementPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const query = parseDerivativeMovementMonthQuery(await searchParams);
  return <DerivativeMovementSummaryScreen month={query.month} />;
}
