"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, type ReactNode } from "react";

import { isMonthKey } from "@/domain/document";
import { productionPlan } from "@/domain/production-plan";
import { activeSalesPlans, horizonMonths, monthKeyFromDate } from "@/domain/sales-plan";
import { useDocumentStore } from "@/data/document-store";
import { fieldClassName } from "@/features/materials/fields";
import { FactCompare } from "@/features/production/fact-compare";
import { FactJournal } from "@/features/production/fact-journal";
import { PlanPanel } from "@/features/production/plan-panel";
import {
  PRODUCTION_SECTION_TITLE,
  productionHref,
  type ProductionPart,
  type ProductionSheet,
  type ProductionView,
} from "@/features/production/paths";
import { summaryHref } from "@/features/sales/paths";
import { formatMonth } from "@/features/sales/text";
import { IconFact, IconFlow, IconPlan, IconWorkshop } from "@/features/shell/icons";
import { PageFrame } from "@/features/shell/page-frame";

const VIEWS: { id: ProductionView; label: string }[] = [
  { id: "plan", label: "План" },
  { id: "fact", label: "Факт" },
];

const PARTS: { id: ProductionPart; label: string }[] = [
  { id: "output", label: "План по производству" },
  { id: "input", label: "План по расходам" },
];

const SHEETS: { id: ProductionSheet; label: string }[] = [
  { id: "journal", label: "Записи" },
  { id: "compare", label: "Сравнение с планом" },
];

const COMPARE_PARTS: { id: ProductionPart; label: string }[] = [
  { id: "output", label: "Производство" },
  { id: "input", label: "Расход" },
];

export function ProductionScreen({
  view,
  part,
  month,
  sheet,
  showDeleted,
}: {
  view: ProductionView;
  part: ProductionPart;
  month: string;
  sheet: ProductionSheet;
  showDeleted: boolean;
}) {
  const router = useRouter();
  const { document } = useDocumentStore();
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selected = isMonthKey(month) ? month : currentMonth;
  const months = useMemo(() => {
    const values = new Set<string>([
      ...horizonMonths(today),
      ...activeSalesPlans(document).map((item) => item.month),
      ...document.productionFacts
        .map((item) => item.occurredOn.slice(0, 7))
        .filter((item) => isMonthKey(item)),
    ]);
    if (isMonthKey(selected)) {
      values.add(selected);
    }

    return [...values].sort();
  }, [document, selected, today]);
  const result = useMemo(() => productionPlan(document, selected), [document, selected]);
  const planId = result.status === "missing-plan" ? null : result.planId;

  function openMonth(next: string) {
    router.push(
      productionHref(view, part, next, currentMonth, {
        sheet: view === "fact" ? sheet : "journal",
        showDeleted: view === "fact" && showDeleted,
      }),
      { scroll: false },
    );
  }

  return (
    <PageFrame
      title={PRODUCTION_SECTION_TITLE}
      wide
      lede={
        view === "fact"
          ? "Сколько фактически выпустили за день и сколько ингредиентов на это ушло. За месяц факт сравнивается с планом."
          : "Сколько выпустить и сколько сырья и производных уйдёт по плану продаж выбранного месяца."
      }
    >
      <div className="flex flex-col gap-6">
        <div className="border border-line bg-sheet">
          <div className="flex items-end gap-3 p-4 sm:gap-6 sm:p-5">
            <div className="min-w-0 flex-1 sm:max-w-xs">
              <label htmlFor="production-month" className="text-sm text-muted">
                Месяц
              </label>
              <select
                id="production-month"
                value={selected}
                onChange={(event) => openMonth(event.target.value)}
                className={`mt-2 ${fieldClassName}`}
              >
                {months.map((item) => (
                  <option key={item} value={item}>
                    {formatMonth(item)}
                  </option>
                ))}
              </select>
            </div>
            {planId ? (
              <Link
                href={summaryHref({ month: selected, currentMonth })}
                className={headerLinkClassName}
              >
                <IconPlan />
                Открыть план
              </Link>
            ) : null}
          </div>

          <nav aria-label="План и факт" className="grid grid-cols-2 border-t border-line">
            {VIEWS.map((item) => (
              <TabLink
                key={item.id}
                href={productionHref(item.id, part, selected, currentMonth, {
                  sheet: item.id === "fact" ? sheet : "journal",
                  showDeleted: item.id === "fact" && showDeleted,
                })}
                selected={view === item.id}
                label={item.label}
                icon={item.id === "plan" ? <IconPlan /> : <IconFact />}
                tone="solid"
              />
            ))}
          </nav>

          {view === "plan" ? (
            <nav
              aria-label="Части плана"
              className="grid grid-cols-2 border-t border-line"
            >
              {PARTS.map((item) => (
                <TabLink
                  key={item.id}
                  href={productionHref("plan", item.id, selected, currentMonth)}
                  selected={part === item.id}
                  label={item.label}
                  icon={item.id === "output" ? <IconWorkshop /> : <IconFlow />}
                  tone="quiet"
                />
              ))}
            </nav>
          ) : (
            <nav
              aria-label="Записи и сравнение"
              className="grid grid-cols-2 border-t border-line"
            >
              {SHEETS.map((item) => (
                <TabLink
                  key={item.id}
                  href={productionHref("fact", part, selected, currentMonth, {
                    sheet: item.id,
                  })}
                  selected={sheet === item.id}
                  label={item.label}
                  icon={item.id === "journal" ? <IconFact /> : <IconPlan />}
                  tone="quiet"
                />
              ))}
            </nav>
          )}

          {view === "fact" && sheet === "compare" ? (
            <nav
              aria-label="Производство и расход"
              className="grid grid-cols-2 border-t border-line"
            >
              {COMPARE_PARTS.map((item) => (
                <TabLink
                  key={item.id}
                  href={productionHref("fact", item.id, selected, currentMonth, {
                    sheet: "compare",
                  })}
                  selected={part === item.id}
                  label={item.label}
                  icon={item.id === "output" ? <IconWorkshop /> : <IconFlow />}
                  tone="quiet"
                />
              ))}
            </nav>
          ) : null}
        </div>

        {view === "fact" && sheet === "journal" ? (
          <FactJournal month={selected} showDeleted={showDeleted} />
        ) : null}
        {view === "fact" && sheet === "compare" ? (
          <FactCompare month={selected} part={part} />
        ) : null}

        {view === "plan" ? (
          result.status === "ready" ? (
            <PlanPanel
              key={`${selected}:${part}`}
              document={document}
              part={part}
              outputs={result.outputs}
              inputs={result.inputs}
              totals={result.totals}
            />
          ) : (
            <MissingPlan
              status={result.status}
              month={selected}
              currentMonth={currentMonth}
            />
          )
        ) : null}
      </div>
    </PageFrame>
  );
}

function TabLink({
  href,
  selected,
  label,
  icon,
  tone,
}: {
  href: string;
  selected: boolean;
  label: string;
  icon: ReactNode;
  tone: "solid" | "quiet";
}) {
  const solid = tone === "solid";
  const selectedClass = solid
    ? "bg-ink text-white"
    : "bg-paper text-ink shadow-[inset_0_-2px_0_0_var(--color-ink)]";
  const idleClass = solid
    ? "text-muted hover:bg-paper hover:text-ink"
    : "text-muted hover:bg-paper hover:text-ink";

  return (
    <Link
      href={href}
      aria-current={selected ? "page" : undefined}
      className={`flex min-h-12 min-w-0 items-center justify-center gap-2 px-3 py-3 text-center text-sm leading-5 outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink ${
        selected ? selectedClass : idleClass
      }`}
    >
      {icon}
      <span className="max-w-full text-balance">{label}</span>
    </Link>
  );
}

function MissingPlan({
  status,
  month,
  currentMonth,
}: {
  status: "missing-plan" | "empty-volume";
  month: string;
  currentMonth: string;
}) {
  return (
    <div className="border border-line bg-sheet px-5 py-8 sm:px-6">
      <p className="text-base text-ink">
        {status === "missing-plan" ? "Сначала задайте план." : "В плане нет объёма."}
      </p>
      <Link
        href={summaryHref({ month, currentMonth })}
        className={`mt-6 ${quietLinkClassName}`}
      >
        <IconPlan />К сводке
      </Link>
    </div>
  );
}

const headerLinkClassName =
  "inline-flex h-11 shrink-0 items-center justify-center gap-2 border border-line bg-sheet px-3 text-sm whitespace-nowrap text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:px-4";

const quietLinkClassName =
  "inline-flex h-11 w-full items-center justify-center gap-2 border border-line bg-sheet px-4 text-sm whitespace-nowrap text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:w-auto";
