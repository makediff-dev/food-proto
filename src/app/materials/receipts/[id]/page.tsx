import type { Metadata } from 'next';

import { MaterialDocumentScreen } from '@/features/materials/MaterialDocumentScreen';
import { MATERIALS_RECEIPTS_TITLE } from '@/features/materials/paths';

export const metadata: Metadata = {
  title: MATERIALS_RECEIPTS_TITLE,
};

export default async function MaterialReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MaterialDocumentScreen documentId={decodeURIComponent(id)} />;
}
