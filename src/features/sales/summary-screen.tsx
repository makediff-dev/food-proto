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
  suggestedPriceWithVatKopecks,
  workingSalesPlan,
} from "@/domain/sales-plan";
import {
  canCreatePlanForMonth,
  lastHorizonMonth,
  monthSummary,
  summaryMonthOpen,
} from "@/domain/summary";
import {
  FIELD_ERROR,
  fieldClassName,
  primaryButtonClassName,
} from "@/features/materials/fields";
import { materialListHref } from "@/features/materials/paths";
import { summaryHref } from "@/features/sales/paths";
import { SummaryTable } from "@/features/sales/summary-table";
import { daysPhrase, formatMonth, SALES_PLAN_ERROR } from "@/features/sales/text";
import { useSales } from "@/features/sales/use-sales";
import {
  IconChevronLeft,
  IconChevronRight,
  IconFullscreen,
  IconFullscreenExit,
  IconPlan,
  IconPlus,
  IconTrash,
  IconUndo,
} from "@/features/shell/icons";
import { PageFrame } from "@/features/shell/page-frame";

export function SummaryScreen({
  month,
  showDeleted,
  planId,
}: {
  month: string;
  showDeleted: boolean;
  planId: string;
}) {
  const sales = useSales();
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);

  if (showDeleted && !planId) {
    return <DeletedList />;
  }

  const opened = planId
    ? (sales.document.salesPlans.find((item) => item.id === planId) ?? null)
    : null;
  const readOnly = showDeleted;
  const selectedMonth = readOnly
    ? (opened?.month ?? currentMonth)
    : resolveMonth(month, today);
  const plan = readOnly
    ? opened && opened.deletedAt !== null
      ? opened
      : null
    : workingSalesPlan(sales.document, selectedMonth);

  if (readOnly && !plan) {
    return (
      <PageFrame
        title="Сводка"
        full
        lede="План, факт и отклонение выбранного месяца. Факт считается из дней раздела «Факт продаж»."
      >
        <p className="border border-line bg-sheet px-4 py-4 text-sm text-ink">
          Запись не найдена.
        </p>
        <Link href={summaryHref({ showDeleted: true })} className={quietLinkClassName}>
          <IconUndo />К удалённым
        </Link>
      </PageFrame>
    );
  }

  return (
    <Workspace
      month={selectedMonth}
      currentMonth={currentMonth}
      today={today}
      readOnly={readOnly}
      planId={plan?.id ?? ""}
    />
  );
}

function Workspace({
  month,
  currentMonth,
  today,
  readOnly,
  planId,
}: {
  month: string;
  currentMonth: string;
  today: Date;
  readOnly: boolean;
  planId: string;
}) {
  const sales = useSales();
  const router = useRouter();
  const monthFieldId = useId();
  const [fullscreen, setFullscreen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const plan = readOnly
    ? (sales.document.salesPlans.find((item) => item.id === planId) ?? null)
    : workingSalesPlan(sales.document, month);
  const summary = useMemo(
    () => monthSummary(sales.document, month, plan),
    [sales.document, month, plan],
  );
  const products = activeFinalProducts(sales.document);
  const phase = planPhase(month, today);
  const editable = sales.hydrated && !readOnly && Boolean(plan) && phase !== "past";
  const vatEditable = sales.hydrated && !readOnly;
  const canCreate =
    sales.hydrated && !readOnly && canCreatePlanForMonth(sales.document, month, today);
  const missing = editable && plan ? missingPlanProducts(sales.document, plan) : [];
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
    router.push(
      summaryHref({
        month: nextMonthKey,
        currentMonth,
        showDeleted: readOnly,
        planId: readOnly ? planId : undefined,
      }),
      { scroll: false },
    );
  }

  function createPlan() {
    if (!canCreate || products.length === 0) {
      return;
    }

    const id = `sales-plan:${crypto.randomUUID()}`;
    const lines = products.map((product) => ({
      id: `sales-plan-line:${crypto.randomUUID()}`,
      productId: product.id,
      priceWithVatKopecks: suggestedPriceWithVatKopecks(
        sales.document,
        product.id,
        month,
      ),
      volumePieces: 0,
    }));
    const rejection = sales.addPlan(id, month, lines);
    setCreateError(rejection ? SALES_PLAN_ERROR[rejection] : null);
  }

  function addMissing() {
    if (!plan) {
      return;
    }

    const lines = missing.map((product) => ({
      id: `sales-plan-line:${crypto.randomUUID()}`,
      productId: product.id,
    }));
    const rejection = sales.addMissing(plan.id, lines);
    setAddError(rejection ? SALES_PLAN_ERROR[rejection] : null);
  }

  return (
    <>
      <PageFrame
        title="Сводка"
        full
        lede={lede(readOnly, phase, daysInMonth(month), Boolean(plan))}
      >
        <div className="flex flex-col gap-4">
          <div className="border border-line bg-sheet">
            <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex shrink-0 flex-wrap items-end gap-2">
                <div>
                  <label htmlFor={monthFieldId} className="text-sm text-muted">
                    Месяц
                  </label>
                  <div className="mt-2 flex items-center gap-2">
                    {readOnly ? null : (
                      <MonthStep
                        label="Предыдущий месяц"
                        direction="previous"
                        disabled={!summaryMonthOpen(previousMonth, today)}
                        onClick={() => open(previousMonth)}
                      />
                    )}
                    {readOnly ? (
                      <p className="text-sm text-ink">{formatMonth(month)}</p>
                    ) : (
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
                        className={`w-44 ${fieldClassName}`}
                      />
                    )}
                    {readOnly ? null : (
                      <MonthStep
                        label="Следующий месяц"
                        direction="next"
                        disabled={nextMonth > horizonEnd}
                        onClick={() => open(nextMonth)}
                      />
                    )}
                  </div>
                </div>
                {readOnly ? (
                  <RestoreButton
                    planId={planId}
                    month={month}
                    monthLabel={formatMonth(month)}
                  />
                ) : plan ? (
                  <DeletePlanButton
                    planId={plan.id}
                    monthLabel={formatMonth(month)}
                    disabled={!sales.hydrated}
                  />
                ) : canCreate && products.length > 0 ? (
                  <button
                    type="button"
                    onClick={createPlan}
                    className={primaryButtonClassName}
                  >
                    <IconPlan />
                    Создать план
                  </button>
                ) : null}
              </div>
              <Link
                href={summaryHref({ showDeleted: true })}
                className={quietLinkClassName}
              >
                <IconUndo />
                {readOnly ? "К удалённым" : "Удалённые"}
                {readOnly || sales.deletedPlans.length === 0
                  ? ""
                  : ` ${sales.deletedPlans.length}`}
              </Link>
            </div>
          </div>

          {createError ? <p className="text-sm text-ink">{createError}</p> : null}

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
                  if (!plan) {
                    return "missing";
                  }

                  return sales.updateLine(
                    plan.id,
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

function lede(
  deleted: boolean,
  phase: ReturnType<typeof planPhase>,
  days: number,
  hasPlan: boolean,
): string {
  const length = `В месяце ${daysPhrase(days)}.`;
  if (deleted) {
    return `План удалён, только просмотр. Факт считается из дней раздела «Факт продаж». ${length}`;
  }
  if (!hasPlan) {
    return `Плана на этот месяц нет. Факт считается из дней раздела «Факт продаж». ${length}`;
  }
  if (phase === "past") {
    return `Месяц прошёл, план только для просмотра. Факт считается из дней раздела «Факт продаж». ${length}`;
  }

  return `План, факт и отклонение выбранного месяца. Факт считается из дней раздела «Факт продаж». ${length}`;
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

function DeletePlanButton({
  planId,
  monthLabel,
  disabled,
}: {
  planId: string;
  monthLabel: string;
  disabled: boolean;
}) {
  const sales = useSales();

  return (
    <button
      type="button"
      aria-label={`Удалить план ${monthLabel}`}
      title="Удалить"
      disabled={disabled}
      onClick={() => {
        const confirmed = window.confirm(
          `Удалить план за ${monthLabel}? Он пропадёт из рабочего месяца. Вернуть можно среди удалённых.`,
        );
        if (confirmed) {
          sales.removePlan(planId);
        }
      }}
      className="inline-flex size-11 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-40"
    >
      <IconTrash />
    </button>
  );
}

function RestoreButton({
  planId,
  month,
  monthLabel,
}: {
  planId: string;
  month: string;
  monthLabel: string;
}) {
  const sales = useSales();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={!sales.hydrated}
        onClick={() => {
          const rejection = sales.restorePlan(planId);
          if (rejection) {
            setError(SALES_PLAN_ERROR[rejection]);
            return;
          }
          router.push(summaryHref({ month, currentMonth }));
        }}
        className="inline-flex h-11 items-center justify-center gap-2 border border-line bg-sheet px-4 text-sm text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
      >
        <IconUndo />
        Вернуть {monthLabel}
      </button>
      {error ? <p className="text-sm text-ink">{error}</p> : null}
    </div>
  );
}

function DeletedList() {
  const sales = useSales();
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const [error, setError] = useState<string | null>(null);
  const deleted = sales.deletedPlans
    .slice()
    .sort((left, right) => right.month.localeCompare(left.month));

  return (
    <PageFrame title="Сводка" full lede="Удалённые планы можно открыть и вернуть.">
      <div className="flex flex-col gap-4">
        <Link
          href={summaryHref({ month: currentMonth, currentMonth })}
          className={`w-full sm:w-auto ${quietLinkClassName}`}
        >
          <IconUndo />К рабочему месяцу
        </Link>
        {error ? <p className="text-sm text-ink">{error}</p> : null}
        {deleted.length === 0 ? (
          <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
            Удалённых планов нет.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {deleted.map((item) => (
              <li key={item.id} className="border border-line bg-sheet p-4">
                <p className="text-sm text-ink">{formatMonth(item.month)}</p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Link
                    href={summaryHref({
                      month: item.month,
                      currentMonth,
                      showDeleted: true,
                      planId: item.id,
                    })}
                    className={quietLinkClassName}
                  >
                    <IconPlan />
                    Открыть
                  </Link>
                  <button
                    type="button"
                    disabled={!sales.hydrated}
                    onClick={() => {
                      const rejection = sales.restorePlan(item.id);
                      setError(rejection ? SALES_PLAN_ERROR[rejection] : null);
                    }}
                    className={quietLinkClassName}
                  >
                    <IconUndo />
                    Вернуть
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageFrame>
  );
}

const quietLinkClassName =
  "inline-flex h-11 items-center justify-center gap-2 border border-line bg-sheet px-3 text-sm text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
