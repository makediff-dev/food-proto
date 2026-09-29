export type MaterialKind = "materials" | "derivatives" | "products";

export const MATERIALS_SECTION_TITLE = "Сырьё, производные, товары";

export function materialListHref(kind: MaterialKind, showDeleted: boolean): string {
  const params = new URLSearchParams();
  if (kind === "derivatives") {
    params.set("tab", "derivatives");
  }
  if (kind === "products") {
    params.set("tab", "products");
  }
  if (showDeleted) {
    params.set("deleted", "1");
  }

  const query = params.toString();
  return query ? `/materials?${query}` : "/materials";
}

export function materialDetailHref(id: string): string {
  return `/materials/raw/${encodeURIComponent(id)}`;
}

export function derivativeDetailHref(id: string): string {
  return `/materials/derivatives/${encodeURIComponent(id)}`;
}
