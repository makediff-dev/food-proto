'use client';

import { type CSSProperties, useLayoutEffect, useRef, useState } from 'react';

/** Высота thead → `top` для sticky-строк категории под шапкой. */
export function useStickyTableHead() {
  const headRef = useRef<HTMLTableSectionElement>(null);
  const [headHeight, setHeadHeight] = useState(0);

  useLayoutEffect(() => {
    const head = headRef.current;
    if (!head) {
      return;
    }

    const target = head;

    function updateHeight() {
      setHeadHeight(target.getBoundingClientRect().height);
    }

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const categoryStickyStyle: CSSProperties | undefined = headHeight > 0 ? { top: headHeight } : undefined;

  return { headRef, headHeight, categoryStickyStyle };
}
