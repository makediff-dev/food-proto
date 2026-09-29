"use client";

import Link from "next/link";
import { useId, useMemo, useRef, useState } from "react";

import {
  MAX_LABEL_LENGTH,
  type ProductionFact,
  type ProductionFactOutput,
  type PrototypeDocument,
} from "@/domain/document";
import {
  activeFactOnDate,
  factEditorOutput,
  factUseTemplate,
  type FactEditorUse,
  type FactRejection,
  type FactUseDraft,
} from "@/domain/production-fact";
import { monthKeyFromDate } from "@/domain/sales-plan";
import {
  fieldClassName,
  parseGrams,
  parsePieceCount,
  parseStockQuantity,
  primaryButtonClassName,
} from "@/features/materials/fields";
import { derivativeDetailHref, materialDetailHref } from "@/features/materials/paths";
import { factHref, productionHref } from "@/features/production/paths";
import {
  FACT_ERROR,
  formatFactDate,
  formatPlanQuantity,
  kindLabel,
  moneyLines,
  normWord,
  recipeGapLabel,
} from "@/features/production/text";
import { useProductionFact } from "@/features/production/use-production";
import { Dialog } from "@/features/shell/dialog";
import {
  IconArrowLeft,
  IconCheck,
  IconPlus,
  IconTrash,
  IconUndo,
} from "@/features/shell/icons";
import { PageFrame } from "@/features/shell/page-frame";
import { quantityDraft } from "@/features/stock/text";

export function FactDetailScreen({ id }: { id: string }) {
  const production = useProductionFact();
  const item = [...production.facts, ...production.deletedFacts].find(
    (entry) => entry.id === id,
  );

  if (!production.hydrated) {
    return (
      <PageFrame title="Факт" lede="Запись открывается." wide>
        {null}
      </PageFrame>
    );
  }

  if (!item) {
    return (
      <PageFrame title="Факт" lede="Такой записи нет." wide>
        <BackLink
          href={productionHref("fact", "output", "", monthKeyFromDate(new Date()))}
          label="К записям"
        />
      </PageFrame>
    );
  }

  return <FactDetail item={item} />;
}

function FactDetail({ item }: { item: ProductionFact }) {
  const production = useProductionFact();
  const deleted = item.deletedAt !== null;
  const title = formatFactDate(item.occurredOn);
  const today = useMemo(() => new Date(), []);
  const currentMonth = monthKeyFromDate(today);
  const month = item.occurredOn.slice(0, 7);
  const [adding, setAdding] = useState(false);

  return (
    <PageFrame
      title={title}
      wide
      lede={
        deleted
          ? "Запись удалена. Возврат снова включит её в сравнение с планом."
          : "Фактический выпуск и расход за день. Количество ингредиентов вводится вручную, норма рецепта сама факт не меняет."
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <BackLink
            href={productionHref("fact", "output", month, currentMonth, {
              showDeleted: deleted,
            })}
            label={deleted ? "К удалённым записям" : "К записям"}
          />
          <DayActions
            deleted={deleted}
            disabled={!production.hydrated}
            title={title}
            onDelete={() => production.removeFact(item.id)}
            onRestore={() => production.restoreFact(item.id)}
          />
        </div>

        <HeaderFields fact={item} disabled={deleted || !production.hydrated} />

        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-ink">Производство</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                Ингредиенты берутся из рецептуры позиции. Сырьё внутри производной пишется
                в записи её выпуска.
              </p>
            </div>
            {deleted ? null : (
              <button
                type="button"
                disabled={!production.hydrated}
                onClick={() => setAdding(true)}
                className={`w-full sm:w-auto ${primaryButtonClassName}`}
              >
                <IconPlus />
                Добавить позицию
              </button>
            )}
          </div>

          {item.outputs.length === 0 ? (
            <p className="border border-line bg-sheet px-4 py-8 text-sm leading-6 text-muted sm:px-5">
              Выпуска нет. Добавьте товар или производную и укажите, сколько ушло
              ингредиентов.
            </p>
          ) : (
            <div className="flex flex-col gap-5">
              {item.outputs.map((output) => (
                <OutputCard
                  key={output.id}
                  fact={item}
                  output={output}
                  disabled={deleted || !production.hydrated}
                />
              ))}
            </div>
          )}
        </section>
      </div>
      {adding ? <AddOutputDialog fact={item} onClose={() => setAdding(false)} /> : null}
    </PageFrame>
  );
}

function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex h-11 items-center gap-2 text-sm text-ink outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <IconArrowLeft />
      {label}
    </Link>
  );
}

function DayActions({
  deleted,
  disabled,
  title,
  onDelete,
  onRestore,
}: {
  deleted: boolean;
  disabled: boolean;
  title: string;
  onDelete: () => void;
  onRestore: () => FactRejection | null;
}) {
  const [error, setError] = useState<string | null>(null);

  if (deleted) {
    return (
      <div className="flex flex-col items-stretch gap-2 sm:items-end">
        <button
          type="button"
          aria-label={`Вернуть запись «${title}»`}
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
        {error ? <p className="text-sm text-ink">{error}</p> : null}
      </div>
    );
  }

  return (
    <button
      type="button"
      aria-label={`Удалить запись «${title}»`}
      title="Удалить"
      disabled={disabled}
      onClick={() => {
        const confirmed = window.confirm(
          `Удалить запись «${title}»? Она пропадёт из рабочего списка. Вернуть можно среди удалённых.`,
        );
        if (confirmed) {
          onDelete();
        }
      }}
      className="inline-flex size-11 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
    >
      <IconTrash />
    </button>
  );
}

function HeaderFields({ fact, disabled }: { fact: ProductionFact; disabled: boolean }) {
  const production = useProductionFact();

  function commit(patch: { occurredOn?: string; note?: string }) {
    return production.updateFact(fact.id, {
      occurredOn: patch.occurredOn ?? fact.occurredOn,
      note: patch.note ?? fact.note,
    });
  }

  return (
    <div className="grid gap-5 border border-line bg-sheet p-5 sm:p-6 md:grid-cols-2">
      <DateField
        value={fact.occurredOn}
        disabled={disabled}
        document={production.document}
        factId={fact.id}
        onCommit={(occurredOn) => commit({ occurredOn })}
      />
      <NoteField
        value={fact.note}
        disabled={disabled}
        onCommit={(note) => commit({ note })}
      />
    </div>
  );
}

function DateField({
  value,
  disabled,
  document,
  factId,
  onCommit,
}: {
  value: string;
  disabled: boolean;
  document: PrototypeDocument;
  factId: string;
  onCommit: (value: string) => FactRejection | null;
}) {
  const inputId = useId();
  const errorId = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const shown = draft ?? value;
  const taken = activeFactOnDate(document, shown);
  const other = taken && taken.id !== factId ? taken : null;

  return (
    <div className="min-w-0">
      <label htmlFor={inputId} className="text-sm text-muted">
        Дата
      </label>
      <input
        id={inputId}
        type="date"
        value={shown}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => {
          const next = event.target.value;
          setDraft(next);
          const rejection = onCommit(next);
          if (rejection) {
            setError(FACT_ERROR[rejection]);
            return;
          }
          setError(null);
          setDraft(null);
        }}
        className={`mt-2 ${fieldClassName}`}
      />
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-ink">
          {error}
        </p>
      ) : null}
      {other && error ? (
        <Link href={factHref(other.id)} className={`mt-2 ${nameLinkClassName}`}>
          Открыть запись
        </Link>
      ) : null}
    </div>
  );
}

function NoteField({
  value,
  disabled,
  onCommit,
}: {
  value: string;
  disabled: boolean;
  onCommit: (value: string) => FactRejection | null;
}) {
  const inputId = useId();
  const errorId = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const shown = draft ?? value;

  function commit(raw: string) {
    const rejection = onCommit(raw);
    if (rejection) {
      setError(FACT_ERROR[rejection]);
      setDraft(raw);
      return;
    }
    setError(null);
    setDraft(null);
  }

  return (
    <div className="min-w-0">
      <label htmlFor={inputId} className="text-sm text-muted">
        Пометка
      </label>
      <input
        id={inputId}
        value={shown}
        maxLength={MAX_LABEL_LENGTH}
        disabled={disabled}
        autoComplete="off"
        placeholder="Необязательно"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onFocus={() => {
          setDraft(value);
          setError(null);
        }}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={(event) => commit(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
        }}
        className={`mt-2 ${fieldClassName}`}
      />
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function OutputCard({
  fact,
  output,
  disabled,
}: {
  fact: ProductionFact;
  output: ProductionFactOutput;
  disabled: boolean;
}) {
  const production = useProductionFact();
  const editor = factEditorOutput(production.document, output);
  const ids = useRef(new Map<string, string>());
  const [quantityDraftText, setQuantityDraftText] = useState<string | null>(null);
  const [useDrafts, setUseDrafts] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const searchId = useId();
  const quantityId = useId();
  const shownQuantity = quantityDraftText ?? quantityDraft(output.quantity, editor.unit);
  const needle = query.trim().toLocaleLowerCase("ru-RU");
  const visibleUses = editor.uses.filter(
    (use) => needle.length === 0 || use.name.toLocaleLowerCase("ru-RU").includes(needle),
  );
  const actualMoney = moneyLines(editor.actualCost);
  const normMoney = moneyLines(editor.normCost);

  function usageKey(use: FactEditorUse): string {
    return `${use.kind}:${use.refId}`;
  }

  function idFor(use: FactEditorUse): string {
    if (use.storedId) {
      return use.storedId;
    }
    const key = usageKey(use);
    const known = ids.current.get(key);
    if (known) {
      return known;
    }
    const next = `fact-use:${crypto.randomUUID()}`;
    ids.current.set(key, next);
    return next;
  }

  function commitQuantity(raw: string) {
    const parsed = editor.unit === "piece" ? parsePieceCount(raw) : parseGrams(raw);
    if (parsed === null) {
      setError("Укажите количество.");
      setQuantityDraftText(raw);
      return;
    }
    if (parsed === output.quantity) {
      setError(null);
      setQuantityDraftText(null);
      return;
    }
    const rejection = production.setOutputQuantity(fact.id, output.id, parsed);
    if (rejection) {
      setError(FACT_ERROR[rejection]);
      setQuantityDraftText(raw);
      return;
    }
    setError(null);
    setQuantityDraftText(null);
  }

  function commitUse(use: FactEditorUse, raw: string) {
    const parsed = parseStockQuantity(raw, use.unit);
    if (parsed === null) {
      setError("Укажите количество. Ноль допустим.");
      setUseDrafts((current) => ({ ...current, [usageKey(use)]: raw }));
      return;
    }
    if (parsed === use.quantity) {
      setError(null);
      setUseDrafts((current) => {
        const next = { ...current };
        delete next[usageKey(use)];
        return next;
      });
      return;
    }
    const rejection = production.upsertUse(fact.id, output.id, {
      id: idFor(use),
      kind: use.kind,
      refId: use.refId,
      quantity: parsed,
    });
    if (rejection) {
      setError(FACT_ERROR[rejection]);
      setUseDrafts((current) => ({ ...current, [usageKey(use)]: raw }));
      return;
    }
    setError(null);
    setUseDrafts((current) => {
      const next = { ...current };
      delete next[usageKey(use)];
      return next;
    });
  }

  function applyNorms() {
    const uses: FactUseDraft[] = [];
    for (const use of editor.uses) {
      if (!use.inRecipe) {
        if (use.storedId !== null && use.quantity !== null) {
          uses.push({
            id: use.storedId,
            kind: use.kind,
            refId: use.refId,
            quantity: use.quantity,
          });
        }
        continue;
      }
      if (use.norm === null) {
        setError("Норма не считается.");
        return;
      }
      uses.push({
        id: idFor(use),
        kind: use.kind,
        refId: use.refId,
        quantity: use.norm,
      });
    }
    const rejection = production.setUses(fact.id, output.id, uses);
    if (rejection) {
      setError(FACT_ERROR[rejection]);
      return;
    }
    setError(null);
    setUseDrafts({});
  }

  return (
    <article className="border border-line bg-sheet">
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                href={derivativeDetailHref(output.refId)}
                className={`${nameLinkClassName} text-base`}
              >
                {editor.name}
              </Link>
              <p className="mt-1 text-sm text-muted">
                {kindLabel(editor.kind, editor.deleted)}
                {editor.workshopName ? ` · ${editor.workshopName}` : ""}
              </p>
            </div>
            {disabled ? null : (
              <button
                type="button"
                aria-label={`Убрать ${editor.name}`}
                title="Убрать"
                onClick={() => {
                  const confirmed = window.confirm(
                    `Убрать «${editor.name}» из этого дня?`,
                  );
                  if (confirmed) {
                    production.removeOutput(fact.id, output.id);
                  }
                }}
                className="inline-flex size-11 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:hidden"
              >
                <IconTrash />
              </button>
            )}
          </div>
          <div className="flex items-end gap-3">
            <div className="min-w-0 flex-1 sm:w-44 sm:flex-none">
              <label htmlFor={quantityId} className="text-sm text-muted">
                Выпуск, {editor.unit === "piece" ? "шт" : "кг"}
              </label>
              <input
                id={quantityId}
                value={shownQuantity}
                disabled={disabled}
                inputMode="decimal"
                autoComplete="off"
                onChange={(event) => setQuantityDraftText(event.target.value)}
                onBlur={(event) => commitQuantity(event.currentTarget.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.currentTarget.blur();
                  }
                }}
                className={`mt-2 ${fieldClassName}`}
              />
            </div>
            {disabled ? null : (
              <button
                type="button"
                aria-label={`Убрать ${editor.name}`}
                title="Убрать"
                onClick={() => {
                  const confirmed = window.confirm(
                    `Убрать «${editor.name}» из этого дня?`,
                  );
                  if (confirmed) {
                    production.removeOutput(fact.id, output.id);
                  }
                }}
                className="mb-0 hidden size-11 shrink-0 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:inline-flex"
              >
                <IconTrash />
              </button>
            )}
          </div>
        </div>
        {error ? <p className="text-sm text-ink">{error}</p> : null}
        {editor.gap ? (
          <p className="text-sm leading-6 text-muted">{recipeGapLabel(editor.gap)}</p>
        ) : null}
      </div>

      <div className="grid border-t border-line sm:grid-cols-2">
        <div className="px-5 py-5 sm:px-6">
          <h3 className="text-sm text-muted">Стоимость ингредиентов</h3>
          {actualMoney ? (
            <>
              <p className="mt-3 text-base font-semibold text-ink tabular-nums">
                {actualMoney.withVat}
              </p>
              <p className="mt-1 text-sm text-muted tabular-nums">{actualMoney.exVat}</p>
            </>
          ) : (
            <p className="mt-3 text-sm leading-6 text-muted">
              Укажите количество по каждому ингредиенту рецептуры.
            </p>
          )}
        </div>
        <div className="border-t border-line px-5 py-5 sm:border-t-0 sm:border-l sm:px-6">
          <h3 className="text-sm text-muted">Стоимость по рецепту</h3>
          {editor.gap ? (
            <p className="mt-3 text-sm leading-6 text-muted">
              {recipeGapLabel(editor.gap)}
            </p>
          ) : normMoney ? (
            <>
              <p className="mt-3 text-base font-semibold text-ink tabular-nums">
                {normMoney.withVat}
              </p>
              <p className="mt-1 text-sm text-muted tabular-nums">{normMoney.exVat}</p>
            </>
          ) : (
            <p className="mt-3 text-sm leading-6 text-muted">Норма не считается.</p>
          )}
        </div>
      </div>

      {editor.uses.length === 0 ? (
        <p className="border-t border-line px-5 py-5 text-sm leading-6 text-muted sm:px-6">
          {editor.gap
            ? "Состав для ввода не предлагается."
            : "В рецептуре нет ингредиентов."}
        </p>
      ) : (
        <div className="border-t border-line">
          <div className="flex flex-col gap-4 bg-paper px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
            {editor.uses.length > 8 ? (
              <div className="min-w-0 sm:max-w-sm sm:flex-1">
                <label htmlFor={searchId} className="text-sm text-muted">
                  Поиск по составу
                </label>
                <input
                  id={searchId}
                  type="search"
                  value={query}
                  autoComplete="off"
                  placeholder="Ингредиент"
                  onChange={(event) => setQuery(event.target.value)}
                  className={`mt-2 ${fieldClassName}`}
                />
              </div>
            ) : (
              <p className="text-sm text-muted">Состав рецептуры</p>
            )}
            {disabled || editor.gap ? null : (
              <button type="button" onClick={applyNorms} className={quietButtonClassName}>
                <IconCheck />
                Подставить нормы
              </button>
            )}
          </div>
          <div className="hidden border-t border-line md:grid md:grid-cols-[minmax(0,1.6fr)_9rem_11rem] md:gap-4 md:px-6 md:py-3">
            <span className="text-sm text-muted">Ингредиент</span>
            <span className="text-right text-sm text-muted">По рецепту</span>
            <span className="text-right text-sm text-muted">Факт</span>
          </div>
          {visibleUses.length === 0 ? (
            <p className="border-t border-line px-5 py-5 text-sm leading-6 text-muted sm:px-6">
              Ничего не найдено.
            </p>
          ) : (
            <ul>
              {visibleUses.map((use) => (
                <UseRow
                  key={usageKey(use)}
                  use={use}
                  disabled={disabled}
                  raw={useDrafts[usageKey(use)]}
                  onChange={(raw) =>
                    setUseDrafts((current) => ({ ...current, [usageKey(use)]: raw }))
                  }
                  onCommit={(raw) => commitUse(use, raw)}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </article>
  );
}

function UseRow({
  use,
  disabled,
  raw,
  onChange,
  onCommit,
}: {
  use: FactEditorUse;
  disabled: boolean;
  raw: string | undefined;
  onChange: (value: string) => void;
  onCommit: (value: string) => void;
}) {
  const inputId = useId();
  const shown =
    raw ?? (use.quantity === null ? "" : quantityDraft(use.quantity, use.unit));
  const word =
    use.norm !== null && use.quantity !== null ? normWord(use.quantity, use.norm) : null;
  const href =
    use.kind === "material"
      ? materialDetailHref(use.refId)
      : derivativeDetailHref(use.refId);

  return (
    <li className="border-t border-line px-5 py-4 sm:px-6 md:grid md:grid-cols-[minmax(0,1.6fr)_9rem_11rem] md:items-center md:gap-4">
      <div className="min-w-0">
        <Link href={href} className={nameLinkClassName}>
          {use.name}
        </Link>
        <p className="mt-1 text-sm text-muted">
          {kindLabel(use.kind === "material" ? "material" : "derivative", use.deleted)}
          {use.inRecipe ? "" : " · в рецептуре больше нет"}
          {word ? <span className="text-ink"> · {word}</span> : null}
        </p>
      </div>
      <div className="mt-4 grid grid-cols-2 items-end gap-3 md:contents">
        <p className="text-sm text-ink tabular-nums md:text-right">
          <span className="mb-1 block text-muted md:hidden">По рецепту</span>
          {formatPlanQuantity(use.norm, use.unit)}
        </p>
        <div>
          <label htmlFor={inputId} className="mb-1 block text-sm text-muted md:sr-only">
            Факт, {use.unit === "piece" ? "шт" : "кг"}
          </label>
          <input
            id={inputId}
            value={shown}
            disabled={disabled}
            inputMode="decimal"
            autoComplete="off"
            onChange={(event) => onChange(event.target.value)}
            onBlur={(event) => onCommit(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }
            }}
            className={fieldClassName}
          />
        </div>
      </div>
    </li>
  );
}

function AddOutputDialog({
  fact,
  onClose,
}: {
  fact: ProductionFact;
  onClose: () => void;
}) {
  const production = useProductionFact();
  const searchId = useId();
  const kindId = useId();
  const quantityId = useId();
  const [outputId] = useState(() => `fact-output:${crypto.randomUUID()}`);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<"all" | "product" | "derivative">("all");
  const [refId, setRefId] = useState("");
  const [quantityRaw, setQuantityRaw] = useState("");
  const [useRaw, setUseRaw] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const taken = new Set(fact.outputs.map((output) => output.refId));
  const choices = production.document.derivatives
    .filter((item) => item.deletedAt === null && !taken.has(item.id))
    .slice()
    .sort((left, right) => left.name.localeCompare(right.name, "ru"));
  const needle = query.trim().toLocaleLowerCase("ru-RU");
  const visible = choices.filter((item) => {
    if (kind === "product" && !item.isFinalProduct) {
      return false;
    }
    if (kind === "derivative" && item.isFinalProduct) {
      return false;
    }
    return needle.length === 0 || item.name.toLocaleLowerCase("ru-RU").includes(needle);
  });
  const selected = choices.find((item) => item.id === refId) ?? null;
  const parsedQuantity = selected
    ? selected.isFinalProduct
      ? parsePieceCount(quantityRaw)
      : parseGrams(quantityRaw)
    : null;
  const template = selected
    ? factUseTemplate(production.document, selected.id, parsedQuantity)
    : null;

  function lineKey(kindName: string, id: string): string {
    return `${kindName}:${id}`;
  }

  function fillNorms() {
    if (!template) {
      return;
    }
    if (parsedQuantity === null) {
      setError("Сначала укажите выпуск.");
      return;
    }
    const next: Record<string, string> = {};
    for (const line of template.lines) {
      if (line.norm === null) {
        continue;
      }
      next[lineKey(line.kind, line.refId)] = quantityDraft(line.norm, line.unit);
    }
    setUseRaw(next);
    setError(null);
  }

  function submit() {
    if (pending || !selected || !template) {
      setError("Выберите товар или производную.");
      return;
    }
    if (parsedQuantity === null) {
      setError("Укажите количество.");
      return;
    }

    const uses: FactUseDraft[] = [];
    if (template.gap === null) {
      for (const line of template.lines) {
        const parsed = parseStockQuantity(
          useRaw[lineKey(line.kind, line.refId)] ?? "",
          line.unit,
        );
        if (parsed === null) {
          setError("Укажите фактическое количество по каждому ингредиенту рецептуры.");
          return;
        }
        uses.push({
          id: `fact-use:${crypto.randomUUID()}`,
          kind: line.kind,
          refId: line.refId,
          quantity: parsed,
        });
      }
    }

    const rejection = production.addOutput(fact.id, {
      id: outputId,
      refId: selected.id,
      quantity: parsedQuantity,
      uses,
    });
    if (rejection) {
      setError(FACT_ERROR[rejection]);
      return;
    }

    setPending(true);
    onClose();
  }

  return (
    <Dialog title="Добавить позицию" wide onClose={onClose}>
      <form
        className="flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
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
              onChange={(event) => setQuery(event.target.value)}
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
              onChange={(event) =>
                setKind(event.target.value as "all" | "product" | "derivative")
              }
              className={`mt-2 ${fieldClassName}`}
            >
              <option value="all">Все</option>
              <option value="product">Товары</option>
              <option value="derivative">Производные</option>
            </select>
          </div>
        </div>

        {choices.length === 0 ? (
          <p className="text-sm leading-6 text-muted">
            Все рабочие позиции уже есть в этом дне.
          </p>
        ) : visible.length === 0 ? (
          <p className="text-sm leading-6 text-muted">Ничего не найдено.</p>
        ) : (
          <ul className="max-h-64 overflow-y-auto border border-line">
            {visible.map((item) => {
              const selectedItem = item.id === refId;
              return (
                <li key={item.id} className="border-b border-line last:border-b-0">
                  <button
                    type="button"
                    aria-pressed={selectedItem}
                    onClick={() => {
                      setRefId(item.id);
                      setQuantityRaw("");
                      setUseRaw({});
                      setError(null);
                    }}
                    className={`flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink ${
                      selectedItem ? "bg-ink text-white" : "text-ink hover:bg-paper"
                    }`}
                  >
                    <span className="font-semibold">{item.name}</span>
                    <span className={selectedItem ? "text-white/80" : "text-muted"}>
                      {item.isFinalProduct ? "Товар" : "Производная"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {selected && template ? (
          <div className="flex flex-col gap-5 border border-line p-5">
            <div className="max-w-xs">
              <label htmlFor={quantityId} className="text-sm text-muted">
                Выпуск, {template.unit === "piece" ? "шт" : "кг"}
              </label>
              <input
                id={quantityId}
                value={quantityRaw}
                inputMode="decimal"
                autoComplete="off"
                onChange={(event) => {
                  setQuantityRaw(event.target.value);
                  setError(null);
                }}
                className={`mt-2 ${fieldClassName}`}
              />
            </div>
            {template.gap ? (
              <p className="text-sm leading-6 text-muted">
                {recipeGapLabel(template.gap)}. Состав для ввода не предлагается, выпуск
                сохранить можно.
              </p>
            ) : template.lines.length === 0 ? (
              <p className="text-sm leading-6 text-muted">
                В рецептуре нет ингредиентов.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted">Фактический расход</p>
                  <button
                    type="button"
                    onClick={fillNorms}
                    className={quietButtonClassName}
                  >
                    <IconCheck />
                    Подставить нормы
                  </button>
                </div>
                <ul className="flex flex-col">
                  {template.lines.map((line) => {
                    const key = lineKey(line.kind, line.refId);
                    const inputId = `${quantityId}-${key}`;
                    return (
                      <li
                        key={key}
                        className="grid gap-2 border-t border-line py-4 sm:grid-cols-[minmax(0,1fr)_9rem_11rem] sm:items-end sm:gap-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-ink">{line.name}</p>
                          <p className="mt-1 text-sm text-muted">
                            {kindLabel(line.kind, line.deleted)}
                          </p>
                        </div>
                        <p className="text-sm text-ink tabular-nums sm:text-right">
                          <span className="text-muted">По рецепту </span>
                          {formatPlanQuantity(line.norm, line.unit)}
                        </p>
                        <div>
                          <label htmlFor={inputId} className="text-sm text-muted">
                            Факт, {line.unit === "piece" ? "шт" : "кг"}
                          </label>
                          <input
                            id={inputId}
                            value={useRaw[key] ?? ""}
                            inputMode="decimal"
                            autoComplete="off"
                            onChange={(event) => {
                              setUseRaw((current) => ({
                                ...current,
                                [key]: event.target.value,
                              }));
                              setError(null);
                            }}
                            className={`mt-2 ${fieldClassName}`}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        ) : null}

        {error ? <p className="text-sm text-ink">{error}</p> : null}
        <button
          type="submit"
          disabled={pending || !production.hydrated}
          className={`w-full sm:w-auto ${primaryButtonClassName}`}
        >
          <IconPlus />
          Добавить позицию
        </button>
      </form>
    </Dialog>
  );
}

const quietButtonClassName =
  "inline-flex h-11 w-full items-center justify-center gap-2 border border-line bg-sheet px-4 text-sm whitespace-nowrap text-ink outline-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:w-auto";

const nameLinkClassName =
  "font-semibold break-words text-ink outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
