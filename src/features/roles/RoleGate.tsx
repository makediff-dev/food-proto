'use client';

import { usePathname, useRouter } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';

import { roleCanAccessPath, roleHomeHref } from '@/features/roles/access';
import { useRole } from '@/features/roles/RoleProvider';

export function RoleGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useRole();
  const allowed = roleCanAccessPath(role, pathname);
  const homeHref = roleHomeHref(role);

  useEffect(() => {
    if (allowed) {
      return;
    }
    router.replace(homeHref);
  }, [allowed, homeHref, router]);

  if (!allowed) {
    return null;
  }

  return children;
}
