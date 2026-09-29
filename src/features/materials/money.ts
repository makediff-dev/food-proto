import { formatKilogramsFromGrams, formatRublesFromKopecks } from "@/domain/units";

export function formatMoney(kopecks: number): string {
  return formatRublesFromKopecks(kopecks, true);
}

/** Денежная величина всегда двумя числами: с НДС и без НДС. */
export function formatVatPair(
  withVatKopecks: number,
  exVatKopecks: number,
  unit: string,
): string {
  return `${formatMoney(withVatKopecks)} с НДС · ${formatMoney(exVatKopecks)} без НДС за ${unit}`;
}

export function formatStockAmount(quantity: number, unit: "kg" | "piece"): string {
  if (unit === "piece") {
    return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(quantity);
  }

  return formatKilogramsFromGrams(quantity);
}

export function formatStockRange(
  minNormStock: number,
  maxNormStock: number,
  unit: "kg" | "piece",
): string {
  const label = unit === "piece" ? "шт" : "кг";
  return `Норматив ${formatStockAmount(minNormStock, unit)}–${formatStockAmount(maxNormStock, unit)} ${label}`;
}
