"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";

import type { ProductionFact, PrototypeDocument } from "@/domain/document";
import type { FactRejection } from "@/domain/production-fact";
import { productionFactsInMonth } from "@/domain/production-fact";
import { monthKeyFromDate } from "@/domain/sales-plan";
import { fieldClassName, primaryButtonClassName } from "@/features/materials/fields";
import { CreateFactDialog } from "@/features/production/create-fact-dialog";
import { factHref, productionHref } from "@/features/production/paths";
import { FACT_ERROR, formatFactDate } from "@/features/production/text";
import { useProductionFact } from "@/features/production/use-production";
import { IconClose, IconPlus, IconUndo } from "@/features/shell/icons";
import { formatQuantity } from "@/features/stock/text";

export function FactJournal({
  month,
  showDeleted,
}: {
  month: string;
  showDeleted: boolean;
}) {
  const production = useProductionFact();
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const items = productionFactsInMonth(production.document, month, showDeleted)
    .slice()
    .sort(byDateDesc);
  const deletedCount = productionFactsInMonth(production.document, month, true).length;
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState("");
  const [workshopId, setWorkshopId] = useState("");
  const workshops = useMemo(
    () => workshopOptions(production.document, items),
    [items, production.document],
  );
  const filtersOn = query.trim().length > 0 || workshopId.length > 0;
  const visible = items.filter((item) =>
    matches(production.document, item, query, workshopId),
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
        {showDeleted ? (
          <p className="col-span-2 text-sm leading-6 text-muted sm:col-span-1">
            Удалённые записи не входят в сравнение с планом.
          </p>
        ) : (
          <button
            type="button"
            disabled={!production.hydrated}
            onClick={() => setCreating(true)}
            className={`w-full sm:w-auto ${primaryButtonClassName}`}
          >
            <IconPlus />
            Добавить день
          </button>
        )}
        <Link
          href={productionHref("fact", "output", month, currentMonth, {
            showDeleted: !showDeleted,
          })}
          aria-current={showDeleted ? "page" : undefined}
          className={`inline-flex h-11 w-full items-center justify-center gap-2 border px-3 text-sm whitespace-nowrap outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:w-auto sm:px-4 ${
            showDeleted
              ? "border-ink bg-ink text-white"
              : "border-line bg-sheet text-ink hover:border-ink"
          }`}
        >
          <IconUndo />
          Удалённые{deletedCount > 0 ? ` ${deletedCount}` : ""}
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="border border-line bg-sheet px-5 py-10 text-sm leading-6 text-muted">
          {showDeleted
            ? "Удалённых записей за этот месяц нет."
            : "Записей за этот месяц нет. Добавьте день и укажите, сколько выпустили и сколько ингредиентов ушло."}
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <Filters
            query={query}
            workshopId={workshopId}
            workshops={workshops}
            visibleCount={visible.length}
            totalCount={items.length}
            filtersOn={filtersOn}
            onQuery={setQuery}
            onWorkshop={setWorkshopId}
            onReset={() => {
              setQuery("");
              setWorkshopId("");
            }}
          />
          {visible.length === 0 ? (
            <p className="border border-line bg-sheet px-5 py-10 text-sm leading-6 text-muted">
              Ничего не найдено. Измените поиск или сбросьте фильтр.
            </p>
          ) : (
            <>
              <ul className="flex flex-col gap-3 md:hidden">
                {visible.map((item) => (
                  <JournalCard
                    key={item.id}
                    item={item}
                    document={production.document}
                    showDeleted={showDeleted}
                    disabled={!production.hydrated}
                    onRestore={() => production.restoreFact(item.id)}
                  />
                ))}
              </ul>
              <div className="hidden overflow-x-auto border border-line bg-sheet md:block">
                <table className="w-full min-w-[44rem] border-collapse text-sm">
                  <caption className="sr-only">Записи факта за месяц</caption>
                  <thead>
                    <tr className="border-b border-line">
                      <th
                        scope="col"
                        className="sticky left-0 z-10 min-w-52 border-r border-line bg-paper px-5 py-3 text-left font-normal text-muted"
                      >
                        Дата
                      </th>
                      <th
                        scope="col"
                        className="min-w-40 px-5 py-3 text-left font-normal text-muted"
                      >
                        Пометка
                      </th>
                      <th
                        scope="col"
                        className="min-w-64 px-5 py-3 text-left font-normal text-muted"
                      >
                        Производство
                      </th>
                      {showDeleted ? (
                        <th
                          scope="col"
                          className="w-28 px-5 py-3 text-right font-normal text-muted"
                        >
                          <span className="sr-only">Вернуть</span>
                        </th>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((item) => (
                      <JournalRow
                        key={item.id}
                        item={item}
                        document={production.document}
                        showDeleted={showDeleted}
                        disabled={!production.hydrated}
                        onRestore={() => production.restoreFact(item.id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {creating ? (
        <CreateFactDialog
          month={month}
          today={today}
          onClose={() => setCreating(false)}
        />
      ) : null}
    </div>
  );
}

function Filters({
  query,
  workshopId,
  workshops,
  visibleCount,
  totalCount,
  filtersOn,
  onQuery,
  onWorkshop,
  onReset,
}: {
  query: string;
  workshopId: string;
  workshops: { id: string; name: string }[];
  visibleCount: number;
  totalCount: number;
  filtersOn: boolean;
  onQuery: (value: string) => void;
  onWorkshop: (value: string) => void;
  onReset: () => void;
}) {
  const searchId = useId();
  const workshopFieldId = useId();

  return (
    <div className="border border-line bg-sheet">
      <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
        <div className="min-w-0">
          <label htmlFor={searchId} className="text-sm text-muted">
            Поиск
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            autoComplete="off"
            placeholder="Дата, пометка, позиция"
            onChange={(event) => onQuery(event.target.value)}
            className={`mt-2 ${fieldClassName}`}
          />
        </div>
        <div className="min-w-0">
          <label htmlFor={workshopFieldId} className="text-sm text-muted">
            Цех
          </label>
          <select
            id={workshopFieldId}
            value={workshopId}
            onChange={(event) => onWorkshop(event.target.value)}
            className={`mt-2 ${fieldClassName}`}
          >
            <option value="">Все</option>
            {workshops.map((workshop) => (
              <option key={workshop.id || workshop.name} value={workshop.id}>
                {workshop.name}
              </option>
            ))}
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

function JournalCard({
  item,
  document,
  showDeleted,
  disabled,
  onRestore,
}: {
  item: ProductionFact;
  document: PrototypeDocument;
  showDeleted: boolean;
  disabled: boolean;
  onRestore: () => FactRejection | null;
}) {
  const [error, setError] = useState<string | null>(null);
  const summary = outputSummary(document, item);

  return (
    <li className="border border-line bg-sheet p-5">
      <Link
        href={factHref(item.id)}
        className={`${nameLinkClassName} font-figure text-lg`}
      >
        {formatFactDate(item.occurredOn)}
      </Link>
      <p className="mt-2 text-sm leading-6 text-muted">{item.note || "Без пометки"}</p>
      <p className="mt-4 border-t border-line pt-4 text-sm leading-6 text-ink">
        {summary}
      </p>
      {showDeleted ? (
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            const rejection = onRestore();
            setError(rejection ? FACT_ERROR[rejection] : null);
          }}
          className={`mt-4 ${quietButtonClassName}`}
        >
          <IconUndo />
          Вернуть
        </button>
      ) : null}
      {error ? <p className="mt-2 text-sm text-ink">{error}</p> : null}
    </li>
  );
}

function JournalRow({
  item,
  document,
  showDeleted,
  disabled,
  onRestore,
}: {
  item: ProductionFact;
  document: PrototypeDocument;
  showDeleted: boolean;
  disabled: boolean;
  onRestore: () => FactRejection | null;
}) {
  const [error, setError] = useState<string | null>(null);

  return (
    <tr className="group border-b border-line last:border-b-0">
      <th
        scope="row"
        className="sticky left-0 z-10 border-r border-line bg-sheet px-5 py-4 text-left font-normal group-hover:bg-paper"
      >
        <Link href={factHref(item.id)} className={nameLinkClassName}>
          {formatFactDate(item.occurredOn)}
        </Link>
      </th>
      <td className="px-5 py-4 text-muted group-hover:bg-paper">{item.note || "—"}</td>
      <td className="px-5 py-4 text-ink group-hover:bg-paper">
        {outputSummary(document, item)}
      </td>
      {showDeleted ? (
        <td className="px-5 py-3 text-right group-hover:bg-paper">
          <button
            type="button"
            aria-label={`Вернуть запись ${formatFactDate(item.occurredOn)}`}
            disabled={disabled}
            onClick={() => {
              const rejection = onRestore();
              setError(rejection ? FACT_ERROR[rejection] : null);
            }}
            className={quietButtonClassName}
          >
            <IconUndo />
            Вернуть
          </button>
          {error ? <p className="mt-2 text-sm text-ink">{error}</p> : null}
        </td>
      ) : null}
    </tr>
  );
}

function outputSummary(document: PrototypeDocument, fact: ProductionFact): string {
  if (fact.outputs.length === 0) {
    return "Выпуска нет";
  }

  const shown = fact.outputs.slice(0, 3).map((output) => {
    const owner = document.derivatives.find((item) => item.id === output.refId);
    const unit = owner?.isFinalProduct === false ? "kg" : "piece";
    const name = owner?.name ?? "Позиция";
    return `${name} ${formatQuantity(output.quantity, unit)}`;
  });
  if (fact.outputs.length > 3) {
    shown.push(`и ещё ${fact.outputs.length - 3}`);
  }

  return shown.join(", ");
}

function workshopOptions(
  document: PrototypeDocument,
  facts: readonly ProductionFact[],
): { id: string; name: string }[] {
  const ids = new Set<string>();
  for (const fact of facts) {
    for (const output of fact.outputs) {
      const owner = document.derivatives.find((item) => item.id === output.refId);
      if (owner) {
        ids.add(owner.workshopId);
      }
    }
  }

  return [...ids]
    .map((id) => {
      const workshop = document.workshops.find((item) => item.id === id);
      const name = workshop?.name ?? "Цех";
      return {
        id,
        name: workshop?.deletedAt ? `${name} · удалён` : name,
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name, "ru"));
}

function matches(
  document: PrototypeDocument,
  fact: ProductionFact,
  query: string,
  workshopId: string,
): boolean {
  if (workshopId) {
    const hit = fact.outputs.some((output) => {
      const owner = document.derivatives.find((item) => item.id === output.refId);
      return owner?.workshopId === workshopId;
    });
    if (!hit) {
      return false;
    }
  }

  const needle = query.trim().toLocaleLowerCase("ru-RU");
  if (!needle) {
    return true;
  }

  const names = fact.outputs.flatMap((output) => {
    const owner = document.derivatives.find((item) => item.id === output.refId);
    const ingredients = output.uses.map((use) =>
      ingredientName(document, use.kind, use.refId),
    );
    return [owner?.name ?? "", ...ingredients];
  });
  const haystack = [fact.occurredOn, formatFactDate(fact.occurredOn), fact.note, ...names]
    .join("\n")
    .toLocaleLowerCase("ru-RU");

  return haystack.includes(needle);
}

function ingredientName(
  document: PrototypeDocument,
  kind: "material" | "derivative",
  refId: string,
): string {
  if (kind === "material") {
    return document.materials.find((item) => item.id === refId)?.name ?? "";
  }

  return document.derivatives.find((item) => item.id === refId)?.name ?? "";
}

function byDateDesc(left: ProductionFact, right: ProductionFact): number {
  if (left.occurredOn !== right.occurredOn) {
    return left.occurredOn < right.occurredOn ? 1 : -1;
  }

  return left.id < right.id ? 1 : -1;
}

const quietButtonClassName =
  "inline-flex h-11 w-full items-center justify-center gap-2 border border-line bg-sheet px-4 text-sm whitespace-nowrap text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:w-auto";

const nameLinkClassName =
  "font-semibold break-words text-ink outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
