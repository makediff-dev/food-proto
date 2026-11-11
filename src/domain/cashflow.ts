import { type CreditCreditorRowView, creditResourcesMonthView } from '@/domain/credit-resources';
import { MATERIAL_GROUPS, type PrototypeDocument } from '@/domain/document';
import { HR_TAX_RATE_SCALE, hrTaxRatesOrDefault } from '@/domain/hr';
import { materialMovementMonth } from '@/domain/materials';
import { amountWithVat } from '@/domain/money';
import { operatingExpenseMonthView } from '@/domain/operating-expense';
import { propertyTaxForMonth } from '@/domain/property-tax';
import { shiftMonth } from '@/domain/sales-plan';
import { monthSummary } from '@/domain/summary';
import { vatReportMonthView } from '@/domain/vat-report';

const CHAIN_START = '2000-01';

export interface CashflowMoneySide {
  plan: number;
  fact: number;
  variance: number;
}

export interface CashflowLineView {
  id: string;
  name: string;
  amounts: CashflowMoneySide;
  children?: CashflowLineView[];
}

export interface CashflowMonthView {
  month: string;
  opening: CashflowMoneySide;
  income: CashflowLineView;
  expense: CashflowLineView;
  closing: CashflowMoneySide;
}

function side(plan: number, fact: number): CashflowMoneySide {
  return { plan, fact, variance: fact - plan };
}

function sumChildren(children: readonly CashflowLineView[]): CashflowMoneySide {
  return children.reduce(
    (total, child) => side(total.plan + child.amounts.plan, total.fact + child.amounts.fact),
    side(0, 0),
  );
}

function line(id: string, name: string, plan: number, fact: number, children?: CashflowLineView[]): CashflowLineView {
  const amounts = children && children.length > 0 ? sumChildren(children) : side(plan, fact);
  return { id, name, amounts, children };
}

function revenueSide(document: PrototypeDocument, month: string): CashflowMoneySide {
  const summary = monthSummary(document, month);
  return side(summary.headline.plan.revenueWithVat ?? 0, summary.headline.fact.revenueWithVat ?? 0);
}

function materialsBlock(
  document: PrototypeDocument,
  month: string,
  groupIds: readonly (typeof MATERIAL_GROUPS)[number]['id'][],
  id: string,
  name: string,
): CashflowLineView {
  const movement = materialMovementMonth(document, month);
  const children: CashflowLineView[] = [];
  for (const groupId of groupIds) {
    const group = movement.groups.find((item) => item.groupId === groupId);
    if (!group) {
      continue;
    }
    for (const warehouse of group.warehouses) {
      children.push(
        line(
          `${id}:${groupId}:${warehouse.warehouseId}`,
          `${group.name} · ${warehouse.name}`,
          warehouse.totals.planConsumptionCost.withVat,
          warehouse.totals.factReceiptCost.withVat,
        ),
      );
    }
  }
  return line(id, name, 0, 0, children);
}

function opexViewForMonth(document: PrototypeDocument, month: string) {
  const summary = monthSummary(document, month);
  return operatingExpenseMonthView(
    document,
    month,
    summary.headline.plan.revenueWithVat ?? 0,
    summary.factTotals.revenueExVat ?? 0,
  );
}

/** В ДДС суммы с НДС: аутсорс поднимают ставкой «НДС аутсорса», остальные opex без НДС. */
function cashflowOpexAmount(lineId: string, amountExVat: number, vatHundredths: number): number {
  if (lineId !== 'outsourcing') {
    return amountExVat;
  }
  return amountWithVat(amountExVat, vatHundredths / HR_TAX_RATE_SCALE) ?? amountExVat;
}

function outsourcingVatHundredths(document: PrototypeDocument, month: string, sideName: 'plan' | 'fact'): number {
  const rates = hrTaxRatesOrDefault(document, month);
  return sideName === 'plan' ? rates.planOutsourcingVatHundredths : rates.factOutsourcingVatHundredths;
}

function opexBlock(document: PrototypeDocument, month: string): CashflowLineView {
  const opex = opexViewForMonth(document, month);
  const previousMonth = shiftMonth(month, -1);
  const previousOpex = previousMonth >= CHAIN_START ? opexViewForMonth(document, previousMonth) : null;
  const planVatMonth = previousMonth >= CHAIN_START ? previousMonth : month;
  const currentFactVat = outsourcingVatHundredths(document, month, 'fact');
  const currentPlanVat = outsourcingVatHundredths(document, month, 'plan');
  const previousPlanVat = outsourcingVatHundredths(document, planVatMonth, 'plan');

  const children = opex.groups.map((group) => {
    const previousGroup =
      group.code === '1' ? previousOpex?.groups.find((item) => item.code === group.code) : undefined;
    const lineChildren = group.lines.map((item) => {
      const previousLine = previousGroup?.lines.find((lineItem) => lineItem.id === item.id);
      const planExVat = group.code === '1' ? (previousLine?.planExVat ?? 0) : item.planExVat;
      const planVat = group.code === '1' ? previousPlanVat : currentPlanVat;
      const plan = cashflowOpexAmount(item.id, planExVat, planVat);
      const fact = cashflowOpexAmount(item.id, item.factExVat, currentFactVat);
      return line(`opex:${group.code}:${item.id}`, `${item.code} ${item.name}`, plan, fact);
    });
    // Итог группы — сумма строк (с НДС у аутсорса), а не сырой ExVat из opex.
    return line(`opex-group:${group.code}`, group.name, 0, 0, lineChildren);
  });
  return line('opex', 'Операционные расходы', 0, 0, children);
}

function taxBlock(document: PrototypeDocument, month: string): CashflowLineView {
  const summary = monthSummary(document, month);
  const planTax = Math.max(0, summary.headline.plan.profitTax ?? 0);
  const factTax = Math.max(0, summary.headline.fact.profitTax ?? 0);
  const propertyTax = propertyTaxForMonth(document, month);
  // Оплата или возврат: CashFlow!C141 «НДС», план E141 = TAX!D24, факт — TAX!E24.
  // Отрицательное — к возмещению и уменьшает расходы, остаток денег растёт.
  const vat = vatReportMonthView(document, month).payable;
  return line('tax', 'Налоговые платежи (кроме зарплатных налогов)', 0, 0, [
    line('tax:vat', 'НДС', vat.plan, vat.fact),
    line('tax:profit', 'Налог на прибыль', planTax, factTax),
    line('tax:property', 'Налог на имущество', propertyTax.plan, propertyTax.fact),
  ]);
}

function creditIncomeLines(rows: readonly CreditCreditorRowView[]): CashflowLineView[] {
  return rows.map((row) => line(`credit-in:${row.creditorId}`, row.name, row.planReceived, row.factReceived));
}

function creditExpenseLines(rows: readonly CreditCreditorRowView[]): CashflowLineView[] {
  return rows.flatMap((row) => [
    line(`credit-repay:${row.creditorId}`, `Погашение · ${row.name}`, row.planRepaid, row.factRepaid),
    line(`credit-interest:${row.creditorId}`, `Проценты · ${row.name}`, row.planInterest, row.factInterest),
  ]);
}

function monthNetCashflow(document: PrototypeDocument, month: string): CashflowMoneySide {
  const view = buildCashflowBody(document, month, side(0, 0));
  return side(
    view.income.amounts.plan - view.expense.amounts.plan,
    view.income.amounts.fact - view.expense.amounts.fact,
  );
}

function earliestCashflowMonth(document: PrototypeDocument, month: string): string {
  let earliest = month;
  const consider = (value: string) => {
    if (value >= CHAIN_START && value < earliest) {
      earliest = value;
    }
  };
  for (const item of document.salesPlans) {
    consider(item.month);
  }
  for (const item of document.opexMonthLines) {
    consider(item.month);
  }
  for (const item of document.opexDayFacts ?? []) {
    consider(item.occurredOn.slice(0, 7));
  }
  for (const item of document.creditResourceMonths ?? []) {
    consider(item.month);
  }
  for (const item of document.propertyTaxMonths ?? []) {
    consider(item.month);
  }
  for (const item of document.materialMonthPlans ?? []) {
    consider(item.month);
  }
  for (const item of document.hrMonthPlans ?? []) {
    consider(item.month);
  }
  return earliest;
}

/**
 * Остаток денег на начало: Σ(доходы − расходы) до месяца.
 * Старт учёта всегда 0; дальше кредиты, продажи и расходы, включая НДС к уплате или возврат.
 * Цепочку начинают с самого раннего месяца с данными в документе.
 */
export function openingCashBalance(document: PrototypeDocument, month: string): CashflowMoneySide {
  const start = earliestCashflowMonth(document, month);
  let fact = 0;
  let plan = 0;
  let cursor = start;
  while (cursor < month) {
    const net = monthNetCashflow(document, cursor);
    fact += net.fact;
    plan += net.plan;
    cursor = shiftMonth(cursor, 1);
  }
  return side(plan, fact);
}

function buildCashflowBody(
  document: PrototypeDocument,
  month: string,
  opening: CashflowMoneySide,
): Omit<CashflowMonthView, 'month' | 'opening' | 'closing'> & { closing: CashflowMoneySide } {
  const credit = creditResourcesMonthView(document, month);
  const revenue = revenueSide(document, month);
  const incomeChildren = [
    line('revenue', 'Выручка от реализации', revenue.plan, revenue.fact),
    line('credit-in', 'Кредиты и займы', 0, 0, creditIncomeLines(credit.rows)),
  ];
  const expenseChildren = [
    materialsBlock(
      document,
      month,
      MATERIAL_GROUPS.map((group) => group.id),
      'materials',
      'Сырьё и упаковочные материалы',
    ),
    opexBlock(document, month),
    taxBlock(document, month),
    line('credit-out', 'Кредиты и займы', 0, 0, creditExpenseLines(credit.rows)),
  ];
  const income = line('income', 'Доходы', 0, 0, incomeChildren);
  const expense = line('expense', 'Расходы', 0, 0, expenseChildren);
  const closing = side(
    opening.plan + income.amounts.plan - expense.amounts.plan,
    opening.fact + income.amounts.fact - expense.amounts.fact,
  );
  return { income, expense, closing };
}

/** ДДС месяца: остаток, доходы, расходы и остаток на конец. Суммы — с НДС там, где источник с НДС. */
export function cashflowMonthView(document: PrototypeDocument, month: string): CashflowMonthView {
  const opening = openingCashBalance(document, month);
  const body = buildCashflowBody(document, month, opening);
  return {
    month,
    opening,
    income: body.income,
    expense: body.expense,
    closing: body.closing,
  };
}
