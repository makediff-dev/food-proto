'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';

import { useDocumentStore } from '@/data/DocumentProvider';
import {
  MOVEMENT_FACT_TITLE,
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
import { SUMMARY_SECTION_TITLE } from '@/features/sales/paths';
import { SALES_FACT_TITLE, SALES_JOURNAL_TITLE, SALES_SECTION_TITLE } from '@/features/sales-fact/paths';
import { IconMenu, IconUndo } from '@/features/shell/Icons';

type NavItem = {
  href: string;
  label: string;
  /** Exact pathname only — for section roots that share a prefix with nested routes. */
  exact?: boolean;
  salesJournal?: boolean;
};

const SALES_NAV: readonly NavItem[] = [
  { href: '/', label: SUMMARY_SECTION_TITLE, exact: true },
  { href: '/sales', label: SALES_FACT_TITLE, exact: true },
  { href: '/planning', label: PLANNING_SECTION_TITLE },
  { href: '/sales/journal', label: SALES_JOURNAL_TITLE, salesJournal: true },
];

const PRODUCTION_NAV: readonly NavItem[] = [
  { href: '/production', label: PRODUCTION_SUMMARY_TITLE, exact: true },
  { href: '/production/fact', label: PRODUCTION_FACT_TITLE },
  { href: '/production/plan', label: PRODUCTION_PLAN_TITLE },
  { href: '/production/journal', label: PRODUCTION_JOURNAL_TITLE },
];

const MOVEMENT_NAV: readonly NavItem[] = [
  { href: '/movement', label: MOVEMENT_SUMMARY_TITLE, exact: true },
  { href: '/movement/fact', label: MOVEMENT_FACT_TITLE },
  { href: '/movement/plan', label: MOVEMENT_PLAN_TITLE },
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

  for (const item of MOVEMENT_NAV) {
    if (navItemIsCurrent(pathname, item)) {
      return item.label;
    }
  }

  return undefined;
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
  return (
    <div>
      <p className="px-3 py-2 text-sm text-white">{title}</p>
      <div className="flex flex-col">
        {items.map((item) => {
          const current = navItemIsCurrent(pathname, item);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={current ? 'page' : undefined}
              onClick={onNavigate}
              className={`relative py-1 pr-3 pl-6 text-xs leading-5 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                current ? 'bg-sidebar-active text-white' : 'text-sidebar-muted hover:bg-white/5 hover:text-white'
              }`}
            >
              {current ? <span className="absolute inset-y-1 left-0 w-0.5 bg-mark" aria-hidden="true" /> : null}
              {item.label}
            </Link>
          );
        })}
      </div>
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
    <div className="flex h-dvh flex-col overflow-hidden bg-paper">
      {menuOpen ? (
        <button
          type="button"
          aria-label="Закрыть меню"
          className="fixed inset-0 z-20 bg-ink/40 lg:hidden"
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
            Мясное
            <br />
            производство
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
          <NavGroup title={MOVEMENT_SECTION_TITLE} items={MOVEMENT_NAV} pathname={pathname} onNavigate={closeMenu} />
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
            {sectionIsCurrent(pathname, QUESTIONS_HREF) ? (
              <span className="absolute inset-y-2 left-0 w-0.5 bg-mark" aria-hidden="true" />
            ) : null}
            {QUESTIONS_LABEL}
          </Link>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:pl-64">
        <header className="flex shrink-0 items-center gap-3 border-b border-line bg-paper px-4 py-2 lg:hidden">
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
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
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
