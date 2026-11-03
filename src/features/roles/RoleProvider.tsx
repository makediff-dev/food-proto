'use client';

import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { readRole, writeRole } from '@/data/role-storage';
import {
  DEFAULT_ROLE_ID,
  type RoleDefinition,
  type RoleId,
  type RolePermissions,
  roleById,
} from '@/features/roles/roles';

type RoleStoreValue = {
  roleId: RoleId;
  role: RoleDefinition;
  setRole: (roleId: RoleId) => void;
} & RolePermissions;

const RoleStoreContext = createContext<RoleStoreValue | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [roleId, setRoleIdState] = useState<RoleId>(DEFAULT_ROLE_ID);

  // After hydration: role changes add/remove controls, so useLayoutEffect would mismatch SSR.
  useEffect(() => {
    const stored = readRole();
    if (stored) {
      setRoleIdState(stored);
    }
  }, []);

  const setRole = useCallback((next: RoleId) => {
    setRoleIdState(next);
    writeRole(next);
  }, []);

  const role = roleById(roleId);

  const value = useMemo<RoleStoreValue>(
    () => ({
      roleId,
      role,
      setRole,
      sections: role.sections,
      canEditSalesPlan: role.canEditSalesPlan,
      canEditSalesFact: role.canEditSalesFact,
      canEditSalesCatalog: role.canEditSalesCatalog,
      canEditSalesVat: role.canEditSalesVat,
      canEditSalesOpex: role.canEditSalesOpex,
      canEditRecipes: role.canEditRecipes,
      canEditProduction: role.canEditProduction,
      canEditMovementPlan: role.canEditMovementPlan,
      canEditInventory: role.canEditInventory,
      canEditMaterialsPlan: role.canEditMaterialsPlan,
      canEditMaterialReceipts: role.canEditMaterialReceipts,
      canViewSalesFinance: role.canViewSalesFinance,
    }),
    [role, roleId, setRole],
  );

  return <RoleStoreContext.Provider value={value}>{children}</RoleStoreContext.Provider>;
}

export function useRole(): RoleStoreValue {
  const store = useContext(RoleStoreContext);
  if (!store) {
    throw new Error('useRole вызывается внутри RoleProvider');
  }
  return store;
}
