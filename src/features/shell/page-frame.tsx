import type { ReactNode } from "react";

export function PageFrame({
  title,
  lede,
  wide = false,
  full = false,
  intro,
  aside,
  children,
}: {
  title: string;
  lede: string;
  wide?: boolean;
  full?: boolean;
  /** Под заголовком и фразой, в той же колонке слева. */
  intro?: ReactNode;
  /** Справа, параллельно заголовку, фразе и intro. */
  aside?: ReactNode;
  children?: ReactNode;
}) {
  const titleBlock = (
    <div className="min-w-0 flex-1">
      <h1 className="font-figure text-2xl leading-tight tracking-tight text-ink">
        {title}
      </h1>
      <p
        className={
          full
            ? "mt-2 w-full max-w-none text-sm leading-6 text-muted"
            : "mt-2 max-w-2xl text-sm leading-6 text-muted"
        }
      >
        {lede}
      </p>
      {intro ? <div className="mt-3">{intro}</div> : null}
    </div>
  );

  return (
    <div
      className={
        full
          ? "w-full px-4 py-5 sm:px-6 sm:py-6"
          : wide
            ? "mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-6"
            : "mx-auto w-full max-w-6xl px-4 py-4 sm:px-5"
      }
    >
      {aside ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          {titleBlock}
          <div className="w-full shrink-0 sm:w-auto">{aside}</div>
        </div>
      ) : (
        titleBlock
      )}
      {children ? <div className={wide || full ? "mt-4" : "mt-3"}>{children}</div> : null}
    </div>
  );
}

export function PendingSection({
  title,
  lede,
  note,
}: {
  title: string;
  lede: string;
  note: string;
}) {
  return (
    <PageFrame title={title} lede={lede}>
      <div className="border border-line bg-sheet px-4 py-4">
        <p className="text-sm text-ink">Раздел в разработке.</p>
        <p className="mt-2 text-sm leading-6 text-muted">{note}</p>
      </div>
    </PageFrame>
  );
}
