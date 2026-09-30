"use client";

import { priceExVatKopecks } from "@/domain/cost";
import { MAX_LABEL_LENGTH, type RawMaterial } from "@/domain/document";
import { normalizeName } from "@/domain/directory";
import { formatRublesFromKopecks } from "@/domain/units";
import {
  CatalogTable,
  DataCell,
  Empty,
  GridNumber,
  GridSelect,
  GridText,
  HeadCell,
  MoneyAmount,
  placeChoices,
  RowAction,
  StackedPair,
} from "@/features/materials/catalog-cells";
import {
  FIELD_ERROR,
  parseKopecks,
  parseStockQuantity,
  parseWholePercent,
} from "@/features/materials/fields";
import { formatStockAmount } from "@/features/materials/money";
import { useMaterials } from "@/features/materials/use-materials";

export function MaterialTable({
  items,
  showDeleted,
}: {
  items: RawMaterial[];
  showDeleted: boolean;
}) {
  const catalog = useMaterials();
  const editable = catalog.hydrated && !showDeleted;

  return (
    <CatalogTable caption="Сырьё">
      <thead className="sticky top-0 z-30">
        <tr>
          <HeadCell label="Название" sticky align="left" />
          <HeadCell label="Бренд" />
          <HeadCell label="Склад" />
          <HeadCell label="Ед." />
          <HeadCell label="Цена закупки" />
          <HeadCell label="НДС" />
          <HeadCell label="Мин. остаток" />
          <HeadCell label="Макс. остаток" />
          <HeadCell label="Действие" />
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <MaterialRow
            key={item.id}
            item={item}
            editable={editable}
            showDeleted={showDeleted}
          />
        ))}
      </tbody>
    </CatalogTable>
  );
}

function MaterialRow({
  item,
  editable,
  showDeleted,
}: {
  item: RawMaterial;
  editable: boolean;
  showDeleted: boolean;
}) {
  const catalog = useMaterials();
  const unit = item.unit === "piece" ? "шт" : "кг";
  const exVat = priceExVatKopecks(item);
  const warehouses = placeChoices(catalog.document.warehouses, item.warehouseId);

  function save(patch: Partial<RawMaterial>): string | null {
    const rejection = catalog.updateMaterial(item.id, {
      name: patch.name ?? item.name,
      brand: patch.brand ?? item.brand,
      warehouseId: patch.warehouseId ?? item.warehouseId,
      unit: patch.unit ?? item.unit,
      priceWithVatKopecks: patch.priceWithVatKopecks ?? item.priceWithVatKopecks,
      vatPercent: patch.vatPercent ?? item.vatPercent,
      minNormStock: patch.minNormStock ?? item.minNormStock,
      maxNormStock: patch.maxNormStock ?? item.maxNormStock,
    });
    return rejection ? FIELD_ERROR[rejection] : null;
  }

  function restore(): string | null {
    const rejection = catalog.restoreMaterial(item.id);
    return rejection ? FIELD_ERROR[rejection] : null;
  }

  return (
    <tr>
      <DataCell sticky editable={editable} align="left">
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
        <GridText
          label={`Бренд, ${item.name}`}
          value={item.brand}
          disabled={!editable}
          maxLength={MAX_LABEL_LENGTH}
          onCommit={(brand) => {
            if (brand.trim() === item.brand) {
              return null;
            }
            return save({ brand });
          }}
        />
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
          label={`Единица, ${item.name}`}
          value={item.unit}
          disabled={!editable}
          options={[
            { id: "kg", label: "кг" },
            { id: "piece", label: "шт" },
          ]}
          onCommit={(next) => save({ unit: next === "piece" ? "piece" : "kg" })}
        />
      </DataCell>
      <DataCell>
        <StackedPair
          topHighlighted={editable}
          topLabel="с НДС"
          bottomLabel="без НДС"
          top={
            <GridNumber
              label={`Цена с НДС, ${item.name}`}
              value={formatRublesFromKopecks(item.priceWithVatKopecks)}
              disabled={!editable}
              inputMode="decimal"
              unit="₽"
              invalidMessage={FIELD_ERROR.price}
              parse={parseKopecks}
              onCommit={(priceWithVatKopecks) => {
                if (priceWithVatKopecks === item.priceWithVatKopecks) {
                  return null;
                }
                return save({ priceWithVatKopecks });
              }}
            />
          }
          bottom={exVat === null ? <Empty /> : <MoneyAmount kopecks={exVat} />}
        />
      </DataCell>
      <DataCell editable={editable}>
        <GridNumber
          label={`НДС, ${item.name}`}
          value={String(item.vatPercent)}
          disabled={!editable}
          inputMode="numeric"
          unit="%"
          invalidMessage={FIELD_ERROR.vat}
          parse={parseWholePercent}
          onCommit={(vatPercent) => {
            if (vatPercent === item.vatPercent) {
              return null;
            }
            return save({ vatPercent });
          }}
        />
      </DataCell>
      <DataCell editable={editable}>
        <GridNumber
          label={`Минимальный остаток, ${item.name}`}
          value={formatStockAmount(item.minNormStock, item.unit)}
          disabled={!editable}
          inputMode={item.unit === "piece" ? "numeric" : "decimal"}
          unit={unit}
          invalidMessage={FIELD_ERROR.stock}
          parse={(raw) => parseStockQuantity(raw, item.unit)}
          onCommit={(minNormStock) => {
            if (minNormStock === item.minNormStock) {
              return null;
            }
            return save({ minNormStock });
          }}
        />
      </DataCell>
      <DataCell editable={editable}>
        <GridNumber
          label={`Максимальный остаток, ${item.name}`}
          value={formatStockAmount(item.maxNormStock, item.unit)}
          disabled={!editable}
          inputMode={item.unit === "piece" ? "numeric" : "decimal"}
          unit={unit}
          invalidMessage={FIELD_ERROR.stock}
          parse={(raw) => parseStockQuantity(raw, item.unit)}
          onCommit={(maxNormStock) => {
            if (maxNormStock === item.maxNormStock) {
              return null;
            }
            return save({ maxNormStock });
          }}
        />
      </DataCell>
      <DataCell align="center">
        <RowAction
          showDeleted={showDeleted}
          disabled={!catalog.hydrated}
          noun="сырьё"
          name={item.name}
          onDelete={() => catalog.removeMaterial(item.id)}
          onRestore={restore}
        />
      </DataCell>
    </tr>
  );
}
