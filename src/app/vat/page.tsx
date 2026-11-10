import type { Metadata } from 'next';

import { parseVatMonthQuery, VAT_REPORT_SUMMARY_TITLE } from '@/features/vat/paths';
import { VatReportScreen } from '@/features/vat/VatReportScreen';

export const metadata: Metadata = {
  title: VAT_REPORT_SUMMARY_TITLE,
};

export default async function VatReportPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const query = parseVatMonthQuery(await searchParams);
  return <VatReportScreen month={query.month} />;
}
