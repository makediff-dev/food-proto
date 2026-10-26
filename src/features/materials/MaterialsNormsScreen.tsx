'use client';

import { MATERIAL_WAREHOUSES, NORMED_MATERIAL_GROUP_ID } from '@/domain/document';
import { activeMaterials, materialNormQuantity } from '@/domain/materials';
import { activeProducts } from '@/domain/products';
import { MATERIALS_NORMS_TITLE } from '@/features/materials/paths';
import { QuantityCell } from '@/features/materials/QuantityCell';
import { MATERIAL_NORM_ERROR } from '@/features/materials/text';
import { useMaterials } from '@/features/materials/use-materials';
import { PageFrame } from '@/features/shell/PageFrame';
import {
  cellKindClassName,
  columnHeadingClassName,
  entityNameRowClassName,
  nameHeadingClassName,
  stickyHeadClassName,
  tableBorder,
  tableClassName,
  tableFrameClassName,
} from '@/features/table';

export function MaterialsNormsScreen() {
  const materials = useMaterials();
  const products = activeProducts(materials.document);
  return (
    <PageFrame
      title={MATERIALS_NORMS_TITLE}
      full
      lede="Сколько упаковки и вспомогательных материалов этот склад расходует на одну штуку продукции. Выпуск общий, норму ставят на склад, который материал тратит. Пустая клетка — нормы нет. Расход в отчёте пока считается из рецептов, не из этих норм."
    >
      <div className="flex flex-col gap-8">
        {MATERIAL_WAREHOUSES.map((warehouse) => {
          const rows = activeMaterials(materials.document, warehouse.id).filter(
            (item) => item.groupId === NORMED_MATERIAL_GROUP_ID,
          );
          return (
            <section key={warehouse.id} className="flex flex-col gap-2">
              <h2 className="text-sm text-ink">{warehouse.name}</h2>
              {rows.length === 0 ? (
                <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
                  В этой группе позиций нет. Добавьте наименование во вводе плана.
                </p>
              ) : (
                <div className={tableFrameClassName}>
                  <table className={tableClassName}>
                    <caption className="sr-only">Нормы {warehouse.name}</caption>
                    <thead className={stickyHeadClassName}>
                      <tr>
                        <th scope="col" className={`sticky left-0 z-40 ${nameHeadingClassName}`}>
                          Наименование
                        </th>
                        {products.map((product) => (
                          <th
                            key={product.id}
                            scope="col"
                            className={`${columnHeadingClassName} ${tableBorder.rightThin}`}
                          >
                            {product.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((material) => (
                        <tr key={material.id}>
                          <th scope="row" className={entityNameRowClassName('repeated')}>
                            {material.name}
                            <span className="text-muted"> · {material.unit}/шт</span>
                          </th>
                          {products.map((product) => {
                            const quantity = materialNormQuantity(
                              materials.document,
                              warehouse.id,
                              material.id,
                              product.id,
                            );
                            return (
                              <td
                                key={product.id}
                                className={`border-b border-b-line px-2 py-2 text-right ${tableBorder.rightThin} ${cellKindClassName.assigned}`}
                              >
                                <NormCell
                                  label={`Норма ${material.name} на ${product.name}, ${warehouse.name}`}
                                  quantity={quantity}
                                  unit={material.unit}
                                  onCommit={(value) => {
                                    const rejection = materials.setNorm(
                                      warehouse.id,
                                      material.id,
                                      product.id,
                                      value,
                                      value === null ? new Date().toISOString() : null,
                                    );
                                    return rejection ? MATERIAL_NORM_ERROR[rejection] : null;
                                  }}
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </PageFrame>
  );
}

function NormCell({
  label,
  quantity,
  unit,
  onCommit,
}: {
  label: string;
  quantity: number | null;
  unit: string;
  onCommit: (value: number | null) => string | null;
}) {
  return (
    <QuantityCell
      label={label}
      value={quantity ?? 0}
      unit={unit}
      blankIfZero
      onChange={(value) => onCommit(value === 0 ? null : value)}
    />
  );
}
