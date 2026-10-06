import type { Metadata } from 'next';
import { SALES_SECTION_TITLE } from '@/features/sales-fact/paths';
import { SaleScreen } from '@/features/sales-fact/sale-screen';

export const metadata: Metadata = {
  title: SALES_SECTION_TITLE,
};

export default async function SalePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SaleScreen saleId={decodeURIComponent(id)} dayQuery="" />;
}
