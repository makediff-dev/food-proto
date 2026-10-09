'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { monthKeyFromDate } from '@/domain/sales-plan';
import { SUMMARY_SECTION_TITLE, summaryHref } from '@/features/sales/paths';
import { useSales } from '@/features/sales/use-sales';
import { PageFrame } from '@/features/shell/PageFrame';

export function PlanRedirect({ id }: { id: string }) {
  const sales = useSales();
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);

  useEffect(() => {
    if (!sales.hydrated) {
      return;
    }

    const plan = sales.document.salesPlans.find((item) => item.id === id);
    const month = plan?.month ?? currentMonth;
    router.replace(
      summaryHref({
        from: month,
        to: month,
        currentMonth,
      }),
    );
  }, [currentMonth, id, router, sales.document.salesPlans, sales.hydrated]);

  return (
    <PageFrame title={SUMMARY_SECTION_TITLE} full lede="Открываем месяц плана.">
      {null}
    </PageFrame>
  );
}
