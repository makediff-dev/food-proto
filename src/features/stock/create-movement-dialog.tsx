"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import { MAX_LABEL_LENGTH } from "@/domain/document";
import { activeWarehouses } from "@/domain/directory";
import { fieldClassName, primaryButtonClassName } from "@/features/materials/fields";
import { Dialog } from "@/features/shell/dialog";
import { IconPlus } from "@/features/shell/icons";
import { deliveryHref, writeOffHref, type StockTab } from "@/features/stock/paths";
import { STOCK_ERROR, todayIso, warehouseName } from "@/features/stock/text";
import { useStock } from "@/features/stock/use-stock";

export function CreateMovementDialog({
  mode,
  onClose,
  lockedWarehouseId,
}: {
  mode: Extract<StockTab, "deliveries" | "write-offs">;
  onClose: () => void;
  lockedWarehouseId?: string;
}) {
  const stock = useStock();
  const router = useRouter();
  const dateId = useId();
  const warehouseFieldId = useId();
  const noteId = useId();
  const warehouses = activeWarehouses(stock.document);
  const [id] = useState(() =>
    mode === "deliveries"
      ? `delivery:${crypto.randomUUID()}`
      : `write-off:${crypto.randomUUID()}`,
  );
  const [occurredOn, setOccurredOn] = useState(todayIso);
  const [warehouseId, setWarehouseId] = useState(
    lockedWarehouseId ?? (warehouses.length === 1 ? warehouses[0].id : ""),
  );
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const title = mode === "deliveries" ? "Новая поставка" : "Новое списание";
  const action = mode === "deliveries" ? "Добавить поставку" : "Добавить списание";

  function submit() {
    if (pending) {
      return;
    }

    const draft = { warehouseId, occurredOn, note };
    const rejection =
      mode === "deliveries" ? stock.addDelivery(id, draft) : stock.addWriteOff(id, draft);
    if (rejection) {
      setError(STOCK_ERROR[rejection]);
      return;
    }

    setPending(true);
    router.push(mode === "deliveries" ? deliveryHref(id) : writeOffHref(id));
  }

  return (
    <Dialog title={title} onClose={onClose}>
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <div>
          <label htmlFor={dateId} className="text-sm text-muted">
            Дата
          </label>
          <input
            id={dateId}
            type="date"
            value={occurredOn}
            onChange={(event) => {
              setOccurredOn(event.target.value);
              setError(null);
            }}
            className={`mt-1.5 ${fieldClassName}`}
          />
        </div>
        {lockedWarehouseId ? (
          <div>
            <p className="text-sm text-muted">Склад</p>
            <p className="mt-1.5 text-base text-ink">
              {warehouseName(stock.document, lockedWarehouseId)}
            </p>
          </div>
        ) : (
          <div>
            <label htmlFor={warehouseFieldId} className="text-sm text-muted">
              Склад
            </label>
            <select
              id={warehouseFieldId}
              value={warehouseId}
              onChange={(event) => {
                setWarehouseId(event.target.value);
                setError(null);
              }}
              className={`mt-1.5 ${fieldClassName}`}
            >
              <option value="">Выберите склад</option>
              {warehouses.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label htmlFor={noteId} className="text-sm text-muted">
            Пометка
          </label>
          <input
            id={noteId}
            value={note}
            maxLength={MAX_LABEL_LENGTH}
            autoComplete="off"
            placeholder="Необязательно"
            onChange={(event) => {
              setNote(event.target.value);
              setError(null);
            }}
            className={`mt-1.5 ${fieldClassName}`}
          />
        </div>
        {error ? <p className="text-sm text-ink">{error}</p> : null}
        <button type="submit" disabled={pending} className={primaryButtonClassName}>
          <IconPlus />
          {action}
        </button>
      </form>
    </Dialog>
  );
}
