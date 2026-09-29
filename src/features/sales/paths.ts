export function summaryHref(showDeleted = false): string {
  return showDeleted ? "/?deleted=1" : "/";
}

export function planHref(id: string): string {
  return `/plans/${encodeURIComponent(id)}`;
}
