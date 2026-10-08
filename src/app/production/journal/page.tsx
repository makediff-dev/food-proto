import type { Metadata } from 'next';

import { ProductionPlaceholderScreen } from '@/features/production/production-placeholder-screen';

export const metadata: Metadata = {
  title: 'Журнал производства',
};

export default function ProductionJournalPage() {
  return (
    <ProductionPlaceholderScreen
      title="Журнал производства"
      lede="Записи выпуска готовой продукции."
      upcoming="Здесь появится журнал производственных записей."
    />
  );
}
