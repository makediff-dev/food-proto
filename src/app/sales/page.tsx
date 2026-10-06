import type { Metadata } from 'next';

import {
  parseSalesFactQuery,
  SALES_SECTION_TITLE,
} from '@/features/sales-fact/paths';
import { SalesFactScreen } from '@/features/sales-fact/sales-fact-screen';

export const metadata: Metadata = {
  title: SALES_SECTION_TITLE,
};

export default async function SalesFactPage({
  searchParams,
}: {
  searchParams: Promise<{
    month?: string;
    day?: string;
    view?: string;
  }>;
}) {
  const params = await searchParams;
  const query = parseSalesFactQuery(params);

  return (
    <SalesFactScreen month={query.month} day={query.day} view={query.view} />
  );
}
