"use client";

import { MaterialBoard } from "@/features/materials/material-board";
import { MATERIALS_SECTION_TITLE, type MaterialKind } from "@/features/materials/paths";
import { PageFrame } from "@/features/shell/page-frame";

export function MaterialsScreen({
  kind,
  showDeleted,
}: {
  kind: MaterialKind;
  showDeleted: boolean;
}) {
  const lede =
    kind === "materials"
      ? "Закупочная цена, НДС и нормативный остаток. Цена без НДС считается сама."
      : kind === "products"
        ? "Конечный товар со ставкой НДС для выручки. Себестоимость 1 шт считается из состава на партию карты."
        : "Рецептурная карта на партию готового продукта. Выход после обработки задаёт, сколько сырья для этого нужно.";

  return (
    <PageFrame title={MATERIALS_SECTION_TITLE} lede={lede} wide ledeFull>
      <MaterialBoard kind={kind} showDeleted={showDeleted} />
    </PageFrame>
  );
}
