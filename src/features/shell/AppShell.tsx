'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';

import { useDocumentStore } from '@/data/DocumentProvider';
import {
  DERIVATIVE_MOVEMENT_INVENTORY_HREF,
  DERIVATIVE_MOVEMENT_INVENTORY_TITLE,
  DERIVATIVE_MOVEMENT_PLAN_HREF,
  DERIVATIVE_MOVEMENT_PLAN_TITLE,
  DERIVATIVE_MOVEMENT_SECTION_TITLE,
  DERIVATIVE_MOVEMENT_SUMMARY_HREF,
  DERIVATIVE_MOVEMENT_SUMMARY_TITLE,
} from '@/features/derivative-movement/paths';
import {
  MATERIALS_INVENTORY_TITLE,
  MATERIALS_PLAN_TITLE,
  MATERIALS_RECEIPTS_TITLE,
  MATERIALS_SECTION_TITLE,
  MATERIALS_SUMMARY_TITLE,
} from '@/features/materials/paths';
import {
  MOVEMENT_FACT_TITLE,
  MOVEMENT_INVENTORY_TITLE,
  MOVEMENT_PLAN_TITLE,
  MOVEMENT_SECTION_TITLE,
  MOVEMENT_SUMMARY_TITLE,
} from '@/features/movement/paths';
import { PLANNING_SECTION_TITLE } from '@/features/planning/paths';
import {
  PRODUCTION_FACT_TITLE,
  PRODUCTION_JOURNAL_TITLE,
  PRODUCTION_PLAN_TITLE,
  PRODUCTION_SECTION_TITLE,
  PRODUCTION_SUMMARY_TITLE,
} from '@/features/production/paths';
import {
  RECIPES_DERIVATIVES_HREF,
  RECIPES_DERIVATIVES_TITLE,
  RECIPES_FINISHED_HREF,
  RECIPES_FINISHED_TITLE,
  RECIPES_SECTION_TITLE,
} from '@/features/recipes/paths';
import { SUMMARY_SECTION_TITLE } from '@/features/sales/paths';
import { SALES_FACT_TITLE, SALES_JOURNAL_TITLE, SALES_SECTION_TITLE } from '@/features/sales-fact/paths';
import { IconChevronDown, IconChevronRight, IconMenu, IconUndo } from '@/features/shell/Icons';

type NavKind = 'report' | 'input';

type NavItem = {
  href: string;
  label: string;
  navKind: NavKind;
  /** Exact pathname only — for section roots that share a prefix with nested routes. */
  exact?: boolean;
  salesJournal?: boolean;
};

const SALES_NAV: readonly NavItem[] = [
  { href: '/', label: SUMMARY_SECTION_TITLE, exact: true, navKind: 'report' },
  { href: '/sales', label: SALES_FACT_TITLE, exact: true, navKind: 'report' },
  { href: '/planning', label: PLANNING_SECTION_TITLE, navKind: 'input' },
  { href: '/sales/journal', label: SALES_JOURNAL_TITLE, salesJournal: true, navKind: 'input' },
];

const PRODUCTION_NAV: readonly NavItem[] = [
  { href: '/production', label: PRODUCTION_SUMMARY_TITLE, exact: true, navKind: 'report' },
  { href: '/production/fact', label: PRODUCTION_FACT_TITLE, navKind: 'report' },
  { href: '/production/plan', label: PRODUCTION_PLAN_TITLE, navKind: 'input' },
  { href: '/production/journal', label: PRODUCTION_JOURNAL_TITLE, navKind: 'input' },
];

const RECIPES_NAV: readonly NavItem[] = [
  { href: RECIPES_DERIVATIVES_HREF, label: RECIPES_DERIVATIVES_TITLE, exact: true, navKind: 'input' },
  { href: RECIPES_FINISHED_HREF, label: RECIPES_FINISHED_TITLE, navKind: 'input' },
];

const MOVEMENT_NAV: readonly NavItem[] = [
  { href: '/movement', label: MOVEMENT_SUMMARY_TITLE, exact: true, navKind: 'report' },
  { href: '/movement/fact', label: MOVEMENT_FACT_TITLE, navKind: 'report' },
  { href: '/movement/plan', label: MOVEMENT_PLAN_TITLE, navKind: 'input' },
  { href: '/movement/inventory', label: MOVEMENT_INVENTORY_TITLE, navKind: 'input' },
];

const DERIVATIVE_MOVEMENT_NAV: readonly NavItem[] = [
  {
    href: DERIVATIVE_MOVEMENT_SUMMARY_HREF,
    label: DERIVATIVE_MOVEMENT_SUMMARY_TITLE,
    exact: true,
    navKind: 'report',
  },
  {
    href: DERIVATIVE_MOVEMENT_PLAN_HREF,
    label: DERIVATIVE_MOVEMENT_PLAN_TITLE,
    navKind: 'input',
  },
  {
    href: DERIVATIVE_MOVEMENT_INVENTORY_HREF,
    label: DERIVATIVE_MOVEMENT_INVENTORY_TITLE,
    navKind: 'input',
  },
];

const MATERIALS_NAV: readonly NavItem[] = [
  { href: '/materials', label: MATERIALS_SUMMARY_TITLE, exact: true, navKind: 'report' },
  { href: '/materials/plan', label: MATERIALS_PLAN_TITLE, navKind: 'input' },
  { href: '/materials/inventory', label: MATERIALS_INVENTORY_TITLE, navKind: 'input' },
  { href: '/materials/receipts', label: MATERIALS_RECEIPTS_TITLE, navKind: 'input' },
];

const QUESTIONS_HREF = '/questions';
const QUESTIONS_LABEL = 'Вопросы';

function sectionIsCurrent(pathname: string, href: string): boolean {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function salesJournalIsCurrent(pathname: string): boolean {
  if (pathname === '/sales/journal' || pathname.startsWith('/sales/journal/')) {
    return true;
  }

  if (pathname === '/sales/new' || pathname.startsWith('/sales/new/')) {
    return true;
  }

  const match = pathname.match(/^\/sales\/([^/]+)$/);
  return match !== null;
}

function navItemIsCurrent(pathname: string, item: NavItem): boolean {
  if (item.salesJournal) {
    return salesJournalIsCurrent(pathname);
  }

  if (item.exact || item.href === '/') {
    return pathname === item.href;
  }

  return sectionIsCurrent(pathname, item.href);
}

function currentNavLabel(pathname: string): string | undefined {
  if (sectionIsCurrent(pathname, QUESTIONS_HREF)) {
    return QUESTIONS_LABEL;
  }

  for (const item of SALES_NAV) {
    if (navItemIsCurrent(pathname, item)) {
      return item.label;
    }
  }

  for (const item of PRODUCTION_NAV) {
    if (navItemIsCurrent(pathname, item)) {
      return item.label;
    }
  }

  for (const item of RECIPES_NAV) {
    if (navItemIsCurrent(pathname, item)) {
      return item.label;
    }
  }

  for (const item of MOVEMENT_NAV) {
    if (navItemIsCurrent(pathname, item)) {
      return item.label;
    }
  }

  for (const item of MATERIALS_NAV) {
    if (navItemIsCurrent(pathname, item)) {
      return item.label;
    }
  }

  return undefined;
}

function navItemLinkClassName(current: boolean, navKind: NavKind): string {
  const kindAccent =
    navKind === 'report' ? 'border-l-2 border-l-sky-400/40 pl-[1.375rem]' : 'border-l-2 border-l-mark/55 pl-[1.375rem]';
  const state = current ? 'bg-sidebar-active text-white' : 'text-sidebar-muted hover:bg-white/5 hover:text-white';
  return `relative py-1 pr-3 text-xs leading-5 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${kindAccent} ${state}`;
}

function NavLink({ item, pathname, onNavigate }: { item: NavItem; pathname: string; onNavigate: () => void }) {
  const current = navItemIsCurrent(pathname, item);
  return (
    <Link
      href={item.href}
      aria-current={current ? 'page' : undefined}
      onClick={onNavigate}
      className={navItemLinkClassName(current, item.navKind)}
    >
      {item.label}
    </Link>
  );
}

function NavGroup({
  title,
  items,
  pathname,
  onNavigate,
}: {
  title: string;
  items: readonly NavItem[];
  pathname: string;
  onNavigate: () => void;
}) {
  const [collapsed, setCollapsed] = useState(true);
  const reportItems = items.filter((item) => item.navKind === 'report');
  const inputItems = items.filter((item) => item.navKind === 'input');

  return (
    <div className="pb-1">
      <button
        type="button"
        aria-expanded={!collapsed}
        aria-label={collapsed ? `Развернуть раздел «${title}»` : `Свернуть раздел «${title}»`}
        onClick={() => setCollapsed((current) => !current)}
        className="flex w-full items-center gap-1 px-3 py-2 text-left text-sm text-white outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <span className="inline-flex size-6 shrink-0 items-center justify-center text-sidebar-muted" aria-hidden="true">
          {collapsed ? <IconChevronRight /> : <IconChevronDown />}
        </span>
        <span>{title}</span>
      </button>
      {collapsed ? null : (
        <div className="flex flex-col gap-0.5">
          {reportItems.length > 0 ? (
            <div className="flex flex-col">
              {reportItems.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} />
              ))}
            </div>
          ) : null}
          {reportItems.length > 0 && inputItems.length > 0 ? (
            <div className="mx-3 border-t border-sidebar-line/90" aria-hidden="true" />
          ) : null}
          {inputItems.length > 0 ? (
            <div className="flex flex-col">
              {inputItems.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} />
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const currentLabel = currentNavLabel(pathname);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className="app-shell flex h-dvh flex-col overflow-hidden bg-paper">
      {menuOpen ? (
        <button
          type="button"
          aria-label="Закрыть меню"
          className="app-menu-backdrop fixed inset-0 z-20 bg-ink/40 lg:hidden"
          onClick={closeMenu}
        />
      ) : null}

      <aside
        id="app-menu"
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-sidebar text-white motion-safe:transition-transform ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="px-4 pt-5 pb-4">
          <Link
            href="/"
            onClick={closeMenu}
            className="font-figure text-lg leading-tight tracking-tight text-white outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Готовая
            <br />
            еда
          </Link>
        </div>

        <nav aria-label="Разделы" className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2">
          <NavGroup title={SALES_SECTION_TITLE} items={SALES_NAV} pathname={pathname} onNavigate={closeMenu} />
          <NavGroup
            title={PRODUCTION_SECTION_TITLE}
            items={PRODUCTION_NAV}
            pathname={pathname}
            onNavigate={closeMenu}
          />
          <NavGroup title={RECIPES_SECTION_TITLE} items={RECIPES_NAV} pathname={pathname} onNavigate={closeMenu} />
          <NavGroup title={MOVEMENT_SECTION_TITLE} items={MOVEMENT_NAV} pathname={pathname} onNavigate={closeMenu} />
          <NavGroup
            title={DERIVATIVE_MOVEMENT_SECTION_TITLE}
            items={DERIVATIVE_MOVEMENT_NAV}
            pathname={pathname}
            onNavigate={closeMenu}
          />
          <NavGroup title={MATERIALS_SECTION_TITLE} items={MATERIALS_NAV} pathname={pathname} onNavigate={closeMenu} />
        </nav>

        <div className="border-t border-sidebar-line">
          <MockReset />
          <Link
            href={QUESTIONS_HREF}
            aria-current={sectionIsCurrent(pathname, QUESTIONS_HREF) ? 'page' : undefined}
            onClick={closeMenu}
            className={`relative mx-2 mb-3 block px-3 py-2 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              sectionIsCurrent(pathname, QUESTIONS_HREF)
                ? 'bg-sidebar-active text-white'
                : 'text-sidebar-muted hover:bg-white/5 hover:text-white'
            }`}
          >
            {QUESTIONS_LABEL}
          </Link>
        </div>
      </aside>

      <div className="app-main flex min-h-0 min-w-0 flex-1 flex-col lg:pl-64">
        <header className="app-mobile-header flex shrink-0 items-center gap-3 border-b border-line bg-paper px-4 py-2 lg:hidden">
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="app-menu"
            onClick={() => setMenuOpen(true)}
            className="flex h-11 w-11 items-center justify-center border border-line bg-sheet outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <span className="sr-only">Открыть меню</span>
            <IconMenu />
          </button>
          <p className="text-sm text-ink">{currentLabel}</p>
        </header>
        <div className="app-scroll min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function MockReset() {
  const { source, hydrated, storageError, resetToMock } = useDocumentStore();
  const usingLocalData = source === 'local';

  function handleReset() {
    const confirmed = window.confirm(
      'Вернуть мок-данные? Все записи в этом браузере будут стёрты. Останется гамбургер и план сентября.',
    );
    if (!confirmed) {
      return;
    }

    resetToMock();
  }

  return (
    <div className="px-4 py-3">
      <p className="text-xs leading-5 text-sidebar-muted" role={storageError ? 'alert' : undefined}>
        {storageError ?? (usingLocalData ? 'Сохранено в этом браузере.' : 'Показаны мок-данные.')}
      </p>
      <button
        type="button"
        onClick={handleReset}
        disabled={!hydrated || !usingLocalData}
        className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 border border-white/50 px-3 text-sm text-white outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:border-sidebar-line disabled:text-sidebar-muted"
      >
        <IconUndo />
        Вернуть мок-данные
      </button>
    </div>
  );
}
