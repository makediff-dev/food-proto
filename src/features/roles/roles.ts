/** View lens for the prototype — no real accounts. */

export type RoleId = 'sales' | 'recipes' | 'production' | 'supply' | 'economist' | 'admin';

export type NavSectionId =
  | 'sales'
  | 'production'
  | 'movement'
  | 'recipes'
  | 'derivativeMovement'
  | 'materials'
  | 'opex'
  | 'roles';

export const ALL_NAV_SECTIONS: readonly NavSectionId[] = [
  'sales',
  'production',
  'movement',
  'recipes',
  'derivativeMovement',
  'materials',
  'opex',
  'roles',
];

export type RolePermissions = {
  sections: readonly NavSectionId[];
  canEditSalesPlan: boolean;
  canEditSalesFact: boolean;
  canEditSalesCatalog: boolean;
  canEditSalesVat: boolean;
  canEditSalesOpex: boolean;
  canEditRecipes: boolean;
  canEditProduction: boolean;
  canEditMovementPlan: boolean;
  canEditInventory: boolean;
  canEditMaterialsPlan: boolean;
  canEditMaterialReceipts: boolean;
  canViewSalesFinance: boolean;
};

export type RoleDefinition = {
  id: RoleId;
  label: string;
} & RolePermissions;

export const DEFAULT_ROLE_ID: RoleId = 'admin';

const ALL_EDIT: Omit<RolePermissions, 'sections'> = {
  canEditSalesPlan: true,
  canEditSalesFact: true,
  canEditSalesCatalog: true,
  canEditSalesVat: true,
  canEditSalesOpex: true,
  canEditRecipes: true,
  canEditProduction: true,
  canEditMovementPlan: true,
  canEditInventory: true,
  canEditMaterialsPlan: true,
  canEditMaterialReceipts: true,
  canViewSalesFinance: true,
};

const NO_EDIT: Omit<RolePermissions, 'sections'> = {
  canEditSalesPlan: false,
  canEditSalesFact: false,
  canEditSalesCatalog: false,
  canEditSalesVat: false,
  canEditSalesOpex: false,
  canEditRecipes: false,
  canEditProduction: false,
  canEditMovementPlan: false,
  canEditInventory: false,
  canEditMaterialsPlan: false,
  canEditMaterialReceipts: false,
  canViewSalesFinance: false,
};

export const ROLES: readonly RoleDefinition[] = [
  {
    id: 'sales',
    label: 'Продажник',
    sections: ['sales', 'roles'],
    ...NO_EDIT,
    canEditSalesPlan: true,
    canEditSalesFact: true,
  },
  {
    id: 'recipes',
    label: 'Рецептурник',
    sections: ['recipes', 'roles'],
    ...NO_EDIT,
    canEditRecipes: true,
  },
  {
    id: 'production',
    label: 'Производственник',
    sections: ['production', 'movement', 'derivativeMovement', 'roles'],
    ...NO_EDIT,
    canEditProduction: true,
    canEditMovementPlan: true,
  },
  {
    id: 'supply',
    label: 'Снабжение',
    sections: ['materials', 'roles'],
    ...NO_EDIT,
    canEditMaterialReceipts: true,
  },
  {
    id: 'economist',
    label: 'Экономист',
    sections: ALL_NAV_SECTIONS,
    ...NO_EDIT,
    canEditSalesPlan: true,
    canEditSalesCatalog: true,
    canEditSalesVat: true,
    canEditSalesOpex: true,
    canEditInventory: true,
    canEditMaterialsPlan: true,
    canViewSalesFinance: true,
  },
  {
    id: 'admin',
    label: 'Администратор',
    sections: ALL_NAV_SECTIONS,
    ...ALL_EDIT,
  },
];

export type PermissionFlagKey = keyof Omit<RolePermissions, 'sections'>;

export type PermissionMatrixRow =
  | { kind: 'section'; section: NavSectionId; label: string }
  | { kind: 'flag'; key: PermissionFlagKey; label: string };

export const PERMISSION_MATRIX_ROWS: readonly PermissionMatrixRow[] = [
  { kind: 'section', section: 'sales', label: 'Раздел «Продажи»' },
  { kind: 'section', section: 'production', label: 'Раздел «Производство»' },
  { kind: 'section', section: 'movement', label: 'Раздел «Движение готовой продукции»' },
  { kind: 'section', section: 'recipes', label: 'Раздел «Рецептурные журналы»' },
  { kind: 'section', section: 'derivativeMovement', label: 'Раздел «Движение производных»' },
  { kind: 'section', section: 'materials', label: 'Раздел «Сырьё и материалы»' },
  { kind: 'section', section: 'opex', label: 'Раздел «Операционные расходы»' },
  { kind: 'flag', key: 'canEditSalesPlan', label: 'Правит план продаж' },
  { kind: 'flag', key: 'canEditSalesFact', label: 'Правит факт продаж' },
  { kind: 'flag', key: 'canEditSalesCatalog', label: 'Правит товары и категории' },
  { kind: 'flag', key: 'canEditSalesVat', label: 'Правит НДС' },
  { kind: 'flag', key: 'canEditSalesOpex', label: 'Правит операционные расходы' },
  { kind: 'flag', key: 'canViewSalesFinance', label: 'Видит финансы сводки продаж' },
  { kind: 'flag', key: 'canEditRecipes', label: 'Правит рецептуры' },
  { kind: 'flag', key: 'canEditProduction', label: 'Правит производство' },
  { kind: 'flag', key: 'canEditMovementPlan', label: 'Правит план движения' },
  { kind: 'flag', key: 'canEditInventory', label: 'Правит инвентаризацию' },
  { kind: 'flag', key: 'canEditMaterialsPlan', label: 'Правит план сырья' },
  { kind: 'flag', key: 'canEditMaterialReceipts', label: 'Правит приходы сырья' },
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

export function roleHasSection(role: RoleDefinition, section: NavSectionId): boolean {
  return role.sections.includes(section);
}

export function permissionAllowed(role: RoleDefinition, row: PermissionMatrixRow): boolean {
  if (row.kind === 'section') {
    return roleHasSection(role, row.section);
  }
  return role[row.key];
}
