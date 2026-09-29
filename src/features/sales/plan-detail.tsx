"use client";

import Link from "next/link";
import { useId, useMemo, useState, type ReactNode } from "react";

import type { PrototypeDocument, SalesPlan, SalesPlanLine } from "@/domain/document";
import {
  daysInMonth,
  missingPlanProducts,
  planPhase,
  salesPlanLineMetrics,
  salesPlanTotals,
  type PlanPhase,
  type SalesPlanRejection,
  type SalesPlanTotals,
} from "@/domain/sales-plan";
import { fieldClassName, primaryButtonClassName } from "@/features/materials/fields";
import { formatMoney } from "@/features/materials/money";
import { PlanLineCards, PlanLineTable, type PlanRow } from "@/features/sales/plan-lines";
import { summaryHref } from "@/features/sales/paths";
import {
  daysPhrase,
  formatContribution,
  formatMonth,
  formatPerDay,
  formatPieces,
  placeName,
  SALES_PLAN_ERROR,
} from "@/features/sales/text";
import { useSales } from "@/features/sales/use-sales";
import {
  IconArrowLeft,
  IconClose,
  IconPlus,
  IconTrash,
  IconUndo,
} from "@/features/shell/icons";
import { PageFrame } from "@/features/shell/page-frame";

type LineSort = "name" | "volume" | "revenue" | "contribution" | "profitability";

export function PlanDetailScreen({ id }: { id: string }) {
  const sales = useSales();
  const today = useMemo(() => new Date(), []);
  const plan = [...sales.plans, ...sales.deletedPlans].find((item) => item.id === id);

  if (!sales.hydrated) {
    return (
      <PageFrame title="План продаж" lede="Запись открывается." full>
        {null}
      </PageFrame>
    );
  }

  if (!plan) {
    return (
      <PageFrame title="План продаж" lede="Такого плана нет." full>
        <BackLink href={summaryHref()} label="К сводке" />
      </PageFrame>
    );
  }

  return <PlanBody plan={plan} today={today} />;
}

function PlanBody({ plan, today }: { plan: SalesPlan; today: Date }) {
  const sales = useSales();
  const [query, setQuery] = useState("");
  const [workshopId, setWorkshopId] = useState("");
  const [onlyVolume, setOnlyVolume] = useState(false);
  const [sort, setSort] = useState<LineSort>("name");
  const [toolsOpen, setToolsOpen] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const deleted = plan.deletedAt !== null;
  const phase = planPhase(plan.month, today);
  const editable = sales.hydrated && !deleted && phase !== "past";
  const title = formatMonth(plan.month);
  const totals = salesPlanTotals(sales.document, plan);
  const rows = plan.lines.map((line) => toRow(sales.document, plan, line));
  const missing = editable ? missingPlanProducts(sales.document, plan) : [];
  const filtersOn =
    query.trim().length > 0 || workshopId.length > 0 || onlyVolume || sort !== "name";
  const visible = rows
    .filter((row) => matches(row, query, workshopId, onlyVolume))
    .sort((left, right) => compareRows(left, right, sort));

  function resetFilters() {
    setQuery("");
    setWorkshopId("");
    setOnlyVolume(false);
    setSort("name");
  }

  function commitPrice(lineId: string, priceWithVatKopecks: number) {
    const line = plan.lines.find((item) => item.id === lineId);
    if (!line) {
      return "missing" as const;
    }

    return sales.updateLine(plan.id, lineId, priceWithVatKopecks, line.volumePieces);
  }

  function commitVolume(lineId: string, volumePieces: number) {
    const line = plan.lines.find((item) => item.id === lineId);
    if (!line) {
      return "missing" as const;
    }

    return sales.updateLine(plan.id, lineId, line.priceWithVatKopecks, volumePieces);
  }

  function addMissing() {
    const lines = missing.map((product) => ({
      id: `sales-plan-line:${crypto.randomUUID()}`,
      productId: product.id,
    }));
    const rejection = sales.addMissing(plan.id, lines);
    setAddError(rejection ? SALES_PLAN_ERROR[rejection] : null);
  }

  return (
    <PageFrame
      title={title}
      full
      lede={planLede(deleted, phase, daysInMonth(plan.month))}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <BackLink
            href={summaryHref(deleted)}
            label={deleted ? "К удалённым планам" : "К сводке"}
          />
          <PlanActions
            deleted={deleted}
            disabled={!sales.hydrated}
            title={title}
            onDelete={() => sales.removePlan(plan.id)}
            onRestore={() => sales.restorePlan(plan.id)}
          />
        </div>

        <TotalsStrip totals={totals} />

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

        <PlanTools
          query={query}
          workshopId={workshopId}
          onlyVolume={onlyVolume}
          sort={sort}
          toolsOpen={toolsOpen}
          workshops={sales.document.workshops}
          visibleCount={visible.length}
          totalCount={rows.length}
          filtersOn={filtersOn}
          onQuery={setQuery}
          onWorkshop={setWorkshopId}
          onOnlyVolume={setOnlyVolume}
          onSort={setSort}
          onToolsOpen={setToolsOpen}
          onReset={resetFilters}
        />

        {rows.length === 0 ? (
          <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
            В плане нет товаров.
          </p>
        ) : visible.length === 0 ? (
          <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
            Ничего не найдено. Измените поиск или сбросьте фильтр.
          </p>
        ) : (
          <>
            <PlanLineCards
              rows={visible}
              editable={editable}
              onPrice={commitPrice}
              onVolume={commitVolume}
            />
            <PlanLineTable
              rows={visible}
              totals={totals}
              editable={editable}
              onPrice={commitPrice}
              onVolume={commitVolume}
            />
          </>
        )}
      </div>
    </PageFrame>
  );
}

function planLede(deleted: boolean, phase: PlanPhase, days: number): string {
  const length = `План на ${daysPhrase(days)}.`;
  if (deleted) {
    return `План удалён. ${length}`;
  }
  if (phase === "past") {
    return `Месяц прошёл, план только для просмотра. ${length}`;
  }
  if (phase === "current") {
    return `Текущий месяц. ${length}`;
  }

  return `Будущий месяц. ${length}`;
}

function toRow(
  document: PrototypeDocument,
  plan: SalesPlan,
  line: SalesPlanLine,
): PlanRow {
  const product = document.derivatives.find((item) => item.id === line.productId);
  return {
    lineId: line.id,
    name: product?.name ?? "Не найдено",
    workshop: placeName(document.workshops, product?.workshopId ?? null),
    workshopId: product?.workshopId ?? "",
    vatPercent: product?.vatPercent ?? null,
    deletedProduct: !product || product.deletedAt !== null,
    priceWithVatKopecks: line.priceWithVatKopecks,
    volumePieces: line.volumePieces,
    metrics: salesPlanLineMetrics(document, plan, line),
  };
}

function matches(
  row: PlanRow,
  query: string,
  workshopId: string,
  onlyVolume: boolean,
): boolean {
  if (onlyVolume && row.volumePieces === 0) {
    return false;
  }
  if (workshopId && row.workshopId !== workshopId) {
    return false;
  }

  const needle = query.trim().toLocaleLowerCase("ru-RU");
  if (!needle) {
    return true;
  }

  return `${row.name}\n${row.workshop}`.toLocaleLowerCase("ru-RU").includes(needle);
}

function compareRows(left: PlanRow, right: PlanRow, sort: LineSort): number {
  if (sort === "name") {
    return left.name.localeCompare(right.name, "ru");
  }
  if (sort === "volume") {
    return (
      right.volumePieces - left.volumePieces || left.name.localeCompare(right.name, "ru")
    );
  }

  const leftValue =
    sort === "revenue"
      ? left.metrics.revenueExVatKopecks
      : sort === "contribution"
        ? left.metrics.contributionKopecks
        : left.metrics.profitabilityHundredths;
  const rightValue =
    sort === "revenue"
      ? right.metrics.revenueExVatKopecks
      : sort === "contribution"
        ? right.metrics.contributionKopecks
        : right.metrics.profitabilityHundredths;
  return (
    compareNullable(leftValue, rightValue) || left.name.localeCompare(right.name, "ru")
  );
}

function compareNullable(left: number | null, right: number | null): number {
  if (left === null && right === null) {
    return 0;
  }
  if (left === null) {
    return 1;
  }
  if (right === null) {
    return -1;
  }

  return right - left;
}

function TotalsStrip({ totals }: { totals: SalesPlanTotals }) {
  const showAverage = totals.volumePieces !== null && totals.volumePieces > 0;

  return (
    <div className="flex flex-col gap-px border border-line bg-line">
      <div className="grid grid-cols-2 gap-px lg:grid-cols-4">
        <StripCell label="Объём">
          {totals.volumePieces === null ? (
            "—"
          ) : (
            <>
              {formatPieces(totals.volumePieces)} шт
              {totals.perDay === null ? null : (
                <span className="mt-1 block text-muted">
                  {formatPerDay(totals.perDay)} в сутки
                </span>
              )}
            </>
          )}
        </StripCell>
        <StripCell label="Выручка">
          {totals.revenueWithVatKopecks === null ? (
            "—"
          ) : totals.revenueExVatKopecks === null ? (
            `${formatMoney(totals.revenueWithVatKopecks)} с НДС`
          ) : (
            <StripPair
              withVat={totals.revenueWithVatKopecks}
              exVat={totals.revenueExVatKopecks}
            />
          )}
        </StripCell>
        <StripCell label="Себестоимость объёма">
          {totals.volumeCostWithVatKopecks === null ||
          totals.volumeCostExVatKopecks === null ? (
            "—"
          ) : (
            <>
              <StripPair
                withVat={totals.volumeCostWithVatKopecks}
                exVat={totals.volumeCostExVatKopecks}
              />
              {totals.costComplete ? null : (
                <span className="mt-1 block text-muted">не по всем товарам</span>
              )}
            </>
          )}
        </StripCell>
        <StripCell label="Т-проток">
          {!totals.costComplete || !totals.revenueComplete
            ? "не по всем товарам"
            : totals.contributionKopecks === null
              ? "—"
              : formatContribution(totals.contributionKopecks)}
        </StripCell>
      </div>
      {showAverage ? (
        <div className="grid grid-cols-1 gap-px sm:grid-cols-2">
          <StripCell label="Средняя цена 1 шт">
            {totals.averagePriceWithVatKopecks === null ? (
              "—"
            ) : totals.averagePriceExVatKopecks === null ? (
              `${formatMoney(totals.averagePriceWithVatKopecks)} с НДС`
            ) : (
              <StripPair
                withVat={totals.averagePriceWithVatKopecks}
                exVat={totals.averagePriceExVatKopecks}
              />
            )}
          </StripCell>
          <StripCell label="Себестоимость 1 шт">
            {!totals.costComplete ? (
              "не по всем товарам"
            ) : totals.averageCostWithVatKopecks === null ||
              totals.averageCostExVatKopecks === null ? (
              "—"
            ) : (
              <StripPair
                withVat={totals.averageCostWithVatKopecks}
                exVat={totals.averageCostExVatKopecks}
              />
            )}
          </StripCell>
        </div>
      ) : null}
    </div>
  );
}

function StripPair({ withVat, exVat }: { withVat: number; exVat: number }) {
  return (
    <>
      <span className="block whitespace-nowrap">{formatMoney(withVat)}</span>
      <span className="block text-muted">с НДС</span>
      <span className="mt-2 block whitespace-nowrap">{formatMoney(exVat)}</span>
      <span className="block text-muted">без НДС</span>
    </>
  );
}

function StripCell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 bg-sheet px-4 py-3">
      <p className="text-sm text-muted">{label}</p>
      <div className="text-sm leading-6 break-words text-ink">{children}</div>
    </div>
  );
}

function PlanTools({
  query,
  workshopId,
  onlyVolume,
  sort,
  toolsOpen,
  workshops,
  visibleCount,
  totalCount,
  filtersOn,
  onQuery,
  onWorkshop,
  onOnlyVolume,
  onSort,
  onToolsOpen,
  onReset,
}: {
  query: string;
  workshopId: string;
  onlyVolume: boolean;
  sort: LineSort;
  toolsOpen: boolean;
  workshops: PrototypeDocument["workshops"];
  visibleCount: number;
  totalCount: number;
  filtersOn: boolean;
  onQuery: (value: string) => void;
  onWorkshop: (value: string) => void;
  onOnlyVolume: (value: boolean) => void;
  onSort: (value: LineSort) => void;
  onToolsOpen: (value: boolean) => void;
  onReset: () => void;
}) {
  const searchId = useId();
  const workshopSelectId = useId();
  const sortId = useId();
  const volumeId = useId();
  const places = [
    ...workshops.filter((item) => item.deletedAt === null),
    ...workshops.filter((item) => item.deletedAt !== null),
  ];

  return (
    <div className="sticky top-16 z-[9] -mx-4 bg-paper px-4 py-3 sm:-mx-6 sm:px-6 lg:top-0">
      <div className="flex flex-col gap-4 border border-line bg-sheet p-4">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_auto] md:items-end">
          <div className="min-w-0">
            <label htmlFor={searchId} className="text-sm text-muted">
              Поиск
            </label>
            <input
              id={searchId}
              type="search"
              value={query}
              autoComplete="off"
              placeholder="Название товара"
              onChange={(event) => onQuery(event.target.value)}
              className={`mt-1.5 ${fieldClassName}`}
            />
          </div>
          <button
            type="button"
            aria-expanded={toolsOpen}
            onClick={() => onToolsOpen(!toolsOpen)}
            className="inline-flex h-11 items-center justify-center border border-line bg-paper px-4 text-sm text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:hidden"
          >
            Фильтры
          </button>
        </div>
        <div
          className={
            toolsOpen
              ? "grid gap-4 md:grid-cols-3"
              : "hidden gap-4 md:grid md:grid-cols-3"
          }
        >
          <div className="min-w-0">
            <label htmlFor={workshopSelectId} className="text-sm text-muted">
              Цех
            </label>
            <select
              id={workshopSelectId}
              value={workshopId}
              onChange={(event) => onWorkshop(event.target.value)}
              className={`mt-1.5 ${fieldClassName}`}
            >
              <option value="">Все цеха</option>
              {places.map((place) => (
                <option key={place.id} value={place.id}>
                  {place.deletedAt ? `${place.name} (удалён)` : place.name}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-0">
            <label htmlFor={sortId} className="text-sm text-muted">
              Сортировка
            </label>
            <select
              id={sortId}
              value={sort}
              onChange={(event) => onSort(event.target.value as LineSort)}
              className={`mt-1.5 ${fieldClassName}`}
            >
              <option value="name">По названию</option>
              <option value="volume">По объёму</option>
              <option value="revenue">По выручке без НДС</option>
              <option value="contribution">По Т-протоку</option>
              <option value="profitability">По рентабельности</option>
            </select>
          </div>
          <div className="flex items-end">
            <label
              htmlFor={volumeId}
              className="inline-flex h-11 w-full items-center gap-2 border border-line bg-paper px-3 text-sm text-ink"
            >
              <input
                id={volumeId}
                type="checkbox"
                checked={onlyVolume}
                onChange={(event) => onOnlyVolume(event.target.checked)}
                className="size-4 accent-ink"
              />
              Только с объёмом
            </label>
          </div>
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
    </div>
  );
}

function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex h-11 items-center gap-2 text-sm text-ink outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <IconArrowLeft />
      {label}
    </Link>
  );
}

function PlanActions({
  deleted,
  disabled,
  title,
  onDelete,
  onRestore,
}: {
  deleted: boolean;
  disabled: boolean;
  title: string;
  onDelete: () => void;
  onRestore: () => SalesPlanRejection | null;
}) {
  const [error, setError] = useState<string | null>(null);

  if (deleted) {
    return (
      <div className="flex flex-col items-stretch gap-2 sm:items-end">
        <button
          type="button"
          aria-label={`Вернуть план «${title}»`}
          disabled={disabled}
          onClick={() => {
            const rejection = onRestore();
            setError(rejection ? SALES_PLAN_ERROR[rejection] : null);
          }}
          className="inline-flex h-11 items-center justify-center gap-2 border border-line bg-sheet px-4 text-sm text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
        >
          <IconUndo />
          Вернуть
        </button>
        {error ? <p className="text-sm text-ink">{error}</p> : null}
      </div>
    );
  }

  return (
    <button
      type="button"
      aria-label={`Удалить план «${title}»`}
      title="Удалить"
      disabled={disabled}
      onClick={() => {
        const confirmed = window.confirm(
          `Удалить план «${title}»? Он пропадёт из рабочего списка. Вернуть можно среди удалённых.`,
        );
        if (confirmed) {
          onDelete();
        }
      }}
      className="inline-flex size-11 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
    >
      <IconTrash />
    </button>
  );
}
