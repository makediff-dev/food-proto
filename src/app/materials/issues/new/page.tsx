import type { Metadata } from 'next';

import { MaterialDocumentScreen } from '@/features/materials/MaterialDocumentScreen';
import { NEW_MATERIAL_ISSUE_TITLE } from '@/features/materials/paths';

export const metadata: Metadata = {
  title: NEW_MATERIAL_ISSUE_TITLE,
};

export default function NewMaterialIssuePage() {
  return <MaterialDocumentScreen kind="issue" documentId={null} />;
}
