"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";

import type { MaterialUnit, PrototypeDocument } from "@/domain/document";
import type {
  ProductionInputRow,
  ProductionKind,
  ProductionOutputRow,
  ProductionRecipeGap,
  ProductionShare,
  ProductionTotals,
} from "@/domain/production-plan";
import type { KopeckPair } from "@/domain/stock";
import { fieldClassName } from "@/features/materials/fields";
import { derivativeDetailHref, materialDetailHref } from "@/features/materials/paths";
import type { ProductionPart } from "@/features/production/paths";
import {
  countPhrase,
  formatPlanQuantity,
  kindLabel,
  materialQuantityPhrase,
  moneyLines,
  recipeGapLabel,
} from "@/features/production/text";
import { Dialog } from "@/features/shell/dialog";
import { IconClose, IconEye, IconFlow } from "@/features/shell/icons";

type SortMode = "name" | "quantity";
type KindFilter = "all" | ProductionKind;
type PlaceGroup = { id: string; name: string; rows: ListedRow[] };

interface ListedRow {
  id: string;
  name: string;
  kind: ProductionKind;
  deleted: boolean;
  placeId: string;
  placeName: string;
  quantity: number;
  unit: MaterialUnit;
  cost: KopeckPair | null;
  recipeGap: ProductionRecipeGap | null;
  shares: ProductionShare[];
}

export function PlanPanel({
  document,
  part,
  outputs,
  inputs,
  totals,
}: {
  document: PrototypeDocument;
  part: ProductionPart;
  outputs: ProductionOutputRow[];
  inputs: ProductionInputRow[];
  totals: ProductionTotals;
}) {
  const rows = useMemo(
    () => (part === "output" ? outputs.map(outputRow) : inputs.map(inputRow)),
    [inputs, outputs, part],
  );
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<KindFilter>("all");
  const [placeId, setPlaceId] = useState("");
  const [sort, setSort] = useState<SortMode>("name");
  const [openedId, setOpenedId] = useState<string | null>(null);
  const places = useMemo(() => uniquePlaces(rows), [rows]);
  const filtersOn =
    query.trim().length > 0 || kind !== "all" || placeId.length > 0 || sort !== "name";
  const visible = sortRows(
    rows.filter((row) => matches(row, query, kind, placeId)),
    sort,
  );
  const groups = groupRows(visible);
  const opened = rows.find((row) => row.id === openedId) ?? null;

  function resetFilters() {
    setQuery("");
    setKind("all");
    setPlaceId("");
    setSort("name");
  }

  return (
    <div className="flex flex-col gap-8">
      <Totals totals={totals} />
      {rows.length === 0 ? (
        <p className="border border-line bg-sheet px-5 py-8 text-sm leading-6 text-muted">
          По этому плану считать нечего.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          <Filters
            part={part}
            query={query}
            kind={kind}
            placeId={placeId}
            sort={sort}
            places={places}
            visibleCount={visible.length}
            totalCount={rows.length}
            filtersOn={filtersOn}
            onQuery={setQuery}
            onKind={setKind}
            onPlace={setPlaceId}
            onSort={setSort}
            onReset={resetFilters}
          />
          {visible.length === 0 ? (
            <p className="border border-line bg-sheet px-5 py-8 text-sm leading-6 text-muted">
              Ничего не найдено. Измените поиск или сбросьте фильтр.
            </p>
          ) : (
            <>
              <GroupedCards
                document={document}
                part={part}
                groups={groups}
                onOpen={setOpenedId}
              />
              <GroupedTable
                document={document}
                part={part}
                groups={groups}
                onOpen={setOpenedId}
              />
            </>
          )}
        </div>
      )}
      {opened ? (
        <ShareDialog part={part} row={opened} onClose={() => setOpenedId(null)} />
      ) : null}
    </div>
  );
}

function Totals({ totals }: { totals: ProductionTotals }) {
  const materialMoney = moneyLines(totals.materialCost);

  return (
    <section
      aria-label="Итоги месяца"
      className="grid border border-line bg-sheet md:grid-cols-3"
    >
      <div className="border-b border-line p-5 sm:p-6 md:border-r md:border-b-0">
        <h2 className="text-sm text-muted">Выпустить</h2>
        <p className="mt-4 font-figure text-2xl leading-none tracking-tight text-ink tabular-nums">
          {formatPlanQuantity(totals.productPieces, "piece")}
        </p>
        <p className="mt-2 text-sm text-muted">
          {countPhrase(totals.productCount, "товар", "товара", "товаров")}
        </p>
        <p className="mt-5 text-lg leading-none font-semibold text-ink tabular-nums">
          {formatPlanQuantity(totals.derivativeGrams, "kg")}
        </p>
        <p className="mt-2 text-sm text-muted">
          {countPhrase(
            totals.derivativeCount,
            "производная",
            "производные",
            "производных",
          )}
        </p>
      </div>
      <div className="border-b border-line p-5 sm:p-6 md:border-r md:border-b-0">
        <h2 className="text-sm text-muted">Потратить</h2>
        <p className="mt-4 text-lg leading-snug font-semibold break-words text-ink tabular-nums">
          {materialQuantityPhrase(totals.materialGrams, totals.materialPieces)}
        </p>
        <p className="mt-2 text-sm text-muted">
          {countPhrase(
            totals.materialCount,
            "позиция сырья",
            "позиции сырья",
            "позиций сырья",
          )}
        </p>
      </div>
      <div className="p-5 sm:p-6">
        <h2 className="text-sm text-muted">Себестоимость сырья</h2>
        {materialMoney ? (
          <>
            <p className="mt-4 text-lg leading-snug font-semibold text-ink tabular-nums">
              {materialMoney.withVat}
            </p>
            <p className="mt-2 text-sm text-muted tabular-nums">{materialMoney.exVat}</p>
          </>
        ) : (
          <p className="mt-4 text-sm leading-6 text-muted">Себестоимость не считается</p>
        )}
      </div>
    </section>
  );
}

function Filters({
  part,
  query,
  kind,
  placeId,
  sort,
  places,
  visibleCount,
  totalCount,
  filtersOn,
  onQuery,
  onKind,
  onPlace,
  onSort,
  onReset,
}: {
  part: ProductionPart;
  query: string;
  kind: KindFilter;
  placeId: string;
  sort: SortMode;
  places: { id: string; name: string }[];
  visibleCount: number;
  totalCount: number;
  filtersOn: boolean;
  onQuery: (value: string) => void;
  onKind: (value: KindFilter) => void;
  onPlace: (value: string) => void;
  onSort: (value: SortMode) => void;
  onReset: () => void;
}) {
  const searchId = useId();
  const kindId = useId();
  const placeIdField = useId();
  const sortId = useId();
  const placeLabel = part === "output" ? "Цех" : "Склад";

  return (
    <div className="border border-line bg-sheet">
      <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(10rem,0.7fr))]">
        <div className="min-w-0">
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
          <label htmlFor={placeIdField} className="text-sm text-muted">
            {placeLabel}
          </label>
          <select
            id={placeIdField}
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
            <option value="quantity">По количеству</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-3 border-t border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p className="text-sm text-muted">
          Показано {visibleCount} из {totalCount}
        </p>
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

function GroupedCards({
  document,
  part,
  groups,
  onOpen,
}: {
  document: PrototypeDocument;
  part: ProductionPart;
  groups: PlaceGroup[];
  onOpen: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-8 md:hidden">
      {groups.map((group) => (
        <section key={group.id || group.name} className="flex flex-col gap-3">
          <GroupTitle
            name={group.name}
            count={group.rows.length}
            deleted={placeDeleted(document, part, group.id)}
          />
          <ul className="flex flex-col gap-3">
            {group.rows.map((row) => (
              <RowCard key={row.id} part={part} row={row} onOpen={onOpen} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function RowCard({
  part,
  row,
  onOpen,
}: {
  part: ProductionPart;
  row: ListedRow;
  onOpen: (id: string) => void;
}) {
  const issue = issueText(row);

  return (
    <li className="border border-line bg-sheet p-4">
      <RowName row={row} />
      <p className="mt-1 text-sm text-muted">{kindLabel(row.kind, row.deleted)}</p>
      <dl className="mt-4 border-t border-line pt-4">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-sm text-muted">Количество</dt>
          <dd className="text-base font-semibold text-ink tabular-nums">
            {formatPlanQuantity(row.quantity, row.unit)}
          </dd>
        </div>
        <div className="mt-3 flex items-start justify-between gap-4">
          <dt className="pt-0.5 text-sm text-muted">Себестоимость</dt>
          <dd className="text-right text-sm text-ink">
            <MoneyText money={moneyLines(row.cost)} />
          </dd>
        </div>
      </dl>
      {issue ? <p className="mt-3 text-sm leading-6 text-muted">{issue}</p> : null}
      <button
        type="button"
        onClick={() => onOpen(row.id)}
        className={`mt-4 w-full ${quietButtonClassName}`}
      >
        <ShareIcon part={part} />
        {shareLabel(part)}
      </button>
    </li>
  );
}

function GroupedTable({
  document,
  part,
  groups,
  onOpen,
}: {
  document: PrototypeDocument;
  part: ProductionPart;
  groups: PlaceGroup[];
  onOpen: (id: string) => void;
}) {
  return (
    <div className="hidden overflow-x-auto border border-line bg-sheet md:block">
      <table className="w-full min-w-[52rem] border-collapse text-sm">
        <caption className="sr-only">
          {part === "output" ? "План по производству" : "План по расходам"}
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
              Количество
            </th>
            <th
              scope="col"
              className="min-w-52 px-4 py-3 text-right font-normal text-muted"
            >
              Себестоимость
            </th>
            <th scope="col" className="w-40 px-4 py-3 text-right font-normal text-muted">
              <span className="sr-only">{shareLabel(part)}</span>
            </th>
          </tr>
        </thead>
        {groups.map((group) => (
          <tbody key={group.id || group.name}>
            <tr className="border-b border-line">
              <th
                scope="colgroup"
                colSpan={5}
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
              const issue = issueText(row);
              return (
                <tr key={row.id} className="group border-b border-line last:border-b-0">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 border-r border-line bg-sheet px-4 py-4 text-left font-normal group-hover:bg-paper"
                  >
                    <RowName row={row} />
                    {issue ? (
                      <p className="mt-1 text-sm leading-5 text-muted">{issue}</p>
                    ) : null}
                  </th>
                  <td className="px-4 py-4 text-muted group-hover:bg-paper">
                    {kindLabel(row.kind, row.deleted)}
                  </td>
                  <td className="px-4 py-4 text-right text-base font-semibold text-ink tabular-nums group-hover:bg-paper">
                    {formatPlanQuantity(row.quantity, row.unit)}
                  </td>
                  <td className="px-4 py-4 text-right text-ink group-hover:bg-paper">
                    <MoneyText money={moneyLines(row.cost)} />
                  </td>
                  <td className="px-4 py-3 text-right group-hover:bg-paper">
                    <button
                      type="button"
                      onClick={() => onOpen(row.id)}
                      className={quietButtonClassName}
                    >
                      <ShareIcon part={part} />
                      {shareLabel(part)}
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

function GroupTitle({
  name,
  count,
  deleted,
}: {
  name: string;
  count: number;
  deleted: boolean;
}) {
  return (
    <h2 className="flex items-baseline justify-between gap-3 border-b border-line pb-2">
      <span className="text-base font-semibold text-ink">
        {name}
        {deleted ? (
          <span className="ml-2 text-sm font-normal text-muted">удалён</span>
        ) : null}
      </span>
      <span className="shrink-0 text-sm font-normal text-muted">
        {countPhrase(count, "позиция", "позиции", "позиций")}
      </span>
    </h2>
  );
}

function ShareDialog({
  part,
  row,
  onClose,
}: {
  part: ProductionPart;
  row: ListedRow;
  onClose: () => void;
}) {
  const empty =
    part === "output"
      ? (issueText(row) ?? "В этом выпуске нет состава.")
      : "Эту позицию в этом месяце никто не забирает.";

  return (
    <Dialog title={`${shareLabel(part)}: ${row.name}`} wide onClose={onClose}>
      {row.shares.length === 0 ? (
        <p className="text-sm leading-6 text-muted">{empty}</p>
      ) : (
        <ul className="flex flex-col">
          {row.shares.map((share) => (
            <li
              key={`${share.kind}:${share.id}`}
              className="flex flex-col gap-2 border-b border-line py-4 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between"
            >
              <div className="min-w-0">
                <ShareName share={share} />
                <p className="mt-1 text-sm text-muted">
                  {kindLabel(share.kind, share.deleted)}
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-ink tabular-nums">
                {formatPlanQuantity(share.quantity, share.unit)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Dialog>
  );
}

function MoneyText({ money }: { money: { withVat: string; exVat: string } | null }) {
  if (!money) {
    return <span className="text-muted">Себестоимость не считается</span>;
  }

  return (
    <span className="tabular-nums">
      <span className="block">{money.withVat}</span>
      <span className="block text-muted">{money.exVat}</span>
    </span>
  );
}

function RowName({ row }: { row: ListedRow }) {
  return (
    <Link href={entityHref(row.kind, row.id)} className={nameLinkClassName}>
      {row.name}
    </Link>
  );
}

function ShareName({ share }: { share: ProductionShare }) {
  return (
    <Link href={entityHref(share.kind, share.id)} className={nameLinkClassName}>
      {share.name}
    </Link>
  );
}

function outputRow(row: ProductionOutputRow): ListedRow {
  return {
    id: row.id,
    name: row.name,
    kind: row.kind,
    deleted: row.deleted,
    placeId: row.workshopId,
    placeName: row.workshopName,
    quantity: row.quantity,
    unit: row.unit,
    cost: row.cost,
    recipeGap: row.recipeGap,
    shares: row.components,
  };
}

function inputRow(row: ProductionInputRow): ListedRow {
  return {
    id: row.id,
    name: row.name,
    kind: row.kind,
    deleted: row.deleted,
    placeId: row.warehouseId,
    placeName: row.warehouseName,
    quantity: row.quantity,
    unit: row.unit,
    cost: row.cost,
    recipeGap: row.recipeGap,
    shares: row.consumers,
  };
}

function matches(
  row: ListedRow,
  query: string,
  kind: KindFilter,
  placeId: string,
): boolean {
  if (kind !== "all" && row.kind !== kind) {
    return false;
  }
  if (placeId && row.placeId !== placeId) {
    return false;
  }

  const needle = query.trim().toLocaleLowerCase("ru-RU");
  if (!needle) {
    return true;
  }

  return row.name.toLocaleLowerCase("ru-RU").includes(needle);
}

function sortRows(rows: ListedRow[], sort: SortMode): ListedRow[] {
  const copy = rows.slice();
  if (sort === "quantity") {
    copy.sort(
      (left, right) =>
        right.quantity - left.quantity || left.name.localeCompare(right.name, "ru"),
    );
    return copy;
  }

  copy.sort((left, right) => left.name.localeCompare(right.name, "ru"));
  return copy;
}

function groupRows(rows: ListedRow[]): PlaceGroup[] {
  const groups = new Map<string, { id: string; name: string; rows: ListedRow[] }>();
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

function uniquePlaces(rows: readonly ListedRow[]): { id: string; name: string }[] {
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

function issueText(row: ListedRow): string | null {
  if (row.recipeGap) {
    return recipeGapLabel(row.recipeGap);
  }
  if (row.cost === null) {
    return "Себестоимость не считается";
  }

  return null;
}

function entityHref(kind: ProductionKind, id: string): string {
  return kind === "material" ? materialDetailHref(id) : derivativeDetailHref(id);
}

function shareLabel(part: ProductionPart): string {
  return part === "output" ? "Состав" : "Куда уходит";
}

function ShareIcon({ part }: { part: ProductionPart }) {
  return part === "output" ? <IconEye /> : <IconFlow />;
}

const quietButtonClassName =
  "inline-flex h-11 items-center justify-center gap-2 border border-line bg-paper px-4 text-sm whitespace-nowrap text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

const nameLinkClassName =
  "font-semibold break-words text-ink outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
