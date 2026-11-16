import { redirect } from 'next/navigation';

import { OPEX_HR_FACT_HREF, opexHrefWithQuery } from '@/features/opex/paths';

export default async function OpexHrFactRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; day?: string }>;
}) {
  redirect(opexHrefWithQuery(OPEX_HR_FACT_HREF, await searchParams));
}
