import type { Metadata } from 'next';
import { ProductionFactScreen } from '@/features/production/ProductionFactScreen';
import { PRODUCTION_SUMMARY_TITLE, parseProductionFactQuery } from '@/features/production/paths';

export const metadata: Metadata = {
  title: PRODUCTION_SUMMARY_TITLE,
};

export default async function ProductionPage({
  searchParams,
}: {
  searchParams: Promise<{
    from?: string;
    to?: string;
    month?: string;
    view?: string;
  }>;
}) {
  const params = await searchParams;
  const query = parseProductionFactQuery(params);
  return <ProductionFactScreen from={query.from} to={query.to} view={query.view} />;
}
