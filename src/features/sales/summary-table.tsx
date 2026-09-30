"use client";

import { useId, useState, type ReactNode } from "react";

import type { SalesPlanRejection } from "@/domain/sales-plan";
import type { SummaryRow, SummarySide, SummaryVariance } from "@/domain/summary";
import { FIELD_ERROR, parseWholePercent } from "@/features/materials/fields";
import { formatMoney } from "@/features/materials/money";
import {
  formatPercentHundredths,
  formatPerDay,
  formatPieces,
  formatPriceExVat,
  parsePlanPrice,
  parseVolumePieces,
  priceDraft,
  SALES_PLAN_ERROR,
  volumeDraft,
} from "@/features/sales/text";
import type { UnitCost } from "@/domain/cost";

const gridFieldClassName =
  "w-full min-w-0 cursor-text appearance-none border-0 bg-transparent p-0 text-right text-sm text-ink shadow-none outline-none";

const editableCellClassName = "bg-[#e4e4e0]";

const HANGING_WORDS = new Set([
  "а",
  "без",
  "бы",
  "в",
  "во",
  "для",
  "до",
  "же",
  "за",
  "и",
  "из",
  "к",
  "ко",
  "ли",
  "на",
  "не",
  "ни",
  "но",
  "о",
  "об",
  "от",
  "по",
  "под",
  "при",
  "с",
  "со",
  "у",
]);

function keepWithNext(text: string): string {
  const parts = text.split(" ");
  let line = "";
  for (let index = 0; index < parts.length; index += 1) {
    line += parts[index] ?? "";
    if (index === parts.length - 1) {
      break;
    }
    const bare = (parts[index] ?? "")
      .toLowerCase()
      .replace(/^[^a-zа-яё]+|[^a-zа-яё]+$/gi, "");
    line += HANGING_WORDS.has(bare) ? "\u00A0" : " ";
  }
  return line;
}

function ColumnLabel({ label }: { label: string }) {
  const chunks = keepWithNext(label).split(" ");
  return (
    <span className="mx-auto block w-min text-center">
      {chunks.map((chunk, index) => (
        <span key={`${index}:${chunk}`} className="block whitespace-nowrap">
          {chunk}
        </span>
      ))}
    </span>
  );
}

type SideKey =
  | "unitCost"
  | "profitability"
  | "price"
  | "volume"
  | "revenue"
  | "contribution"
  | "volumeCost"
  | "perDay"
  | "vat";

type VarianceKey = "revenue" | "contribution";

const SIDE_COLUMNS: { key: SideKey; label: string }[] = [
  { key: "unitCost", label: "Себест" },
  { key: "profitability", label: "Рентаб" },
  { key: "price", label: "Цена" },
  { key: "volume", label: "Объём продаж" },
  { key: "revenue", label: "Выручка" },
  { key: "contribution", label: "Т-проток" },
  { key: "volumeCost", label: "Себест объёма" },
  { key: "perDay", label: "В сутки" },
  { key: "vat", label: "НДС" },
];

const VARIANCE_COLUMNS: { key: VarianceKey; label: string }[] = [
  { key: "revenue", label: "Выручка" },
  { key: "contribution", label: "Т-проток" },
];

const LAST_PLAN_KEY = SIDE_COLUMNS.at(-1)?.key;
const LAST_FACT_KEY = SIDE_COLUMNS.at(-1)?.key;

function sectionRightClass(kind: "plan" | "fact" | "variance", key: string): string {
  if (kind === "plan" && key === LAST_PLAN_KEY) {
    return "border-r-[1.5px] border-r-muted";
  }
  if (kind === "fact" && key === LAST_FACT_KEY) {
    return "border-r-[1.5px] border-r-muted";
  }

  return "border-r border-r-line";
}

export function SummaryTable({
  rows,
  planTotals,
  factTotals,
  variance,
  editable,
  vatEditable,
  expanded = false,
  onPlanLineAction,
  onProductVatAction,
}: {
  rows: SummaryRow[];
  planTotals: SummarySide | null;
  factTotals: SummarySide;
  variance: SummaryVariance;
  editable: boolean;
  vatEditable: boolean;
  expanded?: boolean;
  onPlanLineAction: (
    lineId: string,
    priceWithVatKopecks: number,
    volumePieces: number,
  ) => SalesPlanRejection | null;
  onProductVatAction: (productId: string, vatPercent: number) => string | null;
}) {
  return (
    <div
      className={
        expanded
          ? "h-dvh contain-paint overflow-auto bg-sheet"
          : "max-h-[calc(100dvh-14rem)] contain-paint overflow-auto border border-line bg-sheet"
      }
    >
      <table className="w-max min-w-full border-separate border-spacing-0 text-sm">
        <caption className="sr-only">Сводка месяца: план, факт и отклонение</caption>
        <thead className="sticky top-0 z-30">
          <tr>
            <th className="sticky left-0 z-40 border-b border-b-line border-r-[1.5px] border-r-muted bg-paper" />
            <th
              colSpan={SIDE_COLUMNS.length}
              scope="colgroup"
              className="border-b border-b-line border-r-[1.5px] border-r-muted bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-ink"
            >
              {keepWithNext("Плановые показатели")}
            </th>
            <th
              colSpan={SIDE_COLUMNS.length}
              scope="colgroup"
              className="border-b border-b-line border-r-[1.5px] border-r-muted bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-ink"
            >
              {keepWithNext("Фактические показатели")}
            </th>
            <th
              colSpan={VARIANCE_COLUMNS.length}
              scope="colgroup"
              className="border-b border-b-line bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-ink"
            >
              Отклонение
            </th>
          </tr>
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-40 w-px max-w-max whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-muted"
            >
              Товар
            </th>
            {SIDE_COLUMNS.map((column) => (
              <th
                key={`plan:${column.key}`}
                scope="col"
                className={`w-px whitespace-normal border-b border-b-line ${sectionRightClass("plan", column.key)} bg-paper px-1.5 py-2 text-center align-middle text-sm font-normal leading-5 text-muted last:border-r-0`}
              >
                <ColumnLabel label={column.label} />
              </th>
            ))}
            {SIDE_COLUMNS.map((column) => (
              <th
                key={`fact:${column.key}`}
                scope="col"
                className={`w-px whitespace-normal border-b border-b-line ${sectionRightClass("fact", column.key)} bg-paper px-1.5 py-2 text-center align-middle text-sm font-normal leading-5 text-muted last:border-r-0`}
              >
                <ColumnLabel label={column.label} />
              </th>
            ))}
            {VARIANCE_COLUMNS.map((column) => (
              <th
                key={`var:${column.key}`}
                scope="col"
                className="w-px whitespace-normal border-r border-r-line border-b border-b-line bg-paper px-1.5 py-2 text-center align-middle text-sm font-normal leading-5 text-muted last:border-r-0"
              >
                <ColumnLabel label={column.label} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.productId}>
              <th
                scope="row"
                className="sticky left-0 z-10 w-px max-w-max whitespace-nowrap border-b border-b-line border-r-[1.5px] border-r-muted bg-sheet px-3 py-2 text-left align-middle font-normal"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-ink">{row.name}</span>
                  {row.deleted ? (
                    <span className="text-sm text-muted">удалён</span>
                  ) : null}
                </div>
              </th>
              {SIDE_COLUMNS.map((column) => {
                const canEdit =
                  !row.deleted &&
                  ((editable &&
                    row.planLineId !== null &&
                    (column.key === "price" || column.key === "volume")) ||
                    (vatEditable && column.key === "vat"));
                return (
                  <td
                    key={`plan:${column.key}`}
                    className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle last:border-r-0 ${sectionRightClass("plan", column.key)} ${
                      canEdit && (column.key === "volume" || column.key === "vat")
                        ? editableCellClassName
                        : ""
                    }`}
                    onClick={(event) => {
                      if (!canEdit) {
                        return;
                      }
                      const field = event.currentTarget.querySelector("input");
                      if (
                        field instanceof HTMLInputElement &&
                        document.activeElement !== field
                      ) {
                        field.focus();
                      }
                    }}
                  >
                    <PlanCell
                      column={column.key}
                      row={row}
                      editable={editable && !row.deleted}
                      vatEditable={vatEditable && !row.deleted}
                      onPlanLine={onPlanLineAction}
                      onProductVat={onProductVatAction}
                    />
                  </td>
                );
              })}
              {SIDE_COLUMNS.map((column) => (
                <td
                  key={`fact:${column.key}`}
                  className={`w-px border-b border-b-line px-1.5 py-2 text-right align-middle last:border-r-0 ${sectionRightClass("fact", column.key)}`}
                >
                  <SideCell column={column.key} side={row.fact} kind="row" />
                </td>
              ))}
              {VARIANCE_COLUMNS.map((column) => (
                <td
                  key={`var:${column.key}`}
                  className="w-px border-r border-r-line border-b border-b-line px-1.5 py-2 text-right align-middle last:border-r-0"
                >
                  <VarianceCell column={column.key} variance={row.variance} />
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <th
              scope="row"
              className="sticky left-0 z-10 w-px max-w-max whitespace-nowrap border-t-[1.5px] border-t-muted border-b border-b-line border-r-[1.5px] border-r-muted bg-paper px-3 py-2 text-left align-middle font-normal text-ink"
            >
              Всего
            </th>
            {SIDE_COLUMNS.map((column) => (
              <td
                key={`plan-total:${column.key}`}
                className={`w-px border-t-[1.5px] border-t-muted border-b border-b-line bg-paper px-1.5 py-2 text-right align-middle last:border-r-0 ${sectionRightClass("plan", column.key)}`}
              >
                {planTotals ? (
                  <SideCell column={column.key} side={planTotals} kind="total" />
                ) : (
                  <Empty />
                )}
              </td>
            ))}
            {SIDE_COLUMNS.map((column) => (
              <td
                key={`fact-total:${column.key}`}
                className={`w-px border-t-[1.5px] border-t-muted border-b border-b-line bg-paper px-1.5 py-2 text-right align-middle last:border-r-0 ${sectionRightClass("fact", column.key)}`}
              >
                <SideCell column={column.key} side={factTotals} kind="total" />
              </td>
            ))}
            {VARIANCE_COLUMNS.map((column) => (
              <td
                key={`var-total:${column.key}`}
                className="w-px border-t-[1.5px] border-t-muted border-r border-r-line border-b border-b-line bg-paper px-1.5 py-2 text-right align-middle last:border-r-0"
              >
                <VarianceCell column={column.key} variance={variance} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function PlanCell({
  column,
  row,
  editable,
  vatEditable,
  onPlanLine,
  onProductVat,
}: {
  column: SideKey;
  row: SummaryRow;
  editable: boolean;
  vatEditable: boolean;
  onPlanLine: (
    lineId: string,
    priceWithVatKopecks: number,
    volumePieces: number,
  ) => SalesPlanRejection | null;
  onProductVat: (productId: string, vatPercent: number) => string | null;
}) {
  if (column === "vat") {
    return (
      <GridNumber
        label={`НДС, ${row.name}`}
        value={String(row.plan?.vatPercent ?? row.fact.vatPercent ?? "")}
        disabled={!vatEditable}
        inputMode="numeric"
        unit="%"
        invalidMessage={FIELD_ERROR.vat}
        parse={parseWholePercent}
        onCommit={(next) => onProductVat(row.productId, next)}
      />
    );
  }

  if (!row.plan || row.planLineId === null) {
    return <Empty />;
  }

  if (column === "price") {
    return (
      <StackedPair
        topHighlighted={editable}
        topLabel="с НДС"
        bottomLabel="без НДС"
        top={
          <GridNumber
            label={`Плановая цена с НДС, ${row.name}`}
            value={priceDraft(row.planPriceWithVatKopecks ?? 0)}
            disabled={!editable}
            inputMode="decimal"
            unit="₽"
            invalidMessage={SALES_PLAN_ERROR.price}
            parse={parsePlanPrice}
            onCommit={(next) => {
              const rejection = onPlanLine(
                row.planLineId ?? "",
                next,
                row.planVolumePieces ?? 0,
              );
              return rejection ? SALES_PLAN_ERROR[rejection] : null;
            }}
          />
        }
        bottom={
          row.plan.priceExVatTenThousandths === null ? (
            <Empty />
          ) : (
            <span className="whitespace-nowrap">
              {formatPriceExVat(row.plan.priceExVatTenThousandths)}
            </span>
          )
        }
      />
    );
  }

  if (column === "volume") {
    return (
      <GridNumber
        label={`Плановый объём, ${row.name}`}
        value={volumeDraft(row.planVolumePieces ?? 0)}
        disabled={!editable}
        inputMode="numeric"
        unit="шт"
        invalidMessage={SALES_PLAN_ERROR.volume}
        parse={parseVolumePieces}
        onCommit={(next) => {
          const rejection = onPlanLine(
            row.planLineId ?? "",
            row.planPriceWithVatKopecks ?? 0,
            next,
          );
          return rejection ? SALES_PLAN_ERROR[rejection] : null;
        }}
      />
    );
  }

  return <SideCell column={column} side={row.plan} kind="row" />;
}

function SideCell({
  column,
  side,
  kind,
}: {
  column: SideKey;
  side: SummarySide;
  kind: "row" | "total";
}) {
  switch (column) {
    case "unitCost":
      if (kind === "total") {
        if (!side.costComplete) {
          return <Muted>{keepWithNext("не по всем товарам")}</Muted>;
        }

        return (
          <VatMoneyOrEmpty
            withVat={side.averageCostWithVatKopecks}
            exVat={side.averageCostExVatKopecks}
          />
        );
      }
      return <UnitCostValue cost={side.unitCost} />;
    case "profitability":
      if (kind === "total" && !side.costComplete) {
        return <Empty />;
      }
      return side.profitabilityHundredths === null ? (
        <Empty />
      ) : (
        <span className="whitespace-nowrap">
          {formatPercentHundredths(side.profitabilityHundredths)}
        </span>
      );
    case "price":
      if (side.priceExVatTenThousandths !== null && side.priceWithVatKopecks !== null) {
        return (
          <StackedPair
            topLabel="с НДС"
            bottomLabel="без НДС"
            top={<MoneyAmount kopecks={side.priceWithVatKopecks} />}
            bottom={
              <span className="whitespace-nowrap">
                {formatPriceExVat(side.priceExVatTenThousandths)}
              </span>
            }
          />
        );
      }
      return (
        <VatMoneyOrEmpty
          withVat={side.priceWithVatKopecks}
          exVat={side.priceExVatKopecks}
        />
      );
    case "volume":
      return side.volumePieces === null ? (
        <Empty />
      ) : (
        <span className="whitespace-nowrap">{formatPieces(side.volumePieces)} шт</span>
      );
    case "revenue":
      if (kind === "total" && !side.revenueComplete) {
        return <Muted>{keepWithNext("не по всем товарам")}</Muted>;
      }
      return (
        <VatMoneyOrEmpty
          withVat={side.revenueWithVatKopecks}
          exVat={side.revenueExVatKopecks}
        />
      );
    case "contribution":
      if (kind === "total" && (!side.costComplete || !side.revenueComplete)) {
        return <Muted>{keepWithNext("не по всем товарам")}</Muted>;
      }
      return side.contributionKopecks === null ? (
        <Empty />
      ) : (
        <MoneyAmount kopecks={side.contributionKopecks} />
      );
    case "volumeCost":
      if (kind === "total" && !side.costComplete) {
        return <Muted>{keepWithNext("не по всем товарам")}</Muted>;
      }
      return (
        <VatMoneyOrEmpty
          withVat={side.volumeCostWithVatKopecks}
          exVat={side.volumeCostExVatKopecks}
        />
      );
    case "perDay":
      return side.perDay === null ? (
        <Empty />
      ) : (
        <span className="whitespace-nowrap">{formatPerDay(side.perDay)}</span>
      );
    case "vat":
      if (kind === "total") {
        return side.vatPercentHundredths === null ? (
          <Empty />
        ) : (
          <span className="whitespace-nowrap">
            {formatPercentHundredths(side.vatPercentHundredths)}
          </span>
        );
      }
      return side.vatPercent === null ? (
        <Empty />
      ) : (
        <span className="whitespace-nowrap">{side.vatPercent} %</span>
      );
    default:
      return <Empty />;
  }
}

function VarianceCell({
  column,
  variance,
}: {
  column: VarianceKey;
  variance: SummaryVariance;
}) {
  if (column === "revenue") {
    return (
      <VatMoneyOrEmpty
        withVat={variance.revenueWithVatKopecks}
        exVat={variance.revenueExVatKopecks}
      />
    );
  }

  return variance.contributionKopecks === null ? (
    <Empty />
  ) : (
    <MoneyAmount kopecks={variance.contributionKopecks} />
  );
}

function UnitCostValue({ cost }: { cost: UnitCost | null }) {
  if (!cost) {
    return <Muted>{keepWithNext("Себестоимость не считается")}</Muted>;
  }

  return (
    <VatPair
      withVat={<MoneyAmount kopecks={cost.withVatKopecks} />}
      exVat={<MoneyAmount kopecks={cost.exVatKopecks} />}
    />
  );
}

function MoneyAmount({ kopecks }: { kopecks: number }) {
  return <span className="whitespace-nowrap">{formatMoney(kopecks)}</span>;
}

function VatMoneyOrEmpty({
  withVat,
  exVat,
}: {
  withVat: number | null;
  exVat: number | null;
}) {
  if (withVat === null && exVat === null) {
    return <Empty />;
  }

  return (
    <VatPair
      withVat={withVat === null ? <Empty /> : <MoneyAmount kopecks={withVat} />}
      exVat={exVat === null ? <Empty /> : <MoneyAmount kopecks={exVat} />}
    />
  );
}

function VatPair({
  withVat,
  exVat,
  withVatHighlighted = false,
}: {
  withVat: ReactNode;
  exVat: ReactNode;
  withVatHighlighted?: boolean;
}) {
  return (
    <StackedPair
      topLabel="с НДС"
      bottomLabel="без НДС"
      topHighlighted={withVatHighlighted}
      top={withVat}
      bottom={exVat}
    />
  );
}

function StackedPair({
  topLabel,
  bottomLabel,
  top,
  bottom,
  topHighlighted = false,
}: {
  topLabel: string;
  bottomLabel: string;
  top: ReactNode;
  bottom: ReactNode;
  topHighlighted?: boolean;
}) {
  return (
    <div className="-mx-1.5 -my-2 flex min-w-18 flex-col">
      <div
        className={`flex flex-col items-end border-b border-line px-1.5 py-1 ${
          topHighlighted ? editableCellClassName : ""
        }`}
      >
        <span className="text-[0.5rem] leading-none text-muted">{topLabel}</span>
        {top}
      </div>
      <div className="flex flex-col items-end px-1.5 py-1">
        <span className="text-[0.5rem] leading-none text-muted">{bottomLabel}</span>
        {bottom}
      </div>
    </div>
  );
}

function Empty() {
  return <span className="text-muted">—</span>;
}

function Muted({ children }: { children: string }) {
  return <span className="text-sm text-muted">{children}</span>;
}

function sanitizeDraft(raw: string, mode: "decimal" | "numeric"): string {
  let result = "";
  let hasComma = false;

  for (const char of raw) {
    if (char >= "0" && char <= "9") {
      result += char;
      continue;
    }

    if (mode === "decimal" && (char === "," || char === ".") && !hasComma) {
      result += ",";
      hasComma = true;
    }
  }

  return result;
}

function GridNumber({
  label,
  value,
  disabled,
  inputMode,
  unit,
  invalidMessage,
  parse,
  onCommit,
}: {
  label: string;
  value: string;
  disabled: boolean;
  inputMode: "decimal" | "numeric";
  unit?: string;
  invalidMessage: string;
  parse: (raw: string) => number | null;
  onCommit: (value: number) => string | null;
}) {
  const inputId = useId();
  const errorId = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const shown = draft ?? value;

  function commit(raw: string) {
    const parsed = parse(raw);
    if (parsed === null) {
      setError(invalidMessage);
      setDraft(raw);
      return;
    }

    const rejection = onCommit(parsed);
    if (rejection) {
      setError(rejection);
      setDraft(raw);
      return;
    }

    setDraft(null);
    setError(null);
  }

  if (disabled) {
    return (
      <>
        <span className="sr-only">{label}</span>
        <span className="whitespace-nowrap">
          {shown}
          {unit ? ` ${unit}` : ""}
        </span>
      </>
    );
  }

  return (
    <div className="min-w-0">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div className="flex items-baseline justify-end gap-1">
        <input
          id={inputId}
          value={shown}
          inputMode={inputMode}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onFocus={() => {
            setDraft(sanitizeDraft(value, inputMode));
            setError(null);
          }}
          onChange={(event) => setDraft(sanitizeDraft(event.target.value, inputMode))}
          onBlur={(event) => commit(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.currentTarget.blur();
            }
          }}
          className={gridFieldClassName}
        />
        {unit ? <span className="shrink-0 text-sm text-ink">{unit}</span> : null}
      </div>
      {error ? (
        <p id={errorId} className="mt-1 text-sm text-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}
