import { redirect } from 'next/navigation';

import { opexGroupFactHrefPath, opexHrefWithQuery } from '@/features/opex/paths';

export default async function OpexGroupFactRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ month?: string; day?: string }>;
}) {
  const { code } = await params;
  redirect(opexHrefWithQuery(opexGroupFactHrefPath(code), await searchParams));
}
