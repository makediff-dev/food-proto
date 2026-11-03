/** View lens for the prototype — no real accounts. */

export type RoleId = 'sales' | 'recipes' | 'production' | 'supply' | 'economist' | 'admin';

/**
 * Permission flags. Missing flags mean “allowed”: add a field only when a role
 * must differ. Screens check a flag only after it exists here.
 */
export type RolePermissions = {
  canEditRecipes: boolean;
};

export type RoleDefinition = {
  id: RoleId;
  label: string;
} & RolePermissions;

export const DEFAULT_ROLE_ID: RoleId = 'admin';

export const ROLES: readonly RoleDefinition[] = [
  { id: 'sales', label: 'Продажник', canEditRecipes: false },
  { id: 'recipes', label: 'Рецептурник', canEditRecipes: true },
  { id: 'production', label: 'Производственник', canEditRecipes: false },
  { id: 'supply', label: 'Снабжение', canEditRecipes: false },
  { id: 'economist', label: 'Экономист', canEditRecipes: false },
  { id: 'admin', label: 'Администратор', canEditRecipes: true },
];

export type PermissionMatrixRow = {
  key: keyof RolePermissions;
  label: string;
};

export const PERMISSION_MATRIX_ROWS: readonly PermissionMatrixRow[] = [
  { key: 'canEditRecipes', label: 'Правит рецептуры' },
];

export function isRoleId(value: string): value is RoleId {
  return ROLES.some((role) => role.id === value);
}

export function roleById(id: RoleId): RoleDefinition {
  const role = ROLES.find((item) => item.id === id);
  if (!role) {
    throw new Error(`Unknown role: ${id}`);
  }
  return role;
}
