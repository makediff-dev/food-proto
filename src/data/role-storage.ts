import { isRoleId, type RoleId } from '@/features/roles/roles';

/** Separate from PrototypeDocument — view lens only, not accounting data. */
export const ROLE_STORAGE_KEY = 'food-proto:view-role';

export function readRole(): RoleId | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(ROLE_STORAGE_KEY);
    if (!raw || !isRoleId(raw)) {
      return null;
    }
    return raw;
  } catch {
    return null;
  }
}

export function writeRole(roleId: RoleId): void {
  try {
    window.localStorage.setItem(ROLE_STORAGE_KEY, roleId);
  } catch {
    // Prototype: if the browser refuses, keep the in-memory selection only.
  }
}
