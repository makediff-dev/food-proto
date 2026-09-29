"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";

import type { SalesPlan } from "@/domain/document";
import {
  availablePlanMonths,
  compareSalesPlans,
  daysInMonth,
  planPhase,
  salesPlanTotals,
  type SalesPlanRejection,
} from "@/domain/sales-plan";
import { fieldClassName, primaryButtonClassName } from "@/features/materials/fields";
import { formatMoney } from "@/features/materials/money";
import { CreatePlanDialog } from "@/features/sales/create-plan-dialog";
import { planHref, summaryHref } from "@/features/sales/paths";
import {
  daysPhrase,
  formatContribution,
  formatMoneyPair,
  formatMonth,
  formatPerDay,
  formatPieces,
  monthYear,
  phaseLabel,
  productCountPhrase,
  SALES_PLAN_ERROR,
} from "@/features/sales/text";
import { useSales } from "@/features/sales/use-sales";
import { IconClose, IconPlan, IconUndo } from "@/features/shell/icons";
import { PageFrame } from "@/features/shell/page-frame";

type PhaseFilter = "all" | "ahead" | "past";

export function SummaryScreen({ showDeleted }: { showDeleted: boolean }) {
  const sales = useSales();
  const today = useMemo(() => new Date(), []);
  const [createOpen, setCreateOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");
  const [phase, setPhase] = useState<PhaseFilter>("all");
  const source = showDeleted ? sales.deletedPlans : sales.plans;
  const plans = source
    .slice()
    .sort((left, right) => compareSalesPlans(left, right, today));
  const years = Array.from(new Set(plans.map((item) => monthYear(item.month)))).sort();
  const available = availablePlanMonths(sales.document, today);
  const filtersOn = query.trim().length > 0 || year.length > 0 || phase !== "all";
  const visible = plans.filter((item) => matches(item, query, year, phase, today));

  function resetFilters() {
    setQuery("");
    setYear("");
    setPhase("all");
  }

  return (
    <PageFrame
      title="Сводка"
      wide
      lede="Планы продаж по месяцам: цена, объём, выручка, себестоимость и Т-проток."
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {showDeleted ? null : available.length === 0 ? (
              <p className="text-sm leading-6 text-muted">
                Планы на ближайшие два года уже есть.
              </p>
            ) : (
              <button
                type="button"
                disabled={!sales.hydrated}
                onClick={() => setCreateOpen(true)}
                className={`w-full sm:w-auto ${primaryButtonClassName}`}
              >
                <IconPlan />
                Создать план
              </button>
            )}
          </div>
          <Link
            href={summaryHref(!showDeleted)}
            aria-current={showDeleted ? "page" : undefined}
            className={`inline-flex h-11 items-center justify-center gap-2 border px-3 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
              showDeleted
                ? "border-ink bg-ink text-white"
                : "border-line bg-sheet text-ink hover:border-ink"
            }`}
          >
            <IconUndo />
            Удалённые
            {sales.deletedPlans.length > 0 ? ` ${sales.deletedPlans.length}` : ""}
          </Link>
        </div>

        {createOpen ? <CreatePlanDialog onClose={() => setCreateOpen(false)} /> : null}

        {plans.length === 0 ? (
          <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
            {showDeleted
              ? "Удалённых планов нет."
              : "Планов нет. Создайте план на текущий или будущий месяц."}
          </p>
        ) : (
          <>
            <PlanFilters
              query={query}
              year={year}
              phase={phase}
              years={years}
              visibleCount={visible.length}
              totalCount={plans.length}
              filtersOn={filtersOn}
              onQuery={setQuery}
              onYear={setYear}
              onPhase={setPhase}
              onReset={resetFilters}
            />
            {visible.length === 0 ? (
              <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
                Ничего не найдено. Измените поиск или сбросьте фильтр.
              </p>
            ) : (
              <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {visible.map((item) => (
                  <PlanCard
                    key={item.id}
                    plan={item}
                    today={today}
                    showDeleted={showDeleted}
                    disabled={!sales.hydrated}
                    onRestore={() => sales.restorePlan(item.id)}
                  />
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </PageFrame>
  );
}

function matches(
  plan: SalesPlan,
  query: string,
  year: string,
  phase: PhaseFilter,
  today: Date,
): boolean {
  if (year && monthYear(plan.month) !== year) {
    return false;
  }

  const current = planPhase(plan.month, today);
  if (phase === "ahead" && current === "past") {
    return false;
  }
  if (phase === "past" && current !== "past") {
    return false;
  }

  const needle = query.trim().toLocaleLowerCase("ru-RU");
  if (!needle) {
    return true;
  }

  const haystack = [formatMonth(plan.month), plan.month, phaseLabel(current)]
    .join("\n")
    .toLocaleLowerCase("ru-RU");
  return haystack.includes(needle);
}

function PlanFilters({
  query,
  year,
  phase,
  years,
  visibleCount,
  totalCount,
  filtersOn,
  onQuery,
  onYear,
  onPhase,
  onReset,
}: {
  query: string;
  year: string;
  phase: PhaseFilter;
  years: string[];
  visibleCount: number;
  totalCount: number;
  filtersOn: boolean;
  onQuery: (value: string) => void;
  onYear: (value: string) => void;
  onPhase: (value: PhaseFilter) => void;
  onReset: () => void;
}) {
  const searchId = useId();
  const yearId = useId();
  const phases: { id: PhaseFilter; label: string }[] = [
    { id: "all", label: "Все" },
    { id: "ahead", label: "Впереди" },
    { id: "past", label: "Прошедшие" },
  ];

  return (
    <div className="flex flex-col gap-4 border border-line bg-sheet p-4">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(9rem,0.6fr)]">
        <div className="min-w-0">
          <label htmlFor={searchId} className="text-sm text-muted">
            Поиск
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            autoComplete="off"
            placeholder="Месяц, например сент"
            onChange={(event) => onQuery(event.target.value)}
            className={`mt-1.5 ${fieldClassName}`}
          />
        </div>
        <div className="min-w-0">
          <label htmlFor={yearId} className="text-sm text-muted">
            Год
          </label>
          <select
            id={yearId}
            value={year}
            onChange={(event) => onYear(event.target.value)}
            className={`mt-1.5 ${fieldClassName}`}
          >
            <option value="">Все годы</option>
            {years.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 border border-line bg-paper p-1">
        {phases.map((item) => {
          const selected = item.id === phase;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onPhase(item.id)}
              className={`inline-flex h-11 items-center justify-center px-2 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                selected ? "bg-ink text-white" : "text-muted hover:text-ink"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Показано {visibleCount} из {totalCount}
        </p>
        {filtersOn ? (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-11 items-center justify-center gap-2 border border-line bg-paper px-4 text-sm text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <IconClose />
            Сбросить
          </button>
        ) : null}
      </div>
    </div>
  );
}

function PlanCard({
  plan,
  today,
  showDeleted,
  disabled,
  onRestore,
}: {
  plan: SalesPlan;
  today: Date;
  showDeleted: boolean;
  disabled: boolean;
  onRestore: () => SalesPlanRejection | null;
}) {
  const sales = useSales();
  const [error, setError] = useState<string | null>(null);
  const title = formatMonth(plan.month);
  const totals = salesPlanTotals(sales.document, plan);
  const phase = planPhase(plan.month, today);

  return (
    <li className="relative border border-line bg-sheet">
      <Link
        href={planHref(plan.id)}
        aria-label={`План ${title}`}
        className="absolute inset-0 z-0 outline-none hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      />
      <div className="pointer-events-none relative z-10 flex items-start gap-2 p-4">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <span className="text-base font-semibold text-ink">{title}</span>
            <span className="text-sm text-muted">{phaseLabel(phase)}</span>
          </div>
          <p className="text-sm text-muted">{daysPhrase(daysInMonth(plan.month))}</p>
          <dl className="flex flex-col gap-2 text-sm">
            <Fact label="Объём" value={volumeFact(totals)} />
            <Fact label="Выручка" value={revenueFact(totals)} />
            <Fact label="Т-проток" value={contributionFact(totals)} />
          </dl>
          <p className="text-sm text-muted">
            {productCountPhrase(totals.productsWithVolume, totals.lineCount)}
          </p>
          {showDeleted ? <p className="text-sm text-muted">Удалён</p> : null}
        </div>
        {showDeleted ? (
          <button
            type="button"
            aria-label={`Вернуть план ${title}`}
            title="Вернуть"
            disabled={disabled}
            onClick={() => {
              const rejection = onRestore();
              setError(rejection ? SALES_PLAN_ERROR[rejection] : null);
            }}
            className="pointer-events-auto inline-flex size-11 shrink-0 items-center justify-center text-ink outline-none hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
          >
            <IconUndo />
          </button>
        ) : null}
      </div>
      {error ? (
        <p className="pointer-events-none relative z-10 px-4 pb-4 text-sm text-ink">
          {error}
        </p>
      ) : null}
    </li>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className="break-words text-ink sm:text-right">{value}</dd>
    </div>
  );
}

function volumeFact(totals: ReturnType<typeof salesPlanTotals>): string {
  if (totals.volumePieces === null) {
    return "—";
  }

  const pieces = `${formatPieces(totals.volumePieces)} шт`;
  if (totals.perDay === null) {
    return pieces;
  }

  return `${pieces} · ${formatPerDay(totals.perDay)} в сутки`;
}

function revenueFact(totals: ReturnType<typeof salesPlanTotals>): string {
  if (totals.revenueWithVatKopecks === null) {
    return "—";
  }
  if (totals.revenueExVatKopecks === null) {
    return `${formatMoney(totals.revenueWithVatKopecks)} с НДС · без НДС не считается`;
  }

  return formatMoneyPair(totals.revenueWithVatKopecks, totals.revenueExVatKopecks);
}

function contributionFact(totals: ReturnType<typeof salesPlanTotals>): string {
  if (!totals.costComplete || !totals.revenueComplete) {
    return "не по всем товарам";
  }
  if (totals.contributionKopecks === null) {
    return "—";
  }

  return formatContribution(totals.contributionKopecks);
}
