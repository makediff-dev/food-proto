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
import {
  Empty,
  GridNumber,
  MoneyAmount,
  VatPair,
  gridSelectClassName,
  editableCellClassName,
} from "@/features/materials/catalog-cells";
import { formatMoney, formatVatPair } from "@/features/materials/money";
import {
  FIELD_ERROR,
  componentOptionValue,
  fieldClassName,
  parseComponentOption,
  parseGrams,
  parsePieceCount,
  parseWholePercent,
  primaryButtonClassName,
} from "@/features/materials/fields";
import { useMaterials } from "@/features/materials/use-materials";
import { IconPlus, IconTrash, IconUndo } from "@/features/shell/icons";

export function RecipeEditor({
  derivative,
  embedded = false,
  disabled = false,
}: {
  derivative: Derivative;
  embedded?: boolean;
  disabled?: boolean;
}) {
  const catalog = useMaterials();
  const recipe = catalog.activeRecipeFor(derivative.id);
  const deleted = catalog.deletedRecipesFor(derivative.id);
  const cost = unitCost(catalog.document, derivative.id);
  const canEdit = catalog.hydrated && !disabled;

  const body = (
    <>
      {embedded ? null : (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-ink">Рецептурная карта</h2>
            <p className="mt-1 text-sm text-muted">
              {derivative.isFinalProduct ? "Себестоимость 1 шт" : "Себестоимость 1 кг"}
            </p>
            {cost ? (
              <div className="mt-1 text-sm leading-5 text-ink">
                <p>{formatMoney(cost.withVatKopecks)} с НДС</p>
                <p>{formatMoney(cost.exVatKopecks)} без НДС</p>
              </div>
            ) : (
              <p className="mt-1 text-sm text-ink">
                {recipe ? "Не считается" : "Нет карты"}
              </p>
            )}
          </div>
          {recipe && canEdit ? (
            <button
              type="button"
              aria-label="Удалить рецептурную карту"
              title="Удалить"
              onClick={() => {
                const confirmed = window.confirm(
                  "Удалить рецептурную карту? Состав пропадёт из работы. Вернуть карту можно среди удалённых.",
                );
                if (confirmed) {
                  catalog.removeRecipe(recipe.id);
                }
              }}
              className="inline-flex size-8 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <IconTrash />
            </button>
          ) : null}
        </div>
      )}

      {recipe && !derivative.isFinalProduct && recipe.yieldPercent !== null ? (
        <BatchMeter
          lines={recipe.lines}
          yieldPercent={recipe.yieldPercent}
          batchSize={recipe.batchSize}
          pieceWeightGrams={derivative.pieceWeightGrams}
        />
      ) : null}

      {recipe ? (
        <ActiveRecipe
          derivative={derivative}
          recipe={recipe}
          canEdit={canEdit}
          showBatchFields={!embedded}
        />
      ) : (
        <CreateRecipe derivative={derivative} canEdit={canEdit} />
      )}

      {deleted.length > 0 ? <DeletedRecipes recipes={deleted} canEdit={canEdit} /> : null}
    </>
  );

  if (embedded) {
    return <div className="flex flex-col gap-3">{body}</div>;
  }

  return (
    <section className="mt-3 flex flex-col gap-3 border border-line bg-sheet px-3 py-3">
      {body}
    </section>
  );
}

function CreateRecipe({
  derivative,
  canEdit,
}: {
  derivative: Derivative;
  canEdit: boolean;
}) {
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
      className="flex flex-col gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <p className="text-sm leading-5 text-muted">
        {derivative.isFinalProduct
          ? "Карты ещё нет. Состав задаётся на партию штук — базу можно сменить после создания."
          : "Карты ещё нет. Состав задаётся на партию готового продукта — базу и выход можно сменить после создания."}
      </p>
      <div className="flex flex-wrap items-end gap-3">
        {derivative.isFinalProduct ? null : (
          <div className="w-40">
            <label htmlFor={yieldId} className="text-sm text-muted">
              Выход после обработки, %
            </label>
            <input
              id={yieldId}
              value={yieldRaw}
              inputMode="numeric"
              disabled={!canEdit}
              autoComplete="off"
              placeholder="80"
              onChange={(event) => {
                setYieldRaw(event.target.value);
                setError(null);
              }}
              className={`mt-1 ${fieldClassName} h-9`}
            />
          </div>
        )}
        <button
          type="submit"
          disabled={!canEdit}
          className={`h-9 ${primaryButtonClassName}`}
        >
          <IconPlus />
          Создать карту
        </button>
      </div>
      {error ? <p className="text-sm text-ink">{error}</p> : null}
    </form>
  );
}

function ActiveRecipe({
  derivative,
  recipe,
  canEdit,
  showBatchFields,
}: {
  derivative: Derivative;
  recipe: RecipeCard;
  canEdit: boolean;
  showBatchFields: boolean;
}) {
  const per = derivative.isFinalProduct ? "1 шт" : "1 кг";
  const batchLabel = formatBatchLabel(
    recipe.batchSize,
    derivative.isFinalProduct,
    derivative.pieceWeightGrams,
  );
  const showPieces = derivative.isFinalProduct;

  return (
    <div className="flex flex-col gap-3">
      {showBatchFields ? (
        <RecipeBatchFields derivative={derivative} recipe={recipe} canEdit={canEdit} />
      ) : null}
      <div className="overflow-auto border border-line">
        <table className="w-max min-w-full border-separate border-spacing-0 text-sm">
          <caption className="sr-only">Состав на {batchLabel}</caption>
          <thead>
            <tr>
              <th className="border-b border-b-line border-r border-r-line bg-paper px-2 py-1.5 text-left font-normal text-muted">
                Компонент
              </th>
              <th className="border-b border-b-line border-r border-r-line bg-paper px-2 py-1.5 text-right font-normal text-muted">
                {showPieces ? "Количество, кг" : "Количество"}
              </th>
              {showPieces ? (
                <th className="border-b border-b-line border-r border-r-line bg-paper px-2 py-1.5 text-right font-normal text-muted">
                  Количество, шт
                </th>
              ) : null}
              <th className="border-b border-b-line border-r border-r-line bg-paper px-2 py-1.5 text-right font-normal text-muted">
                Вклад в {per}
              </th>
              <th className="border-b border-b-line bg-paper px-2 py-1.5 text-center font-normal text-muted">
                <span className="sr-only">Убрать</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {recipe.lines.length === 0 ? (
              <tr>
                <td
                  colSpan={showPieces ? 5 : 4}
                  className="border-b border-b-line px-2 py-2 text-sm text-muted"
                >
                  В составе пока пусто. Добавьте сырьё или другую производную.
                </td>
              </tr>
            ) : (
              recipe.lines.map((line) => (
                <RecipeLineRow
                  key={line.id}
                  derivative={derivative}
                  recipeId={recipe.id}
                  line={line}
                  showPieces={showPieces}
                  canEdit={canEdit}
                />
              ))
            )}
            {canEdit ? (
              <AddLineRow
                derivativeId={derivative.id}
                recipeId={recipe.id}
                showPieces={showPieces}
              />
            ) : null}
          </tbody>
        </table>
      </div>
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
  canEdit,
}: {
  derivative: Derivative;
  recipe: RecipeCard;
  canEdit: boolean;
}) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      {derivative.isFinalProduct ? null : (
        <YieldField
          recipeId={recipe.id}
          yieldPercent={recipe.yieldPercent ?? 0}
          canEdit={canEdit}
        />
      )}
      <BatchSizeField
        recipeId={recipe.id}
        batchSize={recipe.batchSize}
        isFinalProduct={derivative.isFinalProduct}
        canEdit={canEdit}
      />
    </div>
  );
}

function YieldField({
  recipeId,
  yieldPercent,
  canEdit,
}: {
  recipeId: string;
  yieldPercent: number;
  canEdit: boolean;
}) {
  const catalog = useMaterials();
  return (
    <div className="w-36">
      <p className="text-sm text-muted">Выход после обработки, %</p>
      <div className={`mt-1 px-2 py-1 ${canEdit ? editableCellClassName : ""}`}>
        <GridNumber
          label="Выход после обработки"
          value={String(yieldPercent)}
          disabled={!canEdit}
          inputMode="numeric"
          unit="%"
          invalidMessage={FIELD_ERROR.yield}
          parse={(raw) => {
            const parsed = parseWholePercent(raw);
            if (parsed === null || parsed < 1 || parsed > 100) {
              return null;
            }
            return parsed;
          }}
          onCommit={(next) => {
            if (next === yieldPercent) {
              return null;
            }
            const rejection = catalog.setYield(recipeId, next);
            return rejection ? FIELD_ERROR[rejection] : null;
          }}
        />
      </div>
    </div>
  );
}

function BatchSizeField({
  recipeId,
  batchSize,
  isFinalProduct,
  canEdit,
}: {
  recipeId: string;
  batchSize: number;
  isFinalProduct: boolean;
  canEdit: boolean;
}) {
  const catalog = useMaterials();
  return (
    <div className="w-44">
      <p className="text-sm text-muted">
        {isFinalProduct ? "Норма закладки, шт" : "Партия готового продукта, кг"}
      </p>
      <div className={`mt-1 px-2 py-1 ${canEdit ? editableCellClassName : ""}`}>
        <GridNumber
          label={isFinalProduct ? "Норма закладки" : "Партия готового продукта"}
          value={isFinalProduct ? String(batchSize) : formatKilogramsFromGrams(batchSize)}
          disabled={!canEdit}
          inputMode={isFinalProduct ? "numeric" : "decimal"}
          unit={isFinalProduct ? "шт" : "кг"}
          invalidMessage={FIELD_ERROR["batch-size"]}
          parse={isFinalProduct ? parsePieceCount : parseGrams}
          onCommit={(next) => {
            if (next === batchSize) {
              return null;
            }
            const rejection = catalog.setBatchSize(recipeId, next);
            return rejection ? FIELD_ERROR[rejection] : null;
          }}
        />
      </div>
    </div>
  );
}

function RecipeLineRow({
  derivative,
  recipeId,
  line,
  showPieces,
  canEdit,
}: {
  derivative: Derivative;
  recipeId: string;
  line: RecipeLine;
  showPieces: boolean;
  canEdit: boolean;
}) {
  const catalog = useMaterials();
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
  const pieceInOwnColumn = showPieces && piece;
  const component = describeComponent(catalog.document, line);
  const contribution = lineContribution(catalog.document, derivative.id, line.id);
  const kgValue = piece
    ? String(line.quantityGrams)
    : formatKilogramsFromGrams(line.quantityGrams);
  const piecesValue =
    dual && pieceWeightGrams
      ? String(piecesFromGrams(line.quantityGrams, pieceWeightGrams) ?? "")
      : "";

  function rejectGrams(grams: number): string | null {
    if (grams === line.quantityGrams) {
      return null;
    }
    const rejection = catalog.updateLine(recipeId, line.id, grams);
    if (!rejection) {
      setError(null);
      return null;
    }
    const active = catalog.activeRecipeFor(derivative.id);
    const message =
      rejection === "batch" && active && active.yieldPercent !== null
        ? overflowText(
            compositionGrams(active.lines.filter((item) => item.id !== line.id)),
            inputGramsForFinishedBatch(active.yieldPercent, active.batchSize),
            active.batchSize,
            derivative.pieceWeightGrams,
          )
        : FIELD_ERROR[rejection];
    setError(message);
    return message;
  }

  return (
    <tr>
      <td className="border-b border-b-line border-r border-r-line px-2 py-1.5 align-middle">
        <p className="font-semibold text-ink">{component.name}</p>
        <p className="text-sm text-muted">
          {component.kind}
          {component.deleted ? ", удалён" : ""}
          {component.price ? ` · ${component.price}` : ""}
        </p>
        {error ? <p className="mt-1 text-sm text-ink">{error}</p> : null}
      </td>
      <td
        className={`border-b border-b-line border-r border-r-line px-2 py-1.5 text-right align-middle ${
          canEdit && !pieceInOwnColumn ? editableCellClassName : ""
        }`}
      >
        {pieceInOwnColumn ? (
          <Empty />
        ) : (
          <GridNumber
            label={`Количество, ${component.name}`}
            value={kgValue}
            disabled={!canEdit}
            inputMode={piece ? "numeric" : "decimal"}
            unit={piece ? "шт" : "кг"}
            invalidMessage={FIELD_ERROR.quantity}
            parse={piece ? parsePieceCount : parseGrams}
            onCommit={(grams) => rejectGrams(grams)}
          />
        )}
      </td>
      {showPieces ? (
        <td
          className={`border-b border-b-line border-r border-r-line px-2 py-1.5 text-right align-middle ${
            canEdit && (dual || piece) ? editableCellClassName : ""
          }`}
        >
          {dual && pieceWeightGrams ? (
            <GridNumber
              label={`Количество в штуках, ${component.name}`}
              value={piecesValue}
              disabled={!canEdit}
              inputMode="numeric"
              unit="шт"
              invalidMessage={FIELD_ERROR.quantity}
              parse={parsePieceCount}
              onCommit={(pieces) => {
                const grams = gramsFromPieces(pieces, pieceWeightGrams);
                if (grams === null) {
                  return FIELD_ERROR.quantity;
                }
                return rejectGrams(grams);
              }}
            />
          ) : piece ? (
            <GridNumber
              label={`Количество, ${component.name}`}
              value={String(line.quantityGrams)}
              disabled={!canEdit}
              inputMode="numeric"
              unit="шт"
              invalidMessage={FIELD_ERROR.quantity}
              parse={parsePieceCount}
              onCommit={(count) => rejectGrams(count)}
            />
          ) : (
            <Empty />
          )}
        </td>
      ) : null}
      <td className="border-b border-b-line border-r border-r-line px-2 py-1.5 text-right align-middle">
        {contribution === null ? (
          <span className="text-muted">Не считается</span>
        ) : (
          <VatPair
            withVat={<MoneyAmount kopecks={contribution.withVatKopecks} />}
            exVat={<MoneyAmount kopecks={contribution.exVatKopecks} />}
          />
        )}
      </td>
      <td className="border-b border-b-line px-1 py-1.5 text-center align-middle">
        {canEdit ? (
          <button
            type="button"
            aria-label={`Убрать «${component.name}» из состава`}
            title="Убрать"
            onClick={() => {
              const confirmed = window.confirm(`Убрать «${component.name}» из состава?`);
              if (confirmed) {
                catalog.removeLine(recipeId, line.id);
              }
            }}
            className="inline-flex size-8 items-center justify-center text-muted outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <IconTrash />
          </button>
        ) : null}
      </td>
    </tr>
  );
}

function AddLineRow({
  derivativeId,
  recipeId,
  showPieces,
}: {
  derivativeId: string;
  recipeId: string;
  showPieces: boolean;
}) {
  const catalog = useMaterials();
  const choices = recipeComponentChoices(catalog.document, derivativeId);
  const componentId = useId();
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
  const pieceInOwnColumn = showPieces && piece;
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
      amount = parsePieceCount(pieceInOwnColumn ? pieces : quantity);
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
    <>
      <tr>
        <td
          className={`border-b border-b-line border-r border-r-line px-2 py-1.5 ${editableCellClassName}`}
        >
          <label htmlFor={componentId} className="sr-only">
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
            className={gridSelectClassName}
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
        </td>
        <td
          className={`border-b border-b-line border-r border-r-line px-2 py-1.5 ${
            pieceInOwnColumn ? "" : editableCellClassName
          }`}
        >
          {pieceInOwnColumn ? (
            <Empty />
          ) : (
            <input
              value={quantity}
              inputMode={piece ? "numeric" : "decimal"}
              disabled={!catalog.hydrated || empty}
              autoComplete="off"
              placeholder={piece ? "шт" : "кг"}
              aria-label="Количество"
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
              className="w-full min-w-16 bg-transparent p-0 text-right text-sm text-ink outline-none"
            />
          )}
        </td>
        {showPieces ? (
          <td
            className={`border-b border-b-line border-r border-r-line px-2 py-1.5 ${
              dual || piece ? editableCellClassName : ""
            }`}
          >
            {dual || piece ? (
              <input
                value={pieces}
                inputMode="numeric"
                disabled={!catalog.hydrated || empty}
                autoComplete="off"
                placeholder="шт"
                aria-label="Количество, шт"
                onChange={(event) => {
                  const raw = event.target.value;
                  setPieces(raw);
                  if (dual && pieceWeightGrams) {
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
                className="w-full min-w-16 bg-transparent p-0 text-right text-sm text-ink outline-none"
              />
            ) : (
              <Empty />
            )}
          </td>
        ) : null}
        <td className="border-b border-b-line border-r border-r-line px-2 py-1.5" />
        <td className="border-b border-b-line px-1 py-1.5 text-center">
          <button
            type="button"
            disabled={!catalog.hydrated || empty}
            onClick={submit}
            className="inline-flex h-8 items-center justify-center gap-1 bg-ink px-2 text-sm text-white outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
          >
            <IconPlus />
            Добавить
          </button>
        </td>
      </tr>
      <tr>
        <td colSpan={showPieces ? 5 : 4} className="px-2 py-1.5">
          {empty ? (
            <p className="text-sm leading-5 text-muted">
              Нет сырья и производных, которые можно положить в эту карту.
            </p>
          ) : (
            <BatchRoom derivativeId={derivativeId} />
          )}
          {error ? <p className="mt-1 text-sm text-ink">{error}</p> : null}
        </td>
      </tr>
    </>
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
      <p className="text-sm leading-5 text-muted">Состав на {batchLabel} уже полный.</p>
    );
  }

  return (
    <p className="text-sm leading-5 text-muted">
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
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-sm text-muted">На {batchLabel}</p>
        <p className="text-sm text-ink">
          {formatKilogramsFromGrams(grams)} из {formatKilogramsFromGrams(target)} кг
        </p>
      </div>
      <div className="mt-1.5 h-1 bg-line" aria-hidden="true">
        <div className="h-full bg-ink" style={{ width: `${width}%` }} />
      </div>
      <p className="mt-1.5 text-sm leading-5 text-ink">
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

function DeletedRecipes({
  recipes,
  canEdit,
}: {
  recipes: RecipeCard[];
  canEdit: boolean;
}) {
  const catalog = useMaterials();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <h3 className="text-sm font-semibold text-ink">Удалённые карты</h3>
      <ul className="mt-1">
        {recipes.map((recipe) => (
          <li
            key={recipe.id}
            className="flex items-center justify-between gap-3 border-t border-line py-1.5 first:border-t-0"
          >
            <p className="text-sm text-muted">
              {recipe.lines.length === 0
                ? "Пустой состав"
                : recipe.lines
                    .map((line) => describeComponent(catalog.document, line).name)
                    .join(", ")}
              {recipe.yieldPercent === null ? "" : ` · выход ${recipe.yieldPercent}%`}
            </p>
            {canEdit ? (
              <button
                type="button"
                aria-label="Вернуть рецептурную карту"
                title="Вернуть"
                onClick={() => {
                  const rejection = catalog.restoreRecipe(recipe.id);
                  setError(rejection ? FIELD_ERROR[rejection] : null);
                }}
                className="inline-flex size-8 items-center justify-center text-ink outline-none hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <IconUndo />
              </button>
            ) : null}
          </li>
        ))}
      </ul>
      {error ? <p className="mt-1 text-sm text-ink">{error}</p> : null}
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
