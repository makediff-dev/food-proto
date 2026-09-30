export function parseSummaryQuery(params: {
  month?: string;
  deleted?: string;
  plan?: string;
}): {
  month: string;
  showDeleted: boolean;
  planId: string;
} {
  return {
    month: params.month ?? "",
    showDeleted: params.deleted === "1",
    planId: params.plan ?? "",
  };
}

export function summaryHref(
  options: {
    month?: string;
    currentMonth?: string;
    showDeleted?: boolean;
    planId?: string;
  } = {},
): string {
  if (options.showDeleted && !options.planId) {
    return "/?deleted=1";
  }

  const params = new URLSearchParams();
  if (options.showDeleted && options.planId) {
    params.set("deleted", "1");
    params.set("plan", options.planId);
  }
  if (options.month && options.currentMonth && options.month !== options.currentMonth) {
    params.set("month", options.month);
  }

  const query = params.toString();
  return query ? `/?${query}` : "/";
}

export function planHref(id: string): string {
  return `/plans/${encodeURIComponent(id)}`;
}
