'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';

import { useDocumentStore } from '@/data/document-store';
import { SALES_FACT_SECTION_TITLE } from '@/features/sales-fact/paths';
import { IconMenu, IconUndo } from '@/features/shell/icons';

const SECTIONS = [
  { href: '/', label: 'Сводка' },
  { href: '/sales-fact', label: SALES_FACT_SECTION_TITLE },
] as const;

const QUESTIONS_HREF = '/questions';
const QUESTIONS_LABEL = 'Вопросы';

function sectionIsCurrent(pathname: string, href: string): boolean {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const questionsCurrent = sectionIsCurrent(pathname, QUESTIONS_HREF);
  const current = questionsCurrent
    ? { href: QUESTIONS_HREF, label: QUESTIONS_LABEL }
    : SECTIONS.find((section) => sectionIsCurrent(pathname, section.href));

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
    <div className="min-h-full bg-paper">
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

        <nav
          aria-label="Разделы"
          className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2"
        >
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
                  <span
                    className="absolute inset-y-2 left-0 w-0.5 bg-mark"
                    aria-hidden="true"
                  />
                ) : null}
                {section.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-line">
          <MockReset />
          <Link
            href={QUESTIONS_HREF}
            aria-current={questionsCurrent ? 'page' : undefined}
            onClick={() => setMenuOpen(false)}
            className={`relative mx-2 mb-3 block px-3 py-2 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              questionsCurrent
                ? 'bg-sidebar-active text-white'
                : 'text-sidebar-muted hover:bg-white/5 hover:text-white'
            }`}
          >
            {questionsCurrent ? (
              <span
                className="absolute inset-y-2 left-0 w-0.5 bg-mark"
                aria-hidden="true"
              />
            ) : null}
            {QUESTIONS_LABEL}
          </Link>
        </div>
      </aside>

      <div className="min-w-0 lg:pl-64">
        <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-line bg-paper px-4 py-2 lg:hidden">
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
          <p className="text-sm text-ink">{current?.label}</p>
        </header>
        {children}
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
      <p
        className="text-xs leading-5 text-sidebar-muted"
        role={storageError ? 'alert' : undefined}
      >
        {storageError ??
          (usingLocalData
            ? 'Сохранено в этом браузере.'
            : 'Показаны мок-данные.')}
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
