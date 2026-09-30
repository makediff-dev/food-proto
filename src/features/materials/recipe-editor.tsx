"use client";

import { useId, useState } from "react";

import { lineContribution, priceExVatKopecks, unitCost } from "@/domain/cost";
import type {
  Derivative,
  PrototypeDocument,
  RecipeCard,
  RecipeLine,
} from "@/domain/document";
import {
  compositionGrams,
  inputGramsForFinishedBatch,
  recipeComponentChoices,
} from "@/domain/materials";
import {
  formatKilogramsFromGrams,
  gramsFromPieces,
  piecesFromGrams,
} from "@/domain/units";
import { formatMoney, formatVatPair } from "@/features/materials/money";
import {
  FIELD_ERROR,
  componentOptionValue,
  fieldClassName,
  panelPad,
  parseComponentOption,
  parseGrams,
  parsePieceCount,
  parseWholePercent,
  primaryButtonClassName,
} from "@/features/materials/fields";
import { useMaterials } from "@/features/materials/use-materials";
import { IconPlus, IconTrash, IconUndo } from "@/features/shell/icons";

export function RecipeEditor({ derivative }: { derivative: Derivative }) {
  const catalog = useMaterials();
  const recipe = catalog.activeRecipeFor(derivative.id);
  const deleted = catalog.deletedRecipesFor(derivative.id);
  const cost = unitCost(catalog.document, derivative.id);

  return (
    <section className="mt-3 border border-line bg-sheet">
      <div
        className={`flex items-center justify-between gap-3 border-b border-line ${panelPad}`}
      >
        <div>
          <h2 className="text-base font-semibold text-ink">Рецептурная карта</h2>
          <p className="mt-1 text-sm text-muted">
            {derivative.isFinalProduct ? "Себестоимость 1 шт" : "Себестоимость 1 кг"}
          </p>
          {cost ? (
            <div className="mt-1">
              <p className="font-figure text-xl leading-tight tracking-tight text-ink">
                {formatMoney(cost.withVatKopecks)} с НДС
              </p>
              <p className="font-figure text-xl leading-tight tracking-tight text-ink">
                {formatMoney(cost.exVatKopecks)} без НДС
              </p>
            </div>
          ) : (
            <p className="font-figure text-2xl leading-tight tracking-tight text-ink">
              {recipe ? "Не считается" : "Нет карты"}
            </p>
          )}
        </div>
        {recipe ? (
          <button
            type="button"
            aria-label="Удалить рецептурную карту"
            title="Удалить"
            disabled={!catalog.hydrated}
            onClick={() => {
              const confirmed = window.confirm(
                "Удалить рецептурную карту? Состав пропадёт из работы. Вернуть карту можно среди удалённых.",
              );
              if (confirmed) {
                catalog.removeRecipe(recipe.id);
              }
            }}
            className="inline-flex size-11 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
          >
            <IconTrash />
          </button>
        ) : null}
      </div>

      {recipe && !derivative.isFinalProduct && recipe.yieldPercent !== null ? (
        <BatchMeter
          lines={recipe.lines}
          yieldPercent={recipe.yieldPercent}
          batchSize={recipe.batchSize}
          pieceWeightGrams={derivative.pieceWeightGrams}
        />
      ) : null}

      {recipe ? (
        <ActiveRecipe derivative={derivative} recipe={recipe} />
      ) : (
        <CreateRecipe derivative={derivative} />
      )}

      {deleted.length > 0 ? <DeletedRecipes recipes={deleted} /> : null}
    </section>
  );
}

function CreateRecipe({ derivative }: { derivative: Derivative }) {
  const catalog = useMaterials();
  const yieldId = useId();
  const [yieldRaw, setYieldRaw] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    const yieldPercent = derivative.isFinalProduct ? null : parseWholePercent(yieldRaw);
    if (
      !derivative.isFinalProduct &&
      (yieldPercent === null || yieldPercent < 1 || yieldPercent > 100)
    ) {
      setError(FIELD_ERROR.yield);
      return;
    }

    const rejection = catalog.addRecipe(
      `recipe:${crypto.randomUUID()}`,
      derivative.id,
      yieldPercent,
    );
    setError(rejection ? FIELD_ERROR[rejection] : null);
  }

  return (
    <form
      className={panelPad}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <p className="text-sm leading-6 text-muted">
        {derivative.isFinalProduct
          ? "Карты ещё нет. Состав задаётся на партию штук — базу можно сменить после создания."
          : "Карты ещё нет. Состав задаётся на партию готового продукта — базу и выход можно сменить после создания."}
      </p>
      {derivative.isFinalProduct ? null : (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor={yieldId} className="text-sm text-muted">
              Выход после обработки, %
            </label>
            <input
              id={yieldId}
              value={yieldRaw}
              inputMode="numeric"
              disabled={!catalog.hydrated}
              autoComplete="off"
              placeholder="80"
              onChange={(event) => {
                setYieldRaw(event.target.value);
                setError(null);
              }}
              className={`mt-1.5 ${fieldClassName}`}
            />
          </div>
        </div>
      )}
      {error ? <p className="mt-2 text-sm text-ink">{error}</p> : null}
      <button
        type="submit"
        disabled={!catalog.hydrated}
        className={`mt-3 w-full sm:w-auto ${primaryButtonClassName}`}
      >
        <IconPlus />
        Создать рецептурную карту
      </button>
    </form>
  );
}

function ActiveRecipe({
  derivative,
  recipe,
}: {
  derivative: Derivative;
  recipe: RecipeCard;
}) {
  const per = derivative.isFinalProduct ? "1 шт" : "1 кг";
  const batchLabel = formatBatchLabel(
    recipe.batchSize,
    derivative.isFinalProduct,
    derivative.pieceWeightGrams,
  );

  return (
    <div>
      <RecipeBatchFields derivative={derivative} recipe={recipe} />
      <div className={`border-b border-line ${panelPad}`}>
        <h3 className="text-sm font-semibold text-ink">Состав на {batchLabel}</h3>
        {recipe.lines.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            В составе пока пусто. Добавьте сырьё или другую производную.
          </p>
        ) : (
          <ul className="mt-2">
            {recipe.lines.map((line) => (
              <RecipeLineRow
                key={line.id}
                derivative={derivative}
                recipeId={recipe.id}
                line={line}
                per={per}
              />
            ))}
          </ul>
        )}
      </div>
      <AddLineForm derivativeId={derivative.id} recipeId={recipe.id} />
    </div>
  );
}

function formatBatchLabel(
  batchSize: number,
  isFinalProduct: boolean,
  pieceWeightGrams: number | null = null,
): string {
  if (isFinalProduct) {
    return `${batchSize.toLocaleString("ru-RU")} шт`;
  }

  const kilograms = formatKilogramsFromGrams(batchSize);
  const pieces =
    pieceWeightGrams === null ? null : piecesFromGrams(batchSize, pieceWeightGrams);
  if (pieces === null) {
    return `${kilograms} кг готового продукта`;
  }

  return `${kilograms} кг/${pieces.toLocaleString("ru-RU")} шт готового продукта`;
}

function RecipeBatchFields({
  derivative,
  recipe,
}: {
  derivative: Derivative;
  recipe: RecipeCard;
}) {
  return (
    <div className={`border-b border-line ${panelPad}`}>
      <div className="grid gap-3 sm:grid-cols-2">
        {derivative.isFinalProduct ? null : (
          <YieldField recipeId={recipe.id} yieldPercent={recipe.yieldPercent ?? 0} />
        )}
        <BatchSizeField
          recipeId={recipe.id}
          batchSize={recipe.batchSize}
          isFinalProduct={derivative.isFinalProduct}
        />
      </div>
    </div>
  );
}

function YieldField({
  recipeId,
  yieldPercent,
}: {
  recipeId: string;
  yieldPercent: number;
}) {
  const catalog = useMaterials();
  const inputId = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const shown = draft ?? String(yieldPercent);

  function commit(raw: string) {
    const parsed = parseWholePercent(raw);
    if (parsed === null || parsed < 1 || parsed > 100) {
      setError(FIELD_ERROR.yield);
      setDraft(raw);
      return;
    }
    if (parsed === yieldPercent) {
      setDraft(null);
      setError(null);
      return;
    }

    const rejection = catalog.setYield(recipeId, parsed);
    if (rejection) {
      setError(FIELD_ERROR[rejection]);
      setDraft(raw);
      return;
    }

    setDraft(null);
    setError(null);
  }

  return (
    <div>
      <label htmlFor={inputId} className="text-sm text-muted">
        Выход после обработки, %
      </label>
      <input
        id={inputId}
        value={shown}
        inputMode="numeric"
        disabled={!catalog.hydrated}
        autoComplete="off"
        aria-invalid={error ? true : undefined}
        onFocus={() => {
          setDraft(String(yieldPercent));
          setError(null);
        }}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={(event) => commit(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
        }}
        className={`mt-1.5 ${fieldClassName}`}
      />
      {error ? <p className="mt-2 text-sm text-ink">{error}</p> : null}
    </div>
  );
}

function BatchSizeField({
  recipeId,
  batchSize,
  isFinalProduct,
}: {
  recipeId: string;
  batchSize: number;
  isFinalProduct: boolean;
}) {
  const catalog = useMaterials();
  const inputId = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const shown =
    draft ?? (isFinalProduct ? String(batchSize) : formatKilogramsFromGrams(batchSize));

  function commit(raw: string) {
    const parsed = isFinalProduct ? parsePieceCount(raw) : parseGrams(raw);
    if (parsed === null) {
      setError(FIELD_ERROR["batch-size"]);
      setDraft(raw);
      return;
    }
    if (parsed === batchSize) {
      setDraft(null);
      setError(null);
      return;
    }

    const rejection = catalog.setBatchSize(recipeId, parsed);
    if (rejection) {
      setError(FIELD_ERROR[rejection]);
      setDraft(raw);
      return;
    }

    setDraft(null);
    setError(null);
  }

  return (
    <div>
      <label htmlFor={inputId} className="text-sm text-muted">
        {isFinalProduct ? "Норма закладки, шт" : "Партия готового продукта, кг"}
      </label>
      <input
        id={inputId}
        value={shown}
        inputMode={isFinalProduct ? "numeric" : "decimal"}
        disabled={!catalog.hydrated}
        autoComplete="off"
        aria-invalid={error ? true : undefined}
        onFocus={() => {
          setDraft(
            isFinalProduct ? String(batchSize) : formatKilogramsFromGrams(batchSize),
          );
          setError(null);
        }}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={(event) => commit(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
        }}
        className={`mt-1.5 ${fieldClassName}`}
      />
      {error ? <p className="mt-2 text-sm text-ink">{error}</p> : null}
    </div>
  );
}

function RecipeLineRow({
  derivative,
  recipeId,
  line,
  per,
}: {
  derivative: Derivative;
  recipeId: string;
  line: RecipeLine;
  per: string;
}) {
  const catalog = useMaterials();
  const kgId = useId();
  const piecesId = useId();
  const [kgDraft, setKgDraft] = useState<string | null>(null);
  const [piecesDraft, setPiecesDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const piece = isPieceLine(catalog.document, line);
  const componentDerivative =
    line.kind === "derivative"
      ? catalog.document.derivatives.find((item) => item.id === line.refId)
      : undefined;
  const pieceWeightGrams =
    derivative.isFinalProduct &&
    line.kind === "derivative" &&
    componentDerivative &&
    !componentDerivative.isFinalProduct
      ? componentDerivative.pieceWeightGrams
      : null;
  const dual = pieceWeightGrams !== null && pieceWeightGrams !== undefined;
  const piecesShown =
    piecesDraft ??
    (dual && pieceWeightGrams
      ? String(piecesFromGrams(line.quantityGrams, pieceWeightGrams) ?? "")
      : "");
  const kgShown =
    kgDraft ??
    (piece ? String(line.quantityGrams) : formatKilogramsFromGrams(line.quantityGrams));
  const component = describeComponent(catalog.document, line);
  const contribution = lineContribution(catalog.document, derivative.id, line.id);

  function commitGrams(grams: number, rawKg: string, rawPieces: string | null) {
    if (grams === line.quantityGrams) {
      setKgDraft(null);
      setPiecesDraft(null);
      setError(null);
      return;
    }

    const rejection = catalog.updateLine(recipeId, line.id, grams);
    if (rejection) {
      const active = catalog.activeRecipeFor(derivative.id);
      setError(
        rejection === "batch" && active && active.yieldPercent !== null
          ? overflowText(
              compositionGrams(active.lines.filter((item) => item.id !== line.id)),
              inputGramsForFinishedBatch(active.yieldPercent, active.batchSize),
              active.batchSize,
              derivative.pieceWeightGrams,
            )
          : FIELD_ERROR[rejection],
      );
      setKgDraft(rawKg);
      if (rawPieces !== null) {
        setPiecesDraft(rawPieces);
      }
      return;
    }

    setKgDraft(null);
    setPiecesDraft(null);
    setError(null);
  }

  function commitFromKg(raw: string) {
    if (piece) {
      const grams = parsePieceCount(raw);
      if (grams === null) {
        setError(FIELD_ERROR.quantity);
        setKgDraft(raw);
        return;
      }
      commitGrams(grams, raw, null);
      return;
    }

    const grams = parseGrams(raw);
    if (grams === null) {
      setError(FIELD_ERROR.quantity);
      setKgDraft(raw);
      return;
    }

    if (dual && pieceWeightGrams) {
      const pieces = piecesFromGrams(grams, pieceWeightGrams);
      setPiecesDraft(pieces === null ? "" : String(pieces));
    }

    commitGrams(grams, raw, piecesDraft);
  }

  function commitFromPieces(raw: string) {
    if (!dual || !pieceWeightGrams) {
      return;
    }

    const pieces = parsePieceCount(raw);
    if (pieces === null) {
      setError(FIELD_ERROR.quantity);
      setPiecesDraft(raw);
      return;
    }

    const grams = gramsFromPieces(pieces, pieceWeightGrams);
    if (grams === null) {
      setError(FIELD_ERROR.quantity);
      setPiecesDraft(raw);
      return;
    }

    setKgDraft(formatKilogramsFromGrams(grams));
    commitGrams(grams, formatKilogramsFromGrams(grams), raw);
  }

  return (
    <li className="border-t border-line py-3 first:border-t-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-ink">{component.name}</p>
          <p className="mt-1 text-sm text-muted">
            {component.kind}
            {component.deleted ? ", удалён" : ""}
            {component.price ? ` · ${component.price}` : ""}
          </p>
        </div>
        <button
          type="button"
          aria-label={`Убрать «${component.name}» из состава`}
          title="Убрать"
          disabled={!catalog.hydrated}
          onClick={() => {
            const confirmed = window.confirm(`Убрать «${component.name}» из состава?`);
            if (confirmed) {
              catalog.removeLine(recipeId, line.id);
            }
          }}
          className="inline-flex size-11 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
        >
          <IconTrash />
        </button>
      </div>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="w-full sm:w-44">
          <label htmlFor={kgId} className="text-sm text-muted">
            Количество, {piece ? "шт" : "кг"}
          </label>
          <input
            id={kgId}
            value={kgShown}
            inputMode={piece ? "numeric" : "decimal"}
            disabled={!catalog.hydrated}
            autoComplete="off"
            aria-invalid={error ? true : undefined}
            onFocus={() => {
              setKgDraft(
                piece
                  ? String(line.quantityGrams)
                  : formatKilogramsFromGrams(line.quantityGrams),
              );
              if (dual && pieceWeightGrams) {
                setPiecesDraft(
                  String(piecesFromGrams(line.quantityGrams, pieceWeightGrams) ?? ""),
                );
              }
              setError(null);
            }}
            onChange={(event) => {
              const raw = event.target.value;
              setKgDraft(raw);
              if (!dual || !pieceWeightGrams) {
                return;
              }
              const grams = parseGrams(raw);
              if (grams === null) {
                return;
              }
              const pieces = piecesFromGrams(grams, pieceWeightGrams);
              setPiecesDraft(pieces === null ? "" : String(pieces));
            }}
            onBlur={(event) => commitFromKg(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }
            }}
            className={`mt-1.5 ${fieldClassName}`}
          />
          {!dual && error ? <p className="mt-2 text-sm text-ink">{error}</p> : null}
        </div>
        {dual ? (
          <div className="w-full sm:w-44">
            <label htmlFor={piecesId} className="text-sm text-muted">
              Количество, шт
            </label>
            <input
              id={piecesId}
              value={piecesShown}
              inputMode="numeric"
              disabled={!catalog.hydrated}
              autoComplete="off"
              aria-invalid={error ? true : undefined}
              onFocus={() => {
                if (pieceWeightGrams) {
                  setPiecesDraft(
                    String(piecesFromGrams(line.quantityGrams, pieceWeightGrams) ?? ""),
                  );
                  setKgDraft(formatKilogramsFromGrams(line.quantityGrams));
                }
                setError(null);
              }}
              onChange={(event) => {
                const raw = event.target.value;
                setPiecesDraft(raw);
                if (!pieceWeightGrams) {
                  return;
                }
                const pieces = parsePieceCount(raw);
                if (pieces === null) {
                  return;
                }
                const grams = gramsFromPieces(pieces, pieceWeightGrams);
                if (grams !== null) {
                  setKgDraft(formatKilogramsFromGrams(grams));
                }
              }}
              onBlur={(event) => commitFromPieces(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.currentTarget.blur();
                }
              }}
              className={`mt-1.5 ${fieldClassName}`}
            />
            {error ? <p className="mt-2 text-sm text-ink">{error}</p> : null}
          </div>
        ) : null}
        <div>
          <p className="text-sm text-muted">Вклад в {per}</p>
          {contribution === null ? (
            <p className="mt-1.5 flex h-11 items-center text-base text-ink">
              Не считается
            </p>
          ) : (
            <div className="mt-1.5 text-sm leading-5 text-ink">
              <p>{formatMoney(contribution.withVatKopecks)} с НДС</p>
              <p>{formatMoney(contribution.exVatKopecks)} без НДС</p>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

function AddLineForm({
  derivativeId,
  recipeId,
}: {
  derivativeId: string;
  recipeId: string;
}) {
  const catalog = useMaterials();
  const choices = recipeComponentChoices(catalog.document, derivativeId);
  const componentId = useId();
  const quantityId = useId();
  const piecesId = useId();
  const [component, setComponent] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pieces, setPieces] = useState("");
  const [error, setError] = useState<string | null>(null);
  const empty = choices.materials.length === 0 && choices.derivatives.length === 0;
  const choice = parseComponentOption(component);
  const owner = catalog.document.derivatives.find((item) => item.id === derivativeId);
  const selectedMaterial =
    choice?.kind === "material"
      ? catalog.document.materials.find((item) => item.id === choice.id)
      : undefined;
  const selectedDerivative =
    choice?.kind === "derivative"
      ? catalog.document.derivatives.find((item) => item.id === choice.id)
      : undefined;
  const piece = selectedMaterial?.unit === "piece";
  const pieceWeightGrams =
    owner?.isFinalProduct && selectedDerivative && !selectedDerivative.isFinalProduct
      ? selectedDerivative.pieceWeightGrams
      : null;
  const dual = pieceWeightGrams !== null && pieceWeightGrams !== undefined;

  function submit() {
    const picked = parseComponentOption(component);
    if (!picked) {
      setError(FIELD_ERROR.component);
      return;
    }

    let amount: number | null = null;
    if (piece) {
      amount = parsePieceCount(quantity);
    } else if (
      dual &&
      pieceWeightGrams &&
      pieces.trim().length > 0 &&
      quantity.trim().length === 0
    ) {
      const count = parsePieceCount(pieces);
      amount = count === null ? null : gramsFromPieces(count, pieceWeightGrams);
    } else {
      amount = parseGrams(quantity);
    }

    if (amount === null) {
      setError(FIELD_ERROR.quantity);
      return;
    }

    const recipe = catalog.activeRecipeFor(derivativeId);
    const limit =
      recipe?.yieldPercent === null || recipe?.yieldPercent === undefined
        ? null
        : inputGramsForFinishedBatch(recipe.yieldPercent, recipe.batchSize);
    if (owner && !owner.isFinalProduct && recipe && !piece && limit !== null) {
      const placed = compositionGrams(recipe.lines);
      if (placed + amount > limit) {
        setError(overflowText(placed, limit, recipe.batchSize, owner.pieceWeightGrams));
        return;
      }
    }

    const rejection = catalog.addLine(recipeId, {
      id: `line:${crypto.randomUUID()}`,
      kind: picked.kind,
      refId: picked.id,
      quantityGrams: amount,
    });
    if (rejection) {
      setError(rejection === "batch" ? FIELD_ERROR.batch : FIELD_ERROR[rejection]);
      return;
    }

    setComponent("");
    setQuantity("");
    setPieces("");
    setError(null);
  }

  return (
    <form
      className={panelPad}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <div
        className={`grid items-end gap-3 ${
          dual
            ? "md:grid-cols-[minmax(0,1fr)_11rem_11rem_auto]"
            : "md:grid-cols-[minmax(0,1fr)_11rem_auto]"
        }`}
      >
        <div>
          <label htmlFor={componentId} className="text-sm text-muted">
            Компонент
          </label>
          <select
            id={componentId}
            value={component}
            disabled={!catalog.hydrated || empty}
            onChange={(event) => {
              setComponent(event.target.value);
              setQuantity("");
              setPieces("");
              setError(null);
            }}
            className={`mt-1.5 ${fieldClassName}`}
          >
            <option value="">Выберите сырьё или производную</option>
            {choices.materials.length > 0 ? (
              <optgroup label="Сырьё">
                {choices.materials.map((item) => (
                  <option key={item.id} value={componentOptionValue("material", item.id)}>
                    {item.name}
                  </option>
                ))}
              </optgroup>
            ) : null}
            {choices.derivatives.length > 0 ? (
              <optgroup label="Производные">
                {choices.derivatives.map((item) => (
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
        <div>
          <label htmlFor={quantityId} className="text-sm text-muted">
            Количество, {piece ? "шт" : "кг"}
          </label>
          <input
            id={quantityId}
            value={quantity}
            inputMode={piece ? "numeric" : "decimal"}
            disabled={!catalog.hydrated || empty}
            autoComplete="off"
            placeholder="0"
            onChange={(event) => {
              const raw = event.target.value;
              setQuantity(raw);
              if (dual && pieceWeightGrams) {
                const grams = parseGrams(raw);
                if (grams !== null) {
                  const count = piecesFromGrams(grams, pieceWeightGrams);
                  setPieces(count === null ? "" : String(count));
                }
              }
              setError(null);
            }}
            className={`mt-1.5 ${fieldClassName}`}
          />
        </div>
        {dual ? (
          <div>
            <label htmlFor={piecesId} className="text-sm text-muted">
              Количество, шт
            </label>
            <input
              id={piecesId}
              value={pieces}
              inputMode="numeric"
              disabled={!catalog.hydrated || empty}
              autoComplete="off"
              placeholder="0"
              onChange={(event) => {
                const raw = event.target.value;
                setPieces(raw);
                if (pieceWeightGrams) {
                  const count = parsePieceCount(raw);
                  if (count !== null) {
                    const grams = gramsFromPieces(count, pieceWeightGrams);
                    if (grams !== null) {
                      setQuantity(formatKilogramsFromGrams(grams));
                    }
                  }
                }
                setError(null);
              }}
              className={`mt-1.5 ${fieldClassName}`}
            />
          </div>
        ) : null}
        <button
          type="submit"
          disabled={!catalog.hydrated || empty}
          className={`w-full md:w-auto ${primaryButtonClassName}`}
        >
          <IconPlus />
          Добавить в состав
        </button>
      </div>
      {empty ? (
        <p className="mt-2 text-sm leading-5 text-muted">
          Нет сырья и производных, которые можно положить в эту карту.
        </p>
      ) : (
        <BatchRoom derivativeId={derivativeId} />
      )}
      {error ? <p className="mt-2 text-sm text-ink">{error}</p> : null}
    </form>
  );
}

function BatchRoom({ derivativeId }: { derivativeId: string }) {
  const catalog = useMaterials();
  const owner = catalog.document.derivatives.find((item) => item.id === derivativeId);
  const recipe = catalog.activeRecipeFor(derivativeId);
  if (!owner || owner.isFinalProduct || !recipe || recipe.yieldPercent === null) {
    return null;
  }

  const target = inputGramsForFinishedBatch(recipe.yieldPercent, recipe.batchSize);
  const left = target - compositionGrams(recipe.lines);
  const batchLabel = formatBatchLabel(recipe.batchSize, false, owner.pieceWeightGrams);
  if (left <= 0) {
    return (
      <p className="mt-2 text-sm leading-5 text-muted">
        Состав на {batchLabel} уже полный.
      </p>
    );
  }

  return (
    <p className="mt-2 text-sm leading-5 text-muted">
      Свободно ещё {formatKilogramsFromGrams(left)} кг до{" "}
      {formatKilogramsFromGrams(target)} кг.
    </p>
  );
}

function BatchMeter({
  lines,
  yieldPercent,
  batchSize,
  pieceWeightGrams,
}: {
  lines: { quantityGrams: number }[];
  yieldPercent: number;
  batchSize: number;
  pieceWeightGrams: number | null;
}) {
  const grams = compositionGrams(lines);
  const target = inputGramsForFinishedBatch(yieldPercent, batchSize);
  const ready = grams === target;
  const width = Math.min(100, (grams / target) * 100);
  const missing = target - grams;
  const batchLabel = formatBatchLabel(batchSize, false, pieceWeightGrams);

  return (
    <div className={`border-b border-line ${panelPad}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-sm text-muted">На {batchLabel}</p>
        <p className="text-sm text-ink">
          {formatKilogramsFromGrams(grams)} из {formatKilogramsFromGrams(target)} кг
        </p>
      </div>
      <div className="mt-2 h-1 bg-line" aria-hidden="true">
        <div className="h-full bg-ink" style={{ width: `${width}%` }} />
      </div>
      <p className="mt-2 text-sm leading-5 text-ink">
        {ready
          ? "Состав собран. Себестоимость 1 кг считается из этой закладки."
          : missing > 0
            ? `Не хватает ${formatKilogramsFromGrams(missing)} кг. При выходе ${yieldPercent}% на ${batchLabel} нужно ${formatKilogramsFromGrams(target)} кг сырья.`
            : `В составе на ${formatKilogramsFromGrams(-missing)} кг больше, чем нужно при выходе ${yieldPercent}%.`}
      </p>
    </div>
  );
}

function overflowText(
  placedGrams: number,
  limitGrams: number,
  batchGrams: number,
  pieceWeightGrams: number | null = null,
): string {
  const left = limitGrams - placedGrams;
  if (left <= 0) {
    return `На ${formatBatchLabel(batchGrams, false, pieceWeightGrams)} состав уже полный.`;
  }

  return `В этой строке можно указать не больше ${formatKilogramsFromGrams(left)} кг.`;
}

function DeletedRecipes({ recipes }: { recipes: RecipeCard[] }) {
  const catalog = useMaterials();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className={`border-t border-line ${panelPad}`}>
      <h3 className="text-sm font-semibold text-ink">Удалённые карты</h3>
      <ul className="mt-2">
        {recipes.map((recipe) => (
          <li
            key={recipe.id}
            className="flex items-center justify-between gap-3 border-t border-line py-3 first:border-t-0"
          >
            <p className="text-sm text-muted">
              {recipe.lines.length === 0
                ? "Пустой состав"
                : recipe.lines
                    .map((line) => describeComponent(catalog.document, line).name)
                    .join(", ")}
              {recipe.yieldPercent === null ? "" : ` · выход ${recipe.yieldPercent}%`}
            </p>
            <button
              type="button"
              aria-label="Вернуть рецептурную карту"
              title="Вернуть"
              disabled={!catalog.hydrated}
              onClick={() => {
                const rejection = catalog.restoreRecipe(recipe.id);
                setError(rejection ? FIELD_ERROR[rejection] : null);
              }}
              className="inline-flex size-11 items-center justify-center text-ink outline-none hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
            >
              <IconUndo />
            </button>
          </li>
        ))}
      </ul>
      {error ? <p className="mt-2 text-sm text-ink">{error}</p> : null}
    </div>
  );
}

function isPieceLine(document: PrototypeDocument, line: RecipeLine): boolean {
  if (line.kind !== "material") {
    return false;
  }

  return document.materials.find((item) => item.id === line.refId)?.unit === "piece";
}

function describeComponent(
  document: ReturnType<typeof useMaterials>["document"],
  line: RecipeLine,
): { name: string; kind: string; deleted: boolean; price: string | null } {
  if (line.kind === "material") {
    const material = document.materials.find((item) => item.id === line.refId);
    const exVat = material ? priceExVatKopecks(material) : null;
    const unit = material?.unit === "piece" ? "шт" : "кг";
    return {
      name: material?.name ?? "Сырьё не найдено",
      kind: "Сырьё",
      deleted: material?.deletedAt !== null && material !== undefined,
      price:
        material && exVat !== null
          ? formatVatPair(material.priceWithVatKopecks, exVat, unit)
          : null,
    };
  }

  const derivative = document.derivatives.find((item) => item.id === line.refId);
  const cost = derivative ? unitCost(document, derivative.id) : null;
  return {
    name: derivative?.name ?? "Производная не найдена",
    kind: "Производная",
    deleted: derivative?.deletedAt !== null && derivative !== undefined,
    price: cost
      ? formatVatPair(
          cost.withVatKopecks,
          cost.exVatKopecks,
          cost.per === "piece" ? "шт" : "кг",
        )
      : null,
  };
}
