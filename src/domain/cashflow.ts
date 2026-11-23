import {
  type CreditCreditorRowView,
  creditResourceDaysList,
  creditResourcesMonthView,
} from '@/domain/credit-resources';
import {
  isHrShopDepartmentId,
  MATERIAL_GROUPS,
  type MaterialGroupId,
  type MaterialWarehouseId,
  type PrototypeDocument,
} from '@/domain/document';
import {
  hrMonthPlan,
  outsourcingAmountExVat,
  outsourcingMonthAmountsWithVat,
  outsourcingPlanVatPercent,
} from '@/domain/hr';
import { materialById, materialMovementMonth, materialReceiptsList } from '@/domain/materials';
import { amountWithVat, ratioRound } from '@/domain/money';
import { operatingExpenseMonthView } from '@/domain/operating-expense';
import { propertyTaxForMonth } from '@/domain/property-tax';
import { QUANTITY_SCALE } from '@/domain/quantity';
import { workingSales } from '@/domain/sales';
import { monthDates } from '@/domain/sales-fact';
import { shiftMonth } from '@/domain/sales-plan';
import { monthSummary } from '@/domain/summary';
import { taxPaymentForDay, taxPaymentMonthTotal } from '@/domain/tax-payment';
import { ownDayFuelAmountExVat, ownDayKmThousandths, transportOwnPlan } from '@/domain/transport';
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
  /** Факт по дням месяца (копейки): доходы и расходы. У групп — сумма детей. */
  dayFacts: readonly number[];
  children?: CashflowLineView[];
}

export interface CashflowMonthView {
  month: string;
  /** Календарные дни месяца `ГГГГ-ММ-ДД` — колонки факта доходов, расходов и остатков справа. */
  days: readonly string[];
  opening: CashflowMoneySide;
  /**
   * Остаток факта на начало каждого дня: день 1 = остаток на начало месяца,
   * дальше = остаток на конец предыдущего дня.
   */
  openingDayFacts: readonly number[];
  income: CashflowLineView;
  expense: CashflowLineView;
  closing: CashflowMoneySide;
  /** Остаток факта на конец каждого дня = начало дня + доходы дня − расходы дня. */
  closingDayFacts: readonly number[];
}

function side(plan: number, fact: number): CashflowMoneySide {
  return { plan, fact, variance: fact - plan };
}

function emptyDayFacts(dayCount: number): number[] {
  return Array.from({ length: dayCount }, () => 0);
}

function sumDayFacts(vectors: readonly (readonly number[])[]): number[] {
  if (vectors.length === 0) {
    return [];
  }
  const first = vectors[0];
  if (!first) {
    return [];
  }
  const total = [...first];
  for (let index = 1; index < vectors.length; index += 1) {
    const vector = vectors[index];
    if (!vector) {
      continue;
    }
    for (let day = 0; day < total.length; day += 1) {
      total[day] = (total[day] ?? 0) + (vector[day] ?? 0);
    }
  }
  return total;
}

function sumChildren(children: readonly CashflowLineView[]): CashflowMoneySide {
  return children.reduce(
    (total, child) => side(total.plan + child.amounts.plan, total.fact + child.amounts.fact),
    side(0, 0),
  );
}

function line(
  id: string,
  name: string,
  plan: number,
  fact: number,
  dayFacts: readonly number[],
  children?: CashflowLineView[],
): CashflowLineView {
  const amounts = children && children.length > 0 ? sumChildren(children) : side(plan, fact);
  const days = children && children.length > 0 ? sumDayFacts(children.map((child) => child.dayFacts)) : dayFacts;
  return { id, name, amounts, dayFacts: days, children };
}

function dayIndexMap(days: readonly string[]): Map<string, number> {
  return new Map(days.map((day, index) => [day, index]));
}

function materialReceiptDayFacts(
  document: PrototypeDocument,
  days: readonly string[],
  groupId: MaterialGroupId,
  warehouseId: MaterialWarehouseId,
): number[] {
  const result = emptyDayFacts(days.length);
  if (days.length === 0) {
    return result;
  }
  const indexByDay = dayIndexMap(days);
  for (const receipt of materialReceiptsList(document)) {
    if (receipt.warehouseId !== warehouseId) {
      continue;
    }
    const dayIndex = indexByDay.get(receipt.occurredOn);
    if (dayIndex === undefined) {
      continue;
    }
    for (const receiptLine of receipt.lines) {
      const material = materialById(document, receiptLine.materialId);
      if (!material || material.groupId !== groupId || material.warehouseId !== warehouseId) {
        continue;
      }
      const withVat = ratioRound(receiptLine.priceWithVat * receiptLine.quantity, QUANTITY_SCALE) ?? 0;
      result[dayIndex] = (result[dayIndex] ?? 0) + withVat;
    }
  }
  return result;
}

function payrollDayFacts(document: PrototypeDocument, days: readonly string[]): number[] {
  const result = emptyDayFacts(days.length);
  if (days.length === 0) {
    return result;
  }
  const indexByDay = dayIndexMap(days);
  for (const day of document.hrDayFacts) {
    const dayIndex = indexByDay.get(day.occurredOn);
    if (dayIndex === undefined) {
      continue;
    }
    for (const staffLine of day.staffLines) {
      result[dayIndex] = (result[dayIndex] ?? 0) + staffLine.amountExVat;
    }
  }
  return result;
}

function payrollTaxDayFacts(document: PrototypeDocument, days: readonly string[]): number[] {
  return days.map(
    (occurredOn) =>
      taxPaymentForDay(document, 'ndfl', occurredOn) +
      taxPaymentForDay(document, 'social', occurredOn) +
      taxPaymentForDay(document, 'injury', occurredOn),
  );
}

function outsourcingDayFactsWithVat(document: PrototypeDocument, month: string, days: readonly string[]): number[] {
  const result = emptyDayFacts(days.length);
  if (days.length === 0) {
    return result;
  }
  const indexByDay = dayIndexMap(days);
  const plan = hrMonthPlan(document, month);
  for (const day of document.hrDayFacts) {
    const dayIndex = indexByDay.get(day.occurredOn);
    if (dayIndex === undefined) {
      continue;
    }
    for (const outLine of day.outsourcingLines) {
      if (!isHrShopDepartmentId(outLine.departmentId)) {
        continue;
      }
      const amountExVat = outsourcingAmountExVat(outLine.hourThousandths, outLine.rateExVat);
      const vatPercent = outsourcingPlanVatPercent(plan, outLine.departmentId);
      result[dayIndex] = (result[dayIndex] ?? 0) + (amountWithVat(amountExVat, vatPercent) ?? amountExVat);
    }
  }
  return result;
}

function hireTransportDayFacts(document: PrototypeDocument, days: readonly string[]): number[] {
  const result = emptyDayFacts(days.length);
  if (days.length === 0) {
    return result;
  }
  const indexByDay = dayIndexMap(days);
  for (const day of document.transportHireDayFacts) {
    const dayIndex = indexByDay.get(day.occurredOn);
    if (dayIndex === undefined) {
      continue;
    }
    for (const hireLine of day.lines) {
      result[dayIndex] = (result[dayIndex] ?? 0) + hireLine.amountExVat;
    }
  }
  return result;
}

function ownFuelDayFacts(document: PrototypeDocument, month: string, days: readonly string[]): number[] {
  const result = emptyDayFacts(days.length);
  if (days.length === 0) {
    return result;
  }
  const indexByDay = dayIndexMap(days);
  const ownPlan = transportOwnPlan(document, month);
  for (const day of document.transportOwnDayFacts) {
    const dayIndex = indexByDay.get(day.occurredOn);
    if (dayIndex === undefined) {
      continue;
    }
    for (const vehicle of day.vehicles) {
      const liters =
        ownPlan?.vehicles.find((item) => item.vehicleId === vehicle.vehicleId)?.litersPer100KmThousandths ?? 0;
      const km = ownDayKmThousandths(document, day.occurredOn, vehicle.vehicleId);
      result[dayIndex] = (result[dayIndex] ?? 0) + ownDayFuelAmountExVat(km, liters, vehicle.fuelPriceExVat);
    }
  }
  return result;
}

function otherOpexDayFacts(document: PrototypeDocument, days: readonly string[], lineId: string): number[] {
  const result = emptyDayFacts(days.length);
  if (days.length === 0) {
    return result;
  }
  const indexByDay = dayIndexMap(days);
  for (const day of document.opexDayFacts ?? []) {
    const dayIndex = indexByDay.get(day.occurredOn);
    if (dayIndex === undefined) {
      continue;
    }
    for (const opexLine of day.lines) {
      if (opexLine.lineId === lineId) {
        result[dayIndex] = (result[dayIndex] ?? 0) + opexLine.amountExVat;
      }
    }
  }
  return result;
}

function opexLineDayFacts(
  document: PrototypeDocument,
  month: string,
  days: readonly string[],
  lineId: string,
): number[] {
  switch (lineId) {
    case 'payroll':
      return payrollDayFacts(document, days);
    case 'payrollTax':
      return payrollTaxDayFacts(document, days);
    case 'outsourcing':
      return outsourcingDayFactsWithVat(document, month, days);
    case 'hireTransport':
      return hireTransportDayFacts(document, days);
    case 'ownFuel':
      return ownFuelDayFacts(document, month, days);
    default:
      return otherOpexDayFacts(document, days, lineId);
  }
}

function taxKindDayFacts(
  document: PrototypeDocument,
  days: readonly string[],
  kind: 'vat' | 'profit' | 'property',
): number[] {
  return days.map((occurredOn) => taxPaymentForDay(document, kind, occurredOn));
}

function creditorFieldDayFacts(
  document: PrototypeDocument,
  days: readonly string[],
  creditorId: string,
  field: 'received' | 'repaid' | 'interest',
): number[] {
  const result = emptyDayFacts(days.length);
  if (days.length === 0) {
    return result;
  }
  const indexByDay = dayIndexMap(days);
  for (const day of creditResourceDaysList(document)) {
    const dayIndex = indexByDay.get(day.occurredOn);
    if (dayIndex === undefined) {
      continue;
    }
    const creditLine = day.lines.find((item) => item.creditorId === creditorId);
    if (!creditLine) {
      continue;
    }
    result[dayIndex] = (result[dayIndex] ?? 0) + creditLine[field];
  }
  return result;
}

/** Выручка с НДС по дням — сумма строк продаж за день. */
function revenueDayFacts(document: PrototypeDocument, days: readonly string[]): number[] {
  const result = emptyDayFacts(days.length);
  if (days.length === 0) {
    return result;
  }
  const indexByDay = dayIndexMap(days);
  for (const sale of workingSales(document)) {
    const dayIndex = indexByDay.get(sale.occurredOn);
    if (dayIndex === undefined) {
      continue;
    }
    for (const saleLine of sale.lines) {
      result[dayIndex] = (result[dayIndex] ?? 0) + saleLine.amountWithVat;
    }
  }
  return result;
}

function revenueSide(document: PrototypeDocument, month: string): CashflowMoneySide {
  const summary = monthSummary(document, month);
  return side(summary.headline.plan.revenueWithVat ?? 0, summary.headline.fact.revenueWithVat ?? 0);
}

function materialsBlock(
  document: PrototypeDocument,
  month: string,
  days: readonly string[],
  groupIds: readonly (typeof MATERIAL_GROUPS)[number]['id'][],
  id: string,
  name: string,
): CashflowLineView {
  const movement = materialMovementMonth(document, month);
  const zeros = emptyDayFacts(days.length);
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
          materialReceiptDayFacts(document, days, groupId, warehouse.warehouseId),
        ),
      );
    }
  }
  return line(id, name, 0, 0, zeros, children);
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

/** В ДДС суммы с НДС: аутсорс — сумма по цехам со ставкой каждого; остальные opex без НДС. */
function opexBlock(document: PrototypeDocument, month: string, days: readonly string[]): CashflowLineView {
  const opex = opexViewForMonth(document, month);
  const previousMonth = shiftMonth(month, -1);
  const previousOpex = previousMonth >= CHAIN_START ? opexViewForMonth(document, previousMonth) : null;
  const planOutsourcingMonth = previousMonth >= CHAIN_START ? previousMonth : month;
  const currentOutsourcing = outsourcingMonthAmountsWithVat(document, month);
  const planOutsourcing = outsourcingMonthAmountsWithVat(document, planOutsourcingMonth);
  const zeros = emptyDayFacts(days.length);

  const children = opex.groups.map((group) => {
    const previousGroup =
      group.code === '1' ? previousOpex?.groups.find((item) => item.code === group.code) : undefined;
    const lineChildren = group.lines.map((item) => {
      const dayFacts = opexLineDayFacts(document, month, days, item.id);
      if (item.id === 'outsourcing') {
        const plan = group.code === '1' ? planOutsourcing.planWithVat : currentOutsourcing.planWithVat;
        return line(
          `opex:${group.code}:${item.id}`,
          `${item.code} ${item.name}`,
          plan,
          currentOutsourcing.factWithVat,
          dayFacts,
        );
      }
      const previousLine = previousGroup?.lines.find((lineItem) => lineItem.id === item.id);
      const plan = group.code === '1' ? (previousLine?.planExVat ?? 0) : item.planExVat;
      return line(`opex:${group.code}:${item.id}`, `${item.code} ${item.name}`, plan, item.factExVat, dayFacts);
    });
    // Итог группы — сумма строк (с НДС у аутсорса), а не сырой ExVat из opex.
    return line(`opex-group:${group.code}`, group.name, 0, 0, zeros, lineChildren);
  });
  return line('opex', 'Операционные расходы', 0, 0, zeros, children);
}

function taxBlock(document: PrototypeDocument, month: string, days: readonly string[]): CashflowLineView {
  const summary = monthSummary(document, month);
  const planTax = Math.max(0, summary.headline.plan.profitTax ?? 0);
  const factTax = taxPaymentMonthTotal(document, 'profit', month);
  const propertyTax = propertyTaxForMonth(document, month);
  // Оплата или возврат: CashFlow!C141 «НДС», план E141 = TAX!D24, факт — taxPaymentDays kind vat.
  // Отрицательное — к возмещению и уменьшает расходы, остаток денег растёт.
  // Прибыль и имущество: план — свод / propertyTaxMonths; факт — дневные оплаты.
  const vat = vatReportMonthView(document, month).payable;
  const zeros = emptyDayFacts(days.length);
  return line('tax', 'Налоговые платежи (кроме зарплатных налогов)', 0, 0, zeros, [
    line('tax:vat', 'НДС', vat.plan, vat.fact, taxKindDayFacts(document, days, 'vat')),
    line('tax:profit', 'Налог на прибыль', planTax, factTax, taxKindDayFacts(document, days, 'profit')),
    line(
      'tax:property',
      'Налог на имущество',
      propertyTax.plan,
      propertyTax.fact,
      taxKindDayFacts(document, days, 'property'),
    ),
  ]);
}

function creditIncomeLines(
  document: PrototypeDocument,
  rows: readonly CreditCreditorRowView[],
  days: readonly string[],
): CashflowLineView[] {
  return rows.map((row) =>
    line(
      `credit-in:${row.creditorId}`,
      row.name,
      row.planReceived,
      row.factReceived,
      creditorFieldDayFacts(document, days, row.creditorId, 'received'),
    ),
  );
}

function creditExpenseLines(
  document: PrototypeDocument,
  rows: readonly CreditCreditorRowView[],
  days: readonly string[],
): CashflowLineView[] {
  return rows.flatMap((row) => [
    line(
      `credit-repay:${row.creditorId}`,
      `Погашение · ${row.name}`,
      row.planRepaid,
      row.factRepaid,
      creditorFieldDayFacts(document, days, row.creditorId, 'repaid'),
    ),
    line(
      `credit-interest:${row.creditorId}`,
      `Проценты · ${row.name}`,
      row.planInterest,
      row.factInterest,
      creditorFieldDayFacts(document, days, row.creditorId, 'interest'),
    ),
  ]);
}

function monthNetCashflow(document: PrototypeDocument, month: string): CashflowMoneySide {
  const view = buildCashflowBody(document, month, side(0, 0), false);
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
  for (const item of document.creditResourceDays ?? []) {
    consider(item.occurredOn.slice(0, 7));
  }
  for (const item of document.propertyTaxMonths ?? []) {
    consider(item.month);
  }
  for (const item of document.taxPaymentDays ?? []) {
    consider(item.occurredOn.slice(0, 7));
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
  withDays: boolean,
): Omit<CashflowMonthView, 'month' | 'opening' | 'openingDayFacts' | 'closing' | 'closingDayFacts' | 'days'> & {
  closing: CashflowMoneySide;
} {
  const days = withDays ? monthDates(month) : [];
  const zeros = emptyDayFacts(days.length);
  const credit = creditResourcesMonthView(document, month);
  const revenue = revenueSide(document, month);
  const incomeChildren = [
    line('revenue', 'Выручка от реализации', revenue.plan, revenue.fact, revenueDayFacts(document, days)),
    line('credit-in', 'Кредиты и займы', 0, 0, zeros, creditIncomeLines(document, credit.rows, days)),
  ];
  const expenseChildren = [
    materialsBlock(
      document,
      month,
      days,
      MATERIAL_GROUPS.map((group) => group.id),
      'materials',
      'Сырьё и упаковочные материалы',
    ),
    opexBlock(document, month, days),
    taxBlock(document, month, days),
    line('credit-out', 'Кредиты и займы', 0, 0, zeros, creditExpenseLines(document, credit.rows, days)),
  ];
  const income = line('income', 'Доходы', 0, 0, zeros, incomeChildren);
  const expense = line('expense', 'Расходы', 0, 0, zeros, expenseChildren);
  const closing = side(
    opening.plan + income.amounts.plan - expense.amounts.plan,
    opening.fact + income.amounts.fact - expense.amounts.fact,
  );
  return { income, expense, closing };
}

/**
 * Остатки факта по дням: на начало дня N и на конец дня N.
 * Конец дня = начало + доходы дня − расходы дня; начало следующего = этот конец.
 */
function balanceDayFacts(
  openingFact: number,
  incomeDays: readonly number[],
  expenseDays: readonly number[],
): { openingDayFacts: number[]; closingDayFacts: number[] } {
  const openingDayFacts: number[] = [];
  const closingDayFacts: number[] = [];
  let cursor = openingFact;
  for (let index = 0; index < incomeDays.length; index += 1) {
    openingDayFacts.push(cursor);
    cursor += (incomeDays[index] ?? 0) - (expenseDays[index] ?? 0);
    closingDayFacts.push(cursor);
  }
  return { openingDayFacts, closingDayFacts };
}

/** ДДС месяца: остаток, доходы, расходы и остаток на конец. Суммы — с НДС там, где источник с НДС. */
export function cashflowMonthView(document: PrototypeDocument, month: string): CashflowMonthView {
  const opening = openingCashBalance(document, month);
  const body = buildCashflowBody(document, month, opening, true);
  const balances = balanceDayFacts(opening.fact, body.income.dayFacts, body.expense.dayFacts);
  return {
    month,
    days: monthDates(month),
    opening,
    openingDayFacts: balances.openingDayFacts,
    income: body.income,
    expense: body.expense,
    closing: body.closing,
    closingDayFacts: balances.closingDayFacts,
  };
}
