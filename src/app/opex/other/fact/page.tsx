import { redirect } from 'next/navigation';

import { OPEX_OTHER_FACT_HREF, opexHrefWithQuery } from '@/features/opex/paths';

export default async function OpexOtherFactRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  redirect(opexHrefWithQuery(OPEX_OTHER_FACT_HREF, await searchParams));
}
