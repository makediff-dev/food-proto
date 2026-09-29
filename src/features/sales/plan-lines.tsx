"use client";

import { useId, useState, type ReactNode } from "react";

import type {
  SalesPlanLineMetrics,
  SalesPlanRejection,
  SalesPlanTotals,
} from "@/domain/sales-plan";
import { fieldClassName } from "@/features/materials/fields";
import { formatMoney } from "@/features/materials/money";
import {
  formatContribution,
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

export interface PlanRow {
  lineId: string;
  name: string;
  workshopId: string;
  workshop: string;
  vatPercent: number | null;
  deletedProduct: boolean;
  priceWithVatKopecks: number;
  volumePieces: number;
  metrics: SalesPlanLineMetrics;
}

export function PlanLineCards({
  rows,
  editable,
  onPrice,
  onVolume,
}: {
  rows: PlanRow[];
  editable: boolean;
  onPrice: (lineId: string, priceWithVatKopecks: number) => SalesPlanRejection | null;
  onVolume: (lineId: string, volumePieces: number) => SalesPlanRejection | null;
}) {
  return (
    <ul className="flex flex-col gap-3 md:hidden">
      {rows.map((row) => (
        <li key={row.lineId} className="border border-line bg-sheet p-4">
          <ProductTitle row={row} />
          <div className="mt-4 grid gap-4">
            <PriceField row={row} editable={editable} onPrice={onPrice} />
            <VolumeField row={row} editable={editable} onVolume={onVolume} />
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
            <Metric label="Цена без НДС">
              <PriceExVat metrics={row.metrics} />
            </Metric>
            <Metric label="Себестоимость 1 шт">
              <UnitCost metrics={row.metrics} />
            </Metric>
            <Metric label="Себестоимость объёма">
              <VolumeCost metrics={row.metrics} />
            </Metric>
            <Metric label="Рентабельность">
              <Profitability metrics={row.metrics} />
            </Metric>
            <Metric label="Выручка">
              <Revenue metrics={row.metrics} />
            </Metric>
            <Metric label="Т-проток">
              <Contribution metrics={row.metrics} />
            </Metric>
            <Metric label="В сутки">
              <PerDay metrics={row.metrics} />
            </Metric>
          </dl>
        </li>
      ))}
    </ul>
  );
}

export function PlanLineTable({
  rows,
  totals,
  editable,
  onPrice,
  onVolume,
}: {
  rows: PlanRow[];
  totals: SalesPlanTotals;
  editable: boolean;
  onPrice: (lineId: string, priceWithVatKopecks: number) => SalesPlanRejection | null;
  onVolume: (lineId: string, volumePieces: number) => SalesPlanRejection | null;
}) {
  return (
    <div className="hidden overflow-x-auto border border-line bg-sheet md:block">
      <table className="w-max min-w-full border-collapse text-sm">
        <caption className="sr-only">Строки плана продаж</caption>
        <thead>
          <tr className="border-b border-line">
            {HEADERS.map((label, index) => (
              <th
                key={label}
                scope="col"
                className={`bg-paper px-3 py-3 text-left text-sm font-normal text-muted ${
                  index === 0
                    ? "sticky left-0 z-10 min-w-52 border-r border-line"
                    : "min-w-36"
                }`}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.lineId} className="border-b border-line">
              <th
                scope="row"
                className="sticky left-0 z-10 min-w-52 border-r border-line bg-sheet px-3 py-3 text-left align-top font-normal"
              >
                <ProductTitle row={row} />
              </th>
              <td className="min-w-40 px-3 py-3 align-top">
                <PriceField row={row} editable={editable} onPrice={onPrice} hideLabel />
              </td>
              <td className="min-w-36 px-3 py-3 align-top">
                <VolumeField
                  row={row}
                  editable={editable}
                  onVolume={onVolume}
                  hideLabel
                />
              </td>
              <td className="px-3 py-3 align-top">
                <PriceExVat metrics={row.metrics} />
              </td>
              <td className="min-w-44 px-3 py-3 align-top">
                <UnitCost metrics={row.metrics} />
              </td>
              <td className="min-w-44 px-3 py-3 align-top">
                <VolumeCost metrics={row.metrics} />
              </td>
              <td className="px-3 py-3 align-top whitespace-nowrap">
                <Profitability metrics={row.metrics} />
              </td>
              <td className="min-w-44 px-3 py-3 align-top">
                <Revenue metrics={row.metrics} />
              </td>
              <td className="px-3 py-3 align-top whitespace-nowrap">
                <Contribution metrics={row.metrics} />
              </td>
              <td className="px-3 py-3 align-top whitespace-nowrap">
                <PerDay metrics={row.metrics} />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-line">
            <th
              scope="row"
              className="sticky left-0 z-10 border-r border-line bg-paper px-3 py-3 text-left align-top text-sm font-normal text-ink"
            >
              Итог всего плана
            </th>
            <td className="bg-paper px-3 py-3 align-top">
              <AveragePrice totals={totals} />
            </td>
            <td className="bg-paper px-3 py-3 align-top whitespace-nowrap">
              {totals.volumePieces === null
                ? "—"
                : `${formatPieces(totals.volumePieces)} шт`}
            </td>
            <td className="bg-paper px-3 py-3 align-top">
              <AveragePriceEx totals={totals} />
            </td>
            <td className="bg-paper px-3 py-3 align-top">
              <AverageCost totals={totals} />
            </td>
            <td className="bg-paper px-3 py-3 align-top">
              <TotalVolumeCost totals={totals} />
            </td>
            <td className="bg-paper px-3 py-3 align-top whitespace-nowrap">
              <TotalProfitability totals={totals} />
            </td>
            <td className="bg-paper px-3 py-3 align-top">
              <TotalRevenue totals={totals} />
            </td>
            <td className="bg-paper px-3 py-3 align-top">
              <TotalContribution totals={totals} />
            </td>
            <td className="bg-paper px-3 py-3 align-top whitespace-nowrap">
              {totals.perDay === null ? "—" : formatPerDay(totals.perDay)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

const HEADERS = [
  "Товар",
  "Цена с НДС",
  "Объём, шт",
  "Цена без НДС",
  "Себестоимость 1 шт",
  "Себестоимость объёма",
  "Рентабельность",
  "Выручка",
  "Т-проток",
  "В сутки",
] as const;

function ProductTitle({ row }: { row: PlanRow }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-semibold text-ink">{row.name}</span>
      <span className="text-sm text-muted">{row.workshop}</span>
      <span className="text-sm text-muted">
        {row.deletedProduct
          ? "удалён"
          : row.vatPercent === null
            ? "Нет ставки НДС"
            : `НДС ${row.vatPercent} %`}
      </span>
    </div>
  );
}

function Metric({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 text-sm leading-5 text-ink">{children}</dd>
    </div>
  );
}

function PriceField({
  row,
  editable,
  hideLabel = false,
  onPrice,
}: {
  row: PlanRow;
  editable: boolean;
  hideLabel?: boolean;
  onPrice: (lineId: string, priceWithVatKopecks: number) => SalesPlanRejection | null;
}) {
  return (
    <NumberField
      label={hideLabel ? `Цена с НДС, ${row.name}` : "Цена с НДС"}
      hideLabel={hideLabel}
      value={priceDraft(row.priceWithVatKopecks)}
      disabled={!editable || row.deletedProduct}
      inputMode="decimal"
      invalidMessage={SALES_PLAN_ERROR.price}
      parse={parsePlanPrice}
      onCommit={(value) => onPrice(row.lineId, value)}
    />
  );
}

function VolumeField({
  row,
  editable,
  hideLabel = false,
  onVolume,
}: {
  row: PlanRow;
  editable: boolean;
  hideLabel?: boolean;
  onVolume: (lineId: string, volumePieces: number) => SalesPlanRejection | null;
}) {
  return (
    <NumberField
      label={hideLabel ? `Объём, ${row.name}` : "Объём, шт"}
      hideLabel={hideLabel}
      value={volumeDraft(row.volumePieces)}
      disabled={!editable || row.deletedProduct}
      inputMode="numeric"
      invalidMessage={SALES_PLAN_ERROR.volume}
      parse={parseVolumePieces}
      onCommit={(value) => onVolume(row.lineId, value)}
    />
  );
}

function NumberField({
  label,
  hideLabel,
  value,
  disabled,
  inputMode,
  invalidMessage,
  parse,
  onCommit,
}: {
  label: string;
  hideLabel: boolean;
  value: string;
  disabled: boolean;
  inputMode: "decimal" | "numeric";
  invalidMessage: string;
  parse: (raw: string) => number | null;
  onCommit: (value: number) => SalesPlanRejection | null;
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
      setError(SALES_PLAN_ERROR[rejection]);
      setDraft(raw);
      return;
    }

    setDraft(null);
    setError(null);
  }

  return (
    <div className="min-w-0">
      <label htmlFor={inputId} className={hideLabel ? "sr-only" : "text-sm text-muted"}>
        {label}
      </label>
      <input
        id={inputId}
        value={shown}
        inputMode={inputMode}
        disabled={disabled}
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
        className={hideLabel ? fieldClassName : `mt-1.5 ${fieldClassName}`}
      />
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function MoneyStack({ withVat, exVat }: { withVat: number; exVat: number }) {
  return (
    <div className="text-sm leading-5">
      <div className="whitespace-nowrap text-ink">{formatMoney(withVat)} с НДС</div>
      <div className="whitespace-nowrap text-muted">{formatMoney(exVat)} без НДС</div>
    </div>
  );
}

function PriceExVat({ metrics }: { metrics: SalesPlanLineMetrics }) {
  if (metrics.priceExVatTenThousandths === null) {
    return <>—</>;
  }

  return (
    <span className="whitespace-nowrap">
      {formatPriceExVat(metrics.priceExVatTenThousandths)}
    </span>
  );
}

function UnitCost({ metrics }: { metrics: SalesPlanLineMetrics }) {
  if (!metrics.unitCost) {
    return <span className="text-muted">Себестоимость не считается</span>;
  }

  return (
    <MoneyStack
      withVat={metrics.unitCost.withVatKopecks}
      exVat={metrics.unitCost.exVatKopecks}
    />
  );
}

function VolumeCost({ metrics }: { metrics: SalesPlanLineMetrics }) {
  if (
    metrics.volumeCostWithVatKopecks === null ||
    metrics.volumeCostExVatKopecks === null
  ) {
    return <>—</>;
  }

  return (
    <MoneyStack
      withVat={metrics.volumeCostWithVatKopecks}
      exVat={metrics.volumeCostExVatKopecks}
    />
  );
}

function Revenue({ metrics }: { metrics: SalesPlanLineMetrics }) {
  if (metrics.revenueWithVatKopecks === null) {
    return <>—</>;
  }
  if (metrics.revenueExVatKopecks === null) {
    return (
      <div className="text-sm leading-5">
        <div className="whitespace-nowrap">
          {formatMoney(metrics.revenueWithVatKopecks)} с НДС
        </div>
        <div className="text-muted">без НДС не считается</div>
      </div>
    );
  }

  return (
    <MoneyStack
      withVat={metrics.revenueWithVatKopecks}
      exVat={metrics.revenueExVatKopecks}
    />
  );
}

function Contribution({ metrics }: { metrics: SalesPlanLineMetrics }) {
  if (metrics.contributionKopecks === null) {
    return <>—</>;
  }

  return <span>{formatContribution(metrics.contributionKopecks)}</span>;
}

function Profitability({ metrics }: { metrics: SalesPlanLineMetrics }) {
  if (metrics.profitabilityHundredths === null) {
    return <>—</>;
  }

  return <span>{formatPercentHundredths(metrics.profitabilityHundredths)}</span>;
}

function PerDay({ metrics }: { metrics: SalesPlanLineMetrics }) {
  return <span>{formatPerDay(metrics.perDay)}</span>;
}

function AveragePrice({ totals }: { totals: SalesPlanTotals }) {
  if (totals.averagePriceWithVatKopecks === null) {
    return <>—</>;
  }
  if (totals.averagePriceExVatKopecks === null) {
    return <span>{formatMoney(totals.averagePriceWithVatKopecks)} с НДС</span>;
  }

  return (
    <MoneyStack
      withVat={totals.averagePriceWithVatKopecks}
      exVat={totals.averagePriceExVatKopecks}
    />
  );
}

function AveragePriceEx({ totals }: { totals: SalesPlanTotals }) {
  if (totals.averagePriceExVatKopecks === null) {
    return <>—</>;
  }

  return (
    <span className="whitespace-nowrap">
      {formatMoney(totals.averagePriceExVatKopecks)}
    </span>
  );
}

function AverageCost({ totals }: { totals: SalesPlanTotals }) {
  if (!totals.costComplete) {
    return <span className="text-muted">не по всем товарам</span>;
  }
  if (
    totals.averageCostWithVatKopecks === null ||
    totals.averageCostExVatKopecks === null
  ) {
    return <>—</>;
  }

  return (
    <MoneyStack
      withVat={totals.averageCostWithVatKopecks}
      exVat={totals.averageCostExVatKopecks}
    />
  );
}

function TotalVolumeCost({ totals }: { totals: SalesPlanTotals }) {
  if (
    totals.volumeCostWithVatKopecks === null ||
    totals.volumeCostExVatKopecks === null
  ) {
    return <>—</>;
  }

  return (
    <div>
      <MoneyStack
        withVat={totals.volumeCostWithVatKopecks}
        exVat={totals.volumeCostExVatKopecks}
      />
      {totals.costComplete ? null : <p className="mt-1 text-muted">не по всем товарам</p>}
    </div>
  );
}

function TotalRevenue({ totals }: { totals: SalesPlanTotals }) {
  if (totals.revenueWithVatKopecks === null) {
    return <>—</>;
  }
  if (totals.revenueExVatKopecks === null) {
    return (
      <div className="text-sm leading-5">
        <div>{formatMoney(totals.revenueWithVatKopecks)} с НДС</div>
        <div className="text-muted">не по всем товарам</div>
      </div>
    );
  }

  return (
    <MoneyStack
      withVat={totals.revenueWithVatKopecks}
      exVat={totals.revenueExVatKopecks}
    />
  );
}

function TotalContribution({ totals }: { totals: SalesPlanTotals }) {
  if (!totals.costComplete || !totals.revenueComplete) {
    return <span className="text-muted">не по всем товарам</span>;
  }
  if (totals.contributionKopecks === null) {
    return <>—</>;
  }

  return <span>{formatContribution(totals.contributionKopecks)}</span>;
}

function TotalProfitability({ totals }: { totals: SalesPlanTotals }) {
  if (!totals.costComplete || totals.profitabilityHundredths === null) {
    return <>—</>;
  }

  return <span>{formatPercentHundredths(totals.profitabilityHundredths)}</span>;
}
