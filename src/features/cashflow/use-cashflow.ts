'use client';

import { useCreditResources } from '@/features/credit-resources/use-credit-resources';

/** ДДС читает документ и правит факт кредитов через те же поля, что и кредитные ресурсы. */
export function useCashflow() {
  return useCreditResources();
}
