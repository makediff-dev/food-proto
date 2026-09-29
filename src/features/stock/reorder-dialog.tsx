"use client";

import { materialsToReorder } from "@/domain/stock";
import { materialDetailHref } from "@/features/materials/paths";
import { Dialog } from "@/features/shell/dialog";
import { formatQuantity } from "@/features/stock/text";
import { useStock } from "@/features/stock/use-stock";
import Link from "next/link";

export function ReorderDialog({
  places,
  grouped,
  onClose,
}: {
  places: { id: string; name: string }[];
  grouped: boolean;
  onClose: () => void;
}) {
  const stock = useStock();
  const sections = places
    .map((place) => ({
      ...place,
      lines: materialsToReorder(stock.document, place.id),
    }))
    .filter((section) => section.lines.length > 0);
  const lead = grouped
    ? "Все склады. К заказу — сколько нужно, чтобы остаток стал посередине между минимумом и максимумом. Внутри склада сверху сырьё с наибольшим отклонением ниже минимума."
    : `${places[0]?.name ?? "Склад"}. К заказу — сколько нужно, чтобы остаток стал посередине между минимумом и максимумом. Сверху сырьё с наибольшим отклонением ниже минимума.`;

  return (
    <Dialog title="К заказу" onClose={onClose} wide>
      <p className="text-sm leading-6 text-muted">{lead}</p>
      {sections.length === 0 ? (
        <p className="mt-4 border border-line bg-paper px-4 py-4 text-sm leading-6 text-muted">
          {grouped
            ? "Заказывать нечего. Всё сырьё не ниже минимума."
            : "Заказывать нечего. Всё сырьё этого склада не ниже минимума."}
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-6">
          {sections.map((section) => (
            <section key={section.id} className="flex flex-col gap-3">
              {grouped ? (
                <h3 className="text-base font-semibold text-ink">{section.name}</h3>
              ) : null}
              <ReorderLines lines={section.lines} />
            </section>
          ))}
        </div>
      )}
    </Dialog>
  );
}
function ReorderLines({ lines }: { lines: ReturnType<typeof materialsToReorder> }) {
  return (
    <>
      <ul className="flex flex-col gap-3 md:hidden">
        {lines.map((line) => (
          <li key={line.materialId} className="border border-line bg-paper p-4">
            <Link
              href={materialDetailHref(line.materialId)}
              className="text-base font-semibold text-ink outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {line.name}
            </Link>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <Fact label="Сейчас" value={formatQuantity(line.current, line.unit)} />
              <Fact
                label="К заказу"
                value={formatQuantity(line.orderQuantity, line.unit)}
                strong
              />
              <Fact
                label="Минимум"
                value={formatQuantity(line.minNormStock, line.unit)}
              />
              <Fact
                label="Максимум"
                value={formatQuantity(line.maxNormStock, line.unit)}
              />
              <Fact label="Ниже минимума" value={formatShortfall(line.shortfallRatio)} />
            </dl>
          </li>
        ))}
      </ul>
      <div className="hidden overflow-x-auto border border-line md:block">
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line text-muted">
              <th className="px-4 py-3 font-normal">Сырьё</th>
              <th className="px-4 py-3 text-right font-normal">Сейчас</th>
              <th className="px-4 py-3 text-right font-normal">Минимум</th>
              <th className="px-4 py-3 text-right font-normal">Максимум</th>
              <th className="px-4 py-3 text-right font-normal">Ниже минимума</th>
              <th className="px-4 py-3 text-right font-semibold text-ink">К заказу</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => (
              <tr key={line.materialId} className="border-b border-line last:border-b-0">
                <td className="px-4 py-3">
                  <Link
                    href={materialDetailHref(line.materialId)}
                    className="font-semibold text-ink outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    {line.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-ink">
                  {formatQuantity(line.current, line.unit)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-ink">
                  {formatQuantity(line.minNormStock, line.unit)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-ink">
                  {formatQuantity(line.maxNormStock, line.unit)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-ink">
                  {formatShortfall(line.shortfallRatio)}
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums text-ink">
                  {formatQuantity(line.orderQuantity, line.unit)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Fact({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div>
      <dt className="text-muted">{label}</dt>
      <dd className={strong ? "mt-1 font-semibold text-ink" : "mt-1 text-ink"}>
        {value}
      </dd>
    </div>
  );
}

function formatShortfall(ratio: number | null): string {
  if (ratio === null) {
    return "—";
  }

  return `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(
    Math.round(ratio * 100),
  )} %`;
}
