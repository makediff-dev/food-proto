"use client";

import { unitCost } from "@/domain/cost";
import { MAX_LABEL_LENGTH, type Derivative } from "@/domain/document";
import { normalizeName } from "@/domain/directory";
import { compositionGrams, inputGramsForFinishedBatch } from "@/domain/materials";
import { formatKilogramsFromGrams } from "@/domain/units";
import {
  CatalogTable,
  DataCell,
  GridNumber,
  GridSelect,
  GridText,
  HeadCell,
  keepWithNext,
  MoneyAmount,
  placeChoices,
  RowAction,
  VatPair,
} from "@/features/materials/catalog-cells";
import { FIELD_ERROR, parsePieceWeightGrams } from "@/features/materials/fields";
import { RecipeEditor } from "@/features/materials/recipe-editor";
import { useMaterials } from "@/features/materials/use-materials";
import { IconChevronDown, IconChevronRight } from "@/features/shell/icons";

export function MadeTable({
  items,
  isFinalProduct,
  showDeleted,
  expandedIds,
  onToggle,
}: {
  items: Derivative[];
  isFinalProduct: boolean;
  showDeleted: boolean;
  expandedIds: ReadonlySet<string>;
  onToggle: (id: string) => void;
}) {
  const catalog = useMaterials();
  const editable = catalog.hydrated && !showDeleted;
  const caption = isFinalProduct ? "Товары" : "Производные";
  const extraLabel = isFinalProduct ? "НДС" : "Вес\u00A01\u00A0шт";

  return (
    <CatalogTable caption={caption}>
      <thead className="sticky top-0 z-30">
        <tr>
          <th
            scope="col"
            className="sticky left-0 z-40 w-10 max-w-10 border-b border-b-line border-r border-r-line bg-paper p-0"
          >
            <span className="sr-only">Рецептурная карта</span>
          </th>
          <HeadCell
            label="Название"
            sticky
            stickyLeft="left-10"
            align="left"
            className="border-r-[1.5px] border-r-muted"
          />
          <HeadCell label="Склад" />
          <HeadCell label="Цех" />
          <HeadCell label={extraLabel} />
          <HeadCell
            label={
              isFinalProduct
                ? "Себестоимость\u00A01\u00A0шт"
                : "Себестоимость\u00A01\u00A0кг"
            }
          />
          <th
            scope="col"
            className="border-b border-b-line bg-paper px-1.5 py-2"
          >
            <span className="sr-only">Действие</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => {
          const open = expandedIds.has(item.id);
          return (
            <MadeBlock
              key={item.id}
              item={item}
              open={open}
              editable={editable}
              showDeleted={showDeleted}
              onToggle={() => onToggle(item.id)}
            />
          );
        })}
      </tbody>
    </CatalogTable>
  );
}

function MadeBlock({
  item,
  open,
  editable,
  showDeleted,
  onToggle,
}: {
  item: Derivative;
  open: boolean;
  editable: boolean;
  showDeleted: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <MadeRow
        item={item}
        open={open}
        editable={editable}
        showDeleted={showDeleted}
        onToggle={onToggle}
      />
      {open ? (
        <tr>
          <td colSpan={7} className="border-b border-b-line bg-paper px-3 py-3">
            <RecipeEditor derivative={item} embedded disabled={!editable} />
          </td>
        </tr>
      ) : null}
    </>
  );
}

function MadeRow({
  item,
  open,
  editable,
  showDeleted,
  onToggle,
}: {
  item: Derivative;
  open: boolean;
  editable: boolean;
  showDeleted: boolean;
  onToggle: () => void;
}) {
  const catalog = useMaterials();
  const cost = unitCost(catalog.document, item.id);
  const recipe = catalog.activeRecipeFor(item.id);
  const warehouses = placeChoices(catalog.document.warehouses, item.warehouseId);
  const workshops = placeChoices(catalog.document.workshops, item.workshopId);

  function save(patch: {
    name?: string;
    warehouseId?: string;
    workshopId?: string;
    pieceWeightGrams?: number | null;
  }): string | null {
    const rejection = catalog.updateDerivative(item.id, {
      name: patch.name ?? item.name,
      isFinalProduct: item.isFinalProduct,
      warehouseId: patch.warehouseId ?? item.warehouseId,
      workshopId: patch.workshopId ?? item.workshopId,
      vatPercent: item.isFinalProduct ? item.vatPercent : null,
      pieceWeightGrams: item.isFinalProduct
        ? null
        : patch.pieceWeightGrams !== undefined
          ? patch.pieceWeightGrams
          : item.pieceWeightGrams,
    });
    return rejection ? FIELD_ERROR[rejection] : null;
  }

  function restore(): string | null {
    const rejection = catalog.restoreDerivative(item.id);
    return rejection ? FIELD_ERROR[rejection] : null;
  }

  return (
    <tr>
      <th
        scope="row"
        className="sticky left-0 z-10 h-px w-10 max-w-10 border-b border-b-line border-r border-r-line bg-sheet p-0 align-middle font-normal"
      >
        <button
          type="button"
          aria-expanded={open}
          aria-label={
            open
              ? `Свернуть рецептурную карту «${item.name}»`
              : `Развернуть рецептурную карту «${item.name}»`
          }
          onClick={onToggle}
          className="inline-flex size-10 cursor-pointer items-center justify-center text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          {open ? <IconChevronDown /> : <IconChevronRight />}
        </button>
      </th>
      <DataCell
        sticky
        stickyLeft="left-10"
        editable={editable}
        align="left"
        className="border-r-[1.5px] border-r-muted"
      >
        <GridText
          label={`Название, ${item.name}`}
          value={item.name}
          disabled={!editable}
          maxLength={MAX_LABEL_LENGTH}
          onCommit={(name) => {
            if (normalizeName(name) === item.name) {
              return null;
            }
            return save({ name });
          }}
        />
        {showDeleted ? <p className="mt-1 text-sm text-muted">удалён</p> : null}
      </DataCell>
      <DataCell editable={editable} align="left">
        <GridSelect
          label={`Склад, ${item.name}`}
          value={item.warehouseId}
          disabled={!editable}
          options={warehouses}
          onCommit={(warehouseId) => save({ warehouseId })}
        />
      </DataCell>
      <DataCell editable={editable} align="left">
        <GridSelect
          label={`Цех, ${item.name}`}
          value={item.workshopId}
          disabled={!editable}
          options={workshops}
          onCommit={(workshopId) => save({ workshopId })}
        />
      </DataCell>
      <DataCell editable={editable && !item.isFinalProduct}>
        {item.isFinalProduct ? (
          <span className="whitespace-nowrap">
            {item.vatPercent === null ? "—" : `${item.vatPercent} %`}
          </span>
        ) : (
          <GridNumber
            label={`Вес 1 шт, ${item.name}`}
            value={String(item.pieceWeightGrams ?? "")}
            disabled={!editable}
            inputMode="numeric"
            unit="г"
            invalidMessage={FIELD_ERROR["piece-weight"]}
            parse={parsePieceWeightGrams}
            onCommit={(pieceWeightGrams) => {
              if (pieceWeightGrams === item.pieceWeightGrams) {
                return null;
              }
              return save({ pieceWeightGrams });
            }}
          />
        )}
      </DataCell>
      <DataCell>
        {cost ? (
          <VatPair
            withVat={<MoneyAmount kopecks={cost.withVatKopecks} />}
            exVat={<MoneyAmount kopecks={cost.exVatKopecks} />}
          />
        ) : (
          <span className="text-sm text-muted">
            {keepWithNext(recipeStatus(item, recipe))}
          </span>
        )}
      </DataCell>
      <DataCell align="center">
        <RowAction
          showDeleted={showDeleted}
          disabled={!catalog.hydrated}
          noun={item.isFinalProduct ? "товар" : "производную"}
          name={item.name}
          onDelete={() => catalog.removeDerivative(item.id)}
          onRestore={restore}
        />
      </DataCell>
    </tr>
  );
}

function recipeStatus(
  item: Derivative,
  recipe: {
    lines: { quantityGrams: number }[];
    yieldPercent: number | null;
    batchSize: number;
  } | null,
): string {
  if (!recipe) {
    return "Нет рецептурной карты";
  }

  if (!item.isFinalProduct) {
    if (recipe.yieldPercent === null) {
      return "Нет выхода после обработки";
    }
    const target = inputGramsForFinishedBatch(recipe.yieldPercent, recipe.batchSize);
    const grams = compositionGrams(recipe.lines);
    if (grams !== target) {
      return `В составе ${formatKilogramsFromGrams(grams)} из ${formatKilogramsFromGrams(target)} кг`;
    }
  }

  return "Себестоимость не считается";
}
