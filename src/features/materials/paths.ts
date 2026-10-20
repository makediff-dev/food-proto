export const MATERIALS_SECTION_TITLE = 'Сырьё и материалы';

export const MATERIALS_SUMMARY_TITLE = 'Отчет общий';

export const MATERIALS_PLAN_TITLE = 'Ввод плана';

export const MATERIALS_INVENTORY_TITLE = 'Инвентаризация';

export const MATERIALS_RECEIPTS_TITLE = 'Приход от поставщика';

export const MATERIALS_ISSUES_TITLE = 'Расход в производстве';

export const MATERIALS_NORMS_TITLE = 'Нормы расхода';

export const NEW_MATERIAL_RECEIPT_TITLE = 'Новый приход';

export const NEW_MATERIAL_ISSUE_TITLE = 'Новый расход';

export function parseMaterialMonthQuery(params: { month?: string }): { month: string } {
  return { month: params.month ?? '' };
}

function monthHref(path: string, month: string, currentMonth: string): string {
  if (!month || month === currentMonth) {
    return path;
  }
  return `${path}?month=${month}`;
}

export function materialsSummaryHref(options: { month: string; currentMonth: string }): string {
  return monthHref('/materials', options.month, options.currentMonth);
}

export function materialsPlanHref(options: { month: string; currentMonth: string }): string {
  return monthHref('/materials/plan', options.month, options.currentMonth);
}

export function materialsInventoryHref(options: { month: string; currentMonth: string }): string {
  return monthHref('/materials/inventory', options.month, options.currentMonth);
}

export function materialsReceiptsHref(options: { month: string; currentMonth: string }): string {
  return monthHref('/materials/receipts', options.month, options.currentMonth);
}

export function materialsIssuesHref(options: { month: string; currentMonth: string }): string {
  return monthHref('/materials/issues', options.month, options.currentMonth);
}

export function materialReceiptHref(id: string): string {
  return `/materials/receipts/${id}`;
}

export function materialReceiptNewHref(): string {
  return '/materials/receipts/new';
}

export function materialIssueHref(id: string): string {
  return `/materials/issues/${id}`;
}

export function materialIssueNewHref(): string {
  return '/materials/issues/new';
}

export function materialsNormsHref(): string {
  return '/materials/norms';
}
