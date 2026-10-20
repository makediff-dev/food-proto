import type { Metadata } from 'next';

import { MaterialsNormsScreen } from '@/features/materials/MaterialsNormsScreen';
import { MATERIALS_NORMS_TITLE } from '@/features/materials/paths';

export const metadata: Metadata = {
  title: MATERIALS_NORMS_TITLE,
};

export default function MaterialsNormsPage() {
  return <MaterialsNormsScreen />;
}
