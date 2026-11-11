import type { PrototypeDocument } from '@/domain/document';
import { hrMonthView } from '@/domain/hr';
import { materialMovementMonth } from '@/domain/materials';
import { ratioRound } from '@/domain/money';
import { operatingExpenseMonthView } from '@/domain/operating-expense';
import { propertyTaxForMonth } from '@/domain/property-tax';
import { monthSummary } from '@/domain/summary';
import { transportMonthView } from '@/domain/transport';

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
  /** НДС в выручке: с НДС − без НДС. `TAX!D7` / `E7`. */
  sales: VatReportLine;
  /**
   * НДС к зачету. `TAX!D8` / `E8` = сумма строк сырья, аутсорса и категорий расходов.
   */
  deductible: VatReportLine;
  /** С продаж − к зачету; отрицательное — к возмещению. `TAX!D24` / `E24`. */
  payable: VatMoneySide;
  /** НДФЛ, соцстрах, травматизм. `TAX!D26` / `E26`, без пустой строки `HR!89`. */
  payroll: VatReportLine;
  /** Как на своде: не ниже 0. `TAX!D31` / `E31` → `Svod!G6` / `I6`. */
  profit: VatReportLine;
  /** Ввод бухгалтерии. `TAX` строка 33, в книге без формулы. */
  property: VatReportLine;
  /** НДС к уплате + зарплатные + прибыль + имущество. `TAX!D35` / `E35`. */
  total: VatMoneySide;
}

function side(plan: number, fact: number): VatMoneySide {
  return { plan, fact, variance: fact - plan };
}

function vatOf(withVat: number, exVat: number): number {
  return withVat - exVat;
}

/** НДС статьи расхода: база без НДС × ставка / 100. `Operation Expense!A` = `D * E / 100`. */
function vatOnExVat(amountExVat: number, vatPercent: number): number {
  return ratioRound(amountExVat * vatPercent, 100) ?? 0;
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

function add(left: VatMoneySide, right: VatMoneySide): VatMoneySide {
  return side(left.plan + right.plan, left.fact + right.fact);
}

/**
 * Налоги месяца по листу `TAX`.
 * Сырьё — НДС прихода (не расхода в производство).
 * Статьи расходов — ставка `vatPercent` × сумма без НДС.
 * Аутсорсинг — уже посчитанный «НДС аутсорса» из HR (план и факт; в книге план пустой).
 * Наёмный транспорт (доставка готовой и сырья) — та же формула по ставке контрагента.
 * Топливо своего парка — стоимость без НДС × ставка автомобиля / 100.
 * Обе суммы входят в «Транспортные расходы».
 * Зарплатные налоги — суммы HR, без НДС аутсорса.
 */
export function vatReportMonthView(document: PrototypeDocument, month: string): VatReportMonthView {
  const summary = monthSummary(document, month);
  const salesPlan = vatOf(summary.planTotalsSide?.revenueWithVat ?? 0, summary.planTotalsSide?.revenueExVat ?? 0);
  const salesFact = vatOf(summary.factTotals.revenueWithVat ?? 0, summary.factTotals.revenueExVat ?? 0);
  const sales = line('sales', 'НДС с продаж', salesPlan, salesFact);

  const deductibleChildren = [
    ...materialDeductibleLines(document, month),
    outsourcingDeductibleLine(document, month),
    ...expenseDeductibleLines(document, month, summary.headline.plan.revenueWithVat ?? 0),
  ];
  const deductible = line('deductible', 'НДС к зачету', 0, 0, deductibleChildren);

  const payable = side(sales.amounts.plan - deductible.amounts.plan, sales.amounts.fact - deductible.amounts.fact);
  const payroll = payrollLine(document, month);
  const profitTaxPlan = Math.max(0, summary.headline.plan.profitTax ?? 0);
  const profitTaxFact = Math.max(0, summary.headline.fact.profitTax ?? 0);
  const profit = line('profit', 'Налог на прибыль', profitTaxPlan, profitTaxFact);
  const propertyTax = propertyTaxForMonth(document, month);
  const property = line('property', 'Налог на имущество', propertyTax.plan, propertyTax.fact);
  const total = add(add(payable, payroll.amounts), add(profit.amounts, property.amounts));

  return { month, sales, deductible, payable, payroll, profit, property, total };
}

function materialDeductibleLines(document: PrototypeDocument, month: string): VatReportLine[] {
  const movement = materialMovementMonth(document, month);
  return movement.groups.map((group) => {
    const warehouses = group.warehouses.map((warehouse) =>
      line(
        `deductible:materials:${group.groupId}:${warehouse.warehouseId}`,
        warehouse.name,
        vatOf(warehouse.totals.planReceiptCost.withVat, warehouse.totals.planReceiptCost.exVat),
        vatOf(warehouse.totals.factReceiptCost.withVat, warehouse.totals.factReceiptCost.exVat),
      ),
    );
    const amounts = sumChildren(warehouses);
    return line(`deductible:materials:${group.groupId}`, group.name, amounts.plan, amounts.fact);
  });
}

function outsourcingDeductibleLine(document: PrototypeDocument, month: string): VatReportLine {
  const tax = hrMonthView(document, month).taxes.find((item) => item.id === 'outsourcing-vat');
  return line('deductible:outsourcing', 'Аутсорсинг персонала', tax?.planAmountExVat ?? 0, tax?.factAmountExVat ?? 0);
}

/**
 * Свои статьи фонда оплаты — сразу после аутсорса.
 * Дальше порядок `TAX!C14:C20`: транспорт, группы 2–6, ремонт.
 */
const DEDUCTIBLE_GROUP_ORDER = ['1', '7', '2', '3', '4', '5', '6', '8'] as const;

function expenseDeductibleLines(document: PrototypeDocument, month: string, revenueWithVat: number): VatReportLine[] {
  const opex = operatingExpenseMonthView(document, month, revenueWithVat, 0);
  const byCode = new Map(opex.groups.map((group) => [group.code, group]));
  const lines: VatReportLine[] = [];
  for (const code of DEDUCTIBLE_GROUP_ORDER) {
    const group = byCode.get(code);
    if (!group) {
      continue;
    }
    const articles = group.lines
      .filter((item) => item.kind === 'editable')
      .map((item) => {
        const rate = document.opexOtherLines.find((source) => source.id === item.id)?.vatPercent ?? 0;
        const name = item.deleted ? `${item.code} ${item.name} (архив)` : `${item.code} ${item.name}`;
        return line(
          `deductible:opex:${group.code}:${item.id}`,
          name,
          vatOnExVat(item.planExVat, rate),
          vatOnExVat(item.factExVat, rate),
        );
      });
    // В фонде оплаты зачет даёт аутсорсинг (отдельная строка). Свои статьи справочника — одной суммой.
    if (group.code === '1' && articles.length === 0) {
      continue;
    }
    const articleAmounts = articles.length > 0 ? sumChildren(articles) : side(0, 0);
    const amounts = group.code === '7' ? add(articleAmounts, transportExpenseVat(document, month)) : articleAmounts;
    lines.push(line(`deductible:opex:${group.code}`, group.name, amounts.plan, amounts.fact));
  }
  return lines;
}

/** НДС наёмного: база без НДС × ставка контрагента / 100. */
function hireTransportVat(document: PrototypeDocument, month: string): VatMoneySide {
  let plan = 0;
  let fact = 0;
  for (const block of transportMonthView(document, month).hire) {
    for (const carrier of block.carriers) {
      plan += vatOnExVat(carrier.planAmountExVat, carrier.vatPercent);
      fact += vatOnExVat(carrier.factAmountExVat, carrier.vatPercent);
    }
  }
  return side(plan, fact);
}

/** НДС топлива: стоимость без НДС × ставка автомобиля / 100. План и факт. */
function ownFuelVat(document: PrototypeDocument, month: string): VatMoneySide {
  let plan = 0;
  let fact = 0;
  for (const vehicle of transportMonthView(document, month).own) {
    plan += vatOnExVat(vehicle.planAmountExVat, vehicle.fuelVatPercent);
    fact += vatOnExVat(vehicle.factAmountExVat, vehicle.fuelVatPercent);
  }
  return side(plan, fact);
}

/** Наёмный и топливо своего парка — одна строка «Транспортные расходы». */
function transportExpenseVat(document: PrototypeDocument, month: string): VatMoneySide {
  return add(hireTransportVat(document, month), ownFuelVat(document, month));
}

function payrollLine(document: PrototypeDocument, month: string): VatReportLine {
  const children = hrMonthView(document, month)
    .taxes.filter((item) => item.id !== 'outsourcing-vat')
    .map((item) => line(`payroll:${item.id}`, item.name, item.planAmountExVat, item.factAmountExVat));
  return line('payroll', 'Зарплатные налоги', 0, 0, children);
}
