"use client";

import Link from "next/link";
import { useState } from "react";

import { primaryButtonClassName } from "@/features/materials/fields";
import { CreateEntryDialog } from "@/features/materials/create-entry-dialog";
import { MadeTable } from "@/features/materials/made-table";
import { MaterialTable } from "@/features/materials/material-table";
import { materialListHref, type MaterialKind } from "@/features/materials/paths";
import { useMaterials } from "@/features/materials/use-materials";
import {
  IconDerivative,
  IconMaterial,
  IconPlus,
  IconProduct,
  IconUndo,
} from "@/features/shell/icons";

export function MaterialBoard({
  kind,
  showDeleted,
}: {
  kind: MaterialKind;
  showDeleted: boolean;
}) {
  const catalog = useMaterials();
  const [createOpen, setCreateOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(new Set());
  const materials = showDeleted ? catalog.deletedMaterials : catalog.materials;
  const made = (showDeleted ? catalog.deletedDerivatives : catalog.derivatives).filter(
    (item) => (kind === "products" ? item.isFinalProduct : !item.isFinalProduct),
  );
  const deletedCount =
    kind === "materials"
      ? catalog.deletedMaterials.length
      : catalog.deletedDerivatives.filter((item) =>
          kind === "products" ? item.isFinalProduct : !item.isFinalProduct,
        ).length;

  const addLabel =
    kind === "materials"
      ? "Добавить сырьё"
      : kind === "products"
        ? "Добавить товар"
        : "Добавить производную";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-between">
        <div className="grid grid-cols-3 border border-line bg-sheet p-1 sm:flex">
          <KindLink kind="materials" current={kind} showDeleted={showDeleted} />
          <KindLink kind="derivatives" current={kind} showDeleted={showDeleted} />
          <KindLink kind="products" current={kind} showDeleted={showDeleted} />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          {showDeleted ? null : (
            <button
              type="button"
              disabled={!catalog.hydrated}
              onClick={() => setCreateOpen(true)}
              className={`w-full sm:h-full sm:w-auto ${primaryButtonClassName}`}
            >
              <IconPlus />
              {addLabel}
            </button>
          )}
          <Link
            href={materialListHref(kind, !showDeleted)}
            aria-current={showDeleted ? "page" : undefined}
            className={`inline-flex h-11 items-center justify-center gap-2 border px-3 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:h-full ${
              showDeleted
                ? "border-ink bg-ink text-white"
                : "border-line bg-sheet text-ink hover:border-ink"
            }`}
          >
            <IconUndo />
            Удалённые{deletedCount > 0 ? ` ${deletedCount}` : ""}
          </Link>
        </div>
      </div>

      {createOpen ? (
        <CreateEntryDialog
          kind={kind}
          onClose={() => setCreateOpen(false)}
          onCreated={(id) => {
            if (kind !== "materials") {
              setExpandedIds((current) => new Set([...current, id]));
            }
          }}
        />
      ) : null}

      {kind === "materials" ? (
        materials.length === 0 ? (
          <p className="text-sm leading-6 text-muted">
            {showDeleted
              ? "Удалённого сырья нет."
              : "Сырья нет. Добавьте название, склад и цену закупки."}
          </p>
        ) : (
          <MaterialTable items={materials} showDeleted={showDeleted} />
        )
      ) : made.length === 0 ? (
        <p className="text-sm leading-6 text-muted">
          {kind === "products"
            ? showDeleted
              ? "Удалённых товаров нет."
              : "Товаров нет. Добавьте товар и откройте рецептурную карту."
            : showDeleted
              ? "Удалённых производных нет."
              : "Производных нет. Добавьте производную и откройте рецептурную карту."}
        </p>
      ) : (
        <MadeTable
          items={made}
          isFinalProduct={kind === "products"}
          showDeleted={showDeleted}
          expandedIds={expandedIds}
          onToggle={(id) => {
            setExpandedIds((current) => {
              const next = new Set(current);
              if (next.has(id)) {
                next.delete(id);
              } else {
                next.add(id);
              }
              return next;
            });
          }}
        />
      )}
    </div>
  );
}

function KindLink({
  kind,
  current,
  showDeleted,
}: {
  kind: MaterialKind;
  current: MaterialKind;
  showDeleted: boolean;
}) {
  const selected = kind === current;
  const label =
    kind === "materials" ? "Сырьё" : kind === "products" ? "Товары" : "Производные";

  return (
    <Link
      href={materialListHref(kind, showDeleted)}
      aria-current={selected ? "page" : undefined}
      className={`inline-flex h-9 min-w-0 items-center justify-center gap-1 px-1 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:gap-2 sm:justify-start sm:px-4 ${
        selected ? "bg-ink text-white" : "text-muted hover:text-ink"
      }`}
    >
      {kind === "materials" ? (
        <IconMaterial />
      ) : kind === "products" ? (
        <IconProduct />
      ) : (
        <IconDerivative />
      )}
      {label}
    </Link>
  );
}
