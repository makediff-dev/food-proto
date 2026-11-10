import type { PrototypeDocument } from '@/domain/document';
import { materialMovementMonth } from '@/domain/materials';
import { monthSummary } from '@/domain/summary';

export interface VatMoneySide {
  plan: number;
  fact: number;
  variance: number;
}

export interface VatReportLine {
  id: string;
  name: string;
  amounts: VatMoneySide;
  children?: VatReportLine[];
}

export interface VatReportMonthView {
  month: string;
  /** НДС в выручке: с НДС − без НДС. */
  sales: VatReportLine;
  /** НДС в приходе сырья: с НДС − без НДС. */
  materials: VatReportLine;
  /** С продаж − с сырья; отрицательное — к возмещению. */
  payable: VatMoneySide;
}

function side(plan: number, fact: number): VatMoneySide {
  return { plan, fact, variance: fact - plan };
}

function vatOf(withVat: number, exVat: number): number {
  return withVat - exVat;
}

function sumChildren(children: readonly VatReportLine[]): VatMoneySide {
  return children.reduce(
    (total, child) => side(total.plan + child.amounts.plan, total.fact + child.amounts.fact),
    side(0, 0),
  );
}

function line(id: string, name: string, plan: number, fact: number, children?: VatReportLine[]): VatReportLine {
  const amounts = children && children.length > 0 ? sumChildren(children) : side(plan, fact);
  return { id, name, amounts, children };
}

/**
 * НДС месяца: начисленный с продаж, к вычету с прихода сырья, к уплате = разница.
 * Ориентир — лист `TAX`. База сырья — план и факт прихода (не расход в производство).
 */
export function vatReportMonthView(document: PrototypeDocument, month: string): VatReportMonthView {
  const summary = monthSummary(document, month);
  // Верхний блок свода держит только выручку с НДС; долю НДС берут из итогов строк.
  const salesPlan = vatOf(summary.planTotalsSide?.revenueWithVat ?? 0, summary.planTotalsSide?.revenueExVat ?? 0);
  const salesFact = vatOf(summary.factTotals.revenueWithVat ?? 0, summary.factTotals.revenueExVat ?? 0);
  const sales = line('sales', 'НДС с продаж', salesPlan, salesFact);

  const movement = materialMovementMonth(document, month);
  const materialChildren: VatReportLine[] = [];
  for (const group of movement.groups) {
    for (const warehouse of group.warehouses) {
      materialChildren.push(
        line(
          `materials:${group.groupId}:${warehouse.warehouseId}`,
          `${group.name} · ${warehouse.name}`,
          vatOf(warehouse.totals.planReceiptCost.withVat, warehouse.totals.planReceiptCost.exVat),
          vatOf(warehouse.totals.factReceiptCost.withVat, warehouse.totals.factReceiptCost.exVat),
        ),
      );
    }
  }
  const materials = line('materials', 'НДС с сырья', 0, 0, materialChildren);

  return {
    month,
    sales,
    materials,
    payable: side(sales.amounts.plan - materials.amounts.plan, sales.amounts.fact - materials.amounts.fact),
  };
}
