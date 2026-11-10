'use client';

import { useDocumentStore } from '@/data/DocumentProvider';

/** Отчёт по НДС только читает документ. */
export function useVatReport() {
  return useDocumentStore();
}
