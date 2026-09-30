"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";

import {
  activeFinalProducts,
  daysInMonth,
  missingPlanProducts,
  monthKeyFromDate,
  planPhase,
  shiftMonth,
  workingSalesPlan,
} from "@/domain/sales-plan";
import { lastHorizonMonth, monthSummary, summaryMonthOpen } from "@/domain/summary";
import {
  FIELD_ERROR,
  fieldClassName,
  primaryButtonClassName,
} from "@/features/materials/fields";
import { materialListHref } from "@/features/materials/paths";
import { SummaryHeadlineTable } from "@/features/sales/summary-headline";
import { summaryHref } from "@/features/sales/paths";
import { SummaryTable } from "@/features/sales/summary-table";
import {
  daysPhrase,
  OPERATING_EXPENSE_ERROR,
  SALES_PLAN_ERROR,
} from "@/features/sales/text";
import { useSales } from "@/features/sales/use-sales";
import {
  IconChevronLeft,
  IconChevronRight,
  IconFullscreen,
  IconFullscreenExit,
  IconPlus,
} from "@/features/shell/icons";
import { PageFrame } from "@/features/shell/page-frame";

export function SummaryScreen({ month }: { month: string }) {
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const selectedMonth = resolveMonth(month, today);

  return <Workspace month={selectedMonth} currentMonth={currentMonth} today={today} />;
}

function Workspace({
  month,
  currentMonth,
  today,
}: {
  month: string;
  currentMonth: string;
  today: Date;
}) {
  const sales = useSales();
  const router = useRouter();
  const monthFieldId = useId();
  const [fullscreen, setFullscreen] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const storedPlan = workingSalesPlan(sales.document, month);
  const summary = useMemo(
    () => monthSummary(sales.document, month),
    [sales.document, month],
  );
  const products = activeFinalProducts(sales.document);
  const phase = planPhase(month, today);
  const editable = sales.hydrated && phase !== "past" && products.length > 0;
  const vatEditable = sales.hydrated;
  const missing =
    editable && storedPlan ? missingPlanProducts(sales.document, storedPlan) : [];
  const previousMonth = shiftMonth(month, -1);
  const nextMonth = shiftMonth(month, 1);
  const horizonEnd = lastHorizonMonth(today);
  const hasTable = summary.rows.length > 0;
  const tableExpanded = fullscreen && hasTable;

  useEffect(() => {
    if (!tableExpanded) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setFullscreen(false);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [tableExpanded]);

  function open(nextMonthKey: string) {
    router.push(summaryHref({ month: nextMonthKey, currentMonth }), { scroll: false });
  }

  function addMissing() {
    if (!storedPlan) {
      return;
    }

    const lines = missing.map((product) => ({
      id: `sales-plan-line:${crypto.randomUUID()}`,
      productId: product.id,
    }));
    const rejection = sales.addMissing(storedPlan.id, lines);
    setAddError(rejection ? SALES_PLAN_ERROR[rejection] : null);
  }

  return (
    <>
      <PageFrame
        title="Сводка"
        full
        lede={lede(phase, daysInMonth(month))}
        intro={
          <div className="w-full border border-line bg-sheet p-4">
            <label htmlFor={monthFieldId} className="text-sm text-muted">
              Месяц
            </label>
            <div className="mt-2 flex items-center gap-2">
              <MonthStep
                label="Предыдущий месяц"
                direction="previous"
                disabled={!summaryMonthOpen(previousMonth, today)}
                onClick={() => open(previousMonth)}
              />
              <input
                id={monthFieldId}
                type="month"
                min="2000-01"
                max={horizonEnd}
                value={month}
                onChange={(event) => {
                  const next = event.target.value;
                  if (summaryMonthOpen(next, today)) {
                    open(next);
                  }
                }}
                className={`!w-48 shrink-0 ${fieldClassName}`}
              />
              <MonthStep
                label="Следующий месяц"
                direction="next"
                disabled={nextMonth > horizonEnd}
                onClick={() => open(nextMonth)}
              />
            </div>
          </div>
        }
        aside={
          <SummaryHeadlineTable
            headline={summary.headline}
            month={month}
            editable={sales.hydrated}
            onOperatingExpense={(side, amountExVatKopecks) => {
              const rejection = sales.updateOperatingExpense(
                month,
                side,
                amountExVatKopecks,
              );
              return rejection ? OPERATING_EXPENSE_ERROR[rejection] : null;
            }}
          />
        }
      >
        <div className="flex flex-col gap-4">
          {missing.length > 0 ? (
            <div className="flex flex-col gap-3 border border-line bg-sheet p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-ink">
                В справочнике есть товары, которых нет в этом плане.
              </p>
              <div className="flex flex-col gap-2 sm:items-end">
                <button
                  type="button"
                  onClick={addMissing}
                  className={`w-full sm:w-auto ${primaryButtonClassName}`}
                >
                  <IconPlus />
                  Добавить новые товары
                </button>
                {addError ? <p className="text-sm text-ink">{addError}</p> : null}
              </div>
            </div>
          ) : null}

          {products.length === 0 && summary.rows.length === 0 ? (
            <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
              Сначала добавьте конечный товар.{" "}
              <Link
                href={materialListHref("products", false)}
                className="text-ink underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                К товарам
              </Link>
            </p>
          ) : hasTable ? (
            <div
              className={tableExpanded ? "fixed inset-0 z-50 bg-paper" : undefined}
              role={tableExpanded ? "dialog" : undefined}
              aria-label={tableExpanded ? "Таблица на весь экран" : undefined}
              aria-modal={tableExpanded ? true : undefined}
            >
              <SummaryTable
                rows={summary.rows}
                planTotals={summary.planTotalsSide}
                factTotals={summary.factTotals}
                variance={summary.variance}
                editable={editable}
                vatEditable={vatEditable}
                expanded={tableExpanded}
                onPlanLineAction={(lineId, priceWithVatKopecks, volumePieces) => {
                  return sales.updateMonthLine(
                    month,
                    lineId,
                    priceWithVatKopecks,
                    volumePieces,
                  );
                }}
                onProductVatAction={(productId, vatPercent) => {
                  const rejection = sales.updateProductVat(productId, vatPercent);
                  return rejection ? FIELD_ERROR[rejection] : null;
                }}
              />
            </div>
          ) : (
            <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
              Сначала добавьте конечный товар. Сводка строится по товарам.
            </p>
          )}
        </div>
      </PageFrame>

      {hasTable ? (
        <FullscreenToggle
          active={tableExpanded}
          onToggle={() => setFullscreen((current) => !current)}
        />
      ) : null}
    </>
  );
}

function lede(phase: ReturnType<typeof planPhase>, days: number): string {
  const length = `В месяце ${daysPhrase(days)}.`;
  if (phase === "past") {
    return `Месяц прошёл, план только для просмотра. Факт считается из дней раздела «Факт. продажи и производство». ${length}`;
  }

  return `План, факт и отклонение выбранного месяца. Факт считается из дней раздела «Факт. продажи и производство». ${length}`;
}

function resolveMonth(month: string, today: Date): string {
  if (summaryMonthOpen(month, today)) {
    return month;
  }

  return monthKeyFromDate(today);
}

function MonthStep({
  label,
  direction,
  disabled,
  onClick,
}: {
  label: string;
  direction: "previous" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-11 items-center justify-center border border-line bg-sheet text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40"
    >
      {direction === "previous" ? <IconChevronLeft /> : <IconChevronRight />}
    </button>
  );
}

function FullscreenToggle({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={active ? "Обычный режим" : "На весь экран"}
      aria-pressed={active}
      title={active ? "Обычный режим" : "На весь экран"}
      onClick={onToggle}
      className="fixed right-5 bottom-5 z-60 inline-flex size-12 items-center justify-center rounded-full border border-line bg-sheet text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      {active ? <IconFullscreenExit /> : <IconFullscreen />}
    </button>
  );
}
