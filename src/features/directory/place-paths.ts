export type PlaceKind = "workshops" | "warehouses";

export function placeListHref(kind: PlaceKind, showDeleted: boolean): string {
  const params = new URLSearchParams();
  if (kind === "warehouses") {
    params.set("tab", "warehouses");
  }
  if (showDeleted) {
    params.set("deleted", "1");
  }

  const query = params.toString();
  return query ? `/places?${query}` : "/places";
}

export function placeDetailHref(kind: PlaceKind, id: string): string {
  const segment = kind === "workshops" ? "workshops" : "warehouses";
  return `/places/${segment}/${encodeURIComponent(id)}`;
}
