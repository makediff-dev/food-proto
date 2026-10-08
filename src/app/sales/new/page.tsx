import type { Metadata } from 'next';
import { NEW_SALE_TITLE } from '@/features/sales-fact/paths';
import { SaleScreen } from '@/features/sales-fact/SaleScreen';

export const metadata: Metadata = {
  title: NEW_SALE_TITLE,
};

export default async function NewSalePage({ searchParams }: { searchParams: Promise<{ day?: string }> }) {
  const params = await searchParams;
  return <SaleScreen saleId={null} dayQuery={params.day ?? ''} />;
}
