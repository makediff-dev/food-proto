import type { Metadata } from 'next';

import { isOpexGroupCode } from '@/domain/document';
import { opexGroupName } from '@/domain/operating-expense';
import { OpexGroupSummaryScreen } from '@/features/opex/OpexGroupSummaryScreen';
import { parseOpexMonthQuery } from '@/features/opex/paths';

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  return { title: isOpexGroupCode(code) ? opexGroupName(code) : 'Категория расходов' };
}

export default async function OpexGroupPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ month?: string }>;
}) {
  const { code } = await params;
  const query = parseOpexMonthQuery(await searchParams);
  return <OpexGroupSummaryScreen code={code} month={query.month} />;
}
