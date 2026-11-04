import type { Metadata } from 'next';
import { Onest, Unbounded } from 'next/font/google';

import { DocumentProvider } from '@/data/DocumentProvider';
import { RoleProvider } from '@/features/roles/RoleProvider';
import { AppShell } from '@/features/shell/AppShell';

import './globals.css';

const onest = Onest({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-onest',
});

const unbounded = Unbounded({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-unbounded',
  weight: '500',
});

export const metadata: Metadata = {
  title: {
    default: 'Учёт — прототип',
    template: '%s — учёт',
  },
  description: 'Прототип финансового и товарного учёта готовой еды',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ru" className={`${onest.variable} ${unbounded.variable} h-dvh overflow-hidden antialiased`}>
      <body className="flex h-full flex-col overflow-hidden font-sans">
        <DocumentProvider>
          <RoleProvider>
            <AppShell>{children}</AppShell>
          </RoleProvider>
        </DocumentProvider>
      </body>
    </html>
  );
}
