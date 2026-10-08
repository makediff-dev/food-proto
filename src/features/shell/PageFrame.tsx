import type { ReactNode } from 'react';

export function PageFrame({
  title,
  back,
  lede,
  wide = false,
  full = false,
  fill = false,
  ledeFull = false,
  intro,
  aside,
  children,
}: {
  title: ReactNode;
  /** Слева от заголовка, обычно иконка «Назад». */
  back?: ReactNode;
  lede?: string;
  wide?: boolean;
  full?: boolean;
  /** Занять высоту родителя: шапка страницы сверху, children растягиваются. */
  fill?: boolean;
  /** Фраза под заголовком на всю ширину колонки, без узкого max-width. */
  ledeFull?: boolean;
  /** Под заголовком и фразой, на всю ширину колонки. */
  intro?: ReactNode;
  /** Справа, параллельно заголовку. Фраза и intro ниже — на всю ширину. */
  aside?: ReactNode;
  children?: ReactNode;
}) {
  const heading = (
    <h1 className="flex min-h-11 min-w-0 items-center font-figure text-2xl leading-tight tracking-tight text-ink">
      {title}
    </h1>
  );

  const titleRow = back ? (
    <div className="flex min-h-11 min-w-0 items-center gap-2">
      {back}
      {heading}
    </div>
  ) : (
    heading
  );

  const ledeBlock = lede ? (
    <p
      className={
        full || ledeFull
          ? 'mt-2 w-full max-w-none text-sm leading-6 text-muted'
          : 'mt-2 max-w-2xl text-sm leading-6 text-muted'
      }
    >
      {lede}
    </p>
  ) : null;

  const introBlock = intro ? <div className="mt-3">{intro}</div> : null;

  const titleBlock = (
    <div className="min-w-0 flex-1">
      {titleRow}
      {ledeBlock}
      {introBlock}
    </div>
  );

  const shellClass = fill
    ? full
      ? 'flex h-full min-h-0 flex-col overflow-hidden px-4 py-5 sm:px-6 sm:py-6'
      : wide
        ? 'mx-auto flex h-full min-h-0 w-full max-w-7xl flex-col overflow-hidden px-4 py-5 sm:px-6 sm:py-6'
        : 'mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col overflow-hidden px-4 py-4 sm:px-5'
    : full
      ? 'w-full px-4 py-5 sm:px-6 sm:py-6'
      : wide
        ? 'mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-6'
        : 'mx-auto w-full max-w-6xl px-4 py-4 sm:px-5';

  return (
    <div className={shellClass}>
      {aside ? (
        <div className="flex shrink-0 flex-col">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div className="min-w-0 flex-1">{titleRow}</div>
            <div className="w-full shrink-0 sm:w-auto">{aside}</div>
          </div>
          {ledeBlock}
          {introBlock}
        </div>
      ) : fill ? (
        <div className="shrink-0">{titleBlock}</div>
      ) : (
        titleBlock
      )}
      {children ? (
        <div
          className={
            fill
              ? wide || full
                ? 'mt-4 flex min-h-0 flex-1 flex-col'
                : 'mt-3 flex min-h-0 flex-1 flex-col'
              : wide || full
                ? 'mt-4'
                : 'mt-3'
          }
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
