import { redirect } from 'next/navigation';

import { OPEX_TRANSPORT_FACT_HREF, opexHrefWithQuery } from '@/features/opex/paths';

export default async function OpexTransportFactRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; day?: string }>;
}) {
  redirect(opexHrefWithQuery(OPEX_TRANSPORT_FACT_HREF, await searchParams));
}
