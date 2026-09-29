"use client";

import { useId, useState } from "react";

import {
  adjacentDay,
  type SalesFactDayView,
  type SalesFactInputs,
  type SalesFactRejection,
  type SalesFactRow,
  type SalesFactTotals,
} from "@/domain/sales-fact";
import { formatMoney } from "@/features/materials/money";
import {
  factPiecesDraft,
  factPriceDraft,
  formatSignedPieces,
  parseFactPieces,
  parseFactPrice,
  SALES_FACT_ERROR,
} from "@/features/sales-fact/text";
import { formatPercentHundredths, formatPriceExVat } from "@/features/sales/text";
import { IconChevronDown, IconChevronUp } from "@/features/shell/icons";

const gridFieldClassName =
  "w-full min-w-0 cursor-text appearance-none border-0 bg-transparent p-0 text-right text-sm text-ink shadow-none outline-none";

const editableCellClassName = "bg-[#e4e4e0]";

/** Предлоги, союзы и частицы, которые не оставляют в конце строки. */
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

type ColumnKey =
  | "productionStart"
  | "distributionStart"
  | "salesUnitCost"
  | "profitability"
  | "priceWithVat"
  | "priceExVat"
  | "salesPieces"
  | "revenueWithVat"
  | "revenueExVat"
  | "contribution"
  | "salesVolumeCost"
  | "vat"
  | "outputUnitCost"
  | "outputPieces"
  | "outputVolumeCost"
  | "transfer"
  | "staffMeals"
  | "samples"
  | "returns"
  | "writeOff"
  | "productionEnd"
  | "distributionEnd";

const COLUMNS: { key: ColumnKey; label: string; group: "sales" | "output" }[] = [
  {
    key: "productionStart",
    label: "Остаток на начало на производстве, шт",
    group: "sales",
  },
  { key: "distributionStart", label: "Остаток на начало на РЦ, шт", group: "sales" },
  { key: "salesUnitCost", label: "Себест, р/ед — продажи", group: "sales" },
  { key: "profitability", label: "Рентаб, %", group: "sales" },
  { key: "priceWithVat", label: "Цена с НДС, р/ед", group: "sales" },
  { key: "priceExVat", label: "Цена без НДС, р/ед", group: "sales" },
  { key: "salesPieces", label: "Объём продаж, шт", group: "sales" },
  { key: "revenueWithVat", label: "Выручка с НДС", group: "sales" },
  { key: "revenueExVat", label: "Выручка без НДС", group: "sales" },
  { key: "contribution", label: "Т-проток", group: "sales" },
  { key: "salesVolumeCost", label: "Себест объёма", group: "sales" },
  { key: "vat", label: "НДС, %", group: "sales" },
  { key: "outputUnitCost", label: "Себест, р/ед — производство", group: "output" },
  { key: "outputPieces", label: "Объём производства, шт", group: "output" },
  { key: "outputVolumeCost", label: "Себест объёма производства", group: "output" },
  { key: "transfer", label: "Перемещение на РЦ, шт", group: "output" },
  { key: "staffMeals", label: "Питание сотрудников, шт", group: "output" },
  { key: "samples", label: "Образцы для клиентов, шт", group: "output" },
  { key: "returns", label: "Возвраты клиентов, шт", group: "output" },
  { key: "writeOff", label: "Списание, шт", group: "output" },
  {
    key: "productionEnd",
    label: "Остаток на конец на производстве, шт",
    group: "output",
  },
  { key: "distributionEnd", label: "Остаток на конец на РЦ, шт", group: "output" },
];

const SALES_SPAN = COLUMNS.filter((column) => column.group === "sales").length;
const OUTPUT_SPAN = COLUMNS.length - SALES_SPAN;

const INPUTS: Partial<
  Record<ColumnKey, { field: keyof SalesFactInputs; kind: "price" | "pieces" }>
> = {
  priceWithVat: { field: "priceWithVatKopecks", kind: "price" },
  salesPieces: { field: "salesPieces", kind: "pieces" },
  outputPieces: { field: "outputPieces", kind: "pieces" },
  transfer: { field: "transferPieces", kind: "pieces" },
  staffMeals: { field: "staffMealsPieces", kind: "pieces" },
  samples: { field: "samplesPieces", kind: "pieces" },
  returns: { field: "returnsPieces", kind: "pieces" },
  writeOff: { field: "writeOffPieces", kind: "pieces" },
};

export function SalesFactTable({
  days,
  editable,
  showDayArrows,
  onDay,
  onCell,
}: {
  days: SalesFactDayView[];
  editable: boolean;
  showDayArrows: boolean;
  onDay: (day: string) => void;
  onCell: (
    occurredOn: string,
    productId: string,
    inputs: SalesFactInputs,
  ) => SalesFactRejection | null;
}) {
  return (
    <div className="max-h-[calc(100dvh-14rem)] contain-paint overflow-auto border border-line bg-sheet">
      {/* contain-paint не даёт широкой таблице растянуть прокрутку страницы */}
      <table className="w-max min-w-full border-separate border-spacing-0 text-sm">
        <caption className="sr-only">Факт продаж по дням</caption>
        <thead className="sticky top-0 z-30">
          <tr>
            <th
              colSpan={2}
              className="sticky left-0 z-40 border-r border-b border-line bg-paper"
            />
            <th
              colSpan={SALES_SPAN}
              scope="colgroup"
              className="border-r border-b border-line bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-ink"
            >
              {keepWithNext("Фактические показатели продаж за дату")}
            </th>
            <th
              colSpan={OUTPUT_SPAN}
              scope="colgroup"
              className="border-b border-line bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-ink"
            >
              {keepWithNext("Фактические показатели производства за дату")}
            </th>
          </tr>
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-40 w-10 max-w-10 border-r border-b border-line bg-paper p-0"
            >
              <span className="sr-only">Дата</span>
            </th>
            <th
              scope="col"
              className="sticky left-10 z-40 w-px max-w-max whitespace-nowrap border-r border-b border-line bg-paper px-3 py-2 text-center align-middle text-sm font-normal text-muted"
            >
              Товар
            </th>
            {COLUMNS.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="w-px whitespace-normal border-r border-b border-line bg-paper px-1.5 py-2 text-center align-middle text-sm font-normal leading-5 text-muted last:border-r-0"
              >
                <ColumnLabel label={column.label} />
              </th>
            ))}
          </tr>
        </thead>
        {days.map((day) => (
          <tbody key={day.occurredOn}>
            {day.rows.map((row, index) => (
              <tr key={`${day.occurredOn}:${row.productId}`}>
                {index === 0 ? (
                  <th
                    scope="rowgroup"
                    rowSpan={day.rows.length + 1}
                    className="sticky left-0 z-10 h-px w-10 max-w-10 border-r border-b border-line bg-sheet p-0 align-middle font-normal"
                  >
                    <DayLabel
                      occurredOn={day.occurredOn}
                      showArrows={showDayArrows}
                      onDay={onDay}
                    />
                  </th>
                ) : null}
                <th
                  scope="row"
                  className="sticky left-10 z-10 w-px max-w-max whitespace-nowrap border-r border-b border-line bg-sheet px-3 py-2 text-left align-middle font-normal"
                >
                  <ProductName row={row} />
                </th>
                {COLUMNS.map((column) => {
                  const canEdit = Boolean(INPUTS[column.key]) && editable && !row.deleted;
                  return (
                    <td
                      key={column.key}
                      className={`w-px border-r border-b border-line px-1.5 py-2 text-right align-middle last:border-r-0 ${canEdit ? editableCellClassName : ""}`}
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
                      <RowCell
                        column={column.key}
                        row={row}
                        editable={editable && !row.deleted}
                        onCommit={(inputs) =>
                          onCell(day.occurredOn, row.productId, inputs)
                        }
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <th
                scope="row"
                className="sticky left-10 z-10 w-px max-w-max whitespace-nowrap border-r border-b border-line bg-paper px-3 py-2 text-left align-middle font-normal text-ink"
              >
                Всего
              </th>
              {COLUMNS.map((column) => (
                <td
                  key={column.key}
                  className="w-px border-r border-b border-line bg-paper px-1.5 py-2 text-right align-middle last:border-r-0"
                >
                  <TotalCell column={column.key} totals={day.totals} />
                </td>
              ))}
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
}

function dayOfMonth(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match?.[3]) {
    return iso;
  }

  return String(Number(match[3]));
}

function DayLabel({
  occurredOn,
  showArrows,
  onDay,
}: {
  occurredOn: string;
  showArrows: boolean;
  onDay: (day: string) => void;
}) {
  return (
    <div className="flex h-full flex-col items-center py-1">
      {showArrows ? (
        <ArrowButton
          label="Предыдущий день"
          direction="up"
          onClick={() => onDay(adjacentDay(occurredOn, -1) ?? occurredOn)}
          disabled={adjacentDay(occurredOn, -1) === null}
        />
      ) : null}
      <span className="flex flex-1 items-center text-2xl leading-none font-bold text-ink">
        {dayOfMonth(occurredOn)}
      </span>
      {showArrows ? (
        <ArrowButton
          label="Следующий день"
          direction="down"
          onClick={() => onDay(adjacentDay(occurredOn, 1) ?? occurredOn)}
          disabled={adjacentDay(occurredOn, 1) === null}
        />
      ) : null}
    </div>
  );
}

function ArrowButton({
  label,
  direction,
  disabled,
  onClick,
}: {
  label: string;
  direction: "up" | "down";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-5 shrink-0 items-center justify-center text-ink outline-none hover:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40"
    >
      {direction === "up" ? <IconChevronUp /> : <IconChevronDown />}
    </button>
  );
}

function ProductName({ row }: { row: SalesFactRow }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-ink">{row.name}</span>
      {row.deleted ? <span className="text-sm text-muted">удалён</span> : null}
    </div>
  );
}

function RowCell({
  column,
  row,
  editable,
  onCommit,
}: {
  column: ColumnKey;
  row: SalesFactRow;
  editable: boolean;
  onCommit: (inputs: SalesFactInputs) => SalesFactRejection | null;
}) {
  const input = INPUTS[column];
  if (input) {
    const value = row.inputs[input.field];
    return (
      <GridNumber
        label={`${COLUMNS.find((item) => item.key === column)?.label ?? ""}, ${row.name}`}
        value={input.kind === "price" ? factPriceDraft(value) : factPiecesDraft(value)}
        disabled={!editable}
        inputMode={input.kind === "price" ? "decimal" : "numeric"}
        invalidMessage={
          input.kind === "price" ? SALES_FACT_ERROR.price : SALES_FACT_ERROR.pieces
        }
        parse={input.kind === "price" ? parseFactPrice : parseFactPieces}
        onCommit={(next) => onCommit({ ...row.inputs, [input.field]: next })}
      />
    );
  }

  switch (column) {
    case "productionStart":
      return <Pieces value={row.productionStart} />;
    case "distributionStart":
      return <Pieces value={row.distributionStart} />;
    case "productionEnd":
      return <Pieces value={row.productionEnd} />;
    case "distributionEnd":
      return <Pieces value={row.distributionEnd} />;
    case "salesUnitCost":
    case "outputUnitCost":
      return row.unitCost ? (
        <CostAmount kopecks={row.unitCost.exVatKopecks} />
      ) : (
        <Muted>{keepWithNext("Себестоимость не считается")}</Muted>
      );
    case "salesVolumeCost":
      return <CostAmountOrEmpty kopecks={row.salesVolumeCostExVatKopecks} />;
    case "outputVolumeCost":
      return <CostAmountOrEmpty kopecks={row.outputVolumeCostExVatKopecks} />;
    case "priceExVat":
      return row.priceExVatTenThousandths === null ? (
        <Empty />
      ) : (
        <span className="whitespace-nowrap">
          {formatPriceExVat(row.priceExVatTenThousandths)}
        </span>
      );
    case "revenueWithVat":
      return row.revenueWithVatKopecks === null ? (
        <Empty />
      ) : (
        <span className="whitespace-nowrap">
          {formatMoney(row.revenueWithVatKopecks)}
        </span>
      );
    case "revenueExVat":
      return row.revenueExVatKopecks === null ? (
        <Empty />
      ) : (
        <span className="whitespace-nowrap">{formatMoney(row.revenueExVatKopecks)}</span>
      );
    case "contribution":
      return row.contributionKopecks === null ? (
        <Empty />
      ) : (
        <span className="whitespace-nowrap">{formatMoney(row.contributionKopecks)}</span>
      );
    case "profitability":
      return row.profitabilityHundredths === null ? (
        <Empty />
      ) : (
        <span className="whitespace-nowrap">
          {formatPercentHundredths(row.profitabilityHundredths)}
        </span>
      );
    case "vat":
      return row.vatPercent === null ? (
        <Empty />
      ) : (
        <span className="whitespace-nowrap">{row.vatPercent} %</span>
      );
    default:
      return <Empty />;
  }
}

function TotalCell({ column, totals }: { column: ColumnKey; totals: SalesFactTotals }) {
  switch (column) {
    case "productionStart":
      return <Pieces value={totals.productionStart} />;
    case "distributionStart":
      return <Pieces value={totals.distributionStart} />;
    case "productionEnd":
      return <Pieces value={totals.productionEnd} />;
    case "distributionEnd":
      return <Pieces value={totals.distributionEnd} />;
    case "salesPieces":
      return <Pieces value={totals.salesPieces} />;
    case "outputPieces":
      return <Pieces value={totals.outputPieces} />;
    case "transfer":
      return <Pieces value={totals.transferPieces} />;
    case "staffMeals":
      return <Pieces value={totals.staffMealsPieces} />;
    case "samples":
      return <Pieces value={totals.samplesPieces} />;
    case "returns":
      return <Pieces value={totals.returnsPieces} />;
    case "writeOff":
      return <Pieces value={totals.writeOffPieces} />;
    case "priceWithVat":
      return totals.priceWithVatKopecks === null ? (
        <Empty />
      ) : (
        <span className="whitespace-nowrap">
          {formatMoney(totals.priceWithVatKopecks)}
        </span>
      );
    case "priceExVat":
      return totals.priceExVatKopecks === null ? (
        <Empty />
      ) : (
        <span className="whitespace-nowrap">{formatMoney(totals.priceExVatKopecks)}</span>
      );
    case "revenueWithVat":
      return totals.revenueWithVatKopecks === null ? (
        <Empty />
      ) : (
        <span className="whitespace-nowrap">
          {formatMoney(totals.revenueWithVatKopecks)}
        </span>
      );
    case "revenueExVat":
      return totals.revenueExVatKopecks === null ? (
        <Empty />
      ) : (
        <span className="whitespace-nowrap">
          {formatMoney(totals.revenueExVatKopecks)}
        </span>
      );
    case "contribution":
      return !totals.salesCostComplete || !totals.revenueComplete ? (
        <Muted>{keepWithNext("не по всем товарам")}</Muted>
      ) : totals.contributionKopecks === null ? (
        <Empty />
      ) : (
        <span className="whitespace-nowrap">
          {formatMoney(totals.contributionKopecks)}
        </span>
      );
    case "salesUnitCost":
      return (
        <AverageCost
          complete={totals.salesCostComplete}
          exVat={totals.salesUnitCostExVatKopecks}
        />
      );
    case "outputUnitCost":
      return (
        <AverageCost
          complete={totals.outputCostComplete}
          exVat={totals.outputUnitCostExVatKopecks}
        />
      );
    case "salesVolumeCost":
      return (
        <VolumeTotal
          complete={totals.salesCostComplete}
          exVat={totals.salesVolumeCostExVatKopecks}
        />
      );
    case "outputVolumeCost":
      return (
        <VolumeTotal
          complete={totals.outputCostComplete}
          exVat={totals.outputVolumeCostExVatKopecks}
        />
      );
    case "profitability":
      return !totals.salesCostComplete || totals.profitabilityHundredths === null ? (
        <Empty />
      ) : (
        <span className="whitespace-nowrap">
          {formatPercentHundredths(totals.profitabilityHundredths)}
        </span>
      );
    case "vat":
      return totals.vatPercentHundredths === null ? (
        <Empty />
      ) : (
        <span className="whitespace-nowrap">
          {formatPercentHundredths(totals.vatPercentHundredths)}
        </span>
      );
    default:
      return <Empty />;
  }
}

function AverageCost({ complete, exVat }: { complete: boolean; exVat: number | null }) {
  if (!complete) {
    return <Muted>{keepWithNext("не по всем товарам")}</Muted>;
  }
  if (exVat === null) {
    return <Empty />;
  }

  return <CostAmount kopecks={exVat} />;
}

function VolumeTotal({ complete, exVat }: { complete: boolean; exVat: number | null }) {
  if (!complete) {
    return <Muted>{keepWithNext("не по всем товарам")}</Muted>;
  }

  return <CostAmountOrEmpty kopecks={exVat} />;
}

function Pieces({ value }: { value: number | null }) {
  if (value === null) {
    return <Empty />;
  }

  return <span className="whitespace-nowrap">{formatSignedPieces(value)}</span>;
}

function CostAmount({ kopecks }: { kopecks: number }) {
  return <span className="whitespace-nowrap">{formatMoney(kopecks)}</span>;
}

function CostAmountOrEmpty({ kopecks }: { kopecks: number | null }) {
  if (kopecks === null) {
    return <Empty />;
  }

  return <CostAmount kopecks={kopecks} />;
}

function Empty() {
  return <span className="text-muted">—</span>;
}

function Muted({ children }: { children: string }) {
  return <span className="text-sm text-muted">{children}</span>;
}

function GridNumber({
  label,
  value,
  disabled,
  inputMode,
  invalidMessage,
  parse,
  onCommit,
}: {
  label: string;
  value: string;
  disabled: boolean;
  inputMode: "decimal" | "numeric";
  invalidMessage: string;
  parse: (raw: string) => number | null;
  onCommit: (value: number) => SalesFactRejection | null;
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
      setError(SALES_FACT_ERROR[rejection]);
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
        <span className="whitespace-nowrap">{shown}</span>
      </>
    );
  }

  return (
    <div className="min-w-0">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <input
        id={inputId}
        value={shown}
        inputMode={inputMode}
        autoComplete="off"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onFocus={() => {
          setDraft(value);
          setError(null);
        }}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={(event) => commit(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
        }}
        className={gridFieldClassName}
      />
      {error ? (
        <p id={errorId} className="mt-1 text-sm text-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}
