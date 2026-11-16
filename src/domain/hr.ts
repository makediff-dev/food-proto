import {
  HR_DEPARTMENT_IDS,
  HR_SHOP_DEPARTMENT_IDS,
  type HrDayFact,
  type HrDayOutsourcingLine,
  type HrDayStaffLine,
  type HrDepartmentId,
  type HrMonthFact,
  type HrMonthFactStaffLine,
  type HrMonthPlan,
  type HrMonthPlanOutsourcingLine,
  type HrMonthPlanStaffLine,
  type HrPosition,
  type HrShopDepartmentId,
  type HrTaxRatesMonth,
  isDeletionMark,
  isHrShopDepartmentId,
  isMonthKey,
  isOccurredOn,
  type PrototypeDocument,
} from '@/domain/document';
import { amountWithVat, ratioRound } from '@/domain/money';
import { isQuantityThousandths, QUANTITY_SCALE } from '@/domain/quantity';
import { daysInMonth, monthKeyFromDate } from '@/domain/sales-plan';
import { taxPaymentMonthTotal } from '@/domain/tax-payment';

/** Ставка налога: сотые доли процента. 13 % → 1300, 0,2 % → 20. */
export const HR_TAX_RATE_SCALE = 100;

export const DEFAULT_NDFL_HUNDREDTHS = 13 * HR_TAX_RATE_SCALE;
export const DEFAULT_SOCIAL_HUNDREDTHS = 20 * HR_TAX_RATE_SCALE;
export const DEFAULT_INJURY_HUNDREDTHS = 20; // 0,2 %
/** НДС аутсорса по умолчанию — как у товаров мока, 20 %. */
export const DEFAULT_OUTSOURCING_VAT_PERCENT = 20;
/** @deprecated Сотые доли; новые строки хранят целое `vatPercent`. */
export const DEFAULT_OUTSOURCING_VAT_HUNDREDTHS = DEFAULT_OUTSOURCING_VAT_PERCENT * HR_TAX_RATE_SCALE;

const MAX_HEADCOUNT = 10_000;
const MAX_HOUR_THOUSANDTHS = 1_000_000_000;
const MAX_MONEY = 100_000_000_000;

export type HrFieldRejection =
  | 'missing'
  | 'month'
  | 'day'
  | 'name'
  | 'department'
  | 'headcount'
  | 'salary'
  | 'hours'
  | 'amount'
  | 'rate'
  | 'vat'
  | 'taxRate'
  | 'archived'
  | 'kind';

export interface HrMoneySide {
  headcount: number;
  /** Средняя зарплата на человека / эффективная, копейки. */
  salaryExVat: number;
  fotExVat: number;
}

export interface HrStaffRowView {
  kind: 'staff';
  positionId: string;
  name: string;
  deleted: boolean;
  plan: HrMoneySide;
  fact: HrMoneySide;
  variance: HrMoneySide;
}

export interface HrOutsourcingRowView {
  kind: 'outsourcing';
  departmentId: HrShopDepartmentId;
  /** Подпись строки в своде — «Аутсорсинговый персонал»; в отдельной таблице — имя цеха. */
  name: string;
  departmentName: string;
  /** Ставка НДС цеха из плана месяца, целое 0–100. */
  vatPercent: number;
  planHoursThousandths: number;
  planRateExVat: number;
  planRateWithVat: number;
  planAmountExVat: number;
  planAmountWithVat: number;
  factHoursThousandths: number;
  factRateExVat: number;
  factRateWithVat: number;
  factAmountExVat: number;
  factAmountWithVat: number;
  varianceHoursThousandths: number;
  varianceAmountExVat: number;
}

export interface HrDepartmentView {
  departmentId: HrDepartmentId;
  name: string;
  hasOutsourcing: boolean;
  staff: HrStaffRowView[];
  outsourcing: HrOutsourcingRowView | null;
  plan: HrMoneySide;
  fact: HrMoneySide;
  /** Факт без аутсорсинга — база «зарплата на руки». */
  factPayrollExVat: number;
  planPayrollExVat: number;
  variance: HrMoneySide;
}

export interface HrTaxLineView {
  id: 'ndfl' | 'social' | 'injury' | 'outsourcing-vat';
  name: string;
  planBaseExVat: number;
  planRateHundredths: number;
  planAmountExVat: number;
  /** НДФЛ / соцстрах / травматизм — оплаты ДДС; НДС аутсорса — расчёт. */
  factAmountExVat: number;
}

export interface HrMonthView {
  month: string;
  days: number;
  departments: HrDepartmentView[];
  /** ВСЕГО: план — чел/зарплата/ФОТ; факт — только ФОТ (выплаты + аутсорс). */
  total: {
    plan: HrMoneySide;
    fact: HrMoneySide;
    planPayrollExVat: number;
    factPayrollExVat: number;
    outsourcingPlanExVat: number;
    outsourcingFactExVat: number;
    variance: HrMoneySide;
  };
  taxes: HrTaxLineView[];
  taxTotal: {
    planAmountExVat: number;
    factAmountExVat: number;
    planEffectiveHundredths: number;
  };
}

export const HR_DEPARTMENT_LABELS: Record<HrDepartmentId, string> = {
  admin: 'Администрация',
  sales: 'Отдел продаж',
  'meat-1': 'Мясной цех 1',
  'meat-2': 'Мясной цех 2',
  'bakery-1': 'Пекарня 1',
  'bakery-2': 'Пекарня 2',
  'vegetables-1': 'Овощной цех 1',
  'vegetables-2': 'Овощной цех 2',
  'soup-1': 'Цех варки супов и каш 1',
  'soup-2': 'Цех варки супов и каш 2',
  'sides-1': 'Цех гарниров 1',
  'sides-2': 'Цех гарниров 2',
  'assembly-1': 'Цех сборки и упаковки 1',
  'assembly-2': 'Цех сборки и упаковки 2',
  dc: 'Цех готовой продукции',
};

function emptySide(): HrMoneySide {
  return { headcount: 0, salaryExVat: 0, fotExVat: 0 };
}

function varianceSide(fact: HrMoneySide, plan: HrMoneySide): HrMoneySide {
  return {
    headcount: fact.headcount - plan.headcount,
    salaryExVat: fact.salaryExVat - plan.salaryExVat,
    fotExVat: fact.fotExVat - plan.fotExVat,
  };
}

function averageSalary(fotExVat: number, headcount: number): number {
  if (headcount === 0) {
    return 0;
  }
  return ratioRound(fotExVat, headcount) ?? 0;
}

/** План аутсорсинга: сумма = часы × ставка / 1000. `HR` план: часы × ставка. */
export function outsourcingAmountExVat(hourThousandths: number, rateExVat: number): number {
  return ratioRound(hourThousandths * rateExVat, QUANTITY_SCALE) ?? 0;
}

/** Ставка факта на экране HR: сумма (часы × ставка) / часы. */
export function outsourcingFactRateExVat(amountExVat: number, hourThousandths: number): number {
  if (hourThousandths === 0) {
    return 0;
  }
  return ratioRound(amountExVat * QUANTITY_SCALE, hourThousandths) ?? 0;
}

function outsourcingMoneyWithVat(amountExVatValue: number, vatPercent: number): number {
  return amountWithVat(amountExVatValue, vatPercent) ?? amountExVatValue;
}

function isOutsourcingVatPercent(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 100;
}

export function outsourcingPlanVatPercent(plan: HrMonthPlan | null, departmentId: HrShopDepartmentId): number {
  const line = outsourcingPlanLine(plan, departmentId);
  return line && isOutsourcingVatPercent(line.vatPercent) ? line.vatPercent : DEFAULT_OUTSOURCING_VAT_PERCENT;
}

/** Суммы аутсорса с НДС по цехам — для ДДС. */
export function outsourcingMonthAmountsWithVat(
  document: PrototypeDocument,
  month: string,
): { planWithVat: number; factWithVat: number } {
  const view = hrMonthView(document, month);
  let planWithVat = 0;
  let factWithVat = 0;
  for (const department of view.departments) {
    const row = department.outsourcing;
    if (!row) {
      continue;
    }
    planWithVat += row.planAmountWithVat;
    factWithVat += row.factAmountWithVat;
  }
  return { planWithVat, factWithVat };
}

/** Налог = база × ставка_сотых / 10_000. Соцстрах и травматизм. */
export function taxAmountExVat(baseExVat: number, rateHundredths: number): number {
  return ratioRound(baseExVat * rateHundredths, 100 * HR_TAX_RATE_SCALE) ?? 0;
}

/**
 * НДФЛ внутри начисления: на руки и налог вместе — 100 % базы.
 * База = на руки / (1 − ставка), сумма = база − на руки.
 * При 13 % на руки — 87 % базы. Ставка от 100 % не разворачивается.
 */
export function ndflIncludedExVat(
  netExVat: number,
  rateHundredths: number,
): { baseExVat: number; amountExVat: number } {
  const scale = 100 * HR_TAX_RATE_SCALE;
  const keptHundredths = scale - rateHundredths;
  if (keptHundredths <= 0) {
    return { baseExVat: netExVat, amountExVat: 0 };
  }
  const baseExVat = ratioRound(netExVat * scale, keptHundredths) ?? netExVat;
  return { baseExVat, amountExVat: baseExVat - netExVat };
}

export function activeHrPositions(document: PrototypeDocument): HrPosition[] {
  return document.hrPositions.filter((item) => item.deletedAt === null);
}

export function hrPositionsForDepartment(
  document: PrototypeDocument,
  departmentId: HrDepartmentId,
  options?: { includeDeleted?: boolean },
): HrPosition[] {
  return document.hrPositions.filter(
    (item) => item.departmentId === departmentId && (options?.includeDeleted || item.deletedAt === null),
  );
}

export function hrMonthPlan(document: PrototypeDocument, month: string): HrMonthPlan | null {
  return document.hrMonthPlans.find((item) => item.month === month) ?? null;
}

export function hrMonthFact(document: PrototypeDocument, month: string): HrMonthFact | null {
  return document.hrMonthFacts.find((item) => item.month === month) ?? null;
}

export function hrTaxRatesOrDefault(document: PrototypeDocument, month: string): HrTaxRatesMonth {
  const row = document.hrTaxRates.find((item) => item.month === month);
  if (row) {
    return {
      ...row,
      planOutsourcingVatHundredths: row.planOutsourcingVatHundredths ?? DEFAULT_OUTSOURCING_VAT_HUNDREDTHS,
    };
  }
  return {
    id: `hr-tax:${month}`,
    month,
    planNdflHundredths: DEFAULT_NDFL_HUNDREDTHS,
    planSocialHundredths: DEFAULT_SOCIAL_HUNDREDTHS,
    planInjuryHundredths: DEFAULT_INJURY_HUNDREDTHS,
    planOutsourcingVatHundredths: DEFAULT_OUTSOURCING_VAT_HUNDREDTHS,
  };
}

function staffPlanLine(plan: HrMonthPlan | null, positionId: string): HrMonthPlanStaffLine | null {
  return plan?.staffLines.find((line) => line.positionId === positionId) ?? null;
}

function outsourcingPlanLine(
  plan: HrMonthPlan | null,
  departmentId: HrShopDepartmentId,
): HrMonthPlanOutsourcingLine | null {
  return plan?.outsourcingLines.find((line) => line.departmentId === departmentId) ?? null;
}

function dayFactsInMonth(document: PrototypeDocument, month: string): HrDayFact[] {
  return document.hrDayFacts.filter((item) => item.occurredOn.startsWith(`${month}-`));
}

function staffPlanSide(line: HrMonthPlanStaffLine | null): HrMoneySide {
  if (!line) {
    return emptySide();
  }
  const fotExVat = line.headcount * line.salaryExVat;
  return {
    headcount: line.headcount,
    salaryExVat: line.salaryExVat,
    fotExVat,
  };
}

function sumStaffSides(rows: readonly HrStaffRowView[], side: 'plan' | 'fact'): HrMoneySide {
  let headcount = 0;
  let fotExVat = 0;
  for (const row of rows) {
    headcount += row[side].headcount;
    fotExVat += row[side].fotExVat;
  }
  return {
    headcount,
    salaryExVat: averageSalary(fotExVat, headcount),
    fotExVat,
  };
}

/** Факт штатных из дневных выплат: ФОТ — сумма, численность и зарплата факта не считаются. */
function staffFactFromDays(
  document: PrototypeDocument,
  departmentId: HrDepartmentId,
  positions: readonly HrPosition[],
  plan: HrMonthPlan | null,
  dayFacts: readonly HrDayFact[],
): { staff: HrStaffRowView[]; amountExVat: number } {
  let amountExVat = 0;
  const amountByPosition = new Map<string, number>();

  for (const day of dayFacts) {
    for (const line of day.staffLines) {
      const position = document.hrPositions.find((item) => item.id === line.positionId);
      if (!position || position.departmentId !== departmentId || position.kind !== 'staff') {
        continue;
      }
      amountExVat += line.amountExVat;
      amountByPosition.set(line.positionId, (amountByPosition.get(line.positionId) ?? 0) + line.amountExVat);
    }
  }

  const staff: HrStaffRowView[] = positions.map((position) => {
    const planSide = staffPlanSide(staffPlanLine(plan, position.id));
    const amount = amountByPosition.get(position.id) ?? 0;
    const factSide: HrMoneySide = {
      headcount: 0,
      salaryExVat: 0,
      fotExVat: amount,
    };
    return {
      kind: 'staff',
      positionId: position.id,
      name: position.name,
      deleted: position.deletedAt !== null,
      plan: planSide,
      fact: factSide,
      variance: varianceSide(factSide, planSide),
    };
  });

  return { staff, amountExVat };
}

function positionHasDayFact(dayFacts: readonly HrDayFact[], positionId: string): boolean {
  return dayFacts.some((day) =>
    day.staffLines.some((line) => line.positionId === positionId && line.amountExVat !== 0),
  );
}

/**
 * Свод HR месяца: подразделения, аутсорсинг, налоги.
 * Формулы — лист `HR`. План — чел × зарплата; факт ФОТ штатных — сумма дневных выплат;
 * у цехов и в итоге к факту ФОТ добавляется аутсорс.
 */
export function hrMonthView(document: PrototypeDocument, month: string): HrMonthView {
  const days = daysInMonth(month);
  const plan = hrMonthPlan(document, month);
  const dayFacts = dayFactsInMonth(document, month);
  const taxRates = hrTaxRatesOrDefault(document, month);

  const departments: HrDepartmentView[] = HR_DEPARTMENT_IDS.map((departmentId) => {
    // Администрация и отдел продаж — без аутсорсинга; факт ФОТ — сумма дневных выплат.
    if (!isHrShopDepartmentId(departmentId)) {
      const positions = hrPositionsForDepartment(document, departmentId, { includeDeleted: true }).filter(
        (item) =>
          item.kind === 'staff' &&
          (item.deletedAt === null || staffPlanLine(plan, item.id) !== null || positionHasDayFact(dayFacts, item.id)),
      );
      const rolled = staffFactFromDays(document, departmentId, positions, plan, dayFacts);
      const planSide = sumStaffSides(rolled.staff, 'plan');
      const factSide: HrMoneySide = {
        headcount: 0,
        salaryExVat: 0,
        fotExVat: rolled.amountExVat,
      };
      return {
        departmentId,
        name: HR_DEPARTMENT_LABELS[departmentId],
        hasOutsourcing: false,
        staff: rolled.staff,
        outsourcing: null,
        plan: planSide,
        fact: factSide,
        planPayrollExVat: planSide.fotExVat,
        factPayrollExVat: rolled.amountExVat,
        variance: varianceSide(factSide, planSide),
      };
    }

    const positions = hrPositionsForDepartment(document, departmentId, { includeDeleted: true }).filter(
      (item) =>
        item.kind === 'staff' &&
        (item.deletedAt === null ||
          staffPlanLine(plan, item.id) !== null ||
          dayFacts.some((day) => day.staffLines.some((line) => line.positionId === item.id))),
    );
    const rolled = staffFactFromDays(document, departmentId, positions, plan, dayFacts);

    const shopId = departmentId;
    const staff = rolled.staff;

    const outPlan = outsourcingPlanLine(plan, shopId);
    let outHours = 0;
    let factOutAmount = 0;
    for (const day of dayFacts) {
      for (const line of day.outsourcingLines) {
        if (line.departmentId === shopId) {
          outHours += line.hourThousandths;
          factOutAmount += outsourcingAmountExVat(line.hourThousandths, line.rateExVat);
        }
      }
    }
    const vatPercent = outsourcingPlanVatPercent(plan, shopId);
    const planOutHours = outPlan?.hourThousandths ?? 0;
    const planOutRate = outPlan?.rateExVat ?? 0;
    const planOutAmount = outsourcingAmountExVat(planOutHours, planOutRate);
    const factOutRate = outsourcingFactRateExVat(factOutAmount, outHours);
    const planOutAmountWithVat = outsourcingMoneyWithVat(planOutAmount, vatPercent);
    const factOutAmountWithVat = outsourcingMoneyWithVat(factOutAmount, vatPercent);
    const outsourcing: HrOutsourcingRowView = {
      kind: 'outsourcing',
      departmentId: shopId,
      name: 'Аутсорсинговый персонал',
      departmentName: HR_DEPARTMENT_LABELS[shopId],
      vatPercent,
      planHoursThousandths: planOutHours,
      planRateExVat: planOutRate,
      planRateWithVat: outsourcingMoneyWithVat(planOutRate, vatPercent),
      planAmountExVat: planOutAmount,
      planAmountWithVat: planOutAmountWithVat,
      factHoursThousandths: outHours,
      factRateExVat: factOutRate,
      factRateWithVat: outsourcingMoneyWithVat(factOutRate, vatPercent),
      factAmountExVat: factOutAmount,
      factAmountWithVat: factOutAmountWithVat,
      varianceHoursThousandths: outHours - planOutHours,
      varianceAmountExVat: factOutAmount - planOutAmount,
    };

    const planStaff = sumStaffSides(staff, 'plan');
    const planSide: HrMoneySide = {
      headcount: planStaff.headcount,
      salaryExVat: planStaff.salaryExVat,
      fotExVat: planStaff.fotExVat + planOutAmount,
    };

    const factPayroll = rolled.amountExVat;
    const factFot = factPayroll + factOutAmount;
    const factSide: HrMoneySide = {
      headcount: 0,
      salaryExVat: 0,
      fotExVat: factFot,
    };

    return {
      departmentId,
      name: HR_DEPARTMENT_LABELS[departmentId],
      hasOutsourcing: true,
      staff,
      outsourcing,
      plan: planSide,
      fact: factSide,
      planPayrollExVat: planStaff.fotExVat,
      factPayrollExVat: factPayroll,
      variance: varianceSide(factSide, planSide),
    };
  });

  const planHeadcount = departments.reduce((sum, item) => sum + item.plan.headcount, 0);
  const planPayroll = departments.reduce((sum, item) => sum + item.planPayrollExVat, 0);
  const planOut = departments.reduce((sum, item) => sum + (item.outsourcing?.planAmountExVat ?? 0), 0);
  const planFot = planPayroll + planOut;

  const factPayroll = departments.reduce((sum, item) => sum + item.factPayrollExVat, 0);
  const factOut = departments.reduce((sum, item) => sum + (item.outsourcing?.factAmountExVat ?? 0), 0);
  const factFot = factPayroll + factOut;

  const planTotal: HrMoneySide = {
    headcount: planHeadcount,
    salaryExVat: averageSalary(planPayroll, planHeadcount),
    fotExVat: planFot,
  };
  const factTotal: HrMoneySide = {
    headcount: 0,
    salaryExVat: 0,
    fotExVat: factFot,
  };

  // НДФЛ внутри начисления, без аутсорсинга: в строке база — на руки.
  // Соцстрах и травматизм — от «на руки + НДФЛ». `HR!86:88`. План — расчёт; факт — оплаты ДДС.
  const planNdfl = ndflIncludedExVat(planPayroll, taxRates.planNdflHundredths);
  const planSocialBase = planNdfl.baseExVat;
  const planSocial = taxAmountExVat(planSocialBase, taxRates.planSocialHundredths);
  const planInjury = taxAmountExVat(planSocialBase, taxRates.planInjuryHundredths);
  const factNdflPayment = taxPaymentMonthTotal(document, 'ndfl', month);
  const factSocialPayment = taxPaymentMonthTotal(document, 'social', month);
  const factInjuryPayment = taxPaymentMonthTotal(document, 'injury', month);

  // НДС аутсорса — сумма по цехам: база без НДС × ставка цеха / 100.
  const planOutsourcingVat = departments.reduce(
    (sum, item) => sum + (item.outsourcing ? item.outsourcing.planAmountWithVat - item.outsourcing.planAmountExVat : 0),
    0,
  );
  const factOutsourcingVat = departments.reduce(
    (sum, item) => sum + (item.outsourcing ? item.outsourcing.factAmountWithVat - item.outsourcing.factAmountExVat : 0),
    0,
  );
  const planOutsourcingVatRate =
    planOut === 0 ? 0 : (ratioRound(planOutsourcingVat * 100 * HR_TAX_RATE_SCALE, planOut) ?? 0);

  const taxes: HrTaxLineView[] = [
    {
      id: 'ndfl',
      name: 'НДФЛ',
      planBaseExVat: planPayroll,
      planRateHundredths: taxRates.planNdflHundredths,
      planAmountExVat: planNdfl.amountExVat,
      factAmountExVat: factNdflPayment,
    },
    {
      id: 'social',
      name: 'Соцстрах',
      planBaseExVat: planSocialBase,
      planRateHundredths: taxRates.planSocialHundredths,
      planAmountExVat: planSocial,
      factAmountExVat: factSocialPayment,
    },
    {
      id: 'injury',
      name: 'Травматизм',
      planBaseExVat: planSocialBase,
      planRateHundredths: taxRates.planInjuryHundredths,
      planAmountExVat: planInjury,
      factAmountExVat: factInjuryPayment,
    },
    {
      id: 'outsourcing-vat',
      name: 'НДС аутсорса',
      planBaseExVat: planOut,
      planRateHundredths: planOutsourcingVatRate,
      planAmountExVat: planOutsourcingVat,
      factAmountExVat: factOutsourcingVat,
    },
  ];

  // ВСЕГО зарплатных налогов — без НДС аутсорса: он только для ДДС.
  const planTaxTotal = planNdfl.amountExVat + planSocial + planInjury;
  const factTaxTotal = factNdflPayment + factSocialPayment + factInjuryPayment;

  return {
    month,
    days,
    departments,
    total: {
      plan: planTotal,
      fact: factTotal,
      planPayrollExVat: planPayroll,
      factPayrollExVat: factPayroll,
      outsourcingPlanExVat: planOut,
      outsourcingFactExVat: factOut,
      variance: varianceSide(factTotal, planTotal),
    },
    taxes,
    taxTotal: {
      planAmountExVat: planTaxTotal,
      factAmountExVat: factTaxTotal,
      planEffectiveHundredths:
        planPayroll === 0 ? 0 : (ratioRound(planTaxTotal * 100 * HR_TAX_RATE_SCALE, planPayroll) ?? 0),
    },
  };
}

function isMoney(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= MAX_MONEY;
}

function isHeadcount(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= MAX_HEADCOUNT;
}

function isHeadcountThousandths(value: number): boolean {
  return isQuantityThousandths(value, false) && value <= MAX_HEADCOUNT * QUANTITY_SCALE;
}

function isHours(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= MAX_HOUR_THOUSANDTHS && isQuantityThousandths(value, false);
}

function isRateHundredths(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 100 * HR_TAX_RATE_SCALE * 10;
}

export function addHrPositionRejection(
  document: PrototypeDocument,
  departmentId: HrDepartmentId,
  name: string,
): HrFieldRejection | null {
  if (!isHrDepartmentIdSafe(departmentId)) {
    return 'department';
  }
  const trimmed = name.trim();
  if (!trimmed) {
    return 'name';
  }
  const taken = activeHrPositions(document).some(
    (item) => item.departmentId === departmentId && item.kind === 'staff' && item.name === trimmed,
  );
  if (taken) {
    return 'name';
  }
  return null;
}

function isHrDepartmentIdSafe(value: HrDepartmentId): boolean {
  return (HR_DEPARTMENT_IDS as readonly string[]).includes(value);
}

export function addHrPosition(document: PrototypeDocument, position: HrPosition): PrototypeDocument {
  if (addHrPositionRejection(document, position.departmentId, position.name)) {
    return document;
  }
  return {
    ...document,
    hrPositions: [
      ...document.hrPositions,
      {
        ...position,
        name: position.name.trim(),
        kind: 'staff',
        deletedAt: null,
      },
    ],
  };
}

export function deleteHrPosition(
  document: PrototypeDocument,
  positionId: string,
  deletedAt: string,
): PrototypeDocument {
  if (!isDeletionMark(deletedAt)) {
    return document;
  }
  return {
    ...document,
    hrPositions: document.hrPositions.map((item) => {
      if (item.id !== positionId || item.kind !== 'staff' || item.deletedAt !== null) {
        return item;
      }
      return { ...item, deletedAt };
    }),
  };
}

export function restoreHrPosition(document: PrototypeDocument, positionId: string): PrototypeDocument {
  const position = document.hrPositions.find((item) => item.id === positionId);
  if (!position || position.deletedAt === null || position.kind !== 'staff') {
    return document;
  }
  if (addHrPositionRejection(document, position.departmentId, position.name)) {
    return document;
  }
  return {
    ...document,
    hrPositions: document.hrPositions.map((item) => (item.id === positionId ? { ...item, deletedAt: null } : item)),
  };
}

export function setHrStaffPlanRejection(
  document: PrototypeDocument,
  month: string,
  positionId: string,
  headcount: number,
  salaryExVat: number,
): HrFieldRejection | null {
  if (!isMonthKey(month)) {
    return 'month';
  }
  const position = document.hrPositions.find((item) => item.id === positionId);
  if (position?.kind !== 'staff') {
    return 'missing';
  }
  if (position.deletedAt !== null) {
    return 'archived';
  }
  if (!isHeadcount(headcount)) {
    return 'headcount';
  }
  if (!isMoney(salaryExVat)) {
    return 'salary';
  }
  return null;
}

export function setHrStaffPlan(
  document: PrototypeDocument,
  month: string,
  positionId: string,
  headcount: number,
  salaryExVat: number,
): PrototypeDocument {
  if (setHrStaffPlanRejection(document, month, positionId, headcount, salaryExVat)) {
    return document;
  }
  const existing = hrMonthPlan(document, month);
  const lineId = `hr-plan-staff:${month}:${positionId}`;
  const nextLine: HrMonthPlanStaffLine = {
    id: lineId,
    positionId,
    headcount,
    salaryExVat,
  };
  if (!existing) {
    return {
      ...document,
      hrMonthPlans: [
        ...document.hrMonthPlans,
        { id: `hr-plan:${month}`, month, staffLines: [nextLine], outsourcingLines: [] },
      ],
    };
  }
  const without = existing.staffLines.filter((line) => line.positionId !== positionId);
  const staffLines = headcount === 0 && salaryExVat === 0 ? without : [...without, nextLine];
  return {
    ...document,
    hrMonthPlans: document.hrMonthPlans.map((item) => (item.month === month ? { ...item, staffLines } : item)),
  };
}

export function setHrOutsourcingPlanRejection(
  _document: PrototypeDocument,
  month: string,
  departmentId: HrShopDepartmentId,
  hourThousandths: number,
  rateExVat: number,
  vatPercent: number,
): HrFieldRejection | null {
  if (!isMonthKey(month)) {
    return 'month';
  }
  if (!isHrShopDepartmentId(departmentId)) {
    return 'department';
  }
  if (!isHours(hourThousandths)) {
    return 'hours';
  }
  if (!isMoney(rateExVat)) {
    return 'rate';
  }
  if (!isOutsourcingVatPercent(vatPercent)) {
    return 'vat';
  }
  return null;
}

export function setHrOutsourcingPlan(
  document: PrototypeDocument,
  month: string,
  departmentId: HrShopDepartmentId,
  hourThousandths: number,
  rateExVat: number,
  vatPercent: number,
): PrototypeDocument {
  if (setHrOutsourcingPlanRejection(document, month, departmentId, hourThousandths, rateExVat, vatPercent)) {
    return document;
  }
  const existing = hrMonthPlan(document, month);
  const nextLine: HrMonthPlanOutsourcingLine = {
    id: `hr-plan-out:${month}:${departmentId}`,
    departmentId,
    hourThousandths,
    rateExVat,
    vatPercent,
  };
  const isDefault = hourThousandths === 0 && rateExVat === 0 && vatPercent === DEFAULT_OUTSOURCING_VAT_PERCENT;
  if (!existing) {
    if (isDefault) {
      return document;
    }
    return {
      ...document,
      hrMonthPlans: [
        ...document.hrMonthPlans,
        { id: `hr-plan:${month}`, month, staffLines: [], outsourcingLines: [nextLine] },
      ],
    };
  }
  const without = existing.outsourcingLines.filter((line) => line.departmentId !== departmentId);
  const outsourcingLines = isDefault ? without : [...without, nextLine];
  return {
    ...document,
    hrMonthPlans: document.hrMonthPlans.map((item) => (item.month === month ? { ...item, outsourcingLines } : item)),
  };
}

export function setHrMonthStaffRejection(
  document: PrototypeDocument,
  month: string,
  positionId: string,
  headcountThousandths: number,
): HrFieldRejection | null {
  if (!isMonthKey(month)) {
    return 'month';
  }
  const position = document.hrPositions.find((item) => item.id === positionId);
  if (position?.kind !== 'staff') {
    return 'missing';
  }
  if (isHrShopDepartmentId(position.departmentId)) {
    return 'department';
  }
  if (position.deletedAt !== null) {
    return 'archived';
  }
  if (!isHeadcountThousandths(headcountThousandths)) {
    return 'headcount';
  }
  return null;
}

export function setHrMonthStaff(
  document: PrototypeDocument,
  month: string,
  positionId: string,
  headcountThousandths: number,
): PrototypeDocument {
  if (setHrMonthStaffRejection(document, month, positionId, headcountThousandths)) {
    return document;
  }
  const existing = hrMonthFact(document, month);
  const nextLine: HrMonthFactStaffLine = {
    id: `hr-month-staff:${month}:${positionId}`,
    positionId,
    headcountThousandths,
  };
  if (!existing) {
    if (headcountThousandths === 0) {
      return document;
    }
    return {
      ...document,
      hrMonthFacts: [...document.hrMonthFacts, { id: `hr-month-fact:${month}`, month, staffLines: [nextLine] }],
    };
  }
  const without = existing.staffLines.filter((line) => line.positionId !== positionId);
  const staffLines = headcountThousandths === 0 ? without : [...without, nextLine];
  if (staffLines.length === 0) {
    return {
      ...document,
      hrMonthFacts: document.hrMonthFacts.filter((item) => item.month !== month),
    };
  }
  return {
    ...document,
    hrMonthFacts: document.hrMonthFacts.map((item) => (item.month === month ? { ...item, staffLines } : item)),
  };
}

export function setHrDayStaffRejection(
  document: PrototypeDocument,
  occurredOn: string,
  positionId: string,
  amountExVat: number,
): HrFieldRejection | null {
  if (!isOccurredOn(occurredOn)) {
    return 'day';
  }
  const position = document.hrPositions.find((item) => item.id === positionId);
  if (position?.kind !== 'staff') {
    return 'missing';
  }
  if (position.deletedAt !== null) {
    return 'archived';
  }
  if (!isMoney(amountExVat)) {
    return 'amount';
  }
  return null;
}

/** Дневная выплата штатной должности. Численность в строке всегда 0. */
export function setHrDayStaff(
  document: PrototypeDocument,
  occurredOn: string,
  positionId: string,
  amountExVat: number,
): PrototypeDocument {
  if (setHrDayStaffRejection(document, occurredOn, positionId, amountExVat)) {
    return document;
  }
  const existing = document.hrDayFacts.find((item) => item.occurredOn === occurredOn);
  const nextLine: HrDayStaffLine = {
    id: `hr-day-staff:${occurredOn}:${positionId}`,
    positionId,
    headcountThousandths: 0,
    amountExVat,
  };
  if (!existing) {
    if (amountExVat === 0) {
      return document;
    }
    return {
      ...document,
      hrDayFacts: [
        ...document.hrDayFacts,
        { id: `hr-day:${occurredOn}`, occurredOn, staffLines: [nextLine], outsourcingLines: [] },
      ],
    };
  }
  const without = existing.staffLines.filter((line) => line.positionId !== positionId);
  const staffLines = amountExVat === 0 ? without : [...without, nextLine];
  if (staffLines.length === 0 && existing.outsourcingLines.length === 0) {
    return {
      ...document,
      hrDayFacts: document.hrDayFacts.filter((item) => item.occurredOn !== occurredOn),
    };
  }
  return {
    ...document,
    hrDayFacts: document.hrDayFacts.map((item) => (item.occurredOn === occurredOn ? { ...item, staffLines } : item)),
  };
}

export function setHrDayOutsourcingRejection(
  _document: PrototypeDocument,
  occurredOn: string,
  departmentId: HrShopDepartmentId,
  hourThousandths: number,
  rateExVat: number,
): HrFieldRejection | null {
  if (!isOccurredOn(occurredOn)) {
    return 'day';
  }
  if (!isHrShopDepartmentId(departmentId)) {
    return 'department';
  }
  if (!isHours(hourThousandths)) {
    return 'hours';
  }
  if (!isMoney(rateExVat)) {
    return 'rate';
  }
  return null;
}

export function setHrDayOutsourcing(
  document: PrototypeDocument,
  occurredOn: string,
  departmentId: HrShopDepartmentId,
  hourThousandths: number,
  rateExVat: number,
): PrototypeDocument {
  if (setHrDayOutsourcingRejection(document, occurredOn, departmentId, hourThousandths, rateExVat)) {
    return document;
  }
  const existing = document.hrDayFacts.find((item) => item.occurredOn === occurredOn);
  const nextLine: HrDayOutsourcingLine = {
    id: `hr-day-out:${occurredOn}:${departmentId}`,
    departmentId,
    hourThousandths,
    rateExVat,
  };
  if (!existing) {
    if (hourThousandths === 0 && rateExVat === 0) {
      return document;
    }
    return {
      ...document,
      hrDayFacts: [
        ...document.hrDayFacts,
        { id: `hr-day:${occurredOn}`, occurredOn, staffLines: [], outsourcingLines: [nextLine] },
      ],
    };
  }
  const without = existing.outsourcingLines.filter((line) => line.departmentId !== departmentId);
  const outsourcingLines = hourThousandths === 0 && rateExVat === 0 ? without : [...without, nextLine];
  if (existing.staffLines.length === 0 && outsourcingLines.length === 0) {
    return {
      ...document,
      hrDayFacts: document.hrDayFacts.filter((item) => item.occurredOn !== occurredOn),
    };
  }
  return {
    ...document,
    hrDayFacts: document.hrDayFacts.map((item) =>
      item.occurredOn === occurredOn ? { ...item, outsourcingLines } : item,
    ),
  };
}

export type HrTaxRateField =
  | 'planNdflHundredths'
  | 'planSocialHundredths'
  | 'planInjuryHundredths'
  | 'planOutsourcingVatHundredths';

export function setHrTaxRateRejection(
  _document: PrototypeDocument,
  month: string,
  _field: HrTaxRateField,
  rateHundredths: number,
): HrFieldRejection | null {
  if (!isMonthKey(month)) {
    return 'month';
  }
  if (!isRateHundredths(rateHundredths)) {
    return 'taxRate';
  }
  return null;
}

export function setHrTaxRate(
  document: PrototypeDocument,
  month: string,
  field: HrTaxRateField,
  rateHundredths: number,
): PrototypeDocument {
  if (setHrTaxRateRejection(document, month, field, rateHundredths)) {
    return document;
  }
  const current = hrTaxRatesOrDefault(document, month);
  const next: HrTaxRatesMonth = { ...current, [field]: rateHundredths };
  const without = document.hrTaxRates.filter((item) => item.month !== month);
  return { ...document, hrTaxRates: [...without, next] };
}

export function hrDayStaffValue(document: PrototypeDocument, occurredOn: string, positionId: string): number {
  const day = document.hrDayFacts.find((item) => item.occurredOn === occurredOn);
  const line = day?.staffLines.find((item) => item.positionId === positionId);
  return line?.amountExVat ?? 0;
}

export function hrDayOutsourcingValue(
  document: PrototypeDocument,
  occurredOn: string,
  departmentId: HrShopDepartmentId,
): { hourThousandths: number; rateExVat: number } {
  const day = document.hrDayFacts.find((item) => item.occurredOn === occurredOn);
  const line = day?.outsourcingLines.find((item) => item.departmentId === departmentId);
  return {
    hourThousandths: line?.hourThousandths ?? 0,
    rateExVat: line?.rateExVat ?? 0,
  };
}

/** Для подписей дат ввода факта. */
export function hrFactDayKey(occurredOn: string): string {
  return monthKeyFromDate(new Date(`${occurredOn}T12:00:00`));
}

export { HR_SHOP_DEPARTMENT_IDS };
