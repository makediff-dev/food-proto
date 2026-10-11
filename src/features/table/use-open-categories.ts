'use client';

import { useState } from 'react';

/** Категории раскрыты, пока их не свернули. */
export function useOpenCategories() {
  const [closedIds, setClosedIds] = useState<ReadonlySet<string>>(() => new Set());

  function toggleCategory(categoryId: string) {
    setClosedIds((current) => {
      const next = new Set(current);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }

  function categoryOpen(categoryId: string) {
    return !closedIds.has(categoryId);
  }

  return { toggleCategory, categoryOpen };
}
