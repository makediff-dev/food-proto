import type { Metadata } from 'next';

import { isOpexGroupCode } from '@/domain/document';
import { opexGroupName } from '@/domain/operating-expense';
import { OpexGroupPlanScreen } from '@/features/opex/OpexGroupPlanScreen';
import { OPEX_OTHER_PLAN_TITLE, parseOpexMonthQuery } from '@/features/opex/paths';

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const name = isOpexGroupCode(code) ? opexGroupName(code) : 'Категория расходов';
  return { title: `${name} · ${OPEX_OTHER_PLAN_TITLE}` };
}

export default async function OpexGroupPlanPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ month?: string }>;
}) {
  const { code } = await params;
  const query = parseOpexMonthQuery(await searchParams);
  return <OpexGroupPlanScreen code={code} month={query.month} />;
}
