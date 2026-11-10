import type { Metadata } from 'next';

import { isOpexGroupCode } from '@/domain/document';
import { opexGroupName } from '@/domain/operating-expense';
import { OpexGroupFactScreen } from '@/features/opex/OpexGroupFactScreen';
import { OPEX_OTHER_FACT_TITLE, parseOpexDayQuery } from '@/features/opex/paths';

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const name = isOpexGroupCode(code) ? opexGroupName(code) : 'Категория расходов';
  return { title: `${name} · ${OPEX_OTHER_FACT_TITLE}` };
}

export default async function OpexGroupFactPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ month?: string; day?: string }>;
}) {
  const { code } = await params;
  const query = parseOpexDayQuery(await searchParams);
  return <OpexGroupFactScreen code={code} month={query.month} day={query.day} />;
}
