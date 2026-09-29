"use client";

import { PlaceBoard } from "@/features/directory/place-board";
import type { PlaceKind } from "@/features/directory/place-paths";
import { usePlaces } from "@/features/directory/use-places";
import { PageFrame } from "@/features/shell/page-frame";

export function PlacesScreen({
  kind,
  showDeleted,
}: {
  kind: PlaceKind;
  showDeleted: boolean;
}) {
  const places = usePlaces(kind);
  const lede =
    kind === "workshops"
      ? "Здесь производят производные и товары. Один товар или производная — в одном цехе."
      : "Здесь хранят сырьё, производные и товары. У каждой позиции один склад.";

  return (
    <PageFrame title="Цеха и склады" lede={lede}>
      <PlaceBoard
        kind={kind}
        showDeleted={showDeleted}
        items={showDeleted ? places.deleted : places.active}
        deletedCount={places.deleted.length}
        disabled={!places.hydrated}
        onAdd={places.add}
        onDelete={places.remove}
        onRestore={places.restore}
      />
    </PageFrame>
  );
}
