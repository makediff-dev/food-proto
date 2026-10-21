import type { ReactNode } from 'react';

import type { MaterialGroupMovement } from '@/domain/materials';

export function MaterialsWarehouseBlocks({
  groups,
  renderWarehouse,
  renderHeadingExtra,
}: {
  groups: MaterialGroupMovement[];
  renderWarehouse: (group: MaterialGroupMovement, warehouse: MaterialGroupMovement['warehouses'][number]) => ReactNode;
  renderHeadingExtra?: (group: MaterialGroupMovement) => ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <section key={group.groupId} className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-figure text-xl leading-tight text-ink">{group.name}</h2>
            {renderHeadingExtra ? renderHeadingExtra(group) : null}
          </div>
          {group.warehouses.map((warehouse) => (
            <section key={warehouse.warehouseId} className="flex flex-col gap-2">
              <h3 className="text-sm text-ink">{warehouse.name}</h3>
              {warehouse.rows.length === 0 ? (
                <p className="border border-line bg-sheet px-4 py-4 text-sm leading-6 text-muted">
                  В этой группе позиций нет. Добавьте наименование во вводе плана.
                </p>
              ) : (
                renderWarehouse(group, warehouse)
              )}
            </section>
          ))}
        </section>
      ))}
    </div>
  );
}
