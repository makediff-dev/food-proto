import type { Metadata } from 'next';

import { InventoryScreen } from '@/features/movement/InventoryScreen';
import { MOVEMENT_INVENTORY_TITLE, parseMovementInventoryQuery } from '@/features/movement/paths';

export const metadata: Metadata = {
  title: MOVEMENT_INVENTORY_TITLE,
};

export default async function MovementInventoryPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const params = await searchParams;
  const query = parseMovementInventoryQuery(params);
  return <InventoryScreen month={query.month} />;
}
