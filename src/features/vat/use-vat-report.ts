'use client';

import { useDocumentStore } from '@/data/DocumentProvider';

/** Отчёт по налогам только читает документ. */
export function useVatReport() {
  return useDocumentStore();
}
