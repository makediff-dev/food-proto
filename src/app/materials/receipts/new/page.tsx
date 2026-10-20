import type { Metadata } from 'next';

import { MaterialDocumentScreen } from '@/features/materials/MaterialDocumentScreen';
import { NEW_MATERIAL_RECEIPT_TITLE } from '@/features/materials/paths';

export const metadata: Metadata = {
  title: NEW_MATERIAL_RECEIPT_TITLE,
};

export default function NewMaterialReceiptPage() {
  return <MaterialDocumentScreen kind="receipt" documentId={null} />;
}
