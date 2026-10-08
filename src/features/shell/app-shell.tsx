'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';

import { useDocumentStore } from '@/data/document-store';
import { PLANNING_SECTION_TITLE } from '@/features/planning/paths';
import { SALES_SECTION_TITLE } from '@/features/sales-fact/paths';
import { IconMenu, IconUndo } from '@/features/shell/icons';

const SECTIONS = [
  { href: '/planning', label: PLANNING_SECTION_TITLE },
  { href: '/', label: 'Сводка' },
  { href: '/sales', label: SALES_SECTION_TITLE },
] as const;

const PRODUCTION_SECTION_TITLE = 'Производство';

const PRODUCTION_NAV = [
  { href: '/production/plan', label: 'Планируемое производство' },
  { href: '/production/fact', label: 'Фактическое производство' },
  { href: '/production/journal', label: 'Журнал производства' },
] as const;

const QUESTIONS_HREF = '/questions';
const QUESTIONS_LABEL = 'Вопросы';

function sectionIsCurrent(pathname: string, href: string): boolean {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function currentNavLabel(pathname: string): string | undefined {
  if (sectionIsCurrent(pathname, QUESTIONS_HREF)) {
    return QUESTIONS_LABEL;
  }

  const productionItem = PRODUCTION_NAV.find((item) => sectionIsCurrent(pathname, item.href));
  if (productionItem) {
    return productionItem.label;
  }

  return SECTIONS.find((section) => sectionIsCurrent(pathname, section.href))?.label;
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

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-paper">
      {menuOpen ? (
        <button
          type="button"
          aria-label="Закрыть меню"
          className="fixed inset-0 z-20 bg-ink/40 lg:hidden"
          onClick={() => setMenuOpen(false)}
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
            onClick={() => setMenuOpen(false)}
            className="font-figure text-lg leading-tight tracking-tight text-white outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Мясное
            <br />
            производство
          </Link>
        </div>

        <nav aria-label="Разделы" className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2">
          {SECTIONS.map((section) => {
            const currentSection = sectionIsCurrent(pathname, section.href);
            return (
              <Link
                key={section.href}
                href={section.href}
                aria-current={currentSection ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
                className={`relative px-3 py-2 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  currentSection
                    ? 'bg-sidebar-active text-white'
                    : 'text-sidebar-muted hover:bg-white/5 hover:text-white'
                }`}
              >
                {currentSection ? (
                  <span className="absolute inset-y-2 left-0 w-0.5 bg-mark" aria-hidden="true" />
                ) : null}
                {section.label}
              </Link>
            );
          })}

          <div>
            <p className="px-3 py-2 text-sm text-sidebar-muted">{PRODUCTION_SECTION_TITLE}</p>
            <div className="flex flex-col">
              {PRODUCTION_NAV.map((item) => {
                const currentSection = sectionIsCurrent(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={currentSection ? 'page' : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`relative py-1 pr-3 pl-6 text-xs leading-5 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                      currentSection
                        ? 'bg-sidebar-active text-white'
                        : 'text-sidebar-muted hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {currentSection ? (
                      <span className="absolute inset-y-1 left-0 w-0.5 bg-mark" aria-hidden="true" />
                    ) : null}
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="border-t border-sidebar-line">
          <MockReset />
          <Link
            href={QUESTIONS_HREF}
            aria-current={sectionIsCurrent(pathname, QUESTIONS_HREF) ? 'page' : undefined}
            onClick={() => setMenuOpen(false)}
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
