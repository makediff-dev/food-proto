"use client";

import Link from "next/link";
import { useState } from "react";

import { activeWarehouses } from "@/domain/directory";
import { primaryButtonClassName } from "@/features/materials/fields";
import {
  IconBalances,
  IconDelivery,
  IconFlow,
  IconPlus,
  IconUndo,
  IconWriteOff,
} from "@/features/shell/icons";
import { PageFrame } from "@/features/shell/page-frame";
import { BalancesPanel } from "@/features/stock/balances-panel";
import { CreateMovementDialog } from "@/features/stock/create-movement-dialog";
import { JournalBoard } from "@/features/stock/journal-board";
import { STOCK_SECTION_TITLE, stockHref, type StockTab } from "@/features/stock/paths";
import { useStock } from "@/features/stock/use-stock";

const TABS: { id: StockTab; label: string }[] = [
  { id: "deliveries", label: "Поставки" },
  { id: "write-offs", label: "Списания" },
  { id: "flow", label: "Расход/приход" },
  { id: "balances", label: "Остатки на складах" },
];

export function StockScreen({
  tab,
  showDeleted,
  warehouseId,
  month,
}: {
  tab: StockTab;
  showDeleted: boolean;
  warehouseId: string;
  month: string;
}) {
  return (
    <PageFrame
      title={STOCK_SECTION_TITLE}
      lede="Поставки сырья, списания и остатки на складах."
      wide
    >
      <StockWorkspace
        tab={tab}
        showDeleted={showDeleted}
        warehouseId={warehouseId}
        month={month}
      />
    </PageFrame>
  );
}

export function WarehouseStock({ warehouseId }: { warehouseId: string }) {
  const [tab, setTab] = useState<StockTab>("deliveries");
  const [showDeleted, setShowDeleted] = useState(false);

  return (
    <StockWorkspace
      tab={tab}
      showDeleted={showDeleted}
      warehouseId={warehouseId}
      month=""
      lockedWarehouseId={warehouseId}
      onTab={setTab}
      onShowDeleted={setShowDeleted}
    />
  );
}

function StockWorkspace({
  tab,
  showDeleted,
  warehouseId,
  month,
  lockedWarehouseId,
  onTab,
  onShowDeleted,
}: {
  tab: StockTab;
  showDeleted: boolean;
  warehouseId: string;
  month: string;
  lockedWarehouseId?: string;
  onTab?: (tab: StockTab) => void;
  onShowDeleted?: (showDeleted: boolean) => void;
}) {
  const stock = useStock();
  const [creating, setCreating] = useState(false);
  const locked = Boolean(lockedWarehouseId);
  const lockedActive =
    locked &&
    stock.document.warehouses.some(
      (item) => item.id === lockedWarehouseId && item.deletedAt === null,
    );
  const canCreate =
    stock.hydrated &&
    (tab === "deliveries" || tab === "write-offs") &&
    !showDeleted &&
    (locked ? lockedActive : activeWarehouses(stock.document).length > 0);
  const journalMode = tab === "deliveries" || tab === "write-offs";

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full min-w-0 lg:w-auto">
          <div
            className="flex w-full flex-wrap border border-line bg-sheet p-1 lg:w-max lg:flex-nowrap"
            role="tablist"
          >
            {TABS.map((item) => (
              <StockTabControl
                key={item.id}
                tab={item.id}
                label={item.label}
                current={tab}
                showDeleted={showDeleted}
                warehouseId={warehouseId}
                onTab={onTab}
              />
            ))}
          </div>
        </div>
        {journalMode ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            {showDeleted ? null : canCreate ? (
              <button
                type="button"
                onClick={() => setCreating(true)}
                className={primaryButtonClassName}
              >
                <IconPlus />
                {tab === "deliveries" ? "Добавить поставку" : "Добавить списание"}
              </button>
            ) : locked ? (
              stock.hydrated && !lockedActive ? (
                <p className="text-sm leading-6 text-muted sm:max-w-xs sm:text-right">
                  Склад удалён. Новые поставки и списания не добавляются.
                </p>
              ) : null
            ) : (
              <p className="text-sm leading-6 text-muted">
                Чтобы добавить документ, сначала нужен рабочий склад.
              </p>
            )}
            {onShowDeleted ? (
              <button
                type="button"
                aria-pressed={showDeleted}
                onClick={() => onShowDeleted(!showDeleted)}
                className={deletedControlClass(showDeleted)}
              >
                <IconUndo />
                Удалённые
              </button>
            ) : (
              <Link
                href={stockHref(tab, !showDeleted, warehouseId)}
                aria-current={showDeleted ? "page" : undefined}
                className={deletedControlClass(showDeleted)}
              >
                <IconUndo />
                Удалённые
              </Link>
            )}
          </div>
        ) : null}
      </div>

      {journalMode ? (
        <JournalBoard
          mode={tab}
          showDeleted={showDeleted}
          lockedWarehouseId={lockedWarehouseId}
        />
      ) : null}
      {tab === "flow" ? <FlowPending /> : null}
      {tab === "balances" ? (
        <BalancesPanel
          warehouseId={lockedWarehouseId ?? warehouseId}
          month={month}
          lockedWarehouseId={lockedWarehouseId}
        />
      ) : null}
      {creating && journalMode ? (
        <CreateMovementDialog
          mode={tab}
          lockedWarehouseId={lockedWarehouseId}
          onClose={() => setCreating(false)}
        />
      ) : null}
    </div>
  );
}

function deletedControlClass(showDeleted: boolean): string {
  return `inline-flex h-11 items-center justify-center gap-2 border px-4 text-sm whitespace-nowrap outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
    showDeleted
      ? "border-ink bg-ink text-white"
      : "border-line bg-sheet text-ink hover:border-ink"
  }`;
}

function StockTabControl({
  tab,
  label,
  current,
  showDeleted,
  warehouseId,
  onTab,
}: {
  tab: StockTab;
  label: string;
  current: StockTab;
  showDeleted: boolean;
  warehouseId: string;
  onTab?: (tab: StockTab) => void;
}) {
  const selected = tab === current;
  const className = `inline-flex h-11 items-center justify-center gap-2 px-4 text-sm whitespace-nowrap outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
    selected ? "bg-ink text-white" : "text-muted hover:text-ink"
  }`;

  if (onTab) {
    return (
      <button
        type="button"
        role="tab"
        aria-selected={selected}
        onClick={() => onTab(tab)}
        className={className}
      >
        <TabIcon tab={tab} />
        {label}
      </button>
    );
  }

  return (
    <Link
      href={stockHref(tab, showDeleted, warehouseId)}
      aria-current={selected ? "page" : undefined}
      className={className}
    >
      <TabIcon tab={tab} />
      {label}
    </Link>
  );
}

function TabIcon({ tab }: { tab: StockTab }) {
  if (tab === "deliveries") {
    return <IconDelivery />;
  }
  if (tab === "write-offs") {
    return <IconWriteOff />;
  }
  if (tab === "flow") {
    return <IconFlow />;
  }
  return <IconBalances />;
}

function FlowPending() {
  return (
    <div className="border border-line bg-sheet px-4 py-4">
      <p className="text-sm text-ink">Раздел в разработке.</p>
      <p className="mt-2 text-sm leading-6 text-muted">
        Здесь будет расход сырья в производство и приход производных и товаров из цеха.
      </p>
    </div>
  );
}
