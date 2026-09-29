"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";

import type { PrototypeDocument } from "@/domain/document";
import {
  productionFactComparison,
  type FactComparisonRow,
  type FactComparisonTotals,
} from "@/domain/production-fact";
import type { ProductionKind } from "@/domain/production-plan";
import type { KopeckPair } from "@/domain/stock";
import { fieldClassName } from "@/features/materials/fields";
import { derivativeDetailHref, materialDetailHref } from "@/features/materials/paths";
import { factHref, type ProductionPart } from "@/features/production/paths";
import {
  countPhrase,
  deviationWord,
  formatFactDate,
  formatPlanQuantity,
  formatShareTenths,
  kindLabel,
  materialQuantityPhrase,
  moneyLines,
} from "@/features/production/text";
import { summaryHref } from "@/features/sales/paths";
import { daysPhrase } from "@/features/sales/text";
import { Dialog } from "@/features/shell/dialog";
import { IconClose, IconEye, IconPlan } from "@/features/shell/icons";
import { useProductionFact } from "@/features/production/use-production";

type SortMode = "name" | "deviation" | "fact";
type KindFilter = "all" | ProductionKind;

export function FactCompare({ month, part }: { month: string; part: ProductionPart }) {
  const production = useProductionFact();
  const comparison = useMemo(
    () => productionFactComparison(production.document, month),
    [month, production.document],
  );
  const rows = part === "output" ? comparison.outputs : comparison.inputs;
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<KindFilter>("all");
  const [placeId, setPlaceId] = useState("");
  const [sort, setSort] = useState<SortMode>("name");
  const [onlyGaps, setOnlyGaps] = useState(false);
  const [openedId, setOpenedId] = useState<string | null>(null);
  const places = useMemo(() => uniquePlaces(rows), [rows]);
  const filtersOn =
    query.trim().length > 0 ||
    kind !== "all" ||
    placeId.length > 0 ||
    sort !== "name" ||
    onlyGaps;
  const visible = sortRows(
    rows.filter((row) => matches(row, query, kind, placeId, onlyGaps)),
    sort,
  );
  const groups = groupRows(visible);
  const opened = rows.find((row) => rowKey(row) === openedId) ?? null;

  function resetFilters() {
    setQuery("");
    setKind("all");
    setPlaceId("");
    setSort("name");
    setOnlyGaps(false);
  }

  return (
    <div className="flex flex-col gap-6">
      {comparison.planStatus !== "ready" ? (
        <div className="border border-line bg-sheet px-5 py-5 sm:px-6">
          <p className="text-base text-ink">
            {comparison.planStatus === "missing-plan"
              ? "Сначала задайте план."
              : "В плане нет объёма."}
          </p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Факт за месяц всё равно суммируется. Колонка плана пустая, пока плана нет.
          </p>
          <Link href={summaryHref()} className={`mt-4 ${quietButtonClassName}`}>
            <IconPlan />К сводке
          </Link>
        </div>
      ) : null}

      <Totals totals={comparison.totals} />

      {rows.length === 0 ? (
        <p className="border border-line bg-sheet px-5 py-10 text-sm leading-6 text-muted">
          {emptyCopy(part, comparison.planStatus, comparison.totals.recordedDays)}
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          <Filters
            part={part}
            query={query}
            kind={kind}
            placeId={placeId}
            sort={sort}
            onlyGaps={onlyGaps}
            places={places}
            visibleCount={visible.length}
            totalCount={rows.length}
            filtersOn={filtersOn}
            onQuery={setQuery}
            onKind={setKind}
            onPlace={setPlaceId}
            onSort={setSort}
            onOnlyGaps={setOnlyGaps}
            onReset={resetFilters}
          />
          {visible.length === 0 ? (
            <p className="border border-line bg-sheet px-5 py-10 text-sm leading-6 text-muted">
              Ничего не найдено. Измените поиск или сбросьте фильтр.
            </p>
          ) : (
            <>
              <div className="flex flex-col gap-6 md:hidden">
                {groups.map((group) => (
                  <section key={group.id || group.name} className="flex flex-col gap-3">
                    <GroupTitle
                      document={production.document}
                      part={part}
                      id={group.id}
                      name={group.name}
                      count={group.rows.length}
                    />
                    <ul className="flex flex-col gap-3">
                      {group.rows.map((row) => (
                        <CompareCard
                          key={rowKey(row)}
                          part={part}
                          row={row}
                          onOpen={() => setOpenedId(rowKey(row))}
                        />
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
              <CompareTable
                document={production.document}
                part={part}
                groups={groups}
                onOpen={setOpenedId}
              />
            </>
          )}
        </div>
      )}

      {opened ? (
        <DaysDialog part={part} row={opened} onClose={() => setOpenedId(null)} />
      ) : null}
    </div>
  );
}

function emptyCopy(
  part: ProductionPart,
  status: "missing-plan" | "empty-volume" | "ready",
  recordedDays: number,
): string {
  if (part === "output" && recordedDays > 0 && status !== "ready") {
    return "В днях ещё нет выпуска.";
  }
  if (recordedDays === 0 && status !== "ready") {
    return "За этот месяц факта нет. Добавьте день.";
  }
  if (status === "missing-plan") {
    return "Сначала задайте план.";
  }
  if (status === "empty-volume") {
    return "В плане нет объёма.";
  }
  if (recordedDays > 0 && part === "output") {
    return "В днях ещё нет выпуска.";
  }

  return part === "output"
    ? "По этому плану считать нечего."
    : "По этому плану расход не считается.";
}

function Totals({ totals }: { totals: FactComparisonTotals }) {
  const planMoney = moneyLines(totals.planMaterialCost);
  const factMoney = moneyLines(totals.factMaterialCost);

  return (
    <section aria-label="Итоги факта и плана" className="border border-line bg-sheet">
      <div className="grid md:grid-cols-2 xl:grid-cols-4">
        <div className="border-b border-line p-5 sm:p-6 xl:border-r">
          <h2 className="text-sm text-muted">Производство</h2>
          <div className="mt-4 flex flex-col gap-3">
            <PairLine
              label="Товары, план"
              value={formatPlanQuantity(totals.planProductPieces, "piece")}
            />
            <PairLine
              label="Товары, факт"
              value={formatPlanQuantity(totals.factProductPieces, "piece")}
            />
            <PairLine
              label="Производные, план"
              value={formatPlanQuantity(totals.planDerivativeGrams, "kg")}
            />
            <PairLine
              label="Производные, факт"
              value={formatPlanQuantity(totals.factDerivativeGrams, "kg")}
            />
          </div>
        </div>
        <div className="border-b border-line p-5 sm:p-6 md:border-r xl:border-b">
          <h2 className="text-sm text-muted">Сырьё</h2>
          <div className="mt-4 flex flex-col gap-3">
            <PairLine
              label="План"
              value={materialQuantityPhrase(
                totals.planMaterialGrams,
                totals.planMaterialPieces,
              )}
            />
            <PairLine
              label="Факт"
              value={materialQuantityPhrase(
                totals.factMaterialGrams,
                totals.factMaterialPieces,
              )}
            />
          </div>
        </div>
        <div className="border-b border-line p-5 sm:p-6 xl:border-r xl:border-b-0">
          <h2 className="text-sm text-muted">Себестоимость сырья</h2>
          <div className="mt-4 flex flex-col gap-4">
            <MoneyLine label="План" money={planMoney} />
            <MoneyLine label="Факт" money={factMoney} />
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <h2 className="text-sm text-muted">Записи</h2>
          <p className="mt-4 text-lg leading-snug font-semibold text-ink">
            {daysPhrase(totals.recordedDays)} из {daysPhrase(totals.calendarDays)}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Дни с записью факта в этом месяце.
          </p>
        </div>
      </div>
    </section>
  );
}

function PairLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-right text-sm font-semibold text-ink tabular-nums">
        {value}
      </span>
    </div>
  );
}

function MoneyLine({
  label,
  money,
}: {
  label: string;
  money: { withVat: string; exVat: string } | null;
}) {
  return (
    <div>
      <p className="text-sm text-muted">{label}</p>
      {money ? (
        <>
          <p className="mt-1 text-sm font-semibold text-ink tabular-nums">
            {money.withVat}
          </p>
          <p className="mt-1 text-sm text-muted tabular-nums">{money.exVat}</p>
        </>
      ) : (
        <p className="mt-1 text-sm text-muted">Себестоимость не считается</p>
      )}
    </div>
  );
}

function Filters({
  part,
  query,
  kind,
  placeId,
  sort,
  onlyGaps,
  places,
  visibleCount,
  totalCount,
  filtersOn,
  onQuery,
  onKind,
  onPlace,
  onSort,
  onOnlyGaps,
  onReset,
}: {
  part: ProductionPart;
  query: string;
  kind: KindFilter;
  placeId: string;
  sort: SortMode;
  onlyGaps: boolean;
  places: { id: string; name: string }[];
  visibleCount: number;
  totalCount: number;
  filtersOn: boolean;
  onQuery: (value: string) => void;
  onKind: (value: KindFilter) => void;
  onPlace: (value: string) => void;
  onSort: (value: SortMode) => void;
  onOnlyGaps: (value: boolean) => void;
  onReset: () => void;
}) {
  const searchId = useId();
  const kindId = useId();
  const placeFieldId = useId();
  const sortId = useId();
  const gapsId = useId();
  const placeLabel = part === "output" ? "Цех" : "Склад";

  return (
    <div className="border border-line bg-sheet">
      <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-4">
        <div className="min-w-0 sm:col-span-2 xl:col-span-1">
          <label htmlFor={searchId} className="text-sm text-muted">
            Поиск
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            autoComplete="off"
            placeholder="Название"
            onChange={(event) => onQuery(event.target.value)}
            className={`mt-2 ${fieldClassName}`}
          />
        </div>
        <div className="min-w-0">
          <label htmlFor={kindId} className="text-sm text-muted">
            Вид
          </label>
          <select
            id={kindId}
            value={kind}
            onChange={(event) => onKind(event.target.value as KindFilter)}
            className={`mt-2 ${fieldClassName}`}
          >
            <option value="all">Все</option>
            {part === "output" ? <option value="product">Товары</option> : null}
            <option value="derivative">Производные</option>
            {part === "input" ? <option value="material">Сырьё</option> : null}
          </select>
        </div>
        <div className="min-w-0">
          <label htmlFor={placeFieldId} className="text-sm text-muted">
            {placeLabel}
          </label>
          <select
            id={placeFieldId}
            value={placeId}
            onChange={(event) => onPlace(event.target.value)}
            className={`mt-2 ${fieldClassName}`}
          >
            <option value="">Все</option>
            {places.map((place) => (
              <option key={place.id || place.name} value={place.id}>
                {place.name}
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
            onChange={(event) => onSort(event.target.value as SortMode)}
            className={`mt-2 ${fieldClassName}`}
          >
            <option value="name">По названию</option>
            <option value="deviation">По отклонению</option>
            <option value="fact">По факту</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-3 border-t border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <p className="text-sm text-muted">
            Показано {visibleCount} из {totalCount}
          </p>
          <label
            htmlFor={gapsId}
            className="inline-flex items-center gap-2 text-sm text-ink"
          >
            <input
              id={gapsId}
              type="checkbox"
              checked={onlyGaps}
              onChange={(event) => onOnlyGaps(event.target.checked)}
              className="size-4 accent-ink"
            />
            Только расхождения
          </label>
        </div>
        {filtersOn ? (
          <button type="button" onClick={onReset} className={quietButtonClassName}>
            <IconClose />
            Сбросить
          </button>
        ) : null}
      </div>
    </div>
  );
}

function CompareCard({
  part,
  row,
  onOpen,
}: {
  part: ProductionPart;
  row: FactComparisonRow;
  onOpen: () => void;
}) {
  const word = deviationWord(row.deviation);

  const deviation =
    row.deviation === null ? "—" : formatPlanQuantity(Math.abs(row.deviation), row.unit);

  return (
    <li className="border border-line bg-sheet p-5">
      <RowName row={row} />
      <p className="mt-1 text-sm text-muted">{kindLabel(row.kind, row.deleted)}</p>
      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-line pt-4">
        <div>
          <p className="text-sm text-muted">План</p>
          <p className="mt-1 text-base font-semibold text-ink tabular-nums">
            {formatPlanQuantity(row.planQuantity, row.unit)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted">Факт</p>
          <p className="mt-1 text-base font-semibold text-ink tabular-nums">
            {formatPlanQuantity(row.factQuantity, row.unit)}
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">
        {word ? `${deviation} ${word}` : deviation}
        <span className="mx-2 text-line">·</span>
        {formatShareTenths(row.shareTenths)} плана
      </p>
      <div className="mt-4 border-t border-line pt-4">
        <CostBlock part={part} plan={row.planCost} fact={row.factCost} align="start" />
      </div>
      <button type="button" onClick={onOpen} className={`mt-4 ${quietButtonClassName}`}>
        <IconEye />
        Дни
      </button>
    </li>
  );
}

function CompareTable({
  document,
  part,
  groups,
  onOpen,
}: {
  document: PrototypeDocument;
  part: ProductionPart;
  groups: { id: string; name: string; rows: FactComparisonRow[] }[];
  onOpen: (id: string) => void;
}) {
  return (
    <div className="hidden overflow-x-auto border border-line bg-sheet md:block">
      <table className="w-full min-w-[72rem] border-collapse text-sm">
        <caption className="sr-only">
          {part === "output"
            ? "Факт производства против плана"
            : "Факт расхода против плана"}
        </caption>
        <thead>
          <tr className="border-b border-line">
            <th
              scope="col"
              className="sticky left-0 z-10 min-w-56 border-r border-line bg-paper px-4 py-3 text-left font-normal text-muted"
            >
              Название
            </th>
            <th
              scope="col"
              className="min-w-36 px-4 py-3 text-left font-normal text-muted"
            >
              Вид
            </th>
            <th
              scope="col"
              className="min-w-32 px-4 py-3 text-right font-normal text-muted"
            >
              План
            </th>
            <th
              scope="col"
              className="min-w-32 px-4 py-3 text-right font-normal text-muted"
            >
              Факт
            </th>
            <th
              scope="col"
              className="min-w-40 px-4 py-3 text-right font-normal text-muted"
            >
              Отклонение
            </th>
            <th
              scope="col"
              className="min-w-28 px-4 py-3 text-right font-normal text-muted"
            >
              Доля плана
            </th>
            <th
              scope="col"
              className="min-w-52 px-4 py-3 text-right font-normal text-muted"
            >
              Себестоимость
            </th>
            <th scope="col" className="w-28 px-4 py-3 text-right font-normal text-muted">
              <span className="sr-only">Дни</span>
            </th>
          </tr>
        </thead>
        {groups.map((group) => (
          <tbody key={group.id || group.name}>
            <tr className="border-b border-line">
              <th
                scope="colgroup"
                colSpan={8}
                className="bg-paper px-4 py-3 text-left text-sm font-semibold text-ink"
              >
                <span>{group.name}</span>
                {placeDeleted(document, part, group.id) ? (
                  <span className="ml-2 font-normal text-muted">удалён</span>
                ) : null}
                <span className="ml-3 font-normal text-muted">
                  {countPhrase(group.rows.length, "позиция", "позиции", "позиций")}
                </span>
              </th>
            </tr>
            {group.rows.map((row) => {
              const word = deviationWord(row.deviation);
              return (
                <tr
                  key={rowKey(row)}
                  className="group border-b border-line last:border-b-0"
                >
                  <th
                    scope="row"
                    className="sticky left-0 z-10 border-r border-line bg-sheet px-4 py-4 text-left font-normal group-hover:bg-paper"
                  >
                    <RowName row={row} />
                  </th>
                  <td className="px-4 py-4 text-muted group-hover:bg-paper">
                    {kindLabel(row.kind, row.deleted)}
                  </td>
                  <td className="px-4 py-4 text-right font-semibold text-ink tabular-nums group-hover:bg-paper">
                    {formatPlanQuantity(row.planQuantity, row.unit)}
                  </td>
                  <td className="px-4 py-4 text-right font-semibold text-ink tabular-nums group-hover:bg-paper">
                    {formatPlanQuantity(row.factQuantity, row.unit)}
                  </td>
                  <td className="px-4 py-4 text-right text-ink tabular-nums group-hover:bg-paper">
                    {row.deviation === null ? (
                      "—"
                    ) : (
                      <>
                        <span className="block font-semibold">
                          {formatPlanQuantity(Math.abs(row.deviation), row.unit)}
                        </span>
                        {word ? (
                          <span className="mt-1 block text-muted">{word}</span>
                        ) : null}
                      </>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right text-ink tabular-nums group-hover:bg-paper">
                    {formatShareTenths(row.shareTenths)}
                  </td>
                  <td className="px-4 py-4 text-right group-hover:bg-paper">
                    <CostBlock part={part} plan={row.planCost} fact={row.factCost} />
                  </td>
                  <td className="px-4 py-3 text-right group-hover:bg-paper">
                    <button
                      type="button"
                      onClick={() => onOpen(rowKey(row))}
                      className={quietButtonClassName}
                    >
                      <IconEye />
                      Дни
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        ))}
      </table>
    </div>
  );
}

function DaysDialog({
  part,
  row,
  onClose,
}: {
  part: ProductionPart;
  row: FactComparisonRow;
  onClose: () => void;
}) {
  return (
    <Dialog title={`Дни: ${row.name}`} onClose={onClose}>
      {row.days.length === 0 ? (
        <p className="text-sm leading-6 text-muted">
          {part === "output"
            ? "В факте этого месяца выпуска нет."
            : "В факте этого месяца расхода нет."}
        </p>
      ) : (
        <ul className="flex flex-col">
          {row.days.map((day) => (
            <li
              key={day.factId}
              className="flex flex-col gap-2 border-b border-line py-4 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between"
            >
              <Link href={factHref(day.factId)} className={nameLinkClassName}>
                {formatFactDate(day.occurredOn)}
              </Link>
              <p className="text-sm font-semibold text-ink tabular-nums">
                {formatPlanQuantity(day.quantity, row.unit)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Dialog>
  );
}

function CostBlock({
  part,
  plan,
  fact,
  align = "end",
}: {
  part: ProductionPart;
  plan: KopeckPair | null;
  fact: KopeckPair | null;
  align?: "start" | "end";
}) {
  const planLabel = part === "output" ? "На плановый объём" : "План";
  const factLabel = part === "output" ? "На фактический объём" : "Факт";
  const placed =
    align === "start"
      ? "grid grid-cols-2 gap-4 text-left"
      : "flex flex-col gap-3 text-right";

  return (
    <div className={placed}>
      <CostLine label={planLabel} cost={plan} />
      <CostLine label={factLabel} cost={fact} />
    </div>
  );
}

function CostLine({ label, cost }: { label: string; cost: KopeckPair | null }) {
  const money = moneyLines(cost);

  return (
    <div>
      <p className="text-sm text-muted">{label}</p>
      {money ? (
        <>
          <p className="mt-1 text-sm text-ink tabular-nums">{money.withVat}</p>
          <p className="mt-1 text-sm text-muted tabular-nums">{money.exVat}</p>
        </>
      ) : (
        <p className="mt-1 text-sm text-muted">Себестоимость не считается</p>
      )}
    </div>
  );
}

function GroupTitle({
  document,
  part,
  id,
  name,
  count,
}: {
  document: PrototypeDocument;
  part: ProductionPart;
  id: string;
  name: string;
  count: number;
}) {
  return (
    <h2 className="flex items-baseline justify-between gap-3 border-b border-line pb-2">
      <span className="text-base font-semibold text-ink">
        {name}
        {placeDeleted(document, part, id) ? (
          <span className="ml-2 text-sm font-normal text-muted">удалён</span>
        ) : null}
      </span>
      <span className="shrink-0 text-sm font-normal text-muted">
        {countPhrase(count, "позиция", "позиции", "позиций")}
      </span>
    </h2>
  );
}

function RowName({ row }: { row: FactComparisonRow }) {
  const href =
    row.kind === "material" ? materialDetailHref(row.id) : derivativeDetailHref(row.id);

  return (
    <Link href={href} className={nameLinkClassName}>
      {row.name}
    </Link>
  );
}

function rowKey(row: FactComparisonRow): string {
  return `${row.kind}:${row.id}`;
}

function matches(
  row: FactComparisonRow,
  query: string,
  kind: KindFilter,
  placeId: string,
  onlyGaps: boolean,
): boolean {
  if (kind !== "all" && row.kind !== kind) {
    return false;
  }
  if (placeId && row.placeId !== placeId) {
    return false;
  }
  if (onlyGaps && row.planQuantity !== null && row.deviation === 0) {
    return false;
  }

  const needle = query.trim().toLocaleLowerCase("ru-RU");
  if (!needle) {
    return true;
  }

  return row.name.toLocaleLowerCase("ru-RU").includes(needle);
}

function sortRows(rows: FactComparisonRow[], sort: SortMode): FactComparisonRow[] {
  const copy = rows.slice();
  if (sort === "fact") {
    copy.sort(
      (left, right) =>
        right.factQuantity - left.factQuantity ||
        left.name.localeCompare(right.name, "ru"),
    );
    return copy;
  }

  if (sort === "deviation") {
    copy.sort((left, right) => {
      const leftValue = Math.abs(left.deviation ?? left.factQuantity);
      const rightValue = Math.abs(right.deviation ?? right.factQuantity);
      return rightValue - leftValue || left.name.localeCompare(right.name, "ru");
    });
    return copy;
  }

  copy.sort((left, right) => left.name.localeCompare(right.name, "ru"));
  return copy;
}

function groupRows(
  rows: FactComparisonRow[],
): { id: string; name: string; rows: FactComparisonRow[] }[] {
  const groups = new Map<
    string,
    { id: string; name: string; rows: FactComparisonRow[] }
  >();
  for (const row of rows) {
    const current = groups.get(row.placeId) ?? {
      id: row.placeId,
      name: row.placeName,
      rows: [],
    };
    current.rows.push(row);
    groups.set(row.placeId, current);
  }

  return [...groups.values()].sort((left, right) =>
    left.name.localeCompare(right.name, "ru"),
  );
}

function uniquePlaces(
  rows: readonly FactComparisonRow[],
): { id: string; name: string }[] {
  const places = new Map<string, string>();
  for (const row of rows) {
    if (!places.has(row.placeId)) {
      places.set(row.placeId, row.placeName);
    }
  }

  return [...places.entries()]
    .map(([id, name]) => ({ id, name }))
    .sort((left, right) => left.name.localeCompare(right.name, "ru"));
}

function placeDeleted(
  document: PrototypeDocument,
  part: ProductionPart,
  placeId: string,
): boolean {
  const places = part === "output" ? document.workshops : document.warehouses;
  const place = places.find((item) => item.id === placeId);
  return place !== undefined && place.deletedAt !== null;
}

const quietButtonClassName =
  "inline-flex h-11 w-full items-center justify-center gap-2 border border-line bg-sheet px-4 text-sm whitespace-nowrap text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:w-auto";

const nameLinkClassName =
  "font-semibold break-words text-ink outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
