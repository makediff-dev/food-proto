import type { Metadata } from 'next';
import { Onest, Unbounded } from 'next/font/google';

import { DocumentProvider } from '@/data/DocumentProvider';
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
  description: 'Прототип финансового и товарного учёта мясного производства',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ru" className={`${onest.variable} ${unbounded.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <DocumentProvider>
          <AppShell>{children}</AppShell>
        </DocumentProvider>
      </body>
    </html>
  );
}
