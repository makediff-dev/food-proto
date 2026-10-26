import type { Metadata } from 'next';

import { DerivativeMovementInventoryScreen } from '@/features/derivative-movement/DerivativeMovementInventoryScreen';
import {
  DERIVATIVE_MOVEMENT_INVENTORY_TITLE,
  parseDerivativeMovementInventoryQuery,
} from '@/features/derivative-movement/paths';

export const metadata: Metadata = {
  title: DERIVATIVE_MOVEMENT_INVENTORY_TITLE,
};

export default async function DerivativeMovementInventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const query = parseDerivativeMovementInventoryQuery(await searchParams);
  return <DerivativeMovementInventoryScreen month={query.month} />;
}
