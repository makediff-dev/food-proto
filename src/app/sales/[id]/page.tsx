import type { Metadata } from 'next';
import { SALES_JOURNAL_TITLE } from '@/features/sales-fact/paths';
import { SaleScreen } from '@/features/sales-fact/SaleScreen';

export const metadata: Metadata = {
  title: SALES_JOURNAL_TITLE,
};

export default async function SalePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SaleScreen saleId={decodeURIComponent(id)} dayQuery="" />;
}
