import type { Metadata } from 'next';

import { ProductionPlaceholderScreen } from '@/features/production/production-placeholder-screen';

export const metadata: Metadata = {
  title: 'Планируемое производство',
};

export default function ProductionPlanPage() {
  return (
    <ProductionPlaceholderScreen
      title="Планируемое производство"
      lede="План выпуска готовой продукции."
      upcoming="Здесь появится план производства по товарам и месяцам."
    />
  );
}
