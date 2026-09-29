export type ProductionView = "plan" | "fact";

export type ProductionPart = "output" | "input";

export type ProductionSheet = "journal" | "compare";

export const PRODUCTION_SECTION_TITLE = "Производство";

export function parseProductionQuery(params: {
  view?: string;
  part?: string;
  month?: string;
  sheet?: string;
  deleted?: string;
}): {
  view: ProductionView;
  part: ProductionPart;
  month: string;
  sheet: ProductionSheet;
  showDeleted: boolean;
} {
  const view: ProductionView = params.view === "fact" ? "fact" : "plan";
  const sheet: ProductionSheet = params.sheet === "compare" ? "compare" : "journal";

  return {
    view,
    part: params.part === "input" ? "input" : "output",
    month: params.month ?? "",
    sheet,
    showDeleted: view === "fact" && sheet === "journal" && params.deleted === "1",
  };
}

export function productionHref(
  view: ProductionView,
  part: ProductionPart,
  month: string,
  currentMonth: string,
  options?: { sheet?: ProductionSheet; showDeleted?: boolean },
): string {
  const params = new URLSearchParams();
  const sheet = options?.sheet ?? "journal";
  const showDeleted = options?.showDeleted ?? false;

  if (view === "fact") {
    params.set("view", "fact");
  }
  if (view === "fact" && sheet === "compare") {
    params.set("sheet", "compare");
  }
  if (part === "input" && (view === "plan" || sheet === "compare")) {
    params.set("part", "input");
  }
  if (view === "fact" && sheet === "journal" && showDeleted) {
    params.set("deleted", "1");
  }
  if (month && month !== currentMonth) {
    params.set("month", month);
  }

  const query = params.toString();
  return query ? `/production?${query}` : "/production";
}

export function factHref(id: string): string {
  return `/production/facts/${encodeURIComponent(id)}`;
}
