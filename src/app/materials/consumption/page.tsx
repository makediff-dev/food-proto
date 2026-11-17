import type { Metadata } from 'next';

import { MaterialsConsumptionScreen } from '@/features/materials/MaterialsConsumptionScreen';
import { MATERIALS_CONSUMPTION_TITLE, parseMaterialDayQuery } from '@/features/materials/paths';

export const metadata: Metadata = {
  title: MATERIALS_CONSUMPTION_TITLE,
};

export default async function MaterialsConsumptionPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; day?: string }>;
}) {
  const query = parseMaterialDayQuery(await searchParams);
  return <MaterialsConsumptionScreen month={query.month} day={query.day} />;
}
