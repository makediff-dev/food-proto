export function parseSummaryQuery(params: { month?: string }): {
  month: string;
} {
  return {
    month: params.month ?? "",
  };
}

export function summaryHref(
  options: {
    month?: string;
    currentMonth?: string;
  } = {},
): string {
  const params = new URLSearchParams();
  if (options.month && options.currentMonth && options.month !== options.currentMonth) {
    params.set("month", options.month);
  }

  const query = params.toString();
  return query ? `/?${query}` : "/";
}

export function planHref(id: string): string {
  return `/plans/${encodeURIComponent(id)}`;
}
