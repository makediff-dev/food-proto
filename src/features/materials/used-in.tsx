"use client";

import Link from "next/link";
import { useId, useState } from "react";

import type { DeletableRecord } from "@/domain/document";
import { recipeUsages } from "@/domain/materials";
import { formatKilogramsFromGrams } from "@/domain/units";
import { fieldClassName } from "@/features/materials/fields";
import { derivativeDetailHref } from "@/features/materials/paths";
import { useMaterials } from "@/features/materials/use-materials";

export function UsedIn({
  kind,
  refId,
}: {
  kind: "material" | "derivative";
  refId: string;
}) {
  const catalog = useMaterials();
  const searchId = useId();
  const [query, setQuery] = useState("");
  const usages = recipeUsages(catalog.document, kind, refId);
  const needle = query.trim().toLocaleLowerCase("ru-RU");
  const visible = needle
    ? usages.filter((usage) =>
        usage.owner.name.toLocaleLowerCase("ru-RU").includes(needle),
      )
    : usages;

  return (
    <section className="mt-3 flex flex-col gap-3">
      <h2 className="text-base font-semibold text-ink">Используется в</h2>
      {usages.length === 0 ? (
        <p className="text-sm leading-6 text-muted">
          Пока нигде не используется. Добавьте позицию в рецептурную карту производной или
          товара.
        </p>
      ) : (
        <>
          {usages.length > 1 ? (
            <div className="border border-line bg-sheet px-4 py-3">
              <label htmlFor={searchId} className="text-sm text-muted">
                Поиск
              </label>
              <input
                id={searchId}
                type="search"
                value={query}
                autoComplete="off"
                placeholder="Название"
                onChange={(event) => setQuery(event.target.value)}
                className={`mt-1.5 ${fieldClassName}`}
              />
            </div>
          ) : null}
          {visible.length === 0 ? (
            <p className="text-sm leading-6 text-muted">
              Ничего не найдено. Измените поиск.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((usage) => {
                const workshop = placeName(
                  catalog.document.workshops,
                  usage.owner.workshopId,
                );
                const quantity = usage.piece
                  ? `${usage.quantityGrams.toLocaleString("ru-RU")} шт`
                  : `${formatKilogramsFromGrams(usage.quantityGrams)} кг`;
                const norm = usage.owner.isFinalProduct
                  ? "на 1000 шт"
                  : "на 100 кг готового продукта";

                return (
                  <li key={usage.owner.id}>
                    <Link
                      href={derivativeDetailHref(usage.owner.id)}
                      className="flex h-full flex-col gap-1 border border-line bg-sheet px-4 py-3 outline-none hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                    >
                      <p className="text-base font-semibold break-words text-ink">
                        {usage.owner.name}
                        {usage.owner.deletedAt ? " (удалён)" : ""}
                      </p>
                      <p className="text-sm text-muted">
                        {usage.owner.isFinalProduct ? "Конечный товар" : "Производная"}
                      </p>
                      <p className="text-sm text-ink">{workshop}</p>
                      <p className="text-sm text-muted">
                        {quantity} {norm}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </section>
  );
}

function placeName(places: readonly DeletableRecord[], id: string): string {
  const place = places.find((item) => item.id === id);
  if (!place) {
    return "Не найдено";
  }

  return place.deletedAt ? `${place.name} (удалён)` : place.name;
}
