import type { Metadata } from 'next';

import { MaterialJournalScreen } from '@/features/materials/MaterialJournalScreen';
import { MATERIALS_RECEIPTS_TITLE, parseMaterialMonthQuery } from '@/features/materials/paths';

export const metadata: Metadata = {
  title: MATERIALS_RECEIPTS_TITLE,
};

export default async function MaterialReceiptsPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const query = parseMaterialMonthQuery(await searchParams);
  return <MaterialJournalScreen month={query.month} />;
}
