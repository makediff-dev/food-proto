import {
  HR_DEPARTMENT_IDS,
  HR_SHOP_DEPARTMENT_IDS,
  type HrDayFact,
  type HrDayOutsourcingLine,
  type HrDayStaffLine,
  type HrDepartmentId,
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
import { ratioRound } from '@/domain/money';
import { isQuantityThousandths, QUANTITY_SCALE } from '@/domain/quantity';
import { daysInMonth, monthKeyFromDate } from '@/domain/sales-plan';

/** Ставка налога: сотые доли процента. 13 % → 1300, 0,2 % → 20. */
export const HR_TAX_RATE_SCALE = 100;

export const DEFAULT_NDFL_HUNDREDTHS = 13 * HR_TAX_RATE_SCALE;
export const DEFAULT_SOCIAL_HUNDREDTHS = 20 * HR_TAX_RATE_SCALE;
export const DEFAULT_INJURY_HUNDREDTHS = 2; // 0,2 %

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
  name: string;
  planHoursThousandths: number;
  planRateExVat: number;
  planAmountExVat: number;
  factHoursThousandths: number;
  factRateExVat: number;
  factAmountExVat: number;
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
  id: 'ndfl' | 'social' | 'injury';
  name: string;
  planBaseExVat: number;
  planRateHundredths: number;
  planAmountExVat: number;
  factBaseExVat: number;
  factRateHundredths: number;
  factAmountExVat: number;
}

export interface HrMonthView {
  month: string;
  days: number;
  departments: HrDepartmentView[];
  /** ВСЕГО: администрация + производство + РЦ, без аутсорсинга в численности/зарплате факта как на листе. */
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
    factEffectiveHundredths: number;
  };
}

export const HR_DEPARTMENT_LABELS: Record<HrDepartmentId, string> = {
  admin: 'Администрация',
  meat: 'Мясной цех',
  bakery: 'Пекарня',
  vegetables: 'Овощной цех',
  assembly: 'Цех сборки и упаковки',
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

/** Ставка факта на экране HR: сумма дневных выплат / часы. */
export function outsourcingFactRateExVat(amountExVat: number, hourThousandths: number): number {
  if (hourThousandths === 0) {
    return 0;
  }
  return ratioRound(amountExVat * QUANTITY_SCALE, hourThousandths) ?? 0;
}

/** Налог = база × ставка_сотых / 10_000. */
export function taxAmountExVat(baseExVat: number, rateHundredths: number): number {
  return ratioRound(baseExVat * rateHundredths, 100 * HR_TAX_RATE_SCALE) ?? 0;
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

export function hrTaxRatesOrDefault(document: PrototypeDocument, month: string): HrTaxRatesMonth {
  const row = document.hrTaxRates.find((item) => item.month === month);
  if (row) {
    return row;
  }
  return {
    id: `hr-tax:${month}`,
    month,
    planNdflHundredths: DEFAULT_NDFL_HUNDREDTHS,
    planSocialHundredths: DEFAULT_SOCIAL_HUNDREDTHS,
    planInjuryHundredths: DEFAULT_INJURY_HUNDREDTHS,
    factNdflHundredths: DEFAULT_NDFL_HUNDREDTHS,
    factSocialHundredths: DEFAULT_SOCIAL_HUNDREDTHS,
    factInjuryHundredths: DEFAULT_INJURY_HUNDREDTHS,
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

/**
 * Факт численности цеха: сумма людей по дням / дни месяца.
 * В книге `HR!G24 = сумма дневных колонок / Svod!C3`; колонка подписана «Кол-во, чел».
 * Результат — тысячные доли человека.
 */
export function factShopHeadcountThousandths(staffHeadcountThousandths: number, days: number): number {
  if (days <= 0) {
    return 0;
  }
  return ratioRound(staffHeadcountThousandths, days) ?? 0;
}

/**
 * Зарплата на человека по цеху: (ФОТ − аутсорсинг) / численность.
 * `HR!H46`. Численность — тысячные доли человека; зарплата в копейках.
 */
export function factShopSalaryExVat(payrollExVat: number, headcountThousandths: number): number {
  if (headcountThousandths === 0) {
    return 0;
  }
  return ratioRound(payrollExVat * QUANTITY_SCALE, headcountThousandths) ?? 0;
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

/**
 * Факт штатных подразделения из дневных строк: численность — среднее за месяц, ФОТ — сумма выплат.
 */
function staffFactFromDays(
  document: PrototypeDocument,
  departmentId: HrDepartmentId,
  positions: readonly HrPosition[],
  plan: HrMonthPlan | null,
  dayFacts: readonly HrDayFact[],
  days: number,
): { staff: HrStaffRowView[]; headcountThousandths: number; amountExVat: number } {
  let headcountThousandths = 0;
  let amountExVat = 0;
  const headcountByPosition = new Map<string, number>();
  const amountByPosition = new Map<string, number>();

  for (const day of dayFacts) {
    for (const line of day.staffLines) {
      const position = document.hrPositions.find((item) => item.id === line.positionId);
      if (!position || position.departmentId !== departmentId || position.kind !== 'staff') {
        continue;
      }
      headcountThousandths += line.headcountThousandths;
      amountExVat += line.amountExVat;
      headcountByPosition.set(
        line.positionId,
        (headcountByPosition.get(line.positionId) ?? 0) + line.headcountThousandths,
      );
      amountByPosition.set(line.positionId, (amountByPosition.get(line.positionId) ?? 0) + line.amountExVat);
    }
  }

  const staff: HrStaffRowView[] = positions.map((position) => {
    const planSide = staffPlanSide(staffPlanLine(plan, position.id));
    const people = headcountByPosition.get(position.id) ?? 0;
    const amount = amountByPosition.get(position.id) ?? 0;
    const factHeadcount = factShopHeadcountThousandths(people, days);
    const factSide: HrMoneySide = {
      headcount: factHeadcount,
      salaryExVat: factShopSalaryExVat(amount, factHeadcount),
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

  return { staff, headcountThousandths, amountExVat };
}

/**
 * Свод HR месяца: подразделения, аутсорсинг, налоги.
 * Формулы — лист `HR`. Факт администрации считается из дней так же, как факт цеха.
 */
export function hrMonthView(document: PrototypeDocument, month: string): HrMonthView {
  const days = daysInMonth(month);
  const plan = hrMonthPlan(document, month);
  const dayFacts = dayFactsInMonth(document, month);
  const taxRates = hrTaxRatesOrDefault(document, month);

  const departments: HrDepartmentView[] = HR_DEPARTMENT_IDS.map((departmentId) => {
    const positions = hrPositionsForDepartment(document, departmentId, { includeDeleted: true }).filter(
      (item) => item.kind === 'staff' && (item.deletedAt === null || staffPlanLine(plan, item.id) !== null),
    );
    const rolled = staffFactFromDays(document, departmentId, positions, plan, dayFacts, days);

    if (departmentId === 'admin') {
      const planSide = sumStaffSides(rolled.staff, 'plan');
      const factHeadcount = factShopHeadcountThousandths(rolled.headcountThousandths, days);
      const factSide: HrMoneySide = {
        headcount: factHeadcount,
        salaryExVat: factShopSalaryExVat(rolled.amountExVat, factHeadcount),
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

    const shopId = departmentId;
    const staff = rolled.staff;

    const outPlan = outsourcingPlanLine(plan, shopId);
    let outHours = 0;
    let factOutAmount = 0;
    for (const day of dayFacts) {
      for (const line of day.outsourcingLines) {
        if (line.departmentId === shopId) {
          outHours += line.hourThousandths;
          factOutAmount += line.amountExVat ?? 0;
        }
      }
    }
    const planOutHours = outPlan?.hourThousandths ?? 0;
    const planOutRate = outPlan?.rateExVat ?? 0;
    const planOutAmount = outsourcingAmountExVat(planOutHours, planOutRate);
    const factOutRate = outsourcingFactRateExVat(factOutAmount, outHours);
    const outsourcing: HrOutsourcingRowView = {
      kind: 'outsourcing',
      departmentId: shopId,
      name: 'Аутсорсинговый персонал',
      planHoursThousandths: planOutHours,
      planRateExVat: planOutRate,
      planAmountExVat: planOutAmount,
      factHoursThousandths: outHours,
      factRateExVat: factOutRate,
      factAmountExVat: factOutAmount,
      varianceHoursThousandths: outHours - planOutHours,
      varianceAmountExVat: factOutAmount - planOutAmount,
    };

    const planStaff = sumStaffSides(staff, 'plan');
    const planSide: HrMoneySide = {
      headcount: planStaff.headcount,
      salaryExVat: planStaff.salaryExVat,
      fotExVat: planStaff.fotExVat + planOutAmount,
    };

    const factHeadcount = factShopHeadcountThousandths(rolled.headcountThousandths, days);
    const factPayroll = rolled.amountExVat;
    const factFot = factPayroll + factOutAmount;
    const factSide: HrMoneySide = {
      headcount: factHeadcount,
      salaryExVat: factShopSalaryExVat(factPayroll, factHeadcount),
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

  const admin = departments.find((item) => item.departmentId === 'admin');
  const production = departments.filter(
    (item) =>
      item.departmentId === 'bakery' ||
      item.departmentId === 'meat' ||
      item.departmentId === 'vegetables' ||
      item.departmentId === 'assembly',
  );
  const dc = departments.find((item) => item.departmentId === 'dc');

  const planHeadcount =
    (admin?.plan.headcount ?? 0) +
    production.reduce((sum, item) => sum + item.plan.headcount, 0) +
    (dc?.plan.headcount ?? 0);
  const planPayroll =
    (admin?.planPayrollExVat ?? 0) +
    production.reduce((sum, item) => sum + item.planPayrollExVat, 0) +
    (dc?.planPayrollExVat ?? 0);
  const planOut =
    production.reduce((sum, item) => sum + (item.outsourcing?.planAmountExVat ?? 0), 0) +
    (dc?.outsourcing?.planAmountExVat ?? 0);
  const planFot = planPayroll + planOut;

  // Факт «Кол-во» всех подразделений — среднее по дням в тысячных долях человека.
  const factHeadcountThousandths =
    (admin?.fact.headcount ?? 0) +
    production.reduce((sum, item) => sum + item.fact.headcount, 0) +
    (dc?.fact.headcount ?? 0);
  const factPayroll =
    (admin?.factPayrollExVat ?? 0) +
    production.reduce((sum, item) => sum + item.factPayrollExVat, 0) +
    (dc?.factPayrollExVat ?? 0);
  const factOut =
    production.reduce((sum, item) => sum + (item.outsourcing?.factAmountExVat ?? 0), 0) +
    (dc?.outsourcing?.factAmountExVat ?? 0);
  const factFot = factPayroll + factOut;

  const planTotal: HrMoneySide = {
    headcount: planHeadcount,
    salaryExVat: averageSalary(planPayroll, planHeadcount),
    fotExVat: planFot,
  };
  const factTotal: HrMoneySide = {
    headcount: factHeadcountThousandths,
    salaryExVat: factShopSalaryExVat(factPayroll, factHeadcountThousandths),
    fotExVat: factFot,
  };

  // Налоги: база — зарплата на руки без аутсорсинга. `HR!86:88`.
  const planNdflBase = planPayroll;
  const planNdfl = taxAmountExVat(planNdflBase, taxRates.planNdflHundredths);
  const planSocialBase = planNdflBase + planNdfl;
  const planSocial = taxAmountExVat(planSocialBase, taxRates.planSocialHundredths);
  const planInjury = taxAmountExVat(planSocialBase, taxRates.planInjuryHundredths);

  const factNdflBase = factPayroll;
  const factNdfl = taxAmountExVat(factNdflBase, taxRates.factNdflHundredths);
  const factSocialBase = factNdflBase + factNdfl;
  const factSocial = taxAmountExVat(factSocialBase, taxRates.factSocialHundredths);
  const factInjury = taxAmountExVat(factSocialBase, taxRates.factInjuryHundredths);

  const taxes: HrTaxLineView[] = [
    {
      id: 'ndfl',
      name: 'НДФЛ',
      planBaseExVat: planNdflBase,
      planRateHundredths: taxRates.planNdflHundredths,
      planAmountExVat: planNdfl,
      factBaseExVat: factNdflBase,
      factRateHundredths: taxRates.factNdflHundredths,
      factAmountExVat: factNdfl,
    },
    {
      id: 'social',
      name: 'Соцстрах',
      planBaseExVat: planSocialBase,
      planRateHundredths: taxRates.planSocialHundredths,
      planAmountExVat: planSocial,
      factBaseExVat: factSocialBase,
      factRateHundredths: taxRates.factSocialHundredths,
      factAmountExVat: factSocial,
    },
    {
      id: 'injury',
      name: 'Травматизм',
      planBaseExVat: planSocialBase,
      planRateHundredths: taxRates.planInjuryHundredths,
      planAmountExVat: planInjury,
      factBaseExVat: factSocialBase,
      factRateHundredths: taxRates.factInjuryHundredths,
      factAmountExVat: factInjury,
    },
  ];

  const planTaxTotal = planNdfl + planSocial + planInjury;
  const factTaxTotal = factNdfl + factSocial + factInjury;

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
      factEffectiveHundredths:
        factPayroll === 0 ? 0 : (ratioRound(factTaxTotal * 100 * HR_TAX_RATE_SCALE, factPayroll) ?? 0),
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
  return null;
}

export function setHrOutsourcingPlan(
  document: PrototypeDocument,
  month: string,
  departmentId: HrShopDepartmentId,
  hourThousandths: number,
  rateExVat: number,
): PrototypeDocument {
  if (setHrOutsourcingPlanRejection(document, month, departmentId, hourThousandths, rateExVat)) {
    return document;
  }
  const existing = hrMonthPlan(document, month);
  const nextLine: HrMonthPlanOutsourcingLine = {
    id: `hr-plan-out:${month}:${departmentId}`,
    departmentId,
    hourThousandths,
    rateExVat,
  };
  if (!existing) {
    return {
      ...document,
      hrMonthPlans: [
        ...document.hrMonthPlans,
        { id: `hr-plan:${month}`, month, staffLines: [], outsourcingLines: [nextLine] },
      ],
    };
  }
  const without = existing.outsourcingLines.filter((line) => line.departmentId !== departmentId);
  const outsourcingLines = hourThousandths === 0 && rateExVat === 0 ? without : [...without, nextLine];
  return {
    ...document,
    hrMonthPlans: document.hrMonthPlans.map((item) => (item.month === month ? { ...item, outsourcingLines } : item)),
  };
}

export function setHrDayStaffRejection(
  document: PrototypeDocument,
  occurredOn: string,
  positionId: string,
  headcountThousandths: number,
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
  if (!isHeadcountThousandths(headcountThousandths)) {
    return 'headcount';
  }
  if (!isMoney(amountExVat)) {
    return 'amount';
  }
  return null;
}

export function setHrDayStaff(
  document: PrototypeDocument,
  occurredOn: string,
  positionId: string,
  headcountThousandths: number,
  amountExVat: number,
): PrototypeDocument {
  if (setHrDayStaffRejection(document, occurredOn, positionId, headcountThousandths, amountExVat)) {
    return document;
  }
  const existing = document.hrDayFacts.find((item) => item.occurredOn === occurredOn);
  const nextLine: HrDayStaffLine = {
    id: `hr-day-staff:${occurredOn}:${positionId}`,
    positionId,
    headcountThousandths,
    amountExVat,
  };
  if (!existing) {
    if (headcountThousandths === 0 && amountExVat === 0) {
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
  const staffLines = headcountThousandths === 0 && amountExVat === 0 ? without : [...without, nextLine];
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
  amountExVat: number,
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
  if (!isMoney(amountExVat)) {
    return 'amount';
  }
  return null;
}

export function setHrDayOutsourcing(
  document: PrototypeDocument,
  occurredOn: string,
  departmentId: HrShopDepartmentId,
  hourThousandths: number,
  amountExVat: number,
): PrototypeDocument {
  if (setHrDayOutsourcingRejection(document, occurredOn, departmentId, hourThousandths, amountExVat)) {
    return document;
  }
  const existing = document.hrDayFacts.find((item) => item.occurredOn === occurredOn);
  const nextLine: HrDayOutsourcingLine = {
    id: `hr-day-out:${occurredOn}:${departmentId}`,
    departmentId,
    hourThousandths,
    amountExVat,
  };
  if (!existing) {
    if (hourThousandths === 0 && amountExVat === 0) {
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
  const outsourcingLines = hourThousandths === 0 && amountExVat === 0 ? without : [...without, nextLine];
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
  | 'factNdflHundredths'
  | 'factSocialHundredths'
  | 'factInjuryHundredths';

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

export function hrDayStaffValue(
  document: PrototypeDocument,
  occurredOn: string,
  positionId: string,
): { headcountThousandths: number; amountExVat: number } {
  const day = document.hrDayFacts.find((item) => item.occurredOn === occurredOn);
  const line = day?.staffLines.find((item) => item.positionId === positionId);
  return {
    headcountThousandths: line?.headcountThousandths ?? 0,
    amountExVat: line?.amountExVat ?? 0,
  };
}

export function hrDayOutsourcingValue(
  document: PrototypeDocument,
  occurredOn: string,
  departmentId: HrShopDepartmentId,
): { hourThousandths: number; amountExVat: number } {
  const day = document.hrDayFacts.find((item) => item.occurredOn === occurredOn);
  const line = day?.outsourcingLines.find((item) => item.departmentId === departmentId);
  return {
    hourThousandths: line?.hourThousandths ?? 0,
    amountExVat: line?.amountExVat ?? 0,
  };
}

/** Для подписей дат ввода факта. */
export function hrFactDayKey(occurredOn: string): string {
  return monthKeyFromDate(new Date(`${occurredOn}T12:00:00`));
}

export { HR_SHOP_DEPARTMENT_IDS };
