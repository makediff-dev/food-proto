import type { Metadata } from 'next';

import { MaterialDocumentScreen } from '@/features/materials/MaterialDocumentScreen';
import { MATERIALS_ISSUES_TITLE } from '@/features/materials/paths';

export const metadata: Metadata = {
  title: MATERIALS_ISSUES_TITLE,
};

export default async function MaterialIssuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MaterialDocumentScreen kind="issue" documentId={decodeURIComponent(id)} />;
}
