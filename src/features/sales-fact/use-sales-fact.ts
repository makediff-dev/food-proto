'use client';

import { useDocumentStore } from '@/data/document-store';

export function useSalesFact() {
  const { document, hydrated } = useDocumentStore();

  return {
    hydrated,
    document,
  };
}
