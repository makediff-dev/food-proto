import type { Metadata } from 'next';
import { SALES_FACT_SECTION_TITLE } from '@/features/sales-fact/paths';
import { SaleScreen } from '@/features/sales-fact/sale-screen';

export const metadata: Metadata = {
  title: SALES_FACT_SECTION_TITLE,
};

export default async function NewSalePage({
  searchParams,
}: {
  searchParams: Promise<{ day?: string }>;
}) {
  const params = await searchParams;
  return <SaleScreen saleId={null} dayQuery={params.day ?? ''} />;
}
