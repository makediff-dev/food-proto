"use client";

import Link from "next/link";
import { useId, useState } from "react";

import type {
  Derivative,
  MaterialUnit,
  PrototypeDocument,
  RawMaterial,
  WriteOffLine,
} from "@/domain/document";
import {
  plannedUnitPrice,
  quantityOnHand,
  stockItemUnit,
  writeOffChoices,
  writeOffLineLoss,
  writeOffLoss,
  type StockRejection,
} from "@/domain/stock";
import {
  componentOptionValue,
  fieldClassName,
  parseComponentOption,
  parseGrams,
  parsePieceCount,
  primaryButtonClassName,
} from "@/features/materials/fields";
import { formatMoney } from "@/features/materials/money";
import { derivativeDetailHref, materialDetailHref } from "@/features/materials/paths";
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
  quantityDraft,
  STOCK_ERROR,
  unitWord,
} from "@/features/stock/text";
import { useStock } from "@/features/stock/use-stock";

const writeOffLineColumns =
  "grid-cols-[minmax(11rem,1.5fr)_7rem_8rem_9rem_9rem_9rem_9rem_2.75rem]";

export function WriteOffDetailScreen({ id }: { id: string }) {
  const stock = useStock();
  const item = [...stock.writeOffs, ...stock.deletedWriteOffs].find(
    (entry) => entry.id === id,
  );

  if (!stock.hydrated) {
    return (
      <PageFrame title="Списание" lede="Запись открывается." wide>
        {null}
      </PageFrame>
    );
  }

  if (!item) {
    return (
      <PageFrame title="Списание" lede="Такого списания нет." wide>
        <BackLink href={stockHref("write-offs")} label="К списаниям" />
      </PageFrame>
    );
  }

  const deleted = item.deletedAt !== null;
  const title = formatOccurredOn(item.occurredOn);
  const loss = writeOffLoss(stock.document, item);
  const choices = writeOffChoices(stock.document, item.id);

  return (
    <PageFrame
      title={title}
      wide
      lede={
        deleted
          ? "Списание удалено. Возврат снова уменьшит остаток."
          : "Списание с одного склада. Убыток считается по плановой цене, не по поставке."
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <BackLink
            href={stockHref("write-offs", deleted)}
            label={deleted ? "К удалённым списаниям" : "К списаниям"}
          />
          <DocumentActions
            deleted={deleted}
            disabled={!stock.hydrated}
            noun="списание"
            title={title}
            onDelete={() => stock.removeWriteOff(item.id)}
            onRestore={() => stock.restoreWriteOff(item.id)}
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
          onCommit={(draft) => stock.updateWriteOff(item.id, draft)}
        />

        <MoneySummary
          title="Потенциальный убыток"
          withVatKopecks={
            item.lines.length > 0 && loss.unknownLineIds.length < item.lines.length
              ? loss.withVatKopecks
              : undefined
          }
          exVatKopecks={
            item.lines.length > 0 && loss.unknownLineIds.length < item.lines.length
              ? loss.exVatKopecks
              : undefined
          }
          empty={
            item.lines.length === 0
              ? "Добавьте позицию, чтобы увидеть потенциальный убыток."
              : loss.unknownLineIds.length === item.lines.length
                ? "Плановая себестоимость не считается."
                : undefined
          }
          hint={
            loss.unknownLineIds.length > 0 &&
            loss.unknownLineIds.length < item.lines.length
              ? "Итог без строк, где себестоимость не считается."
              : undefined
          }
        />

        <section className="flex flex-col gap-4">
          <h2 className="text-base font-semibold text-ink">Строки</h2>
          {deleted ? null : (
            <AddWriteOffLine
              document={stock.document}
              warehouseId={item.warehouseId}
              materials={choices.materials.slice().sort(byName)}
              derivatives={choices.derivatives.slice().sort(byName)}
              products={choices.products.slice().sort(byName)}
              disabled={!stock.hydrated}
              onAdd={(kind, refId, quantity) =>
                stock.addWriteOffLine(item.id, {
                  id: `write-off-line:${crypto.randomUUID()}`,
                  kind,
                  refId,
                  quantity,
                })
              }
            />
          )}
          {item.lines.length === 0 ? (
            <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
              Строк нет. Добавьте сырьё, производную или товар с этого склада.
            </p>
          ) : (
            <div className="overflow-x-auto border border-line bg-sheet">
              <div
                className={`hidden w-full min-w-[62rem] ${writeOffLineColumns} gap-3 border-b border-line px-4 py-3 text-sm text-muted lg:grid`}
              >
                <span>Позиция</span>
                <span className="text-right">На складе</span>
                <span className="text-right">Количество</span>
                <span className="text-right">Цена с НДС</span>
                <span className="text-right">Цена без НДС</span>
                <span className="text-right">Убыток с НДС</span>
                <span className="text-right">Убыток без НДС</span>
                <span className="sr-only">Действия</span>
              </div>
              <ul className="lg:min-w-[62rem]">
                {item.lines.map((line) => (
                  <WriteOffLineCard
                    key={line.id}
                    line={line}
                    deleted={deleted}
                    disabled={!stock.hydrated}
                    document={stock.document}
                    warehouseId={item.warehouseId}
                    onSave={(quantity) =>
                      stock.updateWriteOffLine(item.id, line.id, quantity)
                    }
                    onRemove={() => stock.removeWriteOffLine(item.id, line.id)}
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

function AddWriteOffLine({
  document,
  warehouseId,
  materials,
  derivatives,
  products,
  disabled,
  onAdd,
}: {
  document: PrototypeDocument;
  warehouseId: string;
  materials: RawMaterial[];
  derivatives: Derivative[];
  products: Derivative[];
  disabled: boolean;
  onAdd: (
    kind: "material" | "derivative",
    refId: string,
    quantity: number,
  ) => StockRejection | null;
}) {
  const itemFieldId = useId();
  const quantityId = useId();
  const [choice, setChoice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const parsed = parseComponentOption(choice);
  const unit = parsed ? stockItemUnit(document, parsed.kind, parsed.id) : null;
  const parsedQuantity = unit ? parseQuantity(quantity, unit) : null;
  const planned = parsed ? plannedUnitPrice(document, parsed.kind, parsed.id) : null;
  const onHand = parsed
    ? quantityOnHand(document, warehouseId, parsed.kind, parsed.id)
    : null;

  if (materials.length + derivatives.length + products.length === 0) {
    return (
      <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
        На этом складе нет позиций, которые можно списать.
      </p>
    );
  }

  return (
    <form
      className="flex flex-col gap-4 border border-line bg-sheet p-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (!parsed || !unit || parsedQuantity === null) {
          setError(!parsed ? STOCK_ERROR.component : STOCK_ERROR.quantity);
          return;
        }

        const rejection = onAdd(parsed.kind, parsed.id, parsedQuantity);
        if (rejection) {
          setError(STOCK_ERROR[rejection]);
          return;
        }

        setChoice("");
        setQuantity("");
        setError(null);
      }}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="min-w-0">
          <label htmlFor={itemFieldId} className="text-sm text-muted">
            Позиция
          </label>
          <select
            id={itemFieldId}
            value={choice}
            disabled={disabled}
            onChange={(event) => {
              setChoice(event.target.value);
              setError(null);
            }}
            className={`mt-1.5 ${fieldClassName}`}
          >
            <option value="">Выберите позицию</option>
            {materials.length > 0 ? (
              <optgroup label="Сырьё">
                {materials.map((item) => (
                  <option key={item.id} value={componentOptionValue("material", item.id)}>
                    {item.name}
                  </option>
                ))}
              </optgroup>
            ) : null}
            {derivatives.length > 0 ? (
              <optgroup label="Производные">
                {derivatives.map((item) => (
                  <option
                    key={item.id}
                    value={componentOptionValue("derivative", item.id)}
                  >
                    {item.name}
                  </option>
                ))}
              </optgroup>
            ) : null}
            {products.length > 0 ? (
              <optgroup label="Товары">
                {products.map((item) => (
                  <option
                    key={item.id}
                    value={componentOptionValue("derivative", item.id)}
                  >
                    {item.name}
                  </option>
                ))}
              </optgroup>
            ) : null}
          </select>
        </div>
        <div className="min-w-0">
          <label htmlFor={quantityId} className="text-sm text-muted">
            Количество, {unitWord(unit ?? "kg")}
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
      </div>
      {onHand !== null && unit ? (
        <p className="text-sm text-muted">
          Сейчас на складе {formatQuantity(onHand, unit)}
        </p>
      ) : null}
      {planned && unit ? (
        <div className="max-w-md">
          <p className="mb-2 text-sm text-muted">
            {parsed?.kind === "material"
              ? "Плановая закупочная цена"
              : "Плановая себестоимость"}
          </p>
          <MoneyPair
            withVatKopecks={planned.withVatKopecks}
            exVatKopecks={planned.exVatKopecks}
          />
        </div>
      ) : parsed ? (
        <p className="text-sm leading-6 text-muted">
          Плановая себестоимость не считается.
        </p>
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

function WriteOffLineCard({
  line,
  deleted,
  disabled,
  document,
  warehouseId,
  onSave,
  onRemove,
}: {
  line: WriteOffLine;
  deleted: boolean;
  disabled: boolean;
  document: PrototypeDocument;
  warehouseId: string;
  onSave: (quantity: number) => StockRejection | null;
  onRemove: () => void;
}) {
  const quantityId = useId();
  const unit = stockItemUnit(document, line.kind, line.refId);
  const name = lineTitle(document, line);
  const href = lineHref(line);
  const [quantity, setQuantity] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const shown = quantity ?? (unit ? quantityDraft(line.quantity, unit) : "");
  const dirty = unit ? shown !== quantityDraft(line.quantity, unit) : false;
  const planned = plannedUnitPrice(document, line.kind, line.refId);
  const loss = writeOffLineLoss(document, line);
  const onHand = quantityOnHand(document, warehouseId, line.kind, line.refId);

  const rowClass = `border-b border-line last:border-b-0 lg:grid lg:w-full lg:min-w-[62rem] ${writeOffLineColumns} lg:items-center lg:gap-3 lg:px-4 lg:py-3`;

  return (
    <li className={rowClass}>
      <div className="flex items-start justify-between gap-3 px-4 py-3 lg:block lg:p-0">
        <div className="min-w-0">
          <div className="text-sm text-muted lg:sr-only">Позиция</div>
          {href ? (
            <Link
              href={href}
              className="mt-1 block text-base font-semibold break-words text-ink outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink lg:mt-0 lg:text-sm"
            >
              {name}
            </Link>
          ) : (
            <p className="mt-1 text-base font-semibold text-ink lg:mt-0 lg:text-sm">
              {name}
            </p>
          )}
          <p className="mt-1 text-sm text-muted">{lineKindLabel(document, line)}</p>
        </div>
        {deleted ? null : (
          <button
            type="button"
            aria-label={`Убрать ${name} из списания`}
            title="Убрать"
            disabled={disabled}
            onClick={onRemove}
            className="inline-flex size-11 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60 lg:hidden"
          >
            <IconTrash />
          </button>
        )}
      </div>
      <Labeled label="На складе" align="end">
        {unit ? formatQuantity(onHand, unit) : "—"}
      </Labeled>
      {deleted || !unit ? (
        <Labeled label="Количество" align="end">
          {unit ? formatQuantity(line.quantity, unit) : line.quantity}
        </Labeled>
      ) : (
        <Labeled label={`Количество, ${unitWord(unit)}`} align="end">
          <input
            id={quantityId}
            value={shown}
            inputMode="decimal"
            disabled={disabled}
            autoComplete="off"
            aria-label={`Количество, ${unitWord(unit)}`}
            onChange={(event) => {
              setQuantity(event.target.value);
              setError(null);
            }}
            className={`${fieldClassName} text-right tabular-nums`}
          />
        </Labeled>
      )}
      <Labeled label="Цена с НДС" align="end">
        {planned ? formatMoney(planned.withVatKopecks) : "—"}
      </Labeled>
      <Labeled label="Цена без НДС" align="end">
        {planned ? formatMoney(planned.exVatKopecks) : "—"}
      </Labeled>
      <Labeled label="Убыток с НДС" align="end">
        {loss ? formatMoney(loss.withVatKopecks) : "—"}
      </Labeled>
      <Labeled label="Убыток без НДС" align="end">
        {loss ? formatMoney(loss.exVatKopecks) : "—"}
      </Labeled>
      {deleted || !unit ? (
        <div className="hidden lg:block" />
      ) : (
        <div className="hidden justify-end lg:flex">
          <button
            type="button"
            aria-label={`Убрать ${name} из списания`}
            title="Убрать"
            disabled={disabled}
            onClick={onRemove}
            className="inline-flex size-11 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
          >
            <IconTrash />
          </button>
        </div>
      )}
      {dirty && unit && !deleted ? (
        <div className="px-4 pb-4 lg:col-span-full lg:px-0 lg:pb-0">
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              const next = parseQuantity(shown, unit);
              if (next === null) {
                setError(STOCK_ERROR.quantity);
                return;
              }
              const rejection = onSave(next);
              if (rejection) {
                setError(STOCK_ERROR[rejection]);
                return;
              }
              setQuantity(null);
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
      {!planned && !deleted ? (
        <p className="px-4 pb-4 text-sm text-muted lg:col-span-full lg:px-0 lg:pb-0">
          Плановая себестоимость не считается.
        </p>
      ) : null}
    </li>
  );
}

function lineTitle(document: PrototypeDocument, line: WriteOffLine): string {
  if (line.kind === "material") {
    return document.materials.find((item) => item.id === line.refId)?.name ?? "Сырьё";
  }

  return document.derivatives.find((item) => item.id === line.refId)?.name ?? "Позиция";
}

function lineHref(line: WriteOffLine): string | null {
  return line.kind === "material"
    ? materialDetailHref(line.refId)
    : derivativeDetailHref(line.refId);
}

function lineKindLabel(document: PrototypeDocument, line: WriteOffLine): string {
  if (line.kind === "material") {
    const material = document.materials.find((item) => item.id === line.refId);
    return material?.deletedAt ? "Сырьё · удалено" : "Сырьё";
  }

  const derivative = document.derivatives.find((item) => item.id === line.refId);
  const noun = derivative?.isFinalProduct ? "Товар" : "Производная";
  return derivative?.deletedAt ? `${noun} · удалено` : noun;
}
