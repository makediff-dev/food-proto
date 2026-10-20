import type { Metadata } from 'next';

import { MaterialJournalScreen } from '@/features/materials/MaterialJournalScreen';
import { MATERIALS_ISSUES_TITLE, parseMaterialMonthQuery } from '@/features/materials/paths';

export const metadata: Metadata = {
  title: MATERIALS_ISSUES_TITLE,
};

export default async function MaterialIssuesPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const query = parseMaterialMonthQuery(await searchParams);
  return <MaterialJournalScreen kind="issue" month={query.month} />;
}
