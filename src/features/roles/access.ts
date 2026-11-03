import {
  DERIVATIVE_MOVEMENT_INVENTORY_HREF,
  DERIVATIVE_MOVEMENT_PLAN_HREF,
  DERIVATIVE_MOVEMENT_SUMMARY_HREF,
} from '@/features/derivative-movement/paths';
import {
  RECIPES_COST_HREF,
  RECIPES_DERIVATIVES_HREF,
  RECIPES_FINISHED_COST_HREF,
  RECIPES_FINISHED_HREF,
} from '@/features/recipes/paths';
import { ROLES_HREF } from '@/features/roles/paths';
import { type NavSectionId, type RoleDefinition, roleHasSection } from '@/features/roles/roles';

const SECTION_HOME: Record<NavSectionId, string> = {
  sales: '/',
  production: '/production',
  movement: '/movement',
  recipes: RECIPES_DERIVATIVES_HREF,
  derivativeMovement: DERIVATIVE_MOVEMENT_SUMMARY_HREF,
  materials: '/materials',
  opex: '/opex',
  roles: ROLES_HREF,
};

/** Prefer a working section home over the roles matrix page. */
const HOME_SECTION_ORDER: readonly NavSectionId[] = [
  'sales',
  'production',
  'movement',
  'recipes',
  'derivativeMovement',
  'materials',
  'opex',
  'roles',
];

export function roleHomeHref(role: RoleDefinition): string {
  for (const section of HOME_SECTION_ORDER) {
    if (roleHasSection(role, section)) {
      return SECTION_HOME[section];
    }
  }
  return ROLES_HREF;
}

export function pathnameSection(pathname: string): NavSectionId | null {
  if (pathname === ROLES_HREF || pathname.startsWith(`${ROLES_HREF}/`)) {
    return 'roles';
  }

  if (
    pathname === DERIVATIVE_MOVEMENT_SUMMARY_HREF ||
    pathname.startsWith(`${DERIVATIVE_MOVEMENT_SUMMARY_HREF}/`) ||
    pathname === DERIVATIVE_MOVEMENT_PLAN_HREF ||
    pathname.startsWith(`${DERIVATIVE_MOVEMENT_PLAN_HREF}/`) ||
    pathname === DERIVATIVE_MOVEMENT_INVENTORY_HREF ||
    pathname.startsWith(`${DERIVATIVE_MOVEMENT_INVENTORY_HREF}/`)
  ) {
    return 'derivativeMovement';
  }

  if (
    pathname === RECIPES_COST_HREF ||
    pathname.startsWith(`${RECIPES_COST_HREF}/`) ||
    pathname === RECIPES_FINISHED_COST_HREF ||
    pathname.startsWith(`${RECIPES_FINISHED_COST_HREF}/`) ||
    pathname === RECIPES_FINISHED_HREF ||
    pathname.startsWith(`${RECIPES_FINISHED_HREF}/`) ||
    pathname === RECIPES_DERIVATIVES_HREF ||
    pathname.startsWith(`${RECIPES_DERIVATIVES_HREF}/`)
  ) {
    return 'recipes';
  }

  if (pathname === '/materials' || pathname.startsWith('/materials/')) {
    return 'materials';
  }

  if (pathname === '/opex' || pathname.startsWith('/opex/')) {
    return 'opex';
  }

  if (pathname === '/movement' || pathname.startsWith('/movement/')) {
    return 'movement';
  }

  if (pathname === '/production' || pathname.startsWith('/production/')) {
    return 'production';
  }

  if (
    pathname === '/' ||
    pathname === '/planning' ||
    pathname.startsWith('/planning/') ||
    pathname === '/sales' ||
    pathname.startsWith('/sales/')
  ) {
    return 'sales';
  }

  return null;
}

export function roleCanAccessPath(role: RoleDefinition, pathname: string): boolean {
  const section = pathnameSection(pathname);
  if (section === null) {
    return true;
  }
  return roleHasSection(role, section);
}
