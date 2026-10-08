import type { Metadata } from 'next';
import { ProductionPlaceholderScreen } from '@/features/production/production-placeholder-screen';

export const metadata: Metadata = {
  title: 'Фактическое производство',
};

export default function ProductionFactPage() {
  return (
    <ProductionPlaceholderScreen
      title="Фактическое производство"
      lede="Фактический выпуск готовой продукции."
      upcoming="Здесь появится факт производства по товарам и дням."
    />
  );
}
