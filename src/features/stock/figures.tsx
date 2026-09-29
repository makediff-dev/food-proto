import type { ReactNode } from "react";

import { formatMoney } from "@/features/materials/money";

export function Labeled({
  label,
  align = "start",
  children,
}: {
  label: string;
  align?: "start" | "end";
  children: ReactNode;
}) {
  const end = align === "end";

  return (
    <div
      className={`relative z-10 ${
        end ? "px-4 pb-3 lg:px-0 lg:pb-0 lg:text-right" : "px-4 pb-3 lg:px-0 lg:pb-0"
      }`}
    >
      <div className={`text-sm text-muted lg:sr-only ${end ? "lg:text-right" : ""}`}>
        {label}
      </div>
      <div
        className={`mt-1 text-sm text-ink lg:mt-0 ${end ? "tabular-nums lg:text-right" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}

export function MoneyPair({
  withVatKopecks,
  exVatKopecks,
  prominent = false,
}: {
  withVatKopecks: number;
  exVatKopecks: number;
  prominent?: boolean;
}) {
  const figure = prominent
    ? "mt-1 text-lg font-semibold tabular-nums text-ink"
    : "mt-1 text-sm tabular-nums text-ink";

  return (
    <dl className="grid grid-cols-2 gap-4">
      <div>
        <dt className="text-sm text-muted">С НДС</dt>
        <dd className={figure}>{formatMoney(withVatKopecks)}</dd>
      </div>
      <div>
        <dt className="text-sm text-muted">Без НДС</dt>
        <dd className={figure}>{formatMoney(exVatKopecks)}</dd>
      </div>
    </dl>
  );
}

export function MoneySummary({
  title,
  withVatKopecks,
  exVatKopecks,
  empty,
  hint,
}: {
  title: string;
  withVatKopecks?: number;
  exVatKopecks?: number;
  empty?: string;
  hint?: string;
}) {
  return (
    <section className="border border-line bg-sheet p-4">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      {empty || withVatKopecks === undefined || exVatKopecks === undefined ? (
        <p className="mt-3 text-sm leading-6 text-muted">{empty}</p>
      ) : (
        <div className="mt-4 max-w-md">
          <MoneyPair
            withVatKopecks={withVatKopecks}
            exVatKopecks={exVatKopecks}
            prominent
          />
        </div>
      )}
      {hint ? <p className="mt-3 text-sm leading-6 text-muted">{hint}</p> : null}
    </section>
  );
}
