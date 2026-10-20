import type { Metadata } from 'next';

import { MaterialsInventoryScreen } from '@/features/materials/MaterialsInventoryScreen';
import { MATERIALS_INVENTORY_TITLE, parseMaterialMonthQuery } from '@/features/materials/paths';

export const metadata: Metadata = {
  title: MATERIALS_INVENTORY_TITLE,
};

export default async function MaterialsInventoryPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const query = parseMaterialMonthQuery(await searchParams);
  return <MaterialsInventoryScreen month={query.month} />;
}
