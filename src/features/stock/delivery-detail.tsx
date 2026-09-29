"use client";

import Link from "next/link";
import { useId, useState } from "react";

import type {
  DeliveryLine,
  MaterialUnit,
  PrototypeDocument,
  RawMaterial,
} from "@/domain/document";
import {
  amountPair,
  deliveryLineAmount,
  deliveryMaterialChoices,
  deliveryTotal,
  stockItemUnit,
  unitExVatKopecks,
  type StockRejection,
} from "@/domain/stock";
import {
  fieldClassName,
  parseGrams,
  parseKopecks,
  parsePieceCount,
  primaryButtonClassName,
} from "@/features/materials/fields";
import { formatMoney } from "@/features/materials/money";
import { materialDetailHref } from "@/features/materials/paths";
import { IconCheck, IconPlus, IconTrash } from "@/features/shell/icons";
import { PageFrame } from "@/features/shell/page-frame";
import { Labeled, MoneyPair, MoneySummary } from "@/features/stock/figures";
import {
  BackLink,
  DocumentActions,
  MovementHeaderFields,
} from "@/features/stock/movement-fields";
import { stockHref } from "@/features/stock/paths";
import {
  formatOccurredOn,
  formatQuantity,
  priceDraft,
  pricePerLabel,
  quantityDraft,
  STOCK_ERROR,
  unitWord,
} from "@/features/stock/text";
import { useStock } from "@/features/stock/use-stock";

const deliveryLineColumns =
  "grid-cols-[minmax(10rem,1.4fr)_8rem_9rem_9rem_9rem_9rem_2.75rem]";

export function DeliveryDetailScreen({ id }: { id: string }) {
  const stock = useStock();
  const item = [...stock.deliveries, ...stock.deletedDeliveries].find(
    (entry) => entry.id === id,
  );

  if (!stock.hydrated) {
    return (
      <PageFrame title="Поставка" lede="Запись открывается." wide>
        {null}
      </PageFrame>
    );
  }

  if (!item) {
    return (
      <PageFrame title="Поставка" lede="Такой поставки нет." wide>
        <BackLink href={stockHref("deliveries")} label="К поставкам" />
      </PageFrame>
    );
  }

  const deleted = item.deletedAt !== null;
  const title = formatOccurredOn(item.occurredOn);
  const total = deliveryTotal(stock.document, item);
  const choices = deliveryMaterialChoices(stock.document, item.id).slice().sort(byName);

  return (
    <PageFrame
      title={title}
      wide
      lede={
        deleted
          ? "Поставка удалена. Возврат снова добавит её количество в остаток."
          : "Сырьё пришло на один склад. Цена без НДС и итог поставки считаются."
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <BackLink
            href={stockHref("deliveries", deleted)}
            label={deleted ? "К удалённым поставкам" : "К поставкам"}
          />
          <DocumentActions
            deleted={deleted}
            disabled={!stock.hydrated}
            noun="поставку"
            title={title}
            onDelete={() => stock.removeDelivery(item.id)}
            onRestore={() => stock.restoreDelivery(item.id)}
          />
        </div>

        <MovementHeaderFields
          document={stock.document}
          header={{
            warehouseId: item.warehouseId,
            occurredOn: item.occurredOn,
            note: item.note,
          }}
          lineCount={item.lines.length}
          disabled={deleted || !stock.hydrated}
          onCommit={(draft) => stock.updateDelivery(item.id, draft)}
        />

        <MoneySummary
          title="Итог поставки"
          withVatKopecks={total?.withVatKopecks}
          exVatKopecks={total?.exVatKopecks}
          empty={
            item.lines.length === 0
              ? "Добавьте сырьё, чтобы увидеть итог поставки."
              : total
                ? undefined
                : "Сумма не считается."
          }
        />

        <section className="flex flex-col gap-4">
          <h2 className="text-base font-semibold text-ink">Строки</h2>
          {deleted ? null : (
            <AddDeliveryLine
              choices={choices}
              disabled={!stock.hydrated}
              onAdd={(materialId, quantity, priceWithVatKopecks) =>
                stock.addDeliveryLine(item.id, {
                  id: `delivery-line:${crypto.randomUUID()}`,
                  materialId,
                  quantity,
                  priceWithVatKopecks,
                })
              }
            />
          )}
          {item.lines.length === 0 ? (
            <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
              Строк нет. Добавьте сырьё, количество и реальную себестоимость с НДС.
            </p>
          ) : (
            <div className="overflow-x-auto border border-line bg-sheet">
              <div
                className={`hidden w-full min-w-[58rem] ${deliveryLineColumns} gap-3 border-b border-line px-4 py-3 text-sm text-muted lg:grid`}
              >
                <span>Сырьё</span>
                <span className="text-right">Количество</span>
                <span className="text-right">Цена с НДС</span>
                <span className="text-right">Цена без НДС</span>
                <span className="text-right">Сумма с НДС</span>
                <span className="text-right">Сумма без НДС</span>
                <span className="sr-only">Действия</span>
              </div>
              <ul className="lg:min-w-[58rem]">
                {item.lines.map((line) => (
                  <DeliveryLineCard
                    key={line.id}
                    line={line}
                    deleted={deleted}
                    disabled={!stock.hydrated}
                    material={stock.document.materials.find(
                      (entry) => entry.id === line.materialId,
                    )}
                    unit={stockItemUnit(stock.document, "material", line.materialId)}
                    onSave={(quantity, priceWithVatKopecks) =>
                      stock.updateDeliveryLine(
                        item.id,
                        line.id,
                        quantity,
                        priceWithVatKopecks,
                      )
                    }
                    onRemove={() => stock.removeDeliveryLine(item.id, line.id)}
                    document={stock.document}
                  />
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </PageFrame>
  );
}

function byName<T extends { name: string }>(left: T, right: T): number {
  return left.name.localeCompare(right.name, "ru");
}

function parseQuantity(raw: string, unit: MaterialUnit): number | null {
  return unit === "piece" ? parsePieceCount(raw) : parseGrams(raw);
}

function AddDeliveryLine({
  choices,
  disabled,
  onAdd,
}: {
  choices: RawMaterial[];
  disabled: boolean;
  onAdd: (
    materialId: string,
    quantity: number,
    priceWithVatKopecks: number,
  ) => StockRejection | null;
}) {
  const materialFieldId = useId();
  const quantityId = useId();
  const priceId = useId();
  const [materialId, setMaterialId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const material = choices.find((item) => item.id === materialId) ?? null;
  const unit = material?.unit ?? "kg";
  const parsedQuantity = material ? parseQuantity(quantity, unit) : null;
  const parsedPrice = parseKopecks(price);
  const unitEx =
    material && parsedPrice !== null
      ? unitExVatKopecks(parsedPrice, material.vatPercent)
      : null;
  const preview =
    material && parsedQuantity !== null && parsedPrice !== null
      ? amountPair(parsedQuantity, unit, parsedPrice, material.vatPercent)
      : null;

  if (choices.length === 0) {
    return (
      <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
        На этом складе нет сырья, которое можно добавить.
      </p>
    );
  }

  return (
    <form
      className="flex flex-col gap-4 border border-line bg-sheet p-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (!material || parsedQuantity === null || parsedPrice === null) {
          setError(
            !material
              ? STOCK_ERROR.component
              : parsedQuantity === null
                ? STOCK_ERROR.quantity
                : STOCK_ERROR.price,
          );
          return;
        }

        const rejection = onAdd(material.id, parsedQuantity, parsedPrice);
        if (rejection) {
          setError(STOCK_ERROR[rejection]);
          return;
        }

        setMaterialId("");
        setQuantity("");
        setPrice("");
        setError(null);
      }}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="min-w-0">
          <label htmlFor={materialFieldId} className="text-sm text-muted">
            Сырьё
          </label>
          <select
            id={materialFieldId}
            value={materialId}
            disabled={disabled}
            onChange={(event) => {
              setMaterialId(event.target.value);
              setError(null);
            }}
            className={`mt-1.5 ${fieldClassName}`}
          >
            <option value="">Выберите сырьё</option>
            {choices.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-0">
          <label htmlFor={quantityId} className="text-sm text-muted">
            Количество, {unitWord(unit)}
          </label>
          <input
            id={quantityId}
            value={quantity}
            inputMode="decimal"
            disabled={disabled}
            autoComplete="off"
            onChange={(event) => {
              setQuantity(event.target.value);
              setError(null);
            }}
            className={`mt-1.5 ${fieldClassName}`}
          />
        </div>
        <div className="min-w-0">
          <label htmlFor={priceId} className="text-sm text-muted">
            Реальная себестоимость с НДС, {pricePerLabel(unit)}
          </label>
          <input
            id={priceId}
            value={price}
            inputMode="decimal"
            disabled={disabled}
            autoComplete="off"
            placeholder="0,00"
            onChange={(event) => {
              setPrice(event.target.value);
              setError(null);
            }}
            className={`mt-1.5 ${fieldClassName}`}
          />
        </div>
      </div>
      {material ? (
        <p className="text-sm leading-6 text-muted">НДС {material.vatPercent} %</p>
      ) : null}
      {unitEx !== null && material ? (
        <p className="text-sm text-muted">
          Цена без НДС {priceDraft(unitEx)} {pricePerLabel(unit)}
        </p>
      ) : null}
      {preview ? (
        <MoneyPair
          withVatKopecks={preview.withVatKopecks}
          exVatKopecks={preview.exVatKopecks}
        />
      ) : null}
      {error ? <p className="text-sm text-ink">{error}</p> : null}
      <div>
        <button type="submit" disabled={disabled} className={primaryButtonClassName}>
          <IconPlus />
          Добавить
        </button>
      </div>
    </form>
  );
}

function DeliveryLineCard({
  line,
  material,
  unit,
  deleted,
  disabled,
  document,
  onSave,
  onRemove,
}: {
  line: DeliveryLine;
  material: RawMaterial | undefined;
  unit: MaterialUnit | null;
  deleted: boolean;
  disabled: boolean;
  document: PrototypeDocument;
  onSave: (quantity: number, priceWithVatKopecks: number) => StockRejection | null;
  onRemove: () => void;
}) {
  const quantityId = useId();
  const priceId = useId();
  const [quantity, setQuantity] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resolvedUnit = unit ?? "kg";
  const shownQuantity = quantity ?? (unit ? quantityDraft(line.quantity, unit) : "");
  const shownPrice = price ?? priceDraft(line.priceWithVatKopecks);
  const dirty =
    shownQuantity !== (unit ? quantityDraft(line.quantity, unit) : "") ||
    shownPrice !== priceDraft(line.priceWithVatKopecks);
  const amount = unit ? deliveryLineAmount(document, line) : null;
  const exVat = unitExVatKopecks(line.priceWithVatKopecks, line.vatPercent);

  const rowClass = `border-b border-line last:border-b-0 lg:grid lg:w-full lg:min-w-[58rem] ${deliveryLineColumns} lg:items-center lg:gap-3 lg:px-4 lg:py-3`;

  return (
    <li className={rowClass}>
      <div className="flex items-start justify-between gap-3 px-4 py-3 lg:block lg:p-0">
        <div className="min-w-0">
          <div className="text-sm text-muted lg:sr-only">Сырьё</div>
          {material ? (
            <Link
              href={materialDetailHref(material.id)}
              className="mt-1 block text-base font-semibold break-words text-ink outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink lg:mt-0 lg:text-sm"
            >
              {material.name}
            </Link>
          ) : (
            <p className="mt-1 text-base font-semibold text-ink lg:mt-0 lg:text-sm">
              Сырьё
            </p>
          )}
          <p className="mt-1 text-sm text-muted">
            НДС {line.vatPercent} %{material?.deletedAt ? " · удалено" : ""}
          </p>
        </div>
        {deleted ? null : (
          <button
            type="button"
            aria-label={`Убрать ${material?.name ?? "строку"} из поставки`}
            title="Убрать"
            disabled={disabled}
            onClick={onRemove}
            className="inline-flex size-11 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60 lg:hidden"
          >
            <IconTrash />
          </button>
        )}
      </div>

      {deleted || !unit ? (
        <>
          <Labeled label="Количество" align="end">
            {unit ? formatQuantity(line.quantity, unit) : line.quantity}
          </Labeled>
          <Labeled label="Цена с НДС" align="end">
            {`${formatMoney(line.priceWithVatKopecks)}`}
          </Labeled>
          <Labeled label="Цена без НДС" align="end">
            {exVat !== null && unit ? formatMoney(exVat) : "—"}
          </Labeled>
          <Labeled label="Сумма с НДС" align="end">
            {amount ? formatMoney(amount.withVatKopecks) : "—"}
          </Labeled>
          <Labeled label="Сумма без НДС" align="end">
            {amount ? formatMoney(amount.exVatKopecks) : "—"}
          </Labeled>
          <div className="hidden lg:block" />
        </>
      ) : (
        <>
          <Labeled label={`Количество, ${unitWord(resolvedUnit)}`} align="end">
            <input
              id={quantityId}
              value={shownQuantity}
              inputMode="decimal"
              disabled={disabled}
              autoComplete="off"
              aria-label={`Количество, ${unitWord(resolvedUnit)}`}
              onChange={(event) => {
                setQuantity(event.target.value);
                setError(null);
              }}
              className={`${fieldClassName} text-right tabular-nums`}
            />
          </Labeled>
          <Labeled label={`Цена с НДС, ${pricePerLabel(resolvedUnit)}`} align="end">
            <input
              id={priceId}
              value={shownPrice}
              inputMode="decimal"
              disabled={disabled}
              autoComplete="off"
              aria-label={`Цена с НДС, ${pricePerLabel(resolvedUnit)}`}
              onChange={(event) => {
                setPrice(event.target.value);
                setError(null);
              }}
              className={`${fieldClassName} text-right tabular-nums`}
            />
          </Labeled>
          <Labeled label="Цена без НДС" align="end">
            {exVat !== null ? formatMoney(exVat) : "—"}
          </Labeled>
          <Labeled label="Сумма с НДС" align="end">
            {amount ? formatMoney(amount.withVatKopecks) : "—"}
          </Labeled>
          <Labeled label="Сумма без НДС" align="end">
            {amount ? formatMoney(amount.exVatKopecks) : "—"}
          </Labeled>
          <div className="hidden justify-end lg:flex">
            <button
              type="button"
              aria-label={`Убрать ${material?.name ?? "строку"} из поставки`}
              title="Убрать"
              disabled={disabled}
              onClick={onRemove}
              className="inline-flex size-11 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
            >
              <IconTrash />
            </button>
          </div>
          {dirty ? (
            <div className="px-4 pb-4 lg:col-span-full lg:px-0 lg:pb-0">
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  const parsedQuantity = parseQuantity(shownQuantity, resolvedUnit);
                  const parsedPrice = parseKopecks(shownPrice);
                  if (parsedQuantity === null || parsedPrice === null) {
                    setError(
                      parsedQuantity === null ? STOCK_ERROR.quantity : STOCK_ERROR.price,
                    );
                    return;
                  }
                  const rejection = onSave(parsedQuantity, parsedPrice);
                  if (rejection) {
                    setError(STOCK_ERROR[rejection]);
                    return;
                  }
                  setQuantity(null);
                  setPrice(null);
                  setError(null);
                }}
                className={primaryButtonClassName}
              >
                <IconCheck />
                Сохранить
              </button>
            </div>
          ) : null}
          {error ? (
            <p className="px-4 pb-4 text-sm text-ink lg:col-span-full lg:px-0 lg:pb-0">
              {error}
            </p>
          ) : null}
        </>
      )}
    </li>
  );
}
